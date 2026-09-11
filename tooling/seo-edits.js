// SEO round: FAQs on product and specialty pages, canonical and x-default, per-page social images, breadcrumbs and article schema,
// image dimensions, lighter hero video loading, manifest and theme colour, sitemap trim, robots policy. Run from the project root.
const fs = require("fs");
const R = (f, pairs) => { let s = fs.readFileSync(f, "utf8"); for (const [a, b] of pairs) { if (!s.includes(a)) console.log("MISSING", f, "::", String(a).slice(0, 90)); s = s.split(a).join(b); } fs.writeFileSync(f, s); };

// ---- FAQ section (shared markup with the pricing FAQ) ----
R("components/tpl/Sections.tsx", [
  ['/* ---------- Values: three open columns (About) ---------- */', `/* ---------- FAQ (product and specialty pages) ---------- */
export function FaqSection({ faq, id }: { faq: { title: string; items: { q: string; a: string }[] }; id: string }) {
  return (
    <Section z={1}>
      <CenterHead title={faq.title} size="md" />
      <div className="grid grid-cols-12 gap-grid-gutter">
        <div className="col-span-12 xl:col-span-8 xl:col-start-3">
          <div className="flex w-full flex-col gap-1" data-accordion-group={id}>
            {faq.items.map((it, i) => (
              <button key={it.q} id={\`\${id}-\${i}\`} className="w-full rounded-2xl p-6 text-left focus-button transition-[color,background-color,border-radius] bg-surface-tertiary-100 text-primary not-aria-expanded:hover:text-secondary aria-expanded:bg-surface-dark-brand aria-expanded:text-white" type="button" tabIndex={0} aria-expanded="false" aria-controls={\`\${id}-\${i}-panel\`}>
                <div className="flex w-full cursor-pointer items-center justify-between gap-2 text-left text-body-md outline-hidden">
                  <span className="flex items-center gap-2"><h3 className="text-body-md">{it.q}</h3></span>
                  <Chevron className="h-6 w-6 shrink-0 transition-[rotate]" />
                </div>
                <div role="region" id={\`\${id}-\${i}-panel\`} aria-labelledby={\`\${id}-\${i}\`} className="overflow-y-clip" style={{ height: "0px" }}>
                  <div className="max-w-[75ch] pt-6 text-body-sm text-white"><p>{it.a}</p></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Values: three open columns (About) ---------- */`],
]);
R("components/site/Pages.tsx", [
  ['import ResourcesList from "@/components/site/ResourcesList";', 'import ResourcesList from "@/components/site/ResourcesList";\nimport Img from "@/components/tpl/Img";\nimport { FAQS } from "@/content/faqs";'],
  ['function productBody(p: ProductPageT, lang: Lang, extra?: React.ReactNode) {', 'function productBody(p: ProductPageT, lang: Lang, extra?: React.ReactNode, path?: string) {\n  const faq = path ? FAQS[lang]?.[path] : undefined;'],
  ['      {p.related && <RelatedSection title={p.related.title} cards={p.related.cards} lang={lang} />}\n      <CTABlock c={p.cta} lang={lang} />\n    </>', '      {p.related && <RelatedSection title={p.related.title} cards={p.related.cards} lang={lang} />}\n      {faq && <FaqSection faq={faq} id="faq" />}\n      <CTABlock c={p.cta} lang={lang} />\n    </>'],
  ['      <TrustBlock t={page.trust} />\n      <CTABlock c={page.cta} lang={lang} />\n    </Shell>', '      <TrustBlock t={page.trust} />\n      {FAQS[lang]?.["/specialties/" + page.slug] && <FaqSection faq={FAQS[lang]["/specialties/" + page.slug]} id="faq" />}\n      <CTABlock c={page.cta} lang={lang} />\n    </Shell>'],
]);
let pg = fs.readFileSync("components/site/Pages.tsx", "utf8");
pg = pg.replace(/productBody\(site\.(product|consolePage|askOptavius|agentsPage|integrations), lang(, library)?\)/g, (m, key, lib) => `productBody(site.${key}, lang${lib || ", undefined"}, path)`);
pg = pg.replace(/(import \{[^}]*)(AccordionSection)([^}]*\} from "@\/components\/tpl\/Sections";)/, (m, a, b, c) => a + b + ", FaqSection" + c);
// images with dimensions
pg = pg.replace(/<img /g, "<Img ");
fs.writeFileSync("components/site/Pages.tsx", pg);
for (const f of ["components/tpl/Sections.tsx", "components/tpl/Stories.tsx", "components/tpl/DemoBooking.tsx", "components/tpl/ui.tsx", "components/CustomerStories.tsx"]) {
  let s = fs.readFileSync(f, "utf8"); if (!s.includes("<img ")) continue;
  s = s.replace(/<img /g, "<Img ");
  const imp = f.endsWith("ui.tsx") ? 'import Img from "./Img";\n' : f.includes("/tpl/") ? 'import Img from "./Img";\n' : 'import Img from "@/components/tpl/Img";\n';
  s = s.replace(/^("use client";\n)?/, (m) => (m || "") + imp);
  fs.writeFileSync(f, s);
}

