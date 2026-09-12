"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Sparkles, Star, Loader2 } from "lucide-react";
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
