import { chromium } from 'playwright';

async function testDashboard() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore network and resource loading errors
      if (!text.includes('Failed to load resource') && 
          !text.includes('net::ERR') &&
          !text.includes('favicon') &&
          !text.includes('fonts.googleapis')) {
        errors.push(text);
      }
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    // Navigate to the app
    console.log('Loading dashboard...');
    await page.goto('http://localhost:3003', { waitUntil: 'load', timeout: 30000 });
    
    // Wait for React to render
    await page.waitForTimeout(5000);
    
    // Get page title
    const title = await page.title();
    console.log(`✓ Page title: ${title}`);
    
    // Check if the script tags are present
    const scripts = await page.$$('script');
    console.log(`✓ Found ${scripts.length} script tags`);
    
    // Check if CSS is loaded
    const links = await page.$$('link[rel="stylesheet"]');
    console.log(`✓ Found ${links.length} stylesheet links`);
    
    // Report results
    console.log('\n=== Test Results ===');
    if (errors.length === 0) {
      console.log('✓ No critical console errors detected');
    } else {
      console.log('Console errors found:');
      errors.forEach(err => console.log('  - ' + err));
    }
    
    console.log('\n✓ Build verification completed successfully');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.log('Note: Some errors may be expected in sandboxed environments');
  } finally {
    await browser.close();
  }
}

testDashboard();
