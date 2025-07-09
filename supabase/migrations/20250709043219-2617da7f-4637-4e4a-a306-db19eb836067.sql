
-- Add foreign key constraints for social media tables to reference profiles
ALTER TABLE public.social_posts 
ADD CONSTRAINT social_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.post_reactions 
ADD CONSTRAINT post_reactions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.post_comments 
ADD CONSTRAINT post_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
