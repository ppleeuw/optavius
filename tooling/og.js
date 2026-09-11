// Social preview images (1200x630) per language: the demo player block, captured from the exported site.
// Run from the project root with the export served locally: node tooling/serve-out.js out /optavius 3300, then node tooling/og.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const sharp = require('sharp');
const ROOT = path.resolve(__dirname, '..'); const OUT = path.join(ROOT, 'public/og'); fs.mkdirSync(OUT, { recursive: true });
const ORIGIN = process.env.ORIGIN || 'http://localhost:3300/optavius';
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 2 });
  for (const lang of ['en', 'nl', 'de']) {
    await page.goto(`${ORIGIN}/${lang === 'en' ? '' : lang + '/'}`, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await page.addStyleTag({ content: 'body, #demo, #demo > div { background: #05351d !important; }' });
    const card = page.locator('#demo .bg-green-800').first(); await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
    const shot = await card.screenshot({ type: 'png' });
    const meta = await sharp(shot).metadata();
    const w = 1120, h = Math.round((meta.height / meta.width) * w);
    const resized = await sharp(shot).resize(w, h).png().toBuffer();
    const top = Math.max(0, Math.round((630 - h) / 2));
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#05351d' } })
      .composite([{ input: await sharp(resized).extract({ left: 0, top: 0, width: w, height: Math.min(h, 630) }).toBuffer(), left: 40, top }])
      .png().toFile(path.join(OUT, `${lang}.png`));
    console.log('og', lang, `${w}x${h}`);
  }
  await b.close();
})();
