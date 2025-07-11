-- =====================================================
-- COMPREHENSIVE WEDDING SYSTEM DATABASE SCHEMA
-- Glass Celebration Hub - Complete Wedding Management System
-- Generated: January 12, 2025
-- =====================================================

-- This is the complete, up-to-date database schema for the wedding website
-- It includes all tables, functions, views, policies, and triggers needed
-- for the current frontend implementation

-- =====================================================
-- 1. CORE USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- User profiles table (core authentication and roles)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'guest' CHECK (role IN ('admin', 'guest')),
    avatar_url VARCHAR(500),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- App settings for wedding configuration
CREATE TABLE IF NOT EXISTS app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'text',
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. WEDDING EVENTS SYSTEM
-- =====================================================

-- Wedding events (ceremony, reception, etc.)
CREATE TABLE IF NOT EXISTS wedding_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue_name VARCHAR(200),
    venue_address TEXT,
    venue_coordinates FLOAT[2], -- [longitude, latitude]
    dress_code VARCHAR(100),
    is_main_event BOOLEAN DEFAULT false,
    requires_rsvp BOOLEAN DEFAULT true,
    max_guests INTEGER,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVP system for events
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES wedding_events(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('attending', 'declined', 'pending', 'maybe')),
    guest_count INTEGER DEFAULT 1,
    dietary_restrictions TEXT,
    message TEXT,
    plus_one_name VARCHAR(200),
    table_assignment VARCHAR(50),
    meal_preference VARCHAR(100),
    song_request TEXT,
    accommodation_needed BOOLEAN DEFAULT false,
    transportation_needed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Event attendance summary view
CREATE OR REPLACE VIEW event_attendance_summary AS
SELECT 
    e.id as event_id,
    e.name as event_name,
    e.event_date,
    e.venue_name,
    COUNT(r.id) as total_rsvps,
    COUNT(r.id) FILTER (WHERE r.status = 'attending') as attending_count,
    COUNT(r.id) FILTER (WHERE r.status = 'declined') as declined_count,
    COUNT(r.id) FILTER (WHERE r.status = 'pending') as pending_count,
    COUNT(r.id) FILTER (WHERE r.status = 'maybe') as maybe_count,
    SUM(r.guest_count) FILTER (WHERE r.status = 'attending') as total_attending_guests,
    e.max_guests,
    CASE 
        WHEN e.max_guests IS NOT NULL 
        THEN GREATEST(0, e.max_guests - COALESCE(SUM(r.guest_count) FILTER (WHERE r.status = 'attending'), 0))
        ELSE NULL 
    END as remaining_capacity
FROM wedding_events e
LEFT JOIN rsvps r ON e.id = r.event_id
WHERE e.is_active = true
GROUP BY e.id, e.name, e.event_date, e.venue_name, e.max_guests
ORDER BY e.event_date, e.display_order;

-- =====================================================
-- 3. ACCOMMODATION MANAGEMENT SYSTEM
-- =====================================================

-- Accommodation categories
CREATE TABLE IF NOT EXISTS accommodation_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accommodation options
CREATE TABLE IF NOT EXISTS accommodation_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES accommodation_categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100), -- hotel, airbnb, venue, etc.
    area VARCHAR(100),
    address TEXT,
    description TEXT,
    website_url VARCHAR(500),
    booking_url VARCHAR(500),
    phone VARCHAR(50),
    email VARCHAR(100),
    price_range VARCHAR(100),
    distance_from_venue VARCHAR(100),
    amenities TEXT[],
    image_url VARCHAR(500),
    coordinates FLOAT[2], -- [longitude, latitude] for mapping
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TRANSPORTATION BOOKING SYSTEM
-- =====================================================

-- Transportation categories
CREATE TABLE IF NOT EXISTS transportation_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transportation options
CREATE TABLE IF NOT EXISTS transportation_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES transportation_categories(id) ON DELETE CASCADE,
    method_name VARCHAR(100) NOT NULL,
    description TEXT,
    pickup_locations TEXT[],
    dropoff_locations TEXT[],
    schedule_info TEXT,
    cost_info VARCHAR(200),
    booking_required BOOLEAN DEFAULT false,
    booking_url VARCHAR(500),
    booking_phone VARCHAR(50),
    capacity_info VARCHAR(100),
    duration_info VARCHAR(100),
    special_notes TEXT,
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transportation schedules
CREATE TABLE IF NOT EXISTS transportation_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transportation_id UUID REFERENCES transportation_options(id) ON DELETE CASCADE,
    departure_time TIME NOT NULL,
    departure_location VARCHAR(200),
    arrival_time TIME,
    arrival_location VARCHAR(200),
    available_dates DATE[],
    max_capacity INTEGER,
    current_bookings INTEGER DEFAULT 0,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bus seat bookings
