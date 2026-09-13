import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Compass, Mail, Phone } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata: Metadata = constructMetadata({
  title: "Jan Franko | Founder & Lead Instructor",
  description: "The Path of the Bow — Jan Franko’s archery practice, teaching approach, field work, and credentials.",
  ogImage: "/images/wp-assets/jan-franko-profile.jpeg",
  canonicalUrl: "/about/jan-franko",
});

const pathSections = [
  {
    year: "1978",
    title: "Birth",
    paragraphs: ["I was born in 1978, the Year of the Horse, under the zodiac sign of Leo."],
  },
  {
    year: "Early years",
    title: "Early Curiosity and Discovery of the World",
    paragraphs: [
      "From an early age I was fascinated by the wider world. One of the discoveries that strongly influenced my childhood was my first atlas of the world. I spent many hours studying maps, continents, landscapes, and distant places. This curiosity gradually expanded into geography, history, fauna, flora, and mineralogy. As a child I dreamed of becoming a biologist and documentary filmmaker, travelling across the planet and exploring its natural diversity. Books also played an important role: the works of Miloslav Stingl introduced me to indigenous cultures and the civilizations of the Americas, while the historical writings of Pavel Dvořák deepened my interest in European history and cultural heritage. These influences sparked a lasting curiosity about ethnography, anthropology, languages, and human cultures.",
    ],
  },
  {
    year: "1985",
    title: "First Encounter with the Bow",
    paragraphs: [
      "My first encounter with archery came when I was seven years old. My cousin Marek crafted a bow for me with his own hands — a simple self bow made from a single piece of wood, along with arrows made from natural feathers and sharp broadhead points. Holding that bow for the first time felt powerful and mysterious. Looking back today, that small handmade bow quietly changed the direction of my life.",
    ],
  },
  {
    year: "2000",
    title: "Traditional Chinese Medicine and Therapeutic Practice",
    paragraphs: [
      "In 2000 I began studying acupuncture and Traditional Chinese Medicine in Prague at the First School of Traditional Medicine, under professors from Beijing University. During the same period I began studying therapeutic bodywork, eventually completing further professional training in massage therapy and medical bodywork.",
      "What began as a separate path became, over time, an unexpected foundation for how I teach archery. Working with the body — its posture, breath, tension, and movement — day after day taught me something no archery manual could: that the shot is never just mechanical. It lives in the same alignment and breath that shape everything else the body does. That's the lens I now bring to instinctive archery. For nearly a decade I built and led a therapeutic practice in Slovakia, and more recently I have practiced therapeutic and regenerative bodywork in the Tirol Alps in Austria, alongside my work in traditional archery.",
    ],
  },
  {
    year: "2011",
    title: "Korean Traditional Bow and Self-Training",
    paragraphs: [
      "Long before I held a bow, I had already found the philosophy that would shape how I approached it. As a young man I discovered Miyamoto Musashi and his Book of Five Rings — and through him, the wider world of Bushido: discipline as a way of life, stillness beneath motion, the idea that mastering any weapon begins with mastering the self.",
      "Musashi is remembered today as a swordsman, and by his era the sword had indeed become the symbol of the samurai. But for most of Japanese history it was the bow, not the sword, that stood as the warrior's first and defining weapon. The samurai's own way of life was called kyūba no michi — “the way of the horse and bow” — and mounted archery, not swordsmanship, was considered the essential warrior skill from roughly the 10th through the 14th centuries. The sword rose to symbolic prominence only later, in the long peace of the Edo period — Musashi's era. Musashi gave me the philosophy; the older, longer tradition of kyūjutsu gave me the weapon it was originally built around.",
      "That connection became personal in 2011, when I obtained my first Korean traditional bow. Around the same time, Kim Han-min's film War of the Arrows left its own mark — its portrayal of the bow not as a secondary weapon, but as an extension of will and instinct, deepened a fascination that was already taking shape in me.",
      "At the time, I was running my own holistic healing practice, and the bow found its place inside that rhythm rather than outside it. In the gaps between clients, before opening in the morning, after closing at night — sometimes deep into the night when something in me simply needed to shoot — I trained alone. It became part of the same practice as my healing work, not separate from it. Where my hands spent the day reading tension and imbalance in other people's bodies, the bow began doing the same for me: every session on the range became a quiet diagnosis of my own state. Archery, I learned, is a mirror. It reflects, with total honesty, the physical and mental balance a person is actually carrying, whether or not they're ready to see it.",
      "I didn't look for a teacher. I looked inward, training for hours nearly every day — mostly by daylight, but sometimes, by choice, in complete darkness. Not to prove anything, but to test the same principle Musashi wrote about and the old archers lived by: that mastery isn't built on sight alone. Stripped of it, everything else had to sharpen — the draw, the breath, the release, the sound of the arrow finding its mark. What I couldn't learn from a mentor, I learned from instinct, intuition, and the same silent repetition that shaped warriors and archers long before instruction manuals existed.",
    ],
  },
  {
    year: "2020",
    title: "Longbow and Mentorship",
    paragraphs: [
      "In 2020 I acquired my first proper longbow and soon afterwards met Henry Bodnik, founder of Bodnik Bows and one of the leading figures of European traditional archery. He corrected many aspects of my technique and introduced me to the methodology of teaching traditional archery. I continue to train under his guidance today.",
    ],
  },
  {
    year: "2024",
    title: "Bowhunting Training",
    paragraphs: [
      "In 2024 I completed a specialised bowhunting course led by Chris Mozolowski, President of the Swiss Federation of Bowhunting, achieving 98 percent on the theoretical examination and was the only participant using a traditional bow.",
    ],
  },
] as const;

