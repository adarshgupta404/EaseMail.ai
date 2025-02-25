import Hero from "@/components/landing/hero";
import Navbar from "@/components/landing/navbar";
import Features from "@/components/landing/features";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";

export default function Home() {
  return (
    <main className="min-h-screen font-mono bg-background">
      <Navbar />
      <Hero />     
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
