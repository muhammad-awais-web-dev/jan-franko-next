import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Safety & Legal Overview | Jan Franko",
  description: "Essential safety, medical-readiness, insurance, conduct, and intellectual-property information for Academy activities.",
  canonicalUrl: "/safety-legal-overview",
});

export default function SafetyLegalOverviewPage() {
  return (
    <LegalDocument
      title="Safety & Legal Overview"
      intro="Essential responsibilities for traditional archery training, outdoor programs, and expeditions."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">1. Inherent Risk &amp; Environmental Exposure</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Archery uses potentially dangerous equipment. Outdoor programs may also involve uneven ground, remote locations, changing weather, heat, cold, altitude, animals, transport, and delayed access to medical assistance. Participation can reduce but cannot eliminate these risks.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">2. Safety Commands &amp; Instructor Authority</h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-primary/80">
          <li>Never nock or draw an arrow unless the shooting area is declared clear and the instructor authorises shooting.</li>
          <li>Immediately lower the bow and stop when any stop or cease-fire command is given.</li>
          <li>Never dry-fire a bow. Inspect limbs, string, nocks, shafts, and points before use.</li>
          <li>Use only equipment, draw weight, targets, and shooting distances approved for the session.</li>
          <li>Follow all site-specific boundaries, retrieval procedures, and protective-equipment instructions.</li>
        </ul>
        <p className="text-sm text-primary/80 leading-relaxed">
          The instructor may modify or stop an activity, reject unsafe equipment, or remove a participant whose condition or conduct creates a safety risk. There is no place for bravado or pressure to continue when conditions are unsafe.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">3. Medical Disclosure &amp; Readiness</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Participants must provide relevant and accurate information about injuries, allergies, medication, mobility, cardiovascular or respiratory conditions, and other matters that may affect safe participation. Participation is voluntary; a participant should stop and report pain, dizziness, confusion, loss of coordination, unusual fatigue, or any other concerning symptom immediately.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">4. Minors, Insurance &amp; Travel</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Participation by a minor requires prior written approval and consent from a parent or legal guardian. Participants are responsible for travel documents and for obtaining insurance appropriate to their program, including archery or sporting activity, medical treatment, evacuation, cancellation, and repatriation where relevant.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">5. Intellectual Property</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Academy training material, written guides, photographs, course structures, and other original content may not be reproduced, sold, or presented as another person&apos;s work without prior written permission.
        </p>
      </section>
    </LegalDocument>
  );
}
