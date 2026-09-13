"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import {
  MapPin,
  Calendar,
  Users,
  Wind,
  Flame,
  Droplets,
  Globe,
  Sparkles,
  Compass,
  SlidersHorizontal,
  RefreshCw,
  Target,
  Award,
  CheckCircle2,
  Image as ImageIcon,
  BookOpen,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Search
} from "lucide-react";

interface Program {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  program_type: number[];
  program_status: number[];
  skill_level?: number[];
  region?: number[];
  date: string;
  acf: {
    subtitle?: string;
    program_type?: string;
    program_type_copy?: number[];
    short_description?: string;
    full_introduction?: string;
    status?: number;
    five_elements_connection?: string;
    hero_headline_override?: string;
    hero_intro_text?: string;
    background_image?: number;
    add_gallery?: boolean;
    supplementary_images?: number[];
    region?: number;
    country?: string;
    main_location?: string;
    environment_type?: number[];
    terrain_description?: string;
    climate_notes?: string;
    duration?: number;
    enable_duration_override?: boolean;
    duration_overide?: string;
    closest_arrival_city?: string;
    recommended_season?: string;
    travel_notes?: string;
    equipment_notes?: string;
    physical_preparation_notes?: string;
    difficulty_level?: number;
    group_size?: string;
    enable_activities?: boolean;
    activities_section_intro?: string;
    activities_list?: Array<{
      activities_item_title: string;
      activities_item_description: string;
    }>;
    enable_training_focus?: boolean;
    training_focus?: Array<{
      training_focus_title: string;
      training_focus_description: string;
    }>;
    ideal_participant_for_list?: Array<{
      ideal_participant_item: string;
    }>;
  };
}

interface Term {
  id: number;
  name: string;
  slug: string;
}

interface MediaItem {
  id: number;
  source_url: string;
}

const ProgramsContent = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [types, setTypes] = useState<Term[]>([]);
  const [statuses, setStatuses] = useState<Term[]>([]);
  const [skills, setSkills] = useState<Term[]>([]);
  const [regions, setRegions] = useState<Term[]>([]);
  const [media, setMedia] = useState<Record<number, string>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [hasInitializedParams, setHasInitializedParams] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Modal & Apply Wizard States
  const [activeModalProgram, setActiveModalProgram] = useState<Program | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  // Multi-step Application Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    nationality: "",
    countryResidence: "",
    primaryLang: "",
    secondaryLang: "",
    email: "",
    phone: "",
    prefComm: "Email",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    emergencyEmail: "",
    emergencyCountry: "",
    programInterest: "14-Day Cultural Immersion",
    eduBackground: "",
    occupation: "",
    profBackground: "",
    areasInterest: "",
    prevImmersion: "No",
    prevImmersionDesc: "",
    travelExperience: "",
    prevExpAsia: "",
    prevExpJapan: "",
    prevExpOkinawa: "",
    practiceArchery: "No",
    archeryYears: "",
    archeryBowTradition: "",
    archerySkillLevel: "",
    archeryTrainFrequency: "",
    archeryInterestReason: "",
    medicalConditions: "",
    medicalAllergies: "",
    medicalMeds: "No",
    medicalMedsDesc: "",
    medicalConsentChecked: "No"
  });

  const currentIndex = activeModalProgram
    ? programs.findIndex((p) => p.id === activeModalProgram.id)
    : -1;

  const difficulty = activeModalProgram?.acf?.difficulty_level 
    ? Number(activeModalProgram.acf.difficulty_level) 
    : 0;
  // Level 3 (ID: 197) and Level 4 (ID: 198) programs
  const isHighDifficulty = 
    difficulty === 197 || 
    difficulty === 198 ||
    activeModalProgram?.skill_level?.includes(197) ||
    activeModalProgram?.skill_level?.includes(198) ||
    activeModalProgram?.title?.rendered.toLowerCase().includes("level 3") ||
    activeModalProgram?.title?.rendered.toLowerCase().includes("level 4");
  const totalSteps = isHighDifficulty ? 5 : 4;

