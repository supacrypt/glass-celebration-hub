# E2E Testing Suite

Comprehensive End-to-End testing for the Nuptuly Wedding Planning Application using Playwright.

## Overview

This E2E testing suite provides complete coverage of all routes identified in `DATA_MAP.md`, including:

- **Route Testing**: All public, admin, guest, and authentication routes
- **Supabase Integration**: X-Request-Id header validation for all API calls
- **Performance Monitoring**: Core Web Vitals and load time analysis
- **Visual Regression**: Screenshot comparison with baseline management
- **User Flow Testing**: Complete end-to-end user journeys
- **Network Monitoring**: Request/response validation and error detection
- **Accessibility Testing**: WCAG 2.1 AA compliance verification

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Application running on `http://localhost:8090`
- Supabase environment variables configured

### Installation

```bash
# Install Playwright browsers (first time only)
npm run test:e2e:install

# Run all E2E tests
npm run test:e2e

# Run specific test suites
npm run test:e2e:public     # Public routes only
npm run test:e2e:admin      # Admin dashboard routes
npm run test:e2e:guest      # Guest routes
npm run test:e2e:auth       # Authentication flows
npm run test:e2e:flows      # User journey flows

# Debug mode (opens browser)
npm run test:e2e:debug

# View test reports
npm run test:e2e:report
```

## Test Structure

```
e2e/
├── config/                 # Playwright configuration
│   ├── playwright.config.ts
│   ├── global-setup.ts
│   └── global-teardown.ts
├── pages/                  # Page Object Models
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── AuthPage.ts
│   ├── RSVPPage.ts
│   ├── DashboardPage.ts
│   └── GalleryPage.ts
├── tests/                  # Test specifications
│   ├── public-routes.spec.ts
│   ├── admin-routes.spec.ts
│   ├── guest-routes.spec.ts
│   ├── auth-routes.spec.ts
│   └── user-flows.spec.ts
├── utils/                  # Test utilities
│   ├── visual-regression.ts
│   ├── network-monitoring.ts
│   └── test-helpers.ts
├── fixtures/               # Test data
│   └── test-data.ts
├── screenshots/            # Visual regression baselines
├── videos/                 # Failure recordings
└── README.md
```

## Route Coverage

### Public Routes (8 routes)
- `/` - Home page with hero, countdown, events
- `/venue` - Venue information and maps
- `/accommodation` - Guest accommodation options
- `/transport` - Transportation and bus booking
- `/faq` - Dynamic FAQ system
- `/rsvp` - RSVP form and management
- `/gallery` - Photo gallery with lightbox
- `/social` - Social features and instant messaging

### Admin Dashboard Routes (7 routes)
- `/dashboard` - Main admin dashboard
- `/dashboard/users` - User and guest management
- `/dashboard/photos` - Photo moderation
- `/dashboard/events` - Event timeline management
- `/dashboard/messages` - Communication center
- `/dashboard/analytics` - Analytics and reporting
- `/dashboard/rsvps` - RSVP management and reports

### Guest Routes (3 routes)
- `/guest-dashboard` - Personalized guest dashboard
- `/profile` - User profile management
- `/chat` - Real-time chat and video calling

### Authentication Routes (1 route)
- `/auth` - Sign in, sign up, password reset, magic links

## Key Features

### Supabase Integration Testing
- **X-Request-Id Headers**: Validates all Supabase API calls include proper request IDs
- **Database Operations**: Tests CRUD operations across all 35 database tables
- **Real-time Features**: Validates WebSocket connections and live updates
- **Authentication Flow**: Tests Supabase Auth integration

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS measurement
- **Load Times**: Page load performance analysis
- **Network Requests**: API response time monitoring
- **Resource Loading**: Static asset optimization validation

### Visual Regression Testing
- **Baseline Management**: Automated screenshot comparison
- **Multi-viewport Testing**: Mobile, tablet, desktop layouts
- **Interaction States**: Hover, focus, active states
- **Loading States**: Skeleton screens and spinners

### User Flow Testing
- **Guest Journey**: Home → RSVP → Authentication → Dashboard
- **Admin Workflow**: Login → Dashboard → Management Tasks
- **Gallery Interaction**: Browse → View → Like → Share
- **Chat Flow**: Access → Message → Video Call → File Share

## Test Data

### Test Users
```typescript
{
  admin: 'admin@weddingsite.test',
  guest: 'guest@weddingsite.test',
  newUser: 'new-user-{timestamp}@weddingsite.test'
}
```

### RSVP Test Data
- Positive RSVP with plus-one and dietary requirements
- Negative RSVP with decline reason
- Invalid form submissions for validation testing

