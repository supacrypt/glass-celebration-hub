-- Create gallery_photos table for couple's gallery
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  backstory TEXT, -- Markdown supported
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create venues table
CREATE TABLE public.venues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  caption TEXT,
  address TEXT,
  quick_facts JSONB, -- Store key-value pairs for quick facts
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery_photos
CREATE POLICY "Everyone can view published gallery photos" 
ON public.gallery_photos 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage all gallery photos" 
ON public.gallery_photos 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for venues
CREATE POLICY "Everyone can view venues" 
ON public.venues 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage venues" 
ON public.venues 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at triggers
CREATE TRIGGER update_gallery_photos_updated_at
BEFORE UPDATE ON public.gallery_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_venues_updated_at
BEFORE UPDATE ON public.venues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial venue data
INSERT INTO public.venues (name, image_url, image_path, address, display_order) VALUES
('Ben Ean Winery', 'https://iwmfxcrzzwpmxomydmuq.storage.supabase.co/v1/object/public/venue-ben-ean/Ben Ean Venue Main.png', 'venue-ben-ean/Ben Ean Venue Main.png', 'Ben Ean Winery, Pokolbin NSW', 1),
('The Prince Hotel, Merewether', 'https://iwmfxcrzzwpmxomydmuq.storage.supabase.co/v1/object/public/venue-pub/The Prince Merewether.png', 'venue-pub/The Prince Merewether.png', 'The Prince Hotel, Merewether NSW', 2),
('Newcastle Beach', 'https://iwmfxcrzzwpmxomydmuq.storage.supabase.co/v1/object/public/venue-beach/Necastle Beach.png', 'venue-beach/Necastle Beach.png', 'Newcastle Beach, Newcastle NSW', 3);