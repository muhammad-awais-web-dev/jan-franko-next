import type { Metadata } from "next";
import AcademyReferencePage from "@/components/AcademyReferencePage";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Special Practice Retreats | Jan Franko Academy",
  description: "Small-cohort traditional archery retreats combining focused practice, field conditions, and cultural study.",
  canonicalUrl: "/academy/special-practice-retreats",
});

const sections = [
  {
    title: "Retreat modules",
    paragraphs: ["Retreats are designed for small cohorts of 6–12 participants. Each booking is preceded by a suitability and safety review; modules are offered only when location, staffing, and conditions allow."],
    items: [
      { title: "Night Practice", text: "Supervised low-light practice focused on awareness, safe range discipline, and calm execution." },
      { title: "Archery & Systema", text: "Movement, posture, breath, and coordinated body mechanics explored alongside archery practice." },
      { title: "Archery & Fasting", text: "An optional, individually assessed module. It is not medical advice and is unsuitable for some participants; medical clearance may be required." },
      { title: "Night Owl", text: "A focused night-awareness format offered only under controlled conditions and direct supervision." },
    ],
  },
  {
    title: "Retreat formats and prices",
    items: [
      { title: "Foundational — 24 hours", text: "From €250 per participant." },
      { title: "Intensive — 48 hours", text: "€490 per participant." },
      { title: "Expedition — 72–96 hours", text: "From €750 per participant." },
      { title: "Private retreat", text: "Custom format and quotation on request." },
    ],
  },
  {
    title: "Practice restrictions",
    bullets: [
      "No alcohol during the retreat.",
      "Smoking is limited to a maximum of two cigarettes per day in designated areas only.",
      "Coffee is limited to one or two servings per day; it must be black during an approved fasting module.",
      "Every participant must follow instructor commands and location-specific safety rules immediately.",
      "A preliminary skill-tier and health-readiness review is required before acceptance.",
    ],
  },
] as const;

export default function SpecialPracticeRetreatsPage() {
  return (
    <AcademyReferencePage
      eyebrow="Focused practice in small cohorts"
      title="Special Practice Retreats"
      intro="Immersive 24–96 hour formats that combine disciplined archery practice with carefully selected environmental and body-awareness modules."
      sections={sections}
      ctaLabel="Ask about a retreat"
    />
  );
}
