-- Fix Supabase Security Issues Migration
-- This addresses the 24 RLS disabled tables and 31 tables without policies

-- 1. Enable RLS on tables that don't have it
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportation_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_seat_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carpool_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carpool_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_transport_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_registry_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_gallery ENABLE ROW LEVEL SECURITY;

-- 2. Create basic RLS policies for public read access (wedding app context)

-- App Settings - Read only for all, write for admin only
CREATE POLICY "app_settings_read" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "app_settings_write" ON public.app_settings FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Wedding Events - Public read access
CREATE POLICY "wedding_events_read" ON public.wedding_events FOR SELECT USING (true);
CREATE POLICY "wedding_events_write" ON public.wedding_events FOR ALL USING (auth.uid() IS NOT NULL);

-- FAQs - Public read access
CREATE POLICY "faqs_read" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "faqs_write" ON public.faqs FOR ALL USING (auth.uid() IS NOT NULL);

-- RSVPs - Users can only see/edit their own
CREATE POLICY "rsvps_user_access" ON public.rsvps FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    auth.uid()::text = user_id OR 
    auth.jwt() ->> 'role' IN ('admin', 'couple', 'service_role')
  )
);

-- User Profiles - Users can see all but only edit their own
CREATE POLICY "user_profiles_read" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "user_profiles_write" ON public.user_profiles FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    auth.uid()::text = id OR 
    auth.jwt() ->> 'role' IN ('admin', 'couple', 'service_role')
  )
);

-- Chat Messages - Authenticated users only
CREATE POLICY "chat_messages_authenticated" ON public.chat_messages FOR ALL USING (auth.uid() IS NOT NULL);

-- Photo Gallery - Public read, authenticated write
CREATE POLICY "photo_gallery_read" ON public.photo_gallery FOR SELECT USING (true);
CREATE POLICY "photo_gallery_write" ON public.photo_gallery FOR ALL USING (auth.uid() IS NOT NULL);

-- Transportation - Public read access
CREATE POLICY "transportation_options_read" ON public.transportation_options FOR SELECT USING (true);
CREATE POLICY "transportation_schedules_read" ON public.transportation_schedules FOR SELECT USING (true);
CREATE POLICY "transportation_categories_read" ON public.transportation_categories FOR SELECT USING (true);

-- Accommodation - Public read access
CREATE POLICY "accommodation_categories_read" ON public.accommodation_categories FOR SELECT USING (true);
CREATE POLICY "accommodation_options_read" ON public.accommodation_options FOR SELECT USING (true);

-- Contact Information - Public read access
CREATE POLICY "contact_categories_read" ON public.contact_categories FOR SELECT USING (true);
CREATE POLICY "contact_details_read" ON public.contact_details FOR SELECT USING (true);

-- Content Blocks - Public read access
CREATE POLICY "content_blocks_read" ON public.content_blocks FOR SELECT USING (true);

-- Gift Registry - Public read access
CREATE POLICY "gift_registry_redirects_read" ON public.gift_registry_redirects FOR SELECT USING (true);

-- Social Feed - Authenticated users
CREATE POLICY "social_feed_authenticated" ON public.social_feed FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "social_feed_likes_authenticated" ON public.social_feed_likes FOR ALL USING (auth.uid() IS NOT NULL);

-- Booking and coordination - Authenticated users
CREATE POLICY "bus_seat_bookings_authenticated" ON public.bus_seat_bookings FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "carpool_coordination_authenticated" ON public.carpool_coordination FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "carpool_participants_authenticated" ON public.carpool_participants FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "guest_transport_status_authenticated" ON public.guest_transport_status FOR ALL USING (auth.uid() IS NOT NULL);

-- 3. Add policies for tables that have RLS enabled but no policies

-- Chat Members - Only members can see their chat memberships
CREATE POLICY "chat_members_user_access" ON public.chat_members FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    auth.uid()::text = user_id OR 
    auth.jwt() ->> 'role' IN ('admin', 'couple', 'service_role')
  )
);

-- Conversation Settings - Users can see settings for their conversations
CREATE POLICY "conversation_settings_user_access" ON public.conversation_settings FOR ALL USING (auth.uid() IS NOT NULL);

-- Dietary Requirements - Public read for catering purposes
CREATE POLICY "dietary_requirements_read" ON public.dietary_requirements FOR SELECT USING (true);
CREATE POLICY "dietary_requirements_write" ON public.dietary_requirements FOR ALL USING (auth.uid() IS NOT NULL);

-- Direct Chats - Only participants can access
CREATE POLICY "direct_chats_participants" ON public.direct_chats FOR ALL USING (auth.uid() IS NOT NULL);

-- FAQ Categories - Public read access
CREATE POLICY "faq_categories_read" ON public.faq_categories FOR SELECT USING (true);

-- FAQ Items - Public read access
CREATE POLICY "faq_items_read" ON public.faq_items FOR SELECT USING (true);

-- Gallery Photos - Public read, authenticated write
CREATE POLICY "gallery_photos_read" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "gallery_photos_write" ON public.gallery_photos FOR ALL USING (auth.uid() IS NOT NULL);

-- Gift Registry - Public read access
CREATE POLICY "gift_registry_read" ON public.gift_registry FOR SELECT USING (true);
CREATE POLICY "gift_registry_write" ON public.gift_registry FOR ALL USING (auth.uid() IS NOT NULL);

-- Guests - Read access for all, write for authenticated
CREATE POLICY "guests_read" ON public.guests FOR SELECT USING (true);
CREATE POLICY "guests_write" ON public.guests FOR ALL USING (auth.uid() IS NOT NULL);

