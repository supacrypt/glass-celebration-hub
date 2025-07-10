const { chromium } = require('playwright');

async function testAdminFunctionality() {
  console.log('🔬 COMPREHENSIVE ADMIN FUNCTIONALITY TESTING');
  console.log('Testing every admin control to verify actual functionality');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1500,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Track issues found during testing
  const issues = [];
  
  try {
    console.log('\n📍 PHASE 1: ADMIN LOGIN & ACCESS');
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    
    // Login with admin credentials
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    
    // Navigate to admin dashboard
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'func-1-admin-authenticated.png', fullPage: true });
    console.log('✅ Admin authenticated and dashboard loaded');
    
    // =====================================
    // CONTENT MANAGEMENT TESTING
    // =====================================
    console.log('\n📍 PHASE 2: CONTENT MANAGEMENT - APP SETTINGS');
    
    try {
      // Navigate to Content tab
      const contentTab = await page.getByText('Content').first();
      if (contentTab) {
        await contentTab.click();
        await page.waitForTimeout(2000);
        console.log('✅ Content tab clicked');
        
        // Look for App Settings
        const appSettingsElements = await page.getByText('App Settings').count();
        console.log(`🔍 App Settings elements found: ${appSettingsElements}`);
        
        if (appSettingsElements > 0) {
          try {
            await page.getByText('App Settings').first().click();
            await page.waitForTimeout(3000);
            await page.screenshot({ path: 'func-2-app-settings-opened.png', fullPage: true });
            console.log('✅ App Settings opened');
            
            // TEST: App Name Editing
            console.log('\n🧪 TESTING: App Name Change');
            const appNameInputs = await page.locator('input[placeholder*="app name"], input[placeholder*="wedding"], input[name*="name"], input[name*="title"]').count();
            console.log(`📝 Potential app name inputs: ${appNameInputs}`);
            
            if (appNameInputs > 0) {
              const originalValue = await page.locator('input[placeholder*="app name"], input[placeholder*="wedding"], input[name*="name"], input[name*="title"]').first().inputValue();
              console.log(`📄 Original app name: "${originalValue}"`);
              
              // Change the app name
              await page.locator('input[placeholder*="app name"], input[placeholder*="wedding"], input[name*="name"], input[name*="title"]').first().fill('TEST WEDDING APP NAME');
              await page.waitForTimeout(1000);
              
              // Look for Save button
              const saveButtons = await page.getByRole('button', { name: /save/i }).count();
              console.log(`💾 Save buttons found: ${saveButtons}`);
              
              if (saveButtons > 0) {
                await page.getByRole('button', { name: /save/i }).first().click();
                await page.waitForTimeout(3000);
                console.log('✅ Save button clicked');
                
                // Check for success message or confirmation
                const bodyText = await page.textContent('body');
                const hasSuccess = bodyText.toLowerCase().includes('saved') || 
                                 bodyText.toLowerCase().includes('updated') ||
                                 bodyText.toLowerCase().includes('success');
                
                if (hasSuccess) {
                  console.log('✅ SUCCESS: App name change appears to have worked');
                } else {
                  console.log('⚠️ UNCLEAR: No clear success feedback shown');
                  issues.push({
                    section: 'Content Management',
                    function: 'App Name Change',
                    issue: 'No clear success feedback after save',
                    severity: 'Medium'
                  });
                }
                
                // Test persistence - refresh and check if change persisted
                await page.reload();
                await page.waitForTimeout(3000);
                
                // Re-navigate to App Settings to check persistence
                await page.getByText('Content').first().click();
                await page.waitForTimeout(1000);
                await page.getByText('App Settings').first().click();
                await page.waitForTimeout(2000);
                
                const newValue = await page.locator('input[placeholder*="app name"], input[placeholder*="wedding"], input[name*="name"], input[name*="title"]').first().inputValue();
                
                if (newValue === 'TEST WEDDING APP NAME') {
                  console.log('✅ PERSISTENCE TEST PASSED: Change persisted after refresh');
                } else {
                  console.log('❌ PERSISTENCE TEST FAILED: Change was not saved to database');
                  issues.push({
                    section: 'Content Management',
                    function: 'App Name Change',
                    issue: 'Changes do not persist - not saving to database',
                    severity: 'Critical'
                  });
                }
                
                // Restore original value
                await page.locator('input[placeholder*="app name"], input[placeholder*="wedding"], input[name*="name"], input[name*="title"]').first().fill(originalValue || 'Wedding App');
                await page.getByRole('button', { name: /save/i }).first().click();
                await page.waitForTimeout(2000);
                
              } else {
                console.log('❌ CRITICAL: No save button found');
                issues.push({
                  section: 'Content Management',
                  function: 'App Name Change',
                  issue: 'No save button available',
                  severity: 'Critical'
                });
              }
            } else {
              console.log('❌ CRITICAL: No app name input fields found');
              issues.push({
                section: 'Content Management',
                function: 'App Name Change',
                issue: 'No input fields found for app name',
                severity: 'Critical'
              });
            }
            
          } catch (appSettingsError) {
            console.log('❌ FAILED to access App Settings:', appSettingsError.message);
            issues.push({
              section: 'Content Management',
              function: 'App Settings Access',
              issue: `Cannot access App Settings: ${appSettingsError.message}`,
              severity: 'Critical'
            });
          }
        } else {
          console.log('❌ CRITICAL: App Settings not found in Content section');
          issues.push({
            section: 'Content Management',
            function: 'App Settings Access',
            issue: 'App Settings section not found',
            severity: 'Critical'
          });
        }
      }
    } catch (contentError) {
      console.log('❌ FAILED to access Content tab:', contentError.message);
      issues.push({
        section: 'Content Management',
        function: 'Content Tab Access',
        issue: `Cannot access Content tab: ${contentError.message}`,
        severity: 'Critical'
      });
    }
    
    // =====================================
    // MEDIA MANAGER TESTING
    // =====================================
    console.log('\n📍 PHASE 3: DESIGN - MEDIA MANAGER');
    
    try {
      // Navigate to Design tab
      await page.getByText('Design').first().click();
      await page.waitForTimeout(2000);
      console.log('✅ Design tab clicked');
      
      // Look for Media Manager
      const mediaManagerElements = await page.getByText('Media Manager').count();
      console.log(`🔍 Media Manager elements found: ${mediaManagerElements}`);
      
      if (mediaManagerElements > 0) {
        await page.getByText('Media Manager').first().click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'func-3-media-manager-opened.png', fullPage: true });
        console.log('✅ Media Manager opened');
        
        // TEST: File Upload Interface
        console.log('\n🧪 TESTING: File Upload Interface');
        const fileInputs = await page.locator('input[type="file"]').count();
        const chooseFileButtons = await page.getByText('Choose Files', { exact: false }).count();
        const uploadButtons = await page.getByText('Upload', { exact: false }).count();
        
        console.log(`📤 File inputs found: ${fileInputs}`);
        console.log(`📁 Choose file buttons: ${chooseFileButtons}`);
        console.log(`📤 Upload buttons: ${uploadButtons}`);
        
        if (fileInputs === 0 && chooseFileButtons === 0) {
          console.log('❌ CRITICAL: No file upload interface found');
          issues.push({
            section: 'Media Manager',
            function: 'File Upload',
            issue: 'No file upload interface elements found',
            severity: 'Critical'
          });
        } else {
          console.log('✅ File upload interface exists');
        }
        
        // TEST: Media Grid/List Display
        console.log('\n🧪 TESTING: Media Display');
        const mediaItems = await page.locator('.media-item, .file-item, [class*="media"], [class*="file"]').count();
        console.log(`🖼️ Media items displayed: ${mediaItems}`);
        
        // TEST: Set as Hero Background
        console.log('\n🧪 TESTING: Hero Background Setting');
        const setHeroButtons = await page.getByText('Set as Hero', { exact: false }).count();
        const backgroundButtons = await page.getByText('Background', { exact: false }).count();
        
        console.log(`🎨 Set hero buttons: ${setHeroButtons}`);
        console.log(`🎨 Background buttons: ${backgroundButtons}`);
        
        if (setHeroButtons === 0 && backgroundButtons === 0) {
          console.log('⚠️ MISSING: No hero background setting functionality visible');
          issues.push({
            section: 'Media Manager',
            function: 'Set Hero Background',
            issue: 'No hero background setting buttons found',
            severity: 'High'
          });
        }
        
      } else {
        console.log('❌ CRITICAL: Media Manager not found in Design section');
        issues.push({
          section: 'Design',
          function: 'Media Manager Access',
          issue: 'Media Manager section not found',
          severity: 'Critical'
        });
      }
      
    } catch (designError) {
      console.log('❌ FAILED to access Design tab:', designError.message);
      issues.push({
        section: 'Design',
        function: 'Design Tab Access',
        issue: `Cannot access Design tab: ${designError.message}`,
        severity: 'Critical'
      });
    }
    
    // =====================================
    // USER MANAGEMENT TESTING
    // =====================================
    console.log('\n📍 PHASE 4: USER & RSVP MANAGEMENT');
    
    try {
      // Navigate to Users tab
      await page.getByText('Users').first().click();
      await page.waitForTimeout(2000);
      console.log('✅ Users tab clicked');
      
      await page.screenshot({ path: 'func-4-users-section.png', fullPage: true });
      
      // TEST: User List Display
      console.log('\n🧪 TESTING: User List Display');
      const userTableRows = await page.locator('tr, .user-row, [class*="user"], .table-row').count();
      const userListElements = await page.getByText('User', { exact: false }).count();
      
      console.log(`👥 User table rows: ${userTableRows}`);
      console.log(`👥 User-related elements: ${userListElements}`);
      
      // TEST: RSVP Management
      console.log('\n🧪 TESTING: RSVP Management');
      const rsvpElements = await page.getByText('RSVP', { exact: false }).count();
      const guestElements = await page.getByText('Guest', { exact: false }).count();
      
      console.log(`📝 RSVP elements: ${rsvpElements}`);
      console.log(`👤 Guest elements: ${guestElements}`);
      
      if (rsvpElements === 0) {
        console.log('⚠️ MISSING: No RSVP management functionality visible');
        issues.push({
          section: 'User Management',
          function: 'RSVP Management',
          issue: 'No RSVP management interface found',
          severity: 'High'
        });
      }
      
    } catch (usersError) {
      console.log('❌ FAILED to access Users tab:', usersError.message);
      issues.push({
        section: 'User Management',
        function: 'Users Tab Access',
        issue: `Cannot access Users tab: ${usersError.message}`,
        severity: 'Critical'
      });
    }
    
    // =====================================
    // THEME CUSTOMIZATION TESTING
    // =====================================
    console.log('\n📍 PHASE 5: THEME CUSTOMIZATION');
    
    try {
      await page.getByText('Design').first().click();
      await page.waitForTimeout(1000);
      
      // Look for theme/customization options
      const themeElements = await page.getByText('Theme', { exact: false }).count();
      const customizeElements = await page.getByText('Customize', { exact: false }).count();
      const colorElements = await page.getByText('Color', { exact: false }).count();
      
      console.log(`🎨 Theme elements: ${themeElements}`);
      console.log(`⚙️ Customize elements: ${customizeElements}`);
      console.log(`🌈 Color elements: ${colorElements}`);
      
      if (themeElements === 0 && customizeElements === 0 && colorElements === 0) {
        console.log('⚠️ MISSING: No theme customization functionality visible');
        issues.push({
          section: 'Design',
          function: 'Theme Customization',
          issue: 'No theme customization interface found',
          severity: 'Medium'
        });
      }
      
    } catch (themeError) {
      console.log('❌ FAILED to test theme customization:', themeError.message);
    }
    
    // =====================================
    // COMMUNICATION TESTING
    // =====================================
    console.log('\n📍 PHASE 6: COMMUNICATION');
    
    try {
      await page.getByText('Communication').first().click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: 'func-5-communication.png', fullPage: true });
      
      const emailElements = await page.getByText('Email', { exact: false }).count();
      const messageElements = await page.getByText('Message', { exact: false }).count();
      const notificationElements = await page.getByText('Notification', { exact: false }).count();
      
      console.log(`📧 Email elements: ${emailElements}`);
      console.log(`💬 Message elements: ${messageElements}`);
      console.log(`🔔 Notification elements: ${notificationElements}`);
      
      if (emailElements === 0 && messageElements === 0) {
        console.log('⚠️ MISSING: No communication functionality visible');
        issues.push({
          section: 'Communication',
          function: 'Email/Messaging',
          issue: 'No communication interface found',
          severity: 'Medium'
        });
      }
      
    } catch (commError) {
      console.log('❌ FAILED to access Communication tab:', commError.message);
    }
    
    // Final comprehensive screenshot
    await page.screenshot({ path: 'func-6-testing-complete.png', fullPage: true });
    
    // =====================================
    // RESULTS SUMMARY
    // =====================================
    console.log('\n' + '='.repeat(60));
    console.log('🎯 COMPREHENSIVE ADMIN FUNCTIONALITY TEST RESULTS');
    console.log('='.repeat(60));
    
    console.log(`\n📊 ISSUES FOUND: ${issues.length}`);
    
    if (issues.length === 0) {
      console.log('✅ NO ISSUES FOUND - All admin functions appear to be working!');
    } else {
      // Group issues by severity
      const critical = issues.filter(i => i.severity === 'Critical');
      const high = issues.filter(i => i.severity === 'High');
      const medium = issues.filter(i => i.severity === 'Medium');
      
      console.log(`\n❌ CRITICAL ISSUES: ${critical.length}`);
      critical.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.section} - ${issue.function}: ${issue.issue}`);
      });
      
      console.log(`\n⚠️ HIGH PRIORITY ISSUES: ${high.length}`);
      high.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.section} - ${issue.function}: ${issue.issue}`);
      });
      
      console.log(`\n⚡ MEDIUM PRIORITY ISSUES: ${medium.length}`);
      medium.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.section} - ${issue.function}: ${issue.issue}`);
      });
    }
    
    console.log('\n🏁 Testing completed successfully!');
    
    // Keep browser open for observation
    console.log('\n⏱️ Keeping browser open for 15 seconds for final observation...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Major test error:', error.message);
    await page.screenshot({ path: 'func-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n🏁 Admin Functionality Testing Complete!');
    console.log('📸 Check screenshots for detailed visual results');
    console.log('📋 Issues documented above for systematic fixing');
  }
}

testAdminFunctionality().catch(console.error);