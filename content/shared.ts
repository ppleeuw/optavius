import { asset } from "@/lib/base";
/** Language-independent assets and constants. */
export const TEL_EN = "tel:+19377292674";
export const TEL_EN_DISPLAY = "+1 937 729 2674";
export const TEL_NL = "tel:+3197006532689";
export const TEL_NL_DISPLAY = "+31 970 065 32689";
export const TEL = TEL_EN;
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
  frontdesk: { video: `${G}/hero-frontdesk-video.mp4`, poster: `${G}/hero-frontdesk.jpg` },
  evening: { video: `${G}/hero-evening-video.mp4`, poster: `${G}/hero-evening.jpg` },
  shop: { video: `${G}/hero-shop-video.mp4`, poster: `${G}/hero-shop.jpg` },
  /* the original fold videos (eye-care versions of the reference hero) */
  fold1: { video: asset("/media/a137b179d3b526ee8affb8f4930568ab199f2fb8.mp4"), poster: "" },
  fold2: { video: asset("/media/d7497a6df01e59704d8112a576e2590bfdbe8bab.mp4"), poster: "" },
  fold3: { video: asset("/media/2280befd2e1aad30dca6ffcec7f92046404a6093.mp4"), poster: "" },
  insights: { video: asset("/media/wistia/ob2qtlyzx3.mp4"), poster: asset("/media/wistia/ob2qtlyzx3.jpg") },
  context: { video: asset("/media/wistia/qnnxqeyk4f.mp4"), poster: asset("/media/wistia/qnnxqeyk4f.jpg") },
  product: { video: `${G}/product-frontdesk-video.mp4`, poster: `${G}/product-frontdesk.jpg` },
  ophthalmology: { video: `${G}/spec2-ophthalmology-video.mp4`, poster: `${G}/spec2-ophthalmology.jpg` },
  optometry: { video: `${G}/spec2-optometry-video.mp4`, poster: `${G}/spec2-optometry.jpg` },
  dermatology: { video: `${G}/spec2-dermatology-video.mp4`, poster: `${G}/spec2-dermatology.jpg` },
  veterinary: { video: `${G}/spec2-veterinary-video.mp4`, poster: `${G}/spec2-veterinary.jpg` },
};
export const PEOPLE = {
  feike: { poster: `${G}/feike.jpg` },
  ahmed: { poster: `${G}/ahmed.jpg` },
  tom: { poster: `${G}/tom.jpg` },
};
export const PHOTOS = {
  frontdesk: asset("/optavius/img-frontdesk.jpg"),
  exam: asset("/optavius/img-exam.jpg"),
  shop: asset("/optavius/img-shop.jpg"),
  evening: asset("/optavius/img-evening.jpg"),
  story: asset("/optavius/img-story.jpg"),
  examroom: asset("/optavius/img-examroom.jpg"),
  slitlamp: asset("/optavius/img-slitlamp.jpg"),
  child: asset("/optavius/img-child.jpg"),
  childexam: asset("/optavius/img-childexam.jpg"),
  yves: asset("/optavius/img-yves.jpg"),
  paul: asset("/optavius/img-paul.jpg"),
  storyOmc: `${G}/story-omc.jpg`,
  storyCubitts: `${G}/story-cubitts.jpg`,
};
/** Trust badges: reuse the generic certification marks, plus Optavius' own SOC 1, FHIR and BAA marks. */
export const BADGES = {
  soc1: asset("/optavius/badge-soc1.svg"),
  iso27001: asset("/optavius/badge-iso27001.svg"),
  hipaa: asset("/media/6d5e654d895c6ff9417b38c6cdc455dc8a4648d5-648x800.svg"),
  gdpr: asset("/optavius/badge-gdpr.svg"),
  euai: asset("/media/7dda42bfedc9b7730088dc9c99dd1651ebefc41f-648x800.svg"),
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
