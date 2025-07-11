-- Fix RSVP unique constraint for upsert operations
-- This ensures the ON CONFLICT clause in RSVP upserts works correctly

-- First, remove any existing duplicate RSVPs (keep the most recent one)
DELETE FROM public.rsvps 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, event_id) id
    FROM public.rsvps
    ORDER BY user_id, event_id, updated_at DESC
);

-- Add the unique constraint if it doesn't exist
DO $$ 
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'rsvps_user_id_event_id_key' 
        AND table_name = 'rsvps'
    ) THEN
        -- Add the unique constraint
        ALTER TABLE public.rsvps 
        ADD CONSTRAINT rsvps_user_id_event_id_key 
        UNIQUE (user_id, event_id);
    END IF;
END
$$;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_rsvps_user_event 
ON public.rsvps (user_id, event_id);