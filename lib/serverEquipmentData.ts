/**
 * Server-side data fetching helper for Equipment products and categories.
 * Runs inside Next.js Server Components with automatic caching & revalidation.
 */

import { BOW_REVIEW_RECORDS, FALLBACK_EQUIPMENT_PRODUCTS } from "@/data/equipment";

export interface ServerEquipmentProduct {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  gallery: string[];
  categories: number[];
  brands: number[];
}

export interface ServerCategoryTerm {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

const KNOWN_FALLBACK_PRODUCTS: Record<string, ServerEquipmentProduct> = {
  "slavic-bow": {
    id: 1992,
    slug: "slavic-bow",
    title: "Slavic / Ancient Rus Composite Bow",
    excerpt: "Based on published archaeological research from Ancient Rus (9th–13th century), defining the authentic East Slavic composite bow standard.",
    content: `<h3>Archaeological Reference Standard</h3>
<p>Sourced from published archaeological research across 15 complexes (Gnezdovo, Shestovitsa, Timerevo, 10th c. onward). Ancient Rus composite bows represent a fusion of steppe technology adapted for East Slavic warrior culture.</p>
<h4>Key Historical Specifications</h4>
<ul>
  <li><strong>Construction:</strong> Wooden core (kibit') reinforced with bone/antler laths at grip and tips, bound with sinew and wrapped in protective birch bark.</li>
  <li><strong>Strung Profile:</strong> Forms a smoothed 'M' shape rather than deep, sharply hooked siyah tip curvature.</li>
  <li><strong>Provenance:</strong> Associated with the elite Rus warrior druzhina and early medieval urban garrisons.</li>
</ul>`,
    date: "2026-03-01",
    image: "https://janfranko.com/wp-content/uploads/2026/03/spartak-scaled-1-1024x768.jpg",
    gallery: [
      "https://janfranko.com/wp-content/uploads/2026/03/spartak-scaled-1-1024x768.jpg",
      "https://janfranko.com/wp-content/uploads/2026/03/tiron-scaled-1-1024x768.jpg"
    ],
    categories: [114],
    brands: [114]
  },
  "english-yew-warbow": {
    id: 1991,
    slug: "english-yew-warbow",
    title: "English Yew Warbow",
    excerpt: "Single-piece yew self-bow reference standard sourced directly from the Mary Rose Trust (1545 wreck of Henry VIII's warship).",
    content: `<h3>Mary Rose Trust (1545) Fact Sheet</h3>
<p>Sourced directly from the Mary Rose Trust—the museum that recovered and studies the 172 complete longbows from Henry VIII's warship (sunk 1545).</p>
<h4>Key Historical Specifications</h4>
<ul>
  <li><strong>Crafting Method:</strong> Single-piece yew self-bow, preserving flexible sapwood (back) and compression-resistant heartwood (belly). NOT a composite or laminated bow.</li>
  <li><strong>Dimensions:</strong> Length 1,839–2,113 mm (6 ft to 6 ft 11 in); D-shaped cross-section (~35 mm wide × 33 mm deep at centre).</li>
  <li><strong>Draw Weight Range:</strong> 65–175 lbs, with peak draw weight around 110 lbs.</li>
  <li><strong>Profile:</strong> Straight profile with simple horn nocks; zero recurve, reflex, or hooked tips.</li>
</ul>`,
    date: "2026-03-01",
    image: "https://janfranko.com/wp-content/uploads/2026/04/Harvey-Archery-Taking-Shot.jpg",
    gallery: [
      "https://janfranko.com/wp-content/uploads/2026/04/Harvey-Archery-Taking-Shot.jpg",
      "https://janfranko.com/wp-content/uploads/2026/04/crowned-eagle_1-1024x768.jpg"
    ],
    categories: [114],
    brands: [114]
  },
  "mongolian-sur-target": {
    id: 140,
    slug: "mongolian-sur-target",
    title: "Mongolian Sur Target",
    excerpt: "A traditional handmade Sur target photographed in the existing Jan Franko catalog and kept in the dedicated Targets category.",
    content: `<p>Handmade traditional leather and woven fiber Sur target cylinders designed for traditional field and range archery practice.</p>`,
    date: "2026-03-01",
    image: "https://janfranko.com/wp-content/uploads/2026/03/IMG-20260320-WA0015.jpg",
    gallery: ["https://janfranko.com/wp-content/uploads/2026/03/IMG-20260320-WA0015.jpg"],
    categories: [115],
    brands: [114]
  }
};

export function getStaticFallbackEquipmentProduct(slugParam: string): ServerEquipmentProduct | null {
  if (!slugParam) return null;
  const normalized = String(slugParam).toLowerCase();

  if (KNOWN_FALLBACK_PRODUCTS[normalized]) {
    return KNOWN_FALLBACK_PRODUCTS[normalized];
  }

  const fallbackMatch = FALLBACK_EQUIPMENT_PRODUCTS.find((p) => p.slug === normalized);
  if (fallbackMatch) {
    return {
      id: fallbackMatch.id,
      slug: fallbackMatch.slug,
      title: fallbackMatch.title,
      excerpt: fallbackMatch.excerpt,
      content: fallbackMatch.content || `<p>${fallbackMatch.excerpt}</p>`,
      date: fallbackMatch.date,
      image: fallbackMatch.image || "https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=1200&q=80",
      gallery: fallbackMatch.image ? [fallbackMatch.image] : [],
      categories: [114],
      brands: [114]
    };
  }

  const reviewMatch = BOW_REVIEW_RECORDS.find((r) => r.slug === normalized);
  if (reviewMatch) {
    return {
      id: 9900 + reviewMatch.slug.length,
      slug: reviewMatch.slug,
      title: reviewMatch.title,
      excerpt: reviewMatch.summary,
      content: `<h3>${reviewMatch.title} — Reference Document</h3><p>${reviewMatch.summary}</p>${reviewMatch.facts ? `<ul>${reviewMatch.facts.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}`,
      date: "2026-03-01",
      image: "https://janfranko.com/wp-content/uploads/2026/03/spartak-scaled-1-1024x768.jpg",
      gallery: ["https://janfranko.com/wp-content/uploads/2026/03/spartak-scaled-1-1024x768.jpg"],
      categories: [114],
      brands: [114]
    };
  }

  return null;
}

export async function fetchServerEquipmentProducts(options?: { slug?: string }): Promise<ServerEquipmentProduct[]> {
  try {
    const url = options?.slug
      ? `https://janfranko.com/wp-json/wp/v2/product?slug=${encodeURIComponent(options.slug)}&_embed`
      : "https://janfranko.com/wp-json/wp/v2/product?per_page=100&_embed";

    const res = await fetch(url, {
      next: { revalidate: 600 }
    });

    if (!res.ok) {
      if (options?.slug) {
        const fallback = getStaticFallbackEquipmentProduct(options.slug);
        return fallback ? [fallback] : [];
      }
      return [];
    }

    const products = await res.json();
    if (!Array.isArray(products) || products.length === 0) {
      if (options?.slug) {
        const fallback = getStaticFallbackEquipmentProduct(options.slug);
        return fallback ? [fallback] : [];
      }
      return [];
    }

    const productIds = products.map((p: any) => p.id).filter(Boolean);
    const featuredMediaIds = Array.from(
      new Set(products.map((p: any) => p.featured_media).filter(Boolean))
    );

    const [mediaRes1, mediaRes2, parentMediaRes, targetedMediaRes] = await Promise.all([
      fetch("https://janfranko.com/wp-json/wp/v2/media?per_page=100&page=1", { next: { revalidate: 600 } }).catch(() => null),
      fetch("https://janfranko.com/wp-json/wp/v2/media?per_page=100&page=2", { next: { revalidate: 600 } }).catch(() => null),
      productIds.length > 0
        ? fetch(`https://janfranko.com/wp-json/wp/v2/media?parent=${productIds.join(",")}&per_page=100`, { next: { revalidate: 600 } }).catch(() => null)
        : null,
      featuredMediaIds.length > 0
        ? fetch(`https://janfranko.com/wp-json/wp/v2/media?include=${featuredMediaIds.join(",")}&per_page=100`, { next: { revalidate: 600 } }).catch(() => null)
        : null
    ]);

    let mediaItems: any[] = [];
    if (mediaRes1 && mediaRes1.ok) {
      const items1 = await mediaRes1.json();
      if (Array.isArray(items1)) mediaItems.push(...items1);
    }
    if (mediaRes2 && mediaRes2.ok) {
      const items2 = await mediaRes2.json();
      if (Array.isArray(items2)) mediaItems.push(...items2);
    }
    if (parentMediaRes && parentMediaRes.ok) {
      const itemsParent = await parentMediaRes.json();
      if (Array.isArray(itemsParent)) mediaItems.push(...itemsParent);
    }
    if (targetedMediaRes && targetedMediaRes.ok) {
      const itemsTargeted = await targetedMediaRes.json();
      if (Array.isArray(itemsTargeted)) mediaItems.push(...itemsTargeted);
    }

    let mediaMap: Record<number, string> = {};
    let mediaByParentMap: Record<number, { id: number; url: string }[]> = {};

    mediaItems.forEach((item: any) => {
      if (item.id && item.source_url) {
        mediaMap[item.id] = item.source_url;
      }
      const parentId = item.post || item.parent;
      if (parentId && item.source_url) {
        if (!mediaByParentMap[parentId]) {
          mediaByParentMap[parentId] = [];
        }
        if (!mediaByParentMap[parentId].some((m) => m.url === item.source_url)) {
          mediaByParentMap[parentId].push({ id: item.id, url: item.source_url });
        }
      }
    });

    const mapped = products.map((p: any) => {
      const embeddedImage = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
      const yoastImage = p.yoast_head_json?.og_image?.[0]?.url;
      const mediaMapImage = mediaMap[p.featured_media];

      const contentHtml = p.content?.rendered || "";
      const regex = /<img[^>]+src=["']([^"']+)["']/gi;
      let match;
      const contentImgs: string[] = [];
      while ((match = regex.exec(contentHtml)) !== null) {
        if (match[1]) contentImgs.push(match[1]);
      }

      const featuredImage =
        embeddedImage ||
        yoastImage ||
        mediaMapImage ||
        contentImgs[0] ||
        "https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=1200&q=80";

      const attached = (mediaByParentMap[p.id] || [])
        .sort((a, b) => a.id - b.id)
        .map((m) => m.url);

      const gallery = Array.from(
        new Set([featuredImage, ...attached, ...contentImgs].filter(Boolean))
      );

      return {
        id: p.id,
        slug: p.slug,
        title: p.title?.rendered || p.slug,
        content: p.content?.rendered || "",
        excerpt: p.excerpt?.rendered || "",
        date: p.date || "2026-03-01",
        image: featuredImage,
        gallery,
        categories: p.product_cat || [],
        brands: p.product_brand || []
      };
    });

    return mapped;
  } catch (err) {
    console.error("fetchServerEquipmentProducts error:", err);
    if (options?.slug) {
      const fallback = getStaticFallbackEquipmentProduct(options.slug);
      return fallback ? [fallback] : [];
    }
    return [];
  }
}

export async function fetchServerEquipmentCategories(): Promise<ServerCategoryTerm[]> {
  try {
    const res = await fetch("https://janfranko.com/wp-json/wp/v2/product_cat?per_page=100", {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parent: c.parent
    }));
  } catch (err) {
    console.error("fetchServerEquipmentCategories error:", err);
    return [];
  }
}
