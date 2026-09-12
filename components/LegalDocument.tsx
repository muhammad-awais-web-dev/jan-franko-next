import Link from "next/link";
import { ChevronRight } from "lucide-react";

type LegalDocumentProps = {
  title: string;
  intro: string;
  children: React.ReactNode;
};

export default function LegalDocument({ title, intro, children }: LegalDocumentProps) {
  return (
    <main className="min-h-screen bg-secondary text-primary font-sans">
      <section className="relative overflow-hidden border-b border-primary/10 bg-[#0e3b2e] pb-16 pt-32 text-white md:pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.12),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-4xl space-y-4 px-6 md:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-serif font-semibold uppercase tracking-widest text-accent/80">
            <Link href="/" className="transition-colors hover:text-accent">Home</Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-accent/50" />
            <span aria-current="page" className="text-white">{title}</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-white/80">{intro}</p>
        </div>
      </section>
      <div className="legal-copy mx-auto max-w-4xl space-y-10 px-6 py-14 md:px-8 md:py-20">{children}</div>
    </main>
  );
}
