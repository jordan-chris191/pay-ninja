"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fmt } from "./utils";
import type { Invoice, LineItem } from "./types";

export function NewInvoiceDialog({ open, onClose, onSave }: {
  open: boolean; onClose: () => void; onSave: (inv: Invoice) => void;
}) {
  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("2026-06-18");
  const [dueDate, setDueDate] = useState("2026-07-18");
  const [items, setItems] = useState<LineItem[]>([{ id: "1", description: "", qty: 1, rate: 0 }]);

  const total = items.reduce((s, i) => s + i.qty * i.rate, 0);

  const addItem = () => setItems(prev => [...prev, { id: Date.now().toString(), description: "", qty: 1, rate: 0 }]);
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const updateItem = (id: string, field: keyof LineItem, value: string | number) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  const handleSave = () => {
    if (!client.trim()) { toast.error("Client name is required"); return; }
    if (!items[0].description) { toast.error("Add at least one line item"); return; }
    const initials = client.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    onSave({
      id: "", client: client.trim(), initials, email: email.trim(),
      rawAmount: total, status: "pending",
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      dueDate: new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lineItems: items,
    });
    setClient(""); setEmail(""); setItems([{ id: "1", description: "", qty: 1, rate: 0 }]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">New Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Client Name</Label>
              <Input className="h-8 text-sm" placeholder="Acme Corp" value={client} onChange={e => setClient(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input className="h-8 text-sm" type="email" placeholder="billing@acme.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Invoice Date</Label>
              <Input className="h-8 text-sm" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Due Date</Label>
              <Input className="h-8 text-sm" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="mb-2 grid grid-cols-[1fr_60px_80px_32px] gap-2 text-xs font-medium text-muted-foreground px-1">
              <span>Description</span><span className="text-center">Qty</span><span className="text-center">Rate</span><span />
            </div>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr_60px_80px_32px] gap-2 items-center">
                  <Input className="h-8 text-sm" placeholder="Design work..." value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)} />
                  <Input className="h-8 text-sm text-center" type="number" min={1} value={item.qty} onChange={e => updateItem(item.id, "qty", Number(e.target.value))} />
                  <Input className="h-8 text-sm text-right font-mono" type="number" min={0} placeholder="0" value={item.rate || ""} onChange={e => updateItem(item.id, "rate", Number(e.target.value))} />
                  <button onClick={() => removeItem(item.id)} disabled={items.length === 1} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline">
              <Plus className="h-3 w-3" /> Add line item
            </button>
          </div>

          <div className="rounded-xl bg-muted/60 border px-4 py-3 flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold font-mono">{fmt(total)}</span>
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1 h-8 text-sm" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 h-8 text-sm" onClick={handleSave}>Create Invoice</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}