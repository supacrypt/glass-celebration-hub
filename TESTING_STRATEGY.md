# Wedding App Testing & Quality Assurance Plan

## Phase 9: Comprehensive Testing Strategy

### 1. Unit Testing (Jest + React Testing Library)

#### Core Components Tests
- **Story Components**
  - StoryCircle: Rendering, avatar display, user interactions
  - StoryViewer: Progress bars, media playback, navigation
  - StoryCreator: File uploads, text stories, validation
  - StoriesContainer: Story grouping, real-time updates

- **Chat Components**
  - MessageBubble: Message formatting, timestamps, glass effects
  - ChatWindow: Real-time messaging, file attachments
  - ChatListItem: Display names, last messages, unread indicators
  - DirectChatContainer: Chat creation, list management

- **Poll Components**
  - PollCreator: Form validation, option management, settings
  - PollDisplay: Voting interface, results visualization
  - Real-time vote updates, percentage calculations

#### Hooks Testing
```javascript
// Example test structure
describe('useStories', () => {
  test('fetches active stories only', async () => {
    // Mock Supabase response
    // Test story filtering by expiration
    // Verify real-time subscriptions
  });
  
  test('creates story with proper expiration', async () => {
    // Test story creation
    // Verify 24-hour expiration
    // Check media upload flow
  });
});

describe('useChatMessages', () => {
  test('sends message with media attachment', async () => {
    // Test file upload
    // Verify message delivery
    // Check real-time updates
  });
});

describe('usePolls', () => {
  test('creates poll with options', async () => {
    // Test poll creation
    // Verify option creation
    // Check vote count initialization
  });
  
  test('handles voting with multiple selections', async () => {
    // Test voting logic
    // Verify constraint handling
    // Check real-time updates
  });
});
```

### 2. Integration Testing

#### Database Operations
```javascript
describe('Database Integration', () => {
  test('story expiration cascade deletes views', async () => {
    // Create story and views
    // Wait for expiration
    // Verify cleanup
  });
  
  test('poll vote count triggers update correctly', async () => {
    // Create poll and vote
    // Verify trigger execution
    // Check count accuracy
  });
  
  test('RLS policies prevent unauthorized access', async () => {
    // Test cross-user data access
    // Verify permission enforcement
    // Check security boundaries
  });
});
```

#### Real-time Features
```javascript
describe('Real-time Subscriptions', () => {
  test('stories broadcast to all users', async () => {
    // Create story as user A
    // Verify user B receives update
    // Check proper data format
  });
  
  test('chat messages sync instantly', async () => {
    // Send message in chat
    // Verify all participants receive
    // Test typing indicators
  });
  
  test('poll votes update live results', async () => {
    // Vote on poll
    // Verify real-time percentage updates
    // Check vote count increments
  });
});
```

### 3. End-to-End Testing (Playwright)

#### Critical User Journeys
```javascript
// Complete story creation and viewing flow
test('Story lifecycle: create, view, expire', async ({ page }) => {
  // Login as user
  await page.goto('/social');
  
  // Create a photo story
  await page.click('[data-testid="create-story"]');
  await page.setInputFiles('input[type="file"]', 'test-image.jpg');
  await page.click('[data-testid="publish-story"]');
  
  // Verify story appears in feed
  await expect(page.locator('[data-testid="story-circle"]')).toBeVisible();
  
  // View story
  await page.click('[data-testid="story-circle"]');
  await expect(page.locator('[data-testid="story-viewer"]')).toBeVisible();
  
  // Test navigation and auto-advance
  await page.waitForTimeout(7000); // Story duration
  await expect(page.locator('[data-testid="story-viewer"]')).not.toBeVisible();
});

// Chat conversation flow
test('Direct messaging: create, send, receive', async ({ page, context }) => {
  // Login as two different users
  const userA = await context.newPage();
  const userB = await context.newPage();
  
  // User A creates chat
  await userA.goto('/social');
  await userA.click('[data-testid="open-messages"]');
  await userA.click('[data-testid="new-chat"]');
  
  // Send message
  await userA.fill('[data-testid="message-input"]', 'Hello from User A');
  await userA.click('[data-testid="send-message"]');
  
  // User B receives message
  await userB.goto('/social');
  await userB.click('[data-testid="open-messages"]');
  await expect(userB.locator('text=Hello from User A')).toBeVisible();
});

// Poll creation and voting flow
test('Poll interaction: create, vote, view results', async ({ page }) => {
  // Create poll
  await page.goto('/social');
  await page.click('[data-testid="create-poll"]');
  await page.fill('[data-testid="poll-question"]', 'What\'s your favorite venue?');
  await page.fill('[data-testid="poll-option-1"]', 'Ben Ean');
  await page.fill('[data-testid="poll-option-2"]', 'Newcastle Beach');
  await page.click('[data-testid="create-poll-submit"]');
  
  // Vote on poll
  await page.click('[data-testid="poll-option-1"]');
  await page.click('[data-testid="vote-submit"]');
  
  // View results
  await page.click('[data-testid="show-results"]');
  await expect(page.locator('text=100%')).toBeVisible();
});
```

