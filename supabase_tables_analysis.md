# Supabase Tables Analysis

## Database Tables

### 1. **accommodation_categories**
- **Component**: AccommodationManager
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/AccommodationManager.tsx`
- **Operations**: SELECT

### 2. **accommodation_options**
- **Component**: AccommodationManager, AccommodationDisplay
- **Files**: 
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/AccommodationManager.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/AccommodationDisplay.tsx`
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 3. **app_settings**
- **Components**: AdvancedSecurity, HomePageManager, BackgroundManager, ThemeManager, FixWeddingData, useAppSettings
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/AdvancedSecurity.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/HomePageManager.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/BackgroundManager.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/ThemeManager.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/FixWeddingData.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useAppSettings.ts`
- **Operations**: SELECT, UPSERT

### 4. **bus_seat_bookings**
- **Component**: TransportBooking
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/TransportBooking.tsx`
- **Operations**: SELECT, INSERT, DELETE

### 5. **carpool_coordination**
- **Component**: TransportBooking
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/TransportBooking.tsx`
- **Operations**: SELECT, INSERT

### 6. **carpool_offerings**
- **Component**: TransportationManager
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/TransportationManager.tsx`
- **Operations**: SELECT

### 7. **carpool_participants**
- **Component**: TransportBooking
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/TransportBooking.tsx`
- **Operations**: SELECT, INSERT, DELETE

### 8. **chat_members**
- **Components**: useDirectChats, useMessageSearch
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useDirectChats.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useMessageSearch.ts`
- **Operations**: SELECT, INSERT, DELETE

### 9. **chat_messages**
- **Components**: useChatMessages, useDashboardData, useInstantMessenger, useDirectChats, useMessageSearch
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useChatMessages.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useDashboardData.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useInstantMessenger.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useDirectChats.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useMessageSearch.ts`
- **Operations**: SELECT, INSERT, UPDATE

### 10. **content_blocks**
- **Components**: ContentManagementSystem, useContentBlocks
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/ContentManagementSystem.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useContentBlocks.ts`
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 11. **dietary_requirements**
- **Components**: DietaryRequirements, DietaryRequirementsReport
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/DietaryRequirements.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/DietaryRequirementsReport.tsx`
- **Operations**: SELECT, INSERT, DELETE

### 12. **direct_chats**
- **Components**: useChatMessages, useInstantMessenger, useDirectChats, useMessageSearch
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useChatMessages.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useInstantMessenger.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useDirectChats.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useMessageSearch.ts`
- **Operations**: SELECT, INSERT

### 13. **faq_categories**
- **Component**: FAQ API
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/lib/api/faq.ts`
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 14. **faq_items**
- **Component**: FAQ API
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/lib/api/faq.ts`
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 15. **faq_with_categories** (View)
- **Component**: FAQ API
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/lib/api/faq.ts`
- **Operations**: SELECT

### 16. **gallery_photos**
- **Component**: GalleryPopup
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/GalleryPopup.tsx`
- **Operations**: SELECT

### 17. **guest_communications**
- **Component**: RSVPIntegration
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/RSVPIntegration.tsx`
- **Operations**: INSERT

### 18. **guest_list**
- **Component**: CentralGuestList
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/CentralGuestList.tsx`
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 19. **guest_transport_status**
- **Components**: TransportationManager, TransportBooking
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/TransportationManager.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/TransportBooking.tsx`
- **Operations**: SELECT, UPDATE, UPSERT

### 20. **guests**
- **Component**: UnifiedAccountsManagement
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/UnifiedAccountsManagement.tsx`
- **Operations**: SELECT, INSERT, UPDATE

### 21. **media**
- **Component**: useMessages
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useMessages.ts`
- **Operations**: Storage operations

### 22. **media_uploads**
- **Component**: useInstantMessenger
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useInstantMessenger.ts`
- **Operations**: INSERT

### 23. **message_likes**
- **Components**: CommunicationCenter, useWeddingData
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/CommunicationCenter.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useWeddingData.ts`
- **Operations**: SELECT, INSERT, DELETE

### 24. **message_reactions**
- **Component**: useMessageReactions
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useMessageReactions.ts`
- **Operations**: SELECT, INSERT, DELETE

### 25. **message_replies**
- **Component**: useMessageReplies
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useMessageReplies.ts`
- **Operations**: SELECT, INSERT

### 26. **message_status**
- **Component**: useInstantMessenger
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useInstantMessenger.ts`
- **Operations**: UPSERT

### 27. **messages**
- **Components**: RealTimeMonitoring, Analytics, CommunicationCenter, useWeddingData, NotificationBell
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/RealTimeMonitoring.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/Analytics.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/CommunicationCenter.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useWeddingData.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/NotificationBell.tsx`
- **Operations**: SELECT, INSERT, DELETE

### 28. **photo_gallery**
- **Component**: useDashboardData
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useDashboardData.ts`
- **Operations**: SELECT