// Geographic Classification Registry - 100% Deterministic & Audited
const MACRO_REGIONS = {
  europe: {
    name: "Europe",
    slug: "europe",
    countries: ["Austria", "Germany", "Slovakia", "Various (Europe)"],
    programIds: [4750, 4747, 4744, 4740, 4728, 4724, 4695, 4678, 4616]
  },
  asia: {
    name: "Asia",
    slug: "asia",
    countries: ["Japan"],
    programIds: [4719]
  },
  eurasia: {
    name: "Eurasia / Euro-Asian",
    slug: "eurasia",
    countries: ["Mongolia", "Kyrgyzstan", "China (Inner Mongolia)"],
    programIds: [4753, 4717, 4713, 4701]
  },
  americas: {
    name: "Americas & Other Regions",
    slug: "americas",
    countries: ["USA / Canada", "Brazil"],
    programIds: [4692, 4563]
  }
};

  const getSortedPrograms = () => {
    let sorted = [...programs];

    // 1. Strict Geographic Filter
    if (selectedRegion) {
      const reg = selectedRegion.toLowerCase();
      sorted = sorted.filter((p) => {
        if (reg === "europe") {
          return MACRO_REGIONS.europe.programIds.includes(p.id) ||
                 MACRO_REGIONS.europe.countries.some((c) => (p.acf?.country || "").includes(c));
        }
        if (reg === "asia") {
          return MACRO_REGIONS.asia.programIds.includes(p.id) ||
                 (p.acf?.country || "").toLowerCase().includes("japan") ||
                 (p.acf?.main_location || "").toLowerCase().includes("okinawa");
        }
        if (reg === "eurasia" || reg === "euro-asian" || reg === "central-asia") {
          return MACRO_REGIONS.eurasia.programIds.includes(p.id) ||
                 ["mongolia", "kyrgyzstan", "inner mongolia"].some((c) => (p.acf?.country || "").toLowerCase().includes(c));
        }
        if (reg === "americas" || reg === "north-america" || reg === "south-america") {
          return MACRO_REGIONS.americas.programIds.includes(p.id) ||
                 ["usa", "canada", "brazil"].some((c) => (p.acf?.country || "").toLowerCase().includes(c));
        }
        
        // Sub-region slug / keyword match
        if (reg === "austria" || reg === "alps") return [4750, 4616].includes(p.id) || (p.acf?.country || "").includes("Austria");
        if (reg === "germany" || reg === "black-forest") return p.id === 4747 || (p.acf?.country || "").includes("Germany");
        if (reg === "slovakia") return [4744, 4740, 4728, 4724, 4678].includes(p.id) || (p.acf?.country || "").includes("Slovakia");
        if (reg === "japan" || reg === "okinawa") return p.id === 4719 || (p.acf?.country || "").includes("Japan");
        if (reg === "mongolia") return [4717, 4713].includes(p.id) || (p.acf?.country || "").includes("Mongolia");
        if (reg === "kyrgyzstan") return p.id === 4701 || (p.acf?.country || "").includes("Kyrgyzstan");
        if (reg === "inner-mongolia") return p.id === 4753 || (p.acf?.country || "").includes("Inner Mongolia");
        if (reg === "brazil") return p.id === 4563 || (p.acf?.country || "").includes("Brazil");

        // Numeric taxonomy ID fallback
        const taxId = Number(reg);
        if (!isNaN(taxId) && taxId > 0) {
          return p.acf?.region === taxId || (p.region && p.region.includes(taxId));
        }

        return (p.acf?.country || "").toLowerCase().includes(reg) || (p.acf?.main_location || "").toLowerCase().includes(reg);
      });
    }

    // 2. Program Type Filter
    if (selectedType) {
      const typeId = Number(selectedType);
      sorted = sorted.filter((p) => p.program_type && Array.isArray(p.program_type) && p.program_type.includes(typeId));
    }

    // 3. Status Filter
    if (selectedStatus) {
      const statusId = Number(selectedStatus);
      sorted = sorted.filter((p) => (p.program_status && p.program_status.includes(statusId)) || p.acf?.status === statusId);
    }

    // 4. Skill Level Filter
    if (selectedSkill) {
      const skillId = Number(selectedSkill);
      sorted = sorted.filter((p) => (p.skill_level && p.skill_level.includes(skillId)) || Number(p.acf?.difficulty_level) === skillId);
    }

    // 5. Filter by text search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sorted = sorted.filter((p) => {
        const title = p.title.rendered.toLowerCase();
        const subtitle = p.acf?.subtitle?.toLowerCase() || "";
        const shortDesc = p.acf?.short_description?.toLowerCase() || "";
        const location = p.acf?.main_location?.toLowerCase() || "";
        const country = p.acf?.country?.toLowerCase() || "";
        return (
          title.includes(query) ||
          subtitle.includes(query) ||
          shortDesc.includes(query) ||
          location.includes(query) ||
          country.includes(query)
        );
      });
    }

    if (sortBy === "title-asc") {
      sorted.sort((a, b) => a.title.rendered.localeCompare(b.title.rendered));
    } else if (sortBy === "title-desc") {
      sorted.sort((a, b) => b.title.rendered.localeCompare(a.title.rendered));
    } else if (sortBy === "diff-asc") {
      sorted.sort((a, b) => {
        const diffA = a.acf?.difficulty_level ? Number(a.acf.difficulty_level) : 0;
        const diffB = b.acf?.difficulty_level ? Number(b.acf.difficulty_level) : 0;
        return diffA - diffB;
      });
    } else if (sortBy === "diff-desc") {
      sorted.sort((a, b) => {
        const diffA = a.acf?.difficulty_level ? Number(a.acf.difficulty_level) : 0;
        const diffB = b.acf?.difficulty_level ? Number(b.acf.difficulty_level) : 0;
        return diffB - diffA;
      });
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return sorted;
  };

  const getDifficultyIndex = (prog: Program) => {
    const diffVal = prog.acf?.difficulty_level ? Number(prog.acf.difficulty_level) : 0;
    if (diffVal === 195) return 1;
    if (diffVal === 196) return 2;
    if (diffVal === 197) return 3;
    if (diffVal === 198) return 4;
    
    // Fallback to title keywords or skill_level taxonomy if ACF is missing
    if (prog.skill_level?.includes(195)) return 1;
    if (prog.skill_level?.includes(196)) return 2;
    if (prog.skill_level?.includes(197)) return 3;
    if (prog.skill_level?.includes(198)) return 4;
    
    const titleLower = prog.title.rendered.toLowerCase();
    if (titleLower.includes("level 1")) return 1;
    if (titleLower.includes("level 2")) return 2;
    if (titleLower.includes("level 3")) return 3;
    if (titleLower.includes("level 4")) return 4;
    return 0;
  };

  const renderDifficultyMeter = (levelIndex: number) => {
    if (levelIndex === 0) return null;
    return (
      <div className="flex items-center gap-1.5" title={`Difficulty: Level ${levelIndex}`}>
        {[1, 2, 3, 4].map((dot) => (
          <div
            key={dot}
            className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
              dot <= levelIndex
                ? "bg-accent border-accent text-[#0e3b2e]"
                : "bg-transparent border-primary/20"
            }`}
          >
            {/* Concentric inner dot to mimic an archery target face */}
            {dot <= levelIndex && <div className="w-1 h-1 bg-[#0e3b2e] rounded-full" />}
          </div>
        ))}
        <span className="text-[9px] text-[#5c4629] font-bold uppercase tracking-wider ml-1 font-sans">
          L{levelIndex}
        </span>
      </div>
    );
  };

  // GSAP Entrance Animations for Program Cards
  useEffect(() => {
    if (!isLoading && programs.length > 0) {
      gsap.fromTo(
        ".program-card",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out"
        }
      );
    }
  }, [isLoading, programs, selectedType, selectedStatus, selectedSkill, selectedRegion, sortBy, searchQuery]);

  const searchParams = useSearchParams();

  // Reset sync check on search parameters change
  useEffect(() => {
    setHasInitializedParams(false);
  }, [searchParams]);

  // Sync URL slug parameters into local ID selectors once taxonomies load
  useEffect(() => {
    if (hasInitializedParams) return;
    if (types.length === 0 && skills.length === 0 && regions.length === 0) return;

    const typeSlug = searchParams.get("program_type");
    const statusSlug = searchParams.get("program_status");
    const skillSlug = searchParams.get("skill_level");
    const regionSlug = searchParams.get("region");

    if (typeSlug && types.length > 0) {
      const match = types.find((t) => t.slug === typeSlug);
      if (match) setSelectedType(match.id.toString());
    }
    if (statusSlug && statuses.length > 0) {
      const match = statuses.find((s) => s.slug === statusSlug);
      if (match) setSelectedStatus(match.id.toString());
    }
    if (skillSlug && skills.length > 0) {
      const match = skills.find((sk) => sk.slug === skillSlug);
      if (match) setSelectedSkill(match.id.toString());
    }
    if (regionSlug) {
      setSelectedRegion(regionSlug.toLowerCase());
    }

    setHasInitializedParams(true);
  }, [searchParams, types, statuses, skills, regions, hasInitializedParams]);

  // Listen to the 'open' query parameter to directly activate a program card modal
  useEffect(() => {
    const openSlug = searchParams.get("open");
    if (openSlug && !isLoading && programs.length > 0) {
      const match = programs.find(
        (p) =>
          p.slug === openSlug ||
          p.id.toString() === openSlug ||
          p.title.rendered.toLowerCase().includes(openSlug.toLowerCase())
      );
      if (match) {
        setActiveModalProgram(match);
      }
    }
  }, [searchParams, isLoading, programs]);

  // Reset apply wizard states on program transition
  useEffect(() => {
    setIsApplying(false);
    setFormStep(1);
    setIsSubmitted(false);
    setShowValidationError(false);
    if (activeModalProgram) {
      setFormData((prev) => ({
        ...prev,
        programInterest: activeModalProgram.acf?.enable_duration_override
          ? activeModalProgram.acf.duration_overide || activeModalProgram.title.rendered
          : activeModalProgram.title.rendered
      }));
    }
  }, [activeModalProgram]);

  // Hook 1: Fetch static taxonomy terms for the filters on mount
  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const [typeRes, statusRes, skillRes, regionRes] = await Promise.all([
          fetch("https://janfranko.com/wp-json/wp/v2/program_type?per_page=100"),
          fetch("https://janfranko.com/wp-json/wp/v2/program_status?per_page=100"),
          fetch("https://janfranko.com/wp-json/wp/v2/skill_level?per_page=100"),
          fetch("https://janfranko.com/wp-json/wp/v2/region?per_page=100"),
        ]);

        if (!typeRes.ok || !statusRes.ok || !skillRes.ok || !regionRes.ok) {
          throw new Error("Failed to fetch taxonomy filter options.");
        }

        const typeData: Term[] = await typeRes.json();
        const statusData: Term[] = await statusRes.json();
        const skillData: Term[] = await skillRes.json();
        const regionData: Term[] = await regionRes.json();

        setTypes(typeData);
        setStatuses(statusData);
        setSkills(skillData);
        setRegions(regionData);
      } catch (err: any) {
        console.error("Taxonomy fetch error:", err);
      }
    };

    fetchTaxonomies();
  }, []);

  // Hook 2: Fetch matching programs dynamically whenever selected filters change
  useEffect(() => {
    const fetchFilteredPrograms = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all programs from WordPress for deterministic in-memory filtering
        const progRes = await fetch("https://janfranko.com/wp-json/wp/v2/program?per_page=100");
        if (!progRes.ok) {
          throw new Error("Failed to load programs matching the selected filter options.");
        }

        const progData: Program[] = await progRes.json();

        // Gather unique media IDs to resolve URLs in a batch query
        const mediaIdsToFetch = new Set<number>();
        progData.forEach((prog) => {
          if (prog.acf?.background_image) {
            mediaIdsToFetch.add(prog.acf.background_image);
          }
          if (prog.acf?.supplementary_images && Array.isArray(prog.acf.supplementary_images)) {
            prog.acf.supplementary_images.forEach((id) => mediaIdsToFetch.add(id));
          }
        });

        const mediaMap: Record<number, string> = {};
        if (mediaIdsToFetch.size > 0) {
          const idsString = Array.from(mediaIdsToFetch).join(",");
          const mediaRes = await fetch(
            `https://janfranko.com/wp-json/wp/v2/media?include=${idsString}&per_page=100`
          );
          if (mediaRes.ok) {
            const mediaData: MediaItem[] = await mediaRes.json();
            mediaData.forEach((item) => {
              mediaMap[item.id] = item.source_url;
            });
          }
        }

        // Set high-res free Unsplash image for Zemiansky Vrbovok corporate retreat background if media item 3309 is referenced
        if (mediaMap[3309] || progData.some((p) => p.id === 4744)) {
          mediaMap[3309] = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80";
        }

        setPrograms(progData);
        setMedia(mediaMap);
      } catch (err: any) {
        console.error("Filter request error:", err);
        setError(err.message || "An error occurred while fetching programs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredPrograms();
  }, [selectedType, selectedStatus, selectedSkill, selectedRegion]);

  const resetFilters = () => {
    setSelectedType("");
    setSelectedStatus("");
    setSelectedSkill("");
    setSelectedRegion("");
  };

  // Helper to resolve element icons dynamically
  const getElementIcon = (element?: string) => {
    switch (element) {
      case "Wind":
        return <Wind className="w-6 h-6 text-accent mb-1.5" />;
      case "Fire":
        return <Flame className="w-6 h-6 text-accent mb-1.5" />;
      case "Water":
        return <Droplets className="w-6 h-6 text-accent mb-1.5" />;
      case "Earth":
        return <Globe className="w-6 h-6 text-accent mb-1.5" />;
      case "Spirit":
        return <Sparkles className="w-6 h-6 text-accent mb-1.5" />;
      default:
        return <Compass className="w-6 h-6 text-accent mb-1.5" />;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setShowValidationError(false);
  };

  const isStepValid = () => {
    if (formStep === 1) {
      return (
        formData.fullName.trim() !== "" &&
        formData.dob !== "" &&
        formData.nationality.trim() !== "" &&
        formData.countryResidence.trim() !== "" &&
        formData.primaryLang.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.phone.trim() !== ""
      );
    }
    if (formStep === 2) {
      return (
        formData.emergencyName.trim() !== "" &&
        formData.emergencyRelation.trim() !== "" &&
        formData.emergencyPhone.trim() !== ""
      );
    }
    if (isHighDifficulty && formStep === 3) {
      return formData.medicalConsentChecked === "Yes";
    }
    return true;
  };

  const handleNextStep = () => {
    if (isStepValid()) {
      setFormStep((prev) => prev + 1);
    } else {
      setShowValidationError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStepValid()) {
      try {
        await fetch("/api/forms/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            form_name: "Expedition & Retreat Application",
            page_url: typeof window !== "undefined" ? window.location.href : "/programs",
            fields: {
              program_title: activeModalProgram?.title?.rendered || formData.programInterest,
              full_name: formData.fullName,
              dob: formData.dob,
              nationality: formData.nationality,
              country_residence: formData.countryResidence,
              email: formData.email,
              phone: formData.phone,
              emergency_name: formData.emergencyName,
              emergency_phone: formData.emergencyPhone,
              archery_style: formData.archeryBowTradition,
              experience_years: formData.archeryYears,
            },
          }),
        });
      } catch (err) {
        // Fallback
      } finally {
        setIsSubmitted(true);
      }
    } else {
      setShowValidationError(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative">
      <title>Training Programs & Expeditions | Traditional Archery - Jan Franko</title>
      <meta name="description" content="Discover structured training, cultural study, and seasonal wilderness expeditions designed for traditional archers of all skill levels." />
      <meta property="og:title" content="Training Programs & Expeditions | Traditional Archery - Jan Franko" />
      <meta property="og:description" content="Discover structured training, cultural study, and seasonal wilderness expeditions designed for traditional archers of all skill levels." />
      
      {/* 1. Hero Section */}
      <div className="relative w-full bg-[#0e3b2e] text-white py-20 md:py-28 px-6 overflow-hidden flex flex-col items-center justify-center border-b border-primary/10">
        {/* radial green glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.12),transparent_70%)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(14,59,46,0.5))] z-0" />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          <span className="inline-block px-4 py-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-full text-[10px] md:text-xs font-serif font-semibold tracking-widest uppercase text-accent">
            Jan Franko Academy
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Expeditions &amp; Training Programs
          </h1>
          <p className="text-sm md:text-lg text-white/80 font-normal max-w-2xl mx-auto leading-relaxed">
            Authentic training structures, traditional bowyer workshops, and immersive cultural expeditions. Every program is selected and reviewed individually to maintain absolute focus and alignment.
          </p>
          <div className="pt-2 flex justify-center">
            <div className="w-12 h-[1px] bg-[#c5a880]/30" />
          </div>
        </div>
      </div>

      {/* 1.5 Academy Systems & Governance Hub Bar */}
      <div className="bg-[#0b3126] text-[#f0e9d9] border-b border-accent/20 py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-accent/15 pb-4">
            <div>
              <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-accent font-bold block">
                Governance &amp; Verification Standards
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
                Academy Curriculum Systems
              </h2>
            </div>
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-accent hover:underline"
            >
              <span>Explore The Academy Hub</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/academy/certification"
              className="bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 p-3.5 rounded-2xl space-y-1 transition-all group"
            >
              <span className="text-[9px] font-mono uppercase tracking-widest text-accent font-bold block">Safety Audit</span>
              <span className="text-xs font-serif font-bold text-white group-hover:text-accent block">Certification</span>
            </Link>

            <Link
              href="/academy/explorer-rank-system"
              className="bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 p-3.5 rounded-2xl space-y-1 transition-all group"
            >
              <span className="text-[9px] font-mono uppercase tracking-widest text-accent font-bold block">5 Ecosystems</span>
              <span className="text-xs font-serif font-bold text-white group-hover:text-accent block">Rank System</span>
            </Link>

            <Link
              href="/academy/summit-protocol"
              className="bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 p-3.5 rounded-2xl space-y-1 transition-all group"
            >
              <span className="text-[9px] font-mono uppercase tracking-widest text-accent font-bold block">Tier III Apex</span>
              <span className="text-xs font-serif font-bold text-white group-hover:text-accent block">Summit Protocol</span>
            </Link>

            <Link
              href="/academy/environmental-stress-index-esi"
              className="bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 p-3.5 rounded-2xl space-y-1 transition-all group"
            >
              <span className="text-[9px] font-mono uppercase tracking-widest text-accent font-bold block">Load Metric</span>
              <span className="text-xs font-serif font-bold text-white group-hover:text-accent block">ESI Metric</span>
            </Link>

            <Link
              href="/academy/code-of-conduct"
              className="bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 p-3.5 rounded-2xl space-y-1 transition-all group"
            >
              <span className="text-[9px] font-mono uppercase tracking-widest text-accent font-bold block">Ethics</span>
              <span className="text-xs font-serif font-bold text-white group-hover:text-accent block">Code of Conduct</span>
            </Link>

            <Link
              href="/archery-games"
              className="bg-accent/15 border border-accent/30 hover:bg-accent hover:text-[#0e3b2e] p-3.5 rounded-2xl space-y-1 transition-all group"
            >
              <span className="text-[9px] font-mono uppercase tracking-widest text-accent font-bold group-hover:text-[#0e3b2e] block">Gatherings</span>
              <span className="text-xs font-serif font-bold text-white group-hover:text-[#0e3b2e] block">Archery Games</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Programs Directory Container */}
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-8">
        
        {/* Directory Subheader */}
        <div className="border-b border-primary/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <h2 className="text-2xl font-bold font-serif text-primary">
              Programs Directory
            </h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex items-center w-full sm:w-48 md:w-56">
              <span className="absolute left-3.5 pointer-events-none">
                <Search className="w-3.5 h-3.5 text-primary/40" />
              </span>
              <input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-primary border border-primary/20 hover:border-primary/45 rounded-full pl-9 pr-8 py-2.5 text-xs outline-none focus:border-accent font-sans transition-all duration-300 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 text-primary/40 hover:text-primary transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold hidden sm:inline">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-secondary text-primary border border-primary/20 rounded-full px-4 py-2.5 text-xs font-serif uppercase tracking-wider outline-none focus:border-accent cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="title-asc">Title: A-Z</option>
                <option value="title-desc">Title: Z-A</option>
                <option value="diff-asc">Difficulty: Low to High</option>
                <option value="diff-desc">Difficulty: High to Low</option>
              </select>
            </div>

            <button
              onClick={() => window.location.reload()}
              title="Refresh Data"
              className="p-3 border border-primary/20 hover:border-primary/50 rounded-full text-primary hover:text-[#5c4629] transition-all duration-300 cursor-pointer"
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-secondary rounded-full text-xs font-serif tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-accent" />
              Filters
            </button>
          </div>
        </div>

        {/* Active Filters Row */}
        {(selectedType || selectedStatus || selectedSkill || selectedRegion || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-300 mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#5c4629] font-serif font-bold mr-1">
              Active Filters:
            </span>
            {searchQuery && (
              <span className="flex items-center gap-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#5c4629] px-3 py-1 rounded-full text-xs font-sans font-medium">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:text-primary shrink-0 transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {selectedType && (
              <span className="flex items-center gap-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#5c4629] px-3 py-1 rounded-full text-xs font-sans font-medium">
                Type: {types.find(t => t.id.toString() === selectedType)?.name || selectedType}
                <button onClick={() => setSelectedType("")} className="hover:text-primary shrink-0 transition-colors cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="flex items-center gap-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#5c4629] px-3 py-1 rounded-full text-xs font-sans font-medium">
                Status: {statuses.find(s => s.id.toString() === selectedStatus)?.name || selectedStatus}
                <button onClick={() => setSelectedStatus("")} className="hover:text-primary shrink-0 transition-colors cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedSkill && (
              <span className="flex items-center gap-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#5c4629] px-3 py-1 rounded-full text-xs font-sans font-medium">
                Skill: {skills.find(sk => sk.id.toString() === selectedSkill)?.name || selectedSkill}
                <button onClick={() => setSelectedSkill("")} className="hover:text-primary shrink-0 transition-colors cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedRegion && (
              <span className="flex items-center gap-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#5c4629] px-3 py-1 rounded-full text-xs font-sans font-medium">
                Region: {MACRO_REGIONS[selectedRegion as keyof typeof MACRO_REGIONS]?.name || regions.find(r => r.id.toString() === selectedRegion || r.slug === selectedRegion)?.name || (selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1))}
                <button onClick={() => setSelectedRegion("")} className="hover:text-primary shrink-0 transition-colors cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                resetFilters();
                setSearchQuery("");
              }}
              className="text-[#5c4629] hover:text-[#0e3b2e] text-xs font-serif font-bold underline ml-2 cursor-pointer transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Collapsible Filters Drawer */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isFiltersOpen ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-white border border-primary/5 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Type Filter */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">Program Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-secondary text-primary border border-primary/10 rounded-xl p-2.5 text-xs outline-none focus:border-accent"
                >
                  <option value="">All Types</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">Availability</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-secondary text-primary border border-primary/10 rounded-xl p-2.5 text-xs outline-none focus:border-accent"
                >
                  <option value="">All Statuses</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Skill Filter */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">Skill Level</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full bg-secondary text-primary border border-primary/10 rounded-xl p-2.5 text-xs outline-none focus:border-accent"
                >
                  <option value="">All Levels</option>
                  {skills.map((sk) => (
                    <option key={sk.id} value={sk.id}>{sk.name}</option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-secondary text-primary border border-primary/10 rounded-xl p-2.5 text-xs outline-none focus:border-accent font-sans"
                >
                  <option value="">All Global Regions</option>
                  <optgroup label="Macro Regions">
                    <option value="europe">Europe (Austria, Germany, Slovakia, Alps)</option>
                    <option value="asia">Asia (Japan / Okinawa)</option>
                    <option value="eurasia">Eurasia (Mongolia, Kyrgyzstan, Steppe)</option>
                    <option value="americas">Americas (North America, Brazil)</option>
                  </optgroup>
                  <optgroup label="Specific Countries & Locations">
                    <option value="austria">Austria / Alps</option>
                    <option value="germany">Germany (Black Forest)</option>
                    <option value="slovakia">Slovakia (Carpathians & Thermal)</option>
                    <option value="japan">Japan (Okinawa)</option>
                    <option value="mongolia">Mongolia (Orkhon & Kharkhorin)</option>
                    <option value="kyrgyzstan">Kyrgyzstan (Nomad Games & Highlands)</option>
                    <option value="inner-mongolia">Inner Mongolia (Grasslands)</option>
                    <option value="north-america">North America (USA / Canada)</option>
                    <option value="brazil">Brazil (Paraná)</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Reset Controls */}
            <div className="flex justify-end pt-4 border-t border-primary/5">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-primary/20 hover:border-primary text-primary text-xs font-serif uppercase tracking-wider rounded-xl transition-colors duration-300 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white border border-primary/5 rounded-2xl h-[400px] overflow-hidden flex flex-col shadow-sm animate-pulse">
                <div className="bg-primary/10 h-[200px] w-full" />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="bg-primary/10 rounded h-3 w-1/4" />
                    <div className="bg-primary/10 rounded h-5 w-3/4" />
                    <div className="space-y-1.5">
                      <div className="bg-primary/10 rounded h-3.5 w-full" />
                      <div className="bg-primary/10 rounded h-3.5 w-2/3" />
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
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-6 rounded-2xl">
            <h3 className="font-serif font-bold text-lg mb-1">Database Request Failed</h3>
            <p className="text-sm font-normal">{error}</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-24 bg-white border border-primary/5 rounded-3xl text-primary/80 font-normal">
            No matching programs found in the database.
          </div>
        ) : (
          /* Programs Card Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedPrograms().map((program) => {
              const bgUrl = program.acf?.background_image ? media[program.acf.background_image] : null;
              const typeName = program.program_type
                ?.map((id) => types.find((t) => t.id === id)?.name)
                .filter(Boolean)
                .join(" • ") || program.acf?.program_type;

              const statusName = program.program_status
                ?.map((id) => statuses.find((s) => s.id === id)?.name)
                .filter(Boolean)
                .join(" • ");

              return (
                <div
                  key={program.id}
                  onClick={() => setActiveModalProgram(program)}
                  className="program-card group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-[400px] cursor-pointer opacity-0"
                >
                  {/* Top Image Banner */}
                  <div className="relative w-full h-[200px] bg-primary/10 overflow-hidden">
                    {bgUrl ? (
                      <Image
                        src={bgUrl}
                        alt={program.title.rendered}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/5" />
                    )}
                    {/* Difficulty Badge on Image */}
                    {getDifficultyIndex(program) > 0 && (
                      <div className="absolute top-4 left-4 z-10 bg-secondary/95 border border-primary/15 rounded-full px-2.5 py-1 text-xs shadow-sm flex items-center gap-1">
                        {renderDifficultyMeter(getDifficultyIndex(program))}
                      </div>
                    )}
                    {/* Status Badge */}
                    {statusName && (
                      <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 bg-secondary/95 border border-primary/15 rounded-full text-xs font-serif font-bold text-primary shadow-sm">
                        {statusName}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {typeName && (
                        <span className="text-[9px] text-[#5c4629] font-bold tracking-widest uppercase font-serif block">
                          {typeName}
                        </span>
                      )}
                      <h3 className="text-lg font-serif font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">
                        {program.title.rendered}
                      </h3>
                      {program.acf?.subtitle && (
                        <p className="text-xs text-primary/85 italic font-normal line-clamp-1">
                          {program.acf.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Quick Info Footer */}
                    <div className="border-t border-primary/5 pt-4 flex items-center justify-between text-xs text-primary/90 font-medium">
                      <span className="flex items-center gap-1.5 min-w-0 pr-4">
                        <MapPin className="w-4 h-4 text-[#5c4629] shrink-0" />
                        <span className="truncate">
                          {program.acf?.main_location && program.acf?.country
                            ? `${program.acf.main_location}, ${program.acf.country}`
                            : program.acf?.country || "Worldwide"}
                        </span>
                      </span>
                      <span className="text-[#5c4629] group-hover:text-accent font-bold font-serif uppercase tracking-wider transition-colors duration-300 whitespace-nowrap shrink-0">
                        Quick View
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Quick View Modal Popup */}
        {activeModalProgram && (
          <div
            className="fixed inset-0 bg-[#0e3b2e]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 select-text overflow-y-auto"
            onClick={() => setActiveModalProgram(null)}
          >
            {/* Left Chevron Button */}
            {!isApplying && (
              <button
                disabled={currentIndex === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModalProgram(programs[currentIndex - 1]);
                }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-secondary/90 border border-primary/10 flex items-center justify-center text-primary hover:text-[#7d603a] hover:border-accent/40 shadow-lg cursor-pointer transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none z-30"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Modal Box */}
            <div
              className="bg-secondary text-primary rounded-3xl w-full max-w-6xl max-h-[85vh] overflow-y-auto flex flex-col md:flex-row relative border border-primary/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProgram(null)}
                className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-secondary/90 border border-primary/10 flex items-center justify-center text-primary hover:text-accent hover:border-accent/40 shadow-sm transition-all duration-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Image and Core Metadata */}
              <div className="w-full md:w-[35%] relative min-h-[250px] md:min-h-auto bg-primary/20 flex flex-col justify-end">
                {activeModalProgram.acf?.background_image && media[activeModalProgram.acf.background_image] ? (
                  <Image
                    src={media[activeModalProgram.acf.background_image]}
                    alt={activeModalProgram.title.rendered}
                    fill
                    className="object-cover z-0"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e3b2e] via-[#0e3b2e]/50 to-transparent z-10" />

                {/* Left Panel Metadata */}
                <div className="relative z-20 p-6 md:p-8 text-white space-y-4">
                  <span className="text-[10px] text-accent font-semibold tracking-widest uppercase font-serif">
                    {activeModalProgram.program_type
                      ?.map((id) => types.find((t) => t.id === id)?.name)
                      .filter(Boolean)
                      .join(" • ") || activeModalProgram.acf?.program_type}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight">
                    {activeModalProgram.acf?.hero_headline_override || activeModalProgram.title.rendered}
                  </h2>
                  
                  {/* Detailed Spec Block */}
                  <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4 text-xs font-normal">
                    <div className="flex flex-col items-start">
                      <MapPin className="w-6 h-6 text-accent mb-1.5" />
                      <span className="block text-white/70 uppercase font-serif tracking-widest text-[10px] mb-0.5 font-bold">Location</span>
                      <span className="font-semibold text-white">
                        {activeModalProgram.acf?.main_location && activeModalProgram.acf?.country
                          ? `${activeModalProgram.acf.main_location}, ${activeModalProgram.acf.country}`
                          : activeModalProgram.acf?.country || "Worldwide"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      <Calendar className="w-6 h-6 text-accent mb-1.5" />
                      <span className="block text-white/70 uppercase font-serif tracking-widest text-[10px] mb-0.5 font-bold">Duration</span>
                      <span className="font-semibold text-white">
                        {activeModalProgram.acf?.enable_duration_override
                          ? activeModalProgram.acf.duration_overide
                          : "Standard Duration"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      <Users className="w-6 h-6 text-accent mb-1.5" />
                      <span className="block text-white/70 uppercase font-serif tracking-widest text-[10px] mb-0.5 font-bold">Capacity</span>
                      <span className="font-semibold text-white">
                        {activeModalProgram.acf?.group_size || "Standard Group"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      {getElementIcon(activeModalProgram.acf?.five_elements_connection)}
                      <span className="block text-white/70 uppercase font-serif tracking-widest text-[10px] mb-0.5 font-bold">Element</span>
                      <span className="font-semibold text-accent">
                        {activeModalProgram.acf?.five_elements_connection || "None"}
                      </span>
                    </div>
                    {getDifficultyIndex(activeModalProgram) > 0 && (
                      <div className="flex flex-col items-start col-span-2">
                        <span className="block text-white/70 uppercase font-serif tracking-widest text-[10px] mb-1 font-bold">Difficulty</span>
                        <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 flex items-center">
                          {renderDifficultyMeter(getDifficultyIndex(activeModalProgram))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Apply Action Button */}
                  <div className="pt-2">
                    {isApplying ? (
                      <button
                        onClick={() => setIsApplying(false)}
                        className="w-full py-3.5 border border-white/35 hover:border-white/70 text-white font-serif font-bold uppercase tracking-widest text-xs rounded-full shadow-lg transition-all duration-300 text-center cursor-pointer flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4 text-accent" />
                        Back to Details
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsApplying(true)}
                        className="w-full py-3.5 bg-accent hover:bg-accent/90 text-primary font-serif font-bold uppercase tracking-widest text-xs rounded-full shadow-lg transition-all duration-300 text-center cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ClipboardList className="w-4 h-4 text-primary" />
                        Apply for Program
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Description OR Application Form */}
              <div className="w-full md:w-[65%] p-6 md:p-8 space-y-6 overflow-y-auto max-h-[85vh]">
                {!isApplying ? (
                  /* --- Standard Program Details View --- */
                  <>
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-[#7d603a] font-serif font-bold mb-1 flex items-center gap-2">
                        <Info className="w-4.5 h-4.5 text-[#7d603a]" />
                        Overview
                      </h3>
                      <h4 className="text-xl font-serif font-bold text-primary mb-2">
                        {activeModalProgram.acf?.subtitle || "Program Description"}
                      </h4>
                      <p className="text-sm text-primary/95 font-normal leading-relaxed">
                        {activeModalProgram.acf?.short_description}
                      </p>
                    </div>

                    {/* Full Introduction (HTML wysiwyg) */}
                    {activeModalProgram.acf?.full_introduction && (
                      <div className="border-t border-primary/5 pt-4">
                        <h5 className="text-xs uppercase tracking-widest text-[#7d603a] font-serif font-bold mb-2 flex items-center gap-2">
                          <BookOpen className="w-4.5 h-4.5 text-[#7d603a]" />
                          Introduction
                        </h5>
                        <div
                          className="text-sm text-primary/90 font-normal leading-relaxed space-y-3.5 prose select-text"
                          dangerouslySetInnerHTML={{ __html: activeModalProgram.acf.full_introduction }}
                        />
                      </div>
                    )}

                    {/* Core Activities Repeater */}
                    {activeModalProgram.acf?.enable_activities && activeModalProgram.acf?.activities_list && (
                      <div className="bg-primary/5 p-5 rounded-2xl space-y-4">
                        <h5 className="text-xs uppercase tracking-widest text-[#7d603a] font-serif font-bold flex items-center gap-2">
                          <Target className="w-4.5 h-4.5 text-[#7d603a]" />
                          {activeModalProgram.acf.activities_section_intro || "Core Activities"}
                        </h5>
                        <div className="grid grid-cols-1 gap-4">
                          {activeModalProgram.acf.activities_list.map((act, index) => (
                            <div key={index} className="text-sm space-y-1">
                              <span className="font-bold text-primary block">{act.activities_item_title}</span>
                              <p className="text-primary/90 font-normal leading-relaxed">{act.activities_item_description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Training Focus Repeater */}
                    {activeModalProgram.acf?.program_type !== "Retreat" && activeModalProgram.acf?.enable_training_focus && activeModalProgram.acf?.training_focus && (
                      <div className="bg-primary/5 p-5 rounded-2xl space-y-4">
                        <h5 className="text-xs uppercase tracking-widest text-[#7d603a] font-serif font-bold flex items-center gap-2">
                          <Award className="w-4.5 h-4.5 text-[#7d603a]" />
                          Training Focus
                        </h5>
                        <div className="grid grid-cols-1 gap-4">
                          {activeModalProgram.acf.training_focus.map((focus, index) => (
                            <div key={index} className="text-sm space-y-1">
                              <span className="font-bold text-primary block">{focus.training_focus_title}</span>
                              <p className="text-primary/90 font-normal leading-relaxed">{focus.training_focus_description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Target Audience List */}
                    {activeModalProgram.acf?.ideal_participant_for_list && (
                      <div className="border-t border-primary/5 pt-4">
                        <h5 className="text-xs uppercase tracking-widest text-[#7d603a] font-serif font-bold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4.5 h-4.5 text-[#7d603a]" />
                          Ideal Participants
                        </h5>
                        <ul className="list-disc pl-5 text-sm text-primary/95 font-normal space-y-1.5">
                          {activeModalProgram.acf.ideal_participant_for_list.map((item, index) => (
                            <li key={index}>{item.ideal_participant_item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Gallery Images Grid */}
                    {activeModalProgram.acf?.add_gallery && activeModalProgram.acf?.supplementary_images && (
                      <div className="border-t border-primary/5 pt-4">
                        <h5 className="text-xs uppercase tracking-widest text-[#7d603a] font-serif font-bold mb-3 flex items-center gap-2">
                          <ImageIcon className="w-4.5 h-4.5 text-[#7d603a]" />
                          Supplementary Gallery
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          {activeModalProgram.acf.supplementary_images.map((id, index) => {
                            const imgUrl = media[id];
                            if (!imgUrl) return null;
                            return (
                              <div
                                key={index}
                                onClick={() => setLightboxImage(imgUrl)}
                                className="relative aspect-video rounded-xl overflow-hidden bg-primary/10 shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 group/gallery"
                              >
                                <Image
                                  src={imgUrl}
                                  alt={`Supplementary ${index + 1}`}
                                  fill
                                  className="object-cover group-hover/gallery:opacity-90 transition-opacity"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : isSubmitted ? (
                  /* --- Application Form Submission Success Screen --- */
                  <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
                    <div className="w-16 h-16 bg-[#0e3b2e]/10 border border-[#0e3b2e]/25 text-[#0e3b2e] rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif font-bold text-primary">Application Received</h3>
                      <p className="text-sm text-primary/80 font-normal max-w-md leading-relaxed">
                        Thank you for applying for the <strong>{activeModalProgram.title.rendered}</strong>.
                      </p>
                      <p className="text-xs text-primary/70 font-normal max-w-sm leading-relaxed mx-auto pt-2 border-t border-primary/5">
                        Our Okinawan admission ecosystem is built around quality and alignment. We will review your background and reach out to you within 2–3 business days.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsApplying(false)}
                      className="px-6 py-2.5 bg-primary text-secondary font-serif uppercase tracking-widest text-xs rounded-full hover:bg-primary/95 transition-colors cursor-pointer"
                    >
                      Back to Program Info
                    </button>
                  </div>
                ) : (
                  /* --- Multi-step Application Form Wizard --- */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header Spec */}
                    <div className="border-b border-primary/10 pb-4">
                      <h3 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#7d603a]" />
                        Apply for {activeModalProgram.title.rendered}
                      </h3>
                      
                      {/* Form Steps Progress Indicator */}
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#7d603a]">
                          <span>Step {formStep} of {totalSteps}</span>
                          <span>
                            {formStep === 1 && "Personal Information"}
                            {formStep === 2 && "Emergency Contact"}
                            {isHighDifficulty ? (
                              <>
                                {formStep === 3 && "Medical & Consent"}
                                {formStep === 4 && "Background Experience"}
                                {formStep === 5 && "Traditional Archery Details"}
                              </>
                            ) : (
                              <>
                                {formStep === 3 && "Background Experience"}
                                {formStep === 4 && "Traditional Archery Details"}
                              </>
                            )}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${(formStep / totalSteps) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="space-y-6">
                      
                      {/* --- STEP 1: PERSONAL INFORMATION --- */}
                      {formStep === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-1 md:col-span-2 flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Full Legal Name *</label>
                            <input
                              type="text"
                              required
                              value={formData.fullName}
                              onChange={(e) => handleInputChange("fullName", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                              placeholder="First, middle and last name"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Date of Birth *</label>
                            <input
                              type="date"
                              required
                              value={formData.dob}
                              onChange={(e) => handleInputChange("dob", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Nationality *</label>
                            <input
                              type="text"
                              required
                              value={formData.nationality}
                              onChange={(e) => handleInputChange("nationality", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Country of Residence *</label>
                            <input
                              type="text"
                              required
                              value={formData.countryResidence}
                              onChange={(e) => handleInputChange("countryResidence", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Primary Language *</label>
                            <input
                              type="text"
                              required
                              value={formData.primaryLang}
                              onChange={(e) => handleInputChange("primaryLang", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Secondary Language</label>
                            <input
                              type="text"
                              value={formData.secondaryLang}
                              onChange={(e) => handleInputChange("secondaryLang", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Email Address *</label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Phone Number *</label>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="col-span-1 md:col-span-2 flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Preferred Communication Method *</label>
                            <select
                              value={formData.prefComm}
                              onChange={(e) => handleInputChange("prefComm", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            >
                              <option value="Email">Email</option>
                              <option value="Phone">Phone</option>
                              <option value="Messaging App">Messaging App</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* --- STEP 2: EMERGENCY CONTACT --- */}
                      {formStep === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Emergency Contact Name *</label>
                            <input
                              type="text"
                              required
                              value={formData.emergencyName}
                              onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Relationship *</label>
                            <input
                              type="text"
                              required
                              value={formData.emergencyRelation}
                              onChange={(e) => handleInputChange("emergencyRelation", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Phone Number *</label>
                            <input
                              type="tel"
                              required
                              value={formData.emergencyPhone}
                              onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Email Address</label>
                            <input
                              type="email"
                              value={formData.emergencyEmail}
                              onChange={(e) => handleInputChange("emergencyEmail", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="col-span-1 md:col-span-2 flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Country</label>
                            <input
                              type="text"
                              value={formData.emergencyCountry}
                              onChange={(e) => handleInputChange("emergencyCountry", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>
                        </div>
                      )}

                      {/* --- CONDITIONAL STEP 3: MEDICAL & CONSENT (Level 3/4 Only) --- */}
                      {isHighDifficulty && formStep === 3 && (
                        <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-200">
                          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs leading-relaxed flex items-start gap-2.5">
                            <Info className="w-5 h-5 text-amber-700 shrink-0" />
                            <div>
                              <span className="font-bold block mb-0.5">Harsh Environment Advisory</span>
                              This program takes place in remote locations under physically demanding conditions. A medical disclosure is required to ensure participant safety.
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">
                              Pre-existing Medical Conditions / Physical Limitations
                            </label>
                            <textarea
                              value={formData.medicalConditions}
                              onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                              rows={3}
                              placeholder="Please describe any medical conditions, injuries, or limitations (optional)"
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all resize-none"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">
                              Allergies (Food, Medication, Environmental)
                            </label>
                            <input
                              type="text"
                              value={formData.medicalAllergies}
                              onChange={(e) => handleInputChange("medicalAllergies", e.target.value)}
                              placeholder="e.g. Peanuts, Penicillin, Bee stings (optional)"
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="border-t border-primary/5 pt-4 space-y-3">
                            <label className="text-sm font-serif text-primary font-bold">
                              Are you currently taking any prescription medications that require storage/special handling?
                            </label>
                            <div className="flex gap-6">
                              {["Yes", "No"].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                                  <input
                                    type="radio"
                                    name="medicalMeds"
                                    checked={formData.medicalMeds === opt}
                                    onChange={() => handleInputChange("medicalMeds", opt)}
                                    className="accent-primary w-4.5 h-4.5"
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Conditional Medication details */}
                          {formData.medicalMeds === "Yes" && (
                            <div className="flex flex-col space-y-1 animate-in slide-in-from-top-2 duration-200">
                              <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Medication Details & Special Handling:</label>
                              <input
                                type="text"
                                value={formData.medicalMedsDesc}
                                onChange={(e) => handleInputChange("medicalMedsDesc", e.target.value)}
                                placeholder="Describe handling needs (e.g. refrigeration)"
                                className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                              />
                            </div>
                          )}

                          <div className="border-t border-primary/5 pt-4 space-y-3">
                            <label className="flex items-start gap-3 p-4 border border-primary/10 rounded-2xl cursor-pointer bg-white hover:bg-primary/5 transition-all">
                              <input
                                type="checkbox"
                                checked={formData.medicalConsentChecked === "Yes"}
                                onChange={(e) => handleInputChange("medicalConsentChecked", e.target.checked ? "Yes" : "No")}
                                className="accent-primary w-5 h-5 shrink-0 mt-0.5"
                              />
                              <div className="text-xs leading-relaxed text-primary font-normal">
                                <span className="font-bold text-accent block mb-1">Medical Consent Acknowledgement *</span>
                                I hereby consent to receive emergency medical treatment if necessary during the program, and confirm that I am in suitable physical condition for these harsh environments.
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* --- STEP 3: EXPERIENCE & BACKGROUND --- */}
                      {((isHighDifficulty && formStep === 4) || (!isHighDifficulty && formStep === 3)) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Educational Background</label>
                            <input
                              type="text"
                              value={formData.eduBackground}
                              onChange={(e) => handleInputChange("eduBackground", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Current Occupation</label>
                            <input
                              type="text"
                              value={formData.occupation}
                              onChange={(e) => handleInputChange("occupation", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Professional Background</label>
                            <input
                              type="text"
                              value={formData.profBackground}
                              onChange={(e) => handleInputChange("profBackground", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Areas of Interest</label>
                            <input
                              type="text"
                              value={formData.areasInterest}
                              onChange={(e) => handleInputChange("areasInterest", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="col-span-1 md:col-span-2 border-t border-primary/5 pt-4 space-y-3">
                            <label className="text-sm font-serif text-primary font-bold">
                              Have you previously participated in cultural immersion programs?
                            </label>
                            <div className="flex gap-6">
                              {["Yes", "No"].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                                  <input
                                    type="radio"
                                    name="prevImmersion"
                                    checked={formData.prevImmersion === opt}
                                    onChange={() => handleInputChange("prevImmersion", opt)}
                                    className="accent-primary w-4.5 h-4.5"
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Conditional Textarea */}
                          {formData.prevImmersion === "Yes" && (
                            <div className="col-span-1 md:col-span-2 flex flex-col space-y-1 animate-in slide-in-from-top-2 duration-200">
                              <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Please describe:</label>
                              <textarea
                                value={formData.prevImmersionDesc}
                                onChange={(e) => handleInputChange("prevImmersionDesc", e.target.value)}
                                rows={3}
                                className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all resize-none"
                              />
                            </div>
                          )}

                          <div className="col-span-1 md:col-span-2 border-t border-primary/5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Travel Experience / Countries Visited</label>
                              <input
                                type="text"
                                value={formData.travelExperience}
                                onChange={(e) => handleInputChange("travelExperience", e.target.value)}
                                className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                              />
                            </div>

                            <div className="flex flex-col space-y-1">
                              <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Previous Experience in Asia</label>
                              <input
                                type="text"
                                value={formData.prevExpAsia}
                                onChange={(e) => handleInputChange("prevExpAsia", e.target.value)}
                                className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                              />
                            </div>

                            <div className="flex flex-col space-y-1">
                              <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Previous Experience in Japan</label>
                              <input
                                type="text"
                                value={formData.prevExpJapan}
                                onChange={(e) => handleInputChange("prevExpJapan", e.target.value)}
                                className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                              />
                            </div>

                            <div className="flex flex-col space-y-1">
                              <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Previous Experience in Okinawa</label>
                              <input
                                type="text"
                                value={formData.prevExpOkinawa}
                                onChange={(e) => handleInputChange("prevExpOkinawa", e.target.value)}
                                className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* --- STEP 4: ARCHERY EXPERIENCE --- */}
                      {((isHighDifficulty && formStep === 5) || (!isHighDifficulty && formStep === 4)) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-1 md:col-span-2 space-y-3">
                            <label className="text-sm font-serif text-primary font-bold">
                              Do you practice traditional archery?
                            </label>
                            <div className="flex gap-6">
                              {["Yes", "No"].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                                  <input
                                    type="radio"
                                    name="practiceArchery"
                                    checked={formData.practiceArchery === opt}
                                    onChange={() => handleInputChange("practiceArchery", opt)}
                                    className="accent-primary w-4.5 h-4.5"
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Years of Experience</label>
                            <input
                              type="text"
                              value={formData.archeryYears}
                              onChange={(e) => handleInputChange("archeryYears", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Bow Tradition</label>
                            <input
                              type="text"
                              value={formData.archeryBowTradition}
                              onChange={(e) => handleInputChange("archeryBowTradition", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">Current Skill Level</label>
                            <input
                              type="text"
                              value={formData.archerySkillLevel}
                              onChange={(e) => handleInputChange("archerySkillLevel", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">How often do you train?</label>
                            <input
                              type="text"
                              value={formData.archeryTrainFrequency}
                              onChange={(e) => handleInputChange("archeryTrainFrequency", e.target.value)}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all"
                            />
                          </div>

                          <div className="col-span-1 md:col-span-2 flex flex-col space-y-1 border-t border-primary/5 pt-4">
                            <label className="text-xs font-serif uppercase tracking-wider text-[#7d603a] font-bold">What interests you about traditional archery?</label>
                            <textarea
                              value={formData.archeryInterestReason}
                              onChange={(e) => handleInputChange("archeryInterestReason", e.target.value)}
                              rows={4}
                              className="w-full bg-secondary text-primary border border-primary/20 rounded-xl p-3 text-sm outline-none focus:border-accent font-normal transition-all resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form Validation Warnings */}
                    {showValidationError && (
                      <div className="text-red-600 text-xs font-bold font-sans p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                        Please fill out all required fields marked with an asterisk (*) before proceeding.
                      </div>
                    )}

                    {/* Navigation Buttons inside Form */}
                    <div className="border-t border-primary/10 pt-6 flex justify-between items-center">
                      {formStep > 1 ? (
                        <button
                          type="button"
                          onClick={() => setFormStep((prev) => prev - 1)}
                          className="px-5 py-3 border border-primary text-primary font-serif uppercase tracking-widest text-xs rounded-full hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                        >
                          « Previous Step
                        </button>
                      ) : (
                        <div />
                      )}

                      {formStep < totalSteps ? (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="px-6 py-3.5 bg-primary text-secondary font-serif uppercase tracking-widest text-xs rounded-full hover:bg-primary/95 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                        >
                          Next Step »
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="px-6 py-3.5 bg-[#0e3b2e] hover:bg-[#0a2f24] text-white font-serif uppercase tracking-widest text-xs rounded-full transition-all duration-300 cursor-pointer shadow-md"
                        >
                          Submit Application
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Chevron Button */}
            {!isApplying && (
              <button
                disabled={currentIndex === programs.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModalProgram(programs[currentIndex + 1]);
                }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-secondary/90 border border-primary/10 flex items-center justify-center text-primary hover:text-[#7d603a] hover:border-accent/40 shadow-lg cursor-pointer transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none z-30"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>
        )}

        {/* Fullscreen Lightbox Overlay Viewer */}
        {lightboxImage && (
          <div
            className="fixed inset-0 bg-[#0e3b2e]/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 cursor-pointer select-none animate-in fade-in duration-200"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <img
                src={lightboxImage}
                alt="Gallery Preview"
                className="object-contain max-w-full max-h-[90vh] rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const ProgramsPage = () => {
  return (
    <Suspense fallback={null}>
      <ProgramsContent />
    </Suspense>
  );
};

export default ProgramsPage;
