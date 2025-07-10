-- Create content_blocks table for admin-controlled guest experience
CREATE TABLE IF NOT EXISTS content_blocks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'rich_text', 'image', 'video', 'faq', 'event')),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  metadata jsonb DEFAULT '{}',
  order_index integer NOT NULL DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create content_sections table for organizing content
CREATE TABLE IF NOT EXISTS content_sections (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_enabled boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default content sections
INSERT INTO content_sections (id, name, description) VALUES
  ('hero', 'Hero Section', 'Main welcome message and visual elements'),
  ('faq', 'FAQ Section', 'Frequently asked questions for guests'),
  ('events', 'Event Timeline', 'Wedding event schedule and details'),
  ('venue', 'Venue Information', 'Location details and directions'),
  ('dress_code', 'Dress Code', 'Attire guidelines for guests'),
  ('accommodations', 'Accommodations', 'Hotel and lodging recommendations'),
  ('transport', 'Transportation', 'Travel and parking information'),
  ('contact', 'Contact Information', 'Emergency contacts and support')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_blocks_section ON content_blocks(section);
CREATE INDEX IF NOT EXISTS idx_content_blocks_order ON content_blocks(section, order_index);
CREATE INDEX IF NOT EXISTS idx_content_blocks_visible ON content_blocks(is_visible);

-- Enable Row Level Security (RLS)
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

-- Create policies for content_blocks
CREATE POLICY "Anyone can view visible content blocks" ON content_blocks
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage all content blocks" ON content_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN auth.users u ON ur.user_id = u.id 
      WHERE u.id = auth.uid() AND ur.role IN ('admin', 'couple')
    )
  );

-- Create policies for content_sections
CREATE POLICY "Anyone can view enabled content sections" ON content_sections
  FOR SELECT USING (is_enabled = true);

CREATE POLICY "Admins can manage all content sections" ON content_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN auth.users u ON ur.user_id = u.id 
      WHERE u.id = auth.uid() AND ur.role IN ('admin', 'couple')
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample FAQ content blocks
INSERT INTO content_blocks (section, type, title, content, order_index, is_visible) VALUES
  ('faq', 'faq', 'What time should I arrive?', 'Please arrive 15 minutes early for the ceremony at 4:00 PM.', 1, true),
  ('faq', 'faq', 'Is there parking at the venue?', 'Yes, there is plenty of on-site parking at Ben Ean.', 2, true),
  ('faq', 'faq', 'Is the ceremony indoor or outdoor?', 'Both! The ceremony and cocktail hour are outside, reception is inside. We have a wet weather plan.', 3, true),
  ('faq', 'faq', 'What is the dress code?', 'Semi-formal attire is recommended. Please avoid white and consider the outdoor setting.', 4, true),
  ('faq', 'faq', 'Can I bring a plus one?', 'Plus ones are only permitted if indicated on your invitation. Please RSVP accordingly.', 5, true),
  ('faq', 'faq', 'Is there accommodation nearby?', 'Yes, we have recommendations for hotels in the area. Check the Accommodations section.', 6, true),
  ('faq', 'faq', 'What if I have dietary restrictions?', 'Please let us know your dietary requirements when you RSVP. We can accommodate most restrictions.', 7, true),
  ('faq', 'faq', 'Can I take photos during the ceremony?', 'We ask that you put devices away during the ceremony. Our photographers will capture everything!', 8, true),
  ('faq', 'faq', 'What time does the reception end?', 'The reception will conclude at 11:00 PM.', 9, true),
  ('faq', 'faq', 'Is there a gift registry?', 'Your presence is the best present! If you wish to give a gift, details are in the Gift section.', 10, true)
ON CONFLICT DO NOTHING;

-- Insert sample hero content
INSERT INTO content_blocks (section, type, title, content, order_index, is_visible) VALUES
  ('hero', 'rich_text', 'Welcome Message', '<h1>Welcome to Our Wedding</h1><p>Join us as we celebrate our love story and begin our new chapter together.</p>', 1, true),
  ('hero', 'text', 'Wedding Date', 'Saturday, March 15, 2025', 2, true),
  ('hero', 'text', 'Wedding Time', '4:00 PM Ceremony', 3, true),
  ('hero', 'text', 'Venue Name', 'Ben Ean Pokolbin', 4, true)
ON CONFLICT DO NOTHING;

-- Insert sample contact content
INSERT INTO content_blocks (section, type, title, content, order_index, is_visible) VALUES
  ('contact', 'text', 'Emergency Contact', 'For urgent matters on the day: +61 XXX XXX XXX', 1, true),
  ('contact', 'text', 'Wedding Coordinator', 'Sarah Johnson: sarah@weddingcoordinator.com', 2, true),
  ('contact', 'text', 'Venue Contact', 'Ben Ean: (02) 4998 7777', 3, true)
ON CONFLICT DO NOTHING;