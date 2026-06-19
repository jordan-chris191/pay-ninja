"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon, Plus, Menu, Bell, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
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
  userInitials: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  onToggleTheme: () => void;
  onNewInvoice: () => void;
  onToggleSidebar: () => void;
  onSignOut: () => void;
}

export function DashboardHeader({
  dateLabel,
  isDark,
  mounted,
  userInitials,
  userName,
  userEmail,
  avatarUrl,
  onToggleTheme,
  onNewInvoice,
  onToggleSidebar,
  onSignOut,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-3 sm:px-6">
      {/* Mobile: Hamburger + compact title */}
      <div className="flex items-center gap-2 shrink-0 sm:gap-0">
        <button
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="shrink-0">
          <h1 className="text-[15px] font-semibold tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-[11px] text-muted-foreground leading-tight hidden sm:block">
            {dateLabel}
          </p>
        </div>
      </div>

      {/* Search: full width on mobile, centered on desktop */}
      <div className="flex flex-1 justify-center min-w-0">
        <HeaderSearch />
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        {/* Notifications */}
        <button
          onClick={() => toast.info("No new notifications")}
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {/* Optional badge — uncomment if you have real count */}
          {/* <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" /> */}
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          {mounted ? (
            isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </button>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* New invoice: icon-only on mobile, text on desktop */}
        <Button
          size="sm"
          className="gap-1.5 text-xs h-8 px-2 sm:px-3"
          onClick={onNewInvoice}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New invoice</span>
        </Button>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-muted"
              aria-label="Open profile menu"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="h-7 w-7 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {userInitials}
                </div>
              )}
              <div className="hidden md:block text-left leading-tight">
                <div className="text-xs font-medium">{userName}</div>
                <div className="text-[10px] text-muted-foreground">{userEmail}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("No new notifications")} className="gap-2 sm:hidden">
              <Bell className="h-3.5 w-3.5" /> Notifications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleTheme} className="gap-2 sm:hidden">
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />} Theme
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" asChild>
              <a href="/dashboard/settings">
                <Settings className="h-3.5 w-3.5" /> Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive" onClick={onSignOut}>
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}