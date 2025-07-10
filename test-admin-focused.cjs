const { chromium } = require('playwright');

async function testAdminDashboard() {
  console.log('🚀 Testing Admin Dashboard with Real Credentials');
  console.log('='.repeat(55));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 2000,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('\n📍 Step 1: Navigate to Admin Dashboard');
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'admin-1-initial.png', fullPage: true });
    console.log('✅ Screenshot: admin-1-initial.png');
    
    const pageContent = await page.textContent('body');
    console.log(`📄 Initial page shows: ${pageContent.slice(0, 100)}...`);
    
    console.log('\n📍 Step 2: Login with Admin Credentials');
    
    // Fill in the login form
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    
    await page.screenshot({ path: 'admin-2-credentials.png', fullPage: true });
    console.log('✅ Screenshot: admin-2-credentials.png');
    
    // Click the first (main) Sign In button
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    console.log('🔐 Admin login attempted, waiting for response...');
    await page.waitForTimeout(5000); // Wait for authentication
    
    await page.screenshot({ path: 'admin-3-after-login.png', fullPage: true });
    console.log('✅ Screenshot: admin-3-after-login.png');
    
    console.log('\n📍 Step 3: Check Post-Login State');
    
    const currentUrl = page.url();
    const postLoginContent = await page.textContent('body');
    console.log(`🔗 Current URL: ${currentUrl}`);
    console.log(`📄 Post-login content: ${postLoginContent.slice(0, 150)}...`);
    
    // Check if we're still on auth page or redirected
    if (currentUrl.includes('/auth')) {
      console.log('⚠️ Still on auth page - checking for error messages');
      const errorMsg = await page.locator('.error, [class*="error"], .text-red').textContent().catch(() => '');
      if (errorMsg) {
        console.log(`❌ Error message: ${errorMsg}`);
      }
    } else {
      console.log('✅ Redirected from auth page - login likely successful');
    }
    
    console.log('\n📍 Step 4: Navigate to Admin Dashboard');
    
    // Try going to admin dashboard again after login
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'admin-4-dashboard-after-auth.png', fullPage: true });
    console.log('✅ Screenshot: admin-4-dashboard-after-auth.png');
    
    const dashboardContent = await page.textContent('body');
    console.log(`📄 Dashboard content: ${dashboardContent.slice(0, 200)}...`);
    
    console.log('\n📍 Step 5: Test Admin Interface Elements');
    
    // Look for admin-specific elements
    const adminElements = {
      'Admin Dashboard': await page.getByText('Admin Dashboard').count(),
      'Content': await page.getByText('Content').count(),
      'Users': await page.getByText('Users').count(),
      'Design': await page.getByText('Design').count(),
      'Media Manager': await page.getByText('Media Manager').count(),
      'App Settings': await page.getByText('App Settings').count(),
      'Admin Access': await page.getByText('Admin Access').count(),
      'Shield icons': await page.locator('[data-lucide="shield"]').count()
    };
    
    console.log('🔍 Admin interface elements:');
    Object.entries(adminElements).forEach(([name, count]) => {
      console.log(`   - ${name}: ${count}`);
    });
    
    console.log('\n📍 Step 6: Test Admin Tab Navigation');
    
    // Try clicking on Content tab if available
    if (adminElements.Content > 0) {
      console.log('🎯 Testing Content tab...');
      await page.getByText('Content').first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'admin-5-content-tab.png', fullPage: true });
      console.log('✅ Screenshot: admin-5-content-tab.png');
    }
    
    // Try clicking on Design tab if available
    if (adminElements.Design > 0) {
      console.log('🎯 Testing Design tab...');
      await page.getByText('Design').first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'admin-6-design-tab.png', fullPage: true });
      console.log('✅ Screenshot: admin-6-design-tab.png');
    }
    
    console.log('\n📍 Step 7: Test Media Manager');
    
    if (adminElements['Media Manager'] > 0) {
      console.log('📁 Testing Media Manager...');
      await page.getByText('Media Manager').first().click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'admin-7-media-manager.png', fullPage: true });
      console.log('✅ Screenshot: admin-7-media-manager.png');
      
      // Check for upload functionality
      const uploadElements = await page.locator('input[type="file"]').count();
      const uploadButton = await page.getByText('Choose Files').count();
      console.log(`📤 Upload elements found: ${uploadElements} file inputs, ${uploadButton} buttons`);
    }
    
    console.log('\n📍 Step 8: Test App Settings');
    
    if (adminElements['App Settings'] > 0) {
      console.log('⚙️ Testing App Settings...');
      await page.getByText('App Settings').first().click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'admin-8-app-settings.png', fullPage: true });
      console.log('✅ Screenshot: admin-8-app-settings.png');
      
      // Check for editable fields
      const inputs = await page.locator('input, textarea').count();
      console.log(`📝 Form inputs found: ${inputs}`);
    }
    
    console.log('\n📍 Step 9: Test User Management');
    
    if (adminElements.Users > 0) {
      console.log('👥 Testing User Management...');
      await page.getByText('Users').first().click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'admin-9-users.png', fullPage: true });
      console.log('✅ Screenshot: admin-9-users.png');
    }
    
    // Final comprehensive screenshot
    await page.screenshot({ path: 'admin-10-final.png', fullPage: true });
    console.log('✅ Screenshot: admin-10-final.png');
    
    console.log('\n🎯 Admin Dashboard Test Results:');
    console.log('=====================================');
    console.log(`✅ Admin login: ${currentUrl.includes('/auth') ? 'FAILED' : 'SUCCESS'}`);
    console.log(`✅ Dashboard access: ${Object.values(adminElements).some(count => count > 0) ? 'SUCCESS' : 'FAILED'}`);
    console.log(`✅ Admin interface: ${adminElements['Admin Dashboard'] > 0 ? 'FOUND' : 'NOT FOUND'}`);
    console.log(`✅ Content management: ${adminElements.Content > 0 ? 'AVAILABLE' : 'NOT FOUND'}`);
    console.log(`✅ Media manager: ${adminElements['Media Manager'] > 0 ? 'AVAILABLE' : 'NOT FOUND'}`);
    console.log(`✅ User management: ${adminElements.Users > 0 ? 'AVAILABLE' : 'NOT FOUND'}`);
    
    // Keep browser open for 10 seconds to observe final state
    console.log('\n⏱️ Keeping browser open for 10 seconds for observation...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'admin-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n🏁 Admin Dashboard Test Complete!');
    console.log('📸 Check screenshots for detailed visual results');
  }
}

testAdminDashboard().catch(console.error);