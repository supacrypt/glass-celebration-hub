const { chromium } = require('playwright');

async function testSupabaseVideoFix() {
  console.log('🎥 TESTING SUPABASE VIDEO CONFIGURATION');
  console.log('Setting video type and Supabase storage URL through admin');
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
    
    console.log('\\n📍 Step 2: Configure Video Settings');
    
    // Go to Content > App Settings  
    await page.getByText('Content').first().click();
    await page.waitForTimeout(1000);
    await page.getByText('App Settings').first().click();
    await page.waitForTimeout(3000);
    
    // Scroll to video settings area
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'supabase-video-1-admin-settings.png', fullPage: true });
    
    // Look for video configuration options
    const videoSettings = await page.evaluate(() => {
      const selects = document.querySelectorAll('select');
      const urlInputs = document.querySelectorAll('input[type="url"]');
      const allInputs = document.querySelectorAll('input');
      
      let typeSelect = null;
      let urlInput = null;
      
      // Find background type selector
      selects.forEach(select => {
        const options = Array.from(select.options).map(opt => opt.value);
        if (options.includes('video') || options.includes('youtube')) {
          typeSelect = {
            found: true,
            currentValue: select.value,
            options: options
          };
        }
      });
      
      // Find video URL input
      urlInputs.forEach(input => {
        const placeholder = input.getAttribute('placeholder') || '';
        const label = input.previousElementSibling?.textContent || '';
        if (placeholder.toLowerCase().includes('video') || 
            placeholder.toLowerCase().includes('url') ||
            label.toLowerCase().includes('video')) {
          urlInput = {
            found: true,
            currentValue: input.value,
            placeholder: placeholder
          };
        }
      });
      
      return {
        typeSelect,
        urlInput,
        totalSelects: selects.length,
        totalUrlInputs: urlInputs.length,
        totalInputs: allInputs.length
      };
    });
    
    console.log('\\n🔍 VIDEO SETTINGS ANALYSIS:');
    console.log(`   - Type selector found: ${videoSettings.typeSelect?.found ? '✅' : '❌'}`);
    console.log(`   - URL input found: ${videoSettings.urlInput?.found ? '✅' : '❌'}`);
    if (videoSettings.typeSelect?.found) {
      console.log(`   - Current type: ${videoSettings.typeSelect.currentValue}`);
      console.log(`   - Available options: ${videoSettings.typeSelect.options.join(', ')}`);
    }
    if (videoSettings.urlInput?.found) {
      console.log(`   - Current URL: ${videoSettings.urlInput.currentValue}`);
      console.log(`   - Placeholder: ${videoSettings.urlInput.placeholder}`);
    }
    
    console.log('\\n📍 Step 3: Set Video Type to "video" and Supabase URL');
    
    // Try to set background type to "video"
    const typeSelects = await page.locator('select').all();
    for (const select of typeSelects) {
      const options = await select.locator('option').allTextContents();
      if (options.some(opt => opt.toLowerCase().includes('video'))) {
        await select.selectOption('video');
        await page.waitForTimeout(1000);
        console.log('   ✅ Set background type to "video"');
        break;
      }
    }
    
    // Try to set the Supabase video URL
    const urlInputs = await page.locator('input[type="url"]').all();
    const supabaseVideoUrl = 'https://iwmfxcrzzwpmxomydmuq.supabase.co/storage/v1/object/public/backgrounds/wedding-video.mp4';
    
    for (const input of urlInputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder && (placeholder.includes('video') || placeholder.includes('http'))) {
        await input.clear();
        await input.fill(supabaseVideoUrl);
        await page.waitForTimeout(1000);
        console.log('   ✅ Set Supabase video URL');
        
        // Try to save this setting
        const saveButton = await input.locator('xpath=../following-sibling::button[contains(text(), "Save")]').first();
        if (await saveButton.count() > 0 && await saveButton.isEnabled()) {
          await saveButton.click();
          await page.waitForTimeout(2000);
          console.log('   ✅ Saved video URL setting');
        }
        break;
      }
    }
    
    await page.screenshot({ path: 'supabase-video-2-settings-configured.png', fullPage: true });
    
    console.log('\\n📍 Step 4: Test Homepage with Supabase Video');
    
    // Go to homepage to test the video
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8000); // Extra time for video loading
    
    await page.screenshot({ path: 'supabase-video-3-homepage-test.png', fullPage: true });
    
    // Analyze what video system is being used
    const videoAnalysis = await page.evaluate(() => {
      const youtubeIframes = document.querySelectorAll('iframe[src*="youtube"]');
      const videoElements = document.querySelectorAll('video');
      const allIframes = document.querySelectorAll('iframe');
      
      let videoDetails = [];
      videoElements.forEach((video, index) => {
        videoDetails.push({
          index,
          src: video.src || video.currentSrc,
          autoplay: video.autoplay,
          muted: video.muted,
          loop: video.loop,
          paused: video.paused,
          readyState: video.readyState,
          networkState: video.networkState,
          error: video.error ? video.error.message : null,
          visible: video.offsetHeight > 0 && video.offsetWidth > 0,
          isSupabase: video.src?.includes('supabase.co')
        });
      });
      
      return {
        youtubeIframes: youtubeIframes.length,
        videoElements: videoElements.length,
        totalIframes: allIframes.length,
        videoDetails,
        hasSupabaseVideo: videoDetails.some(v => v.isSupabase)
      };
    });
    
    console.log('\\n🎬 HOMEPAGE VIDEO ANALYSIS:');
    console.log(`   - YouTube iframes: ${videoAnalysis.youtubeIframes}`);
    console.log(`   - Native video elements: ${videoAnalysis.videoElements}`);
    console.log(`   - Supabase video detected: ${videoAnalysis.hasSupabaseVideo ? '✅' : '❌'}`);
    
    if (videoAnalysis.videoDetails.length > 0) {
      console.log('\\n📺 VIDEO ELEMENT DETAILS:');
      videoAnalysis.videoDetails.forEach((video, i) => {
        console.log(`   Video ${i + 1}:`);
        console.log(`     - Source: ${video.src}`);
        console.log(`     - Autoplay: ${video.autoplay}`);
        console.log(`     - Muted: ${video.muted}`);
        console.log(`     - Loop: ${video.loop}`);
        console.log(`     - Playing: ${!video.paused ? '✅' : '❌'}`);
        console.log(`     - Ready state: ${video.readyState}/4`);
        console.log(`     - Visible: ${video.visible ? '✅' : '❌'}`);
        console.log(`     - Supabase: ${video.isSupabase ? '✅' : '❌'}`);
        if (video.error) {
          console.log(`     - Error: ${video.error}`);
        }
      });
    }
    
    console.log('\\n' + '='.repeat(60));
    console.log('🎯 SUPABASE VIDEO CONFIGURATION RESULTS');
    console.log('='.repeat(60));
    
    if (videoAnalysis.hasSupabaseVideo) {
      console.log('\\n🎉 SUCCESS! Supabase video is working!');
      console.log('   ✅ Native video element detected');
      console.log('   ✅ Supabase storage URL being used');
      console.log('   ✅ Video configuration working properly');
    } else if (videoAnalysis.youtubeIframes > 0) {
      console.log('\\n⚠️ Still using YouTube video');
      console.log('   - Settings may not have saved properly');
      console.log('   - Try refreshing admin settings');
      console.log('   - Check if background type is set to "video"');
    } else if (videoAnalysis.videoElements > 0) {
      console.log('\\n⚠️ Video element found but not Supabase');
      console.log('   - Check video URL configuration');
      console.log('   - Verify Supabase storage permissions');
    } else {
      console.log('\\n❌ No video elements found');
      console.log('   - Video configuration may need adjustment');
      console.log('   - Check admin settings save functionality');
    }
    
    console.log('\\n📋 NEXT STEPS:');
    console.log('1. Verify background type is set to "video" (not YouTube)');
    console.log('2. Ensure Supabase video URL is properly saved');
    console.log('3. Check that video file is accessible from Supabase storage');
    console.log('4. Try hard refresh (Ctrl+F5) to clear any cached settings');
    
    console.log('\\n⏱️ Keeping browser open for review...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'supabase-video-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Supabase Video Configuration Test Complete!');
    console.log('📸 Check screenshots for detailed analysis');
  }
}

testSupabaseVideoFix().catch(console.error);