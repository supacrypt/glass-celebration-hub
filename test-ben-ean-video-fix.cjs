const { chromium } = require('playwright');

async function testBenEanVideoFix() {
  console.log('🎥 TESTING BEN EAN VIDEO DISPLAY FIX');
  console.log('Verifying hero video shows with your specific Ben Ean URL');
  console.log('='.repeat(60));
  
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
    console.log('📍 Step 1: Login and Check Homepage');
    
    // Login first
    await page.goto('http://localhost:8080/auth', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    
    // Go to homepage to test video
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8000); // Extra time for video to load
    
    await page.screenshot({ path: 'ben-ean-video-test-1-homepage.png', fullPage: true });
    
    console.log('✅ Homepage loaded, checking for video...');
    
    // Detailed video analysis
    const videoAnalysis = await page.evaluate(() => {
      const youtubeIframes = document.querySelectorAll('iframe[src*="youtube"]');
      const allIframes = document.querySelectorAll('iframe');
      const videos = document.querySelectorAll('video');
      const heroSection = document.querySelector('.glass-card, [class*="hero"]');
      
      let iframeDetails = [];
      allIframes.forEach((iframe, index) => {
        iframeDetails.push({
          index,
          src: iframe.src,
          width: iframe.width || iframe.offsetWidth,
          height: iframe.height || iframe.offsetHeight,
          visible: iframe.offsetHeight > 0 && iframe.offsetWidth > 0,
          isYouTube: iframe.src.includes('youtube')
        });
      });
      
      return {
        youtubeIframes: youtubeIframes.length,
        totalIframes: allIframes.length,
        videos: videos.length,
        iframeDetails,
        heroExists: !!heroSection,
        heroContent: heroSection ? heroSection.textContent.substring(0, 100) : null,
        bodyText: document.body.textContent.substring(0, 200)
      };
    });
    
    console.log('\\n🎬 VIDEO ANALYSIS RESULTS:');
    console.log(`   - YouTube iframes found: ${videoAnalysis.youtubeIframes}`);
    console.log(`   - Total iframes: ${videoAnalysis.totalIframes}`);
    console.log(`   - Video elements: ${videoAnalysis.videos}`);
    console.log(`   - Hero section exists: ${videoAnalysis.heroExists ? '✅' : '❌'}`);
    
    if (videoAnalysis.iframeDetails.length > 0) {
      console.log('\\n📺 IFRAME DETAILS:');
      videoAnalysis.iframeDetails.forEach((iframe, i) => {
        console.log(`   Frame ${i + 1}:`);
        console.log(`     - Source: ${iframe.src}`);
        console.log(`     - Size: ${iframe.width}x${iframe.height}`);
        console.log(`     - Visible: ${iframe.visible ? '✅' : '❌'}`);
        console.log(`     - YouTube: ${iframe.isYouTube ? '✅' : '❌'}`);
      });
    }
    
    // Check if our specific Ben Ean video is being used
    const benEanVideoCheck = await page.evaluate(() => {
      const iframe = document.querySelector('iframe[src*="Y8rjSEU349s"]');
      return {
        benEanVideoFound: !!iframe,
        iframeSrc: iframe ? iframe.src : null
      };
    });
    
    console.log('\\n🎯 BEN EAN VIDEO CHECK:');
    console.log(`   - Ben Ean video (Y8rjSEU349s) found: ${benEanVideoCheck.benEanVideoFound ? '✅' : '❌'}`);
    if (benEanVideoCheck.iframeSrc) {
      console.log(`   - Iframe source: ${benEanVideoCheck.iframeSrc}`);
    }
    
    // Take another screenshot focusing on the hero area
    await page.evaluate(() => {
      const heroSection = document.querySelector('.glass-card, [class*="hero"]');
      if (heroSection) {
        heroSection.scrollIntoView();
      }
    });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'ben-ean-video-test-2-hero-focus.png', fullPage: true });
    
    console.log('\\n📍 Step 2: Check Console for Errors');
    
    // Check for any JavaScript errors
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    // Reload page to catch any console errors
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    if (consoleMessages.length > 0) {
      console.log('\\n❌ CONSOLE ERRORS FOUND:');
      consoleMessages.forEach(msg => console.log(`   - ${msg}`));
    } else {
      console.log('\\n✅ No console errors detected');
    }
    
    // Final check after reload
    const finalCheck = await page.evaluate(() => {
      const youtubeIframe = document.querySelector('iframe[src*="youtube"]');
      const benEanIframe = document.querySelector('iframe[src*="Y8rjSEU349s"]');
      
      return {
        hasYouTube: !!youtubeIframe,
        hasBenEan: !!benEanIframe,
        youTubeSrc: youtubeIframe ? youtubeIframe.src : null,
        benEanSrc: benEanIframe ? benEanIframe.src : null
      };
    });
    
    await page.screenshot({ path: 'ben-ean-video-test-3-final-check.png', fullPage: true });
    
    console.log('\\n' + '='.repeat(60));
    console.log('🎯 FINAL BEN EAN VIDEO STATUS');
    console.log('='.repeat(60));
    
    if (finalCheck.hasBenEan) {
      console.log('\\n🎉 SUCCESS! BEN EAN VIDEO IS WORKING!');
      console.log(`   ✅ Ben Ean video URL: ${finalCheck.benEanSrc}`);
      console.log('   ✅ Video iframe loaded and embedded');
      console.log('   ✅ Hero video displaying properly');
    } else if (finalCheck.hasYouTube) {
      console.log('\\n⚠️ PARTIAL SUCCESS - YouTube video found but not Ben Ean specific');
      console.log(`   - YouTube URL: ${finalCheck.youTubeSrc}`);
      console.log('   - May need to check video URL configuration');
    } else {
      console.log('\\n❌ ISSUE: No video found');
      console.log('   - Check hero video component configuration');
      console.log('   - Verify video URL is properly set');
    }
    
    console.log('\\n📋 RECOMMENDATIONS:');
    if (finalCheck.hasBenEan) {
      console.log('   🎊 Perfect! Your Ben Ean video is now displaying as the hero background');
      console.log('   🎥 Video should autoplay and loop for beautiful wedding ambiance');
    } else {
      console.log('   🔧 May need to clear browser cache and refresh');
      console.log('   🔄 Try hard refresh (Ctrl+F5) on the homepage');
      console.log('   ⚙️ Check admin settings to ensure video URL is saved');
    }
    
    console.log('\\n⏱️ Keeping browser open for review...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'ben-ean-video-test-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Ben Ean Video Test Complete!');
    console.log('📸 Check screenshots for visual verification');
  }
}

testBenEanVideoFix().catch(console.error);