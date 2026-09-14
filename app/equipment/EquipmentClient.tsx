"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Search, X, SlidersHorizontal, LayoutGrid, List, Check, FolderX, PackageOpen, Compass, ArrowRight, ShieldAlert, Layers } from "lucide-react";
import ProductComparisonModal, {
  FloatingCompareBar,
  ComparisonProduct,
} from "@/components/equipment/ProductComparisonModal";

export interface Product {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  categories: number[];
  brands: number[];
}

export interface CategoryTerm {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description?: string;
}

interface EquipmentClientProps {
  initialProducts: Product[];
  initialCategories: CategoryTerm[];
  initialCategorySlug?: string;
  categoryPathSegments?: string[];
}

const VIRTUAL_EMPTY_CATEGORY: CategoryTerm = {
  id: 9999,
  name: "Empty Category",
  slug: "empty-category",
  parent: 0,
  description: "Department reserved for custom archer commissions and items undergoing source verification."
};

function EquipmentContentInner({ initialProducts, initialCategories, initialCategorySlug }: EquipmentClientProps) {
  const searchParams = useSearchParams();

  // Shop States - pre-populated from Server Component
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryTerm[]>(initialCategories);
  const [loading, setLoading] = useState(initialProducts.length === 0 && initialCategories.length === 0);

  // Merge categories with virtual terms for testing and complete coverage
  const allCategories = React.useMemo(() => {
    const list = [...categories];
    if (!list.some((c) => c.slug === "empty-category")) {
      list.push(VIRTUAL_EMPTY_CATEGORY);
    }
    return list;
  }, [categories]);

  // Validate if URL requested category exists in taxonomy
  const isCategoryNotFound = React.useMemo(() => {
    if (!initialCategorySlug) return false;
    if (initialCategorySlug === "no-category-found") return true;

    const exists =
      allCategories.some((c) => c.slug === initialCategorySlug) ||
      ["quivers-accessories", "quivers", "accessories", "arrows-shafts", "arrows", "targets", "training-kits", "bows", "master-bowyers"].includes(initialCategorySlug);

    return !exists;
  }, [initialCategorySlug, allCategories]);

  // Initial Category Pre-selection from URL slug route or query param
  const resolveCategoryTerm = React.useCallback(
    (slugToResolve: string | undefined): string => {
      if (!slugToResolve) return "";
      const s = slugToResolve.toLowerCase().trim();

      // Direct slug match in taxonomy
      let term = allCategories.find((c) => c.slug.toLowerCase() === s);
      if (term) return term.id.toString();

      // Direct name match in taxonomy
      term = allCategories.find((c) => c.name.toLowerCase() === s);
      if (term) return term.id.toString();

      if (s === "empty-category") return "9999";

      return "";
    },
    [allCategories]
  );

  const getInitialSelectedCategory = () => {
    return resolveCategoryTerm(initialCategorySlug);
  };

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(getInitialSelectedCategory);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // View Mode & Comparison States
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [compareItems, setCompareItems] = useState<ComparisonProduct[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Background fetch to ensure client cache fresh synchronization
  useEffect(() => {
    const loadShopData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/equipment/products"),
          fetch("/api/equipment/categories")
        ]);
        if (prodRes.ok && catRes.ok) {
          const prods = await prodRes.json();
          const cats = await catRes.json();
          if (Array.isArray(prods) && prods.length > 0) setProducts(prods);
          if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to sync shop data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (initialCategories.length === 0) {
      void loadShopData();
    } else {
      setLoading(false);
    }
  }, [initialProducts, initialCategories]);

  // Sync route parameters and search parameters on mount or category update
  useEffect(() => {
    if (allCategories.length === 0) return;

    const catParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    const queryParam = searchParams.get("query");

    const targetSlug = initialCategorySlug || catParam || brandParam;
    if (targetSlug) {
      const resolvedId = resolveCategoryTerm(targetSlug);
      if (resolvedId) {
        setSelectedCategory(resolvedId);
      }
    }

    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [initialCategorySlug, searchParams, allCategories, resolveCategoryTerm]);

  // GSAP Stagger Entrance Animation for Product Cards
  useEffect(() => {
    if (loading || document.querySelectorAll(".product-card").length === 0) return;

    gsap.fromTo(
      ".product-card",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power2.out",
        overwrite: "auto"
      }
    );
  }, [loading, searchQuery, selectedCategory, sortBy, viewMode]);

  // Comparison toggle handler
  const toggleCompareProduct = (
    product: Product,
    categoriesLabel?: string,
    brandLabel?: string
  ) => {
    setCompareItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 products at a time.");
        return prev;
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          title: product.title,
          excerpt: product.excerpt,
          content: product.content,
          image: product.image,
          categoriesLabel,
          brandLabel: brandLabel || undefined,
        },
      ];
    });
  };

  const removeCompareProduct = (productId: number) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCompareProducts = () => {
    setCompareItems([]);
  };

  // Helper to recursively get all subcategory IDs for deep matching dynamically
  const getCategoryDescendants = (catId: number): number[] => {
    const ids = [catId];
    const findChildren = (parent: number) => {
      categories.forEach((c) => {
        if (c.parent === parent && !ids.includes(c.id)) {
          ids.push(c.id);
          findChildren(c.id);
        }
      });
    };
    findChildren(catId);
    return ids;
  };

  // Build a recursive category tree list for hierarchy select options
  const getCategoryTree = (): { id: number; name: string; level: number }[] => {
    const list: { id: number; name: string; level: number }[] = [];
    const visitedIds = new Set<number>();
    
    const buildTree = (parentId: number, level: number) => {
      const children = categories.filter((c) => c.parent === parentId && !visitedIds.has(c.id));
      children.sort((a, b) => a.name.localeCompare(b.name));
      
      children.forEach((child) => {
        visitedIds.add(child.id);
        list.push({ id: child.id, name: child.name, level });
        buildTree(child.id, level + 1);
      });
    };

    const roots = categories.filter((c) => c.parent === 0 && c.id !== 28 && !visitedIds.has(c.id));
    roots.sort((a, b) => a.name.localeCompare(b.name));
    
    roots.forEach((root) => {
      visitedIds.add(root.id);
      list.push({ id: root.id, name: root.name, level: 0 });
      buildTree(root.id, 1);
    });

    return list;
  };

  // Breadcrumb Trail Computation
  const getBreadcrumbItems = (): { name: string; slug: string; path: string }[] => {
    if (!selectedCategory || categories.length === 0) return [];

    const catId = parseInt(selectedCategory);
    const targetCat = categories.find((c) => c.id === catId);
    if (!targetCat) return [];

    const items: { name: string; slug: string; path: string }[] = [];
    
    let current: CategoryTerm | undefined = targetCat;
    const hierarchy: CategoryTerm[] = [];
    while (current) {
      hierarchy.unshift(current);
      if (current.parent === 0) break;
      current = categories.find((c) => c.id === current?.parent);
    }

    let cumulativePath = "";
    hierarchy.forEach((cat) => {
      const slugSegment = cat.slug === "accessories" ? "quivers-accessories" : cat.slug;
      cumulativePath = cumulativePath ? `${cumulativePath}/${slugSegment}` : slugSegment;
      items.push({
        name: cat.name === "accessories" ? "Quivers & Accessories" : cat.name,
        slug: cat.slug,
        path: cumulativePath,
      });
    });

    return items;
  };

  const breadcrumbs = getBreadcrumbItems();

  // Filter Logic
  const getFilteredProducts = () => {
    return products.filter((product) => {
      // 1. Category Filter (deep match target category + dynamic descendants)
      if (selectedCategory) {
        const catId = parseInt(selectedCategory);
        const allowedIds = getCategoryDescendants(catId);

        const matchesCategory = product.categories.some((id) => allowedIds.includes(id));

        if (!matchesCategory) return false;
      }

      // 2. Text Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesExcerpt = product.excerpt.toLowerCase().includes(query);
        const matchesContent = product.content.toLowerCase().includes(query);
        return matchesTitle || matchesExcerpt || matchesContent;
      }

      return true;
    });
  };

  // Sort Logic
  const getSortedProducts = (items: Product[]) => {
    return [...items].sort((a, b) => {
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      // default: newest
      return Date.parse(b.date) - Date.parse(a.date);
    });
  };

  const filteredProducts = getFilteredProducts();
  const sortedProducts = getSortedProducts(filteredProducts);
  const isFiltersActive = searchQuery !== "" || selectedCategory !== "";

  // Helper to clean HTML entities in title
  const cleanTitle = (raw: string | undefined) => {
    if (!raw) return "";
    return raw
      .replace(/&#8220;/g, "“")
      .replace(/&#8221;/g, "”")
      .replace(/&#8211;/g, "–")
      .replace(/&amp;/g, "&");
  };

  // Helper to strip HTML tags and decode entities for category description
  const cleanDescription = (raw: string | undefined) => {
    if (!raw) return "";
    return raw
      .replace(/<[^>]*>/g, "")
      .replace(/&#8220;/g, "“")
      .replace(/&#8221;/g, "”")
      .replace(/&#8211;/g, "–")
      .replace(/&amp;/g, "&")
      .trim();
  };

  // Helper to strip HTML tags for card excerpt
  const cleanExcerpt = (rawHtml: string) => {
    const textOnly = rawHtml.replace(/<[^>]*>/g, "");
    return textOnly.length > 120 ? textOnly.slice(0, 120) + "..." : textOnly;
  };

  const activeCategoryObj = React.useMemo(() => {
    if (!selectedCategory) return null;
    return allCategories.find((c) => c.id.toString() === selectedCategory) || null;
  }, [selectedCategory, allCategories]);

  const activeParentCategoryObj = React.useMemo(() => {
    if (!activeCategoryObj || activeCategoryObj.parent === 0) return null;
    return allCategories.find((c) => c.id === activeCategoryObj.parent) || null;
  }, [activeCategoryObj, allCategories]);

  const heroBadge = activeParentCategoryObj
    ? `Academy Armory • ${cleanTitle(activeParentCategoryObj.name)}`
    : activeCategoryObj
    ? "Academy Armory • Department"
    : "Academy Armory";

  const heroTitle = activeCategoryObj
    ? cleanTitle(activeCategoryObj.name)
    : "Equipment & Bowyer Gear";

  const heroDescription = activeCategoryObj && activeCategoryObj.description
    ? cleanDescription(activeCategoryObj.description)
    : "Discover premium, handcrafted bows, traditional arrows, and leather accessories sourced from master bowyers and regional craftsmen.";

  // Category Not Found (404) Full Page View
  if (isCategoryNotFound) {
    return (
      <div className="w-full min-h-screen bg-secondary text-primary select-text relative flex flex-col justify-between">
        <title>404 Category Not Found | Equipment Armory - Jan Franko</title>

        {/* Top Header Banner */}
        <section className="bg-[#0e3b2e] px-6 py-16 text-white text-center sm:py-20 relative overflow-hidden">
          <div className="mx-auto max-w-[1440px] relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/40 text-[10px] font-sans font-bold text-[#c5a880] uppercase tracking-widest mx-auto">
              <FolderX className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>404 • Category Not Found</span>
            </div>
            <h1 className="font-serif text-4xl font-bold sm:text-5xl tracking-tight">
              Equipment Category Not Found
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-sm leading-relaxed text-white/80 font-sans">
              The category path <code className="bg-white/10 px-2.5 py-1 rounded text-[#c5a880] font-mono text-xs font-bold">{initialCategorySlug}</code> is not part of our armory taxonomy. It may have been moved, renamed, or consolidated.
            </p>
          </div>
        </section>

        {/* Main Content Box */}
        <section className="mx-auto max-w-[1440px] px-6 py-16 flex-1 w-full">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-sans text-[#5c4629] mb-8">
            <Link href="/" className="hover:text-[#0e3b2e] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/equipment" className="hover:text-[#0e3b2e] transition-colors">Equipment Armory</Link>
            <span>/</span>
            <span className="text-[#0e3b2e] font-bold">Category Not Found</span>
          </nav>

          <div className="bg-white border border-primary/10 rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-3xl mx-auto space-y-8">
            <div className="w-16 h-16 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center mx-auto text-[#7d603a]">
              <FolderX className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
                Department Missing from Taxonomy
              </h2>
              <p className="text-sm text-primary/75 leading-relaxed font-sans max-w-lg mx-auto">
                Search the armory below to find your traditional archery bow, quiver, arrow, or target, or select from our verified armory departments.
              </p>
            </div>

            {/* Direct Search Bar */}
            <div className="max-w-lg mx-auto relative">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 absolute left-4 text-primary/40" />
                <input
                  type="text"
                  placeholder="Search armory equipment catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/equipment?query=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="w-full pl-12 pr-28 py-3 bg-[#f0e9d9]/40 border border-primary/15 rounded-2xl text-sm focus:outline-none focus:border-accent text-primary font-sans"
                />
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      window.location.href = `/equipment?query=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="absolute right-2 px-4 py-1.5 bg-[#0e3b2e] text-white rounded-xl text-xs font-serif font-bold hover:bg-[#0e3b2e]/90 cursor-pointer transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                href="/equipment"
                className="px-6 py-3 bg-[#0e3b2e] text-white rounded-full text-xs font-serif font-bold uppercase tracking-wider hover:bg-[#0e3b2e]/90 cursor-pointer transition-all shadow-sm"
              >
                Browse All Armory Equipment
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-secondary border border-primary/20 text-primary rounded-full text-xs font-serif font-bold uppercase tracking-wider hover:border-primary cursor-pointer transition-all"
              >
                Contact Consultation Desk
              </Link>
            </div>

            {/* Quick Departments Grid */}
            <div className="pt-8 border-t border-primary/10 text-left">
              <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-[#5c4629] mb-4 text-center">
                Explore Active Departments
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: "Bows", href: "/equipment/category/bows", icon: "🏹", count: "22 items" },
                  { name: "Arrows & Shafts", href: "/equipment/category/arrows", icon: "🎯", count: "Custom build" },
                  { name: "Quivers & Accessories", href: "/equipment/category/quivers-accessories", icon: "🎒", count: "5 items" },
                  { name: "Targets", href: "/equipment/category/targets", icon: "🎯", count: "1 item" },
                  { name: "Training Kits", href: "/equipment/category/training-kits", icon: "🎓", count: "1 item" },
                  { name: "Master Bowyers", href: "/equipment/category/master-bowyers", icon: "🛡️", count: "6 bowyers" },
                ].map((dept) => (
                  <Link
                    key={dept.href}
                    href={dept.href}
                    className="p-4 bg-[#f0e9d9]/30 border border-primary/10 rounded-2xl hover:border-accent/40 hover:bg-white transition-all group block"
                  >
                    <div className="text-xl mb-1">{dept.icon}</div>
                    <div className="text-xs font-serif font-bold text-primary group-hover:text-accent transition-colors">
                      {dept.name}
                    </div>
                    <div className="text-[10px] text-[#5c4629] font-sans mt-0.5">{dept.count}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative">
      <title>The Armory | Traditional Archery Equipment - Jan Franko</title>
      <meta name="description" content="Explore curated traditional archery bows, quivers, arrows, and bespoke gear vetted through rigorous field testing and traditional craft." />
      <meta property="og:title" content="The Armory | Traditional Archery Equipment - Jan Franko" />
      <meta property="og:description" content="Explore curated traditional archery bows, quivers, arrows, and bespoke gear vetted through rigorous field testing and traditional craft." />
      
      {/* 1. Hero Header Section */}
      <div className="relative w-full bg-[#0e3b2e] text-white py-16 md:py-24 px-6 overflow-hidden flex flex-col items-center justify-center border-b border-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.12),transparent_70%)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(14,59,46,0.5))] z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-full text-[10px] md:text-xs font-serif font-semibold tracking-widest uppercase text-accent">
            {heroBadge}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            {heroTitle}
          </h1>
          <p className="text-sm md:text-base text-white/80 font-normal max-w-2xl mx-auto leading-relaxed">
            {heroDescription}
          </p>
          <div className="pt-2 flex justify-center">
            <div className="w-12 h-[1px] bg-[#c5a880]/30" />
          </div>
        </div>
      </div>

      {/* 2. Main Shop Directory Container */}
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center flex-wrap gap-2 text-xs font-serif text-[#5c4629] pb-3 border-b border-primary/10" aria-label="Category Breadcrumb">
          <Link href="/equipment" className="hover:text-accent font-semibold transition-colors flex items-center gap-1">
            <span>Shop (Equipment)</span>
          </Link>
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={item.path + idx}>
              <span className="text-primary/30 font-sans">/</span>
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-bold text-primary">{cleanTitle(item.name)}</span>
              ) : (
                <Link href={`/equipment/category/${item.path}`} className="hover:text-accent transition-colors">
                  {cleanTitle(item.name)}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Controls Bar */}
        <div className="flex flex-col gap-6 border-b border-primary/10 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Live Search Input */}
            <div className="relative flex items-center w-full md:w-80">
              <span className="absolute left-3.5 pointer-events-none">
                <Search className="w-3.5 h-3.5 text-primary/40" />
              </span>
              <input
                type="text"
                placeholder="Search products by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-primary border border-primary/20 hover:border-primary/45 rounded-full pl-9 pr-8 py-2.5 text-xs outline-none focus:border-accent font-sans transition-all duration-300 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 text-primary/40 hover:text-primary transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: View Mode, Sort & Filter Toggle */}
            <div className="flex items-center justify-end gap-3 flex-wrap">
              {/* Grid / List View Toggle */}
              <div className="flex items-center bg-white border border-primary/20 rounded-full p-1 shadow-xs">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#0e3b2e] text-white shadow-xs"
                      : "text-primary/60 hover:text-primary"
                  }`}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-[#0e3b2e] text-white shadow-xs"
                      : "text-primary/60 hover:text-primary"
                  }`}
                  title="List View"
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold hidden sm:inline">
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-secondary text-primary border border-primary/20 rounded-full px-4 py-2.5 text-xs font-serif uppercase tracking-wider outline-none focus:border-accent cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="title-asc">Title: A-Z</option>
                  <option value="title-desc">Title: Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Row */}
        {isFiltersActive && (
          <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-300 mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#5c4629] font-serif font-bold mr-1">
              Active Filters:
            </span>
            {searchQuery && (
              <span className="flex items-center gap-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#5c4629] px-3 py-1 rounded-full text-xs font-sans font-medium">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:text-primary shrink-0 transition-colors cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="flex items-center gap-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#5c4629] px-3 py-1 rounded-full text-xs font-sans font-medium">
                Category: {cleanTitle(categories.find(c => c.id.toString() === selectedCategory)?.name || "")}
                <button onClick={() => setSelectedCategory("")} className="hover:text-primary shrink-0 transition-colors cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory("");
                setSearchQuery("");
              }}
              className="text-[#5c4629] hover:text-[#0e3b2e] text-xs font-serif font-bold underline ml-2 cursor-pointer transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 3. Catalog Grid */}
        {sortedProducts.length === 0 && !loading ? (
          <div className="text-center py-16 px-6 sm:px-12 bg-white border border-primary/10 rounded-3xl space-y-8 shadow-sm max-w-4xl mx-auto my-8">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/30 text-[10px] font-sans font-bold text-[#5c4629] uppercase tracking-widest">
              <PackageOpen className="w-3.5 h-3.5 text-[#7d603a]" />
              <span>Department Catalog • Custom Commission Only</span>
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
                {selectedCategory
                  ? `No Standard Stock Items in ${cleanTitle(allCategories.find((c) => c.id.toString() === selectedCategory)?.name || "Selected Category")}`
                  : "No Equipment Matched Your Search Filters"}
              </h3>
              <p className="text-xs sm:text-sm text-primary/75 leading-relaxed font-sans">
                {selectedCategory
                  ? `Equipment in the ${cleanTitle(allCategories.find((c) => c.id.toString() === selectedCategory)?.name || "selected")} department is individually handcrafted on demand or currently undergoing source-first historical verification. We accept custom archer commissions tailored to your draw length, draw weight, and historical requirements.`
                  : "Try clearing your active category or keyword filters to browse the full armory catalog."}
              </p>
            </div>

            {/* Custom Commission Value Props */}
            {selectedCategory && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-b border-primary/10 py-6 my-4">
                <div className="p-4 bg-[#f0e9d9]/30 rounded-2xl border border-primary/5 space-y-1">
                  <div className="text-xs font-serif font-bold text-primary flex items-center gap-1.5">
                    <span>🪵</span> Timber & Material Choice
                  </div>
                  <p className="text-[11px] text-primary/70 leading-relaxed font-sans">
                    Hand-selected European ash, walnut, yew, or exotic woods.
                  </p>
                </div>
                <div className="p-4 bg-[#f0e9d9]/30 rounded-2xl border border-primary/5 space-y-1">
                  <div className="text-xs font-serif font-bold text-primary flex items-center gap-1.5">
                    <span>🎯</span> Precision Draw Tuning
                  </div>
                  <p className="text-[11px] text-primary/70 leading-relaxed font-sans">
                    Custom draw weights from 20 to 160+ lbs tailored to your form.
                  </p>
                </div>
                <div className="p-4 bg-[#f0e9d9]/30 rounded-2xl border border-primary/5 space-y-1">
                  <div className="text-xs font-serif font-bold text-primary flex items-center gap-1.5">
                    <span>🛡️</span> Source Verification
                  </div>
                  <p className="text-[11px] text-primary/70 leading-relaxed font-sans">
                    Guaranteed authentic geometry & master craftsman sign-off.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-wrap justify-center gap-4">
              {selectedCategory && (
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-[#0e3b2e] text-white rounded-full text-xs font-serif font-bold uppercase tracking-wider hover:bg-[#0e3b2e]/90 cursor-pointer transition-all shadow-sm"
                >
                  Request Custom Commission
                </Link>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSearchQuery("");
                }}
                className="px-6 py-3 bg-secondary border border-primary/20 text-primary rounded-full text-xs font-serif font-bold uppercase tracking-wider hover:border-primary cursor-pointer transition-all"
              >
                View All Armory Equipment
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => {
              const parentId = product.categories.find(
                (id) => categories.find((c) => c.id === id)?.parent === 0
              );
              const parentLabel = parentId 
                ? categories.find((c) => c.id === parentId)?.name 
                : "Equipment";

              const brandId = product.categories.find(
                (id) => categories.find((c) => c.id === id)?.parent === 114
              );
              const brandLabel = brandId
                ? categories.find((c) => c.id === brandId)?.name
                : null;

              const isCompared = compareItems.some((item) => item.id === product.id);

              return (
                <div
                  key={product.slug}
                  className="product-card group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-[420px] relative"
                >
                  {/* Image Banner */}
                  <Link href={`/equipment/${product.slug}`} className="relative w-full h-[200px] bg-primary/10 overflow-hidden block">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary/90 border border-[#c5a880]/30 rounded-full text-[9px] font-sans font-bold text-secondary uppercase tracking-widest">
                      Consultation Only
                    </div>
                  </Link>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-[#5c4629] font-serif uppercase tracking-widest font-bold">
                        <span>{cleanTitle(parentLabel)}</span>
                        {brandLabel && (
                          <>
                            <span className="text-primary/30 font-sans">•</span>
                            <span>{cleanTitle(brandLabel)}</span>
                          </>
                        )}
                      </div>
                      <Link href={`/equipment/${product.slug}`}>
                        <h3 className="text-lg font-serif font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-1">
                          {cleanTitle(product.title)}
                        </h3>
                      </Link>
                      <p className="text-xs text-primary/75 leading-relaxed font-sans line-clamp-2">
                        {cleanExcerpt(product.excerpt)}
                      </p>
                    </div>

                    {/* Card Footer: Compare Toggle & Inspect Link */}
                    <div className="border-t border-primary/5 pt-4 flex items-center justify-between">
                      {/* Compare Checkbox Button */}
                      <button
                        type="button"
                        onClick={() => toggleCompareProduct(product, parentLabel, brandLabel || undefined)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-serif font-semibold transition-all cursor-pointer ${
                          isCompared
                            ? "bg-[#0e3b2e] text-white shadow-xs"
                            : "bg-secondary hover:bg-primary/10 text-primary border border-primary/15"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                            isCompared
                              ? "bg-accent border-accent text-white"
                              : "border-primary/30 bg-white"
                          }`}
                        >
                          {isCompared && <Check className="w-2.5 h-2.5 text-primary stroke-[3]" />}
                        </div>
                        <span>{isCompared ? "Compared" : "Compare"}</span>
                      </button>

                      <Link
                        href={`/equipment/${product.slug}`}
                        className="text-[10px] font-serif uppercase tracking-widest font-bold text-accent group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1"
                      >
                        <span>Inspect Specs</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="flex flex-col gap-4">
            {sortedProducts.map((product) => {
              const parentId = product.categories.find(
                (id) => categories.find((c) => c.id === id)?.parent === 0
              );
              const parentLabel = parentId 
                ? categories.find((c) => c.id === parentId)?.name 
                : "Equipment";

              const brandId = product.categories.find(
                (id) => categories.find((c) => c.id === id)?.parent === 114
              );
              const brandLabel = brandId
                ? categories.find((c) => c.id === brandId)?.name
                : null;

              const isCompared = compareItems.some((item) => item.id === product.id);

              return (
                <div
                  key={product.slug}
                  className="product-card group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300 flex flex-col md:flex-row items-stretch p-4 md:p-5 gap-6"
                >
                  {/* Thumbnail Image */}
                  <Link href={`/equipment/${product.slug}`} className="relative w-full md:w-56 h-48 md:h-auto rounded-xl overflow-hidden bg-primary/10 shrink-0 block">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 224px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 bg-primary/90 border border-[#c5a880]/30 rounded-full text-[9px] font-sans font-bold text-secondary uppercase tracking-widest">
                      Consultation Only
                    </div>
                  </Link>

                  {/* Product Information */}
                  <div className="flex-1 flex flex-col justify-between space-y-3 py-1">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#5c4629] font-serif uppercase tracking-widest font-bold">
                        <span>{cleanTitle(parentLabel)}</span>
                        {brandLabel && (
                          <>
                            <span className="text-primary/30 font-sans">•</span>
                            <span>{cleanTitle(brandLabel)}</span>
                          </>
                        )}
                      </div>

                      <Link href={`/equipment/${product.slug}`}>
                        <h3 className="text-xl font-serif font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-300">
                          {cleanTitle(product.title)}
                        </h3>
                      </Link>

                      <p className="text-xs text-primary/75 leading-relaxed font-sans line-clamp-2 md:line-clamp-3">
                        {cleanExcerpt(product.excerpt)}
                      </p>
                    </div>

                    {/* Actions & Compare Toggle */}
                    <div className="flex items-center justify-between pt-3 border-t border-primary/5">
                      <button
                        type="button"
                        onClick={() => toggleCompareProduct(product, parentLabel, brandLabel || undefined)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer ${
                          isCompared
                            ? "bg-[#0e3b2e] text-white shadow-xs"
                            : "bg-secondary hover:bg-primary/10 text-primary border border-primary/15"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isCompared
                              ? "bg-accent border-accent text-white"
                              : "border-primary/30 bg-white"
                          }`}
                        >
                          {isCompared && <Check className="w-3 h-3 text-primary stroke-[3]" />}
                        </div>
                        <span>{isCompared ? "Compared" : "Add to Compare"}</span>
                      </button>

                      <Link
                        href={`/equipment/${product.slug}`}
                        className="px-5 py-2 bg-[#0e3b2e] hover:bg-[#0e3b2e]/90 text-white rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Inspect Specs</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Floating Bottom Comparison Drawer Bar */}
      <FloatingCompareBar
        selectedProducts={compareItems}
        onRemoveProduct={removeCompareProduct}
        onClearAll={clearCompareProducts}
        onOpenModal={() => setIsCompareModalOpen(true)}
      />

      {/* Product Comparison Modal */}
      <ProductComparisonModal
        selectedProducts={compareItems}
        onRemoveProduct={removeCompareProduct}
        onClearAll={clearCompareProducts}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
    </div>
  );
}

export default function EquipmentClient({ initialProducts, initialCategories }: EquipmentClientProps) {
  return (
    <Suspense fallback={null}>
      <EquipmentContentInner initialProducts={initialProducts} initialCategories={initialCategories} />
    </Suspense>
  );
}
