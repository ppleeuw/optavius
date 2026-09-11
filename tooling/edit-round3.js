// Third review round: proof outcomes reversed, Feike quote, logo mark, badges. Run from the project root: node tooling/edit-round3.js
const fs = require("fs");

// 1. Reverse the proof outcomes in all three languages (most compelling first).
for (const f of ["content/en.ts", "content/nl.ts", "content/de.ts"]) {
  let s = fs.readFileSync(f, "utf8");
  s = s.replace(/(    proof: \{[\s\S]*?outcomes: \[\n)([\s\S]*?)(      \],)/, (m, a, body, c) => {
    const lines = body.split("\n").filter((l) => l.trim());
    return a + lines.reverse().join("\n") + "\n" + c;
  });
  fs.writeFileSync(f, s);
}

// 2. Feike's quote: contact lens consult vs reorder.
const Q = {
  "content/en.ts": ["It knows the difference between a contact lens reorder and an emergency.", "It knows the difference between a contact lens consult and a reorder."],
  "content/nl.ts": ["Het kent het verschil tussen een nabestelling van contactlenzen en een spoedgeval.", "Het kent het verschil tussen een contactlensconsult en een nabestelling."],
  "content/de.ts": ["Es kennt den Unterschied zwischen einer Kontaktlinsen-Nachbestellung und einem Notfall.", "Es kennt den Unterschied zwischen einer Kontaktlinsenberatung und einer Nachbestellung."],
};
for (const [f, [a, b]] of Object.entries(Q)) {
  const s = fs.readFileSync(f, "utf8");
  const n = s.split(a).length - 1;
  console.log(f, "quote occurrences", n);
  fs.writeFileSync(f, s.split(a).join(b));
}

// 3. Logo mark: slightly wider opening on the right.
for (const f of ["public/icon.svg", "public/optavius/logo-mark.svg"]) {
  fs.writeFileSync(f, fs.readFileSync(f, "utf8").split("M35.1 13.9A16.5 16.5 0 1 0 35.1 26.1").join("M34.7 12.6A16.5 16.5 0 1 0 34.7 27.4"));
}

// 4. Badges: same circle geometry and colour as the HIPAA / GDPR / EU AI Act badges (cx 323.8, cy 463.1, r 323.8 in a 648x800 box).
const badge = (big, small, bigSize = 118) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 647.62 800"><path fill="#21083f" d="M647.62,463.1c0,178.83-144.97,323.81-323.81,323.81S0,641.93,0,463.1,144.97,139.29,323.81,139.29s323.81,144.97,323.81,323.81Z"/><circle cx="323.81" cy="463.1" r="278" fill="none" stroke="#ffffff" stroke-opacity=".28" stroke-width="10"/><text x="323.81" y="452" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="${bigSize}" fill="#ffffff">${big}</text><text x="323.81" y="540" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="54" fill="#ffffff" fill-opacity=".85">${small}</text></svg>`;
fs.writeFileSync("public/optavius/badge-soc1.svg", badge("SOC 1", "Audited controls"));
fs.writeFileSync("public/optavius/badge-fhir.svg", badge("FHIR", "Interoperable"));
fs.writeFileSync("public/optavius/badge-baa.svg", badge("BAA", "Included"));
console.log("done");
