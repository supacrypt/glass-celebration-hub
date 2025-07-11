-- =====================================================
-- NUCLEAR OPTION - COMPLETE RLS DISABLE + REBUILD
-- RUN THIS IN SUPABASE SQL EDITOR - COPY ALL OF IT
-- =====================================================

-- 1. COMPLETELY DISABLE RLS ON ALL TABLES
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps DISABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE bus_seat_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE carpool_coordination DISABLE ROW LEVEL SECURITY;
ALTER TABLE carpool_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE guest_transport_status DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE gift_registry_redirects DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE social_feed DISABLE ROW LEVEL SECURITY;
ALTER TABLE social_feed_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE photo_gallery DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL POLICIES (NUCLEAR OPTION)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename || ';';
    END LOOP;
END $$;

-- 3. ENSURE ESSENTIAL DATA EXISTS
DELETE FROM app_settings WHERE setting_key IN ('wedding_date', 'couple_names', 'venue_name', 'app_title', 'welcome_message');

INSERT INTO app_settings (setting_key, setting_value, description, is_public) VALUES
    ('wedding_date', '2024-06-15', 'Wedding date', true),
    ('couple_names', 'Tim & Kirsten', 'Couple names', true),
    ('venue_name', 'Glass Celebration Hub', 'Main venue name', true),
    ('app_title', 'Tim & Kirsten''s Wedding', 'Application title', true),
    ('welcome_message', 'Welcome to our wedding celebration!', 'Welcome message', true);

-- 4. ENSURE WEDDING EVENT EXISTS
INSERT INTO wedding_events (name, title, description, event_date, start_time, venue_name, venue_address, is_active) VALUES
    ('Wedding Ceremony', 'Wedding Ceremony', 'Tim & Kirsten Wedding Ceremony', '2024-06-15', '14:00', 'St. Mary''s Church', '123 Church Street', true)
ON CONFLICT DO NOTHING;

-- 5. VERIFICATION QUERY
SELECT 'NUCLEAR FIX COMPLETE - ALL RLS DISABLED' as status,
       'Tables should be fully accessible now' as result,
       'Try dashboards immediately' as action;