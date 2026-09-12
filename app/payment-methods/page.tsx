import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Payment Methods | Jan Franko",
  description: "Verified payment information for Jan Franko equipment purchases and commissioned bows.",
  canonicalUrl: "/payment-methods",
});

export default function PaymentMethodsPage() {
  return (
    <LegalDocument title="Payment Methods" intro="How payment availability is confirmed for catalog purchases and commissioned bows. Last reviewed 12 September 2026.">
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">What is confirmed</h2>
        <p className="text-sm text-primary/80 leading-relaxed">For an in-stock product, the secure checkout displays the payment methods currently enabled by the store operator for that order. A method is available only when it appears in checkout.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">Commissioned bows</h2>
        <p className="text-sm text-primary/80 leading-relaxed">Custom bow commissions follow the written commission agreement: a 50% deposit begins the build, and the remaining 50% plus shipping becomes due under the agreed completion and delivery terms.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">Supported Payment Options</h2>
        <p className="text-sm text-primary/80 leading-relaxed">Supported checkout options include major credit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, Klarna, Shop Pay, and direct bank transfer for international custom commissions. If checkout does not show your preferred method, contact <a href="mailto:contact@janfranko.com" className="text-accent underline">contact@janfranko.com</a> before sending funds.</p>
      </section>
    </LegalDocument>
  );
}
