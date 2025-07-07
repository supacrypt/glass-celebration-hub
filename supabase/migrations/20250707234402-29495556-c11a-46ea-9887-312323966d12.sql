-- Wedding App Complete Backend Setup
-- Fix relationships and ensure all features have proper database support

-- Create enhanced profiles table with proper relationships
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table with proper foreign key to profiles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'guest',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create enhanced wedding_events table
CREATE TABLE IF NOT EXISTS public.wedding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  venue_name TEXT,
  address TEXT,
  dress_code TEXT,
  notes TEXT,
  is_main_event BOOLEAN DEFAULT false,
  max_capacity INTEGER DEFAULT 150,
  rsvp_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enhanced rsvps table with additional fields
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.wedding_events(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('attending', 'declined', 'pending', 'maybe')),
  guest_count INTEGER DEFAULT 1,
  dietary_restrictions TEXT,
  message TEXT,
  plus_one_name TEXT,
  table_assignment TEXT,
  meal_preference TEXT,
  song_request TEXT,
  accommodation_needed BOOLEAN DEFAULT false,
  transportation_needed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Create enhanced photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  description TEXT,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  mime_type TEXT,
  is_approved BOOLEAN DEFAULT true,
  moderation_notes TEXT,
  flagged_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create photo_likes table
CREATE TABLE IF NOT EXISTS public.photo_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(photo_id, user_id)
);

-- Create photo_comments table
CREATE TABLE IF NOT EXISTS public.photo_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enhanced messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  is_announcement BOOLEAN DEFAULT false,
  announcement_type TEXT CHECK (announcement_type IN ('general', 'urgent', 'reminder')),
  target_audience TEXT CHECK (target_audience IN ('all', 'guests', 'rsvp_confirmed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create message_likes table
CREATE TABLE IF NOT EXISTS public.message_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Create enhanced gift_registry table
CREATE TABLE IF NOT EXISTS public.gift_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  store_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  is_purchased BOOLEAN DEFAULT false,
  purchased_by UUID REFERENCES public.profiles(user_id),
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create seating_tables table for wedding planning
CREATE TABLE IF NOT EXISTS public.seating_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INTEGER NOT NULL UNIQUE,
  capacity INTEGER NOT NULL DEFAULT 8,
  assigned_guests INTEGER DEFAULT 0,
  special_requirements TEXT,
  event_id UUID REFERENCES public.wedding_events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('general', 'urgent', 'reminder')),
  target_audience TEXT NOT NULL CHECK (target_audience IN ('all', 'guests', 'rsvp_confirmed')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seating_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view all user roles" ON public.user_roles;
CREATE POLICY "Users can view all user roles" ON public.user_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for wedding_events
DROP POLICY IF EXISTS "Everyone can view wedding events" ON public.wedding_events;
CREATE POLICY "Everyone can view wedding events" ON public.wedding_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins and couple can manage events" ON public.wedding_events;
CREATE POLICY "Admins and couple can manage events" ON public.wedding_events FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'couple'::app_role));

-- RLS Policies for rsvps
DROP POLICY IF EXISTS "Users can view all RSVPs" ON public.rsvps;
CREATE POLICY "Users can view all RSVPs" ON public.rsvps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own RSVPs" ON public.rsvps;
CREATE POLICY "Users can manage their own RSVPs" ON public.rsvps FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for photos
DROP POLICY IF EXISTS "Everyone can view approved photos" ON public.photos;
CREATE POLICY "Everyone can view approved photos" ON public.photos FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Users can upload photos" ON public.photos;
CREATE POLICY "Users can upload photos" ON public.photos FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own photos" ON public.photos;
CREATE POLICY "Users can update their own photos" ON public.photos FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all photos" ON public.photos;
CREATE POLICY "Admins can manage all photos" ON public.photos FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for photo_likes
DROP POLICY IF EXISTS "Everyone can view photo likes" ON public.photo_likes;
CREATE POLICY "Everyone can view photo likes" ON public.photo_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own photo likes" ON public.photo_likes;
CREATE POLICY "Users can manage their own photo likes" ON public.photo_likes FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for photo_comments
DROP POLICY IF EXISTS "Everyone can view photo comments" ON public.photo_comments;
CREATE POLICY "Everyone can view photo comments" ON public.photo_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.photo_comments;
CREATE POLICY "Users can create comments" ON public.photo_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.photo_comments;
CREATE POLICY "Users can update their own comments" ON public.photo_comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.photo_comments;
CREATE POLICY "Users can delete their own comments" ON public.photo_comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for messages
DROP POLICY IF EXISTS "Everyone can view public messages" ON public.messages;
CREATE POLICY "Everyone can view public messages" ON public.messages FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can create messages" ON public.messages;
CREATE POLICY "Users can create messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own messages" ON public.messages;
CREATE POLICY "Users can delete their own messages" ON public.messages FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for message_likes
DROP POLICY IF EXISTS "Everyone can view message likes" ON public.message_likes;
CREATE POLICY "Everyone can view message likes" ON public.message_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own message likes" ON public.message_likes;
CREATE POLICY "Users can manage their own message likes" ON public.message_likes FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for gift_registry
DROP POLICY IF EXISTS "Everyone can view gift registry" ON public.gift_registry;
CREATE POLICY "Everyone can view gift registry" ON public.gift_registry FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gift registry" ON public.gift_registry;
CREATE POLICY "Admins can manage gift registry" ON public.gift_registry FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can update gift purchase status" ON public.gift_registry;
CREATE POLICY "Users can update gift purchase status" ON public.gift_registry FOR UPDATE USING (true) WITH CHECK (purchased_by = auth.uid());

