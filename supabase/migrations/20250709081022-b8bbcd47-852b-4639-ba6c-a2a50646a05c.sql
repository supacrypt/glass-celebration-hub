-- Fix photo visibility for admins - they should see ALL photos regardless of approval status
-- Update the existing policy to be more permissive for admins

-- First, let's add a comprehensive admin policy for viewing all photos
CREATE POLICY "Admins can view all photos regardless of approval status"
ON public.photos
FOR SELECT 
TO public
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  (is_approved = true)
);

-- Drop the old restrictive policy that was blocking admin access
DROP POLICY IF EXISTS "Everyone can view approved photos" ON public.photos;

-- Also ensure admins can see pending photos in the enhanced media management
-- Update gallery_photos table to be more accessible to admins
DROP POLICY IF EXISTS "Everyone can view published gallery photos" ON public.gallery_photos;

CREATE POLICY "Everyone can view published gallery photos and admins can see all"
ON public.gallery_photos
FOR SELECT 
TO public
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  (is_published = true)
);

-- Ensure venue images are also accessible for admin management
DROP POLICY IF EXISTS "Everyone can view published venue images" ON public.venue_images;

CREATE POLICY "Everyone can view published venue images and admins can see all"
ON public.venue_images
FOR SELECT 
TO public
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  (is_published = true)
);