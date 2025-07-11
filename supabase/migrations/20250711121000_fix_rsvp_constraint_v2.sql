-- Fix RSVP constraint to match the onConflict specification in the code
-- The code uses onConflict: 'user_id,event_id' which expects specific column names

-- First, check and remove the existing constraint if it exists
ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_user_id_event_id_key;
ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_user_id_event_id_unique;

-- Remove any existing duplicate RSVPs (keep the most recent one)
DELETE FROM public.rsvps 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, event_id) id
    FROM public.rsvps
    ORDER BY user_id, event_id, updated_at DESC
);

-- Add the correct unique constraint that matches the original schema
-- This should match what was in the original migration
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_user_id_event_id_unique 
UNIQUE (user_id, event_id);

-- Also ensure the table structure matches expectations
-- Check if the columns exist with correct types
DO $$
BEGIN
    -- Verify columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rsvps' AND column_name = 'user_id') THEN
        RAISE EXCEPTION 'Column user_id does not exist in rsvps table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rsvps' AND column_name = 'event_id') THEN
        RAISE EXCEPTION 'Column event_id does not exist in rsvps table';
    END IF;
END
$$;

-- Create performance index
CREATE INDEX IF NOT EXISTS idx_rsvps_user_event_lookup 
ON public.rsvps (user_id, event_id);