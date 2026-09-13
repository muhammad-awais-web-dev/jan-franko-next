import React from "react";
import Link from "next/link";
import { Compass, Shield, Target, BookOpen, MapPin, Award } from "lucide-react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "About the Academy | Traditional Archery - Jan Franko",
  description: "Learn about our structured traditional archery training, wilderness expeditions, and cultural studies exploring historic global archery heritages.",
});

const AboutPage = () => {
  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative">
      
      {/* Hero Header Section */}
      <div className="relative w-full bg-[#0e3b2e] text-white py-20 md:py-28 px-6 overflow-hidden flex flex-col items-center justify-center border-b border-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.12),transparent_70%)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(14,59,46,0.5))] z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-full text-[10px] md:text-xs font-serif font-semibold tracking-widest uppercase text-accent animate-fade-in">
            Traditional Archery Academy
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            About the Academy
          </h1>
          <p className="text-sm md:text-base text-white/80 font-normal max-w-2xl mx-auto leading-relaxed">
            An independent, field-based training project studying the bow not simply as sporting equipment, but as a practical discipline combining skill, movement, attention, and the natural landscape.
          </p>
          <div className="pt-2 flex justify-center">
            <div className="w-12 h-[1px] bg-[#c5a880]/30" />
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-16 md:space-y-24">
        
        {/* Core Description Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
                Our Focus &amp; Purpose
              </h2>
              <div className="w-12 h-[1.5px] bg-accent/40" />
            </div>
            <div className="space-y-4 text-base md:text-lg text-primary/80 font-light leading-relaxed font-sans">
              <p>
                Founded by <span className="notranslate" translate="no">Jan Franko</span>, the academy operates with a clear purpose: to study and practice traditional archery through real-world environments, disciplined training, and cultural exploration. We are not a conventional sports club or a commercial shooting range. Instead, the academy is a focused initiative for individuals who want to master the bow as both a technical skill and a personal discipline.
              </p>
              <h3 className="font-serif font-bold text-primary text-sm pt-2">Origins &amp; Terrain Mastery</h3>
              <p>
                <span className="notranslate" translate="no">Jan</span>’s approach developed through years of independent training and the deep exploration of historical archery traditions. Rather than limiting his practice to static, indoor target ranges, he took his training into forests, mountains, and varied terrains. In these settings, it became clear that attention, movement, and environmental awareness play a direct and critical role in instinctive shooting.
              </p>
              <h3 className="font-serif font-bold text-primary text-sm pt-2">Evolution of the Academy</h3>
              <p>
                Over time, this personal discipline evolved into a structured training framework. What began as individual field practice grew into a complete training system. Today, the academy organizes training sessions, field workshops, multi-day retreats, and cultural expeditions. All programs are conducted in small groups to maintain a calm training atmosphere and preserve the quality of personal instruction.
              </p>
            </div>
          </div>

          {/* Quick Stats/Summary Sideblock */}
          <div className="lg:col-span-5 bg-white border border-primary/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="text-xs uppercase tracking-widest text-[#5c4629] font-serif font-bold border-b border-primary/5 pb-2">
              Academy Pillars
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Compass className="w-5 h-5 text-accent shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">Field-Based Adaptability</h4>
                  <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">Training in varied natural terrains under shifting conditions.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Shield className="w-5 h-5 text-accent shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">Disciplined Structure</h4>
                  <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">Focus on consistent presence, safety, and physical mastery.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Target className="w-5 h-5 text-accent shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">Traditional Heritage</h4>
                  <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">Sourcing custom traditional gear and preserving bowyer craftsmanship.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Training Environments Block */}
        <div className="bg-[#0e3b2e]/5 border border-primary/5 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-[#5c4629] font-serif font-bold">
              Global Grounds
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              Training Environments
            </h2>
            <div className="w-10 h-[1px] bg-[#c5a880]/30" />
          </div>
          <p className="text-sm text-primary/85 font-sans max-w-3xl leading-relaxed">
            Traditional archery requires adaptability. The academy operates across several carefully selected natural environments in Central Europe and Asia, each offering different terrain and conditions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-inner space-y-2">
              <MapPin className="w-4 h-4 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">Slovakia</h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                Quiet wilderness platues and forests (Muránska planina, Košice, Zemiansky Vrbovok, Podhájska) suitable for extended outdoor retreats and recovery training.
              </p>
            </div>
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-inner space-y-2">
              <MapPin className="w-4 h-4 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">Austria</h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                Ehrwald - Zugspitze Region providing demanding alpine terrains and access to dedicated mountain field parkour courses.
              </p>
            </div>
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-inner space-y-2">
              <MapPin className="w-4 h-4 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">Germany</h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                Eisenbach (Black Forest) combining forest parkour tracks with traditional field infrastructure for structured training.
              </p>
            </div>
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-inner space-y-2">
              <MapPin className="w-4 h-4 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">Inner Mongolia</h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                Grassland horse archery training grasslands and yurt camps organized in direct partnership with local cultural guilds.
              </p>
            </div>
            <div className="bg-white border border-primary/5 p-6 rounded-2xl shadow-inner space-y-2">
              <MapPin className="w-4 h-4 text-accent" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary">Okinawa, Japan</h4>
              <p className="text-xs md:text-sm text-primary/75 font-sans leading-relaxed">
                An active development region representing a future training hub focused on historical Zen and martial training disciplines.
              </p>
            </div>
          </div>
        </div>

        {/* Philosophy Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="lg:col-span-5 relative aspect-square rounded-3xl overflow-hidden bg-primary/10 border border-primary/10 shadow-lg">
            <img
              src="/images/wp-assets/contact-bg.webp"
              alt="Archery Discipline"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
                Training Philosophy
              </h2>
              <div className="w-12 h-[1.5px] bg-accent/40" />
            </div>
            <div className="space-y-4 text-base md:text-lg text-primary/80 font-light leading-relaxed font-sans">
              <p>
                Traditional archery is often misunderstood as either target sport shooting or historical reenactment. We approach it differently. It demands more than mechanical accuracy—it requires attention, stability, and the ability to remain composed under changing conditions.
              </p>
              <blockquote className="border-l-2 border-accent pl-4 py-2 text-[#7d603a] font-serif italic text-lg md:text-xl font-medium leading-relaxed bg-accent/5 rounded-r-lg">
                "Archery is not only about the bow and the arrow. It is about the relationship between the body, breath, movement, attention and intention."
              </blockquote>
              <p>
                <span className="notranslate" translate="no">Jan Franko</span> unites his 1985 archery origin and 2011 Asiatic bow discipline with formal 1st School of TCM therapeutic training in Prague (since 2000) and field instructor certifications under Henry Bodnik and Chris Mozolowski to guide archers to instinctive mastery.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/about/jan-franko"
                  className="px-5 py-2.5 bg-primary text-secondary font-serif text-xs uppercase tracking-wider rounded-xl hover:bg-accent transition-all cursor-pointer shadow-sm"
                >
                  Meet Instructor <span className="notranslate" translate="no">Jan Franko</span>
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 border border-primary/20 hover:border-primary text-primary font-serif text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Request Program Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
