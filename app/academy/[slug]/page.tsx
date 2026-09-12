import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Award,
  BookOpen,
  Compass,
  Zap,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  FileText,
  Lock,
  Layers,
  Sparkles
} from "lucide-react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const ACADEMY_SLUG_MAP: Record<string, string> = {
  "certification": "certification",
  "explorer-rank-system": "explorer-rank-system",
  "rank-system": "explorer-rank-system",
  "code-of-conduct": "code-of-conduct",
  "summit-protocol": "summit-protocol",
  "environmental-stress-index": "environmental-stress-index-esi",
  "environmental-stress-index-esi": "environmental-stress-index-esi",
  "esi": "environmental-stress-index-esi",
  "the-academy": "the-academy",
  "academy": "the-academy",
  "explorer-path": "explorer-path",
  "raptor-path": "raptor-path",
  "special-practice-retreats": "special-practice-retreats",
  "archers-virtues": "archers-virtues",
  "training-philosophy": "training-philosophy"
};

const ACADEMY_FALLBACK_PAGES: Record<string, { title: string; excerpt: string; content: string }> = {
  "raptor-path": {
    title: "The Raptor Path",
    excerpt: "Advanced instinctive archery progression combining biomechanical alignment, dynamic slope release, and tactical environmental focus.",
    content: `
      <h2>The Raptor Path — Advanced Instinctive Discipline</h2>
      <p>The Raptor Path represents the advanced biomechanical curriculum of Jan Franko Traditional Archery Academy. Designed for experienced archers and practitioners seeking to transcend mechanical target shooting, this track integrates body mechanics, diaphragmatic breath regulation, and rapid instinctive target acquisition.</p>
      <h3>Core Pillars of the Raptor Path</h3>
      <ul>
        <li><strong>Biomechanical Ground Root:</strong> Establishing unbreakable stance stability on steep alpine slopes and uneven woodland terrain.</li>
        <li><strong>Fluid Draw &amp; Scapular Release:</strong> Transferring draw weight into back muscle groups without arm strain or posture distortion.</li>
        <li><strong>Dynamic Aiming &amp; Instinctive Focus:</strong> Releasing on moving or variable-distance targets without static sights or artificial anchors.</li>
      </ul>
      <h3>Field Application &amp; Certification</h3>
      <p>Practitioners on the Raptor Path undergo rigorous field audits across alpine glades, dense forests, and open steppe environments, proving consistent accuracy, physical stamina, and environmental awareness.</p>
    `
  },
  "archers-virtues": {
    title: "The Archer’s Virtues",
    excerpt: "The four foundational pillars of traditional archery discipline: Presence, Biomechanical Precision, Breath Control, and Cultural Respect.",
    content: `
      <h2>The Archer’s Virtues</h2>
      <p>Instinctive archery is a mirror of personal discipline, mental stillness, and biomechanical harmony. The Archer’s Virtues govern every shot, practice session, and field expedition conducted under the Jan Franko Academy lineage.</p>
      <h3>The Four Virtues</h3>
      <ul>
        <li><strong>Stillness Beneath Motion:</strong> Maintaining internal calm and steady heart rate regardless of environmental strain or terrain difficulty.</li>
        <li><strong>Biomechanical Precision:</strong> Aligning shoulder girdle, draw arm, and breath rhythm into a single repeatable motion.</li>
        <li><strong>Environmental Harmony:</strong> Training with total respect for natural ecosystems, leaving zero trace across mountain pastures and forests.</li>
        <li><strong>Lineage &amp; Honor:</strong> Honoring historical bowyers and nomadic traditions that preserved the art of the bow for centuries.</li>
      </ul>
    `
  },
  "special-practice-retreats": {
    title: "Special Practice Retreats",
    excerpt: "Intensive 3-to-7 day immersive archery retreats combining Qigong, diaphragmatic breath work, and field target practice.",
    content: `
      <h2>Special Practice Retreats</h2>
      <p>Our Special Practice Retreats offer archers an intensive, distraction-free environment to deepen their physical technique and mental presence in nature. Set in historic mountain sanctuaries across Austria, Slovakia, and Germany, these programs combine daily archery practice with bodywork and Qigong training.</p>
      <h3>Retreat Modules</h3>
      <ul>
        <li><strong>Breath &amp; Alignment Intensive:</strong> Diaphragmatic breathing and structural posture alignment for long-range stamina.</li>
        <li><strong>Slope &amp; Woodland Range Practice:</strong> Dynamic 3D field targets placed across natural mountain gradients.</li>
        <li><strong>Evening Restoration:</strong> Regenerative bodywork and movement recovery guided by senior instructors.</li>
      </ul>
    `
  },
  "training-philosophy": {
    title: "Training Philosophy",
    excerpt: "Rooted in Traditional Chinese Medicine, posture alignment, and historical Asiatic composite bow methodologies.",
    content: `
      <h2>Training Philosophy</h2>
      <p>Archery is not merely about the bow and arrow; it is about the living relationship between body, breath, movement, attention, and intention. Founded by Jan Franko, our methodology draws upon decades of therapeutic bodywork, Traditional Chinese Medicine (TCM), and historical archery traditions.</p>
      <h3>Core Methodology</h3>
      <ul>
        <li><strong>Instinctive Aiming:</strong> Training the mind to focus directly on the target point without static sights or artificial pins.</li>
        <li><strong>Diaphragmatic Breath Anchor:</strong> Inhaling to stabilize core tension and exhaling upon release to lower heart rate.</li>
        <li><strong>Holistic Body Mechanics:</strong> Preventing repetitive strain injuries by utilizing major back muscle groups and centered posture.</li>
      </ul>
    `
  }
};

