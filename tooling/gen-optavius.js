// Generate Optavius site media with fal.ai: representative portraits (not likenesses), talking-head clips, hero clips, specialty stills.
const fs = require('fs'); const path = require('path');
const { falRun, download, imageToVideo, editImage } = require('./fal');
const P = 'C:/Users/peter/AppData/Roaming/Claude/scratch-workspaces/11f88b9f-a9bc-4623-98c2-159c4317abcc/ebdd3719-145a-4ed7-b0d4-b1610478bd78/scratch-2026-09-09-35bbf8/sierra-clone/public/optavius';
const G = P + '/gen'; fs.mkdirSync(G, { recursive: true });
const DONE = G + '/done.json'; const done = fs.existsSync(DONE) ? JSON.parse(fs.readFileSync(DONE, 'utf8')) : {};
const mark = (k) => { done[k] = true; fs.writeFileSync(DONE, JSON.stringify(done)); };
async function t2i(key, prompt, w, h) {
  if (done[key]) return; const res = await falRun('fal-ai/flux-pro/v1.1', { prompt, image_size: { width: w, height: h }, num_images: 1, output_format: 'jpeg', safety_tolerance: '2' });
  await download(res.images[0].url, `${G}/${key}.jpg`); mark(key); console.log('img ok', key);
}
const STYLE = 'natural light, editorial photography, shallow depth of field, muted premium colour grade, no text';
const PORTRAITS = [
  ['feike', 'Portrait of a friendly Dutch man in his early forties, short light-brown hair, light stubble, navy knit sweater, standing in a bright modern eye clinic reception with frames on the wall behind him, looking at the camera, ' + STYLE],
  ['rehan', 'Portrait of a confident South-Asian American ophthalmologist in his mid forties, short dark hair, white coat over a blue shirt, standing in a modern Texas eye clinic hallway, looking at the camera, ' + STYLE],
  ['tom', 'Portrait of a British eyewear founder in his late thirties, tortoiseshell glasses, dark hair, black crew-neck, standing in a minimalist London optical store with wooden shelves of spectacles behind him, looking at the camera, ' + STYLE],
];
const SCENES = [
  ['spec-ophthalmology', 'Ophthalmologist examining a patient at a slit lamp in a modern eye clinic, ' + STYLE, 1920, 1080],
  ['spec-optometry', 'Optometrist helping a customer choose frames in a bright minimalist optical store, ' + STYLE, 1920, 1080],
  ['spec-dermatology', 'Dermatologist in a bright modern clinic examining a patient skin with a dermatoscope, calm consultation room, ' + STYLE, 1920, 1080],
  ['spec-veterinary', 'Veterinarian at a modern veterinary clinic reception holding a small dog while a receptionist takes a phone call, ' + STYLE, 1920, 1080],
  ['hero-frontdesk', 'Front desk receptionist of an eye clinic smiling while a patient checks in, phone ringing on the desk, bright modern reception, ' + STYLE, 1920, 1080],
  ['hero-evening', 'Woman on her sofa in the evening calling her eye clinic on her mobile phone, warm lamp light, glasses on the table, ' + STYLE, 1920, 1080],
  ['hero-shop', 'Customer trying on glasses at a mirror in a modern eyewear store while an optician helps, ' + STYLE, 1920, 1080],
];
(async () => {
  const job = process.argv[2] || 'all';
  if (job === 'all' || job === 'images') {
    for (const [k, p] of PORTRAITS) { try { await t2i(k, p, 1024, 1280); } catch (e) { console.log('ERR', k, e.message.slice(0, 200)); } }
    for (const [k, p, w, h] of SCENES) { try { await t2i(k, p, w, h); } catch (e) { console.log('ERR', k, e.message.slice(0, 200)); } }
  }
  if (job === 'all' || job === 'videos') {
    for (const [k] of PORTRAITS) { const key = k + '-video'; if (done[key] || !fs.existsSync(`${G}/${k}.jpg`)) continue; try { await imageToVideo(`${G}/${k}.jpg`, 'The person talks calmly to the camera as if giving a short testimonial interview, natural head movement, slight smile, hands still, static camera', `${G}/${key}.mp4`, { duration: '10', aspect: '9:16' }); mark(key); console.log('vid ok', key); } catch (e) { console.log('ERR', key, e.message.slice(0, 200)); } }
    for (const k of ['hero-frontdesk', 'hero-evening', 'hero-shop']) { const key = k + '-video'; if (done[key] || !fs.existsSync(`${G}/${k}.jpg`)) continue; try { await imageToVideo(`${G}/${k}.jpg`, 'Subtle natural motion, people move slightly and talk, slow gentle camera push-in, realistic, calm', `${G}/${key}.mp4`, { duration: '10', aspect: '16:9' }); mark(key); console.log('vid ok', key); } catch (e) { console.log('ERR', key, e.message.slice(0, 200)); } }
    for (const k of ['spec-ophthalmology', 'spec-optometry', 'spec-dermatology', 'spec-veterinary']) { const key = k + '-video'; if (done[key] || !fs.existsSync(`${G}/${k}.jpg`)) continue; try { await imageToVideo(`${G}/${k}.jpg`, 'Subtle natural motion, slow gentle camera movement, people move slightly, realistic, calm', `${G}/${key}.mp4`, { duration: '5', aspect: '16:9' }); mark(key); console.log('vid ok', key); } catch (e) { console.log('ERR', key, e.message.slice(0, 200)); } }
  }
  console.log('done');
})();
