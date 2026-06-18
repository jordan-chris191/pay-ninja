"use client";

import { InvoicesView } from "@/components/dashboard/invoices-view";
import { useDashboardData } from "@/components/dashboard/dashboard-context";

export default function InvoicesPage() {
  const { invoices, onDelete, onMarkPaid, onView, onNewInvoice } = useDashboardData();

  return (
    <InvoicesView
      invoices={invoices}
      onDelete={onDelete}
      onMarkPaid={onMarkPaid}
      onView={onView}
      onNewInvoice={onNewInvoice}
    />
  );
}