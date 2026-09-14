import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bowyerId = searchParams.get("bowyer");
    const slug = searchParams.get("slug");

    let queryUrl = "https://janfranko.com/wp-json/wp/v2/master-bower-product?acf_format=standard&per_page=100";
    if (bowyerId) {
      queryUrl += `&bowyer=${bowyerId}`;
    } else if (slug) {
      queryUrl += `&slug=${slug}`;
    } else {
      return NextResponse.json({ error: "Missing query parameter (bowyer or slug)" }, { status: 400 });
    }

    // Fetch master bowyer products from WordPress (revalidate 0 for instant sync)
    const res = await fetch(queryUrl, {
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch master bowyer products" }, { status: res.status });
    }

    const products = await res.json();
    if (!Array.isArray(products)) {
      return NextResponse.json([]);
    }

    // Map CPT items to uniform schema
    const mapped = products.map((p: any) => {
      // Resolve image from acf.hero_gallery using standard format fields
      const heroGallery = p.acf?.hero_gallery;
      const firstImage = Array.isArray(heroGallery) && heroGallery.length > 0 ? heroGallery[0] : null;
      
      const acfImage = firstImage?.sizes?.large || firstImage?.url;
      const fallbackImage = "https://images.unsplash.com/photo-1511140595276-3d9d0c367cd5?auto=format&fit=crop&w=800&q=80";
      const image = acfImage || fallbackImage;

      // Extract all gallery images for detail slider
      const gallery = Array.isArray(heroGallery)
        ? heroGallery.map((img: any) => img.sizes?.large || img.url).filter(Boolean)
        : [image];

      return {
        id: p.id,
        slug: p.slug,
        title: p.title?.rendered || "",
        content: p.content?.rendered || "",
        excerpt: p.acf?.product_overview || p.excerpt?.rendered || "",
        date: p.date,
        image,
        gallery,
        categories: p.product_cat || [],
        bowyerIds: p.bowyer || [],
        acf: p.acf || {}
      };
    });

    // If querying by slug, return the single product object or 404
    if (slug) {
      if (mapped.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(mapped[0]);
    }

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
