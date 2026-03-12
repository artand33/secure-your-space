import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Phone, Mail } from "lucide-react";

interface FinalCTAProps {
  onCTAClick: () => void;
}

const FinalCTA = ({ onCTAClick }: FinalCTAProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="section-divider mb-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />

      <div ref={ref} className="relative z-10 container mx-auto px-4 text-center max-w-2xl">
        <div className={`${isVisible ? "animate-fade-in" : "opacity-0"}`}>
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
              01onal 567 890
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
