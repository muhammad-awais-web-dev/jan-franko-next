import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Compass,
  Award,
  BookOpen,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Shield,
  HeartPulse,
  Flame,
  Globe,
  CheckCircle2
} from "lucide-react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Jan Franko | Founder & Lead Instructor — The Path of the Bow",
  description: "Explore the life, training chronology, biomechanical methodology, and global field research of Jan Franko, founder of Explorer Adventures Traditional Archery Academy.",
  ogImage: "/images/wp-assets/jan-franko-profile.jpeg",
});

export default function JanFrankoProfilePage() {
  const chronologyEvents = [
    {
      period: "1978",
      title: "Birth",
      desc: "Born in 1978, the Year of the Horse, under the zodiac sign of Leo."
    },
    {
      period: "Early Childhood",
      title: "Early Curiosity & Discovery of the World",
      desc: "Fascinated by maps, continents, mineralogy, and indigenous cultures through books by Miloslav Stingl and historical writings of Pavel Dvořák, sparking a lasting interest in ethnography, anthropology, and human cultures."
    },
    {
      period: "1985",
      title: "First Encounter with the Bow",
      desc: "At seven years old, cousin Marek crafted a handmade wooden self bow with broadhead arrows. Holding that bow quietly changed the direction of his life."
    },
    {
      period: "2000",
      title: "Traditional Chinese Medicine & Therapeutic Practice",
      desc: "Began studying acupuncture and Traditional Chinese Medicine in Prague at the First School of Traditional Medicine under Beijing University professors, along with therapeutic bodywork, laying an unexpected foundation for teaching posture, tension release, and breath alignment in archery."
    },
    {
      period: "2011",
      title: "Korean Traditional Bow & Self-Training",
      desc: "Discovered Musashi's Book of Five Rings and the samurai lineage of Kyūjutsu. Obtained his first Korean traditional bow, training intensively alone — by daylight and in complete darkness — to master instinct, draw mechanics, and internal stillness."
    },
    {
      period: "2020",
      title: "Longbow & Mentorship under Henry Bodnik",
      desc: "Acquired his first longbow and began formal mentorship under Henry Bodnik (founder of Bodnik Bows), refining traditional archery methodology and teaching mechanics."
    },
    {
      period: "2024",
      title: "Bowhunting Qualification",
      desc: "Completed specialised bowhunting course led by Chris Mozolowski (President of the Swiss Federation of Bowhunting), scoring 98% on the theoretical examination as the sole traditional bow archer."
    }
  ];

  const fourPillars = [
    {
      title: "Biomechanical Precision",
      desc: "Alignment of shoulders, draw arm, scapular tension, and ground root."
    },
    {
      title: "Breath Regulation & Qigong",
      desc: "Using breath to drop heart rate, release tension, and stabilize aim."
    },
    {
      title: "Holistic Recovery",
      desc: "Post-training regeneration and structural release."
    },
    {
      title: "Cultural Respect & Lineage",
      desc: "Reflecting a deep study of Asiatic composite bows, European longbows, and traditional archery craft."
    }
  ];

  const languages = [
    { name: "Slovak", level: "Native" },
    { name: "Czech", level: "Fluent" },
    { name: "German", level: "Fluent" },
    { name: "English", level: "Fluent" },
    { name: "Russian", level: "Fluent" },
    { name: "Spanish", level: "Fluent" },
    { name: "Polish", level: "Working Understanding" },
    { name: "Ukrainian", level: "Working Understanding" },
    { name: "Serbo-Croatian", level: "Working Understanding" },
    { name: "French", level: "Basic Conversational" },
    { name: "Italian", level: "Basic Conversational" },
    { name: "Japanese", level: "Basic Conversational" },
    { name: "Portuguese", level: "Basic Conversational" }
  ];

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative">
      {/* 1. Hero Header Section */}
      <div className="relative w-full bg-[#0e3b2e] text-white py-16 md:py-24 px-6 overflow-hidden border-b border-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.12),transparent_70%)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(14,59,46,0.6))] z-0" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          {/* Left Column: Portrait Photo */}
          <div className="lg:col-span-5 relative aspect-[3/4] w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black/40">
            <Image
              src="/images/wp-assets/jan-franko-profile.jpeg"
              alt="Jan Franko"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e3b2e]/90 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1 z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
                Lead Instructor
              </span>
              <h3 className="font-serif text-xl font-bold">Jan Franko</h3>
            </div>
          </div>

          {/* Right Column: Key Narrative Bio Header */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#c5a880]/15 border border-[#c5a880]/35 rounded-full text-xs font-serif font-semibold tracking-widest uppercase text-accent">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Founder &amp; Lead Instructor
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                Jan Franko
              </h1>
              <p className="text-sm md:text-base font-serif text-accent uppercase tracking-wider font-semibold">
                Founder &amp; Lead Instructor — The Path of the Bow
              </p>
            </div>

            {/* Core Positioning Quote */}
            <blockquote className="border-l-2 border-accent pl-5 py-3 text-base md:text-xl font-serif italic text-white/95 leading-relaxed bg-white/5 rounded-r-2xl">
              "Archery is not only about the bow and the arrow. It is about the relationship between the body, breath, movement, attention and intention."
            </blockquote>

            {/* Badges / Experience Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white/10 border border-white/15 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold block">Traditional Archery</span>
                <span className="text-sm md:text-base font-serif font-bold text-white">Practicing Since 1985</span>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold block">TCM Education</span>
                <span className="text-sm md:text-base font-serif font-bold text-white">Studying Since 2000</span>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
              <a
                href="https://wa.me/436641645360"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-[#0e3b2e] rounded-full font-serif text-xs uppercase tracking-widest font-bold transition-all shadow-md hover:scale-105"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: +43 664 164 53 60</span>
              </a>
              <a
                href="mailto:contact@janfranko.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-serif text-xs uppercase tracking-widest font-bold transition-all hover:scale-105"
              >
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span>contact@janfranko.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Body — Appendix A Text */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24 space-y-16">

        {/* Section 1: The Path of the Bow Chronology */}
        <div className="space-y-8">
          <div className="space-y-2 border-b border-primary/10 pb-4">
            <span className="text-xs font-serif uppercase tracking-[0.2em] text-[#7d603a] font-bold block">
              Chronology &amp; Lineage
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary tracking-tight">
              The Path of the Bow
            </h2>
          </div>

          <div className="space-y-10">
            {chronologyEvents.map((item, idx) => (
              <div key={idx} className="relative pl-8 md:pl-10 border-l-2 border-[#c5a880]/30 space-y-2 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-secondary border-2 border-accent group-hover:bg-accent transition-colors" />
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider bg-accent/10 px-2.5 py-0.5 rounded-full">
                    {item.period}
                  </span>
                  <h3 className="text-lg md:text-xl font-serif font-bold text-primary">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-primary/85 font-sans leading-relaxed pt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Movement, Breath & Instinctive Focus */}
        <div className="space-y-6 bg-white border border-primary/10 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="space-y-2 border-b border-primary/10 pb-4">
            <span className="text-xs font-serif uppercase tracking-[0.2em] text-[#7d603a] font-bold block">
              Philosophy &amp; Method
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              Movement, Breath &amp; Instinctive Focus
            </h2>
          </div>

          <div className="space-y-4 text-sm md:text-base text-primary/85 font-sans leading-relaxed">
            <p>
              My approach to traditional archery is distinct from conventional sport shooting or mechanical target practice. Years of hands-on therapeutic and bodywork practice gave me a practical understanding of how physical tension, skeletal alignment, breathing rhythms, and mental state directly shape archery performance.
            </p>
            <p>
              In instinctive traditional archery, the shot isn't engineered through artificial sights or static anchors. It is executed through full-body coordination, centered posture, and relaxed focus. Principles from Traditional Chinese Medicine, Tuina, and Qigong inform how I teach natural posture, structural release, and diaphragmatic breathing, helping archers build enduring stamina, avoid repetitive strain, and hold a calm, instinctive presence in any terrain, from alpine forests to the open winds of the Eurasian steppe.
            </p>
            <p className="font-serif font-semibold text-primary">
              My teaching rests on four pillars:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {fourPillars.map((pillar, idx) => (
              <div key={idx} className="bg-secondary/50 border border-primary/5 rounded-2xl p-5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent shrink-0" />
                  <h4 className="font-serif font-bold text-primary text-base">{pillar.title}</h4>
                </div>
                <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed pl-6">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Field Work & Cultural Research */}
        <div className="space-y-6">
          <div className="space-y-2 border-b border-primary/10 pb-4">
            <span className="text-xs font-serif uppercase tracking-[0.2em] text-[#7d603a] font-bold block">
              Global Field Research
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              Field Work &amp; Cultural Research
            </h2>
          </div>

          <div className="space-y-5 text-sm md:text-base text-primary/85 font-sans leading-relaxed">
            <p>
              Beyond personal training and teaching, a core part of this project is the exploration and documentation of traditional archery cultures around the world — observing, learning from, and preserving living traditions of the bow among nomadic peoples, traditional craftsmen, and practitioners who carry these skills forward across generations.
            </p>
            <p>
              Current exploration regions include Europe, Mongolia, Iran, Turkey, Korea, Japan, Bhutan, South Africa, North America (Yukon), and South America, including Patagonia. For Kyrgyzstan and Tajikistan, we have already partnered with a trusted local guide, and fully guided expeditions to both regions are currently in development. In Kazakhstan, we are in the process of identifying local partners who meet the same standard, to ensure a consistent level of expertise and access across the region.
            </p>
            <p>
              Further expansion is planned for 2027, extending this research into the archery traditions of the Americas. In Mexico, the focus will center on the state of Querétaro, historic heartland of the Chichimeca peoples — a confederation of nomadic warrior groups whose hit-and-run mounted archery tactics fuelled the longest and costliest conflict of the Spanish colonial era, the Chichimeca War. In Panama and Colombia, expeditions will focus on the Emberá people of the Darién region, whose hand-carved bows remain in active use for hunting today — a rare living tradition rather than a purely historical one. In Guatemala, research will center on the Maya lowlands of Petén, where archaeological evidence confirms the bow and arrow served as a significant weapon of both hunting and warfare during the Postclassic period.
            </p>
            <p>
              In Brazil, the project will explore two distinct threads of the same living tradition. In Curitiba, Paraná, and Florianópolis (Floripa), Santa Catarina — ancestral territory of the Guarani, for whom bow and arrow (guyrapa and ru'y) remain both a functional hunting tool and a sacred object — the offer will take the form of a retreat and cultural exploration, set against the region's forests and coastline. Deeper into the Amazon, an expedition based around Manaus will engage directly with Amazonian peoples for whom the bow remains an active, unbroken hunting tradition — among them the Awá and neighboring groups, who still hand-craft bows and arrows from native hardwoods and bamboo exactly as their ancestors did.
            </p>
            <p>
              Further south, expeditions to Patagonia — spanning both Argentina and Chile — will explore the archery legacy of the Tehuelche and Selk'nam peoples, nomadic hunter-gatherers who relied on the bow as their primary tool for hunting guanaco across some of the harshest terrain on the continent.
            </p>
          </div>
        </div>

        {/* Section 4: Vision */}
        <div className="bg-[#0e3b2e] text-white rounded-3xl p-8 md:p-12 space-y-4 shadow-xl border border-white/10">
          <span className="text-xs font-serif uppercase tracking-widest text-accent font-bold block">
            Institutional Vision
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold">Vision</h2>
          <p className="text-sm md:text-base text-white/85 font-sans leading-relaxed">
            Through the Explorer Adventures Traditional Archery Academy, the goal is to explore, study, and preserve traditional archery cultures through structured training, international expeditions, the preservation of historical knowledge, and a growing global network of traditional archers and craftsmen.
          </p>
        </div>

        {/* Section 5: Background & Credentials */}
        <div className="space-y-8">
          <div className="space-y-2 border-b border-primary/10 pb-4">
            <span className="text-xs font-serif uppercase tracking-[0.2em] text-[#7d603a] font-bold block">
              Qualifications &amp; Practice
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              Background &amp; Credentials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Archery */}
            <div className="bg-white border border-primary/10 rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2 border-b border-primary/5 pb-2">
                <Award className="w-4 h-4 text-accent" />
                Traditional Archery
              </h3>
              <p className="text-xs md:text-sm text-primary/80 font-sans leading-relaxed">
                Practicing since 1985, when I first picked up a bow as a child; self-directed and intensive personal training deepened from 2011 with a focus on Asiatic and Korean traditional bow disciplines. Formal instruction followed later, under Henry Bodnik of Bodnik Bows (from 2020) and Chris Mozolowski of the Swiss Federation of Bowhunting (2024).
              </p>
            </div>

            {/* Traditional Chinese Medicine & Bodywork */}
            <div className="bg-white border border-primary/10 rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2 border-b border-primary/5 pb-2">
                <HeartPulse className="w-4 h-4 text-accent" />
                Traditional Chinese Medicine &amp; Bodywork
              </h3>
              <p className="text-xs md:text-sm text-primary/80 font-sans leading-relaxed">
                Formal TCM education from 2000 at the First School of Traditional Medicine in Prague, with continuing advanced studies through TCM INSTITUT. Extensive practical experience in Tuina, acupressure, and therapeutic bodywork, applied directly to how I teach body mechanics and breath control in archery.
              </p>
            </div>

            {/* International Experience */}
            <div className="bg-white border border-primary/10 rounded-2xl p-6 space-y-3 shadow-sm md:col-span-2">
              <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2 border-b border-primary/5 pb-2">
                <Globe className="w-4 h-4 text-accent" />
                International Experience
              </h3>
              <p className="text-xs md:text-sm text-primary/80 font-sans leading-relaxed">
                Professional practice spanning Central Europe, the Alps, and internationally — including Bratislava and Košice, Slovakia; Prague, Czech Republic; the Vorarlberg region (Lech, Oberlech, Warth) and Kitzbühel, Tux, and Hintertux in Tirol; Innsbruck and the wider Tirol region, Austria; Heidelberg and Sankt Peter-Ording, Germany; Fiesch and Brig, Valais, Switzerland; Tenerife (Canary Islands) and Palma de Mallorca (Balearic Islands), Spain; and Bogotá, Medellín, and Cali, Colombia, working with both corporate and private clients. Further international experience includes private yacht work aboard the 60-metre M/Y Paloma for corporate clients from France, across the British Virgin Islands, St. Maarten, and Malta, as well as a role with a renowned international hospitality company across five-star hotel properties in the Dominican Republic, alongside private clients.
              </p>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white border border-primary/10 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-primary border-b border-primary/5 pb-2">
              Languages
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {languages.map((item, idx) => (
                <div key={idx} className="bg-secondary/40 border border-primary/5 rounded-xl p-3 space-y-0.5">
                  <span className="font-serif font-bold text-xs text-primary block">{item.name}</span>
                  <span className="text-[10px] text-primary/60 font-sans block">{item.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 6: Call to Action */}
        <div className="text-center space-y-6 pt-6 border-t border-primary/10">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary">
            Ready to train or consult? Reach out directly via WhatsApp or the inquiry form.
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/436641645360"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0e3b2e] hover:bg-[#071f18] text-white rounded-full font-serif text-xs uppercase tracking-widest font-bold transition-all shadow-md hover:scale-105"
            >
              <Phone className="w-4 h-4 text-accent" />
              <span>WhatsApp: +43 664 164 53 60</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent/90 text-primary rounded-full font-serif text-xs uppercase tracking-widest font-bold transition-all shadow-md hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>Inquiry Form</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
