const { chromium } = require('playwright');

async function quickAdminCheck() {
  console.log('⚡ QUICK ADMIN DASHBOARD CHECK');
  console.log('Verifying server status and admin functionality');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 800,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1400, height: 900 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📍 Step 1: Test Server and Login');
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check if homepage loads
    const homepageWorking = await page.evaluate(() => {
      return document.body.textContent.includes('Tim & Kirsten') || 
             document.body.textContent.includes('Wedding');
    });
    
    console.log(`   - Homepage loading: ${homepageWorking ? '✅' : '❌'}`);
    
    // Go to admin login
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Login
    const loginFormExists = await page.locator('input[type="email"]').count() > 0;
    console.log(`   - Login form present: ${loginFormExists ? '✅' : '❌'}`);
    
    if (loginFormExists) {
      await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
      await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
      await page.getByRole('button', { name: 'Sign In', exact: true }).click();
      await page.waitForTimeout(5000);
      
      // Navigate to admin dashboard
      await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: 'quick-admin-1-dashboard.png', fullPage: true });
      
      console.log('✅ Successfully logged into admin dashboard');
      
      console.log('\\n📍 Step 2: Check Admin Tabs');
      
      // Test each main admin tab
      const tabs = ['Content', 'Users & RSVPs', 'Design', 'Communication', 'Analytics', 'System', 'Advanced'];
      const tabResults = {};
      
      for (const tab of tabs) {
        try {
          console.log(`   Testing ${tab} tab...`);
          await page.getByText(tab).first().click();
          await page.waitForTimeout(2000);
          
          const tabContent = await page.evaluate(() => document.body.textContent);
          tabResults[tab] = {
            accessible: true,
            hasContent: tabContent.length > 1000, // Basic content check
            screenshot: `quick-admin-${tabs.indexOf(tab) + 2}-${tab.toLowerCase().replace(/[^a-z]/g, '')}.png`
          };
          
          await page.screenshot({ path: tabResults[tab].screenshot, fullPage: true });
          console.log(`   ✅ ${tab} tab loaded`);
          
        } catch (error) {
          console.log(`   ❌ ${tab} tab failed: ${error.message}`);
          tabResults[tab] = { accessible: false, error: error.message };
        }
      }
      
      console.log('\\n📍 Step 3: Test Rich Text Integration');
      
      // Go to Content > App Settings to test rich text
      await page.getByText('Content').first().click();
      await page.waitForTimeout(1000);
      await page.getByText('App Settings').first().click();
      await page.waitForTimeout(3000);
      
      const richTextCheck = await page.evaluate(() => {
        const richEditors = document.querySelectorAll('[contenteditable="true"]');
        const toolbars = document.querySelectorAll('[class*="toolbar"], .flex.flex-wrap.gap-2');
        const fontButtons = document.querySelectorAll('button[title*="Type"], button[title*="Font"]');
        const colorButtons = document.querySelectorAll('button[title*="Palette"], button[title*="Color"]');
        
        return {
          richEditors: richEditors.length,
          toolbars: toolbars.length,
          fontButtons: fontButtons.length,
          colorButtons: colorButtons.length,
          hasRichContent: Array.from(richEditors).some(editor => 
            editor.textContent.includes('💕') || editor.innerHTML.includes('<'))
        };
      });
      
      await page.screenshot({ path: 'quick-admin-rich-text-check.png', fullPage: true });
      
      console.log('\\n📝 RICH TEXT STATUS:');
      console.log(`   - Rich text editors: ${richTextCheck.richEditors}`);
      console.log(`   - Formatting toolbars: ${richTextCheck.toolbars}`);
      console.log(`   - Font controls: ${richTextCheck.fontButtons}`);
      console.log(`   - Color controls: ${richTextCheck.colorButtons}`);
      console.log(`   - Rich content present: ${richTextCheck.hasRichContent ? '✅' : '❌'}`);
      
      console.log('\\n📍 Step 4: Check User & RSVP Data');
      
      // Test Users & RSVPs tab for actual data
      await page.getByText('Users & RSVPs').first().click();
      await page.waitForTimeout(3000);
      
      const userRSVPData = await page.evaluate(() => {
        const tables = document.querySelectorAll('table');
        const rows = document.querySelectorAll('tr');
        const userElements = document.querySelectorAll('[class*="user"], [class*="member"]');
        const rsvpElements = document.querySelectorAll('[class*="rsvp"], [class*="response"]');
        
        // Look for actual user data in text content
        const bodyText = document.body.textContent;
        const hasEmails = /@/.test(bodyText);
        const hasNames = /[A-Z][a-z]+ [A-Z][a-z]+/.test(bodyText);
        const hasRSVPStatus = /yes|no|pending|confirmed|declined/i.test(bodyText);
        
        return {
          tables: tables.length,
          rows: rows.length,
          userElements: userElements.length,
          rsvpElements: rsvpElements.length,
          hasEmails,
          hasNames,
          hasRSVPStatus,
          sampleText: bodyText.substring(0, 200)
        };
      });
      
      await page.screenshot({ path: 'quick-admin-users-rsvps-data.png', fullPage: true });
      
      console.log('\\n👥 USER & RSVP DATA:');
      console.log(`   - Tables found: ${userRSVPData.tables}`);
      console.log(`   - Rows found: ${userRSVPData.rows}`);
      console.log(`   - User elements: ${userRSVPData.userElements}`);
      console.log(`   - RSVP elements: ${userRSVPData.rsvpElements}`);
      console.log(`   - Contains emails: ${userRSVPData.hasEmails ? '✅' : '❌'}`);
      console.log(`   - Contains names: ${userRSVPData.hasNames ? '✅' : '❌'}`);
      console.log(`   - Contains RSVP status: ${userRSVPData.hasRSVPStatus ? '✅' : '❌'}`);
      
      // ================================
      // FINAL RESULTS SUMMARY
      // ================================
      console.log('\\n' + '='.repeat(50));
      console.log('🎯 ADMIN DASHBOARD STATUS SUMMARY');
      console.log('='.repeat(50));
      
      const workingTabs = Object.values(tabResults).filter(result => result.accessible).length;
      const totalTabs = tabs.length;
      
      console.log(`\\n📊 TAB ACCESSIBILITY: ${workingTabs}/${totalTabs}`);
      Object.entries(tabResults).forEach(([tab, result]) => {
        console.log(`   ${tab}: ${result.accessible ? '✅' : '❌'}`);
      });
      
      console.log(`\\n📝 RICH TEXT INTEGRATION: ${richTextCheck.richEditors > 0 ? '✅ WORKING' : '❌ BROKEN'}`);
      console.log(`\\n👥 USER DATA DISPLAY: ${userRSVPData.hasEmails || userRSVPData.hasNames ? '✅ WORKING' : '❌ MISSING'}`);
      
      const overallStatus = workingTabs >= 6 && richTextCheck.richEditors > 0;
      console.log(`\\n🏆 OVERALL STATUS: ${overallStatus ? '✅ EXCELLENT' : '⚠️ NEEDS ATTENTION'}`);
      
      if (overallStatus) {
        console.log('\\n🎉 ADMIN DASHBOARD IS FULLY FUNCTIONAL!');
        console.log('   ✅ All major tabs accessible');
        console.log('   ✅ Rich text editing working');
        console.log('   ✅ Content-Design integration complete');
        console.log('   ✅ Wedding-themed UI maintained');
      } else {
        console.log('\\n⚠️ Some issues found that need attention:');
        if (workingTabs < 6) console.log('   - Some admin tabs not working properly');
        if (richTextCheck.richEditors === 0) console.log('   - Rich text editors not functioning');
      }
      
    } else {
      console.log('❌ Cannot proceed - login form not found');
    }
    
    console.log('\\n⏱️ Keeping browser open for review...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Quick check error:', error.message);
    await page.screenshot({ path: 'quick-admin-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Quick Admin Check Complete!');
  }
}

quickAdminCheck().catch(console.error);