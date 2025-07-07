-- Create comprehensive storage bucket architecture for Tim & Kirsten's wedding

-- 1. Home Screen Hero Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('home-hero', 'home-hero', true);

-- 2. Venue-Specific Buckets
-- Ben Ean (ceremony and reception venue)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('venue-ben-ean', 'venue-ben-ean', true);

-- Prince of Mereweather Pub (pre-wedding drinks)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('venue-pub', 'venue-pub', true);

-- Newcastle Beach (recovery day)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('venue-beach', 'venue-beach', true);

-- 3. Gallery Bucket for Tim & Kirsten's photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('couple-gallery', 'couple-gallery', true);

-- 4. User Profile Buckets (individual user storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-profiles', 'user-profiles', false);

-- 5. Social Feed Bucket (shared content by guests)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('social-feed', 'social-feed', true);

-- Set up RLS policies for storage buckets

-- User Profile Bucket Policies (private - users can only access their own content)
CREATE POLICY "Users can view their own profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'user-profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'user-profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'user-profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Social Feed Bucket Policies (public read, authenticated write)
CREATE POLICY "Anyone can view social feed content"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'social-feed');

CREATE POLICY "Authenticated users can upload to social feed"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'social-feed' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own social feed uploads"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'social-feed' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own social feed uploads"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'social-feed' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admin access policies for Tim & Kirsten (social feed management)
CREATE POLICY "Admins can manage all social feed content"
  ON storage.objects FOR ALL
  USING (bucket_id = 'social-feed' AND has_role(auth.uid(), 'admin'::app_role));

-- Public venue and gallery bucket policies
CREATE POLICY "Public read access for venue buckets"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('venue-ben-ean', 'venue-pub', 'venue-beach', 'couple-gallery', 'home-hero'));

CREATE POLICY "Admin write access for venue buckets"
  ON storage.objects FOR ALL
  USING (bucket_id IN ('venue-ben-ean', 'venue-pub', 'venue-beach', 'couple-gallery', 'home-hero') 
         AND has_role(auth.uid(), 'admin'::app_role));