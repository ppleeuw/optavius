import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, splitPath, type Lang } from "@/lib/i18n";
import { getSite } from "@/lib/content";
import { BASE as BASE_PATH, SITE_URL } from "@/lib/base";
import { AboutPage, AgentsPage, ArticlePage, ARTICLES, AskPage, CareersPage, ConsolePage, CustomersPage, DemoPage, HomePage, IntegrationsPage, PricingRoute, PrivacyPage, ProductPage, ResourcesPage, SpecialtiesIndex, SpecialtyPage, StoryPage, TermsPage } from "@/components/site/Pages";

type Params = { slug?: string[] };

const STATIC = ["", "product", "product/console", "product/ask-optavius", "product/agents", "product/integrations", "pricing", "specialties", "customers", "about", "resources", "careers", "demo", "privacy", "terms"];

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  const out: Params[] = [];
  for (const lang of LOCALES) {
    const site = getSite(lang);
    const prefix = lang === "en" ? [] : [lang];
    const paths = [
      ...STATIC,
      ...site.specialties.pages.map((p) => "specialties/" + p.slug),
      ...site.customers.stories.map((s) => "customers/" + s.slug),
      ...(ARTICLES[lang] || ARTICLES.en).map((a) => "resources/" + a.slug),
    ];
    for (const p of paths) out.push({ slug: [...prefix, ...p.split("/").filter(Boolean)] });
  }
  return out;
}

function resolve(slug: string[] = []) {
  const { lang, path } = splitPath(slug);
  const site = getSite(lang);
  return { lang, path, site };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { lang, path, site } = resolve(slug);
  const seg = path.split("/").filter(Boolean);
  let m: { title: string; description: string } = site.home.meta;
  const map: Record<string, { title: string; description: string }> = {
    "/product": site.product.meta, "/product/console": site.consolePage.meta, "/product/ask-optavius": site.askOptavius.meta, "/product/agents": site.agentsPage.meta, "/product/integrations": site.integrations.meta,
    "/pricing": site.pricing.meta, "/specialties": site.specialties.meta, "/customers": site.customers.meta, "/about": site.about.meta, "/resources": site.resources.meta, "/careers": site.careers.meta, "/demo": site.demo.meta,
    "/privacy": { title: site.legal.privacy.title + site.meta.titleSuffix, description: site.meta.description }, "/terms": { title: site.legal.terms.title + site.meta.titleSuffix, description: site.meta.description },
  };
  if (map[path]) m = map[path];
  else if (seg[0] === "specialties") m = site.specialties.pages.find((p) => p.slug === seg[1])?.meta || m;
  else if (seg[0] === "customers") m = site.customers.stories.find((p) => p.slug === seg[1])?.meta || m;
  else if (seg[0] === "resources") { const a = (ARTICLES[lang] || ARTICLES.en).find((x) => x.slug === seg[1]); if (a) m = { title: a.title + site.meta.titleSuffix, description: a.description }; }
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}${l === "en" ? path || "/" : `/${l}${path === "/" ? "" : path}`}`;
  const locale = lang === "nl" ? "nl_NL" : lang === "de" ? "de_DE" : "en_US";
  return {
    title: m.title, description: m.description, alternates: { languages }, icons: { icon: [{ url: `${BASE_PATH}/favicon.ico`, sizes: "32x32" }, { url: `${BASE_PATH}/icon.svg`, type: "image/svg+xml" }], apple: `${BASE_PATH}/apple-icon.png` },
    openGraph: { title: m.title, description: m.description, siteName: "Optavius", locale, type: "website", images: [{ url: `${SITE_URL}/og/${lang}.png`, width: 1200, height: 630, alt: "Optavius" }] },
    twitter: { card: "summary_large_image", title: m.title, description: m.description, images: [`${SITE_URL}/og/${lang}.png`] },
  };
}

const BASE = SITE_URL;
/** Structured data: the organisation on every page, the FAQ on pricing, the service on product pages. */
function jsonLd(path: string, lang: string, site: ReturnType<typeof getSite>) {
  const org = { "@type": "Organization", "@id": `${BASE}/#org`, name: "Optavius", url: BASE, logo: `${BASE}/og/${lang}.png`, contactPoint: [{ "@type": "ContactPoint", telephone: "+1-937-729-2674", contactType: "sales", areaServed: "US", availableLanguage: ["en"] }, { "@type": "ContactPoint", telephone: "+31-97-006-532689", contactType: "sales", areaServed: "NL", availableLanguage: ["nl", "en"] }], sameAs: ["https://www.linkedin.com/company/optavius"] };
  const graph: Record<string, unknown>[] = [org];
  if (path === "/pricing") graph.push({ "@type": "FAQPage", mainEntity: site.pricing.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  if (path === "/" || path.startsWith("/product") || path === "/pricing") graph.push({ "@type": "Service", "@id": `${BASE}/#service`, name: "Optavius AI voice agents", provider: { "@id": `${BASE}/#org` }, serviceType: "AI voice agent for healthcare practices", areaServed: ["US", "NL", "DE"], description: site.home.meta.description, offers: { "@type": "Offer", price: "299", priceCurrency: "USD", priceSpecification: { "@type": "UnitPriceSpecification", price: "299", priceCurrency: "USD", unitText: "MONTH" } } });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { lang, path, site } = resolve(slug);
  const ctx = { site, lang: lang as Lang, path };
  const seg = path.split("/").filter(Boolean);
  const ld = <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(path, lang, site) }} />;
  const page = render();
  if (!page) notFound();
  return <>{ld}{page}</>;

  function render() {
  switch (path) {
    case "/": return <HomePage {...ctx} />;
    case "/product": return <ProductPage {...ctx} />;
    case "/product/console": return <ConsolePage {...ctx} />;
    case "/product/ask-optavius": return <AskPage {...ctx} />;
    case "/product/agents": return <AgentsPage {...ctx} />;
    case "/product/integrations": return <IntegrationsPage {...ctx} />;
    case "/pricing": return <PricingRoute {...ctx} />;
    case "/specialties": return <SpecialtiesIndex {...ctx} />;
    case "/customers": return <CustomersPage {...ctx} />;
    case "/about": return <AboutPage {...ctx} />;
    case "/resources": return <ResourcesPage {...ctx} />;
    case "/careers": return <CareersPage {...ctx} />;
    case "/demo": return <DemoPage {...ctx} />;
    case "/privacy": return <PrivacyPage {...ctx} />;
    case "/terms": return <TermsPage {...ctx} />;
  }
  if (seg[0] === "specialties" && seg[1]) { const p = site.specialties.pages.find((x) => x.slug === seg[1]); if (p) return <SpecialtyPage {...ctx} page={p} />; }
  if (seg[0] === "customers" && seg[1]) { const s = site.customers.stories.find((x) => x.slug === seg[1]); if (s) return <StoryPage {...ctx} story={s} />; }
  if (seg[0] === "resources" && seg[1]) { const a = (ARTICLES[lang] || ARTICLES.en).find((x) => x.slug === seg[1]); if (a) return <ArticlePage {...ctx} article={a} />; }
  return null;
  }
}
