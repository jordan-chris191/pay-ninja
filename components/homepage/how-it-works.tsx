import { FileText, Send, BadgeCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Create",
    description: "Build an invoice in 60 seconds.",
  },
  {
    number: "02",
    icon: Send,
    title: "Send",
    description: "Client gets a payment link by email.",
  },
  {
    number: "03",
    icon: BadgeCheck,
    title: "Collect",
    description: "Money lands in your account.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Three steps.</h2>
          <p className="mt-3 text-muted-foreground">That's all it takes.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+48px)] top-6 hidden h-px w-[calc(100%-48px)] border-t border-dashed border-border md:block" />
              )}

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-background border shadow-sm">
                <step.icon className="h-6 w-6 text-primary" />
              </div>

              <div className="mb-1 font-mono text-xs text-muted-foreground">{step.number}</div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
