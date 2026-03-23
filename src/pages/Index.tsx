import { useState } from "react";
import Hero from "@/components/sections/Hero";
import CalendlyMultiStepDialog from "@/components/booking/CalendlyMultiStepDialog";
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
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const handleCTAClick = () => {
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground relative overflow-hidden bg-[linear-gradient(to_right,#FFFFFF03_1px,transparent_1px),linear-gradient(to_bottom,#FFFFFF03_1px,transparent_1px)] bg-[size:40px_40px]">
      {/* Absolute Dramatic Glow Orbs */}
      <div className="pointer-events-none absolute top-[10%] left-[-20%] w-[1000px] h-[1000px] bg-[#E8640A]/15 rounded-full blur-[160px] mix-blend-screen" />
      <div className="pointer-events-none absolute top-[30%] right-[-25%] w-[1200px] h-[1200px] bg-purple-500/10 rounded-full blur-[200px] mix-blend-screen" />
      <div className="pointer-events-none absolute top-[60%] left-[-25%] w-[1100px] h-[1100px] bg-blue-600/10 rounded-full blur-[180px] mix-blend-screen" />
      <div className="pointer-events-none absolute bottom-[5%] right-[-15%] w-[900px] h-[900px] bg-[#E8640A]/12 rounded-full blur-[150px] mix-blend-screen" />

      {/* Home Content */}
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
        <CalendlyMultiStepDialog open={isEnquiryOpen} onOpenChange={setIsEnquiryOpen} />
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
