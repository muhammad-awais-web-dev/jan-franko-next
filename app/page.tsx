import ExpeditionRegions from "@/components/Home/ExpeditionRegions";
import Institute from "@/components/Home/Institute";
import FounderBlock from "@/components/Home/FounderBlock";
import Hero from "@/components/Home/Hero";
import HeroMobile from "@/components/Home/HeroMobile";
import Contact from "@/components/Home/Contact";
import FeedbackForm from "@/components/Home/FeedbackForm";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Jan Franko | Traditional Archery Academy & Expeditions",
  description: "Traditional archery academy focused on structured training, cultural study, biomechanical precision, and global wilderness expeditions.",
  ogImage: "/opengraph-image",
});

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between">
      <div className="w-full hidden md:block">
        <Hero />
      </div>
      <div className="w-full block md:hidden">
        <HeroMobile />
      </div>
      <ExpeditionRegions/>
      <Institute />
      <FounderBlock />
      <FeedbackForm />
      <Contact />
    </main>
  );
}
