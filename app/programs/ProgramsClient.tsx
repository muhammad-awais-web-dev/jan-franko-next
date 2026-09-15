"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { cleanTitle } from "@/lib/text";
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
  Search,
  Plane,
  Mountain,
  Thermometer,
  ShieldAlert,
  AlertCircle,
  DollarSign,
  Clock,
  Scroll,
  XCircle,
  Check
} from "lucide-react";

export interface Program {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  program_type: number[];
  program_status: number[];
  skill_level?: number[];
  duration_category?: number[];
  region?: number[];
  date: string;
  acf: {
    subtitle?: string;
    program_type?: string;
    program_type_copy?: number[];
    short_description?: string;
    full_introduction?: string;
    status?: number;
    event_status_label?: string;
    event_date?: string;
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
    "enable_schedule_&_itinerary"?: boolean;
    program_stages__schedule?: Array<{
      stage_title?: string;
      stage_subtitle?: string;
      stage_duration?: string;
      stage_location?: string;
      stage_image?: number;
      stage_description?: string;
      stage_activities?: string;
    }>;
    who_this_is_for_intro?: string;
    ideal_participant_for_list?: Array<{
      ideal_participant_item: string;
    }>;
    not_suitable_for_list?: Array<{
      not_suitable_for_item: string;
    }>;
    standards_intro?: string;
    standards_list?: Array<{
      standards_list_item: string;
    }>;
    "archer’s_oath"?: string;
    archers_oath?: string;
    enable_pricing?: boolean;
    investment_intro?: string;
    base_price?: string;
    payment_plan_note?: string;
    investment_includes?: Array<{
      investment_includes_items?: string;
    }>;
    cta_headline?: string;
    cta_supporting_text?: string;
  };
}

export interface Term {
  id: number;
  name: string;
  slug: string;
}

export interface ProgramsClientProps {
  initialPrograms: Program[];
  initialMedia: Record<number, string>;
  initialTypes: Term[];
  initialStatuses: Term[];
  initialSkills: Term[];
  initialRegions: Term[];
  initialDurations?: Term[];
}

export const DURATION_TERM_MAP: Record<number, string> = {
  199: "1 Day",
  200: "3 Days",
  201: "7 Days",
  202: "14 Days",
  203: "21 Days",
  204: "30+ Days",
};

export function getDurationLabel(program?: Program | null, durationTerms?: Term[]): string {
  if (!program) return "";
  if (program.acf?.enable_duration_override && program.acf.duration_overide?.trim()) {
    return program.acf.duration_overide.trim();
  }

  const acfDur = Number(program.acf?.duration);
  if (acfDur && DURATION_TERM_MAP[acfDur]) {
    return DURATION_TERM_MAP[acfDur];
  }

  if (durationTerms && durationTerms.length > 0 && acfDur) {
    const match = durationTerms.find((t) => t.id === acfDur);
    if (match?.name) return match.name;
  }

  if (program.duration_category && program.duration_category.length > 0) {
    const firstTermId = program.duration_category[0];
    if (DURATION_TERM_MAP[firstTermId]) {
      return DURATION_TERM_MAP[firstTermId];
    }
    if (durationTerms) {
      const match = durationTerms.find((t) => t.id === firstTermId);
      if (match?.name) return match.name;
    }
  }

  if (acfDur > 0 && acfDur < 100) {
    return `${acfDur} ${acfDur === 1 ? "Day" : "Days"}`;
  }

  return "";
}

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

