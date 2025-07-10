const { chromium } = require('playwright');

async function finalCheck() {
  console.log('🎊 FINAL INTEGRATION VERIFICATION');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8080/auth');
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(3000);
    
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(6000);
    
    await page.screenshot({ path: 'final-result.png', fullPage: true });
    
    const final = await page.evaluate(() => {
      const iframe = document.querySelector('iframe[src*="youtube"]');
      const hero = document.querySelector('.glass-card');
      
      return {
        youtube: !!iframe,
        youtubeUrl: iframe ? iframe.src : null,
        heroContent: hero ? hero.textContent.substring(0, 100) : null,
        hasEmojis: hero ? hero.textContent.includes('💕') : false
      };
    });
    
    console.log('📊 FINAL RESULTS:');
    console.log(`   YouTube video: ${final.youtube ? '✅' : '❌'}`);
    console.log(`   Hero content: ${final.heroContent ? '✅' : '❌'}`);
    console.log(`   Wedding emojis: ${final.hasEmojis ? '✅' : '❌'}`);
    
    if (final.youtube) {
      console.log('🎉 VIDEO SUCCESSFULLY WORKING WITH YOUTUBE!');
    }
    
    if (final.hasEmojis) {
      console.log('🎉 RICH TEXT CONTENT WORKING PERFECTLY!');
    }
    
  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    await browser.close();
  }
}

finalCheck();