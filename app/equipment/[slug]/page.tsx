import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import {
  fetchServerEquipmentProducts,
  fetchServerEquipmentCategories,
  getStaticFallbackEquipmentProduct
} from "@/lib/serverEquipmentData";
import EquipmentCategoryClient from "./EquipmentCategoryClient";

export const revalidate = 600; // 10 minutes cache revalidation

const EQUIPMENT_STATIC_SLUGS = [
  "bows",
  "master-bowyers",
  "targets",
  "arrows-shafts",
  "quivers-accessories",
  "training-kits",
  "arrow-configurator",
  "aurelion",
  "silverion",
  "samsara",
  "slavic-bow",
  "english-yew-warbow",
  "mongolian-sur-target",
  "ottoman-flight-bow",
  "turkish-horsebow",
  "first-step-academy-kit",
  "thumb-rings",
  "shooting-gloves",
  "armguards",
  "arctic-inuit-bow",
  "amazonian-tribal-bow",
  "native-american-bow",
  "viking-bow"
];

export async function generateStaticParams() {
  return EQUIPMENT_STATIC_SLUGS.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = await fetchServerEquipmentProducts({ slug });
  const product = products.length > 0 ? products[0] : getStaticFallbackEquipmentProduct(slug);

  if (product) {
    const rawTitle = product.title
      .replace(/&#8220;/g, "“")
      .replace(/&#8221;/g, "”")
      .replace(/&#8211;/g, "–")
      .replace(/&amp;/g, "&");

    const textExcerpt = (product.excerpt || product.content)
      .replace(/<[^>]*>/g, "")
      .trim();
    const description = textExcerpt.length > 160 ? textExcerpt.slice(0, 157) + "..." : textExcerpt;

    return constructMetadata({
      title: `${rawTitle} | Jan Franko Equipment Catalog`,
      description: description || `Inspect authentic archery equipment specifications for ${rawTitle}.`,
      canonicalUrl: `https://janfranko.com/equipment/${slug}`,
      ogImage: product.image,
    });
  }

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

export default async function EquipmentCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([
    fetchServerEquipmentProducts({ slug }),
    fetchServerEquipmentCategories()
  ]);

  const initialProduct = products.length > 0 ? products[0] : getStaticFallbackEquipmentProduct(slug);

  return (
    <EquipmentCategoryClient
      initialProduct={initialProduct}
      initialCategories={categories}
    />
  );
}
