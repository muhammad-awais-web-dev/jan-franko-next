import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import EquipmentClient from "@/app/equipment/EquipmentClient";

export const revalidate = 600;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return [
    { slug: ["bows"] },
    { slug: ["bows", "asiatic-bows"] },
    { slug: ["bows", "european-archery"] },
    { slug: ["bows", "explorer-core-line"] },
    { slug: ["bows", "explorer-limited-editions"] },
    { slug: ["bows", "himalayan-archery"] },
    { slug: ["bows", "indigenous-archery-traditions"] },
    { slug: ["quivers-accessories"] },
    { slug: ["quivers-accessories", "field-quivers"] },
    { slug: ["quivers-accessories", "horse-archery-quivers"] },
    { slug: ["targets"] },
    { slug: ["training-kits"] },
  ];
}

async function fetchEquipmentData() {
  try {
    const [prodRes, catRes] = await Promise.all([
      fetch("https://janfranko.com/wp-json/wp/v2/product?per_page=100", { next: { revalidate: 600 } }),
      fetch("https://janfranko.com/wp-json/wp/v2/product_cat?per_page=100", { next: { revalidate: 86400 } })
    ]);

    const prods = prodRes.ok ? await prodRes.json() : [];
    const cats = catRes.ok ? await catRes.json() : [];

    const products = prods.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title?.rendered || "",
      excerpt: p.excerpt?.rendered || "",
      content: p.content?.rendered || "",
      date: p.date || "",
      image: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/images/og-bg-workshop.jpg",
      categories: p.product_cat || [],
      brands: p.brand || [],
    }));

    const categories = cats.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parent: c.parent,
      description: c.description || "",
    }));

    return { products, categories };
  } catch (err) {
    console.error("Error loading equipment data for category page:", err);
    return { products: [], categories: [] };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const targetSlug = slug && slug.length > 0 ? slug[slug.length - 1] : "";
  const formattedTitle = targetSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return constructMetadata({
    title: `${formattedTitle} | Equipment Armory Catalog - Jan Franko`,
    description: `Explore historical and functional ${formattedTitle} equipment listings verified by Jan Franko Traditional Archery Academy.`,
    canonicalUrl: `https://janfranko.com/equipment/category/${slug.join("/")}`,
  });
}

export default async function EquipmentCategoryHierarchyPage({ params }: PageProps) {
  const { slug } = await params;
  const { products, categories } = await fetchEquipmentData();

  const targetSlug = slug && slug.length > 0 ? slug[slug.length - 1] : "";

  return (
    <EquipmentClient
      initialProducts={products}
      initialCategories={categories}
      initialCategorySlug={targetSlug}
      categoryPathSegments={slug}
    />
  );
}
