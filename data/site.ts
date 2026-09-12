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
  "Mr. Bows",
  "Miško Rovčanin",
  "Misko Rovcanin",
  "Kadys Bows",
  "KadysBows",
  "Sergey Tolochko",
  "Sergiy Tolochko",
  "Sergey Gennadiyovych Tolochko",
  "Explorer Adventures",
  "Zruby Dúbrava",
  "Zemiansky Vrbovok",
  "Muránska Planina",
  "Podhájska",
  "Ehrwald",
  "Bankov",
  "Eisenbach"
] as const;

export const TRAINING_LOCATIONS = [
  {
    name: "Zemiansky Vrbovok (Zruby Dúbrava)",
    country: "Slovakia",
    address: "Zruby Dúbrava, Zemiansky Vrbovok 125, 962 41 Zemiansky Vrbovok",
    mapUrl: "https://maps.app.goo.gl/qSnTn4Xv527XThck9",
  },
  {
    name: "Muránska Planina",
    country: "Slovakia",
    address: "Muránska Planina National Park, Muráň",
    mapUrl: "https://maps.google.com/?q=Mur%C3%A1nska+Planina+National+Park+Slovakia",
  },
  {
    name: "Podhájska",
    country: "Slovakia",
    address: "Podhájska",
    mapUrl: "https://maps.google.com/?q=Podh%C3%A1jska+Slovakia",
  },
  {
    name: "Ehrwald",
    country: "Tirol, Austria",
    address: "Ehrwald, Tirol",
    mapUrl: "https://maps.google.com/?q=Ehrwald+Tirol+Austria",
  },
  {
    name: "Bankov",
    country: "Košice, Slovakia",
    address: "Bankov, Košice",
    mapUrl: "https://maps.google.com/?q=Bankov+Kosice+Slovakia",
  },
  {
    name: "Eisenbach",
    country: "Black Forest, Germany",
    address: "Eisenbach, Black Forest",
    mapUrl: "https://maps.google.com/?q=Eisenbach+Black+Forest+Germany",
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

export const DEFAULT_PROGRAM_TYPES = [
  { id: 189, name: "Cultural Immersion", slug: "cultural-immersion" },
  { id: 190, name: "Custom Private Program", slug: "custom-private-program" },
  { id: 191, name: "Expedition", slug: "expedition" },
  { id: 192, name: "Mounted Archery", slug: "equestrian-archery" },
  { id: 194, name: "Retreat", slug: "retreat" },
  { id: 193, name: "Training Program", slug: "training-program" },
];

export const DEFAULT_SKILL_LEVELS = [
  { id: 195, name: "Level 1 – Introductory", slug: "introductory" },
  { id: 196, name: "Level 2 – Training", slug: "training" },
  { id: 197, name: "Level 3 – Expedition", slug: "expedition" },
  { id: 198, name: "Level 4 – Advanced Expedition", slug: "advanced-expedition" },
];

export const DEFAULT_REGIONS = [
  { id: 211, name: "Alps", slug: "alps" },
  { id: 249, name: "Americas", slug: "americas" },
  { id: 247, name: "Asia", slug: "asia" },
  { id: 214, name: "Austria", slug: "austria" },
  { id: 215, name: "Brazil", slug: "brazil" },
  { id: 234, name: "Central Asia", slug: "central-asia" },
  { id: 227, name: "Central Europe", slug: "central-europe" },
  { id: 248, name: "Eurasia", slug: "eurasia" },
];

