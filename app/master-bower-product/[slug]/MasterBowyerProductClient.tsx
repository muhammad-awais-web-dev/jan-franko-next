"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Compass, Shield, Award, CheckCircle2, Sliders, Calendar, FileText, List, UploadCloud, Maximize2 } from "lucide-react";
import { Button } from "@/components/Button";

interface Specification {
  label: string;
  value: string;
}

interface ConfiguratorField {
  field_label: string;
  field_id: string;
  field_type: "select" | "radio" | "checkbox" | "text" | "number" | "range" | "file";
  constraints?: {
    min_val?: number | string;
    max_val?: number | string;
  };
  field_options?: {
    option_label: string;
    option_value: string;
  }[] | null;
}

interface ProductDetails {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  image: string;
  gallery: string[];
  categories?: number[];
  bowyerIds?: number[];
  acf: {
    product_subtitle?: string;
    product_overview?: string;
    delivery_time?: string;
    key_features?: string;
    lineage_content?: string;
    reliability_content?: string;
    specifications?: Specification[];
    base_sku?: string;
    configurator_fields?: ConfiguratorField[];
    bowyer_name?: string;
  };
}

const MASTER_BOWYER_FALLBACKS: Record<string, ProductDetails> = {
  "raptor": {
    id: 1980,
    slug: "raptor",
    title: "The Raptor",
    excerpt: "57-inch super-hybrid built for hunting and 3D target shooting, with aggressive reflex-deflex geometry by Warrick Harvey (Harvey Archery).",
    content: "Crafted on the Tuli Circle family farm in South Africa by Warrick Harvey.",
    date: "2026-03-01",
    image: "https://janfranko.com/wp-content/uploads/2026/04/raptor_3-1024x1024.jpg",
    gallery: [
      "https://janfranko.com/wp-content/uploads/2026/04/raptor_3-1024x1024.jpg",
      "https://janfranko.com/wp-content/uploads/2026/04/Harvey-Archery-Taking-Shot.jpg"
    ],
    bowyerIds: [240],
    acf: {
      product_subtitle: "57-inch Super-Hybrid Hunting & 3D Longbow",
      product_overview: "Aggressive reflex-deflex geometry engineered for lightning-fast arrow speed and minimal hand shock.",
      delivery_time: "4–6 Weeks (Handcrafted to Order)",
      bowyer_name: "Warrick Harvey",
      base_sku: "HA-RAPTOR-57",
      key_features: "Spalted bamboo core\nStabilized exotic burl risers\nKudu/gemsbok horn tip overlays",
      specifications: [
        { label: "Bow Length", value: '57"' },
        { label: "Draw Weights", value: "27 lbs – 60 lbs @ 28\"" },
        { label: "Core Material", value: "Spalted Bamboo Core" },
        { label: "Overlays", value: "Natural Kudu / Gemsbok Horn" },
        { label: "Craftsmanship", value: "50+ Hours Handcrafted" }
      ],
      configurator_fields: [
        {
          field_id: "draw_weight",
          field_label: "Draw Weight @ 28\"",
          field_type: "select",
          field_options: [
            { option_label: "35 lbs", option_value: "35lbs" },
            { option_label: "40 lbs", option_value: "40lbs" },
            { option_label: "45 lbs", option_value: "45lbs" },
            { option_label: "50 lbs", option_value: "50lbs" },
            { option_label: "55 lbs", option_value: "55lbs" }
          ]
        },
        {
          field_id: "dexterity",
          field_label: "Hand Orientation",
          field_type: "radio",
          field_options: [
            { option_label: "Right Hand (RH)", option_value: "RH" },
            { option_label: "Left Hand (LH)", option_value: "LH" }
          ]
        }
      ]
    }
  },
  "crowned-eagle": {
    id: 1981,
    slug: "crowned-eagle",
    title: "The Crowned Eagle",
    excerpt: "60-inch hybrid longbow, classic forgiving model, smooth draw to 32 inches, quiet shot cycle by Warrick Harvey (Harvey Archery).",
    content: "Crafted on the Tuli Circle family farm in South Africa by Warrick Harvey.",
    date: "2026-03-01",
    image: "https://janfranko.com/wp-content/uploads/2026/04/crowned-eagle_1-1024x768.jpg",
    gallery: [
      "https://janfranko.com/wp-content/uploads/2026/04/crowned-eagle_1-1024x768.jpg",
      "https://janfranko.com/wp-content/uploads/2026/04/Harvey-Archery-Taking-Shot.jpg"
    ],
    bowyerIds: [240],
    acf: {
      product_subtitle: "60-inch Forgiving Hybrid Longbow",
      product_overview: "Classic forgiving longbow profile smooth to 32 inches with a whisper-quiet release cycle.",
      delivery_time: "4–6 Weeks (Handcrafted to Order)",
      bowyer_name: "Warrick Harvey",
      base_sku: "HA-CEAGLE-60",
      key_features: "Spalted bamboo core\nStabilized exotic hardwoods\nQuiet shot profile",
      specifications: [
        { label: "Bow Length", value: '60"' },
        { label: "Max Draw Length", value: '32"' },
        { label: "Core Material", value: "Spalted Bamboo Core" },
        { label: "Craftsmanship", value: "50+ Hours Handcrafted" }
      ],
      configurator_fields: [
        {
          field_id: "draw_weight",
          field_label: "Draw Weight @ 28\"",
          field_type: "select",
          field_options: [
            { option_label: "35 lbs", option_value: "35lbs" },
            { option_label: "40 lbs", option_value: "40lbs" },
            { option_label: "45 lbs", option_value: "45lbs" },
            { option_label: "50 lbs", option_value: "50lbs" }
          ]
        }
      ]
    }
  }
};

