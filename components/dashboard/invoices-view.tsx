"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Search, Plus, MoreVertical, Eye, Download, Send, CheckCircle2, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { fmt } from "./utils";
import type { Invoice } from "./types";

export function InvoicesView({ invoices, onDelete, onMarkPaid, onView, onNewInvoice }: {
  invoices: Invoice[]; onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void; onView: (inv: Invoice) => void; onNewInvoice: () => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Invoice["status"]>("all");

  const filtered = useMemo(() =>
    invoices.filter(inv => {
      const matchSearch = !search || inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    }), [invoices, search, statusFilter]);

  const counts = useMemo(() => ({
    all: invoices.length,
    paid: invoices.filter(i => i.status === "paid").length,
    pending: invoices.filter(i => i.status === "pending").length,
    overdue: invoices.filter(i => i.status === "overdue").length,
  }), [invoices]);

  return (
    <div className="space-y-4">
      {/* Top bar — stacks on mobile, row on sm+ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg border bg-muted/60 p-0.5 overflow-x-auto">
          {(["all", "paid", "pending", "overdue"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                s === statusFilter
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s} <span className="ml-1 opacity-60">{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-8 w-full sm:w-60 pl-8 text-xs"
              placeholder="Search client or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={onNewInvoice} className="h-8 gap-1.5 shrink-0">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New</span>
          </Button>
        </div>
      </div>

      {/* Desktop Table (md+) */}
      <Card className="hidden md:block border shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="pl-5 py-3 text-xs">Client</TableHead>
                <TableHead className="py-3 text-xs">ID</TableHead>
                <TableHead className="py-3 text-xs">Amount</TableHead>
                <TableHead className="py-3 text-xs">Date</TableHead>
                <TableHead className="py-3 text-xs">Due</TableHead>
                <TableHead className="py-3 text-xs">Status</TableHead>
                <TableHead className="w-10 pr-3" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    No invoices found.
                  </TableCell>
                </TableRow>
              ) : filtered.map(inv => (
                <TableRow key={inv.id} className="hover:bg-muted/30">
                  <TableCell className="pl-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{inv.initials}</div>
                      <div>
                        <div className="text-sm font-medium">{inv.client}</div>
                        <div className="text-[10px] text-muted-foreground">{inv.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 font-mono text-xs text-muted-foreground">{inv.id}</TableCell>
                  <TableCell className="py-3 font-mono text-sm font-semibold">{fmt(inv.rawAmount)}</TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">{inv.date}</TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">{inv.dueDate}</TableCell>
                  <TableCell className="py-3"><StatusBadge status={inv.status} /></TableCell>
                  <TableCell className="pr-3 py-3">
                    <InvoiceActions
                      inv={inv}
                      onView={onView}
                      onMarkPaid={onMarkPaid}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground border rounded-lg bg-card">
            No invoices found.
          </div>
        ) : (
          filtered.map(inv => (
            <Card key={inv.id} className="border shadow-none">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {inv.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{inv.client}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{inv.email}</div>
                    </div>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-muted-foreground">Invoice ID</div>
                    <div className="font-mono text-muted-foreground">{inv.id}</div>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <div className="text-muted-foreground">Amount</div>
                    <div className="font-mono text-sm font-semibold">{fmt(inv.rawAmount)}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-muted-foreground">Date</div>
                    <div className="text-muted-foreground">{inv.date}</div>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <div className="text-muted-foreground">Due</div>
                    <div className="text-muted-foreground">{inv.dueDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button variant="outline" size="sm" className="h-8 flex-1 text-xs gap-1.5" onClick={() => onView(inv)}>
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 flex-1 text-xs gap-1.5" onClick={() => { toast.success("PDF downloaded"); }}>
                    <Download className="h-3.5 w-3.5" /> PDF
                  </Button>
                  <InvoiceActions
                    inv={inv}
                    onView={onView}
                    onMarkPaid={onMarkPaid}
                    onDelete={onDelete}
                    mobile
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
// Extracted so both desktop & mobile can share it
function InvoiceActions({
  inv,
  onView,
  onMarkPaid,
  onDelete,
  mobile = false,
}: {
  inv: Invoice;
  onView: (inv: Invoice) => void;
  onMarkPaid: (id: string) => void;
  onDelete: (id: string) => void;
  mobile?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={mobile ? "outline" : "ghost"} size="sm" className={`${mobile ? "h-8 w-8" : "h-7 w-7"} p-0 shrink-0`}>
          <MoreVertical className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="text-sm w-44">
        {!mobile && (
          <DropdownMenuItem onClick={() => onView(inv)} className="gap-2">
            <Eye className="h-3.5 w-3.5" />View
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="gap-2" onClick={() => { toast.success("PDF downloaded"); }}>
          <Download className="h-3.5 w-3.5" />Download PDF
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={() => { toast.success(`Reminder sent to ${inv.client}`); }}>
          <Send className="h-3.5 w-3.5" />Send Reminder
        </DropdownMenuItem>
        {inv.status !== "paid" && (
          <DropdownMenuItem className="gap-2 text-emerald-600 dark:text-emerald-400" onClick={() => onMarkPaid(inv.id)}>
            <CheckCircle2 className="h-3.5 w-3.5" />Mark as Paid
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => onDelete(inv.id)}>
          <Trash2 className="h-3.5 w-3.5" />Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}