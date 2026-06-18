"use client";

import { useTheme } from "next-themes";
import { OverviewView } from "@/components/dashboard/overview-view";
import { useDashboardData } from "@/components/dashboard/dashboard-context";

export default function OverviewPage() {
  const { resolvedTheme } = useTheme();
  const { invoices, onNewInvoice, onView } = useDashboardData();

  return (
    <OverviewView
      invoices={invoices}
      isDark={resolvedTheme === "dark"}
      onNewInvoice={onNewInvoice}
      onView={onView}
    />
  );
}