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
    <section className="py-20 md:py-28">
      <div className="section-divider mb-20" />
      <div ref={ref} className="container mx-auto px-4 max-w-5xl">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`bg-card rounded-xl p-6 border border-border ${isVisible ? "animate-fade-in" : "opacity-0"}`}
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
