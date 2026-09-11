// Round 4 content: outcome-based pricing, booking page, proof naming, pricing teaser. Run from the project root: node tooling/edit-round4.js
const fs = require("fs");
const R = (f, fn) => fs.writeFileSync(f, fn(fs.readFileSync(f, "utf8")));
const between = (s, start, end, repl) => {
  const a = s.indexOf(start), b = s.indexOf(end, a + 1);
  if (a < 0 || b < 0) throw new Error("block not found " + start + " .. " + end);
  return s.slice(0, a) + repl + s.slice(b);
};

const PRICING = {
  en: `
  pricing: {
    meta: { title: "Pricing | Optavius", description: "Outcome-based pricing for AI voice agents. Starting from $299 per month. If Optavius delivers no results, you pay nothing." },
    title: "Pricing that follows results",
    lede: "You pay for what Optavius delivers, not for seats or minutes.",
    from: "Starting from $299 per month",
    how: {
      title: "How outcome-based pricing works",
      lede: "One monthly amount, tied to what the agent actually does for your practice.",
      items: [
        { icon: "phone", title: "A monthly fee from $299", text: "Covers the agent, the console, unlimited users, setup and support. No per-seat or per-minute charges." },
        { icon: "chart", title: "Tied to results", text: "The fee follows the outcomes Optavius delivers: calls answered, appointments booked, no-shows recovered. We agree the targets with you up front." },
        { icon: "shield", title: "No results, no cost", text: "In a month where Optavius books nothing and resolves nothing, you pay nothing. We take that risk, not you." },
      ],
    },
    stats: { title: "The math makes sense", items: [{ value: "~$0/day", label: "if no results are made" }, { value: "$10K+", label: "typical monthly savings" }, { value: "20%", label: "average revenue increase" }] },
    calc: { title: "What the phone is costing you", text: "Move the sliders to your own numbers. The math is deliberately conservative.", calls: "Incoming calls per month", missed: "Calls missed today", value: "Value of one appointment", recovered: "appointments recovered per month", revenue: "revenue recovered per month", plan: "Optavius, from", planPrice: "$299", planCost: 299, net: "net gain per month", note: "Recovered appointments = missed calls × 50% who never call back × 35% who wanted to book. Figures from 8,420 calls at Cubitts.", currency: "$" },
    faq: {
      title: "Pricing questions",
      items: [
        { q: "What counts as a result?", a: "An outcome the agent completes end to end: a call answered and resolved, an appointment booked or moved, a no-show rebooked, an order status confirmed. You see every one of them in the console." },
        { q: "What do I pay in a month with no results?", a: "Nothing. The monthly fee only applies when Optavius delivers the outcomes we agreed on." },
        { q: "How is the fee set for my practice?", a: "We look at your call volume and the outcomes that matter to you, then agree a monthly fee and targets before you start. Multi-location groups get a group agreement." },
        { q: "Are there per-minute or per-user charges?", a: "No. Minutes and users are unlimited. The fee is tied to outcomes, not usage." },
        { q: "Are there setup fees?", a: "No. Setup, configuration and onboarding are included." },
        { q: "Can I cancel?", a: "Yes, monthly. There are no long contracts." },
        { q: "Is there a trial?", a: "Yes. Ask Optavius is free for 90 days, and every agent runs a week in shadow mode before it goes live." },
      ],
    },
    cta: { title: "Get a quote for your practice", text: "We model recovered appointments and staff hours on your own call volume, then agree the targets with you.", primary: contactSales, secondary: callDemo, note: "Talk to a founder. No obligations." },
  },
`,
  nl: `
  pricing: {
    meta: { title: "Prijzen | Optavius", description: "Resultaatgerichte prijzen voor AI-spraakagenten. Vanaf €279 per maand. Levert Optavius geen resultaat, dan betaalt u niets." },
    title: "Prijzen die de resultaten volgen",
    lede: "U betaalt voor wat Optavius oplevert, niet voor gebruikers of minuten.",
    from: "Vanaf €279 per maand",
    how: {
      title: "Zo werkt resultaatgerichte prijsstelling",
      lede: "Eén maandbedrag, gekoppeld aan wat de agent daadwerkelijk voor uw praktijk doet.",
      items: [
        { icon: "phone", title: "Een maandbedrag vanaf €279", text: "Inclusief de agent, de console, onbeperkt gebruikers, installatie en ondersteuning. Geen kosten per gebruiker of per minuut." },
        { icon: "chart", title: "Gekoppeld aan resultaten", text: "Het bedrag volgt wat Optavius oplevert: beantwoorde oproepen, ingeplande afspraken, teruggewonnen no-shows. De doelen spreken we vooraf met u af." },
        { icon: "shield", title: "Geen resultaat, geen kosten", text: "In een maand waarin Optavius niets inplant en niets afhandelt, betaalt u niets. Dat risico nemen wij, niet u." },
      ],
    },
    stats: { title: "De rekensom klopt", items: [{ value: "~€0/dag", label: "als er geen resultaten zijn" }, { value: "€9K+", label: "gebruikelijke maandelijkse besparing" }, { value: "20%", label: "gemiddelde omzetstijging" }] },
    calc: { title: "Wat de telefoon u kost", text: "Zet de schuifjes op uw eigen cijfers. De rekensom is bewust voorzichtig.", calls: "Inkomende oproepen per maand", missed: "Gemiste oproepen nu", value: "Waarde van één afspraak", recovered: "teruggewonnen afspraken per maand", revenue: "teruggewonnen omzet per maand", plan: "Optavius, vanaf", planPrice: "€279", planCost: 279, net: "nettowinst per maand", note: "Teruggewonnen afspraken = gemiste oproepen × 50% die nooit terugbelt × 35% die wilde boeken. Cijfers uit 8.420 oproepen bij Cubitts.", currency: "€" },
    faq: {
      title: "Vragen over prijzen",
      items: [
        { q: "Wat telt als resultaat?", a: "Een uitkomst die de agent van begin tot eind afrondt: een oproep beantwoord en afgehandeld, een afspraak ingepland of verzet, een no-show opnieuw ingepland, een bestelstatus bevestigd. U ziet ze allemaal in de console." },
        { q: "Wat betaal ik in een maand zonder resultaten?", a: "Niets. Het maandbedrag geldt alleen als Optavius de afgesproken resultaten levert." },
        { q: "Hoe wordt het bedrag voor mijn praktijk bepaald?", a: "We kijken naar uw belvolume en de resultaten die voor u tellen, en spreken vooraf een maandbedrag en doelen af. Groepen met meerdere locaties krijgen een groepsafspraak." },
        { q: "Zijn er kosten per minuut of per gebruiker?", a: "Nee. Minuten en gebruikers zijn onbeperkt. Het bedrag is gekoppeld aan resultaten, niet aan gebruik." },
        { q: "Zijn er opstartkosten?", a: "Nee. Installatie, configuratie en onboarding zijn inbegrepen." },
        { q: "Kan ik opzeggen?", a: "Ja, maandelijks. Er zijn geen lange contracten." },
        { q: "Is er een proefperiode?", a: "Ja. Ask Optavius is 90 dagen gratis en elke agent draait een week in schaduwmodus voordat hij live gaat." },
      ],
    },
    cta: { title: "Vraag een offerte voor uw praktijk", text: "We rekenen teruggewonnen afspraken en personeelsuren door op uw eigen belvolume en spreken de doelen met u af.", primary: contactSales, secondary: callDemo, note: "Spreek met een oprichter. Vrijblijvend." },
  },
`,
  de: `
  pricing: {
    meta: { title: "Preise | Optavius", description: "Ergebnisbasierte Preise für KI-Sprachagenten. Ab 279 € pro Monat. Liefert Optavius keine Ergebnisse, zahlen Sie nichts." },
    title: "Preise, die den Ergebnissen folgen",
    lede: "Sie zahlen für das, was Optavius liefert, nicht für Nutzer oder Minuten.",
    from: "Ab 279 € pro Monat",
    how: {
      title: "So funktioniert ergebnisbasierte Preisgestaltung",
      lede: "Ein Monatsbetrag, gekoppelt an das, was der Agent tatsächlich für Ihre Praxis leistet.",
      items: [
        { icon: "phone", title: "Ein Monatsbetrag ab 279 €", text: "Enthält den Agenten, die Konsole, unbegrenzt Nutzer, Einrichtung und Support. Keine Kosten pro Nutzer oder pro Minute." },
        { icon: "chart", title: "An Ergebnisse gekoppelt", text: "Der Betrag folgt dem, was Optavius liefert: beantwortete Anrufe, gebuchte Termine, zurückgewonnene No-Shows. Die Ziele vereinbaren wir vorab mit Ihnen." },
        { icon: "shield", title: "Keine Ergebnisse, keine Kosten", text: "In einem Monat, in dem Optavius nichts bucht und nichts erledigt, zahlen Sie nichts. Dieses Risiko tragen wir, nicht Sie." },
      ],
    },
    stats: { title: "Die Rechnung geht auf", items: [{ value: "~0 €/Tag", label: "wenn keine Ergebnisse erzielt werden" }, { value: "9K+ €", label: "übliche monatliche Ersparnis" }, { value: "20%", label: "durchschnittliche Umsatzsteigerung" }] },
    calc: { title: "Was Sie das Telefon kostet", text: "Stellen Sie die Regler auf Ihre eigenen Zahlen. Die Rechnung ist bewusst vorsichtig.", calls: "Eingehende Anrufe pro Monat", missed: "Verpasste Anrufe heute", value: "Wert eines Termins", recovered: "zurückgewonnene Termine pro Monat", revenue: "zurückgewonnener Umsatz pro Monat", plan: "Optavius, ab", planPrice: "279 €", planCost: 279, net: "Nettogewinn pro Monat", note: "Zurückgewonnene Termine = verpasste Anrufe × 50 %, die nie zurückrufen × 35 %, die buchen wollten. Zahlen aus 8.420 Anrufen bei Cubitts.", currency: "€", currencyAfter: true },
    faq: {
      title: "Fragen zu den Preisen",
      items: [
        { q: "Was zählt als Ergebnis?", a: "Ein Vorgang, den der Agent vollständig abschließt: ein Anruf beantwortet und erledigt, ein Termin gebucht oder verschoben, ein No-Show neu gebucht, ein Bestellstatus bestätigt. Sie sehen jeden einzelnen in der Konsole." },
        { q: "Was zahle ich in einem Monat ohne Ergebnisse?", a: "Nichts. Der Monatsbetrag gilt nur, wenn Optavius die vereinbarten Ergebnisse liefert." },
        { q: "Wie wird der Betrag für meine Praxis festgelegt?", a: "Wir betrachten Ihr Anrufvolumen und die Ergebnisse, die für Sie zählen, und vereinbaren vor dem Start einen Monatsbetrag und Ziele. Gruppen mit mehreren Standorten erhalten eine Gruppenvereinbarung." },
        { q: "Gibt es Kosten pro Minute oder pro Nutzer?", a: "Nein. Minuten und Nutzer sind unbegrenzt. Der Betrag ist an Ergebnisse gekoppelt, nicht an die Nutzung." },
        { q: "Gibt es Einrichtungsgebühren?", a: "Nein. Einrichtung, Konfiguration und Onboarding sind enthalten." },
        { q: "Kann ich kündigen?", a: "Ja, monatlich. Es gibt keine langen Verträge." },
        { q: "Gibt es eine Testphase?", a: "Ja. Ask Optavius ist 90 Tage kostenlos, und jeder Agent läuft eine Woche im Schattenmodus, bevor er live geht." },
      ],
    },
    cta: { title: "Angebot für Ihre Praxis anfragen", text: "Wir rechnen zurückgewonnene Termine und Personalstunden auf Ihr eigenes Anrufvolumen um und vereinbaren die Ziele mit Ihnen.", primary: contactSales, secondary: callDemo, note: "Sprechen Sie mit einem Gründer. Unverbindlich." },
  },
`,
};

