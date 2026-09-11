// screenshot every [data-mock] on a few product pages to spot-check the CSS fix
const { chromium } = require('playwright');
const OUT = 'C:/Users/peter/AppData/Local/Temp/sgen';
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  let n = 0;
  for (const p of ['/product/agent-studio', '/product/insights', '/industries/healthcare', '/product/horizon']) {
    await page.goto('http://localhost:3100' + p, { waitUntil: 'load' }); await page.waitForTimeout(1200);
    const total = await page.evaluate(() => document.body.scrollHeight); for (let y = 0; y < total; y += 700) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(100); }
    const mocks = await page.$$('[data-mock]');
    for (const m of mocks) { if (!(await m.isVisible())) continue; const box = await m.boundingBox(); if (!box || box.width < 60) continue; await m.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await m.screenshot({ path: `${OUT}/mock-${n}.png` }); n++; if (n >= 16) break; }
    if (n >= 16) break;
  }
  console.log('mock shots', n);
  await b.close();
})();
