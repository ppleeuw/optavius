// Apply the eye-care copy map to the Horizon frames and the initial tab panels; also tweak shapes via class swaps.
const fs = require('fs');
const map = require('./horizon-map');
const P = 'C:/Users/peter/AppData/Roaming/Claude/scratch-workspaces/11f88b9f-a9bc-4623-98c2-159c4317abcc/ebdd3719-145a-4ed7-b0d4-b1610478bd78/scratch-2026-09-09-35bbf8/sierra-clone';
const esc = (s) => s.replace(/&/g, '&amp;');
// longest first
const entries = Object.entries(map).filter(([a, b]) => a !== b).sort((a, b) => b[0].length - a[0].length);
const SHAPES = [
  ['rounded-xl border border-transparent p-4', 'rounded-[20px] rounded-tl-[6px] border border-transparent p-4'],
  ['rounded-xl bg-gray-150 px-3 py-2.5', 'rounded-[16px] rounded-bl-[4px] bg-gray-150 px-3 py-2.5'],
  ['rounded-bl-[10px] border-b-[1.75px] border-l-[1.75px]', 'rounded-bl-[14px] border-b-[1.75px] border-l-[1.75px] border-dashed'],
];
const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function apply(s, jsx = false) {
  let n = 0;
  for (const [a, b] of entries) {
    const raw = jsx ? [[a, b], [esc(a), esc(b)], [a.replace(/'/g, '&#x27;'), b], [a.replace(/"/g, '&quot;'), b.replace(/"/g, '&quot;')]] : [[a, b], [esc(a), esc(b)]];
    const seen = new Set(); const variants = raw.filter(([x]) => x && !seen.has(x) && seen.add(x));
    for (const [x, y] of variants) {
      // short keys must match as whole text (between tag boundaries or punctuation), never inside other words
      const re = x.length <= 14 ? new RegExp('(?<![A-Za-z0-9-])' + rx(x) + '(?![A-Za-z0-9-])', 'g') : new RegExp(rx(x), 'g');
      if (re.test(s)) { s = s.replace(re, () => y); n++; }
    }
  }
  for (const [a, b] of SHAPES) s = s.split(a).join(b);
  return [s, n];
}
for (let i = 0; i < 6; i++) {
  const f = `${P}/public/moments/horizon-${i}.json`; const fr = JSON.parse(fs.readFileSync(f, 'utf8')); let tot = 0;
  for (const x of fr) { const [s, n] = apply(x.html); x.html = s; tot += n; }
  fs.writeFileSync(f, JSON.stringify(fr)); console.log('frames', i, 'replacements', tot);
}
const s01 = `${P}/components/pages/product-horizon/S01.tsx`; const [s, n] = apply(fs.readFileSync(s01, 'utf8'), true); fs.writeFileSync(s01, s); console.log('S01 replacements', n);
// leftover check: strings from the map's keys still present in frame 0 of each tab
const left = new Set();
for (let i = 0; i < 6; i++) { const fr = JSON.parse(fs.readFileSync(`${P}/public/moments/horizon-${i}.json`, 'utf8')); for (const [a] of entries) if (fr[0].html.includes(a) || fr[0].html.includes(esc(a))) left.add(a); }
console.log('unreplaced (frame 0):', [...left].slice(0, 10));
