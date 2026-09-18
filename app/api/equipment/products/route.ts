import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Fetch products from WordPress (10 mins cache revalidation)
    const res = await fetch("https://janfranko.com/wp-json/wp/v2/product?per_page=100&_embed", {
      next: { revalidate: 600 } // 10 minutes cache
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: res.status });
    }
    const products = await res.json();
    if (!Array.isArray(products)) {
      return NextResponse.json([]);
    }

    // Collect all product IDs and featured_media IDs to query specific media attachments directly
    const productIds = products.map((p: any) => p.id).filter(Boolean);
    const featuredMediaIds = Array.from(
      new Set(products.map((p: any) => p.featured_media).filter(Boolean))
    );

    // 2. Fetch media items across pages + targeted media parent & include queries
    const [mediaRes1, mediaRes2, parentMediaRes, targetedMediaRes] = await Promise.all([
      fetch("https://janfranko.com/wp-json/wp/v2/media?per_page=100&page=1", { next: { revalidate: 600 } }),
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

    // 3. Map products to return a simplified structured response with full gallery array
    const mapped = products.map((p: any) => {
      const embeddedImage = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
      const yoastImage = p.yoast_head_json?.og_image?.[0]?.url;
      const mediaMapImage = mediaMap[p.featured_media];

      // Extract inline <img src="..."> images from HTML content
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

      // Attached media gallery sorted by media ID ascending
      const attached = (mediaByParentMap[p.id] || [])
        .sort((a, b) => a.id - b.id)
        .map((m) => m.url);

      // Combine into a deduplicated gallery array
      const gallery = Array.from(
        new Set([featuredImage, ...attached, ...contentImgs].filter(Boolean))
      );

      return {
        id: p.id,
        slug: p.slug,
        title: p.title.rendered,
        content: p.content.rendered,
        excerpt: p.excerpt.rendered,
        date: p.date,
        image: featuredImage,
        gallery,
        categories: p.product_cat || [],
        brands: p.product_brand || []
      };
    });

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
