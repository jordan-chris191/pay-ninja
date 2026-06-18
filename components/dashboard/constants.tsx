// ─── Revenue history (static reference data) ───────────────────────────────
export const REVENUE_HISTORY: Record<string, { month: string; revenue: number }[]> = {
  "6M": [
    { month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 6800 },
    { month: "Mar", revenue: 5100 }, { month: "Apr", revenue: 9400 },
    { month: "May", revenue: 7600 }, { month: "Jun", revenue: 12450 },
  ],
  "1Y": [
    { month: "Jul", revenue: 3100 }, { month: "Aug", revenue: 4200 },
    { month: "Sep", revenue: 5800 }, { month: "Oct", revenue: 4900 },
    { month: "Nov", revenue: 6200 }, { month: "Dec", revenue: 7100 },
    { month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 6800 },
    { month: "Mar", revenue: 5100 }, { month: "Apr", revenue: 9400 },
    { month: "May", revenue: 7600 }, { month: "Jun", revenue: 12450 },
  ],
  "All": [
    { month: "2024 Q1", revenue: 18200 }, { month: "2024 Q2", revenue: 22400 },
    { month: "2024 Q3", revenue: 19800 }, { month: "2024 Q4", revenue: 28600 },
    { month: "2025 Q1", revenue: 31200 }, { month: "2025 Q2", revenue: 38900 },
    { month: "2025 Q3", revenue: 42100 }, { month: "2025 Q4", revenue: 51400 },
    { month: "2026 Q1", revenue: 44700 }, { month: "2026 Q2", revenue: 55000 },
  ],
};

export const SPARKLINES = [
  [{ v: 5200 }, { v: 7100 }, { v: 6400 }, { v: 9200 }, { v: 8600 }, { v: 12450 }],
  [{ v: 3 }, { v: 7 }, { v: 5 }, { v: 9 }, { v: 6 }, { v: 8 }],
  [{ v: 14 }, { v: 18 }, { v: 20 }, { v: 17 }, { v: 22 }, { v: 24 }],
  [{ v: 5 }, { v: 2 }, { v: 4 }, { v: 3 }, { v: 5 }, { v: 3 }],
];

export const STATUS_CFG = {
  paid: { label: "Paid", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50" },
  pending: { label: "Pending", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50" },
  overdue: { label: "Overdue", cls: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50" },
};