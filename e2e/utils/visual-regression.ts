import { Page, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class VisualRegressionUtils {
  private page: Page;
  private baselineDir: string;
  private currentDir: string;
  private diffDir: string;

  constructor(page: Page) {
    this.page = page;
    this.baselineDir = path.join(__dirname, '../screenshots/baseline');
    this.currentDir = path.join(__dirname, '../screenshots/current');
    this.diffDir = path.join(__dirname, '../screenshots/diff');
    
    // Ensure directories exist
    [this.baselineDir, this.currentDir, this.diffDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async captureBaseline(name: string, options?: any) {
    const screenshotPath = path.join(this.baselineDir, `${name}.png`);
    
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true,
      animations: 'disabled',
      ...options
    });
    
    return screenshotPath;
  }

  async captureAndCompare(name: string, options?: any) {
    const currentPath = path.join(this.currentDir, `${name}.png`);
    const baselinePath = path.join(this.baselineDir, `${name}.png`);
    const diffPath = path.join(this.diffDir, `${name}-diff.png`);
    
    // Capture current screenshot
    await this.page.screenshot({
      path: currentPath,
      fullPage: true,
      animations: 'disabled',
      ...options
    });
    
    // If baseline doesn't exist, create it
    if (!fs.existsSync(baselinePath)) {
      fs.copyFileSync(currentPath, baselinePath);
      return {
        isBaseline: true,
        path: baselinePath,
        status: 'baseline_created'
      };
    }
    
    // Compare with baseline using Playwright's built-in comparison
    try {
      await expect(this.page).toHaveScreenshot(`${name}.png`, {
        threshold: 0.3,
        maxDiffPixels: 1000,
        animations: 'disabled',
        ...options
      });
      
      return {
        isBaseline: false,
        passed: true,
        baseline: baselinePath,
        current: currentPath,
        status: 'passed'
      };
    } catch (error) {
      return {
        isBaseline: false,
        passed: false,
        baseline: baselinePath,
        current: currentPath,
        diff: diffPath,
        error: error.message,
        status: 'failed'
      };
    }
  }

  async captureElementScreenshot(selector: string, name: string, options?: any) {
    const element = this.page.locator(selector);
    const screenshotPath = path.join(this.currentDir, `${name}-element.png`);
    
    await element.screenshot({
      path: screenshotPath,
      animations: 'disabled',
      ...options
    });
    
    return screenshotPath;
  }

  async captureViewportSizes(name: string, viewports: Array<{width: number, height: number, name: string}>) {
    const results = [];
    
    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(1000); // Wait for layout adjustment
      
      const screenshotName = `${name}-${viewport.name}`;
      const result = await this.captureAndCompare(screenshotName);
      
      results.push({
        viewport: viewport.name,
        ...result
      });
    }
    
    return results;
  }

  async captureInteractionStates(name: string, interactions: Array<{action: string, selector?: string}>) {
    const results = [];
    
    for (const interaction of interactions) {
      let actionName = interaction.action;
      
      try {
        switch (interaction.action) {
          case 'hover':
            if (interaction.selector) {
              await this.page.hover(interaction.selector);
              actionName = `${interaction.action}-${interaction.selector.replace(/[^a-zA-Z0-9]/g, '-')}`;
            }
            break;
          case 'focus':
            if (interaction.selector) {
              await this.page.focus(interaction.selector);
              actionName = `${interaction.action}-${interaction.selector.replace(/[^a-zA-Z0-9]/g, '-')}`;
            }
            break;
          case 'click':
            if (interaction.selector) {
              await this.page.click(interaction.selector);
              actionName = `${interaction.action}-${interaction.selector.replace(/[^a-zA-Z0-9]/g, '-')}`;
            }
            break;
          default:
            continue;
        }
        
        await this.page.waitForTimeout(500); // Wait for state change
        
        const screenshotName = `${name}-${actionName}`;
        const result = await this.captureAndCompare(screenshotName);
        
        results.push({
          interaction: interaction.action,
          selector: interaction.selector,
          ...result
        });
      } catch (error) {
        results.push({
          interaction: interaction.action,
          selector: interaction.selector,
          error: error.message,
          status: 'error'
        });
      }
    }
    
    return results;
  }

  async captureLoadingStates(name: string, loadingSelectors: string[]) {
    const results = [];
    
    // Capture initial loading state
    const initialResult = await this.captureAndCompare(`${name}-initial`);
    results.push({ state: 'initial', ...initialResult });
    
    // Wait for loading elements to disappear
    for (const selector of loadingSelectors) {
      try {
        await this.page.waitForSelector(selector, { state: 'hidden', timeout: 5000 });
      } catch {
        // Continue if loading element not found
      }
    }
    
    // Capture loaded state
    await this.page.waitForLoadState('networkidle');
    const loadedResult = await this.captureAndCompare(`${name}-loaded`);
    results.push({ state: 'loaded', ...loadedResult });
    
    return results;
  }

  async captureScrollStates(name: string, scrollPositions: number[]) {
    const results = [];
    
    for (const position of scrollPositions) {
      await this.page.evaluate((pos) => {
        window.scrollTo(0, pos);
      }, position);
      
      await this.page.waitForTimeout(1000); // Wait for scroll completion
      
      const screenshotName = `${name}-scroll-${position}`;
      const result = await this.captureAndCompare(screenshotName);
      
      results.push({
        scrollPosition: position,
        ...result
      });
    }
    
    // Reset scroll position
    await this.page.evaluate(() => window.scrollTo(0, 0));
    
    return results;
  }

  async generateVisualReport(testResults: any[]) {
    const reportPath = path.join(__dirname, '../../artefacts/e2e_dataflow/visual-regression-report.html');
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Visual Regression Test Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-result { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .passed { border-color: #4CAF50; background-color: #f1f8e9; }
        .failed { border-color: #f44336; background-color: #ffebee; }
        .baseline { border-color: #2196F3; background-color: #e3f2fd; }
        .screenshot { max-width: 300px; margin: 10px; border: 1px solid #ccc; }
        .diff-container { display: flex; gap: 10px; align-items: flex-start; }
        .timestamp { color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <h1>Visual Regression Test Report</h1>
      <p class="timestamp">Generated: ${new Date().toISOString()}</p>
      
      ${testResults.map(result => `
        <div class="test-result ${result.status}">
          <h3>${result.name || 'Unnamed Test'}</h3>
          <p><strong>Status:</strong> ${result.status}</p>
          
          ${result.isBaseline ? '<p><em>Baseline created for first run</em></p>' : ''}
          
          ${result.passed === false ? `
            <div class="diff-container">
              <div>
                <h4>Baseline</h4>
                <img src="${result.baseline}" class="screenshot" alt="Baseline" />
              </div>
              <div>
                <h4>Current</h4>
                <img src="${result.current}" class="screenshot" alt="Current" />
              </div>
              ${result.diff ? `
                <div>
                  <h4>Difference</h4>
                  <img src="${result.diff}" class="screenshot" alt="Difference" />
                </div>
              ` : ''}
            </div>
            ${result.error ? `<p><strong>Error:</strong> ${result.error}</p>` : ''}
          ` : result.passed ? `
            <p>✅ Visual regression test passed</p>
            <img src="${result.current}" class="screenshot" alt="Current screenshot" />
          ` : ''}
        </div>
      `).join('')}
    </body>
    </html>
    `;
    
    fs.writeFileSync(reportPath, html);
    return reportPath;
  }

  getTestSummary(testResults: any[]) {
    const summary = {
      total: testResults.length,
      passed: testResults.filter(r => r.passed === true).length,
      failed: testResults.filter(r => r.passed === false).length,
      baseline: testResults.filter(r => r.isBaseline === true).length,
      errors: testResults.filter(r => r.status === 'error').length
    };
    
    summary['passRate'] = summary.total > 0 ? (summary.passed / summary.total) * 100 : 0;
    
    return summary;
  }
}