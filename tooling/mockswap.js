// Replace product-mockup media in generated section components with eye-care <Mock/> components / <Overlay/>s.
// Idempotent: run after (re)building pages.
const fs = require('fs'); const path = require('path');
const P = 'C:/Users/peter/AppData/Roaming/Claude/scratch-workspaces/11f88b9f-a9bc-4623-98c2-159c4317abcc/ebdd3719-145a-4ed7-b0d4-b1610478bd78/scratch-2026-09-09-35bbf8/sierra-clone';
const inv = fs.readFileSync('ref/inventory.tsv', 'utf8').trim().split('\n').map(l => l.split('\t')).filter(r => !/\.riv$/.test(r[0]));
// sheet index -> mock name | 'remove' | '@overlay'
const MAP = {
  47: 'gw-build', 48: 'gw-optimize', 49: 'ins-monitors', 50: 'ins-explorer', 51: 'ins-experiments', 52: 'ins-observability', 53: 'hz-context', 54: 'hz-optimization', 55: 'hz-proactive', 56: 'hz-planning',
  97: 'phone-street',
  163: 'remove', 164: 'phone-wealth', 165: 'remove', 166: 'phone-banking', 167: 'remove', 168: 'phone-insurance', 169: 'remove', 170: 'phone-mortgage',
  172: 'remove', 173: 'voice-blue',
  196: 'phone-desk', 198: 'remove', 199: 'voice-orange', 208: 'phone-desk-2', 210: 'remove', 211: 'voice-orange', 221: 'phone-desk-3', 223: 'remove', 224: 'voice-orange', 229: 'phone-desk', 231: 'remove', 232: 'voice-orange',
  236: 'remove', 237: 'phone-ota', 238: 'remove', 239: 'phone-airlines', 240: 'remove', 241: 'phone-hotels', 243: 'remove', 244: 'voice-blue',
  255: 'remove', 256: 'agent-studio-hero', 257: 'remove', 258: 'journeys', 259: 'remove', 260: 'knowledge', 262: 'remove', 263: 'integrations', 264: 'remove', 265: 'simulations', 266: 'remove', 267: 'brand',
  268: 'remove', 269: 'channels-hero', 270: 'remove', 271: 'voice-dark', 275: 'email', 276: 'service-ui', 277: 'chat-app', 278: 'remove', 279: 'remove',
  282: 'memory', 283: 'history', 286: 'icon-ghost', 287: 'icon-horizon',
  288: 'remove', 289: 'explorer-table', 290: 'briefing', 291: 'briefing-compact', 292: 'insights-query', 294: 'recommendations', 297: 'chat-bubbles',
  300: 'remove', 301: 'ghostwriter-build', 302: 'ghostwriter-build', 303: 'recommendations', 304: 'icon-ghost', 308: 'workflow', 311: 'workflow-memory', 312: 'activity',
  315: 'remove', 316: 'reporting', 317: 'remove', 318: 'retention',
  324: 'remove', 325: 'account-dark', 326: 'remove', 327: 'governance-dark', 329: 'remove', 330: 'voice-green', 331: 'remove', 332: 'constellation', 333: 'policies', 334: 'email',
  337: 'remove', 338: 'dark-chat', 341: 'icon-pricing', 342: 'ghostwriter-build', 343: 'explorer-table',
  // overlays on regenerated people videos
  159: '@fin-hero', 175: '@healthcare-hero', 193: '@media-hero', 202: '@retail-hero', 217: '@tech-hero', 228: '@telecom-hero', 235: '@travel-hero',
  248: '@ind-financial', 249: '@ind-healthcare', 250: '@ind-telecom', 273: '@channels-chat', 281: '@context-sky', 285: '@context-phone', 296: '@explorer-demo', 299: '@ghost-pill',
  323: '@trust-hero', 336: '@product-hero', 340: '@product-social',
};
// wistia ids only referenced from tab panels
const WISTIA = { '01hpe8szgn': 'bubbles-forest', '8g9eaqfetc': 'bubbles-green', 'k4ubmgvt7c': 'bubbles-sunset', 'x3l4qibl6b': 'bubbles-rose', 'a3ih3a4znr': 'context-sky', 'b8oa8s08ir': 'encrypted' };

const byFile = {};
for (const [i, v] of Object.entries(MAP)) { const url = inv[i][0]; byFile[url] = v; }
for (const [id, v] of Object.entries(WISTIA)) { byFile['/media/wistia/' + id + '.mp4'] = v; byFile['/media/wistia/' + id + '.jpg'] = 'remove'; }

function walk(d, out = []) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p, out); else if (/\.tsx$/.test(f) && !/Hero|MeetSierra|Bento/.test(f)) out.push(p); } return out; }
const files = walk(P + '/components/pages').concat(walk(P + '/components/home'));
let total = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8'); const orig = s; let usedMock = false, usedOverlay = false;
  for (const [url, v] of Object.entries(byFile)) {
    const wid = (url.match(/wistia\/([a-z0-9]+)\.mp4/) || [])[1];
    if (!(s.includes(url) || (wid && s.includes(`id="${wid}"`)))) continue;
    const esc = url.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    if (/\.mp4$/.test(url)) {
      const id = (url.match(/wistia\/([a-z0-9]+)\.mp4/) || [])[1];
      if (id) {
        const re = new RegExp(`<WistiaBg id="${id}"[^>]*/>`, 'g');
        if (v.startsWith('@')) { s = s.replace(re, m => `${m}<Overlay name="${v.slice(1)}" />`); usedOverlay = true; }
        else { s = s.replace(re, `<Mock name="${v}" />`); usedMock = true; }
      } else {
        // sanity <video ... src="/media/x.mp4#t=0.001"></video>
        const re = new RegExp(`(<video [^>]*src="${esc}[^"]*"[^>]*>(?:</video>)?)`, 'g');
        if (v.startsWith('@')) { s = s.replace(re, (m) => `${m}<Overlay name="${v.slice(1)}" />`); usedOverlay = true; }
        else { s = s.replace(re, `<Mock name="${v}" />`); usedMock = true; }
      }
    } else {
      // <img ... src="url" ... />
      const re = new RegExp(`<img [^>]*src="${esc}"[^>]*/>`, 'g');
      s = s.replace(re, (m) => {
        if (v === 'remove') return '';
        const fill = /position:\s*"absolute"|absolute/.test(m);
        if (fill) { usedMock = true; return `<Mock name="${v}" />`; }
        const w = (m.match(/ width="?(\d+)"?/) || [])[1], h = (m.match(/ height="?(\d+)"?/) || [])[1];
        const cls = (m.match(/className="([^"]*)"/) || [, ''])[1];
        usedMock = true;
        return `<div className="relative w-full ${cls.replace(/\bh-auto\b|\bblock\b/g, '').trim()}" style={{ aspectRatio: "${w || 1} / ${h || 1}" }}><Mock name="${v}" /></div>`;
      });
    }
  }
  if (s !== orig) {
    if (usedMock && !s.includes('import Mock from')) s = 'import Mock from "@/components/mockups/Mock";\n' + s;
    if (usedOverlay && !s.includes('import Overlay from')) s = 'import Overlay from "@/components/mockups/Overlay";\n' + s;
    fs.writeFileSync(f, s); total++;
    console.log('swapped', path.relative(P + '/components', f));
  }
}
console.log('files changed', total);
