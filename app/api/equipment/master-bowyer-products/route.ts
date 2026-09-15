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

      // Title formatting logic (Title Case, no hyphens, proper English names)
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

        // If title is raw slug with hyphens or generic
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
          puzzle: "Puzzle"
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

        return result || p.title?.rendered || p.slug || "";
      };

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