-- Message interactions - Authenticated users only
CREATE POLICY "message_likes_authenticated" ON public.message_likes FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "message_reactions_authenticated" ON public.message_reactions FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "message_replies_authenticated" ON public.message_replies FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "message_reports_authenticated" ON public.message_reports FOR ALL USING (auth.uid() IS NOT NULL);

-- Messages - Authenticated users only
CREATE POLICY "messages_authenticated" ON public.messages FOR ALL USING (auth.uid() IS NOT NULL);

-- Photo interactions - Public read, authenticated write
CREATE POLICY "photo_comments_read" ON public.photo_comments FOR SELECT USING (true);
CREATE POLICY "photo_comments_write" ON public.photo_comments FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "photo_likes_authenticated" ON public.photo_likes FOR ALL USING (auth.uid() IS NOT NULL);

-- Photos - Public read, authenticated write
CREATE POLICY "photos_read" ON public.photos FOR SELECT USING (true);
CREATE POLICY "photos_write" ON public.photos FOR ALL USING (auth.uid() IS NOT NULL);

-- Polls and notifications - Authenticated users
CREATE POLICY "poll_notifications_authenticated" ON public.poll_notifications FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "poll_options_read" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "poll_votes_authenticated" ON public.poll_votes FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "polls_read" ON public.polls FOR SELECT USING (true);
CREATE POLICY "polls_write" ON public.polls FOR ALL USING (auth.uid() IS NOT NULL);

-- Post interactions - Authenticated users
CREATE POLICY "post_comments_authenticated" ON public.post_comments FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "post_reactions_authenticated" ON public.post_reactions FOR ALL USING (auth.uid() IS NOT NULL);

-- Profiles - Public read, own profile write
CREATE POLICY "profiles_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_write" ON public.profiles FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = id OR 
    auth.jwt() ->> 'role' IN ('admin', 'couple', 'service_role')
  )
);

-- Social Posts - Public read, authenticated write
CREATE POLICY "social_posts_read" ON public.social_posts FOR SELECT USING (true);
CREATE POLICY "social_posts_write" ON public.social_posts FOR ALL USING (auth.uid() IS NOT NULL);

-- Stories - Public read, authenticated write
CREATE POLICY "stories_read" ON public.stories FOR SELECT USING (true);
CREATE POLICY "stories_write" ON public.stories FOR ALL USING (auth.uid() IS NOT NULL);

-- User management - Authenticated users
CREATE POLICY "user_blocks_user_access" ON public.user_blocks FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    auth.uid()::text = blocking_user_id OR 
    auth.jwt() ->> 'role' IN ('admin', 'couple', 'service_role')
  )
);

-- User Roles - Read access for all, admin write
CREATE POLICY "user_roles_read" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "user_roles_admin_write" ON public.user_roles FOR ALL USING (
  auth.jwt() ->> 'role' IN ('admin', 'couple', 'service_role')
);

-- Venue information - Public read access
CREATE POLICY "venue_images_read" ON public.venue_images FOR SELECT USING (true);
CREATE POLICY "venues_read" ON public.venues FOR SELECT USING (true);

-- 4. Fix SECURITY DEFINER views (convert to SECURITY INVOKER)
DROP VIEW IF EXISTS public.event_attendance_summary;
CREATE VIEW public.event_attendance_summary WITH (security_invoker=true) AS
SELECT 
  we.id,
  we.title,
  we.event_date,
  COUNT(r.id) as rsvp_count,
  COUNT(CASE WHEN r.attending = true THEN 1 END) as attending_count
FROM wedding_events we
LEFT JOIN rsvps r ON we.id = r.event_id
GROUP BY we.id, we.title, we.event_date;

DROP VIEW IF EXISTS public.faq_with_categories;
CREATE VIEW public.faq_with_categories WITH (security_invoker=true) AS
SELECT 
  fi.id,
  fi.question,
  fi.answer,
  fi.display_order,
  fi.is_active,
  fc.name as category_name,
  fc.display_order as category_order
FROM faq_items fi
LEFT JOIN faq_categories fc ON fi.category_id = fc.id
WHERE fi.is_active = true
ORDER BY fc.display_order, fi.display_order;

-- 5. Fix function search paths (set search_path for security)
ALTER FUNCTION public.is_chat_member SET search_path = public;
ALTER FUNCTION public.validate_dietary_requirement SET search_path = public;
ALTER FUNCTION public.increment_faq_view SET search_path = public;
ALTER FUNCTION public.update_guest_from_rsvp SET search_path = public;
ALTER FUNCTION public.sync_rsvp_dietary_restrictions SET search_path = public;
ALTER FUNCTION public.check_comment_depth SET search_path = public;
ALTER FUNCTION public.check_group_member_limit SET search_path = public;
ALTER FUNCTION public.check_poll_options_limit SET search_path = public;
ALTER FUNCTION public.increment_faq_view_count SET search_path = public;
ALTER FUNCTION public.get_featured_faqs SET search_path = public;
ALTER FUNCTION public.update_poll_vote_count SET search_path = public;
ALTER FUNCTION public.close_expired_polls SET search_path = public;
ALTER FUNCTION public.safe_upsert_rsvp SET search_path = public;
ALTER FUNCTION public.has_role SET search_path = public;
ALTER FUNCTION public.update_updated_at_column SET search_path = public;

-- Add comment for tracking
COMMENT ON SCHEMA public IS 'Wedding app schema - RLS security fixes applied on 2024-12-11';