### Performance Thresholds
- Load Time: < 3 seconds
- First Contentful Paint: < 2.5 seconds
- Largest Contentful Paint: < 2.5 seconds
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1

## Configuration

### Environment Variables
```bash
# Required for testing
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
E2E_BASE_URL=http://localhost:8090
```

### Playwright Configuration
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Timeouts**: 30s navigation, 10s actions, 60s total test
- **Retries**: 2 retries on CI, 0 locally
- **Video**: Record on failure
- **Screenshots**: Capture on failure

## CI/CD Integration

### GitHub Actions Workflow
- **Multi-browser Testing**: Parallel execution across browsers
- **Mobile Testing**: Dedicated mobile test job
- **Visual Regression**: Baseline management and diff reporting
- **Performance Testing**: Core Web Vitals monitoring
- **Security Scanning**: Sensitive data detection

### Workflow Jobs
1. **e2e-tests**: Cross-browser testing (Chrome, Firefox, Safari)
2. **mobile-e2e**: Mobile-specific testing
3. **visual-regression**: Screenshot comparison
4. **performance-tests**: Core Web Vitals measurement
5. **generate-report**: Consolidated reporting

## Debugging

### Local Debugging
```bash
# Run tests with browser open
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug -- --grep "Home Page"

# Run single test file
npx playwright test e2e/tests/public-routes.spec.ts --debug
```

### CI Debugging
- **Artifacts**: Screenshots, videos, reports saved for 30 days
- **Trace Files**: Detailed execution traces on failure
- **Console Logs**: JavaScript errors and network failures captured

## Reports and Artifacts

### Generated Reports
- **HTML Report**: Interactive test results with screenshots
- **JSON Results**: Machine-readable test data
- **Visual Regression**: Side-by-side screenshot comparison
- **Performance Report**: Core Web Vitals and timing data
- **Network Report**: API request/response analysis

### Artifact Locations
```
artefacts/e2e_dataflow/
├── report/                 # HTML test reports
├── screenshots/            # Visual regression images
├── videos/                 # Failure recordings
├── results.json           # Test results data
├── network-logs.json      # Network monitoring data
└── visual-regression-report.html
```

## Best Practices

### Test Writing
- Use Page Object Model pattern for maintainability
- Include proper wait strategies for dynamic content
- Test error conditions and edge cases
- Validate accessibility and performance

### Data Management
- Use isolated test data to prevent conflicts
- Clean up test data after each test
- Mock external services when appropriate
- Use realistic test data that matches production

### Performance
- Set appropriate timeouts for different scenarios
- Use network idle waits for dynamic content
- Optimize test execution with parallel runs
- Skip non-critical tests in development

### Maintenance
- Update baselines after intentional UI changes
- Review and update test data regularly
- Monitor test execution times and optimize slow tests
- Keep Page Object Models in sync with UI changes

## Troubleshooting

### Common Issues

#### Tests Timing Out
```bash
# Increase timeouts in playwright.config.ts
timeout: 60000  # 60 seconds

# Or use specific timeout for slow operations
await page.waitForSelector(selector, { timeout: 30000 });
```

#### Visual Regression Failures
```bash
# Update baselines after UI changes
npx playwright test --update-snapshots

# Or delete baseline and regenerate
rm -rf e2e/screenshots/baseline/
npm run test:e2e
```

#### Network Request Failures
```bash
# Check Supabase configuration
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify application is running
curl http://localhost:8090
```

#### Authentication Issues
```bash
# Clear browser data
rm -rf playwright/.auth/

# Run with fresh browser context
npm run test:e2e -- --headed
```

### Getting Help

1. **Check Reports**: Review HTML reports for detailed failure information
2. **View Screenshots**: Look at failure screenshots for visual context
3. **Check Network Logs**: Review API requests and responses
4. **Run in Debug Mode**: Use `--debug` flag to step through tests
5. **Review Console Logs**: Check for JavaScript errors

## Contributing

### Adding New Tests
1. Create test files in appropriate category (public, admin, guest, auth)
2. Use existing Page Object Models or create new ones
3. Follow naming conventions: `feature-name.spec.ts`
4. Include comprehensive assertions and error handling

### Updating Page Objects
1. Keep selectors up-to-date with UI changes
2. Add new methods for new functionality
3. Maintain consistent patterns across page objects
4. Document complex interactions

### Test Data Updates
1. Update `fixtures/test-data.ts` with new test scenarios
2. Ensure test data is realistic and comprehensive
3. Add new selectors to `testSelectors` object
4. Update performance thresholds as needed

---

For questions or issues, please refer to the main project documentation or create an issue in the repository.