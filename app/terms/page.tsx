import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Terms & Conditions | Jan Franko",
  description: "Terms and conditions governing workshops, range safety, and field expeditions for Jan Franko Traditional Archery Academy.",
  canonicalUrl: "/terms",
});

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms & Conditions"
      intro="Terms governing participation in academy workshops, field courses, and expeditions."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">
          1. General Scope
        </h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          These Terms &amp; Conditions apply to all participants enrolling in traditional archery workshops, field courses, mountain/steppe expeditions, or using resources provided by Jan Franko Traditional Archery Academy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">
          2. Field Range Safety &amp; Rules
        </h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Safety is paramount on all field archery ranges:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-primary/80">
          <li>Arrows may only be nocked when straddling the active firing line upon instructor command.</li>
          <li>Participants must immediately stop drawing/shooting upon hearing <em>&ldquo;STOP&rdquo;</em> or <em>&ldquo;CEASE FIRE&rdquo;</em>.</li>
          <li>Equipment (bow limbs, string, arrow shafts) must be inspected for safety prior to shooting.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">
          3. Physical Fitness &amp; Medical Disclosures
        </h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Participants must disclose prior rotator cuff, joint, or spinal injuries prior to heavy bow draw or high-altitude mountain terrain modules. Instructors reserve the right to adjust draw weight or shooting stances for safety.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">
          4. Weather &amp; Field Adaptation
        </h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Field courses in alpine, steppe, or forest environments take place outdoors. Severe weather conditions (high winds, lightning, sub-zero frost) may require rescheduling or substituting indoor technical workshops.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">
          5. Governing Law
        </h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          These terms are governed by the laws of the Slovak Republic and applicable European Union regulations.
        </p>
      </section>
    </LegalDocument>
  );
}
