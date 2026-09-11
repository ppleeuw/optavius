// Round 7: real transcripts, Dutch headline, hero quote per language, spacing. Run from the project root: node tooling/edit-round7.js
const fs = require("fs");
const R = (f, pairs) => { let s = fs.readFileSync(f, "utf8"); for (const [a, b] of pairs) { if (!s.includes(a)) console.log("MISSING", f, "::", a.slice(0, 90)); s = s.split(a).join(b); } fs.writeFileSync(f, s); };
const line = (who, at, text) => `        { who: "${who}", at: ${at}, text: ${JSON.stringify(text)} },`;
const EN = [
  ["agent", 0, "Hi, I'm Julia, Optavius's digital assistant. This call may be recorded. How can I help?"],
  ["caller", 6, "Hey Julia, this is Peter. I have an eye exam scheduled. Can I reschedule it to next week?"],
  ["agent", 18, "Absolutely, Peter. I've found your details connected to the phone number you're calling from. What day and time next week would you prefer for your eye exam?"],
  ["caller", 26, "Tuesday, either 3:00 or 4:00 PM, if that's possible."],
  ["agent", 32, "I've moved your eye exam to Tuesday at 4:00 PM. You're all set, and I'll send a confirmation text message to the number you're calling from. Is there anything else I can help you with?"],
  ["caller", 41, "Amazing. That's it. Thank you."],
  ["agent", 46, "You're very welcome, Peter. Goodbye."],
];
const NL = [
  ["agent", 0, "Hoi, ik ben Julia, de digitale assistent van Optavius. Dit gesprek kan worden opgenomen. Waarmee kan ik je helpen?"],
  ["caller", 9, "Hoi Julia, met Peter-Paul. Ik vroeg me af wat jullie openingstijden zijn morgen."],
  ["agent", 16, "Morgen, zaterdag, zijn we geopend van half tien 's ochtends tot half zeven 's avonds. Kan ik je nog ergens anders mee helpen?"],
  ["caller", 23, "Ja, ik zou graag mijn oogonderzoek willen verplaatsen. Die had ik gepland staan, dat zou ik naar volgende week willen verplaatsen."],
  ["agent", 34, "Ik heb je gegevens gevonden bij het telefoonnummer waarmee je belt. Naar welke dag en welk tijdstip wil je je oogonderzoek volgende week verplaatsen?"],
  ["caller", 42, "Als het kan naar dinsdag, drie of vier uur."],
  ["agent", 49, "Ik heb je oogonderzoek verzet naar dinsdag om vier uur. Ik stuur een bevestigings-sms naar het nummer waarmee je belt. Kan ik je nog ergens anders mee helpen?"],
  ["caller", 59, "Nee hoor, dat was het. Dank je wel."],
  ["agent", 63, "Graag gedaan Peter-Paul, fijne dag verder."],
];
const T = { en: EN, nl: NL, de: EN };
const LABEL = { en: 'sampleLabel: "Sample call · rebooking an eye exam"', nl: 'sampleLabel: "Voorbeeldgesprek · openingstijden en een oogonderzoek verzetten"', de: 'sampleLabel: "Beispielanruf (Englisch) · Augenuntersuchung verschieben"' };
for (const lang of ["en", "nl", "de"]) {
  const f = `content/${lang}.ts`; let s = fs.readFileSync(f, "utf8");
  const a = s.indexOf("\n    demo: {"), b = s.indexOf("\n    },", a);
  let block = s.slice(a, b);
  const t0 = block.indexOf("      transcript: ["), t1 = block.indexOf("\n      ]", t0);
  if (t0 < 0 || t1 < 0) throw new Error("transcript block " + lang);
  block = block.slice(0, t0) + "      transcript: [\n" + T[lang].map((l) => line(...l)).join("\n") + block.slice(t1);
  block = block.replace(/sampleLabel: "[^"]*"/, LABEL[lang]);
  s = s.slice(0, a) + block + s.slice(b); fs.writeFileSync(f, s); console.log(lang, "transcript", T[lang].length, "lines");
}
// Dutch headline and founder wording
R("content/nl.ts", [["Elke patiëntoproep beantwoord.", "Elk belletje beantwoord."], ["Spreek met een oprichter", "Spreek met onze oprichter"]]);
// Hero quote: Feike for NL and DE, Ahmed for EN; a little higher and hidden on short screens
R("components/site/Pages.tsx", [['quote={h.quotes.items.find((q) => /north texas/i.test(q.logoAlt)) || h.quotes.items[0]}', 'quote={h.quotes.items.find((q) => (lang === "en" ? /north texas/i : /omc/i).test(q.logoAlt)) || h.quotes.items[0]}']]);
R("components/home/Hero.tsx", [['<figure className="mt-8 hidden max-w-[44ch] items-start gap-3 border-l-2 border-white/40 pl-4 md:flex">', '<figure className="mt-6 hidden max-w-[44ch] items-start gap-3 border-l-2 border-white/40 pl-4 md:flex [@media(max-height:760px)]:md:hidden">']]);
console.log("done");
