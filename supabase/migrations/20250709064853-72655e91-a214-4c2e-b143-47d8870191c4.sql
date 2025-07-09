-- Fix the foreign key constraint for social_posts to reference profiles properly
-- First, check if the foreign key already exists and drop it if needed
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'social_posts_user_id_fkey' 
        AND table_name = 'social_posts'
    ) THEN
        ALTER TABLE public.social_posts DROP CONSTRAINT social_posts_user_id_fkey;
    END IF;
END $$;

-- Add the correct foreign key constraint for social_posts
ALTER TABLE public.social_posts 
ADD CONSTRAINT social_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Also fix post_reactions foreign key if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'post_reactions_user_id_fkey' 
        AND table_name = 'post_reactions'
    ) THEN
        ALTER TABLE public.post_reactions 
        ADD CONSTRAINT post_reactions_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
    END IF;
END $$;

-- Also fix post_comments foreign key if it doesn't exist  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'post_comments_user_id_fkey' 
        AND table_name = 'post_comments'
    ) THEN
        ALTER TABLE public.post_comments 
        ADD CONSTRAINT post_comments_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
    END IF;
END $$;