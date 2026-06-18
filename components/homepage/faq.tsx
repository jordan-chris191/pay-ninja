import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqs = [
  { question: "Is it really free?", answer: "Yes — 10 invoices/month, forever. Upgrade only when you need more." },
  { question: "Do I need Stripe?", answer: "Yes, but setup takes under 5 minutes." },
  { question: "Can clients pay without signing up?", answer: "Absolutely. They just click and pay." },
  { question: "What happens after 10 invoices?", answer: "You'll see an upgrade prompt. No automatic charges." },
  { question: "Can I export my data?", answer: "Yes — CSV or PDF, anytime." },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-20">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Quick answers.</h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-sm font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