function findDefaultBowyerProduct(slugParam: string | string[] | undefined): ProductDetails | null {
  if (!slugParam) return null;
  const s = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const normalized = String(s).toLowerCase();
  return MASTER_BOWYER_FALLBACKS[normalized] || null;
}

interface MasterBowyerProductClientProps {
  initialProduct?: ProductDetails | null;
}

const BowyerProductContent = ({ initialProduct }: MasterBowyerProductClientProps) => {
  const { slug } = useParams();
  const initialFallback = findDefaultBowyerProduct(slug as string);
  const initialData = initialProduct || initialFallback;

  // Detail States
  const [product, setProduct] = useState<ProductDetails | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(initialData?.image || "");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-switch gallery slider effect for products with multiple gallery images
  useEffect(() => {
    if (!product?.gallery || product.gallery.length <= 1 || isPaused || lightboxImage) {
      return;
    }

    const interval = setInterval(() => {
      setActiveImage((current) => {
        const gallery = product.gallery || [];
        const currentIndex = gallery.indexOf(current);
        const nextIndex = (currentIndex + 1) % gallery.length;
        return gallery[nextIndex];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [product, isPaused, lightboxImage]);

  const handlePrevImage = () => {
    if (!product?.gallery || product.gallery.length <= 1) return;
    const currentIndex = product.gallery.indexOf(activeImage);
    const prevIndex = (currentIndex - 1 + product.gallery.length) % product.gallery.length;
    setActiveImage(product.gallery[prevIndex]);
  };

  const handleNextImage = () => {
    if (!product?.gallery || product.gallery.length <= 1) return;
    const currentIndex = product.gallery.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % product.gallery.length;
    setActiveImage(product.gallery[nextIndex]);
  };

  // Configurator selections state (handles multiple choices for checkboxes, files, texts)
  const [selections, setSelections] = useState<Record<string, any>>(() => {
    if (!Array.isArray(initialData?.acf?.configurator_fields)) return {};
    const defaults: Record<string, any> = {};
    initialData.acf.configurator_fields.forEach((field) => {
      if (field.field_type === "select" && field.field_options?.length) {
        defaults[field.field_id] = field.field_options[0].option_label;
      } else if (field.field_type === "radio" && field.field_options?.length) {
        defaults[field.field_id] = field.field_options[0].option_label;
      } else if (field.field_type === "checkbox") {
        defaults[field.field_id] = [];
      } else {
        defaults[field.field_id] = "";
      }
    });
    return defaults;
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  // Inquiry Form States
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch product on mount if server data not provided
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setActiveImage(initialProduct.image);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/equipment/master-bowyer-products?slug=${slug}`);
        if (!res.ok) {
          throw new Error("Failed to load product details");
        }
        const data: ProductDetails = await res.json();
        setProduct(data);
        setActiveImage(data.image);

        // Prepopulate default selections
        const defaults: Record<string, any> = {};
        if (Array.isArray(data.acf?.configurator_fields)) {
          data.acf.configurator_fields.forEach((field) => {
            if (field.field_type === "select" && field.field_options?.length) {
              defaults[field.field_id] = field.field_options[0].option_label;
            } else if (field.field_type === "radio" && field.field_options?.length) {
              defaults[field.field_id] = field.field_options[0].option_label;
            } else if (field.field_type === "checkbox") {
              defaults[field.field_id] = [];
            } else if (field.field_type === "range" && field.constraints?.min_val) {
              defaults[field.field_id] = Number(field.constraints.min_val);
            } else if (field.field_type === "number" && field.constraints?.min_val) {
              defaults[field.field_id] = Number(field.constraints.min_val);
            } else {
              defaults[field.field_id] = "";
            }
          });
        }
        setSelections(defaults);
      } catch (err: any) {
        console.error("Error loading product details:", err);
        if (!initialFallback) {
          setError(err.message || "Product not found");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, initialProduct, initialFallback]);


  // GSAP Entrance Stagger when product loads
  useEffect(() => {
    if (loading || !product) return;

    gsap.fromTo(
      ".detail-fade-in",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out", overwrite: "auto" }
    );
  }, [loading, product]);

  // Form Submission
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!email.trim() || !email.includes("@")) newErrors.email = "Valid Email is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!message.trim()) newErrors.message = "Message text is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // Determine target Master Bowyer tab name based on product taxonomy / slug
    let bowyerTabName = "Harvey Archery";
    const firstBowyerId = product?.bowyerIds?.[0];
    const s = String(slug || "").toLowerCase();

    if (firstBowyerId === 240 || s === "raptor" || s === "crowned-eagle" || s === "lammervanger") {
      bowyerTabName = "Harvey Archery";
    } else if (firstBowyerId === 241 || ["tiron", "spartak", "krstas", "obilic", "varjag", "aga", "despot"].includes(s)) {
      bowyerTabName = "MR Bows";
    } else if (firstBowyerId === 238 || s.startsWith("long") || s.includes("aspid") || s.includes("orhan") || s.includes("pioneer") || s.includes("nail") || s.includes("bb") || s.includes("hoder") || s.includes("khan") || s.includes("lynx") || s.includes("leon")) {
      bowyerTabName = "Kadys Bows";
    } else if (product?.acf?.bowyer_name) {
      const bn = product.acf.bowyer_name.toLowerCase();
      if (bn.includes("harvey")) bowyerTabName = "Harvey Archery";
      else if (bn.includes("rovčanin") || bn.includes("rovcanin") || bn.includes("mr. bows") || bn.includes("mr bows") || bn.includes("mr.bows")) bowyerTabName = "MR Bows";
      else if (bn.includes("tolochko") || bn.includes("kadys")) bowyerTabName = "Kadys Bows";
    }

    // Format all configurator selection fields cleanly for WordPress display
    const formattedSelections: Record<string, any> = {};
    const selectionSummaryLines: string[] = [];

    if (Array.isArray(product?.acf?.configurator_fields)) {
      product.acf.configurator_fields.forEach((configField) => {
        const val = selections[configField.field_id];
        if (val !== undefined && val !== "" && (!Array.isArray(val) || val.length > 0)) {
          const label = configField.field_label || configField.field_id;
          const formattedVal = Array.isArray(val) ? val.join(", ") : String(val);
          formattedSelections[label] = formattedVal;
          selectionSummaryLines.push(`${label}: ${formattedVal}`);
        }
      });
    }

    // Capture any additional custom selection keys
    Object.entries(selections).forEach(([key, val]) => {
      if (val !== undefined && val !== "" && (!Array.isArray(val) || val.length > 0)) {
        const isKnownField = Array.isArray(product?.acf?.configurator_fields) && product.acf.configurator_fields.some((f) => f.field_id === key);
        if (!isKnownField) {
          const formattedVal = Array.isArray(val) ? val.join(", ") : String(val);
          if (!formattedSelections[key]) {
            formattedSelections[key] = formattedVal;
            selectionSummaryLines.push(`${key}: ${formattedVal}`);
          }
        }
      }
    });

    try {
      await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: bowyerTabName,
          page_url: typeof window !== "undefined" ? window.location.href : `/master-bower-product/${slug}`,
          fields: {
            bowyer: bowyerTabName,
            bow_title: product?.title || slug,
            bow_slug: slug,
            full_name: fullName,
            email: email,
            phone: phone,
            message: message,
            specifications_summary: selectionSummaryLines.join(" | "),
            ...formattedSelections,
          },
        }),
      });
    } catch (err) {
      // Fallback
    } finally {
      setSubmitted(true);
    }
  };

  const handleSelectionChange = (fieldId: string, value: any) => {
    setSelections((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleCheckboxToggle = (fieldId: string, optionLabel: string) => {
    setSelections((prev) => {
      const currentList: string[] = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      if (currentList.includes(optionLabel)) {
        return { ...prev, [fieldId]: currentList.filter((item) => item !== optionLabel) };
      } else {
        return { ...prev, [fieldId]: [...currentList, optionLabel] };
      }
    });
  };

  const handleFileUploadMock = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setUploadedFiles((prev) => ({ ...prev, [fieldId]: fileName }));
      setSelections((prev) => ({ ...prev, [fieldId]: `[File Uploaded: ${fileName}]` }));
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-xs uppercase tracking-widest text-primary/60">Inspecting Bow Specifications...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="font-serif text-2xl font-bold text-primary">Master Bowyer Model Not Found</h2>
          <p className="text-xs font-sans text-primary/70">{error || "This specific bow model is withheld or unavailable."}</p>
          <Link
            href="/equipment"
            className="inline-block px-6 py-2.5 bg-primary text-secondary font-serif text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-accent transition-colors"
          >
            Return to Armory Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary text-primary select-text pb-24">
      {/* Back Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-4">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-primary/60 hover:text-accent transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Equipment Armory
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 lg:items-start">
        {/* Left Column: Gallery & Images (Sticky) */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-[88px] lg:self-start">
          <div
            className="detail-fade-in relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-primary/10 bg-primary/5 shadow-xl group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <img src={activeImage} alt={cleanTitle(product.title)} className="w-full h-full object-cover transition-opacity duration-500" />
            
            {product.acf?.base_sku && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-secondary text-[10px] font-sans font-bold uppercase tracking-widest rounded-full backdrop-blur-md z-10">
                SKU: {product.acf.base_sku}
              </span>
            )}

            {/* Prev / Next Overlay Controls for Multi-Image Galleries */}
            {product.gallery && product.gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-primary/70 hover:bg-primary text-secondary rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer z-10"
                  title="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/70 hover:bg-primary text-secondary rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer z-10"
                  title="Next Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Slide Indicator Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-primary/60 backdrop-blur-md rounded-full z-10">
                  {product.gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeImage === imgUrl ? "w-6 bg-accent" : "w-1.5 bg-secondary/50 hover:bg-secondary"
                      }`}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Expand / Lightbox Trigger Button */}
            <button
              onClick={() => setLightboxImage(activeImage)}
              className="absolute top-4 right-4 p-2.5 bg-primary/80 hover:bg-primary text-secondary rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer z-10"
              title="Expand Image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="detail-fade-in flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImage === img ? "border-accent scale-105 shadow-md" : "border-primary/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Vetted Guild Guarantee Card */}
          <div className="detail-fade-in bg-[#0e3b2e] text-white p-6 rounded-2xl border border-accent/20 space-y-3 shadow-inner">
            <div className="flex items-center gap-2 font-serif text-xs uppercase tracking-widest text-accent font-bold">
              <Award className="w-4 h-4 text-accent" />
              Master Craftsman Guarantee
            </div>
            <p className="text-xs font-sans text-white/80 leading-relaxed">
              Every custom bow listed in this catalog is individually handcrafted by our vetted partner bowyers (*Warrick Harvey, Miško Rovčanin, Sergey Tolochko*). Each build is tailored to the archer&apos;s physical draw length, draw weight, and shooting style.
            </p>
          </div>
        </div>

        {/* Right Column: Title, Subtitle, Key Specs, Dynamic Configurator Form */}
        <div className="lg:col-span-6 space-y-8">
          {/* Header Info */}
          <div className="detail-fade-in space-y-3">
            <span className="text-[10px] font-serif uppercase tracking-widest text-accent font-bold block">
              Vetted Master Bowyer Commission
            </span>
            <h1 className="notranslate text-3xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-tight" translate="no">
              {cleanTitle(product.title)}
            </h1>
            {product.acf?.product_subtitle && (
              <p className="text-sm font-serif italic text-primary/75">{cleanTitle(product.acf.product_subtitle)}</p>
            )}
          </div>

          <div className="w-full h-[1px] bg-primary/10" />

          {/* Product Overview / Description */}
          {(product.acf?.product_overview || product.excerpt || product.content) && (
            <div className="detail-fade-in space-y-2">
              <h3 className="text-xs font-serif uppercase tracking-widest text-[#5c4629] font-bold">Model Overview</h3>
              <div
                className="text-xs font-sans text-primary/80 leading-relaxed space-y-2"
                dangerouslySetInnerHTML={{
                  __html: product.acf?.product_overview || product.excerpt || product.content,
                }}
              />
            </div>
          )}

          {/* Delivery & Lineage Stats Badge Bar */}
          <div className="detail-fade-in grid grid-cols-2 gap-4">
            {product.acf?.delivery_time && (
              <div className="p-4 bg-white/60 border border-primary/5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  Estimated Build Time
                </div>
                <div className="text-xs font-sans font-bold text-primary">{product.acf.delivery_time}</div>
              </div>
            )}
            <div className="p-4 bg-white/60 border border-primary/5 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold">
                <Shield className="w-3.5 h-3.5 text-accent" />
                Crafting Standard
              </div>
              <div className="text-xs font-sans font-bold text-primary">100% Traditional Handcrafted</div>
            </div>
          </div>

          {/* Fixed Static Specifications (If present in ACF) */}
          {Array.isArray(product.acf?.specifications) && product.acf.specifications.length > 0 && (
            <div className="detail-fade-in space-y-3">
              <h3 className="text-xs font-serif uppercase tracking-widest text-[#5c4629] font-bold flex items-center gap-1.5">
                <List className="w-4 h-4 text-accent" />
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-sans bg-white/60 border border-primary/5 p-4 rounded-2xl">
                {product.acf.specifications.map((spec, idx) => (
                  <div key={idx} className="space-y-0.5 border-b border-primary/5 pb-2">
                    <span className="text-[10px] font-serif uppercase tracking-wider text-primary/50 block">{spec.label}</span>
                    <span className="font-medium text-primary block">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC CONFIGURATOR FIELDS SECTION (ACF Repeater) */}
          {Array.isArray(product.acf?.configurator_fields) && product.acf.configurator_fields.length > 0 && (
            <div className="detail-fade-in space-y-6 pt-4">
              <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                <h3 className="text-sm font-serif font-bold uppercase tracking-widest text-[#7d603a] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-accent" />
                  Custom Options Configurator
                </h3>
                <span className="text-[10px] font-sans text-primary/50">Tailor your bow build</span>
              </div>

              {/* Render List of Dynamic Configurator Fields */}
              <div className="space-y-5 bg-white/80 border border-primary/10 p-6 rounded-2xl shadow-sm">
                {product.acf.configurator_fields.map((field) => {
                  const fieldId = field.field_id;
                  const label = field.field_label;
                  const type = field.field_type;

                  return (
                    <div key={fieldId} className="space-y-2 border-b border-primary/5 pb-4 last:border-0 last:pb-0">
                      <label className="text-xs font-serif font-bold text-primary uppercase tracking-wider block">
                        {label}
                      </label>

                      {/* SELECT Field */}
                      {type === "select" && (
                        <select
                          value={selections[fieldId] || ""}
                          onChange={(e) => handleSelectionChange(fieldId, e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary cursor-pointer"
                        >
                          {field.field_options?.map((opt, i) => (
                            <option key={i} value={opt.option_label}>
                              {opt.option_label}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* RADIO Field */}
                      {type === "radio" && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {field.field_options?.map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSelectionChange(fieldId, opt.option_label)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-sans transition-all cursor-pointer border ${
                                selections[fieldId] === opt.option_label
                                  ? "bg-primary text-secondary border-primary font-semibold shadow-sm"
                                  : "bg-secondary/40 text-primary/80 border-primary/10 hover:border-primary/30"
                              }`}
                            >
                              {opt.option_label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* CHECKBOX Field */}
                      {type === "checkbox" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {field.field_options?.map((opt, i) => {
                            const isChecked = Array.isArray(selections[fieldId]) && selections[fieldId].includes(opt.option_label);
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleCheckboxToggle(fieldId, opt.option_label)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-sans text-left transition-all border ${
                                  isChecked
                                    ? "bg-primary/10 text-primary border-accent font-semibold"
                                    : "bg-secondary/30 text-primary/70 border-primary/10 hover:border-primary/20"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? "bg-accent border-accent text-primary" : "border-primary/30"}`}>
                                  {isChecked && <CheckCircle2 className="w-3 h-3 text-primary stroke-[3]" />}
                                </div>
                                <span className="text-[11px] leading-tight">{opt.option_label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* RANGE Slider Field */}
                      {type === "range" && (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-xs font-sans font-bold text-accent">
                            <span>Selected: {selections[fieldId]}</span>
                            <span className="text-[10px] text-primary/50">
                              Range: {field.constraints?.min_val || 0} - {field.constraints?.max_val || 100}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={field.constraints?.min_val || 0}
                            max={field.constraints?.max_val || 100}
                            value={selections[fieldId] || field.constraints?.min_val || 0}
                            onChange={(e) => handleSelectionChange(fieldId, Number(e.target.value))}
                            className="w-full h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-accent"
                          />
                        </div>
                      )}

                      {/* NUMBER Input Field */}
                      {type === "number" && (
                        <input
                          type="number"
                          min={field.constraints?.min_val}
                          max={field.constraints?.max_val}
                          value={selections[fieldId] || ""}
                          onChange={(e) => handleSelectionChange(fieldId, e.target.value)}
                          className="w-full px-3.5 py-2 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent outline-none text-primary"
                        />
                      )}

                      {/* TEXT Input Field */}
                      {type === "text" && (
                        <input
                          type="text"
                          placeholder={`Enter custom ${label.toLowerCase()}...`}
                          value={selections[fieldId] || ""}
                          onChange={(e) => handleSelectionChange(fieldId, e.target.value)}
                          className="w-full px-3.5 py-2 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent outline-none text-primary"
                        />
                      )}

                      {/* FILE Upload Field */}
                      {type === "file" && (
                        <div className="space-y-2 pt-1">
                          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary/20 hover:border-accent rounded-xl cursor-pointer bg-secondary/20 transition-colors">
                            <UploadCloud className="w-5 h-5 text-accent" />
                            <span className="text-xs font-sans text-primary/80">
                              {uploadedFiles[fieldId] ? `Selected: ${uploadedFiles[fieldId]}` : "Click to upload drawing or spec sheet..."}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUploadMock(fieldId, e)}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Callouts */}
          <div className="detail-fade-in pt-4 space-y-4">
            <button
              onClick={() => setShowInquiryForm(true)}
              className="w-full py-4 bg-[#0e3b2e] hover:bg-[#0e3b2e]/90 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4 text-accent" />
              Request Custom Build &amp; Price Quote
            </button>
            <p className="text-[10px] text-center font-sans text-primary/60 italic">
              Submitting an inquiry reserves your build spot in the Master Bowyer schedule. No instant charge applied.
            </p>
          </div>
        </div>
      </div>

      {/* Inquiry Modal Form */}
      {showInquiryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-secondary border border-primary/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-accent font-bold block">
                  Custom Order Consultation
                </span>
                <h3 className="notranslate font-serif text-xl font-bold text-primary" translate="no">
                  {cleanTitle(product.title)}
                </h3>
              </div>
              <button
                onClick={() => setShowInquiryForm(false)}
                className="text-primary/50 hover:text-primary p-1.5 rounded-full hover:bg-primary/5 transition-colors"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h4 className="font-serif text-lg font-bold text-primary">Inquiry Received</h4>
                <p className="text-xs font-sans text-primary/80 leading-relaxed">
                  Thank you! Your custom configuration for <strong className="notranslate" translate="no">{cleanTitle(product.title)}</strong> has been logged. Our Master Bowyer consultation team will review your parameters and follow up shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setShowInquiryForm(false);
                  }}
                  className="px-6 py-2.5 bg-primary text-secondary font-serif text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accent transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                {/* Active Selections Summary Box */}
                <div className="bg-white/80 p-4 rounded-xl border border-primary/5 space-y-2">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-accent font-bold block">
                    Your Selected Parameters Summary
                  </span>
                  <div className="text-[11px] font-sans text-primary/80 space-y-1 max-h-32 overflow-y-auto pr-1">
                    {Object.keys(selections).length === 0 ? (
                      <p className="italic text-primary/50">Baseline standard model selected.</p>
                    ) : (
                      Object.entries(selections).map(([key, val]) => (
                        <div key={key} className="flex justify-between border-b border-primary/5 pb-1">
                          <span className="font-medium text-primary/70">{key}:</span>
                          <span className="font-bold text-primary">{Array.isArray(val) ? val.join(", ") : String(val)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-serif uppercase tracking-wider text-primary/70 font-bold block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary"
                  />
                  {errors.fullName && <p className="text-[10px] text-red-500 font-sans">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-wider text-primary/70 font-bold block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-4 py-2.5 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-sans">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-wider text-primary/70 font-bold block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+43 664..."
                      className="w-full px-4 py-2.5 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary"
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 font-sans">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-serif uppercase tracking-wider text-primary/70 font-bold block">
                    Special Requests or Questions *
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mention any custom draw weight preference, shipping country, or timeline requests..."
                    className="w-full px-4 py-3 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary resize-none"
                  />
                  {errors.message && <p className="text-[10px] text-red-500 font-sans">{errors.message}</p>}
                </div>

                {/* Privacy Policy Consent Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="master-bowyer-privacy-consent"
                    required
                    className="mt-0.5 w-4 h-4 rounded border-primary/10 bg-secondary/40 text-[#0e3b2e] focus:ring-1 focus:ring-accent cursor-pointer shrink-0"
                  />
                  <label htmlFor="master-bowyer-privacy-consent" className="text-[11px] text-primary/75 font-sans leading-snug cursor-pointer select-none">
                    I agree to the processing of my personal data in accordance with the{" "}
                    <Link href="/privacy-policy" target="_blank" className="text-[#5c4629] font-bold underline hover:text-accent transition-colors">
                      Privacy Policy
                    </Link>
                    . *
                  </label>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setShowInquiryForm(false)}
                    className="text-xs font-serif uppercase tracking-widest text-primary/50 hover:text-primary transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0e3b2e] hover:bg-[#0e3b2e]/90 text-white font-serif font-bold text-xs tracking-widest uppercase rounded-full shadow-md hover:scale-103 transition-transform cursor-pointer"
                  >
                    Submit Configuration
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

export default function MasterBowyerProductClient(props: MasterBowyerProductClientProps) {
  return (
    <Suspense fallback={null}>
      <BowyerProductContent {...props} />
    </Suspense>
  );
}

