const { chromium } = require('playwright');

async function checkCurrentVideoSettings() {
  console.log('🎥 CHECKING CURRENT VIDEO SETTINGS');
  console.log('='.repeat(50));
  
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
    console.log('📍 Checking home page first...');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: 'video-check-1-homepage.png', fullPage: true });
    
    // Check if video element exists
    const videoElements = await page.locator('video').count();
    const sourceElements = await page.locator('video source').count();
    
    console.log(`🎬 Video elements found: ${videoElements}`);
    console.log(`📹 Video source elements: ${sourceElements}`);
    
    if (videoElements > 0) {
      const videoSrc = await page.locator('video source').getAttribute('src').catch(() => '');
      console.log(`🔗 Video source URL: "${videoSrc}"`);
      
      const videoVisible = await page.locator('video').isVisible();
      console.log(`👁️ Video visible: ${videoVisible}`);
    } else {
      console.log('❌ No video elements found on homepage');
    }
    
    // Check background images
    const bgElements = await page.locator('[style*="background-image"]').count();
    console.log(`🖼️ Background image elements: ${bgElements}`);
    
    if (bgElements > 0) {
      const bgStyle = await page.locator('[style*="background-image"]').first().getAttribute('style');
      console.log(`🎨 Background style: ${bgStyle?.substring(0, 100)}...`);
    }
    
    console.log('\\n📍 Now checking admin video settings...');
    
    // Login to admin
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Navigate to App Settings
    await page.getByText('Content').first().click();
    await page.waitForTimeout(1000);
    await page.getByText('App Settings').first().click();
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'video-check-2-admin-settings.png', fullPage: true });
    
    // Check current video-related settings
    console.log('\\n🔍 Checking current admin settings...');
    
    const allInputs = await page.locator('input, textarea, select').all();
    
    for (let i = 0; i < Math.min(allInputs.length, 15); i++) {
      const input = allInputs[i];
      const id = await input.getAttribute('id');
      const value = await input.inputValue().catch(() => '');
      const placeholder = await input.getAttribute('placeholder').catch(() => '');
      
      if (id && (id.includes('background') || id.includes('video') || id.includes('hero'))) {
        console.log(`⚙️ ${id}: "${value}" (placeholder: "${placeholder}")`);
      }
    }
    
    // Check if there's a video management section
    const mediaManagerCount = await page.getByText('Media Manager').count();
    console.log(`\\n📁 Media Manager sections found: ${mediaManagerCount}`);
    
    if (mediaManagerCount > 0) {
      console.log('📁 Checking Media Manager...');
      await page.getByText('Design').first().click();
      await page.waitForTimeout(1000);
      await page.getByText('Media Manager').first().click();
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: 'video-check-3-media-manager.png', fullPage: true });
      
      const fileInputs = await page.locator('input[type="file"]').count();
      const uploadButtons = await page.getByText('Upload', { exact: false }).count();
      
      console.log(`📤 File upload inputs: ${fileInputs}`);
      console.log(`📤 Upload buttons: ${uploadButtons}`);
    }
    
    console.log('\\n' + '='.repeat(50));
    console.log('🎯 VIDEO SETTINGS ANALYSIS');
    console.log('='.repeat(50));
    
    if (videoElements === 0) {
      console.log('\\n❌ ISSUE: No video elements on homepage');
      console.log('   Likely cause: background_type is set to "image"');
    }
    
    console.log('\\n📋 NEEDED ENHANCEMENTS:');
    console.log('1. Add background type toggle (image/video/youtube)');
    console.log('2. Add video URL input field');
    console.log('3. Add YouTube URL support');
    console.log('4. Add video control settings (autoplay, muted, loop)');
    console.log('5. Add video upload via Media Manager');
    console.log('6. Test video playback functionality');
    
    console.log('\\n⏱️ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'video-check-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Video Settings Check Complete!');
  }
}

checkCurrentVideoSettings().catch(console.error);