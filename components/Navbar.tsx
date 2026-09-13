"use client";

/* External 40px flag assets intentionally use native img elements. */
/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Compass,
  ExternalLink,
  Globe2,
  GraduationCap,
  Hammer,
  Languages,
  Mail,
  Map,
  MapPin,
  Menu,
  Mountain,
  Phone,
  ScrollText,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { clientFetch } from "@/data/clientFetch";
import { readConsent } from "@/lib/consent";
import {
  EQUIPMENT_CATEGORIES,
  LANGUAGE_GROUPS,
  SITE,
  SUPPORTED_LANGUAGES,
} from "@/data/site";

declare global {
  interface Window {
    __MEGAMENU_READY?: boolean;
  }
}

type MenuName = "academy" | "programs" | "equipment" | "knowledge" | "about" | "language" | null;
type MobileSectionName = Exclude<MenuName, "language" | null> | null;
type TaxonomyTerm = { id: number; name: string; slug: string };

type MenuLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  protectedName?: boolean;
};

const DEFAULT_PROGRAM_TYPES: TaxonomyTerm[] = [
  { id: 189, name: "Cultural Immersion", slug: "cultural-immersion" },
  { id: 190, name: "Custom Private Program", slug: "custom-private-program" },
  { id: 191, name: "Expedition", slug: "expedition" },
  { id: 192, name: "Mounted Archery", slug: "equestrian-archery" },
  { id: 194, name: "Retreat", slug: "retreat" },
  { id: 193, name: "Training Program", slug: "training-program" },
];

const DEFAULT_SKILL_LEVELS: TaxonomyTerm[] = [
  { id: 195, name: "Level 1 – Introductory", slug: "introductory" },
  { id: 196, name: "Level 2 – Training", slug: "training" },
  { id: 197, name: "Level 3 – Expedition", slug: "expedition" },
  { id: 198, name: "Level 4 – Advanced Expedition", slug: "advanced-expedition" },
];

const DEFAULT_REGIONS: TaxonomyTerm[] = [
  { id: 211, name: "Alps", slug: "alps" },
  { id: 249, name: "Americas", slug: "americas" },
  { id: 247, name: "Asia", slug: "asia" },
  { id: 214, name: "Austria", slug: "austria" },
  { id: 215, name: "Brazil", slug: "brazil" },
  { id: 234, name: "Central Asia", slug: "central-asia" },
  { id: 227, name: "Central Europe", slug: "central-europe" },
  { id: 248, name: "Eurasia", slug: "eurasia" },
];

const ACADEMY_GROUPS: { title: string; icon: LucideIcon; links: MenuLink[] }[] = [
  {
    title: "Overview & Audit",
    icon: Compass,
    links: [
      { label: "The Academy Hub", href: "/academy", icon: GraduationCap },
      { label: "Certification & Audit", href: "/academy/certification", icon: ShieldCheck },
      { label: "Training Philosophy", href: "/academy/training-philosophy", icon: BookOpen },
    ],
  },
  {
    title: "Progression & Metrics",
    icon: Award,
    links: [
      { label: "Explorer Rank System", href: "/academy/explorer-rank-system", icon: Award },
      { label: "Archer's Virtues & Ranks", href: "/academy/archers-virtues", icon: ShieldCheck },
      { label: "The Raptor Path", href: "/academy/raptor-path", icon: Target },
      { label: "Environmental Stress Index (ESI)", href: "/academy/environmental-stress-index-esi", icon: Activity },
    ],
  },
  {
    title: "Governance & Gatherings",
    icon: BookOpen,
    links: [
      { label: "Summit Protocol (Tier III)", href: "/academy/summit-protocol", icon: Mountain },
      { label: "Code of Conduct & Neutrality", href: "/academy/code-of-conduct", icon: ScrollText },
      { label: "Special Practice Retreats", href: "/academy/special-practice-retreats", icon: CalendarDays },
      { label: "Archery Games & Events", href: "/archery-games", icon: CalendarDays },
    ],
  },
];