// ---- Hero: only the active and next clip load, phones get the 720p encode, text a little lower ----
R("components/home/Hero.tsx", [
  ['  const [shown, setShown] = useState(0);', '  const [shown, setShown] = useState(0);\n  const [narrow, setNarrow] = useState(false);\n  useEffect(() => { const mq = window.matchMedia("(max-width: 767px)"); const upd = () => setNarrow(mq.matches); upd(); mq.addEventListener("change", upd); return () => mq.removeEventListener("change", upd); }, []);'],
  ['                preload={i === 0 ? "auto" : "metadata"}\n                src={s.video + "#t=0.001"}', '                preload={i === active ? "auto" : "none"}\n                src={i === active || i === (active + 1) % slides.length ? (narrow ? s.video.replace(/\\.mp4$/, "-720.mp4") : s.video) + "#t=0.001" : undefined}'],
  ['xl:mt-44 xl:h-[calc(100%-(var(--spacing)*44))]', 'xl:mt-56 xl:h-[calc(100%-(var(--spacing)*56))]'],
]);

// ---- Metadata: canonical, x-default, per-page social image, manifest, theme colour; structured data: breadcrumbs, article, FAQ ----
R("app/layout.tsx", [
  ['  icons: { icon: [{ url: `${BASE}/favicon.ico`, sizes: "32x32" }, { url: `${BASE}/icon.svg`, type: "image/svg+xml" }], apple: `${BASE}/apple-icon.png` },', '  icons: { icon: [{ url: `${BASE}/favicon.ico`, sizes: "32x32" }, { url: `${BASE}/icon.svg`, type: "image/svg+xml" }], apple: `${BASE}/apple-icon.png` },\n  manifest: `${BASE}/site.webmanifest`,\n  robots: { index: true, follow: true, "max-image-preview": "large" },'],
  ['export default function RootLayout', 'export const viewport = { themeColor: "#006838" };\n\nexport default function RootLayout'],
]);
R("app/[[...slug]]/page.tsx", [
  ['import { BASE as BASE_PATH, SITE_URL } from "@/lib/base";', 'import { BASE as BASE_PATH, SITE_URL } from "@/lib/base";\nimport { FAQS } from "@/content/faqs";\nimport { existsSync } from "fs";\nimport { join } from "path";'],
  ['  for (const l of LOCALES) languages[l] = `${SITE_URL}${l === "en" ? path || "/" : `/${l}${path === "/" ? "" : path}`}`;', '  for (const l of LOCALES) languages[l] = `${SITE_URL}${l === "en" ? path || "/" : `/${l}${path === "/" ? "" : path}`}`;\n  languages["x-default"] = languages.en;\n  const canonical = `${SITE_URL}${lang === "en" ? path : `/${lang}${path === "/" ? "" : path}`}`;\n  const key = path === "/" ? "home" : path.replace(/^\\//, "");\n  const og = existsSync(join(process.cwd(), "public/og", lang, key + ".png")) ? `${SITE_URL}/og/${lang}/${key}.png` : `${SITE_URL}/og/${lang}.png`;'],
  ['    title: m.title, description: m.description, alternates: { languages }, icons:', '    title: m.title, description: m.description, alternates: { canonical, languages }, icons:'],
  ['images: [{ url: `${SITE_URL}/og/${lang}.png`, width: 1200, height: 630, alt: "Optavius" }] },', 'images: [{ url: og, width: 1200, height: 630, alt: m.title }] },'],
  ['images: [`${SITE_URL}/og/${lang}.png`] },', 'images: [og] },'],
  ['  if (path === "/pricing") graph.push({ "@type": "FAQPage",', `  const seg = path.split("/").filter(Boolean);
  const prefix = lang === "en" ? "" : "/" + lang;
  const label = (i: number): string => {
    const p = "/" + seg.slice(0, i + 1).join("/");
    const known: Record<string, string> = { "/product": site.product.hero.title, "/product/console": site.consolePage.hero.title, "/product/ask-optavius": site.askOptavius.hero.title, "/product/agents": site.agentsPage.hero.title, "/product/integrations": site.integrations.hero.title, "/pricing": site.pricing.title, "/specialties": site.specialties.title, "/customers": site.customers.title, "/about": site.about.title, "/resources": site.resources.title, "/careers": site.careers.title, "/demo": site.demo.title };
    if (known[p]) return known[p].replace(/\\n/g, " ");
    if (seg[0] === "specialties" && i === 1) return site.specialties.pages.find((x) => x.slug === seg[1])?.name || seg[1];
    if (seg[0] === "customers" && i === 1) return site.customers.stories.find((x) => x.slug === seg[1])?.customer || seg[1];
    if (seg[0] === "resources" && i === 1) return (ARTICLES[lang] || ARTICLES.en).find((x) => x.slug === seg[1])?.title || seg[1];
    return seg[i];
  };
  if (seg.length) graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Optavius", item: \`\${BASE}\${prefix}/\` }, ...seg.map((_, i) => ({ "@type": "ListItem", position: i + 2, name: label(i), item: \`\${BASE}\${prefix}/\${seg.slice(0, i + 1).join("/")}\` }))] });
  if (seg[0] === "resources" && seg[1]) { const a = (ARTICLES[lang] || ARTICLES.en).find((x) => x.slug === seg[1]); if (a) graph.push({ "@type": "Article", headline: a.title, description: a.description, inLanguage: lang, datePublished: "2026-09-01", dateModified: "2026-09-11", author: { "@id": \`\${BASE}/#org\` }, publisher: { "@id": \`\${BASE}/#org\` }, mainEntityOfPage: \`\${BASE}\${prefix}\${path}\`, image: \`\${BASE}/og/\${lang}.png\` }); }
  const faq = FAQS[lang]?.[path];
  if (faq) graph.push({ "@type": "FAQPage", mainEntity: faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  if (path === "/pricing") graph.push({ "@type": "FAQPage",`],
]);

