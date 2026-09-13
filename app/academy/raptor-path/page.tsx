import type { Metadata } from "next";
import AcademyReferencePage from "@/components/AcademyReferencePage";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "The Raptor Path | Jan Franko Academy",
  description: "A symbolic progression of traditional archery mastery through awareness, precision, focus, and leadership.",
  canonicalUrl: "/academy/raptor-path",
});

const sections = [
  {
    title: "Six symbolic ranks",
    paragraphs: ["The Raptor Path uses birds of prey as symbols for qualities developed through sustained practice. Progression is based on demonstrated practice and judgment, not attendance alone."],
    items: [
      { title: "Sparrowhawk", text: "Agility and instinct." },
      { title: "Buzzard", text: "Observation and patience." },
      { title: "Goshawk", text: "Precision and decisiveness." },
      { title: "Peregrine", text: "Speed and focus." },
      { title: "Golden Eagle", text: "Mastery and leadership." },
      { title: "Eagle Owl", text: "Night awareness and calm perception." },
    ],
  },
  {
    title: "Three phases of practice",
    items: [
      { title: "Regulated", text: "Build repeatable form, safety discipline, breath, and equipment care under guided conditions." },
      { title: "Variable", text: "Adapt those foundations to changing distance, terrain, light, weather, and pressure." },
      { title: "Sovereign", text: "Demonstrate sound independent judgment, self-regulation, consistency, and responsibility toward others." },
    ],
  },
  {
    title: "How progression is developed",
    items: [
      { title: "Training Path", text: "Technical practice, repetition, feedback, and safe progression." },
      { title: "Field Practice", text: "Applying skill in natural environments and changing conditions." },
      { title: "Cultural Study", text: "Understanding the traditions, communities, and material culture connected to the bow." },
    ],
  },
] as const;

export default function RaptorPathPage() {
  return (
    <AcademyReferencePage
      eyebrow="A symbolic progression of archery mastery"
      title="The Raptor Path"
      intro="A training path that links archery skill with patience, awareness, responsibility, and character."
      sections={sections}
      ctaLabel="Request a rank evaluation"
    />
  );
}
