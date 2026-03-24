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
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-transparent via-[#121212]/45 to-transparent border-y border-white/[0.02]">
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-80px] left-[-8%] h-64 w-64 rounded-full bg-[#27415f]/30 blur-[110px]" />
      <div className="section-divider mb-20" />
      <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image placeholder */}
          <div className={`${isVisible ? "animate-fade-in" : "opacity-0"}`}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.10] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_65%)]" />
              <div className="absolute inset-x-4 bottom-4 rounded-md bg-background/85 px-3 py-2 border border-border/60">
                <span className="text-muted-foreground text-xs tracking-wide uppercase">Team / Installation Photo</span>
              </div>
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
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <bullet.icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">{bullet.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Installation imagery placeholders */}
        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-4 mt-16 ${
            isVisible ? "animate-fade-in" : "opacity-0"
          }`}
          style={{ animationDelay: isVisible ? "400ms" : undefined }}
        >
          {["CCTV Installation", "Access Panel", "Clean Cable Work"].map((label) => (
            <div
              key={label}
              className="relative aspect-video overflow-hidden rounded-xl border border-white/[0.10] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_65%)]" />
              <div className="absolute inset-x-3 bottom-3 rounded bg-background/85 px-2 py-1 border border-border/60">
                <span className="text-muted-foreground text-[11px]">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;
