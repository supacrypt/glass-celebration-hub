-- Create gift-images storage bucket for gift registry images
INSERT INTO storage.buckets (id, name, public) VALUES ('gift-images', 'gift-images', true);

-- Create storage policies for gift images
CREATE POLICY "Gift images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gift-images');

CREATE POLICY "Admins can upload gift images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gift-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update gift images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gift-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gift images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gift-images' AND has_role(auth.uid(), 'admin'::app_role));