-- Simple completion of backend setup
-- Focus on essential fixes and configurations

-- Set replica identity for existing realtime tables
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.photos REPLICA IDENTITY FULL;
ALTER TABLE public.rsvps REPLICA IDENTITY FULL;
ALTER TABLE public.photo_likes REPLICA IDENTITY FULL;
ALTER TABLE public.message_likes REPLICA IDENTITY FULL;

-- Add photos to realtime if not already there
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'photos'
    ) THEN
        ALTER publication supabase_realtime ADD TABLE public.photos;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Table might already be in publication
        NULL;
END
$$;

-- Add rsvps to realtime if not already there
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'rsvps'
    ) THEN
        ALTER publication supabase_realtime ADD TABLE public.rsvps;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Table might already be in publication
        NULL;
END
$$;

-- Add photo_likes to realtime if not already there
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'photo_likes'
    ) THEN
        ALTER publication supabase_realtime ADD TABLE public.photo_likes;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Table might already be in publication
        NULL;
END
$$;

-- Add message_likes to realtime if not already there
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'message_likes'
    ) THEN
        ALTER publication supabase_realtime ADD TABLE public.message_likes;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Table might already be in publication
        NULL;
END
$$;