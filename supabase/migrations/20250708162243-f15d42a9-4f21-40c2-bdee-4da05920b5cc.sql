-- Fix database relationships and constraints - Safe migration
-- Drop and recreate constraints that may already exist

-- First, let's drop existing constraints if they exist (ignore errors)
DO $$ 
BEGIN
    -- Drop existing constraints if they exist
    BEGIN
        ALTER TABLE public.photos DROP CONSTRAINT IF EXISTS photos_user_id_fkey;
        ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_user_id_fkey;
        ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_user_id_fkey;
        ALTER TABLE public.rsvps DROP CONSTRAINT IF EXISTS rsvps_event_id_fkey;
        ALTER TABLE public.photo_likes DROP CONSTRAINT IF EXISTS photo_likes_user_id_fkey;
        ALTER TABLE public.photo_likes DROP CONSTRAINT IF EXISTS photo_likes_photo_id_fkey;
        ALTER TABLE public.photo_comments DROP CONSTRAINT IF EXISTS photo_comments_user_id_fkey;
        ALTER TABLE public.photo_comments DROP CONSTRAINT IF EXISTS photo_comments_photo_id_fkey;
        ALTER TABLE public.message_likes DROP CONSTRAINT IF EXISTS message_likes_user_id_fkey;
        ALTER TABLE public.message_likes DROP CONSTRAINT IF EXISTS message_likes_message_id_fkey;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Some constraints did not exist or could not be dropped: %', SQLERRM;
    END;
END $$;

-- Now add the foreign key constraints
ALTER TABLE public.photos 
ADD CONSTRAINT photos_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.rsvps 
ADD CONSTRAINT rsvps_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES public.wedding_events(id) ON DELETE CASCADE;

ALTER TABLE public.photo_likes 
ADD CONSTRAINT photo_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.photo_likes 
ADD CONSTRAINT photo_likes_photo_id_fkey 
FOREIGN KEY (photo_id) REFERENCES public.photos(id) ON DELETE CASCADE;

ALTER TABLE public.photo_comments 
ADD CONSTRAINT photo_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.photo_comments 
ADD CONSTRAINT photo_comments_photo_id_fkey 
FOREIGN KEY (photo_id) REFERENCES public.photos(id) ON DELETE CASCADE;

ALTER TABLE public.message_likes 
ADD CONSTRAINT message_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.message_likes 
ADD CONSTRAINT message_likes_message_id_fkey 
FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;

-- Create indexes for better performance
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