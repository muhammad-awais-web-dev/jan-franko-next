import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import BowyerClient from "./BowyerClient";

export const revalidate = 3600;

const BOWYER_SLUGS = [
  "harvey-archery",
  "warrick-harvey",
  "mr-bows",
  "misko-rovcanin",
  "kadys-bows",
  "sergey-tolochko"
];

export async function generateStaticParams() {
  return BOWYER_SLUGS.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let title = "Master Bowyer Profile | Jan Franko Traditional Archery";
  let description = "Explore the bio, crafting philosophy, and vetted traditional bows handcrafted by our Master Bowyer partners.";

  if (slug === "harvey-archery" || slug === "warrick-harvey") {
    title = "Harvey Archery (Warrick Harvey) | Master Bowyer Profile";
    description = "Custom longbows and fine burl wood craftsmanship by Master Bowyer Warrick Harvey.";
  } else if (slug === "mr-bows" || slug === "misko-rovcanin") {
    title = "MR Bows (Miško Rovčanin) | Master Bowyer Profile";
    description = "Historical traditional composite bows and custom bow craft by Master Bowyer Miško Rovčanin.";
  } else if (slug === "kadys-bows" || slug === "sergey-tolochko") {
    title = "Kadys Bows (Sergey Tolochko) | Master Bowyer Profile";
    description = "Handmade traditional hunting and competition longbows by Master Bowyer Sergey Tolochko.";
  }

  return constructMetadata({
    title,
    description,
    canonicalUrl: `https://janfranko.com/bowyer/${slug}`,
  });
}

export default async function BowyerProfilePage() {
  return <BowyerClient />;
}
