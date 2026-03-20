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
      {/* Sticky top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm">SecureGuard Systems</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">Services</a>
            <a href="#why-us" className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">Why Choose Us</a>
            <a href="#faq" className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCTAClick}
              className="hidden sm:block text-[10px] md:text-xs font-bold px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
            >
              Free Assessment
            </button>
            <UserMenu />
          </div>
        </div>
      </nav>

      <div className="pt-14">
        <Hero onCTAClick={handleCTAClick} />
        <Services onCTAClick={handleCTAClick} />
        <WhyUs />
        <Trust />
        <SocialProof />
        <Logistics />
        <FAQ />
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
