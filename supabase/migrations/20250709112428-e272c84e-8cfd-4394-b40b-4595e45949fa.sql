-- Phase 1A: Critical Guest Data Fixes

-- 1. Fix spelling error: "Dan and Nicky Flurien" → "Dan and Nicky Fleuren"
UPDATE public.guests 
SET guest_names = 'Dan and Nicky Fleuren'
WHERE guest_names = 'Dan and Nicky Flurien';

-- 2. Update notes for Daniel to include his roles
UPDATE public.guests 
SET notes = 'Best Man, Developer, Admin of this app'
WHERE guest_names = 'Dan and Nicky Fleuren';

-- 3. Update category to reflect they are Newcastle friends/wedding party
UPDATE public.guests 
SET category = 'Wedding Party'
WHERE guest_names = 'Dan and Nicky Fleuren';

-- 4. Ensure Daniel Fleuren has admin role (check if profile exists first)
-- Create profile for Daniel if it doesn't exist
INSERT INTO public.profiles (
  user_id, 
  email, 
  first_name, 
  last_name,
  display_name,
  has_plus_one,
  plus_one_name,
  plus_one_email
) VALUES (
  'daniel-fleuren-admin-uuid',
  'daniel.j.fleuren@gmail.com',
  'Daniel',
  'Fleuren',
  'Daniel Fleuren',
  true,
  'Nicky Fleuren',
  'nicky.fleuren07@gmail.com'
) ON CONFLICT (email) DO UPDATE SET
  has_plus_one = true,
  plus_one_name = 'Nicky Fleuren',
  plus_one_email = 'nicky.fleuren07@gmail.com';

-- 5. Create profile for Nicky if it doesn't exist
INSERT INTO public.profiles (
  user_id,
  email,
  first_name,
  last_name,
  display_name
) VALUES (
  'nicky-fleuren-guest-uuid',
  'nicky.fleuren07@gmail.com',
  'Nicky',
  'Fleuren',
  'Nicky Fleuren'
) ON CONFLICT (email) DO NOTHING;

-- 6. Ensure Daniel has admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('daniel-fleuren-admin-uuid', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 7. Update guest RSVP status to attending since they're wedding party
UPDATE public.guests 
SET rsvp_status = 'attending',
    rsvp_count = 2
WHERE guest_names = 'Dan and Nicky Fleuren';