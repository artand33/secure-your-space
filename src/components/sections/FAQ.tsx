import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    question: "Do you cover my area?",
    answer: "We cover Basildon, Braintree, Brentwood, Chelmsford, Colchester, Harlow, Ipswich, Maldon, Romford, Southend-on-Sea, and Witham. If you're nearby, get in touch — we may still be able to help.",
  },
  {
    question: "How long does installation take?",
    answer: "Most systems are installed within a single day. Larger commercial projects may take 2–3 days depending on scope. We'll confirm the timeline during your free assessment.",
  },
  {
    question: "Do you offer aftercare or maintenance?",
    answer: "Yes. We provide ongoing support, system health checks, and maintenance packages to ensure your security system continues to perform at its best.",
  },
  {
    question: "Which system is right for my property?",
    answer: "That depends on your property type, layout, and specific security concerns. During our free assessment, we'll recommend the best combination of systems tailored to your needs.",
  },
  {
    question: "Are your engineers certified?",
    answer: "All of our engineers are fully certified, insured, and trained to the latest industry standards. We take compliance seriously so you don't have to worry.",
  },
];

const FAQ = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="faq" className="relative py-24 md:py-32 scroll-mt-20 overflow-hidden bg-gradient-to-b from-transparent via-[#121924]/30 to-transparent border-y border-white/[0.02]">
      <div className="pointer-events-none absolute -bottom-24 left-[15%] h-64 w-64 rounded-full bg-[#2563eb]/12 blur-[110px]" />
      <div className="section-divider mb-20" />
      <div ref={ref} className="relative z-10 container mx-auto px-4 max-w-3xl">
        <div className={`text-center mb-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <span className="inline-flex items-center rounded-full border border-accent/35 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-5">
            Common questions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>

        <div className={`${isVisible ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: "200ms" }}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.015] backdrop-blur-xl px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
