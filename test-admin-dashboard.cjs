const { chromium } = require('playwright');

async function testAdminDashboard() {
  console.log('🚀 Starting Admin Dashboard Testing with Playwright');
  console.log('='.repeat(60));
  
  // Launch browser
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext({ 
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  try {
    console.log('\n📍 Phase 1: Navigate to Admin Dashboard');
    await page.goto('http://localhost:8081/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of initial page
    await page.screenshot({ path: 'admin-test-1-initial.png', fullPage: true });
    console.log('✅ Screenshot saved: admin-test-1-initial.png');
    
    // Check what's displayed on the page
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    
    // Look for admin login modal or dashboard
    const hasLoginModal = await page.locator('[data-testid="admin-login"], .admin-login, [class*="login"], [class*="modal"]').count() > 0;
    const hasAdminDashboard = await page.locator('[data-testid="admin-dashboard"], .admin-dashboard, [class*="admin"]').count() > 0;
    const hasAccessDenied = await page.getByText('Access').count() > 0;
    
    console.log(`🔍 Page analysis:`);
    console.log(`   - Has login modal: ${hasLoginModal}`);
    console.log(`   - Has admin dashboard: ${hasAdminDashboard}`);
    console.log(`   - Has access denied: ${hasAccessDenied}`);
    
    // Check for common admin elements
    const adminElements = await page.evaluate(() => {
      const elements = [];
      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent?.toLowerCase() || '';
        const className = el.className?.toLowerCase() || '';
        if (text.includes('admin') || text.includes('login') || text.includes('dashboard') ||
            className.includes('admin') || className.includes('login') || className.includes('modal')) {
          elements.push({
            tag: el.tagName,
            text: el.textContent?.slice(0, 100),
            className: el.className
          });
        }
      });
      return elements.slice(0, 10); // First 10 matches
    });
    
    console.log('\n🔍 Admin-related elements found:');
    adminElements.forEach((el, i) => {
      console.log(`   ${i+1}. ${el.tag}: "${el.text}" (class: ${el.className})`);
    });
    
    console.log('\n📍 Phase 2: Test Authentication');
    
    // Look for login button or admin access
    const loginButton = page.getByText('Admin Login').or(page.getByText('Sign In')).or(page.getByText('Login'));
    const adminButton = page.getByText('Admin').or(page.getByText('Dashboard'));
    
    if (await loginButton.count() > 0) {
      console.log('🔑 Found login button, attempting to click...');
      await loginButton.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'admin-test-2-login-modal.png', fullPage: true });
      console.log('✅ Screenshot saved: admin-test-2-login-modal.png');
    } else if (await adminButton.count() > 0) {
      console.log('🔑 Found admin button, attempting to click...');
      await adminButton.first().click();
      await page.waitForTimeout(2000);
    }
    
    // Try to find and fill login form
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[placeholder*="email"]'));
    const passwordInput = page.locator('input[type="password"]').or(page.locator('input[placeholder*="password"]'));
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      console.log('📝 Found login form, filling credentials...');
      await emailInput.fill('admin@wedding.local');
      await passwordInput.fill('admin123');
      
      const submitButton = page.getByText('Sign In').or(page.getByText('Login')).or(page.locator('button[type="submit"]'));
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'admin-test-3-after-login.png', fullPage: true });
        console.log('✅ Screenshot saved: admin-test-3-after-login.png');
      }
    } else {
      console.log('❌ No login form found');
    }
    
    console.log('\n📍 Phase 3: Test Admin Dashboard Navigation');
    
    // Look for admin tabs/sections
    const contentTab = page.getByText('Content').or(page.getByText('App Settings'));
    const usersTab = page.getByText('Users').or(page.getByText('User'));
    const designTab = page.getByText('Design').or(page.getByText('Theme'));
    const mediaTab = page.getByText('Media').or(page.getByText('Upload'));
    
    const tabs = [
      { name: 'Content', locator: contentTab },
      { name: 'Users', locator: usersTab },
      { name: 'Design', locator: designTab },
      { name: 'Media', locator: mediaTab }
    ];
    
    for (const tab of tabs) {
      if (await tab.locator.count() > 0) {
        console.log(`🎯 Testing ${tab.name} tab...`);
        await tab.locator.first().click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `admin-test-4-${tab.name.toLowerCase()}-tab.png`, fullPage: true });
        console.log(`✅ Screenshot saved: admin-test-4-${tab.name.toLowerCase()}-tab.png`);
      } else {
        console.log(`❌ ${tab.name} tab not found`);
      }
    }
    
    console.log('\n📍 Phase 4: Test Key Admin Functions');
    
    // Test app settings if available
    const appNameInput = page.locator('input[placeholder*="app"], input[placeholder*="name"], input[value*="Tim"]');
    if (await appNameInput.count() > 0) {
      console.log('📝 Testing app settings form...');
      await appNameInput.clear();
      await appNameInput.fill('Test Wedding App');
      
      const saveButton = page.getByText('Save').or(page.getByText('Update'));
      if (await saveButton.count() > 0) {
        await saveButton.click();
        await page.waitForTimeout(2000);
        console.log('✅ App settings save attempted');
      }
    }
    
    // Test media upload if available
    const uploadButton = page.getByText('Upload').or(page.getByText('Choose Files'));
    if (await uploadButton.count() > 0) {
      console.log('📁 Media upload functionality found');
      await uploadButton.click();
      await page.waitForTimeout(1000);
    }
    
    console.log('\n📍 Phase 5: Final Analysis');
    
    // Get all visible text content
    const pageContent = await page.evaluate(() => {
      return document.body.textContent?.slice(0, 500) || '';
    });
    
    console.log('\n📄 Page content preview:');
    console.log(pageContent);
    
    // Check for error messages
    const hasErrors = await page.locator('.error, [class*="error"], .alert-error').count() > 0;
    const hasSuccess = await page.locator('.success, [class*="success"], .alert-success').count() > 0;
    
    console.log('\n🎯 Final Test Results:');
    console.log(`   - Errors detected: ${hasErrors ? 'YES' : 'NO'}`);
    console.log(`   - Success messages: ${hasSuccess ? 'YES' : 'NO'}`);
    console.log(`   - Page responsive: ${pageTitle !== '' ? 'YES' : 'NO'}`);
    
    // Take final screenshot
    await page.screenshot({ path: 'admin-test-5-final.png', fullPage: true });
    console.log('✅ Final screenshot saved: admin-test-5-final.png');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    await page.screenshot({ path: 'admin-test-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n🏁 Admin Dashboard Testing Complete!');
    console.log('📸 Check the generated screenshots for visual results');
  }
}

// Run the test
testAdminDashboard().catch(console.error);