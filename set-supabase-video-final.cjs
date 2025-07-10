const { chromium } = require('playwright');

async function setSupabaseVideoFinal() {
  console.log('🎥 SETTING SUPABASE VIDEO - FINAL SOLUTION');
  console.log('Using enhanced Media & Background Manager');
  console.log('='.repeat(55));
  
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
    console.log('📍 Step 1: Login and Navigate to Admin');
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
    
    console.log('\n📍 Step 2: Go to Content > Media Manager');
    
    // Go to Content tab
    await page.getByText('Content').first().click();
    await page.waitForTimeout(2000);
    
    // Scroll to Media Manager
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Click Video Settings tab
    await page.getByText('Video Settings').click();
    await page.waitForTimeout(3000);
    
    console.log('✅ Opened Video Settings interface');
    
    console.log('\n📍 Step 3: Configure Your Supabase Video');
    
    // Your Supabase video URL (update this with your actual video filename)
    const yourSupabaseVideoUrl = 'https://iwmfxcrzzwpmxomydmuq.supabase.co/storage/v1/object/public/backgrounds/wedding-video.mp4';
    
    console.log(`Setting video URL: ${yourSupabaseVideoUrl}`);
    
    // Find the Video Background URL input
    const videoUrlInput = page.locator('input[placeholder*="supabase.co"]').first();
    await videoUrlInput.clear();
    await videoUrlInput.fill(yourSupabaseVideoUrl);
    await page.waitForTimeout(1000);
    
    // Click the "Set Video" button to configure background type
    await page.getByText('Set Video').click();
    await page.waitForTimeout(3000);
    
    console.log('✅ Set Supabase video URL and background type');
    
    await page.screenshot({ path: 'supabase-video-configured.png', fullPage: true });
    
    console.log('\n📍 Step 4: Test Video on Homepage');
    
    // Go to homepage
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8000); // Wait for video to load
    
    // Check if video is working
    const videoResult = await page.evaluate(() => {
      const videos = document.querySelectorAll('video');
      const iframes = document.querySelectorAll('iframe[src*="youtube"]');
      
      let videoInfo = null;
      if (videos.length > 0) {
        const video = videos[0];
        videoInfo = {
          src: video.src,
          autoplay: video.autoplay,
          muted: video.muted,
          paused: video.paused,
          isSupabase: video.src?.includes('supabase.co'),
          visible: video.offsetWidth > 0 && video.offsetHeight > 0
        };
      }
      
      return {
        videoCount: videos.length,
        youtubeCount: iframes.length,
        videoInfo
      };
    });
    
    await page.screenshot({ path: 'homepage-with-supabase-video.png', fullPage: true });
    
    console.log('\n🎬 FINAL RESULTS:');
    console.log('='.repeat(55));
    
    if (videoResult.videoInfo?.isSupabase) {
      console.log('\n🎉 SUCCESS! Your Supabase video is working!');
      console.log(`   ✅ Native video element detected`);
      console.log(`   ✅ Source: ${videoResult.videoInfo.src}`);
      console.log(`   ✅ Autoplay: ${videoResult.videoInfo.autoplay}`);
      console.log(`   ✅ Muted: ${videoResult.videoInfo.muted}`);
      console.log(`   ✅ Playing: ${!videoResult.videoInfo.paused ? 'Yes' : 'No'}`);
      console.log(`   ✅ Visible: ${videoResult.videoInfo.visible ? 'Yes' : 'No'}`);
    } else if (videoResult.videoCount > 0) {
      console.log('\n⚠️ Video found but not from Supabase');
      console.log(`   Video source: ${videoResult.videoInfo?.src}`);
      console.log('   Check your video URL in admin settings');
    } else if (videoResult.youtubeCount > 0) {
      console.log('\n⚠️ Still showing YouTube video');
      console.log('   The background type may not have been set correctly');
    } else {
      console.log('\n❌ No video found on homepage');
      console.log('   Check video configuration in admin panel');
    }
    
    console.log('\n📋 YOUR VIDEO CONFIGURATION:');
    console.log('1. Admin > Content > Media & Background Manager');
    console.log('2. Video Settings tab');
    console.log('3. Enter your Supabase URL in "Video Background URL" field');
    console.log('4. Click "Set Video" to apply background type');
    console.log('5. Check homepage for results');
    
    console.log('\n📁 Update your video URL to use your actual filename:');
    console.log('https://iwmfxcrzzwpmxomydmuq.supabase.co/storage/v1/object/public/backgrounds/YOUR-ACTUAL-VIDEO-FILE.mp4');
    
    console.log('\n⏱️ Keeping browser open for manual adjustments...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n🏁 Supabase Video Configuration Complete!');
    console.log('📸 Check screenshots for results');
  }
}

setSupabaseVideoFinal().catch(console.error);