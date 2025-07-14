# Test Matrix

## Unit Tests (Hooks)

| Hook | Test File | Priority | Test Scenarios |
|------|-----------|----------|----------------|
| **useAppSettings** | `useAppSettings.test.ts` | High | SELECT, UPSERT operations, error handling |
| **useChatMessages** | `useChatMessages.test.ts` | High | Message CRUD, real-time updates, pagination |
| **useDirectChats** | `useDirectChats.test.ts` | High | Chat creation, member management, message flow |
| **useInstantMessenger** | `useInstantMessenger.test.ts` | High | Real-time messaging, file uploads, typing indicators |
| **useWeddingData** | `useWeddingData.test.ts` | High | Wedding data aggregation, RSVP stats, photo data |
| **useDashboardData** | `useDashboardData.test.ts` | High | Dashboard metrics, data aggregation, caching |
| **useContentBlocks** | `useContentBlocks.test.ts` | Medium | Content CRUD, dynamic content loading |
| **useMessageReactions** | `useMessageReactions.test.ts` | Medium | Reaction CRUD, emoji handling, real-time updates |
| **useMessageReplies** | `useMessageReplies.test.ts` | Medium | Reply threading, nested replies, notifications |
| **useStories** | `useStories.test.ts` | Medium | Story CRUD, media uploads, expiration logic |
| **useVenueImages** | `useVenueImages.test.ts` | Medium | Image CRUD, file uploads, optimization |
| **useRSVPStatus** | `useRSVPStatus.test.ts` | Medium | RSVP status tracking, validation, notifications |
| **useUserBlocking** | `useUserBlocking.test.ts` | Low | User blocking/unblocking, privacy enforcement |
| **useAdminAuth** | `useAdminAuth.test.ts` | Low | Admin authentication, role verification |
| **useUserPresence** | `useUserPresence.test.ts` | Low | Online status, last seen, presence updates |
| **useMessages** | `useMessages.test.ts` | Low | Generic message operations, media handling |

## Integration Tests (Components)

| Component | Test File | Priority | Test Scenarios |
|-----------|-----------|----------|----------------|
| **AccommodationManager** | `AccommodationManager.test.tsx` | High | Category management, option CRUD, guest assignment |
| **TransportBooking** | `TransportBooking.test.tsx` | High | Booking flow, seat selection, carpool coordination |
| **CentralGuestList** | `CentralGuestList.test.tsx` | High | Guest CRUD, profile updates, bulk operations |
| **RSVPIntegration** | `RSVPIntegration.test.tsx` | High | RSVP submission, validation, history tracking |
| **ContentManagementSystem** | `ContentManagementSystem.test.tsx` | Medium | Content editing, preview, publishing workflow |
| **DietaryRequirements** | `DietaryRequirements.test.tsx` | Medium | Requirement tracking, reporting, notifications |
| **CommunicationCenter** | `CommunicationCenter.test.tsx` | Medium | Message management, moderation, bulk actions |
| **Analytics** | `Analytics.test.tsx` | Medium | Data visualization, metric calculation, exports |
| **RealTimeMonitoring** | `RealTimeMonitoring.test.tsx` | Medium | Live updates, system health, alerts |
| **PhotoModeration** | `PhotoModeration.test.tsx` | Medium | Photo approval/rejection, bulk moderation |
| **MediaManagement** | `MediaManagement.test.tsx` | Medium | File uploads, storage management, compression |
| **TransportationManager** | `TransportationManager.test.tsx` | Low | Route management, capacity planning, reporting |
| **EventTimeline** | `EventTimeline.test.tsx` | Low | Event scheduling, timeline visualization, updates |
| **UnifiedAccountsManagement** | `UnifiedAccountsManagement.test.tsx` | Low | User account operations, role management |
| **UserManagement** | `UserManagement.test.tsx` | Low | User administration, bulk operations, permissions |

## E2E Tests (Routes/User Flows)

