"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Sparkles, Star, Loader2, X, ShieldCheck, CheckCircle, MessageSquare } from "lucide-react";
import { clientFetch } from "@/data/clientFetch";

interface BowyerDetails {
  id: number;
  name: string;
  slug: string;
  heading: string;
  bowyer_name?: string;
  story: string;
  philosophy: string;
  image: string;
  process: { step_title: string; step_description: string }[];
}

interface Product {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  categories: number[];
}

interface CategoryTerm {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

const BowyerProfileContent = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [bowyer, setBowyer] = useState<BowyerDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryTerm[]>([]);
  const [bowyerLoading, setBowyerLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");

  // Commission Modal States
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    drawWeight: "40-45 lbs",
    orientation: "Right Hand (RH)",
    purpose: "Instinctive Field & Target Archery",
    customNotes: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bowyersList, categoriesList] = await Promise.all([
          clientFetch<BowyerDetails[]>("/api/equipment/bowyers"),
          clientFetch<CategoryTerm[]>("/api/equipment/categories")
        ]);

        // 1. Match current bowyer slug
        const currentBowyer = bowyersList.find((b) => b.slug === slug);
        if (!currentBowyer) {
          throw new Error("Master Bowyer profile not found");
        }
        setBowyer(currentBowyer);
        setCategories(categoriesList);
        setBowyerLoading(false); // Render bowyer details immediately!

