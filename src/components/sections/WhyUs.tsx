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
    <section id="why-us" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-transparent via-[#101010]/40 to-transparent scroll-mt-20 border-b border-white/[0.01]">
      <div className="section-divider mb-20" />
      <div ref={ref} className="container mx-auto px-4 max-w-4xl">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className={`text-center bg-white/[0.01] backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.03] border-t-white/[0.1] transition-all duration-700 hover:bg-white/[0.03] hover:border-[#E8640A]/30 hover:shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(232,100,10,0.06)] hover:-translate-y-2 ${
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
