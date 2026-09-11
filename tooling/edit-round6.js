// Round 6 edits. Run from the project root: node tooling/edit-round6.js
const fs = require("fs");
const R = (f, pairs) => { let s = fs.readFileSync(f, "utf8"); for (const [a, b] of pairs) { if (!s.includes(a)) console.log("MISSING", f, "::", a.slice(0, 90)); s = s.split(a).join(b); } fs.writeFileSync(f, s); };

// Logo: variant B, stroke 4 with straight ends
R("components/Logo.tsx", [
  ['stroke="currentColor" strokeWidth="5" strokeLinecap="round" />\n      </svg>\n      <span className="font-logo', 'stroke="currentColor" strokeWidth="4" strokeLinecap="butt" />\n      </svg>\n      <span className="font-logo'],
  ['stroke="currentColor" strokeWidth="5" strokeLinecap="round" />\n    </svg>\n  );\n}', 'stroke="currentColor" strokeWidth="4.4" strokeLinecap="butt" />\n    </svg>\n  );\n}'],
]);
fs.writeFileSync("public/optavius/logo-mark.svg", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.9 1.9 36.2 36.2"><path d="M34.7 12.6A16.5 16.5 0 1 0 34.7 27.4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="butt"/></svg>');
R("tooling/favicon.js", [
  ['stroke-width="${sw}" stroke-linecap="round"', 'stroke-width="${sw}" stroke-linecap="butt"'],
  ['stroke="#006838" stroke-width="5.2" stroke-linecap="round"', 'stroke="#006838" stroke-width="4" stroke-linecap="butt"'],
]);
R("tooling/og.js", [['stroke="#fff" stroke-width="4.6" stroke-linecap="round"', 'stroke="#fff" stroke-width="4" stroke-linecap="butt"']]);

// Nav: company menu under its button; no group headers in the product menu
R("components/Nav.tsx", [
  ['    <li key={k} className="group text-body-sm focus-within:outline-hidden" onMouseEnter={() => openMenu(k)} onMouseLeave={scheduleClose}>', '    <li key={k} className={"group text-body-sm focus-within:outline-hidden " + (k === "company" ? "relative" : "")} onMouseEnter={() => openMenu(k)} onMouseLeave={scheduleClose}>'],
  ['    company: () => (\n      <div role="menu" aria-orientation="vertical" className="absolute z-50 mt-7 flex justify-center right-0 left-0 h-1 w-full theme-base">', '    company: () => (\n      <div role="menu" aria-orientation="vertical" className="absolute z-50 mt-7 flex justify-start left-0 h-1 theme-base">'],
  ['                <p className="px-3 text-label-sm text-secondary">{g.label}</p>\n', ''],
]);

// Pricing: no pill; calculator shows what we typically see
R("components/tpl/Pricing.tsx", [['            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-label-md text-green-500"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />{p.from}</span>\n', '']]);
R("components/tpl/Calculator.tsx", [
  ['          <p className="text-label-sm text-secondary">{c.note}</p>', '          <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-4"><span className="text-headline-sm leading-none tabular-nums text-green-500">{c.typicalValue}</span><p className="text-body-sm text-primary">{c.typical}</p></div>\n          <p className="text-label-sm text-secondary">{c.note}</p>'],
]);
R("content/types.ts", [['recovered: string; revenue: string; note: string; currency: string;', 'recovered: string; revenue: string; typicalValue: string; typical: string; note: string; currency: string;']]);
const CALC = {
  en: ['note: "Recovered appointments = missed calls × 50% who never call back × 35% who wanted to book. Figures from 8,420 calls at Cubitts."', 'typicalValue: "20 to 30%", typical: "more appointments booked is what we typically see at clients in the first months.", note: "Recovered appointments = missed calls × 50% who never call back × 35% who wanted to book. Figures from actual clients."'],
  nl: ['note: "Teruggewonnen afspraken = gemiste oproepen × 50% die nooit terugbelt × 35% die wilde boeken. Cijfers uit 8.420 oproepen bij Cubitts."', 'typicalValue: "20 tot 30%", typical: "meer ingeplande afspraken is wat we in de eerste maanden bij klanten meestal zien.", note: "Teruggewonnen afspraken = gemiste oproepen × 50% die nooit terugbelt × 35% die wilde boeken. Cijfers van bestaande klanten."'],
  de: ['note: "Zurückgewonnene Termine = verpasste Anrufe × 50 %, die nie zurückrufen × 35 %, die buchen wollten. Zahlen aus 8.420 Anrufen bei Cubitts."', 'typicalValue: "20 bis 30 %", typical: "mehr gebuchte Termine sehen wir bei Kunden in den ersten Monaten typischerweise.", note: "Zurückgewonnene Termine = verpasste Anrufe × 50 %, die nie zurückrufen × 35 %, die buchen wollten. Zahlen von tatsächlichen Kunden."'],
};
// Demo audio: real durations (EN 47 s, NL 65 s; DE plays the EN recording); transcript timings scaled to fit
const DUR = { en: [47, "0:47"], nl: [65, "1:05"], de: [47, "0:47"] };
for (const lang of ["en", "nl", "de"]) {
  const f = `content/${lang}.ts`; let s = fs.readFileSync(f, "utf8");
  s = s.split(CALC[lang][0]).join(CALC[lang][1]); if (!s.includes("typicalValue")) console.log("MISSING calc", lang);
  const [secs, label] = DUR[lang]; const scale = (secs - 4) / 56;
  const a = s.indexOf("\n    demo: {"), b = s.indexOf("\n    },", a);
  let block = s.slice(a, b);
  block = block.replace(/duration: "1:47"/, `duration: "${label}"`).replace(/at: (\d+)/g, (m, n) => "at: " + Math.round(Number(n) * scale));
  s = s.slice(0, a) + block + s.slice(b); fs.writeFileSync(f, s); console.log(lang, "demo timings scaled", scale.toFixed(2));
}
console.log("done");
