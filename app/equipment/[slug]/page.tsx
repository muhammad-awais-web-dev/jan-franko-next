"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Compass, Shield, ChevronLeft, ArrowRight, CheckCircle2, Maximize2, X } from "lucide-react";
import { Button } from "@/components/Button";

interface Product {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  gallery?: string[];
  categories: number[];
  brands: number[];
}

interface CategoryTerm {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

interface SpecRow {
  label: string;
  value: string;
}

const ProductDetailPage = () => {
  const { slug } = useParams();

  // Detail States
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryTerm[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [parsedContent, setParsedContent] = useState("");
  const [specifications, setSpecifications] = useState<SpecRow[]>([]);

  // Inquiry Form States
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [specificationsReq, setSpecificationsReq] = useState("");
  const [shippingDestination, setShippingDestination] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch product on mount
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/equipment/products"),
          fetch("/api/equipment/categories")
        ]);
        if (prodRes.ok && catRes.ok) {
          const prods: Product[] = await prodRes.json();
          const cats: CategoryTerm[] = await catRes.json();
          setCategories(cats);
          setAllProducts(prods);

          const found = prods.find((p) => p.slug === slug);
          if (found) {
            setProduct(found);
            setActiveImage(found.gallery?.[0] || found.image);
            
            // Parse content to extract specifications table
            if (typeof window !== "undefined") {
              const parser = new DOMParser();
              const doc = parser.parseFromString(found.content, "text/html");
              const table = doc.querySelector("table");
              const specs: SpecRow[] = [];
              
              if (table) {
                table.querySelectorAll("tbody tr").forEach((row) => {
                  const cells = row.querySelectorAll("td");
                  if (cells.length >= 2) {
                    specs.push({
                      label: cells[0].textContent?.trim() || "",
                      value: cells[1].textContent?.trim() || ""
                    });
                  }
                });
                table.remove();
                
                // Also remove specification headers
                const specHeader = Array.from(doc.querySelectorAll("h3, h4")).find(
                  (h) => h.textContent?.includes("Specification")
                );
                if (specHeader) specHeader.remove();
              }
              
              setSpecifications(specs);
              setParsedContent(doc.body.innerHTML);
            } else {
              setParsedContent(found.content);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  // GSAP Entrance Stagger when product loads
  useEffect(() => {
    if (loading || !product) return;

    // Reset view states when slug changes
    setShowInquiryForm(false);
    setSubmitted(false);

    gsap.fromTo(
      ".detail-fade-in",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out", overwrite: "auto" }
    );
  }, [loading, slug, product]);

  // Form Submission
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!email.trim() || !email.includes("@")) newErrors.email = "Valid Email is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!message.trim()) newErrors.message = "Inquiry message text is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      await fetch("/api/forms/equipment-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_url: typeof window !== "undefined" ? window.location.href : `/equipment/${slug}`,
          fields: {
            product_name: product?.title || slug,
            full_name: fullName,
            email: email,
            phone: phone,
            quantity: quantity,
            custom_specifications: specificationsReq || "Standard Specification",
            shipping_destination: shippingDestination || "Not specified",
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

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-secondary flex items-center justify-center">
        <span className="font-serif text-sm tracking-widest uppercase text-primary/50 animate-pulse">Loading Product...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-secondary flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-primary">Gear Not Found</h2>
        <Button href="/equipment" variant="accent">Back to Catalog</Button>
      </div>
    );
  }

  // Resolve taxonomy labels
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
    : "Bespoke Bowyer";

  // HTML entity cleanup helpers
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

  // Resolve Related Products (matching same category, up to 3 items)
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.categories.some((catId) => product.categories.includes(catId))
    )
    .slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative pb-24">
      {/* CSS Overrides for WordPress Body Typography */}
      <style dangerouslySetInnerHTML={{ __html: `
        .product-body-content h3 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0e3b2e;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .product-body-content h4 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #7d603a;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .product-body-content p {
          font-family: var(--font-sans), sans-serif;
          font-size: 0.95rem;
          color: rgba(15, 23, 42, 0.85);
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        .product-body-content ul {
          padding-left: 1.25rem;
          margin-bottom: 1rem;
          list-style-type: disc;
        }
        .product-body-content li {
          font-family: var(--font-sans), sans-serif;
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
          color: rgba(15, 23, 42, 0.85);
        }
        .product-body-content blockquote {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 1.05rem;
          font-style: italic;
          color: #7d603a;
          border-left: 2px solid #c5a880;
          padding-left: 1rem;
          margin: 1.5rem 0;
          line-height: 1.6;
        }
      ` }} />

      {/* 1. Navigation Breadcrumb Banner */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between text-xs font-serif uppercase tracking-widest text-[#7d603a] font-bold">
        <Link href="/equipment" className="flex items-center gap-1.5 hover:text-[#0e3b2e] transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
        <span className="hidden sm:inline text-primary/40 font-sans normal-case">
          Equipment / {cleanTitle(parentLabel)} / {cleanTitle(product.title)}
        </span>
      </div>

      {/* 2. Main Detail Page Grid */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
        
        {/* Left Side (40%): Big Product Image & Specifications */}
        <div className="lg:col-span-5 space-y-8 detail-fade-in">
          {/* Main Product Image */}
          <div className="relative aspect-square w-full bg-white border border-primary/5 rounded-3xl overflow-hidden shadow-sm group">
            <Image
              src={activeImage || product.image}
              alt={product.title}
              fill
              priority
              sizes="(max-w-768px) 100vw, 500px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Zoom / Fullscreen Button Overlay */}
            <button
              type="button"
              onClick={() => setLightboxImage(activeImage || product.image)}
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white p-2.5 rounded-full transition-all cursor-pointer shadow-md opacity-80 hover:opacity-100"
              title="Expand image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Gallery Thumbnails Row */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#7d603a] font-serif font-bold px-1">
                <span>Product Gallery ({product.gallery.length} Photos)</span>
                <span className="text-primary/40 font-sans normal-case">Click to view</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {product.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-20 bg-white border rounded-2xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                      (activeImage || product.image) === imgUrl
                        ? "border-accent ring-2 ring-accent/40 shadow-sm opacity-100 scale-105"
                        : "border-primary/5 hover:border-accent/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.title} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specifications Table Card */}
          {specifications.length > 0 && (
            <div className="bg-white border border-primary/5 p-6 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-serif font-bold border-b border-primary/5 pb-2">
                Technical Specifications
              </h4>
              <div className="divide-y divide-primary/5 text-xs">
                {specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between py-2.5 font-sans">
                    <span className="text-primary/50 font-medium">{spec.label}</span>
                    <span className="text-primary font-semibold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side (60%): Description & Consultation inquiry form */}
        <div className="lg:col-span-7 space-y-8 detail-fade-in">
          
          {/* Title & Brand Header */}
          <div className="bg-white border border-primary/5 p-8 rounded-3xl shadow-sm space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#7d603a] font-serif font-bold">
              {cleanTitle(brandLabel)}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary tracking-tight leading-tight">
              {cleanTitle(product.title)}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-primary/50 font-sans">
              <span className="flex items-center gap-1">
                <Compass className="w-4 h-4 text-accent" />
                Handcrafted Traditional Gear
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-accent" />
                Consultation Request Only
              </span>
            </div>
          </div>

          {/* Inquiry Form or Details Panel */}
          {!showInquiryForm ? (
            <div className="bg-white border border-primary/5 p-8 md:p-12 rounded-3xl shadow-sm space-y-8">
              
              {/* Prominent Interactive Order & Inquiry CTA Card */}
              <div 
                onClick={() => {
                  setShowInquiryForm(true);
                  if (!message) {
                    setMessage(`I would like to inquire about ordering the "${cleanTitle(product.title)}" and would appreciate more details on availability and current lead times.`);
                  }
                }}
                className="group relative bg-[#0e3b2e] p-6 sm:p-8 rounded-3xl text-white border border-accent/30 hover:border-accent shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden space-y-4"
              >
                {/* Background ambient radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,168,128,0.12),transparent_65%)] pointer-events-none" />

                {/* Title & Description Content */}
                <div className="relative z-10 space-y-2">
                  <h4 className="font-serif text-xl font-bold text-white tracking-tight group-hover:text-accent transition-colors">
                    Inquire &amp; Order Gear
                  </h4>
                  <p className="text-xs text-white/75 font-sans leading-relaxed">
                    Contact our academy craft coordinators to discuss sizing, spine weights, lead times, or custom specifications.
                  </p>
                </div>

                {/* Prominent Action Button */}
                <div className="relative z-10 pt-2">
                  <button
                    type="button"
                    className="w-full py-3 bg-accent hover:bg-accent/90 text-primary font-serif font-bold text-xs tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group-hover:scale-[1.01] cursor-pointer"
                  >
                    <span>Request Details &amp; Custom Quote</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

              {/* Description Body */}
              <div 
                className="product-body-content text-slate-800 leading-relaxed font-sans text-sm md:text-base space-y-6"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            </div>
          ) : (
            // Equipment Product Inquiry Contact Form
            <div className="bg-white border border-primary/5 p-8 md:p-10 rounded-3xl shadow-sm space-y-6">
              {!submitted ? (
                <form onSubmit={handleSubmitInquiry} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-primary/5 pb-3">
                    <div>
                      <span className="text-[10px] font-serif uppercase tracking-widest text-[#7d603a] font-bold block">
                        Equipment Inquiry Form
                      </span>
                      <h3 className="text-lg font-serif font-bold text-primary">
                        Inquire About: {cleanTitle(product.title)}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowInquiryForm(false)}
                      className="text-xs font-serif font-bold tracking-widest uppercase text-primary/40 hover:text-primary transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className={`w-full bg-secondary text-primary border rounded-xl p-2.5 text-xs outline-none focus:border-accent ${
                        errors.fullName ? "border-red-500" : "border-primary/10"
                      }`}
                    />
                    {errors.fullName && <span className="text-[10px] text-red-500 font-sans">{errors.fullName}</span>}
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className={`w-full bg-secondary text-primary border rounded-xl p-2.5 text-xs outline-none focus:border-accent ${
                          errors.email ? "border-red-500" : "border-primary/10"
                        }`}
                      />
                      {errors.email && <span className="text-[10px] text-red-500 font-sans">{errors.email}</span>}
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+43 ... or phone number"
                        className={`w-full bg-secondary text-primary border rounded-xl p-2.5 text-xs outline-none focus:border-accent ${
                          errors.phone ? "border-red-500" : "border-primary/10"
                        }`}
                      />
                      {errors.phone && <span className="text-[10px] text-red-500 font-sans">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Quantity & Custom Specifications / Sizing */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1 sm:col-span-1">
                      <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Quantity</label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full bg-secondary text-primary border border-primary/10 rounded-xl p-2.5 text-xs outline-none focus:border-accent cursor-pointer"
                      >
                        <option value="1">1 Unit</option>
                        <option value="2">2 Units</option>
                        <option value="3">3 Units</option>
                        <option value="4">4 Units</option>
                        <option value="5+">5+ Units (Bulk/Group)</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1 sm:col-span-2">
                      <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Sizing / Spine / Variant Request</label>
                      <input
                        type="text"
                        value={specificationsReq}
                        onChange={(e) => setSpecificationsReq(e.target.value)}
                        placeholder="e.g. 500 Spine, 30 inch, Medium, RH"
                        className="w-full bg-secondary text-primary border border-primary/10 rounded-xl p-2.5 text-xs outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  {/* Shipping Destination */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Shipping Destination / Country</label>
                    <input
                      type="text"
                      value={shippingDestination}
                      onChange={(e) => setShippingDestination(e.target.value)}
                      placeholder="e.g. Austria, Germany, USA, Slovakia"
                      className="w-full bg-secondary text-primary border border-primary/10 rounded-xl p-2.5 text-xs outline-none focus:border-accent"
                    />
                  </div>

                  {/* Inquiry Message */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Inquiry Details / Message *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className={`w-full bg-secondary text-primary border rounded-xl p-2.5 text-xs outline-none focus:border-accent resize-none ${
                        errors.message ? "border-red-500" : "border-primary/10"
                      }`}
                    />
                    {errors.message && <span className="text-[10px] text-red-500 font-sans">{errors.message}</span>}
                  </div>

                  {/* Privacy Policy Consent Checkbox */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="eq-privacy-consent"
                      required
                      className="mt-0.5 w-4 h-4 rounded border-primary/20 bg-secondary text-primary focus:ring-1 focus:ring-accent cursor-pointer shrink-0"
                    />
                    <label htmlFor="eq-privacy-consent" className="text-[11px] text-primary/75 font-sans leading-snug cursor-pointer select-none">
                      I agree to the processing of my personal data in accordance with the{" "}
                      <Link href="/privacy-policy" target="_blank" className="text-accent underline font-semibold hover:text-primary transition-colors">
                        Privacy Policy
                      </Link>
                      . *
                    </label>
                  </div>

                  {/* Submit Controls */}
                  <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                    <button
                      type="button"
                      onClick={() => setShowInquiryForm(false)}
                      className="text-xs font-serif font-bold tracking-widest uppercase text-primary/40 hover:text-primary transition-colors cursor-pointer"
                    >
                      Back to Specs
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#0e3b2e] hover:bg-[#0e3b2e]/90 text-white font-serif font-bold text-xs tracking-widest uppercase rounded-full hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      Submit Equipment Inquiry
                      <ArrowRight className="w-3.5 h-3.5 text-accent" />
                    </button>
                  </div>
                </form>
              ) : (
                // Submit confirmation screen
                <div className="text-center py-10 space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-accent animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-bold text-primary">Inquiry Sent</h3>
                    <p className="text-sm text-primary/80 font-sans max-w-md mx-auto leading-relaxed">
                      Thank you, {fullName}. We have received your inquiry regarding the {cleanTitle(product.title)}. Our craft coordinators will reach out to you within 48 hours for consultation.
                    </p>
                  </div>
                  <div className="pt-4 flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setShowInquiryForm(false);
                        setSubmitted(false);
                      }}
                      className="px-6 py-2.5 bg-primary text-secondary font-serif font-bold text-xs tracking-widest uppercase rounded-full hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      Return to Details
                    </button>
                    <Link
                      href="/equipment"
                      className="px-6 py-2.5 border border-primary/20 hover:border-primary text-primary font-serif font-bold text-xs tracking-widest uppercase rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer inline-block"
                    >
                      Armory Catalog
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* 3. Related Products Section (Bottom) */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-20 border-t border-primary/10 pt-16 space-y-8 detail-fade-in">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#7d603a] font-serif font-bold">
              Complete your Set
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-primary">
              Related Equipment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((p) => {
              // Resolve category labels
              const relParentId = p.categories.find(
                (id) => categories.find((c) => c.id === id)?.parent === 0
              );
              const relParentLabel = relParentId
                ? categories.find((c) => c.id === relParentId)?.name
                : "Equipment";

              const relBrandId = p.categories.find(
                (id) => categories.find((c) => c.id === id)?.parent === 114
              );
              const relBrandLabel = relBrandId
                ? categories.find((c) => c.id === relBrandId)?.name
                : null;

              return (
                <Link
                  key={p.slug}
                  href={`/equipment/${p.slug}`}
                  className="group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-[380px] cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-[180px] bg-primary/10 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Body details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1 text-[9px] text-[#7d603a] font-serif uppercase tracking-widest font-bold">
                        <span>{cleanTitle(relParentLabel)}</span>
                        {relBrandLabel && (
                          <>
                            <span className="text-primary/30 font-sans">•</span>
                            <span>{cleanTitle(relBrandLabel)}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-base font-serif font-bold text-primary group-hover:text-accent transition-colors duration-300 line-clamp-1">
                        {cleanTitle(p.title)}
                      </h3>
                      <p className="text-xs text-primary/75 leading-relaxed font-sans line-clamp-2">
                        {cleanExcerpt(p.excerpt)}
                      </p>
                    </div>

                    <div className="border-t border-primary/5 pt-3.5 flex items-center justify-between text-[10px] font-serif uppercase tracking-widest font-bold text-accent group-hover:translate-x-1 transition-transform duration-300">
                      <span>Inspect Specs</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal for Fullscreen Gallery View */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white p-3 hover:text-accent transition-colors cursor-pointer"
            aria-label="Close fullscreen view"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen View"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
