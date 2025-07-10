const { chromium } = require('playwright');

async function testAdminDashboard() {
  console.log('🚀 Testing Admin Dashboard on localhost:8081');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1500,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('\n📍 Step 1: Navigate to Admin Dashboard');
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-1-dashboard.png', fullPage: true });
    console.log('✅ Screenshot saved: test-1-dashboard.png');
    
    // Get page content to understand what's showing
    const bodyText = await page.textContent('body');
    console.log(`📄 Page loaded, content preview: ${bodyText.slice(0, 200)}...`);
    
    console.log('\n📍 Step 2: Look for Admin Access');
    
    // Try to find admin-related buttons or text
    const adminAccess = await page.getByText('Admin Access', { exact: false }).count();
    const adminLogin = await page.getByText('Admin Login', { exact: false }).count();
    const adminDashboard = await page.getByText('Admin Dashboard', { exact: false }).count();
    const accessRestricted = await page.getByText('Access Restricted', { exact: false }).count();
    const shield = await page.locator('[data-lucide="shield"]').count();
    
    console.log(`🔍 Admin elements found:`);
    console.log(`   - Admin Access: ${adminAccess}`);
    console.log(`   - Admin Login: ${adminLogin}`);
    console.log(`   - Admin Dashboard: ${adminDashboard}`);
    console.log(`   - Access Restricted: ${accessRestricted}`);
    console.log(`   - Shield icons: ${shield}`);
    
    // Try clicking admin access if found
    if (adminAccess > 0) {
      console.log('🔑 Clicking Admin Access...');
      await page.getByText('Admin Access', { exact: false }).first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-2-admin-access.png', fullPage: true });
    } else if (adminLogin > 0) {
      console.log('🔑 Clicking Admin Login...');
      await page.getByText('Admin Login', { exact: false }).first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-2-admin-login.png', fullPage: true });
    } else if (accessRestricted > 0) {
      console.log('🔑 Found Access Restricted, looking for login button...');
      const loginBtn = await page.getByRole('button', { name: /admin login/i }).count();
      if (loginBtn > 0) {
        await page.getByRole('button', { name: /admin login/i }).click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-2-restricted-access.png', fullPage: true });
      }
    }
    
    console.log('\n📍 Step 3: Test Admin Authentication');
    
    // Look for email and password inputs
    const emailInput = await page.locator('input[type="email"]').count();
    const passwordInput = await page.locator('input[type="password"]').count();
    
    console.log(`📝 Form inputs found:`);
    console.log(`   - Email inputs: ${emailInput}`);
    console.log(`   - Password inputs: ${passwordInput}`);
    
    if (emailInput > 0 && passwordInput > 0) {
      console.log('🔐 Filling admin credentials...');
      await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
      await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
      
      await page.screenshot({ path: 'test-3-credentials-filled.png', fullPage: true });
      
      // Look for submit button
      const signInBtn = await page.getByRole('button', { name: /sign in/i }).count();
      const loginBtn = await page.getByRole('button', { name: /login/i }).count();
      
      if (signInBtn > 0) {
        console.log('🚀 Clicking Sign In...');
        await page.getByRole('button', { name: /sign in/i }).click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'test-4-after-signin.png', fullPage: true });
      } else if (loginBtn > 0) {
        console.log('🚀 Clicking Login...');
        await page.getByRole('button', { name: /login/i }).click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'test-4-after-login.png', fullPage: true });
      }
    }
    
    console.log('\n📍 Step 4: Test Dashboard Navigation');
    
    // Look for common admin tabs
    const tabs = ['Content', 'Users', 'Design', 'Analytics', 'Settings'];
    
    for (const tabName of tabs) {
      const tabCount = await page.getByText(tabName, { exact: false }).count();
      if (tabCount > 0) {
        console.log(`🎯 Testing ${tabName} tab...`);
        await page.getByText(tabName, { exact: false }).first().click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `test-5-${tabName.toLowerCase()}-tab.png`, fullPage: true });
      }
    }
    
    console.log('\n📍 Step 5: Look for Key Admin Features');
    
    // Check for media manager
    const mediaManager = await page.getByText('Media Manager', { exact: false }).count();
    if (mediaManager > 0) {
      console.log('📁 Testing Media Manager...');
      await page.getByText('Media Manager', { exact: false }).click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-6-media-manager.png', fullPage: true });
    }
    
    // Check for app settings
    const appSettings = await page.getByText('App Settings', { exact: false }).count();
    if (appSettings > 0) {
      console.log('⚙️ Testing App Settings...');
      await page.getByText('App Settings', { exact: false }).click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-7-app-settings.png', fullPage: true });
    }
    
    // Check for file upload
    const fileInput = await page.locator('input[type="file"]').count();
    if (fileInput > 0) {
      console.log('📤 File upload found');
    }
    
    // Final page state
    await page.screenshot({ path: 'test-8-final-state.png', fullPage: true });
    console.log('✅ Final screenshot saved: test-8-final-state.png');
    
    // Check for any error messages
    const errorText = await page.textContent('body');
    const hasErrors = errorText.toLowerCase().includes('error') || 
                     errorText.toLowerCase().includes('failed') ||
                     errorText.toLowerCase().includes('denied');
    
    console.log(`\n🎯 Test Summary:`);
    console.log(`   - Page accessible: ✅`);
    console.log(`   - Errors detected: ${hasErrors ? '❌ YES' : '✅ NO'}`);
    console.log(`   - Admin interface: ${adminAccess + adminLogin + adminDashboard > 0 ? '✅ FOUND' : '❌ NOT FOUND'}`);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'test-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n🏁 Admin Dashboard Test Complete!');
    console.log('📸 Check screenshots for detailed results');
  }
}

testAdminDashboard().catch(console.error);