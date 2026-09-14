"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Search,
  Filter,
  Layers,
  Award,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X
} from "lucide-react";
import { clientFetch } from "@/data/clientFetch";
import { MASTER_BOWYERS } from "@/data/bowyers";

interface Product {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  categories: number[];
  acf?: {
    sub_category?: string;
    product_subtitle?: string;
    delivery_time?: string;
    base_sku?: string;
  };
}

interface BowyerInfo {
  brand: string;
  bowyerName: string;
  heading: string;
  story: string;
  background: string[];
  materials: string[];
  sourceUrl: string;
  sourceLabel: string;
}

const kadysMaster = MASTER_BOWYERS.find((b) => b.slug === "kadys-bows");

const KADYS_DATA: BowyerInfo = {
  brand: kadysMaster?.brand || "Kadys Bows",
  bowyerName: kadysMaster?.bowyerName || "Sergey Tolochko",
  heading: kadysMaster?.introduction || "Handcrafted traditional hunting and competition recurves, longbows, and historical Asiatic bows.",
  story: kadysMaster?.story || "KadysBows was founded in 2011 by Sergey Tolochko and is currently one of the leading traditional bow makers in the region. Products are trusted across Europe, Asia, and North America.",
  background: kadysMaster?.background || [
    "Founded in 2011 by Sergey Tolochko (Sergiy Gennadiyovych Tolochko).",
    "Kadys Bows specializes in bespoke traditional bows and individual commissions.",
    "Bows are used by traditional target archers, hunters, and mounted archers worldwide."
  ],
  materials: kadysMaster?.materials || [
    "High-elasticity ash wood limbs with clear or black protective fiberglass lamination.",
    "Ergonomic hand-carved risers crafted from natural domestic and exotic timbers (Wenge, Amaranth, Zebrawood, Walnut).",
    "Dacron string matrix with reinforced tip nocks.",
    "Custom draw weights tillered individually to order from 25 to 70+ lbs."
  ],
  sourceUrl: kadysMaster?.sourceUrl || "https://en.kadysbows.com/",
  sourceLabel: kadysMaster?.sourceLabel || "Kadys Bows — Official Website"
};

const SUB_CATEGORIES = [
  "All Models",
  "Recurve Bows",
  "Longbows",
  "Hunting Bows",
  "Exclusive Bows"
];

export function getKadysSubCategory(rawTitle: string, rawSlug: string): string {
  const t = (rawTitle || "").toLowerCase();
  const s = (rawSlug || "").toLowerCase();

  if (t.includes("hunting") || t.includes("leon") || t.includes("lynx")) {
    return "Hunting Bows";
  }
  if (t.includes("amaranth") || t.includes("puzzle") || t.includes("exclusive")) {
    return "Exclusive Bows";
  }
  if (
    t.includes("longbow") ||
    t.includes("long bow") ||
    t.includes("aspid") ||
    t.includes("pioneer") ||
    t.includes("nail") ||
    t.includes("mlb") ||
    t.includes("mamba") ||
    t.includes("richard") ||
    t.includes("bb") ||
    s.includes("bb")
  ) {
    return "Longbows";
  }
  return "Recurve Bows";
}

