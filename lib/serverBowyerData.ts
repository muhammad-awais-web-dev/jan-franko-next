/**
 * Server-side data fetching helper for Master Bowyer products, bowyer profiles, and categories.
 * Runs inside Next.js Server Components with automatic caching & revalidation.
 */

export interface MappedBowyerProduct {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  image: string;
  gallery: string[];
  categories: number[];
  bowyerIds: number[];
  acf: Record<string, any>;
}

export interface ServerBowyerDetails {
  id: number;
  name: string;
  slug: string;
  heading: string;
  bowyer_name?: string;
  story: string;
  philosophy: string;
  image: string;
  process: { step_title: string; step_description: string }[];
}

export interface ServerCategoryTerm {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

const WP_BASE_URL = "https://janfranko.com/wp-json/wp/v2";

const extractUrl = (img: any): string => {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.sizes?.large || img.url || img.image_url || img.source_url || "";
};

const formatBowTitle = (rawTitle: string | undefined, slug?: string): string => {
  const raw = (rawTitle || slug || "")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();

  if (!raw) return "";

  let base = raw;
  if (base.includes("-") || base === base.toLowerCase() || base.toLowerCase().includes("luk")) {
    base = base.replace(/-/g, " ");
  }

  const translations: Record<string, string> = {
    rekursivnij: "Recurve",
    recurve: "Recurve",
    recursive: "Recurve",
    dovgij: "Longbow",
    longbow: "Longbow",
    longbows: "Longbow",
    long: "Longbow",
    mislivskij: "Hunting",
    hunting: "Hunting",
    luk: "Bow",
    ugorskij: "(Hungarian)",
    hungarian: "(Hungarian)",
    tureckij: "(Turkish)",
    turkish: "(Turkish)",
    krimsko: "Crimean",
    tatarskij: "Tatar",
    crimean: "Crimean",
    tatar: "Tatar",
    mongolskij: "(Mongolian)",
    mongolian: "(Mongolian)",
    manchzhurskij: "(Manchu)",
    manchurian: "(Manchu)",
    manchu: "(Manchu)",
    amarant: "Amaranth",
    amaranth: "Amaranth",
    vv: "BB",
    bb: "BB",
    mlb: "MLB",
    orhanturkish: "Orhan (Turkish)",
    orhan: "Orhan",
    hoder: "Hoder",
    aspid: "Aspid",
    khan: "Khan",
    pioneer: "Pioneer",
    richard: "Richard",
    nail: "Nail",
    leon: "Leon",
    lynx: "Lynx",
    mongol: "Mongol",
    ashur: "Ashur",
    assyrian: "Assyrian",
    childrens: "Children's",
    mamba: "Mamba",
    black: "Black",
    basic: "Basic",
    puzzle: "Puzzle",
  };

  const tokens = base.match(/[a-zA-Z0-9#']+/g) || [];
  const cleaned: string[] = [];

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (translations[lower]) {
      cleaned.push(translations[lower]);
    } else if (/^\d+$/.test(token) && token.length === 4 && parseInt(token, 10) > 1000) {
      cleaned.push(`#${token}`);
    } else if (/^\d+$/.test(token)) {
      cleaned.push(`#${token}`);
    } else {
      cleaned.push(token.charAt(0).toUpperCase() + token.slice(1).toLowerCase());
    }
  }

  let result = cleaned.join(" ");
  result = result.replace(/\b(Longbow|Recurve|Hunting|Bow)\s+\1\b/gi, "$1");
  result = result.replace(/\bLongbow\s+Bow\b/gi, "Longbow");
  result = result.replace(/\bRecurve\s+Bow\s+Bow\b/gi, "Recurve Bow");

  return result || rawTitle || slug || "";
};

export async function fetchServerMasterBowyerProducts(options: {
  bowyerId?: number | string;
  slug?: string;
}): Promise<MappedBowyerProduct[]> {
  try {
    let url = `${WP_BASE_URL}/master-bower-product?acf_format=standard&per_page=100`;
    if (options.bowyerId) {
      url += `&bowyer=${options.bowyerId}`;
    } else if (options.slug) {
      url += `&slug=${options.slug}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const products = await res.json();
    if (!Array.isArray(products)) return [];

    return products.map((p: any) => {
      let gallery: string[] = [];
      const productGallery = p.acf?.product_gallery;
      const heroGallery = p.acf?.hero_gallery;

      if (Array.isArray(productGallery) && productGallery.length > 0) {
        gallery = productGallery.map(extractUrl).filter(Boolean);
      } else if (Array.isArray(heroGallery) && heroGallery.length > 0) {
        gallery = heroGallery.map(extractUrl).filter(Boolean);
      }

      const acfImg = extractUrl(p.acf?.product_image) || gallery[0];
      const fallbackImage =
        "https://images.unsplash.com/photo-1511140595276-3d9d0c367cd5?auto=format&fit=crop&w=800&q=80";
      const image = acfImg || fallbackImage;

      if (gallery.length === 0) {
        gallery = [image];
      }

      const title = formatBowTitle(p.title?.rendered, p.slug);

      return {
        id: p.id,
        slug: p.slug,
        title,
        content: p.content?.rendered || "",
        excerpt: p.acf?.product_overview || p.excerpt?.rendered || "",
        date: p.date,
        image,
        gallery,
        categories: p.product_cat || [],
        bowyerIds: p.bowyer || [],
        acf: p.acf || {},
      };
    });
  } catch (err) {
    console.error("Error fetching server master bowyer products:", err);
    return [];
  }
}

export async function fetchServerCategories(): Promise<ServerCategoryTerm[]> {
  try {
    const res = await fetch(`${WP_BASE_URL}/product_cat?per_page=100`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parent: c.parent,
    }));
  } catch {
    return [];
  }
}
