"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderSearch } from "./header-search";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/invoices": "Invoices",
  "/dashboard/clients": "Clients",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

interface DashboardHeaderProps {
  dateLabel: string;
  isDark: boolean;
  mounted: boolean;
  onToggleTheme: () => void;
  onNewInvoice: () => void;
}

export function DashboardHeader({ dateLabel, isDark, mounted, onToggleTheme, onNewInvoice }: DashboardHeaderProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
      <div className="shrink-0">
        <h1 className="text-[15px] font-semibold tracking-tight leading-tight">{title}</h1>
        <p className="text-[11px] text-muted-foreground leading-tight">{dateLabel}</p>
      </div>

      <div className="flex flex-1 justify-center">
        <HeaderSearch />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {/* Theme toggle — same pattern as navbar */}
        <button
          onClick={onToggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          {mounted ? (
            isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
          ) : (
            <div className="h-4 w-4" />
          )}
        </button>

        <div className="h-6 w-px bg-border" />

        <Button size="sm" className="gap-1.5 text-xs h-8 px-3" onClick={onNewInvoice}>
          <Plus className="h-3.5 w-3.5" /> New invoice
        </Button>
      </div>
    </header>
  );
}