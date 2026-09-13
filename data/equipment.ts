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
    summary: "The former short recurved-bow image and generic sales copy have been withdrawn. This page now records only the Mary Rose–based identification standard; the bow is not offered until a rights-cleared, verified photograph is approved.",
    imageDecision: "Former mismatched image removed. No replacement photo is published without verified subject identity and usage rights.",
    facts: [
      "A one-piece yew self bow, rather than a laminated or horn-sinew composite bow.",
      "The Mary Rose bows measure approximately 1,839–2,113 mm (about 6–7 ft).",
      "A characteristic D-shaped cross-section: sapwood on the back and heartwood on the belly.",
      "Straight longbow profile with simple horn nocks; no recurved or dramatically hooked tips.",
    ],
    sources: [
      { label: "Mary Rose Trust — Longbows and arrows", url: "https://maryrose.org/discover/collections/the-weaponry-of-the-mary-rose/longbows-and-arrows/" },
    ],
  },
  {
    slug: "slavic-bow",
    title: "Slavic / Ancient Rus Composite Bow",
    publicationStatus: "reference-only",
    summary: "The former dramatically hooked horsebow image and unsourced sales copy have been withdrawn. This page now records the documented Ancient Rus identification standard only; no product is offered until Jan approves a verified reconstruction image.",
    imageDecision: "Former mismatched image removed. A verified Ancient Rus reconstruction or properly licensed archaeological diagram is required.",
    facts: [
      "Ancient Rus finds are commonly classified as Hungarian and Pechenegian (Turkic) structural types from the 10th century onward.",
      "They used a wooden core reinforced with bone or antler laths, sinew binding, and birch-bark wrapping.",
      "The strung profile is described in accessible summaries as a smoothed M shape.",
      "Large, deeply curled hook-shaped siyahs must not be used as the defining image for this listing.",
    ],
    sources: [
      { label: "Mikhailov & Kainov — Finds of Structural Details of Composite Bows from Ancient Rus", url: "https://www.researchgate.net/publication/274274136_Finds_of_structural_details_of_composite_bows_from_Ancient_Rus" },
      { label: "Slavic composite bows — Slovene.Online", url: "https://slovene.online/slavic-traditions/slavic-composite-bows/" },
      { label: "A. F. Medvedev — Ruchnoe metatel'noe oruzhie", url: "https://www.academia.edu/30139333" },
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
  if (["quiver", "thumb ring", "glove", "armguard", "accessor", "bow case", "belt"].some((term) => value.includes(term))) return "quivers-accessories";
  return "bows";
}

export const FALLBACK_EQUIPMENT_PRODUCTS: EquipmentProduct[] = [
  { id: 1, slug: "first-step-academy-kit", title: "First Step Academy Kit", excerpt: "An introductory equipment bundle reviewed during consultation for the participant’s height, draw length, and draw weight.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/IMG-20260214-WA0032.jpg", imageAlt: "First Step Academy Kit equipment", category: "training-kits", categoryLabel: "Training Kits", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product photograph." },
  { id: 2, slug: "thumb-rings", title: "Thumb Rings", excerpt: "Protective thumb rings for Asiatic and horse-archery release styles; sizing is confirmed before ordering.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/thumbring_7_400x.jpg", imageAlt: "Thumb rings for traditional archery", category: "quivers-accessories", categoryLabel: "Quivers & Accessories", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product photograph." },
  { id: 3, slug: "shooting-gloves", title: "Shooting Gloves", excerpt: "Traditional shooting gloves selected for fit, protection, and the intended release style.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/Screenshot-2026-04-28-125913.png", imageAlt: "Traditional archery shooting gloves", category: "quivers-accessories", categoryLabel: "Quivers & Accessories", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product image." },
  { id: 4, slug: "armguards", title: "Armguards", excerpt: "Protective armguards for traditional practice, fitted to the archer and training context.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/Screenshot-2026-04-28-125710.png", imageAlt: "Traditional archery armguards", category: "quivers-accessories", categoryLabel: "Quivers & Accessories", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product image." },
  { id: 5, slug: "mongolian-sur-target", title: "Mongolian Sur Target", excerpt: "A traditional handmade Sur target photographed in the existing Jan Franko catalog and kept in the dedicated Targets category.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/IMG-20260320-WA0015.jpg", imageAlt: "Traditional Mongolian Sur archery target", category: "targets", categoryLabel: "Targets", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product photograph; target category corrected." },
  { id: 6, slug: "field-quiver", title: "Field Quiver", excerpt: "A leather field quiver for traditional range and field use.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/IMG-20260214-WA0102.jpg", imageAlt: "Leather field quiver", category: "quivers-accessories", categoryLabel: "Quivers & Accessories", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product photograph." },
  { id: 7, slug: "horse-archery-quiver", title: "Horse Archery Quiver", excerpt: "A traditional-style quiver for mounted archery; fit and carrying orientation are confirmed during consultation.", content: "", date: "2026-03-01", image: "https://janfranko.com/wp-content/uploads/2026/03/IMG-20260216-WA0003.jpg", imageAlt: "Horse archery quiver", category: "quivers-accessories", categoryLabel: "Quivers & Accessories", price: null, currency: null, stockStatus: "inquiry", purchasable: false, purchaseUrl: null, publicationStatus: "published", provenance: "Existing Jan Franko media-library product photograph." },
];

export function formatMinorPrice(value: string | number | undefined, minorUnit = 2) {
  if (value === undefined || value === null || value === "") return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return (numeric / 10 ** minorUnit).toFixed(minorUnit);
}
