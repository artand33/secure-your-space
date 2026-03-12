import { Clock, ShieldCheck, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const bullets = [
  { icon: Clock, text: "10+ years protecting properties across Essex and Suffolk" },
  { icon: ShieldCheck, text: "Fully certified, insured, and compliant with industry standards" },
  { icon: Users, text: "Same-day response for urgent security concerns" },
];

const Trust = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 md:py-28">
      <div className="section-divider mb-20" />
      <div ref={ref} className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image placeholder */}
          <div className={`${isVisible ? "animate-fade-in" : "opacity-0"}`}>
            <div className="aspect-[4/3] rounded-xl bg-secondary border border-border flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Team / Installation Photo</span>
            </div>
          </div>

          {/* Content */}
          <div className={`${isVisible ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: isVisible ? "200ms" : undefined }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built on Trust,<br />Driven by Results</h2>
            <p className="text-muted-foreground mb-8">
              We're a local security company that takes pride in doing the job properly. Every installation is carried out to the highest standard, with ongoing support you can count on.
            </p>
            <div className="space-y-5">
              {bullets.map((bullet) => (
                <div key={bullet.text} className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <bullet.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">{bullet.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Installation imagery placeholders */}
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 mt-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: isVisible ? "400ms" : undefined }}>
          {["CCTV Installation", "Access Panel", "Clean Cable Work"].map((label) => (
            <div key={label} className="aspect-video rounded-lg bg-secondary border border-border flex items-center justify-center">
              <span className="text-muted-foreground text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;
