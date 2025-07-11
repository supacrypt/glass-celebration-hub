-- Supabase Complete Data Backup
-- Generated on 2025-07-11

-- Data for public.app_settings
INSERT INTO public.app_settings (id, setting_key, setting_value, created_at, updated_at) VALUES
('ac8983df-cb86-4b85-98cf-794dff26f9d1', 'hero_background_mobile_url', '', '2025-07-09 14:20:09.535192+00', '2025-07-10 03:19:56.001979+00'),
('1652281b-178e-416f-a9b7-7fc6278649af', 'active_background', 'background-1751905301984.png', '2025-07-07 15:55:34.473964+00', '2025-07-07 16:21:58.856875+00'),
('9b697cbe-074b-4ee9-bd11-f28033f2d82a', 'font_primary', 'Dancing Script', '2025-07-08 07:29:30.57549+00', '2025-07-08 07:29:30.57549+00'),
('6044bbb5-e2c9-4092-8d6d-a8698962f3eb', 'font_heading', 'Inter', '2025-07-08 07:29:30.634642+00', '2025-07-08 07:29:30.634642+00'),
('4f8a854b-253d-4731-9b9e-d49312da3086', 'font_body', 'Inter', '2025-07-08 07:29:30.687426+00', '2025-07-08 07:29:30.687426+00'),
('b388107b-dd6e-4633-a310-f4525b70d4c9', 'font_scale', '1', '2025-07-08 07:29:30.738745+00', '2025-07-08 07:29:30.738745+00'),
('31909c67-748d-4948-b337-3659c034b71e', 'line_height', '1.5', '2025-07-08 07:29:30.788175+00', '2025-07-08 07:29:30.788175+00'),
('1e65ded0-b4f1-4321-a6f6-2d2b85ee07e1', 'external_gift_registry_url', 'https://mygiftregistry.com.au/id/tim-and-kirsten/', '2025-07-09 11:29:04.844781+00', '2025-07-09 11:29:04.844781+00'),
('2c3cb15f-5328-4f81-90a6-a1934988e04b', 'couple_name_1', 'Tim', '2025-07-09 11:48:42.404211+00', '2025-07-09 12:44:46.402581+00'),
('d83a483a-831e-451e-b86a-8b1e06917f8a', 'couple_name_2', 'Kirsten', '2025-07-09 11:48:42.404211+00', '2025-07-09 12:44:49.191195+00'),
('65e9057b-e192-411a-824c-834f828751f0', 'wedding_location', 'Ben Ean, Pokolbin', '2025-07-09 12:50:05.934036+00', '2025-07-09 12:50:05.934036+00'),
('e4f3586d-c50f-4b3e-861f-366b19a08e1a', 'wedding_reception_details', 'Join us for dinner, dancing, and celebration! Reception to conclude at 12:00 AM. There''ll be top-shelf bevies, good tunes, and more love than you can poke a stick at.', '2025-07-09 12:50:05.934036+00', '2025-07-09 16:11:45.704117+00'),
('56137633-a12c-4d99-9e18-91e34529a165', 'wedding_date', '2025-10-05T15:00', '2025-07-09 12:50:05.934036+00', '2025-07-09 16:41:14.613933+00'),
('939cd682-918d-4b5e-82dd-e02adb87c65d', 'hero_background_url', 'https://iwmfxcrzzwpmxomydmuq.supabase.co/storage/v1/object/public/backgrounds/1752114604198-oc6hwex2gjm.mp4', '2025-07-09 14:20:09.535192+00', '2025-07-10 04:13:02.118594+00'),
('fa876307-1b74-4e50-867d-741eb12edfac', 'hero_background_type', 'video', '2025-07-09 14:20:09.535192+00', '2025-07-10 04:13:02.656758+00'),
('5c379b0d-b6c6-41cc-80dd-dc76e7a66358', 'hero_overlay_opacity', '0', '2025-07-09 14:20:09.535192+00', '2025-07-09 17:53:01.250571+00'),
('27a573ba-ac56-4559-b405-cd3659892e82', 'hero_video_loop', 'true', '2025-07-09 14:20:09.535192+00', '2025-07-09 17:53:50.079343+00'),
('cc31f805-36d3-419a-8661-f191e1a6d047', 'hero_video_autoplay', 'true', '2025-07-09 14:20:09.535192+00', '2025-07-09 17:53:52.13078+00'),
('b6250178-a721-4e10-9cd4-40644b81d61b', 'app_name', 'Tim & Kirsten’s Wedding Day ', '2025-07-09 11:48:42.404211+00', '2025-07-11 03:06:27.869005+00');

