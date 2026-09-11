// Make the site exportable as static HTML under a base path (GitHub Pages). Run from the project root: node tooling/pages-prep.js
const fs = require("fs");
const R = (f, pairs) => { let s = fs.readFileSync(f, "utf8"); for (const [a, b] of pairs) { if (!s.includes(a)) console.log("MISSING", f, "::", String(a).slice(0, 90)); s = s.split(a).join(b); } fs.writeFileSync(f, s); };

// Next config: static export with a base path from the environment
fs.writeFileSync("next.config.ts", `import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const nextConfig: NextConfig = {
  output: "export",
  basePath,
  devIndicators: false,
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
};

export default nextConfig;
`);

// Internal links
R("lib/i18n.ts", [
  ['export const LOCALES = ["en", "nl", "de"] as const;', 'import { BASE } from "./base";\n\nexport const LOCALES = ["en", "nl", "de"] as const;'],
  ['  return lang === DEFAULT_LANG ? p || "/" : `/${lang}${p}`;', '  return BASE + (lang === DEFAULT_LANG ? p || "/" : `/${lang}${p}`);'],
]);
R("components/home/Hero.tsx", [
  ['import { AgentAvatar } from "../mockups/ui";', 'import { AgentAvatar } from "../mockups/ui";\nimport { BASE } from "@/lib/base";'],
  ['const L = (p: string) => (/^(https?:|mailto:|tel:|#)/.test(p) ? p : lang === "en" ? p : `/${lang}${p}`);', 'const L = (p: string) => (/^(https?:|mailto:|tel:|#)/.test(p) ? p : BASE + (lang === "en" ? p : `/${lang}${p}`));'],
  ['href={h.primary.href}>{h.primary.label}</a>', 'href={L(h.primary.href)}>{h.primary.label}</a>'],
]);
R("components/tpl/Pricing.tsx", [
  ['import Calculator from "./Calculator";', 'import Calculator from "./Calculator";\nimport { BASE } from "@/lib/base";'],
  ['const L = (lang: string, path: string) => (/^(https?:|mailto:|tel:|#)/.test(path) ? path : lang === "en" ? path : `/${lang}${path}`);', 'const L = (lang: string, path: string) => (/^(https?:|mailto:|tel:|#)/.test(path) ? path : BASE + (lang === "en" ? path : `/${lang}${path}`));'],
]);
R("components/tpl/Sections.tsx", [
  ['import { ArrowUp, Chevron, Icon } from "./Icons";', 'import { ArrowUp, Chevron, Icon } from "./Icons";\nimport { BASE } from "@/lib/base";'],
  ['const L = (lang: string, path: string) => (/^(https?:|mailto:|tel:|#)/.test(path) ? path : lang === "en" ? path : `/${lang}${path === "/" ? "" : path}`);', 'const L = (lang: string, path: string) => (/^(https?:|mailto:|tel:|#)/.test(path) ? path : BASE + (lang === "en" ? path : `/${lang}${path === "/" ? "" : path}`));'],
]);
R("components/tpl/Stories.tsx", [
  ['import { Chevron } from "./Icons";', 'import { Chevron } from "./Icons";\nimport { BASE } from "@/lib/base";'],
  ['const L = (lang: string, path: string) => (lang === "en" ? path : `/${lang}${path}`);', 'const L = (lang: string, path: string) => BASE + (lang === "en" ? path : `/${lang}${path}`);'],
]);
// The booking pop-up intercepts demo links under the base path too
R("components/CalBooking.tsx", [
  ['import { CAL_LINKS } from "@/content/shared";', 'import { CAL_LINKS } from "@/content/shared";\nimport { BASE } from "@/lib/base";'],
  ['      if (u.origin !== location.origin || !/^\\/(nl\\/|de\\/)?demo\\/?$/.test(u.pathname)) return;', '      const p = BASE && u.pathname.startsWith(BASE) ? u.pathname.slice(BASE.length) : u.pathname;\n      if (u.origin !== location.origin || !/^\\/(nl\\/|de\\/)?demo\\/?$/.test(p)) return;'],
]);

// Assets: every public path in shared.ts goes through the base path
let sh = fs.readFileSync("content/shared.ts", "utf8");
sh = sh.replace(/"(\/(?:optavius|media)\/[^"]*)"/g, 'asset("$1")');
sh = sh.replace('export const G = "/optavius/gen";', 'export const G = asset("/optavius/gen");');
if (!sh.includes('import { asset }')) sh = 'import { asset } from "@/lib/base";\n' + sh;
fs.writeFileSync("content/shared.ts", sh);
R("components/tpl/ui.tsx", [
  ['export const logoWhite = (src: string) => (src.includes("logo-ntx") ? { src: "/optavius/logo-ntx-white.png", cls: "" }', 'export const logoWhite = (src: string) => (src.includes("logo-ntx") ? { src: asset("/optavius/logo-ntx-white.png"), cls: "" }'],
]);
let ui = fs.readFileSync("components/tpl/ui.tsx", "utf8"); if (!ui.includes('from "@/lib/base"')) ui = 'import { asset } from "@/lib/base";\n' + ui; fs.writeFileSync("components/tpl/ui.tsx", ui);
R("components/tpl/DemoPlayer.tsx", [['const SRC = (lang: string) => `/optavius/demo-call-${lang}.mp3`;', 'const SRC = (lang: string) => `${BASE}/optavius/demo-call-${lang}.mp3`;']]);
let dp = fs.readFileSync("components/tpl/DemoPlayer.tsx", "utf8"); if (!dp.includes('from "@/lib/base"')) dp = dp.replace(/^("use client";\n)/, '$1import { BASE } from "@/lib/base";\n'); fs.writeFileSync("components/tpl/DemoPlayer.tsx", dp);

