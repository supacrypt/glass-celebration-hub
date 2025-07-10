const { chromium } = require('playwright');

async function debugAppSettings() {
  console.log('🔍 DEBUG APP SETTINGS - COMPREHENSIVE ANALYSIS');
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
  
  // Capture console logs and errors
  const consoleLogs = [];
  const errors = [];
  
  page.on('console', msg => {
    consoleLogs.push(`${msg.type()}: ${msg.text()}`);
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });
  
  try {
    // Login
    console.log('📍 Logging in...');
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    console.log('✅ Admin logged in');
    
    // Check for initial errors
    if (errors.length > 0) {
      console.log('\\n❌ ERRORS DETECTED DURING LOGIN:');
      errors.forEach(error => console.log(`   - ${error}`));
    }
    
    // Navigate to App Settings
    console.log('\\n📍 Navigating to App Settings...');
    await page.getByText('Content').first().click();
    await page.waitForTimeout(2000);
    await page.getByText('App Settings').first().click();
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: 'debug-1-app-settings-loaded.png', fullPage: true });
    
    // Check for loading state
    console.log('\\n🔍 CHECKING COMPONENT STATE...');
    
    const loadingSpinner = await page.locator('.animate-spin', { timeout: 2000 }).count().catch(() => 0);
    console.log(`⏳ Loading spinners: ${loadingSpinner}`);
    
    if (loadingSpinner > 0) {
      console.log('⚠️ Component is stuck in loading state - waiting longer...');
      await page.waitForTimeout(10000);
      
      const stillLoading = await page.locator('.animate-spin', { timeout: 2000 }).count().catch(() => 0);
      if (stillLoading > 0) {
        console.log('❌ CRITICAL: Component stuck in infinite loading');
      }
    }
    
    // Check if form is actually loaded
    const formElements = await page.locator('input, textarea').count();
    console.log(`📝 Form elements found: ${formElements}`);
    
    if (formElements === 0) {
      console.log('❌ CRITICAL: No form elements loaded - component not rendering');
      
      // Check if AppSettingsManager component is present
      const appSettingsText = await page.textContent('body');
      if (appSettingsText.includes('App Settings')) {
        console.log('ℹ️ "App Settings" text found but no form');
      } else {
        console.log('❌ "App Settings" component not found at all');
      }
    } else {
      console.log('✅ Form elements loaded successfully');
      
      // Debug save button visibility
      console.log('\\n🔍 DEBUGGING SAVE BUTTON RENDERING...');
      
      // Check all button elements
      const allButtons = await page.locator('button').count();
      console.log(`🔘 Total buttons found: ${allButtons}`);
      
      // Check Save icons specifically
      const saveIcons = await page.locator('[data-lucide="save"]').count();
      console.log(`💾 Save icons found: ${saveIcons}`);
      
      // Check if buttons are hidden with CSS
      const hiddenButtons = await page.locator('button[style*="display: none"], button[hidden]').count();
      console.log(`👻 Hidden buttons: ${hiddenButtons}`);
      
      // Test field interaction
      console.log('\\n🧪 TESTING FIELD INTERACTION...');
      
      const firstInput = page.locator('input').first();
      const originalValue = await firstInput.inputValue();
      console.log(`📝 Original value: "${originalValue}"`);
      
      // Change value
      await firstInput.clear();
      await firstInput.fill('DEBUG TEST VALUE');
      await page.waitForTimeout(2000);
      
      // Check if save button appeared
      const saveButtonsAfterChange = await page.locator('button:has([data-lucide="save"])').count();
      console.log(`💾 Save buttons after change: ${saveButtonsAfterChange}`);
      
      // Also check for any buttons with "save" text
      const saveTextButtons = await page.getByRole('button', { name: /save/i }).count();
      console.log(`💾 Save text buttons: ${saveTextButtons}`);
      
      if (saveButtonsAfterChange === 0 && saveTextButtons === 0) {
        console.log('❌ CRITICAL: No save buttons appeared after making changes');
        
        // Debug button states
        console.log('\\n🔍 DEBUGGING BUTTON STATES...');
        
        // Get all buttons and their properties
        const buttons = await page.locator('button').all();
        for (let i = 0; i < Math.min(buttons.length, 10); i++) {
          const button = buttons[i];
          const text = await button.textContent();
          const disabled = await button.isDisabled();
          const visible = await button.isVisible();
          console.log(`   Button ${i + 1}: text="${text}", disabled=${disabled}, visible=${visible}`);
        }
      } else {
        console.log('✅ Save button appeared successfully!');
        
        // Try to click it
        await page.locator('button:has([data-lucide="save"])').first().click();
        await page.waitForTimeout(3000);
        console.log('💾 Save button clicked');
      }
      
      await page.screenshot({ path: 'debug-2-after-changes.png', fullPage: true });
    }
    
    // Check for errors after interaction
    console.log('\\n🚨 ERROR ANALYSIS:');
    if (errors.length > 0) {
      console.log(`❌ Total errors found: ${errors.length}`);
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ No JavaScript errors detected');
    }
    
    // Check console logs for clues
    console.log('\\n📋 CONSOLE LOG ANALYSIS:');
    const relevantLogs = consoleLogs.filter(log => 
      log.toLowerCase().includes('settings') || 
      log.toLowerCase().includes('save') ||
      log.toLowerCase().includes('error') ||
      log.toLowerCase().includes('supabase')
    );
    
    if (relevantLogs.length > 0) {
      console.log('📄 Relevant console messages:');
      relevantLogs.forEach(log => console.log(`   - ${log}`));
    } else {
      console.log('ℹ️ No relevant console messages found');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'debug-3-final-state.png', fullPage: true });
    
    console.log('\\n⏱️ Keeping browser open for inspection...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'debug-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Debug Test Complete!');
  }
}

debugAppSettings().catch(console.error);