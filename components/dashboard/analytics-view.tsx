"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "./chart-tool-tip";
import { REVENUE_HISTORY } from "./constants";
import { fmt } from "./utils";
import type { Invoice } from "./types";

export function AnalyticsView({ invoices, isDark }: { invoices: Invoice[]; isDark: boolean }) {
  const totalRev = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.rawAmount, 0);
  const avgValue = invoices.length ? Math.round(invoices.reduce((s, i) => s + i.rawAmount, 0) / invoices.length) : 0;
  const collectRate = invoices.length ? Math.round(invoices.filter(i => i.status === "paid").length / invoices.length * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total Collected", value: fmt(totalRev), sub: "All time" },
          { label: "Avg Invoice Value", value: fmt(avgValue), sub: "Across all invoices" },
          { label: "Collection Rate", value: `${collectRate}%`, sub: "Paid vs total" },
        ].map(m => (
          <Card key={m.label} className="border shadow-none">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{m.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border shadow-none">
        <CardHeader className="px-5 pt-4 pb-0">
          <CardTitle className="text-sm font-semibold">Revenue Trend</CardTitle>
          <p className="text-xs text-muted-foreground">Monthly revenue over the last 6 months</p>
        </CardHeader>
        <CardContent className="px-2 pt-4 pb-3">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_HISTORY["6M"]} margin={{ top: 4, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? "#6b6b88" : "#9090aa" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? "#6b6b88" : "#9090aa" }} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: "var(--color-primary)", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}