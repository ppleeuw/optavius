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

export const G = "/optavius/gen";
export const LOGOS = {
  omc: { src: "/optavius/logo-omc.png", alt: "OMC Amstelland" },
  ntx: { src: "/optavius/logo-ntx.png", alt: "North Texas Eye Specialists" },
  ntxWhite: "/optavius/logo-ntx-white.png",
  cubitts: { src: "/optavius/logo-cubitts.svg", alt: "Cubitts" },
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
  fold1: { video: "/media/a137b179d3b526ee8affb8f4930568ab199f2fb8.mp4", poster: "" },
  fold2: { video: "/media/d7497a6df01e59704d8112a576e2590bfdbe8bab.mp4", poster: "" },
  fold3: { video: "/media/2280befd2e1aad30dca6ffcec7f92046404a6093.mp4", poster: "" },
  insights: { video: "/media/wistia/ob2qtlyzx3.mp4", poster: "/media/wistia/ob2qtlyzx3.jpg" },
  context: { video: "/media/wistia/qnnxqeyk4f.mp4", poster: "/media/wistia/qnnxqeyk4f.jpg" },
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
  frontdesk: "/optavius/img-frontdesk.jpg",
  exam: "/optavius/img-exam.jpg",
  shop: "/optavius/img-shop.jpg",
  evening: "/optavius/img-evening.jpg",
  story: "/optavius/img-story.jpg",
  examroom: "/optavius/img-examroom.jpg",
  slitlamp: "/optavius/img-slitlamp.jpg",
  child: "/optavius/img-child.jpg",
  childexam: "/optavius/img-childexam.jpg",
  yves: "/optavius/img-yves.jpg",
  paul: "/optavius/img-paul.jpg",
  storyOmc: `${G}/story-omc.jpg`,
  storyCubitts: `${G}/story-cubitts.jpg`,
};
/** Trust badges: reuse the generic certification marks, plus Optavius' own SOC 1, FHIR and BAA marks. */
export const BADGES = {
  soc1: "/optavius/badge-soc1.svg",
  iso27001: "/optavius/badge-iso27001.svg",
  hipaa: "/media/6d5e654d895c6ff9417b38c6cdc455dc8a4648d5-648x800.svg",
  gdpr: "/optavius/badge-gdpr.svg",
  euai: "/media/7dda42bfedc9b7730088dc9c99dd1651ebefc41f-648x800.svg",
  fhir: "/optavius/badge-fhir.svg",
  baa: "/optavius/badge-baa.svg",
};
export const INTEGRATION_LOGOS = {
  ehr: [
    { name: "RevolutionEHR", src: "/optavius/int-revolutionehr.png" },
    { name: "Crystal PM", src: "/optavius/int-crystalpm.png" },
    { name: "Compulink", src: "/optavius/int-compulink.png" },
    { name: "Eyefinity", src: "/optavius/int-eyefinity.svg" },
    { name: "MaximEyes", src: "/optavius/int-maximeyes.png" },
    { name: "DrChrono", src: "/optavius/int-drchrono.png" },
    { name: "ModMed", src: "/optavius/int-modmed.png" },
    { name: "Epic", src: "/optavius/int-epic.png" },
    { name: "ChipSoft", src: "/optavius/int-chipsoft.png" },
  ],
  phone: [
    { name: "RingCentral", src: "/optavius/int-ringcentral.png" },
    { name: "Zoom Phone", src: "/optavius/int-zoom.svg" },
    { name: "Twilio", src: "/optavius/int-twilio.svg" },
    { name: "Vonage", src: "/optavius/int-vonage.svg" },
  ],
  tools: [
    { name: "Google Calendar", src: "/optavius/int-googlecalendar.svg" },
    { name: "Salesforce", src: "/optavius/int-salesforce.svg" },
    { name: "Slack", src: "/optavius/int-slack.svg" },
  ],
};

/** Cal.com booking pages per language (the part after cal.com/). Empty until the links are supplied: buttons then open the demo page. */
export const CAL_LINKS: Record<string, string> = { en: "yves-prevoo-amfqaq/demo-link-en", nl: "yves-prevoo-amfqaq/15min", de: "yves-prevoo-amfqaq/demo-link-de" };
