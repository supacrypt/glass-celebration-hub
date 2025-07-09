-- Fix infinite recursion in chat_members RLS policies
-- Remove the problematic policy first
DROP POLICY IF EXISTS "Chat members can view chat membership" ON public.chat_members;

-- Create a security definer function to check chat membership
CREATE OR REPLACE FUNCTION public.is_chat_member(chat_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chat_members
    WHERE chat_id = chat_uuid
    AND user_id = user_uuid
    AND left_at IS NULL
  );
$$;

-- Create new safe policy using the function
CREATE POLICY "Chat members can view chat membership"
ON public.chat_members
FOR SELECT
TO authenticated
USING (public.is_chat_member(chat_id, auth.uid()));

-- Fix the chat_messages policies to use the same function
DROP POLICY IF EXISTS "Chat members can view messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Chat members can send messages" ON public.chat_messages;

CREATE POLICY "Chat members can view messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (public.is_chat_member(chat_id, auth.uid()));

CREATE POLICY "Chat members can send messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND public.is_chat_member(chat_id, auth.uid())
);

-- Fix the direct_chats policy
DROP POLICY IF EXISTS "Chat members can view their chats" ON public.direct_chats;

CREATE POLICY "Chat members can view their chats"
ON public.direct_chats
FOR SELECT
TO authenticated
USING (public.is_chat_member(id, auth.uid()));