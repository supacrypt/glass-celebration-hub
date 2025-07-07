-- Create app_settings table for background configuration
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view app settings" 
ON public.app_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage app settings" 
ON public.app_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default background setting
INSERT INTO public.app_settings (setting_key, setting_value) 
VALUES ('active_background', 'background-image.jpg');

-- Create updated_at trigger
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure backgrounds storage bucket exists and create policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('backgrounds', 'backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for background images
CREATE POLICY "Background images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'backgrounds');

CREATE POLICY "Admins can upload background images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'backgrounds' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update background images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'backgrounds' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete background images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'backgrounds' AND has_role(auth.uid(), 'admin'::app_role));