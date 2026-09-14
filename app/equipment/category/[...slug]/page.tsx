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
    { slug: ["bows", "custom-bows"] },
    { slug: ["quivers-accessories"] },
    { slug: ["quivers-accessories", "field-quivers"] },
    { slug: ["quivers-accessories", "horse-archery-quivers"] },
    { slug: ["quivers-accessories", "arm-guards"] },
    { slug: ["targets"] },
    { slug: ["targets", "3d-targets"] },
    { slug: ["training-kits"] },
    { slug: ["training-kits", "starter-archery-kits"] },
    { slug: ["empty-category"] },
    { slug: ["no-category-found"] },
  ];
}

async function fetchEquipmentData() {
  try {
    const [prodRes, catRes] = await Promise.all([
      fetch("https://janfranko.com/wp-json/wp/v2/product?per_page=100&_embed", { next: { revalidate: 600 } }),
      fetch("https://janfranko.com/wp-json/wp/v2/product_cat?per_page=100", { next: { revalidate: 86400 } })
    ]);

    const prods = prodRes.ok ? await prodRes.json() : [];
    const cats = catRes.ok ? await catRes.json() : [];

    const featuredMediaIds = Array.from(
      new Set(prods.map((p: any) => p.featured_media).filter(Boolean))
    );

    let mediaMap: Record<number, string> = {};
    if (featuredMediaIds.length > 0) {
      const mediaRes = await fetch(`https://janfranko.com/wp-json/wp/v2/media?include=${featuredMediaIds.join(",")}&per_page=100`, { next: { revalidate: 600 } }).catch(() => null);
      if (mediaRes && mediaRes.ok) {
        const mediaItems = await mediaRes.json();
        if (Array.isArray(mediaItems)) {
          mediaItems.forEach((m: any) => {
            if (m.id && m.source_url) mediaMap[m.id] = m.source_url;
          });
        }
      }
    }

    const products = prods.map((p: any) => {
      const yoastImage = p.yoast_head_json?.og_image?.[0]?.url;
      const embeddedImage = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
      const mediaMapImage = mediaMap[p.featured_media];

      const contentHtml = p.content?.rendered || "";
      const regex = /<img[^>]+src=["']([^"']+)["']/gi;
      let match;
      const contentImgs: string[] = [];
      while ((match = regex.exec(contentHtml)) !== null) {
        if (match[1]) contentImgs.push(match[1]);
      }

      const featuredImage = embeddedImage || yoastImage || mediaMapImage || contentImgs[0] || "/images/og-bg-workshop.jpg";

      return {
        id: p.id,
        slug: p.slug,
        title: p.title?.rendered || "",
        excerpt: p.excerpt?.rendered || "",
        content: p.content?.rendered || "",
        date: p.date || "",
        image: featuredImage,
        categories: p.product_cat || [],
        brands: p.brand || [],
      };
    });

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
