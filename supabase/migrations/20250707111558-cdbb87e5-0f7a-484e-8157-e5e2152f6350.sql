-- Fix the messages/profiles relationship by adding foreign key
-- This will resolve the console error about missing relationship

ALTER TABLE messages 
ADD CONSTRAINT messages_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(user_id);

-- Also fix other tables that should reference profiles
ALTER TABLE photo_comments 
ADD CONSTRAINT photo_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(user_id);

ALTER TABLE photo_likes 
ADD CONSTRAINT photo_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(user_id);

ALTER TABLE message_likes 
ADD CONSTRAINT message_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(user_id);

-- Create Gift Registry table (missing feature)
CREATE TABLE gift_registry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  store_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  priority INTEGER DEFAULT 3, -- 1=high, 2=medium, 3=low
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_by UUID REFERENCES profiles(user_id),
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on gifts table
ALTER TABLE gift_registry ENABLE ROW LEVEL SECURITY;

-- Everyone can view gifts
CREATE POLICY "Everyone can view gift registry"
  ON gift_registry FOR SELECT
  USING (true);

-- Users can mark gifts as purchased
CREATE POLICY "Users can update gift purchase status"
  ON gift_registry FOR UPDATE
  USING (true)
  WITH CHECK (purchased_by = auth.uid());

-- Only admins can manage gift registry items
CREATE POLICY "Admins can manage gift registry"
  ON gift_registry FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('wedding-photos', 'wedding-photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('gift-images', 'gift-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Storage policies for wedding photos
CREATE POLICY "Anyone can view wedding photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-photos');

CREATE POLICY "Authenticated users can upload wedding photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wedding-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'wedding-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for gift images  
CREATE POLICY "Anyone can view gift images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-images');

CREATE POLICY "Admins can manage gift images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'gift-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger for gift registry
CREATE TRIGGER update_gift_registry_updated_at
  BEFORE UPDATE ON gift_registry
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();