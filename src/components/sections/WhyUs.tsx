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
    <section id="why-us" className="py-20 md:py-28 scroll-mt-20">
      <div className="section-divider mb-20" />
      <div ref={ref} className="container mx-auto px-4 max-w-4xl">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className={`text-center bg-card rounded-xl p-6 border border-border/70 transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_24px_hsl(25_100%_50%/0.18)] ${
                isVisible ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ animationDelay: isVisible ? `${i * 150 + 200}ms` : undefined }}
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <reason.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{reason.title}</h3>
              <p className="text-sm text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
