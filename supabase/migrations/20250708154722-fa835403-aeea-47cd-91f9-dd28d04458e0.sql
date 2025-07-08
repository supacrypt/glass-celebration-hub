-- Add new columns to profiles table for enhanced user data collection
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS postcode text,
ADD COLUMN IF NOT EXISTS mobile text,
ADD COLUMN IF NOT EXISTS has_plus_one boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS plus_one_email text,
ADD COLUMN IF NOT EXISTS plus_one_name text,
ADD COLUMN IF NOT EXISTS plus_one_invited boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS rsvp_completed boolean DEFAULT false;

-- Create index for faster RSVP status queries
CREATE INDEX IF NOT EXISTS idx_profiles_rsvp_completed ON public.profiles(rsvp_completed);

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    email, 
    first_name, 
    last_name,
    mobile,
    address,
    state,
    country,
    postcode,
    has_plus_one,
    plus_one_name,
    plus_one_email,
    rsvp_completed
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'mobile',
    new.raw_user_meta_data ->> 'address',
    new.raw_user_meta_data ->> 'state',
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'postcode',
    COALESCE((new.raw_user_meta_data ->> 'has_plus_one')::boolean, false),
    new.raw_user_meta_data ->> 'plus_one_name',
    new.raw_user_meta_data ->> 'plus_one_email',
    false
  );
  
  RETURN new;
END;
$$;