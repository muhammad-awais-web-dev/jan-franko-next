import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cacheOpts = { next: { revalidate: 86400 } }; // 24 hours cache revalidation

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

      return {
        id: b.id,
        name: b.name,
        slug: b.slug,
        heading: b.acf?.heading || "",
        bowyer_name: b.acf?.bowyer_name || "",
        story: b.acf?.bowyer_story || b.description || "",
        philosophy: b.acf?.bowyer_philosophy || "",
        image,
        process: b.acf?.bowyer_process || []
      };
    });

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