// ---- Sitemap: no legal or demo pages; robots: AI crawler policy ----
R("app/sitemap.ts", [
  ['const STATIC = ["", "product", "product/console", "product/ask-optavius", "product/agents", "product/integrations", "pricing", "specialties", "customers", "about", "resources", "careers", "demo", "privacy", "terms"];', 'const STATIC = ["", "product", "product/console", "product/ask-optavius", "product/agents", "product/integrations", "pricing", "specialties", "customers", "about", "resources", "careers"];'],
  ['priority: p === "" ? 1 : p.startsWith("resources/") ? 0.5 : 0.8,', 'priority: p === "" ? 1 : p.startsWith("resources/") ? 0.5 : p === "careers" ? 0.4 : 0.8,'],
]);
fs.writeFileSync("app/robots.ts", `import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/base";

export const dynamic = "force-static";

/** Search engines and the AI assistants that answer with citations may read everything. Bulk training scrapers may not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ["Googlebot", "Bingbot", "Applebot", "DuckDuckBot", "OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended"], allow: "/" },
      { userAgent: ["Bytespider", "CCBot", "Amazonbot", "PetalBot"], disallow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: \`\${SITE_URL}/sitemap.xml\`,
  };
}
`);

// ---- Workflow: fix the html lang after export ----
R(".github/workflows/pages.yml", [['      - run: npx next build\n        env:\n          NEXT_PUBLIC_BASE_PATH: /optavius\n          NEXT_PUBLIC_SITE_URL: https://ppleeuw.github.io/optavius\n', '      - run: npx next build\n        env:\n          NEXT_PUBLIC_BASE_PATH: /optavius\n          NEXT_PUBLIC_SITE_URL: https://ppleeuw.github.io/optavius\n      - run: node tooling/post-export.js\n']]);
console.log("done");