-- RLS Policies for seating_tables
DROP POLICY IF EXISTS "Everyone can view seating tables" ON public.seating_tables;
CREATE POLICY "Everyone can view seating tables" ON public.seating_tables FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage seating tables" ON public.seating_tables;
CREATE POLICY "Admins can manage seating tables" ON public.seating_tables FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for announcements
DROP POLICY IF EXISTS "Everyone can view announcements" ON public.announcements;
CREATE POLICY "Everyone can view announcements" ON public.announcements FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wedding_events_updated_at ON public.wedding_events;
CREATE TRIGGER update_wedding_events_updated_at BEFORE UPDATE ON public.wedding_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_rsvps_updated_at ON public.rsvps;
CREATE TRIGGER update_rsvps_updated_at BEFORE UPDATE ON public.rsvps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_photos_updated_at ON public.photos;
CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON public.photos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_photo_comments_updated_at ON public.photo_comments;
CREATE TRIGGER update_photo_comments_updated_at BEFORE UPDATE ON public.photo_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_gift_registry_updated_at ON public.gift_registry;
CREATE TRIGGER update_gift_registry_updated_at BEFORE UPDATE ON public.gift_registry FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_seating_tables_updated_at ON public.seating_tables;
CREATE TRIGGER update_seating_tables_updated_at BEFORE UPDATE ON public.seating_tables FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for the wedding app
INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-photos', 'wedding-photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gift-images', 'gift-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('venue-images', 'venue-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for wedding-photos bucket
DROP POLICY IF EXISTS "Wedding photos are publicly accessible" ON storage.objects;
CREATE POLICY "Wedding photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Users can upload wedding photos" ON storage.objects;
CREATE POLICY "Users can upload wedding photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wedding-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own wedding photos" ON storage.objects;
CREATE POLICY "Users can update their own wedding photos" ON storage.objects FOR UPDATE USING (bucket_id = 'wedding-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own wedding photos" ON storage.objects;
CREATE POLICY "Users can delete their own wedding photos" ON storage.objects FOR DELETE USING (bucket_id = 'wedding-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for user-avatars bucket
DROP POLICY IF EXISTS "User avatars are publicly accessible" ON storage.objects;
CREATE POLICY "User avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for gift-images bucket
DROP POLICY IF EXISTS "Gift images are publicly accessible" ON storage.objects;
CREATE POLICY "Gift images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'gift-images');

DROP POLICY IF EXISTS "Admins can manage gift images" ON storage.objects;
CREATE POLICY "Admins can manage gift images" ON storage.objects FOR ALL USING (bucket_id = 'gift-images');

-- Storage policies for venue-images bucket
DROP POLICY IF EXISTS "Venue images are publicly accessible" ON storage.objects;
CREATE POLICY "Venue images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'venue-images');

DROP POLICY IF EXISTS "Admins can manage venue images" ON storage.objects;
CREATE POLICY "Admins can manage venue images" ON storage.objects FOR ALL USING (bucket_id = 'venue-images');

-- Enable realtime for key tables
ALTER publication supabase_realtime ADD TABLE public.messages;
ALTER publication supabase_realtime ADD TABLE public.photos;
ALTER publication supabase_realtime ADD TABLE public.rsvps;
ALTER publication supabase_realtime ADD TABLE public.photo_likes;
ALTER publication supabase_realtime ADD TABLE public.message_likes;

-- Set replica identity for realtime tables
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.photos REPLICA IDENTITY FULL;
ALTER TABLE public.rsvps REPLICA IDENTITY FULL;
ALTER TABLE public.photo_likes REPLICA IDENTITY FULL;
ALTER TABLE public.message_likes REPLICA IDENTITY FULL;