const DEMO = {
  en: `
  demo: {
    meta: { title: "Book a demo | Optavius", description: "Pick a time with a founder and hear Optavius take a call for your practice. No obligations." },
    title: "Pick a time with a founder.",
    points: [
      { icon: "phone", text: "Every patient call answered, 24/7, on your existing number." },
      { icon: "calendar", text: "Appointments booked straight into your calendar or EHR." },
      { icon: "shield", text: "Urgent symptoms escalated by your protocol, with a summary." },
    ],
    trustedTitle: "Trusted by",
    booking: { title: "Choose a slot", text: "30 minutes with Yves. We hear your call volume and show what Optavius would do with your calls.", fallback: { label: "Pick a time", href: CALENDLY, external: true }, note: "No obligations." },
  },
`,
  nl: `
  demo: {
    meta: { title: "Demo plannen | Optavius", description: "Kies een moment met een oprichter en hoor Optavius een gesprek voeren voor uw praktijk. Vrijblijvend." },
    title: "Kies een moment met een oprichter.",
    points: [
      { icon: "phone", text: "Elke patiëntoproep beantwoord, 24/7, op uw bestaande nummer." },
      { icon: "calendar", text: "Afspraken direct in uw agenda of EPD ingepland." },
      { icon: "shield", text: "Spoedsymptomen geëscaleerd volgens uw protocol, met een samenvatting." },
    ],
    trustedTitle: "Vertrouwd door",
    booking: { title: "Kies een tijdslot", text: "30 minuten met Yves. We horen uw belvolume en laten zien wat Optavius met uw oproepen zou doen.", fallback: { label: "Kies een moment", href: CALENDLY, external: true }, note: "Vrijblijvend." },
  },
`,
  de: `
  demo: {
    meta: { title: "Demo buchen | Optavius", description: "Wählen Sie einen Termin mit einem Gründer und hören Sie, wie Optavius einen Anruf für Ihre Praxis annimmt. Unverbindlich." },
    title: "Wählen Sie einen Termin mit einem Gründer.",
    points: [
      { icon: "phone", text: "Jeder Patientenanruf beantwortet, rund um die Uhr, auf Ihrer bestehenden Nummer." },
      { icon: "calendar", text: "Termine direkt in Ihren Kalender oder Ihr Praxissystem gebucht." },
      { icon: "shield", text: "Dringende Symptome nach Ihrem Protokoll weitergeleitet, mit Zusammenfassung." },
    ],
    trustedTitle: "Vertrauen von",
    booking: { title: "Zeitfenster wählen", text: "30 Minuten mit Yves. Wir hören uns Ihr Anrufvolumen an und zeigen, was Optavius mit Ihren Anrufen tun würde.", fallback: { label: "Termin wählen", href: CALENDLY, external: true }, note: "Unverbindlich." },
  },
`,
};

