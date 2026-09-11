import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Fetch products from WordPress (10 mins cache revalidation)
    const res = await fetch("https://janfranko.com/wp-json/wp/v2/product?per_page=100", {
      next: { revalidate: 600 } // 10 minutes cache
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: res.status });
    }
    const products = await res.json();

    // 2. Fetch media items across pages to collect all product attachments
    const [mediaRes1, mediaRes2] = await Promise.all([
      fetch("https://janfranko.com/wp-json/wp/v2/media?per_page=100&page=1", { next: { revalidate: 600 } }),
      fetch("https://janfranko.com/wp-json/wp/v2/media?per_page=100&page=2", { next: { revalidate: 600 } }).catch(() => null)
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

    let mediaMap: Record<number, string> = {};
    let mediaByParentMap: Record<number, string[]> = {};

    mediaItems.forEach((item: any) => {
      if (item.id && item.source_url) {
        mediaMap[item.id] = item.source_url;
      }
      if (item.parent && item.source_url) {
        if (!mediaByParentMap[item.parent]) {
          mediaByParentMap[item.parent] = [];
        }
        if (!mediaByParentMap[item.parent].includes(item.source_url)) {
          mediaByParentMap[item.parent].push(item.source_url);
        }
      }
    });

    // 3. Map products to return a simplified structured response with full gallery array
    const mapped = products.map((p: any) => {
      const yoastImage = p.yoast_head_json?.og_image?.[0]?.url;
      const featuredImage = yoastImage || mediaMap[p.featured_media] || "https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=1200&q=80";

      // Attached media gallery
      const attached = mediaByParentMap[p.id] || [];

      // Extract inline <img src="..."> images from HTML content
      const contentHtml = p.content?.rendered || "";
      const regex = /<img[^>]+src=["']([^"']+)["']/gi;
      let match;
      const contentImgs: string[] = [];
      while ((match = regex.exec(contentHtml)) !== null) {
        if (match[1]) contentImgs.push(match[1]);
      }

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
