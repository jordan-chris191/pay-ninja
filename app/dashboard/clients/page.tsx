"use client";

import { ClientsView } from "@/components/dashboard/clients-view";
import { useDashboardData } from "@/components/dashboard/dashboard-context";

export default function ClientsPage() {
  const { invoices } = useDashboardData();

  return <ClientsView invoices={invoices} />;
}