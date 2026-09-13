import type { Metadata } from "next";
import AcademyReferencePage from "@/components/AcademyReferencePage";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Training Philosophy | Jan Franko Academy",
  description: "The Jan Franko Academy approach to instinctive precision, breath, natural settings, and form-led traditional archery.",
  canonicalUrl: "/academy/training-philosophy",
});

const sections = [
  {
    title: "The arrow is a mirror",
    paragraphs: ["A shot reveals more than whether an arrow reaches the centre. It reflects posture, breath, attention, timing, and the ability to remain composed. Training therefore develops the archer and the shot together."],
    quote: "The way of the bow is not to force the arrow, but to remove what prevents a clear shot.",
  },
  {
    title: "Four training pillars",
    items: [
      { title: "Instinctive Precision", text: "Build reliable alignment and spatial judgment without depending on mechanical sights." },
      { title: "Meditative Breath", text: "Use natural breathing to organise posture, attention, draw, and release." },
      { title: "Alpine Harmony", text: "Learn to work responsibly with terrain, weather, distance, and the natural setting." },
      { title: "Form Over Results", text: "Prioritise repeatable, safe movement and honest feedback over chasing a score." },
    ],
  },
  {
    title: "How a session develops",
    items: [
      { title: "Foundation", text: "Equipment check, safe range procedure, stance, grip, alignment, and a stable T-frame." },
      { title: "Anchor", text: "A repeatable draw path and anchor adapted to the bow, draw method, and archer." },
      { title: "Zen of Release", text: "A clean release and balanced follow-through developed without unnecessary tension." },
    ],
  },
  {
    title: "Practical questions",
    bullets: [
      "You do not need to own a bow for an introductory session; availability of suitable equipment is confirmed before booking.",
      "Children from approximately eight years old may be considered after an individual suitability and supervision review.",
      "Outdoor practice may continue in manageable weather with suitable clothing; unsafe conditions require adaptation, relocation, postponement, or cancellation.",
      "Recommended clothing, footwear, and personal equipment depend on the location and are confirmed before the session.",
    ],
  },
] as const;

export default function TrainingPhilosophyPage() {
  return (
    <AcademyReferencePage
      eyebrow="The way of the bow"
      title="Training Philosophy"
      intro="Traditional archery taught through alignment, breath, awareness, cultural respect, and responsible practice in natural environments."
      sections={sections}
    />
  );
}
