"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Shield, Tag, Star, Award, Loader2 } from "lucide-react";

interface BowyerDetails {
  id: number;
  name: string;
  slug: string;
  heading: string;
  bowyer_name?: string;
  story: string;
  philosophy: string;
  image: string;
}

const PartnersPage = () => {
  const [bowyers, setBowyers] = useState<BowyerDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBowyers = async () => {
      try {
        const res = await fetch("/api/equipment/bowyers");
        if (res.ok) {
          const data = await res.json();
          // Filter to match Sergey, Harvey, and MR Bows (as returned by /api/equipment/bowyers)
          setBowyers(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch bowyers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBowyers();
  }, []);

  const cleanTitle = (raw: string | undefined) => {
    if (!raw) return "";
    return raw
      .replace(/&#8220;/g, "“")
      .replace(/&#8221;/g, "”")
      .replace(/&#8211;/g, "–")
      .replace(/&amp;/g, "&");
  };

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative">
      <title>Vetted Bowyers & Partners | Traditional Archery - Jan Franko</title>
      <meta name="description" content="Vetting elite master bowyers and traditional craftsmen globally. Explore our artisan network dedicated to historical bow construction standards." />
      <meta property="og:title" content="Vetted Bowyers & Partners | Traditional Archery - Jan Franko" />
      <meta property="og:description" content="Vetting elite master bowyers and traditional craftsmen globally. Explore our artisan network dedicated to historical bow construction standards." />
      
      {/* Hero Header Section */}
      <div className="relative w-full bg-[#0e3b2e] text-white py-20 md:py-24 px-6 overflow-hidden flex flex-col items-center justify-center border-b border-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.12),transparent_70%)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(14,59,46,0.5))] z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-full text-[10px] md:text-xs font-serif font-semibold tracking-widest uppercase text-accent">
            Master Craftsmanship &amp; Alliances
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
            Partners &amp; Vetted Bowyers
          </h1>
          <p className="text-sm md:text-base text-white/80 font-normal max-w-2xl mx-auto leading-relaxed">
             Vetting traditional archery craftsmen through real field trials in extreme terrains.
          </p>
          <div className="pt-2 flex justify-center">
            <div className="w-12 h-[1px] bg-[#c5a880]/30" />
          </div>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-16 md:space-y-24">
        
        {/* Vetting Protocols Block */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
              Archery Standards
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              Vetting Protocols (Tier I - III)
            </h2>
            <p className="text-sm text-primary/80 max-w-xl mx-auto font-sans">
              "Each bow and partnership is selected through real-world use in demanding landscapes—from Carpathian forests to Alpine ridgelines."
            </p>
            <div className="w-10 h-[1px] bg-[#c5a880]/30 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-sm space-y-3">
              <Shield className="w-6 h-6 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">1. Expedition Reliability</h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                Bows are subjected to real field trials, ensuring performance under shifting weather, moisture, and rugged terrains.
              </p>
            </div>
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-sm space-y-3">
              <Star className="w-6 h-6 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">2. Martial Philosophy</h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                Partnerships centered on respect, discipline, and the preservation of traditional archery heritage as a dō (way).
              </p>
            </div>
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-sm space-y-3">
              <Award className="w-6 h-6 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">3. Heritage Craft</h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                Ensuring durability and responsible production through manufacturers committed to quality and technical authenticity.
              </p>
            </div>
          </div>
        </div>

        {/* Master Bowyers showcase */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
              The Creators
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              The Bowyers Behind the System
            </h2>
            <div className="w-10 h-[1px] bg-[#c5a880]/30 mx-auto mt-3" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-primary/5 rounded-2xl h-[400px] overflow-hidden flex flex-col shadow-sm animate-pulse">
                  <div className="bg-primary/10 h-[200px] w-full" />
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="bg-primary/10 rounded h-3 w-1/4" />
                      <div className="bg-primary/10 rounded h-5 w-2/3" />
                      <div className="space-y-1.5">
                        <div className="bg-primary/10 rounded h-3.5 w-full" />
                        <div className="bg-primary/10 rounded h-3.5 w-full" />
                        <div className="bg-primary/10 rounded h-3.5 w-5/6" />
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bowyers.map((b) => (
                <Link
                  key={b.slug}
                  href={`/bowyer/${b.slug}`}
                  className="product-card group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-[400px] cursor-pointer"
                >
                  {/* Image Banner */}
                  <div className="relative w-full h-[200px] bg-primary/10 overflow-hidden shrink-0">
                    <img
                      src={b.image}
                      alt={b.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="text-[9px] text-[#5c4629] font-serif uppercase tracking-widest font-bold">
                        Vetted Partner Bowyer
                      </div>
                      <h3 className="text-lg font-serif font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-1">
                        {cleanTitle(b.name)}
                      </h3>
                      {b.bowyer_name && (
                        <div className="text-xs font-serif font-bold text-[#7d603a] tracking-wider uppercase">
                          {cleanTitle(b.bowyer_name)}
                        </div>
                      )}
                      <p className="text-xs text-primary/75 leading-relaxed font-sans line-clamp-3">
                        {b.story}
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
          )}
        </div>

        {/* Institutional Affiliations Block */}
        <div className="bg-[#0e3b2e]/5 border border-primary/5 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-[#5c4629] font-serif font-bold">
              Affiliations
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              Institutional Affiliations
            </h2>
            <div className="w-10 h-[1px] bg-[#c5a880]/30" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-primary tracking-wide">World Nomad Games</h4>
              <p className="text-sm text-primary/85 font-sans leading-relaxed">
                Aligning Tier III training with global standards for dynamic, culturally significant historical competitions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-primary tracking-wide">Historical Archery Federation (HAF)</h4>
              <p className="text-sm text-primary/85 font-sans leading-relaxed">
                Recognized for maintaining technical integrity regarding bow construction and traditional long-distance field shooting.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PartnersPage;