export default function ProgramsClient({
  initialPrograms,
  initialMedia,
  initialTypes,
  initialStatuses,
  initialSkills,
  initialRegions,
}: ProgramsClientProps) {
  const searchParams = useSearchParams();

  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [types, setTypes] = useState<Term[]>(initialTypes);
  const [statuses, setStatuses] = useState<Term[]>(initialStatuses);
  const [skills, setSkills] = useState<Term[]>(initialSkills);
  const [regions, setRegions] = useState<Term[]>(initialRegions);
  const [media, setMedia] = useState<Record<number, string>>(initialMedia);

  const [isLoading, setIsLoading] = useState<boolean>(initialPrograms.length === 0);
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

  const difficulty = activeModalProgram?.acf?.difficulty_level 
    ? Number(activeModalProgram.acf.difficulty_level) 
    : 0;
  
  const isHighDifficulty = activeModalProgram
    ? (activeModalProgram.acf?.difficulty_level ? Number(activeModalProgram.acf.difficulty_level) === 197 || Number(activeModalProgram.acf.difficulty_level) === 198 : false) ||
      (activeModalProgram.skill_level ? activeModalProgram.skill_level.includes(197) || activeModalProgram.skill_level.includes(198) : false) ||
      activeModalProgram.title?.rendered.toLowerCase().includes("level 3") ||
      activeModalProgram.title?.rendered.toLowerCase().includes("level 4")
    : false;
  const totalSteps = isHighDifficulty ? 5 : 4;

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
        if (reg === "americas") {
          return MACRO_REGIONS.americas.programIds.includes(p.id) ||
                 ["usa", "canada", "brazil"].some((c) => (p.acf?.country || "").toLowerCase().includes(c));
        }
        if (reg === "north-america") {
          return [4692].includes(p.id) ||
                 ["usa", "canada"].some((c) => (p.acf?.country || "").toLowerCase().includes(c));
        }
        if (reg === "south-america" || reg === "brazil") {
          return p.id === 4563 || (p.acf?.country || "").toLowerCase().includes("brazil");
        }
        
        // Sub-region slug / keyword match
        if (reg === "austria" || reg === "alps") return [4750, 4616].includes(p.id) || (p.acf?.country || "").includes("Austria");
        if (reg === "germany" || reg === "black-forest") return p.id === 4747 || (p.acf?.country || "").includes("Germany");
        if (reg === "slovakia") return [4744, 4740, 4728, 4724, 4678].includes(p.id) || (p.acf?.country || "").includes("Slovakia");
        if (reg === "japan" || reg === "okinawa") return p.id === 4719 || (p.acf?.country || "").includes("Japan");
        if (reg === "mongolia") return [4717, 4713].includes(p.id) || (p.acf?.country || "").includes("Mongolia");
        if (reg === "kyrgyzstan") return p.id === 4701 || (p.acf?.country || "").includes("Kyrgyzstan");
        if (reg === "inner-mongolia") return p.id === 4753 || (p.acf?.country || "").includes("Inner Mongolia");

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

  const visiblePrograms = getSortedPrograms();
  const currentIndex = activeModalProgram
    ? visiblePrograms.findIndex((p) => p.id === activeModalProgram.id)
    : -1;

  const getDifficultyIndex = (prog: Program) => {
    if (!prog) return 0;
    const diffVal = prog.acf?.difficulty_level ? Number(prog.acf.difficulty_level) : 0;
    if (diffVal >= 1 && diffVal <= 4) return diffVal;
    if (diffVal === 195) return 1;
    if (diffVal === 196) return 2;
    if (diffVal === 197) return 3;
    if (diffVal === 198) return 4;
    
    if (prog.skill_level?.includes(195)) return 1;
    if (prog.skill_level?.includes(196)) return 2;
    if (prog.skill_level?.includes(197)) return 3;
    if (prog.skill_level?.includes(198)) return 4;
    
    if (prog.skill_level && Array.isArray(prog.skill_level)) {
      for (const id of prog.skill_level) {
        const match = skills.find((sk) => sk.id === id);
        if (match) {
          const nameLower = match.name.toLowerCase();
          if (nameLower.includes("level 1") || nameLower.includes("novice") || nameLower.includes("foundation")) return 1;
          if (nameLower.includes("level 2") || nameLower.includes("intermediate")) return 2;
          if (nameLower.includes("level 3") || nameLower.includes("advanced") || nameLower.includes("expedition")) return 3;
          if (nameLower.includes("level 4") || nameLower.includes("master") || nameLower.includes("apex")) return 4;
        }
      }
    }

    const titleLower = prog.title.rendered.toLowerCase();
    if (titleLower.includes("level 1")) return 1;
    if (titleLower.includes("level 2")) return 2;
    if (titleLower.includes("level 3")) return 3;
    if (titleLower.includes("level 4")) return 4;
    return 0;
  };

  const getDifficultyLabel = (prog: Program): string | null => {
    if (!prog) return null;
    if (prog.skill_level && prog.skill_level.length > 0) {
      const names = prog.skill_level
        .map((id) => skills.find((sk) => sk.id === id)?.name)
        .filter(Boolean);
      if (names.length > 0) return names.join(" • ");
    }
    const levelIdx = getDifficultyIndex(prog);
    if (levelIdx === 1) return "Level 1: Novice / Open Access";
    if (levelIdx === 2) return "Level 2: Intermediate";
    if (levelIdx === 3) return "Level 3: Advanced Expedition";
    if (levelIdx === 4) return "Level 4: Master / High Altitude Apex";
    return null;
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
            {dot <= levelIndex && <div className="w-1 h-1 bg-[#0e3b2e] rounded-full" />}
          </div>
        ))}
        <span className="text-[9px] text-[#5c4629] font-bold uppercase tracking-wider ml-1 font-sans">
          L{levelIndex}
        </span>
      </div>
    );
  };

  // Only extract real, non-duplicate media URLs fetched directly from WordPress for this specific program if add_gallery toggle is enabled
  const getProgramGalleryUrls = (prog: Program): string[] => {
    if (!prog.acf?.add_gallery) {
      return [];
    }
    const galleryUrls: string[] = [];
    if (prog.acf?.supplementary_images && Array.isArray(prog.acf.supplementary_images)) {
      prog.acf.supplementary_images.forEach((id) => {
        if (media[id] && !galleryUrls.includes(media[id])) {
          galleryUrls.push(media[id]);
        }
      });
    }
    return galleryUrls;
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

  const initialOpenHandledRef = useRef(false);

  // Helper to open/close/change program modal and sync URL state cleanly
  const handleSelectProgram = (program: Program | null) => {
    setActiveModalProgram(program);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (program) {
        const slugOrId = program.slug || program.id.toString();
        url.searchParams.set("open", slugOrId);
      } else {
        url.searchParams.delete("open");
      }
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  };

  // Initial load check for 'open' query parameter (runs once when programs are available)
  useEffect(() => {
    if (initialOpenHandledRef.current) return;
    if (programs.length === 0) return;

    const openSlug = searchParams.get("open");
    if (openSlug) {
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
    initialOpenHandledRef.current = true;
  }, [searchParams, programs]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const openSlug = params.get("open");
      if (openSlug && programs.length > 0) {
        const match = programs.find(
          (p) =>
            p.slug === openSlug ||
            p.id.toString() === openSlug ||
            p.title.rendered.toLowerCase().includes(openSlug.toLowerCase())
        );
        setActiveModalProgram(match || null);
      } else {
        setActiveModalProgram(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [programs]);

  // Reset apply wizard states on program transition
  useEffect(() => {
    setIsApplying(false);
    setFormStep(1);
    setIsSubmitted(false);
    setShowValidationError(false);
    if (activeModalProgram) {
      setFormData((prev) => ({
        ...prev,
        programInterest: getDurationLabel(activeModalProgram)
          ? `${activeModalProgram.title.rendered} (${getDurationLabel(activeModalProgram)})`
          : activeModalProgram.title.rendered
      }));
    }
  }, [activeModalProgram]);

  const resetFilters = () => {
    setSelectedType("");
    setSelectedStatus("");
    setSelectedSkill("");
    setSelectedRegion("");
  };

  const getElementIcon = (element?: string, className: string = "w-6 h-6 text-accent mb-1.5") => {
    switch (element) {
      case "Wind":
        return <Wind className={className} />;
      case "Fire":
        return <Flame className={className} />;
      case "Water":
        return <Droplets className={className} />;
      case "Earth":
        return <Globe className={className} />;
      case "Spirit":
        return <Sparkles className={className} />;
      default:
        return <Compass className={className} />;
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

  const modalGalleryUrls = activeModalProgram ? getProgramGalleryUrls(activeModalProgram) : [];
  const modalDifficultyLabel = activeModalProgram ? getDifficultyLabel(activeModalProgram) : null;
  const modalDifficultyIdx = activeModalProgram ? getDifficultyIndex(activeModalProgram) : 0;

  const hasLocation = Boolean(
    (activeModalProgram?.acf?.main_location && activeModalProgram.acf.main_location.trim() !== "") ||
    (activeModalProgram?.acf?.country && activeModalProgram.acf.country.trim() !== "")
  );
  const hasArrival = Boolean(
    activeModalProgram?.acf?.closest_arrival_city && activeModalProgram.acf.closest_arrival_city.trim() !== ""
  );
  const hasDuration = Boolean(
    activeModalProgram ? getDurationLabel(activeModalProgram).trim() !== "" : false
  );
  const hasSeason = Boolean(
    activeModalProgram?.acf?.recommended_season && activeModalProgram.acf.recommended_season.trim() !== ""
  );
  const hasCapacity = Boolean(
    activeModalProgram?.acf?.group_size && activeModalProgram.acf.group_size.trim() !== ""
  );
  const hasElement = Boolean(
    activeModalProgram?.acf?.five_elements_connection && activeModalProgram.acf.five_elements_connection.trim() !== ""
  );
  const hasDifficulty = Boolean(
    modalDifficultyLabel || modalDifficultyIdx > 0
  );

  const hasAnySpecs = hasLocation || hasArrival || hasDuration || hasSeason || hasCapacity || hasElement || hasDifficulty;

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative">
      {/* 1. Hero Section */}
      <div className="relative w-full bg-[#0e3b2e] text-white py-20 md:py-28 px-6 overflow-hidden flex flex-col items-center justify-center border-b border-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.12),transparent_70%)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(14,59,46,0.5))] z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          <span className="inline-block px-4 py-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-full text-[10px] md:text-xs font-serif font-semibold tracking-widest uppercase text-accent">
            Jan Franko Academy
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Expeditions &amp; Training Programs
          </h1>
          <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto font-sans leading-relaxed">
            Curated field expeditions, immersive cultural stays, and structured archery training across pristine global wilderness landscapes.
          </p>

          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <Link
              href="/academy/curriculum"
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

        {/* Error State or Rendered Directory Grid */}
        {isLoading ? null : error ? (
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
            {visiblePrograms.map((program) => {
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
                  onClick={() => handleSelectProgram(program)}
                  className="program-card group bg-white border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-[400px] cursor-pointer opacity-100"
                >
                  {/* Top Image Banner */}
                  <div className="relative w-full h-[200px] bg-primary/10 overflow-hidden">
                    {bgUrl ? (
                      <Image
                        src={bgUrl}
                        alt={cleanTitle(program.title.rendered)}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/5" />
                    )}
                    {/* Difficulty Badge on Image */}
                    {(getDifficultyIndex(program) > 0 || getDifficultyLabel(program)) && (
                      <div className="absolute top-4 left-4 z-10 bg-secondary/95 border border-primary/15 rounded-full px-2.5 py-1 text-xs shadow-sm flex items-center gap-1">
                        {renderDifficultyMeter(getDifficultyIndex(program))}
                        {getDifficultyIndex(program) === 0 && getDifficultyLabel(program) && (
                          <span className="text-[9px] text-[#5c4629] font-bold uppercase tracking-wider font-sans">
                            {getDifficultyLabel(program)}
                          </span>
                        )}
                      </div>
                    )}
                    {/* Status Badge */}
                    {(statusName || program.acf?.event_status_label) && (
                      <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 bg-secondary/95 border border-primary/15 rounded-full text-xs font-serif font-bold text-primary shadow-sm flex items-center gap-1.5">
                        <span>{cleanTitle(program.acf?.event_status_label || statusName)}</span>
                        {program.acf?.event_date && (
                          <span className="text-[10px] text-[#5c4629] font-sans font-medium pl-1 border-l border-primary/20">
                            {cleanTitle(program.acf.event_date)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[9px] text-[#5c4629] font-bold tracking-widest uppercase font-serif">
                        {typeName ? <span>{cleanTitle(typeName)}</span> : <span />}
                        {getDifficultyLabel(program) && (
                          <span className="flex items-center gap-1 text-accent font-sans normal-case tracking-normal font-semibold">
                            <Target className="w-3 h-3 text-accent shrink-0" />
                            {getDifficultyLabel(program)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-serif font-bold text-primary leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">
                        {cleanTitle(program.title.rendered)}
                      </h3>
                      {program.acf?.subtitle && (
                        <p className="text-xs text-primary/85 italic font-normal line-clamp-1">
                          {cleanTitle(program.acf.subtitle)}
                        </p>
                      )}
                    </div>

                    {/* Quick Info Footer */}
                    <div className="border-t border-primary/5 pt-4 flex items-center justify-between text-xs text-primary/90 font-medium">
                      <span className="flex items-center gap-1.5 min-w-0 pr-4">
                        <MapPin className="w-4 h-4 text-[#5c4629] shrink-0" />
                        <span className="truncate">
                          {cleanTitle(
                            program.acf?.main_location && program.acf?.country
                              ? `${program.acf.main_location}, ${program.acf.country}`
                              : program.acf?.country || "Worldwide"
                          )}
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
            onClick={() => handleSelectProgram(null)}
          >
            {/* Left Chevron Button */}
            {!isApplying && (
              <button
                disabled={currentIndex <= 0}
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentIndex > 0) {
                    handleSelectProgram(visiblePrograms[currentIndex - 1]);
                  }
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
                onClick={() => handleSelectProgram(null)}
                className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-secondary/90 border border-primary/10 flex items-center justify-center text-primary hover:text-accent hover:border-accent/40 shadow-sm transition-all duration-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Image Banner and Core Metadata */}
              <div className="w-full md:w-[35%] relative min-h-[300px] md:min-h-auto bg-primary/20 flex flex-col justify-end">
                {activeModalProgram.acf?.background_image && media[activeModalProgram.acf.background_image] ? (
                  <Image
                    src={media[activeModalProgram.acf.background_image]}
                    alt={cleanTitle(activeModalProgram.title.rendered)}
                    fill
                    className="object-cover z-0"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#0e3b2e] z-0" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e3b2e] via-[#0e3b2e]/60 to-transparent z-10" />

                <div className="relative z-20 p-6 md:p-8 space-y-4 text-white">
                  <div className="space-y-1">
                    {activeModalProgram.program_type && activeModalProgram.program_type.length > 0 && (
                      <span className="text-[10px] font-serif font-bold uppercase tracking-widest text-accent">
                        {cleanTitle(
                          activeModalProgram.program_type
                            ?.map((id) => types.find((t) => t.id === id)?.name)
                            .filter(Boolean)
                            .join(" • ") || activeModalProgram.acf?.program_type || ""
                        )}
                      </span>
                    )}
                    <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight">
                      {cleanTitle(activeModalProgram.acf?.hero_headline_override || activeModalProgram.title.rendered)}
                    </h3>
                    {activeModalProgram.acf?.subtitle && (
                      <p className="text-xs text-white/85 italic font-normal">
                        {cleanTitle(activeModalProgram.acf.subtitle)}
                      </p>
                    )}
                  </div>

                  {/* Program Status & Schedule */}
                  {(activeModalProgram.acf?.event_status_label || activeModalProgram.acf?.event_date) && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl space-y-1">
                      <span className="text-[9px] font-serif uppercase tracking-widest text-white/70 block font-semibold">
                        Status &amp; Schedule
                      </span>
                      {activeModalProgram.acf?.event_status_label && (
                        <p className="text-xs font-serif font-bold text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span>{cleanTitle(activeModalProgram.acf.event_status_label)}</span>
                        </p>
                      )}
                      {activeModalProgram.acf?.event_date && (
                        <p className="text-[11px] font-sans text-accent pl-5">
                          {cleanTitle(activeModalProgram.acf.event_date)}
                        </p>
                      )}
                    </div>
                  )}

                  {(modalDifficultyIdx > 0 || modalDifficultyLabel) && (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
                      <Target className="w-5 h-5 text-accent shrink-0" />
                      <div className="text-xs">
                        <span className="block font-serif font-bold text-white">
                          {modalDifficultyLabel || `Level ${modalDifficultyIdx}`}
                        </span>
                        <span className="text-[10px] text-white/70">Skill Level &amp; Difficulty</span>
                      </div>
                    </div>
                  )}

                  {activeModalProgram.acf?.five_elements_connection && (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
                      {getElementIcon(activeModalProgram.acf.five_elements_connection, "w-5 h-5 text-accent shrink-0")}
                      <div className="text-xs">
                        <span className="block font-serif font-bold text-white">
                          {activeModalProgram.acf.five_elements_connection} Element
                        </span>
                        <span className="text-[10px] text-white/70">Five Elements Connection</span>
                      </div>
                    </div>
                  )}

                  {!isApplying && (
                    <button
                      onClick={() => setIsApplying(true)}
                      className="w-full py-3.5 px-6 bg-accent hover:bg-accent/90 text-[#0e3b2e] font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer text-center block mt-4"
                    >
                      Apply for Expedition
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Detailed Program Copy OR Multi-step Wizard */}
              <div className="w-full md:w-[65%] p-6 md:p-10 space-y-8 overflow-y-auto">
                {!isApplying ? (
                  <>
                    {/* Core Specs Grid Header */}
                    {hasAnySpecs && (
                      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
                          {/* 1. Location */}
                          {hasLocation && (
                            <div className="flex items-start gap-2.5">
                              <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-serif uppercase tracking-wider text-[#5c4629] font-bold block">
                                  Location
                                </span>
                                <span className="text-xs font-semibold text-primary block leading-tight">
                                  {cleanTitle(
                                    activeModalProgram.acf?.main_location && activeModalProgram.acf?.country
                                      ? `${activeModalProgram.acf.main_location}, ${activeModalProgram.acf.country}`
                                      : activeModalProgram.acf?.country || activeModalProgram.acf?.main_location || ""
                                  )}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 2. Difficulty / Skill Level */}
                          {hasDifficulty && (
                            <div className="flex items-start gap-2.5">
                              <Target className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-serif uppercase tracking-wider text-[#5c4629] font-bold block">
                                  Difficulty Level
                                </span>
                                <span className="text-xs font-semibold text-primary block leading-tight">
                                  {modalDifficultyLabel || `Level ${modalDifficultyIdx}`}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 3. Arrival Hub */}
                          {hasArrival && (
                            <div className="flex items-start gap-2.5">
                              <Plane className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-serif uppercase tracking-wider text-[#5c4629] font-bold block">
                                  Arrival Hub
                                </span>
                                <span className="text-xs font-semibold text-primary block leading-tight">
                                  {cleanTitle(activeModalProgram.acf?.closest_arrival_city || "")}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 4. Duration */}
                          {hasDuration && (
                            <div className="flex items-start gap-2.5">
                              <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-serif uppercase tracking-wider text-[#5c4629] font-bold block">
                                  Duration
                                </span>
                                <span className="text-xs font-semibold text-primary block leading-tight">
                                  {cleanTitle(getDurationLabel(activeModalProgram))}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 5. Season */}
                          {hasSeason && (
                            <div className="flex items-start gap-2.5">
                              <Calendar className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-serif uppercase tracking-wider text-[#5c4629] font-bold block">
                                  Season
                                </span>
                                <span className="text-xs font-semibold text-primary block leading-tight">
                                  {cleanTitle(activeModalProgram.acf?.recommended_season || "")}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 6. Capacity */}
                          {hasCapacity && (
                            <div className="flex items-start gap-2.5">
                              <Users className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-serif uppercase tracking-wider text-[#5c4629] font-bold block">
                                  Capacity
                                </span>
                                <span className="text-xs font-semibold text-primary block leading-tight">
                                  {cleanTitle(activeModalProgram.acf?.group_size || "")}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 7. Element */}
                          {hasElement && (
                            <div className="flex items-start gap-2.5">
                              {getElementIcon(activeModalProgram.acf?.five_elements_connection, "w-4 h-4 text-accent shrink-0 mt-0.5")}
                              <div>
                                <span className="text-[10px] font-serif uppercase tracking-wider text-[#5c4629] font-bold block">
                                  Element
                                </span>
                                <span className="text-xs font-semibold text-primary block leading-tight">
                                  {cleanTitle(activeModalProgram.acf?.five_elements_connection || "")}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Overview & Full Introduction */}
                    {(activeModalProgram.acf?.full_introduction || activeModalProgram.content?.rendered) && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-serif font-bold uppercase tracking-widest text-[#5c4629] flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-accent" />
                          Overview &amp; Program Scope
                        </h4>
                        <div
                          className="text-xs md:text-sm text-primary/85 leading-relaxed space-y-3 prose font-normal max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: cleanTitle(activeModalProgram.acf?.full_introduction || activeModalProgram.content.rendered)
                          }}
                        />
                      </div>
                    )}

                    {/* Environment & Terrain Details */}
                    {(activeModalProgram.acf?.terrain_description || activeModalProgram.acf?.climate_notes) && (
                      <div className="bg-primary/5 p-5 rounded-2xl space-y-3 border border-primary/10">
                        <h4 className="text-sm font-serif font-bold uppercase tracking-widest text-[#5c4629] flex items-center gap-2">
                          <Mountain className="w-4 h-4 text-accent" />
                          Environment &amp; Terrain Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          {activeModalProgram.acf?.terrain_description && (
                            <div className="sm:col-span-2">
                              <span className="font-bold text-primary block text-[10px] uppercase tracking-wider">Terrain Description</span>
                              <p className="text-primary/85 font-normal leading-relaxed mt-0.5">
                                {cleanTitle(activeModalProgram.acf.terrain_description)}
                              </p>
                            </div>
                          )}
                          {activeModalProgram.acf?.climate_notes && (
                            <div className="sm:col-span-2">
                              <span className="font-bold text-primary block text-[10px] uppercase tracking-wider">Climate &amp; Weather Notes</span>
                              <p className="text-primary/85 font-normal leading-relaxed mt-0.5">
                                {cleanTitle(activeModalProgram.acf.climate_notes)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Preparation & Equipment Logistics */}
                    {(activeModalProgram.acf?.travel_notes || activeModalProgram.acf?.equipment_notes || activeModalProgram.acf?.physical_preparation_notes) && (
                      <div className="bg-primary/5 p-5 rounded-2xl space-y-3 border border-primary/10">
                        <h4 className="text-sm font-serif font-bold uppercase tracking-widest text-[#5c4629] flex items-center gap-2">
                          <Compass className="w-4 h-4 text-accent" />
                          Logistics &amp; Preparation
                        </h4>
                        <div className="space-y-3 text-xs">
                          {activeModalProgram.acf?.equipment_notes && (
                            <div>
                              <span className="font-bold text-primary block text-[10px] uppercase tracking-wider">Equipment Requirements</span>
                              <p className="text-primary/85 font-normal leading-relaxed mt-0.5">{cleanTitle(activeModalProgram.acf.equipment_notes)}</p>
                            </div>
                          )}
                          {activeModalProgram.acf?.physical_preparation_notes && (
                            <div>
                              <span className="font-bold text-primary block text-[10px] uppercase tracking-wider">Physical Preparation</span>
                              <p className="text-primary/85 font-normal leading-relaxed mt-0.5">{cleanTitle(activeModalProgram.acf.physical_preparation_notes)}</p>
                            </div>
                          )}
                          {activeModalProgram.acf?.travel_notes && (
                            <div>
                              <span className="font-bold text-primary block text-[10px] uppercase tracking-wider">Travel &amp; Logistics Notes</span>
                              <p className="text-primary/85 font-normal leading-relaxed mt-0.5">{cleanTitle(activeModalProgram.acf.travel_notes)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Training Focus */}
                    {activeModalProgram.acf?.enable_training_focus && activeModalProgram.acf?.training_focus && activeModalProgram.acf.training_focus.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-primary/10">
                        <h4 className="text-sm font-serif font-bold uppercase tracking-widest text-[#5c4629] flex items-center gap-2">
                          <Target className="w-4 h-4 text-accent" />
                          Training Focus &amp; Competencies
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeModalProgram.acf.training_focus.map((item, idx) => (
                            <div key={idx} className="bg-white/60 border border-primary/5 p-4 rounded-2xl space-y-1">
                              <span className="text-xs font-serif font-bold text-primary block">
                                {cleanTitle(item.training_focus_title)}
                              </span>
                              <p className="text-xs text-primary/75 font-normal leading-relaxed">
                                {cleanTitle(item.training_focus_description)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Activities List */}
                    {activeModalProgram.acf?.enable_activities && activeModalProgram.acf?.activities_list && activeModalProgram.acf.activities_list.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-primary/10">
                        <h4 className="text-sm font-serif font-bold uppercase tracking-widest text-[#5c4629] flex items-center gap-2">
                          <Award className="w-4 h-4 text-accent" />
                          Curriculum &amp; Core Activities
                        </h4>
                        <div className="space-y-3">
                          {activeModalProgram.acf.activities_list.map((act, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-white/40 border border-primary/5 p-3.5 rounded-xl">
                              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <span className="text-xs font-serif font-bold text-primary block">
                                  {cleanTitle(act.activities_item_title)}
                                </span>
                                <p className="text-xs text-primary/75 font-normal leading-relaxed">
                                  {cleanTitle(act.activities_item_description)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Program Stages & Itinerary */}
                    {activeModalProgram.acf?.["enable_schedule_&_itinerary"] && activeModalProgram.acf?.program_stages__schedule && activeModalProgram.acf.program_stages__schedule.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-primary/10">
                        <h4 className="text-sm font-serif font-bold uppercase tracking-widest text-[#5c4629] flex items-center gap-2">
                          <Clock className="w-4 h-4 text-accent" />
                          Expedition Schedule &amp; Stages
                        </h4>
                        <div className="space-y-3">
                          {activeModalProgram.acf.program_stages__schedule.map((stage, idx) => (
                            <div key={idx} className="bg-white/60 border border-primary/5 p-4 rounded-2xl space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-serif font-bold text-primary block">
                                  {cleanTitle(stage.stage_title || `Stage ${idx + 1}`)}
                                </span>
                                {stage.stage_duration && (
                                  <span className="text-[10px] font-sans font-medium text-accent bg-[#0e3b2e]/10 px-2.5 py-0.5 rounded-full">
                                    {cleanTitle(stage.stage_duration)}
                                  </span>
                                )}
                              </div>
                              {stage.stage_description && (
                                <p className="text-xs text-primary/80 font-normal leading-relaxed">
                                  {cleanTitle(stage.stage_description)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Who This Is For */}
                    {((activeModalProgram.acf?.ideal_participant_for_list && activeModalProgram.acf.ideal_participant_for_list.length > 0) || (activeModalProgram.acf?.not_suitable_for_list && activeModalProgram.acf.not_suitable_for_list.length > 0)) && (
                      <div className="space-y-4 pt-4 border-t border-primary/10">
                        <h4 className="text-sm font-serif font-bold uppercase tracking-widest text-[#5c4629] flex items-center gap-2">
                          <Users className="w-4 h-4 text-accent" />
                          Participant Profile &amp; Suitability
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeModalProgram.acf?.ideal_participant_for_list && activeModalProgram.acf.ideal_participant_for_list.length > 0 && (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl space-y-2">
                              <span className="text-xs font-serif font-bold text-emerald-800 flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-emerald-700" />
                                Ideal Candidate
                              </span>
                              <ul className="space-y-1.5 text-xs text-primary/85">
                                {activeModalProgram.acf.ideal_participant_for_list.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                                    <span>{cleanTitle(item.ideal_participant_item)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {activeModalProgram.acf?.not_suitable_for_list && activeModalProgram.acf.not_suitable_for_list.length > 0 && (
                            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl space-y-2">
                              <span className="text-xs font-serif font-bold text-amber-800 flex items-center gap-1.5">
                                <XCircle className="w-4 h-4 text-amber-700" />
                                Not Suitable For
                              </span>
                              <ul className="space-y-1.5 text-xs text-primary/85">
                                {activeModalProgram.acf.not_suitable_for_list.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                                    <span>{cleanTitle(item.not_suitable_for_item)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Standards & Expectations */}
                    {activeModalProgram.acf?.standards_list && activeModalProgram.acf.standards_list.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-primary/10">
                        <h4 className="text-sm font-serif font-bold uppercase tracking-widest text-[#5c4629] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          Code of Practice &amp; Standards
                        </h4>
                        <div className="space-y-2">
                          {activeModalProgram.acf.standards_list.map((std, idx) => (
                            <div key={idx} className="text-xs text-primary/85 flex items-start gap-2 bg-white/40 p-3 rounded-xl border border-primary/5">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                              <span>{cleanTitle(std.standards_list_item)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Archer's Oath */}
                    {(activeModalProgram.acf?.archers_oath || activeModalProgram.acf?.["archer’s_oath"]) && (
                      <div className="bg-[#0e3b2e]/5 border border-[#0e3b2e]/15 p-5 rounded-2xl space-y-2 italic text-xs text-primary/90 font-serif">
                        <span className="not-italic text-[10px] font-bold uppercase tracking-widest text-accent block">
                          The Archer's Oath
                        </span>
                        <p className="leading-relaxed">
                          "{cleanTitle(activeModalProgram.acf.archers_oath || activeModalProgram.acf["archer’s_oath"] || "")}"
                        </p>
                      </div>
                    )}

                    {/* Investment & Pricing */}
                    {activeModalProgram.acf?.enable_pricing && (
                      <div className="bg-[#0e3b2e] text-white p-6 rounded-2xl space-y-4 shadow-md">
                        <div className="flex items-center justify-between border-b border-white/15 pb-3">
                          <span className="text-xs font-serif font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4" />
                            Program Investment
                          </span>
                          {activeModalProgram.acf?.base_price && (
                            <span className="text-xl font-serif font-bold text-white">
                              {cleanTitle(activeModalProgram.acf.base_price)}
                            </span>
                          )}
                        </div>

                        {activeModalProgram.acf?.investment_intro && (
                          <p className="text-xs text-white/85 font-normal leading-relaxed">
                            {cleanTitle(activeModalProgram.acf.investment_intro)}
                          </p>
                        )}

                        {activeModalProgram.acf?.investment_includes && activeModalProgram.acf.investment_includes.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-serif uppercase tracking-widest text-accent block">Investment Includes:</span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/90">
                              {activeModalProgram.acf.investment_includes.map((inc, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                                  <span>{cleanTitle(inc.investment_includes_items || "")}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Authentic WordPress Media Gallery (Rendered strictly if real program media exists) */}
                    {modalGalleryUrls.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-primary/10">
                        <h4 className="text-sm font-serif font-bold uppercase tracking-widest text-[#5c4629] flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-accent" />
                          Field Gallery
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {modalGalleryUrls.map((imgSrc, idx) => (
                            <div
                              key={idx}
                              onClick={() => setLightboxImage(imgSrc)}
                              className="relative h-32 rounded-xl overflow-hidden bg-primary/10 cursor-pointer group border border-primary/10 shadow-xs hover:border-accent transition-all duration-300"
                            >
                              <Image
                                src={imgSrc}
                                alt={`Field Gallery Image ${idx + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-[10px] text-white font-serif uppercase tracking-wider font-bold bg-primary/80 px-2.5 py-1 rounded-md">
                                  Enlarge
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Multi-step Application Wizard Form */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                      <div>
                        <span className="text-[10px] font-serif font-bold uppercase tracking-widest text-accent block">
                          Step {formStep} of {totalSteps}
                        </span>
                        <h4 className="text-xl font-serif font-bold text-primary">
                          {formStep === 1 && "Personal & Contact Information"}
                          {formStep === 2 && "Emergency Contact"}
                          {isHighDifficulty && formStep === 3 && "High Difficulty Clearance & Medical Consent"}
                          {((!isHighDifficulty && formStep === 3) || (isHighDifficulty && formStep === 4)) && "Archery Background & Experience"}
                          {formStep === totalSteps && "Review & Submit Application"}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsApplying(false)}
                        className="text-xs font-serif font-bold text-primary/60 hover:text-primary underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    {showValidationError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Please fill in all required fields marked with * before continuing.</span>
                      </div>
                    )}

                    {/* Step 1: Personal Info */}
                    {formStep === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="Full Legal Name"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            value={formData.dob}
                            onChange={(e) => handleInputChange("dob", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Nationality *
                          </label>
                          <input
                            type="text"
                            value={formData.nationality}
                            onChange={(e) => handleInputChange("nationality", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="Nationality"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Country of Residence *
                          </label>
                          <input
                            type="text"
                            value={formData.countryResidence}
                            onChange={(e) => handleInputChange("countryResidence", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="Country of Residence"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Primary Language *
                          </label>
                          <input
                            type="text"
                            value={formData.primaryLang}
                            onChange={(e) => handleInputChange("primaryLang", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="Primary Language"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="name@domain.com"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="+1 555-0199"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Emergency Contact */}
                    {formStep === 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Emergency Contact Name *
                          </label>
                          <input
                            type="text"
                            value={formData.emergencyName}
                            onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="Full Name of Contact"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Relationship *
                          </label>
                          <input
                            type="text"
                            value={formData.emergencyRelation}
                            onChange={(e) => handleInputChange("emergencyRelation", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="Spouse / Parent / Friend"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Emergency Phone *
                          </label>
                          <input
                            type="tel"
                            value={formData.emergencyPhone}
                            onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="+1 555-0199"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* High Difficulty Medical Step (Step 3 if level 3 or 4) */}
                    {isHighDifficulty && formStep === 3 && (
                      <div className="space-y-4">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
                          <h5 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4 text-amber-700" />
                            Level 3/4 Physical &amp; Medical Clearance Required
                          </h5>
                          <p className="text-xs text-primary/80 leading-relaxed">
                            This program involves demanding mountain terrain, variable weather conditions, and high-intensity practice. Please review physical requirements before proceeding.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold block">
                            Do you consent to medical screening and confirm physical readiness? *
                          </label>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-primary">
                              <input
                                type="radio"
                                name="medicalConsent"
                                value="Yes"
                                checked={formData.medicalConsentChecked === "Yes"}
                                onChange={() => handleInputChange("medicalConsentChecked", "Yes")}
                              />
                              Yes, I confirm physical readiness
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3 or 4: Archery Experience */}
                    {((!isHighDifficulty && formStep === 3) || (isHighDifficulty && formStep === 4)) && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Do you currently practice traditional archery?
                          </label>
                          <select
                            value={formData.practiceArchery}
                            onChange={(e) => handleInputChange("practiceArchery", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                          >
                            <option value="No">No (Beginner)</option>
                            <option value="Yes">Yes (Practitioner)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Years of Experience
                          </label>
                          <input
                            type="text"
                            value={formData.archeryYears}
                            onChange={(e) => handleInputChange("archeryYears", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="e.g. 2 years / Complete beginner"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-serif uppercase tracking-wider text-[#5c4629] font-bold">
                            Bow Tradition / Style
                          </label>
                          <input
                            type="text"
                            value={formData.archeryBowTradition}
                            onChange={(e) => handleInputChange("archeryBowTradition", e.target.value)}
                            className="w-full bg-white text-primary border border-primary/15 rounded-xl p-3 text-xs outline-none focus:border-accent"
                            placeholder="e.g. Asiatic Thumb Draw, English Longbow, Kyudo"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step Final: Review & Submit */}
                    {formStep === totalSteps && (
                      <div className="space-y-4">
                        {isSubmitted ? (
                          <div className="text-center py-8 space-y-3">
                            <CheckCircle2 className="w-12 h-12 text-accent mx-auto" />
                            <h4 className="text-xl font-serif font-bold text-primary">Application Submitted</h4>
                            <p className="text-xs text-primary/75 max-w-md mx-auto">
                              Thank you for submitting your application for {activeModalProgram.title.rendered}. Our team will review your application and respond shortly.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-xs text-primary/80 leading-relaxed">
                              Please review your application details for <strong>{activeModalProgram.title.rendered}</strong>. By submitting, you confirm the details provided are accurate.
                            </p>
                            <div className="bg-white/60 p-4 rounded-2xl space-y-2 text-xs">
                              <div><strong>Applicant:</strong> {formData.fullName} ({formData.email})</div>
                              <div><strong>Program:</strong> {activeModalProgram.title.rendered}</div>
                              <div><strong>Contact:</strong> {formData.phone}</div>
                            </div>
                            <button
                              type="submit"
                              className="w-full py-4 px-6 bg-primary text-secondary font-serif font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary/95 transition-colors cursor-pointer"
                            >
                              Submit Application
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    {!isSubmitted && (
                      <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                        {formStep > 1 ? (
                          <button
                            type="button"
                            onClick={() => setFormStep((prev) => prev - 1)}
                            className="px-5 py-2.5 border border-primary/20 rounded-xl text-xs font-serif font-bold text-primary hover:border-primary cursor-pointer"
                          >
                            Back
                          </button>
                        ) : <div />}

                        {formStep < totalSteps && (
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="px-6 py-2.5 bg-accent text-[#0e3b2e] rounded-xl text-xs font-serif font-bold uppercase tracking-wider hover:bg-accent/90 cursor-pointer"
                          >
                            Next Step
                          </button>
                        )}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Right Chevron Button */}
            {!isApplying && (
              <button
                disabled={currentIndex === -1 || currentIndex >= visiblePrograms.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentIndex !== -1 && currentIndex < visiblePrograms.length - 1) {
                    handleSelectProgram(visiblePrograms[currentIndex + 1]);
                  }
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
}
