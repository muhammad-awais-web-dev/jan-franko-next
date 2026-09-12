"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Compass, MapPin, Award, Sliders, BookOpen, Tag, Mail, Phone, Globe } from "lucide-react";
import { clientFetch } from "@/data/clientFetch";
import { readConsent } from "@/lib/consent";

interface Term {
  id: number;
  name: string;
  slug: string;
}

interface CategoryTerm {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile drawer toggle
  const [isAcademyMobileOpen, setIsAcademyMobileOpen] = useState(false); // Mobile academy sub-accordion
  const [isProgramsMobileOpen, setIsProgramsMobileOpen] = useState(false); // Mobile programs sub-accordion
  const [isKnowledgeMobileOpen, setIsKnowledgeMobileOpen] = useState(false); // Mobile knowledge sub-accordion
  const [isEquipmentMobileOpen, setIsEquipmentMobileOpen] = useState(false); // Mobile equipment sub-accordion
  const [isAboutMobileOpen, setIsAboutMobileOpen] = useState(false); // Mobile about sub-accordion
  const [openSubgroups, setOpenSubgroups] = useState<Record<string, boolean>>({});
  const [types, setTypes] = useState<Term[]>([]);
  const [skills, setSkills] = useState<Term[]>([]);
  const [regions, setRegions] = useState<Term[]>([]);
  const [equipmentCategories, setEquipmentCategories] = useState<CategoryTerm[]>([]);
  const [bowyers, setBowyers] = useState<any[]>([]);
  const [activeBowyerIndex, setActiveBowyerIndex] = useState(0);

  // Translation states & supported languages (matching the full list of requested languages with flagcdn codes)
  const LANGUAGES = [
    { code: "en", name: "English", flagCode: "gb" },
    { code: "de", name: "Deutsch", flagCode: "de" },
    { code: "sk", name: "Slovenčina", flagCode: "sk" },
    { code: "cs", name: "Čeština", flagCode: "cz" },
    { code: "pl", name: "Polski", flagCode: "pl" },
    { code: "uk", name: "Українська", flagCode: "ua" },
    { code: "ru", name: "Русский", flagCode: "ru" },
    { code: "hu", name: "Magyar", flagCode: "hu" },
    { code: "ro", name: "Română", flagCode: "ro" },
    { code: "bg", name: "Български", flagCode: "bg" },
    { code: "el", name: "Ελληνικά", flagCode: "gr" },
    { code: "hy", name: "Հայերեն", flagCode: "am" },
    { code: "ka", name: "ქართული", flagCode: "ge" },
    { code: "et", name: "Eesti", flagCode: "ee" },
    { code: "lv", name: "Latviešu", flagCode: "lv" },
    { code: "lt", name: "Lietuvių", flagCode: "lt" },
    { code: "es", name: "Español", flagCode: "es" },
    { code: "it", name: "Italiano", flagCode: "it" },
    { code: "pt", name: "Português", flagCode: "pt" },
    { code: "ja", name: "日本語", flagCode: "jp" },
    { code: "mn", name: "Монгол", flagCode: "mn" },
    { code: "ko", name: "한국어", flagCode: "kr" },
    { code: "zh-CN", name: "中文 (简体)", flagCode: "cn" },
    { code: "th", name: "ไทย", flagCode: "th" },
    { code: "vi", name: "Tiếng Việt", flagCode: "vn" },
    { code: "tl", name: "Filipino", flagCode: "ph" },
    { code: "am", name: "አማርኛ", flagCode: "et" },
    { code: "dz", name: "རྫོང་ཁ", flagCode: "bt" },
    { code: "no", name: "Norsk", flagCode: "no" },
    { code: "sv", name: "Svenska", flagCode: "se" },
    { code: "fi", name: "Suomi", flagCode: "fi" },
    { code: "da", name: "Dansk", flagCode: "dk" },
    { code: "is", name: "Íslenska", flagCode: "is" }
  ];

  const LANGUAGE_COLUMNS = [
    {
      title: "Central & Western Europe",
      codes: ["en", "de", "sk", "cs", "pl", "es", "it", "pt"]
    },
    {
      title: "Eastern Europe & Caucasus",
      codes: ["uk", "ru", "hu", "ro", "bg", "el", "hy", "ka"]
    },
    {
      title: "Northern Europe & Baltic",
      codes: ["et", "lv", "lt", "no", "sv", "fi", "da", "is"]
    },
    {
      title: "Asia & Global",
      codes: ["ja", "mn", "ko", "zh-CN", "th", "vi", "tl", "am", "dz"]
    }
  ];

  const [currentLang, setCurrentLang] = useState("en");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read the active translation language from Google's standard cookie on mount
  useEffect(() => {
    setMounted(true);
    const checkCookie = () => {
      const cookies = document.cookie.split("; ");
      const transCookie = cookies.find((row) => row.startsWith("googtrans="));
      if (transCookie) {
        const parts = transCookie.split("=");
        if (parts.length > 1) {
          const val = decodeURIComponent(parts[1]);
          const lang = val.split("/").pop();
          if (lang) {
            setCurrentLang(lang);
            return;
          }
        }
      }
      setCurrentLang("en");
    };
    checkCookie();

    const interval = setInterval(checkCookie, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isLangOpen) return;
    const handleOutsideClick = () => setIsLangOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isLangOpen]);

