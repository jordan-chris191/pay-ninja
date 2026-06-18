"use client";

import { useTheme } from "next-themes";
import { AnalyticsView } from "@/components/dashboard/analytics-view";
import { useDashboardData } from "@/components/dashboard/dashboard-context";

export default function AnalyticsPage() {
  const { resolvedTheme } = useTheme();
  const { invoices } = useDashboardData();

  return <AnalyticsView invoices={invoices} isDark={resolvedTheme === "dark"} />;
}