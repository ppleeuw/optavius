// Round 8 edits. Run from the project root: node tooling/edit-round8.js
const fs = require("fs");
const R = (f, pairs) => { let s = fs.readFileSync(f, "utf8"); for (const [a, b] of pairs) { if (!s.includes(a)) console.log("MISSING", f, "::", a.slice(0, 90)); s = s.split(a).join(b); } fs.writeFileSync(f, s); };

// Customers hero: no logo on the big picture
let pg = fs.readFileSync("components/site/Pages.tsx", "utf8");
pg = pg.replace(/\s*<img alt=\{c\.heroImage\.logoAlt\}[^\n]*\n/, "\n");
// Agent library: no class pill, no starting price
pg = pg.replace(/\s*<div className="flex items-center justify-between">\n\s*<span className=\{"inline-flex items-center gap-1\.5 rounded-full px-2\.5 py-1 text-label-sm " \+ \(a\.cls === "voice"[\s\S]*?<span className="text-label-sm text-secondary">\{a\.from\}<\/span>\n\s*<\/div>\n/, "\n");
if (pg.includes("{a.from}")) console.log("library cleanup incomplete");
fs.writeFileSync("components/site/Pages.tsx", pg);
const LEDE = {
  en: ['lede: "Every agent has one job, a class and a starting price. Voice agents are per location, digital agents per organisation."', 'lede: "Every agent has one job. Start with one, add the next in a click."'],
  nl: [/lede: "Elke agent heeft één taak, een klasse en een startprijs\.[^"]*"/, 'lede: "Elke agent heeft één taak. Begin met één en voeg de volgende met één klik toe."'],
  de: [/lede: "Jeder Agent hat eine Aufgabe, eine Klasse und einen Startpreis\.[^"]*"/, 'lede: "Jeder Agent hat eine Aufgabe. Beginnen Sie mit einem und fügen Sie den nächsten mit einem Klick hinzu."'],
};
for (const lang of ["en", "nl", "de"]) { let s = fs.readFileSync(`content/${lang}.ts`, "utf8"); const before = s; s = s.replace(LEDE[lang][0], LEDE[lang][1]); if (s === before) console.log("library lede not found", lang); fs.writeFileSync(`content/${lang}.ts`, s); }

// Carousel: drag left or right moves it
R("components/CustomerStories.tsx", [
  ['  const wrapRef = useRef<HTMLDivElement>(null);', '  const wrapRef = useRef<HTMLDivElement>(null);\n  const drag = useRef<{ x: number; moved: boolean } | null>(null);'],
  ['        <div className="touch-pan-y overflow-hidden [clip-path:inset(-100px_0)]">', `        <div className="touch-pan-y overflow-hidden [clip-path:inset(-100px_0)]"
          onPointerDown={(e) => { drag.current = { x: e.clientX, moved: false }; }}
          onPointerMove={(e) => { if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true; }}
          onPointerUp={(e) => { const d = drag.current; drag.current = null; if (!d) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); }}
          onPointerCancel={() => { drag.current = null; }}
          onClickCapture={(e) => { if (drag.current?.moved) { e.stopPropagation(); e.preventDefault(); } }}>`],
]);

// Calculator: hint under the missed-calls slider instead of the green box
R("components/tpl/Calculator.tsx", [
  ['  const slider = (label: string, out: string, v: number, set: (x: number) => void, min: number, max: number, step: number) => (\n    <label className="flex flex-col gap-2">', '  const slider = (label: string, out: string, v: number, set: (x: number) => void, min: number, max: number, step: number, hint?: string) => (\n    <label className="flex flex-col gap-2">'],
  ['className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-green-500" />\n    </label>', 'className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-green-500" />\n      {hint && <span className="text-label-sm text-secondary">{hint}</span>}\n    </label>'],
  ['{slider(c.missed, missed + "%", missed, setMissed, 5, 50, 1)}', '{slider(c.missed, missed + "%", missed, setMissed, 5, 50, 1, c.typical)}'],
  ['          <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-4"><span className="text-headline-sm leading-none tabular-nums text-green-500">{c.typicalValue}</span><p className="text-body-sm text-primary">{c.typical}</p></div>\n', ''],
]);
R("content/types.ts", [['typicalValue: string; typical: string;', 'typical: string;']]);
const TYP = {
  en: [/typicalValue: "[^"]*", typical: "[^"]*"/, 'typical: "We typically see 20 to 30% at practices before they start."'],
  nl: [/typicalValue: "[^"]*", typical: "[^"]*"/, 'typical: "Bij praktijken zien we meestal 20 tot 30% voordat ze starten."'],
  de: [/typicalValue: "[^"]*", typical: "[^"]*"/, 'typical: "Bei Praxen sehen wir vor dem Start typischerweise 20 bis 30 %."'],
};
for (const lang of ["en", "nl", "de"]) { let s = fs.readFileSync(`content/${lang}.ts`, "utf8"); s = s.replace(TYP[lang][0], TYP[lang][1]); fs.writeFileSync(`content/${lang}.ts`, s); }
R("content/nl.ts", [
  ['recovered: "teruggewonnen afspraken per maand", revenue: "teruggewonnen omzet per maand"', 'recovered: "extra afspraken per maand", revenue: "extra omzet per maand"'],
  ['note: "Teruggewonnen afspraken = gemiste oproepen', 'note: "Extra afspraken = gemiste oproepen'],
]);

// Bento: light green first card with dark text
R("components/home/Bento.tsx", [
  ['  green: "aspect-4/5 md:col-span-6 xl:col-span-12 xl:aspect-1112/500 bg-bento-teal",', '  green: "aspect-4/5 md:col-span-6 xl:col-span-12 xl:aspect-1112/500 bg-bento-mint text-primary",'],
  ['<h3 className="z-10 place-self-start pr-12 text-headline-sm text-white">{c.title}</h3>', '<h3 className={"z-10 place-self-start pr-12 text-headline-sm " + (c.id === "green" ? "text-primary" : "text-white")}>{c.title}</h3>'],
  ['<p className={"z-10 text-white transition-opacity md:absolute', '<p className={"z-10 transition-opacity md:absolute " + (c.id === "green" ? "text-primary " : "text-white ")'],
]);
fs.appendFileSync("app/styles/extra.css", "\n.bg-bento-mint{background:linear-gradient(130deg,#e6f3ea 0%,#c4e3cf 100%)}\n");

// Integrations diagram: square stage so the nodes sit at the line ends
R("components/mockups/Cards.tsx", [
  ['      <div className="relative h-[70%] w-[70%]">\n        {nodes.map(([n, c], i) => {', '      <div className="relative aspect-square h-[72%] max-w-[72%]">\n        {nodes.map(([n, c], i) => {'],
  // Account card: light variant
  ['export function AccountCard({ className = "", title = "Patient details", lines = ["Send all of your patient’s prescription details.", "Encrypted in transit and at rest."] }: { className?: string; title?: string; lines?: string[] }) {\n  return (\n    <div className={"flex h-full w-full flex-col justify-end bg-[#1b2624] p-[8%] text-white " + className}>\n      <div className="mb-4 text-[15px] font-medium">{title}</div>\n      <div className="flex flex-col gap-2">\n        {lines.map((l, i) => (\n          <Bubble key={l} dark side={i % 2 ? "user" : "agent"} name={i % 2 ? undefined : "Agent"}>{l}</Bubble>\n        ))}\n      </div>\n      <div className="mt-4"><AskBar dark placeholder="Ask anything…" /></div>',
   'export function AccountCard({ className = "", title = "Patient details", lines = ["Send all of your patient’s prescription details.", "Encrypted in transit and at rest."], light = false }: { className?: string; title?: string; lines?: string[]; light?: boolean }) {\n  return (\n    <div className={"flex h-full w-full flex-col justify-end p-[8%] " + (light ? "bg-blue-100 text-gray-700 " : "bg-[#1b2624] text-white ") + className} style={light ? dottedBg : undefined}>\n      <div className="mb-4 text-[15px] font-medium">{title}</div>\n      <div className="flex flex-col gap-2">\n        {lines.map((l, i) => (\n          <Bubble key={l} dark={!light} side={i % 2 ? "user" : "agent"} name={i % 2 ? undefined : "Agent"}>{l}</Bubble>\n        ))}\n      </div>\n      <div className="mt-4"><AskBar dark={!light} placeholder="Ask anything…" /></div>'],
]);
R("components/mockups/Mock.tsx", [['  "governance-dark": () =>', '  "governance": () => <C.AccountCard light title="Data governance" lines={["Let me look into this for you. What was the date of your last exam?", "It was in March. I’d like my records sent to my new optometrist."]} />,\n  "governance-dark": () =>']]);
for (const f of ["content/en.ts", "content/nl.ts", "content/de.ts"]) R(f, [['media: { kind: "mock", name: "governance-dark" }', 'media: { kind: "mock", name: "governance" }']]);

// Dashboard chart: keep the end marker inside the drawing
R("components/mockups/Dashboard.tsx", [
  ['  const xs = points.map((_, i) => (i / (points.length - 1)) * w);\n  const ys = points.map((p) => h - (p / 100) * h);', '  const pad = 6;\n  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - 2 * pad));\n  const ys = points.map((p) => pad + (h - 2 * pad) - (p / 100) * (h - 2 * pad));'],
]);
console.log("done");
