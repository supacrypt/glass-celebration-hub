const { chromium } = require('playwright');

async function quickAdminTest() {
  console.log('🚀 QUICK ADMIN REALITY CHECK - What Actually Works');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1000,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1400, height: 900 }
  });
  
  const page = await context.newPage();
  
  try {
    // Login
    console.log('📍 Logging in...');
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    console.log('✅ Admin logged in');
    
    // =====================================
    // TEST 1: USER COUNT ACCURACY
    // =====================================
    console.log('\\n🧪 TEST 1: User Count Display');
    const bodyText = await page.textContent('body');
    const totalUsersMatch = bodyText.match(/Total Users[:\\s]*(\\d+)/i);
    if (totalUsersMatch) {
      console.log(`👥 Dashboard shows: ${totalUsersMatch[1]} users`);
      if (totalUsersMatch[1] === '0') {
        console.log('❌ BROKEN: Shows 0 users but admin exists');
      } else {
        console.log('✅ User count appears correct');
      }
    } else {
      console.log('⚠️ No user count found on dashboard');
    }
    
    // =====================================
    // TEST 2: TYPOGRAPHY/FONTS
    // =====================================
    console.log('\\n🧪 TEST 2: Typography & Font Options');
    await page.getByText('Design').first().click();
    await page.waitForTimeout(2000);
    
    const typographyButtons = await page.getByText('Typography', { exact: false }).count();
    const fontButtons = await page.getByText('Font', { exact: false }).count();
    const customizeButtons = await page.getByText('Customize', { exact: false }).count();
    
    console.log(`📝 Typography buttons: ${typographyButtons}`);
    console.log(`🔤 Font buttons: ${fontButtons}`);
    console.log(`⚙️ Customize buttons: ${customizeButtons}`);
    
    if (typographyButtons === 0 && fontButtons === 0) {
      console.log('❌ BROKEN: No typography/font customization found');
    }
    
    // Try to click on any customization option
    if (customizeButtons > 0) {
      await page.getByText('Customize').first().click();
      await page.waitForTimeout(2000);
      
      // Look for font options
      const fontSelectors = await page.locator('select, .font-select, [class*="font"]').count();
      const googleFonts = await page.getByText('Google', { exact: false }).count();
      
      console.log(`🔤 Font selectors found: ${fontSelectors}`);
      console.log(`🌐 Google Fonts references: ${googleFonts}`);
      
      if (fontSelectors === 0) {
        console.log('❌ BROKEN: No font selection interface');
      }
    }
    
    await page.screenshot({ path: 'quick-1-design.png', fullPage: true });
    
    // =====================================
    // TEST 3: THEME CHANGES
    // =====================================
    console.log('\\n🧪 TEST 3: Theme Changes Actually Apply');
    
    const themeButtons = await page.getByText('Theme', { exact: false }).count();
    console.log(`🎨 Theme buttons found: ${themeButtons}`);
    
    if (themeButtons > 0) {
      await page.getByText('Theme').first().click();
      await page.waitForTimeout(2000);
      
      // Look for theme options
      const themeOptions = await page.locator('button[data-theme], .theme-option, [class*="theme"]').count();
      console.log(`🎨 Theme options: ${themeOptions}`);
      
      if (themeOptions === 0) {
        console.log('❌ BROKEN: No theme options available');
      } else {
        // Try to click a theme and see if anything changes
        console.log('🧪 Testing theme change...');
        
        // Get current page background before change
        const beforeBackground = await page.evaluate(() => {
          return window.getComputedStyle(document.body).backgroundColor;
        });
        
        // Click first theme option
        await page.locator('button[data-theme], .theme-option, [class*="theme"]').first().click();
        await page.waitForTimeout(2000);
        
        // Check if background changed
        const afterBackground = await page.evaluate(() => {
          return window.getComputedStyle(document.body).backgroundColor;
        });
        
        if (beforeBackground === afterBackground) {
          console.log('❌ BROKEN: Theme change had no effect');
        } else {
          console.log('✅ Theme change appears to work');
        }
      }
    }
    
    await page.screenshot({ path: 'quick-2-themes.png', fullPage: true });
    
    // =====================================
    // TEST 4: APP SETTINGS FORM
    // =====================================
    console.log('\\n🧪 TEST 4: App Settings Form Fields');
    await page.getByText('Content').first().click();
    await page.waitForTimeout(1000);
    await page.getByText('App Settings').first().click();
    await page.waitForTimeout(3000);
    
    const formFields = await page.locator('input, textarea, select').count();
    console.log(`📝 Form fields found: ${formFields}`);
    
    if (formFields === 0) {
      console.log('❌ BROKEN: App Settings has no form fields');
    } else {
      // Test if fields can be edited
      const firstInput = page.locator('input').first();
      const originalValue = await firstInput.inputValue().catch(() => '');
      
      try {
        await firstInput.fill('TEST CHANGE');
        const newValue = await firstInput.inputValue();
        
        if (newValue === 'TEST CHANGE') {
          console.log('✅ Form fields accept input');
          
          // Test save functionality
          const saveButtons = await page.getByRole('button', { name: /save/i }).count();
          if (saveButtons > 0) {
            console.log('✅ Save button exists');
          } else {
            console.log('❌ BROKEN: No save button');
          }
          
          // Restore original value
          await firstInput.fill(originalValue);
        } else {
          console.log('❌ BROKEN: Form fields do not accept input');
        }
      } catch (error) {
        console.log('❌ BROKEN: Cannot interact with form fields');
      }
    }
    
    await page.screenshot({ path: 'quick-3-app-settings.png', fullPage: true });
    
    // =====================================
    // TEST 5: USERS TAB DATA
    // =====================================
    console.log('\\n🧪 TEST 5: Users Tab Shows Real Data');
    await page.getByText('Users').first().click();
    await page.waitForTimeout(2000);
    
    const userRows = await page.locator('tr, .user-item, [class*="user"]').count();
    const emailAddresses = await page.locator('text=/.*@.*\\..*/', { timeout: 2000 }).count().catch(() => 0);
    
    console.log(`👥 User rows found: ${userRows}`);
    console.log(`📧 Email addresses displayed: ${emailAddresses}`);
    
    if (userRows <= 1 && emailAddresses === 0) {
      console.log('❌ BROKEN: Users tab shows no real user data');
    } else {
      console.log('✅ Users tab shows some data');
    }
    
    await page.screenshot({ path: 'quick-4-users.png', fullPage: true });
    
    // =====================================
    // TEST 6: MEDIA MANAGER
    // =====================================
    console.log('\\n🧪 TEST 6: Media Manager Upload');
    await page.getByText('Design').first().click();
    await page.waitForTimeout(1000);
    
    const mediaManagerCount = await page.getByText('Media Manager').count();
    if (mediaManagerCount > 0) {
      await page.getByText('Media Manager').first().click();
      await page.waitForTimeout(2000);
      
      const fileInputs = await page.locator('input[type="file"]').count();
      const uploadButtons = await page.getByText('Upload', { exact: false }).count();
      
      console.log(`📤 File inputs: ${fileInputs}`);
      console.log(`📤 Upload buttons: ${uploadButtons}`);
      
      if (fileInputs === 0) {
        console.log('❌ BROKEN: No file upload capability');
      } else {
        console.log('✅ File upload interface exists');
      }
    } else {
      console.log('❌ BROKEN: Media Manager not found');
    }
    
    await page.screenshot({ path: 'quick-5-media.png', fullPage: true });
    
    // =====================================
    // QUICK SUMMARY
    // =====================================
    console.log('\\n' + '='.repeat(60));
    console.log('🎯 QUICK ADMIN REALITY CHECK RESULTS');
    console.log('='.repeat(60));
    
    console.log('\\n📊 Issues Found:');
    console.log('1. User count display may be inaccurate (shows 0)');
    console.log('2. Typography/font customization missing or limited');
    console.log('3. Theme changes may not actually apply');
    console.log('4. Need to verify App Settings save functionality');
    console.log('5. Users tab may not show real user data');
    console.log('6. Media Manager upload capability needs verification');
    
    console.log('\\n📋 Next Steps:');
    console.log('- Fix user count display to show accurate numbers');
    console.log('- Implement proper typography/font selection');
    console.log('- Fix theme changes to actually apply to frontend');
    console.log('- Ensure App Settings actually save to database');
    console.log('- Fix Users tab to display real user accounts');
    console.log('- Verify Media Manager upload to Supabase works');
    
    console.log('\\n⏱️ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'quick-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Quick Admin Test Complete!');
  }
}

quickAdminTest().catch(console.error);