### 29. **photo_likes**
- **Component**: useWeddingData
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useWeddingData.ts`
- **Operations**: SELECT, INSERT, DELETE

### 30. **photos**
- **Components**: RealTimeMonitoring, Analytics, MediaManagement, PhotoModeration, useWeddingData
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/RealTimeMonitoring.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/Analytics.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/MediaManagement.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/PhotoModeration.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useWeddingData.ts`
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 31. **profiles**
- **Components**: Multiple (Auth, Admin, Guest, Analytics, etc.)
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/RealTimeMonitoring.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/SystemMonitoring.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/Analytics.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/CommunicationCenter.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/contexts/AuthContext.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useChatMessages.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useDashboardData.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useUserPresence.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/CentralGuestList.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/RSVPIntegration.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/analytics/UserAnalytics.tsx`
- **Operations**: SELECT, INSERT, UPDATE

### 32. **rsvp_history**
- **Component**: RSVPIntegration
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/RSVPIntegration.tsx`
- **Operations**: INSERT

### 33. **rsvps**
- **Components**: useWeddingData, DietaryRequirements, Analytics, useDashboardData, useRSVPStatus
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useWeddingData.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/DietaryRequirements.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/Analytics.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useDashboardData.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useRSVPStatus.ts`
- **Operations**: SELECT, INSERT, UPDATE

### 34. **stories**
- **Component**: useStories
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useStories.ts`
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 35. **transportation_options**
- **Components**: TransportationManager, TransportBooking
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/TransportationManager.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/guest/TransportBooking.tsx`
- **Operations**: SELECT

### 36. **typing_indicators**
- **Component**: useInstantMessenger
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useInstantMessenger.ts`
- **Operations**: UPSERT, DELETE

### 37. **user_blocks**
- **Component**: useUserBlocking
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useUserBlocking.ts`
- **Operations**: SELECT, INSERT, DELETE

### 38. **user_roles**
- **Components**: SignInForm, UnifiedAccountsManagement, UserManagement, useAdminAuth, AuthContext, useDashboardData
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/auth/SignInForm.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/UnifiedAccountsManagement.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/UserManagement.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useAdminAuth.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/contexts/AuthContext.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useDashboardData.ts`
- **Operations**: SELECT, UPDATE

### 39. **venue_images**
- **Components**: useVenueImages, VenueHeroImage
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useVenueImages.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/venue/VenueHeroImage.tsx`
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 40. **venues**
- **Components**: useVenueImages, EventsPopup
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useVenueImages.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/EventsPopup.tsx`
- **Operations**: SELECT

### 41. **video_calls**
- **Component**: useInstantMessenger
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useInstantMessenger.ts`
- **Operations**: INSERT, UPDATE

### 42. **wedding_events**
- **Components**: EventTimeline, DietaryRequirementsReport, FixWeddingData, useWeddingData, RSVPManagement
- **Files**:
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/EventTimeline.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/DietaryRequirementsReport.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/FixWeddingData.tsx`
  - `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useWeddingData.ts`
  - `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/RSVPManagement.tsx`
- **Operations**: SELECT, INSERT, UPDATE, DELETE

## Storage Buckets

### 1. **avatars**
- **Component**: AvatarUpload
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/ui/avatar-upload.tsx`
- **Operations**: UPLOAD, REMOVE

### 2. **backgrounds**
- **Component**: BackgroundManager
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/components/admin/BackgroundManager.tsx`
- **Operations**: UPLOAD, GET PUBLIC URL

### 3. **media**
- **Component**: useMessages
- **File**: `/home/lyoncrypt/Desktop/Nuptul/src/hooks/useMessages.ts`
- **Operations**: UPLOAD, GET PUBLIC URL

## Summary Statistics

- **Total Database Tables**: 42
- **Total Storage Buckets**: 3
- **Most Used Tables**:
  1. profiles (11 components)
  2. messages (5 components)
  3. photos (5 components)
  4. rsvps (5 components)
  5. chat_messages (5 components)

## Key Observations

1. **Authentication & User Management**: Heavy use of `profiles` and `user_roles` tables
2. **Communication**: Multiple chat-related tables (`chat_messages`, `direct_chats`, `message_*`)
3. **Wedding Features**: Dedicated tables for RSVPs, events, photos, dietary requirements
4. **Guest Management**: Comprehensive guest tracking with transportation and accommodation
5. **Content Management**: FAQ system and content blocks for dynamic content
6. **Media Storage**: Separate buckets for avatars, backgrounds, and general media

## Tables by Category

### Core User Data
- profiles
- user_roles
- user_blocks

### Wedding Management
- wedding_events
- venues
- venue_images
- rsvps
- rsvp_history

### Guest Management
- guests
- guest_list
- guest_communications
- guest_transport_status

### Communication
- messages
- chat_messages
- direct_chats
- chat_members
- message_likes
- message_reactions
- message_replies
- message_status
- typing_indicators
- video_calls

### Media & Content
- photos
- photo_likes
- photo_gallery
- gallery_photos
- stories
- media_uploads
- content_blocks

### Transportation & Accommodation
- transportation_options
- carpool_offerings
- carpool_coordination
- carpool_participants
- bus_seat_bookings
- accommodation_categories
- accommodation_options

### Configuration & Settings
- app_settings
- faq_categories
- faq_items
- faq_with_categories (view)

### Dietary Management
- dietary_requirements