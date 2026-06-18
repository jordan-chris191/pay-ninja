// app/(marketing)/page.tsx
import { Hero } from "@/components/homepage/hero";
import { HowItWorks } from "@/components/homepage/how-it-works";
import { Features } from "@/components/homepage/features";
import { PricingPreview } from "@/components/homepage/pricing-preview";
import { FAQ } from "@/components/homepage/faq";
import { FinalCTA } from "@/components/homepage/final-cta";


export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <PricingPreview />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  );
}