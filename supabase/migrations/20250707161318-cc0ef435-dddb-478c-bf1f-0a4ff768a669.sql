-- Update the default active background to use 'background 1.png'
UPDATE public.app_settings 
SET setting_value = 'background 1.png' 
WHERE setting_key = 'active_background';

-- Insert the setting if it doesn't exist
INSERT INTO public.app_settings (setting_key, setting_value) 
VALUES ('active_background', 'background 1.png')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = 'background 1.png';