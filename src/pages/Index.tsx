import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import WhyUs from "@/components/sections/WhyUs";
import Trust from "@/components/sections/Trust";
import SocialProof from "@/components/sections/SocialProof";
import Logistics from "@/components/sections/Logistics";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import { Shield } from "lucide-react";
import UserMenu from "@/components/UserMenu";

const Index = () => {
  const handleCTAClick = () => {
    const el = document.getElementById("final-cta");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Home Content - Navigation is now handled globally by AppLayout in DashboardLayout.tsx */}
      <div className="pt-16">
        <div id="hero">
          <Hero onCTAClick={handleCTAClick} />
        </div>
        <div id="services">
          <Services onCTAClick={handleCTAClick} />
        </div>
        <WhyUs />
        <Trust />
        <SocialProof />
        <Logistics />
        <div id="faq">
          <FAQ />
        </div>
        <div id="final-cta">
          <FinalCTA onCTAClick={handleCTAClick} />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SecureGuard Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