const approachSections = [
  {
    title: "Movement, Breath & Instinctive Focus",
    paragraphs: [
      "My approach to traditional archery is distinct from conventional sport shooting or mechanical target practice. Years of hands-on therapeutic and bodywork practice gave me a practical understanding of how physical tension, skeletal alignment, breathing rhythms, and mental state directly shape archery performance.",
      "In instinctive traditional archery, the shot isn't engineered through artificial sights or static anchors. It is executed through full-body coordination, centered posture, and relaxed focus. Principles from Traditional Chinese Medicine, Tuina, and Qigong inform how I teach natural posture, structural release, and diaphragmatic breathing, helping archers build enduring stamina, avoid repetitive strain, and hold a calm, instinctive presence in any terrain, from alpine forests to the open winds of the Eurasian steppe.",
      "My teaching rests on four pillars. Biomechanical precision covers the alignment of shoulders, draw arm, scapular tension, and ground root. Breath regulation and Qigong use breath to drop heart rate, release tension, and stabilize aim. Holistic recovery addresses post-training regeneration and structural release. Cultural respect and lineage reflects a deep study of Asiatic composite bows, European longbows, and traditional archery craft.",
    ],
  },
  {
    title: "Field Work & Cultural Research",
    paragraphs: [
      "Beyond personal training and teaching, a core part of this project is the exploration and documentation of traditional archery cultures around the world — observing, learning from, and preserving living traditions of the bow among nomadic peoples, traditional craftsmen, and practitioners who carry these skills forward across generations.",
      "Current exploration regions include Europe, Mongolia, Iran, Turkey, Korea, Japan, Bhutan, South Africa, North America (Yukon), and South America, including Patagonia. For Kyrgyzstan and Tajikistan, we have already partnered with a trusted local guide, and fully guided expeditions to both regions are currently in development. In Kazakhstan, we are in the process of identifying local partners who meet the same standard, to ensure a consistent level of expertise and access across the region.",
      "Further expansion is planned for 2027, extending this research into the archery traditions of the Americas. In Mexico, the focus will center on the state of Querétaro, historic heartland of the Chichimeca peoples — a confederation of nomadic warrior groups whose hit-and-run mounted archery tactics fuelled the longest and costliest conflict of the Spanish colonial era, the Chichimeca War. In Panama and Colombia, expeditions will focus on the Emberá people of the Darién region, whose hand-carved bows remain in active use for hunting today — a rare living tradition rather than a purely historical one. In Guatemala, research will center on the Maya lowlands of Petén, where archaeological evidence confirms the bow and arrow served as a significant weapon of both hunting and warfare during the Postclassic period.",
      "In Brazil, the project will explore two distinct threads of the same living tradition. In Curitiba, Paraná, and Florianópolis (Floripa), Santa Catarina — ancestral territory of the Guarani, for whom bow and arrow (guyrapa and ru'y) remain both a functional hunting tool and a sacred object — the offer will take the form of a retreat and cultural exploration, set against the region's forests and coastline. Deeper into the Amazon, an expedition based around Manaus will engage directly with Amazonian peoples for whom the bow remains an active, unbroken hunting tradition — among them the Awá and neighboring groups, who still hand-craft bows and arrows from native hardwoods and bamboo exactly as their ancestors did.",
      "Further south, expeditions to Patagonia — spanning both Argentina and Chile — will explore the archery legacy of the Tehuelche and Selk'nam peoples, nomadic hunter-gatherers who relied on the bow as their primary tool for hunting guanaco across some of the harshest terrain on the continent.",
    ],
  },
  {
    title: "Vision",
    paragraphs: [
      "Through the Explorer Adventures Traditional Archery Academy, the goal is to explore, study, and preserve traditional archery cultures through structured training, international expeditions, the preservation of historical knowledge, and a growing global network of traditional archers and craftsmen.",
    ],
  },
] as const;

