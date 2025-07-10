const { chromium } = require('playwright');

async function quickVideoFontsFix() {
  console.log('⚡ QUICK VIDEO & FONTS FIX TEST');
  console.log('Testing forced video URL and HTML rendering');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 600,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1400, height: 900 }
  });
  
  const page = await context.newPage();
  
  // Capture video-related console logs
  page.on('console', msg => {
    if (msg.text().includes('Video') || msg.text().includes('HeroBackground')) {
      console.log(`🔍 ${msg.type()}: ${msg.text()}`);
    }
  });
  
  try {
    console.log('📍 Step 1: Test Homepage with Fixed Video URL');
    
    // Go directly to homepage (skip admin for now)
    await page.goto('http://localhost:8080/auth', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Quick login
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(3000);
    
    // Go to homepage
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8000); // Wait for video to load
    
    await page.screenshot({ path: 'quick-fix-1-homepage.png', fullPage: true });
    
    // Quick analysis
    const results = await page.evaluate(() => {
      const videos = document.querySelectorAll('video');
      const hero = document.querySelector('.glass-card, [class*="hero"]');
      
      let videoInfo = null;
      if (videos.length > 0) {
        const video = videos[0];
        videoInfo = {
          count: videos.length,
          src: video.src || video.currentSrc,
          playing: !video.paused && video.currentTime > 0,
          readyState: video.readyState,
          networkState: video.networkState,
          error: video.error,
          autoplay: video.autoplay,
          muted: video.muted,
          loop: video.loop
        };
      }
      
      let heroInfo = null;
      if (hero) {
        heroInfo = {
          content: hero.textContent.substring(0, 150),
          innerHTML: hero.innerHTML.substring(0, 200),
          hasHTML: hero.innerHTML.includes('<'),
          fontFamily: window.getComputedStyle(hero.querySelector('div') || hero).fontFamily
        };
      }
      
      return { video: videoInfo, hero: heroInfo };
    });
    
    console.log('\\n🎥 VIDEO STATUS:');
    if (results.video) {
      console.log(`   - Videos found: ${results.video.count}`);
      console.log(`   - Video source: ${results.video.src}`);
      console.log(`   - Is playing: ${results.video.playing ? '✅' : '❌'}`);
      console.log(`   - Ready state: ${results.video.readyState}/4`);
      console.log(`   - Autoplay: ${results.video.autoplay}`);
      console.log(`   - Muted: ${results.video.muted}`);
      console.log(`   - Error: ${results.video.error || 'None'}`);
      
      if (results.video.playing) {
        console.log('   🎉 VIDEO IS WORKING!');
      } else if (results.video.count > 0 && results.video.readyState === 4) {
        console.log('   ⚠️ Video loaded but not playing (may need user interaction)');
      } else if (results.video.src.includes('learningcontainer')) {
        console.log('   ✅ Using fixed video URL');
      }
    } else {
      console.log('   ❌ No video found');
    }
    
    console.log('\\n📝 CONTENT STATUS:');
    if (results.hero) {
      console.log(`   - Hero found: ✅`);
      console.log(`   - Contains HTML: ${results.hero.hasHTML ? '✅' : '❌'}`);
      console.log(`   - Font: ${results.hero.fontFamily}`);
      console.log(`   - Content: "${results.hero.content}"`);
      console.log(`   - HTML snippet: "${results.hero.innerHTML}"`);
      
      if (results.hero.content.includes('💕')) {
        console.log('   ✅ Wedding content with emojis displayed');
      }
    } else {
      console.log('   ❌ No hero content found');
    }
    
    console.log('\\n='.repeat(50));
    console.log('🎯 QUICK FIX RESULTS:');
    
    const videoWorking = results.video && (results.video.playing || results.video.readyState === 4);
    const contentWorking = results.hero && results.hero.content.includes('💕');
    
    if (videoWorking && contentWorking) {
      console.log('✅ BOTH VIDEO AND CONTENT ARE WORKING!');
    } else if (videoWorking) {
      console.log('✅ Video fixed, ❌ Content needs work');
    } else if (contentWorking) {
      console.log('❌ Video needs work, ✅ Content working');
    } else {
      console.log('❌ Both video and content need fixes');
    }
    
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'quick-fix-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Quick fix test complete!');
  }
}

quickVideoFontsFix().catch(console.error);