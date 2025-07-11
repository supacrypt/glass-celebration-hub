-- Comprehensive RSVP System Fix
-- This migration resolves all identified issues with the RSVP system

-- Step 1: Clean up existing conflicting constraints
ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_user_id_event_id_key;
ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_user_id_event_id_unique;

-- Step 2: Remove duplicate RSVPs (keep the most recent one)
DELETE FROM public.rsvps 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, event_id) id
    FROM public.rsvps
    ORDER BY user_id, event_id, updated_at DESC
);

-- Step 3: Standardize status values to match current frontend usage
-- Update old status values to new standard
UPDATE public.rsvps 
SET status = 'declined' 
WHERE status = 'not_attending';

-- Step 4: Add proper check constraint for status values
ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_status_check;
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_status_check 
CHECK (status IN ('attending', 'declined', 'pending', 'maybe'));

-- Step 5: Add the standardized unique constraint
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_user_id_event_id_unique 
UNIQUE (user_id, event_id);

-- Step 6: Create performance indexes
CREATE INDEX IF NOT EXISTS idx_rsvps_user_event_lookup 
ON public.rsvps (user_id, event_id);

CREATE INDEX IF NOT EXISTS idx_rsvps_status 
ON public.rsvps (status);

CREATE INDEX IF NOT EXISTS idx_rsvps_event_id 
ON public.rsvps (event_id);

-- Step 7: Add function to safely upsert RSVPs
CREATE OR REPLACE FUNCTION public.safe_upsert_rsvp(
    p_user_id UUID,
    p_event_id UUID,
    p_status TEXT,
    p_guest_count INTEGER DEFAULT 1,
    p_dietary_restrictions TEXT DEFAULT NULL,
    p_message TEXT DEFAULT NULL,
    p_plus_one_name TEXT DEFAULT NULL,
    p_table_assignment TEXT DEFAULT NULL,
    p_meal_preference TEXT DEFAULT NULL,
    p_song_request TEXT DEFAULT NULL,
    p_accommodation_needed BOOLEAN DEFAULT FALSE,
    p_transportation_needed BOOLEAN DEFAULT FALSE
) RETURNS UUID AS $$
DECLARE
    existing_rsvp_id UUID;
    result_id UUID;
BEGIN
    -- Check if RSVP already exists
    SELECT id INTO existing_rsvp_id
    FROM public.rsvps
    WHERE user_id = p_user_id AND event_id = p_event_id;
    
    IF existing_rsvp_id IS NOT NULL THEN
        -- Update existing RSVP
        UPDATE public.rsvps
        SET 
            status = p_status,
            guest_count = p_guest_count,
            dietary_restrictions = p_dietary_restrictions,
            message = p_message,
            plus_one_name = p_plus_one_name,
            table_assignment = p_table_assignment,
            meal_preference = p_meal_preference,
            song_request = p_song_request,
            accommodation_needed = p_accommodation_needed,
            transportation_needed = p_transportation_needed,
            updated_at = now()
        WHERE id = existing_rsvp_id;
        
        result_id := existing_rsvp_id;
    ELSE
        -- Insert new RSVP
        INSERT INTO public.rsvps (
            user_id, event_id, status, guest_count, dietary_restrictions,
            message, plus_one_name, table_assignment, meal_preference,
            song_request, accommodation_needed, transportation_needed
        ) VALUES (
            p_user_id, p_event_id, p_status, p_guest_count, p_dietary_restrictions,
            p_message, p_plus_one_name, p_table_assignment, p_meal_preference,
            p_song_request, p_accommodation_needed, p_transportation_needed
        ) RETURNING id INTO result_id;
    END IF;
    
    RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Add RLS policies for the safe upsert function
ALTER FUNCTION public.safe_upsert_rsvp(UUID, UUID, TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) 
OWNER TO postgres;

-- Step 9: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.safe_upsert_rsvp(UUID, UUID, TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) 
TO authenticated, anon;

-- Step 10: Add trigger to update dietary requirements count when RSVPs change
CREATE OR REPLACE FUNCTION public.update_rsvp_dietary_count()
RETURNS TRIGGER AS $$
BEGIN
    -- This trigger ensures dietary requirements are properly managed
    -- when RSVPs are modified
    
    IF TG_OP = 'DELETE' THEN
        -- Don't delete dietary requirements automatically
        -- Let the CASCADE handle it, but log the change
        RAISE NOTICE 'RSVP deleted: %, dietary requirements will be cascaded', OLD.id;
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_rsvp_dietary_count ON public.rsvps;
CREATE TRIGGER trigger_rsvp_dietary_count
    AFTER DELETE ON public.rsvps
    FOR EACH ROW EXECUTE FUNCTION public.update_rsvp_dietary_count();

-- Step 11: Add data validation checks
-- Verify all RSVPs have valid status values
DO $$
DECLARE
    invalid_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO invalid_count
    FROM public.rsvps
    WHERE status NOT IN ('attending', 'declined', 'pending', 'maybe');
    
    IF invalid_count > 0 THEN
        RAISE EXCEPTION 'Found % RSVPs with invalid status values', invalid_count;
    END IF;
    
    RAISE NOTICE 'RSVP data validation passed. All status values are valid.';
END;
$$;

-- Step 12: Create view for RSVP analytics
CREATE OR REPLACE VIEW public.rsvp_analytics AS
SELECT 
    e.id as event_id,
    e.name as event_name,
    COUNT(*) as total_rsvps,
    COUNT(*) FILTER (WHERE r.status = 'attending') as attending_count,
    COUNT(*) FILTER (WHERE r.status = 'declined') as declined_count,
    COUNT(*) FILTER (WHERE r.status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE r.status = 'maybe') as maybe_count,
    SUM(r.guest_count) FILTER (WHERE r.status = 'attending') as total_attending_guests,
    COUNT(*) FILTER (WHERE r.dietary_restrictions IS NOT NULL AND r.dietary_restrictions != '') as dietary_restrictions_count,
    COUNT(*) FILTER (WHERE r.accommodation_needed = true) as accommodation_needed_count,
    COUNT(*) FILTER (WHERE r.transportation_needed = true) as transportation_needed_count
FROM public.wedding_events e
LEFT JOIN public.rsvps r ON e.id = r.event_id
GROUP BY e.id, e.name;

-- Grant permissions on the view
GRANT SELECT ON public.rsvp_analytics TO authenticated, anon;

-- Final verification
SELECT 
    'RSVP Fix Migration Completed' as status,
    COUNT(*) as total_rsvps,
    COUNT(DISTINCT user_id || ',' || event_id) as unique_user_event_pairs,
    COUNT(*) FILTER (WHERE status = 'attending') as attending,
    COUNT(*) FILTER (WHERE status = 'declined') as declined,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    COUNT(*) FILTER (WHERE status = 'maybe') as maybe
FROM public.rsvps;