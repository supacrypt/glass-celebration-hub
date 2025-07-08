-- Create venue_images table for comprehensive image metadata
CREATE TABLE public.venue_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  title TEXT,
  description TEXT,
  image_order INTEGER NOT NULL DEFAULT 0,
  image_type TEXT NOT NULL DEFAULT 'gallery', -- 'cover', 'gallery', 'detail'
  mime_type TEXT,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on venue_images
ALTER TABLE public.venue_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for venue_images
CREATE POLICY "Everyone can view published venue images" 
ON public.venue_images 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage all venue images" 
ON public.venue_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_venue_images_updated_at
BEFORE UPDATE ON public.venue_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_venue_images_venue_id ON public.venue_images(venue_id);
CREATE INDEX idx_venue_images_type_order ON public.venue_images(image_type, image_order);
CREATE INDEX idx_venue_images_published ON public.venue_images(is_published);

-- Enable realtime for venue_images
ALTER TABLE public.venue_images REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.venue_images;

-- Insert cover images for existing venues
INSERT INTO public.venue_images (venue_id, image_url, image_path, image_type, title)
SELECT 
  id,
  image_url,
  image_path,
  'cover',
  'Main venue image'
FROM public.venues;