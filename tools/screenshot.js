const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

  const pages = [
    { url: 'http://localhost:1314/en/', name: 'home' },
    { url: 'http://localhost:1314/en/news/', name: 'news' },
    { url: 'http://localhost:1314/en/events/', name: 'events' },
    { url: 'http://localhost:1314/en/membership/', name: 'membership' },
    { url: 'http://localhost:1314/en/directory/', name: 'directory' }
  ];

  for (const p of pages) {
    const page = await context.newPage();
    await page.goto(p.url, { waitUntil: 'networkidle' });
    // Force dark theme
    await page.evaluate(() => { document.documentElement.setAttribute('data-theme', 'dark'); });
    // Wait a little for transitions
    await page.waitForTimeout(300);
    const path = `./public/screenshots/${p.name}-dark.png`;
    await page.screenshot({ path, fullPage: true });
    console.log('Saved', path);
    await page.close();
  }

  await browser.close();
})();