export default function KadysBowsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Models");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    drawWeight: "40-45 lbs",
    orientation: "Right Hand (RH)",
    purpose: "Traditional Target & Field Archery",
    customNotes: ""
  });

  useEffect(() => {
    const fetchKadysProducts = async () => {
      try {
        const res = await fetch("/api/equipment/master-bowyer-products?bowyer=238");
        if (res.ok) {
          const data: Product[] = await res.json();
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch Kadys Bows products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKadysProducts();
  }, []);

  const cleanTitle = (raw: string | undefined) => {
    if (!raw) return "";
    return raw
      .replace(/<[^>]*>/g, "")
      .replace(/&#8220;/g, '“')
      .replace(/&#8221;/g, '”')
      .replace(/&#8216;/g, '‘')
      .replace(/&#8217;/g, '’')
      .replace(/&#8211;/g, '–')
      .replace(/&#8212;/g, '—')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  const filteredProducts = products.filter((p) => {
    const titleMatch = cleanTitle(p.title).toLowerCase().includes(searchQuery.toLowerCase());
    const pSubCat = p.acf?.sub_category || getKadysSubCategory(p.title, p.slug);
    
    if (activeCategory === "All Models") return titleMatch;
    return titleMatch && pSubCat.toLowerCase() === activeCategory.toLowerCase();
  });

  const getSubCatCount = (catName: string) => {
    if (catName === "All Models") return products.length;
    return products.filter((p) => {
      const pSubCat = p.acf?.sub_category || getKadysSubCategory(p.title, p.slug);
      return pSubCat.toLowerCase() === catName.toLowerCase();
    }).length;
  };

  const handleCommissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: "Kadys Bows",
          page_url: typeof window !== "undefined" ? window.location.href : "/bowyer/kadys-bows",
          fields: {
            bowyer_brand: "Kadys Bows",
            bowyer_name: "Sergey Tolochko",
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            draw_weight: formData.drawWeight,
            orientation: formData.orientation,
            intended_purpose: formData.purpose,
            custom_notes: formData.customNotes,
            deposit_terms_accepted: "50% deposit before build / 50% + shipping upon completion"
          }
        })
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative pb-24">
      {/* Back to Armory Nav Bar */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-6">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-[#5c4629] hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Armory
        </Link>
      </div>

      {/* Hero Banner Section */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className="lg:col-span-5 relative aspect-[3/4] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 bg-primary/10">
          <img
            src="https://janfranko.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-12-at-11.23.29-PM.jpeg"
            alt="Sergey Tolochko Kadys Bows"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#c5a880]/15 border border-[#c5a880]/35 rounded-full text-[10px] md:text-xs font-serif font-semibold tracking-widest uppercase text-[#5c4629]">
              <Sparkles className="w-3 h-3 text-accent" />
              Master Craftsman Partner
            </span>
            <h1 className="notranslate text-4xl md:text-6xl font-serif font-bold text-primary tracking-tight leading-tight" translate="no">
              Kadys Bows
            </h1>
            <div className="notranslate text-sm md:text-base font-serif font-bold text-[#7d603a] tracking-wider uppercase pt-1" translate="no">
              Master Bowyer: <span className="text-primary">Sergey Tolochko</span>
            </div>
            <p className="text-lg md:text-xl font-serif text-accent italic font-medium leading-relaxed">
              "{KADYS_DATA.heading}"
            </p>
          </div>

          <div className="w-16 h-[1px] bg-[#c5a880]/30" />

          <div className="space-y-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-[11px] font-serif uppercase tracking-widest text-[#5c4629] font-bold border-b border-[#5c4629]/15 pb-1">
                The Artisan Story
              </h3>
              <p className="text-xs md:text-sm text-primary/80 font-sans leading-relaxed">
                {KADYS_DATA.story}
              </p>
            </div>
          </div>

          {/* Commission Callout */}
          <div className="rounded-2xl border border-[#c5a880]/30 bg-[#0e3b2e]/5 p-5 md:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold block">
                  Bespoke Commission Terms
                </span>
                <h4 className="font-serif text-sm font-bold text-primary">
                  50/50 Deposit &amp; Custom Build Agreement
                </h4>
                <p className="text-xs text-primary/75 font-sans leading-relaxed">
                  <strong className="text-primary font-semibold">50% deposit</strong> required prior to starting the build. The remaining <strong className="text-primary font-semibold">50% + insured shipping</strong> is due upon completion before dispatch.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0e3b2e] text-white font-serif text-xs uppercase tracking-widest rounded-xl hover:bg-[#155442] hover:shadow-md transition-all cursor-pointer shrink-0 font-bold"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                Request Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Materials & Sourcing Specs */}
      <div className="bg-white border-t border-b border-primary/10 py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold block">
                Craftsman Heritage
              </span>
              <h3 className="text-2xl font-serif font-bold text-primary">
                Background &amp; Sourcing
              </h3>
              <p className="text-xs text-primary/70 font-sans leading-relaxed">
                Verified background metrics and international distribution verified directly from Sergey Tolochko's workshop.
              </p>
              <a
                href={KADYS_DATA.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7d603a] hover:text-primary transition-colors font-sans pt-2"
              >
                <span>{KADYS_DATA.sourceLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {KADYS_DATA.background.map((fact, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#f0e9d9]/30 border border-primary/5 space-y-1">
                  <div className="text-[10px] font-serif font-bold uppercase tracking-widest text-[#5c4629]">
                    Fact #{idx + 1}
                  </div>
                  <p className="text-xs text-primary/80 font-sans leading-relaxed">
                    {fact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t border-primary/10 pt-10">
            <div className="space-y-1">
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold block">
                Material Science
              </span>
              <h3 className="text-xl font-serif font-bold text-primary">
                Core Materials &amp; Construction Specs
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {KADYS_DATA.materials.map((mat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-primary/10 space-y-1.5 shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <p className="text-xs text-primary/85 font-sans leading-relaxed">
                    {mat}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── KADYS BOWS CATALOG SECTION WITH SUB-CATEGORY TABS ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-14 md:py-20 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
            Catalog Collections
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary tracking-tight">
            Kadys Bows Equipment Catalog
          </h2>
          <p className="text-xs md:text-sm text-primary/70 font-sans leading-relaxed max-w-xl mx-auto">
            Browse handcrafted traditional bows by Sergey Tolochko, categorized into Recurve Bows, Longbows, Hunting Bows, and Exclusive Models.
          </p>
          <div className="w-12 h-[1px] bg-[#c5a880]/30 mx-auto mt-2" />
        </div>

        {/* Search & Sub-Category Tab Controls */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-primary/10 shadow-xs">
            {/* Interactive Sub-Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {SUB_CATEGORIES.map((cat) => {
                const count = getSubCatCount(cat);
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer shrink-0 inline-flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#0e3b2e] text-white shadow-sm"
                        : "bg-primary/5 text-primary/70 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-accent text-primary" : "bg-primary/10 text-primary/60"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" />
              <input
                type="text"
                placeholder="Search models (e.g. Orhan, Leon, Aspid)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-secondary border border-primary/10 rounded-xl text-xs font-sans focus:outline-none focus:border-accent text-primary placeholder:text-primary/40"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white border border-primary/5 rounded-2xl h-[440px] animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-primary/5 rounded-3xl text-primary/60 font-sans shadow-sm max-w-xl mx-auto text-xs leading-relaxed p-8 space-y-3">
            <Layers className="w-8 h-8 mx-auto text-primary/30" />
            <p className="font-serif font-bold text-primary text-sm">No Bow Models Found</p>
            <p>No products match your current search or sub-category filter. Try switching tabs or clearing the search query.</p>
            <button
              onClick={() => { setActiveCategory("All Models"); setSearchQuery(""); }}
              className="px-4 py-2 bg-primary text-secondary font-serif text-xs uppercase tracking-widest rounded-xl hover:bg-accent hover:text-primary transition-colors font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary/5">
                  <img
                    src={product.image}
                    alt={cleanTitle(product.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#0e3b2e] text-white text-[10px] font-serif font-bold uppercase tracking-widest rounded-full shadow-sm">
                    {product.acf?.sub_category || getKadysSubCategory(product.title, product.slug)}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="notranslate font-serif text-xl font-bold text-primary group-hover:text-accent transition-colors" translate="no">
                      {cleanTitle(product.title)}
                    </h3>
                    <p className="text-xs text-primary/75 font-sans leading-relaxed line-clamp-2">
                      {cleanTitle(product.excerpt || product.content)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-primary/5 flex items-center justify-between">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold">
                      Handcrafted Commission
                    </span>
                    <Link
                      href={`/master-bower-product/${product.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-primary group-hover:text-accent transition-colors uppercase tracking-widest"
                    >
                      <span>Inspect Specifications</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Consultation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-secondary border border-primary/20 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-primary/50 hover:text-primary p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-serif uppercase tracking-widest text-accent font-bold">
                Master Bowyer Commission
              </span>
              <h3 className="text-2xl font-serif font-bold text-primary">
                Commission Kadys Bows
              </h3>
              <p className="text-xs font-sans text-primary/70">
                Direct commission inquiry with Master Bowyer Sergey Tolochko (50% deposit required prior to build).
              </p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-4 bg-white/60 rounded-2xl p-6 border border-accent/30">
                <CheckCircle2 className="w-10 h-10 text-accent mx-auto" />
                <h4 className="font-serif text-lg font-bold text-primary">Inquiry Received</h4>
                <p className="text-xs text-primary/80 font-sans leading-relaxed">
                  Thank you! Your commission request has been logged. Our archery team will contact you shortly regarding draw specs and timber selection.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setModalOpen(false); }}
                  className="px-6 py-2.5 bg-primary text-secondary font-serif text-xs uppercase tracking-widest rounded-xl font-bold hover:bg-accent"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleCommissionSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-serif uppercase tracking-widest text-primary/70 font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-xs font-sans text-primary focus:outline-none focus:border-accent"
                    placeholder="Archer Full Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-widest text-primary/70 font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-xs font-sans text-primary focus:outline-none focus:border-accent"
                      placeholder="archer@domain.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-widest text-primary/70 font-bold">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-xs font-sans text-primary focus:outline-none focus:border-accent"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-widest text-primary/70 font-bold">Draw Weight Specs</label>
                    <select
                      value={formData.drawWeight}
                      onChange={(e) => setFormData({ ...formData, drawWeight: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-xs font-sans text-primary focus:outline-none focus:border-accent"
                    >
                      <option value="30-35 lbs">30 - 35 lbs @ 28"</option>
                      <option value="35-40 lbs">35 - 40 lbs @ 28"</option>
                      <option value="40-45 lbs">40 - 45 lbs @ 28"</option>
                      <option value="45-50 lbs">45 - 50 lbs @ 28"</option>
                      <option value="50-55 lbs">50 - 55 lbs @ 28"</option>
                      <option value="60+ lbs Warbow">60+ lbs Warbow</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-widest text-primary/70 font-bold">Hand Orientation</label>
                    <select
                      value={formData.orientation}
                      onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-xs font-sans text-primary focus:outline-none focus:border-accent"
                    >
                      <option value="Right Hand (RH)">Right Hand (RH)</option>
                      <option value="Left Hand (LH)">Left Hand (LH)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-serif uppercase tracking-widest text-primary/70 font-bold">Custom Build Notes</label>
                  <textarea
                    rows={3}
                    value={formData.customNotes}
                    onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-xs font-sans text-primary focus:outline-none focus:border-accent"
                    placeholder="Mention preferred woods, draw length, or specific Kadys bow model..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#0e3b2e] text-white font-serif text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#155442] transition-colors cursor-pointer"
                >
                  {submitting ? "Submitting Request..." : "Submit Commission Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
