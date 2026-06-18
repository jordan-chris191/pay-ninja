"use client";

import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthDialog } from "@/context/auth-dialog-context";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try it out.",
    features: ["10 invoices/month", "PDF exports", "Payment links", "Basic dashboard"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For serious freelancers.",
    features: ["Unlimited invoices", "Custom branding", "Auto-reminders", "Priority support", "Advanced analytics"],
    cta: "Start Pro trial",
    highlighted: true,
  },
];

export function PricingPreview() {
  const { openAuth } = useAuthDialog();

  return (
    <section id="pricing" className="bg-muted py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple pricing.</h2>
          <p className="mt-3 text-muted-foreground">Start free, upgrade when ready.</p>
        </div>

        <div className="mx-auto flex max-w-2xl flex-col gap-4 md:flex-row">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-1 flex-col rounded-2xl border bg-card p-6 transition-all ${
                tier.highlighted
                  ? "border-primary/40 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                  : ""
              }`}
            >
              {tier.highlighted && (
                <div className="mb-4 inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  Most popular
                </div>
              )}

              <div className="mb-1 text-lg font-bold">{tier.name}</div>
              <div className="mb-1 flex items-baseline gap-0.5">
                <span className="text-3xl font-bold tracking-tight">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">{tier.description}</p>

              <ul className="mb-6 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.highlighted ? "default" : "outline"}
                className="w-full"
                onClick={() => openAuth("register")}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