CREATE TABLE IF NOT EXISTS bus_seat_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    transportation_schedule_id UUID REFERENCES transportation_schedules(id) ON DELETE CASCADE,
    seat_number INTEGER,
    passenger_name VARCHAR(200) NOT NULL,
    contact_phone VARCHAR(50),
    special_requirements TEXT,
    booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'waitlist')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(transportation_schedule_id, seat_number)
);

-- Carpool coordination
CREATE TABLE IF NOT EXISTS carpool_coordination (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    coordination_type VARCHAR(20) CHECK (coordination_type IN ('offering', 'requesting')),
    departure_location VARCHAR(200),
    departure_time TIMESTAMP WITH TIME ZONE,
    available_seats INTEGER, -- for drivers offering rides
    contact_phone VARCHAR(50),
    contact_preferences TEXT,
    special_requirements TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'full', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carpool participants
CREATE TABLE IF NOT EXISTS carpool_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carpool_id UUID REFERENCES carpool_coordination(id) ON DELETE CASCADE,
    participant_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    passenger_name VARCHAR(200) NOT NULL,
    contact_phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(carpool_id, participant_user_id)
);

-- Transportation status tracking
CREATE TABLE IF NOT EXISTS guest_transport_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    transport_method VARCHAR(50), -- 'bus', 'carpool_driver', 'carpool_passenger', 'own_transport', 'other'
    transport_details JSONB DEFAULT '{}', -- specific booking/arrangement details
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'arranged', 'confirmed', 'needs_reminder')),
    last_reminder_sent TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. GIFT REGISTRY MANAGEMENT
-- =====================================================

-- Gift registry redirects (external services)
CREATE TABLE IF NOT EXISTS gift_registry_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    service_description TEXT,
    redirect_url VARCHAR(500) NOT NULL,
    button_text VARCHAR(100) DEFAULT 'View Registry',
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CONTACT MANAGEMENT SYSTEM
-- =====================================================

-- Contact categories
CREATE TABLE IF NOT EXISTS contact_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced contacts
CREATE TABLE IF NOT EXISTS contact_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES contact_categories(id) ON DELETE CASCADE,
    contact_type VARCHAR(50) NOT NULL, -- coordinator, emergency, venue, vendor
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    phone_primary VARCHAR(50),
    phone_secondary VARCHAR(50),
    email_primary VARCHAR(100),
    email_secondary VARCHAR(100),
    address TEXT,
    availability_hours TEXT,
    emergency_contact BOOLEAN DEFAULT false,
    instructions TEXT,
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. CONTENT MANAGEMENT SYSTEM
-- =====================================================

-- Universal content blocks for page-specific content
CREATE TABLE IF NOT EXISTS content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug VARCHAR(50) NOT NULL,
    section_key VARCHAR(100) NOT NULL,
    title VARCHAR(200),
    content TEXT,
    content_type VARCHAR(20) DEFAULT 'text' CHECK (content_type IN ('text', 'html', 'markdown', 'json')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page_slug, section_key)
);

-- FAQ management
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. SOCIAL & MESSAGING SYSTEM
-- =====================================================

-- Social feed posts
CREATE TABLE IF NOT EXISTS social_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    post_type VARCHAR(20) DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'video', 'announcement')),
    is_pinned BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social feed likes
