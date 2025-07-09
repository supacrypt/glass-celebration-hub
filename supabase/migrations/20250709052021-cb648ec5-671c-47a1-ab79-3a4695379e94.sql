-- Enhance polls system with Facebook-style features
-- Add enum types for polls
CREATE TYPE public.poll_type AS ENUM ('multiple_choice', 'yes_no', 'rating');
CREATE TYPE public.poll_status AS ENUM ('active', 'closed', 'draft');

-- Add new columns to existing polls table
ALTER TABLE public.polls 
ADD COLUMN poll_type public.poll_type DEFAULT 'multiple_choice',
ADD COLUMN anonymous_voting boolean DEFAULT false,
ADD COLUMN allow_multiple_selections boolean DEFAULT false,
ADD COLUMN poll_status public.poll_status DEFAULT 'active',
ADD COLUMN vote_count integer DEFAULT 0,
ADD COLUMN settings jsonb DEFAULT '{}',
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- Create poll notifications table
CREATE TABLE public.poll_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  notification_type text NOT NULL CHECK (notification_type IN ('new_vote', 'poll_expiring', 'poll_closed', 'results_ready')),
  message text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on poll_notifications
ALTER TABLE public.poll_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for poll_notifications
CREATE POLICY "Users can view their own notifications"
ON public.poll_notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
ON public.poll_notifications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
ON public.poll_notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update poll vote count
CREATE OR REPLACE FUNCTION public.update_poll_vote_count()
RETURNS TRIGGER AS $$
DECLARE
  poll_id_val uuid;
BEGIN
  -- Get poll_id from the option
  SELECT p.id INTO poll_id_val
  FROM public.polls p
  JOIN public.poll_options po ON p.id = po.poll_id
  WHERE po.id = COALESCE(NEW.option_id, OLD.option_id);
  
  -- Update vote count on polls table
  UPDATE public.polls 
  SET vote_count = (
    SELECT COUNT(*) 
    FROM public.poll_votes pv
    JOIN public.poll_options po ON pv.option_id = po.id
    WHERE po.poll_id = poll_id_val
  ),
  updated_at = now()
  WHERE id = poll_id_val;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote count updates
CREATE TRIGGER update_poll_vote_count_trigger
  AFTER INSERT OR DELETE ON public.poll_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_poll_vote_count();

-- Create index for better performance
CREATE INDEX idx_poll_notifications_user_id ON public.poll_notifications(user_id);
CREATE INDEX idx_poll_notifications_poll_id ON public.poll_notifications(poll_id);
CREATE INDEX idx_polls_status ON public.polls(poll_status);
CREATE INDEX idx_polls_expires_at ON public.polls(expires_at);

-- Add trigger to automatically close expired polls
CREATE OR REPLACE FUNCTION public.close_expired_polls()
RETURNS TRIGGER AS $$
BEGIN
  -- Close polls that have expired
  UPDATE public.polls 
  SET poll_status = 'closed'
  WHERE expires_at <= now() 
  AND poll_status = 'active';
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run on polls table updates
CREATE TRIGGER close_expired_polls_trigger
  AFTER UPDATE ON public.polls
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.close_expired_polls();