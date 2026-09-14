import { EQUIPMENT_CATEGORIES } from "@/data/site";

export type EquipmentCategorySlug = (typeof EQUIPMENT_CATEGORIES)[number]["slug"];
export type PublicationStatus = "published" | "withheld" | "design-in-development" | "reference-only";

export type EquipmentProduct = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string | null;
  imageAlt: string;
  category: EquipmentCategorySlug;
  categoryLabel: string;
  price: string | null;
  currency: string | null;
  stockStatus: "in-stock" | "out-of-stock" | "on-backorder" | "inquiry";
  purchasable: boolean;
  purchaseUrl: string | null;
  publicationStatus: PublicationStatus;
  provenance: string;
};

export type BowReviewRecord = {
  slug: string;
  title: string;
  publicationStatus: Exclude<PublicationStatus, "published">;
  summary: string;
  imageDecision: string;
  facts?: string[];
  sources?: { label: string; url: string }[];
};

export const BOW_REVIEW_RECORDS: BowReviewRecord[] = [
  {
    slug: "aurelion",
    title: "Aurelion",
    publicationStatus: "design-in-development",
    summary: "Jan Franko original prototype. Product claims and unrelated third-party bow photography have been withdrawn until Jan supplies and approves the recreated design artwork.",
    imageDecision: "No image is published. Owner artwork required.",
  },
  {
    slug: "silverion",
    title: "Silverion",
    publicationStatus: "design-in-development",
    summary: "Jan Franko original prototype. Product claims and unrelated third-party bow photography have been withdrawn until Jan supplies and approves the recreated design artwork.",
    imageDecision: "No image is published. Owner artwork required.",
  },
  {
    slug: "samsara",
    title: "Samsara",
    publicationStatus: "design-in-development",
    summary: "Jan Franko original prototype. Product claims and unrelated third-party bow photography have been withdrawn until Jan supplies and approves the recreated design artwork.",
    imageDecision: "No image is published. Owner artwork required.",
  },
  {
    slug: "english-yew-warbow",
    title: "English Yew Warbow",
    publicationStatus: "reference-only",
    summary: "The former short recurved composite bow image and generic sales copy have been withdrawn. Sourced directly from the Mary Rose Trust (1545 wreck of Henry VIII's warship), this reference defines the authentic single-piece yew self-bow standard.",
    imageDecision: "Former mismatched short recurved bow image removed. Photo standard requires a straight, tall (6+ ft), D-section single-piece yew longbow with simple horn nocks.",
    facts: [
      "Sourced from the Mary Rose (1545): 172 complete longbows, 2,000+ arrows, 4 longbow chests, 7 arrow chests, 24 leather wristguards (stamped with Henry VIII & Katherine of Aragon arms), and hemp/linen strings — the only precisely dated surviving historical archery assemblage.",
      "Single-piece yew self-bow: Cut to preserve the natural junction of flexible sapwood (back) and compression-resistant heartwood (belly). NOT a composite or laminated bow.",
      "Exact dimensions: Length 1,839–2,113 mm (6 ft to 6 ft 11 in); D-shaped cross-section (~35 mm wide × 33 mm deep at centre).",
      "Draw weight range: 65–175 lbs, with peak draw weight around 110 lbs.",
      "Straight profile with simple horn nocks; zero recurve, reflex, or hooked tips.",
      "Associated arrows: Poplar wood shafts (715–845 mm), predicted draw length 28–30 in (712–762 mm), with goose/swan feather fletchings.",
    ],
    sources: [
      { label: "Mary Rose Trust — Longbows and arrows", url: "https://maryrose.org/discover/collections/the-weaponry-of-the-mary-rose/longbows-and-arrows/" },
    ],
  },
  {
    slug: "slavic-bow",
    title: "Slavic / Ancient Rus Composite Bow",
    publicationStatus: "reference-only",
    summary: "The former dramatically hooked horsebow image and unsourced sales copy have been withdrawn. Based on published archaeological research from Ancient Rus (9th–13th century), this reference defines the authentic East Slavic composite bow standard.",
    imageDecision: "Former mismatched image with large curled siyahs removed. Standard requires a verified Rus reconstruction (Medvedev-based) or licensed archaeological diagram depicting the smoothed 'M' strung profile.",
    facts: [
      "Archaeological evidence from 15 complexes (Gnezdovo, Shestovitsa, Timerevo, 10th c. onward): Ancient Rus composite bows are classified into Hungarian (most prominent) and Pechenegian (Turkic) structural types.",
      "Associated with the elite Rus warrior druzhina and early medieval urban garrisons, representing a fusion of steppe technology adapted for East Slavic conditions.",
      "Construction: Wooden core (kibit') reinforced with bone and antler laths at the grip, tips ('ears'), and arms, bound with sinew and wrapped in protective birch bark.",
      "Strung profile: Forms a smoothed 'M' shape rather than the deep, sharply hooked siyah tip curvature of later Mongolian or Ottoman flight bows.",
      "Do NOT use generic horsebow photography showing large, sharply curled hook-shaped siyahs, which belong to distinct steppe traditions.",
    ],
    sources: [
      { label: "Mikhailov & Kainov — Finds of Structural Details of Composite Bows from Ancient Rus (2011)", url: "https://www.researchgate.net/publication/274274136_Finds_of_structural_details_of_composite_bows_from_Ancient_Rus" },
      { label: "A. F. Medvedev — Ruchnoe metatel'noe oruzhie (VIII–XIV vv.)", url: "https://www.academia.edu/30139333" },
      { label: "Bow International — Ancient Russian Archery", url: "https://www.everand.com/article/473247841/Ancient-Russian-Archery" },
      { label: "Slavic composite bows — Slovene.Online", url: "https://slovene.online/slavic-traditions/slavic-composite-bows/" },
    ],
  },
  ...[
    ["ottoman-flight-bow", "Ottoman Flight Bow"],
    ["turkish-horsebow", "Turkish Horsebow"],
    ["arctic-inuit-bow", "Arctic Inuit Bow"],
    ["amazonian-tribal-bow", "Amazonian Tribal Bow"],
    ["native-american-bow", "Native American Bow"],
    ["viking-bow", "Viking Bow"],
    ["english-longbow", "English Longbow"],
    ["tibetan-bow", "Tibetan Bow"],
    ["bhutan-traditional-bow", "Bhutan Traditional Bow"],
    ["korean-gakgung", "Korean Gakgung"],
    ["manchu-bow", "Manchu Bow"],
    ["hungarian-steppe-bow", "Hungarian Steppe Bow"],
    ["mongolian-bow", "Mongolian Bow"],
    ["scythian-bow", "Scythian Bow"],
    ["assyrian-bow", "Assyrian Bow"],
    ["cosmic-snake", "Cosmic Snake"],
    ["fire-horse", "Fire Horse"],
  ].map(([slug, title]) => ({
    slug,
    title,
    publicationStatus: "withheld" as const,
    summary: "This culturally or historically named bow has been removed from the public sales catalog pending a bow-by-bow source, construction, silhouette, photograph, and usage-rights review.",
    imageDecision: "Existing image withheld until Jan confirms the research and photographic match.",
  })),
];

