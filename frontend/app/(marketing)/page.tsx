import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ProductTabs from "@/components/home/ProductTabs";
import HowItWorks from "@/components/home/HowItWorks";
import Developer from "@/components/home/Developer";
import ClosingCta from "@/components/home/ClosingCta";

export const metadata: Metadata = {
  title: { absolute: "FerretOps | Compliance documents to running checks" },
};

// Home (Main.dc.html, spec §4 Home). The integrations Marquee (components/home/Marquee) is deferred and not rendered.
export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductTabs />
      <HowItWorks />
      <Developer />
      <ClosingCta />
    </main>
  );
}
