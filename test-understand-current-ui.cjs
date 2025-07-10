const { chromium } = require('playwright');

async function understandCurrentUI() {
  console.log('🔍 UNDERSTANDING CURRENT UI/UX ISSUES');
  console.log('Investigating hero background managers and media storage');
  console.log('='.repeat(60));
  
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
    console.log('📍 Step 1: Login and Navigate to Admin');
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    await page.goto('http://localhost:8081/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    console.log('✅ Admin logged in');
    
    console.log('\\n📍 Step 2: Examine Content → App Settings');
    await page.getByText('Content').first().click();
    await page.waitForTimeout(1000);
    await page.getByText('App Settings').first().click();
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'ui-analysis-1-app-settings-full.png', fullPage: true });
    
    // Analyze the current sections
    const heroBackgroundSections = await page.getByText('Hero Background', { exact: false }).count();
    const mediaManagerSections = await page.getByText('Media Manager', { exact: false }).count();
    const videoSettingsSections = await page.getByText('Video Settings', { exact: false }).count();
    
    console.log(`🎬 Hero Background sections found: ${heroBackgroundSections}`);
    console.log(`📁 Media Manager sections found: ${mediaManagerSections}`);
    console.log(`🎥 Video Settings sections found: ${videoSettingsSections}`);
    
    // Check for duplicate or overlapping sections
    const allHeadings = await page.locator('h1, h2, h3').allTextContents();
    console.log('\\n📋 All section headings found:');
    allHeadings.forEach((heading, index) => {
      if (heading.toLowerCase().includes('hero') || 
          heading.toLowerCase().includes('background') || 
          heading.toLowerCase().includes('media') || 
          heading.toLowerCase().includes('video')) {
        console.log(`   ${index + 1}. "${heading}"`);
      }
    });
    
    console.log('\\n📍 Step 3: Check Design Tab for Media Manager');
    await page.getByText('Design').first().click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'ui-analysis-2-design-tab.png', fullPage: true });
    
    // Look for Media Manager in Design tab
    const designMediaManager = await page.getByText('Media Manager').count();
    console.log(`📁 Media Manager in Design tab: ${designMediaManager}`);
    
    if (designMediaManager > 0) {
      console.log('\\n📍 Step 4: Examine Media Manager Interface');
      await page.getByText('Media Manager').first().click();
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: 'ui-analysis-3-media-manager.png', fullPage: true });
      
      // Check current media manager features
      const fileInputs = await page.locator('input[type="file"]').count();
      const uploadButtons = await page.getByText('Upload', { exact: false }).count();
      const mediaGrid = await page.locator('.grid, [class*="grid"]').count();
      const mediaItems = await page.locator('img, video, [class*="media"], [class*="file"]').count();
      
      console.log(`📤 File upload inputs: ${fileInputs}`);
      console.log(`📤 Upload buttons: ${uploadButtons}`);
      console.log(`🗂️ Grid layouts: ${mediaGrid}`);
      console.log(`🖼️ Media items displayed: ${mediaItems}`);
      
      // Check for storage bucket integration
      const bucketReferences = await page.textContent('body');
      const hasStorageBucket = bucketReferences.includes('storage') || bucketReferences.includes('bucket');
      console.log(`🪣 Storage bucket references: ${hasStorageBucket}`);
      
      // Check for existing media display
      if (mediaItems > 0) {
        console.log('\\n📋 Media items found - checking details...');
        const mediaElements = await page.locator('img, video').all();
        for (let i = 0; i < Math.min(mediaElements.length, 5); i++) {
          const element = mediaElements[i];
          const src = await element.getAttribute('src').catch(() => '');
          const alt = await element.getAttribute('alt').catch(() => '');
          console.log(`   Media ${i + 1}: src="${src.substring(0, 50)}..." alt="${alt}"`);
        }
      } else {
        console.log('\\n⚠️ No existing media items displayed');
      }
    }
    
    console.log('\\n📍 Step 5: Go Back to Content and Examine Full Interface');
    await page.getByText('Content').first().click();
    await page.waitForTimeout(1000);
    await page.getByText('App Settings').first().click();
    await page.waitForTimeout(3000);
    
    // Scroll through entire page to see all sections
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'ui-analysis-4-content-top.png', fullPage: true });
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'ui-analysis-5-content-middle.png', fullPage: true });
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'ui-analysis-6-content-bottom.png', fullPage: true });
    
    // Count all cards/sections in the interface
    const glassCards = await page.locator('.glass-card, [class*="glass"]').count();
    const cards = await page.locator('.card, [class*="card"]').count();
    const sections = await page.locator('section, .section').count();
    
    console.log(`\\n📊 Interface elements:`);
    console.log(`   Glass cards: ${glassCards}`);
    console.log(`   Cards: ${cards}`);
    console.log(`   Sections: ${sections}`);
    
    // =====================================
    // ANALYSIS & RECOMMENDATIONS
    // =====================================
    console.log('\\n' + '='.repeat(60));
    console.log('🎯 UI/UX ANALYSIS & RECOMMENDATIONS');
    console.log('='.repeat(60));
    
    console.log('\\n❌ IDENTIFIED ISSUES:');
    if (heroBackgroundSections > 1) {
      console.log(`   - Duplicate Hero Background sections (${heroBackgroundSections} found)`);
    }
    if (mediaManagerSections > 1) {
      console.log(`   - Multiple Media Manager interfaces`);
    }
    console.log('   - Video settings and hero background settings scattered');
    console.log('   - No clear media library/storage bucket browser');
    console.log('   - Inconsistent interface organization');
    
    console.log('\\n✅ RECOMMENDED IMPROVEMENTS:');
    console.log('   1. 🎯 CONSOLIDATE: Merge all hero/background/video settings into ONE section');
    console.log('   2. 📁 MEDIA LIBRARY: Create unified media browser showing all storage bucket files');
    console.log('   3. 🖼️ VISUAL SELECTION: Add thumbnail grid for selecting backgrounds/videos');
    console.log('   4. 📤 UPLOAD INTEGRATION: Combine upload with selection in same interface');
    console.log('   5. 🎛️ ORGANIZED TABS: Group related settings logically');
    
    console.log('\\n📋 PROPOSED NEW STRUCTURE:');
    console.log('   📂 Media & Background Manager');
    console.log('   ├── 📤 Upload New Media');
    console.log('   ├── 🗂️ Browse Storage Library');
    console.log('   ├── 🎬 Video Settings (autoplay/muted/loop)');
    console.log('   ├── 🎨 Background Type (image/video/youtube)');
    console.log('   └── ⚙️ Advanced Options (overlay/mobile)');
    
    console.log('\\n⏱️ Keeping browser open for detailed examination...');
    await page.waitForTimeout(20000);
    
  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    await page.screenshot({ path: 'ui-analysis-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 UI/UX Analysis Complete!');
    console.log('📸 Check screenshots for detailed visual analysis');
  }
}

understandCurrentUI().catch(console.error);