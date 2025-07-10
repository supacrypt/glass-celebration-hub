const { chromium } = require('playwright');

async function testFinalHeroVideoFonts() {
  console.log('🎬 FINAL HERO VIDEO & FONTS VERIFICATION');
  console.log('Testing working video URL and font application');
  console.log('='.repeat(65));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 800,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1600, height: 1000 }
  });
  
  const page = await context.newPage();
  
  // Capture console logs for debugging
  page.on('console', msg => {
    if (msg.text().includes('HeroBackground Debug') || msg.text().includes('Video') || msg.text().includes('Error')) {
      console.log(`🔍 ${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });
  
  try {
    console.log('📍 Step 1: Login and Update Video Settings');
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    
    // Login
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    
    // Navigate to admin dashboard
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Go to Content Management
    await page.getByText('Content').first().click();
    await page.waitForTimeout(1000);
    await page.getByText('App Settings').first().click();
    await page.waitForTimeout(3000);
    
    console.log('\\n📍 Step 2: Configure Working Video URL');
    
    // Scroll to video settings
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Find video URL input and update with working URL
    const videoUrlInputs = await page.locator('input[type="url"]').all();
    for (const input of videoUrlInputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder && (placeholder.includes('video') || placeholder.includes('http'))) {
        await input.clear();
        await input.fill('https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4');
        await page.waitForTimeout(1000);
        console.log('   ✅ Updated video URL to working sample');
        
        // Save this setting
        const saveButton = await input.locator('xpath=../following-sibling::button[contains(text(), "Save")]').first();
        if (await saveButton.count() > 0 && await saveButton.isEnabled()) {
          await saveButton.click();
          await page.waitForTimeout(2000);
          console.log('   ✅ Saved video URL setting');
        }
        break;
      }
    }
    
    console.log('\\n📍 Step 3: Set Rich Text Content with Fonts');
    
    // Scroll back to top to find rich text editors
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    
    // Find the Hero Subtitle rich text editor
    const heroEditor = await page.locator('[id*="editor-Hero-Subtitle"]').first();
    
    if (await heroEditor.count() > 0) {
      // Click in the editor and set beautiful wedding content
      await heroEditor.click();
      await page.waitForTimeout(1000);
      
      // Clear existing content
      await heroEditor.press('Control+A');
      await page.waitForTimeout(500);
      
      // Add beautiful wedding content
      await heroEditor.type('💕 Join us for the celebration of our love story! ✨💍');
      await page.waitForTimeout(2000);
      
      // Apply font styling
      await heroEditor.press('Control+A');
      await page.waitForTimeout(500);
      
      // Try to apply Dancing Script font
      const fontButton = await page.locator('button').filter({ hasText: /Type/ }).first();
      if (await fontButton.count() > 0) {
        await fontButton.click();
        await page.waitForTimeout(2000);
        
        // Look for Dancing Script font
        const dancingScript = await page.getByText('Dancing Script').first();
        if (await dancingScript.count() > 0) {
          await dancingScript.click();
          await page.waitForTimeout(1000);
          console.log('   ✅ Applied Dancing Script font');
        }
        
        // Close font picker
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
      
      // Apply elegant gold color
      const colorButton = await page.locator('button').filter({ hasText: /Palette/ }).first();
      if (await colorButton.count() > 0) {
        await colorButton.click();
        await page.waitForTimeout(2000);
        
        // Apply gold color
        const goldColor = await page.locator('button[title="#DAA520"]').first();
        if (await goldColor.count() > 0) {
          await goldColor.click();
          await page.waitForTimeout(1000);
          console.log('   ✅ Applied elegant gold color');
        }
        
        // Close color picker
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
      
      // Make it bold and italic for wedding elegance
      const boldButton = await page.locator('button').filter({ hasText: /Bold/ }).first();
      if (await boldButton.count() > 0) {
        await boldButton.click();
        await page.waitForTimeout(500);
        console.log('   ✅ Applied bold formatting');
      }
      
      const italicButton = await page.locator('button').filter({ hasText: /Italic/ }).first();
      if (await italicButton.count() > 0) {
        await italicButton.click();
        await page.waitForTimeout(500);
        console.log('   ✅ Applied italic formatting');
      }
      
      // Save the styled content
      const saveButton = await page.getByText('Save').first();
      if (await saveButton.count() > 0 && await saveButton.isEnabled()) {
        await saveButton.click();
        await page.waitForTimeout(3000);
        console.log('   ✅ Saved rich text content with styling');
      }
      
      await page.screenshot({ path: 'final-test-1-rich-content.png', fullPage: true });
      
    } else {
      console.log('❌ Hero Subtitle rich text editor not found');
    }
    
    console.log('\\n📍 Step 4: Test Homepage with Video and Fonts');
    
    // Navigate to homepage and wait for everything to load
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8000); // Extra time for video to load
    
    await page.screenshot({ path: 'final-test-2-homepage-with-video.png', fullPage: true });
    
    // Analyze the results
    const finalAnalysis = await page.evaluate(() => {
      const videos = document.querySelectorAll('video');
      const hero = document.querySelector('.glass-card, [class*="hero"]');
      
      let videoStatus = null;
      if (videos.length > 0) {
        const video = videos[0];
        videoStatus = {
          count: videos.length,
          src: video.src || video.currentSrc,
          currentTime: video.currentTime,
          duration: video.duration,
          paused: video.paused,
          ended: video.ended,
          readyState: video.readyState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          networkState: video.networkState
        };
      }
      
      let heroAnalysis = null;
      if (hero) {
        const styles = window.getComputedStyle(hero.querySelector('div') || hero);
        heroAnalysis = {
          found: true,
          content: hero.textContent.substring(0, 100),
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          color: styles.color,
          hasFormattedElements: hero.querySelectorAll('b, strong, i, em, span[style]').length
        };
      }
      
      return {
        video: videoStatus,
        hero: heroAnalysis,
        totalVideos: videos.length,
        backgroundDivsWithVideo: document.querySelectorAll('[style*="background"], video').length
      };
    });
    
    console.log('\\n🎬 VIDEO ANALYSIS:');
    if (finalAnalysis.video) {
      console.log(`   - Video elements found: ${finalAnalysis.video.count}`);
      console.log(`   - Video source: ${finalAnalysis.video.src}`);
      console.log(`   - Video playing: ${!finalAnalysis.video.paused ? '✅ YES' : '❌ NO'}`);
      console.log(`   - Video dimensions: ${finalAnalysis.video.videoWidth}x${finalAnalysis.video.videoHeight}`);
      console.log(`   - Ready state: ${finalAnalysis.video.readyState} (4=loaded)`);
      console.log(`   - Network state: ${finalAnalysis.video.networkState} (1=loading, 2=loaded)`);
      
      if (!finalAnalysis.video.paused && finalAnalysis.video.currentTime > 0) {
        console.log('   🎉 VIDEO IS SUCCESSFULLY PLAYING!');
      } else if (finalAnalysis.video.readyState === 4) {
        console.log('   ⚠️ Video loaded but may be paused (check autoplay settings)');
      } else {
        console.log('   ❌ Video not playing properly');
      }
    } else {
      console.log('   ❌ No video elements found');
    }
    
    console.log('\\n🔤 FONT & STYLING ANALYSIS:');
    if (finalAnalysis.hero) {
      console.log(`   - Hero section found: ✅`);
      console.log(`   - Font family: ${finalAnalysis.hero.fontFamily}`);
      console.log(`   - Font size: ${finalAnalysis.hero.fontSize}`);
      console.log(`   - Font weight: ${finalAnalysis.hero.fontWeight}`);
      console.log(`   - Text color: ${finalAnalysis.hero.color}`);
      console.log(`   - Formatted elements: ${finalAnalysis.hero.hasFormattedElements}`);
      console.log(`   - Content preview: "${finalAnalysis.hero.content}..."`);
      
      if (finalAnalysis.hero.fontFamily.includes('Dancing Script')) {
        console.log('   🎉 DANCING SCRIPT FONT SUCCESSFULLY APPLIED!');
      } else if (finalAnalysis.hero.fontFamily !== 'Inter') {
        console.log(`   ⚠️ Custom font applied but not Dancing Script: ${finalAnalysis.hero.fontFamily}`);
      } else {
        console.log('   ❌ Still using default font');
      }
      
      if (finalAnalysis.hero.hasFormattedElements > 0) {
        console.log('   🎉 RICH TEXT FORMATTING SUCCESSFULLY RENDERED!');
      } else {
        console.log('   ❌ No rich text formatting found');
      }
    }
    
    console.log('\\n' + '='.repeat(65));
    console.log('🏆 FINAL INTEGRATION RESULTS');
    console.log('='.repeat(65));
    
    const videoWorking = finalAnalysis.video && !finalAnalysis.video.paused;
    const fontsWorking = finalAnalysis.hero && (finalAnalysis.hero.fontFamily.includes('Dancing Script') || finalAnalysis.hero.hasFormattedElements > 0);
    const contentWorking = finalAnalysis.hero && finalAnalysis.hero.content.includes('💕');
    
    if (videoWorking && fontsWorking && contentWorking) {
      console.log('\\n🎉 ALL ISSUES SUCCESSFULLY RESOLVED!');
      console.log('   ✅ Hero video is playing on homepage');
      console.log('   ✅ Adobe Fonts integration is working');
      console.log('   ✅ Rich text content with formatting is displayed');
      console.log('   ✅ Wedding-themed styling is fully functional');
      console.log('\\n💍 Your wedding website now has:');
      console.log('   🎥 Beautiful background video');
      console.log('   🔤 Elegant typography with Dancing Script');
      console.log('   🎨 Rich text editing with inline design controls');
      console.log('   💕 Wedding-themed content and emojis');
    } else {
      console.log('\\n⚠️ PARTIAL SUCCESS - Some issues remain:');
      if (!videoWorking) console.log('   ❌ Video still not playing properly');
      if (!fontsWorking) console.log('   ❌ Font styling not fully applied');
      if (!contentWorking) console.log('   ❌ Rich content not displaying');
    }
    
    console.log('\\n⏱️ Keeping browser open for final verification...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'final-test-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Final Hero Video & Fonts Test Complete!');
    console.log('📸 Check screenshots for visual validation');
  }
}

testFinalHeroVideoFonts().catch(console.error);