async function fetchWpPageBySlug(slug: string) {
  const wpSlug = ACADEMY_SLUG_MAP[slug] || slug;
  try {
    const res = await fetch(
      `https://janfranko.com/wp-json/wp/v2/pages?slug=${encodeURIComponent(wpSlug)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const pages = await res.json();
    if (!Array.isArray(pages) || pages.length === 0) return null;
    return pages[0];
  } catch (err) {
    console.error(`Failed to fetch WP page for slug: ${slug}`, err);
    return null;
  }
}

export async function generateStaticParams() {
  return [
    { slug: "the-academy" },
    { slug: "certification" },
    { slug: "explorer-rank-system" },
    { slug: "rank-system" },
    { slug: "code-of-conduct" },
    { slug: "summit-protocol" },
    { slug: "environmental-stress-index-esi" },
    { slug: "environmental-stress-index" },
    { slug: "esi" },
    { slug: "explorer-path" },
    { slug: "raptor-path" },
    { slug: "special-practice-retreats" },
    { slug: "archers-virtues" },
    { slug: "training-philosophy" }
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchWpPageBySlug(slug);
  const fallback = ACADEMY_FALLBACK_PAGES[slug];

  if (!page && !fallback) {
    return {
      title: "Academy Section | Traditional Archery Academy",
      description: "Explore the structured curriculum and governance of Jan Franko Traditional Archery Academy."
    };
  }

  const rawTitle = page?.title?.rendered || fallback?.title || "Academy Section";
  const cleanTitle = rawTitle.replace(/&#8211;/g, "–").replace(/&amp;/g, "&");
  const excerpt = page?.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() || fallback?.excerpt ||
    "Verified curriculum standards, certification audit frameworks, and environmental stress protocols.";

  return constructMetadata({
    title: `${cleanTitle} | Archery Academy`,
    description: excerpt,
    ogImage: `/academy/${slug}/opengraph-image`,
    canonicalUrl: `https://jan-franko-next.vercel.app/academy/${slug}`,
  });
}

export default async function AcademyPage({ params }: PageProps) {
  const { slug } = await params;
  const wpPage = await fetchWpPageBySlug(slug);
  const fallback = ACADEMY_FALLBACK_PAGES[slug];

  if (!wpPage && !fallback) {
    notFound();
  }

  const titleRaw = wpPage?.title?.rendered || fallback?.title || "Academy Section";
  const titleClean = titleRaw.replace(/&#8211;/g, "–").replace(/&amp;/g, "&");

  let htmlContent = wpPage?.content?.rendered || fallback?.content || "";
  htmlContent = htmlContent
    .replace(/https:\/\/janfranko\.com\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\//gi, "/images/wp-assets/")
    .replace(/\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\//gi, "/images/wp-assets/")
    .replace(/https:\/\/janfranko\.com\/the-academy\//g, "/academy/")
    .replace(/https:\/\/janfranko\.com\/archery-games\//g, "/archery-games/")
    .replace(/https:\/\/janfranko\.com\//g, "/");

  return (
    <main className="min-h-screen bg-[#0e3b2e] text-[#f0e9d9] pt-24 pb-20 select-text">
      {/* Header Banner */}
      <section className="relative border-b border-accent/20 bg-gradient-to-b from-[#0e3b2e] via-[#092b21] to-[#0e3b2e] py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.1),transparent_70%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 space-y-4">
          
          <nav className="flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-accent/80 font-semibold">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-accent/50" />
            <Link href="/academy" className="hover:text-accent transition-colors">
              The Academy
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-accent/50" />
            <span className="text-white font-bold">{titleClean}</span>
          </nav>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-accent/15 border border-accent/30 rounded-full text-xs font-serif font-semibold tracking-widest uppercase text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              Curriculum Standard
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              {titleClean}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Layout Container (Clean, uncluttered, no sidebars) */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        <div className="bg-[#0b3126]/80 border border-accent/20 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-8 backdrop-blur-md">
          {/* Formatted WordPress Content */}
          <article
            className="prose prose-invert prose-amber max-w-none 
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:border-b prose-h2:border-accent/20 prose-h2:pb-3 prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-lg prose-h3:sm:text-xl prose-h3:text-accent prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-sm prose-p:sm:text-base prose-p:text-[#f0e9d9]/85 prose-p:leading-relaxed prose-p:font-sans
              prose-ul:space-y-2 prose-ul:my-4 prose-li:text-sm prose-li:text-[#f0e9d9]/85 prose-li:font-sans
              prose-img:rounded-2xl prose-img:border prose-img:border-accent/20 prose-img:shadow-xl prose-img:mx-auto prose-img:my-6
              prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-accent
              prose-strong:text-white prose-strong:font-bold
              prose-a:text-accent prose-a:underline hover:prose-a:text-white"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Action Footer */}
          <div className="pt-8 border-t border-accent/20 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent block">Governance Standard</span>
              <span className="text-xs font-serif font-bold text-white">Traditional Archery Academy — Jan Franko</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-[#0e3b2e] rounded-xl font-serif text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                Inquire Application
              </Link>
              <Link
                href="/academy"
                className="px-6 py-3 border border-white/20 hover:border-accent text-white font-serif text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Back to Academy Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
