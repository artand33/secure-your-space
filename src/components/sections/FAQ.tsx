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
    <section className="py-20 md:py-28">
      <div className="section-divider mb-20" />
      <div ref={ref} className="container mx-auto px-4 max-w-3xl">
        <div className={`text-center mb-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>

        <div className={`${isVisible ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: "200ms" }}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-xl px-6">
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
