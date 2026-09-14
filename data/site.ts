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

export type SupportedLanguage = {
  code: string;
  label: string;
  group: "Central & Western Europe" | "Eastern Europe & Caucasus" | "Northern Europe & Baltic" | "Asia & Global";
};

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  { code: "en", label: "English", group: "Central & Western Europe" },
  { code: "de", label: "Deutsch", group: "Central & Western Europe" },
  { code: "sk", label: "Slovenčina", group: "Central & Western Europe" },
  { code: "cs", label: "Čeština", group: "Central & Western Europe" },
  { code: "pl", label: "Polski", group: "Central & Western Europe" },
  { code: "es", label: "Español", group: "Central & Western Europe" },
  { code: "fr", label: "Français", group: "Central & Western Europe" },
  { code: "it", label: "Italiano", group: "Central & Western Europe" },
  { code: "pt", label: "Português", group: "Central & Western Europe" },
  { code: "uk", label: "Українська", group: "Eastern Europe & Caucasus" },
  { code: "ru", label: "Русский", group: "Eastern Europe & Caucasus" },
  { code: "hu", label: "Magyar", group: "Eastern Europe & Caucasus" },
  { code: "ro", label: "Română", group: "Eastern Europe & Caucasus" },
  { code: "bg", label: "Български", group: "Eastern Europe & Caucasus" },
  { code: "el", label: "Ελληνικά", group: "Eastern Europe & Caucasus" },
  { code: "hy", label: "Հայերեն", group: "Eastern Europe & Caucasus" },
  { code: "ka", label: "ქართული", group: "Eastern Europe & Caucasus" },
  { code: "et", label: "Eesti", group: "Northern Europe & Baltic" },
  { code: "lv", label: "Latviešu", group: "Northern Europe & Baltic" },
  { code: "lt", label: "Lietuvių", group: "Northern Europe & Baltic" },
  { code: "no", label: "Norsk", group: "Northern Europe & Baltic" },
  { code: "sv", label: "Svenska", group: "Northern Europe & Baltic" },
  { code: "fi", label: "Suomi", group: "Northern Europe & Baltic" },
  { code: "da", label: "Dansk", group: "Northern Europe & Baltic" },
  { code: "is", label: "Íslenska", group: "Northern Europe & Baltic" },
  { code: "ja", label: "日本語", group: "Asia & Global" },
  { code: "mn", label: "Монгол", group: "Asia & Global" },
  { code: "ko", label: "한국어", group: "Asia & Global" },
  { code: "zh-CN", label: "中文（简体）", group: "Asia & Global" },
  { code: "th", label: "ไทย", group: "Asia & Global" },
  { code: "vi", label: "Tiếng Việt", group: "Asia & Global" },
  { code: "tl", label: "Filipino", group: "Asia & Global" },
  { code: "am", label: "አማርኛ", group: "Asia & Global" },
  { code: "dz", label: "རྫོང་ཁ", group: "Asia & Global" },
] as const;

export const LANGUAGE_GROUPS = [
  "Central & Western Europe",
  "Eastern Europe & Caucasus",
  "Northern Europe & Baltic",
  "Asia & Global",
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
    slug: "accessories",
    name: "Accessories",
    description: "Quivers, armguards, gloves, thumb rings, and field accessories.",
  },
  {
    slug: "training-kits",
    name: "Training Kits",
    description: "Equipment bundles for introductory and retreat-based training.",
  },
] as const;
