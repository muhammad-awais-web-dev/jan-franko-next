import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export type AcademySection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly { title: string; text: string }[];
  bullets?: readonly string[];
  quote?: string;
};

type AcademyReferencePageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly AcademySection[];
  ctaLabel?: string;
};

export default function AcademyReferencePage({
  eyebrow,
  title,
  intro,
  sections,
  ctaLabel = "Discuss your training path",
}: AcademyReferencePageProps) {
  return (
    <main id="main-content" className="min-h-screen bg-[#f0e9d9] text-[#0e3b2e]">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0e3b2e] px-6 py-14 text-white sm:py-20 md:px-12 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(197,168,128,0.16),transparent_62%)]" />
        <div className="relative mx-auto max-w-[1440px] space-y-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#c5a880]">
            <Link href="/academy" className="hover:text-white transition-colors">The Academy</Link>
            <ChevronRight aria-hidden="true" className="h-4 w-4 text-[#c5a880]/60" />
            <span aria-current="page" className="text-white/80">{title}</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#c5a880]">{eyebrow}</p>
          <h1 className="max-w-5xl font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">{title}</h1>
          <p className="max-w-4xl text-base leading-relaxed text-white/80 sm:text-lg font-sans">{intro}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-12 md:px-12 md:py-16">
        {sections.map((section) => (
          <section key={section.title} className="rounded-3xl border border-[#0e3b2e]/10 bg-white p-6 shadow-sm sm:p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">{section.title}</h2>
            <div className="mt-3 h-0.5 w-12 bg-[#c5a880]" />
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-sm leading-7 text-[#0e3b2e]/80 sm:text-base font-sans">{paragraph}</p>
            ))}
            {section.quote && (
              <blockquote className="mt-6 border-l-2 border-[#c5a880] pl-5 font-serif text-xl italic leading-relaxed text-[#0e3b2e]/90 sm:text-2xl">
                “{section.quote}”
              </blockquote>
            )}
            {section.items && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-[#0e3b2e]/10 bg-[#f0e9d9]/40 p-5">
                    <h3 className="font-serif text-lg font-bold sm:text-xl text-[#0e3b2e]">{item.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#0e3b2e]/75 font-sans">{item.text}</p>
                  </article>
                ))}
              </div>
            )}
            {section.bullets && (
              <ul className="mt-5 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-[#0e3b2e]/80 sm:text-base font-sans">
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
          </section>
        ))}

        <section className="rounded-3xl bg-[#0e3b2e] p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10 shadow-xl">
          <div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">A personal path, reviewed before booking</h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/75 font-sans">Ask about suitability, current availability, safety requirements, and the right starting point for your experience.</p>
          </div>
          <Link href="/contact" className="mt-6 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#c5a880] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#0e3b2e] transition hover:bg-white sm:mt-0">
            {ctaLabel}<ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
