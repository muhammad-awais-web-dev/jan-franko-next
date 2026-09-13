"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const titleJanRef = useRef<HTMLSpanElement>(null);
  const titleFrankoRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Mousemove Parallax handler
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30; // max 30px offset
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      // Archer parallax - strictly horizontal (X-axis) to avoid showing bottom image cutoff!
      gsap.to(".parallax-img", {
        x: xPos * 0.4,
        duration: 0.8,
        ease: "power2.out"
      });

      // Mountain Layer 1 (Back)
      gsap.to(".mountain-layer-1", {
        x: -xPos * 0.15,
        y: -yPos * 0.1,
        duration: 1.2,
        ease: "power2.out"
      });

      // Mountain Layer 2 (Middle)
      gsap.to(".mountain-layer-2", {
        x: -xPos * 0.35,
        y: -yPos * 0.2,
        duration: 1.0,
        ease: "power2.out"
      });

      // Mountain Layer 3 (Front)
      gsap.to(".mountain-layer-3", {
        x: -xPos * 0.6,
        y: -yPos * 0.3,
        duration: 0.8,
        ease: "power2.out"
      });


    };

    window.addEventListener("mousemove", handleMouseMove);

    // 2. Cinematic Entrance Animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Portrait Image Reveal
      tl.fromTo(
        imgWrapperRef.current,
        { opacity: 0, x: -50, scale: 0.98 },
        { opacity: 1, x: 0, scale: 1, duration: 1.4, ease: "power4.out" }
      );

      // Split-text Header Reveal
      tl.fromTo(
        [titleJanRef.current, titleFrankoRef.current],
        { y: "100%" },
        { y: "0%", duration: 1.0, stagger: 0.12, ease: "power4.out" },
        "-=1.1"
      );

      // Subtitle, Description, and CTA Button Reveal
      tl.fromTo(
        [subtitleRef.current, descRef.current, btnRef.current],
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
        "-=0.7"
      );

      // Mountains rise up
      tl.fromTo(
        [".mountain-layer-1", ".mountain-layer-2", ".mountain-layer-3"],
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.6, stagger: 0.1, ease: "power3.out" },
        "-=1.6"
      );
    }, containerRef);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col md:flex-row items-center justify-between min-h-[calc(100vh-80px)] bg-secondary overflow-hidden border-b border-primary/10 select-none"
    >
      


      {/* Layered Parallax Mountains */}
      <div className="absolute inset-x-0 bottom-0 h-[30vh] md:h-[40vh] overflow-hidden pointer-events-none z-0">
        
        {/* Mountain Layer 1 (Back - Lightest) */}
        <div className="mountain-layer-1 absolute inset-x-0 bottom-[-5%] h-[110%] w-[110%] left-[-5%]">
          <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full text-[#0e3b2e]/5 fill-current">
            <path d="M0,110 Q 150,60 300,120 T 600,70 T 900,110 T 1000,95 L 1000,200 L 0,200 Z" />
          </svg>
        </div>

        {/* Mountain Layer 2 (Middle - Medium) */}
        <div className="mountain-layer-2 absolute inset-x-0 bottom-[-5%] h-[110%] w-[110%] left-[-5%]">
          <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full text-[#0e3b2e]/10 fill-current">
            <path d="M0,135 Q 200,85 400,145 T 700,95 T 1000,115 L 1000,200 L 0,200 Z" />
          </svg>
        </div>

        {/* Mountain Layer 3 (Front - Strongest) */}
        <div className="mountain-layer-3 absolute inset-x-0 bottom-[-5%] h-[110%] w-[110%] left-[-5%]">
          <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full text-[#0e3b2e]/20 fill-current">
            <path d="M0,165 Q 250,115 500,175 T 750,125 T 1000,145 L 1000,200 L 0,200 Z" />
          </svg>
        </div>

      </div>

      {/* Portrait / Left Image Section (Pinned strictly to the bottom) */}
      <div
        ref={imgWrapperRef}
        className="w-full md:w-2/5 h-[45vh] md:h-[calc(100vh-80px)] relative z-10 flex items-end justify-center mt-6 md:mt-0"
      >
        <div className="parallax-img relative w-[85%] md:w-[90%] h-full flex items-end">
          {/* Soft Glow Radial Highlight */}
          <div className="absolute inset-0 bg-[#c5a880]/10 rounded-full filter blur-3xl opacity-50 scale-90 translate-y-12 select-none pointer-events-none z-0" />
          
          <Image
            src="/JanReal.png"
            alt="Jan Franko"
            fill
            priority
            sizes="(max-w-768px) 100vw, 40vw"
            className="object-contain object-bottom p-2 z-10 drop-shadow-[0_15px_40px_rgba(14,59,46,0.12)] hover:scale-[1.01] transition-transform duration-500 ease-out select-none"
          />
        </div>
      </div>

      {/* Info / Right Text Section */}
      <div
        ref={textWrapperRef}
        className="w-full md:w-3/5 h-full p-8 md:p-16 flex items-center md:items-end justify-center flex-col text-center md:text-right relative z-10 select-text"
      >
        {/* Split-text elegant heading with Google Translate protection */}
        <h1 className="notranslate text-5xl md:text-7xl lg:text-8xl font-bold text-primary font-serif tracking-tight leading-[0.95] mb-4 flex flex-col md:items-end" translate="no">
          <span className="notranslate block overflow-hidden relative pb-6 -mb-6" translate="no">
            <span ref={titleJanRef} className="notranslate inline-block translate-y-full" translate="no">
              Jan
            </span>
          </span>
          <span className="notranslate block overflow-hidden relative pb-4 -mb-4" translate="no">
            <span ref={titleFrankoRef} className="notranslate inline-block text-accent translate-y-full" translate="no">
              Franko
            </span>
          </span>
        </h1>
        
        <span
          ref={subtitleRef}
          className="text-lg md:text-xl lg:text-2xl font-serif text-accent font-semibold tracking-wider mb-6 opacity-0"
        >
          Training, Expeditions, Cultural Heritage
        </span>
        
        <p
          ref={descRef}
          className="text-base md:text-lg text-primary/80 font-light leading-relaxed max-w-2xl mb-8 opacity-0"
        >
          A traditional archery academy offering a comprehensive, structured approach to mastering the art of traditional archery, cultural study, and global wilderness expeditions.
        </p>
        
        <Link
          href="/programs"
          ref={btnRef as any}
          className="relative overflow-hidden group bg-primary text-secondary font-serif tracking-widest text-sm uppercase py-4 px-8 rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] flex items-center gap-3 cursor-pointer opacity-0"
        >
          <span className="relative z-10">Explore Our Programs</span>
          <svg className="w-4 h-4 text-accent transform group-hover:translate-x-1.5 transition-transform duration-300 z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <div className="absolute inset-0 bg-[#071f18] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
