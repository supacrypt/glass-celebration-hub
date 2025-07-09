-- Create message reactions table
CREATE TABLE public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- Create message replies table
CREATE TABLE public.message_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL REFERENCES public.direct_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user blocks table
CREATE TABLE public.user_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  blocked_user_id UUID NOT NULL,
  blocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, blocked_user_id)
);

-- Create message reports table for admin moderation
CREATE TABLE public.message_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL,
  report_reason TEXT NOT NULL,
  report_details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Create conversation settings table for management features
CREATE TABLE public.conversation_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.direct_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  is_important BOOLEAN NOT NULL DEFAULT false,
  is_muted BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(chat_id, user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for message_reactions
CREATE POLICY "Users can view reactions on accessible messages"
ON public.message_reactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_messages cm
    JOIN public.chat_members cme ON cm.chat_id = cme.chat_id
    WHERE cm.id = message_reactions.message_id
    AND cme.user_id = auth.uid()
    AND cme.left_at IS NULL
  )
);

CREATE POLICY "Users can manage their own reactions"
ON public.message_reactions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policies for message_replies
CREATE POLICY "Users can view replies on accessible messages"
ON public.message_replies
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_members
    WHERE chat_id = message_replies.chat_id
    AND user_id = auth.uid()
    AND left_at IS NULL
  )
);

CREATE POLICY "Users can create replies in their chats"
ON public.message_replies
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.chat_members
    WHERE chat_id = message_replies.chat_id
    AND user_id = auth.uid()
    AND left_at IS NULL
  )
);

-- RLS policies for user_blocks
CREATE POLICY "Users can view their own blocks"
ON public.user_blocks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own blocks"
ON public.user_blocks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policies for message_reports
CREATE POLICY "Users can create message reports"
ON public.message_reports
FOR INSERT
WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can view their own reports"
ON public.message_reports
FOR SELECT
USING (auth.uid() = reported_by);

CREATE POLICY "Admins can manage all reports"
ON public.message_reports
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for conversation_settings
CREATE POLICY "Users can manage their own conversation settings"
ON public.conversation_settings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON public.message_reactions(user_id);
CREATE INDEX idx_message_replies_parent_message_id ON public.message_replies(parent_message_id);
CREATE INDEX idx_message_replies_chat_id ON public.message_replies(chat_id);
CREATE INDEX idx_user_blocks_user_id ON public.user_blocks(user_id);
CREATE INDEX idx_user_blocks_blocked_user_id ON public.user_blocks(blocked_user_id);
CREATE INDEX idx_message_reports_message_id ON public.message_reports(message_id);
CREATE INDEX idx_message_reports_status ON public.message_reports(status);
CREATE INDEX idx_conversation_settings_chat_id ON public.conversation_settings(chat_id);
CREATE INDEX idx_conversation_settings_user_id ON public.conversation_settings(user_id);