import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import CommissionForm from "@/components/equipment/CommissionForm";
import { findMasterBowyer, MASTER_BOWYERS } from "@/data/bowyers";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [
    { slug: "warrick-harvey" },
    { slug: "harvey-archery" },
    { slug: "mr-bows" },
    { slug: "misko-rovcanin" },
    { slug: "kadys-bows" },
    { slug: "sergey-tolochko" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bowyer = findMasterBowyer(slug);
  if (!bowyer) return { title: "Master Bowyer Not Found" };
  return {
    title: `${bowyer.bowyerName} — ${bowyer.brand} | Master Bowyer Profile`,
    description: bowyer.introduction,
    openGraph: { images: [{ url: bowyer.photos[0]?.src || "", alt: bowyer.photos[0]?.alt || "" }] },
  };
}

export default async function BowyerProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const bowyer = findMasterBowyer(slug);
  if (!bowyer) notFound();
  if (slug !== bowyer.slug && !bowyer.legacySlugs.includes(slug)) {
    permanentRedirect(`/bowyer/${bowyer.slug}`);
  }

  // Format story into clean paragraphs
  const storyParagraphs = bowyer.story
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f0e9d9] text-[#0e3b2e]">
      {/* Top Breadcrumb Nav */}
      <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8">
        <Link href="/about/partners" className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-[#8a6a3f] transition-colors">
          <ArrowLeft className="h-4 w-4" />
          All Master Bowyers
        </Link>
      </div>

      {/* Hero Header */}
      <header className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#0e3b2e]/10 shadow-xl border border-[#0e3b2e]/10">
            <Image src={bowyer.photos[0].src} alt={bowyer.photos[0].alt} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-xs text-[#0e3b2e]/60">{bowyer.photos[0].caption}</figcaption>
        </figure>
        <div>
          <p className="notranslate text-xs font-bold uppercase tracking-[0.2em] text-[#8a6a3f]" translate="no" data-protected-name>
            {bowyer.brand}
          </p>
          <h1 className="notranslate mt-2 font-serif text-4xl font-bold leading-tight sm:text-6xl" translate="no" data-protected-name>
            {bowyer.bowyerName}
          </h1>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#0e3b2e]/65">{bowyer.location}</p>
          <p className="mt-5 text-sm leading-relaxed text-[#0e3b2e]/80 sm:text-base font-sans">{bowyer.introduction}</p>
          <a href={bowyer.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0e3b2e]/20 px-5 text-xs font-bold uppercase tracking-wider hover:border-[#8a6a3f] hover:text-[#8a6a3f] transition-colors">
            {bowyer.sourceLabel}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      <div className="bg-white/60">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16">
          {/* Story Section: reduced text size, reduced column gap, tight column allocation */}
          <section aria-labelledby="story-heading" className="grid gap-4 lg:grid-cols-[200px_1fr] lg:gap-6 items-start border-b border-[#0e3b2e]/10 pb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6a3f]">In the bowyer’s words</p>
              <h2 id="story-heading" className="mt-1 font-serif text-3xl font-bold">The story</h2>
            </div>
            <div className="border-l-2 border-[#c5a880] pl-5 space-y-3 font-sans text-sm sm:text-base leading-relaxed text-[#0e3b2e]/85">
              {storyParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Background & Materials Grid */}
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <section className="rounded-3xl border border-[#0e3b2e]/10 bg-white p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">Background</h2>
              <ul className="mt-5 space-y-3.5">
                {bowyer.background.map((item) => (
                  <li key={item} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-[#0e3b2e]/75 font-sans">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a6a3f]" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-3xl border border-[#0e3b2e]/10 bg-white p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">Materials &amp; construction</h2>
              {bowyer.materials.length ? (
                <ul className="mt-5 space-y-3.5">
                  {bowyer.materials.map((item) => (
                    <li key={item} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-[#0e3b2e]/75 font-sans">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a6a3f]" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-xs sm:text-sm leading-relaxed text-[#0e3b2e]/70 font-sans">
                  Materials and final construction are confirmed directly for each model and commission through the bowyer’s current specification. No generic material claims have been substituted.
                </p>
              )}
            </section>
          </div>

          {/* Signature Models */}
          {bowyer.models.length > 0 && (
            <section className="mt-14" aria-labelledby="models-heading">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6a3f]">Documented range</p>
              <h2 id="models-heading" className="mt-1 font-serif text-3xl font-bold sm:text-4xl">Signature models</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {bowyer.models.map((model) => (
                  <article key={model.name} className="rounded-2xl border border-[#0e3b2e]/10 bg-white p-6">
                    <h3 className="notranslate font-serif text-xl font-bold sm:text-2xl" translate="no">
                      {model.name}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#0e3b2e]/70 font-sans">{model.description}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Workshop Photography */}
          <section className="mt-14" aria-labelledby="gallery-heading">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6a3f]">Real work</p>
            <h2 id="gallery-heading" className="mt-1 font-serif text-3xl font-bold sm:text-4xl">Workshop &amp; product photography</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {bowyer.photos.slice(1).map((photo) => (
                <figure key={photo.src}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0e3b2e]/10 border border-[#0e3b2e]/10">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-2.5 text-xs leading-relaxed text-[#0e3b2e]/60 font-sans">{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <p className="mt-10 rounded-2xl border border-[#0e3b2e]/10 bg-[#f0e9d9] p-5 text-xs leading-relaxed text-[#0e3b2e]/65 font-sans">
            Content source: the Master Bowyers Implementation Guide supplied by Jan Franko and the bowyer’s official website linked above.
          </p>

          {/* Direct Commission Form */}
          <div className="mt-14">
            <CommissionForm bowyer={`${bowyer.bowyerName} — ${bowyer.brand}`} heading={`Commission a bow from ${bowyer.bowyerName}`} />
          </div>
        </div>
      </div>
    </main>
  );
}
