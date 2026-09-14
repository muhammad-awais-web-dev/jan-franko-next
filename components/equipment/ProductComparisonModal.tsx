"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowUpRight, Scale } from "lucide-react";
import { cleanTitle } from "@/lib/text";

export interface ComparisonProduct {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  categoriesLabel?: string;
  brandLabel?: string;
  priceLabel?: string;
}

interface ProductComparisonModalProps {
  selectedProducts: ComparisonProduct[];
  onRemoveProduct: (productId: number) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductComparisonModal({
  selectedProducts,
  onRemoveProduct,
  onClearAll,
  isOpen,
  onClose,
}: ProductComparisonModalProps) {
  if (!isOpen || selectedProducts.length === 0) return null;

  // Clean excerpt for table view
  const formatExcerpt = (rawHtml: string) => {
    const textOnly = rawHtml.replace(/<[^>]*>/g, "");
    return textOnly.length > 120 ? textOnly.slice(0, 120) + "..." : textOnly;
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto select-text animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white text-primary rounded-3xl max-w-5xl w-full p-6 md:p-10 shadow-2xl space-y-6 my-auto overflow-hidden border border-primary/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-primary/10 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#0e3b2e]/10 flex items-center justify-center text-[#0e3b2e]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary">
                Product Comparison
              </h2>
              <p className="text-xs text-primary/70 font-sans">
                Comparing {selectedProducts.length} selected equipment items
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 flex items-center justify-center text-primary transition-colors cursor-pointer"
            aria-label="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[650px]">
            {/* 1. Header Cards Row (Images + Titles + View Details) */}
            <div
              className="grid gap-6 border-b border-primary/10 pb-6"
              style={{
                gridTemplateColumns: `180px repeat(${selectedProducts.length}, minmax(0, 1fr))`,
              }}
            >
              <div className="flex flex-col justify-end">
                <span className="text-xs font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                  Equipment Item
                </span>
              </div>

              {selectedProducts.map((prod) => (
                <div key={prod.id} className="space-y-3 flex flex-col items-center text-center relative group">
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveProduct(prod.id)}
                    className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-white hover:bg-red-500 hover:text-white border border-primary/15 flex items-center justify-center text-primary/70 transition-all shadow-md cursor-pointer"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Thumbnail */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-primary/5 border border-primary/10 shadow-sm">
                    <Image
                      src={prod.image}
                      alt={cleanTitle(prod.title)}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-serif font-bold text-primary leading-snug line-clamp-2 min-h-[2.5rem]">
                    {cleanTitle(prod.title)}
                  </h4>

                  {/* View Details Button */}
                  <Link
                    href={`/equipment/${prod.slug}`}
                    onClick={onClose}
                    className="w-full py-2.5 px-4 bg-[#0e3b2e] hover:bg-[#0e3b2e]/90 text-white rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                  </Link>
                </div>
              ))}
            </div>

            {/* 2. Description Row */}
            <div
              className="grid gap-6 py-4 border-b border-primary/10 text-xs"
              style={{
                gridTemplateColumns: `180px repeat(${selectedProducts.length}, minmax(0, 1fr))`,
              }}
            >
              <div className="font-serif font-bold text-[#5c4629] uppercase tracking-wider">
                Description &amp; Specs
              </div>
              {selectedProducts.map((prod) => (
                <div key={prod.id} className="text-primary/80 font-sans leading-relaxed">
                  {formatExcerpt(prod.excerpt || prod.content)}
                </div>
              ))}
            </div>

            {/* 3. Category / Type Row */}
            <div
              className="grid gap-6 py-4 border-b border-primary/10 text-xs"
              style={{
                gridTemplateColumns: `180px repeat(${selectedProducts.length}, minmax(0, 1fr))`,
              }}
            >
              <div className="font-serif font-bold text-[#5c4629] uppercase tracking-wider">
                Category / Type
              </div>
              {selectedProducts.map((prod) => (
                <div key={prod.id} className="font-semibold text-primary">
                  {cleanTitle(prod.categoriesLabel || "Equipment")}
                </div>
              ))}
            </div>

            {/* 4. Brand / Guild Row */}
            <div
              className="grid gap-6 py-4 border-b border-primary/10 text-xs"
              style={{
                gridTemplateColumns: `180px repeat(${selectedProducts.length}, minmax(0, 1fr))`,
              }}
            >
              <div className="font-serif font-bold text-[#5c4629] uppercase tracking-wider">
                Master Bowyer / Craft
              </div>
              {selectedProducts.map((prod) => (
                <div key={prod.id} className="font-semibold text-primary">
                  {cleanTitle(prod.brandLabel || "Jan Franko Academy Guild")}
                </div>
              ))}
            </div>

            {/* 5. Acquisition Format / Price */}
            <div
              className="grid gap-6 py-4 text-xs"
              style={{
                gridTemplateColumns: `180px repeat(${selectedProducts.length}, minmax(0, 1fr))`,
              }}
            >
              <div className="font-serif font-bold text-[#5c4629] uppercase tracking-wider">
                Acquisition
              </div>
              {selectedProducts.map((prod) => (
                <div key={prod.id} className="font-serif font-bold text-accent">
                  {prod.priceLabel || "Custom Consultation & Inquiry"}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-primary/10">
          <button
            onClick={onClearAll}
            className="text-xs font-serif font-bold text-primary/60 hover:text-red-600 underline cursor-pointer transition-colors"
          >
            Clear Comparison Selection
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-primary text-secondary rounded-xl font-serif font-bold text-xs uppercase tracking-wider hover:bg-primary/90 cursor-pointer transition-colors"
          >
            Back to Armory
          </button>
        </div>
      </div>
    </div>
  );
}

/** Floating bottom comparison bar */
export function FloatingCompareBar({
  selectedProducts,
  onRemoveProduct,
  onClearAll,
  onOpenModal,
}: {
  selectedProducts: ComparisonProduct[];
  onRemoveProduct: (productId: number) => void;
  onClearAll: () => void;
  onOpenModal: () => void;
}) {
  if (selectedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-lg border border-primary/15 p-3.5 px-6 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom duration-300 max-w-full overflow-x-auto">
      {/* Product Thumbnails */}
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((idx) => {
          const prod = selectedProducts[idx];
          return (
            <div
              key={idx}
              className={`relative w-12 h-12 rounded-xl overflow-hidden border flex items-center justify-center transition-all ${
                prod
                  ? "bg-primary/5 border-primary/20 shadow-xs"
                  : "bg-secondary border-dashed border-primary/20 opacity-40"
              }`}
            >
              {prod ? (
                <>
                  <Image
                    src={prod.image}
                    alt={cleanTitle(prod.title)}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveProduct(prod.id);
                    }}
                    className="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <span className="text-[10px] text-primary/40 font-mono">+</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Label */}
      <span className="text-xs font-serif font-bold text-primary whitespace-nowrap">
        Compare ({selectedProducts.length}/3)
      </span>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenModal}
          className="px-5 py-2.5 bg-black hover:bg-black/90 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
        >
          Compare
        </button>

        <button
          onClick={onClearAll}
          className="text-xs font-serif font-bold text-primary/70 hover:text-primary underline cursor-pointer transition-colors whitespace-nowrap"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
