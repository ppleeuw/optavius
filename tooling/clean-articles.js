// Copy cleanup for content/articles.json in all languages: no dashes, no hype words, benefit headings as h3, no inline CTA section.
const fs = require("fs");
const f = "content/articles.json";
const a = JSON.parse(fs.readFileSync(f, "utf8"));
const RANGE = { en: " to ", nl: " tot ", de: " bis " };
const HYPE = {
  en: [[/\bseamlessly\b/gi, ""], [/\bseamless\b/gi, "smooth"], [/\bcutting-edge\b/gi, "modern"], [/\bleverag(e|es|ing)\b/gi, "use"], [/\bAI-powered\b/g, "AI"], [/\bempowers?\b/gi, "helps"], [/\brevolutioniz(e|es|ing)\b/gi, "change"], [/\btransforms?\b/gi, "changes"], [/\bsupercharge\b/gi, "speed up"], [/\bnext-generation\b/gi, "new"], [/\bgame-changing\b/gi, "important"], [/Absolutely\. /g, "Yes. "], [/Think of (it|AI) as (a|an) /g, "It is $2 "], [/\bcomprehensive\b/gi, "complete"], [/\bunlock(s|ing)?\b/gi, "open up"], [/\bdata-driven\b/gi, "informed"], [/, without requiring human intervention for routine interactions\./g, "."], [/\bactionable\b/gi, "useful"], [/\brobust\b/gi, "reliable"]],
  nl: [[/\bnaadloos\b/gi, "soepel"], [/\bbaanbrekend(e)?\b/gi, "modern$1"], [/\bAI-gestuurd(e)?\b/g, "AI"], [/\brevolution(eert|air)\b/gi, "verandert"], [/\btransformeert\b/gi, "verandert"], [/Absoluut\. /g, "Ja. "], [/\bgeavanceerd(e)?\b/gi, "modern$1"]],
  de: [[/\bnahtlos(e|er|es)?\b/gi, "reibungslos$1"], [/\bKI-gestützt(e|er|es)?\b/g, "KI"], [/\brevolutionier(t|en)\b/gi, "verändern"], [/\btransformier(t|en)\b/gi, "verändern"], [/Absolut\. /g, "Ja. "], [/\bwegweisend(e|er|es)?\b/gi, "modern$1"]],
};
const isBenefitsHeading = (l) => /^## (Benefits|Voordelen|Vorteile)/.test(l);
for (const lang of Object.keys(a)) {
  for (const art of a[lang]) {
    let b = art.body;
    // drop the trailing "See Optavius in action" CTA section (the page has its own CTA block)
    const idx = b.lastIndexOf("\n## ");
    if (idx > 0 && b.slice(idx).includes("](#")) b = b.slice(0, idx).trimEnd();
    // ranges "2 – 6" -> "2 to 6"; other dashes -> comma
    b = b.replace(/(\d)\s?[–—]\s?(\d)/g, "$1" + RANGE[lang] + "$2").replace(/\s?[—–]\s?/g, ", ");
    let d = art.description.replace(/(\d)\s?[–—]\s?(\d)/g, "$1" + RANGE[lang] + "$2").replace(/\s?[—–]\s?/g, ", ");
    for (const [re, to] of HYPE[lang] || []) { b = b.replace(re, to); d = d.replace(re, to); }
    b = b.replace(/  +/g, " ").replace(/ ,/g, ",").replace(/ \./g, ".");
    // benefit blocks: short title line followed by a paragraph -> h3
    const lines = b.split("\n"); let inBenefits = false;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (l.startsWith("## ")) { inBenefits = isBenefitsHeading(l); continue; }
      if (inBenefits && l.trim() && !l.startsWith("#") && !l.startsWith("-") && l.length < 80 && !/[.:]$/.test(l.trim()) && lines[i + 1] === "" && lines[i + 2] && !lines[i + 2].startsWith("#")) lines[i] = "### " + l.trim();
    }
    b = lines.join("\n");
    // numbered "1." lists: real numbering
    let n = 0; b = b.split("\n").map((l) => { if (/^1\. /.test(l)) { n++; return n + ". " + l.slice(3); } if (l.trim() === "") n = 0; return l; }).join("\n");
    art.body = b; art.description = d;
  }
}
fs.writeFileSync(f, JSON.stringify(a, null, 1));
const bad = /[—–]|revolutioniz|unlock|supercharge|seamless|cutting-edge|next-generation|game-chang|fast-paced|leverag|AI-powered|empower|Absolutely/gi;
for (const l of Object.keys(a)) { let n = 0; for (const x of a[l]) n += (x.body.match(bad) || []).length + (x.description.match(bad) || []).length; console.log(l, "flagged after cleanup:", n, "| CTA sections left:", a[l].filter((x) => x.body.includes("](#")).length); }
