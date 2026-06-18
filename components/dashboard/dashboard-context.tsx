"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Invoice, Profile } from "./types";

interface DashboardContextValue {
  invoices: Invoice[];
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
  onView: (inv: Invoice) => void;
  onNewInvoice: () => void;
  profile: Profile;
  onSaveProfile: (updates: Omit<Profile, "id">) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ value, children }: { value: DashboardContextValue; children: ReactNode }) {
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardData() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboardData must be used within app/dashboard's layout.tsx tree");
  }
  return ctx;
}