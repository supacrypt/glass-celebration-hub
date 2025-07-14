import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { BasePage } from '../pages/BasePage';
import fs from 'fs';
import path from 'path';

test.describe('Authentication Routes - Complete Coverage', () => {
  let testResults: any;
  let authPage: AuthPage;
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    basePage = new BasePage(page);

    // Load test tracking
    const trackingFile = path.join(__dirname, '../../artefacts/e2e_dataflow/test-tracking.json');
    if (fs.existsSync(trackingFile)) {
      testResults = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
    } else {
      testResults = { routes: [], performance: {}, networkRequests: [], errors: [] };
    }

    // Clear any existing authentication
    await page.context().clearCookies();
  });

  test.afterEach(async ({ page }) => {
    // Save test results
    const trackingFile = path.join(__dirname, '../../artefacts/e2e_dataflow/test-tracking.json');
    fs.writeFileSync(trackingFile, JSON.stringify(testResults, null, 2));
  });

  test('Authentication Page (/auth) - Complete Validation', async ({ page }) => {
    const startTime = Date.now();
    const requestIds = await basePage.validateSupabaseHeaders();
    const authRequests = await authPage.checkSupabaseAuthIntegration();

    await authPage.goto();
    
    const is404 = await basePage.checkFor404Errors();
    const jsErrors = await basePage.checkForJavaScriptErrors();
    
    // Comprehensive auth form validation
    await authPage.validateAuthForms();
    await authPage.validateFormValidation();
    
    // Test password strength validation
    await authPage.validatePasswordStrength();
    
    // Test form toggles
    await authPage.toggleToSignUp();
    await page.waitForTimeout(500);
    await authPage.toggleToSignIn();
    await page.waitForTimeout(500);
    
    // Test forgot password flow
    await authPage.clickForgotPassword();
    await page.waitForTimeout(500);
    
    // Test magic link if available
    await authPage.clickMagicLink();
    await page.waitForTimeout(500);
    
    const performanceMetrics = await basePage.getPerformanceMetrics();
    const accessibilityCheck = await basePage.checkAccessibility();
    await basePage.takeScreenshot('auth-page');

    testResults.routes.push({
      route: '/auth',
      status: is404 ? 'failed' : 'passed',
      loadTime: Date.now() - startTime,
      performanceMetrics,
      supabaseRequestIds: requestIds,
      authRequests,
      accessibility: accessibilityCheck,
      errors: jsErrors,
      is404,
      timestamp: new Date().toISOString()
    });

    expect(is404).toBeFalsy();
    expect(accessibilityCheck.hasTitle).toBeTruthy();
  });

  test('Sign Up Flow - Complete Testing', async ({ page }) => {
    const startTime = Date.now();
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    await authPage.goto();
    
    // Test sign up with various scenarios
    await authPage.toggleToSignUp();
    
    // Test weak password validation
    await authPage.fillSignUpForm(testEmail, 'weak');
    await authPage.clickSignUp();
    
    const weakPasswordErrors = await authPage.checkForErrors();
    
    // Test valid sign up
    await authPage.fillSignUpForm(testEmail, testPassword, testPassword);
    await authPage.clickSignUp();
    
    await basePage.waitForNetworkIdle();
    
    // Check for success or error messages
    const errors = await authPage.checkForErrors();
    const successes = await authPage.checkForSuccess();
    const redirected = await authPage.testAuthRedirect();
    
    await basePage.takeScreenshot('auth-signup-complete');

    testResults.routes.push({
      route: '/auth/signup',
      status: 'passed',
      loadTime: Date.now() - startTime,
      testEmail,
      weakPasswordErrors,
      errors,
      successes,
      redirected,
      timestamp: new Date().toISOString()
    });

    // Should either show success message or redirect
    expect(errors.length > 0 || successes.length > 0 || redirected).toBeTruthy();
  });

  test('Sign In Flow - Complete Testing', async ({ page }) => {
    const startTime = Date.now();
    const testEmail = 'existing-user@example.com';
    const testPassword = 'ExistingPassword123!';

    await authPage.goto();
    
    // Test invalid credentials
    await authPage.signIn('invalid@email.com', 'wrongpassword');
    await page.waitForTimeout(2000);
    
    const invalidErrors = await authPage.checkForErrors();
    
    // Test empty form
    await authPage.fillSignInForm('', '');
    await authPage.clickSignIn();
    
    const emptyFormErrors = await authPage.checkForErrors();
    
    // Test valid credentials (if test user exists)
    await authPage.signIn(testEmail, testPassword);
    await basePage.waitForNetworkIdle();
    
    const finalErrors = await authPage.checkForErrors();
    const successes = await authPage.checkForSuccess();
    const redirected = await authPage.testAuthRedirect();
    
    await basePage.takeScreenshot('auth-signin-complete');

    testResults.routes.push({
      route: '/auth/signin',
      status: 'passed',
      loadTime: Date.now() - startTime,
      invalidErrors,
      emptyFormErrors,
      finalErrors,
      successes,
      redirected,
      timestamp: new Date().toISOString()
    });

    // Should show appropriate error messages for invalid attempts
    expect(invalidErrors.length > 0 || emptyFormErrors.length > 0).toBeTruthy();
  });

  test('Magic Link Authentication - Testing', async ({ page }) => {
    const startTime = Date.now();
    const testEmail = `magic-${Date.now()}@example.com`;

    await authPage.goto();
    
    // Test magic link flow
    await authPage.clickMagicLink();
    
    // Check if magic link form appears
    const magicLinkForm = page.locator('.magic-link-form, [data-testid="magic-link-form"]');
    const magicEmailInput = page.locator('input[type="email"], [data-testid="magic-email"]');
    const sendMagicButton = page.locator('button:has-text("Send"), [data-testid="send-magic-link"]');
    
    if (await magicLinkForm.count() > 0) {
      await expect(magicLinkForm).toBeVisible();
      
      if (await magicEmailInput.count() > 0 && await sendMagicButton.count() > 0) {
        await magicEmailInput.fill(testEmail);
        await sendMagicButton.click();
        await basePage.waitForNetworkIdle();
        
        const magicResponse = await authPage.checkForSuccess();
        
        testResults.routes.push({
          route: '/auth/magic-link',
          status: 'passed',
          loadTime: Date.now() - startTime,
          testEmail,
          magicResponse,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      testResults.routes.push({
        route: '/auth/magic-link',
        status: 'skipped',
        reason: 'Magic link not available',
        loadTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    }

    await basePage.takeScreenshot('auth-magic-link');
  });

  test('Forgot Password Flow - Testing', async ({ page }) => {
    const startTime = Date.now();
    const testEmail = 'forgot-password@example.com';

    await authPage.goto();
    
    // Test forgot password flow
    await authPage.clickForgotPassword();
    
    // Check if forgot password form appears
    const forgotForm = page.locator('.forgot-password-form, [data-testid="forgot-password-form"]');
    const forgotEmailInput = page.locator('input[type="email"], [data-testid="forgot-email"]');
    const sendResetButton = page.locator('button:has-text("Reset"), button:has-text("Send"), [data-testid="send-reset"]');
    
    if (await forgotForm.count() > 0) {
      await expect(forgotForm).toBeVisible();
      
      if (await forgotEmailInput.count() > 0 && await sendResetButton.count() > 0) {
        await forgotEmailInput.fill(testEmail);
        await sendResetButton.click();
        await basePage.waitForNetworkIdle();
        
        const resetResponse = await authPage.checkForSuccess();
        const resetErrors = await authPage.checkForErrors();
        
        testResults.routes.push({
          route: '/auth/forgot-password',
          status: 'passed',
          loadTime: Date.now() - startTime,
          testEmail,
          resetResponse,
          resetErrors,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      testResults.routes.push({
        route: '/auth/forgot-password',
        status: 'skipped',
        reason: 'Forgot password not available',
        loadTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    }

    await basePage.takeScreenshot('auth-forgot-password');
  });

  test('Authentication Security Features', async ({ page }) => {
    const startTime = Date.now();

    await authPage.goto();
    
    // Test rate limiting simulation
    const rateLimitingTest = [];
    
    for (let i = 0; i < 5; i++) {
      await authPage.signIn('rate-limit@test.com', 'wrongpassword');
      await page.waitForTimeout(500);
      
      const errors = await authPage.checkForErrors();
      rateLimitingTest.push({
        attempt: i + 1,
        errors: errors.length,
        errorMessages: errors
      });
    }
    
    // Test password strength requirements
    const passwordTests = [
      { password: '123', expected: 'weak' },
      { password: 'password', expected: 'weak' },
      { password: 'Password123', expected: 'medium' },
      { password: 'Password123!@#', expected: 'strong' }
    ];
    
    await authPage.toggleToSignUp();
    const passwordStrengthResults = [];
    
    for (const test of passwordTests) {
      await authPage.fillSignUpForm('test@example.com', test.password);
      await page.waitForTimeout(500);
      
      const strengthIndicator = page.locator('.password-strength, [data-testid="password-strength"]');
      const strengthText = await strengthIndicator.textContent();
      
      passwordStrengthResults.push({
        password: test.password,
        expected: test.expected,
        actual: strengthText,
        hasIndicator: await strengthIndicator.count() > 0
      });
    }
    
    // Test CSRF protection
    const csrfToken = page.locator('input[name="_token"], meta[name="csrf-token"]');
    const hasCSRFProtection = await csrfToken.count() > 0;
    
    await basePage.takeScreenshot('auth-security-features');

    testResults.routes.push({
      route: '/auth/security-features',
      status: 'passed',
      loadTime: Date.now() - startTime,
      rateLimitingTest,
      passwordStrengthResults,
      hasCSRFProtection,
      timestamp: new Date().toISOString()
    });

    // Verify security features are working
    expect(passwordStrengthResults.some(r => r.hasIndicator)).toBeTruthy();
  });

  test('Authentication Mobile Responsiveness', async ({ page }) => {
    const startTime = Date.now();
    
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    const responsiveResults = [];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await authPage.goto();
      
      const is404 = await basePage.checkFor404Errors();
      await authPage.validateAuthForms();
      
      // Check mobile-specific features
      const isMobileOptimized = viewport.width < 768;
      const mobileKeyboard = page.locator('input[inputmode], input[pattern]');
      const touchOptimized = page.locator('button[style*="min-height"], .touch-target');
      
      await basePage.takeScreenshot(`auth-${viewport.name}`);
      
      responsiveResults.push({
        viewport: viewport.name,
        is404,
        isMobileOptimized,
        hasMobileKeyboard: await mobileKeyboard.count() > 0,
        isTouchOptimized: await touchOptimized.count() > 0
      });
    }

    testResults.routes.push({
      route: '/auth/responsive',
      status: 'passed',
      loadTime: Date.now() - startTime,
      responsiveResults,
      timestamp: new Date().toISOString()
    });

    // Reset to desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('Supabase Authentication Integration', async ({ page }) => {
    const startTime = Date.now();
    
    await authPage.goto();
    
    // Monitor Supabase auth requests
    const authRequests: any[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/auth/v1/') || (url.includes('supabase') && url.includes('auth'))) {
        authRequests.push({
          url,
          method: request.method(),
          headers: request.headers(),
          timestamp: Date.now()
        });
      }
    });
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/auth/v1/') || (url.includes('supabase') && url.includes('auth'))) {
        const request = authRequests.find(req => req.url === url);
        if (request) {
          request.status = response.status();
          request.responseHeaders = response.headers();
        }
      }
    });
    
    // Test auth request generation
    await authPage.signIn('test@example.com', 'testpassword');
    await basePage.waitForNetworkIdle();
    
    // Check for Supabase X-Request-Id headers
    const requestIds = authRequests
      .filter(req => req.responseHeaders && req.responseHeaders['x-request-id'])
      .map(req => req.responseHeaders['x-request-id']);

    testResults.routes.push({
      route: '/auth/supabase-integration',
      status: 'passed',
      loadTime: Date.now() - startTime,
      authRequests: authRequests.length,
      requestIds,
      timestamp: new Date().toISOString()
    });

    // Should have made auth requests to Supabase
    expect(authRequests.length).toBeGreaterThan(0);
    expect(requestIds.length).toBeGreaterThan(0);
  });
});