export const BOW_REVIEW_BY_SLUG = Object.fromEntries(BOW_REVIEW_RECORDS.map((record) => [record.slug, record])) as Record<string, BowReviewRecord>;
export const WITHHELD_BOW_SLUGS = new Set(BOW_REVIEW_RECORDS.map((record) => record.slug));

export function inferEquipmentCategory(slug: string, title: string): EquipmentCategorySlug {
  const value = `${slug} ${title}`.toLowerCase();
  if (value.includes("target")) return "targets";
  if (value.includes("kit") || value.includes("practice set")) return "training-kits";
  if (value.includes("arrow") || value.includes("shaft")) return "arrows-shafts";
  if (["quiver", "thumb ring", "glove", "armguard", "accessor", "bow case", "belt"].some((term) => value.includes(term))) return "accessories";
  return "bows";
}

export const FALLBACK_EQUIPMENT_PRODUCTS: EquipmentProduct[] = [
  { id: 1, slug: "first-step-academy-kit", title: "First Step Academy Kit", excerpt: "An introductory equipment bundle reviewed during consultation for the participant’s height, draw length, and draw weight.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/IMG-20260214-WA0032.jpg", imageAlt: "First Step Academy Kit equipment", category: "training-kits", categoryLabel: "Training Kits", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product photograph." },
  { id: 2, slug: "thumb-rings", title: "Thumb Rings", excerpt: "Protective thumb rings for Asiatic and horse-archery release styles; sizing is confirmed before ordering.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/thumbring_7_400x.jpg", imageAlt: "Thumb rings for traditional archery", category: "accessories", categoryLabel: "Accessories", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product photograph." },
  { id: 3, slug: "shooting-gloves", title: "Shooting Gloves", excerpt: "Traditional shooting gloves selected for fit, protection, and the intended release style.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/Screenshot-2026-04-28-125913.png", imageAlt: "Traditional archery shooting gloves", category: "accessories", categoryLabel: "Accessories", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product image." },
  { id: 4, slug: "armguards", title: "Armguards", excerpt: "Protective armguards for traditional practice, fitted to the archer and training context.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/Screenshot-2026-04-28-125710.png", imageAlt: "Traditional archery armguards", category: "accessories", categoryLabel: "Accessories", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product image." },
  { id: 5, slug: "mongolian-sur-target", title: "Mongolian Sur Target", excerpt: "A traditional handmade Sur target photographed in the existing Jan Franko catalog and kept in the dedicated Targets category.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/IMG-20260320-WA0015.jpg", imageAlt: "Traditional Mongolian Sur archery target", category: "targets", categoryLabel: "Targets", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product photograph; target category corrected." },
  { id: 6, slug: "field-quiver", title: "Field Quiver", excerpt: "A leather field quiver for traditional range and field use.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/IMG-20260214-WA0102.jpg", imageAlt: "Leather field quiver", category: "accessories", categoryLabel: "Accessories", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product photograph." },
  { id: 7, slug: "horse-archery-quiver", title: "Horse Archery Quiver", excerpt: "A traditional-style quiver for mounted archery; fit and carrying orientation are confirmed during consultation.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/IMG-20260216-WA0003.jpg", imageAlt: "Horse archery quiver", category: "accessories", categoryLabel: "Accessories", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product photograph." },
];

export function formatMinorPrice(value: string | number | undefined, minorUnit = 2) {
  if (value === undefined || value === null || value === "") return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return (numeric / 10 ** minorUnit).toFixed(minorUnit);
}
