"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "./status-badge";
import { fmt } from "./utils";
import type { Invoice } from "./types";

export function ViewInvoiceDialog({ invoice, onClose }: { invoice: Invoice | null; onClose: () => void }) {
  if (!invoice) return null;
  return (
    <Dialog open={!!invoice} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Invoice {invoice.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><div className="text-muted-foreground mb-0.5">Client</div><div className="font-medium">{invoice.client}</div></div>
            <div><div className="text-muted-foreground mb-0.5">Email</div><div className="font-medium">{invoice.email || "—"}</div></div>
            <div><div className="text-muted-foreground mb-0.5">Issued</div><div className="font-medium">{invoice.date}</div></div>
            <div><div className="text-muted-foreground mb-0.5">Due</div><div className="font-medium">{invoice.dueDate}</div></div>
          </div>
          <div className="border-t pt-3">
            <div className="mb-2 grid grid-cols-[1fr_auto] gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Description</span><span>Amount</span>
            </div>
            {invoice.lineItems.map(item => (
              <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 py-1.5 text-sm border-b border-border/50 last:border-0">
                <span>{item.description}</span>
                <span className="font-mono">{fmt(item.qty * item.rate)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-baseline border-t pt-3">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold font-mono">{fmt(invoice.rawAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <StatusBadge status={invoice.status} />
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={() => { toast.success("PDF downloaded"); onClose(); }}>
              <Download className="h-3 w-3" /> Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}