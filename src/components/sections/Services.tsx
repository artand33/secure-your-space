import { Fingerprint, Camera, Phone, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ServicesProps {
  onCTAClick: () => void;
}

const services = [
  {
    icon: Fingerprint,
    title: "Access Control Systems",
    description: "Control who enters your property with keypads, fobs, and smart access solutions.",
    tags: ["Retail", "Residential", "Commercial"],
  },
  {
    icon: Camera,
    title: "CCTV Installation",
    description: "Professional camera systems for full property visibility, indoors and outdoors.",
    tags: ["Retail", "Residential", "Commercial"],
  },
  {
    icon: Phone,
    title: "Intercom Systems",
    description: "Manage visitor entry remotely with audio and video intercom solutions.",
    tags: ["Retail", "Residential", "Commercial"],
  },
  {
    icon: ShieldAlert,
    title: "Intruder Alarms",
    description: "Reliable alarm systems that detect and deter unauthorised entry instantly.",
    tags: ["Retail", "Residential", "Commercial"],
  },
];

const Services = ({ onCTAClick }: ServicesProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="services"
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-background to-secondary/40 scroll-mt-20"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_65%)]" />
      <div className="section-divider mb-20" />
      <div ref={ref} className="relative z-10 container mx-auto px-4">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Security Solutions</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            End-to-end security systems designed, installed, and maintained by certified engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`group relative bg-card rounded-xl p-8 border border-border/70 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(25_100%_50%/0.16)] hover:-translate-y-1 ${
                isVisible ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ animationDelay: isVisible ? `${i * 100 + 200}ms` : undefined }}
            >
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {service.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={onCTAClick} className="text-primary hover:text-primary px-0 hover:bg-transparent">
                    Enquire now →
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
