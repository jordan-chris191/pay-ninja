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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-lg border bg-muted/60 p-0.5">
          {(["all", "paid", "pending", "overdue"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${s === statusFilter ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {s} <span className="ml-1 opacity-60">{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-8 w-60 pl-8 text-xs" placeholder="Search client or ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <Card className="border shadow-none">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-sm w-44">
                        <DropdownMenuItem onClick={() => onView(inv)} className="gap-2"><Eye className="h-3.5 w-3.5" />View</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => { toast.success("PDF downloaded"); }}><Download className="h-3.5 w-3.5" />Download PDF</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => { toast.success(`Reminder sent to ${inv.client}`); }}><Send className="h-3.5 w-3.5" />Send Reminder</DropdownMenuItem>
                        {inv.status !== "paid" && (
                          <DropdownMenuItem className="gap-2 text-emerald-600 dark:text-emerald-400" onClick={() => onMarkPaid(inv.id)}><CheckCircle2 className="h-3.5 w-3.5" />Mark as Paid</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => onDelete(inv.id)}><Trash2 className="h-3.5 w-3.5" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}