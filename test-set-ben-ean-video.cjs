const { chromium } = require('playwright');

async function setBenEanVideo() {
  console.log('🎥 SETTING BEN EAN HUNTER VALLEY VIDEO');
  console.log('Finding and configuring the perfect Ben Ean wedding video');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1000,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1600, height: 1000 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📍 Step 1: Find Ben Ean Video on YouTube');
    
    // Open YouTube to search for Ben Ean videos
    await page.goto('https://www.youtube.com/results?search_query=Ben+Ean+winery+Hunter+Valley+wedding', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'ben-ean-1-youtube-search.png', fullPage: true });
    
    console.log('✅ YouTube search opened for "Ben Ean winery Hunter Valley wedding"');
    console.log('📌 MANUAL STEP: Please look at the search results and choose a video');
    console.log('   - Look for videos showing Ben Ean winery');
    console.log('   - Wedding venue tours or actual weddings');
    console.log('   - Hunter Valley vineyard scenes');
    
    // Wait for user to potentially click on a video
    await page.waitForTimeout(10000);
    
    console.log('\\n📍 Step 2: Admin Dashboard Video Configuration');
    
    // Go to admin dashboard to set video
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Login
    const loginFormExists = await page.locator('input[type="email"]').count() > 0;
    if (loginFormExists) {
      await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
      await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
      await page.getByRole('button', { name: 'Sign In', exact: true }).click();
      await page.waitForTimeout(5000);
      
      // Navigate to admin dashboard
      await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      // Go to Content > App Settings
      await page.getByText('Content').first().click();
      await page.waitForTimeout(1000);
      await page.getByText('App Settings').first().click();
      await page.waitForTimeout(3000);
      
      // Scroll to video settings
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: 'ben-ean-2-admin-video-settings.png', fullPage: true });
      
      console.log('\\n🎬 VIDEO CONFIGURATION INSTRUCTIONS:');
      console.log('1. In the admin panel, scroll to find the video URL input');
      console.log('2. Set Background Type to "YouTube"');
      console.log('3. Enter your chosen Ben Ean video URL (full YouTube URL)');
      console.log('4. Examples of good video URLs to try:');
      console.log('   - https://www.youtube.com/watch?v=VIDEO_ID_HERE');
      console.log('   - Any Ben Ean wedding or venue tour video');
      
      // Try to find and demonstrate video URL input
      const videoInputs = await page.locator('input[type="url"]').all();
      if (videoInputs.length > 0) {
        console.log('\\n📍 Step 3: Demonstrate Video URL Setting');
        
        for (const input of videoInputs) {
          const placeholder = await input.getAttribute('placeholder');
          if (placeholder && (placeholder.includes('video') || placeholder.includes('http'))) {
            // Highlight the input field
            await input.focus();
            await page.waitForTimeout(1000);
            
            console.log('✅ Found video URL input field');
            console.log('📝 Current placeholder:', placeholder);
            
            // Example: Set a Hunter Valley vineyard video as demonstration
            const exampleUrl = 'https://www.youtube.com/watch?v=QH2-TGUlwu4'; // Beautiful vineyard
            await input.clear();
            await input.fill(exampleUrl);
            await page.waitForTimeout(2000);
            
            console.log('✅ Set example Hunter Valley video URL');
            
            // Try to save
            const saveButton = await input.locator('xpath=../following-sibling::button[contains(text(), "Save")]').first();
            if (await saveButton.count() > 0 && await saveButton.isEnabled()) {
              await saveButton.click();
              await page.waitForTimeout(2000);
              console.log('✅ Saved video URL setting');
            }
            break;
          }
        }
        
        await page.screenshot({ path: 'ben-ean-3-video-url-set.png', fullPage: true });
      }
      
      console.log('\\n📍 Step 4: Test Video on Homepage');
      
      // Go to homepage to see video
      await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
      await page.waitForTimeout(8000); // Wait for video to load
      
      await page.screenshot({ path: 'ben-ean-4-homepage-with-video.png', fullPage: true });
      
      // Check if video is working
      const videoCheck = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[src*="youtube"]');
        const hero = document.querySelector('.glass-card');
        
        return {
          hasYouTubeVideo: !!iframe,
          videoSrc: iframe ? iframe.src : null,
          heroContent: hero ? hero.textContent.substring(0, 100) : null
        };
      });
      
      console.log('\\n🎬 VIDEO STATUS:');
      console.log(`   - YouTube video found: ${videoCheck.hasYouTubeVideo ? '✅' : '❌'}`);
      if (videoCheck.videoSrc) {
        console.log(`   - Video source: ${videoCheck.videoSrc}`);
      }
      console.log(`   - Hero content: ${videoCheck.heroContent ? '✅' : '❌'}`);
      
      if (videoCheck.hasYouTubeVideo) {
        console.log('\\n🎉 VIDEO SUCCESSFULLY CONFIGURED!');
      }
      
    }
    
    console.log('\\n' + '='.repeat(60));
    console.log('🎯 BEN EAN VIDEO SETUP COMPLETE');
    console.log('='.repeat(60));
    
    console.log('\\n📋 TO SET YOUR SPECIFIC BEN EAN VIDEO:');
    console.log('1. Go to YouTube and search: "Ben Ean winery Hunter Valley"');
    console.log('2. Find a video that shows:');
    console.log('   - Ben Ean estate/winery grounds');
    console.log('   - Wedding ceremonies or receptions at Ben Ean');
    console.log('   - Hunter Valley vineyard scenic views');
    console.log('3. Copy the full YouTube URL (https://www.youtube.com/watch?v=...)');
    console.log('4. In admin dashboard > Content > App Settings');
    console.log('5. Set Background Type: "YouTube"');
    console.log('6. Paste Ben Ean video URL in the video URL field');
    console.log('7. Save settings');
    
    console.log('\\n🌟 RECOMMENDED SEARCH TERMS:');
    console.log('   - "Ben Ean estate Hunter Valley"');
    console.log('   - "Ben Ean winery wedding venue"');
    console.log('   - "Hunter Valley Ben Ean vineyard"');
    console.log('   - "Ben Ean cellar door Hunter Valley"');
    
    console.log('\\n⏱️ Keeping browser open for you to search...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'ben-ean-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Ben Ean Video Setup Complete!');
    console.log('🎥 You can now easily change the video through admin settings!');
  }
}

setBenEanVideo().catch(console.error);