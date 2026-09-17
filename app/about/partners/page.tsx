import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Shield, Star, Award } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = constructMetadata({
  title: "Master Bowyers & Partners | Traditional Archery - Jan Franko",
  description: "Partnering with independent master bowyers and traditional archery craftsmen globally. Discover our artisan network dedicated to authentic bowmaking.",
  canonicalUrl: "https://janfranko.com/about/partners",
});

interface StaticBowyerCard {
  slug: string;
  name: string;
  craftsman: string;
  excerpt: string;
  image: string;
  href: string;
}

const MASTER_BOWYERS_STATIC: StaticBowyerCard[] = [
  {
    slug: "harvey-archery",
    name: "Harvey Archery",
    craftsman: "Warrick Harvey",
    excerpt:
      "Custom laminated longbows handcrafted on the family farm in South Africa. Blending spalted bamboo cores with exotic burl hardwoods and natural horn overlays.",
    image:
      "https://janfranko.com/wp-content/uploads/2026/04/Harvey-Archery-Taking-Shot.jpg",
    href: "/bowyer/harvey-archery",
  },
  {
    slug: "mr-bows",
    name: "MR Bows",
    craftsman: "Miško Rovčanin",
    excerpt:
      "Fiberglass-laminated traditional composite bows made in Serbia for recreation, physical & mental development, competition, and historical practice.",
    image:
      "https://janfranko.com/wp-content/uploads/2026/04/16864081_1249414485136489_6658590496747384211_n.jpg",
    href: "/bowyer/mr-bows",
  },
  {
    slug: "kadys-bows",
    name: "Kadys Bows",
    craftsman: "Sergey Tolochko",
    excerpt:
      "Handcrafted traditional hunting and competition recurves and longbows founded by Sergey Tolochko, trusted by archers across Europe, Asia, and North America.",
    image:
      "https://janfranko.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-12-at-11.23.29-PM.jpeg",
    href: "/bowyer/kadys-bows",
  },
];

export default function PartnersPage() {
  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative">
      {/* Hero Header Section */}
      <div className="relative w-full bg-[#0e3b2e] text-white py-20 md:py-24 px-6 overflow-hidden flex flex-col items-center justify-center border-b border-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.12),transparent_70%)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(14,59,46,0.5))] z-0" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-full text-[10px] md:text-xs font-serif font-semibold tracking-widest uppercase text-accent">
            Master Craftsmanship &amp; Partnerships
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
            Partners &amp; Master Bowyers
          </h1>
          <p className="text-sm md:text-base text-white/80 font-normal max-w-2xl mx-auto leading-relaxed font-sans">
            Collaborating directly with independent master craftsmen to connect traditional archers with authentic, handcrafted equipment.
          </p>
          <div className="pt-2 flex justify-center">
            <div className="w-12 h-[1px] bg-[#c5a880]/30" />
          </div>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-16 md:space-y-24">
        {/* Selection Criteria & Craft Standards */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
              Craftsmanship Standards
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              Our Partner Selection Criteria
            </h2>
            <p className="text-sm text-primary/80 max-w-xl mx-auto font-sans">
              "We partner exclusively with dedicated artisans who honor traditional woodworking, meticulous tillering, and honest material sourcing."
            </p>
            <div className="w-10 h-[1px] bg-[#c5a880]/30 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-xs space-y-3">
              <Shield className="w-6 h-6 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">
                1. Proven Field Performance
              </h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                Bows are evaluated for clean arrow flight, structural stability under varying humidity and temperature, and long-term durability.
              </p>
            </div>
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-xs space-y-3">
              <Star className="w-6 h-6 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">
                2. Material Integrity
              </h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                Utilizing high-grade natural timber, bamboo cores, horn overlays, and durable clear or black fiberglass laminations.
              </p>
            </div>
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-xs space-y-3">
              <Award className="w-6 h-6 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">
                3. Direct Artisan Collaboration
              </h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                Working directly with the bowmakers themselves, ensuring custom draw weight tillering, authentic specs, and transparent pricing.
              </p>
            </div>
          </div>
        </div>

        {/* Static Master Bowyers Showcase */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
              The Creators
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              Featured Master Bowyers
            </h2>
            <div className="w-10 h-[1px] bg-[#c5a880]/30 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MASTER_BOWYERS_STATIC.map((b) => (
              <Link
                key={b.slug}
                href={b.href}
                className="product-card group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-[420px] cursor-pointer"
              >
                {/* Image Banner */}
                <div className="relative w-full h-[200px] bg-primary/10 overflow-hidden shrink-0">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary/90 border border-[#c5a880]/30 rounded-full text-[9px] font-sans font-bold text-secondary uppercase tracking-widest">
                    Partner Bowyer
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[9px] text-[#5c4629] font-serif uppercase tracking-widest font-bold">
                      Master Bowyer
                    </div>
                    <h3
                      className="notranslate text-lg font-serif font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-1"
                      translate="no"
                    >
                      {b.name}
                    </h3>
                    <div
                      className="notranslate text-xs font-serif font-bold text-[#7d603a] tracking-wider uppercase"
                      translate="no"
                    >
                      Master Craftsman: {b.craftsman}
                    </div>
                    <p className="text-xs text-primary/75 leading-relaxed font-sans line-clamp-3">
                      {b.excerpt}
                    </p>
                  </div>

                  <div className="border-t border-primary/5 pt-4 flex items-center justify-between text-[10px] font-serif uppercase tracking-widest font-bold text-accent group-hover:translate-x-1 transition-transform duration-300">
                    <span>Explore Craft Profile</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* International Events & Heritage Block */}
        <div className="bg-[#0e3b2e]/5 border border-primary/5 rounded-3xl p-8 md:p-12 space-y-6">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-[#5c4629] font-serif font-bold">
              Global Recognition
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              International Archery Gatherings
            </h2>
            <div className="w-10 h-[1px] bg-[#c5a880]/30" />
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-primary tracking-wide">
              World Nomad Games &amp; Traditional Archery Competitions
            </h4>
            <p className="text-sm text-primary/85 font-sans leading-relaxed max-w-3xl">
              Traditional bows crafted by our partner bowyers are used and trusted by archers competing at major international historical events, including the World Nomad Games and regional traditional archery tournaments worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
