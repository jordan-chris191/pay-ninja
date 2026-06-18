"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Plus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fmt } from "./utils";
import type { Invoice } from "./types";

export function ClientsView({ invoices }: { invoices: Invoice[] }) {
  const clients = useMemo(() => {
    const map = new Map<string, { name: string; initials: string; email: string; total: number; paid: number; pending: number; count: number }>();
    invoices.forEach(inv => {
      if (!map.has(inv.client)) map.set(inv.client, { name: inv.client, initials: inv.initials, email: inv.email, total: 0, paid: 0, pending: 0, count: 0 });
      const c = map.get(inv.client)!;
      c.count++; c.total += inv.rawAmount;
      if (inv.status === "paid") c.paid += inv.rawAmount; else c.pending += inv.rawAmount;
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [invoices]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">{clients.length} Clients</h2>
          <p className="text-xs text-muted-foreground">All time</p>
        </div>
        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => toast.info("Client creation coming soon")}>
          <Plus className="h-3.5 w-3.5" /> Add Client
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {clients.map(c => (
          <Card key={c.name} className="border shadow-none hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">{c.initials}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{c.email || "No email"}</div>
                </div>
                <button onClick={() => toast.info("Coming soon")} className="text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                <div>
                  <div className="text-[10px] text-muted-foreground">Revenue</div>
                  <div className="text-xs font-semibold font-mono">{fmt(c.total)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Paid</div>
                  <div className="text-xs font-semibold font-mono text-emerald-600 dark:text-emerald-400">{fmt(c.paid)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Invoices</div>
                  <div className="text-xs font-semibold">{c.count}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}