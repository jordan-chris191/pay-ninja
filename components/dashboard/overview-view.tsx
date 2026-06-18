"use client";

import { useState, useMemo } from "react";
import {
  DollarSign, Clock, CheckCircle2, XCircle, Plus, Sparkles, ChevronRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { ChartTooltip } from "./chart-tool-tip";
import { REVENUE_HISTORY, SPARKLINES } from "./constants";
import { fmt } from "./utils";
import type { Invoice } from "./types";

export function OverviewView({ invoices, isDark, onNewInvoice, onView }: {
  invoices: Invoice[]; isDark: boolean; onNewInvoice: () => void; onView: (inv: Invoice) => void;
}) {
  const [period, setPeriod] = useState<"6M" | "1Y" | "All">("6M");
  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.rawAmount, 0);
  const pending = invoices.filter(i => i.status === "pending");
  const paid = invoices.filter(i => i.status === "paid");
  const overdue = invoices.filter(i => i.status === "overdue");

  const stats = [
    { title: "Revenue", value: fmt(totalRevenue), change: "+12%", sub: "vs last month", icon: DollarSign, iconColor: "text-emerald-500", iconBg: "bg-emerald-500/10", sparkIdx: 0, sparkColor: "#10b981" },
    { title: "Pending", value: String(pending.length), change: `${fmt(pending.reduce((s,i)=>s+i.rawAmount,0))}`, sub: "outstanding", icon: Clock, iconColor: "text-amber-500", iconBg: "bg-amber-500/10", sparkIdx: 1, sparkColor: "#f59e0b" },
    { title: "Paid", value: String(paid.length), change: `${fmt(paid.reduce((s,i)=>s+i.rawAmount,0))}`, sub: "collected", icon: CheckCircle2, iconColor: "text-emerald-500", iconBg: "bg-emerald-500/10", sparkIdx: 2, sparkColor: "#10b981" },
    { title: "Overdue", value: String(overdue.length), change: `${fmt(overdue.reduce((s,i)=>s+i.rawAmount,0))}`, sub: "at risk", icon: XCircle, iconColor: "text-red-500", iconBg: "bg-red-500/10", sparkIdx: 3, sparkColor: "#ef4444" },
  ];

  const pieData = [
    { name: "Paid", value: paid.length, color: "#10b981" },
    { name: "Pending", value: pending.length, color: "#f59e0b" },
    { name: "Overdue", value: overdue.length, color: "#ef4444" },
  ];

  const recent = invoices.slice(0, 5);

  const clients = useMemo(() => {
    const map = new Map<string, { name: string; initials: string; total: number; count: number; color: string }>();
    const colors = ["bg-violet-500/20 text-violet-600 dark:text-violet-400","bg-blue-500/20 text-blue-600 dark:text-blue-400","bg-emerald-500/20 text-emerald-600 dark:text-emerald-400","bg-amber-500/20 text-amber-600 dark:text-amber-400"];
    let ci = 0;
    invoices.forEach(inv => {
      if (!map.has(inv.client)) map.set(inv.client, { name: inv.client, initials: inv.initials, total: 0, count: 0, color: colors[ci++ % colors.length] });
      const c = map.get(inv.client)!;
      c.total += inv.rawAmount; c.count++;
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 4);
  }, [invoices]);

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border shadow-none">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{stat.title}</span>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.iconBg}`}>
                  <stat.icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="flex items-end justify-between gap-2">
                <div>
                  <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                  <div className="mt-0.5 flex items-center gap-1">
                    <span className="text-[11px] font-medium text-muted-foreground">{stat.change}</span>
                    <span className="text-[11px] text-muted-foreground">{stat.sub}</span>
                  </div>
                </div>
                <div className="h-10 w-20 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SPARKLINES[stat.sparkIdx]} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                      <defs>
                        <linearGradient id={`g${stat.sparkIdx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={stat.sparkColor} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={stat.sparkColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke={stat.sparkColor} strokeWidth={1.5} fill={`url(#g${stat.sparkIdx})`} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <Card className="border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between px-5 pt-4 pb-0">
            <div>
              <CardTitle className="text-sm font-semibold">Revenue</CardTitle>
              <p className="text-xs text-muted-foreground">Total earned over time</p>
            </div>
            <div className="flex items-center gap-0.5 rounded-lg border bg-muted/60 p-0.5">
              {(["6M", "1Y", "All"] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${p === period ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{p}</button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="px-2 pt-4 pb-3">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_HISTORY[period]} barSize={period === "All" ? 20 : 28} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? "#6b6b88" : "#9090aa" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? "#6b6b88" : "#9090aa" }} tickFormatter={v => `$${v >= 1000 ? `${v/1000}k` : v}`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", radius: 6 }} />
                  <Bar dataKey="revenue" fill="var(--color-primary)" radius={[5, 5, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-none">
          <CardHeader className="px-5 pt-4 pb-0">
            <CardTitle className="text-sm font-semibold">Status</CardTitle>
            <p className="text-xs text-muted-foreground">{invoices.length} total invoices</p>
          </CardHeader>
          <CardContent className="px-5 pt-2 pb-4">
            <div className="flex justify-center">
              <div className="relative h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={58} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold">{invoices.length}</div>
                  <div className="text-[10px] text-muted-foreground">total</div>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent + Top clients */}
      <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
        <Card className="border shadow-none">
          <CardHeader className="border-b px-5 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Invoices</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={onNewInvoice}>
                <Plus className="h-3 w-3" /> New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="pl-5 py-2.5 text-xs">Client</TableHead>
                  <TableHead className="py-2.5 text-xs">Amount</TableHead>
                  <TableHead className="py-2.5 text-xs">Status</TableHead>
                  <TableHead className="py-2.5 text-xs hidden sm:table-cell">Date</TableHead>
                  <TableHead className="w-10 pr-3" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map(inv => (
                  <TableRow key={inv.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => onView(inv)}>
                    <TableCell className="pl-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{inv.initials}</div>
                        <div>
                          <div className="text-sm font-medium">{inv.client}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{inv.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 font-mono text-sm font-medium">{fmt(inv.rawAmount)}</TableCell>
                    <TableCell className="py-3"><StatusBadge status={inv.status} /></TableCell>
                    <TableCell className="py-3 text-xs text-muted-foreground hidden sm:table-cell">{inv.date}</TableCell>
                    <TableCell className="pr-4 py-3 text-muted-foreground hover:text-foreground"><ChevronRight className="h-3.5 w-3.5" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border shadow-none">
          <CardHeader className="border-b px-5 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Top Clients</CardTitle>
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="px-5 py-3 space-y-3">
            {clients.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="text-xs font-mono text-muted-foreground/50 w-4 shrink-0">{i + 1}</div>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${c.color}`}>{c.initials}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground">{c.count} invoice{c.count !== 1 ? "s" : ""}</div>
                </div>
                <div className="text-xs font-semibold font-mono shrink-0">{fmt(c.total)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}