// Inventory of media used by the components: url, description (alt / wistia name), components, size
const fs = require('fs'), path = require('path');
const P = 'C:/Users/peter/AppData/Roaming/Claude/scratch-workspaces/11f88b9f-a9bc-4623-98c2-159c4317abcc/ebdd3719-145a-4ed7-b0d4-b1610478bd78/scratch-2026-09-09-35bbf8/sierra-clone';
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.tsx$/.test(f)) files.push(p); } })(P + '/components');
const used = {}, alts = {};
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8'); const rel = path.relative(P + '/components', f).split(path.sep).join('/');
  for (const m of s.matchAll(/(?:src|poster)=\"(\/media\/[^\"]+)\"/g)) { const u = m[1].split('#')[0]; (used[u] = used[u] || new Set()).add(rel); }
  for (const m of s.matchAll(/<WistiaBg id=\"([a-z0-9]+)\"/g)) { const u = '/media/wistia/' + m[1] + '.mp4'; (used[u] = used[u] || new Set()).add(rel); }
  for (const m of s.matchAll(/riv: \"(\/media\/[^\"]+)\"/g)) { (used[m[1]] = used[m[1]] || new Set()).add(rel); }
  for (const m of s.matchAll(/video: \"(\/media\/[^\"]+)\"/g)) { (used[m[1]] = used[m[1]] || new Set()).add(rel); }
  for (const m of s.matchAll(/<img ([^>]*)>/g)) { const a = m[1]; const src = (a.match(/src=\"([^\"]+)\"/) || [])[1]; const alt = a.match(/alt=(?:\"([^\"]*)\"|\{\"((?:[^\"\\]|\\.)*)\"\})/) || []; if (src) alts[src.split('#')[0]] = (alt[1] || alt[2] || '').slice(0, 90); }
}
// moments frames reference media too
for (let i = 0; i < 6; i++) { try { const fr = JSON.parse(fs.readFileSync(P + `/public/moments/horizon-${i}.json`)); for (const m of fr[0].html.matchAll(/src=\"(\/media\/[^\"]+)\"/g)) { const u = m[1].split('#')[0]; (used[u] = used[u] || new Set()).add(`moments/horizon-${i}`); } } catch {} }
const wist = JSON.parse(fs.readFileSync('ref/wistia.json'));
const rows = Object.entries(used).map(([u, set]) => { let size = 0; try { size = fs.statSync(P + '/public' + u).size; } catch {} const id = (u.match(/wistia\/([a-z0-9]+)\.mp4/) || [])[1]; return [u, id ? ((wist[id] || {}).name || '') : (alts[u] || ''), [...set].join(','), size]; });
rows.sort((a, b) => a[2].localeCompare(b[2]) || a[0].localeCompare(b[0]));
fs.writeFileSync('ref/inventory.tsv', rows.map(r => r.join('\t')).join('\n'));
const byType = {}; for (const r of rows) { const ext = path.extname(r[0]); byType[ext] = (byType[ext] || 0) + 1; }
console.log('assets used', rows.length, JSON.stringify(byType));
