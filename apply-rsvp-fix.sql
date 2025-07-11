-- Manual RSVP Fix Script
-- Run this in your Supabase SQL editor if the migration doesn't apply automatically

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

-- Step 3: Standardize status values
UPDATE public.rsvps 
SET status = 'declined' 
WHERE status = 'not_attending';

-- Step 4: Add proper constraints
ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_status_check;
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_status_check 
CHECK (status IN ('attending', 'declined', 'pending', 'maybe'));

ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_user_id_event_id_unique 
UNIQUE (user_id, event_id);

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rsvps_user_event_lookup 
ON public.rsvps (user_id, event_id);

CREATE INDEX IF NOT EXISTS idx_rsvps_status 
ON public.rsvps (status);

-- Step 6: Add safe upsert function
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

-- Step 7: Grant permissions
GRANT EXECUTE ON FUNCTION public.safe_upsert_rsvp(UUID, UUID, TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) 
TO authenticated, anon;

-- Step 8: Verify the fix
SELECT 
    'RSVP Fix Applied Successfully' as status,
    COUNT(*) as total_rsvps,
    COUNT(DISTINCT user_id || ',' || event_id) as unique_user_event_pairs
FROM public.rsvps;