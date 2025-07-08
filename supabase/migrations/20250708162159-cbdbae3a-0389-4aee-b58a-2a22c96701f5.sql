-- Add foreign key constraints to ensure proper table relationships
-- This will fix the messaging system error and ensure data integrity

-- First, let's add foreign key constraints for the profiles table references
-- We need to ensure user_id columns properly reference profiles table

-- Add foreign key for photos table
ALTER TABLE public.photos 
ADD CONSTRAINT photos_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key for messages table
ALTER TABLE public.messages 
ADD CONSTRAINT messages_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key for rsvps table
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key for rsvps event relationship
ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES public.wedding_events(id) ON DELETE CASCADE;

-- Add foreign key for photo_likes table
ALTER TABLE public.photo_likes 
ADD CONSTRAINT photo_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.photo_likes 
ADD CONSTRAINT photo_likes_photo_id_fkey 
FOREIGN KEY (photo_id) REFERENCES public.photos(id) ON DELETE CASCADE;

-- Add foreign key for photo_comments table
ALTER TABLE public.photo_comments 
ADD CONSTRAINT photo_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.photo_comments 
ADD CONSTRAINT photo_comments_photo_id_fkey 
FOREIGN KEY (photo_id) REFERENCES public.photos(id) ON DELETE CASCADE;

-- Add foreign key for message_likes table
ALTER TABLE public.message_likes 
ADD CONSTRAINT message_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.message_likes 
ADD CONSTRAINT message_likes_message_id_fkey 
FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;

-- Create indexes for better performance on foreign key columns
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON public.photos(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_user_id ON public.rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON public.rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_user_id ON public.photo_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_photo_id ON public.photo_likes(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_comments_user_id ON public.photo_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_comments_photo_id ON public.photo_comments(photo_id);
CREATE INDEX IF NOT EXISTS idx_message_likes_user_id ON public.message_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_message_likes_message_id ON public.message_likes(message_id);

-- Add unique constraints to prevent duplicate likes
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
    COALESCE(p.first_name || ' ' || p.last_name, p.display_name, p.email) as guest_names,
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
      WHEN NEW.dietary_restrictions IS NOT NULL THEN 'Dietary: ' || NEW.dietary_restrictions
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
    notes = EXCLUDED.notes;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update guest list when RSVP is submitted
CREATE TRIGGER update_guest_from_rsvp_trigger
  AFTER INSERT OR UPDATE ON public.rsvps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_guest_from_rsvp();