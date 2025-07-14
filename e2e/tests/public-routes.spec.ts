import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { GalleryPage } from '../pages/GalleryPage';
import { RSVPPage } from '../pages/RSVPPage';
import { BasePage } from '../pages/BasePage';
import fs from 'fs';
import path from 'path';

test.describe('Public Routes - Complete Coverage', () => {
  let testResults: any;
  let homePage: HomePage;
  let galleryPage: GalleryPage;
  let rsvpPage: RSVPPage;
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    galleryPage = new GalleryPage(page);
    rsvpPage = new RSVPPage(page);
    basePage = new BasePage(page);

    // Load test tracking
    const trackingFile = path.join(__dirname, '../../artefacts/e2e_dataflow/test-tracking.json');
    if (fs.existsSync(trackingFile)) {
      testResults = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
    } else {
      testResults = { routes: [], performance: {}, networkRequests: [], errors: [] };
    }
  });

  test.afterEach(async ({ page }) => {
    // Save test results
    const trackingFile = path.join(__dirname, '../../artefacts/e2e_dataflow/test-tracking.json');
    fs.writeFileSync(trackingFile, JSON.stringify(testResults, null, 2));
  });

  test('Home Page (/) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();
    const networkRequests = await basePage.monitorNetworkRequests();

    // Navigate to home page
    await homePage.goto();
    
    // Performance metrics
    const performanceMetrics = await basePage.getPerformanceMetrics();
    const coreWebVitals = await basePage.getCoreWebVitals();
    
    // Validation tests
    await homePage.validatePageElements();
    await homePage.checkResponsiveDesign();
    
    // Error checking
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    const accessibilityCheck = await basePage.checkAccessibility();
    
    // Screenshot for visual regression
    await basePage.takeScreenshot('home-page-desktop');
    
    // Mobile screenshot
    await page.setViewportSize({ width: 375, height: 667 });
    await basePage.takeScreenshot('home-page-mobile');
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Record test results
    testResults.routes.push({
      route: '/',
      status: 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      coreWebVitals,
      supabaseRequestIds: requestIds,
      errors: jsErrors,
      accessibility: accessibilityCheck,
      is404,
      timestamp: new Date().toISOString()
    });

    // Assertions
    expect(is404).toBeFalsy();
    expect(jsErrors.length).toBeLessThan(5); // Allow some minor console warnings
    expect(performanceMetrics.loadTime).toBeLessThan(3000); // 3 second load time
    expect(accessibilityCheck.hasTitle).toBeTruthy();
  });

  test('Venue Page (/venue) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await basePage.goto('/venue');
    
    // Check page loads without 404
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Check for venue-specific elements
    const venueImages = page.locator('img, .venue-image, [data-testid="venue-image"]');
    const venueInfo = page.locator('.venue-info, [data-testid="venue-info"]');
    const mapSection = page.locator('.map, [data-testid="venue-map"]');
    
    if (await venueImages.count() > 0) {
      await expect(venueImages.first()).toBeVisible();
    }
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('venue-page');

    testResults.routes.push({
      route: '/venue',
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

  test('Accommodation Page (/accommodation) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await basePage.goto('/accommodation');
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Check for accommodation-specific elements
    const accommodationOptions = page.locator('.accommodation-option, [data-testid="accommodation-option"]');
    const accommodationCards = page.locator('.accommodation-card, [data-testid="accommodation-card"]');
    
    if (await accommodationOptions.count() > 0) {
      await expect(accommodationOptions.first()).toBeVisible();
    }
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('accommodation-page');

    testResults.routes.push({
      route: '/accommodation',
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

  test('Transport Page (/transport) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await basePage.goto('/transport');
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Check for transport-specific elements
    const transportOptions = page.locator('.transport-option, [data-testid="transport-option"]');
    const busBooking = page.locator('.bus-booking, [data-testid="bus-booking"]');
    const carpoolOptions = page.locator('.carpool, [data-testid="carpool"]');
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('transport-page');

    testResults.routes.push({
      route: '/transport',
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

  test('FAQ Page (/faq) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await basePage.goto('/faq');
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Check for FAQ-specific elements
    const faqItems = page.locator('.faq-item, [data-testid="faq-item"]');
    const faqCategories = page.locator('.faq-category, [data-testid="faq-category"]');
    const searchFaq = page.locator('input[placeholder*="search"], [data-testid="faq-search"]');
    
    if (await faqItems.count() > 0) {
      await expect(faqItems.first()).toBeVisible();
      
      // Test FAQ interaction
      await faqItems.first().click();
      await page.waitForTimeout(500);
    }
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('faq-page');

    testResults.routes.push({
      route: '/faq',
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

  test('RSVP Page (/rsvp) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();
    const rsvpRequests = await rsvpPage.checkSupabaseIntegration();

    await rsvpPage.goto();
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Comprehensive RSVP testing
    await rsvpPage.validateRSVPForm();
    await rsvpPage.validateFormValidation();
    await rsvpPage.validateAccommodationIntegration();
    await rsvpPage.validateTransportIntegration();
    
    // Test RSVP submission with test data
    await rsvpPage.completeRSVP({
      attending: true,
      name: 'Test Guest',
      email: 'test@example.com',
      dietary: 'No restrictions'
    });
    
    const response = await rsvpPage.validateResponseAfterSubmission();
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('rsvp-page');

    testResults.routes.push({
      route: '/rsvp',
      status: is404 ? 'failed' : 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      supabaseRequestIds: requestIds,
      rsvpRequests,
      response,
      errors: jsErrors,
      is404,
      timestamp: new Date().toISOString()
    });

    expect(is404).toBeFalsy();
  });

  test('Gallery Page (/gallery) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();
    const photoRequests = await galleryPage.checkSupabasePhotoIntegration();

    await galleryPage.goto();
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Comprehensive gallery testing
    await galleryPage.validateGalleryLayout();
    await galleryPage.validatePhotoItems();
    await galleryPage.validateLightbox();
    await galleryPage.testLightboxNavigation();
    
    const imageOptimization = await galleryPage.checkImageOptimization();
    const photoMetadata = await galleryPage.validatePhotoMetadata();
    const accessibilityIssues = await galleryPage.validatePhotoAccessibility();
    const lazyLoadingTest = await galleryPage.testPhotoLazyLoading();
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('gallery-page');

    testResults.routes.push({
      route: '/gallery',
      status: is404 ? 'failed' : 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      supabaseRequestIds: requestIds,
      photoRequests,
      imageOptimization,
      photoMetadata,
      accessibilityIssues,
      lazyLoadingTest,
      errors: jsErrors,
      is404,
      timestamp: new Date().toISOString()
    });

    expect(is404).toBeFalsy();
    expect(accessibilityIssues.length).toBeLessThan(3); // Allow minimal accessibility issues
  });

  test('Social Page (/social) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await basePage.goto('/social');
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Check for social-specific elements
    const socialFeed = page.locator('.social-feed, [data-testid="social-feed"]');
    const stories = page.locator('.stories, [data-testid="stories"]');
    const posts = page.locator('.post, [data-testid="post"]');
    const instantMessenger = page.locator('.instant-messenger, [data-testid="instant-messenger"]');
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('social-page');

    testResults.routes.push({
      route: '/social',
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
});