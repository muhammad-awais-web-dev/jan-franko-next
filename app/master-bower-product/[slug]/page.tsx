import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import MasterBowyerProductClient from "./MasterBowyerProductClient";

export const revalidate = 3600;

const MASTER_BOWYER_PRODUCT_SLUGS = [
  "raptor",
  "crowned-eagle",
  "lammervanger",
  "tiron",
  "spartak",
  "krstas",
  "obilic",
  "varjag",
  "aga",
  "despot",
  "long-bow-bb-1536",
  "long-bow-b-b-1727",
  "long-bow-b-b-1613",
  "long-bow-bb-1509",
  "long-bow-bb-1500",
  "longbow-aspid-2",
  "longbow-aspid-1",
  "long-bow-pioneer-1718",
  "long-bow-pioneer-1621",
  "long-bow-pioneer-1511",
  "longbow-pioneer",
  "long-bow-nail-amaranth",
  "longbow-nail-2",
  "longbow-nail-1",
  "longbows-b-b-1638",
  "long-bow-b-b-1728",
  "longbow-aspid-4",
  "longbow-aspid-3",
  "longbow-mlb-forest",
  "aspid-puzzle-longbow",
  "longbow-richard",
  "longbow-mlb-2",
  "longbow-mlb-1",
  "longbow-black-mamba-2",
  "longbow-black-mamba-1",
  "longbow-aspid-7",
  "longbow-aspid-6",
  "longbow-aspid-5",
  "recursive-bow-orhan-turkish-1",
  "recursive-bow-orhan-turkish-5",
  "recursive-bow-orhan-turkish-4",
  "recursive-bow-orhan-turkish-3",
  "recursive-bow-orhan-turkish-2",
  "recurve-bow-orhan-turkish-snake",
  "hunting-bow-leon",
  "recursive-bow-khan-malta-crimean-tatar",
  "recursive-bow-hoder-hungarian-2",
  "hunting-bow-lynx-2",
  "hunting-bow-lynx-1",
  "recurve-bow-mongol-mongolian",
  "recursive-bow-manchu-manchurian-1",
  "recursive-bow-khan-crimean-tatar-2",
  "recurve-bow-hoder-hungarian",
  "recurve-bow-hoder-basic-hungarian",
  "recursive-bow-hoder-hungarian-3"
];

export async function generateStaticParams() {
  return MASTER_BOWYER_PRODUCT_SLUGS.map((slug) => ({ slug }));
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
    title: `${formattedTitle} | Custom Master Bowyer Model`,
    description: `Inspect technical specifications, wood lamination choices, and bespoke commission options for the ${formattedTitle} bow by our vetted Master Bowyers.`,
    canonicalUrl: `https://janfranko.com/master-bower-product/${slug}`,
  });
}

import { fetchServerMasterBowyerProducts } from "@/lib/serverBowyerData";

export default async function MasterBowyerProductPage({ params }: PageProps) {
  const { slug } = await params;
  const products = await fetchServerMasterBowyerProducts({ slug });
  const initialProduct = products.length > 0 ? (products[0] as any) : null;

  return <MasterBowyerProductClient initialProduct={initialProduct} />;
}

