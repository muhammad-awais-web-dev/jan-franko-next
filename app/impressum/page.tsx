import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Impressum & Legal Notice | Jan Franko",
  description: "Provider identification and contact information for Jan Franko Traditional Archery Academy.",
  canonicalUrl: "/impressum",
});

export default function ImpressumPage() {
  return (
    <LegalDocument title="Impressum & Legal Notice" intro="Provider identification and contact information for this website.">
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">Provider</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          <strong>Jan Franko Traditional Archery Academy</strong><br />
          Represented by Jan Franko<br />
          Podunajská 23<br />
          941 48 Podhájska<br />
          Slovak Republic
        </p>
        <p className="text-sm text-primary/80 leading-relaxed">Primary field activity takes place in Austria and Slovakia, with programs offered at the locations identified on the relevant program page.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">Contact Information</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Email: <a href="mailto:contact@janfranko.com" className="text-accent underline">contact@janfranko.com</a><br />
          Phone / WhatsApp: <a href="https://wa.me/436641645360" className="text-accent underline">+43 664 164 53 60</a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">Responsible for Editorial Content</h2>
        <p className="text-sm text-primary/80 leading-relaxed">Jan Franko, at the provider address shown above.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">Copyright</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Unless a separate credit states otherwise, the Academy&apos;s original text, training material, photographs, and layout are protected by applicable copyright law. Reproduction or commercial reuse requires prior written permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">Consumer Dispute Resolution</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Contact <a href="mailto:contact@janfranko.com" className="text-accent underline">contact@janfranko.com</a> first so that any concern can be addressed directly.
        </p>
      </section>
    </LegalDocument>
  );
}
