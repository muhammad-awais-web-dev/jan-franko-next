import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import { BOW_REVIEW_RECORDS } from "@/data/equipment";
import { constructMetadata } from "@/lib/seo";

export default function EquipmentVerificationPage() {
  notFound();
}

const metadata: Metadata = constructMetadata({
  title: "Bow Content Verification Register | Jan Franko Traditional Archery",
  description: "Publication status, image decision, and source record for every culturally or historically named bow in the equipment catalog.",
  canonicalUrl: "/equipment/verification",
});

const labels = {
  "design-in-development": "Design in development",
  "reference-only": "Reference only",
  withheld: "Withheld pending review",
} as const;

function _DisabledEquipmentVerificationContent() {
  const referenceCount = BOW_REVIEW_RECORDS.filter((item) => item.publicationStatus === "reference-only").length;
  const designCount = BOW_REVIEW_RECORDS.filter((item) => item.publicationStatus === "design-in-development").length;

  return (
    <main id="main-content" className="min-h-screen bg-[#f0e9d9] text-[#0e3b2e]">
      <section className="bg-[#0e3b2e] px-6 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5a880]">Source-first publication gate</p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">Bow Content Verification Register</h1>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/75 font-sans">Every named bow is reviewed for construction, silhouette, cultural and historical attribution, description source, photograph identity, and image rights. A missing check means the sales listing stays unpublished.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#0e3b2e]/10 bg-white p-5"><span className="text-3xl font-serif font-bold">{BOW_REVIEW_RECORDS.length}</span><p className="mt-1 text-xs text-[#0e3b2e]/60 font-sans">named bows reviewed by the publication gate</p></div>
          <div className="rounded-2xl border border-[#0e3b2e]/10 bg-white p-5"><span className="text-3xl font-serif font-bold">{referenceCount}</span><p className="mt-1 text-xs text-[#0e3b2e]/60 font-sans">source-backed reference pages, not products for sale</p></div>
          <div className="rounded-2xl border border-[#0e3b2e]/10 bg-white p-5"><span className="text-3xl font-serif font-bold">{designCount}</span><p className="mt-1 text-xs text-[#0e3b2e]/60 font-sans">Jan Franko designs awaiting owner artwork</p></div>
        </div>

        <div className="mt-8 space-y-4">
          {BOW_REVIEW_RECORDS.map((record) => (
            <article key={record.slug} className="rounded-2xl border border-[#0e3b2e]/10 bg-white p-5 sm:p-7 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7d603a] font-sans">{labels[record.publicationStatus]}</p>
                  <h2 className="notranslate mt-1 font-serif text-2xl font-bold" translate="no">{record.title}</h2>
                </div>
                <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase ${record.publicationStatus === "reference-only" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                  {record.publicationStatus === "reference-only" ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                  {record.publicationStatus === "reference-only" ? "Text sourced · sale withheld" : "Not for publication"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#0e3b2e]/75 font-sans">{record.summary}</p>
              <p className="mt-3 rounded-xl bg-[#f0e9d9]/65 p-3 text-xs leading-relaxed font-sans"><strong>Image decision:</strong> {record.imageDecision}</p>
              {record.sources && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {record.sources.map((source) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[#0e3b2e]/15 px-3 py-2 text-[11px] font-bold text-[#7d603a] hover:border-[#7d603a] transition-colors font-sans">
                      {source.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              )}
              <Link href={`/equipment/${record.slug}`} className="mt-4 inline-flex text-xs font-bold text-[#7d603a] underline hover:text-[#0e3b2e] transition-colors">
                Open controlled page
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-[#0e3b2e] p-6 text-white shadow-md">
          <h2 className="font-serif text-xl font-bold">Approval rule</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75 font-sans">A listing can return to the public catalog only after Jan confirms the candidate photograph and the register records a defensible source and image provenance. No visual similarity guess is accepted.</p>
        </div>
      </section>
    </main>
  );
}
