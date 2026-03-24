import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Phone, Mail } from "lucide-react";

interface FinalCTAProps {
  onCTAClick: () => void;
}

const FinalCTA = ({ onCTAClick }: FinalCTAProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-transparent via-[#14100b]/40 to-transparent border-y border-white/[0.02]">
      <div className="section-divider mb-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/8 via-transparent to-transparent" />
      <div className="pointer-events-none absolute top-[-20%] left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/12 blur-[130px]" />

      <div ref={ref} className="relative z-10 container mx-auto px-4 text-center max-w-2xl">
        <div className={`rounded-2xl border border-white/[0.10] bg-gradient-to-b from-white/[0.06] to-white/[0.015] backdrop-blur-xl px-6 py-10 md:px-10 md:py-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Take the First Step Toward<br />a Safer Property
          </h2>
          <p className="text-muted-foreground mb-10">
            No commitment, no pressure — just a straightforward conversation about protecting what matters.
          </p>

          <Button
            onClick={onCTAClick}
            size="lg"
            className="text-base px-8 py-6 rounded-lg shadow-[0_0_30px_hsl(25_100%_50%/0.3)] hover:shadow-[0_0_40px_hsl(25_100%_50%/0.45)] transition-all duration-300 mb-10"
          >
            Request a Free Security Assessment
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="tel:01234567890" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-4 h-4 text-primary" />
              01234 567 890
            </a>
            <a href="mailto:info@securitysystems.co.uk" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-4 h-4 text-primary" />
              info@securitysystems.co.uk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
