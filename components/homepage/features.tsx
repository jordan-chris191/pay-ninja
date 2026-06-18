import { FileText, Link2, LayoutDashboard, Lock, CreditCard, Building2 } from "lucide-react";

function PDFPreview() {
  return (
    <div className="w-full rounded-xl border bg-background p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <div className="rounded border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
          invoice-0042.pdf
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-3 text-zinc-900 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[8px] font-semibold uppercase tracking-wider text-zinc-400">Invoice</div>
            <div className="text-xs font-bold">Studio Chen</div>
            <div className="text-[9px] text-zinc-400">No. 0042</div>
          </div>
          <div className="rounded-full bg-amber-100 px-2 py-0.5 text-[8px] font-semibold text-amber-700">
            Due Jun 30
          </div>
        </div>

        <div className="mt-2.5 text-[9px] text-zinc-400">
          Bill to <span className="font-medium text-zinc-700">Acme Corp</span>
        </div>

        <div className="mt-2.5 space-y-1.5 border-t border-zinc-100 pt-2">
          <div className="flex justify-between text-[9px]">
            <span className="text-zinc-500">Brand identity design</span>
            <span className="font-mono text-zinc-700">$5,200.00</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-zinc-500">Logo & style guide</span>
            <span className="font-mono text-zinc-700">$1,800.00</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-zinc-500">Revisions (2 rounds)</span>
            <span className="font-mono text-zinc-700">$1,200.00</span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-zinc-100 pt-2">
          <span className="text-[9px] font-medium text-zinc-600">Total due</span>
          <span className="text-xs font-bold font-mono">$8,200.00</span>
        </div>
      </div>
    </div>
  );
}

function PaymentLinkPreview() {
  return (
    <div className="w-full rounded-xl border bg-background p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5">
        <Lock className="h-3 w-3 shrink-0 text-emerald-500" />
        <div className="truncate text-[10px] font-mono text-muted-foreground">pay.studiochen.co/inv-0042</div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-3 text-zinc-900 shadow-sm">
        <div className="text-center">
          <div className="text-[9px] text-zinc-400">Pay Studio Chen</div>
          <div className="mt-1 text-xl font-bold font-mono">$8,200.00</div>
          <div className="mt-0.5 text-[9px] text-zinc-400">Invoice #0042 · Acme Corp</div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-1.5">
            <CreditCard className="h-3 w-3 text-zinc-400" />
            <span className="text-[10px] text-zinc-600">Debit or credit card</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-1.5">
            <Building2 className="h-3 w-3 text-zinc-400" />
            <span className="text-[10px] text-zinc-600">Bank transfer</span>
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-zinc-900 py-2 text-center text-[10px] font-medium text-white">
          Pay $8,200.00
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  const toneStyles = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  } as const;

  type Tone = keyof typeof toneStyles;

  type Row = {
    name: string;
    amount: string;
    status: string;
    tone: Tone;
  };

  const rows: Row[] = [
    { name: "Acme Corp", amount: "$8,200", status: "Paid", tone: "emerald" },
    { name: "TechStart", amount: "$1,800", status: "Pending", tone: "amber" },
    { name: "Design Co", amount: "$3,200", status: "Paid", tone: "emerald" },
    { name: "StartupXYZ", amount: "$950", status: "Overdue", tone: "red" },
  ];

  return (
    <div className="w-full rounded-xl border bg-background p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10px] font-medium text-muted-foreground">Outstanding invoices</div>
        <div className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">+ New</div>
      </div>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.name} className="flex items-center justify-between rounded-lg border px-2.5 py-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[8px] font-semibold text-muted-foreground">
                {row.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[10px] font-medium">{row.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">{row.amount}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-medium ${toneStyles[row.tone]}`}>
                {row.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    icon: FileText,
    title: "PDF Invoices",
    description: "Look professional instantly.",
    preview: <PDFPreview />,
  },
  {
    icon: Link2,
    title: "Payment Links",
    description: "No more \"how do I pay you?\" emails.",
    preview: <PaymentLinkPreview />,
  },
  {
    icon: LayoutDashboard,
    title: "Live Dashboard",
    description: "Know exactly who owes you.",
    preview: <DashboardPreview />,
  },
];

export function Features() {
  return (
    <section id="features" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything you need.</h2>
          <p className="mt-3 text-muted-foreground">Built for freelancers who just want to get paid.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1 text-base font-semibold">{feature.title}</h3>
              <p className="mb-5 text-sm text-muted-foreground">{feature.description}</p>
              {feature.preview}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;