const KNOWLEDGE_GROUPS: { title: string; icon: LucideIcon; links: MenuLink[] }[] = [
  {
    title: "Major Lineages (Level 1)",
    icon: Compass,
    links: [
      { label: "Eastern Archery Lineages", href: "/knowledge/east-archery", icon: Compass },
      { label: "Composite Archery", href: "/knowledge/composite-archery", icon: Target },
      { label: "Mongolia Expedition", href: "/knowledge/mongolia-expedition", icon: MapPin },
      { label: "Cultural Archery Legacy", href: "/knowledge/cultural-legacy", icon: BookOpen },
    ],
  },
  {
    title: "Expedition Volumes",
    icon: MapPin,
    links: [
      { label: "Yukon: Sub-Arctic Corridor", href: "/knowledge/yukon-expedition", icon: Mountain },
      { label: "Bhutanese Mountain Mastery", href: "/knowledge/bhutan-expedition", icon: Mountain },
      { label: "Patagonia Steppe Vanguard", href: "/knowledge/patagonia-expedition", icon: Map },
      { label: "World Nomad Games", href: "/knowledge/nomad-games", icon: Award },
    ],
  },
  {
    title: "Tactical Monographs (Level 2)",
    icon: BookOpen,
    links: [
      { label: "Northern Navigation & Maps", href: "/knowledge/yukon-expedition/navigation", icon: Map },
      { label: "Sub-Zero Survival Archery", href: "/knowledge/yukon-expedition/sub-zero", icon: Target },
      { label: "Wilderness Outpost Isolation", href: "/knowledge/yukon-expedition/outpost", icon: Mountain },
      { label: "Kyudo: Mindful Path of the Bow", href: "/knowledge/east-archery/kyudo", icon: Target },
    ],
  },
];

const BOWYER_LINKS: MenuLink[] = [
  { label: "Harvey Archery — Warrick Harvey", href: "/bowyer/warrick-harvey", icon: Hammer, protectedName: true },
  { label: "Kadys Bows — Sergey Tolochko", href: "/bowyer/kadys-bows", icon: Hammer, protectedName: true },
  { label: "MR Bows — Miško Rovčanin", href: "/bowyer/mr-bows", icon: Hammer, protectedName: true },
];

const FLAG_CODES: Record<string, string> = {
  en: "gb",
  de: "de",
  sk: "sk",
  cs: "cz",
  pl: "pl",
  es: "es",
  fr: "fr",
  it: "it",
  pt: "pt",
  uk: "ua",
  ru: "ru",
  hu: "hu",
  ro: "ro",
  bg: "bg",
  el: "gr",
  hy: "am",
  ka: "ge",
  et: "ee",
  lv: "lv",
  lt: "lt",
  no: "no",
  sv: "se",
  fi: "fi",
  da: "dk",
  is: "is",
  ja: "jp",
  mn: "mn",
  ko: "kr",
  "zh-CN": "cn",
  th: "th",
  vi: "vn",
  tl: "ph",
  am: "et",
  dz: "bt",
};

function languageCodeLabel(code: string) {
  return code === "zh-CN" ? "ZH" : code.toUpperCase();
}

