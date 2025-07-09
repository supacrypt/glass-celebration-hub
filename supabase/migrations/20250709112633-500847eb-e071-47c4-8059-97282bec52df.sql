-- Phase 1A: Critical Guest Data Fixes (Corrected)

-- 1. Fix spelling error: "Dan and Nicky Flurien" → "Dan and Nicky Fleuren"
UPDATE public.guests 
SET guest_names = 'Dan and Nicky Fleuren'
WHERE guest_names = 'Dan and Nicky Flurien';

-- 2. Update notes for Daniel to include his roles
UPDATE public.guests 
SET notes = 'Best Man, Developer, Admin of this app'
WHERE guest_names = 'Dan and Nicky Fleuren';

-- 3. Update category to reflect they are Wedding Party (from Wollongong)
UPDATE public.guests 
SET category = 'Wedding Party'
WHERE guest_names = 'Dan and Nicky Fleuren';

-- 4. Update Daniel's profile to show Nicky as his plus-one
UPDATE public.profiles 
SET has_plus_one = true,
    plus_one_name = 'Nicky Fleuren',
    plus_one_email = 'nicky.fleuren07@gmail.com',
    display_name = 'Daniel Fleuren'
WHERE user_id = '3c3a1bb8-c0f6-4865-b45d-04c79b1ea474';

-- 5. Update Nicky's profile display name for consistency
UPDATE public.profiles 
SET display_name = 'Nicky Fleuren'
WHERE user_id = '7bbc3a12-284f-455e-ae94-b2f14cf81ad2';

-- 6. Update guest RSVP status to attending since they're wedding party
UPDATE public.guests 
SET rsvp_status = 'attending',
    rsvp_count = 2,
    invite_sent = true,
    save_the_date_sent = true
WHERE guest_names = 'Dan and Nicky Fleuren';