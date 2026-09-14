export type BowyerModel = {
  name: string;
  description: string;
};

export type BowyerPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type MasterBowyer = {
  id: number;
  slug: "warrick-harvey" | "mr-bows" | "kadys-bows";
  legacySlugs: string[];
  brand: string;
  bowyerName: string;
  location: string;
  sourceUrl: string;
  sourceLabel: string;
  introduction: string;
  story: string;
  background: string[];
  materials: string[];
  models: BowyerModel[];
  photos: BowyerPhoto[];
};

export const MASTER_BOWYERS: MasterBowyer[] = [
  {
    id: 1,
    slug: "warrick-harvey",
    legacySlugs: ["harvey-archery"],
    brand: "Harvey Archery",
    bowyerName: "Warrick Harvey",
    location: "Tuli Circle, near East London, South Africa",
    sourceUrl: "https://harveyarchery.com/",
    sourceLabel: "Harvey Archery — official website",
    introduction: "Custom laminated bows made on Warrick Harvey’s family farm in South Africa, with an average of 50 hours of work in a single bow.",
    story: "I have been obsessed with making bows since I was 4 years old and have never stopped making them year in and year out. I got my first plastic bow with those arrows with the rubber plunger that sticks to windows on my 4th birthday. One day I decided to pull the rubber plunger off my arrows and I ended up shooting my mom between the eyes... As a result, the bow was confiscated, and I got a massive hiding. The next day when my parents went to work, I went to my dad's cupboard and stole his shoelace of his running shoes, I went to the garden and chopped down a stick and make my first bow using my dad's shoelace as the bow string. And that's how it all started. I would say my passion for bow making is an obsession, I strive to be known as one of the best custom bow makers in the world.",
    background: [
      "Works from his family farm, Tuli Circle, near East London, South Africa.",
      "Made his first laminated bow in 2006 and formally launched Harvey Archery in 2015.",
      "Produces bows for customers in South Africa, Namibia, Botswana, the USA, Great Britain, and the Far East, including British archery champion Wolfie Hughes.",
      "Spends on average 50 hours crafting a single bow.",
    ],
    materials: [
      "Spalted bamboo core for speed, snappy acceleration, and minimal hand shock.",
      "Stabilized poplar burl, wenge, panga panga, zebrawood, African padauk, Brazilian lacewood, maple, walnut, and teak for exotic risers.",
      "Kudu or gemsbok horn and other natural materials for tip and handle overlays.",
      "Bow weights predominantly between 27 lb and 60 lb.",
    ],
    models: [
      { name: "The Crowned Eagle", description: "60-inch hybrid longbow; a classic, forgiving model with a smooth draw to 32 inches and a quiet shot cycle." },
      { name: "The Raptor", description: "57-inch super-hybrid for hunting and 3D target shooting, with aggressive reflex-deflex geometry." },
      { name: "The Mongoose", description: "58-inch compact model; punchier and faster than the Crowned Eagle and designed for maneuverable hunting setups." },
      { name: "The Ferret", description: "53-inch ultra-short bow with a smooth draw to 30 inches without stacking, made for tight spaces and hunting blinds." },
    ],
    photos: [
      { src: "https://janfranko.com/wp-content/uploads/2026/04/Harvey-Archery-Taking-Shot.jpg", alt: "Warrick Harvey shooting a Harvey Archery bow", caption: "Warrick Harvey / Harvey Archery — Jan Franko media library." },
      { src: "https://janfranko.com/wp-content/uploads/2026/04/raptor_3-1024x1024.jpg", alt: "Harvey Archery Raptor bow", caption: "The Raptor — Harvey Archery product photograph in the Jan Franko media library." },
      { src: "https://janfranko.com/wp-content/uploads/2026/04/crowned-eagle_1-1024x1024.jpg", alt: "Harvey Archery Crowned Eagle bow", caption: "The Crowned Eagle — Harvey Archery product photograph in the Jan Franko media library." },
    ],
  },
  {
    id: 2,
    slug: "mr-bows",
    legacySlugs: ["misko-rovcanin"],
    brand: "MR Bows",
    bowyerName: "Miško Rovčanin",
    location: "Serbia",
    sourceUrl: "https://mrbows.com/en/home/",
    sourceLabel: "MR Bows — official website",
    introduction: "Fiberglass-laminated bows made in Serbia for recreation, physical and mental development, competition, and historical practice.",
    story: "Archery, a dream from the boy's days, has found its way. After completing the training, talking and socializing with both professional and amateur archers, learning from experienced bowyers and following the Internet, my archery begins. I strive to bring life back to the old craft and tradition. With many years of experience, with constant study and improvement, I have tried to make the bows that will meet the expectations of customers, whether it is just recreation, developing physical and mental strength that instinctive archery requires or for competition. Following and respecting world business standards, providing quality and endurance, I have gained a reputation and many satisfied customers. I do business in Serbia and around the world. I try to make a satisfied customer my best recommendation. Find something for you from my range of bows, order and see the quality of the bows for yourself.\n\nBy choosing quality materials, I make fiberglass laminated arches using: Fiberglass (transparent and black), Stable core, Micarta, Epoxy resin, Dacron for tendons. The variety of wood, both from the domestic and exotic terrain, provides the possibility of making it according to the customer's wishes. Ash is the primary material used as a base for making limbs, very elastic and resistant. For handrails I use: Walnut, Ash, Plum, Pear, Cherry... and of the exotic species there are: Zebra, Wenge, Paduk, Olive, Purple Heart... You can find several different models in the offer, some of which are based on their technical characteristics and historical replica records. Other models are constructed by arbitrary personal experience and ideas. I make bows with a strength from 25-150 pounds.",
    background: [
      "Miško Rovčanin makes bows in Serbia and supplies customers around the world.",
      "The range includes models informed by historical replica records and original models developed through personal experience and ideas.",
      "Available draw weights extend from 25 lb to 150 lb, with the final specification agreed directly with the bowyer.",
    ],
    materials: [
      "Transparent or black fiberglass, stable core, Micarta, epoxy resin, and Dacron bowstrings.",
      "Ash as the primary limb-base material for elasticity and resistance.",
      "Walnut, ash, plum, pear, and cherry among the domestic handle woods.",
      "Zebrawood, wenge, padauk, olive, and purpleheart among the exotic handle woods.",
    ],
    models: [
      { name: "Tiron", description: "Traditional fiberglass-laminated recurve bow designed for fast arrow flight and smooth draw cycle." },
      { name: "Spartak", description: "High-performance competition recurve model crafted with exotic hardwood handle and stabilized ash core." },
      { name: "Scythian Replica", description: "Historical composite replica model based on ancient nomad geometry and technical replica records." },
    ],
    photos: [
      { src: "https://janfranko.com/wp-content/uploads/2026/04/16864081_1249414485136489_6658590496747384211_n.jpg", alt: "Miško Rovčanin of MR Bows", caption: "Miško Rovčanin / MR Bows — Jan Franko media library." },
      { src: "https://janfranko.com/wp-content/uploads/2026/03/tiron-scaled-1-1024x768.jpg", alt: "MR Bows Tiron bow", caption: "Tiron — MR Bows product photograph in the Jan Franko media library." },
      { src: "https://janfranko.com/wp-content/uploads/2026/03/spartak-scaled-1-1024x768.jpg", alt: "MR Bows Spartak bow", caption: "Spartak — MR Bows product photograph in the Jan Franko media library." },
    ],
  },
  {
    id: 3,
    slug: "kadys-bows",
    legacySlugs: ["sergey-tolochko"],
    brand: "Kadys Bows",
    bowyerName: "Sergey Tolochko",
    location: "Ukraine",
    sourceUrl: "https://en.kadysbows.com/",
    sourceLabel: "Kadys Bows — official website",
    introduction: "Traditional bows made to individual order by Kadys Bows, founded by Sergey Tolochko in 2011.",
    story: "KadysBows was founded in 2011 by Sergey Tolochko and is currently one of the leading traditional bow makers in the region. Products are used across the countries of the former CIS, as well as Poland, Turkey, Greece, China, South Korea, Cyprus, Malaysia, Malta, and the USA.",
    background: [
      "Founded in 2011 by Sergey Tolochko (Sergiy/Sergey Gennadiyovych Tolochko).",
      "Kadys Bows focuses on traditional bows and individual commissions.",
      "Its bows are used in countries across Europe, Asia, and the United States.",
    ],
    materials: [
      "High-elasticity ash wood limbs with clear or black protective fiberglass lamination.",
      "Ergonomic hand-carved risers crafted from natural domestic and exotic timbers.",
      "Dacron string matrix with reinforced tip nocks.",
      "Custom draw weights tillered individually to order.",
    ],
    models: [
      { name: "Leon", description: "Handcrafted traditional hunting recurve bow featuring ergonomic hardwood grip and smooth draw." },
      { name: "Hoder Hungarian", description: "Asiatic/Hungarian historical recurve bow designed for instinctive field target and mounted archery." },
    ],
    photos: [
      { src: "https://janfranko.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-12-at-11.23.29-PM.jpeg", alt: "Sergey Tolochko of Kadys Bows with traditional bows", caption: "Sergey Tolochko / Kadys Bows — Jan Franko media library." },
      { src: "https://janfranko.com/wp-content/uploads/2026/03/kadys-leon.jpg", alt: "Kadys Bows Leon hunting bow", caption: "Leon hunting bow — Kadys Bows product photograph in the Jan Franko media library." },
      { src: "https://janfranko.com/wp-content/uploads/2026/03/kadys-hoder-hungarian.jpg", alt: "Kadys Bows Hoder Hungarian recurve bow", caption: "Hoder Hungarian recurve — Kadys Bows product photograph in the Jan Franko media library." },
    ],
  },
];

export function findMasterBowyer(slug: string) {
  return MASTER_BOWYERS.find((bowyer) => bowyer.slug === slug || bowyer.legacySlugs.includes(slug));
}
