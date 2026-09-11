// Round 5 edits. Run from the project root: node tooling/edit-round5.js
const fs = require("fs");
const R = (f, pairs) => { let s = fs.readFileSync(f, "utf8"); for (const [a, b] of pairs) { if (!s.includes(a)) console.log("MISSING", f, "::", a.slice(0, 90)); s = s.split(a).join(b); } fs.writeFileSync(f, s); };

// Hero: quote without the portrait
R("components/home/Hero.tsx", [['              <img alt="" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" src={quote.poster} />\n', ""]]);

// Customer carousel: no play button, no arrows; small tiles move to the middle, the big tile opens the story
let cs = fs.readFileSync("components/CustomerStories.tsx", "utf8");
cs = cs.replace(/\s*\{isActive && \(\n\s*<span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">[\s\S]*?<\/span>\n\s*\)\}\n/, "\n");
cs = cs.replace(/\s*\{isActive && \(\n\s*<button aria-label=\{s\.label\} className="group absolute inset-x-0 top-1\/2 z-50[\s\S]*?<\/button>\n\s*\)\}\n/, "\n");
cs = cs.replace('<div aria-hidden="true" className={"absolute inset-0 z-40 md:hidden " + (isActive ? "pointer-events-none" : "cursor-pointer")} onClick={() => !isActive && go(d)}></div>', '<div aria-hidden="true" className="absolute inset-0 z-40 cursor-pointer md:hidden" onClick={() => (isActive ? (window.location.href = s.href) : go(d))}></div>');
cs = cs.replace(/\s*<div className="mx-auto w-full max-w-\[1726px\] px-container-margin">\n\s*<div className="flex justify-end gap-1 pt-4">[\s\S]*?<\/div>\n\s*<\/div>\n(\s*<\/section>)/, "\n$1");
cs = cs.replace(/function PlayIcon\(\) \{[\s\S]*?\n\}\n/, "").replace(/function Chevron\(\{ className \}[\s\S]*?\n\}\n/, "").replace(/const PLAY_BTN =\n[^\n]*\n/, "").replace(/\nfunction StoryVideo[\s\S]*$/, "\n");
if (cs.includes("PLAY_BTN") || cs.includes("Previous slide")) console.log("carousel cleanup incomplete");
fs.writeFileSync("components/CustomerStories.tsx", cs);

// Language menu: keep the hover area continuous so the panel does not close while moving to it
R("components/Nav.tsx", [
  ['        <div className="absolute right-0 z-50 mt-2 flex min-w-[180px] flex-col gap-1 rounded-2xl border border-primary bg-white p-2 theme-base nav-menu-enter">', '        <div className="absolute top-full right-0 z-50 pt-3"><div className="flex min-w-[180px] flex-col gap-1 rounded-2xl border border-primary bg-white p-2 theme-base nav-menu-enter">'],
  ['              <span className="text-label-sm text-secondary">{l.toUpperCase()}</span>\n            </a>\n          ))}\n        </div>\n      )}', '              <span className="text-label-sm text-secondary">{l.toUpperCase()}</span>\n            </a>\n          ))}\n        </div></div>\n      )}'],
]);

// Feature split: smaller visual beside the text; the eye keeps its size with the text centred on it
R("components/tpl/Sections.tsx", [
  [`export function FeatureSplitSection({ s, z = 3 }: { s: FeatureSplit; z?: number }) {
  const right = (s.mediaSide || "right") === "right";
  return (
    <Section theme={s.tone === "product" ? "theme-product" : "theme-base"} z={z}>
      <LeftHead title={s.title} lede={s.lede} pad={s.lede ? "pb-8 md:pb-14 xl:pb-14" : "pb-12 md:pb-20 xl:pb-14"} />
      <div className="grid grid-cols-12 gap-grid-gutter gap-y-6">
        <div className={"relative col-span-12 md:col-span-7 md:row-start-1 " + (right ? "md:col-start-6" : "md:col-start-1")}>
          <figure className={"relative aspect-square overflow-hidden rounded-2xl " + (s.media.kind === "mock" && s.media.name === "eye" ? "bg-white" : "bg-gray-200 theme-tech:bg-gray-700 theme-platform:bg-gray-100")}>
            <MediaFill media={s.media} />
          </figure>
        </div>
        <div className={"relative col-span-12 md:col-span-4 md:row-start-1 " + (right ? "md:col-start-1" : "md:col-start-9")}>
          <ul className="flex flex-col gap-8">`,
  `export function FeatureSplitSection({ s, z = 3 }: { s: FeatureSplit; z?: number }) {
  const right = (s.mediaSide || "right") === "right";
  const eye = s.media.kind === "mock" && s.media.name === "eye";
  const mediaCol = eye ? "md:col-span-7 " + (right ? "md:col-start-6" : "md:col-start-1") : "md:col-span-6 xl:col-span-5 " + (right ? "md:col-start-7 xl:col-start-8" : "md:col-start-1");
  const textCol = eye ? "md:col-span-4 " + (right ? "md:col-start-1" : "md:col-start-9") : "md:col-span-5 " + (right ? "md:col-start-1" : "md:col-start-8");
  return (
    <Section theme={s.tone === "product" ? "theme-product" : "theme-base"} z={z}>
      <LeftHead title={s.title} lede={s.lede} pad={s.lede ? "pb-8 md:pb-14 xl:pb-14" : "pb-12 md:pb-20 xl:pb-14"} />
      <div className="grid grid-cols-12 gap-grid-gutter gap-y-6">
        <div className={"relative col-span-12 md:row-start-1 " + mediaCol}>
          <figure className={"relative aspect-square overflow-hidden rounded-2xl " + (eye ? "bg-white" : "bg-gray-200 theme-tech:bg-gray-700 theme-platform:bg-gray-100")}>
            <MediaFill media={s.media} />
          </figure>
        </div>
        <div className={"relative col-span-12 md:row-start-1 md:self-center " + textCol}>
          <ul className={"flex flex-col " + (eye ? "gap-10 xl:gap-14" : "gap-8")}>`],
]);

// Integrations: the "+20 partners" line below the groups, not inside the last one
R("components/site/Pages.tsx", [
  ['              {gi === lg.groups.length - 1 && <li className="flex h-16 items-center rounded-xl border border-dashed border-gray-250 px-4 text-body-sm text-secondary">{lg.more}</li>}\n', ""],
  ['        {lg.groups.map((g, gi) => (', '        {lg.groups.map((g) => ('],
]);
let pg = fs.readFileSync("components/site/Pages.tsx", "utf8");
// close of the groups loop: add the line after it
pg = pg.replace(/(\{lg\.groups\.map\(\(g\) => \([\s\S]*?\n        \)\)\}\n)/, '$1        <p className="pt-2 text-body-sm text-secondary">{lg.more}</p>\n');
fs.writeFileSync("components/site/Pages.tsx", pg);

// Pricing: three light cards
R("components/tpl/Pricing.tsx", [
  ['className={"col-span-12 flex flex-col gap-4 rounded-3xl p-6 md:col-span-4 md:p-8 " + (i === 2 ? "bg-green-800 text-white theme-tech" : "bg-surface-tertiary-100 text-primary")}', 'className="col-span-12 flex flex-col gap-4 rounded-3xl bg-surface-tertiary-100 p-6 text-primary md:col-span-4 md:p-8"'],
  ['<span className={"flex h-11 w-11 items-center justify-center rounded-full " + (i === 2 ? "bg-white/15 text-white" : "bg-white text-green-500")}>', '<span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-green-500">'],
  ['<p className={"text-body-sm " + (i === 2 ? "text-white/80" : "text-secondary")}>{it.text}</p>', '<p className="text-body-sm text-secondary">{it.text}</p>'],
  ['{p.how.items.map((it, i) => (', '{p.how.items.map((it) => ('],
]);

// Calculator: two outputs, no plan price, no net line
R("components/tpl/Calculator.tsx", [
  ['  const net = rev - c.planCost;\n', ''],
  [`          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1"><span className="text-headline-md leading-none tabular-nums text-green-500">{n(rec)}</span><span className="text-body-sm text-secondary">{c.recovered}</span></div>
            <div className="flex flex-col gap-1"><span className="text-headline-md leading-none tabular-nums text-green-500">{money(rev)}</span><span className="text-body-sm text-secondary">{c.revenue}</span></div>
            <div className="flex flex-col gap-1"><span className="text-headline-md leading-none tabular-nums text-primary">{c.planPrice}</span><span className="text-body-sm text-secondary">{c.plan}</span></div>
            <div className="flex flex-col gap-1 rounded-2xl bg-green-800 p-4 text-white"><span className="text-headline-md leading-none tabular-nums">{money(Math.max(0, net))}</span><span className="text-body-sm text-white/80">{c.net}</span></div>
          </div>`, `          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-2xl bg-surface-tertiary-100 p-5"><span className="text-headline-lg leading-none tabular-nums text-green-500">{n(rec)}</span><span className="text-body-sm text-secondary">{c.recovered}</span></div>
            <div className="flex flex-col gap-2 rounded-2xl bg-green-800 p-5 text-white"><span className="text-headline-lg leading-none tabular-nums">{money(rev)}</span><span className="text-body-sm text-white/80">{c.revenue}</span></div>
          </div>`],
]);
R("content/types.ts", [['recovered: string; revenue: string; plan: string; planPrice: string; planCost: number; net: string; note: string;', 'recovered: string; revenue: string; note: string;']]);
for (const f of ["content/en.ts", "content/nl.ts", "content/de.ts"]) {
  let s = fs.readFileSync(f, "utf8");
  s = s.replace(/, plan: "[^"]*", planPrice: "[^"]*", planCost: \d+, net: "[^"]*"/, "");
  // product "Your voice agent": the call card; integrations hero: a mock instead of the video; phone section: a call card
  s = s.replace('media: { kind: "mock", name: "dark-chat", zoom: 1.15 }', 'media: { kind: "mock", name: "agent-frontdesk" }');
  s = s.replace('media: { kind: "video", src: VIDEOS.context.video, poster: VIDEOS.context.poster }', 'media: { kind: "mock", name: "integrations" }');
  s = s.replace('media: { kind: "mock", name: "hz-proactive" }, features: [\n        { icon: "phone"', 'media: { kind: "mock", name: "voice-green" }, features: [\n        { icon: "phone"');
  fs.writeFileSync(f, s);
  console.log(f, "planCost left:", (s.match(/planCost/g) || []).length, "context video left:", (s.match(/VIDEOS\.context/g) || []).length, "hz-proactive left:", (s.match(/hz-proactive/g) || []).length);
}

// Favicons in metadata
R("app/layout.tsx", [['  icons: { icon: "/icon.svg" },', '  icons: { icon: [{ url: "/favicon.ico", sizes: "32x32" }, { url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon.png" },']]);
R("app/[[...slug]]/page.tsx", [['alternates: { languages }, icons: { icon: "/icon.svg" },', 'alternates: { languages }, icons: { icon: [{ url: "/favicon.ico", sizes: "32x32" }, { url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon.png" },']]);
console.log("done");
