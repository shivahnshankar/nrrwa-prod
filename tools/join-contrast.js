const { chromium } = require('playwright');

(async ()=>{
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:1314/en/', { waitUntil: 'networkidle' });
  await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
  await page.waitForTimeout(200);
  const el = await page.$('.nav-join-button a');
  if (!el) {
    console.log('Join button not found');
    await browser.close();
    return;
  }
  const color = await el.evaluate(e => getComputedStyle(e).color);
  const bg = await el.evaluate(e => getComputedStyle(e).backgroundColor);
  console.log({ color, bg });
  await browser.close();
})();