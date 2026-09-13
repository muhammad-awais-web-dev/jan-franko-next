import type { MetadataRoute } from "next";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://janfranko.com").replace(/\/$/, "");

const MASTER_BOWYER_PRODUCT_SLUGS = [
  "raptor",
  "crowned-eagle",
  "lammervanger",
  "tiron",
  "spartak",
  "krstas",
  "obilic",
  "varjag",
  "aga",
  "despot",
  "long-bow-bb-1536",
  "long-bow-b-b-1727",
  "long-bow-b-b-1613",
  "long-bow-bb-1509",
  "long-bow-bb-1500",
  "longbow-aspid-2",
  "longbow-aspid-1",
  "long-bow-pioneer-1718",
  "long-bow-pioneer-1621",
  "long-bow-pioneer-1511",
  "longbow-pioneer",
  "long-bow-nail-amaranth",
  "longbow-nail-2",
  "longbow-nail-1",
  "longbows-b-b-1638",
  "long-bow-b-b-1728",
  "longbow-aspid-4",
  "longbow-aspid-3",
  "longbow-mlb-forest",
  "aspid-puzzle-longbow",
  "longbow-richard",
  "longbow-mlb-2",
  "longbow-mlb-1",
  "longbow-black-mamba-2",
  "longbow-black-mamba-1",
  "longbow-aspid-7",
  "longbow-aspid-6",
  "longbow-aspid-5",
  "recursive-bow-orhan-turkish-1",
  "recursive-bow-orhan-turkish-5",
  "recursive-bow-orhan-turkish-4",
  "recursive-bow-orhan-turkish-3",
  "recursive-bow-orhan-turkish-2",
  "recurve-bow-orhan-turkish-snake",
  "hunting-bow-leon",
  "recursive-bow-khan-malta-crimean-tatar",
  "recursive-bow-hoder-hungarian-2",
  "hunting-bow-lynx-2",
  "hunting-bow-lynx-1",
  "recurve-bow-mongol-mongolian",
  "recursive-bow-manchu-manchurian-1",
  "recursive-bow-khan-crimean-tatar-2",
  "recurve-bow-hoder-hungarian",
  "recurve-bow-hoder-basic-hungarian",
  "recursive-bow-hoder-hungarian-3"
];

const BOWYER_SLUGS = [
  "harvey-archery",
  "warrick-harvey",
  "mr-bows",
  "misko-rovcanin",
  "kadys-bows",
  "sergey-tolochko"
];

const EQUIPMENT_CATEGORY_SLUGS = [
  "bows",
  "master-bowyers",
  "targets",
  "arrows-shafts",
  "quivers-accessories",
  "training-kits",
  "arrow-configurator"
];

const ACADEMY_SUB_SLUGS = [
  "the-academy",
  "certification",
  "explorer-rank-system",
  "environmental-stress-index-esi",
  "summit-protocol",
  "code-of-conduct",
  "raptor-path",
  "special-practice-retreats",
  "archers-virtues",
  "training-philosophy"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Static top-level routes
  const staticRoutes = [
    "",
    "/about",
    "/about/jan-franko",
    "/about/partners",
    "/academy",
    "/archery-games",
    "/programs",
    "/equipment",
    "/equipment/arrow-configurator",
    "/contact",
    "/terms",
    "/privacy-policy",
    "/impressum",
    "/refund-policy",
    "/safety-legal-overview",
    "/editorial",
    "/scrolls",
    "/knowledge",
    "/shipping",
    "/payment-methods",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : route === "/about/jan-franko" || route === "/programs" ? 0.9 : 0.8,
  }));

  // Academy routes
  const academyRoutes = ACADEMY_SUB_SLUGS.map((slug) => ({
    url: `${BASE_URL}/academy/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Master Bowyers routes
  const bowyerRoutes = BOWYER_SLUGS.map((slug) => ({
    url: `${BASE_URL}/bowyer/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Equipment category routes
  const equipmentCategoryRoutes = EQUIPMENT_CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/equipment/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Master Bowyer product routes
  const productRoutes = MASTER_BOWYER_PRODUCT_SLUGS.map((slug) => ({
    url: `${BASE_URL}/master-bower-product/${slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...academyRoutes,
    ...bowyerRoutes,
    ...equipmentCategoryRoutes,
    ...productRoutes,
  ];
}