| Route/Flow | Test File | Priority | Test Scenarios |
|------------|-----------|----------|----------------|
| **Guest RSVP Flow** | `guest-rsvp-flow.e2e.ts` | High | Complete RSVP submission, confirmation, updates |
| **Admin Dashboard** | `admin-dashboard.e2e.ts` | High | Login, navigation, data management, real-time updates |
| **Chat System** | `chat-system.e2e.ts` | High | Message sending, file sharing, real-time messaging |
| **Transportation Booking** | `transport-booking.e2e.ts` | High | Full booking flow, payment, confirmation |
| **Accommodation Booking** | `accommodation-booking.e2e.ts` | High | Room selection, booking, guest management |
| **Photo Gallery** | `photo-gallery.e2e.ts` | Medium | Photo viewing, uploading, interactions |
| **Social Features** | `social-features.e2e.ts` | Medium | Story creation, social interactions, feeds |
| **Venue Information** | `venue-info.e2e.ts` | Medium | Venue browsing, image viewing, information access |
| **FAQ System** | `faq-system.e2e.ts` | Low | FAQ browsing, search, category navigation |
| **User Authentication** | `user-auth.e2e.ts` | Low | Login, logout, role-based access, security |
| **Profile Management** | `profile-management.e2e.ts` | Low | Profile updates, settings, preferences |
| **Event Management** | `event-management.e2e.ts` | Low | Event creation, updates, attendee management |

## Performance Tests

| Component/Route | Test Type | Metrics | Target |
|-----------------|-----------|---------|--------|
| **Chat Messages** | Load Test | Messages/second | 100+ concurrent users |
| **Photo Upload** | Performance | Upload speed | <30s for 10MB |
| **Dashboard Load** | Performance | Initial load | <3s |
| **Real-time Updates** | Stress Test | Update latency | <500ms |
| **Search Functions** | Performance | Search response | <1s |
| **Database Queries** | Performance | Query time | <100ms average |

## Test Coverage Goals

### Unit Tests
- **Target Coverage**: 80%+
- **Priority Components**: All hooks and utilities
- **Critical Paths**: Authentication, payments, data mutations

### Integration Tests  
- **Target Coverage**: 70%+
- **Priority Components**: User-facing components
- **Critical Paths**: RSVP flow, booking systems, admin functions

### E2E Tests
- **Target Coverage**: 60%+ of user journeys
- **Priority Flows**: Guest registration, admin management, core features
- **Critical Paths**: Complete user workflows from start to finish

## Test Infrastructure Requirements

### Testing Tools
```bash
# Unit Testing
- Jest
- React Testing Library
- MSW (Mock Service Worker)

# Integration Testing  
- Cypress or Playwright
- Testing Library integration

# E2E Testing
- Playwright or Cypress
- Docker for consistent environments
```

### Mock Data Requirements
```typescript
// Mock Supabase Data
- profiles: 100+ test users
- wedding_events: 10+ events
- rsvps: 200+ RSVPs
- messages: 1000+ messages
- photos: 50+ photos
```

### CI/CD Integration
```yaml
# Test Pipeline Stages
1. Unit Tests (on PR)
2. Integration Tests (on merge)
3. E2E Tests (on deployment)
4. Performance Tests (weekly)
```

## Test File Locations

### Unit Tests
```
/src/hooks/__tests__/
├── useAppSettings.test.ts
├── useChatMessages.test.ts
├── useDirectChats.test.ts
├── useInstantMessenger.test.ts
└── ...
```

### Integration Tests
```
/src/components/__tests__/
├── admin/
│   ├── AccommodationManager.test.tsx
│   ├── TransportBooking.test.tsx
│   └── ...
├── guest/
│   ├── CentralGuestList.test.tsx
│   ├── RSVPIntegration.test.tsx
│   └── ...
```

### E2E Tests
```
/e2e/
├── guest-rsvp-flow.e2e.ts
├── admin-dashboard.e2e.ts
├── chat-system.e2e.ts
└── ...
```

## Test Data Management

### Database Setup
- Separate test database instance
- Seeded with realistic test data
- Automated cleanup between tests

### File Uploads
- Mock S3/Supabase storage
- Test file upload flows
- Validate file processing

### Real-time Features
- Mock WebSocket connections
- Test real-time updates
- Validate synchronization