import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cacheOpts = { next: { revalidate: 0 } }; // Dynamic fresh WP API data

    // 1. Fetch partner bowyers taxonomy terms with acf_format=standard
    const bowyerRes = await fetch("https://janfranko.com/wp-json/wp/v2/bowyer?acf_format=standard&per_page=100", cacheOpts);
    if (!bowyerRes.ok) {
      return NextResponse.json({ error: "Failed to fetch bowyers" }, { status: bowyerRes.status });
    }
    const bowyers = await bowyerRes.json();
    if (!Array.isArray(bowyers)) {
      return NextResponse.json([]);
    }

    // Filter out Herlan Brothers per client mandate (keep only active 3 bowyers)
    const activeBowyers = bowyers.filter(
      (b: any) => !b.slug.includes("herlan") && !b.slug.includes("dani")
    );

    // 2. Extract profile image attachment IDs for numeric profile_image fields
    const numericImageIds = Array.from(
      new Set(
        activeBowyers
          .map((b: any) => (typeof b.acf?.profile_image === "number" ? b.acf.profile_image : b.acf?.profile_image?.id || b.acf?.profile_image?.ID))
          .filter(Boolean)
      )
    );

    let imageMap: Record<number, string> = {};
    if (numericImageIds.length > 0) {
      const mediaRes = await fetch(`https://janfranko.com/wp-json/wp/v2/media?include=${numericImageIds.join(",")}&per_page=100`, cacheOpts);
      if (mediaRes.ok) {
        const mediaItems = await mediaRes.json();
        mediaItems.forEach((item: any) => {
          imageMap[item.id] = item.source_url;
        });
      }
    }

    const cleanText = (raw: string) => {
      if (!raw) return "";
      return raw
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/&#8220;/g, "“")
        .replace(/&#8221;/g, "”")
        .replace(/&#8216;/g, "‘")
        .replace(/&#8217;/g, "’")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim();
    };

    // 3. Map structured bowyer partner list
    const mapped = activeBowyers.map((b: any) => {
      let image = "";
      if (typeof b.acf?.profile_image === "object" && b.acf?.profile_image) {
        image = b.acf.profile_image.sizes?.large || b.acf.profile_image.url || "";
      } else if (typeof b.acf?.profile_image === "number") {
        image = imageMap[b.acf.profile_image] || "";
      }

      if (!image) {
        image = "https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=1200&q=80";
      }

      const processList = Array.isArray(b.acf?.bowyer_process)
        ? b.acf.bowyer_process.map((p: any) => ({
            step_title: cleanText(p.step_title),
            step_description: cleanText(p.step_description)
          }))
        : [];

      return {
        id: b.id,
        name: cleanText(b.name),
        slug: b.slug,
        heading: cleanText(b.acf?.heading || ""),
        bowyer_name: cleanText(b.acf?.bowyer_name || ""),
        story: cleanText(b.acf?.bowyer_story || b.description || ""),
        philosophy: cleanText(b.acf?.bowyer_philosophy || ""),
        image,
        process: processList
      };
    });

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
