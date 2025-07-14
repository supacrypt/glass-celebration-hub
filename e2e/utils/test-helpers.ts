import { Page, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class TestHelpers {
  static async waitForStableLayout(page: Page, timeout: number = 5000): Promise<void> {
    // Wait for layout to stabilize (no layout shifts for 500ms)
    let lastLayoutShift = Date.now();
    const startTime = Date.now();
    
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              // Update last layout shift time in global scope
              (window as any).lastLayoutShiftTime = Date.now();
            }
          });
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Check every 100ms if layout is stable
        const checkStable = () => {
          const now = Date.now();
          const lastShift = (window as any).lastLayoutShiftTime || 0;
          
          if (now - lastShift > 500) {
            observer.disconnect();
            resolve();
          } else {
            setTimeout(checkStable, 100);
          }
        };
        
        setTimeout(checkStable, 100);
      });
    });
  }

  static async waitForDataLoading(page: Page, selectors: string[] = []): Promise<void> {
    // Wait for common loading indicators to disappear
    const loadingSelectors = [
      '.loading',
      '.spinner',
      '.skeleton',
      '[data-testid="loading"]',
      '.loading-spinner',
      ...selectors
    ];

    for (const selector of loadingSelectors) {
      try {
        await page.waitForSelector(selector, { state: 'hidden', timeout: 10000 });
      } catch {
        // Continue if loading selector not found
      }
    }

    // Wait for network idle
    await page.waitForLoadState('networkidle');
  }

  static async mockApiResponse(page: Page, urlPattern: string, response: any): Promise<void> {
    await page.route(urlPattern, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  static async interceptNetworkRequests(page: Page, patterns: string[]): Promise<any[]> {
    const interceptedRequests: any[] = [];

    await page.route('**/*', route => {
      const url = route.request().url();
      
      if (patterns.some(pattern => url.includes(pattern))) {
        interceptedRequests.push({
          url,
          method: route.request().method(),
          headers: route.request().headers(),
          timestamp: Date.now()
        });
      }
      
      route.continue();
    });

    return interceptedRequests;
  }

  static async simulateSlowNetwork(page: Page, delay: number = 2000): Promise<void> {
    await page.route('**/*', route => {
      setTimeout(() => {
        route.continue();
      }, delay);
    });
  }

  static async simulateOffline(page: Page): Promise<void> {
    await page.context().setOffline(true);
  }

  static async restoreOnline(page: Page): Promise<void> {
    await page.context().setOffline(false);
  }

  static async fillFormWithData(page: Page, formData: Record<string, string>): Promise<void> {
    for (const [field, value] of Object.entries(formData)) {
      const input = page.locator(`input[name="${field}"], textarea[name="${field}"], select[name="${field}"]`);
      
      if (await input.count() > 0) {
        const tagName = await input.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'select') {
          await input.selectOption(value);
        } else {
          await input.fill(value);
        }
      }
    }
  }

  static async scrollToElement(page: Page, selector: string): Promise<void> {
    const element = page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Wait for scroll animation
  }

  static async hoverAndClick(page: Page, selector: string): Promise<void> {
    const element = page.locator(selector);
    await element.hover();
    await page.waitForTimeout(200);
    await element.click();
  }

  static async dragAndDrop(page: Page, sourceSelector: string, targetSelector: string): Promise<void> {
    const source = page.locator(sourceSelector);
    const target = page.locator(targetSelector);
    
    await source.dragTo(target);
    await page.waitForTimeout(1000); // Wait for drag animation
  }

  static async waitForAnimation(page: Page, selector?: string): Promise<void> {
    if (selector) {
      const element = page.locator(selector);
      await element.waitFor({ state: 'visible' });
    }
    
    // Wait for CSS animations to complete
    await page.waitForFunction(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements).every(el => {
        const styles = window.getComputedStyle(el);
        return styles.animationPlayState !== 'running' && 
               styles.transitionProperty === 'none' || 
               parseFloat(styles.transitionDuration) === 0;
      });
    }, { timeout: 5000 });
  }

  static async captureConsoleErrors(page: Page): Promise<string[]> {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    return errors;
  }

  static async captureNetworkErrors(page: Page): Promise<any[]> {
    const networkErrors: any[] = [];
    
    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: Date.now()
        });
      }
    });

    return networkErrors;
  }

  static async generateTestReport(testName: string, results: any): Promise<string> {
    const reportDir = path.join(__dirname, '../../artefacts/e2e_dataflow/individual-reports');
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, `${testName}-report.json`);
    
    const report = {
      testName,
      timestamp: new Date().toISOString(),
      results,
      environment: {
        userAgent: await results.page?.evaluate(() => navigator.userAgent) || 'Unknown',
        viewport: await results.page?.viewportSize() || { width: 0, height: 0 },
        url: results.page?.url() || 'Unknown'
      }
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    return reportPath;
  }

  static async takeFullPageScreenshot(page: Page, name: string): Promise<string> {
    const screenshotDir = path.join(__dirname, '../../artefacts/e2e_dataflow/screenshots');
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshotPath = path.join(screenshotDir, `${name}-${Date.now()}.png`);
    
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      animations: 'disabled'
    });

    return screenshotPath;
  }

  static async recordVideo(page: Page, name: string): Promise<string | null> {
    const videoDir = path.join(__dirname, '../../artefacts/e2e_dataflow/videos');
    
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    // Video recording is handled by Playwright config
    // This method returns the expected video path
    const videoPath = path.join(videoDir, `${name}-${Date.now()}.webm`);
    return videoPath;
  }

  static async measurePageLoadTime(page: Page): Promise<{
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
  }> {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstContentfulPaint: fcp ? fcp.startTime : 0
      };
    });
  }

  static async checkAccessibilityViolations(page: Page): Promise<any[]> {
    // Basic accessibility checks (can be extended with axe-core)
    return await page.evaluate(() => {
      const violations = [];
      
      // Check for missing alt text
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        violations.push({ type: 'missing-alt-text', count: images.length });
      }
      
      // Check for missing form labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      const unlabeledInputs = Array.from(inputs).filter(input => {
        const id = input.getAttribute('id');
        return !id || !document.querySelector(`label[for="${id}"]`);
      });
      
      if (unlabeledInputs.length > 0) {
        violations.push({ type: 'missing-form-labels', count: unlabeledInputs.length });
      }
      
      // Check for missing heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) {
        violations.push({ type: 'missing-headings', count: 0 });
      }
      
      return violations;
    });
  }

  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async retryUntilSuccess<T>(
    fn: () => Promise<T>, 
    maxRetries: number = 3, 
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await this.delay(delayMs);
        }
      }
    }
    
    throw lastError!;
  }

  static async waitForElement(
    page: Page, 
    selector: string, 
    options: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' } = {}
  ): Promise<void> {
    const { timeout = 10000, state = 'visible' } = options;
    await page.waitForSelector(selector, { timeout, state });
  }

  static async getElementText(page: Page, selector: string): Promise<string> {
    const element = page.locator(selector);
    return await element.textContent() || '';
  }

  static async isElementVisible(page: Page, selector: string): Promise<boolean> {
    try {
      const element = page.locator(selector);
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  static async getElementCount(page: Page, selector: string): Promise<number> {
    return await page.locator(selector).count();
  }
}