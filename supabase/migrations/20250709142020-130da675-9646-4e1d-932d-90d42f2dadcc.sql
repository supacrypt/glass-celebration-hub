-- Add hero background settings to app_settings
INSERT INTO app_settings (setting_key, setting_value) VALUES 
('hero_background_type', 'image'),
('hero_background_url', 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'),
('hero_background_mobile_url', ''),
('hero_overlay_opacity', '0.7'),
('hero_overlay_position', 'center'),
('hero_video_autoplay', 'true'),
('hero_video_muted', 'true'),
('hero_video_loop', 'true')
ON CONFLICT (setting_key) DO NOTHING;