-- Fix admin user role for daniel.j.fleuren@gmail.com
UPDATE user_roles 
SET role = 'admin'
WHERE user_id = (
  SELECT user_id 
  FROM profiles 
  WHERE email = 'daniel.j.fleuren@gmail.com'
);

-- Delete placeholder wedding events
DELETE FROM wedding_events;

-- Insert Tim & Kirsten's actual wedding events
INSERT INTO wedding_events (
  title, 
  description, 
  event_date, 
  location, 
  venue_name, 
  address, 
  dress_code,
  notes,
  is_main_event
) VALUES 
-- Main Ceremony
(
  'Wedding Ceremony',
  'Tim & Kirsten exchange vows on the Garden Terrace Lawn',
  '2025-10-05 15:00:00+10',
  'Ben Ean',
  'Ben Ean',
  '119 McDonalds Rd, Pokolbin NSW 2320',
  'Dapper/Cocktail: Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief! Classy dress, pantsuit or jumpsuit.',
  'Arrive at 2:30 PM for a 3:00 PM start. Ceremony on the Garden Terrace Lawn.',
  true
),
-- Reception
(
  'Wedding Reception',
  'Join us for dinner, dancing, and celebration! Reception to conclude at 12:00 AM.',
  '2025-10-05 17:00:00+10',
  'Ben Ean',
  'Ben Ean', 
  '119 McDonalds Rd, Pokolbin NSW 2320',
  'Dapper/Cocktail: Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief! Classy dress, pantsuit or jumpsuit.',
  'Cocktail hour after ceremony followed by reception. Top-shelf bevies, good tunes, and more love than you can poke a stick at!',
  true
),
-- Pre-Wedding Pub Drinks
(
  'Pre-Wedding Drinks',
  'Tim and Kirsten will be at the Prince of Mereweather pub. Stop in to have a drink and grab yourself a meal if you are hungry.',
  '2025-10-04 16:00:00+10',
  'Prince of Mereweather',
  'Prince of Mereweather Pub',
  'Mereweather, NSW',
  'Casual',
  'Saturday 4th October, 4-8 PM. Casual drinks and food available.',
  false
),
-- Beach Recovery Day
(
  'Recovery Beach Day',
  'While we do not have a formal recovery breakfast planned, we will be at Newcastle Beach from 11 am onwards. There is a kiosk that serves good coffee and excellent food. Good for soaking up the libations!',
  '2025-10-06 11:00:00+10',
  'Newcastle Beach',
  'Newcastle Beach',
  'Newcastle Beach, NSW',
  'Casual beach wear',
  'Monday October 6th from 11 AM onwards. Kiosk available for coffee and food.',
  false
);