-- Add content management settings to app_settings table
INSERT INTO public.app_settings (setting_key, setting_value) VALUES
  ('welcome_message', 'We Can''t Wait to Celebrate With You!'),
  ('welcome_subtitle', 'Your presence is the greatest gift we could ask for. Join us for a day filled with love, laughter, and unforgettable memories as we begin our new chapter together.'),
  ('hero_subtitle', 'Join us as we begin our new chapter together'),
  ('countdown_message', 'Until our special day'),
  ('gallery_title', 'Our Wedding Gallery'),
  ('gallery_description', 'Capturing our most precious moments'),
  ('rsvp_instructions', 'Please RSVP by clicking the button below. We can''t wait to celebrate with you!'),
  ('footer_message', 'With love, Tim & Kirsten'),
  ('about_section', 'Tim and Kirsten are excited to share their special day with family and friends at Ben Ean Winery in the beautiful Hunter Valley.'),
  ('contact_message', 'For any questions about the wedding, please don''t hesitate to reach out to us.'),
  ('wedding_date', '2025-10-05'),
  ('ceremony_time', '3:00 PM'),
  ('arrival_time', '2:30 PM')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();