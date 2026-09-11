// Social preview images (1200x630) per language, rendered with the site's own fonts. Run from the project root: node tooling/og.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'); const OUT = path.join(ROOT, 'public/og'); fs.mkdirSync(OUT, { recursive: true });
const fontUrl = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64');
const heads = {};
for (const lang of ['en', 'nl', 'de']) {
  const src = fs.readFileSync(path.join(ROOT, `content/${lang}.ts`), 'utf8');
  const m = src.match(/hero: \{\s*title: "([^"]+)"/); heads[lang] = (m ? m[1] : 'Optavius').replace(/\\n/g, '\n');
}
const sub = { en: 'AI voice agents for specialty care', nl: 'AI-spraakagenten voor specialistische zorg', de: 'KI-Sprachagenten für Facharztpraxen' };
const html = (lang) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:GT;src:url(${fontUrl('GT_America_Standard_Regular-s.p.1zc5t_gvwny95.woff2')}) format('woff2');font-weight:400}
@font-face{font-family:GT;src:url(${fontUrl('GT_America_Standard_Medium-s.p.3u2zpkd3jquk2.woff2')}) format('woff2');font-weight:500}
@font-face{font-family:Fraunces;src:url(${fontUrl('fraunces-500-latin.woff2')}) format('woff2');font-weight:500}
html,body{margin:0;width:1200px;height:630px;background:#05351d;color:#fff;font-family:GT,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{position:relative;box-sizing:border-box;width:1200px;height:630px;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden}
.logo{display:flex;align-items:baseline;font-size:46px;font-weight:500;letter-spacing:-0.01em;line-height:1;font-family:Fraunces,Georgia,serif;font-variation-settings:"opsz" 144,"SOFT" 50}
.logo svg{width:.72em;height:.72em;margin-right:.02em;transform:translateY(.04em);overflow:visible}
h1{margin:0;font-size:78px;font-weight:400;letter-spacing:-0.02em;line-height:1.02;white-space:pre-line;max-width:980px}
.sub{font-size:26px;color:rgba(255,255,255,.75)}
.glow{position:absolute;right:-220px;bottom:-260px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle,#4faf62 0%,rgba(79,175,98,0) 62%);opacity:.45}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.12) 1px,transparent 1px);background-size:28px 28px;opacity:.5}
</style></head><body><div class="wrap"><div class="dots"></div><div class="glow"></div>
<div class="logo"><svg viewBox="1.9 1.9 36.2 36.2"><path d="M34.7 12.6A16.5 16.5 0 1 0 34.7 27.4" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="butt"/></svg>ptavius</div>
<div><h1>${heads[lang].replace(/</g, '&lt;')}</h1></div>
<div class="sub">${sub[lang]} · www.optavius.com</div></div></body></html>`;
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const lang of ['en', 'nl', 'de']) { const tmp = path.join(OUT, `_${lang}.html`); fs.writeFileSync(tmp, html(lang)); await page.goto('file:///' + tmp.replace(/\\/g, '/'), { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200); await page.screenshot({ path: path.join(OUT, `${lang}.png`), type: 'png' }); console.log('og', lang); }
  for (const lang of ['en', 'nl', 'de']) fs.unlinkSync(path.join(OUT, `_${lang}.html`));
  await b.close();
})();
