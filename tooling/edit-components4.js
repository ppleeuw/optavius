// Round 4 component edits. Run from the project root: node tooling/edit-components4.js
const fs = require("fs");
const R = (f, pairs) => { let s = fs.readFileSync(f, "utf8"); for (const [a, b] of pairs) { if (!s.includes(a)) console.log("MISSING", f, "::", a.slice(0, 90)); s = s.split(a).join(b); } fs.writeFileSync(f, s); };

// Sections: values shown open (About), related cards can zoom their mock
R("components/tpl/Sections.tsx", [
  ['<figure className="relative aspect-square w-full max-w-[350px] shrink-0 overflow-hidden rounded-xl bg-blue-100"><Mock name={c.mock} /></figure>', '<figure className="relative aspect-square w-full max-w-[350px] shrink-0 overflow-hidden rounded-xl bg-blue-100"><div className="absolute inset-0" style={c.zoom ? { transform: `scale(${c.zoom})`, transformOrigin: "50% 45%" } : undefined}><Mock name={c.mock} /></div></figure>'],
  ['/* ---------- Steps (live in 48 hours) ---------- */', `/* ---------- Values: three open columns (About) ---------- */
export function ValuesSection({ items }: { items: AccordionItem[] }) {
  return (
    <Section z={1}>
      <div className="grid grid-cols-12 gap-grid-gutter gap-y-8">
        {items.map((it) => (
          <div key={it.title} className="col-span-12 flex flex-col gap-4 rounded-3xl bg-surface-tertiary-100 p-6 md:col-span-4 md:p-8">
            {it.icon && <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-green-500"><Icon name={it.icon} className="h-5 w-5" /></span>}
            <h3 className="text-headline-sm text-primary">{it.title}</h3>
            <p className="text-body-sm text-secondary">{it.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Steps (live in 48 hours) ---------- */`],
]);

// Pages: about values open, demo page = booking, hero testimonial
R("components/site/Pages.tsx", [
  ['      <AccordionSection items={a.values} id="values" />', '      <ValuesSection items={a.values} />'],
  ['<DemoForm d={site.demo} logos={site.home.logos.logos} lang={lang} privacyLabel={site.ui.footer.legal[0].label} />', '<DemoBooking d={site.demo} logos={site.home.logos.logos} lang={lang} />'],
  ['      <Hero h={h.hero} lang={lang} />', '      <Hero h={h.hero} lang={lang} quote={h.quotes.items.find((q) => /north texas/i.test(q.logoAlt)) || h.quotes.items[0]} />'],
]);
let pg = fs.readFileSync("components/site/Pages.tsx", "utf8");
pg = pg.replace(/import DemoForm from "@\/components\/tpl\/DemoForm";/, 'import DemoBooking from "@/components/tpl/DemoBooking";');
if (!pg.includes("ValuesSection")) console.log("MISSING ValuesSection use");
pg = pg.replace(/(import \{[^}]*)(AccordionSection)([^}]*\} from "@\/components\/tpl\/Sections";)/, (m, a, b, c) => a + b + ", ValuesSection" + c);
fs.writeFileSync("components/site/Pages.tsx", pg);

// Shell: mount the booking pop-up
R("components/Shell.tsx", [
  ['import Enhancer from "./Enhancer";', 'import Enhancer from "./Enhancer";\nimport CalBooking from "./CalBooking";'],
  ['      <Enhancer />\n    </div>', '      <Enhancer />\n      <CalBooking lang={lang} />\n    </div>'],
]);

// Hero: testimonial next to the CTA
R("components/home/Hero.tsx", [
  ['import type { Bubble, Site } from "@/content/types";', 'import type { Bubble, Site, VideoQuote } from "@/content/types";'],
  ['export default function Hero({ h, lang }: { h: Site["home"]["hero"]; lang: string }) {', 'export default function Hero({ h, lang, quote }: { h: Site["home"]["hero"]; lang: string; quote?: VideoQuote }) {'],
  ['          <p className="mt-3 text-label-sm text-white/70">{h.note}</p>', `          <p className="mt-3 text-label-sm text-white/70">{h.note}</p>
          {quote && (
            <figure className="mt-8 hidden max-w-[44ch] items-start gap-3 border-l-2 border-white/40 pl-4 md:flex">
              <img alt="" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" src={quote.poster} />
              <div className="flex flex-col gap-1">
                <blockquote className="text-body-sm text-white/90">“{quote.quote}”</blockquote>
                <figcaption className="text-label-sm text-white/70">{quote.name}, {quote.role}</figcaption>
              </div>
            </figure>
          )}`],
]);

// Mock registry: pricing card illustration
R("components/mockups/Mock.tsx", [
  ['  "icon-pricing": () => <IconPillDark label="Simple monthly pricing" bg={BG.grey} />,', '  "icon-pricing": () => <IconPillDark label="Simple monthly pricing" bg={BG.grey} />,\n  "pricing-card": () => <C.PricingCard />,'],
]);
fs.appendFileSync("components/mockups/Cards.tsx", `
/** Pricing illustration: one monthly fee that follows results. */
export function PricingCard({ className = "" }: { className?: string }) {
  const rows: [string, string][] = [["Calls answered", "1,204"], ["Appointments booked", "212"], ["No-shows recovered", "38"], ["Order status confirmed", "156"]];
  return (
    <div className={"flex h-full w-full items-center justify-center bg-blue-100 p-[9%] " + className}>
      <Card title="Your monthly fee" accent="#006838" right={<Pill tone="ghost">Tied to results</Pill>} className="w-full">
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-[34px] leading-none tracking-tight text-gray-700">$299</span>
          <span className="text-[11px] text-gray-350">starting from, per month</span>
        </div>
        <ul className="mt-4 divide-y divide-gray-150 text-[11px]">
          {rows.map(([k, v]) => (
            <li key={k} className="flex items-center justify-between py-2"><span className="flex items-center gap-2 text-gray-700"><CheckIcon className="h-3 w-3 text-green-500" />{k}</span><span className="font-mono text-green-500">{v}</span></li>
          ))}
        </ul>
        <div className="mt-4 rounded-[12px] bg-green-50 px-3 py-2 text-[11px] text-green-500"><span className="font-medium">No results, no fee.</span> Unlimited users and minutes.</div>
      </Card>
    </div>
  );
}
`);

// Related "Console" card: the morning brief card instead of the cropped dashboard
for (const f of ["content/en.ts", "content/nl.ts", "content/de.ts"]) R(f, [['mock: "dashboard-full", linkLabel:', 'mock: "briefing", zoom: 1.1, linkLabel:']]);
console.log("done");
