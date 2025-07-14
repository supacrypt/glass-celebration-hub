# Data Mapping: Tables → Components/Hooks → Routes

| Table | Component/Hook | Route | File Path |
|-------|---------------|-------|-----------|
| **accommodation_categories** | AccommodationManager | /dashboard/admin | `/src/components/admin/AccommodationManager.tsx` |
| **accommodation_options** | AccommodationManager | /dashboard/admin | `/src/components/admin/AccommodationManager.tsx` |
| **accommodation_options** | AccommodationDisplay | /accommodation | `/src/components/guest/AccommodationDisplay.tsx` |
| **app_settings** | AdvancedSecurity | /dashboard/admin | `/src/components/admin/AdvancedSecurity.tsx` |
| **app_settings** | HomePageManager | /dashboard/admin | `/src/components/admin/HomePageManager.tsx` |
| **app_settings** | BackgroundManager | /dashboard/admin | `/src/components/admin/BackgroundManager.tsx` |
| **app_settings** | ThemeManager | /dashboard/admin | `/src/components/admin/ThemeManager.tsx` |
| **app_settings** | FixWeddingData | /dashboard/admin | `/src/components/FixWeddingData.tsx` |
| **app_settings** | useAppSettings | Global Hook | `/src/hooks/useAppSettings.ts` |
| **bus_seat_bookings** | TransportBooking | /transport | `/src/components/guest/TransportBooking.tsx` |
| **carpool_coordination** | TransportBooking | /transport | `/src/components/guest/TransportBooking.tsx` |
| **carpool_offerings** | TransportationManager | /dashboard/admin | `/src/components/admin/TransportationManager.tsx` |
| **carpool_participants** | TransportBooking | /transport | `/src/components/guest/TransportBooking.tsx` |
| **chat_members** | useDirectChats | /chat | `/src/hooks/useDirectChats.ts` |
| **chat_members** | useMessageSearch | /chat | `/src/hooks/useMessageSearch.ts` |
| **chat_messages** | useChatMessages | /chat | `/src/hooks/useChatMessages.ts` |
| **chat_messages** | useDashboardData | /dashboard | `/src/hooks/useDashboardData.ts` |
| **chat_messages** | useInstantMessenger | Global Component | `/src/hooks/useInstantMessenger.ts` |
| **chat_messages** | useDirectChats | /chat | `/src/hooks/useDirectChats.ts` |
| **chat_messages** | useMessageSearch | /chat | `/src/hooks/useMessageSearch.ts` |
| **content_blocks** | ContentManagementSystem | /dashboard/admin | `/src/components/admin/ContentManagementSystem.tsx` |
| **content_blocks** | useContentBlocks | Global Hook | `/src/hooks/useContentBlocks.ts` |
| **dietary_requirements** | DietaryRequirements | /dashboard/admin | `/src/components/admin/DietaryRequirements.tsx` |
| **dietary_requirements** | DietaryRequirementsReport | /dashboard/admin | `/src/components/admin/DietaryRequirementsReport.tsx` |
| **direct_chats** | useChatMessages | /chat | `/src/hooks/useChatMessages.ts` |
| **direct_chats** | useInstantMessenger | Global Component | `/src/hooks/useInstantMessenger.ts` |
| **direct_chats** | useDirectChats | /chat | `/src/hooks/useDirectChats.ts` |
| **direct_chats** | useMessageSearch | /chat | `/src/hooks/useMessageSearch.ts` |
| **faq_categories** | FAQ API | /faq | `/src/lib/api/faq.ts` |
| **faq_items** | FAQ API | /faq | `/src/lib/api/faq.ts` |
| **faq_with_categories** | FAQ API | /faq | `/src/lib/api/faq.ts` |
| **gallery_photos** | GalleryPopup | /gallery | `/src/components/GalleryPopup.tsx` |
| **guest_communications** | RSVPIntegration | /rsvp | `/src/components/guest/RSVPIntegration.tsx` |
| **guest_list** | CentralGuestList | /guest-dashboard | `/src/components/guest/CentralGuestList.tsx` |
| **guest_transport_status** | TransportationManager | /dashboard/admin | `/src/components/admin/TransportationManager.tsx` |
| **guest_transport_status** | TransportBooking | /transport | `/src/components/guest/TransportBooking.tsx` |
| **guests** | UnifiedAccountsManagement | /dashboard/users | `/src/components/admin/UnifiedAccountsManagement.tsx` |
| **media** | useMessages | Global Hook | `/src/hooks/useMessages.ts` |
| **media_uploads** | useInstantMessenger | Global Component | `/src/hooks/useInstantMessenger.ts` |
| **message_likes** | CommunicationCenter | /dashboard/messages | `/src/components/admin/CommunicationCenter.tsx` |
| **message_likes** | useWeddingData | Global Hook | `/src/hooks/useWeddingData.ts` |
| **message_reactions** | useMessageReactions | /chat | `/src/hooks/useMessageReactions.ts` |
| **message_replies** | useMessageReplies | /chat | `/src/hooks/useMessageReplies.ts` |
| **message_status** | useInstantMessenger | Global Component | `/src/hooks/useInstantMessenger.ts` |
| **messages** | RealTimeMonitoring | /dashboard/admin | `/src/components/admin/RealTimeMonitoring.tsx` |
| **messages** | Analytics | /dashboard/analytics | `/src/components/admin/Analytics.tsx` |
| **messages** | CommunicationCenter | /dashboard/messages | `/src/components/admin/CommunicationCenter.tsx` |
| **messages** | useWeddingData | Global Hook | `/src/hooks/useWeddingData.ts` |
| **messages** | NotificationBell | Global Component | `/src/components/NotificationBell.tsx` |
| **photo_gallery** | useDashboardData | /dashboard | `/src/hooks/useDashboardData.ts` |
| **photo_likes** | useWeddingData | Global Hook | `/src/hooks/useWeddingData.ts` |
| **photos** | RealTimeMonitoring | /dashboard/admin | `/src/components/admin/RealTimeMonitoring.tsx` |
| **photos** | Analytics | /dashboard/analytics | `/src/components/admin/Analytics.tsx` |
| **photos** | MediaManagement | /dashboard/admin | `/src/components/admin/MediaManagement.tsx` |
| **photos** | PhotoModeration | /dashboard/photos | `/src/components/admin/PhotoModeration.tsx` |
| **photos** | useWeddingData | Global Hook | `/src/hooks/useWeddingData.ts` |
| **profiles** | RealTimeMonitoring | /dashboard/admin | `/src/components/admin/RealTimeMonitoring.tsx` |
| **profiles** | SystemMonitoring | /dashboard/admin | `/src/components/admin/SystemMonitoring.tsx` |
| **profiles** | Analytics | /dashboard/analytics | `/src/components/admin/Analytics.tsx` |
| **profiles** | CommunicationCenter | /dashboard/messages | `/src/components/admin/CommunicationCenter.tsx` |
| **profiles** | AuthContext | Global Context | `/src/contexts/AuthContext.tsx` |
| **profiles** | useChatMessages | /chat | `/src/hooks/useChatMessages.ts` |
| **profiles** | useDashboardData | /dashboard | `/src/hooks/useDashboardData.ts` |
| **profiles** | useUserPresence | Global Hook | `/src/hooks/useUserPresence.ts` |
| **profiles** | CentralGuestList | /guest-dashboard | `/src/components/guest/CentralGuestList.tsx` |
| **profiles** | RSVPIntegration | /rsvp | `/src/components/guest/RSVPIntegration.tsx` |
| **profiles** | UserAnalytics | /dashboard/analytics | `/src/components/analytics/UserAnalytics.tsx` |
| **rsvp_history** | RSVPIntegration | /rsvp | `/src/components/guest/RSVPIntegration.tsx` |
| **rsvps** | useWeddingData | Global Hook | `/src/hooks/useWeddingData.ts` |
| **rsvps** | DietaryRequirements | /dashboard/admin | `/src/components/admin/DietaryRequirements.tsx` |
| **rsvps** | Analytics | /dashboard/analytics | `/src/components/admin/Analytics.tsx` |
| **rsvps** | useDashboardData | /dashboard | `/src/hooks/useDashboardData.ts` |
| **rsvps** | useRSVPStatus | /rsvp | `/src/hooks/useRSVPStatus.ts` |
| **stories** | useStories | /social | `/src/hooks/useStories.ts` |
| **transportation_options** | TransportationManager | /dashboard/admin | `/src/components/admin/TransportationManager.tsx` |
| **transportation_options** | TransportBooking | /transport | `/src/components/guest/TransportBooking.tsx` |
| **typing_indicators** | useInstantMessenger | Global Component | `/src/hooks/useInstantMessenger.ts` |
| **user_blocks** | useUserBlocking | Global Hook | `/src/hooks/useUserBlocking.ts` |
| **user_roles** | SignInForm | /auth | `/src/components/auth/SignInForm.tsx` |
| **user_roles** | UnifiedAccountsManagement | /dashboard/users | `/src/components/admin/UnifiedAccountsManagement.tsx` |
| **user_roles** | UserManagement | /dashboard/users | `/src/components/admin/UserManagement.tsx` |
| **user_roles** | useAdminAuth | Global Hook | `/src/hooks/useAdminAuth.ts` |
| **user_roles** | AuthContext | Global Context | `/src/contexts/AuthContext.tsx` |
| **user_roles** | useDashboardData | /dashboard | `/src/hooks/useDashboardData.ts` |
| **venue_images** | useVenueImages | /venue | `/src/hooks/useVenueImages.ts` |
| **venue_images** | VenueHeroImage | /venue | `/src/components/venue/VenueHeroImage.tsx` |
| **venues** | useVenueImages | /venue | `/src/hooks/useVenueImages.ts` |
| **venues** | EventsPopup | /events | `/src/components/EventsPopup.tsx` |
| **video_calls** | useInstantMessenger | Global Component | `/src/hooks/useInstantMessenger.ts` |
| **wedding_events** | EventTimeline | /dashboard/events | `/src/components/admin/EventTimeline.tsx` |
| **wedding_events** | DietaryRequirementsReport | /dashboard/admin | `/src/components/admin/DietaryRequirementsReport.tsx` |
| **wedding_events** | FixWeddingData | /dashboard/admin | `/src/components/FixWeddingData.tsx` |
| **wedding_events** | useWeddingData | Global Hook | `/src/hooks/useWeddingData.ts` |
| **wedding_events** | RSVPManagement | /dashboard/rsvps | `/src/components/admin/RSVPManagement.tsx` |

## Route Categories

### Public Routes
- `/` - Home page
- `/venue` - Venue pages
- `/accommodation` - Guest accommodation
- `/transport` - Transportation
- `/faq` - FAQ
- `/rsvp` - RSVP system
- `/gallery` - Photo gallery
- `/social` - Social features

### Admin Dashboard Routes
- `/dashboard` - Main dashboard
- `/dashboard/users` - User management
- `/dashboard/photos` - Photo moderation
- `/dashboard/events` - Event management
- `/dashboard/messages` - Message management
- `/dashboard/analytics` - Analytics
- `/dashboard/rsvps` - RSVP management

### Guest Routes
- `/guest-dashboard` - Guest dashboard
- `/profile` - User profile
- `/chat` - Chat system

### Authentication
- `/auth` - Authentication page

## Component Distribution by Route

### Most Complex Routes (Multiple Tables)
1. **Dashboard/Admin** - 15+ tables
2. **Chat System** - 8 tables
3. **RSVP System** - 6 tables
4. **Transport** - 5 tables
5. **Gallery/Photos** - 4 tables