import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common navigation elements
  get navigation() {
    return this.page.locator('nav');
  }

  get header() {
    return this.page.locator('header');
  }

  get footer() {
    return this.page.locator('footer');
  }

  // Common actions
  async goto(path: string = '/') {
    await this.page.goto(path);
    await this.waitForNetworkIdle();
  }

  async waitForNetworkIdle(timeout: number = 10000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  // Supabase X-Request-Id validation
  async validateSupabaseHeaders(): Promise<string[]> {
    const requestIds: string[] = [];
    
    this.page.on('response', response => {
      const url = response.url();
      if (url.includes('supabase') || url.includes('/rest/v1/') || url.includes('/auth/v1/')) {
        const requestId = response.headers()['x-request-id'];
        if (requestId) {
          requestIds.push(requestId);
        }
      }
    });

    return requestIds;
  }

  // Performance monitoring
  async getPerformanceMetrics() {
    return await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        timeToInteractive: navigation.domInteractive - navigation.fetchStart,
        transferSize: navigation.transferSize || 0
      };
    });
  }

  // Visual regression testing
  async takeScreenshot(name: string, options?: any) {
    return await this.page.screenshot({
      path: `e2e/screenshots/${name}.png`,
      fullPage: true,
      ...options
    });
  }

  // Error detection
  async checkFor404Errors(): Promise<boolean> {
    const response = this.page.url();
    const statusCode = await this.page.evaluate(() => {
      return fetch(window.location.href).then(res => res.status).catch(() => 200);
    });
    return statusCode === 404;
  }

  async checkForJavaScriptErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    this.page.on('pageerror', error => {
      errors.push(error.message);
    });

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    return errors;
  }

  // Accessibility helpers
  async checkAccessibility() {
    // Basic accessibility checks
    const hasTitle = await this.page.title();
    const hasLang = await this.page.locator('html[lang]').count();
    const hasSkipLinks = await this.page.locator('a[href="#main"], a[href="#content"]').count();
    
    return {
      hasTitle: !!hasTitle,
      hasLangAttribute: hasLang > 0,
      hasSkipLinks: hasSkipLinks > 0
    };
  }

  // Core Web Vitals
  async getCoreWebVitals() {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {
          CLS: 0,
          FID: 0,
          LCP: 0
        };

        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.FID = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              vitals.CLS += entry.value;
            }
          });
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

        // Resolve after a reasonable timeout
        setTimeout(() => resolve(vitals), 3000);
      });
    });
  }

  // Network monitoring
  async monitorNetworkRequests() {
    const requests: any[] = [];
    
    this.page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now(),
        headers: request.headers()
      });
    });

    this.page.on('response', response => {
      const request = requests.find(req => req.url === response.url());
      if (request) {
        request.status = response.status();
        request.responseHeaders = response.headers();
        request.responseTime = Date.now() - request.timestamp;
      }
    });

    return requests;
  }
}