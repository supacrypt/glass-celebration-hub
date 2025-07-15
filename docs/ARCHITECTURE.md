# 🏗️ Architecture Overview

## System Architecture

Nuptul is built using a modern, scalable architecture that prioritizes performance, security, and user experience.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
├─────────────────────────────────────────────────────────────┤
│  React SPA with TypeScript                                  │
│  • Responsive UI Components                                 │
│  • Real-time Updates                                        │
│  • PWA Capabilities                                         │
│  • WebRTC Integration                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/WSS
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Platform                        │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                        │
│  • Row Level Security                                       │
│  • Real-time Subscriptions                                 │
│  • JSONB for Flexibility                                    │
│                                                             │
│  Authentication & Authorization                             │
│  • JWT Tokens                                              │
│  • Role-based Access Control                               │
│  • Magic Link Authentication                               │
│                                                             │
│  Storage & CDN                                             │
│  • File Upload Handling                                    │
│  • Image Optimization                                      │
│  • Global CDN Distribution                                 │
│                                                             │
│  Edge Functions                                            │
│  • Serverless Compute                                      │
│  • Custom Business Logic                                   │
│  • Third-party Integrations                               │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/                 # Base UI components (shadcn/ui)
│   ├── navigation/         # Navigation components
│   ├── auth/              # Authentication components
│   ├── social/            # Social features
│   ├── admin/             # Admin dashboard
│   └── shared/            # Shared components
├── pages/                 # Page components
├── hooks/                 # Custom React hooks
├── contexts/              # React contexts
├── utils/                 # Utility functions
├── types/                 # TypeScript types
└── config/                # Configuration
```

### State Management

- **React Context**: Global state management
- **React Query**: Server state and caching
- **Local Storage**: Persistent client state
- **Zustand**: Complex state management (when needed)

### Design System

#### Three-Layer Architecture
Every component follows the hybrid architecture:

1. **Aurora Background Layer** (z-index: 1)
   - Organic gradient animations
   - Living background effects
   - Smooth transitions

2. **Glass Middle Layer** (z-index: 20)
   - Transparent backdrop filters
   - Elegant blur effects
   - Depth perception

3. **Neumorphic Content Layer** (z-index: 30)
   - Soft shadows and highlights
   - Tactile button interactions
   - Realistic depth

## Backend Architecture

### Database Schema

#### Core Tables

```sql
-- User authentication and profiles
profiles (id, email, first_name, last_name, avatar_url, role)
user_roles (user_id, role, created_at)

-- Guest management
guest_list (id, first_name, last_name, email, rsvp_status, dietary_requirements)
guest_relationships (guest_id, related_guest_id, relationship_type)

-- Social features
social_posts (id, user_id, content, media_url, created_at)
social_stories (id, user_id, media_url, expires_at)
social_post_reactions (id, post_id, user_id, reaction_type)

-- Messaging
direct_chats (id, is_group, created_at)
chat_members (chat_id, user_id, joined_at)
chat_messages (id, chat_id, user_id, content, message_type)

-- Admin features
content_blocks (id, section, content, is_active)
notifications (id, user_id, title, message, read_at)
```

#### Security Model

- **Row Level Security (RLS)**: Database-level access control
- **Role-based Permissions**: Guest, Admin, Couple roles
- **JWT Authentication**: Secure token-based auth
- **API Rate Limiting**: Prevents abuse and spam

### Storage Architecture

#### Bucket Structure

```
avatars/
├── {user_id}/
│   └── avatar.{ext}

social-media/
├── posts/
│   └── {user_id}/
│       └── {post_id}.{ext}
└── stories/
    └── {user_id}/
        └── {story_id}.{ext}

user-content/
├── {user_id}/
│   ├── documents/
│   └── images/

