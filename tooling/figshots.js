// screenshot the S06-S08 figures + bento cards at 1440
const { chromium } = require('playwright'); const fs = require('fs');
const OUT = 'C:/Users/peter/AppData/Local/Temp/sgen';
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto('http://localhost:3100/', { waitUntil: 'load' }); await page.waitForTimeout(2000);
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 600) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(150); }
  const figs = await page.$$('section:has(h3:text("The agent-building agent")) figure, section:has(h3:text("Use AI to improve your AI")) figure, section:has(h3:text("Turn conversations into outcomes")) figure');
  let i = 0; for (const f of figs) { const vis = await f.isVisible(); if (!vis) continue; await f.scrollIntoViewIfNeeded(); await page.waitForTimeout(400); await f.screenshot({ path: `${OUT}/cur-fig${i}.png` }); i++; }
  // bento cards
  const cards = await page.$$('[data-bento], section:has(h3:text("Empower every team")) article');
  console.log('figs', i, 'bento nodes', cards.length);
  const bento = await page.$$('section:has-text("Empower every team") figure');
  let j = 0; for (const c of bento) { if (!(await c.isVisible())) continue; await c.scrollIntoViewIfNeeded(); await page.waitForTimeout(3000); await c.screenshot({ path: `${OUT}/cur-bento${j}.png` }); j++; }
  console.log('bento figs', j);
  await b.close();
})();
