import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onCTAClick: () => void;
}

const Hero = ({ onCTAClick }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 mb-8">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Retail · Residential · Commercial</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Professional Security Systems
          <span className="block text-primary">You Can Rely On</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Local, certified installers protecting properties across Essex and Suffolk with systems built to last.
        </p>

        <Button
          onClick={onCTAClick}
          size="lg"
          className="text-base px-8 py-6 rounded-lg shadow-[0_0_30px_hsl(25_100%_50%/0.3)] hover:shadow-[0_0_40px_hsl(25_100%_50%/0.45)] transition-all duration-300"
        >
          Request a Free Security Assessment
        </Button>
      </div>
    </section>
  );
};

export default Hero;
