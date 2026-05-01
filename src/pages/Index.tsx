import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { ExplodingFeatures } from "@/components/landing/ExplodingFeatures";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="relative overflow-x-hidden">
        <Nav />
        <Hero />
        <Marquee />
        <ExplodingFeatures />
        <CTA />
        <Footer />
      </div>
    </main>
  );
};

export default Index;


