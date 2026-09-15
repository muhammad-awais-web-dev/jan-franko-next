import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bowyerId = searchParams.get("bowyer");
    const slug = searchParams.get("slug");

    let queryUrl = "https://janfranko.com/wp-json/wp/v2/master-bower-product?acf_format=standard&per_page=100";
    if (bowyerId) {
      queryUrl += `&bowyer_bower=${bowyerId}&bowyer=${bowyerId}`;
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
      const extractUrl = (img: any): string => {
        if (!img) return "";
        if (typeof img === "string") return img;
        return img.sizes?.large || img.url || img.image_url || img.source_url || "";
      };

      let gallery: string[] = [];
      const productGallery = p.acf?.product_gallery;
      const heroGallery = p.acf?.hero_gallery;

      if (Array.isArray(productGallery) && productGallery.length > 0) {
        gallery = productGallery.map(extractUrl).filter(Boolean);
      } else if (Array.isArray(heroGallery) && heroGallery.length > 0) {
        gallery = heroGallery.map(extractUrl).filter(Boolean);
      }

      const acfImg = extractUrl(p.acf?.product_image) || gallery[0];
      const fallbackImage = "https://images.unsplash.com/photo-1511140595276-3d9d0c367cd5?auto=format&fit=crop&w=800&q=80";
      const image = acfImg || fallbackImage;

      if (gallery.length === 0) {
        gallery = [image];
      }

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
