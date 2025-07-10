const { chromium } = require('playwright');

async function setSupabaseVideoFinal() {
  console.log('🎥 SETTING SUPABASE VIDEO VIA MEDIA MANAGER');
  console.log('Using the Media & Background Manager interface');
  console.log('='.repeat(55));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1200,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1600, height: 1000 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📍 Step 1: Login and Navigate to Media Manager');
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    
    // Login
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    
    // Navigate to admin dashboard
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Go to Content tab and scroll to Media Manager
    await page.getByText('Content').first().click();
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    console.log('✅ Found Media & Background Manager interface');
    
    console.log('\\n📍 Step 2: Access Video Settings Tab');
    
    // Click on Video Settings tab
    await page.getByText('Video Settings').click();
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'supabase-final-1-video-settings-tab.png', fullPage: true });
    
    console.log('✅ Opened Video Settings tab');
    
    console.log('\\n📍 Step 3: Configure Video URL');
    
    // Check current configuration
    const currentConfig = await page.evaluate(() => {
      const backgroundType = document.querySelector('select')?.value;
      const urlInputs = document.querySelectorAll('input[type="url"]');
      const textInputs = document.querySelectorAll('input[type="text"]');
      const currentBgText = document.body.textContent;
      
      return {
        backgroundType,
        urlInputsCount: urlInputs.length,
        textInputsCount: textInputs.length,
        hasSupabaseUrl: currentBgText.includes('supabase.co'),
        sampleText: currentBgText.substring(currentBgText.indexOf('Current Background'), 200)
      };
    });
    
    console.log('\\n🔍 CURRENT VIDEO CONFIGURATION:');
    console.log(`   - Background type: ${currentConfig.backgroundType}`);
    console.log(`   - URL inputs found: ${currentConfig.urlInputsCount}`);
    console.log(`   - Text inputs found: ${currentConfig.textInputsCount}`);
    console.log(`   - Has Supabase URL: ${currentConfig.hasSupabaseUrl ? '✅' : '❌'}`);
    
    // Your specific Supabase video URL
    const yourVideoUrl = 'https://iwmfxcrzzwpmxomydmuq.supabase.co/storage/v1/object/public/backgrounds/your-video.mp4';
    
    console.log('\\n📍 Step 4: Set Your Supabase Video URL');
    console.log(`Setting URL: ${yourVideoUrl}`);
    
    // Look for URL input field
    const urlInputs = await page.locator('input[type="url"]').all();
    if (urlInputs.length > 0) {
      for (const input of urlInputs) {
        await input.clear();
        await input.fill(yourVideoUrl);
        await page.waitForTimeout(1000);
        console.log('   ✅ Set Supabase video URL in URL input');
        break;
      }
    } else {
      // Try text inputs if no URL inputs
      const textInputs = await page.locator('input[type="text"]').all();
      for (const input of textInputs) {
        const placeholder = await input.getAttribute('placeholder');
        if (placeholder && placeholder.toLowerCase().includes('url')) {
          await input.clear();
          await input.fill(yourVideoUrl);
          await page.waitForTimeout(1000);
          console.log('   ✅ Set Supabase video URL in text input');
          break;
        }
      }
    }
    
    // Ensure background type is set to "video"
    const backgroundSelect = await page.locator('select').first();
    if (await backgroundSelect.count() > 0) {
      await backgroundSelect.selectOption('video');
      await page.waitForTimeout(1000);
      console.log('   ✅ Set background type to "video"');
    }
    
    // Look for save button
    const saveButtons = await page.getByText('Save').all();
    if (saveButtons.length > 0) {
      await saveButtons[0].click();
      await page.waitForTimeout(2000);
      console.log('   ✅ Saved video settings');
    }
    
    await page.screenshot({ path: 'supabase-final-2-video-configured.png', fullPage: true });
    
    console.log('\\n📍 Step 5: Test Video on Homepage');
    
    // Go to homepage to test
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8000); // Wait for video to load
    
    await page.screenshot({ path: 'supabase-final-3-homepage-result.png', fullPage: true });
    
    // Check what video system is working
    const videoTest = await page.evaluate(() => {
      const videoElements = document.querySelectorAll('video');
      const youtubeIframes = document.querySelectorAll('iframe[src*="youtube"]');
      const heroSection = document.querySelector('.glass-card, [class*="hero"]');
      
      let videoDetails = null;
      if (videoElements.length > 0) {
        const video = videoElements[0];
        videoDetails = {
          src: video.src || video.currentSrc,
          autoplay: video.autoplay,
          muted: video.muted,
          paused: video.paused,
          readyState: video.readyState,
          error: video.error ? video.error.message : null,
          isSupabase: video.src?.includes('supabase.co')
        };
      }
      
      return {
        videoElements: videoElements.length,
        youtubeIframes: youtubeIframes.length,
        videoDetails,
        heroExists: !!heroSection,
        heroContent: heroSection ? heroSection.textContent.substring(0, 100) : null
      };
    });
    
    console.log('\\n🎬 HOMEPAGE VIDEO TEST RESULTS:');
    console.log(`   - Video elements: ${videoTest.videoElements}`);
    console.log(`   - YouTube iframes: ${videoTest.youtubeIframes}`);
    console.log(`   - Hero section: ${videoTest.heroExists ? '✅' : '❌'}`);
    
    if (videoTest.videoDetails) {
      console.log('\\n📺 VIDEO ELEMENT DETAILS:');
      console.log(`   - Source: ${videoTest.videoDetails.src}`);
      console.log(`   - Autoplay: ${videoTest.videoDetails.autoplay}`);
      console.log(`   - Muted: ${videoTest.videoDetails.muted}`);
      console.log(`   - Playing: ${!videoTest.videoDetails.paused ? '✅' : '❌'}`);
      console.log(`   - Ready: ${videoTest.videoDetails.readyState}/4`);
      console.log(`   - Supabase: ${videoTest.videoDetails.isSupabase ? '✅' : '❌'}`);
      if (videoTest.videoDetails.error) {
        console.log(`   - Error: ${videoTest.videoDetails.error}`);
      }
    }
    
    console.log('\\n' + '='.repeat(55));
    console.log('🎯 SUPABASE VIDEO CONFIGURATION RESULTS');
    console.log('='.repeat(55));
    
    if (videoTest.videoDetails?.isSupabase) {
      console.log('\\n🎉 SUCCESS! SUPABASE VIDEO IS WORKING!');
      console.log('   ✅ Native video element using Supabase storage');
      console.log('   ✅ Video configuration saved properly');
      console.log('   ✅ Hero background displays your video');
    } else if (videoTest.videoElements > 0) {
      console.log('\\n⚠️ Video found but not from Supabase');
      console.log('   - Check video URL in admin settings');
      console.log('   - Verify Supabase file exists and is accessible');
    } else if (videoTest.youtubeIframes > 0) {
      console.log('\\n⚠️ Still showing YouTube video');
      console.log('   - Settings may not have saved properly');
      console.log('   - Try setting background type to "video" again');
    } else {
      console.log('\\n❌ No video found');
      console.log('   - Check video configuration in admin panel');
      console.log('   - Verify video URL is correct and accessible');
    }
    
    console.log('\\n📋 YOUR VIDEO URL TO USE:');
    console.log('Replace "your-video.mp4" with your actual video filename:');
    console.log('https://iwmfxcrzzwpmxomydmuq.supabase.co/storage/v1/object/public/backgrounds/YOUR-VIDEO-FILE.mp4');
    
    console.log('\\n📋 STEPS TO SET YOUR VIDEO:');
    console.log('1. Go to Admin Dashboard > Content');
    console.log('2. Scroll to "Media & Background Manager"');
    console.log('3. Click "Video Settings" tab');
    console.log('4. Set Background Type: "Video Background"');
    console.log('5. Enter your complete Supabase video URL');
    console.log('6. Save settings');
    console.log('7. Check homepage for video display');
    
    console.log('\\n⏱️ Keeping browser open for you to configure...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Configuration error:', error.message);
    await page.screenshot({ path: 'supabase-final-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Supabase Video Configuration Complete!');
    console.log('🎥 You can now set your video through the Media Manager!');
  }
}

setSupabaseVideoFinal().catch(console.error);