public-assets/
├── logos/
├── backgrounds/
└── templates/
```

#### File Processing Pipeline

1. **Upload Validation**: File type and size checks
2. **Virus Scanning**: Malware detection
3. **Image Optimization**: WebP conversion and compression
4. **CDN Distribution**: Global content delivery
5. **Metadata Extraction**: EXIF data and thumbnails

## Real-time Features

### WebRTC Integration

```javascript
// WebRTC Architecture
WebRTCManager
├── PeerConnection Management
├── Media Stream Handling
├── Signaling Server Integration
└── Error Recovery
```

### Supabase Real-time

- **Database Changes**: Live updates for posts, messages
- **Presence System**: Online/offline status tracking
- **Broadcast Messages**: Real-time notifications
- **Typing Indicators**: Live typing status

## Security Architecture

### Authentication Flow

```
1. User Registration/Login
   ↓
2. Supabase Auth Verification
   ↓
3. JWT Token Generation
   ↓
4. Role Assignment
   ↓
5. RLS Policy Application
   ↓
6. Secure Resource Access
```

### Security Measures

- **Content Security Policy (CSP)**: XSS protection
- **HTTPS Everywhere**: Encrypted communication
- **Input Validation**: Server-side validation
- **Rate Limiting**: API abuse prevention
- **Audit Logging**: Security event tracking

## Performance Architecture

### Optimization Strategies

#### Frontend Optimizations

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategy**: Service worker implementation
- **Bundle Analysis**: Tree shaking and dead code elimination

#### Backend Optimizations

- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Caching Layer**: Redis for session management
- **CDN Integration**: Global content delivery

### Monitoring & Analytics

```
Performance Monitoring
├── Core Web Vitals
├── User Experience Metrics
├── Error Tracking (Sentry)
├── Database Performance
└── API Response Times
```

## Deployment Architecture

### CI/CD Pipeline

```
GitHub Repository
├── Pull Request
│   ├── Automated Testing
│   ├── Code Quality Checks
│   └── Staging Deployment
│
└── Main Branch
    ├── Production Build
    ├── Security Scanning
    ├── Performance Testing
    └── Production Deployment
```

### Infrastructure

- **Frontend**: CDN-hosted static assets
- **Backend**: Supabase managed infrastructure
- **Database**: PostgreSQL with automatic backups
- **Storage**: Global CDN with edge caching
- **Monitoring**: Real-time performance tracking

## API Design

### RESTful Endpoints

```
Authentication:
POST /auth/signup
POST /auth/signin
POST /auth/signout
POST /auth/refresh

Users:
GET /api/users/profile
PUT /api/users/profile
POST /api/users/avatar

Social:
GET /api/social/posts
POST /api/social/posts
GET /api/social/stories
POST /api/social/stories

Admin:
GET /api/admin/users
PUT /api/admin/users/:id/role
GET /api/admin/analytics
```

### GraphQL Integration

For complex queries and real-time subscriptions:

```graphql
subscription {
  socialPosts {
    id
    content
    user {
      name
      avatar
    }
    reactions {
      type
      count
    }
  }
}
```

## Scalability Considerations

### Horizontal Scaling

- **Database Sharding**: User-based partitioning
- **Microservices**: Service decomposition
- **Load Balancing**: Traffic distribution
- **Caching Layers**: Redis clusters

### Vertical Scaling

- **Database Optimization**: Query performance
- **Resource Allocation**: Memory and CPU
- **Connection Pooling**: Database connections
- **Asset Optimization**: File compression

## Technology Decisions

### Frontend Stack

- **React**: Component-based architecture
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast development and building

### Backend Stack

- **Supabase**: Managed PostgreSQL with real-time
- **PostgreSQL**: Robust relational database
- **PostgREST**: Automatic API generation
- **Row Level Security**: Database-level authorization

### Development Tools

- **ESLint/Prettier**: Code quality
- **Jest/Playwright**: Testing framework
- **Husky**: Git hooks
- **GitHub Actions**: CI/CD pipeline

This architecture provides a solid foundation for a scalable, secure, and performant wedding planning platform while maintaining developer productivity and user experience excellence.