CREATE TABLE IF NOT EXISTS social_feed_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES social_feed(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file')),
    file_url VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. MEDIA & STORAGE SYSTEM
-- =====================================================

-- Photo gallery
CREATE TABLE IF NOT EXISTS photo_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Events and RSVPs indexes
CREATE INDEX IF NOT EXISTS idx_wedding_events_date ON wedding_events(event_date);
CREATE INDEX IF NOT EXISTS idx_wedding_events_active ON wedding_events(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_rsvps_user_event ON rsvps(user_id, event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_event_status ON rsvps(event_id, status);

-- Accommodation indexes
CREATE INDEX IF NOT EXISTS idx_accommodation_category_active ON accommodation_options(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_accommodation_featured ON accommodation_options(featured, is_active);
CREATE INDEX IF NOT EXISTS idx_accommodation_order ON accommodation_options(display_order);

-- Transportation indexes
CREATE INDEX IF NOT EXISTS idx_transportation_category_active ON transportation_options(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_transportation_schedules_transport ON transportation_schedules(transportation_id, is_active);
CREATE INDEX IF NOT EXISTS idx_bus_bookings_schedule ON bus_seat_bookings(transportation_schedule_id);
CREATE INDEX IF NOT EXISTS idx_carpool_type_status ON carpool_coordination(coordination_type, status);
CREATE INDEX IF NOT EXISTS idx_transport_status_user ON guest_transport_status(user_id);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_content_blocks_page_active ON content_blocks(page_slug, is_active);
CREATE INDEX IF NOT EXISTS idx_content_blocks_order ON content_blocks(page_slug, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_active_order ON faqs(is_active, display_order);

-- Social indexes
CREATE INDEX IF NOT EXISTS idx_social_feed_active ON social_feed(is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_feed_user ON social_feed(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_recipient ON chat_messages(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id, created_at DESC);

-- Gallery indexes
CREATE INDEX IF NOT EXISTS idx_photo_gallery_approved ON photo_gallery(is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photo_gallery_featured ON photo_gallery(is_featured, display_order);

-- =====================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_seat_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE carpool_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE carpool_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_transport_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_registry_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_gallery ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all profiles" ON user_profiles FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- App settings policies
CREATE POLICY "Public can view public settings" ON app_settings FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can manage all settings" ON app_settings FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- Wedding events policies
CREATE POLICY "Public can view active events" ON wedding_events FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage events" ON wedding_events FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- RSVP policies
CREATE POLICY "Users can view own RSVPs" ON rsvps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own RSVPs" ON rsvps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all RSVPs" ON rsvps FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- Accommodation policies
CREATE POLICY "Public can view active accommodation categories" ON accommodation_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active accommodation options" ON accommodation_options FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage accommodation" ON accommodation_categories FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);
CREATE POLICY "Admins can manage accommodation options" ON accommodation_options FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- Transportation policies
CREATE POLICY "Public can view active transportation categories" ON transportation_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active transportation options" ON transportation_options FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active transportation schedules" ON transportation_schedules FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage transportation" ON transportation_categories FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);
CREATE POLICY "Admins can manage transportation options" ON transportation_options FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);
CREATE POLICY "Admins can manage transportation schedules" ON transportation_schedules FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- Transportation booking policies
CREATE POLICY "Users can view own transport bookings" ON bus_seat_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transport bookings" ON bus_seat_bookings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view carpool coordination" ON carpool_coordination FOR SELECT USING (true);
CREATE POLICY "Users can manage own carpool coordination" ON carpool_coordination FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view carpool participants" ON carpool_participants FOR SELECT USING (true);
CREATE POLICY "Users can manage own transport status" ON guest_transport_status FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transport data" ON bus_seat_bookings FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);
CREATE POLICY "Admins can view all carpool data" ON carpool_coordination FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);
CREATE POLICY "Admins can view all transport status" ON guest_transport_status FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- Gift registry policies
CREATE POLICY "Public can view active gift registries" ON gift_registry_redirects FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage gift registries" ON gift_registry_redirects FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- Contact policies
CREATE POLICY "Public can view active contact categories" ON contact_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active contact details" ON contact_details FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage contacts" ON contact_categories FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);
CREATE POLICY "Admins can manage contact details" ON contact_details FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- Content management policies
CREATE POLICY "Public can view active content blocks" ON content_blocks FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active FAQs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage content blocks" ON content_blocks FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);
CREATE POLICY "Admins can manage FAQs" ON faqs FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- Social feed policies
CREATE POLICY "Public can view approved posts" ON social_feed FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create posts" ON social_feed FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON social_feed FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can like posts" ON social_feed_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all posts" ON social_feed FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- Chat message policies
CREATE POLICY "Users can view own messages" ON chat_messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can send messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON chat_messages FOR UPDATE USING (auth.uid() = sender_id);

-- Photo gallery policies
CREATE POLICY "Public can view approved photos" ON photo_gallery FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can upload photos" ON photo_gallery FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own photos" ON photo_gallery FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all photos" ON photo_gallery FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin')
);

-- =====================================================
-- 12. TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at columns
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at 
    BEFORE UPDATE ON app_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_events_updated_at 
    BEFORE UPDATE ON wedding_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rsvps_updated_at 
    BEFORE UPDATE ON rsvps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accommodation_categories_updated_at 
    BEFORE UPDATE ON accommodation_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accommodation_options_updated_at 
    BEFORE UPDATE ON accommodation_options 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transportation_categories_updated_at 
    BEFORE UPDATE ON transportation_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transportation_options_updated_at 
    BEFORE UPDATE ON transportation_options 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transportation_schedules_updated_at 
    BEFORE UPDATE ON transportation_schedules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bus_seat_bookings_updated_at 
    BEFORE UPDATE ON bus_seat_bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carpool_coordination_updated_at 
    BEFORE UPDATE ON carpool_coordination 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carpool_participants_updated_at 
    BEFORE UPDATE ON carpool_participants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guest_transport_status_updated_at 
    BEFORE UPDATE ON guest_transport_status 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gift_registry_redirects_updated_at 
    BEFORE UPDATE ON gift_registry_redirects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_categories_updated_at 
    BEFORE UPDATE ON contact_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_details_updated_at 
    BEFORE UPDATE ON contact_details 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at 
    BEFORE UPDATE ON content_blocks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at 
    BEFORE UPDATE ON faqs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_feed_updated_at 
    BEFORE UPDATE ON social_feed 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at 
    BEFORE UPDATE ON chat_messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photo_gallery_updated_at 
    BEFORE UPDATE ON photo_gallery 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Safe RSVP upsert function
CREATE OR REPLACE FUNCTION safe_upsert_rsvp(
    p_user_id UUID,
    p_event_id UUID,
    p_status TEXT,
    p_guest_count INTEGER DEFAULT 1,
    p_dietary_restrictions TEXT DEFAULT NULL,
    p_message TEXT DEFAULT NULL,
    p_plus_one_name TEXT DEFAULT NULL,
    p_table_assignment TEXT DEFAULT NULL,
    p_meal_preference TEXT DEFAULT NULL,
    p_song_request TEXT DEFAULT NULL,
    p_accommodation_needed BOOLEAN DEFAULT FALSE,
    p_transportation_needed BOOLEAN DEFAULT FALSE
) RETURNS UUID AS $$
DECLARE
    existing_rsvp_id UUID;
    result_id UUID;
BEGIN
    -- Check if RSVP already exists
    SELECT id INTO existing_rsvp_id
    FROM rsvps
    WHERE user_id = p_user_id AND event_id = p_event_id;
    
    IF existing_rsvp_id IS NOT NULL THEN
        -- Update existing RSVP
        UPDATE rsvps
        SET 
            status = p_status,
            guest_count = p_guest_count,
            dietary_restrictions = p_dietary_restrictions,
            message = p_message,
            plus_one_name = p_plus_one_name,
            table_assignment = p_table_assignment,
            meal_preference = p_meal_preference,
            song_request = p_song_request,
            accommodation_needed = p_accommodation_needed,
            transportation_needed = p_transportation_needed,
            updated_at = now()
        WHERE id = existing_rsvp_id;
        
        result_id := existing_rsvp_id;
    ELSE
        -- Insert new RSVP
        INSERT INTO rsvps (
            user_id, event_id, status, guest_count, dietary_restrictions,
            message, plus_one_name, table_assignment, meal_preference,
            song_request, accommodation_needed, transportation_needed
        ) VALUES (
            p_user_id, p_event_id, p_status, p_guest_count, p_dietary_restrictions,
            p_message, p_plus_one_name, p_table_assignment, p_meal_preference,
            p_song_request, p_accommodation_needed, p_transportation_needed
        ) RETURNING id INTO result_id;
    END IF;
    
    RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions on the function
GRANT EXECUTE ON FUNCTION safe_upsert_rsvp(UUID, UUID, TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) 
TO authenticated, anon;

-- =====================================================
-- 13. GRANT PERMISSIONS
-- =====================================================

-- Grant select permissions on views
GRANT SELECT ON event_attendance_summary TO authenticated, anon;

-- Grant usage on all sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

-- Final verification query
SELECT 
    'Wedding System Schema Deployed Successfully' as status,
    COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';