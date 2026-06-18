"use client";

import { ArrowRight, CheckCircle2, Plus, Trash2, Receipt } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthDialog } from "@/context/auth-dialog-context";
import { useState } from "react";

type LineItem = {
  id: number;
  description: string;
  amount: number;
};

function InvoiceMockup() {
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "AMD Ryzen 7 7800X3D", amount: 420 },
    { id: 2, description: "NVIDIA GeForce RTX 4090", amount: 2200 },
    { id: 3, description: "G.Skill Trident Z5 Neo 32GB (2x16GB) DDR5-6000 CL30", amount: 320 },
  ]);
  const [nextId, setNextId] = useState(4);
  const [isPaid, setIsPaid] = useState(false);

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { id: nextId, description: "New service", amount: 0 }]);
    setNextId((n) => n + 1);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="relative w-full max-w-[420px] select-none">
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-primary/15 blur-2xl" />

      <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 border-b px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="80" height="80" rx="20" fill="#081226" />
              <path d="M20 45 L5 35 L15 50 L5 60 L20 55" fill="url(#blueGradient)" />
              <circle cx="50" cy="50" r="28" fill="#0F172A" />
              <path d="M30 48C35 42 65 42 70 48L66 58C55 62 45 62 34 58L30 48Z" fill="white" />
              <path d="M38 49 L48 52 L42 55 Z" fill="#111827" />
              <path d="M62 49 L52 52 L58 55 Z" fill="#111827" />
              <path d="M15 85 C30 70,50 62,90 45" stroke="url(#blueGradient)" strokeWidth="8" strokeLinecap="round" />
            </svg>
            <div>
              <div className="text-xs font-semibold">PayNinja</div>
              <div className="text-[10px] text-muted-foreground">hello@payninja.co</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Invoice</div>
            <div className="text-xs font-semibold font-mono">#INV-2026-042</div>
          </div>
        </div>

        {/* Bill To */}
        <div className="px-5 py-4 border-b">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Bill To</div>
          <div className="text-sm font-semibold">GD Tech Solutions Corporation</div>
          <div className="text-[11px] text-muted-foreground">accounts@gdtechsolution.com</div>
          <div className="mt-3 flex gap-6">
            <div>
              <div className="text-[10px] text-muted-foreground">Issued</div>
              <div className="text-[11px] font-medium">Jun 15, 2026</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">Due</div>
              <div className="text-[11px] font-medium">Jul 15, 2026</div>
            </div>
          </div>
        </div>

        {/* Interactive Line Items */}
        <div className="px-5 py-4">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-2 items-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Description</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-right">Amount</div>
            <div className="w-6" />

            {items.map((item) => (
              <div key={item.id} className="contents group">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  className="text-xs bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1 -mx-1 rounded transition-colors"
                />
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => updateItem(item.id, "amount", Number(e.target.value))}
                  className="text-xs font-mono text-right bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1 -mx-1 rounded w-20 transition-colors"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add line item
          </button>

          <div className="mt-4 border-t pt-3 flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Total Due</span>
            <span className="text-xl font-bold font-mono tracking-tight">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Status — clickable */}
        <div className="px-5 pb-4">
          <button
            onClick={() => setIsPaid(!isPaid)}
            className={`w-full flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${
              isPaid
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15"
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 transition-colors ${
                isPaid ? "bg-emerald-500" : "bg-amber-500"
              }`}
            >
              {isPaid ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              ) : (
                <Receipt className="h-3.5 w-3.5 text-white" />
              )}
            </div>
            <div className="text-left">
              <div
                className={`text-[11px] font-semibold ${
                  isPaid ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                }`}
              >
                {isPaid ? "Payment received" : "Awaiting payment"}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {isPaid ? "via Stripe · Jun 18, 2026" : "Click to mark as paid"}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { openAuth } = useAuthDialog();
  return (
    <section className="relative overflow-hidden bg-background py-20 pb-28 md:py-28 md:pb-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-[1.1]">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Get paid
            <br />
            <span className="text-primary">without the chase.</span>
          </h1>

          <p className="mb-8 max-w-sm text-base text-muted-foreground">
            Create professional invoices with built-in payment links. Send it once. Money arrives.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => openAuth("register")} className="gap-2">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              See demo
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-5">
            {["No credit card", "Setup in 2 min", "Cancel anytime"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end lg:flex-1">
          <InvoiceMockup />
        </div>
      </div>
    </section>
  );
}