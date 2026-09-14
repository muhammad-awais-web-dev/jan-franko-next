"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Compass, ExternalLink, Settings2 } from "lucide-react";
import { SITE, TRAINING_LOCATIONS, ACADEMY_LINKS, PROGRAM_LINKS, EQUIPMENT_CATEGORIES } from "@/data/site";

const legalLinks = [
  { label: "Privacy Policy (GDPR)", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Payment Methods", href: "/payment-methods" },
  { label: "Shipping", href: "/shipping" },
  { label: "Legal Notice / Impressum", href: "/impressum" },
  { label: "Safety & Legal Overview", href: "/safety-legal-overview" },
] as const;

const Footer = () => {
  return (
    <footer className="w-full bg-[#0e3b2e] text-[#f0e9d9] border-t border-accent/10 relative overflow-hidden select-text">
      {/* Decorative radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,168,128,0.06),transparent_60%)] pointer-events-none" />

      {/* Main Grid Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8 lg:gap-10">
        
        {/* Column 1: Brand */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <p className="text-[10px] font-serif uppercase tracking-[0.25em] text-accent font-bold">
            Traditional Archery Exploration
          </p>
          <Link href="/" className="notranslate font-serif text-2xl font-bold tracking-tight text-white hover:text-accent transition-colors block" translate="no">
            {SITE.shortName}
          </Link>
          <p className="text-xs text-[#f0e9d9]/75 font-sans leading-relaxed max-w-sm font-medium">
            A global initiative dedicated to traditional archery research, cultural exploration, and field training rooted in documented traditions.
          </p>
          <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-accent font-bold">
            <Compass className="w-4 h-4 text-accent" />
            <span>Central Europe &amp; Eurasian steppes</span>
          </div>
        </div>

        {/* Column 2: Explorer Adventures */}
        <div className="space-y-3">
          <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-accent border-b border-white/10 pb-2">
            Explorer Adventures
          </h3>
          <ul className="space-y-2 text-xs font-sans font-medium text-[#f0e9d9]/75">
            {PROGRAM_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent transition-colors block py-0.5">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: The Academy */}
        <div className="space-y-3">
          <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-accent border-b border-white/10 pb-2">
            The Academy
          </h3>
          <ul className="space-y-2 text-xs font-sans font-medium text-[#f0e9d9]/75">
            {ACADEMY_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent transition-colors block py-0.5">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Equipment */}
        <div className="space-y-3">
          <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-accent border-b border-white/10 pb-2">
            Equipment
          </h3>
          <ul className="space-y-2 text-xs font-sans font-medium text-[#f0e9d9]/75">
            <li>
              <Link href="/equipment" className="hover:text-accent font-semibold text-white transition-colors block py-0.5">
                All Equipment
              </Link>
            </li>
            {EQUIPMENT_CATEGORIES.filter((c) => c.slug !== "master-bowyers" && c.slug !== "arrows-shafts").map((category) => (
              <li key={category.slug}>
                <Link href={`/equipment?category=${category.slug}`} className="hover:text-accent transition-colors block py-0.5">
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/equipment/arrow-configurator" className="font-semibold text-accent hover:text-white transition-colors block py-0.5">
                Custom Arrow Configurator
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Official Contact */}
        <div className="space-y-4">
          <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-accent border-b border-white/10 pb-2">
            Official Contact
          </h3>
          <ul className="space-y-3 text-xs font-sans text-[#f0e9d9]/80 font-medium">
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-start gap-2 hover:text-accent transition-colors">
                <Mail className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>{SITE.email}</span>
              </a>
            </li>
            <li>
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-accent transition-colors">
                <Phone className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>{SITE.phoneDisplay}</span>
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span>Tirol, Austria &amp; Košice, Slovakia</span>
            </li>
          </ul>
        </div>
      </div>

      {/* TRAINING LOCATIONS SECTION (6 Locations Grid matching exact design) */}
      <section className="relative border-t border-white/10 bg-black/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-serif uppercase tracking-[0.2em] text-accent font-bold">
                TRAINING LOCATIONS
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold text-white">
                Six training locations
              </h2>
            </div>
            <p className="text-xs text-white/55 font-sans">
              Map links open in a new tab.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TRAINING_LOCATIONS.map((location) => (
              <a
                key={location.name}
                href={location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-12 items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs transition-all hover:border-accent/50 hover:bg-white/10"
              >
                <span>
                  <strong className="text-white font-semibold notranslate" translate="no">{location.name}</strong>
                  <span className="ml-1.5 text-white/60">— {location.country}</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-accent transition-transform group-hover:scale-110" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM LEGAL LINKS & COOKIE SETTINGS BAR */}
      <div className="relative border-t border-white/10 px-6 md:px-12 py-6 bg-black/20 text-xs font-sans text-white/60">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} <span className="notranslate font-semibold" translate="no">{SITE.shortName} — Explorer Adventures</span>. All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]" aria-label="Legal links">
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-accent transition-colors">
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("jf:open-consent"))}
              className="flex items-center gap-1.5 font-semibold text-accent hover:text-white transition-colors"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Cookie settings
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