const credentials = [
  {
    title: "Traditional Archery",
    text: "Practicing since 1985, when I first picked up a bow as a child; self-directed and intensive personal training deepened from 2011 with a focus on Asiatic and Korean traditional bow disciplines. Formal instruction followed later, under Henry Bodnik of Bodnik Bows (from 2020) and Chris Mozolowski of the Swiss Federation of Bowhunting (2024).",
  },
  {
    title: "Traditional Chinese Medicine & Bodywork",
    text: "Formal TCM education from 2000 at the First School of Traditional Medicine in Prague, with continuing advanced studies through TCM INSTITUT. Extensive practical experience in Tuina, acupressure, and therapeutic bodywork, applied directly to how I teach body mechanics and breath control in archery.",
  },
  {
    title: "International Experience",
    text: "Professional practice spanning Central Europe, the Alps, and internationally — including Bratislava and Košice, Slovakia; Prague, Czech Republic; the Vorarlberg region (Lech, Oberlech, Warth) and Kitzbühel, Tux, and Hintertux in Tirol; Innsbruck and the wider Tirol region, Austria; Heidelberg and Sankt Peter-Ording, Germany; Fiesch and Brig, Valais, Switzerland; Tenerife (Canary Islands) and Palma de Mallorca (Balearic Islands), Spain; and Bogotá, Medellín, and Cali, Colombia, working with both corporate and private clients. Further international experience includes private yacht work aboard the 60-metre M/Y Paloma for corporate clients from France, across the British Virgin Islands, St. Maarten, and Malta, as well as a role with a renowned international hospitality company across five-star hotel properties in the Dominican Republic, alongside private clients.",
  },
  {
    title: "Languages",
    text: "Native Slovak, with fluent Czech, German, English, Russian, and Spanish. Good working understanding of Polish, Ukrainian, and Serbo-Croatian. Basic conversational level in French, Italian, Japanese, and Portuguese.",
  },
] as const;

export default function JanFrankoProfilePage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f0e9d9] text-[#0e3b2e]">
      <section className="relative overflow-hidden bg-[#0e3b2e] px-6 py-14 text-white sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(197,168,128,0.16),transparent_48%)]" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/15 bg-[#092a21] shadow-2xl">
            <Image src="/images/wp-assets/jan-franko-profile.jpeg" alt="Jan Franko, founder and lead instructor" fill priority sizes="(max-width: 1024px) 90vw, 380px" className="object-cover" />
          </div>
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c5a880]">Founder &amp; Lead Instructor — The Path of the Bow</p>
            <h1 className="notranslate font-serif text-5xl font-bold tracking-tight sm:text-6xl" translate="no" data-protected-name>Jan Franko</h1>
            <blockquote className="border-l-2 border-[#c5a880] pl-5 font-serif text-xl italic leading-relaxed text-white/90 sm:text-2xl">“Archery is not only about the bow and the arrow. It is about the relationship between the body, breath, movement, attention and intention.”</blockquote>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c5a880] px-6 text-xs font-bold uppercase tracking-wider text-[#0e3b2e]"><Phone className="h-4 w-4" />{SITE.phoneDisplay}</a>
              <a href={`mailto:${SITE.email}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"><Mail className="h-4 w-4 text-[#c5a880]" />{SITE.email}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-16 sm:py-20">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7d603a]">The Path of the Bow</p>
          <h2 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">The Path of the Bow</h2>
        </div>
        <div className="space-y-8">
          {pathSections.map((section) => (
            <article key={`${section.year}-${section.title}`} className="grid gap-4 border-t border-[#0e3b2e]/15 pt-7 md:grid-cols-[9rem_1fr] md:gap-8">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#7d603a]">{section.year}</p>
              <div><h3 className="font-serif text-2xl font-bold">{section.title}</h3><div className="mt-4 space-y-4 text-sm leading-7 text-[#0e3b2e]/80 sm:text-base">{section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}</div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0b3126] px-6 py-16 text-[#f0e9d9] sm:py-20">
        <div className="mx-auto max-w-[1440px] space-y-14">
          {approachSections.map((section) => (
            <article key={section.title} className="grid gap-6 lg:grid-cols-[0.42fr_1fr] lg:gap-14">
              <div><Compass className="mb-4 h-6 w-6 text-[#c5a880]" /><h2 className="font-serif text-3xl font-bold text-white">{section.title}</h2></div>
              <div className="space-y-5 text-sm leading-7 text-white/78 sm:text-base">{section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7d603a]">Background &amp; Credentials</p>
        <h2 className="mt-3 font-serif text-4xl font-bold">Experience supporting the teaching practice</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {credentials.map((credential) => <article key={credential.title} className="rounded-2xl border border-[#0e3b2e]/10 bg-white p-6 shadow-sm"><h3 className="font-serif text-xl font-bold">{credential.title}</h3><p className="mt-3 text-sm leading-7 text-[#0e3b2e]/75">{credential.text}</p></article>)}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1440px] rounded-3xl bg-[#0e3b2e] p-8 text-center text-white shadow-xl sm:p-12">
          <h2 className="font-serif text-3xl font-bold">Ready to train or consult?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">Reach out directly via WhatsApp or the inquiry form.</p>
          <Link href="/contact" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#c5a880] px-7 text-xs font-bold uppercase tracking-wider text-[#0e3b2e]">Open the inquiry form <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}
