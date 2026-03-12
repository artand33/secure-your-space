import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const areas = [
  "Basildon", "Braintree", "Brentwood", "Chelmsford", "Colchester",
  "Harlow", "Ipswich", "Maldon", "Romford", "Southend-on-Sea", "Witham",
];

const steps = [
  { step: "01", title: "Free Assessment", description: "We visit your property, assess your needs, and recommend the right system." },
  { step: "02", title: "Tailored Quote", description: "You receive a clear, itemised quote with no hidden costs." },
  { step: "03", title: "Professional Installation", description: "Our certified engineers install your system with minimal disruption." },
  { step: "04", title: "Ongoing Support", description: "We provide aftercare, maintenance, and system health checks." },
];

const Logistics = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 md:py-28">
      <div className="section-divider mb-20" />
      <div ref={ref} className="container mx-auto px-4 max-w-5xl">
        {/* Areas Covered */}
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Areas We Cover</h2>
          <p className="text-muted-foreground mb-8">Serving businesses and homeowners across Essex and Suffolk.</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {areas.map((area) => (
              <Badge key={area} variant="outline" className="text-sm border-border text-muted-foreground px-3 py-1">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {/* Property Types */}
        <div className={`flex justify-center gap-4 mb-20 ${isVisible ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: "200ms" }}>
          {["Retail", "Residential", "Commercial"].map((type) => (
            <Badge key={type} className="text-sm px-4 py-1.5">
              {type}
            </Badge>
          ))}
        </div>

        {/* Installation Process */}
        <div className={`mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: "300ms" }}>
          <h3 className="text-2xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <span className="text-4xl font-bold text-primary/20 block mb-3">{s.step}</span>
                <h4 className="text-lg font-semibold mb-2">{s.title}</h4>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: "400ms" }}>
          <div className="bg-card rounded-xl p-6 border border-border">
            <h4 className="font-semibold mb-3">Average Installation Times</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>CCTV System — 1 day</li>
              <li>Access Control — Half day to 1 day</li>
              <li>Intruder Alarm — Half day</li>
              <li>Intercom System — Half day</li>
            </ul>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <h4 className="font-semibold mb-3">Who This Is For</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Property owners who want a reliable, professionally installed system</li>
              <li>✓ Businesses needing to secure premises and manage access</li>
              <li>✓ Homeowners looking for peace of mind</li>
              <li className="text-muted-foreground/60">✗ DIY enthusiasts looking for self-install kits</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logistics;
