import { NextResponse } from "next/server";
import { DEFAULT_PROGRAM_TYPES, DEFAULT_SKILL_LEVELS, DEFAULT_REGIONS } from "@/data/site";

export async function GET() {
  try {
    const cacheOpts = { next: { revalidate: 86400 } }; // 24 hours cache revalidation

    const [typesRes, skillsRes, regionsRes] = await Promise.all([
      fetch("https://janfranko.com/wp-json/wp/v2/program_type?per_page=100", cacheOpts),
      fetch("https://janfranko.com/wp-json/wp/v2/skill_level?per_page=100", cacheOpts),
      fetch("https://janfranko.com/wp-json/wp/v2/region?per_page=100", cacheOpts)
    ]);

    const [typesData, skillsData, regionsData] = await Promise.all([
      typesRes.ok ? typesRes.json() : Promise.resolve([]),
      skillsRes.ok ? skillsRes.json() : Promise.resolve([]),
      regionsRes.ok ? regionsRes.json() : Promise.resolve([])
    ]);

    const types = Array.isArray(typesData) && typesData.length > 0 ? typesData : DEFAULT_PROGRAM_TYPES;
    const skills = Array.isArray(skillsData) && skillsData.length > 0 ? skillsData : DEFAULT_SKILL_LEVELS;
    const regions = Array.isArray(regionsData) && regionsData.length > 0 ? regionsData : DEFAULT_REGIONS;

    return NextResponse.json({ types, skills, regions });
  } catch (err: any) {
    return NextResponse.json({ 
      types: DEFAULT_PROGRAM_TYPES,
      skills: DEFAULT_SKILL_LEVELS,
      regions: DEFAULT_REGIONS
    });
  }
}