const CONTACT = { en: 'const contactSales = { label: "Contact sales", href: "/demo" };', nl: 'const contactSales = { label: "Neem contact op", href: "/demo" };', de: 'const contactSales = { label: "Vertrieb kontaktieren", href: "/demo" };' };
const PROOF = {
  en: [["Measured at one of our clients, before and after Optavius took the phones.", "Measured at Cubitts, before and after Optavius took the phones."], ["during May and June 2026 at one of our clients.", "during May and June 2026 at Cubitts."]],
  nl: [["Gemeten bij een van onze klanten, voor en nadat Optavius de telefoon overnam.", "Gemeten bij Cubitts, voor en nadat Optavius de telefoon overnam."], ["in mei en juni 2026 bij een van onze klanten.", "in mei en juni 2026 bij Cubitts."]],
  de: [["Gemessen bei einem unserer Kunden, vor und nachdem Optavius das Telefon übernahm.", "Gemessen bei Cubitts, vor und nachdem Optavius das Telefon übernahm."], ["im Mai und Juni 2026 bei einem unserer Kunden.", "im Mai und Juni 2026 bei Cubitts."]],
};
const TEASER = {
  en: '    pricingTeaser: { title: "Pricing that follows results", text: "Starting from $299 a month. No setup fees, no contracts. If Optavius delivers no results, you pay nothing.", link: { label: "See pricing", href: "/pricing" }, mock: "pricing-card" },',
  nl: '    pricingTeaser: { title: "Prijzen die de resultaten volgen", text: "Vanaf €279 per maand. Geen opstartkosten, geen contracten. Levert Optavius geen resultaat, dan betaalt u niets.", link: { label: "Bekijk prijzen", href: "/pricing" }, mock: "pricing-card" },',
  de: '    pricingTeaser: { title: "Preise, die den Ergebnissen folgen", text: "Ab 279 € im Monat. Keine Einrichtungsgebühr, keine Verträge. Liefert Optavius keine Ergebnisse, zahlen Sie nichts.", link: { label: "Preise ansehen", href: "/pricing" }, mock: "pricing-card" },',
};

for (const lang of ["en", "nl", "de"]) {
  R(`content/${lang}.ts`, (s) => {
    s = between(s, "\n  pricing: {", "\n  specialties: {", PRICING[lang]);
    s = between(s, "\n  demo: {", "\n  legal: {", DEMO[lang]);
    if (!s.includes("const contactSales")) s = s.replace('const bookDemo = ', CONTACT[lang] + "\nconst bookDemo = ");
    for (const [a, b] of PROOF[lang]) { if (!s.includes(a)) console.log("MISSING", lang, a.slice(0, 50)); s = s.split(a).join(b); }
    s = s.replace(/^    pricingTeaser: \{.*$/m, TEASER[lang]);
    return s;
  });
  console.log("ok", lang);
}
console.log("done");
