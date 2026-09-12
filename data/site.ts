export const SITE = {
  name: "Jan Franko — Explorer Adventures",
  shortName: "Jan Franko",
  academyName: "Traditional Archery Academy",
  productionUrl: "https://janfranko.com",
  email: "contact@janfranko.com",
  phoneDisplay: "+43 664 164 53 60",
  phoneE164: "+436641645360",
  whatsappUrl: "https://wa.me/436641645360",
} as const;

export const PROTECTED_TERMS = [
  "Jan",
  "Jan Franko",
  "Warrick Harvey",
  "Harvey Archery",
  "MR Bows",
  "Miško Rovčanin",
  "Misko Rovcanin",
  "Kadys Bows",
  "KadysBows",
  "Sergey Tolochko",
  "Sergiy Tolochko",
  "Sergey Gennadiyovych Tolochko",
  "Explorer Adventures",
] as const;

export const TRAINING_LOCATIONS = [
  {
    name: "Muránska Planina",
    country: "Slovakia",
    mapUrl: "https://maps.google.com/?q=Mur%C3%A1nska+Planina",
  },
  {
    name: "Podhájska",
    country: "Slovakia",
    mapUrl: "https://maps.google.com/?q=Podh%C3%A1jska+Slovakia",
  },
  {
    name: "Zemiansky Vrbovok",
    country: "Slovakia",
    mapUrl: "https://maps.app.goo.gl/qSnTn4Xv527XThck9",
  },
  {
    name: "Ehrwald",
    country: "Austria",
    mapUrl: "https://maps.app.goo.gl/UB2Zb1N5aTS42fuA8",
  },
  {
    name: "Bankov",
    country: "Košice, Slovakia",
    mapUrl: "https://maps.google.com/?q=Bankov+Ko%C5%A1ice",
  },
  {
    name: "Eisenbach",
    country: "Germany",
    mapUrl: "https://maps.app.goo.gl/SMkPXijFfkkPdQmx7",
  },
] as const;

export const ACADEMY_LINKS = [
  { label: "The Raptor Path", href: "/academy/raptor-path" },
  { label: "Special Practice Retreats", href: "/academy/special-practice-retreats" },
  { label: "The Archer’s Virtues", href: "/academy/archers-virtues" },
  { label: "Training Philosophy", href: "/academy/training-philosophy" },
  { label: "Code of Conduct", href: "/academy/code-of-conduct" },
  { label: "Archery Games", href: "/archery-games" },
] as const;

export const PROGRAM_LINKS = [
  { label: "All Programs", href: "/programs" },
  { label: "Expeditions", href: "/programs?program_type=expedition" },
  { label: "Field Work & Cultural Exploration", href: "/programs?program_type=cultural-immersion" },
  { label: "Nomadic Encounters", href: "/programs?program_type=equestrian-archery" },
  { label: "Corporate & Team-Building", href: "/programs?program_type=corporate-training" },
  { label: "Retreats", href: "/programs?program_type=retreat" },
] as const;

export const EQUIPMENT_CATEGORIES = [
  {
    slug: "bows",
    name: "Bows",
    description: "Historically and culturally verified bows only. Unverified listings remain withheld.",
  },
  {
    slug: "master-bowyers",
    name: "Master Bowyers",
    description: "Individual commissions from Warrick Harvey, MR Bows, and Kadys Bows.",
  },
  {
    slug: "targets",
    name: "Targets",
    description: "Traditional and field-practice targets kept separate from bow inventory.",
  },
  {
    slug: "arrows-shafts",
    name: "Arrows & Shafts",
    description: "Matched shaft and arrow configurations for specific bows and shooting styles.",
  },
  {
    slug: "quivers-accessories",
    name: "Quivers & Accessories",
    description: "Quivers, armguards, gloves, thumb rings, and field accessories.",
  },
  {
    slug: "training-kits",
    name: "Training Kits",
    description: "Equipment bundles for introductory and retreat-based training.",
  },
] as const;
