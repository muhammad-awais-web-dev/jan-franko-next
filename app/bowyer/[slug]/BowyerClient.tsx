"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Star,
  Loader2,
  X,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { clientFetch } from "@/data/clientFetch";
import { findMasterBowyer } from "@/data/bowyers";

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
  gallery?: string[];
  categories: number[];
}


interface CategoryTerm {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

const DEFAULT_BOWYERS: BowyerDetails[] = [
  {
    id: 240,
    name: "Harvey Archery",
    slug: "harvey-archery",
    bowyer_name: "Warrick Harvey",
    heading:
      "Custom laminated longbows handcrafted on the family farm in South Africa.",
    story:
      "I have been obsessed with making bows since I was 4 years old and have never stopped making them year in and year out. I got my first plastic bow with those arrows with the rubber plunger that sticks to windows on my 4th birthday. One day I decided to pull the rubber plunger off my arrows and I ended up shooting my mom between the eyes... As a result, the bow was confiscated, and I got a massive hiding. The next day when my parents went to work, I went to my dad's cupboard and stole his shoelace of his running shoes, I went to the garden and chopped down a stick and make my first bow using my dad's shoelace as the bow string. And that's how it all started. I would say my passion for bow making is an obsession, I strive to be known as one of the best custom bow makers in the world.",
    philosophy:
      "Every bow requires an average of 50 hours of dedicated hand craftsmanship, blending spalted bamboo cores with exotic burl hardwoods and natural horn overlays.",
    image:
      "https://janfranko.com/wp-content/uploads/2026/04/Harvey-Archery-Taking-Shot.jpg",
    process: [
      {
        step_title: "Wood Selection & Stabilization",
        step_description:
          "Hand-selecting spalted bamboo cores and exotic burls, stabilizing timber for extreme weather resilience.",
      },
      {
        step_title: "Precision Lamination",
        step_description:
          "Laminating custom limb profiles under controlled heat and pressure to ensure maximum energy transfer.",
      },
      {
        step_title: "Tillering & Hand Finishing",
        step_description:
          "Meticulous hand tillering to exact draw specs, sealed with protective oiled finishes.",
      },
    ],
  },
  {
    id: 241,
    name: "MR Bows",
    slug: "mr-bows",
    bowyer_name: "Miško Rovčanin",
    heading:
      "Fiberglass-laminated bows made in Serbia for recreation, physical and mental development, competition, and historical practice.",
    story:
      "Archery, a dream from the boy's days, has found its way. After completing the training, talking and socializing with both professional and amateur archers, learning from experienced bowyers and following the Internet, my archery begins. I strive to bring life back to the old craft and tradition. With many years of experience, with constant study and improvement, I have tried to make the bows that will meet the expectations of customers, whether it is just recreation, developing physical and mental strength that instinctive archery requires or for competition. Following and respecting world business standards, providing quality and endurance, I have gained a reputation and many satisfied customers. I do business in Serbia and around the world. I try to make a satisfied customer my best recommendation. Find something for you from my range of bows, order and see the quality of the bows for yourself.\n\nBy choosing quality materials, I make fiberglass laminated arches using: Fiberglass (transparent and black), Stable core, Micarta, Epoxy resin, Dacron for tendons. The variety of wood, both from the domestic and exotic terrain, provides the possibility of making it according to the customer's wishes. Ash is the primary material used as a base for making limbs, very elastic and resistant. For handrails I use: Walnut, Ash, Plum, Pear, Cherry... and of the exotic species there are: Zebra, Wenge, Paduk, Olive, Purple Heart... You can find several different models in the offer, some of which are based on their technical characteristics and historical replica records. Other models are constructed by arbitrary personal experience and ideas. I make bows with a strength from 25-150 pounds.",
    philosophy:
      "Combining historical bow craftsmanship with modern fiberglass lamination, creating robust traditional bows with draw weights from 25 to 150 lbs.",
    image:
      "https://janfranko.com/wp-content/uploads/2026/04/16864081_1249414485136489_6658590496747384211_n.jpg",
    process: [
      {
        step_title: "Core Shaping & Material Selection",
        step_description:
          "Selecting elastic ash wood cores and high-density Micarta/epoxy matrix materials.",
      },
      {
        step_title: "Glass Lamination",
        step_description:
          "Applying transparent or black fiberglass laminates under uniform pressure for consistent arrow speed.",
      },
      {
        step_title: "Custom Riser & Tip Inlays",
        step_description:
          "Carving handles with domestic or exotic hardwoods (walnut, wenge, purpleheart) and reinforcing tips.",
      },
    ],
  },
  {
    id: 238,
    name: "Kadys Bows",
    slug: "kadys-bows",
    bowyer_name: "Sergey Tolochko",
    heading:
      "Handcrafted traditional hunting and competition recurves and longbows.",
    story:
      "KadysBows was founded in 2011 by Sergey Tolochko and is currently one of the leading traditional bow makers in the region. Products are used across the countries of the former CIS, as well as Poland, Turkey, Greece, China, South Korea, Cyprus, Malaysia, Malta, and the USA.",
    philosophy:
      "Focused on individual commissions and traditional shooting performance, trusted by archers across Europe, Asia, and North America.",
    image:
      "https://janfranko.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-12-at-11.23.29-PM.jpeg",
    process: [
      {
        step_title: "Bespoke Limb Geometry",
        step_description:
          "Custom shaping limb profiles for smooth draw cycles without stacking.",
      },
      {
        step_title: "Hardwood Riser Construction",
        step_description:
          "Hand-carving ergonomic risers designed for instinctive target and field shooting.",
      },
      {
        step_title: "Field Inspection & Testing",
        step_description:
          "Rigorous testing and arrow speed verification prior to final dispatch.",
      },
    ],
  },
];

function findDefaultBowyer(slug: string): BowyerDetails {
  const s = slug.toLowerCase();
  if (s.includes("harvey")) return DEFAULT_BOWYERS[0];
  if (s.includes("mr-bows") || s.includes("misko") || s.includes("rovcanin"))
    return DEFAULT_BOWYERS[1];
  if (s.includes("kadys") || s.includes("sergey") || s.includes("tolochko"))
    return DEFAULT_BOWYERS[2];
  return DEFAULT_BOWYERS[0];
}

interface BowyerClientProps {
  initialProducts?: Product[];
  initialCategories?: CategoryTerm[];
}

const BowyerProfileContent = ({ initialProducts, initialCategories }: BowyerClientProps) => {
  const params = useParams();
  const slug = (params.slug as string) || "warrick-harvey";
  const masterBowyerData = findMasterBowyer(slug);

  // Prepopulate initial bowyer synchronously to ensure 0 loading screen / 0 layout shift
  const [bowyer, setBowyer] = useState<BowyerDetails>(() =>
    findDefaultBowyer(slug),
  );
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [categories, setCategories] = useState<CategoryTerm[]>(initialCategories || []);
  const [productsLoading, setProductsLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [galleryExpanded, setGalleryExpanded] = useState(false);

  // Lightbox state for product images & galleries
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number; title: string } | null>(null);

  const openLightbox = (images: string[], index: number, title: string) => {
    setLightbox({ images, index, title });
  };
  const closeLightbox = () => setLightbox(null);
  const lbPrev = () => setLightbox(lb => lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : null);
  const lbNext = () => setLightbox(lb => lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : null);

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
    customNotes: "",
  });

  useEffect(() => {
    // Keep initial bowyer in sync if slug parameter changes
    setBowyer(findDefaultBowyer(slug));

    if (initialProducts && initialProducts.length > 0 && initialCategories && initialCategories.length > 0) {
      setProductsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [bowyersList, categoriesList] = await Promise.all([
          clientFetch<BowyerDetails[]>("/api/equipment/bowyers"),
          clientFetch<CategoryTerm[]>("/api/equipment/categories"),
        ]);

        const matched = bowyersList.find(
          (b) =>
            b.slug === slug || b.slug.includes(slug) || slug.includes(b.slug),
        );
        if (matched) {
          setBowyer(matched);
        }
        if (categoriesList) setCategories(categoriesList);

        const targetId = matched?.id || findDefaultBowyer(slug).id;
        const productsRes = await fetch(
          `/api/equipment/master-bowyer-products?bowyer=${targetId}`,
        );
        if (productsRes.ok) {
          const matchedProducts = await productsRes.json();
          setProducts(matchedProducts || []);
        }
      } catch (err) {
        console.error("Failed to update bowyer data from WP API:", err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, [slug, initialProducts, initialCategories]);


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
      if (bowyer.name.toLowerCase().includes("harvey"))
        bowyerTabName = "Harvey Archery";
      else if (
        bowyer.name.toLowerCase().includes("mr") ||
        bowyer.name.toLowerCase().includes("rovčanin")
      )
        bowyerTabName = "MR Bows";
      else if (
        bowyer.name.toLowerCase().includes("kadys") ||
        bowyer.name.toLowerCase().includes("tolochko")
      )
        bowyerTabName = "Kadys Bows";
    }

    try {
      await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: bowyerTabName,
          page_url:
            typeof window !== "undefined"
              ? window.location.href
              : `/bowyer/${slug}`,
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
            deposit_terms_accepted:
              "50% deposit before build / 50% + shipping upon completion",
          },
        }),
      });
      setFormSuccess(true);
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

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative">
      {/* Back to Armory Nav bar (1440px container) */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-6">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-[#5c4629] hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Armory
        </Link>
      </div>

      {/* Hero Banner Section (1440px container) */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
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
            <h1
              className="notranslate text-4xl md:text-6xl font-serif font-bold text-primary tracking-tight leading-tight"
              translate="no"
            >
              {cleanTitle(bowyer.name)}
            </h1>
            {bowyer.bowyer_name && (
              <div
                className="notranslate text-sm md:text-base font-serif font-bold text-[#7d603a] tracking-wider uppercase pt-1"
                translate="no"
              >
                Master Craftsman:{" "}
                <span className="text-primary">
                  {cleanTitle(bowyer.bowyer_name)}
                </span>
              </div>
            )}
            <p className="text-lg md:text-xl font-serif text-accent italic font-medium leading-relaxed">
              "{cleanTitle(bowyer.heading)}"
            </p>
          </div>

          <div className="w-16 h-[1px] bg-[#c5a880]/30" />

          {/* Vertically stacked Artisan Story and Crafting Philosophy sections */}
          <div className="space-y-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-[11px] font-serif uppercase tracking-widest text-[#5c4629] font-bold border-b border-[#5c4629]/15 pb-1">
                The Artisan Story
              </h3>
              <div className="text-xs md:text-sm text-primary/80 font-sans leading-relaxed space-y-2.5">
                {cleanTitle(bowyer.story)
                  .split("\n\n")
                  .map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
              </div>
            </div>
            {bowyer.philosophy && (
              <div className="space-y-2 pt-2">
                <h3 className="text-[11px] font-serif uppercase tracking-widest text-[#7d603a] font-bold border-b border-[#7d603a]/15 pb-1">
                  Crafting Philosophy
                </h3>
                <div className="text-xs md:text-sm text-primary/80 font-sans leading-relaxed space-y-2.5">
                  {cleanTitle(bowyer.philosophy)
                    .split("\n\n")
                    .map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                </div>
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
                  <strong className="text-primary font-semibold">
                    50% deposit
                  </strong>{" "}
                  required prior to starting the build. The remaining{" "}
                  <strong className="text-primary font-semibold">
                    50% + insured shipping
                  </strong>{" "}
                  is due upon completion before dispatch.
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

      {/* Workshop Heritage, Core Materials & Signature Models */}
      {masterBowyerData && (
        <div className="bg-white border-t border-b border-primary/10 py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-12">
            {/* 1. Workshop Heritage & Background Facts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-2">
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold block">
                  Craftsman Heritage
                </span>
                <h3 className="text-2xl font-serif font-bold text-primary">
                  Background &amp; Sourcing
                </h3>
                <p className="text-xs text-primary/70 font-sans leading-relaxed">
                  Verified background metrics, workshop origins, and
                  international distribution verified directly from the master
                  bowyer's official channels.
                </p>
                {masterBowyerData.sourceUrl && (
                  <a
                    href={masterBowyerData.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7d603a] hover:text-primary transition-colors font-sans pt-2"
                  >
                    <span>
                      {masterBowyerData.sourceLabel ||
                        "Official Bowyer Website"}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {masterBowyerData.background.map((fact, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#f0e9d9]/30 border border-primary/5 space-y-1"
                  >
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

            {/* 2. Core Materials & Construction */}
            {masterBowyerData.materials &&
              masterBowyerData.materials.length > 0 && (
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
                    {masterBowyerData.materials.map((mat, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-primary/10 space-y-1.5 shadow-xs"
                      >
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <p className="text-xs text-primary/85 font-sans leading-relaxed">
                          {mat}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* 3. Signature Bow Models */}
            {masterBowyerData.models && masterBowyerData.models.length > 0 && (
              <div className="space-y-4 border-t border-primary/10 pt-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold block">
                    Master Catalog
                  </span>
                  <h3 className="text-xl font-serif font-bold text-primary">
                    Signature Bow Models
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {masterBowyerData.models.map((model, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#0e3b2e]/5 border border-[#c5a880]/30 space-y-2"
                    >
                      <div className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold">
                        Signature Model
                      </div>
                      <h4
                        className="notranslate font-serif text-base font-bold text-primary"
                        translate="no"
                      >
                        {model.name}
                      </h4>
                      <p className="text-xs text-primary/75 font-sans leading-relaxed">
                        {model.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Crafting Process Section (1440px container) */}
      {bowyer.process && bowyer.process.length > 0 && (
        <div className="bg-[#0e3b2e] text-white py-12 md:py-18 border-t border-b border-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,168,128,0.06),transparent_65%)] pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-10 relative z-10">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-serif uppercase tracking-widest text-accent font-bold">
                Meticulous Artistry
              </span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
                The Crafting Process
              </h2>
              <div className="w-10 h-[1px] bg-accent/40 mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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

      {/* ── Harvey Archery Exclusive: YouTube Videos & Photo Gallery ── */}
      {slug.toLowerCase().includes("harvey") &&
        (() => {
          const HARVEY_VIDEOS: {
            id: string;
            title: string;
            description: string;
          }[] = [
            {
              id: "IBk75THON80",
              title: "Behind the Build — Harvey Archery at Work",
              description:
                "Warrick Harvey walks through his bow-making process on the Tuli Circle family farm in South Africa — from raw timber selection to the final tiller pull. Watch how 50+ hours of handcraft go into every single limb.",
            },
            {
              id: "oS6FHsegl6o",
              title: "Field Session — The Raptor in Action",
              description:
                "A live field shooting session with the Harvey Archery Raptor — a 57-inch super-hybrid built for 3D target and hunting. Aggressive reflex-deflex geometry meets a whisper-quiet release cycle.",
            },
            {
              id: "bLWOHgmMJzE",
              title: "Craftsmanship Up Close — Exotic Materials & Finishing",
              description:
                "A detailed look at the exotic materials that define every Harvey bow: spalted bamboo cores, stabilised burl hardwood risers, and natural kudu/gemsbok horn tip overlays, finished by hand under the South African sky.",
            },
          ];

          const HARVEY_GALLERY_IMAGES: string[] = [
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0004_EB0E272F-EA2E-4FE5.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0007_12296845-23F9-4265.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0018_A584AF75-CB83-40D0.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0006_D0AC544C-79DC-43AE.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0011_IMG_1107.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0001_IMG_8538.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0002_IMG_8493.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/683042880_18407486683183235_2948344188137590091_n.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/681048927_18407486674183235_9204372385451197551_n.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/681487353_18407486692183235_7022020878069214566_n.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/671229785_18406446736183235_8794904767205341196_n.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/674482150_18407157280183235_631952241601392902_n.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0020_796211D3-9A32-432D.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0010_IMG_1875.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0019_A1C116F5-AB39-4B9D-1.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0000_IMG_9887.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0022_6804BA1B-D1FC-4DF8.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0016_AD09E73B-8655-4F26.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0015_B0EA1DD8-A2DA-4C29.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0013_DF21F55C-8FFC-4779.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0017_ABDA265C-C6E2-415C.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0023_374D4EA5-F368-4741.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0012_FFF2B850-1974-49EE.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0021_9828A9A9-00A6-4FCD.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/main_prod-3.png",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0025_Background.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/main_prod-2.png",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0008_4DA71DD7-83F2-4644.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0014_D6178654-0198-4790.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0024_8B5AA883-0EDE-44B6.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0009_IMG_2273.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0003_F7AA0170-6F7C-4C31.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/0A39702D-7AF2-47EE-81C0-23C7CBF12D7C_0005_D54D6FF8-3DAD-49DC.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0038.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0033.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/raptor_3.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0034.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0028.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0037.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0036.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0035.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/crowned-eagle_1.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0023.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0022.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0021.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0020.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0031.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0030.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0029.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0025.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/IMG-20260320-WA0024.jpg",
            "https://janfranko.com/wp-content/uploads/2026/04/lammervanger_1.jpg",
          ];

          const displayedImages = galleryExpanded
            ? HARVEY_GALLERY_IMAGES
            : HARVEY_GALLERY_IMAGES.slice(0, 9);

          return (
            <div className="pt-14 md:pt-20 border-t border-primary/10 space-y-16">
              {/* Video Sections */}
              <div className="max-w-5xl mx-auto px-6 md:px-12 space-y-20">
                {HARVEY_VIDEOS.map((video) => (
                  <div key={video.id} className="space-y-6">
                    {/* Section Header */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                        Harvey Archery — Field & Workshop
                      </span>
                      <h2 className="text-xl md:text-3xl font-serif font-bold text-primary tracking-tight">
                        {video.title}
                      </h2>
                      <div className="w-10 h-[1px] bg-[#c5a880]/40" />
                    </div>

                    {/* YouTube Embed */}
                    <div
                      className="relative w-full rounded-2xl overflow-hidden border border-primary/10 shadow-lg bg-primary/5"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Video Description */}
                    <p className="text-sm font-sans text-primary/75 leading-relaxed max-w-3xl">
                      {video.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Image Gallery */}
              {HARVEY_GALLERY_IMAGES.length > 0 && (
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-10">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                      Workshop & Field
                    </span>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary tracking-tight">
                      Harvey Archery — Photo Gallery
                    </h2>
                    <div className="w-10 h-[1px] bg-[#c5a880]/30 mx-auto mt-3" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedImages.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-primary/10 shadow-sm bg-primary/5 group"
                      >
                        <img
                          src={src}
                          alt={`Harvey Archery gallery image ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Expand / Collapse Button */}
                  {HARVEY_GALLERY_IMAGES.length > 9 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => setGalleryExpanded(!galleryExpanded)}
                        className="px-8 py-3.5 bg-primary text-secondary hover:bg-accent hover:text-primary transition-all duration-300 font-serif text-xs uppercase tracking-widest font-bold rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2"
                      >
                        {galleryExpanded
                          ? "Show Less"
                          : `View All Photos (${HARVEY_GALLERY_IMAGES.length} Images)`}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

      {/* ── MR Bows Exclusive: Options & Riser Types ── */}
      {(slug.toLowerCase().includes("mr-bows") ||
        slug.toLowerCase().includes("misko") ||
        slug.toLowerCase().includes("rovcanin") ||
        bowyer.name.toLowerCase().includes("mr")) && (
        <div className="py-14 md:py-20 border-t border-primary/10 bg-[#f9f6f0] space-y-16">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold">
                Customization &amp; Materials
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary tracking-tight">
                Options and Riser Types
              </h2>
              <p className="text-xs md:text-sm text-primary/70 font-sans leading-relaxed pt-1">
                Handcrafted domestic and exotic timber risers alongside specialized historical limb and nock stylizations for MR Bows.
              </p>
              <div className="w-12 h-[1px] bg-[#c5a880]/40 mx-auto mt-4" />
            </div>

            {/* 1. RISER TYPES GRID */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-[#5c4629]/20" />
                <h3 className="font-serif text-lg md:text-xl font-bold uppercase tracking-widest text-[#5c4629] px-4">
                  Riser Types
                </h3>
                <div className="h-[1px] flex-1 bg-[#5c4629]/20" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[
                  { name: "Walnut", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_riser_walnut.jpg" },
                  { name: "Ash Tree", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_riser_ash_tree.jpg" },
                  { name: "Plum", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_riser_plum.jpg" },
                  { name: "Pear", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_riser_pear.jpg" },
                  { name: "Zebrawood", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_riser_zebrawood.jpg" },
                  { name: "Padauk", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_riser_padauk.jpg" },
                  { name: "Purple Heart", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_riser_purple_heart.jpg" },
                  { name: "Wenge", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_riser_wenge.jpg" },
                  { name: "Rosewood", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_riser_rosewood.jpeg" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary/5">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 text-center bg-white border-t border-primary/5">
                      <span className="font-serif text-xs font-bold text-primary tracking-wide">
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. TIRON OPTIONS GRID */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-[#5c4629]/20" />
                <h3 className="font-serif text-lg md:text-xl font-bold uppercase tracking-widest text-[#5c4629] px-4">
                  Tiron Options
                </h3>
                <div className="h-[1px] flex-1 bg-[#5c4629]/20" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                {[
                  { name: "Limbs Original", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_tiron_limbs_original.jpg" },
                  { name: "Limbs Thin", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_tiron_limbs_thin.jpg" },
                  { name: "Nock Fresco", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_tiron_nock_fresco.jpg" },
                  { name: "Nock Thin", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_tiron_nock_thin.jpg" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary/5">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 text-center bg-white border-t border-primary/5">
                      <span className="font-serif text-xs font-bold text-primary tracking-wide">
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. DESPOT OPTIONS GRID */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-[#5c4629]/20" />
                <h3 className="font-serif text-lg md:text-xl font-bold uppercase tracking-widest text-[#5c4629] px-4">
                  Despot Options
                </h3>
                <div className="h-[1px] flex-1 bg-[#5c4629]/20" />
              </div>

              <div className="grid grid-cols-2 max-w-xl mx-auto gap-4 md:gap-6">
                {[
                  { name: "Nock Fresco", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_despot_nock_fresco.jpg" },
                  { name: "Nock Thin", url: "https://janfranko.com/wp-content/uploads/2026/09/mrbows_despot_nock_thin.jpg" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary/5">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 text-center bg-white border-t border-primary/5">
                      <span className="font-serif text-xs font-bold text-primary tracking-wide">
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Showcase Crafts Section (1440px container) */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-14 md:py-20 space-y-10">
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
              <div
                key={n}
                className="bg-white border border-primary/5 rounded-2xl h-[460px] overflow-hidden flex flex-col shadow-sm animate-pulse"
              >
                <div className="bg-primary/10 h-[280px] w-full" />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="bg-primary/10 rounded h-3 w-1/4" />
                    <div className="bg-primary/10 rounded h-5 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white border border-primary/5 rounded-3xl text-primary/60 font-sans shadow-sm max-w-xl mx-auto text-xs leading-relaxed p-6">
            This Master Bowyer is currently crafting new exclusive equipment
            pieces. Connect with us to request a bespoke build consultation.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-primary/5 pt-8">
            {products.map((product) => {
              const parentId = product.categories?.find(
                (id) => categories.find((c) => c.id === id)?.parent === 0,
              );
              const parentLabel = parentId
                ? categories.find((c) => c.id === parentId)?.name
                : "Equipment";

              return (
                <div
                  key={product.slug}
                  className="product-card group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-[560px]"
                >
                  <div className="relative w-full min-h-[380px] bg-primary/10 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLightbox(product.gallery?.length ? product.gallery : [product.image], 0, cleanTitle(product.title));
                      }}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out cursor-zoom-in"
                    />
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary/90 border border-[#c5a880]/30 rounded-full text-[9px] font-sans font-bold text-secondary uppercase tracking-widest pointer-events-none">
                      Consultation Only
                    </div>
                  </div>

                  <Link
                    href={`/master-bower-product/${product.slug}`}
                    className="p-5 flex-1 flex flex-col justify-between block cursor-pointer group/card"
                  >
                    <div className="space-y-2">
                      <div className="text-[9px] text-[#5c4629] font-serif uppercase tracking-widest font-bold">
                        {cleanTitle(parentLabel)}
                      </div>
                      <h3
                        className="notranslate text-lg font-serif font-bold text-primary leading-snug group-hover/card:text-accent transition-colors duration-300 line-clamp-1"
                        translate="no"
                      >
                        {cleanTitle(product.title)}
                      </h3>
                      <p className="text-xs text-primary/75 leading-relaxed font-sans line-clamp-3">
                        {cleanExcerpt(product.excerpt)}
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
        )}
      </div>

      {/* ── Lightbox Overlay ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-sm flex flex-col items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-xs font-sans">
            {lightbox.index + 1} / {lightbox.images.length}
          </div>

          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-white/80 text-sm font-serif font-bold tracking-wide notranslate text-center max-w-xs truncate" translate="no">
            {lightbox.title}
          </div>

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

          {lightbox.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); lbPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); lbNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

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

      {/* Interactive Bowyer Commission & Consultation Request Modal */}
      {commissionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-secondary border border-[#c5a880]/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-8 text-primary max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-primary/10 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold block">
                  Custom Bowyer Commission
                </span>
                <h3
                  className="notranslate text-xl font-serif font-bold text-primary"
                  translate="no"
                >
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

            <div className="bg-[#0e3b2e] text-white p-4 rounded-2xl border border-accent/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-serif font-bold text-accent uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>50/50 Deposit Payment Terms</span>
              </div>
              <p className="text-white/80 font-sans leading-relaxed text-[11px]">
                Every master bowyer piece is custom-crafted. Production begins
                after specifications are agreed upon and a{" "}
                <strong className="text-white font-semibold">
                  50% production deposit
                </strong>{" "}
                is received. The remaining{" "}
                <strong className="text-white font-semibold">
                  50% plus insured international shipping
                </strong>{" "}
                is due upon completion prior to dispatch.
              </p>
            </div>

            {formSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-primary">
                  Consultation Request Received
                </h4>
                <p className="text-xs text-primary/75 max-w-md mx-auto leading-relaxed">
                  Thank you! Your commission request for{" "}
                  <strong className="notranslate" translate="no">
                    {cleanTitle(bowyer.name)}
                  </strong>{" "}
                  has been recorded. Our team and the master craftsman will
                  review your specifications and contact you shortly to confirm
                  build timeline and deposit details.
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
              <form
                onSubmit={handleCommissionSubmit}
                className="space-y-4 text-xs"
              >
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
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-serif font-bold text-primary uppercase text-[10px] tracking-wider block">
                      Desired Draw Weight
                    </label>
                    <select
                      value={formData.drawWeight}
                      onChange={(e) =>
                        setFormData({ ...formData, drawWeight: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs"
                    >
                      <option value="30-35 lbs">
                        30 – 35 lbs (Light / Form Practice)
                      </option>
                      <option value="35-40 lbs">
                        35 – 40 lbs (Intermediate Target)
                      </option>
                      <option value="40-45 lbs">
                        40 – 45 lbs (Standard Instinctive Field)
                      </option>
                      <option value="45-50 lbs">
                        45 – 50 lbs (Heavy Target &amp; Field)
                      </option>
                      <option value="55+ lbs">
                        55+ lbs (Warbow / Heavy Hunting)
                      </option>
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orientation: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs"
                    >
                      <option value="Right Hand (RH)">Right Handed (RH)</option>
                      <option value="Left Hand (LH)">Left Handed (LH)</option>
                      <option value="Ambidextrous (Asiatic Nock)">
                        Ambidextrous (Thumb Draw / Asiatic)
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-serif font-bold text-primary uppercase text-[10px] tracking-wider block">
                      Intended Purpose
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) =>
                        setFormData({ ...formData, purpose: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-primary/15 rounded-xl text-primary focus:outline-none focus:border-accent text-xs"
                    >
                      <option value="Instinctive Field & Target Archery">
                        Instinctive Field &amp; Target
                      </option>
                      <option value="3D Target Competition">
                        3D Target Competition
                      </option>
                      <option value="Traditional Bowhunting">
                        Traditional Bowhunting
                      </option>
                      <option value="Private Master Collection">
                        Private Collection &amp; Exhibition
                      </option>
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
                    onChange={(e) =>
                      setFormData({ ...formData, customNotes: e.target.value })
                    }
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

export default function BowyerClient(props: BowyerClientProps) {
  return (
    <Suspense fallback={null}>
      <BowyerProfileContent {...props} />
    </Suspense>
  );
}

