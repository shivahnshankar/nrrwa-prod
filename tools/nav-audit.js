const { chromium } = require('playwright');

function parseRGB(rgb) {
  // rgb/rgba or hex not expected, but handle rgb
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  // fallback black
  return [0,0,0];
}

function relativeLuminance([r,g,b]){
  const srgb = [r,g,b].map(v => v/255).map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
  return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
}

function contrastRatio(rgb1, rgb2){
  const L1 = relativeLuminance(parseRGB(rgb1));
  const L2 = relativeLuminance(parseRGB(rgb2));
  const lighter = Math.max(L1,L2);
  const darker = Math.min(L1,L2);
  return (lighter + 0.05) / (darker + 0.05);
}

(async ()=>{
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pages = [
    { url: 'http://localhost:1314/en/', name: 'home' },
    { url: 'http://localhost:1314/en/news/', name: 'news' },
    { url: 'http://localhost:1314/en/events/', name: 'events' },
    { url: 'http://localhost:1314/en/membership/', name: 'membership' },
    { url: 'http://localhost:1314/en/directory/', name: 'directory' }
  ];

  const results = [];

  for (const p of pages) {
    const page = await context.newPage();
    await page.goto(p.url, { waitUntil: 'networkidle' });
    // Force dark theme
    await page.evaluate(() => { document.documentElement.setAttribute('data-theme', 'dark'); });
    await page.waitForTimeout(200);

    const headerBg = await page.$eval('.site-header-wrapper', el => getComputedStyle(el).backgroundColor);
    const navLink = await page.$eval('nav ul>li>a', el => getComputedStyle(el).color);
    const joinBtn = await page.$eval('.nav-join-button a', el => getComputedStyle(el).color);
    const navBg = await page.$eval('nav', el => getComputedStyle(el).backgroundColor);

    // submenu check - hover first has-submenu
    let submenuBg = null, submenuLink = null;
    const hasSub = await page.$('nav li.has-submenu');
    if (hasSub) {
      await hasSub.hover();
      await page.waitForTimeout(100);
      submenuBg = await page.$eval('nav ul li.has-submenu .submenu', el => getComputedStyle(el).backgroundColor).catch(()=>null);
      submenuLink = await page.$eval('nav ul li.has-submenu .submenu li a', el => getComputedStyle(el).color).catch(()=>null);
    }

    // Contrast calculations
    const navContrast = contrastRatio(navLink, navBg);
    const headerContrast = contrastRatio(navLink, headerBg);
    const joinContrast = contrastRatio(joinBtn, navBg);

    // Mobile menu - toggle
    await page.setViewportSize({ width: 375, height: 800 });
    const menuToggle = await page.$('.menu-toggle');
    let mobileMenuBg = null, mobileLinkColor=null, mobileContrast=null;
    if (menuToggle) {
      await menuToggle.click();
      await page.waitForTimeout(200);
      mobileMenuBg = await page.$eval('nav ul.nav-menu', el => getComputedStyle(el).backgroundColor).catch(()=>null);
      mobileLinkColor = await page.$eval('nav ul.nav-menu>li>a', el => getComputedStyle(el).color).catch(()=>null);
      if (mobileMenuBg && mobileLinkColor) mobileContrast = contrastRatio(mobileLinkColor, mobileMenuBg);
      // close menu
      await menuToggle.click();
    }

    results.push({ page: p.name, headerBg, navBg, navLink, navContrast, headerContrast, joinContrast, submenuBg, submenuLink, mobileMenuBg, mobileLinkColor, mobileContrast });
    await page.close();
  }

  await browser.close();

  console.log(JSON.stringify(results, null, 2));
})();