function LanguageFlag({ code, className = "" }: { code: string; className?: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${FLAG_CODES[code] || "gb"}.png`}
      width="28"
      height="19"
      alt=""
      aria-hidden="true"
      className={`h-[19px] w-7 rounded-[4px] border border-black/5 object-cover shadow-sm ${className}`}
    />
  );
}

function MenuItem({ item }: { item: MenuLink }) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className="group/item flex min-h-12 items-center gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-[#eef5f1] focus-visible:bg-[#eef5f1]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f2ed] text-[#0e624b] transition group-hover/item:bg-white">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span
          className={`min-w-0 flex-1 text-[13px] font-semibold leading-snug text-[#173b31] ${item.protectedName ? "notranslate" : ""}`}
          translate={item.protectedName ? "no" : undefined}
        >
          {item.label}
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-[#69ad96] transition-transform group-hover/item:translate-x-0.5" aria-hidden="true" />
      </Link>
    </li>
  );
}

function MenuGroup({ title, icon: Icon, children, className = "" }: { title: string; icon: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-[#0e3b2e]/10 bg-white p-3.5 ${className}`}>
      <div className="mb-2.5 flex items-center gap-2 border-b border-[#0e3b2e]/10 px-1 pb-3">
        <Icon className="h-4 w-4 text-[#0e624b]" aria-hidden="true" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#1d5b49]">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function FeatureCard({
  image,
  imageAlt,
  badge,
  title,
  description,
  href,
  cta,
  protectedTitle = false,
}: {
  image: string;
  imageAlt: string;
  badge: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  protectedTitle?: boolean;
}) {
  return (
    <article className="relative min-h-[360px] overflow-hidden rounded-2xl bg-[#092a21]">
      <Image src={image} alt={imageAlt} fill sizes="(max-width: 1280px) 30vw, 350px" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#051713] via-[#051713]/68 to-[#051713]/14" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <span className="mb-3 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] backdrop-blur-sm">
          {badge}
        </span>
        <h2 className={`max-w-xs text-[1.65rem] font-bold leading-[1.08] ${protectedTitle ? "notranslate" : ""}`} translate={protectedTitle ? "no" : undefined}>
          {title}
        </h2>
        <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/78">{description}</p>
        <Link href={href} className="mt-5 inline-flex w-fit items-center gap-2 text-xs font-bold text-[#ead2a9] transition hover:text-white">
          {cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function MegaPanel({
  children,
  feature,
  footerText,
  footerHref,
  footerLabel,
}: {
  children: ReactNode;
  feature: ReactNode;
  footerText: string;
  footerHref: string;
  footerLabel: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[#0e3b2e]/12 bg-[#f9fbf9] p-3.5 text-left shadow-[0_24px_70px_rgba(4,35,27,0.2)]">
      <div className="grid gap-3 lg:grid-cols-[minmax(250px,0.9fr)_minmax(0,2.45fr)]">
        {feature}
        <div className="grid min-w-0 gap-3 lg:grid-cols-3">{children}</div>
      </div>
      <div className="mt-3 flex min-h-12 items-center justify-between gap-4 rounded-2xl border border-[#0e3b2e]/9 bg-[#f1f6f3] px-4 py-2.5">
        <p className="text-[11px] font-medium text-[#31594d]">{footerText}</p>
        <Link href={footerHref} className="inline-flex min-h-9 shrink-0 items-center rounded-xl border border-[#0e3b2e]/13 bg-white px-4 text-[11px] font-bold text-[#174f3f] transition hover:border-[#0e624b]/40 hover:bg-[#0e624b] hover:text-white">
          {footerLabel}
        </Link>
      </div>
    </div>
  );
}

function DesktopMegaMenu({
  id,
  label,
  href,
  isCurrent,
  activeMenu,
  setActiveMenu,
  onEnter,
  onLeave,
  children,
}: {
  id: Exclude<MenuName, "language" | null>;
  label: string;
  href: string;
  isCurrent: boolean;
  activeMenu: MenuName;
  setActiveMenu: (menu: MenuName) => void;
  onEnter: (menu: MenuName) => void;
  onLeave: () => void;
  children: ReactNode;
}) {
  const open = activeMenu === id;
  return (
    <li className="static flex h-full items-center" onMouseEnter={() => onEnter(id)} onMouseLeave={onLeave} onFocusCapture={() => onEnter(id)}>
      <div className={`flex min-h-11 items-center rounded-xl px-2 transition ${open ? "bg-[#0e3b2e]/6" : "hover:bg-[#0e3b2e]/5"}`}>
        <Link href={href} aria-current={isCurrent ? "page" : undefined} className={`text-[11px] font-bold uppercase tracking-[0.11em] transition ${isCurrent ? "text-[#7d603a]" : "text-[#173b31] hover:text-[#7d603a]"}`}>
          {label}
        </Link>
        <button
          type="button"
          aria-label={`${open ? "Close" : "Open"} ${label} menu`}
          aria-expanded={open}
          aria-controls={`${id}-mega-menu`}
          className="ml-0.5 flex h-8 w-6 items-center justify-center rounded-md text-[#6f8f84] hover:text-[#0e624b]"
          onClick={() => setActiveMenu(open ? null : id)}
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div id={`${id}-mega-menu`} className="absolute left-1/2 top-[calc(100%-0.2rem)] z-50 w-[min(96vw,78rem)] -translate-x-1/2 pt-3">
          {children}
        </div>
      )}
    </li>
  );
}

function MobileSection({
  id,
  label,
  href,
  open,
  active,
  onToggle,
  children,
}: {
  id: Exclude<MobileSectionName, null>;
  label: string;
  href: string;
  open: boolean;
  active: boolean;
  onToggle: (id: Exclude<MobileSectionName, null>) => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#0e3b2e]/10 bg-white">
      <div className="flex min-h-14 items-center gap-2 px-4">
        <Link href={href} className={`min-w-0 flex-1 text-sm font-bold ${active ? "text-[#7d603a]" : "text-[#173b31]"}`}>{label}</Link>
        <button type="button" onClick={() => onToggle(id)} aria-expanded={open} aria-controls={`mobile-${id}`} aria-label={`${open ? "Close" : "Open"} ${label} links`} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef5f1] text-[#0e624b]">
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>
      {open && <div id={`mobile-${id}`} className="space-y-4 border-t border-[#0e3b2e]/9 bg-[#fbfcfb] p-4">{children}</div>}
    </section>
  );
}

function MobileLinkGroup({ title, links }: { title: string; links: MenuLink[] }) {
  return (
    <div>
      <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7d603a]">{title}</h3>
      <ul className="grid gap-1.5 sm:grid-cols-2">{links.map((item) => <MenuItem key={item.href + item.label} item={item} />)}</ul>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuName>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MobileSectionName>(null);
  const [mobileLanguageOpen, setMobileLanguageOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [mounted, setMounted] = useState(false);
  const [programTypes, setProgramTypes] = useState<TaxonomyTerm[]>(DEFAULT_PROGRAM_TYPES);
  const [skillLevels, setSkillLevels] = useState<TaxonomyTerm[]>(DEFAULT_SKILL_LEVELS);
  const [regions, setRegions] = useState<TaxonomyTerm[]>(DEFAULT_REGIONS);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- overlays must close after route changes */
    setActiveMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
    setMobileLanguageOpen(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- portal mounts only after hydration */
    setMounted(true);
    window.__MEGAMENU_READY = true;
    window.dispatchEvent(new Event("megamenu-ready"));

    const loadTaxonomies = async () => {
      try {
        const data = await clientFetch<{ types?: TaxonomyTerm[]; skills?: TaxonomyTerm[]; regions?: TaxonomyTerm[] }>("/api/nav-taxonomies");
        if (data.types?.length) setProgramTypes(data.types);
        if (data.skills?.length) setSkillLevels(data.skills);
        if (data.regions?.length) setRegions(data.regions);
      } catch {
        // The exact static menu from the pre-change build stays available offline.
      }
    };
    void loadTaxonomies();
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setActiveMenu(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setMobileOpen(false);
        setMobileLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    const checkCookie = () => {
      if (typeof document === "undefined") return;
      const cookies = document.cookie.split("; ");
      const transCookie = cookies.find((row) => row.startsWith("googtrans="));
      if (transCookie) {
        const parts = transCookie.split("=");
        if (parts.length > 1) {
          const val = decodeURIComponent(parts[1]);
          const lang = val.split("/").pop();
          if (lang) {
            setActiveLanguage(lang);
            return;
          }
        }
      }
      setActiveLanguage("en");
    };
    checkCookie();

    const interval = setInterval(checkCookie, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mobileOpen && !mobileLanguageOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileLanguageOpen, mobileOpen]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const openDesktopMenu = (menu: MenuName) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveMenu(menu);
  };

  const scheduleDesktopClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setActiveMenu(null), 140);
  };

  const requestLanguage = (language: string) => {
    const consent = readConsent();
    if (!consent?.functional && language !== "en") {
      setActiveMenu(null);
      setMobileLanguageOpen(false);
      window.dispatchEvent(
        new CustomEvent("jf:open-consent", {
          detail: { highlightFunctional: true },
        })
      );
      return;
    }

    document.cookie = `googtrans=/en/${language}; path=/;`;
    document.cookie = `googtrans=/en/${language}; path=/; domain=${window.location.hostname};`;

    setActiveLanguage(language);
    setActiveMenu(null);
    setMobileLanguageOpen(false);

    const select = document.querySelector("select.goog-te-combo") as HTMLSelectElement | null;
    if (select) {
      select.value = language;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  const toggleMobileSection = (section: Exclude<MobileSectionName, null>) => {
    setMobileSection((current) => current === section ? null : section);
  };

  const programTypeLinks: MenuLink[] = programTypes.map((term) => ({
    label: term.name,
    href: `/programs?program_type=${term.slug}`,
    icon: Compass,
  }));
  const skillLevelLinks: MenuLink[] = skillLevels.map((term) => ({
    label: term.name,
    href: `/programs?skill_level=${term.slug}`,
    icon: Award,
  }));
  const regionLinks: MenuLink[] = regions.map((term) => ({
    label: term.name,
    href: `/programs?region=${term.slug}`,
    icon: MapPin,
  }));
  const equipmentLinks: MenuLink[] = EQUIPMENT_CATEGORIES.filter((category) => category.slug !== "master-bowyers").map((category) => ({
    label: category.name,
    href: `/equipment?category=${category.slug}`,
    icon: category.slug === "bows" ? Target : category.slug === "training-kits" ? GraduationCap : SlidersHorizontal,
  }));
  const activeLanguageName = SUPPORTED_LANGUAGES.find((language) => language.code === activeLanguage)?.label || "English";

  return (
    <header ref={wrapperRef} className="sticky top-0 z-50 w-full border-b border-[#0e3b2e]/10 bg-[#f3eee2]/95 backdrop-blur-xl">
      <a href="#main-content" className="sr-only z-[120] rounded-xl bg-white px-4 py-3 text-[#0e3b2e] focus:not-sr-only focus:absolute focus:left-4 focus:top-4">Skip to main content</a>

      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="notranslate flex min-w-0 items-center" translate="no" aria-label="Jan Franko home">
          <Image src="/images/wp-assets/logo.png" alt="Jan Franko" width={190} height={54} priority className="h-11 w-auto object-contain sm:h-12" />
        </Link>

        <nav className="hidden h-full items-center lg:flex" aria-label="Primary navigation">
          <ul className="flex h-full items-center gap-0.5">
            <li className="flex h-full items-center">
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={`flex min-h-11 items-center rounded-xl px-3 text-[11px] font-bold uppercase tracking-[0.11em] transition hover:bg-[#0e3b2e]/5 ${pathname === "/" ? "text-[#7d603a]" : "text-[#173b31]"}`}>Home</Link>
            </li>

            <DesktopMegaMenu id="academy" label="Academy" href="/academy" isCurrent={pathname.startsWith("/academy") || pathname === "/archery-games"} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEnter={openDesktopMenu} onLeave={scheduleDesktopClose}>
              <MegaPanel
                feature={<FeatureCard image="/images/wp-assets/contact-bg.webp" imageAlt="Jan Franko practising traditional archery" badge="Academy Standard" title="Operational Verification" description="Mandatory safety audits and ESI environmental exposure metrics for all archers." href="/academy/certification" cta="View Certification" />}
                footerText="Mandatory safety audits and ESI environmental exposure metrics for all archers."
                footerHref="/academy"
                footerLabel="Academy Overview"
              >
                {ACADEMY_GROUPS.map((group) => <MenuGroup key={group.title} title={group.title} icon={group.icon}><ul className="space-y-1">{group.links.map((item) => <MenuItem key={item.href} item={item} />)}</ul></MenuGroup>)}
              </MegaPanel>
            </DesktopMegaMenu>

            <DesktopMegaMenu id="programs" label="Programs" href="/programs" isCurrent={pathname === "/programs"} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEnter={openDesktopMenu} onLeave={scheduleDesktopClose}>
              <MegaPanel
                feature={<FeatureCard image="/images/og-bg-expedition.jpg" imageAlt="Traditional archer overlooking a mountain expedition landscape" badge="Featured Expedition" title="Inner Mongolia Steppe Camp" description="Immersive horse archery and traditional archery training in the grasslands of China." href="/programs?open=inner-mongolia-steppe-horse-archery-camp" cta="View Expedition" />}
                footerText="Applications are reviewed on a rolling basis. Suitable fitness levels are required for Level 3/4."
                footerHref="/programs"
                footerLabel="All Directory Listings"
              >
                <MenuGroup title="Program Types" icon={Compass}><ul className="space-y-1">{programTypeLinks.map((item) => <MenuItem key={item.href} item={item} />)}</ul></MenuGroup>
                <MenuGroup title="Skill Levels" icon={Award}><ul className="space-y-1">{skillLevelLinks.map((item) => <MenuItem key={item.href} item={item} />)}</ul></MenuGroup>
                <MenuGroup title={`Regions (${regions.length})`} icon={MapPin}><ul className="max-h-[310px] space-y-1 overflow-y-auto pr-1">{regionLinks.map((item) => <MenuItem key={item.href} item={item} />)}</ul></MenuGroup>
              </MegaPanel>
            </DesktopMegaMenu>

            <DesktopMegaMenu id="equipment" label="Equipment" href="/equipment" isCurrent={pathname.startsWith("/equipment") || pathname.startsWith("/bowyer")} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEnter={openDesktopMenu} onLeave={scheduleDesktopClose}>
              <MegaPanel
                feature={<FeatureCard image="/images/og-bg-workshop.jpg" imageAlt="Traditional bowyer workshop with bow-making tools" badge="Vetted Guild" title="Master Bowyers" description="Harvey Archery · Kadys Bows · MR Bows" href="/about/partners" cta="Partners & Bowyers" />}
                footerText="Custom Arrow Builder · Master Bowyers"
                footerHref="/equipment"
                footerLabel="Equipment"
              >
                <MenuGroup title="Equipment Departments" icon={Target}><ul className="space-y-1">{equipmentLinks.map((item) => <MenuItem key={item.href} item={item} />)}</ul></MenuGroup>
                <MenuGroup title="Interactive Tools & Audit" icon={SlidersHorizontal}><ul className="space-y-1"><MenuItem item={{ label: "Custom Arrow Builder", href: "/equipment/arrow-configurator", icon: SlidersHorizontal }} /><MenuItem item={{ label: "Bow Verification Register", href: "/equipment/verification", icon: ShieldCheck }} /></ul></MenuGroup>
                <MenuGroup title="Master Bowyers" icon={Hammer}><ul className="space-y-1">{BOWYER_LINKS.map((item) => <MenuItem key={item.href} item={item} />)}</ul></MenuGroup>
              </MegaPanel>
            </DesktopMegaMenu>

            <DesktopMegaMenu id="knowledge" label="Knowledge" href="/knowledge" isCurrent={pathname.startsWith("/knowledge")} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEnter={openDesktopMenu} onLeave={scheduleDesktopClose}>
              <MegaPanel
                feature={<FeatureCard image="/images/wp-assets/jan-franko-profile.jpeg" imageAlt="Jan Franko practising traditional archery in a forest" badge="Featured Monograph" title="Eastern Archery Lineages" description="Comprehensive immersion into the meditative and martial archery traditions of Asia." href="/knowledge/east-archery" cta="Read Monograph" />}
                footerText="Comprehensive immersion into the meditative and martial archery traditions of Asia."
                footerHref="/knowledge"
                footerLabel="Knowledge"
              >
                {KNOWLEDGE_GROUPS.map((group) => <MenuGroup key={group.title} title={group.title} icon={group.icon}><ul className="space-y-1">{group.links.map((item) => <MenuItem key={item.href} item={item} />)}</ul></MenuGroup>)}
              </MegaPanel>
            </DesktopMegaMenu>

            <DesktopMegaMenu id="about" label="About" href="/about" isCurrent={pathname.startsWith("/about") || pathname === "/contact"} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEnter={openDesktopMenu} onLeave={scheduleDesktopClose}>
              <MegaPanel
                feature={<FeatureCard image="/images/wp-assets/founder-gallery-1.png" imageAlt="Jan Franko in traditional archery attire" badge="Academy Profile" title="Jan Franko" description="Explore the chronology and martial bow studies of our founder." href="/about/jan-franko" cta="Jan Franko (Instructor)" protectedTitle />}
                footerText="Follow our expeditions and traditional bow reviews live from the field."
                footerHref="/contact"
                footerLabel="Direct Inquiries"
              >
                <MenuGroup title="Academy Overview" icon={BookOpen}>
                  <ul className="space-y-1">
                    <MenuItem item={{ label: "Academy Profile", href: "/about", icon: GraduationCap }} />
                    <MenuItem item={{ label: "Jan Franko (Instructor)", href: "/about/jan-franko", icon: UserRound, protectedName: true }} />
                    <MenuItem item={{ label: "Partners & Bowyers", href: "/about/partners", icon: UsersRound }} />
                    <MenuItem item={{ label: "Inquiries & Contacts", href: "/contact", icon: Mail }} />
                  </ul>
                </MenuGroup>
                <MenuGroup title="Academy Base" icon={MapPin}>
                  <ul className="space-y-1 text-[12px] text-[#31594d]">
                    <li className="flex min-h-12 items-center gap-3 rounded-xl px-2.5 py-2"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f2ed] text-[#0e624b]"><MapPin className="h-4 w-4" /></span><span>Tirol, Austria &amp; Košice, Slovakia</span></li>
                    <li><a href={`mailto:${SITE.email}`} className="flex min-h-12 items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-[#eef5f1]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f2ed] text-[#0e624b]"><Mail className="h-4 w-4" /></span><span>{SITE.email}</span></a></li>
                    <li><a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-[#eef5f1]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f2ed] text-[#0e624b]"><Phone className="h-4 w-4" /></span><span>{SITE.phoneDisplay}</span><ExternalLink className="ml-auto h-3.5 w-3.5" /></a></li>
                  </ul>
                </MenuGroup>
                <MenuGroup title="Social Channels" icon={Globe2}>
                  <ul className="space-y-1">
                    {[
                      ["Facebook", "https://www.facebook.com/share/16uZNxRu4R/"],
                      ["LinkedIn", "https://www.linkedin.com/in/jan-franko/"],
                      ["WhatsApp", SITE.whatsappUrl],
                      ["Telegram", "https://t.me/ExplorerAdventuresJF"],
                    ].map(([label, href]) => <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] font-semibold text-[#173b31] transition hover:bg-[#eef5f1]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f2ed] text-[#0e624b]"><Globe2 className="h-4 w-4" /></span><span>{label}</span><ExternalLink className="ml-auto h-3.5 w-3.5 text-[#69ad96]" /></a></li>)}
                  </ul>
                </MenuGroup>
              </MegaPanel>
            </DesktopMegaMenu>

            <li className="static flex h-full items-center" onMouseEnter={() => openDesktopMenu("language")} onMouseLeave={scheduleDesktopClose}>
              <button type="button" onClick={() => setActiveMenu(activeMenu === "language" ? null : "language")} aria-expanded={activeMenu === "language"} aria-controls="language-mega-menu" className={`notranslate flex min-h-11 items-center gap-2 rounded-xl px-2.5 text-[11px] font-bold uppercase tracking-[0.08em] transition ${activeMenu === "language" ? "bg-[#0e3b2e]/6 text-[#0e624b]" : "text-[#173b31] hover:bg-[#0e3b2e]/5"}`} translate="no">
                <LanguageFlag code={activeLanguage} />
                <span>{languageCodeLabel(activeLanguage)}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeMenu === "language" ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {activeMenu === "language" && (
                <div id="language-mega-menu" className="absolute left-1/2 top-[calc(100%-0.2rem)] z-50 w-[min(96vw,78rem)] -translate-x-1/2 pt-3">
                  <div className="rounded-[1.75rem] border border-[#0e3b2e]/12 bg-[#f9fbf9] p-4 text-left shadow-[0_24px_70px_rgba(4,35,27,0.2)]">
                    <div className="mb-3 flex items-center justify-between gap-4 rounded-2xl border border-[#0e3b2e]/9 bg-white px-5 py-3">
                      <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f2ed] text-[#0e624b]"><Languages className="h-4 w-4" /></span><h2 className="text-sm font-bold text-[#173b31]">Select Language</h2></div>
                      <div className="flex items-center gap-2 rounded-xl bg-[#eef5f1] px-3 py-2 text-xs font-bold text-[#0e624b]"><LanguageFlag code={activeLanguage} />{activeLanguageName}</div>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-4">
                      {LANGUAGE_GROUPS.map((group) => (
                        <section key={group} className="rounded-2xl border border-[#0e3b2e]/10 bg-white p-3.5">
                          <h3 className="mb-2.5 border-b border-[#0e3b2e]/10 pb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7d603a]">{group}</h3>
                          <div className="grid grid-cols-2 gap-1.5">
                            {SUPPORTED_LANGUAGES.filter((language) => language.group === group).map((language) => (
                              <button key={language.code} type="button" onClick={() => requestLanguage(language.code)} className={`flex min-h-10 items-center gap-2 rounded-xl border px-2 py-1.5 text-left text-[11px] font-semibold transition ${activeLanguage === language.code ? "border-[#8bb9a8] bg-[#eaf3ef] text-[#0e624b]" : "border-transparent bg-[#f7f9f7] text-[#31594d] hover:border-[#bdd4ca] hover:bg-white"}`}>
                                <LanguageFlag code={language.code} />
                                <span className="min-w-0 truncate">{language.label}</span>
                              </button>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hidden min-h-11 items-center gap-2 rounded-xl bg-[#0e3b2e] px-4 text-[11px] font-bold text-white transition hover:bg-[#092a21] xl:flex"><Phone className="h-3.5 w-3.5 text-[#c5a880]" aria-hidden="true" />WhatsApp</a>
          <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#0e3b2e]/15 bg-white/60 text-[#0e3b2e] lg:hidden" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>

      <div className="flex min-h-11 items-center justify-between border-t border-[#0e3b2e]/8 bg-white/45 px-4 sm:px-6 lg:hidden">
        <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#7d603a]">Select Language</span>
        <button type="button" onClick={() => setMobileLanguageOpen(true)} className="notranslate flex min-h-9 items-center gap-2 rounded-xl border border-[#0e3b2e]/10 bg-white px-3 text-xs font-bold text-[#173b31] shadow-sm" translate="no">
          <LanguageFlag code={activeLanguage} />
          <span>{activeLanguageName}</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#69ad96]" aria-hidden="true" />
        </button>
      </div>

      {mobileOpen && (
        <nav className="absolute left-0 right-0 top-full max-h-[calc(100vh-7.75rem)] overflow-y-auto border-t border-[#0e3b2e]/10 bg-[#f3eee2] px-4 py-4 shadow-2xl lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto max-w-2xl space-y-2.5">
            <Link href="/" className={`block min-h-14 rounded-2xl border border-[#0e3b2e]/10 bg-white px-4 py-4 text-sm font-bold ${pathname === "/" ? "text-[#7d603a]" : "text-[#173b31]"}`}>Home</Link>

            <MobileSection id="academy" label="Academy" href="/academy" open={mobileSection === "academy"} active={pathname.startsWith("/academy") || pathname === "/archery-games"} onToggle={toggleMobileSection}>
              {ACADEMY_GROUPS.map((group) => <MobileLinkGroup key={group.title} title={group.title} links={group.links} />)}
            </MobileSection>

            <MobileSection id="programs" label="Programs" href="/programs" open={mobileSection === "programs"} active={pathname === "/programs"} onToggle={toggleMobileSection}>
              <MobileLinkGroup title="Program Types" links={programTypeLinks} />
              <MobileLinkGroup title="Skill Levels" links={skillLevelLinks} />
              <MobileLinkGroup title={`Regions (${regions.length})`} links={regionLinks} />
            </MobileSection>

            <MobileSection id="equipment" label="Equipment" href="/equipment" open={mobileSection === "equipment"} active={pathname.startsWith("/equipment") || pathname.startsWith("/bowyer")} onToggle={toggleMobileSection}>
              <MobileLinkGroup title="Equipment Departments" links={equipmentLinks} />
              <MobileLinkGroup title="Interactive Tools & Audit" links={[{ label: "Custom Arrow Builder", href: "/equipment/arrow-configurator", icon: SlidersHorizontal }, { label: "Bow Verification Register", href: "/equipment/verification", icon: ShieldCheck }]} />
              <MobileLinkGroup title="Master Bowyers" links={BOWYER_LINKS} />
            </MobileSection>

            <MobileSection id="knowledge" label="Knowledge" href="/knowledge" open={mobileSection === "knowledge"} active={pathname.startsWith("/knowledge")} onToggle={toggleMobileSection}>
              {KNOWLEDGE_GROUPS.map((group) => <MobileLinkGroup key={group.title} title={group.title} links={group.links} />)}
            </MobileSection>

            <MobileSection id="about" label="About" href="/about" open={mobileSection === "about"} active={pathname.startsWith("/about") || pathname === "/contact"} onToggle={toggleMobileSection}>
              <MobileLinkGroup title="Academy Overview" links={[
                { label: "Academy Profile", href: "/about", icon: GraduationCap },
                { label: "Jan Franko (Instructor)", href: "/about/jan-franko", icon: UserRound, protectedName: true },
                { label: "Partners & Bowyers", href: "/about/partners", icon: UsersRound },
                { label: "Contact & Inquiries", href: "/contact", icon: Mail },
              ]} />
            </MobileSection>

            <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#0e3b2e] px-4 text-sm font-bold text-white"><Phone className="h-4 w-4 text-[#c5a880]" aria-hidden="true" />{SITE.phoneDisplay}<ExternalLink className="h-3.5 w-3.5 text-white/65" aria-hidden="true" /></a>
          </div>
        </nav>
      )}

      {mounted && mobileLanguageOpen && createPortal(
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-[#03120e]/55 p-3 backdrop-blur-sm sm:items-center" onMouseDown={() => setMobileLanguageOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="mobile-language-title" className="notranslate flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-[1.75rem] bg-[#f9fbf9] shadow-2xl" translate="no" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#0e3b2e]/10 bg-white px-5 py-4">
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f2ed] text-[#0e624b]"><Languages className="h-4 w-4" /></span><h2 id="mobile-language-title" className="text-sm font-bold text-[#173b31]">Select Language</h2></div>
              <button type="button" onClick={() => setMobileLanguageOpen(false)} aria-label="Close language selector" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef5f1] text-[#0e624b]"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-5 overflow-y-auto p-4 sm:p-5">
              {LANGUAGE_GROUPS.map((group) => (
                <div key={group}>
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7d603a]">{group}</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {SUPPORTED_LANGUAGES.filter((language) => language.group === group).map((language) => (
                      <button key={language.code} type="button" onClick={() => requestLanguage(language.code)} className={`flex min-h-11 items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${activeLanguage === language.code ? "border-[#8bb9a8] bg-[#eaf3ef] text-[#0e624b]" : "border-[#0e3b2e]/8 bg-white text-[#31594d] hover:border-[#bdd4ca]"}`}>
                        <LanguageFlag code={language.code} />
                        <span className="min-w-0 truncate">{language.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>,
        document.body,
      )}
    </header>
  );
}
