-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active faq categories" ON faq_categories;
DROP POLICY IF EXISTS "Admins can manage all faq categories" ON faq_categories;
DROP POLICY IF EXISTS "Anyone can view active faq items" ON faq_items;
DROP POLICY IF EXISTS "Admins can manage all faq items" ON faq_items;

-- Create simpler policies that work with the current auth setup

-- FAQ Categories policies
CREATE POLICY "Anyone can view active faq categories" ON faq_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all faq categories" ON faq_categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage faq categories" ON faq_categories
  FOR ALL TO authenticated USING (true);

-- FAQ Items policies  
CREATE POLICY "Anyone can view active faq items" ON faq_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all faq items" ON faq_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage faq items" ON faq_items
  FOR ALL TO authenticated USING (true);

-- Also grant necessary permissions
GRANT ALL ON faq_categories TO authenticated;
GRANT ALL ON faq_items TO authenticated;
GRANT SELECT ON faq_categories TO anon;
GRANT SELECT ON faq_items TO anon;

-- Make sure the view permissions are correct
GRANT SELECT ON faq_with_categories TO anon, authenticated;