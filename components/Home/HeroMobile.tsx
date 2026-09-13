"use client";

import React from "react";
import Link from "next/link";

const HeroMobile = () => {
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center text-secondary py-16 px-8 overflow-hidden border-b border-primary/10 select-none min-h-[calc(100vh-80px)] text-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/wp-assets/contact-bg.webp')",
      }}
    >
      {/* Rich Brand Color Overlay (Reduced opacity to 65% for enhanced background image visibility) */}
      <div className="absolute inset-0 bg-[#0e3b2e]/65 backdrop-blur-[1px] z-0 pointer-events-none" />

      {/* Premium Double Framed Borders */}
      <div className="border-outer absolute inset-5 border border-accent/20 rounded-2xl pointer-events-none z-0" />
      <div className="border-inner absolute inset-6.5 border border-dashed border-accent/30 rounded-2xl pointer-events-none z-0" />

      {/* Stylized Archery Arrowhead Badge */}
      <div className="w-12 h-12 mb-6 text-accent z-10 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3l-6 6m6-6l6 6M12 21l-3-3m3 3l3-3" />
        </svg>
      </div>

      {/* Academy Label */}
      <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-accent uppercase mb-3 z-10">
        Global Academy for Traditional Archery
      </span>

      {/* Main Serif Heading */}
      <h1 className="notranslate text-4xl md:text-5xl font-bold text-secondary font-serif tracking-tight leading-none mb-3 z-10" translate="no">
        Jan Franko
      </h1>

      {/* Classical Diamond Divider */}
      <div className="flex items-center gap-3 w-32 my-2 z-10">
        <div className="h-[1px] bg-accent/40 flex-1" />
        <div className="w-1.5 h-1.5 rotate-45 bg-accent" />
        <div className="h-[1px] bg-accent/40 flex-1" />
      </div>

      {/* Serif Subtitle */}
      <span className="text-base md:text-lg font-serif text-accent font-semibold tracking-wider mb-6 z-10">
        Training • Expeditions • Cultural Heritage
      </span>

      {/* Description Paragraph */}
      <p className="text-sm text-secondary/90 font-light leading-relaxed max-w-sm mb-8 z-10">
        A traditional archery academy offering a comprehensive, structured approach to mastering the art of traditional archery, cultural study, and global wilderness expeditions.
      </p>

      {/* CTA Button */}
      <Link
        href="/programs"
        className="relative overflow-hidden bg-accent hover:bg-accent/90 text-primary font-serif tracking-widest text-xs uppercase py-3.5 px-7 rounded-full shadow-lg active:scale-[0.98] flex items-center gap-2 cursor-pointer z-10 font-bold transition-all"
      >
        <span className="relative z-10">Explore Our Programs</span>
        <svg className="w-3.5 h-3.5 text-primary z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
};

export default HeroMobile;
