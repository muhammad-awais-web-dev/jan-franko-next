import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import KadysBowsClient from "./KadysBowsClient";
import { fetchServerMasterBowyerProducts } from "@/lib/serverBowyerData";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Kadys Bows (Sergey Tolochko) | Master Bowyer Profile & Catalog",
    description: "Explore traditional hunting recurves, longbows, and Asiatic horse bows handcrafted by Master Bowyer Sergey Tolochko.",
    canonicalUrl: "https://janfranko.com/bowyer/kadys-bows",
  });
}

export default async function KadysBowsPage() {
  const products = await fetchServerMasterBowyerProducts({ bowyerId: 238 });

  return <KadysBowsClient initialProducts={products} />;
}

