import { asset } from "@/lib/base";
/** Language-independent assets and constants. */
export const TEL_EN = "tel:+19377292674";
export const TEL_EN_DISPLAY = "+1 937 729 2674";
export const TEL_NL = "tel:+3197006532689";
export const TEL_NL_DISPLAY = "+31 970 065 32689";
export const TEL = TEL_EN;
/** Display form of a demo-line tel: link, for buttons that show the number. */
export const telDisplay = (href: string) => (href === TEL_NL ? TEL_NL_DISPLAY : href === TEL_EN ? TEL_EN_DISPLAY : href.startsWith("tel:") ? href.slice(4) : "");
export const TEL_DISPLAY = TEL_EN_DISPLAY;
export const EMAIL = "yves@optavius.com";
export const CALENDLY = "https://calendly.com/yves-right2seenow/new-meeting";
export const LINKEDIN = "https://linkedin.com/company/optavius";
export const SIGN_IN = "https://app.optavius.com";

export const G = asset("/optavius/gen");
export const LOGOS = {
  omc: { src: asset("/optavius/logo-omc.png"), alt: "OMC Amstelland" },
  ntx: { src: asset("/optavius/logo-ntx.png"), alt: "North Texas Eye Specialists" },
  ntxWhite: asset("/optavius/logo-ntx-white.png"),
  cubitts: { src: asset("/optavius/logo-cubitts.svg"), alt: "Cubitts" },
};
export const CUSTOMER_LOGOS = (hrefs: [string, string, string]) => [
  { ...LOGOS.omc, href: hrefs[0] },
  { ...LOGOS.ntx, href: hrefs[1] },
  { ...LOGOS.cubitts, href: hrefs[2] },
];
export const VIDEOS = {
  frontdesk: { video: `${G}/hero-frontdesk-video.mp4`, poster: `${G}/hero-frontdesk.webp` },
  evening: { video: `${G}/hero-evening-video.mp4`, poster: `${G}/hero-evening.webp` },
  shop: { video: `${G}/hero-shop-video.mp4`, poster: `${G}/hero-shop.webp` },
  /* the original fold videos (eye-care versions of the reference hero) */
  fold1: { video: asset("/media/hero1.mp4"), poster: asset("/media/hero1-poster.jpg") },
  fold2: { video: asset("/media/hero2.mp4"), poster: asset("/media/hero2-poster.jpg") },
  fold3: { video: asset("/media/hero3.mp4"), poster: asset("/media/hero3-poster.jpg") },
  insights: { video: asset("/optavius/gen/ask-optavius-video.mp4"), poster: asset("/optavius/gen/ask-optavius-poster.webp") },
  product: { video: `${G}/product-frontdesk-video.mp4`, poster: `${G}/product-frontdesk.webp` },
  ophthalmology: { video: `${G}/spec2-ophthalmology-video.mp4`, poster: `${G}/spec2-ophthalmology.webp` },
  optometry: { video: `${G}/spec2-optometry-video.mp4`, poster: `${G}/spec2-optometry.webp` },
  dermatology: { video: `${G}/spec2-dermatology-video.mp4`, poster: `${G}/spec2-dermatology.webp` },
  veterinary: { video: `${G}/spec2-veterinary-video.mp4`, poster: `${G}/spec2-veterinary.webp` },
};
export const PEOPLE = {
  feike: { poster: `${G}/feike.webp` },
  ahmed: { poster: `${G}/ahmed.webp` },
  tom: { poster: `${G}/tom.webp` },
};
export const PHOTOS = {
  frontdesk: asset("/optavius/img-frontdesk.webp"),
  exam: asset("/optavius/img-exam.webp"),
  shop: asset("/optavius/img-shop.webp"),
  evening: asset("/optavius/img-evening.webp"),
  story: asset("/optavius/img-story.webp"),
  examroom: asset("/optavius/img-examroom.webp"),
  slitlamp: asset("/optavius/img-slitlamp.webp"),
  child: asset("/optavius/img-child.webp"),
  childexam: asset("/optavius/img-childexam.webp"),
  yves: asset("/optavius/img-yves.webp"),
  paul: asset("/optavius/img-paul.webp"),
  storyOmc: `${G}/story-omc.webp`,
  storyCubitts: `${G}/story-cubitts.webp`,
};
/** Trust badges: reuse the generic certification marks, plus Optavius' own SOC 1, FHIR and BAA marks. */
export const BADGES = {
  soc1: asset("/optavius/badge-soc1.svg"),
  iso27001: asset("/optavius/badge-iso27001.svg"),
  hipaa: asset("/optavius/badge-hipaa.svg"),
  gdpr: asset("/optavius/badge-gdpr.svg"),
  euai: asset("/optavius/badge-euai.svg"),
  fhir: asset("/optavius/badge-fhir.svg"),
  baa: asset("/optavius/badge-baa.svg"),
};
export const INTEGRATION_LOGOS = {
  ehr: [
    { name: "RevolutionEHR", src: asset("/optavius/int-revolutionehr.png") },
    { name: "Crystal PM", src: asset("/optavius/int-crystalpm.png") },
    { name: "Compulink", src: asset("/optavius/int-compulink.png") },
    { name: "Eyefinity", src: asset("/optavius/int-eyefinity.svg") },
    { name: "MaximEyes", src: asset("/optavius/int-maximeyes.png") },
    { name: "DrChrono", src: asset("/optavius/int-drchrono.png") },
    { name: "ModMed", src: asset("/optavius/int-modmed.png") },
    { name: "Epic", src: asset("/optavius/int-epic.png") },
    { name: "ChipSoft", src: asset("/optavius/int-chipsoft.png") },
  ],
  phone: [
    { name: "RingCentral", src: asset("/optavius/int-ringcentral.png") },
    { name: "Zoom Phone", src: asset("/optavius/int-zoom.svg") },
    { name: "Twilio", src: asset("/optavius/int-twilio.svg") },
    { name: "Vonage", src: asset("/optavius/int-vonage.svg") },
  ],
  tools: [
    { name: "Google Calendar", src: asset("/optavius/int-googlecalendar.svg") },
    { name: "Salesforce", src: asset("/optavius/int-salesforce.svg") },
    { name: "Slack", src: asset("/optavius/int-slack.svg") },
  ],
};

/** Cal.com booking pages per language (the part after cal.com/). Empty until the links are supplied: buttons then open the demo page. */
export const CAL_LINKS: Record<string, string> = { en: "yves-prevoo-amfqaq/demo-link-en", nl: "yves-prevoo-amfqaq/15min", de: "yves-prevoo-amfqaq/demo-link-de" };
