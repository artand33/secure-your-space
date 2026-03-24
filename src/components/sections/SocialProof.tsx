import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    quote: "Quick, professional, and no fuss. The CCTV system has been running perfectly since day one.",
    name: "James R.",
    type: "Retail Store Owner, Chelmsford",
  },
  {
    quote: "They fitted a full access control system across our office in under a day. Really impressed.",
    name: "Sarah T.",
    type: "Commercial Property Manager, Colchester",
  },
  {
    quote: "Friendly team, clear communication, and a great intercom setup for our apartment block.",
    name: "Mark D.",
    type: "Residential Block, Southend-on-Sea",
  },
  {
    quote: "We needed an alarm system installed quickly after a break-in. They were there the next morning.",
    name: "Lisa K.",
    type: "Homeowner, Brentwood",
  },
];

const SocialProof = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-transparent via-[#0f141d]/35 to-transparent border-y border-white/[0.02]">
      <div className="pointer-events-none absolute -top-24 left-[12%] h-64 w-64 rounded-full bg-[#2563eb]/12 blur-[110px]" />
      <div className="section-divider mb-20" />
      <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-5xl">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <span className="inline-flex items-center rounded-full border border-accent/35 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-5">
            Social proof
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`rounded-2xl p-6 border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.015] backdrop-blur-xl transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_26px_hsl(25_100%_50%/0.17)] ${
                isVisible ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ animationDelay: isVisible ? `${i * 100 + 200}ms` : undefined }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
