-- Fix storage bucket policies to allow admin access to all files
-- Create comprehensive storage policies for admin access

-- Wedding Photos Bucket - Allow admins to see all files
INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-photos', 'wedding-photos', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can view all wedding photos"
ON storage.objects
FOR SELECT 
USING (
  bucket_id = 'wedding-photos' AND
  (has_role(auth.uid(), 'admin'::app_role) OR true)
);

CREATE POLICY "Admins can manage wedding photos"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'wedding-photos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Social Posts Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('social-posts', 'social-posts', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can view all social posts"
ON storage.objects
FOR SELECT 
USING (
  bucket_id = 'social-posts' AND
  (has_role(auth.uid(), 'admin'::app_role) OR true)
);

CREATE POLICY "Admins can manage social posts"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'social-posts' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Stories Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('stories', 'stories', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can view all stories"
ON storage.objects
FOR SELECT 
USING (
  bucket_id = 'stories' AND
  (has_role(auth.uid(), 'admin'::app_role) OR true)
);

CREATE POLICY "Admins can manage stories"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'stories' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- User Profiles Bucket (private by default)
INSERT INTO storage.buckets (id, name, public) VALUES ('user-profiles', 'user-profiles', false) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can view all user profiles"
ON storage.objects
FOR SELECT 
USING (
  bucket_id = 'user-profiles' AND
  (has_role(auth.uid(), 'admin'::app_role) OR auth.uid()::text = (storage.foldername(name))[1])
);

-- Direct Chats Bucket (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('direct-chats', 'direct-chats', false) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can view all direct chat media"
ON storage.objects
FOR SELECT 
USING (
  bucket_id = 'direct-chats' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Gift Images Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('gift-images', 'gift-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Everyone can view gift images"
ON storage.objects
FOR SELECT 
USING (bucket_id = 'gift-images');

CREATE POLICY "Admins can manage gift images"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'gift-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);