### 4. Performance Testing

#### Load Testing Scenarios
```javascript
describe('Performance Under Load', () => {
  test('100 concurrent users viewing stories', async () => {
    // Simulate 100 users loading story feed
    // Measure response times
    // Check memory usage
    // Verify no crashes
  });
  
  test('Real-time chat with 50 active participants', async () => {
    // Create group chat with 50 users
    // Send messages rapidly
    // Measure delivery latency
    // Check message ordering
  });
  
  test('Poll with 1000+ votes', async () => {
    // Create poll
    // Simulate 1000 votes rapidly
    // Verify count accuracy
    // Check database performance
  });
});
```

#### Bundle Size & Loading Performance
```javascript
describe('Bundle Performance', () => {
  test('Initial page load under 3 seconds', async () => {
    // Measure First Contentful Paint
    // Check Largest Contentful Paint
    // Verify Time to Interactive
  });
  
  test('JavaScript bundle under 500KB gzipped', async () => {
    // Analyze bundle size
    // Check for unnecessary imports
    // Verify code splitting
  });
});
```

### 5. Mobile Testing

#### Responsive Design Tests
```javascript
describe('Mobile Experience', () => {
  test('Touch interactions work on all screen sizes', async () => {
    // Test story navigation gestures
    // Verify chat input keyboard handling
    // Check poll voting on mobile
  });
  
  test('Glass effects perform well on mobile', async () => {
    // Measure frame rates during animations
    // Check backdrop-filter support
    // Test fallbacks for older devices
  });
});
```

### 6. Accessibility Testing

#### WCAG 2.1 Compliance
```javascript
describe('Accessibility', () => {
  test('All interactive elements are keyboard accessible', async () => {
    // Tab through story interface
    // Navigate chat with keyboard
    // Vote on polls without mouse
  });
  
  test('Screen readers can access all content', async () => {
    // Test with axe-core
    // Verify ARIA labels
    // Check semantic markup
  });
  
  test('Color contrast meets AA standards', async () => {
    // Check text on glass backgrounds
    // Verify button contrast ratios
    // Test in high contrast mode
  });
});
```

### 7. Cross-browser Testing

#### Browser Compatibility Matrix
- **Chrome/Chromium**: Full functionality, glass effects
- **Firefox**: Backdrop-filter fallbacks
- **Safari**: iOS-specific testing, touch handling
- **Edge**: Windows integration, PWA features

### 8. Security Testing

#### Data Protection
```javascript
describe('Security', () => {
  test('RLS prevents cross-user data access', async () => {
    // Attempt to access other user's stories
    // Try to view private chat messages
    // Verify poll vote anonymity
  });
  
  test('File uploads are properly validated', async () => {
    // Upload malicious file types
    // Test file size limits
    // Verify virus scanning (if implemented)
  });
  
  test('Real-time channels are properly secured', async () => {
    // Attempt to join unauthorized channels
    // Test message injection attacks
    // Verify user authentication
  });
});
```

### 9. Error Handling & Edge Cases

#### Network Failure Scenarios
```javascript
describe('Error Handling', () => {
  test('Graceful degradation on network failure', async () => {
    // Simulate offline mode
    // Test retry mechanisms
    // Verify user feedback
  });
  
  test('Large file upload failures', async () => {
    // Upload files exceeding limits
    // Test timeout handling
    // Verify error messages
  });
  
  test('Real-time connection drops', async () => {
    // Simulate WebSocket disconnection
    // Test automatic reconnection
    // Verify data synchronization
  });
});
```

### 10. Quality Gates & CI/CD Integration

#### Automated Quality Checks
```yaml
# GitHub Actions workflow
quality_gates:
  - unit_tests: 95% coverage required
  - integration_tests: All critical paths pass
  - e2e_tests: Core user journeys complete
  - performance: Bundle size < 500KB, LCP < 2.5s
  - accessibility: No critical axe-core violations
  - security: No high/critical vulnerabilities
  - visual_regression: No unintended UI changes
```

### 11. Test Data Management

#### Seed Data for Testing
```javascript
// Test fixtures for consistent testing
const testData = {
  users: [
    { id: 'user1', role: 'guest', name: 'Test Guest' },
    { id: 'user2', role: 'admin', name: 'Test Admin' },
    { id: 'user3', role: 'couple', name: 'Test Couple' }
  ],
  stories: [
    { id: 'story1', type: 'photo', user_id: 'user1' },
    { id: 'story2', type: 'video', user_id: 'user2' }
  ],
  polls: [
    { id: 'poll1', question: 'Test Poll', options: ['A', 'B'] }
  ]
};
```

### 12. Monitoring & Analytics

#### Production Monitoring
- Real-time error tracking (Sentry)
- Performance monitoring (Web Vitals)
- User interaction analytics
- Database query performance
- Real-time connection health

This comprehensive testing strategy ensures the Wedding App meets the highest quality standards while maintaining excellent performance and user experience across all devices and browsers.