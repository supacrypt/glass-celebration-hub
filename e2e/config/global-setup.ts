import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E Test Suite Global Setup');
  
  // Create directories for artifacts
  const artifactsDir = path.join(__dirname, '../../artefacts/e2e_dataflow');
  const screenshotsDir = path.join(artifactsDir, 'screenshots');
  const videosDir = path.join(artifactsDir, 'videos');
  const reportDir = path.join(artifactsDir, 'report');
  
  [artifactsDir, screenshotsDir, videosDir, reportDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Launch browser for auth setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Check if the application is running
    console.log('📋 Checking application availability...');
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:8090');
    await page.waitForLoadState('networkidle');
    console.log('✅ Application is accessible');

    // Create test user authentication state
    console.log('🔐 Setting up test authentication...');
    
    // Navigate to auth page and create test accounts if needed
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    
    // Store auth state for tests
    await context.storageState({ path: path.join(__dirname, '../fixtures/auth-state.json') });
    console.log('✅ Authentication state saved');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  // Initialize test results tracking
  const testResults = {
    startTime: new Date().toISOString(),
    routes: [],
    performance: {},
    networkRequests: [],
    visualRegression: {},
    errors: []
  };

  fs.writeFileSync(
    path.join(artifactsDir, 'test-tracking.json'),
    JSON.stringify(testResults, null, 2)
  );

  console.log('🎯 Global setup completed successfully');
}

export default globalSetup;