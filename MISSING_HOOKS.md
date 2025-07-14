# Missing Hooks Analysis

## Tables from Master List with No Database Queries Found

Based on the supabase_tables_analysis.md, the following tables from the master list have **NO** queries or hooks implemented:

### Core Missing Tables (23 total)

1. **admin_guest_stats** - No queries found
2. **contact_categories** - No queries found  
3. **contact_details** - No queries found
4. **conversation_settings** - No queries found
5. **event_attendance_summary** - No queries found
6. **gift_registry_redirects** - No queries found
7. **guest_link_history** - No queries found
8. **guest_rsvp_details** - No queries found
9. **message_reports** - No queries found
10. **photo_comments** - No queries found
11. **poll_notifications** - No queries found
12. **poll_options** - No queries found
13. **poll_votes** - No queries found
14. **polls** - No queries found
15. **post_comments** - No queries found
16. **post_reactions** - No queries found
17. **social_feed** - No queries found
18. **social_feed_likes** - No queries found
19. **social_posts** - No queries found
20. **transportation_categories** - No queries found
21. **transportation_schedules** - No queries found
22. **wedding_details** - No queries found

### Tables Found in Analysis but Not in Master List

The following tables were found in the codebase but were NOT in the provided master list:

1. **carpool_offerings** - Has queries in TransportationManager
2. **guest_communications** - Has queries in RSVPIntegration
3. **guests** - Has queries in UnifiedAccountsManagement
4. **media** - Has storage operations in useMessages
5. **media_uploads** - Has queries in useInstantMessenger
6. **message_status** - Has queries in useInstantMessenger
7. **rsvp_history** - Has queries in RSVPIntegration
8. **typing_indicators** - Has queries in useInstantMessenger
9. **video_calls** - Has queries in useInstantMessenger

## Priority Implementation Recommendations

### High Priority (Core Wedding Features)
1. **wedding_details** - Essential for wedding information
2. **guest_rsvp_details** - Detailed RSVP information
3. **event_attendance_summary** - Event planning analytics
4. **admin_guest_stats** - Administrative insights

### Medium Priority (Enhanced Features)
1. **polls** + **poll_options** + **poll_votes** + **poll_notifications** - Voting system
2. **social_feed** + **social_posts** + **social_feed_likes** + **post_comments** + **post_reactions** - Social engagement
3. **transportation_categories** + **transportation_schedules** - Enhanced transport
4. **contact_categories** + **contact_details** - Contact management

### Low Priority (Nice to Have)
1. **photo_comments** - Photo interaction
2. **message_reports** - Moderation features
3. **guest_link_history** - Analytics
4. **gift_registry_redirects** - External integrations
5. **conversation_settings** - Chat customization

## Implementation Status Summary

- **Tables with Queries**: 42 tables
- **Tables Missing Queries**: 23 tables  
- **Implementation Coverage**: 65% (42/65 total tables)
- **Critical Missing Features**: 4 high-priority tables

## Recommended Hook Structure for Missing Tables

### Example: wedding_details Hook
```typescript
// /src/hooks/useWeddingDetails.ts
export const useWeddingDetails = () => {
  // SELECT, INSERT, UPDATE operations for wedding_details
};
```

### Example: Polls System Hooks
```typescript
// /src/hooks/usePolls.ts
export const usePolls = () => {
  // Complete polling system implementation
};

// /src/hooks/usePollVotes.ts
export const usePollVotes = () => {
  // Poll voting functionality
};
```

### Example: Social Feed Hooks
```typescript
// /src/hooks/useSocialFeed.ts
export const useSocialFeed = () => {
  // Social feed management
};

// /src/hooks/useSocialPosts.ts
export const useSocialPosts = () => {
  // Post creation and management
};
```

## Files That Need Creation

### Core Wedding Management
- `/src/hooks/useWeddingDetails.ts`
- `/src/hooks/useGuestRSVPDetails.ts` 
- `/src/hooks/useEventAttendance.ts`
- `/src/hooks/useAdminGuestStats.ts`

### Social Features
- `/src/hooks/usePolls.ts`
- `/src/hooks/usePollVotes.ts`
- `/src/hooks/useSocialFeed.ts`
- `/src/hooks/useSocialPosts.ts`
- `/src/hooks/usePostComments.ts`

### Enhanced Transport/Contact
- `/src/hooks/useTransportationCategories.ts`
- `/src/hooks/useTransportationSchedules.ts`
- `/src/hooks/useContactDetails.ts`

### Utilities/Analytics
- `/src/hooks/usePhotoComments.ts`
- `/src/hooks/useMessageReports.ts`
- `/src/hooks/useGuestLinkHistory.ts`