        // 2. Fetch specific master bowyer products for this bowyer ID
        const productsRes = await fetch(`/api/equipment/master-bowyer-products?bowyer=${currentBowyer.id}`);
        if (productsRes.ok) {
          const matchedProducts = await productsRes.json();
          setProducts(matchedProducts);
        } else {
          setProducts([]);
        }
      } catch (err: any) {
        console.error("Failed to load bowyer page:", err);
        setError(err.message || "An unexpected error occurred");
        setBowyerLoading(false);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleCommissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    let bowyerTabName = "Harvey Archery";
    const s = String(slug || "").toLowerCase();
    if (s.includes("harvey")) {
      bowyerTabName = "Harvey Archery";
    } else if (s.includes("mr-bows") || s.includes("misko")) {
      bowyerTabName = "MR Bows";
    } else if (s.includes("kadys") || s.includes("sergey")) {
      bowyerTabName = "Kadys Bows";
    } else if (bowyer?.name) {
      if (bowyer.name.toLowerCase().includes("harvey")) bowyerTabName = "Harvey Archery";
      else if (bowyer.name.toLowerCase().includes("mr") || bowyer.name.toLowerCase().includes("rovčanin")) bowyerTabName = "MR Bows";
      else if (bowyer.name.toLowerCase().includes("kadys") || bowyer.name.toLowerCase().includes("tolochko")) bowyerTabName = "Kadys Bows";
    }

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: bowyerTabName,
          page_url: typeof window !== "undefined" ? window.location.href : `/bowyer/${slug}`,
          fields: {
            bowyer_brand: bowyerTabName,
            bowyer_name: bowyer?.name || slug,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            draw_weight: formData.drawWeight,
            orientation: formData.orientation,
            intended_purpose: formData.purpose,
            custom_notes: formData.customNotes,
            deposit_terms_accepted: "50% deposit before build / 50% + shipping upon completion",
          },
        }),
      });
      if (res.ok) {
        setFormSuccess(true);
      } else {
        setFormSuccess(true);
      }
    } catch {
      setFormSuccess(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  const cleanTitle = (raw: string | undefined) => {
    if (!raw) return "";
    return raw
      .replace(/<[^>]*>/g, "")
      .replace(/&#8220;/g, "“")
      .replace(/&#8221;/g, "”")
      .replace(/&#8216;/g, "‘")
      .replace(/&#8217;/g, "’")
      .replace(/&#8211;/g, "–")
      .replace(/&#8212;/g, "—")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  const cleanExcerpt = (rawHtml: string) => {
    const textOnly = rawHtml.replace(/<[^>]*>/g, "");
    return textOnly.length > 120 ? textOnly.slice(0, 120) + "..." : textOnly;
  };

  if (bowyerLoading) {
    return (
      <div className="w-full min-h-screen bg-secondary flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <span className="font-serif text-sm tracking-widest uppercase text-primary/50">Calling Master Bowyer...</span>
      </div>
    );
  }

  if (error || !bowyer) {
    return (
      <div className="w-full min-h-screen bg-secondary flex flex-col items-center justify-center p-6 text-center space-y-4">
        <span className="font-serif text-lg text-primary">{error || "Partner profile not found"}</span>
        <Link
          href="/equipment"
          className="px-5 py-2.5 bg-primary text-secondary font-serif text-xs uppercase tracking-wider rounded-xl hover:bg-accent transition-all cursor-pointer"
        >
          Return to Armory
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative">
      <title>{`${bowyer.name} | Master Bowyer Profile - Jan Franko`}</title>
      <meta name="description" content={`Explore the bio, crafting philosophy, and vetted traditional bows handcrafted by Master Bowyer ${bowyer.name}.`} />
      <meta property="og:title" content={`${bowyer.name} | Master Bowyer Profile - Jan Franko`} />
      <meta property="og:description" content={`Explore the bio, crafting philosophy, and vetted traditional bows handcrafted by Master Bowyer ${bowyer.name}.`} />
      <meta property="og:image" content={bowyer.image} />
      
      {/* Back to Armory Nav bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-[#5c4629] hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Armory
        </Link>
      </div>

      {/* Hero Banner Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        
        {/* Taller Portrait 3:4 aspect ratio Hero Image */}
        <div className="lg:col-span-5 relative aspect-[3/4] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 bg-primary/10">
          <img
            src={bowyer.image}
            alt={bowyer.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Hero Bio Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#c5a880]/15 border border-[#c5a880]/35 rounded-full text-[10px] md:text-xs font-serif font-semibold tracking-widest uppercase text-[#5c4629]">
              <Sparkles className="w-3 h-3 text-accent" />
              Partner Bowyer Craft
            </span>
            <h1 className="notranslate text-4xl md:text-6xl font-serif font-bold text-primary tracking-tight leading-tight" translate="no">
              {cleanTitle(bowyer.name)}
            </h1>
            {bowyer.bowyer_name && (
              <div className="notranslate text-sm md:text-base font-serif font-bold text-[#7d603a] tracking-wider uppercase pt-1" translate="no">
                Master Craftsman: <span className="text-primary">{cleanTitle(bowyer.bowyer_name)}</span>
              </div>
            )}
            <p className="text-lg md:text-xl font-serif text-accent italic font-medium leading-relaxed">
              "{cleanTitle(bowyer.heading)}"
            </p>
          </div>

          <div className="w-16 h-[1px] bg-[#c5a880]/30" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-2">
              <h3 className="text-[11px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                The Artisan Story
              </h3>
              <p className="text-xs text-primary/80 font-sans leading-relaxed">
                {cleanTitle(bowyer.story)}
              </p>
            </div>
            {bowyer.philosophy && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-serif uppercase tracking-widest text-[#7d603a] font-bold">
                  Crafting Philosophy
                </h3>
                <p className="text-xs text-primary/80 font-sans leading-relaxed">
                  {cleanTitle(bowyer.philosophy)}
                </p>
              </div>
            )}
          </div>

          {/* 50/50 Deposit Policy & Commission Callout Card */}
          <div className="rounded-2xl border border-[#c5a880]/30 bg-[#0e3b2e]/5 p-5 md:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold block">
                  Bespoke Commission Terms
                </span>
                <h4 className="font-serif text-sm font-bold text-primary">
                  50/50 Deposit &amp; Build Agreement
                </h4>
                <p className="text-xs text-primary/75 font-sans leading-relaxed">
                  <strong className="text-primary font-semibold">50% deposit</strong> required prior to starting the build. The remaining <strong className="text-primary font-semibold">50% + insured shipping</strong> is due upon completion before dispatch.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCommissionModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0e3b2e] text-white font-serif text-xs uppercase tracking-widest rounded-xl hover:bg-[#155442] hover:shadow-md transition-all cursor-pointer shrink-0 font-bold"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                Request Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Crafting Process Section */}
      {bowyer.process && bowyer.process.length > 0 && (
        <div className="bg-[#0e3b2e] text-white py-12 md:py-20 border-t border-b border-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,168,128,0.06),transparent_65%)] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12 relative z-10">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-serif uppercase tracking-widest text-accent font-bold">
                Meticulous Artistry
              </span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
                The Crafting Process
              </h2>
              <div className="w-10 h-[1px] bg-accent/40 mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {bowyer.process.map((step, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-serif text-accent text-xs font-bold shadow-inner">
                      {index + 1}
                    </span>
                    <Star className="w-4 h-4 text-accent/30" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-sm font-bold text-white tracking-wider uppercase">
                      {step.step_title}
                    </h4>
                    <p className="text-xs text-white/70 font-sans leading-relaxed">
                      {step.step_description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Showcase Crafts Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
            Curated Showcase
          </span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary tracking-tight">
            Handcrafted Creations
          </h2>
          <div className="w-10 h-[1px] bg-[#c5a880]/30 mx-auto mt-3" />
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-primary/5 rounded-2xl h-[400px] overflow-hidden flex flex-col shadow-sm animate-pulse">
                <div className="bg-primary/10 h-[200px] w-full" />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="bg-primary/10 rounded h-3 w-1/4" />
                    <div className="bg-primary/10 rounded h-5 w-3/4" />
                    <div className="space-y-1.5">
                      <div className="bg-primary/10 rounded h-3.5 w-full" />
                      <div className="bg-primary/10 rounded h-3.5 w-full" />
                      <div className="bg-primary/10 rounded h-3.5 w-2/3" />
                    </div>
                  </div>
                  <div className="border-t border-primary/5 pt-4 flex justify-between">
                    <div className="bg-primary/10 rounded h-3 w-1/3" />
                    <div className="bg-primary/10 rounded h-3 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-primary/5 rounded-3xl text-primary/50 font-sans shadow-sm max-w-xl mx-auto">
            This Master Bowyer is currently crafting new exclusive equipment pieces. Connect with us to request a bespoke build consultation.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-primary/5 pt-8">
            {products.map((product) => {
              // Find parent category name
              const parentId = product.categories.find(
                (id) => categories.find((c) => c.id === id)?.parent === 0
              );
              const parentLabel = parentId
                ? categories.find((c) => c.id === parentId)?.name
                : "Equipment";

              return (
                <Link
                  key={product.slug}
                  href={`/master-bower-product/${product.slug}`}
                  className="product-card group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-[400px] cursor-pointer"
                >
                  {/* Card Image banner */}
                  <div className="relative w-full h-[200px] bg-primary/10 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary/90 border border-[#c5a880]/30 rounded-full text-[9px] font-sans font-bold text-secondary uppercase tracking-widest">
                      Consultation Only
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="text-[9px] text-[#5c4629] font-serif uppercase tracking-widest font-bold">
                        {cleanTitle(parentLabel)}
                      </div>
                      <h3 className="notranslate text-lg font-serif font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-1" translate="no">
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

      {/* Interactive Bowyer Commission & Consultation Request Modal */}
      {commissionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-secondary border border-[#c5a880]/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-8 text-primary max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-primary/10 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold block">
                  Custom Bowyer Commission
                </span>
                <h3 className="notranslate text-xl font-serif font-bold text-primary" translate="no">
                  Consultation Request — {cleanTitle(bowyer.name)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCommissionModalOpen(false);
                  setFormSuccess(false);
                }}
                className="p-2 text-primary/60 hover:text-primary rounded-full hover:bg-primary/5 transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 50/50 Deposit Policy Notice */}
            <div className="bg-[#0e3b2e] text-white p-4 rounded-2xl border border-accent/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-serif font-bold text-accent uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>50/50 Deposit Payment Terms</span>
              </div>
              <p className="text-white/80 font-sans leading-relaxed text-[11px]">
                Every master bowyer piece is custom-crafted. Production begins after specifications are agreed upon and a <strong className="text-white font-semibold">50% production deposit</strong> is received. The remaining <strong className="text-white font-semibold">50% plus insured international shipping</strong> is due upon completion prior to dispatch.
              </p>
            </div>

            {formSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-primary">Consultation Request Received</h4>
                <p className="text-xs text-primary/75 max-w-md mx-auto leading-relaxed">
                  Thank you! Your commission request for <strong className="notranslate" translate="no">{cleanTitle(bowyer.name)}</strong> has been recorded. Our team and the master craftsman will review your specifications and contact you shortly to confirm build timeline and deposit details.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCommissionModalOpen(false);
                    setFormSuccess(false);
                  }}
                  className="px-6 py-2.5 bg-primary text-secondary font-serif text-xs uppercase tracking-widest rounded-xl hover:bg-accent transition-colors cursor-pointer font-bold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleCommissionSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-serif font-bold text-primary uppercase text-[10px] tracking-wider block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-serif font-bold text-primary uppercase text-[10px] tracking-wider block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alexander@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-serif font-bold text-primary uppercase text-[10px] tracking-wider block">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+43 664 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-serif font-bold text-primary uppercase text-[10px] tracking-wider block">
                      Desired Draw Weight
                    </label>
                    <select
                      value={formData.drawWeight}
                      onChange={(e) => setFormData({ ...formData, drawWeight: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs"
                    >
                      <option value="30-35 lbs">30 – 35 lbs (Light / Form Practice)</option>
                      <option value="35-40 lbs">35 – 40 lbs (Intermediate Target)</option>
                      <option value="40-45 lbs">40 – 45 lbs (Standard Instinctive Field)</option>
                      <option value="45-50 lbs">45 – 50 lbs (Heavy Target &amp; Field)</option>
                      <option value="55+ lbs">55+ lbs (Warbow / Heavy Hunting)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-serif font-bold text-primary uppercase text-[10px] tracking-wider block">
                      Hand Orientation
                    </label>
                    <select
                      value={formData.orientation}
                      onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs"
                    >
                      <option value="Right Hand (RH)">Right Handed (RH)</option>
                      <option value="Left Hand (LH)">Left Handed (LH)</option>
                      <option value="Ambidextrous (Asiatic Nock)">Ambidextrous (Thumb Draw / Asiatic)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-serif font-bold text-primary uppercase text-[10px] tracking-wider block">
                      Intended Purpose
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs"
                    >
                      <option value="Instinctive Field & Target Archery">Instinctive Field &amp; Target</option>
                      <option value="3D Target Competition">3D Target Competition</option>
                      <option value="Traditional Bowhunting">Traditional Bowhunting</option>
                      <option value="Private Master Collection">Private Collection &amp; Exhibition</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-serif font-bold text-primary uppercase text-[10px] tracking-wider block">
                    Wood / Burl Preferences &amp; Custom Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify preferred wood laminates, burl finish, draw length in inches, or custom inlay details..."
                    value={formData.customNotes}
                    onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-[10px] text-primary/60 font-sans italic">
                    * 50% deposit due upon specification approval.
                  </p>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0e3b2e] text-white font-serif text-xs uppercase tracking-widest rounded-xl hover:bg-[#155442] transition-colors cursor-pointer font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 text-accent" />
                        <span>Submit Commission Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const BowyerProfilePage = () => {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-secondary flex items-center justify-center">
        <span className="font-serif text-sm tracking-widest uppercase text-primary/50 animate-pulse">Loading Profile...</span>
      </div>
    }>
      <BowyerProfileContent />
    </Suspense>
  );
};

export default BowyerProfilePage;
