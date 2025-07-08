-- Add additional constraints and RSVP automation
-- Add unique constraints to prevent duplicate data

-- Add unique constraints to prevent duplicate likes (drop first if exists)
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE public.photo_likes DROP CONSTRAINT IF EXISTS photo_likes_unique_user_photo;
        ALTER TABLE public.message_likes DROP CONSTRAINT IF EXISTS message_likes_unique_user_message;
        ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_unique_user_event;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Some unique constraints did not exist: %', SQLERRM;
    END;
END $$;

-- Now add the unique constraints
ALTER TABLE public.photo_likes 
ADD CONSTRAINT photo_likes_unique_user_photo 
UNIQUE (user_id, photo_id);

ALTER TABLE public.message_likes 
ADD CONSTRAINT message_likes_unique_user_message 
UNIQUE (user_id, message_id);

-- Add unique constraint for RSVPs to prevent duplicate responses
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_unique_user_event 
UNIQUE (user_id, event_id);

-- Add validation constraints
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_status_check;
        ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_guest_count_check;
        ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_content_check;
        ALTER TABLE public.photos DROP CONSTRAINT IF EXISTS photos_file_url_check;
        ALTER TABLE public.photo_comments DROP CONSTRAINT IF EXISTS photo_comments_content_check;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Some check constraints did not exist: %', SQLERRM;
    END;
END $$;

-- Add constraint to ensure RSVP status is valid
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_status_check 
CHECK (status IN ('attending', 'not_attending', 'maybe'));

-- Add constraint to ensure guest count is positive
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_guest_count_check 
CHECK (guest_count > 0);

-- Add constraint to ensure messages are not empty
ALTER TABLE public.messages 
ADD CONSTRAINT messages_content_check 
CHECK (LENGTH(TRIM(content)) > 0);

-- Add constraint to ensure photos have valid URLs
ALTER TABLE public.photos 
ADD CONSTRAINT photos_file_url_check 
CHECK (file_url IS NOT NULL AND LENGTH(TRIM(file_url)) > 0);

-- Add constraint to ensure photo comments are not empty
ALTER TABLE public.photo_comments 
ADD CONSTRAINT photo_comments_content_check 
CHECK (LENGTH(TRIM(content)) > 0);

-- Create a function to automatically update the guest list based on RSVP submissions
CREATE OR REPLACE FUNCTION public.update_guest_from_rsvp()
RETURNS TRIGGER AS $$
BEGIN
  -- When an RSVP is submitted, update or create guest record
  INSERT INTO public.guests (
    guest_names,
    guest_count,
    rsvp_status,
    rsvp_count,
    mobile,
    location,
    category,
    notes
  )
  SELECT 
    COALESCE(
      CASE 
        WHEN p.first_name IS NOT NULL AND p.last_name IS NOT NULL 
        THEN p.first_name || ' ' || p.last_name
        WHEN p.display_name IS NOT NULL AND p.display_name != ''
        THEN p.display_name
        ELSE p.email
      END
    ) as guest_names,
    NEW.guest_count,
    NEW.status,
    NEW.guest_count,
    p.mobile,
    p.address,
    CASE 
      WHEN p.has_plus_one THEN 'couple'
      ELSE 'individual'
    END as category,
    CASE 
      WHEN NEW.dietary_restrictions IS NOT NULL AND NEW.dietary_restrictions != ''
      THEN 'Dietary: ' || NEW.dietary_restrictions || 
           CASE 
             WHEN NEW.message IS NOT NULL AND NEW.message != ''
             THEN ' | Message: ' || NEW.message
             ELSE ''
           END
      WHEN NEW.message IS NOT NULL AND NEW.message != ''
      THEN 'Message: ' || NEW.message
      ELSE NULL
    END as notes
  FROM public.profiles p
  WHERE p.user_id = NEW.user_id
  ON CONFLICT (guest_names) DO UPDATE SET
    guest_count = EXCLUDED.guest_count,
    rsvp_status = EXCLUDED.rsvp_status,
    rsvp_count = EXCLUDED.rsvp_count,
    mobile = EXCLUDED.mobile,
    location = EXCLUDED.location,
    category = EXCLUDED.category,
    notes = EXCLUDED.notes,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and create new one
DROP TRIGGER IF EXISTS update_guest_from_rsvp_trigger ON public.rsvps;

-- Create trigger to update guest list when RSVP is submitted
CREATE TRIGGER update_guest_from_rsvp_trigger
  AFTER INSERT OR UPDATE ON public.rsvps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_guest_from_rsvp();