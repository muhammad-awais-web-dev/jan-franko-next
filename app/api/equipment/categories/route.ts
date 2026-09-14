import { NextResponse } from "next/server";
import { CATEGORY_DESCRIPTIONS } from "@/data/categoryDescriptions";

export async function GET() {
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch("https://janfranko.com/wp-json/wp/v2/product_cat?per_page=100", { next: { revalidate: 60 } }),
      fetch("https://janfranko.com/wp-json/wp/v2/product?per_page=100", { next: { revalidate: 600 } })
    ]);

    if (!catRes.ok) {
      return NextResponse.json({ error: "Failed to fetch product categories" }, { status: catRes.status });
    }

    const categories = await catRes.json();
    const products = prodRes.ok ? await prodRes.json() : [];

    // Count direct products per category ID
    const directCounts: Record<number, number> = {};
    categories.forEach((c: any) => { directCounts[c.id] = 0; });
    products.forEach((p: any) => {
      if (Array.isArray(p.product_cat)) {
        p.product_cat.forEach((catId: number) => {
          directCounts[catId] = (directCounts[catId] || 0) + 1;
        });
      }
    });

    // Helper to calculate total count (direct + all descendants)
    const getTotalCount = (catId: number): number => {
      let total = directCounts[catId] || 0;
      const children = categories.filter((c: any) => c.parent === catId);
      children.forEach((child: any) => {
        total += getTotalCount(child.id);
      });
      return total;
    };

    const processedCategories = categories.map((c: any) => ({
      id: c.id,
      name: (c.name || "").replace(/&amp;/g, "&"),
      slug: c.slug,
      parent: c.parent,
      description: c.description || CATEGORY_DESCRIPTIONS[c.id] || "",
      count: directCounts[c.id] || 0,
      totalCount: getTotalCount(c.id),
    }));

    return NextResponse.json(processedCategories);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
