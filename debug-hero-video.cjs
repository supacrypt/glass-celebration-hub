const { chromium } = require('playwright');

async function debugHeroVideo() {
  console.log('🔍 DEBUG HERO VIDEO ISSUE');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all console logs and errors
  page.on('console', msg => {
    console.log(`CONSOLE ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  try {
    // First login
    await page.goto('http://localhost:8080/auth', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check if login form exists
    const hasLoginForm = await page.locator('input[type="email"]').count() > 0;
    
    if (hasLoginForm) {
      console.log('🔐 Logging in...');
      await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
      await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
      await page.getByRole('button', { name: 'Sign In', exact: true }).click();
      await page.waitForTimeout(3000);
    }
    
    // Now go to homepage
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    // Check what's actually in the DOM
    const heroElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const hero = document.querySelector('[class*="hero"], .glass-card');
      const videos = document.querySelectorAll('video');
      const iframes = document.querySelectorAll('iframe');
      const backgroundDivs = document.querySelectorAll('[style*="background"]');
      const bodyContent = document.body.innerHTML.substring(0, 500);
      
      return {
        heroFound: !!hero,
        videoCount: videos.length,
        iframeCount: iframes.length,
        backgroundDivCount: backgroundDivs.length,
        heroContent: hero ? hero.textContent.substring(0, 100) : null,
        videoSrcs: Array.from(videos).map(v => v.src || v.currentSrc),
        backgroundImages: Array.from(backgroundDivs).map(div => div.style.backgroundImage).filter(bg => bg),
        totalElements: allElements.length,
        bodySnippet: bodyContent,
        hasReactRoot: !!document.getElementById('root'),
        reactRootContent: document.getElementById('root') ? document.getElementById('root').innerHTML.substring(0, 200) : null
      };
    });
    
    console.log('📊 DOM Analysis:', heroElements);
    
    await page.screenshot({ path: 'debug-hero-current.png', fullPage: true });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugHeroVideo();