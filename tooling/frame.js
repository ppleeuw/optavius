// Extract a frame from an mp4 at time t -> png. Works with site-relative urls (served by localhost) via canvas.
const { chromium } = require('playwright'); const fs = require('fs');
module.exports = async function frame(page, urlPath, t, out) {
  const data = await page.evaluate(async ([u, tt]) => { const v = document.createElement('video'); v.muted = true; v.src = u; document.body.appendChild(v); await new Promise((res, rej) => { v.onloadedmetadata = res; v.onerror = () => rej(new Error('video load error ' + u)); }); v.currentTime = Math.min(tt, Math.max(0, v.duration - 0.1)); await new Promise(res => { v.onseeked = res; }); const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0); const d = c.toDataURL('image/png'); v.remove(); return { d, w: c.width, h: c.height, dur: v.duration }; }, [urlPath, t]);
  fs.writeFileSync(out, Buffer.from(data.d.split(',')[1], 'base64')); return data;
};
if (require.main === module) { (async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.goto('http://localhost:3100/'); const r = await module.exports(p, process.argv[2], Number(process.argv[3] || 0.5), process.argv[4]); console.log(r.w, r.h, r.dur.toFixed(1)); await b.close(); })(); }
