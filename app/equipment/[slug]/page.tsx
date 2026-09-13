import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import EquipmentCategoryClient from "./EquipmentCategoryClient";

export const revalidate = 3600;

const EQUIPMENT_CATEGORY_SLUGS = [
  "bows",
  "master-bowyers",
  "targets",
  "arrows-shafts",
  "quivers-accessories",
  "training-kits",
  "arrow-configurator"
];

export async function generateStaticParams() {
  return EQUIPMENT_CATEGORY_SLUGS.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return constructMetadata({
    title: `${formattedTitle} | Equipment Armory Catalog`,
    description: `Explore historical and functional ${formattedTitle} equipment listings verified by Jan Franko Traditional Archery Academy.`,
    canonicalUrl: `https://janfranko.com/equipment/${slug}`,
  });
}

export default async function EquipmentCategoryPage() {
  return <EquipmentCategoryClient />;
}
