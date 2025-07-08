-- Phase 1: Enhanced Social Database Schema (Fixed)
-- Create comprehensive social tables with RLS policies

-- 1. Create reaction type enum
CREATE TYPE reaction_type AS ENUM ('like', 'love', 'laugh', 'wow', 'sad', 'angry');

-- 2. Enhanced social posts table
CREATE TABLE public.social_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    media_url TEXT,
    media_type TEXT, -- 'image', 'video', null
    media_thumbnail TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Post reactions table (6 emoji reactions)
CREATE TABLE public.post_reactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type reaction_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(post_id, user_id) -- One reaction per user per post
);

-- 4. Post comments table (2-level threading, 280 char max)
CREATE TABLE public.post_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT comment_length_check CHECK (LENGTH(content) <= 280)
);

-- 5. Stories table (24h expiration)
CREATE TABLE public.stories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL, -- 'image', 'video'
    media_thumbnail TEXT,
    duration INTEGER DEFAULT 15, -- seconds
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

-- 6. Direct chats table
CREATE TABLE public.direct_chats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    is_group BOOLEAN NOT NULL DEFAULT false,
    title TEXT, -- For group chats
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Chat members table (max 25 for groups)
CREATE TABLE public.chat_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES public.direct_chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(chat_id, user_id)
);

-- 8. Chat messages table
CREATE TABLE public.chat_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES public.direct_chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    media_url TEXT,
    media_type TEXT, -- 'image', 'video', 'file'
    media_thumbnail TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT message_content_check CHECK (content IS NOT NULL OR media_url IS NOT NULL)
);

-- 9. Polls table
CREATE TABLE public.polls (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Poll options table (max 4 options)
CREATE TABLE public.poll_options (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Poll votes table
CREATE TABLE public.poll_votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(option_id, user_id) -- One vote per user per option
);

-- Create indexes for performance
CREATE INDEX idx_social_posts_user_created ON public.social_posts(user_id, created_at DESC);
CREATE INDEX idx_social_posts_published ON public.social_posts(is_published, created_at DESC);
CREATE INDEX idx_post_reactions_post ON public.post_reactions(post_id);
CREATE INDEX idx_post_comments_post ON public.post_comments(post_id, created_at ASC);
CREATE INDEX idx_post_comments_parent ON public.post_comments(parent_id, created_at ASC);
CREATE INDEX idx_stories_user_expires ON public.stories(user_id, expires_at DESC);
CREATE INDEX idx_stories_active ON public.stories(expires_at DESC) WHERE expires_at > now();
CREATE INDEX idx_chat_members_user ON public.chat_members(user_id, joined_at DESC);
CREATE INDEX idx_chat_messages_chat ON public.chat_messages(chat_id, created_at ASC);
CREATE INDEX idx_poll_votes_option ON public.poll_votes(option_id);

-- Enable RLS on all tables
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_posts
CREATE POLICY "Everyone can view published posts" ON public.social_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create their own posts" ON public.social_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.social_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.social_posts
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for post_reactions
CREATE POLICY "Everyone can view reactions" ON public.post_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reactions" ON public.post_reactions
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for post_comments
CREATE POLICY "Everyone can view comments on published posts" ON public.post_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.social_posts 
            WHERE id = post_comments.post_id AND is_published = true
        )
    );

CREATE POLICY "Users can create comments" ON public.post_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.post_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.post_comments
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for stories
CREATE POLICY "Everyone can view active stories" ON public.stories
    FOR SELECT USING (expires_at > now());

CREATE POLICY "Users can create their own stories" ON public.stories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories" ON public.stories
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for direct_chats
CREATE POLICY "Chat members can view their chats" ON public.direct_chats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_members 
            WHERE chat_id = direct_chats.id AND user_id = auth.uid() AND left_at IS NULL
        )
    );

CREATE POLICY "Users can create chats" ON public.direct_chats
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for chat_members
CREATE POLICY "Chat members can view chat membership" ON public.chat_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_members cm 
            WHERE cm.chat_id = chat_members.chat_id AND cm.user_id = auth.uid() AND cm.left_at IS NULL
        )
    );

