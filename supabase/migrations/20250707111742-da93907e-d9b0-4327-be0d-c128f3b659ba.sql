-- Create Gift Registry table (missing feature)
CREATE TABLE IF NOT EXISTS gift_registry (
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

-- Create storage buckets for file uploads (ignore if exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('wedding-photos', 'wedding-photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('gift-images', 'gift-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

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

-- Add some sample gift registry items
INSERT INTO gift_registry (title, description, price, category, priority, store_url) VALUES
  ('Kitchen Stand Mixer', 'Professional stand mixer for baking enthusiasts', 399.99, 'kitchen', 1, 'https://example.com/mixer'),
  ('Egyptian Cotton Sheets', 'Luxurious 400 thread count sheet set', 149.99, 'bedroom', 2, 'https://example.com/sheets'),
  ('Wine Decanter Set', 'Crystal wine decanter with glasses', 89.99, 'entertaining', 2, 'https://example.com/decanter'),
  ('Honeymoon Fund', 'Contribution to our dream honeymoon', 100.00, 'experiences', 1, NULL),
  ('Garden Tool Set', 'Complete set for our new garden', 199.99, 'outdoor', 3, 'https://example.com/tools');