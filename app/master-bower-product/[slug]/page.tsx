"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronLeft, Compass, Shield, Award, CheckCircle2, Sliders, Calendar, FileText, List, UploadCloud } from "lucide-react";
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
  };
}

const BowyerProductContent = () => {
  const { slug } = useParams();

  // Detail States
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");

  // Configurator selections state (handles multiple choices for checkboxes, files, texts)
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  // Inquiry Form States
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch product on mount
  useEffect(() => {
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
        data.acf?.configurator_fields?.forEach((field) => {
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
        setSelections(defaults);
      } catch (err: any) {
        console.error("Error loading product details:", err);
        setError(err.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // GSAP Entrance Stagger when product loads
  useEffect(() => {
    if (loading || !product) return;

    setShowInquiryForm(false);
    setSubmitted(false);

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

    try {
      await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: "Bespoke Master Bow Order",
          page_url: typeof window !== "undefined" ? window.location.href : `/master-bower-product/${slug}`,
          fields: {
            bow_title: product?.title || slug,
            full_name: fullName,
            email: email,
            phone: phone,
            custom_selections: selections,
            message: message,
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
      [fieldId]: value
    }));
  };

  const handleCheckboxToggle = (fieldId: string, label: string) => {
    setSelections((prev) => {
      const current = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      const updated = current.includes(label)
        ? current.filter((item: string) => item !== label)
        : [...current, label];
      return {
        ...prev,
        [fieldId]: updated
      };
    });
  };

  const handleFileUpload = (fieldId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldId]: file.name
      }));
      setSelections((prev) => ({
        ...prev,
        [fieldId]: `Attached file: ${file.name}`
      }));
    }
  };

  const openConfigurationInquiry = () => {
    setShowInquiryForm(true);
    
    // Compile a beautiful custom message with their specifications
    let specsText = "";
    if (product?.acf?.configurator_fields) {
      specsText = product.acf.configurator_fields
        .map((f) => {
          const label = f.field_label;
          const val = selections[f.field_id];
          const formattedVal = Array.isArray(val) ? val.join(", ") : val;
          return `- ${label}: ${formattedVal || "None"}`;
        })
        .join("\n");
    }

    setMessage(
      `I would like to request a bespoke build consultation for the custom "${product?.title}".\n\n` +
      `My Desired Specifications:\n${specsText}\n\n` +
      `Please let me know the current build queue length and price estimate.`
    );

    // Smooth scroll down to inquiry form
    setTimeout(() => {
      document.getElementById("inquiry-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-secondary flex items-center justify-center">
        <span className="font-serif text-sm tracking-widest uppercase text-primary/50 animate-pulse">Loading Custom Product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-screen bg-secondary flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-primary">Bespoke Creation Not Found</h2>
        <Button href="/equipment" variant="accent">Back to Armory</Button>
      </div>
    );
  }

  // HTML entity cleanup helpers
  const cleanTitle = (raw: string | undefined) => {
    if (!raw) return "";
    return raw
      .replace(/&#8220;/g, "“")
      .replace(/&#8221;/g, "”")
      .replace(/&#8211;/g, "–")
      .replace(/&amp;/g, "&");
  };

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative pb-24">
      <title>{`${product.title} | Master Bowyer Creation - Jan Franko`}</title>
      <meta name="description" content={product.excerpt ? product.excerpt.replace(/<[^>]*>/g, "") : `Handcrafted traditional bow creation.`} />
      <meta property="og:title" content={`${product.title} | Master Bowyer Creation - Jan Franko`} />
      <meta property="og:description" content={product.excerpt ? product.excerpt.replace(/<[^>]*>/g, "") : `Handcrafted traditional bow creation.`} />
      <meta property="og:image" content={product.image} />
      
      {/* 1. Navigation Breadcrumb Banner */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between text-xs font-serif uppercase tracking-widest text-[#5c4629] font-bold">
        <Link href="/equipment" className="flex items-center gap-1.5 hover:text-[#0e3b2e] transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Armory
        </Link>
        <span className="hidden sm:inline text-primary/40 font-sans normal-case">
          Bespoke Custom Bows / {cleanTitle(product.title)}
        </span>
      </div>

      {/* 2. Side-by-Side Content Section (Image & Overview Box) */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
        
        {/* Left Side (45%): Main Product Image & Thumbnail Slider */}
        <div className="lg:col-span-5 space-y-6 detail-fade-in">
          {/* Main Showcase Image */}
          <div className="relative aspect-square w-full bg-white border border-primary/5 rounded-3xl overflow-hidden shadow-sm">
            <Image
              src={activeImage}
              alt={product.title}
              fill
              priority
              sizes="(max-w-768px) 100vw, 500px"
              className="object-cover transition-all duration-300"
            />
          </div>

          {/* Interactive Thumbnails Slider */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {product.gallery.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-20 h-20 bg-white border rounded-xl overflow-hidden shrink-0 transition-all ${
                    activeImage === imgUrl ? "border-accent ring-2 ring-accent/20" : "border-primary/5 hover:border-accent/40"
                  }`}
                >
                  <img src={imgUrl} alt={`Gallery item ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side (55%): Title, Overview & Key Features (All in one elegant box) */}
        <div className="lg:col-span-7 detail-fade-in">
          <div className="bg-white border border-primary/5 p-8 md:p-10 rounded-3xl shadow-sm space-y-8 h-full flex flex-col justify-between">
            {/* Essentials Header */}
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#5c4629] font-serif font-bold">
                    {product.acf?.product_subtitle || "Bespoke Creation"}
                  </span>
                  <h1 className="notranslate text-3xl font-serif font-bold text-primary tracking-tight leading-tight" translate="no">
                    {cleanTitle(product.title)}
                  </h1>
                </div>
                {product.acf?.base_sku && (
                  <span className="text-[9px] font-sans font-bold text-primary/40 bg-secondary px-3 py-1 rounded-full uppercase tracking-wider border border-primary/5 shrink-0">
                    SKU: {product.acf.base_sku}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-primary/50 font-sans border-b border-primary/5 pb-4">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-accent" />
                  Bespoke Craft
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-accent" />
                  Consultation Only
                </span>
                {product.acf?.delivery_time && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-accent" />
                      {product.acf.delivery_time}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Product Overview Description */}
            {product.acf?.product_overview && (
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-widest text-[#5c4629] font-serif font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-accent" />
                  Overview
                </h4>
                <p className="text-xs text-primary/80 font-sans leading-relaxed">
                  {product.acf.product_overview}
                </p>
              </div>
            )}

            {/* Key Features HTML */}
            {product.acf?.key_features && (
              <div className="space-y-3 border-t border-primary/5 pt-6">
                <h4 className="text-[10px] uppercase tracking-widest text-[#5c4629] font-serif font-bold flex items-center gap-1.5">
                  <List className="w-3.5 h-3.5 text-accent" />
                  Key Features
                </h4>
                <div
                  className="text-xs text-primary/80 font-sans leading-relaxed space-y-2 product-body-content"
                  dangerouslySetInnerHTML={{ __html: product.acf.key_features }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Full Width Section: Dynamic Configurator & Specifications */}
      <div className="max-w-6xl mx-auto px-6 mt-12 space-y-12 detail-fade-in">
        
        {/* Dynamic Configurator (Full Width) */}
        {product.acf?.configurator_fields && product.acf.configurator_fields.length > 0 && (
          <div className="bg-white border border-primary/5 p-8 md:p-10 rounded-3xl shadow-sm space-y-8 w-full">
            <div className="flex items-center gap-2 border-b border-primary/5 pb-4">
              <Sliders className="w-4 h-4 text-accent" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-primary">
                Bespoke Bow Configurator
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.acf.configurator_fields.map((field) => (
                <div key={field.field_id} className="space-y-3 bg-secondary/20 p-5 rounded-2xl border border-primary/5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-primary/70 font-sans">
                      {field.field_label}
                    </label>
                    <span className="text-[11px] font-bold text-accent font-serif bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                      {Array.isArray(selections[field.field_id])
                        ? selections[field.field_id].length > 0
                          ? selections[field.field_id].join(", ")
                          : "None Selected"
                        : selections[field.field_id] || "Pending Selection"}
                    </span>
                  </div>

                  {/* dropdown select */}
                  {field.field_type === "select" && field.field_options && (
                    <div className="relative">
                      <select
                        value={selections[field.field_id] || ""}
                        onChange={(e) => handleSelectionChange(field.field_id, e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-primary/10 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary cursor-pointer appearance-none shadow-sm"
                      >
                        {field.field_options.map((opt) => (
                          <option key={opt.option_value} value={opt.option_label}>
                            {opt.option_label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-primary/40 text-xs">
                        ▼
                      </div>
                    </div>
                  )}

                  {/* radio buttons */}
                  {field.field_type === "radio" && field.field_options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {field.field_options.map((opt) => (
                        <button
                          key={opt.option_value}
                          type="button"
                          onClick={() => handleSelectionChange(field.field_id, opt.option_label)}
                          className={`px-4 py-2.5 border rounded-xl text-left text-xs font-sans transition-all shadow-sm ${
                            selections[field.field_id] === opt.option_label
                              ? "border-accent bg-accent/5 ring-1 ring-accent text-primary font-semibold"
                              : "border-primary/5 hover:border-accent/20 text-primary/70 bg-white"
                          }`}
                        >
                          {opt.option_label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* checkbox group */}
                  {field.field_type === "checkbox" && field.field_options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {field.field_options.map((opt) => {
                        const isChecked = Array.isArray(selections[field.field_id]) && selections[field.field_id].includes(opt.option_label);
                        return (
                          <button
                            key={opt.option_value}
                            type="button"
                            onClick={() => handleCheckboxToggle(field.field_id, opt.option_label)}
                            className={`px-4 py-2.5 border rounded-xl text-left text-xs font-sans transition-all shadow-sm flex justify-between items-center ${
                              isChecked
                                ? "border-accent bg-accent/5 ring-1 ring-accent text-primary font-semibold"
                                : "border-primary/5 hover:border-accent/20 text-primary/70 bg-white"
                            }`}
                          >
                            <span>{opt.option_label}</span>
                            {isChecked && <span className="text-[10px] text-accent font-bold">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* range slider */}
                  {field.field_type === "range" && field.constraints && (
                    <div className="space-y-2 pt-2">
                      <input
                        type="range"
                        min={Number(field.constraints.min_val || 0)}
                        max={Number(field.constraints.max_val || 100)}
                        value={Number(selections[field.field_id] || field.constraints.min_val || 0)}
                        onChange={(e) => handleSelectionChange(field.field_id, Number(e.target.value))}
                        className="w-full h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                      <div className="flex justify-between text-[10px] text-primary/40 font-sans">
                        <span>Min: {field.constraints.min_val}</span>
                        <span>Max: {field.constraints.max_val}</span>
                      </div>
                    </div>
                  )}

                  {/* text input */}
                  {field.field_type === "text" && (
                    <input
                      type="text"
                      placeholder="Specify custom requirements..."
                      value={selections[field.field_id] || ""}
                      onChange={(e) => handleSelectionChange(field.field_id, e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-primary/10 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary shadow-sm"
                    />
                  )}

                  {/* number input */}
                  {field.field_type === "number" && (
                    <input
                      type="number"
                      min={Number(field.constraints?.min_val || "")}
                      max={Number(field.constraints?.max_val || "")}
                      placeholder={`Enter value...`}
                      value={selections[field.field_id] || ""}
                      onChange={(e) => handleSelectionChange(field.field_id, e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-4 py-2.5 bg-white border border-primary/10 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary shadow-sm"
                    />
                  )}

                  {/* file upload attachment */}
                  {field.field_type === "file" && (
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(field.field_id, e)}
                        className="hidden"
                        id={`file-input-${field.field_id}`}
                      />
                      <label
                        htmlFor={`file-input-${field.field_id}`}
                        className="w-full px-4 py-3 bg-white border border-dashed border-primary/20 rounded-xl font-sans text-xs text-primary/50 flex items-center justify-center gap-2 hover:border-accent/50 cursor-pointer shadow-sm"
                      >
                        <UploadCloud className="w-4 h-4 text-accent" />
                        <span>{uploadedFiles[field.field_id] || "Upload Specs Drawing (PDF, DXF)"}</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Configurator CTA banner box */}
            <div className="bg-[#0e3b2e] p-6 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner mt-8">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                  Build Configured
                </h4>
                <p className="text-xs text-white/70 font-sans leading-relaxed">
                  Submit your custom overlay &amp; wood specs to our master bowyers for build queue slot authorization.
                </p>
              </div>
              <button
                onClick={openConfigurationInquiry}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-primary font-serif font-bold text-xs tracking-widest uppercase rounded-full hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
              >
                Request Bespoke Quote
              </button>
            </div>
          </div>
        )}

        {/* Technical Specifications (Full Width) */}
        {product.acf?.specifications && product.acf.specifications.length > 0 && (
          <div className="bg-white border border-primary/5 p-8 md:p-10 rounded-3xl shadow-sm space-y-6 w-full">
            <h4 className="text-xs uppercase tracking-widest text-[#5c4629] font-serif font-bold border-b border-primary/5 pb-2">
              Technical Specifications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {product.acf.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-3 px-4 border border-primary/10 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-all duration-300 font-sans shadow-sm">
                  <span className="text-primary/50 font-medium">{spec.label}</span>
                  <span className="text-primary font-bold text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Storytelling Narrative Sections (Lineage & Reliability) */}
      {(product.acf?.lineage_content || product.acf?.reliability_content) && (
        <div className={`max-w-6xl mx-auto px-6 mt-12 detail-fade-in ${
          product.acf?.lineage_content && product.acf?.reliability_content
            ? "grid grid-cols-1 md:grid-cols-2 gap-8"
            : "w-full"
        }`}>
          {product.acf?.lineage_content && (
            <div className="bg-[#0e3b2e] text-white p-8 rounded-3xl shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(197,168,128,0.06),transparent_60%)] pointer-events-none" />
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Award className="w-4 h-4 text-accent" />
                <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-accent">
                  Design Lineage
                </h4>
              </div>
              <div
                className="text-xs text-white/70 font-sans leading-relaxed space-y-2"
                dangerouslySetInnerHTML={{ __html: product.acf.lineage_content }}
              />
            </div>
          )}

          {product.acf?.reliability_content && (
            <div className="bg-white border border-primary/5 p-8 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-primary/5 pb-3">
                <Shield className="w-4 h-4 text-accent" />
                <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-[#5c4629]">
                  Craft Reliability
                </h4>
              </div>
              <div
                className="text-xs text-primary/75 font-sans leading-relaxed space-y-2"
                dangerouslySetInnerHTML={{ __html: product.acf.reliability_content }}
              />
            </div>
          )}
        </div>
      )}

      {/* 5. Consultation Inquiry Section */}
      <div id="inquiry-section" className="max-w-6xl mx-auto px-6 mt-12 detail-fade-in">
        {showInquiryForm && (
          <div className="bg-white border border-primary/5 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
            {/* Banner info column */}
            <div className="lg:col-span-5 bg-[#0e3b2e] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,168,128,0.08),transparent_65%)] pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] font-serif uppercase tracking-widest text-accent font-bold">
                  Bespoke Consultation
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                  Connect With Our Bowyers
                </h3>
                <p className="text-xs text-white/70 font-sans leading-relaxed">
                  Your specifications will be sent directly to the bowyer's workshop. We will verify queue sizing, overlay compatibilities, and get back to you with custom quote details.
                </p>
              </div>

              <div className="space-y-3 pt-8 relative z-10 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-sans text-white/80">
                  <Calendar className="w-4 h-4 text-accent shrink-0" />
                  <span>Build time: {product.acf?.delivery_time || "Contact for details"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-white/80">
                  <Shield className="w-4 h-4 text-accent shrink-0" />
                  <span>Warranty: Premium structural warranty</span>
                </div>
              </div>
            </div>

            {/* Form column */}
            <div className="lg:col-span-7 p-8 md:p-12">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-lg font-bold text-primary uppercase tracking-wider">
                      Consultation Request Sent
                    </h4>
                    <p className="text-xs text-primary/65 font-sans max-w-sm leading-relaxed">
                      Thank you. Your configuration parameters have been submitted. An academy coordinator will contact you shortly.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setShowInquiryForm(false);
                    }}
                    variant="primary"
                  >
                    Close Panel
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-secondary/40 border border-primary/5 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary"
                      />
                      {errors.fullName && <p className="text-[10px] text-red-500 font-sans">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-secondary/40 border border-primary/5 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary"
                      />
                      {errors.email && <p className="text-[10px] text-red-500 font-sans">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-secondary/40 border border-primary/5 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary"
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 font-sans">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                      Customization Notes &amp; Message
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-secondary/40 border border-primary/5 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary resize-none"
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
    </div>
  );
};

const BowyerProductPage = () => {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-secondary flex items-center justify-center">
        <span className="font-serif text-sm tracking-widest uppercase text-primary/50 animate-pulse">Loading Custom Bow Details...</span>
      </div>
    }>
      <BowyerProductContent />
    </Suspense>
  );
};

export default BowyerProductPage;
