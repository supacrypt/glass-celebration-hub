const { chromium } = require('playwright');

async function findVideoSettings() {
  console.log('🔍 FINDING VIDEO CONFIGURATION INTERFACE');
  console.log('Locating where video settings are configured');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 800,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1600, height: 1000 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📍 Step 1: Login to Admin Dashboard');
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    
    // Login
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    
    // Navigate to admin dashboard
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    console.log('✅ Logged into admin dashboard');
    
    console.log('\\n📍 Step 2: Check Design Tab for Video Settings');
    
    // Try Design tab first
    await page.getByText('Design').first().click();
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'video-settings-1-design-tab.png', fullPage: true });
    
    // Look for video-related elements
    let videoElements = await page.evaluate(() => {
      const text = document.body.textContent.toLowerCase();
      const hasVideo = text.includes('video') || text.includes('background') || text.includes('hero');
      const selects = document.querySelectorAll('select');
      const inputs = document.querySelectorAll('input');
      
      return {
        hasVideoText: hasVideo,
        selectCount: selects.length,
        inputCount: inputs.length,
        sampleText: document.body.textContent.substring(0, 300)
      };
    });
    
    console.log(`   - Design tab has video text: ${videoElements.hasVideoText ? '✅' : '❌'}`);
    console.log(`   - Selects found: ${videoElements.selectCount}`);
    console.log(`   - Inputs found: ${videoElements.inputCount}`);
    
    console.log('\\n📍 Step 3: Check Content Tab Areas');
    
    await page.getByText('Content').first().click();
    await page.waitForTimeout(2000);
    
    // Check if there are sub-tabs in Content
    const contentSubTabs = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.map(btn => btn.textContent?.trim()).filter(text => 
        text && text.length > 0 && text.length < 50
      );
    });
    
    console.log('   - Content area options:', contentSubTabs.slice(0, 10));
    
    // Try to find "Unified Media Manager" or similar
    const mediaButtons = contentSubTabs.filter(text => 
      text.toLowerCase().includes('media') || 
      text.toLowerCase().includes('background') ||
      text.toLowerCase().includes('video')
    );
    
    if (mediaButtons.length > 0) {
      console.log(`   - Found media-related buttons: ${mediaButtons.join(', ')}`);
      
      // Try clicking on media-related button
      try {
        await page.getByText(mediaButtons[0]).first().click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'video-settings-2-media-section.png', fullPage: true });
      } catch (e) {
        console.log('   - Could not click media button');
      }
    }
    
    console.log('\\n📍 Step 4: Check for UnifiedMediaManager Component');
    
    // Scroll down to find the UnifiedMediaManager
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'video-settings-3-bottom-content.png', fullPage: true });
    
    // Look for video configuration interface
    const videoConfigElements = await page.evaluate(() => {
      const text = document.body.textContent;
      const hasVideoConfig = text.includes('Video Settings') || 
                            text.includes('Background Type') || 
                            text.includes('YouTube') ||
                            text.includes('video URL') ||
                            text.includes('Upload');
      
      const selects = document.querySelectorAll('select');
      const urlInputs = document.querySelectorAll('input[type="url"]');
      const fileInputs = document.querySelectorAll('input[type="file"]');
      const tabs = document.querySelectorAll('[role="tab"], .tab, button[class*="tab"]');
      
      let selectOptions = [];
      selects.forEach(select => {
        const options = Array.from(select.options).map(opt => opt.value);
        if (options.includes('video') || options.includes('youtube')) {
          selectOptions.push(options);
        }
      });
      
      return {
        hasVideoConfigText: hasVideoConfig,
        selectsWithVideo: selectOptions.length,
        urlInputs: urlInputs.length,
        fileInputs: fileInputs.length,
        tabs: Array.from(tabs).map(tab => tab.textContent?.trim()).filter(Boolean),
        sampleText: text.substring(0, 500)
      };
    });
    
    console.log('\\n🎬 VIDEO CONFIGURATION ANALYSIS:');
    console.log(`   - Has video config text: ${videoConfigElements.hasVideoConfigText ? '✅' : '❌'}`);
    console.log(`   - Selects with video options: ${videoConfigElements.selectsWithVideo}`);
    console.log(`   - URL inputs: ${videoConfigElements.urlInputs}`);
    console.log(`   - File inputs: ${videoConfigElements.fileInputs}`);
    console.log(`   - Tabs found: ${videoConfigElements.tabs.join(', ')}`);
    
    console.log('\\n📍 Step 5: Check if Unified Media Manager Exists');
    
    // Look for tabs or sections that might contain video settings
    const videoTabs = videoConfigElements.tabs.filter(tab => 
      tab.toLowerCase().includes('video') ||
      tab.toLowerCase().includes('upload') ||
      tab.toLowerCase().includes('media') ||
      tab.toLowerCase().includes('background')
    );
    
    if (videoTabs.length > 0) {
      console.log(`   - Found video-related tabs: ${videoTabs.join(', ')}`);
      
      // Try clicking on first video-related tab
      try {
        await page.getByText(videoTabs[0]).first().click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'video-settings-4-video-tab.png', fullPage: true });
        console.log(`   ✅ Clicked on "${videoTabs[0]}" tab`);
      } catch (e) {
        console.log(`   - Could not click on "${videoTabs[0]}" tab`);
      }
    }
    
    console.log('\\n' + '='.repeat(50));
    console.log('🎯 VIDEO SETTINGS LOCATION RESULTS');
    console.log('='.repeat(50));
    
    if (videoConfigElements.hasVideoConfigText && videoConfigElements.selectsWithVideo > 0) {
      console.log('\\n🎉 VIDEO SETTINGS FOUND!');
      console.log('   ✅ Video configuration interface detected');
      console.log('   ✅ Background type selector available');
      console.log('   ✅ Ready for video URL configuration');
    } else if (videoConfigElements.urlInputs > 0 || videoConfigElements.fileInputs > 0) {
      console.log('\\n⚠️ PARTIAL VIDEO INTERFACE FOUND');
      console.log('   - Found input fields for media');
      console.log('   - May need to set up video type selector');
    } else {
      console.log('\\n❌ VIDEO SETTINGS NOT FOUND');
      console.log('   - UnifiedMediaManager may not be properly integrated');
      console.log('   - Need to add video configuration interface');
    }
    
    console.log('\\n📋 RECOMMENDATIONS:');
    if (!videoConfigElements.hasVideoConfigText) {
      console.log('1. Add video settings to UnifiedMediaManager component');
      console.log('2. Ensure background type selector includes video/youtube options');
      console.log('3. Add video URL input field with proper saving');
      console.log('4. Test video configuration saves to database');
    } else {
      console.log('1. Use the video settings interface found');
      console.log('2. Set background type to "video"');
      console.log('3. Enter your Supabase video URL');
      console.log('4. Save and test on homepage');
    }
    
    console.log('\\n⏱️ Keeping browser open for investigation...');
    await page.waitForTimeout(20000);
    
  } catch (error) {
    console.error('❌ Search error:', error.message);
    await page.screenshot({ path: 'video-settings-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Video Settings Search Complete!');
  }
}

findVideoSettings().catch(console.error);