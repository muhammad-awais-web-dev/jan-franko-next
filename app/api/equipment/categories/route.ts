import { NextResponse } from "next/server";

export async function GET() {
  try {
    const catRes = await fetch("https://janfranko.com/wp-json/wp/v2/product_cat?per_page=100", {
      next: { revalidate: 86400 }
    });
    if (!catRes.ok) {
      return NextResponse.json({ error: "Failed to fetch product categories" }, { status: catRes.status });
    }
    const categories = await catRes.json();
    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
