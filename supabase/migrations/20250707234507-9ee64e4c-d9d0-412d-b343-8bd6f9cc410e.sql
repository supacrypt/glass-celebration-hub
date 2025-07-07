-- Fix realtime publication and complete setup
-- Only add tables to realtime if they're not already there

-- Check and add tables to realtime publication if not already added
DO $$
BEGIN
    -- Add photos to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'photos'
    ) THEN
        ALTER publication supabase_realtime ADD TABLE public.photos;
    END IF;

    -- Add rsvps to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'rsvps'
    ) THEN
        ALTER publication supabase_realtime ADD TABLE public.rsvps;
    END IF;

    -- Add photo_likes to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'photo_likes'
    ) THEN
        ALTER publication supabase_realtime ADD TABLE public.photo_likes;
    END IF;

    -- Add message_likes to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'message_likes'
    ) THEN
        ALTER publication supabase_realtime ADD TABLE public.message_likes;
    END IF;

    -- Add announcements to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'announcements'
    ) THEN
        ALTER publication supabase_realtime ADD TABLE public.announcements;
    END IF;

    -- Add seating_tables to realtime if not already there
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'seating_tables'
    ) THEN
        ALTER publication supabase_realtime ADD TABLE public.seating_tables;
    END IF;
END
$$;

-- Set replica identity for realtime tables (safe to run multiple times)
ALTER TABLE public.photos REPLICA IDENTITY FULL;
ALTER TABLE public.rsvps REPLICA IDENTITY FULL;
ALTER TABLE public.photo_likes REPLICA IDENTITY FULL;
ALTER TABLE public.message_likes REPLICA IDENTITY FULL;
ALTER TABLE public.announcements REPLICA IDENTITY FULL;
ALTER TABLE public.seating_tables REPLICA IDENTITY FULL;

-- Insert sample seating tables for the wedding
INSERT INTO public.seating_tables (table_number, capacity, assigned_guests, special_requirements, event_id) 
SELECT 
    generate_series(1, 15) as table_number,
    CASE WHEN generate_series(1, 15) = 1 THEN 12 ELSE 8 END as capacity,
    0 as assigned_guests,
    CASE 
        WHEN generate_series(1, 15) = 1 THEN 'Head table'
        WHEN generate_series(1, 15) <= 3 THEN 'Close to dance floor'
        ELSE NULL
    END as special_requirements,
    (SELECT id FROM public.wedding_events WHERE is_main_event = true LIMIT 1) as event_id
WHERE NOT EXISTS (SELECT 1 FROM public.seating_tables WHERE table_number = generate_series(1, 15));

-- Create app settings table for theme and configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for app_settings
DROP POLICY IF EXISTS "Everyone can view app settings" ON public.app_settings;
CREATE POLICY "Everyone can view app settings" ON public.app_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage app settings" ON public.app_settings;
CREATE POLICY "Admins can manage app settings" ON public.app_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default app settings
INSERT INTO public.app_settings (setting_key, setting_value) VALUES
('theme_primary_color', '#2C3E50'),
('theme_secondary_color', '#F5F2ED'),
('theme_accent_color', '#EC4899'),
('font_family', 'Inter'),
('app_title', 'Tim & Kirsten''s Wedding'),
('wedding_date', '2025-10-05'),
('ceremony_time', '15:00'),
('reception_time', '17:00')
ON CONFLICT (setting_key) DO NOTHING;

-- Add updated_at trigger for app_settings
DROP TRIGGER IF EXISTS update_app_settings_updated_at ON public.app_settings;
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();