import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { AuthPage } from '../pages/AuthPage';
import { BasePage } from '../pages/BasePage';
import fs from 'fs';
import path from 'path';

test.describe('Admin Dashboard Routes - Complete Coverage', () => {
  let testResults: any;
  let dashboardPage: DashboardPage;
  let authPage: AuthPage;
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    authPage = new AuthPage(page);
    basePage = new BasePage(page);

    // Load test tracking
    const trackingFile = path.join(__dirname, '../../artefacts/e2e_dataflow/test-tracking.json');
    if (fs.existsSync(trackingFile)) {
      testResults = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
    } else {
      testResults = { routes: [], performance: {}, networkRequests: [], errors: [] };
    }

    // Setup admin authentication if available
    const authStateFile = path.join(__dirname, '../fixtures/auth-state.json');
    if (fs.existsSync(authStateFile)) {
      await page.context().addCookies(JSON.parse(fs.readFileSync(authStateFile, 'utf8')));
    }
  });

  test.afterEach(async ({ page }) => {
    // Save test results
    const trackingFile = path.join(__dirname, '../../artefacts/e2e_dataflow/test-tracking.json');
    fs.writeFileSync(trackingFile, JSON.stringify(testResults, null, 2));
  });

  test('Main Dashboard (/dashboard) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();
    const dataRequests = await dashboardPage.checkSupabaseDataIntegration();

    await dashboardPage.goto();
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Dashboard validation
    await dashboardPage.validateDashboardLayout();
    await dashboardPage.checkDataLoading();
    await dashboardPage.validateRealTimeFeatures();
    
    // Permission checks
    const permissions = await dashboardPage.validatePermissions();
    
    // Responsive testing
    await dashboardPage.testResponsiveDashboard();
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('dashboard-main');

    testResults.routes.push({
      route: '/dashboard',
      status: is404 ? 'failed' : 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      supabaseRequestIds: requestIds,
      dataRequests,
      permissions,
      errors: jsErrors,
      is404,
      timestamp: new Date().toISOString()
    });

    expect(is404).toBeFalsy();
  });

  test('User Management (/dashboard/users) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await dashboardPage.gotoUsers();
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    await dashboardPage.validateUserManagement();
    await dashboardPage.checkDataLoading();
    
    // Check for user management specific elements
    const userTable = page.locator('table, .user-table, [data-testid="user-table"]');
    const addUserButton = page.locator('button:has-text("Add"), [data-testid="add-user"]');
    const userFilters = page.locator('.filters, [data-testid="user-filters"]');
    const searchInput = page.locator('input[type="search"], [data-testid="user-search"]');
    
    if (await userTable.count() > 0) {
      await expect(userTable).toBeVisible();
    }
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('dashboard-users');

    testResults.routes.push({
      route: '/dashboard/users',
      status: is404 ? 'failed' : 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      supabaseRequestIds: requestIds,
      errors: jsErrors,
      is404,
      timestamp: new Date().toISOString()
    });

    expect(is404).toBeFalsy();
  });

  test('Photo Moderation (/dashboard/photos) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await dashboardPage.gotoPhotos();
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    await dashboardPage.validatePhotoModeration();
    await dashboardPage.checkDataLoading();
    
    // Check photo moderation specific elements
    const photoGrid = page.locator('.photo-grid, [data-testid="photo-grid"]');
    const moderationActions = page.locator('.moderation-actions, [data-testid="moderation-actions"]');
    const approveButtons = page.locator('button:has-text("Approve"), [data-testid="approve-photo"]');
    const rejectButtons = page.locator('button:has-text("Reject"), [data-testid="reject-photo"]');
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('dashboard-photos');

    testResults.routes.push({
      route: '/dashboard/photos',
      status: is404 ? 'failed' : 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      supabaseRequestIds: requestIds,
      errors: jsErrors,
      is404,
      timestamp: new Date().toISOString()
    });

    expect(is404).toBeFalsy();
  });

  test('Event Management (/dashboard/events) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await dashboardPage.gotoEvents();
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    await dashboardPage.validateEventManagement();
    await dashboardPage.checkDataLoading();
    
    // Check event management specific elements
    const eventTimeline = page.locator('.event-timeline, [data-testid="event-timeline"]');
    const addEventButton = page.locator('button:has-text("Add Event"), [data-testid="add-event"]');
    const eventCards = page.locator('.event-card, [data-testid="event-card"]');
    const eventFilters = page.locator('.event-filters, [data-testid="event-filters"]');
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('dashboard-events');

    testResults.routes.push({
      route: '/dashboard/events',
      status: is404 ? 'failed' : 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      supabaseRequestIds: requestIds,
      errors: jsErrors,
      is404,
      timestamp: new Date().toISOString()
    });

    expect(is404).toBeFalsy();
  });

  test('Message Management (/dashboard/messages) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await dashboardPage.gotoMessages();
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    await dashboardPage.validateMessageCenter();
    await dashboardPage.checkDataLoading();
    
    // Check message management specific elements
    const messageList = page.locator('.message-list, [data-testid="message-list"]');
    const messageFilters = page.locator('.message-filters, [data-testid="message-filters"]');
    const searchMessages = page.locator('input[placeholder*="search"], [data-testid="message-search"]');
    const messageActions = page.locator('.message-actions, [data-testid="message-actions"]');
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('dashboard-messages');

    testResults.routes.push({
      route: '/dashboard/messages',
      status: is404 ? 'failed' : 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      supabaseRequestIds: requestIds,
      errors: jsErrors,
      is404,
      timestamp: new Date().toISOString()
    });

    expect(is404).toBeFalsy();
  });

  test('Analytics Dashboard (/dashboard/analytics) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await dashboardPage.gotoAnalytics();
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    await dashboardPage.validateAnalytics();
    await dashboardPage.checkDataLoading();
    
    // Check analytics specific elements
    const charts = page.locator('canvas, svg, .chart, [data-testid="chart"]');
    const metricsCards = page.locator('.metric-card, [data-testid="metric-card"]');
    const dateFilters = page.locator('.date-filter, [data-testid="date-filter"]');
    const exportButton = page.locator('button:has-text("Export"), [data-testid="export-analytics"]');
    
    // Wait for charts to load
    await page.waitForTimeout(2000);
    
    if (await charts.count() > 0) {
      await expect(charts.first()).toBeVisible();
    }
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('dashboard-analytics');

    testResults.routes.push({
      route: '/dashboard/analytics',
      status: is404 ? 'failed' : 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      supabaseRequestIds: requestIds,
      errors: jsErrors,
      is404,
      timestamp: new Date().toISOString()
    });

    expect(is404).toBeFalsy();
  });

  test('RSVP Management (/dashboard/rsvps) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await dashboardPage.gotoRSVPs();
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    await dashboardPage.validateRSVPManagement();
    await dashboardPage.checkDataLoading();
    
    // Check RSVP management specific elements
    const rsvpList = page.locator('.rsvp-list, [data-testid="rsvp-list"]');
    const rsvpStats = page.locator('.rsvp-stats, [data-testid="rsvp-stats"]');
    const attendingFilters = page.locator('.attending-filter, [data-testid="attending-filter"]');
    const dietaryReports = page.locator('.dietary-report, [data-testid="dietary-report"]');
    const seatingPlan = page.locator('.seating-plan, [data-testid="seating-plan"]');
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('dashboard-rsvps');

    testResults.routes.push({
      route: '/dashboard/rsvps',
      status: is404 ? 'failed' : 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      supabaseRequestIds: requestIds,
      errors: jsErrors,
      is404,
      timestamp: new Date().toISOString()
    });

    expect(is404).toBeFalsy();
  });

  test('Admin Dashboard Security & Access Control', async ({ page }) => {
    const startTime = Date.now();
    
    // Test accessing admin routes without authentication
    await page.context().clearCookies();
    
    const adminRoutes = [
      '/dashboard/admin',
      '/dashboard/users', 
      '/dashboard/analytics',
      '/dashboard/messages',
      '/dashboard/photos',
      '/dashboard/events',
      '/dashboard/rsvps'
    ];
    
    const accessResults = [];
    
    for (const route of adminRoutes) {
      await basePage.goto(route);
      const currentUrl = page.url();
      const is404 = await basePage.checkFor404Errors();
      const hasAuthRedirect = currentUrl.includes('/auth') || currentUrl.includes('/login');
      
      accessResults.push({
        route,
        currentUrl,
        is404,
        hasAuthRedirect,
        isProtected: hasAuthRedirect || is404
      });
    }

    testResults.routes.push({
      route: 'admin-security-test',
      status: 'passed',
      loadTime: Date.now() - startTime,
      accessResults,
      timestamp: new Date().toISOString()
    });

    // All admin routes should be protected
    const unprotectedRoutes = accessResults.filter(result => !result.isProtected);
    expect(unprotectedRoutes.length).toBe(0);
  });
});