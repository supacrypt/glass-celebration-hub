const { chromium } = require('playwright');

async function testEveryAdminFunction() {
  console.log('🔬 EXHAUSTIVE ADMIN FUNCTION TESTING - WHAT ACTUALLY WORKS');
  console.log('Testing EVERY admin control to see if it actually DOES something');
  console.log('='.repeat(70));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 2000,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1400, height: 900 }
  });
  
  const page = await context.newPage();
  
  // Track what actually works vs what's broken
  const workingFunctions = [];
  const brokenFunctions = [];
  const fakeUIFunctions = [];
  
  try {
    console.log('\n📍 ADMIN LOGIN');
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    
    // Login
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'exhaustive-1-dashboard.png', fullPage: true });
    console.log('✅ Admin dashboard loaded');
    
    // =====================================
    // TEST EVERY TAB - COUNT ACTUAL DATA
    // =====================================
    
    console.log('\n📍 TESTING: USER COUNT ACCURACY');
    
    // Check what the dashboard shows for user count
    const bodyText = await page.textContent('body');
    console.log('📊 Dashboard text contains:');
    
    // Look for numbers in the dashboard
    const numbers = bodyText.match(/\d+/g) || [];
    console.log(`🔢 Numbers found on dashboard: ${numbers.join(', ')}`);
    
    // Check for "Total Users" specifically
    const totalUsersMatch = bodyText.match(/Total Users[:\s]*(\d+)/i);
    if (totalUsersMatch) {
      console.log(`👥 Total Users shown: ${totalUsersMatch[1]}`);
      if (totalUsersMatch[1] === '0') {
        console.log('⚠️ ISSUE: Shows 0 users but admin user exists - count is wrong');
        brokenFunctions.push('User count display shows 0 when users exist');
      }
    }
    
    // =====================================
    // CONTENT TAB - DETAILED TESTING
    // =====================================
    
    console.log('\n📍 CONTENT TAB - EXHAUSTIVE TESTING');
    await page.getByText('Content').first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'exhaustive-2-content-tab.png', fullPage: true });
    
    // Test App Settings
    console.log('\n🧪 APP SETTINGS - Form Field Testing');
    const appSettingsCount = await page.getByText('App Settings').count();
    console.log(`📋 App Settings buttons found: ${appSettingsCount}`);
    
    if (appSettingsCount > 0) {
      await page.getByText('App Settings').first().click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'exhaustive-3-app-settings.png', fullPage: true });
      
      // Count ALL input fields
      const allInputs = await page.locator('input, textarea, select').count();
      const textInputs = await page.locator('input[type="text"], input[type="email"], input[type="url"], input:not([type])').count();
      const textareas = await page.locator('textarea').count();
      const selects = await page.locator('select').count();
      
      console.log(`📝 Total form elements: ${allInputs}`);
      console.log(`📝 Text inputs: ${textInputs}`);
      console.log(`📝 Textareas: ${textareas}`);
      console.log(`📝 Select dropdowns: ${selects}`);
      
      if (allInputs === 0) {
        console.log('❌ CRITICAL: App Settings has NO FORM FIELDS - completely fake');
        brokenFunctions.push('App Settings - No form fields exist');
      } else {
        // Test each input field
        console.log('\n🧪 Testing each form field...');
        
        for (let i = 0; i < Math.min(textInputs, 5); i++) {
          const input = page.locator('input[type="text"], input[type="email"], input[type="url"], input:not([type])').nth(i);
          const placeholder = await input.getAttribute('placeholder').catch(() => '');
          const name = await input.getAttribute('name').catch(() => '');
          const value = await input.inputValue().catch(() => '');
          
          console.log(`   Input ${i + 1}: placeholder="${placeholder}", name="${name}", value="${value}"`);
          
          // Try to type in the field
          try {
            await input.fill('TEST VALUE');
            await page.waitForTimeout(500);
            const newValue = await input.inputValue();
            if (newValue === 'TEST VALUE') {
              console.log(`   ✅ Input ${i + 1} accepts text input`);
            } else {
              console.log(`   ❌ Input ${i + 1} does not accept text input`);
            }
          } catch (error) {
            console.log(`   ❌ Input ${i + 1} error: ${error.message}`);
          }
        }
        
        // Look for Save button
        const saveButtons = await page.getByRole('button', { name: /save|update|submit/i }).count();
        console.log(`💾 Save buttons found: ${saveButtons}`);
        
        if (saveButtons === 0) {
          console.log('❌ CRITICAL: No save button - cannot save changes');
          brokenFunctions.push('App Settings - No save functionality');
        } else {
          console.log('✅ Save button exists');
          workingFunctions.push('App Settings - Save button present');
        }
      }
    }
    
    // =====================================
    // USERS TAB - DETAILED TESTING
    // =====================================
    
    console.log('\n📍 USERS TAB - USER DATA TESTING');
    await page.getByText('Users').first().click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'exhaustive-4-users-tab.png', fullPage: true });
    
    // Check for actual user data display
    const userTabText = await page.textContent('body');
    
    // Look for user list elements
    const tableRows = await page.locator('table tr, .user-row, [data-testid*="user"]').count();
    const userEmails = await page.locator('text=/.*@.*\\..*/', { timeout: 2000 }).count().catch(() => 0);
    const userNames = await page.getByText('daniel', { exact: false }).count();
    
    console.log(`📊 Table rows found: ${tableRows}`);
    console.log(`📧 Email addresses displayed: ${userEmails}`);
    console.log(`👤 Admin name references: ${userNames}`);
    
    if (tableRows <= 1 && userEmails === 0) {
      console.log('❌ CRITICAL: Users tab shows no actual user data');
      brokenFunctions.push('Users tab - No user data displayed');
    } else {
      console.log('✅ Users tab displays some data');
      workingFunctions.push('Users tab - Shows some user information');
    }
    
    // Test RSVP section
    console.log('\n🧪 RSVP MANAGEMENT TESTING');
    const rsvpElements = await page.getByText('RSVP', { exact: false }).count();
    console.log(`📝 RSVP elements found: ${rsvpElements}`);
    
    if (rsvpElements > 0) {
      try {
        await page.getByText('RSVP').first().click();
        await page.waitForTimeout(2000);
        
        const rsvpData = await page.locator('table tr, .rsvp-item, [data-testid*="rsvp"]').count();
        console.log(`📋 RSVP data rows: ${rsvpData}`);
        
        if (rsvpData <= 1) {
          console.log('⚠️ RSVP section has no data (expected if no RSVPs yet)');
          fakeUIFunctions.push('RSVP management - Empty but functional UI');
        } else {
          workingFunctions.push('RSVP management - Displays data');
        }
      } catch (error) {
        console.log('❌ RSVP section not clickable or broken');
        brokenFunctions.push('RSVP management - Not functional');
      }
    } else {
      console.log('❌ No RSVP management found');
      brokenFunctions.push('RSVP management - Missing entirely');
    }
    
    // =====================================
    // DESIGN TAB - THEME TESTING
    // =====================================
    
    console.log('\n📍 DESIGN TAB - THEME & CUSTOMIZATION');
    await page.getByText('Design').first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'exhaustive-5-design-tab.png', fullPage: true });
    
    // Test Media Manager
    console.log('\n🧪 MEDIA MANAGER - FILE UPLOAD TEST');
    const mediaManagerCount = await page.getByText('Media Manager').count();
    
    if (mediaManagerCount > 0) {
      await page.getByText('Media Manager').first().click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'exhaustive-6-media-manager.png', fullPage: true });
      
      // Test file upload elements
      const fileInputs = await page.locator('input[type="file"]').count();
      const uploadButtons = await page.getByText('Upload', { exact: false }).count();
      const chooseFileButtons = await page.getByText('Choose', { exact: false }).count();
      
      console.log(`📤 File inputs: ${fileInputs}`);
      console.log(`📤 Upload buttons: ${uploadButtons}`);
      console.log(`📁 Choose file buttons: ${chooseFileButtons}`);
      
      if (fileInputs > 0) {
        workingFunctions.push('Media Manager - File upload interface exists');
      } else {
        brokenFunctions.push('Media Manager - No file upload capability');
      }
      
      // Test existing media display
      const mediaItems = await page.locator('.media-item, .file-item, img, video').count();
      console.log(`🖼️ Media items displayed: ${mediaItems}`);
      
      // Test "Set as Hero" functionality
      const setHeroButtons = await page.getByText('Set as Hero', { exact: false }).count();
      console.log(`🎨 Set as Hero buttons: ${setHeroButtons}`);
      
      if (setHeroButtons === 0) {
        brokenFunctions.push('Media Manager - No set as hero functionality');
      } else {
        workingFunctions.push('Media Manager - Set as hero buttons exist');
      }
    } else {
      brokenFunctions.push('Media Manager - Not found in Design tab');
    }
    
    // Test Theme Customization
    console.log('\n🧪 THEME CUSTOMIZATION - TYPOGRAPHY & COLORS');
    
    // Look for theme/typography options
    const themeButtons = await page.getByText('Theme', { exact: false }).count();
    const typographyButtons = await page.getByText('Typography', { exact: false }).count();
    const fontButtons = await page.getByText('Font', { exact: false }).count();
    const colorButtons = await page.getByText('Color', { exact: false }).count();
    
    console.log(`🎨 Theme buttons: ${themeButtons}`);
    console.log(`📝 Typography buttons: ${typographyButtons}`);
    console.log(`🔤 Font buttons: ${fontButtons}`);
    console.log(`🌈 Color buttons: ${colorButtons}`);
    
    if (typographyButtons === 0 && fontButtons === 0) {
      console.log('❌ CRITICAL: No typography/font customization found');
      brokenFunctions.push('Typography customization - Missing entirely');
    }
    
    if (themeButtons > 0) {
      try {
        await page.getByText('Theme').first().click();
        await page.waitForTimeout(2000);
        
        // Look for actual theme options
        const themeOptions = await page.locator('button, .theme-option, [data-theme]').count();
        console.log(`🎨 Theme options found: ${themeOptions}`);
        
        if (themeOptions <= 2) {
          brokenFunctions.push('Theme customization - No theme options available');
        } else {
          workingFunctions.push('Theme customization - Theme options exist');
        }
      } catch (error) {
        brokenFunctions.push('Theme customization - Not clickable');
      }
    }
    
    // =====================================
    // COMMUNICATION TAB TESTING
    // =====================================
    
    console.log('\n📍 COMMUNICATION TAB - EMAIL & MESSAGING');
    await page.getByText('Communication').first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'exhaustive-7-communication.png', fullPage: true });
    
    const emailElements = await page.getByText('Email', { exact: false }).count();
    const messageElements = await page.getByText('Message', { exact: false }).count();
    const notificationElements = await page.getByText('Notification', { exact: false }).count();
    
    console.log(`📧 Email elements: ${emailElements}`);
    console.log(`💬 Message elements: ${messageElements}`);
    console.log(`🔔 Notification elements: ${notificationElements}`);
    
    if (emailElements === 0 && messageElements === 0) {
      brokenFunctions.push('Communication - No email/messaging functionality');
    } else {
      // Test if communication tools actually work
      if (emailElements > 0) {
        try {
          await page.getByText('Email').first().click();
          await page.waitForTimeout(2000);
          
          const emailForm = await page.locator('form, input[type="email"], textarea').count();
          if (emailForm > 0) {
            workingFunctions.push('Communication - Email interface exists');
          } else {
            fakeUIFunctions.push('Communication - Email button exists but no form');
          }
        } catch (error) {
          brokenFunctions.push('Communication - Email not functional');
        }
      }
    }
    
    // =====================================
    // ANALYTICS TAB TESTING
    // =====================================
    
    console.log('\n📍 ANALYTICS TAB - DATA DISPLAY');
    await page.getByText('Analytics').first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'exhaustive-8-analytics.png', fullPage: true });
    
    // Look for charts, graphs, data displays
    const chartElements = await page.locator('canvas, svg, .chart, [class*="chart"]').count();
    const dataElements = await page.locator('.metric, .stat, .data-point').count();
    
    console.log(`📊 Chart elements: ${chartElements}`);
    console.log(`📈 Data elements: ${dataElements}`);
    
    if (chartElements === 0 && dataElements === 0) {
      brokenFunctions.push('Analytics - No data visualization');
    } else {
      workingFunctions.push('Analytics - Data visualization elements exist');
    }
    
    // =====================================
    // SYSTEM TAB TESTING
    // =====================================
    
    console.log('\n📍 SYSTEM TAB - CONFIGURATION');
    await page.getByText('System').first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'exhaustive-9-system.png', fullPage: true });
    
    const systemConfig = await page.locator('input, select, textarea').count();
    console.log(`⚙️ System configuration fields: ${systemConfig}`);
    
    if (systemConfig === 0) {
      brokenFunctions.push('System - No configuration options');
    } else {
      workingFunctions.push('System - Configuration interface exists');
    }
    
    // =====================================
    // DEVELOPMENT TAB TESTING
    // =====================================
    
    console.log('\n📍 DEVELOPMENT TAB - TESTING TOOLS');
    await page.getByText('Development').first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'exhaustive-10-development.png', fullPage: true });
    
    const devTools = await page.getByText('Test', { exact: false }).count();
    console.log(`🔧 Development tools: ${devTools}`);
    
    // =====================================
    // ADVANCED TAB TESTING
    // =====================================
    
    console.log('\n📍 ADVANCED TAB - MONITORING');
    await page.getByText('Advanced').first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'exhaustive-11-advanced.png', fullPage: true });
    
    await page.screenshot({ path: 'exhaustive-12-final.png', fullPage: true });
    
    // =====================================
    // COMPREHENSIVE RESULTS
    // =====================================
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 EXHAUSTIVE ADMIN TESTING - WHAT ACTUALLY WORKS VS BROKEN');
    console.log('='.repeat(80));
    
    console.log(`\n✅ WORKING FUNCTIONS (${workingFunctions.length}):`);
    workingFunctions.forEach((func, i) => console.log(`   ${i + 1}. ${func}`));
    
    console.log(`\n❌ BROKEN FUNCTIONS (${brokenFunctions.length}):`);
    brokenFunctions.forEach((func, i) => console.log(`   ${i + 1}. ${func}`));
    
    console.log(`\n⚠️ FAKE UI FUNCTIONS (${fakeUIFunctions.length}):`);
    fakeUIFunctions.forEach((func, i) => console.log(`   ${i + 1}. ${func}`));
    
    const totalIssues = brokenFunctions.length + fakeUIFunctions.length;
    const successRate = Math.round((workingFunctions.length / (workingFunctions.length + totalIssues)) * 100);
    
    console.log(`\n📊 ADMIN DASHBOARD SUCCESS RATE: ${successRate}%`);
    console.log(`   ✅ Working: ${workingFunctions.length}`);
    console.log(`   ❌ Broken: ${brokenFunctions.length}`);
    console.log(`   ⚠️ Fake UI: ${fakeUIFunctions.length}`);
    
    if (totalIssues > 0) {
      console.log('\n🚨 CRITICAL CONCLUSION: Many admin functions are broken or fake UI!');
      console.log('📋 Need systematic fixing of each broken function.');
    } else {
      console.log('\n🎉 EXCELLENT: All admin functions appear to be working!');
    }
    
    console.log('\n⏱️ Keeping browser open for 20 seconds for detailed observation...');
    await page.waitForTimeout(20000);
    
  } catch (error) {
    console.error('❌ Major test error:', error.message);
    await page.screenshot({ path: 'exhaustive-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n🏁 Exhaustive Admin Testing Complete!');
    console.log('📸 Check 12 detailed screenshots for visual evidence');
  }
}

testEveryAdminFunction().catch(console.error);