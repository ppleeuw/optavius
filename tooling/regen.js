// Batch regeneration. usage: node regen.js images|videos [indices...]
const fs = require('fs'); const path = require('path'); const sharp = require('sharp');
const { editImage, imageToVideo } = require('./fal');
const { images, videos } = require('./regen-manifest');
const { chromium } = require('playwright');
const P = 'C:/Users/peter/AppData/Roaming/Claude/scratch-workspaces/11f88b9f-a9bc-4623-98c2-159c4317abcc/ebdd3719-145a-4ed7-b0d4-b1610478bd78/scratch-2026-09-09-35bbf8/sierra-clone';
const inv = fs.readFileSync('ref/inventory.tsv', 'utf8').trim().split('\n').map(l => l.split('\t')).filter(r => !/\.riv$/.test(r[0])); // same order as the contact sheets
const doneFile = 'ref/regen-done.json'; const done = fs.existsSync(doneFile) ? JSON.parse(fs.readFileSync(doneFile)) : {};
const save = () => fs.writeFileSync(doneFile, JSON.stringify(done, null, 1));
const SG = 'C:/Users/peter/AppData/Local/Temp/sgen';
const mode = process.argv[2]; const only = process.argv.slice(3).map(Number);

async function runImages() {
  const jobs = images.filter(([i]) => !only.length || only.includes(i)).filter(([i]) => !done['img' + i]);
  let active = 0; let idx = 0; const errors = [];
  await new Promise((resolve) => {
    const next = () => {
      if (idx >= jobs.length && active === 0) return resolve();
      while (active < 3 && idx < jobs.length) {
        const [i, prompt] = jobs[idx++]; active++;
        const url = inv[i][0]; const src = P + '/public/media-orig' + url.replace('/media', ''); const dest = P + '/public' + url;
        editImage(src, prompt, dest).then(() => { done['img' + i] = url; save(); console.log('img ok', i, url.slice(-40)); }).catch(e => { errors.push([i, e.message]); console.log('img ERR', i, e.message.slice(0, 120)); }).finally(() => { active--; next(); });
      }
    };
    next();
  });
  console.log('images done; errors', errors.length);
}

async function runVideos() {
  const jobs = videos.filter(([i]) => !only.length || only.includes(i)).filter(([i]) => !done['vid' + i]);
  const b = await chromium.launch(); const page = await b.newPage(); await page.goto('http://localhost:3200/blank.html');
  const frame = require('./frame');
  let active = 0; let idx = 0; const errors = [];
  await new Promise((resolve) => {
    const next = () => {
      if (idx >= jobs.length && active === 0) return resolve();
      while (active < 2 && idx < jobs.length) {
        const [i, spec] = jobs[idx++]; active++;
        (async () => {
          const url = inv[i][0]; const dest = P + '/public' + url;
          const fr = path.join(SG, `f${i}.png`);
          const info = await frame(page, url.replace('/media', '/media-orig') , spec.t ?? 0.5, fr);
          const still = path.join(SG, `s${i}.jpg`);
          await editImage(fr, spec.still, still);
          // aspect for kling: 16:9, 9:16 or 1:1
          const r = info.w / info.h; const aspect = r > 1.3 ? '16:9' : r < 0.77 ? '9:16' : '1:1';
          const out = path.join(SG, `v${i}.mp4`);
          await imageToVideo(still, spec.motion, out, { aspect });
          fs.copyFileSync(out, dest);
          // poster (for wistia) if exists
          const posterPath = dest.replace(/\.mp4$/, '.jpg'); if (/wistia/.test(dest)) { await sharp(still).jpeg({ quality: 85 }).toFile(path.join(SG, `p${i}.jpg`)); fs.copyFileSync(path.join(SG, `p${i}.jpg`), posterPath); }
          done['vid' + i] = url; save(); console.log('vid ok', i, url.slice(-40), info.w + 'x' + info.h, aspect);
        })().catch(e => { errors.push([i, e.message]); console.log('vid ERR', i, e.message.slice(0, 160)); }).finally(() => { active--; next(); });
      }
    };
    next();
  });
  await b.close();
  console.log('videos done; errors', errors.length);
}

(mode === 'images' ? runImages() : runVideos()).catch(e => { console.error(e); process.exit(1); });
