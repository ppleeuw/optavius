# Media regeneration tooling

Scripts used to regenerate photos/videos (fal.ai) and to swap product mockups for eye-care components.
They expect `FAL_KEY` in the environment and `playwright`, `sharp`, `parse5` installed (`npm i playwright sharp parse5`).

- `node static.js ../public 3200` — serves `public/` (including `media-orig`) for frame extraction.
- `node regen.js images` / `node regen.js videos` — regenerates the assets listed in `regen-manifest.js`
  (indices refer to `ref/inventory.tsv` rows, riv files excluded). Progress is tracked in `ref/regen-done.json`,
  so re-running resumes where the fal.ai balance ran out.
- `node mockswap.js` — replaces mockup media in generated sections with `<Mock/>` / `<Overlay/>` components.
- `node horizon-apply.js` — applies `horizon-map.js` (eye-care copy) to the Horizon timeline frames and panels.
