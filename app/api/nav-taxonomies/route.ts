import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cacheOpts = { next: { revalidate: 86400 } }; // 24 hours cache revalidation

    const [typesRes, skillsRes, regionsRes] = await Promise.all([
      fetch("https://janfranko.com/wp-json/wp/v2/program_type?per_page=100", cacheOpts),
      fetch("https://janfranko.com/wp-json/wp/v2/skill_level?per_page=100", cacheOpts),
      fetch("https://janfranko.com/wp-json/wp/v2/region?per_page=100", cacheOpts)
    ]);

    const [types, skills, regions] = await Promise.all([
      typesRes.ok ? typesRes.json() : Promise.resolve([]),
      skillsRes.ok ? skillsRes.json() : Promise.resolve([]),
      regionsRes.ok ? regionsRes.json() : Promise.resolve([])
    ]);

    return NextResponse.json({ types, skills, regions });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
