"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Search, X, SlidersHorizontal } from "lucide-react";

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
}

function EquipmentContentInner({ initialProducts, initialCategories }: EquipmentClientProps) {
  const searchParams = useSearchParams();

  // Shop States - pre-populated from Server Component
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryTerm[]>(initialCategories);
  const [loading, setLoading] = useState(initialProducts.length === 0 && initialCategories.length === 0);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

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

    if (initialProducts.length === 0 || initialCategories.length === 0) {
      void loadShopData();
    } else {
      setLoading(false);
    }
  }, [initialProducts, initialCategories]);

  // Sync URL search parameters on mount (e.g. from Mega Menu category link)
  useEffect(() => {
    if (categories.length === 0) return;

    const catParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    const queryParam = searchParams.get("query");

    if (catParam) {
      const term = categories.find((c) => c.slug === catParam);
      if (term) setSelectedCategory(term.id.toString());
    }
    if (brandParam) {
      const term = categories.find((c) => c.slug === brandParam);
      if (term) setSelectedCategory(term.id.toString());
    }
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams, categories]);

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
  }, [loading, searchQuery, selectedCategory, sortBy]);

  // Helper to recursively get all subcategory IDs for deep matching
  const getCategoryDescendants = (catId: number): number[] => {
    const ids = [catId];
    const findChildren = (parent: number) => {
      categories.forEach((c) => {
        if (c.parent === parent) {
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
    
    const buildTree = (parentId: number, level: number) => {
      const children = categories.filter((c) => c.parent === parentId);
      children.sort((a, b) => a.name.localeCompare(b.name));
      
      children.forEach((child) => {
        list.push({ id: child.id, name: child.name, level });
        buildTree(child.id, level + 1);
      });
    };

    const roots = categories.filter((c) => c.parent === 0 && c.id !== 28);
    roots.sort((a, b) => a.name.localeCompare(b.name));
    
    roots.forEach((root) => {
      list.push({ id: root.id, name: root.name, level: 0 });
      buildTree(root.id, 1);
    });

    return list;
  };

  // Filter Logic
  const getFilteredProducts = () => {
    return products.filter((product) => {
      // 1. Category Filter (deep match children)
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

  // Helper to strip HTML tags for card excerpt
  const cleanExcerpt = (rawHtml: string) => {
    const textOnly = rawHtml.replace(/<[^>]*>/g, "");
    return textOnly.length > 120 ? textOnly.slice(0, 120) + "..." : textOnly;
  };

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
            Academy Armory
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Equipment &amp; Bowyer Gear
          </h1>
          <p className="text-sm md:text-base text-white/80 font-normal max-w-2xl mx-auto leading-relaxed">
            Discover premium, handcrafted bows, traditional arrows, and leather accessories sourced from master bowyers and regional craftsmen.
          </p>
          <div className="pt-2 flex justify-center">
            <div className="w-12 h-[1px] bg-[#c5a880]/30" />
          </div>
        </div>
      </div>

      {/* 2. Main Shop Directory Container */}
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-8">
        
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

            {/* Right Controls: Sort & Filter Toggle */}
            <div className="flex items-center justify-end gap-3 flex-wrap">
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

              {/* Filters Toggle Button */}
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-secondary rounded-full text-xs font-serif tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-accent" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Filters Drawer */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isFiltersOpen ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-white border border-primary/5 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="max-w-md mx-auto space-y-2">
              <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-secondary text-primary border border-primary/10 rounded-xl p-2.5 text-xs outline-none focus:border-accent cursor-pointer font-sans"
              >
                <option value="">All Categories</option>
                {getCategoryTree().map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {"— ".repeat(cat.level) + cleanTitle(cat.name)}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Controls */}
            <div className="flex justify-end pt-4 border-t border-primary/5">
              <button
                onClick={() => {
                  setSelectedCategory("");
                }}
                className="px-4 py-2 border border-primary/20 hover:border-primary text-primary text-xs font-serif uppercase tracking-wider rounded-xl transition-colors duration-300 cursor-pointer"
              >
                Reset Filters
              </button>
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
          <div className="text-center py-24 bg-white border border-primary/5 rounded-3xl text-primary/60 font-sans shadow-sm">
            No equipment matched your filters. Explore other categories or search options.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => {
              // Get parent category name
              const parentId = product.categories.find(
                (id) => categories.find((c) => c.id === id)?.parent === 0
              );
              const parentLabel = parentId 
                ? categories.find((c) => c.id === parentId)?.name 
                : "Equipment";

              // Get brand/bowyer name
              const brandId = product.categories.find(
                (id) => categories.find((c) => c.id === id)?.parent === 114
              );
              const brandLabel = brandId
                ? categories.find((c) => c.id === brandId)?.name
                : null;

              return (
                <Link
                  key={product.slug}
                  href={`/equipment/${product.slug}`}
                  className="product-card group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-[400px] cursor-pointer"
                >
                  {/* Image Banner */}
                  <div className="relative w-full h-[200px] bg-primary/10 overflow-hidden">
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
                  </div>

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
                      <h3 className="text-lg font-serif font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-1">
                        {cleanTitle(product.title)}
                      </h3>
                      <p className="text-xs text-primary/75 leading-relaxed font-sans line-clamp-3">
                        {cleanExcerpt(product.excerpt)}
                      </p>
                    </div>

                    <div className="border-t border-primary/5 pt-4 flex items-center justify-between text-[10px] font-serif uppercase tracking-widest font-bold text-accent group-hover:translate-x-1 transition-transform duration-300">
                      <span>Inspect Specs</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
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
