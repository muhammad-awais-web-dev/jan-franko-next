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
    { slug: ["accessories"] },
    { slug: ["accessories", "quivers"] },
    { slug: ["accessories", "quivers", "field-quivers"] },
    { slug: ["accessories", "quivers", "horse-archery-quivers"] },
    { slug: ["accessories", "field-quivers"] },
    { slug: ["accessories", "horse-archery-quivers"] },
    { slug: ["accessories", "archery-belts"] },
    { slug: ["accessories", "arm-guards"] },
    { slug: ["accessories", "bow-cases"] },
    { slug: ["accessories", "finger-tabs"] },
    { slug: ["accessories", "thumb-rings"] },
    { slug: ["quivers-accessories"] },
    { slug: ["quivers-accessories", "field-quivers"] },
    { slug: ["quivers-accessories", "horse-archery-quivers"] },
    { slug: ["quivers-accessories", "arm-guards"] },
    { slug: ["quivers-accessories", "thumb-rings"] },
    { slug: ["arrows"] },
    { slug: ["arrows", "bamboo-arrows"] },
    { slug: ["arrows", "carbon-arrows"] },
    { slug: ["arrows", "spruce-arrows"] },
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

function filterProductsByCategorySlug(allProds: any[], target: string, allCats: any[]) {
  if (!target || target === "all") return allProds;
  const s = target.toLowerCase();

  if (s === "empty-category") return [];

  let targetCat = allCats.find((c: any) => c.slug?.toLowerCase() === s);
  if (!targetCat) {
    if (s === "quivers") {
      targetCat = allCats.find((c: any) => c.slug?.toLowerCase() === "quivers" || c.id === 106) || { id: 106 };
    } else if (["quivers-accessories", "accessories"].includes(s)) {
      targetCat = allCats.find((c: any) => ["accessories", "quivers-accessories"].includes(c.slug?.toLowerCase()) || c.id === 108) || { id: 108 };
    } else if (["arrows-shafts", "arrows"].includes(s)) {
      targetCat = allCats.find((c: any) => ["arrows", "arrows-shafts"].includes(c.slug?.toLowerCase()) || c.id === 105) || { id: 105 };
    } else if (s === "targets") {
      targetCat = allCats.find((c: any) => c.slug === "targets" || c.id === 107) || { id: 107 };
    } else if (s === "training-kits") {
      targetCat = allCats.find((c: any) => c.slug === "training-kits" || c.id === 109) || { id: 109 };
    } else if (s === "bows") {
      targetCat = allCats.find((c: any) => c.slug === "bows" || c.id === 104) || { id: 104 };
    }
  }

  const catId = targetCat ? targetCat.id : null;

  const descendantIds: number[] = [];
  if (catId) {
    descendantIds.push(catId);
    if (catId === 108) [108, 106, 120, 121, 169, 170, 171, 172, 173].forEach((id) => descendantIds.push(id));
    if (catId === 106) [106, 120, 121].forEach((id) => descendantIds.push(id));
    if (catId === 107) [107, 178, 179, 177, 176, 174, 175, 180].forEach((id) => descendantIds.push(id));
    if (catId === 105) [105, 118, 168, 167, 119].forEach((id) => descendantIds.push(id));
    if (catId === 109) [109, 183, 181, 182].forEach((id) => descendantIds.push(id));
    if (catId === 104) [104, 112, 185, 138, 110, 111, 139, 140, 164, 166, 163, 162, 165].forEach((id) => descendantIds.push(id));

    const findChildren = (pid: number) => {
      allCats.forEach((c: any) => {
        if (c.parent === pid && !descendantIds.includes(c.id)) {
          descendantIds.push(c.id);
          findChildren(c.id);
        }
      });
    };
    findChildren(catId);
  }

  const isTopLevelParent = ["bows", "accessories", "quivers", "quivers-accessories", "targets", "arrows", "arrows-shafts", "training-kits"].includes(s);

  return allProds.filter((p: any) => {
    if (descendantIds.length > 0 && p.categories?.some((id: number) => descendantIds.includes(id))) {
      return true;
    }

    if (isTopLevelParent) {
      const slugTitle = `${p.slug} ${p.title}`.toLowerCase();
      if (s === "targets" || s.includes("target")) return slugTitle.includes("target") || slugTitle.includes("sur");
      if (s === "quivers") return slugTitle.includes("quiver");
      if (s === "quivers-accessories" || s === "accessories") return ["quiver", "ring", "glove", "armguard", "thumb", "case", "belt"].some((kw) => slugTitle.includes(kw));
      if (s === "arrows-shafts" || s === "arrows") return slugTitle.includes("arrow") || slugTitle.includes("shaft");
      if (s === "training-kits") return slugTitle.includes("kit") || slugTitle.includes("practice");
      if (s === "bows") return slugTitle.includes("bow");
    }

    return false;
  });
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
  const categoryProducts = filterProductsByCategorySlug(products, targetSlug, categories);

  return (
    <EquipmentClient
      initialProducts={categoryProducts}
      initialCategories={categories}
      initialCategorySlug={targetSlug}
      categoryPathSegments={slug}
    />
  );
}
