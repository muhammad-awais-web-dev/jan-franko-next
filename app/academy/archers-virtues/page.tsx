import type { Metadata } from "next";
import AcademyReferencePage from "@/components/AcademyReferencePage";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "The Archer’s Virtues | Jan Franko Academy",
  description: "Seven virtues that guide training, conduct, and responsibility at the Jan Franko Academy.",
  canonicalUrl: "/academy/archers-virtues",
});

const sections = [
  {
    title: "Seven virtues",
    items: [
      { title: "Integrity", text: "Act honestly, keep agreements, and take responsibility for every shot and decision." },
      { title: "Respect", text: "Respect people, traditions, equipment, hosts, animals, and the land where practice takes place." },
      { title: "Courage", text: "Meet difficulty without recklessness and speak up when a situation is unsafe or wrong." },
      { title: "Honor", text: "Represent the practice with dignity and value conduct above status or display." },
      { title: "Compassion", text: "Support fellow practitioners and never use skill to intimidate, humiliate, or cause needless harm." },
      { title: "Sincerity", text: "Train with genuine intent, accept correction, and avoid pretending to knowledge or mastery not earned." },
      { title: "Duty & Loyalty", text: "Protect the safety of the group, care for shared traditions, and remain loyal to ethical practice rather than personalities." },
    ],
  },
  {
    title: "Application in practice",
    bullets: [
      "Follow range commands and help preserve a safe practice environment.",
      "Credit bowyers, teachers, photographers, cultures, and sources accurately.",
      "Treat correction as part of learning and offer feedback without humiliation.",
      "Leave training places, host communities, and natural environments with care.",
      "Do not misrepresent rank, experience, equipment provenance, or another tradition.",
    ],
  },
  {
    title: "The Archer’s Oath",
    quote: "I take up the bow with respect for the traditions that shaped it. I train with discipline, patience, and humility. I seek mastery not only of the arrow, but of my own character. May my practice honor the path of the bow.",
  },
] as const;

export default function ArchersVirtuesPage() {
  return (
    <AcademyReferencePage
      eyebrow="Character before status"
      title="The Archer’s Virtues"
      intro="The Academy’s code of personal conduct: seven virtues expressed through safe practice, accurate attribution, humility, and care for others."
      sections={sections}
    />
  );
}
