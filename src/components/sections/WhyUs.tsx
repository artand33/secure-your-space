import { MapPin, Award, Wrench } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const reasons = [
  {
    icon: MapPin,
    title: "Local & Fast Response",
    description: "Based in Essex, we respond quickly and understand local property requirements.",
  },
  {
    icon: Award,
    title: "Certified Engineers",
    description: "Fully qualified, insured, and regularly trained on the latest security technology.",
  },
  {
    icon: Wrench,
    title: "Tailored Solutions",
    description: "Every system is designed around your property — no off-the-shelf packages.",
  },
];

const WhyUs = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="why-us"
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-transparent via-[#101010]/40 to-transparent scroll-mt-20 border-b border-white/[0.01]"
    >
      <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#1c2635]/45 blur-[100px]" />
      <div className="section-divider mb-20" />

      <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-6xl">
        <div className={`text-center mb-14 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-5">
            Why choose SecureGuard
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Built for reliability, not just aesthetics</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We design around your real property risks, install with care, and stay available after handover so your system keeps doing its job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className={`group relative rounded-3xl p-6 border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.015] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_30px_70px_rgba(0,0,0,0.7),0_0_40px_rgba(232,100,10,0.09)] ${
                isVisible ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ animationDelay: isVisible ? `${i * 150 + 200}ms` : undefined }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/[0.10] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center mb-5">
                  <reason.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{reason.title}</h3>
                <p className="text-sm text-muted-foreground">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-white/[0.07] bg-gradient-to-r from-white/[0.04] to-white/[0.015] p-4 ${
            isVisible ? "animate-fade-in" : "opacity-0"
          }`}
          style={{ animationDelay: isVisible ? "520ms" : undefined }}
        >
          <div className="rounded-xl border border-white/[0.08] bg-background/45 p-4">
            <p className="text-2xl font-bold text-primary mb-1">10+ Years</p>
            <p className="text-xs text-muted-foreground">Local service across Essex & Suffolk</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-background/45 p-4">
            <p className="text-2xl font-bold text-primary mb-1">Same-Day</p>
            <p className="text-xs text-muted-foreground">Urgent support when risks are immediate</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-background/45 p-4">
            <p className="text-2xl font-bold text-primary mb-1">Fully Certified</p>
            <p className="text-xs text-muted-foreground">Qualified, insured, standards-compliant team</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
