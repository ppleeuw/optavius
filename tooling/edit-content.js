// One-off content edits (second review round). Run from the project root: node tooling/edit-content.js
const fs = require("fs");
const T = {
  en: {
    tr: [
      ["agent", 0, "Thank you for calling Westside Eye Care. This is Optavius, the clinic's AI assistant. How can I help you today?"],
      ["caller", 7, "Hi, I have an eye exam on Thursday at 9:40, but something came up. Can I move it?"],
      ["agent", 13, "Of course. Can I have your date of birth so I can find the appointment?"],
      ["caller", 18, "Third of March, 1981."],
      ["agent", 21, "Thanks, Mr. Okafor. I see your exam with Dr. Alvarez on Thursday at 9:40. Would you prefer another day this week, or next week?"],
      ["caller", 30, "Next week, ideally in the morning."],
      ["agent", 34, "Dr. Alvarez has Tuesday at 9:00 or Wednesday at 10:20. Which works better?"],
      ["caller", 40, "Wednesday at 10:20."],
      ["agent", 43, "Done. Your exam is moved to Wednesday at 10:20 and the Thursday slot is released. I've sent a confirmation by text. Please bring your current glasses."],
      ["caller", 54, "Great, thank you."],
      ["agent", 56, "You're welcome. See you Wednesday."],
    ],
    lede: "Press play, or call the demo line and try it yourself.", label: "Sample call · rebooking an eye exam",
    proofLede: "Measured at one of our clients, before and after Optavius took the phones.",
    more: "+20 integration partners", offices: "Based in {cities}, we work with practices in the United States, the Netherlands and beyond.", cities: '["Houston", "Amsterdam"]',
    consoleTitle: "Run the day from one bar", consoleLede: "One bar at the bottom of every screen. Pause an agent, change a rule or approve a transfer in a sentence, in English, Dutch or German.",
  },
  nl: {
    tr: [
      ["agent", 0, "Bedankt voor het bellen naar Oogkliniek West. Dit is Optavius, de AI-assistent van de kliniek. Waarmee kan ik u helpen?"],
      ["caller", 7, "Hoi, ik heb donderdag om 9:40 een oogmeting, maar er is iets tussengekomen. Kan ik die verzetten?"],
      ["agent", 13, "Natuurlijk. Mag ik uw geboortedatum, dan zoek ik de afspraak op?"],
      ["caller", 18, "Drie maart 1981."],
      ["agent", 21, "Dank u, meneer Okafor. Ik zie uw meting bij dr. Alvarez op donderdag om 9:40. Wilt u een andere dag deze week, of volgende week?"],
      ["caller", 30, "Volgende week, liefst in de ochtend."],
      ["agent", 34, "Dr. Alvarez heeft dinsdag om 9:00 of woensdag om 10:20 plek. Wat past beter?"],
      ["caller", 40, "Woensdag om 10:20."],
      ["agent", 43, "Gedaan. Uw meting staat nu op woensdag om 10:20 en de plek van donderdag is vrijgegeven. Ik heb een bevestiging per sms gestuurd. Neem uw huidige bril mee."],
      ["caller", 54, "Fijn, dank u wel."],
      ["agent", 56, "Graag gedaan. Tot woensdag."],
    ],
    lede: "Druk op afspelen, of bel de demolijn en probeer het zelf.", label: "Voorbeeldgesprek · een oogmeting verzetten",
    proofLede: "Gemeten bij een van onze klanten, voor en nadat Optavius de telefoon overnam.",
    more: "+20 integratiepartners", offices: "Vanuit {cities} werken we met praktijken in de Verenigde Staten, Nederland en daarbuiten.", cities: '["Houston", "Amsterdam"]',
    consoleTitle: "Stuur de dag vanuit één balk", consoleLede: "Eén balk onderaan elk scherm. Pauzeer een agent, wijzig een regel of keur een doorverbinding goed in één zin, in het Nederlands, Engels of Duits.",
  },
  de: {
    tr: [
      ["agent", 0, "Danke für Ihren Anruf bei Augenzentrum West. Hier ist Optavius, der KI-Assistent der Praxis. Wie kann ich Ihnen helfen?"],
      ["caller", 7, "Hallo, ich habe am Donnerstag um 9:40 Uhr einen Sehtest, aber mir ist etwas dazwischengekommen. Kann ich ihn verschieben?"],
      ["agent", 13, "Natürlich. Darf ich Ihr Geburtsdatum haben, damit ich den Termin finde?"],
      ["caller", 18, "Dritter März 1981."],
      ["agent", 21, "Danke, Herr Okafor. Ich sehe Ihren Sehtest bei Dr. Alvarez am Donnerstag um 9:40 Uhr. Möchten Sie einen anderen Tag diese Woche oder nächste Woche?"],
      ["caller", 30, "Nächste Woche, am liebsten vormittags."],
      ["agent", 34, "Dr. Alvarez hat Dienstag um 9:00 Uhr oder Mittwoch um 10:20 Uhr Zeit. Was passt besser?"],
      ["caller", 40, "Mittwoch um 10:20 Uhr."],
      ["agent", 43, "Erledigt. Ihr Sehtest ist auf Mittwoch um 10:20 Uhr verschoben, der Donnerstagstermin ist freigegeben. Ich habe eine Bestätigung per SMS geschickt. Bitte bringen Sie Ihre aktuelle Brille mit."],
      ["caller", 54, "Prima, vielen Dank."],
      ["agent", 56, "Gern geschehen. Bis Mittwoch."],
    ],
    lede: "Drücken Sie auf Play, oder rufen Sie die Demo-Hotline an und probieren Sie es selbst.", label: "Beispielanruf · einen Sehtest verschieben",
    proofLede: "Gemessen bei einem unserer Kunden, vor und nachdem Optavius das Telefon übernahm.",
    more: "+20 Integrationspartner", offices: "Von {cities} aus arbeiten wir mit Praxen in den USA, den Niederlanden und darüber hinaus.", cities: '["Houston", "Amsterdam"]',
    consoleTitle: "Den Tag aus einer Leiste steuern", consoleLede: "Eine Leiste am unteren Rand jedes Bildschirms. Pausieren Sie einen Agenten, ändern Sie eine Regel oder geben Sie eine Weiterleitung frei, in einem Satz, auf Deutsch, Englisch oder Niederländisch.",
  },
};
for (const lang of ["en", "nl", "de"]) {
  const f = "content/" + lang + ".ts";
  let s = fs.readFileSync(f, "utf8");
  const t = T[lang];
  s = s.replace(/transcript: \[[\s\S]*?\n      \],\n    \},/, "transcript: [\n" + t.tr.map(([w, at, x]) => `        { who: "${w}", at: ${at}, text: ${JSON.stringify(x)} },`).join("\n") + "\n      ],\n    },");
  s = s.replace(/(demo: \{\n\s+title: "[^"]+",\n\s+lede: )"[^"]+"/, `$1"${t.lede}"`);
  s = s.replace(/sampleLabel: "[^"]+"/, `sampleLabel: "${t.label}"`);
  s = s.replace(/(proof: \{\n\s+title: "[^"]+",\n\s+lede: )"[^"]+"/, `$1"${t.proofLede}"`);
  s = s.replace('{ mock: "gw-build", title:', '{ mock: "journeys", title:');
  s = s.replace(/\n\s+stat: \{ value: "[^"]+", label: "[^"]+" \},\n/, "\n");
  s = s.replace("primary: callDemo, secondary: bookDemo, note:", "primary: bookDemo, secondary: callDemo, note:");
  s = s.replace("{ ...VIDEOS.evening, bubbles: [", "{ ...VIDEOS.fold1, bubbles: [").replace("{ ...VIDEOS.shop, bubbles: [", "{ ...VIDEOS.fold2, bubbles: [").replace("{ ...VIDEOS.frontdesk, bubbles: [", "{ ...VIDEOS.fold3, bubbles: [");
  s = s.split("PEOPLE.rehan").join("PEOPLE.ahmed").split('"Rehan"').join('"Ahmed"');
  s = s.replace(/\{ key: "command", title: "[^"]+", lede: "[^"]+"/, `{ key: "command", title: "${t.consoleTitle}", lede: "${t.consoleLede}"`);
  s = s.replace(/(logos: \{ title: "[^"]+", lede: "[^"]+",)( groups:)/, `$1 more: "${t.more}",$2`);
  s = s.replace(/(logos: \{\n\s+title: "[^"]+",\n\s+lede: "[^"]+",\n)/, `$1      more: "${t.more}",\n`);
  s = s.replace(/hero: \{ title: "(Integrations|Koppelingen|Integrationen)", subtitle: "([^"]+)", media: \{ kind: "mock", name: "hz-context" \} \}/, 'hero: { title: "$1", subtitle: "$2", media: { kind: "video", src: VIDEOS.context.video, poster: VIDEOS.context.poster } }');
  s = s.replace(/hero: \{ title: "Ask Optavius", subtitle: "([^"]+)", media: \{ kind: "mock", name: "insights-query" \} \}/, 'hero: { title: "Ask Optavius", subtitle: "$1", media: { kind: "video", src: VIDEOS.insights.video, poster: VIDEOS.insights.poster } }');
  s = s.replace(/hero: \{ title: "(Agents|Agenten)", subtitle: "([^"]+)", media: \{ kind: "video", src: VIDEOS\.evening\.video, poster: VIDEOS\.evening\.poster \}, overlay: \[\n[\s\S]*?\n    \] \}/, 'hero: { title: "$1", subtitle: "$2", media: { kind: "mock", name: "agent-studio-hero" } }');
  s = s.replace('media: { kind: "mock", name: "gw-build" }, features: [\n        { icon: "chat"', 'media: { kind: "mock", name: "simulations", zoom: 1.25 }, features: [\n        { icon: "chat"');
  for (const m of ["briefing", "reporting", "insights-query", "recommendations", "explorer-table", "dark-chat"]) s = s.split(`media: { kind: "mock", name: "${m}" }`).join(`media: { kind: "mock", name: "${m}", zoom: 1.3 }`);
  s = s.replace('heroVideo: { ...VIDEOS.frontdesk, logo: logos[0].src, logoAlt: "OMC Amstelland" },', 'heroImage: { src: PHOTOS.story, alt: "Eye clinic team", logo: logos[0].src, logoAlt: "OMC Amstelland" },');
  s = s.replace(/\n\s+customersTitle: "[^"]+", customersCta: \{ label: "[^"]+", href: "\/customers" \},/, "");
  s = s.replace(/offices: \{ title: "([^"]+)", text: "[^"]+", cities: \[[^\]]+\] \}/, `offices: { title: "$1", text: "${t.offices}", cities: ${t.cities} }`);
  s = s.replace(/\n\s+\{ title: "Tech [Ll]ead[^}]+\},/, "");
  if (lang === "nl") {
    s = s.replace('import { BADGES, CALENDLY, CUSTOMER_LOGOS, EMAIL, INTEGRATION_LOGOS, LINKEDIN, PEOPLE, PHOTOS, SIGN_IN, TEL, TEL_DISPLAY, VIDEOS } from "./shared";', 'import { BADGES, CALENDLY, CUSTOMER_LOGOS, EMAIL, INTEGRATION_LOGOS, PEOPLE, PHOTOS, SIGN_IN, TEL_NL as TEL, TEL_NL_DISPLAY as TEL_DISPLAY, VIDEOS } from "./shared";');
    s = s.replace("meta: { ...en.meta, description:", "meta: { ...en.meta, tel: TEL, telDisplay: TEL_DISPLAY, description:");
  }
  fs.writeFileSync(f, s);
  const chk = ["journeys", "fold1", "PEOPLE.ahmed", "heroImage", 'more: "', t.consoleTitle, "agent-studio-hero", "VIDEOS.context", "VIDEOS.insights", "simulations"];
  console.log(lang, chk.map((c) => c + ":" + (s.includes(c) ? "ok" : "MISSING")).join(" "), "| stat left:", /stat: \{ value/.test(s), "| rehan left:", /Rehan|rehan/.test(s), "| techlead:", /Tech [Ll]ead/.test(s), "| customersTitle:", /customersTitle/.test(s), "| 9:40 transcript:", /rebooking|verzetten|verschieben/.test(s));
}
