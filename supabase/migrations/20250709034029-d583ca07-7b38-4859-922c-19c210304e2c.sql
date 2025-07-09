-- Create storage buckets for social media
INSERT INTO storage.buckets (id, name, public) VALUES 
('social-posts', 'social-posts', true),
('stories', 'stories', true),
('direct-chats', 'direct-chats', false);

-- Create storage policies
CREATE POLICY "Anyone can view social post media" ON storage.objects FOR SELECT USING (bucket_id = 'social-posts');
CREATE POLICY "Authenticated users can upload social post media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'social-posts' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view stories" ON storage.objects FOR SELECT USING (bucket_id = 'stories');
CREATE POLICY "Authenticated users can upload stories" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'stories' AND auth.role() = 'authenticated');

CREATE POLICY "Chat members can view chat media" ON storage.objects FOR SELECT USING (bucket_id = 'direct-chats');
CREATE POLICY "Chat members can upload chat media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'direct-chats' AND auth.role() = 'authenticated');