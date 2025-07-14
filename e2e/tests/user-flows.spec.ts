import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';
import { RSVPPage } from '../pages/RSVPPage';
import { DashboardPage } from '../pages/DashboardPage';
import { BasePage } from '../pages/BasePage';
import { VisualRegressionUtils } from '../utils/visual-regression';
import fs from 'fs';
import path from 'path';

test.describe('User Flows - End-to-End Journey Testing', () => {
  let testResults: any;
  let homePage: HomePage;
  let authPage: AuthPage;
  let rsvpPage: RSVPPage;
  let dashboardPage: DashboardPage;
  let basePage: BasePage;
  let visualUtils: VisualRegressionUtils;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    authPage = new AuthPage(page);
    rsvpPage = new RSVPPage(page);
    dashboardPage = new DashboardPage(page);
    basePage = new BasePage(page);
    visualUtils = new VisualRegressionUtils(page);

    // Load test tracking
    const trackingFile = path.join(__dirname, '../../artefacts/e2e_dataflow/test-tracking.json');
    if (fs.existsSync(trackingFile)) {
      testResults = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
    } else {
      testResults = { routes: [], performance: {}, networkRequests: [], errors: [], userFlows: [] };
    }

    // Clear authentication
    await page.context().clearCookies();
  });

  test.afterEach(async ({ page }) => {
    // Save test results
    const trackingFile = path.join(__dirname, '../../artefacts/e2e_dataflow/test-tracking.json');
    fs.writeFileSync(trackingFile, JSON.stringify(testResults, null, 2));
  });

  test('Complete Guest Journey: Home → RSVP → Dashboard', async ({ page }) => {
    const startTime = Date.now();
    const flowSteps = [];
    const visualResults = [];

    // Step 1: Visit Home Page
    await homePage.goto();
    await homePage.validatePageElements();
    
    const homeMetrics = await basePage.getPerformanceMetrics();
    const homeVisual = await visualUtils.captureAndCompare('user-flow-home');
    visualResults.push({ step: 'home', ...homeVisual });
    
    flowSteps.push({
      step: 1,
      action: 'Visit Home Page',
      url: page.url(),
      metrics: homeMetrics,
      timestamp: Date.now()
    });

    // Step 2: Navigate to RSVP
    await homePage.clickRSVP();
    await rsvpPage.validateRSVPForm();
    
    const rsvpVisual = await visualUtils.captureAndCompare('user-flow-rsvp');
    visualResults.push({ step: 'rsvp', ...rsvpVisual });
    
    flowSteps.push({
      step: 2,
      action: 'Navigate to RSVP',
      url: page.url(),
      timestamp: Date.now()
    });

    // Step 3: Complete RSVP
    const guestData = {
      attending: true,
      name: 'E2E Test Guest',
      email: `e2e-test-${Date.now()}@example.com`,
      dietary: 'No restrictions',
      plusOne: { name: 'E2E Plus One' }
    };
    
    await rsvpPage.completeRSVP(guestData);
    const rsvpResponse = await rsvpPage.validateResponseAfterSubmission();
    
    const rsvpCompletedVisual = await visualUtils.captureAndCompare('user-flow-rsvp-completed');
    visualResults.push({ step: 'rsvp-completed', ...rsvpCompletedVisual });
    
    flowSteps.push({
      step: 3,
      action: 'Complete RSVP',
      url: page.url(),
      guestData,
      response: rsvpResponse,
      timestamp: Date.now()
    });

    // Step 4: Check for auth or dashboard redirect
    let authRequired = false;
    if (page.url().includes('/auth') || page.url().includes('/login')) {
      authRequired = true;
      
      // Step 4a: Sign up new user
      await authPage.signUp(guestData.email, 'TestPassword123!');
      await basePage.waitForNetworkIdle();
      
      const authVisual = await visualUtils.captureAndCompare('user-flow-auth');
      visualResults.push({ step: 'auth', ...authVisual });
      
      flowSteps.push({
        step: '4a',
        action: 'Complete Authentication',
        url: page.url(),
        authRequired: true,
        timestamp: Date.now()
      });
    }

    // Step 5: Access Guest Dashboard
    if (!page.url().includes('/guest-dashboard') && !page.url().includes('/dashboard')) {
      await basePage.goto('/guest-dashboard');
    }
    
    const dashboardAvailable = !await basePage.checkFor404Errors();
    if (dashboardAvailable) {
      const dashboardVisual = await visualUtils.captureAndCompare('user-flow-dashboard');
      visualResults.push({ step: 'dashboard', ...dashboardVisual });
      
      // Validate dashboard functionality
      const dashboardElements = {
        guestProfile: await page.locator('.guest-profile, [data-testid="guest-profile"]').count() > 0,
        rsvpStatus: await page.locator('.rsvp-status, [data-testid="rsvp-status"]').count() > 0,
        guestList: await page.locator('.guest-list, [data-testid="guest-list"]').count() > 0
      };
      
      flowSteps.push({
        step: 5,
        action: 'Access Guest Dashboard',
        url: page.url(),
        dashboardElements,
        timestamp: Date.now()
      });
    }

    // Calculate total flow time
    const totalFlowTime = Date.now() - startTime;

    testResults.userFlows.push({
      flow: 'guest-journey-complete',
      status: 'completed',
      totalTime: totalFlowTime,
      steps: flowSteps,
      visualResults,
      authRequired,
      dashboardAvailable,
      guestData,
      timestamp: new Date().toISOString()
    });

    expect(flowSteps.length).toBeGreaterThanOrEqual(4);
    expect(totalFlowTime).toBeLessThan(60000); // Complete flow should take less than 60 seconds
  });

  test('Admin Journey: Auth → Dashboard → User Management', async ({ page }) => {
    const startTime = Date.now();
    const flowSteps = [];
    const visualResults = [];
    const adminCredentials = {
      email: 'admin@example.com',
      password: 'AdminPassword123!'
    };

    // Step 1: Access Auth Page
    await authPage.goto();
    await authPage.validateAuthForms();
    
    const authVisual = await visualUtils.captureAndCompare('admin-flow-auth');
    visualResults.push({ step: 'auth', ...authVisual });
    
    flowSteps.push({
      step: 1,
      action: 'Access Auth Page',
      url: page.url(),
      timestamp: Date.now()
    });

    // Step 2: Sign In as Admin
    await authPage.signIn(adminCredentials.email, adminCredentials.password);
    await basePage.waitForNetworkIdle();
    
    const authErrors = await authPage.checkForErrors();
    const authRedirect = await authPage.testAuthRedirect();
    
    flowSteps.push({
      step: 2,
      action: 'Admin Sign In',
      url: page.url(),
      authErrors,
      authRedirect,
      timestamp: Date.now()
    });

    // Step 3: Access Admin Dashboard
    await dashboardPage.goto();
    const dashboardAvailable = !await basePage.checkFor404Errors();
    
    if (dashboardAvailable) {
      await dashboardPage.validateDashboardLayout();
      await dashboardPage.checkDataLoading();
      
      const dashboardVisual = await visualUtils.captureAndCompare('admin-flow-dashboard');
      visualResults.push({ step: 'dashboard', ...dashboardVisual });
      
      flowSteps.push({
        step: 3,
        action: 'Access Admin Dashboard',
        url: page.url(),
        timestamp: Date.now()
      });

      // Step 4: Navigate to User Management
      await dashboardPage.gotoUsers();
      await dashboardPage.validateUserManagement();
      
      const userMgmtVisual = await visualUtils.captureAndCompare('admin-flow-users');
      visualResults.push({ step: 'user-management', ...userMgmtVisual });
      
      const userManagementFeatures = {
        userTable: await page.locator('table, .user-table, [data-testid="user-table"]').count() > 0,
        addUser: await page.locator('button:has-text("Add"), [data-testid="add-user"]').count() > 0,
        searchUsers: await page.locator('input[type="search"], [data-testid="user-search"]').count() > 0,
        userFilters: await page.locator('.filters, [data-testid="user-filters"]').count() > 0
      };
      
      flowSteps.push({
        step: 4,
        action: 'Navigate to User Management',
        url: page.url(),
        userManagementFeatures,
        timestamp: Date.now()
      });

      // Step 5: Test Analytics Access
      await dashboardPage.gotoAnalytics();
      const analyticsAvailable = !await basePage.checkFor404Errors();
      
      if (analyticsAvailable) {
        await dashboardPage.validateAnalytics();
        
        const analyticsVisual = await visualUtils.captureAndCompare('admin-flow-analytics');
        visualResults.push({ step: 'analytics', ...analyticsVisual });
        
        const analyticsFeatures = {
          charts: await page.locator('canvas, svg, .chart, [data-testid="chart"]').count() > 0,
          metrics: await page.locator('.metric-card, [data-testid="metric-card"]').count() > 0,
          filters: await page.locator('.date-filter, [data-testid="date-filter"]').count() > 0
        };
        
        flowSteps.push({
          step: 5,
          action: 'Access Analytics',
          url: page.url(),
          analyticsFeatures,
          timestamp: Date.now()
        });
      }
    }

    const totalFlowTime = Date.now() - startTime;

    testResults.userFlows.push({
      flow: 'admin-journey-complete',
      status: 'completed',
      totalTime: totalFlowTime,
      steps: flowSteps,
      visualResults,
      dashboardAvailable,
      adminCredentials: { email: adminCredentials.email }, // Don't save password
      timestamp: new Date().toISOString()
    });

    expect(flowSteps.length).toBeGreaterThanOrEqual(3);
  });

  test('Gallery Interaction Flow: Browse → View → Like → Share', async ({ page }) => {
    const startTime = Date.now();
    const flowSteps = [];
    const visualResults = [];

    // Step 1: Navigate to Gallery
    await basePage.goto('/gallery');
    const galleryAvailable = !await basePage.checkFor404Errors();
    
    if (galleryAvailable) {
      // Validate gallery layout
      const galleryContainer = page.locator('.gallery, [data-testid="gallery"]');
      const photoItems = page.locator('.photo-item, [data-testid="photo-item"], img');
      
      await expect(galleryContainer).toBeVisible();
      
      const galleryVisual = await visualUtils.captureAndCompare('gallery-flow-main');
      visualResults.push({ step: 'gallery-main', ...galleryVisual });
      
      flowSteps.push({
        step: 1,
        action: 'Navigate to Gallery',
        url: page.url(),
        photoCount: await photoItems.count(),
        timestamp: Date.now()
      });

      if (await photoItems.count() > 0) {
        // Step 2: Click on Photo (Lightbox)
        await photoItems.first().click();
        await page.waitForTimeout(1000);
        
        const lightbox = page.locator('.lightbox, [data-testid="lightbox"]');
        const lightboxVisible = await lightbox.count() > 0;
        
        if (lightboxVisible) {
          const lightboxVisual = await visualUtils.captureAndCompare('gallery-flow-lightbox');
          visualResults.push({ step: 'lightbox', ...lightboxVisual });
          
          flowSteps.push({
            step: 2,
            action: 'Open Photo Lightbox',
            url: page.url(),
            lightboxVisible,
            timestamp: Date.now()
          });

          // Step 3: Test Lightbox Navigation
          const nextButton = page.locator('.next, [data-testid="next-photo"]');
          if (await nextButton.count() > 0) {
            await nextButton.click();
            await page.waitForTimeout(500);
            
            const nextVisual = await visualUtils.captureAndCompare('gallery-flow-next');
            visualResults.push({ step: 'lightbox-next', ...nextVisual });
          }

          // Step 4: Test Like Functionality
          const likeButton = page.locator('.like-button, [data-testid="like-button"]');
          if (await likeButton.count() > 0) {
            await likeButton.click();
            await basePage.waitForNetworkIdle();
            
            const likeVisual = await visualUtils.captureAndCompare('gallery-flow-liked');
            visualResults.push({ step: 'photo-liked', ...likeVisual });
            
            flowSteps.push({
              step: 4,
              action: 'Like Photo',
              timestamp: Date.now()
            });
          }

          // Step 5: Close Lightbox
          const closeButton = page.locator('.lightbox-close, [data-testid="lightbox-close"]');
          if (await closeButton.count() > 0) {
            await closeButton.click();
          } else {
            await page.keyboard.press('Escape');
          }
          
          await page.waitForTimeout(500);
          
          flowSteps.push({
            step: 5,
            action: 'Close Lightbox',
            timestamp: Date.now()
          });
        }
      }
    }

    const totalFlowTime = Date.now() - startTime;

    testResults.userFlows.push({
      flow: 'gallery-interaction-complete',
      status: 'completed',
      totalTime: totalFlowTime,
      steps: flowSteps,
      visualResults,
      galleryAvailable,
      timestamp: new Date().toISOString()
    });

    expect(flowSteps.length).toBeGreaterThanOrEqual(2);
  });

  test('Chat and Communication Flow: Access → Message → Video Call', async ({ page }) => {
    const startTime = Date.now();
    const flowSteps = [];
    const visualResults = [];

    // Step 1: Navigate to Chat
    await basePage.goto('/chat');
    const chatAvailable = !await basePage.checkFor404Errors();
    
    if (chatAvailable) {
      const chatContainer = page.locator('.chat-container, [data-testid="chat-container"]');
      const chatList = page.locator('.chat-list, [data-testid="chat-list"]');
      
      const chatVisual = await visualUtils.captureAndCompare('chat-flow-main');
      visualResults.push({ step: 'chat-main', ...chatVisual });
      
      flowSteps.push({
        step: 1,
        action: 'Navigate to Chat',
        url: page.url(),
        timestamp: Date.now()
      });

      // Step 2: Select Chat
      const chatItems = page.locator('.chat-item, [data-testid="chat-item"]');
      if (await chatItems.count() > 0) {
        await chatItems.first().click();
        await page.waitForTimeout(1000);
        
        const chatSelectedVisual = await visualUtils.captureAndCompare('chat-flow-selected');
        visualResults.push({ step: 'chat-selected', ...chatSelectedVisual });
        
        flowSteps.push({
          step: 2,
          action: 'Select Chat',
          timestamp: Date.now()
        });

        // Step 3: Send Message
        const messageInput = page.locator('input[placeholder*="message"], textarea, [data-testid="message-input"]');
        const sendButton = page.locator('button:has-text("Send"), [data-testid="send-message"]');
        
        if (await messageInput.count() > 0 && await sendButton.count() > 0) {
          await messageInput.fill('Hello from E2E test! 👋');
          await sendButton.click();
          await basePage.waitForNetworkIdle();
          
          const messageSentVisual = await visualUtils.captureAndCompare('chat-flow-message-sent');
          visualResults.push({ step: 'message-sent', ...messageSentVisual });
          
          flowSteps.push({
            step: 3,
            action: 'Send Message',
            message: 'Hello from E2E test! 👋',
            timestamp: Date.now()
          });
        }

        // Step 4: Test Video Call Button
        const videoCallButton = page.locator('button:has-text("Video"), [data-testid="video-call"]');
        if (await videoCallButton.count() > 0) {
          await videoCallButton.click();
          await page.waitForTimeout(2000);
          
          const videoCallVisual = await visualUtils.captureAndCompare('chat-flow-video-call');
          visualResults.push({ step: 'video-call', ...videoCallVisual });
          
          // Check for video call interface
          const videoInterface = page.locator('.video-call-interface, [data-testid="video-call-interface"]');
          const callControls = page.locator('.call-controls, [data-testid="call-controls"]');
          
          flowSteps.push({
            step: 4,
            action: 'Initiate Video Call',
            hasVideoInterface: await videoInterface.count() > 0,
            hasCallControls: await callControls.count() > 0,
            timestamp: Date.now()
          });
        }

        // Step 5: Test Instant Messenger
        const instantMessenger = page.locator('.instant-messenger, [data-testid="instant-messenger"]');
        if (await instantMessenger.count() > 0) {
          const messengerVisual = await visualUtils.captureAndCompare('chat-flow-instant-messenger');
          visualResults.push({ step: 'instant-messenger', ...messengerVisual });
          
          flowSteps.push({
            step: 5,
            action: 'Access Instant Messenger',
            timestamp: Date.now()
          });
        }
      }
    }

    const totalFlowTime = Date.now() - startTime;

    testResults.userFlows.push({
      flow: 'chat-communication-complete',
      status: 'completed',
      totalTime: totalFlowTime,
      steps: flowSteps,
      visualResults,
      chatAvailable,
      timestamp: new Date().toISOString()
    });

    expect(flowSteps.length).toBeGreaterThanOrEqual(2);
  });

  test('Performance Across User Flow', async ({ page }) => {
    const startTime = Date.now();
    const performanceData = [];
    
    const criticalPages = [
      { path: '/', name: 'Home' },
      { path: '/rsvp', name: 'RSVP' },
      { path: '/gallery', name: 'Gallery' },
      { path: '/auth', name: 'Auth' },
      { path: '/dashboard', name: 'Dashboard' }
    ];
    
    for (const pageInfo of criticalPages) {
      await basePage.goto(pageInfo.path);
      
      const metrics = await basePage.getPerformanceMetrics();
      const coreWebVitals = await basePage.getCoreWebVitals();
      const is404 = await basePage.checkFor404Errors();
      
      if (!is404) {
        performanceData.push({
          page: pageInfo.name,
          path: pageInfo.path,
          loadTime: metrics.loadTime,
          domContentLoaded: metrics.domContentLoaded,
          firstContentfulPaint: metrics.firstContentfulPaint,
          coreWebVitals,
          timestamp: Date.now()
        });
      }
    }

    const totalFlowTime = Date.now() - startTime;

    testResults.userFlows.push({
      flow: 'performance-across-flow',
      status: 'completed',
      totalTime: totalFlowTime,
      performanceData,
      timestamp: new Date().toISOString()
    });

    // Performance assertions
    const slowPages = performanceData.filter(p => p.loadTime > 3000);
    expect(slowPages.length).toBeLessThanOrEqual(1); // Allow one slow page
    
    const averageLoadTime = performanceData.reduce((acc, p) => acc + p.loadTime, 0) / performanceData.length;
    expect(averageLoadTime).toBeLessThan(2500); // Average should be under 2.5 seconds
  });
});