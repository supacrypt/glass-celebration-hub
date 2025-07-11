-- Create FAQ categories table
CREATE TABLE IF NOT EXISTS faq_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text, -- lucide icon name
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create FAQ items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES faq_categories(id) ON DELETE SET NULL,
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faq_items(category_id);
CREATE INDEX IF NOT EXISTS idx_faq_items_featured ON faq_items(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_faq_items_active ON faq_items(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_faq_items_order ON faq_items(category_id, display_order);
CREATE INDEX IF NOT EXISTS idx_faq_categories_slug ON faq_categories(slug);
CREATE INDEX IF NOT EXISTS idx_faq_categories_order ON faq_categories(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Create policies for faq_categories
CREATE POLICY "Anyone can view active faq categories" ON faq_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all faq categories" ON faq_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN auth.users u ON ur.user_id = u.id 
      WHERE u.id = auth.uid() AND ur.role IN ('admin', 'couple')
    )
  );

-- Create policies for faq_items
CREATE POLICY "Anyone can view active faq items" ON faq_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all faq items" ON faq_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN auth.users u ON ur.user_id = u.id 
      WHERE u.id = auth.uid() AND ur.role IN ('admin', 'couple')
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_faq_categories_updated_at BEFORE UPDATE ON faq_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON faq_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment FAQ view count
CREATE OR REPLACE FUNCTION increment_faq_view_count(faq_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE faq_items 
  SET view_count = view_count + 1 
  WHERE id = faq_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default categories
INSERT INTO faq_categories (name, slug, description, icon, display_order, is_active) VALUES
  ('General', 'general', 'General wedding information', 'HelpCircle', 0, true),
  ('Venue & Ceremony', 'venue-ceremony', 'Location and ceremony details', 'MapPin', 1, true),
  ('Travel & Transportation', 'travel-transportation', 'Getting to and from the venue', 'Car', 2, true),
  ('Accommodation', 'accommodation', 'Where to stay', 'Bed', 3, true),
  ('Dress Code', 'dress-code', 'What to wear', 'Shirt', 4, true),
  ('Schedule & Events', 'schedule-events', 'Timeline and activities', 'Calendar', 5, true),
  ('Reception', 'reception', 'Reception details', 'PartyPopper', 6, true),
  ('Gifts', 'gifts', 'Registry and gift information', 'Gift', 7, true),
  ('Contact', 'contact', 'How to reach us', 'Phone', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert all FAQs from the hardcoded React component
DO $$
DECLARE
  venue_category_id uuid;
  travel_category_id uuid;
  general_category_id uuid;
  schedule_category_id uuid;
  dress_category_id uuid;
  accommodation_category_id uuid;
  reception_category_id uuid;
  gifts_category_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO venue_category_id FROM faq_categories WHERE slug = 'venue-ceremony';
  SELECT id INTO travel_category_id FROM faq_categories WHERE slug = 'travel-transportation';
  SELECT id INTO general_category_id FROM faq_categories WHERE slug = 'general';
  SELECT id INTO schedule_category_id FROM faq_categories WHERE slug = 'schedule-events';
  SELECT id INTO dress_category_id FROM faq_categories WHERE slug = 'dress-code';
  SELECT id INTO accommodation_category_id FROM faq_categories WHERE slug = 'accommodation';
  SELECT id INTO reception_category_id FROM faq_categories WHERE slug = 'reception';
  SELECT id INTO gifts_category_id FROM faq_categories WHERE slug = 'gifts';

  -- Insert the hardcoded FAQs from the React component
  INSERT INTO faq_items (category_id, question, answer, display_order, is_featured, is_active) VALUES
    -- Venue Change (Featured)
    (venue_category_id, 
     'Is the venue different to the one listed on the save the date?',
     'Yes! We apologise for any issues this has caused for people who already booked accommodation. The Edwards (the original venue) went into liquidation in February 2025 (and they kept our money!). The new venue is approximately 1 hour drive from Newcastle. A coach will be available to transport people between Newcastle and the wedding venue.',
     0, true, true),
    
    -- Parking
    (travel_category_id,
     'Is there plenty of parking at the wedding venue?',
     'Yes, there is plenty of on-site parking at Ben Ean.',
     1, false, true),
    
    -- Transportation
    (travel_category_id,
     'Are there other ways to get to the wedding venue besides driving?',
     'Yes. There will be two coaches available to transport guests to and from the wedding ceremony and reception. One coach will collect guests from Newcastle City, the other will collect guests staying in the Hunter Valley. Please indicate in the RSVP how many seats on the coach you would like and where you are staying. Availability is strictly on a first come, first served basis.',
     2, true, true),
    
    -- Indoor/Outdoor
    (venue_category_id,
     'Is the wedding indoor or outdoor?',
     'Both! The ceremony and cocktail hour are outside and the reception is inside. We have a wet weather plan in place, so everyone will stay warm and dry.',
     3, false, true),
    
    -- Children
    (general_category_id,
     'Are children invited?',
     'Although we love your little ones, we probably met you before children and we would love to spend the night celebrating with just you! Babes in arms excepted.',
     4, false, true),
    
    -- Recovery Breakfast
    (schedule_category_id,
     'Is there a recovery breakfast?',
     'While we do not have a formal recovery breakfast planned, we will be at Newcastle Beach from 11 am onwards on Monday October 6th. There is a kiosk that serves good coffee and excellent food. Good for soaking up the libations!',
     5, false, true),
    
    -- Other Events
    (schedule_category_id,
     'Any other fun stuff planned?',
     'Tim and Kirsten will be at the Prince of Mereweather pub from 4-8 pm on Saturday 4th of October. Stop in to have a drink and grab yourself a meal if you are hungry.',
     6, false, true),
    
    -- Dress Code
    (dress_category_id,
     'What''s the dress code?',
     'Dapper/Cocktail: Suits, dress chinos, button up shirt and optional tie. We love a pocket kerchief! Classy dress, pantsuit or jumpsuit.',
     7, true, true),
     
    -- Additional common FAQs
    -- Timing
    (general_category_id,
     'What time should I arrive?',
     'Please arrive 15 minutes early for the ceremony at 3:00 PM.',
     8, false, true),
     
    -- Plus Ones
    (general_category_id,
     'Can I bring a plus one?',
     'Plus ones are only permitted if indicated on your invitation. Please RSVP accordingly.',
     9, false, true),
     
    -- Accommodation
    (accommodation_category_id,
     'Is there accommodation nearby?',
     'Yes, we have recommendations for hotels in the Hunter Valley area. Please check our website for a list of suggested accommodations.',
     10, false, true),
     
    -- Dietary
    (reception_category_id,
     'What if I have dietary restrictions?',
     'Please let us know your dietary requirements when you RSVP. We can accommodate most restrictions.',
     11, false, true),
     
    -- Photos
    (general_category_id,
     'Can I take photos during the ceremony?',
     'We ask that you put devices away during the ceremony. Our photographers will capture everything!',
     12, false, true),
     
    -- Reception End Time
    (reception_category_id,
     'What time does the reception end?',
     'The reception will conclude at 11:00 PM.',
     13, false, true),
     
    -- Gifts
    (gifts_category_id,
     'Is there a gift registry?',
     'Your presence is the best present! If you wish to give a gift, we will have a wishing well at the reception.',
     14, false, true);
     
END $$;

-- Create a view for easy FAQ retrieval with category info
CREATE OR REPLACE VIEW faq_with_categories AS
SELECT 
  fi.*,
  fc.name as category_name,
  fc.slug as category_slug,
  fc.icon as category_icon,
  fc.description as category_description
FROM faq_items fi
LEFT JOIN faq_categories fc ON fi.category_id = fc.id
WHERE fi.is_active = true AND (fc.is_active = true OR fc.id IS NULL)
ORDER BY fc.display_order, fi.display_order;

-- Grant permissions on the view
GRANT SELECT ON faq_with_categories TO anon, authenticated;

-- Create function to get featured FAQs for home page
CREATE OR REPLACE FUNCTION get_featured_faqs(limit_count integer DEFAULT 5)
RETURNS TABLE (
  id uuid,
  question text,
  answer text,
  category_name text,
  category_icon text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fi.id,
    fi.question,
    fi.answer,
    fc.name as category_name,
    fc.icon as category_icon
  FROM faq_items fi
  LEFT JOIN faq_categories fc ON fi.category_id = fc.id
  WHERE fi.is_active = true 
    AND fi.is_featured = true
    AND (fc.is_active = true OR fc.id IS NULL)
  ORDER BY fi.display_order
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_featured_faqs TO anon, authenticated;