  const handleLanguageChange = (langCode: string) => {
    // Check if functional translation consent is granted
    const consent = readConsent();
    if (!consent?.functional && langCode !== "en") {
      setIsLangOpen(false);
      window.dispatchEvent(
        new CustomEvent("jf:open-consent", {
          detail: { highlightFunctional: true }
        })
      );
      return;
    }

    // Set cookie path and domains to make it stick
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
    
    setCurrentLang(langCode);
    setIsLangOpen(false);

    // Apply value to Google Translate combo box and dispatch trigger
    const select = document.querySelector("select.goog-te-combo") as HTMLSelectElement | null;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      // If scripts are still loading, fallback to simple page refresh
      window.location.reload();
    }
  };
  
  const pathname = usePathname();

  const toggleSubgroup = (key: string) => {
    setOpenSubgroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProgramsMobileOpen(false);
    setIsKnowledgeMobileOpen(false);
    setIsEquipmentMobileOpen(false);
    setIsAboutMobileOpen(false);
    setOpenSubgroups({});
  }, [pathname]);

  // Fetch all taxonomies and bowyer partners on mount to populate Mega Menu columns dynamically
  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const [navData, eqData, bowyerData] = await Promise.all([
          clientFetch<any>("/api/nav-taxonomies"),
          clientFetch<CategoryTerm[]>("/api/equipment/categories"),
          clientFetch<any[]>("/api/equipment/bowyers")
        ]);

        setTypes(navData?.types || []);
        setSkills(navData?.skills || []);
        setRegions(navData?.regions || []);
        setEquipmentCategories(eqData || []);
        setBowyers(bowyerData || []);
      } catch (err) {
        console.error("Failed to fetch nav menu taxonomies:", err);
      } finally {
        if (typeof window !== "undefined") {
          (window as any).__MEGAMENU_READY = true;
          window.dispatchEvent(new Event("megamenu-ready"));
        }
      }
    };

    fetchTaxonomies();
  }, []);

  // Auto-play timer for the partner bowyers carousel
  useEffect(() => {
    if (bowyers.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBowyerIndex((prev) => (prev + 1) % bowyers.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bowyers]);

  // Filter top-level categories (parent is 0 or 28, excluding Bowyers 114)
  const topCats = equipmentCategories.filter(
    (c) => (c.parent === 0 || c.parent === 28) && c.slug !== "equipment"
  );

  // Group subcategories under parents
  const columns = topCats.map((parentCat) => {
    const subCats = equipmentCategories.filter((c) => c.parent === parentCat.id);
    return {
      parent: parentCat,
      items: subCats
    };
  });

  // Align in 4-column grid, skipping the 4th item position (index 3)
  const gridSlots: Array<{ type: "category"; parent: any; items: any[] } | { type: "special" }> = [];
  let catIndex = 0;
  const totalSlots = columns.length + 1;
  for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
    if (slotIndex === 3) {
      gridSlots.push({ type: "special" });
    } else {
      if (columns[catIndex]) {
        gridSlots.push({
          type: "category",
          parent: columns[catIndex].parent,
          items: columns[catIndex].items
        });
        catIndex++;
      }
    }
  }

  // Label HTML cleanup helper
  const cleanTitle = (raw: string) => {
    return raw
      .replace(/&#8220;/g, "“")
      .replace(/&#8221;/g, "”")
      .replace(/&#8211;/g, "–")
      .replace(/&amp;/g, "&");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-secondary/90 backdrop-blur-md border-b border-primary/10 select-none">
      <nav className="max-w-7xl mx-auto h-20 px-6 md:px-12 flex justify-between items-center relative">
        {/* Logo Branding */}
        <Link href="/" className="flex items-center">
          <img
            src="/images/wp-assets/logo.png"
            alt="JanFranko Logo"
            className="h-12 object-contain hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* 1. DESKTOP NAVIGATION */}
        <ul className="hidden lg:flex items-center space-x-8 font-serif text-xs tracking-widest uppercase h-full">
          {/* Home Link */}
          <li className="h-full flex items-center">
            <Link
              href="/"
              className={`hover:text-accent transition-colors py-2 border-b-2 ${
                pathname === "/" ? "border-accent text-accent font-semibold" : "border-transparent text-primary/90"
              }`}
            >
              Home
            </Link>
          </li>

          {/* Academy Mega Menu Trigger (Hover active) */}
          <li className="group h-full flex items-center static">
            <Link
              href="/academy"
              className={`hover:text-accent transition-colors py-2 border-b-2 flex items-center gap-1 cursor-pointer ${
                pathname.startsWith("/academy") || pathname === "/archery-games" ? "border-accent text-accent font-semibold" : "border-transparent text-primary/90"
              }`}
            >
              Academy
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </Link>

            {/* ACADEMY MEGA MENU CONTAINER */}
            <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-primary/5 border-b border-primary/10 rounded-b-3xl shadow-2xl opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-40">
              <div className="max-w-7xl mx-auto px-12 py-8 grid grid-cols-4 gap-8">
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 font-sans flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-accent" />
                    Overview &amp; Audit
                  </h4>
                  <ul className="space-y-2 font-sans text-xs tracking-wider normal-case text-primary/80 font-medium">
                    <li>
                      <Link href="/academy" className="hover:text-accent transition-colors block py-0.5 font-bold text-primary">
                        The Academy Hub
                      </Link>
                    </li>
                    <li>
                      <Link href="/academy/certification" className="hover:text-accent transition-colors block py-0.5">
                        Certification &amp; Audit
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 font-sans flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-accent" />
                    Progression &amp; Metrics
                  </h4>
                  <ul className="space-y-2 font-sans text-xs tracking-wider normal-case text-primary/80 font-medium">
                    <li>
                      <Link href="/academy/explorer-rank-system" className="hover:text-accent transition-colors block py-0.5">
                        Explorer Rank System
                      </Link>
                    </li>
                    <li>
                      <Link href="/academy/environmental-stress-index-esi" className="hover:text-accent transition-colors block py-0.5">
                        Environmental Stress Index (ESI)
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 font-sans flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-accent" />
                    Governance &amp; Gatherings
                  </h4>
                  <ul className="space-y-2 font-sans text-xs tracking-wider normal-case text-primary/80 font-medium">
                    <li>
                      <Link href="/academy/summit-protocol" className="hover:text-accent transition-colors block py-0.5">
                        Summit Protocol (Tier III)
                      </Link>
                    </li>
                    <li>
                      <Link href="/academy/code-of-conduct" className="hover:text-accent transition-colors block py-0.5">
                        Code of Conduct &amp; Neutrality
                      </Link>
                    </li>
                    <li>
                      <Link href="/archery-games" className="hover:text-accent transition-colors block py-0.5 font-bold text-[#7d603a]">
                        Archery Games &amp; Events
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#0e3b2e] rounded-2xl p-5 text-white flex flex-col justify-between space-y-3 shadow-inner">
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase tracking-widest text-accent font-bold font-sans">
                      Academy Standard
                    </span>
                    <h5 className="font-serif text-base font-bold leading-snug">
                      Operational Verification
                    </h5>
                    <p className="text-[10px] text-white/75 font-sans leading-relaxed">
                      Mandatory safety audits and ESI environmental exposure metrics for all archers.
                    </p>
                  </div>
                  <Link
                    href="/academy/certification"
                    className="inline-block text-center py-2 bg-accent hover:bg-accent/90 text-primary font-serif font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all"
                  >
                    View Certification
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* Programs Mega Menu Trigger (Hover active) */}
          <li className="group h-full flex items-center static">
            <Link
              href="/programs"
              className={`hover:text-accent transition-colors py-2 border-b-2 flex items-center gap-1 cursor-pointer ${
                pathname === "/programs" ? "border-accent text-accent font-semibold" : "border-transparent text-primary/90"
              }`}
            >
              Programs
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </Link>

            {/* MEGA MENU CONTAINER */}
            <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-primary/5 border-b border-primary/10 rounded-b-3xl shadow-2xl opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-40">
              <div className="max-w-7xl mx-auto px-12 py-10 grid grid-cols-4 gap-8">
                {/* Column 1: Types */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 flex items-center gap-1.5 font-sans">
                    <Compass className="w-4 h-4 text-accent" />
                    Program Types
                  </h4>
                  <ul className="space-y-2.5 font-sans text-xs tracking-wider normal-case text-primary/80">
                    {types.length === 0 ? (
                      <li className="text-primary/40 italic">Loading types...</li>
                    ) : (
                      types.map((t) => (
                        <li key={t.id}>
                          <Link
                            href={`/programs?program_type=${t.slug}`}
                            className="hover:text-accent transition-colors block py-0.5"
                          >
                            {t.name}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Column 2: Skill Levels */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 flex items-center gap-1.5 font-sans">
                    <Award className="w-4 h-4 text-accent" />
                    Skill Levels
                  </h4>
                  <ul className="space-y-2.5 font-sans text-xs tracking-wider normal-case text-primary/80">
                    {skills.length === 0 ? (
                      <li className="text-primary/40 italic">Loading levels...</li>
                    ) : (
                      skills.map((s) => (
                        <li key={s.id}>
                          <Link
                            href={`/programs?skill_level=${s.slug}`}
                            className="hover:text-accent transition-colors block py-0.5"
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Column 3: Regions (Scrollable) */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 flex items-center gap-1.5 font-sans">
                    <MapPin className="w-4 h-4 text-accent" />
                    Regions ({regions.length})
                  </h4>
                  <div className="max-h-60 overflow-y-auto pr-2 space-y-2 font-sans text-xs tracking-wider normal-case text-primary/80 scrollbar-thin scrollbar-thumb-primary/20">
                    {regions.length === 0 ? (
                      <div className="text-primary/40 italic">Loading regions...</div>
                    ) : (
                      regions.map((r) => (
                        <div key={r.id}>
                          <Link
                            href={`/programs?region=${r.slug}`}
                            className="hover:text-accent transition-colors block py-0.5"
                          >
                            {r.name}
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Column 4: Featured Promo Card */}
                <div className="bg-[#0e3b2e] rounded-2xl p-5 text-white flex flex-col justify-between space-y-4 shadow-inner">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-widest text-accent font-bold font-sans">
                      Featured Expedition
                    </span>
                    <h5 className="font-serif text-lg font-bold leading-snug">
                      Inner Mongolia Steppe Camp
                    </h5>
                    <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                      Immersive horse archery and traditional archery training in the grasslands of China.
                    </p>
                  </div>
                  <Link
                    href="/programs?open=inner-mongolia-steppe-horse-archery-camp"
                    className="inline-block text-center py-2.5 bg-accent hover:bg-accent/90 text-primary font-serif font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all"
                  >
                    View Expedition
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* Equipment Mega Menu Trigger (Hover active) */}
          <li className="group h-full flex items-center static">
            <Link
              href="/equipment"
              className={`hover:text-accent transition-colors py-2 border-b-2 flex items-center gap-1 cursor-pointer ${
                pathname.startsWith("/equipment") ? "border-accent text-accent font-semibold" : "border-transparent text-primary/90"
              }`}
            >
              Equipment
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </Link>

            {/* MEGA MENU CONTAINER */}
            <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-primary/5 border-b border-primary/10 rounded-b-3xl shadow-2xl opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-40">
              <div className="max-w-7xl mx-auto px-12 py-10 grid grid-cols-4 gap-8">
                {gridSlots.map((slot, index) => {
                  if (slot.type === "special") {
                    return (
                      <div key="special-promo" className="bg-[#0e3b2e] rounded-2xl p-4 text-white flex flex-col justify-between space-y-3.5 shadow-inner col-span-1 row-span-2 h-full min-h-[380px] relative overflow-hidden group/carousel">
                        {bowyers.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-white/50 text-[10px] italic font-sans">
                            Loading partners...
                          </div>
                        ) : (
                          <div className="relative flex-1 flex flex-col justify-between space-y-3 animate-in fade-in duration-500">
                            <div className="space-y-2.5 z-10 flex-1">
                              {/* Header Label and Dots Row */}
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] uppercase tracking-widest text-accent font-bold font-sans">
                                  Master Bowyer / Partner
                                </span>
                                <div className="flex gap-1">
                                  {bowyers.map((_, i) => (
                                    <button
                                      key={i}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setActiveBowyerIndex(i);
                                      }}
                                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                                        i === activeBowyerIndex ? "bg-accent w-3" : "bg-white/30"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              
                              {/* Full-width Taller Banner Image (4:3 aspect ratio) */}
                              <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden shadow-md">
                                <img
                                  src={bowyers[activeBowyerIndex].image}
                                  alt={bowyers[activeBowyerIndex].name}
                                  className="w-full h-full object-cover group-hover/carousel:scale-102 transition-transform duration-500"
                                />
                              </div>

                              {/* Title & Description Details */}
                              <div className="space-y-0.5">
                                <h5 className="font-serif text-sm font-bold leading-tight">
                                  {cleanTitle(bowyers[activeBowyerIndex].name)}
                                </h5>
                                <p className="text-[9px] text-accent font-serif italic line-clamp-1">
                                  "{cleanTitle(bowyers[activeBowyerIndex].heading)}"
                                </p>
                                <p className="text-[10px] text-white/75 font-sans leading-relaxed line-clamp-2 pt-1">
                                  {bowyers[activeBowyerIndex].story}
                                </p>
                              </div>
                            </div>

                            {/* Button and Controls Row */}
                            <div className="flex items-center gap-2 z-10 pt-1.5 border-t border-white/10">
                              <Link
                                href={`/bowyer/${bowyers[activeBowyerIndex].slug}`}
                                className="flex-1 text-center py-2 bg-accent hover:bg-accent/90 text-primary font-serif font-bold text-[9px] tracking-wider uppercase rounded-xl transition-all"
                              >
                                View Crafts
                              </Link>
                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setActiveBowyerIndex((prev) => (prev - 1 + bowyers.length) % bowyers.length);
                                  }}
                                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                                >
                                  <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setActiveBowyerIndex((prev) => (prev + 1) % bowyers.length);
                                  }}
                                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                                >
                                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={slot.parent.id} className="space-y-4">
                      <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 flex items-center gap-1.5 font-sans">
                        <Tag className="w-4 h-4 text-accent" />
                        <Link
                          href={`/equipment?category=${slot.parent.slug}`}
                          className="hover:text-accent transition-colors cursor-pointer"
                        >
                          {cleanTitle(slot.parent.name)}
                        </Link>
                      </h4>
                      <ul className="space-y-2.5 font-sans text-xs tracking-wider normal-case text-primary/80">
                        {slot.items.length === 0 ? (
                          <li className="text-primary/40 italic">All {cleanTitle(slot.parent.name)}</li>
                        ) : (
                          slot.items.slice(0, 8).map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/equipment?category=${sub.slug}`}
                                className="hover:text-accent transition-colors block py-0.5"
                              >
                                {cleanTitle(sub.name)}
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </li>

          {/* Knowledge Mega Menu Trigger (Hover active) */}
          <li className="group h-full flex items-center static">
            <Link
              href="/knowledge"
              className={`hover:text-accent transition-colors py-2 border-b-2 flex items-center gap-1 cursor-pointer ${
                pathname.startsWith("/knowledge") ? "border-accent text-accent font-semibold" : "border-transparent text-primary/90"
              }`}
            >
              Knowledge
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </Link>

            {/* MEGA MENU CONTAINER */}
            <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-primary/5 border-b border-primary/10 rounded-b-3xl shadow-2xl opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-40">
              <div className="max-w-7xl mx-auto px-12 py-10 grid grid-cols-4 gap-8">
                {/* Column 1: Major Lineages */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 flex items-center gap-1.5 font-sans">
                    <Compass className="w-4 h-4 text-accent" />
                    Major Lineages (Level 1)
                  </h4>
                  <ul className="space-y-2.5 font-sans text-xs tracking-wider normal-case text-primary/80">
                    <li>
                      <Link href="/knowledge/east-archery" className="hover:text-[#7d603a] hover:underline block py-0.5 font-semibold">
                        Eastern Archery Lineages
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/composite-archery" className="hover:text-[#7d603a] hover:underline block py-0.5 font-semibold">
                        Composite Archery
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/mongolia-expedition" className="hover:text-[#7d603a] hover:underline block py-0.5">
                        Mongolia Expedition
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/cultural-legacy" className="hover:text-[#7d603a] hover:underline block py-0.5">
                        Cultural Archery Legacy
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Expedition Volumes */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 flex items-center gap-1.5 font-sans">
                    <MapPin className="w-4 h-4 text-accent" />
                    Expedition Volumes
                  </h4>
                  <ul className="space-y-2.5 font-sans text-xs tracking-wider normal-case text-primary/80">
                    <li>
                      <Link href="/knowledge/yukon-expedition" className="hover:text-[#7d603a] hover:underline block py-0.5">
                        Yukon: Sub-Arctic Corridor
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/bhutan-expedition" className="hover:text-[#7d603a] hover:underline block py-0.5">
                        Bhutanese Mountain Mastery
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/patagonia-expedition" className="hover:text-[#7d603a] hover:underline block py-0.5">
                        Patagonia Steppe Vanguard
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/nomad-games" className="hover:text-[#7d603a] hover:underline block py-0.5">
                        World Nomad Games
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Tactical Studies */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 flex items-center gap-1.5 font-sans">
                    <BookOpen className="w-4 h-4 text-accent" />
                    Tactical Monographs (Level 2)
                  </h4>
                  <ul className="space-y-2.5 font-sans text-xs tracking-wider normal-case text-primary/80">
                    <li>
                      <Link href="/knowledge/yukon-expedition/navigation" className="hover:text-[#7d603a] hover:underline block py-0.5">
                        Northern Navigation &amp; Maps
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/yukon-expedition/sub-zero" className="hover:text-[#7d603a] hover:underline block py-0.5">
                        Sub-Zero Survival Archery
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/yukon-expedition/outpost" className="hover:text-[#7d603a] hover:underline block py-0.5">
                        Wilderness Outpost Isolation
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/east-archery/kyudo" className="hover:text-[#7d603a] hover:underline block py-0.5">
                        Kyudo: Mindful Path of the Bow
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 4: Promo Card */}
                <div className="relative bg-[#0e3b2e] text-secondary rounded-2xl p-6 overflow-hidden flex flex-col justify-between shadow-inner h-[220px]">
                  <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0" style={{ backgroundImage: "url('https://images.pexels.com/photos/36919857/pexels-photo-36919857.jpeg')" }}></div>
                  <div className="relative z-10 space-y-2">
                    <span className="text-[9px] text-accent font-serif font-bold tracking-widest uppercase block">
                      Featured Monograph
                    </span>
                    <h5 className="text-sm font-serif font-bold text-white leading-snug line-clamp-2">
                      Eastern Archery Lineages
                    </h5>
                    <p className="text-[10px] text-white/70 font-sans leading-relaxed line-clamp-2">
                      Comprehensive immersion into the meditative and martial archery traditions of Asia.
                    </p>
                  </div>
                  <Link
                    href="/knowledge/east-archery"
                    className="relative z-10 inline-block text-center py-2.5 bg-accent hover:bg-accent/90 text-primary font-serif font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all"
                  >
                    Read Monograph
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* About Mega Menu Trigger (Hover active) */}
          <li className="group h-full flex items-center static">
            <Link
              href="/about"
              className={`hover:text-accent transition-colors py-2 border-b-2 flex items-center gap-1 cursor-pointer ${
                pathname.startsWith("/about") ? "border-accent text-accent font-semibold" : "border-transparent text-primary/90"
              }`}
            >
              About
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </Link>

            {/* ABOUT MEGA MENU CONTAINER */}
            <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-primary/5 border-b border-primary/10 rounded-b-3xl shadow-2xl opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-40">
              <div className="max-w-7xl mx-auto px-12 py-10 grid grid-cols-12 gap-8 items-stretch">
                
                {/* Column 1: Navigation Links (span 4) */}
                <div className="col-span-4 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 flex items-center gap-1.5 font-sans">
                    <BookOpen className="w-4 h-4" />
                    Academy Overview
                  </h4>
                  <ul className="space-y-3 font-sans text-xs tracking-wider normal-case text-primary/80">
                    <li>
                      <Link href="/about" className="hover:text-accent transition-colors block py-0.5 font-semibold text-primary">
                        Academy Profile
                      </Link>
                      <p className="text-[10px] text-primary/55 font-sans font-light mt-0.5">Learn about our mission, focus, and training landscapes.</p>
                    </li>
                    <li>
                      <Link href="/about/jan-franko" className="hover:text-accent transition-colors block py-0.5 font-semibold text-primary">
                        Jan Franko (Instructor)
                      </Link>
                      <p className="text-[10px] text-primary/55 font-sans font-light mt-0.5">Explore the chronology and martial bow studies of our founder.</p>
                    </li>
                    <li>
                      <Link href="/about/partners" className="hover:text-accent transition-colors block py-0.5 font-semibold text-primary">
                        Partners &amp; Bowyers
                      </Link>
                      <p className="text-[10px] text-primary/55 font-sans font-light mt-0.5">Vetted partners who supply custom gear to the academy.</p>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-accent transition-colors block py-0.5 font-semibold text-primary">
                        Inquiries &amp; Contacts
                      </Link>
                      <p className="text-[10px] text-primary/55 font-sans font-light mt-0.5">Get in touch to register for upcoming courses.</p>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Designed Contact Info Card (span 4) */}
                <div className="col-span-4 bg-[#0e3b2e] rounded-2xl p-5 text-white flex flex-col justify-between space-y-4 shadow-inner">
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-widest text-accent font-bold font-sans">
                      Academy Base
                    </span>
                    <h5 className="font-serif text-lg font-bold leading-snug">
                      Get in Touch
                    </h5>
                    <div className="space-y-2.5 text-xs text-white/80 font-sans">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>Tirol, Austria &amp; Košice, Slovakia</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                        <a href="mailto:janfranko@tutanota.com" className="hover:text-accent transition-colors">
                          janfranko@tutanota.com
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                        <a href="https://wa.me/436641645360" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                          +43 664 164 53 60
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-block text-center py-2 bg-accent hover:bg-accent/90 text-primary font-serif font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all"
                  >
                    Direct Inquiries
                  </Link>
                </div>

                {/* Column 3: Social Links Card with Brandfetch Icons (span 4) */}
                <div className="col-span-4 bg-white border border-primary/5 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-widest text-[#7d603a] font-bold font-sans">
                      Social Channels
                    </span>
                    <h5 className="font-serif text-base font-bold text-primary leading-snug">
                      Connect Globally
                    </h5>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <a
                        href="https://www.facebook.com/share/16uZNxRu4R/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#f4f1e8] hover:bg-[#ebd9bd]/25 px-3 py-2 rounded-xl text-[10px] font-sans font-medium text-primary hover:text-accent transition-colors group"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 transition-colors">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </a>
                      <a
                        href="https://www.linkedin.com/in/jan-franko/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#f4f1e8] hover:bg-[#ebd9bd]/25 px-3 py-2 rounded-xl text-[10px] font-sans font-medium text-primary hover:text-accent transition-colors group"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 transition-colors">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                        </svg>
                        LinkedIn
                      </a>
                      <a
                        href="https://wa.me/436641645360"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#f4f1e8] hover:bg-[#ebd9bd]/25 px-3 py-2 rounded-xl text-[10px] font-sans font-medium text-primary hover:text-accent transition-colors group"
                      >
                        <svg viewBox="0 0 345.24 345.24" fill="currentColor" className="w-4 h-4 shrink-0 transition-colors">
                          <path d="M172.51,0C78.22,0,1.47,76.74,1.43,171.06c-.01,30.15,7.87,59.58,22.84,85.52L0,345.24l90.69-23.79c24.99,13.63,53.12,20.81,81.75,20.82h.07c94.28,0,171.03-76.75,171.07-171.07,.02-45.71-17.76-88.69-50.06-121.02C261.22,17.84,218.27,.02,172.51,0Zm0,313.38h-.06c-25.51,0-50.54-6.87-72.37-19.82l-5.19-3.08-53.81,14.12,14.36-52.47-3.38-5.38c-14.23-22.64-21.75-48.81-21.74-75.67,.03-78.4,63.82-142.18,142.25-142.18,37.98,.01,73.68,14.82,100.52,41.7,26.85,26.87,41.62,62.6,41.61,100.59-.03,78.4-63.82,142.19-142.19,142.19Zm77.99-106.49c-4.27-2.14-25.29-12.48-29.21-13.91-3.92-1.43-6.77-2.14-9.62,2.14-2.85,4.28-11.04,13.91-13.53,16.76-2.49,2.86-4.99,3.21-9.26,1.07-4.27-2.14-18.05-6.66-34.37-21.22-12.71-11.33-21.29-25.33-23.78-29.61-2.49-4.28-.27-6.59,1.88-8.72,1.92-1.91,4.27-4.99,6.41-7.49,2.14-2.5,2.85-4.28,4.27-7.14,1.42-2.85,.71-5.35-.36-7.49-1.07-2.14-9.62-23.18-13.18-31.74-3.47-8.33-6.99-7.21-9.62-7.34-2.49-.13-5.34-.15-8.19-.15s-7.48,1.07-11.4,5.35c-3.92,4.28-14.96,14.62-14.96,35.66s15.32,41.37,17.45,44.22c2.14,2.85,30.14,46.03,73.02,64.54,10.2,4.4,18.16,7.03,24.37,9,10.24,3.25,19.56,2.79,26.92,1.69,8.21-1.23,25.29-10.34,28.85-20.33,3.56-9.98,3.56-18.54,2.49-20.33-1.07-1.78-3.92-2.85-8.19-4.99Z"/>
                        </svg>
                        WhatsApp
                      </a>
                      <a
                        href="https://t.me/ExplorerAdventuresJF"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#f4f1e8] hover:bg-[#ebd9bd]/25 px-3 py-2 rounded-xl text-[10px] font-sans font-medium text-primary hover:text-accent transition-colors group"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 transition-colors">
                          <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.16-.22 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.577.192l-8.533 7.703-.33 4.953c.485 0 .7-.223.97-.485l2.33-2.266 4.85 3.582c.893.492 1.535.24 1.758-.823l3.18-15c.325-1.305-.5-1.9-.136-1.5z"/>
                        </svg>
                        Telegram
                      </a>
                    </div>
                  </div>
                  <p className="text-[9px] text-[#7d603a] font-serif italic leading-relaxed">
                    * Follow our expeditions and traditional bow reviews live from the field.
                  </p>
                </div>

              </div>
            </div>
          </li>

          {/* Desktop Language Selector Mega Menu */}
          <li className="group h-full flex items-center static notranslate">
            <div
              className={`hover:text-accent transition-colors py-2 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                currentLang !== "en" ? "border-accent text-accent font-semibold" : "border-transparent text-primary/90"
              }`}
            >
              <img
                src={`https://flagcdn.com/w40/${LANGUAGES.find((l) => l.code === currentLang)?.flagCode || "gb"}.png`}
                width="27"
                height="18"
                alt=""
                className="object-contain shrink-0 rounded-sm"
              />
              <span>{currentLang.toUpperCase()}</span>
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 text-accent" />
            </div>

            {/* LANGUAGES MEGA MENU CONTAINER */}
            <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-primary/5 border-b border-primary/10 rounded-b-3xl shadow-2xl opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-40">
              <div className="max-w-7xl mx-auto px-12 py-8 grid grid-cols-4 gap-6 items-stretch">
                {LANGUAGE_COLUMNS.map((col, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-2 font-sans">
                      {col.title}
                    </h4>
                    <ul className="space-y-1 font-sans text-xs tracking-wider normal-case text-primary/80">
                      {col.codes.map((code) => {
                        const lang = LANGUAGES.find((l) => l.code === code);
                        if (!lang) return null;
                        return (
                          <li key={code}>
                            <button
                              onClick={() => handleLanguageChange(code)}
                              className={`w-full text-left py-1.5 px-2 rounded-xl hover:bg-secondary/40 transition-colors flex items-center gap-2 ${
                                currentLang === code ? "text-accent font-semibold bg-secondary/35" : "text-primary/70"
                              }`}
                            >
                              <img
                                src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
                                width="27"
                                height="18"
                                alt=""
                                className="object-contain shrink-0 rounded-sm"
                              />
                              <span>{lang.name}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </li>
        </ul>

        {/* Hamburger Menu Icon (Mobile/Tablet Viewports) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-full border border-primary/10 hover:border-primary/30 text-primary cursor-pointer transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* 2. MOBILE NAVIGATION SLIDING DRAWER */}
        <div
          className={`fixed top-20 right-0 h-[calc(100vh-80px)] w-full sm:w-[350px] bg-secondary border-l border-primary/10 shadow-2xl z-50 transform transition-all duration-300 ease-in-out lg:hidden flex flex-col justify-between overflow-y-auto ${
            isOpen ? "translate-x-0 opacity-100 visible pointer-events-auto" : "translate-x-full opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* Navigation Links */}
          <div className="p-6 space-y-6">
            <ul className="space-y-5 font-serif text-sm tracking-widest uppercase">
              <li>
                <Link
                  href="/"
                  className={`block py-1 font-bold ${pathname === "/" ? "text-[#7d603a]" : "text-primary/90 hover:text-[#7d603a] transition-colors"}`}
                >
                  Home
                </Link>
              </li>

              {/* Collapsible Academy Accordion */}
              <li className="space-y-3">
                <div className="flex items-center justify-between py-1 group">
                  <Link
                    href="/academy"
                    className={`flex-1 uppercase tracking-widest font-bold ${pathname.startsWith("/academy") || pathname === "/archery-games" ? "text-[#7d603a]" : "text-primary/90 hover:text-[#7d603a] transition-colors"}`}
                  >
                    Academy
                  </Link>
                  <button
                    onClick={() => setIsAcademyMobileOpen(!isAcademyMobileOpen)}
                    className="p-1.5 -mr-1 text-primary/70 bg-primary/5 hover:bg-[#ebd9bd]/50 group-hover:bg-[#ebd9bd]/30 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isAcademyMobileOpen ? "rotate-180 text-[#7d603a]" : ""}`}
                    />
                  </button>
                </div>

                {isAcademyMobileOpen && (
                  <div className="pl-4 border-l border-primary/10 space-y-2 pt-1 pb-3 font-sans text-xs tracking-wide normal-case animate-in slide-in-from-top-2 duration-200">
                    <Link href="/academy" className="hover:text-[#7d603a] block py-1 font-bold">
                      The Academy Hub
                    </Link>
                    <Link href="/academy/certification" className="hover:text-[#7d603a] block py-1">
                      Certification &amp; Audit
                    </Link>
                    <Link href="/academy/explorer-rank-system" className="hover:text-[#7d603a] block py-1">
                      Explorer Rank System
                    </Link>
                    <Link href="/academy/summit-protocol" className="hover:text-[#7d603a] block py-1">
                      Summit Protocol (Tier III)
                    </Link>
                    <Link href="/academy/environmental-stress-index-esi" className="hover:text-[#7d603a] block py-1">
                      Environmental Stress Index (ESI)
                    </Link>
                    <Link href="/academy/code-of-conduct" className="hover:text-[#7d603a] block py-1">
                      Code of Conduct &amp; Neutrality
                    </Link>
                    <Link href="/archery-games" className="hover:text-[#7d603a] block py-1 font-bold text-[#7d603a]">
                      Archery Games &amp; Events
                    </Link>
                  </div>
                )}
              </li>

              {/* Collapsible Programs Accordion */}
              <li className="space-y-3">
                <div className="flex items-center justify-between py-1 group">
                  <Link
                    href="/programs"
                    className={`flex-1 uppercase tracking-widest font-bold ${pathname === "/programs" ? "text-[#7d603a]" : "text-primary/90 hover:text-[#7d603a] transition-colors"}`}
                  >
                    Programs
                  </Link>
                  <button
                    onClick={() => setIsProgramsMobileOpen(!isProgramsMobileOpen)}
                    className="p-1.5 -mr-1 text-primary/70 bg-primary/5 hover:bg-[#ebd9bd]/50 group-hover:bg-[#ebd9bd]/30 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isProgramsMobileOpen ? "rotate-180 text-[#7d603a]" : ""}`}
                    />
                  </button>
                </div>

                {isProgramsMobileOpen && (
                  <div className="pl-4 border-l border-primary/10 space-y-4 pt-1 pb-3 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Types Subgroup */}
                    <div className="space-y-1.5">
                      <button
                        onClick={() => toggleSubgroup("prog-types")}
                        className="w-full flex justify-between items-center text-xs font-serif font-bold text-[#7d603a] tracking-wider uppercase py-1 hover:opacity-85 text-left cursor-pointer group"
                      >
                        <span>Types</span>
                        <ChevronDown
                          className={`w-5 h-5 p-0.5 text-primary/50 bg-primary/5 group-hover:bg-[#ebd9bd]/50 rounded-md transition-all duration-200 ${openSubgroups["prog-types"] ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openSubgroups["prog-types"] && (
                        <ul className="space-y-1.5 pl-2 font-sans text-xs tracking-wide text-primary/80 font-medium normal-case animate-in slide-in-from-top-1 duration-150">
                          {types.map((t) => (
                            <li key={t.id}>
                              <Link href={`/programs?program_type=${t.slug}`} className="hover:text-[#7d603a] block py-1 transition-colors">
                                {t.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Skill Levels Subgroup */}
                    <div className="space-y-1.5">
                      <button
                        onClick={() => toggleSubgroup("prog-skills")}
                        className="w-full flex justify-between items-center text-xs font-serif font-bold text-[#7d603a] tracking-wider uppercase py-1 hover:opacity-85 text-left cursor-pointer group"
                      >
                        <span>Skill Levels</span>
                        <ChevronDown
                          className={`w-5 h-5 p-0.5 text-primary/50 bg-primary/5 group-hover:bg-[#ebd9bd]/50 rounded-md transition-all duration-200 ${openSubgroups["prog-skills"] ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openSubgroups["prog-skills"] && (
                        <ul className="space-y-1.5 pl-2 font-sans text-xs tracking-wide text-primary/80 font-medium normal-case animate-in slide-in-from-top-1 duration-150">
                          {skills.map((s) => (
                            <li key={s.id}>
                              <Link href={`/programs?skill_level=${s.slug}`} className="hover:text-[#7d603a] block py-1 transition-colors">
                                {s.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Regions Subgroup */}
                    <div className="space-y-1.5">
                      <button
                        onClick={() => toggleSubgroup("prog-regions")}
                        className="w-full flex justify-between items-center text-xs font-serif font-bold text-[#7d603a] tracking-wider uppercase py-1 hover:opacity-85 text-left cursor-pointer group"
                      >
                        <span>Regions</span>
                        <ChevronDown
                          className={`w-5 h-5 p-0.5 text-primary/50 bg-primary/5 group-hover:bg-[#ebd9bd]/50 rounded-md transition-all duration-200 ${openSubgroups["prog-regions"] ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openSubgroups["prog-regions"] && (
                        <ul className="space-y-1.5 pl-2 font-sans text-xs tracking-wide text-primary/80 font-medium normal-case animate-in slide-in-from-top-1 duration-150">
                          {regions.map((r) => (
                            <li key={r.id}>
                              <Link href={`/programs?region=${r.slug}`} className="hover:text-[#7d603a] block py-1 transition-colors">
                                {r.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                  </div>
                )}
              </li>

              {/* Collapsible Equipment Accordion */}
              <li className="space-y-3">
                <div className="flex items-center justify-between py-1 group">
                  <Link
                    href="/equipment"
                    className={`flex-1 uppercase tracking-widest font-bold ${pathname.startsWith("/equipment") ? "text-[#7d603a]" : "text-primary/90 hover:text-[#7d603a] transition-colors"}`}
                  >
                    Equipment
                  </Link>
                  <button
                    onClick={() => setIsEquipmentMobileOpen(!isEquipmentMobileOpen)}
                    className="p-1.5 -mr-1 text-primary/70 bg-primary/5 hover:bg-[#ebd9bd]/50 group-hover:bg-[#ebd9bd]/30 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isEquipmentMobileOpen ? "rotate-180 text-[#7d603a]" : ""}`}
                    />
                  </button>
                </div>

                {isEquipmentMobileOpen && (
                  <div className="pl-4 border-l border-primary/10 space-y-4 pt-1 pb-3 animate-in slide-in-from-top-2 duration-200">
                    {topCats.map((parentCat) => {
                      const subs = equipmentCategories.filter((c) => c.parent === parentCat.id);
                      const key = `eq-cat-${parentCat.id}`;
                      
                      if (subs.length > 0) {
                        return (
                          <div key={parentCat.id} className="space-y-2">
                            <div className="flex items-center justify-between group">
                              <Link
                                href={`/equipment?category=${parentCat.slug}`}
                                className="flex-1 text-xs font-serif font-bold text-[#7d603a] tracking-wider uppercase hover:opacity-80 block"
                              >
                                {cleanTitle(parentCat.name)}
                              </Link>
                              <button
                                onClick={() => toggleSubgroup(key)}
                                className="p-1 -mr-0.5 text-primary/50 bg-primary/5 hover:bg-[#ebd9bd]/50 group-hover:bg-[#ebd9bd]/30 rounded-md cursor-pointer transition-all duration-200"
                              >
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform duration-300 ${openSubgroups[key] ? "rotate-180" : ""}`}
                                />
                              </button>
                            </div>
                            {openSubgroups[key] && (
                              <ul className="space-y-1.5 pl-2 font-sans text-xs tracking-wide text-primary/80 font-medium normal-case animate-in slide-in-from-top-1 duration-150">
                                <li>
                                  <Link href={`/equipment?category=${parentCat.slug}`} className="hover:text-[#7d603a] block py-1 transition-colors font-semibold">
                                    All {cleanTitle(parentCat.name)}
                                  </Link>
                                </li>
                                {subs.slice(0, 5).map((sub) => (
                                  <li key={sub.id}>
                                    <Link href={`/equipment?category=${sub.slug}`} className="hover:text-[#7d603a] block py-1 transition-colors">
                                      {cleanTitle(sub.name)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      } else {
                        // Categories with no sub-categories render as single direct redirect links
                        return (
                          <div key={parentCat.id} className="py-1">
                            <Link
                              href={`/equipment?category=${parentCat.slug}`}
                              className="text-xs font-serif font-bold text-[#7d603a] tracking-wider uppercase hover:opacity-85 block"
                            >
                              {cleanTitle(parentCat.name)}
                            </Link>
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </li>

              {/* Knowledge Accordion (Mobile) */}
              <li className="space-y-3">
                <div className="flex items-center justify-between py-1 group">
                  <Link
                    href="/knowledge"
                    className={`flex-1 uppercase tracking-widest font-bold ${pathname.startsWith("/knowledge") ? "text-[#7d603a]" : "text-primary/90 hover:text-[#7d603a] transition-colors"}`}
                  >
                    Knowledge
                  </Link>
                  <button
                    onClick={() => setIsKnowledgeMobileOpen(!isKnowledgeMobileOpen)}
                    className="p-1.5 -mr-1 text-primary/70 bg-primary/5 hover:bg-[#ebd9bd]/50 group-hover:bg-[#ebd9bd]/30 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isKnowledgeMobileOpen ? "rotate-180 text-[#7d603a]" : ""}`}
                    />
                  </button>
                </div>

                {isKnowledgeMobileOpen && (
                  <div className="pl-4 border-l border-primary/10 space-y-4 pt-1 pb-3 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Major Lineages Subgroup */}
                    <div className="space-y-1.5">
                      <button
                        onClick={() => toggleSubgroup("know-lineages")}
                        className="w-full flex justify-between items-center text-xs font-serif font-bold text-[#7d603a] tracking-wider uppercase py-1 hover:opacity-85 text-left cursor-pointer group"
                      >
                        <span>Major Lineages</span>
                        <ChevronDown
                          className={`w-5 h-5 p-0.5 text-primary/50 bg-primary/5 group-hover:bg-[#ebd9bd]/50 rounded-md transition-all duration-200 ${openSubgroups["know-lineages"] ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openSubgroups["know-lineages"] && (
                        <ul className="space-y-1.5 pl-2 font-sans text-xs tracking-wide text-primary/80 font-medium normal-case animate-in slide-in-from-top-1 duration-150">
                          <li>
                            <Link href="/knowledge/east-archery" className="hover:text-[#7d603a] block py-1 transition-colors">
                              Eastern Archery Lineages
                            </Link>
                          </li>
                          <li>
                            <Link href="/knowledge/composite-archery" className="hover:text-[#7d603a] block py-1 transition-colors">
                              Composite Archery
                            </Link>
                          </li>
                          <li>
                            <Link href="/knowledge/mongolia-expedition" className="hover:text-[#7d603a] block py-1 transition-colors">
                              Mongolia Expedition
                            </Link>
                          </li>
                          <li>
                            <Link href="/knowledge/cultural-legacy" className="hover:text-[#7d603a] block py-1 transition-colors">
                              Cultural Archery Legacy
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Expedition Volumes Subgroup */}
                    <div className="space-y-1.5">
                      <button
                        onClick={() => toggleSubgroup("know-volumes")}
                        className="w-full flex justify-between items-center text-xs font-serif font-bold text-[#7d603a] tracking-wider uppercase py-1 hover:opacity-85 text-left cursor-pointer group"
                      >
                        <span>Expedition Volumes</span>
                        <ChevronDown
                          className={`w-5 h-5 p-0.5 text-primary/50 bg-primary/5 group-hover:bg-[#ebd9bd]/50 rounded-md transition-all duration-200 ${openSubgroups["know-volumes"] ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openSubgroups["know-volumes"] && (
                        <ul className="space-y-1.5 pl-2 font-sans text-xs tracking-wide text-primary/80 font-medium normal-case animate-in slide-in-from-top-1 duration-150">
                          <li>
                            <Link href="/knowledge/yukon-expedition" className="hover:text-[#7d603a] block py-1 transition-colors">
                              Yukon: Sub-Arctic Corridor
                            </Link>
                          </li>
                          <li>
                            <Link href="/knowledge/bhutan-expedition" className="hover:text-[#7d603a] block py-1 transition-colors">
                              Bhutanese Mountain Mastery
                            </Link>
                          </li>
                          <li>
                            <Link href="/knowledge/patagonia-expedition" className="hover:text-[#7d603a] block py-1 transition-colors">
                              Patagonia Steppe Vanguard
                            </Link>
                          </li>
                          <li>
                            <Link href="/knowledge/nomad-games" className="hover:text-[#7d603a] block py-1 transition-colors">
                              World Nomad Games
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>

                  </div>
                )}
              </li>

              {/* Collapsible About Accordion (Mobile) */}
              <li className="space-y-3">
                <div className="flex items-center justify-between py-1 group">
                  <Link
                    href="/about"
                    className={`flex-1 uppercase tracking-widest font-bold ${pathname.startsWith("/about") || pathname === "/contact" ? "text-[#7d603a]" : "text-primary/90 hover:text-[#7d603a] transition-colors"}`}
                  >
                    About
                  </Link>
                  <button
                    onClick={() => setIsAboutMobileOpen(!isAboutMobileOpen)}
                    className="p-1.5 -mr-1 text-primary/70 bg-primary/5 hover:bg-[#ebd9bd]/50 group-hover:bg-[#ebd9bd]/30 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isAboutMobileOpen ? "rotate-180 text-[#7d603a]" : ""}`}
                    />
                  </button>
                </div>

                {isAboutMobileOpen && (
                  <div className="pl-4 border-l border-primary/10 space-y-4 pt-1 pb-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1.5">
                      <button
                        onClick={() => toggleSubgroup("about-academy")}
                        className="w-full flex justify-between items-center text-xs font-serif font-bold text-[#7d603a] tracking-wider uppercase py-1 hover:opacity-85 text-left cursor-pointer group"
                      >
                        <span>Academy</span>
                        <ChevronDown
                          className={`w-5 h-5 p-0.5 text-primary/50 bg-primary/5 group-hover:bg-[#ebd9bd]/50 rounded-md transition-all duration-200 ${openSubgroups["about-academy"] ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openSubgroups["about-academy"] && (
                        <ul className="space-y-1.5 pl-2 font-sans text-xs tracking-wide text-primary/80 font-medium normal-case animate-in slide-in-from-top-1 duration-150">
                          <li>
                            <Link href="/about" className="hover:text-[#7d603a] block py-1 transition-colors">
                              Academy Profile
                            </Link>
                          </li>
                          <li>
                            <Link href="/about/jan-franko" className="hover:text-[#7d603a] block py-1 transition-colors">
                              Jan Franko (Instructor)
                            </Link>
                          </li>
                          <li>
                            <Link href="/about/partners" className="hover:text-[#7d603a] block py-1 transition-colors">
                              Partners &amp; Bowyers
                            </Link>
                          </li>
                          <li>
                            <Link href="/contact" className="hover:text-[#7d603a] block py-1 transition-colors font-semibold">
                              Contact &amp; Inquiries
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </li>


            </ul>
          </div>

          {/* Quick Footer Promo */}
          <div className="p-6 bg-[#0e3b2e] text-white space-y-3">
            <span className="text-xs uppercase tracking-widest text-accent font-bold font-sans">
              Admission Office
            </span>
            <p className="text-xs text-white/80 font-sans leading-relaxed">
              Applications are reviewed on a rolling basis. Suitable fitness levels are required for Level 3/4.
            </p>
            <Link
              href="/programs"
              className="block text-center py-2.5 bg-accent text-primary font-serif font-bold text-xs tracking-wider uppercase rounded-lg transition-all"
            >
              All Directory Listings
            </Link>
          </div>
        </div>

      </nav>

      {/* After-Header Language Bar (Visible only on Mobile, placed below the main header line) */}
      <div className="lg:hidden w-full bg-[#ebd9bd]/15 border-t border-primary/10 py-2.5 px-6 flex justify-between items-center notranslate relative z-40">
        <span className="text-[10px] uppercase tracking-widest text-[#7d603a] font-bold font-sans">
          Select Language
        </span>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLangOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs text-primary/95 font-serif font-bold tracking-wider hover:text-accent focus:outline-none"
          >
            <img
              src={`https://flagcdn.com/w40/${LANGUAGES.find((l) => l.code === currentLang)?.flagCode || "gb"}.png`}
              width="27"
              height="18"
              alt=""
              className="object-contain shrink-0 rounded-sm"
            />
            <span>{currentLang.toUpperCase()}</span>
            <ChevronDown className="w-3.5 h-3.5 text-accent" />
          </button>

          {/* Full Screen Pop-up Overlay / Modal (visible when isLangOpen is true, portal-mounted to prevent offset constraints) */}
          {isLangOpen && mounted && createPortal(
            <div 
              onClick={() => setIsLangOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 notranslate"
            >
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-primary/5 flex justify-between items-center bg-[#f4f1e8]/50">
                  <h3 className="font-serif text-sm font-bold tracking-wider uppercase text-primary">
                    Select Language
                  </h3>
                  <button 
                    onClick={() => setIsLangOpen(false)}
                    className="p-1.5 rounded-full hover:bg-secondary/60 text-primary transition-colors focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body (Scrollable regions grid) */}
                <div className="p-5 overflow-y-auto space-y-6 max-h-[calc(80vh-80px)]">
                  {LANGUAGE_COLUMNS.map((col, idx) => (
                    <div key={idx} className="space-y-2.5">
                      <h4 className="text-[10px] uppercase tracking-widest text-[#7d603a] font-bold border-b border-primary/5 pb-1 font-sans">
                        {col.title}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {col.codes.map((code) => {
                          const lang = LANGUAGES.find((l) => l.code === code);
                          if (!lang) return null;
                          return (
                            <button
                              key={code}
                              onClick={() => {
                                handleLanguageChange(code);
                                setIsLangOpen(false);
                              }}
                              className={`text-left py-2 px-3 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-2.5 border ${
                                currentLang === code 
                                  ? "bg-[#0e3b2e] text-white font-bold border-[#0e3b2e]" 
                                  : "bg-[#f4f1e8] border-transparent text-primary/80 hover:bg-[#ebd9bd]/25"
                              }`}
                            >
                              <img
                                src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
                                width="27"
                                height="18"
                                alt=""
                                className="object-contain shrink-0 rounded-sm"
                              />
                              <span>{lang.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
