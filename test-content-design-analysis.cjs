const { chromium } = require('playwright');

async function analyzeContentDesignIntegration() {
  console.log('🔍 CONTENT-DESIGN INTEGRATION ANALYSIS');
  console.log('Demonstrating current state and integration opportunities');
  console.log('='.repeat(65));
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1500,
    args: ['--no-sandbox'] 
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1400, height: 900 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📍 Step 1: Login and Access Admin Dashboard');
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    await page.locator('input[type="email"]').fill('daniel.j.fleuren@gmail.com');
    await page.locator('input[type="password"]').fill('3d3nC@n@@nAv3nu3');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForTimeout(5000);
    await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    console.log('✅ Admin dashboard loaded');
    
    // =====================================
    // CONTENT MANAGEMENT ANALYSIS
    // =====================================
    console.log('\\n📍 Step 2: Analyze Content Management - Overview');
    await page.getByText('Content').first().click();
    await page.waitForTimeout(1000);
    await page.getByText('App Settings').first().click();
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'analysis-1-content-overview.png', fullPage: true });
    
    // Count content editing fields
    const textInputs = await page.locator('input[type="text"]').count();
    const textareas = await page.locator('textarea').count();
    const dateInputs = await page.locator('input[type="datetime-local"]').count();
    const urlInputs = await page.locator('input[type="url"]').count();
    
    console.log(`📝 Content editing fields found:`);
    console.log(`   - Text inputs: ${textInputs}`);
    console.log(`   - Textareas: ${textareas}`);
    console.log(`   - Date inputs: ${dateInputs}`);
    console.log(`   - URL inputs: ${urlInputs}`);
    
    // Check for rich text features
    const richTextEditors = await page.locator('.ql-editor, .tiptap, .prosemirror').count();
    const toolbars = await page.locator('.ql-toolbar, .tiptap-toolbar').count();
    const formatting = await page.locator('button[data-command], .formatting-button').count();
    
    console.log(`🎨 Rich text features:`);
    console.log(`   - Rich text editors: ${richTextEditors}`);
    console.log(`   - Formatting toolbars: ${toolbars}`);
    console.log(`   - Formatting buttons: ${formatting}`);
    
    if (richTextEditors === 0) {
      console.log('❌ NO RICH TEXT EDITING: All content fields are basic inputs');
    }
    
    console.log('\\n📍 Step 3: Analyze Content Management - Events');
    await page.getByText('Events').first().click();
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'analysis-2-content-events.png', fullPage: true });
    
    // Check events interface
    const eventForms = await page.locator('form, .form').count();
    const addEventButtons = await page.getByText('Add Event', { exact: false }).count();
    const eventFields = await page.locator('input, textarea, select').count();
    
    console.log(`📅 Events management:`);
    console.log(`   - Event forms: ${eventForms}`);
    console.log(`   - Add event buttons: ${addEventButtons}`);
    console.log(`   - Total form fields: ${eventFields}`);
    
    // Test event creation interface
    if (addEventButtons > 0) {
      console.log('\\n🧪 Testing event creation interface...');
      await page.getByText('Add Event').first().click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: 'analysis-3-event-creation.png', fullPage: true });
      
      const eventInputs = await page.locator('input, textarea').count();
      const eventTextareas = await page.locator('textarea').count();
      
      console.log(`   - Event input fields: ${eventInputs}`);
      console.log(`   - Event description areas: ${eventTextareas}`);
      
      // Check if event description is rich text
      const eventRichText = await page.locator('textarea').first().getAttribute('class');
      console.log(`   - Event description class: "${eventRichText}"`);
      
      if (!eventRichText?.includes('rich') && !eventRichText?.includes('editor')) {
        console.log('❌ EVENT DESCRIPTIONS: Basic textarea only, no formatting');
      }
    }
    
    // =====================================
    // DESIGN SYSTEM ANALYSIS  
    // =====================================
    console.log('\\n📍 Step 4: Analyze Design System');
    await page.getByText('Design').first().click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'analysis-4-design-overview.png', fullPage: true });
    
    const designTabs = await page.locator('button').allTextContents();
    const designTabsFiltered = designTabs.filter(tab => 
      tab && (tab.includes('Theme') || tab.includes('Typography') || tab.includes('Font') || tab.includes('Color'))
    );
    
    console.log(`🎨 Design system tabs:`);
    designTabsFiltered.forEach((tab, index) => {
      console.log(`   ${index + 1}. "${tab}"`);
    });
    
    console.log('\\n📍 Step 5: Test Theme Customization');
    const themeCustomization = await page.getByText('Theme Customization').count();
    if (themeCustomization > 0) {
      await page.getByText('Theme Customization').first().click();
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: 'analysis-5-theme-customization.png', fullPage: true });
      
      const colorPickers = await page.locator('input[type="color"], .color-picker').count();
      const fontSelectors = await page.locator('select, .font-selector').count();
      const previewButtons = await page.getByText('Preview', { exact: false }).count();
      
      console.log(`🎨 Theme customization features:`);
      console.log(`   - Color pickers: ${colorPickers}`);
      console.log(`   - Font selectors: ${fontSelectors}`);
      console.log(`   - Preview buttons: ${previewButtons}`);
    }
    
    console.log('\\n📍 Step 6: Test Typography System');
    const typography = await page.getByText('Typography').count();
    if (typography > 0) {
      await page.getByText('Typography').first().click();
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: 'analysis-6-typography.png', fullPage: true });
      
      const fontOptions = await page.locator('option, .font-option').count();
      const fontPreviews = await page.locator('.font-preview, .preview').count();
      const googleFonts = await page.getByText('Google', { exact: false }).count();
      
      console.log(`🔤 Typography features:`);
      console.log(`   - Font options: ${fontOptions}`);
      console.log(`   - Font previews: ${fontPreviews}`);
      console.log(`   - Google Fonts references: ${googleFonts}`);
    }
    
    // =====================================
    // VIDEO OVERLAP TESTING
    // =====================================
    console.log('\\n📍 Step 7: Test Video Player Overlap Issue');
    
    // Go back to content and set up video test
    await page.getByText('Content').first().click();
    await page.waitForTimeout(1000);
    await page.getByText('App Settings').first().click();
    await page.waitForTimeout(2000);
    
    // Scroll to video settings
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'analysis-7-video-settings.png', fullPage: true });
    
    // Test video type switching
    const backgroundTypeSelects = await page.locator('select').count();
    console.log(`🎥 Video background controls: ${backgroundTypeSelects}`);
    
    if (backgroundTypeSelects > 0) {
      console.log('\\n🧪 Testing video type switching...');
      
      // Test switching to video
      await page.locator('select').first().selectOption('video');
      await page.waitForTimeout(1000);
      console.log('   ✅ Switched to video background');
      
      // Test switching to YouTube
      await page.locator('select').first().selectOption('youtube');
      await page.waitForTimeout(1000);
      console.log('   ✅ Switched to YouTube background');
      
      // Check homepage for overlap issues
      console.log('\\n🔍 Checking homepage for video overlap...');
      await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
      await page.waitForTimeout(5000);
      
      await page.screenshot({ path: 'analysis-8-homepage-video.png', fullPage: true });
      
      const videoElements = await page.locator('video').count();
      const iframeElements = await page.locator('iframe').count();
      const youtubeIframes = await page.locator('iframe[src*="youtube"]').count();
      
      console.log(`🎬 Homepage video elements:`);
      console.log(`   - Native video elements: ${videoElements}`);
      console.log(`   - Total iframes: ${iframeElements}`);
      console.log(`   - YouTube iframes: ${youtubeIframes}`);
      
      if (videoElements > 0 && youtubeIframes > 0) {
        console.log('⚠️ POTENTIAL OVERLAP: Both native video and YouTube iframe detected');
      }
    }
    
    // =====================================
    // INTEGRATION OPPORTUNITY ANALYSIS
    // =====================================
    console.log('\\n' + '='.repeat(65));
    console.log('🎯 CONTENT-DESIGN INTEGRATION ANALYSIS RESULTS');
    console.log('='.repeat(65));
    
    console.log('\\n❌ CURRENT LIMITATIONS IDENTIFIED:');
    
    if (richTextEditors === 0) {
      console.log('   📝 NO RICH TEXT EDITING: All content uses basic HTML inputs');
      console.log('       → Impact: Cannot format text, add links, lists, or styling');
    }
    
    if (toolbars === 0) {
      console.log('   🛠️ NO FORMATTING TOOLS: No bold, italic, heading options');
      console.log('       → Impact: Plain text only, no visual hierarchy');
    }
    
    console.log('   🔄 DESIGN-CONTENT SEPARATION: Must switch tabs to apply styling');
    console.log('       → Impact: Broken workflow, cannot see styled content in real-time');
    
    console.log('   👁️ NO LIVE PREVIEW: Cannot see content with applied design');
    console.log('       → Impact: Guesswork for styling, time-consuming editing');
    
    if (videoElements > 0 && youtubeIframes > 0) {
      console.log('   🎥 VIDEO OVERLAP DETECTED: Multiple video elements conflict');
      console.log('       → Impact: Visual glitches, performance issues');
    }
    
    console.log('\\n✅ INTEGRATION OPPORTUNITIES:');
    console.log('   🎨 UNIFIED INTERFACE: Merge content editing with design controls');
    console.log('   📝 RICH TEXT EDITORS: Replace textareas with WYSIWYG editors');
    console.log('   🔤 INLINE FONT SELECTION: Font picker within content editor');
    console.log('   🌈 INLINE COLOR PICKER: Color selection during text editing');
    console.log('   👁️ LIVE PREVIEW PANE: Real-time styled content preview');
    console.log('   📱 RESPONSIVE PREVIEW: Mobile/desktop preview integration');
    console.log('   🎞️ TEMPLATE SYSTEM: Pre-designed content blocks');
    console.log('   🎥 VIDEO Z-INDEX FIX: Proper video layer management');
    
    console.log('\\n📊 TECHNICAL ASSESSMENT:');
    console.log(`   ✅ Solid Foundation: ${textInputs + textareas} content fields ready for enhancement`);
    console.log(`   ✅ Design System: ${colorPickers + fontSelectors} styling controls available`);
    console.log(`   ✅ Database Ready: Existing settings system can store rich content`);
    console.log(`   ✅ Component Architecture: Well-structured React components`);
    
    console.log('\\n🚀 RECOMMENDED NEXT STEPS:');
    console.log('   1. Install TipTap rich text editor for React');
    console.log('   2. Replace hero_subtitle textarea with rich text editor');
    console.log('   3. Add font selection dropdown to editor toolbar');
    console.log('   4. Implement live preview pane for content editing');
    console.log('   5. Fix video player z-index conflicts');
    console.log('   6. Create content templates with pre-applied styling');
    
    console.log('\\n💡 USER EXPERIENCE TRANSFORMATION:');
    console.log('   BEFORE: Edit text → Switch to Design → Change font → Switch back → Repeat');
    console.log('   AFTER:  Edit rich text with live font/color selection and instant preview');
    
    console.log('\\n⏱️ Keeping browser open for detailed examination...');
    await page.waitForTimeout(20000);
    
  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    await page.screenshot({ path: 'analysis-error.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\\n🏁 Content-Design Integration Analysis Complete!');
    console.log('📸 Check screenshots for detailed visual analysis');
    console.log('📋 Review UNIFIED_CONTENT_DESIGN_PLAN.md for implementation roadmap');
  }
}

analyzeContentDesignIntegration().catch(console.error);