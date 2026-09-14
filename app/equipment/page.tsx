import React, { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import EquipmentClient, { Product, CategoryTerm } from "./EquipmentClient";
import { FALLBACK_EQUIPMENT_PRODUCTS } from "@/data/equipment";

export const revalidate = 600;

export const metadata: Metadata = constructMetadata({
  title: "The Armory | Traditional Archery Equipment - Jan Franko",
  description: "Explore curated traditional archery bows, quivers, arrows, and bespoke gear vetted through rigorous field testing and traditional craft.",
  canonicalUrl: "https://janfranko.com/equipment",
});

function getCategoryIdsForSlug(categorySlug: string): number[] {
  switch (categorySlug) {
    case "quivers-accessories":
    case "accessories":
    case "quivers":
      return [108, 106, 120, 121, 169, 170, 171, 172, 173];
    case "training-kits":
      return [109, 181, 182, 183];
    case "targets":
      return [107, 174, 175, 176, 177, 178, 179, 180];
    case "arrows-shafts":
    case "arrows":
      return [105, 118, 119, 167, 168];
    case "bows":
      return [104, 110, 111, 112, 138, 139, 140, 162, 163, 164, 165, 166, 185];
    default:
      return [];
  }
}

async function getEquipmentData(): Promise<{ initialProducts: Product[]; initialCategories: CategoryTerm[] }> {
  try {
    const [prodRes, catRes, mediaRes1, mediaRes2] = await Promise.all([
      fetch("https://janfranko.com/wp-json/wp/v2/product?per_page=100&_embed", { next: { revalidate: 600 } }),
      fetch("https://janfranko.com/wp-json/wp/v2/product_cat?per_page=100", { next: { revalidate: 86400 } }),
      fetch("https://janfranko.com/wp-json/wp/v2/media?per_page=100&page=1", { next: { revalidate: 600 } }).catch(() => null),
      fetch("https://janfranko.com/wp-json/wp/v2/media?per_page=100&page=2", { next: { revalidate: 600 } }).catch(() => null),
    ]);

    if (!prodRes.ok || !catRes.ok) {
      const fallbackProds: Product[] = FALLBACK_EQUIPMENT_PRODUCTS.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        date: p.date,
        image: p.image || "https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=1200&q=80",
        categories: getCategoryIdsForSlug(p.category),
        brands: [],
      }));
      return { initialProducts: fallbackProds, initialCategories: [] };
    }

    const rawProducts = await prodRes.json();
    const rawCategories = await catRes.json();

    let mediaItems: any[] = [];
    if (mediaRes1 && mediaRes1.ok) {
      const items1 = await mediaRes1.json();
      if (Array.isArray(items1)) mediaItems.push(...items1);
    }
    if (mediaRes2 && mediaRes2.ok) {
      const items2 = await mediaRes2.json();
      if (Array.isArray(items2)) mediaItems.push(...items2);
    }

    let mediaMap: Record<number, string> = {};
    mediaItems.forEach((item: any) => {
      if (item.id && item.source_url) {
        mediaMap[item.id] = item.source_url;
      }
    });

    const mappedProducts: Product[] = Array.isArray(rawProducts)
      ? rawProducts.map((p: any) => {
          const embeddedImage = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
          const yoastImage = p.yoast_head_json?.og_image?.[0]?.url;
          const featuredImage =
            embeddedImage ||
            yoastImage ||
            mediaMap[p.featured_media] ||
            "https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=1200&q=80";

          return {
            id: p.id,
            slug: p.slug,
            title: p.title?.rendered || "",
            excerpt: p.excerpt?.rendered || "",
            content: p.content?.rendered || "",
            date: p.date || "",
            image: featuredImage,
            categories: p.product_cat || [],
            brands: p.product_brand || [],
          };
        })
      : [];

    const allCategories: CategoryTerm[] = Array.isArray(rawCategories)
      ? rawCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          parent: c.parent,
          description: c.description,
        }))
      : [];

    if (!allCategories.some((c) => c.id === 108)) {
      allCategories.push({
        id: 108,
        name: "Quivers & Accessories",
        slug: "accessories",
        parent: 0,
        description: "Authentic gear and essential accoutrements, meticulously crafted to complement your traditional bow and elevate your historical archery experience.",
      });
    }

    return {
      initialProducts: mappedProducts.length > 0 ? mappedProducts : FALLBACK_EQUIPMENT_PRODUCTS.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        date: p.date,
        image: p.image || "https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=1200&q=80",
        categories: getCategoryIdsForSlug(p.category),
        brands: [],
      })),
      initialCategories: allCategories,
    };
  } catch {
    const fallbackProds: Product[] = FALLBACK_EQUIPMENT_PRODUCTS.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      date: p.date,
      image: p.image || "https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=1200&q=80",
      categories: getCategoryIdsForSlug(p.category),
      brands: [],
    }));
    return { initialProducts: fallbackProds, initialCategories: [] };
  }
}

export default async function EquipmentPage() {
  const { initialProducts, initialCategories } = await getEquipmentData();

  return (
    <Suspense fallback={null}>
      <EquipmentClient initialProducts={initialProducts} initialCategories={initialCategories} />
    </Suspense>
  );
}