// Metadata, sitemap, robots, structured data
R("app/layout.tsx", [
  ['import type { Metadata } from "next";', 'import type { Metadata } from "next";\nimport { BASE, SITE_URL } from "@/lib/base";'],
  ['  metadataBase: new URL("https://www.optavius.com"),', '  metadataBase: new URL(SITE_URL),'],
  ['  icons: { icon: [{ url: "/favicon.ico", sizes: "32x32" }, { url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon.png" },', '  icons: { icon: [{ url: `${BASE}/favicon.ico`, sizes: "32x32" }, { url: `${BASE}/icon.svg`, type: "image/svg+xml" }], apple: `${BASE}/apple-icon.png` },'],
]);
R("app/[[...slug]]/page.tsx", [
  ['import { getSite } from "@/lib/content";', 'import { getSite } from "@/lib/content";\nimport { BASE as BASE_PATH, SITE_URL } from "@/lib/base";'],
  ['icons: { icon: [{ url: "/favicon.ico", sizes: "32x32" }, { url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon.png" },', 'icons: { icon: [{ url: `${BASE_PATH}/favicon.ico`, sizes: "32x32" }, { url: `${BASE_PATH}/icon.svg`, type: "image/svg+xml" }], apple: `${BASE_PATH}/apple-icon.png` },'],
  ['images: [{ url: `/og/${lang}.png`, width: 1200, height: 630, alt: "Optavius" }] },', 'images: [{ url: `${SITE_URL}/og/${lang}.png`, width: 1200, height: 630, alt: "Optavius" }] },'],
  ['images: [`/og/${lang}.png`] },', 'images: [`${SITE_URL}/og/${lang}.png`] },'],
  ['const BASE = "https://www.optavius.com";', 'const BASE = SITE_URL;'],
  ['  for (const l of LOCALES) languages[l] = l === "en" ? path || "/" : `/${l}${path === "/" ? "" : path}`;', '  for (const l of LOCALES) languages[l] = `${SITE_URL}${l === "en" ? path || "/" : `/${l}${path === "/" ? "" : path}`}`;'],
  // static export: no searchParams; the resources filter runs on the client
  ['export default async function Page({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Search> }) {\n  const { slug } = await params;\n  const sp = await searchParams;', 'export default async function Page({ params }: { params: Promise<Params> }) {\n  const { slug } = await params;'],
  ['    case "/resources": return <ResourcesPage {...ctx} filter={sp?.kind || "all"} />;', '    case "/resources": return <ResourcesPage {...ctx} />;'],
  ['type Search = { kind?: string };\n', ''],
]);
R("app/sitemap.ts", [['export const BASE = "https://www.optavius.com";', 'import { SITE_URL } from "@/lib/base";\nexport const BASE = SITE_URL;'], ['export default function sitemap(): MetadataRoute.Sitemap {', 'export const dynamic = "force-static";\nexport default function sitemap(): MetadataRoute.Sitemap {']]);
R("app/robots.ts", [['import type { MetadataRoute } from "next";', 'import type { MetadataRoute } from "next";\nimport { SITE_URL } from "@/lib/base";\n\nexport const dynamic = "force-static";'], ['sitemap: "https://www.optavius.com/sitemap.xml"', 'sitemap: `${SITE_URL}/sitemap.xml`']]);

// Resources page: client-side filter
let pg = fs.readFileSync("components/site/Pages.tsx", "utf8");
const a = pg.indexOf("export function ResourcesPage("), b = pg.indexOf("export function ArticlePage(");
pg = pg.slice(0, a) + `export function ResourcesPage({ site, lang, path }: Ctx) {
  const r = site.resources;
  const cover = (a: Article, i: number) => ["bg-green-800", "bg-blue-700", "bg-purple-500", "bg-green-500"][(a.title.length + i) % 4];
  const items = (ARTICLES[lang] || ARTICLES.en).map((a, i) => ({ slug: a.slug, kind: a.kind, kindLabel: a.kindLabel, title: a.title, description: a.description, readTime: a.readTime, href: lhref(lang, "/resources/" + a.slug), cover: cover(a, i) }));
  return (
    <Shell site={site} lang={lang} path={path}>
      <section className="relative py-section-padding" style={{ zIndex: 2 }}>
        <div className={CONTAINER}><h1 className="max-w-prose text-headline-lg text-black">{r.title}</h1></div>
      </section>
      <Section className="flex flex-col gap-10 pt-10" z={1}>
        <ResourcesList filters={r.filters} items={items} readTime={r.readTime} />
      </Section>
      <CTABlock c={r.cta} lang={lang} />
    </Shell>
  );
}

` + pg.slice(b);
pg = pg.replace('import DemoBooking from "@/components/tpl/DemoBooking";', 'import DemoBooking from "@/components/tpl/DemoBooking";\nimport ResourcesList from "@/components/site/ResourcesList";');
fs.writeFileSync("components/site/Pages.tsx", pg);

// Fonts: relative URLs so the bundler emits them under the base path
R("app/styles/fonts.css", [["url(/fonts/", "url(../../public/fonts/"]]);
R("app/styles/extra.css", [["url(/fonts/", "url(../../public/fonts/"]]);

// GitHub Pages: keep the _next folder, build with Actions
fs.writeFileSync("public/.nojekyll", "");
fs.mkdirSync(".github/workflows", { recursive: true });
fs.writeFileSync(".github/workflows/pages.yml", `name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx next build
        env:
          NEXT_PUBLIC_BASE_PATH: /optavius
          NEXT_PUBLIC_SITE_URL: https://ppleeuw.github.io/optavius
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
`);
console.log("done");
