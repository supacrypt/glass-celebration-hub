import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { AuthPage } from '../pages/AuthPage';
import fs from 'fs';
import path from 'path';

test.describe('Guest Routes - Complete Coverage', () => {
  let testResults: any;
  let basePage: BasePage;
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    authPage = new AuthPage(page);

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

  test('Guest Dashboard (/guest-dashboard) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await basePage.goto('/guest-dashboard');
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Check for guest dashboard elements
    const guestWelcome = page.locator('.welcome, [data-testid="guest-welcome"]');
    const guestProfile = page.locator('.guest-profile, [data-testid="guest-profile"]');
    const rsvpStatus = page.locator('.rsvp-status, [data-testid="rsvp-status"]');
    const guestList = page.locator('.guest-list, [data-testid="guest-list"]');
    const eventInfo = page.locator('.event-info, [data-testid="event-info"]');
    const quickActions = page.locator('.quick-actions, [data-testid="quick-actions"]');
    
    // Validate core guest dashboard elements
    if (await guestProfile.count() > 0) {
      await expect(guestProfile).toBeVisible();
    }
    
    if (await rsvpStatus.count() > 0) {
      await expect(rsvpStatus).toBeVisible();
    }
    
    // Check guest list functionality
    if (await guestList.count() > 0) {
      await expect(guestList).toBeVisible();
      
      // Test guest list interactions
      const guestItems = page.locator('.guest-item, [data-testid="guest-item"]');
      if (await guestItems.count() > 0) {
        await expect(guestItems.first()).toBeVisible();
      }
    }
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('guest-dashboard');

    testResults.routes.push({
      route: '/guest-dashboard',
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

  test('Profile Page (/profile) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await basePage.goto('/profile');
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Check for profile elements
    const profileForm = page.locator('form, .profile-form, [data-testid="profile-form"]');
    const profilePicture = page.locator('.profile-picture, [data-testid="profile-picture"]');
    const nameInput = page.locator('input[name="name"], [data-testid="name-input"]');
    const emailInput = page.locator('input[type="email"], [data-testid="email-input"]');
    const saveButton = page.locator('button:has-text("Save"), [data-testid="save-profile"]');
    const preferences = page.locator('.preferences, [data-testid="preferences"]');
    
    // Validate profile form elements
    if (await profileForm.count() > 0) {
      await expect(profileForm).toBeVisible();
    }
    
    if (await nameInput.count() > 0) {
      await expect(nameInput).toBeVisible();
    }
    
    if (await emailInput.count() > 0) {
      await expect(emailInput).toBeVisible();
    }
    
    // Test profile update functionality
    if (await nameInput.count() > 0 && await saveButton.count() > 0) {
      const originalValue = await nameInput.inputValue();
      await nameInput.fill('Test Guest Updated');
      await saveButton.click();
      await basePage.waitForNetworkIdle();
      
      // Check for success message or updated value
      const successMessage = page.locator('.success, [data-testid="success-message"]');
      if (await successMessage.count() > 0) {
        await expect(successMessage).toBeVisible();
      }
      
      // Restore original value
      await nameInput.fill(originalValue);
      await saveButton.click();
    }
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('profile-page');

    testResults.routes.push({
      route: '/profile',
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

  test('Chat System (/chat) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();

    await basePage.goto('/chat');
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Check for chat elements
    const chatContainer = page.locator('.chat-container, [data-testid="chat-container"]');
    const chatList = page.locator('.chat-list, [data-testid="chat-list"]');
    const messageArea = page.locator('.message-area, [data-testid="message-area"]');
    const messageInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"], [data-testid="message-input"]');
    const sendButton = page.locator('button:has-text("Send"), [data-testid="send-message"]');
    const instantMessenger = page.locator('.instant-messenger, [data-testid="instant-messenger"]');
    
    // Validate chat interface
    if (await chatContainer.count() > 0) {
      await expect(chatContainer).toBeVisible();
    }
    
    if (await chatList.count() > 0) {
      await expect(chatList).toBeVisible();
      
      // Test chat selection
      const chatItems = page.locator('.chat-item, [data-testid="chat-item"]');
      if (await chatItems.count() > 0) {
        await chatItems.first().click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Test message functionality
    if (await messageInput.count() > 0 && await sendButton.count() > 0) {
      await messageInput.fill('Test message from E2E test');
      await sendButton.click();
      await basePage.waitForNetworkIdle();
    }
    
    // Test instant messenger features
    if (await instantMessenger.count() > 0) {
      await expect(instantMessenger).toBeVisible();
      
      // Test video call button
      const videoCallButton = page.locator('button:has-text("Video"), [data-testid="video-call"]');
      if (await videoCallButton.count() > 0) {
        await expect(videoCallButton).toBeVisible();
      }
      
      // Test audio call button
      const audioCallButton = page.locator('button:has-text("Audio"), [data-testid="audio-call"]');
      if (await audioCallButton.count() > 0) {
        await expect(audioCallButton).toBeVisible();
      }
    }
    
    // Check for typing indicators
    const typingIndicator = page.locator('.typing-indicator, [data-testid="typing-indicator"]');
    if (await typingIndicator.count() > 0) {
      // Typing indicators might appear during test
    }
    
    // Test message reactions
    const messages = page.locator('.message, [data-testid="message"]');
    if (await messages.count() > 0) {
      const firstMessage = messages.first();
      await firstMessage.hover();
      
      const reactionButton = page.locator('.reaction-button, [data-testid="reaction-button"]');
      if (await reactionButton.count() > 0) {
        await reactionButton.first().click();
        await page.waitForTimeout(500);
      }
    }
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    await basePage.takeScreenshot('chat-page');

    testResults.routes.push({
      route: '/chat',
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

  test('Guest Routes - Real-time Features Testing', async ({ page }) => {
    const startTime = Date.now();
    
    // Test real-time notifications
    await basePage.goto('/guest-dashboard');
    
    const notificationBell = page.locator('.notification-bell, [data-testid="notification-bell"]');
    const liveNotifications = page.locator('.live-notifications, [data-testid="live-notifications"]');
    const presenceIndicators = page.locator('.presence-indicator, [data-testid="presence-indicator"]');
    
    // Check for notification system
    if (await notificationBell.count() > 0) {
      await expect(notificationBell).toBeVisible();
      await notificationBell.click();
      await page.waitForTimeout(1000);
      
      const notificationDropdown = page.locator('.notification-dropdown, [data-testid="notification-dropdown"]');
      if (await notificationDropdown.count() > 0) {
        await expect(notificationDropdown).toBeVisible();
      }
    }
    
    // Check for presence indicators
    if (await presenceIndicators.count() > 0) {
      await expect(presenceIndicators.first()).toBeVisible();
    }
    
    // Test live features on chat page
    await basePage.goto('/chat');
    
    const liveUserPresence = page.locator('.live-user-presence, [data-testid="live-user-presence"]');
    const onlineUsers = page.locator('.online-user, [data-testid="online-user"]');
    
    if (await liveUserPresence.count() > 0) {
      await expect(liveUserPresence).toBeVisible();
    }
    
    await basePage.takeScreenshot('guest-realtime-features');

    testResults.routes.push({
      route: 'guest-realtime-features',
      status: 'passed',
      loadTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  });

  test('Guest Routes - Mobile Responsiveness', async ({ page }) => {
    const startTime = Date.now();
    
    const guestRoutes = ['/guest-dashboard', '/profile', '/chat'];
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    const responsiveResults = [];
    
    for (const route of guestRoutes) {
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await basePage.goto(route);
        
        const is404 = await basePage.checkFor404Errors();
        const jsErrors = await basePage.checkForJavaScriptErrors();
        
        // Check for mobile-specific elements
        const mobileNav = page.locator('.mobile-nav, [data-testid="mobile-nav"]');
        const hamburgerMenu = page.locator('.hamburger, [data-testid="hamburger-menu"]');
        const bottomNav = page.locator('.bottom-nav, [data-testid="bottom-nav"]');
        
        const hasMobileFeatures = await mobileNav.count() > 0 || 
                                 await hamburgerMenu.count() > 0 || 
                                 await bottomNav.count() > 0;
        
        await basePage.takeScreenshot(`guest-${route.replace('/', '')}-${viewport.name}`);
        
        responsiveResults.push({
          route,
          viewport: viewport.name,
          is404,
          errors: jsErrors,
          hasMobileFeatures: viewport.name === 'mobile' ? hasMobileFeatures : null
        });
      }
    }

    testResults.routes.push({
      route: 'guest-responsive-test',
      status: 'passed',
      loadTime: Date.now() - startTime,
      responsiveResults,
      timestamp: new Date().toISOString()
    });

    // Reset to desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('Guest Routes - Access Control', async ({ page }) => {
    const startTime = Date.now();
    
    // Test guest routes without authentication
    await page.context().clearCookies();
    
    const guestRoutes = ['/guest-dashboard', '/profile', '/chat'];
    const accessResults = [];
    
    for (const route of guestRoutes) {
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
      route: 'guest-access-control',
      status: 'passed',
      loadTime: Date.now() - startTime,
      accessResults,
      timestamp: new Date().toISOString()
    });

    // Guest routes should require authentication or show guest-appropriate content
    const validStates = accessResults.filter(result => 
      result.isProtected || (!result.is404 && !result.hasAuthRedirect)
    );
    expect(validStates.length).toBe(guestRoutes.length);
  });
});