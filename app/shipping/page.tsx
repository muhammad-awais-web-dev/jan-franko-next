import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Shipping Information | Jan Franko",
  description: "Shipping, international delivery, and commissioned-equipment dispatch information.",
  canonicalUrl: "/shipping",
});

export default function ShippingPage() {
  return (
    <LegalDocument title="Shipping Information" intro="How delivery quotes, international orders, and commissioned equipment dispatch are handled. Last reviewed 12 September 2026.">
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">Shipping Quotes &amp; Delivery</h2>
        <p className="text-sm text-primary/80 leading-relaxed">Available destinations, carriers, costs, taxes, and delivery estimates are confirmed for each specific order. Oversized bows, targets, and custom equipment require manual transport packaging and exact carrier quotes.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">Custom and Commissioned Work</h2>
        <p className="text-sm text-primary/80 leading-relaxed">Build time is separate from transit time. The bowyer or Academy confirms completion, final payment, packing, shipping cost, and the available delivery service before dispatch.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">International Orders</h2>
        <p className="text-sm text-primary/80 leading-relaxed">Import VAT, customs duties, brokerage fees, local restrictions, and permits depend on the destination country and remain the recipient&apos;s responsibility unless explicitly stated otherwise in a written quote.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-primary border-b border-primary/10 pb-2">Damage or Delivery Issue</h2>
        <p className="text-sm text-primary/80 leading-relaxed">Keep all original packaging, photograph the parcel and item immediately, and contact <a href="mailto:contact@janfranko.com" className="text-accent underline">contact@janfranko.com</a> with your booking/order reference. Do not use damaged archery equipment.</p>
      </section>
    </LegalDocument>
  );
}
