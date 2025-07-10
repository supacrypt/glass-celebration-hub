-- Fix Admin Authentication System
-- This migration addresses RLS policy issues and creates proper admin user seeding

-- 1. Create admin user seeding function
CREATE OR REPLACE FUNCTION public.ensure_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  admin_email text := 'admin@wedding.local';
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email;
  
  -- If admin user doesn't exist, create one
  IF admin_user_id IS NULL THEN
    -- Insert into auth.users (this would typically be done via Supabase Auth)
    -- For development, we'll create a placeholder that can be replaced
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      email_change_confirm_status,
      aud,
      role
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      admin_email,
      crypt('admin123', gen_salt('bf')), -- Default password for development
      now(),
      now(),
      now(),
      0,
      'authenticated',
      'authenticated'
    ) RETURNING id INTO admin_user_id;
  END IF;
  
  -- Ensure admin user has proper profile
  INSERT INTO public.profiles (
    user_id,
    email,
    first_name,
    last_name
  ) VALUES (
    admin_user_id,
    admin_email,
    'Admin',
    'User'
  ) ON CONFLICT (user_id) DO NOTHING;
  
  -- Ensure admin user has admin role
  INSERT INTO public.user_roles (
    user_id,
    role
  ) VALUES (
    admin_user_id,
    'admin'::app_role
  ) ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Admin user ensured with email: %', admin_email;
END;
$$;

-- 2. Optimize RLS policies with explicit role specification
-- Drop and recreate key policies with optimizations

-- App Settings policies
DROP POLICY IF EXISTS "Admins can manage app settings" ON public.app_settings;
CREATE POLICY "Admins can manage app settings" 
ON public.app_settings 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Public read access for app settings
CREATE POLICY "Public can read app settings" 
ON public.app_settings 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- User roles policies
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Users can update their own profiles
CREATE POLICY "Users can update their own profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(setting_key);

-- 4. Create development admin user
SELECT public.ensure_admin_user();

-- 5. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant access to the has_role function
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon;

COMMENT ON FUNCTION public.ensure_admin_user() IS 'Ensures admin user exists for development/testing';