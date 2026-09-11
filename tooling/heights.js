// local page height vs reference screenshot height at 4 widths
const { chromium } = require('playwright'); const fs = require('fs');
const pages = fs.readFileSync('pages.txt', 'utf8').trim().split('\n').map(l => l.split(' '));
const pngH = (f) => { const b = fs.readFileSync(f); return b.readUInt32BE(20); };
(async () => {
  const b = await chromium.launch();
  for (const w of [1440, 1280, 768, 390]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, isMobile: w < 800, hasTouch: w < 800 });
    const diffs = [];
    for (const [path, slug] of pages) {
      const p = await ctx.newPage();
      try {
        await p.goto('http://localhost:3100' + path, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(1200);
        const total = await p.evaluate(() => document.body.scrollHeight); for (let y = 0; y < total + 900; y += 700) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(80); }
        await p.waitForTimeout(600);
        const h = await p.evaluate(() => document.body.scrollHeight);
        const ref = fs.existsSync(`ref/${slug}/full-${w}.png`) ? pngH(`ref/${slug}/full-${w}.png`) : null;
        if (ref !== null && Math.abs(h - ref) > 4) diffs.push(`${slug}: local ${h} vs ref ${ref} (${h - ref > 0 ? '+' : ''}${h - ref})`);
      } catch (e) { diffs.push(slug + ': ERROR ' + e.message.slice(0, 60)); }
      await p.close();
    }
    console.log(w, 'pages off by >4px:', diffs.length, diffs.length ? '\n  ' + diffs.join('\n  ') : '');
    await ctx.close();
  }
  await b.close();
})();
