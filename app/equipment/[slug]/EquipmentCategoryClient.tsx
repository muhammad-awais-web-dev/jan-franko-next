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
          font-size: 0.875rem;
          line-height: 1.7;
          color: rgba(14, 59, 46, 0.85);
          margin-bottom: 1rem;
        }
        .product-body-content ul, .product-body-content ol {
          margin-[#0e3b2e] 1rem 0;
          padding-left: 1.5rem;
          font-family: var(--font-sans), sans-serif;
          font-size: 0.875rem;
          color: rgba(14, 59, 46, 0.85);
        }
        .product-body-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        .product-body-content strong {
          color: #0e3b2e;
          font-weight: 600;
        }
      `}} />

      {/* Back to Catalog Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-4">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-[#5c4629] hover:text-primary transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Equipment Catalog
        </Link>
      </div>

      {/* Top Main Section: Image Showcase (Left) vs Product Highlights (Right) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        
        {/* Left Column: Main Hero Image + Interactive Gallery Thumbnails */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Active Image View */}
          <div className="detail-fade-in relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-primary/10 bg-primary/5 shadow-lg group">
            <img
              src={activeImage}
              alt={cleanTitle(product.title)}
              className="w-full h-full object-cover"
            />
            
            {/* Expand / Lightbox Trigger Button */}
            <button
              onClick={() => setLightboxImage(activeImage)}
              className="absolute bottom-4 right-4 p-2.5 bg-primary/80 hover:bg-primary text-secondary rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer"
              title="Expand Image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Gallery Thumbnails List */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="detail-fade-in flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.gallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImage === imgUrl
                      ? "border-accent scale-105 shadow-md"
                      : "border-primary/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Gallery ${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Equipment Compliance Badge Card */}
          <div className="detail-fade-in bg-white border border-primary/5 p-6 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#7d603a] uppercase tracking-widest">
              <Shield className="w-4 h-4 text-accent" />
              Verified Equipment Standard
            </div>
            <p className="text-xs text-primary/75 font-sans leading-relaxed">
              All equipment listings are verified for historical and functional accuracy. Consultation inquiries ensure custom sizing, draw weight alignment, and safe dispatch parameters.
            </p>
          </div>
        </div>

        {/* Right Column: Title, Subtitle, Pricing / Status, Quick Action, Specifications Summary */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Header Info */}
          <div className="detail-fade-in space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#c5a880]/15 border border-[#c5a880]/30 rounded-full text-[10px] font-serif font-bold tracking-widest text-[#5c4629] uppercase">
                {cleanTitle(parentLabel)}
              </span>
              <span className="text-[10px] font-serif tracking-widest text-primary/40 uppercase">
                • {cleanTitle(brandLabel)}
              </span>
            </div>

            <h1 className="notranslate text-3xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-tight" translate="no">
              {cleanTitle(product.title)}
            </h1>
          </div>

          <div className="w-full h-[1px] bg-primary/10" />

          {/* Pricing & Inquiry Action Bar */}
          <div className="detail-fade-in bg-white border border-primary/5 p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-serif uppercase tracking-widest text-primary/60 font-bold">
                Acquisition Format
              </span>
              <span className="font-serif font-bold text-lg text-accent">
                Inquiry &amp; Consultation
              </span>
            </div>
            <p className="text-xs text-primary/75 font-sans leading-relaxed">
              Equip your setup through direct consultation. Submit your custom draw weight, arrow spine specifications, or delivery location for specialized pricing and availability.
            </p>

            <button
              onClick={() => setShowInquiryForm(true)}
              className="w-full py-3.5 bg-[#0e3b2e] hover:bg-[#0e3b2e]/90 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-accent" />
              Request Specification &amp; Order Inquiry
            </button>
          </div>

          {/* Parsed Technical Specifications Table (From WP html table) */}
          {specifications.length > 0 && (
            <div className="detail-fade-in space-y-3">
              <h3 className="text-xs font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                Technical Specifications
              </h3>
              <div className="bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-primary/5">
                  {specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-2 p-3.5 text-xs font-sans hover:bg-secondary/40 transition-colors">
                      <span className="font-bold text-primary/70">{spec.label}</span>
                      <span className="text-primary font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Body Content Description */}
          {parsedContent && (
            <div className="detail-fade-in space-y-3 pt-2">
              <h3 className="text-xs font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                Detailed Product Overview
              </h3>
              <div
                className="product-body-content bg-white/60 border border-primary/5 p-6 rounded-2xl"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Related Equipment Showcase */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 space-y-8 border-t border-primary/10 mt-20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold block">
                Complementary Gear
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-primary tracking-tight">
                Related Equipment
              </h3>
            </div>
            <Link
              href="/equipment"
              className="text-xs font-serif uppercase tracking-widest text-accent hover:text-primary transition-colors font-bold"
            >
              View Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/equipment/${rel.slug}`}
                className="group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300 flex flex-col h-[360px] cursor-pointer"
              >
                <div className="relative w-full h-[180px] bg-primary/10 overflow-hidden">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="notranslate text-base font-serif font-bold text-primary group-hover:text-accent transition-colors line-clamp-1" translate="no">
                      {cleanTitle(rel.title)}
                    </h4>
                    <p className="text-xs text-primary/70 line-clamp-2 font-sans">
                      {cleanExcerpt(rel.excerpt)}
                    </p>
                  </div>
                  <div className="text-[10px] font-serif uppercase tracking-widest font-bold text-accent group-hover:translate-x-1 transition-transform">
                    Inspect Gear →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Fullscreen Image View Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={lightboxImage}
              alt="Expanded View"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 rounded-full cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Specification & Order Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-secondary border border-primary/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-accent font-bold block">
                  Equipment Inquiry
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
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-primary">Inquiry Submitted</h4>
                <p className="text-xs font-sans text-primary/80 leading-relaxed">
                  Thank you! Your specification inquiry for <strong className="notranslate" translate="no">{cleanTitle(product.title)}</strong> has been recorded. Our team will review your parameters and respond with acquisition details.
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
                
                <div className="space-y-1">
                  <label className="text-[10px] font-serif uppercase tracking-wider text-primary/70 font-bold block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-wider text-primary/70 font-bold block">
                      Quantity
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary"
                    >
                      <option value="1">1 Unit</option>
                      <option value="2">2 Units</option>
                      <option value="5+">5+ Bulk Order</option>
                      <option value="Team Bundle">Academy / Team Set</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-serif uppercase tracking-wider text-primary/70 font-bold block">
                      Destination Country
                    </label>
                    <input
                      type="text"
                      value={shippingDestination}
                      onChange={(e) => setShippingDestination(e.target.value)}
                      placeholder="e.g. Austria, Slovakia, Germany"
                      className="w-full px-4 py-2.5 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-serif uppercase tracking-wider text-primary/70 font-bold block">
                    Custom Specifications
                  </label>
                  <input
                    type="text"
                    value={specificationsReq}
                    onChange={(e) => setSpecificationsReq(e.target.value)}
                    placeholder="Specify draw weight, spine, length, or sizing requirements..."
                    className="w-full px-4 py-2.5 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-serif uppercase tracking-wider text-primary/70 font-bold block">
                    Inquiry Message &amp; Questions *
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your intended use, timeline, or questions..."
                    className="w-full px-4 py-3 bg-secondary/40 border border-primary/15 rounded-xl font-sans text-xs focus:ring-1 focus:ring-accent focus:border-accent outline-none text-primary resize-none"
                  />
                  {errors.message && <p className="text-[10px] text-red-500 font-sans">{errors.message}</p>}
                </div>

                {/* Privacy Policy Consent Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="equipment-privacy-consent"
                    required
                    className="mt-0.5 w-4 h-4 rounded border-primary/10 bg-secondary/40 text-[#0e3b2e] focus:ring-1 focus:ring-accent cursor-pointer shrink-0"
                  />
                  <label htmlFor="equipment-privacy-consent" className="text-[11px] text-primary/75 font-sans leading-snug cursor-pointer select-none">
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
                    Submit Equipment Inquiry
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

export default function EquipmentCategoryClient() {
  return <ProductDetailPage />;
}