-- Data for public.photos
-- Table is empty, no data to insert.

-- Data for public.rsvps
INSERT INTO public.rsvps (id, user_id, event_id, status, guest_count, dietary_restrictions, message, created_at, updated_at) VALUES
('89d48bd8-1750-4319-af92-b18b86721217', 'f897a72b-069b-4c79-91a9-72acceca4102', 'a7a3722b-ed12-4f88-91f6-65689900adcd', 'attending', 2, NULL, 'We look forward to celebrating your marriage with you both and listening to Bill play th bagpipes 😉
Coach seats needed: 2
Pickup location: newcastle
Accommodation: Crystalbrook Newcastle, 282 king street', '2025-07-08 05:23:33.644561+00', '2025-07-08 05:23:33.644561+00');

-- Data for public.wedding_events
INSERT INTO public.wedding_events (id, title, description, event_date, location, venue_name, address, dress_code, notes, is_main_event, created_at, updated_at) VALUES
('a7a3722b-ed12-4f88-91f6-65689900adcd', 'Wedding Ceremony', 'Tim & Kirsten exchange vows on the Garden Terrace Lawn', '2025-10-05 05:00:00+00', 'Ben Ean', 'Ben Ean', '119 McDonalds Rd, Pokolbin NSW 2320', 'Dapper/Cocktail: Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief! Classy dress, pantsuit or jumpsuit.', 'Arrive at 2:30 PM for a 3:00 PM start. Ceremony on the Garden Terrace Lawn.', true, '2025-07-07 06:01:30.017679+00', '2025-07-07 06:01:30.017679+00'),
('eaa5cb7a-2fed-43b7-acb4-d0a139cafafe', 'Wedding Reception', 'Join us for dinner, dancing, and celebration! Reception to conclude at 12:00 AM.', '2025-10-05 07:00:00+00', 'Ben Ean', 'Ben Ean', '119 McDonalds Rd, Pokolbin NSW 2320', 'Dapper/Cocktail: Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief! Classy dress, pantsuit or jumpsuit.', 'Cocktail hour after ceremony followed by reception. Top-shelf bevies, good tunes, and more love than you can poke a stick at!', true, '2025-07-07 06:01:30.017679+00', '2025-07-07 06:01:30.017679+00'),
('449f062c-8dca-4948-903e-5b0074c81b18', 'Pre-Wedding Drinks', 'Tim and Kirsten will be at the Prince of Mereweather pub. Stop in to have a drink and grab yourself a meal if you are hungry.', '2025-10-04 06:00:00+00', 'Prince of Mereweather', 'Prince of Mereweather Pub', 'Mereweather, NSW', 'Casual', 'Saturday 4th October, 4-8 PM. Casual drinks and food available.', false, '2025-07-07 06:01:30.017679+00', '2025-07-07 06:01:30.017679+00'),
('309e0df2-0614-4beb-92c9-3268b0017988', 'Recovery Beach Day', 'While we do not have a formal recovery breakfast planned, we will be at Newcastle Beach from 11 am onwards. There is a kiosk that serves good coffee and excellent food. Good for soaking up the libations!', '2025-10-06 01:00:00+00', 'Newcastle Beach', 'Newcastle Beach', 'Newcastle Beach, NSW', 'Casual beach wear', 'Monday October 6th from 11 AM onwards. Kiosk available for coffee and food.', false, '2025-07-07 06:01:30.017679+00', '2025-07-07 06:01:30.017679+00');

