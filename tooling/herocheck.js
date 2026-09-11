const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto('http://localhost:3100/', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const durs = await page.evaluate(async () => { const vs = [...document.querySelectorAll('header video')]; await Promise.all(vs.map(v => new Promise(r => { if (v.readyState >= 1) r(); else { v.addEventListener('loadedmetadata', r, { once: true }); setTimeout(r, 8000); } }))); return vs.map(v => ({ src: v.currentSrc.split('/').pop(), dur: v.duration, loop: v.loop })); });
  console.log(JSON.stringify(durs));
  // sample which video is playing and its currentTime/ended over 32s
  for (let t = 0; t <= 32; t += 2) {
    const st = await page.evaluate(() => [...document.querySelectorAll('header video')].map(v => `${v.paused ? 'P' : 'play'}:${v.currentTime.toFixed(1)}${v.ended ? ':END' : ''}`).join(' | '));
    console.log(t + 's', st); await page.waitForTimeout(2000);
  }
  await b.close();
})();
