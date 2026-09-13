import type { Metadata } from "next";
import ArrowConfigurator from "@/components/equipment/ArrowConfigurator";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Custom Arrow Configurator | Jan Franko Traditional Archery",
  description: "Build a complete custom arrow request using bow, shaft, spine, fletching, finishing, quantity, and delivery details.",
  canonicalUrl: "https://janfranko.com/equipment/arrow-configurator",
});

export default function ArrowConfiguratorPage() {
  return <ArrowConfigurator />;
}