CREATE POLICY "Users can join chats" ON public.chat_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave chats" ON public.chat_members
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Chat members can view messages" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_members 
            WHERE chat_id = chat_messages.chat_id AND user_id = auth.uid() AND left_at IS NULL
        )
    );

CREATE POLICY "Chat members can send messages" ON public.chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.chat_members 
            WHERE chat_id = chat_messages.chat_id AND user_id = auth.uid() AND left_at IS NULL
        )
    );

-- RLS Policies for polls
CREATE POLICY "Everyone can view polls on published posts" ON public.polls
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.social_posts 
            WHERE id = polls.post_id AND is_published = true
        )
    );

CREATE POLICY "Post owners can create polls" ON public.polls
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.social_posts 
            WHERE id = polls.post_id AND user_id = auth.uid()
        )
    );

-- RLS Policies for poll_options
CREATE POLICY "Everyone can view poll options" ON public.poll_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.polls p
            JOIN public.social_posts sp ON p.post_id = sp.id
            WHERE p.id = poll_options.poll_id AND sp.is_published = true
        )
    );

CREATE POLICY "Poll creators can manage options" ON public.poll_options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.polls p
            JOIN public.social_posts sp ON p.post_id = sp.id
            WHERE p.id = poll_options.poll_id AND sp.user_id = auth.uid()
        )
    );

-- RLS Policies for poll_votes
CREATE POLICY "Everyone can view poll votes" ON public.poll_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own votes" ON public.poll_votes
    FOR ALL USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_social_posts_updated_at
    BEFORE UPDATE ON public.social_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at
    BEFORE UPDATE ON public.post_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_direct_chats_updated_at
    BEFORE UPDATE ON public.direct_chats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to enforce 2-level comment depth (trigger-based)
CREATE OR REPLACE FUNCTION check_comment_depth()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is a reply to another comment, check that the parent is not itself a reply
    IF NEW.parent_id IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM public.post_comments 
            WHERE id = NEW.parent_id AND parent_id IS NOT NULL
        ) THEN
            RAISE EXCEPTION 'Comments can only be nested 2 levels deep';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_comment_depth
    BEFORE INSERT ON public.post_comments
    FOR EACH ROW
    EXECUTE FUNCTION check_comment_depth();

-- Function to enforce group chat member limit (max 25)
CREATE OR REPLACE FUNCTION check_group_member_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT is_group FROM public.direct_chats WHERE id = NEW.chat_id) THEN
        IF (SELECT COUNT(*) FROM public.chat_members 
            WHERE chat_id = NEW.chat_id AND left_at IS NULL) >= 25 THEN
            RAISE EXCEPTION 'Group chat cannot have more than 25 members';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_group_member_limit
    BEFORE INSERT ON public.chat_members
    FOR EACH ROW
    EXECUTE FUNCTION check_group_member_limit();

-- Function to enforce poll options limit (max 4)
CREATE OR REPLACE FUNCTION check_poll_options_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM public.poll_options WHERE poll_id = NEW.poll_id) >= 4 THEN
        RAISE EXCEPTION 'Poll cannot have more than 4 options';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_poll_options_limit
    BEFORE INSERT ON public.poll_options
    FOR EACH ROW
    EXECUTE FUNCTION check_poll_options_limit();

-- Enable realtime for all social tables
ALTER TABLE public.social_posts REPLICA IDENTITY FULL;
ALTER TABLE public.post_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.post_comments REPLICA IDENTITY FULL;
ALTER TABLE public.stories REPLICA IDENTITY FULL;
ALTER TABLE public.direct_chats REPLICA IDENTITY FULL;
ALTER TABLE public.chat_members REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.polls REPLICA IDENTITY FULL;
ALTER TABLE public.poll_options REPLICA IDENTITY FULL;
ALTER TABLE public.poll_votes REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_options;
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_votes;