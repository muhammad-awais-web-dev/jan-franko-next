import React, { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import ProgramsClient, { Program, Term } from "./ProgramsClient";

export const revalidate = 600;

export const metadata: Metadata = constructMetadata({
  title: "Training Programs & Expeditions | Traditional Archery - Jan Franko",
  description: "Discover structured training, cultural study, and seasonal wilderness expeditions designed for traditional archers of all skill levels.",
  canonicalUrl: "https://janfranko.com/programs",
});

async function getProgramsData(): Promise<{
  initialPrograms: Program[];
  initialMedia: Record<number, string>;
  initialTypes: Term[];
  initialStatuses: Term[];
  initialSkills: Term[];
  initialRegions: Term[];
}> {
  try {
    const [progRes, typeRes, statusRes, skillRes, regionRes] = await Promise.all([
      fetch("https://janfranko.com/wp-json/wp/v2/program?per_page=100", { next: { revalidate: 600 } }),
      fetch("https://janfranko.com/wp-json/wp/v2/program_type?per_page=100", { next: { revalidate: 86400 } }).catch(() => null),
      fetch("https://janfranko.com/wp-json/wp/v2/program_status?per_page=100", { next: { revalidate: 86400 } }).catch(() => null),
      fetch("https://janfranko.com/wp-json/wp/v2/skill_level?per_page=100", { next: { revalidate: 86400 } }).catch(() => null),
      fetch("https://janfranko.com/wp-json/wp/v2/region?per_page=100", { next: { revalidate: 86400 } }).catch(() => null),
    ]);

    let initialPrograms: Program[] = [];
    if (progRes && progRes.ok) {
      const rawProgData: Program[] = await progRes.json();
      initialPrograms = rawProgData.map((prog) => ({
        ...prog,
        acf: {
          ...prog.acf,
          event_status_label: "Date to be confirmed",
          event_date: ""
        }
      }));
    }

    const initialTypes = typeRes && typeRes.ok ? await typeRes.json() : [];
    const initialStatuses = statusRes && statusRes.ok ? await statusRes.json() : [];
    const initialSkills = skillRes && skillRes.ok ? await skillRes.json() : [];
    const initialRegions = regionRes && regionRes.ok ? await regionRes.json() : [];

    const mediaIdsToFetch = new Set<number>();
    initialPrograms.forEach((prog) => {
      if (prog.acf?.background_image) {
        mediaIdsToFetch.add(prog.acf.background_image);
      }
      if (prog.acf?.supplementary_images && Array.isArray(prog.acf.supplementary_images)) {
        prog.acf.supplementary_images.forEach((id) => mediaIdsToFetch.add(id));
      }
    });

    const mediaMap: Record<number, string> = {};
    if (mediaIdsToFetch.size > 0) {
      const idsString = Array.from(mediaIdsToFetch).join(",");
      const mediaRes = await fetch(
        `https://janfranko.com/wp-json/wp/v2/media?include=${idsString}&per_page=100`,
        { next: { revalidate: 600 } }
      ).catch(() => null);

      if (mediaRes && mediaRes.ok) {
        const mediaData = await mediaRes.json();
        if (Array.isArray(mediaData)) {
          mediaData.forEach((item: any) => {
            if (item.id && item.source_url) {
              mediaMap[item.id] = item.source_url;
            }
          });
        }
      }
    }

    return {
      initialPrograms,
      initialMedia: mediaMap,
      initialTypes,
      initialStatuses,
      initialSkills,
      initialRegions,
    };
  } catch (err) {
    console.error("Error pre-fetching programs:", err);
    return {
      initialPrograms: [],
      initialMedia: {},
      initialTypes: [],
      initialStatuses: [],
      initialSkills: [],
      initialRegions: [],
    };
  }
}

export default async function ProgramsPage() {
  const data = await getProgramsData();

  return (
    <Suspense fallback={null}>
      <ProgramsClient {...data} />
    </Suspense>
  );
}
