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
  X,
  Package,
  Truck,
  Tag,
  Info
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
  gallery: string[];
  categories: number[];
  bowyerIds: number[];
  acf?: {
    sub_category?: string;
    product_subtitle?: string;
    delivery_time?: string;
    base_sku?: string;
    specifications?: { label: string; value: string }[];
    key_features?: string;
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

export interface KadysComponent {
  id: string;
  name: string;
  category: "Timber & Risers" | "Fiberglass Laminates" | "Arrows & Accessories" | "Strings";
  priceEUR: number;
  isCapped?: boolean;
  spec: string;
  sizes?: string[];
  sourceUrl: string;
  sourceUsdPrice: string;
  image: string;
}

export const KADYS_COMPONENTS: KadysComponent[] = [
  {
    id: "zebrano",
    name: "Zebrano / Zebrawood Timber Block",
    category: "Timber & Risers",
    priceEUR: 114,
    spec: "45 × 50 × 500 mm dense exotic zebrawood timber block",
    sourceUrl: "https://en.kadysbows.com/shop/zebrano",
    sourceUsdPrice: "$40.00 USD",
    image: "https://e-c.storage.googleapis.com/res/1a1b21ce-d09b-4a40-b7a3-2f72b23fb4a8/original"
  },
  {
    id: "walnut",
    name: "American Walnut (Riser Timber)",
    category: "Timber & Risers",
    priceEUR: 141,
    spec: "45 × 50 × 500 mm hand-selected timber block",
    sourceUrl: "https://en.kadysbows.com/shop/zebrano",
    sourceUsdPrice: "$50.00 USD",
    image: "https://e-c.storage.googleapis.com/res/1a1b21ce-d09b-4a40-b7a3-2f72b23fb4a8/original"
  },
  {
    id: "wenge",
    name: "Wenge (Exotic Hardwood Riser Block)",
    category: "Timber & Risers",
    priceEUR: 114,
    spec: "45 × 50 × 500 mm dense exotic timber block",
    sourceUrl: "https://en.kadysbows.com/shop/venge",
    sourceUsdPrice: "$40.00 USD",
    image: "https://e-c.storage.googleapis.com/res/5363fb41-0a06-47e3-8d03-67eb0714b631/original"
  },
  {
    id: "colored-fiberglass",
    name: "Colored Fiberglass Lamination",
    category: "Fiberglass Laminates",
    priceEUR: 57,
    spec: "High-strength limb protective lamination fiberglass",
    sizes: ["1500 / 40 / 1 mm", "1500 / 45 / 1 mm", "1840 / 40 / 1 mm", "1840 / 45 / 1 mm"],
    sourceUrl: "https://en.kadysbows.com/shop/skloplastik-prozorij-1",
    sourceUsdPrice: "$20.00 USD",
    image: "https://e-c.storage.googleapis.com/res/85036f49-fb6f-4fd7-b006-bc47ce9f603c/original"
  },
  {
    id: "amaranth",
    name: "Amaranth / Purpleheart Timber Block",
    category: "Timber & Risers",
    priceEUR: 141,
    spec: "45 × 50 × 500 mm premium dense exotic timber block",
    sourceUrl: "https://en.kadysbows.com/shop/derevyani-strili-kolorovi",
    sourceUsdPrice: "$50.00 USD",
    image: "https://e-c.storage.googleapis.com/res/cc30af97-1196-4c8e-b22c-25898713db93/original"
  },
  {
    id: "transparent-fiberglass",
    name: "Transparent Fiberglass Lamination",
    category: "Fiberglass Laminates",
    priceEUR: 42,
    spec: "High-transparency limb protective lamination fiberglass",
    sizes: ["1500 / 40 / 1 mm", "1500 / 45 / 1 mm", "1840 / 40 / 1 mm", "1840 / 45 / 1 mm"],
    sourceUrl: "https://en.kadysbows.com/shop/skloplastik-prozorij",
    sourceUsdPrice: "$14.50 USD",
    image: "https://e-c.storage.googleapis.com/res/997b0413-baec-4775-9a2c-fc2ab7e0c2f9/original"
  },
  {
    id: "colored-arrows",
    name: "Colored Traditional Wooden Arrows",
    category: "Arrows & Accessories",
    priceEUR: 28,
    spec: "Shaft diameter 5/16″ (7.9 mm), spine 35#–45#, pine shaft material with feather fletching",
    sourceUrl: "https://en.kadysbows.com/shop/derevyani-strili",
    sourceUsdPrice: "$10.00 USD",
    image: "https://e-c.storage.googleapis.com/res/7a65d531-e085-43d8-9051-183bf9b6ebef/original"
  },
  {
    id: "flemish-string",
    name: "Flemish / Endless Loop Bowstring",
    category: "Strings",
    priceEUR: 25,
    isCapped: true,
    spec: "FastFlight (FF+) material matrix, length range 58″ – 68″",
    sourceUrl: "https://en.kadysbows.com/shop/tyativa-neskinchenna-petlya-1",
    sourceUsdPrice: "$15.00 USD (Capped Rate)",
    image: "https://e-c.storage.googleapis.com/res/a0883cd1-7ae8-48ca-9896-08905e923f75/original"
  }
];

const COMPONENT_CATEGORIES = [
  "All Components",
  "Timber & Risers",
  "Fiberglass Laminates",
  "Arrows & Accessories",
  "Strings"
];


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

// Exact WP slugs of the 6 products listed on kadysbows.com/shop/cat/eksklyuzivni-luki
const EXCLUSIVE_BOW_SLUGS = new Set([
  "dovgij-luk-nail-2-1",
  "hunting-bow-leon",
  "long-bow-bb-1536",
  "longbow-mlb-forest",
  "longbow-richard",
  "rekursivnij-luk-hoder-basic-ugorskij-1",
]);

export function getKadysSubCategory(rawTitle: string, rawSlug: string): string {
  const t = (rawTitle || "").toLowerCase();
  const s = (rawSlug || "").toLowerCase();

  // Exclusive first — exact slug match against Kadys' curated exclusive list
  if (EXCLUSIVE_BOW_SLUGS.has(s)) {
    return "Exclusive Bows";
  }
  if (t.includes("hunting") || t.includes("leon") || t.includes("lynx")) {
    return "Hunting Bows";
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


interface KadysBowsClientProps {
  initialProducts?: Product[];
}

export default function KadysBowsClient({ initialProducts }: KadysBowsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [catalogMode, setCatalogMode] = useState<"bows" | "components">("bows");
  const [activeCategory, setActiveCategory] = useState("All Models");
  const [activeComponentCategory, setActiveComponentCategory] = useState("All Components");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = React.useTransition();

  
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

  // Lightbox state
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number; title: string } | null>(null);

  const openLightbox = (images: string[], index: number, title: string) => {
    setLightbox({ images, index, title });
  };
  const closeLightbox = () => setLightbox(null);
  const lbPrev = () => setLightbox(lb => lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : null);
  const lbNext = () => setLightbox(lb => lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : null);

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") lbPrev();
      else if (e.key === "ArrowRight") lbNext();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;

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
  }, [initialProducts]);


  const cleanTitle = (raw: string | undefined) => {
    if (!raw) return "";
    let str = raw
      .replace(/<[^>]*>/g, "")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8216;/g, "'")
      .replace(/&#8217;/g, "'")
      .replace(/&#8211;/g, "-")
      .replace(/&#8212;/g, "-")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (str.includes("-") || str === str.toLowerCase() || str.toLowerCase().includes("luk")) {
      str = str.replace(/-/g, " ");
    }

    const translations: Record<string, string> = {
      rekursivnij: "Recurve",
      recurve: "Recurve",
      recursive: "Recurve",
      dovgij: "Longbow",
      longbow: "Longbow",
      longbows: "Longbow",
      long: "Longbow",
      mislivskij: "Hunting",
      hunting: "Hunting",
      luk: "Bow",
      ugorskij: "(Hungarian)",
      hungarian: "(Hungarian)",
      tureckij: "(Turkish)",
      turkish: "(Turkish)",
      krimsko: "Crimean",
      tatarskij: "Tatar",
      crimean: "Crimean",
      tatar: "Tatar",
      mongolskij: "(Mongolian)",
      mongolian: "(Mongolian)",
      manchzhurskij: "(Manchu)",
      manchurian: "(Manchu)",
      manchu: "(Manchu)",
      amarant: "Amaranth",
      amaranth: "Amaranth",
      vv: "BB",
      bb: "BB",
      mlb: "MLB",
      orhanturkish: "Orhan (Turkish)",
      orhan: "Orhan",
      hoder: "Hoder",
      aspid: "Aspid",
      khan: "Khan",
      pioneer: "Pioneer",
      richard: "Richard",
      nail: "Nail",
      leon: "Leon",
      lynx: "Lynx",
      mongol: "Mongol",
      ashur: "Ashur",
      assyrian: "Assyrian",
      childrens: "Children's",
      mamba: "Mamba",
      black: "Black",
      basic: "Basic",
      puzzle: "Puzzle"
    };

    const tokens = str.match(/[a-zA-Z0-9#']+/g) || [];
    const cleaned: string[] = [];

    for (const token of tokens) {
      const lower = token.toLowerCase();
      if (translations[lower]) {
        cleaned.push(translations[lower]);
      } else if (/^\d+$/.test(token) && token.length === 4 && parseInt(token, 10) > 1000) {
        cleaned.push(`#${token}`);
      } else if (/^\d+$/.test(token)) {
        cleaned.push(`#${token}`);
      } else {
        cleaned.push(token.charAt(0).toUpperCase() + token.slice(1).toLowerCase());
      }
    }

    let result = cleaned.join(" ");
    result = result.replace(/\b(Longbow|Recurve|Hunting|Bow)\s+\1\b/gi, "$1");
    result = result.replace(/\bLongbow\s+Bow\b/gi, "Longbow");
    result = result.replace(/\bRecurve\s+Bow\s+Bow\b/gi, "Recurve Bow");

    return result || raw;
  };

  const cleanExcerpt = (rawHtml: string) => {
    if (!rawHtml) return "";
    const textOnly = rawHtml.replace(/<[^>]*>/g, "");
    return textOnly.length > 140 ? textOnly.slice(0, 140) + "..." : textOnly;
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

  const filteredComponents = KADYS_COMPONENTS.filter((c) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = c.name.toLowerCase().includes(q) || c.spec.toLowerCase().includes(q);
    if (activeComponentCategory === "All Components") return nameMatch;
    return nameMatch && c.category.toLowerCase() === activeComponentCategory.toLowerCase();
  });

  const getCompCatCount = (catName: string) => {
    if (catName === "All Components") return KADYS_COMPONENTS.length;
    return KADYS_COMPONENTS.filter((c) => c.category.toLowerCase() === catName.toLowerCase()).length;
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

      {/* ── KADYS BOWS & COMPONENTS CATALOG SECTION ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-14 md:py-20 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
            Catalog Collections
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary tracking-tight">
            Kadys Bows Equipment &amp; Workshop Catalog
          </h2>
          <p className="text-xs md:text-sm text-primary/70 font-sans leading-relaxed max-w-xl mx-auto">
            Browse handcrafted traditional bows and workshop components by Sergey Tolochko.
          </p>
          <div className="w-12 h-[1px] bg-[#c5a880]/30 mx-auto mt-2" />
        </div>

        {/* Primary Catalog Mode Selector: Bows vs Components */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-white border border-primary/10 rounded-2xl shadow-xs gap-2">
            <button
              type="button"
              onClick={() => {
                setCatalogMode("bows");
                setSearchQuery("");
              }}
              className={`px-6 py-3 rounded-xl text-xs md:text-sm font-serif font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
                catalogMode === "bows"
                  ? "bg-[#0e3b2e] text-white shadow-md"
                  : "bg-transparent text-primary/70 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <span>🏹 Traditional Bows</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${catalogMode === "bows" ? "bg-accent text-primary" : "bg-primary/10 text-primary/60"}`}>
                {products.length || 69}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCatalogMode("components");
                setSearchQuery("");
              }}
              className={`px-6 py-3 rounded-xl text-xs md:text-sm font-serif font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
                catalogMode === "components"
                  ? "bg-[#0e3b2e] text-white shadow-md"
                  : "bg-transparent text-primary/70 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <span>🪵 Workshop Components</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${catalogMode === "components" ? "bg-accent text-primary" : "bg-primary/10 text-primary/60"}`}>
                {KADYS_COMPONENTS.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search & Sub-Category Tab Controls */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-primary/10 shadow-xs">
            {/* Sub-Category Tabs depending on catalogMode */}
            {catalogMode === "bows" ? (
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
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {COMPONENT_CATEGORIES.map((cat) => {
                  const count = getCompCatCount(cat);
                  const isActive = activeComponentCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveComponentCategory(cat)}
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
            )}

            {/* Live Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" />
              <input
                type="text"
                placeholder={catalogMode === "bows" ? "Search bow models (e.g. Orhan, Leon, Aspid)..." : "Search components (e.g. Zebrano, Fiberglass, Arrows)..."}
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

        {/* Grid Content */}
        {catalogMode === "bows" ? (
          loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white border border-primary/5 rounded-2xl h-[440px] animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-primary/5 rounded-3xl text-primary/60 font-sans shadow-sm max-w-xl mx-auto text-xs leading-relaxed p-8 space-y-3">
              <Layers className="w-8 h-8 mx-auto text-primary/30" />
              <p className="font-serif font-bold text-primary text-sm">No Bow Models Found</p>
              <p>No bow products match your current search or sub-category filter.</p>
              <button
                onClick={() => { setActiveCategory("All Models"); setSearchQuery(""); }}
                className="px-4 py-2 bg-primary text-secondary font-serif text-xs uppercase tracking-widest rounded-xl hover:bg-accent hover:text-primary transition-colors font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-primary/5 pt-8">
              {filteredProducts.map((product) => {
                const gallery = product.gallery || (product.image ? [product.image] : []);
                const subCat = product.acf?.sub_category || getKadysSubCategory(product.title, product.slug);
                const displayTitle = cleanTitle(product.title);
                const excerptText = cleanExcerpt(product.excerpt || product.content || "");

                return (
                  <div
                    key={product.id}
                    className="product-card group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-[560px] cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative w-full min-h-[380px] bg-primary/10 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => openLightbox(gallery, 0, displayTitle)}
                        className="w-full h-full block cursor-zoom-in"
                        aria-label={`View photo gallery for ${displayTitle}`}
                      >
                        <img
                          src={gallery[0] || product.image}
                          alt={displayTitle}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                      </button>
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary/90 border border-[#c5a880]/30 rounded-full text-[9px] font-sans font-bold text-secondary uppercase tracking-widest pointer-events-none">
                        Consultation Only
                      </div>
                    </div>

                    {/* Body Content (Entire section is a link) */}
                    <Link
                      href={`/master-bower-product/${product.slug}`}
                      className="p-5 flex-1 flex flex-col justify-between block cursor-pointer group/card"
                    >
                      <div className="space-y-2">
                        <div className="text-[9px] text-[#5c4629] font-serif uppercase tracking-widest font-bold">
                          {subCat}
                        </div>
                        <h3
                          className="notranslate text-lg font-serif font-bold text-primary leading-snug group-hover/card:text-accent transition-colors duration-300 line-clamp-1"
                          translate="no"
                        >
                          {displayTitle}
                        </h3>
                        <p className="text-xs text-primary/75 leading-relaxed font-sans line-clamp-3">
                          {excerptText}
                        </p>
                      </div>

                      <div className="border-t border-primary/5 pt-4 flex items-center justify-between text-[10px] font-serif uppercase tracking-widest font-bold text-accent group-hover/card:translate-x-1 transition-transform duration-300">
                        <span>Inspect Specs</span>
                        <span>→</span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Components Grid */
          filteredComponents.length === 0 ? (
            <div className="text-center py-16 bg-white border border-primary/5 rounded-3xl text-primary/60 font-sans shadow-sm max-w-xl mx-auto text-xs leading-relaxed p-8 space-y-3">
              <Package className="w-8 h-8 mx-auto text-primary/30" />
              <p className="font-serif font-bold text-primary text-sm">No Workshop Components Found</p>
              <p>No component items match your current search or category filter.</p>
              <button
                onClick={() => { setActiveComponentCategory("All Components"); setSearchQuery(""); }}
                className="px-4 py-2 bg-primary text-secondary font-serif text-xs uppercase tracking-widest rounded-xl hover:bg-accent hover:text-primary transition-colors font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 border-t border-primary/5 pt-8">
              {filteredComponents.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white border border-primary/10 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary/5">
                      <button
                        type="button"
                        onClick={() => openLightbox([comp.image], 0, comp.name)}
                        className="w-full h-full block cursor-zoom-in"
                        aria-label={`View photo for ${comp.name}`}
                      >
                        <img
                          src={comp.image}
                          alt={comp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </button>
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-[#0e3b2e] text-white text-[9px] font-serif font-bold uppercase tracking-wider rounded-full shadow-xs pointer-events-none">
                        {comp.category}
                      </span>
                    </div>

                    <div className="px-4 space-y-2">
                      <h4 className="font-serif font-bold text-sm text-primary group-hover:text-accent transition-colors leading-snug">
                        {comp.name}
                      </h4>
                      <p className="text-xs font-sans text-primary/75 leading-relaxed">
                        {comp.spec}
                      </p>

                      {comp.sizes && comp.sizes.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-serif uppercase tracking-wider text-[#7d603a] font-bold block">
                            Available Size Options:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {comp.sizes.map((sz, i) => (
                              <span key={i} className="text-[10px] font-sans px-2 py-0.5 bg-secondary/80 border border-primary/10 rounded-md text-primary/80">
                                {sz}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-3 mt-3 border-t border-primary/5 flex items-center justify-between bg-[#fbf9f5]/50">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif font-bold text-lg text-primary">€{comp.priceEUR}</span>
                        <span className="text-[10px] font-sans text-primary/60 font-medium">+ shipping</span>
                      </div>
                      <span className="text-[9px] font-sans text-primary/40 block">Catalog Source: {comp.sourceUsdPrice}</span>
                    </div>
                    <a
                      href={comp.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-primary/5 hover:bg-[#0e3b2e] text-primary hover:text-white transition-all cursor-pointer inline-flex items-center justify-center"
                      title="View on Sergey's official workshop website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm flex flex-col items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-xs font-sans">
            {lightbox.index + 1} / {lightbox.images.length}
          </div>

          {/* Title */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-white/80 text-sm font-serif font-bold tracking-wide notranslate text-center max-w-xs truncate" translate="no">
            {lightbox.title}
          </div>

          {/* Main image */}
          <div
            className="relative flex items-center justify-center w-full h-full px-16 py-20"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.index]}
              alt={`${lightbox.title} — photo ${lightbox.index + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
              draggable={false}
            />
          </div>

          {/* Prev / Next */}
          {lightbox.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); lbPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); lbNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Thumbnail strip at bottom */}
          {lightbox.images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2"
              onClick={e => e.stopPropagation()}
            >
              {lightbox.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightbox(lb => lb ? { ...lb, index: idx } : null)}
                  className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === lightbox.index ? "border-white scale-110" : "border-white/30 hover:border-white/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}


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
