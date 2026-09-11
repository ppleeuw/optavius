const { chromium } = require('playwright');
const OUT = 'C:/Users/peter/AppData/Local/Temp/sgen';
(async () => {
  const b = await chromium.launch();
  for (const w of [1440, 1024, 768, 390]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } }); const page = await ctx.newPage();
    await page.goto('http://localhost:3100/', { waitUntil: 'load' }); await page.waitForTimeout(1500);
    const sec = await page.$('section:has-text("Empower every team")');
    await sec.scrollIntoViewIfNeeded(); await page.waitForTimeout(2500);
    await sec.screenshot({ path: `${OUT}/bento-${w}.png` });
    await page.waitForTimeout(2300); await sec.screenshot({ path: `${OUT}/bento-${w}-b.png` });
    const box = await sec.boundingBox(); console.log(w, 'bento section', Math.round(box.width), Math.round(box.height));
    await ctx.close();
  }
  await b.close();
})();
