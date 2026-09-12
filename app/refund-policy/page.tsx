import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Refund & Cancellation Policy | Jan Franko",
  description: "Refund, cancellation, withdrawal, and custom-order terms for Jan Franko programs and equipment.",
  canonicalUrl: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <LegalDocument
      title="Refund & Cancellation Policy"
      intro="Terms for workshops, expeditions, standard equipment, and individually commissioned bows."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">1. Scope</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          This policy applies to bookings and purchases made directly with Jan Franko Traditional Archery Academy. A written quotation or booking confirmation may contain additional terms specific to the program or commissioned item; any such terms will be shown before payment.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">2. Residencies, Expeditions &amp; Dated Programs</h2>
        <p className="text-sm text-primary/80 leading-relaxed">Unless a written offer states otherwise, participant cancellations are handled as follows:</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-primary/80">
          <li>More than 90 days before the start date: 100% refund, less non-recoverable third-party or payment-processing charges disclosed to the participant.</li>
          <li>60–89 days before the start date: 50% refund.</li>
          <li>Fewer than 60 days before the start date: no refund.</li>
        </ul>
        <p className="text-sm text-primary/80 leading-relaxed">
          If the Academy cancels a program, the participant may choose a full refund of payments received for that program or transfer the payment to an agreed alternative date. Personal travel, insurance, visa, and accommodation costs booked independently remain the participant&apos;s responsibility.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">3. Standard, Non-Personalised Goods</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Consumers purchasing eligible standard goods at a distance may notify us of withdrawal within 14 days after delivery, subject to applicable EU and national law. Returned goods should be complete and handled only as necessary to establish their nature, characteristics, and functioning. The customer normally pays direct return costs unless the item is defective or we agree otherwise.
        </p>
        <p className="text-sm text-primary/80 leading-relaxed">
          Statutory rights for faulty, misdescribed, or damaged goods are not limited by this policy. Contact us before returning an item so that the return destination and safe packaging can be confirmed.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">4. Custom Bows &amp; Personalised Equipment</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          A custom commission begins only after the written specification and quotation are accepted and the 50% production deposit is received. Because the bow or equipment is then made to the customer&apos;s individual measurements and choices, the statutory cooling-off right may not apply to that personalised order.
        </p>
        <p className="text-sm text-primary/80 leading-relaxed">
          Once production has begun, the production deposit is non-refundable except where required by law or where Jan Franko or the named bowyer cannot fulfil the agreed commission. The remaining 50%, plus confirmed shipping costs, is due before dispatch. Nothing in this section removes statutory remedies for defective or non-conforming goods.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">5. Requesting a Cancellation, Return or Refund</h2>
        <p className="text-sm text-primary/80 leading-relaxed">
          Email <a href="mailto:contact@janfranko.com" className="text-accent underline">contact@janfranko.com</a> with your name, order or booking reference, and the reason for your request. Approved refunds are issued to the original payment method where possible and are normally processed within 14 days after entitlement and, for returned goods, receipt or evidence of return have been confirmed.
        </p>
      </section>

      <section className="legal-source-note space-y-2 pt-4 border-t border-primary/10 text-xs text-primary/60">
        <h2 className="text-sm font-serif font-bold text-primary">Policy sources &amp; review status</h2>
        <p>
          This page carries forward the Academy&apos;s operating policy and has been checked against European Union guidance on withdrawal, made-to-order goods, return costs, and legal guarantees.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><a href="https://europa.eu/youreurope/citizens/consumers/shopping/returns/index_en.htm" target="_blank" rel="noreferrer" className="text-accent underline">Your Europe: returns and the right of withdrawal</a></li>
          <li><a href="https://europa.eu/youreurope/citizens/consumers/shopping/guarantees/index_en.htm" target="_blank" rel="noreferrer" className="text-accent underline">Your Europe: legal guarantees</a></li>
        </ul>
      </section>
    </LegalDocument>
  );
}
