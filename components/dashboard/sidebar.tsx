"use client";

import type { ElementType } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Users, Settings, LogOut, TrendingUp, Bell,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface NavItem {
  icon: ElementType;
  label: string;
  href: string;
  badge?: string;
}

interface SidebarProps {
  invoiceCount: number;
  userInitials: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  onSignOut: () => void;
}

const DEFAULT_WIDTH = 224; // matches the original w-56
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;
const COLLAPSED_WIDTH = 72;

const STORAGE_KEY_COLLAPSED = "sidebar:collapsed";
const STORAGE_KEY_WIDTH = "sidebar:width";

export function Sidebar({ invoiceCount, userInitials, userName, userEmail, avatarUrl, onSignOut }: SidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  // Restore persisted state after mount only — reading localStorage during
  // the initial render would mismatch the server-rendered HTML.
  useEffect(() => {
    try {
      const storedCollapsed = localStorage.getItem(STORAGE_KEY_COLLAPSED);
      const storedWidth = localStorage.getItem(STORAGE_KEY_WIDTH);
      if (storedCollapsed !== null) setCollapsed(storedCollapsed === "true");
      if (storedWidth !== null) setWidth(Number(storedWidth));
    } catch {
      // localStorage unavailable (privacy mode, etc.) — just use defaults.
    }
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (e: MouseEvent) => {
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX)));
    };

    const stopResizing = () => {
      setIsResizing(false);
      setWidth(current => {
        try { localStorage.setItem(STORAGE_KEY_WIDTH, String(current)); } catch {}
        return current;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY_COLLAPSED, String(next)); } catch {}
      return next;
    });
  };

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FileText, label: "Invoices", href: "/dashboard/invoices", badge: String(invoiceCount) },
    { icon: Users, label: "Clients", href: "/dashboard/clients" },
    { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const isActive = (href: string) => (href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href));

  return (
    <aside
      style={{ width: collapsed ? COLLAPSED_WIDTH : width }}
      className={`relative flex shrink-0 flex-col border-r bg-sidebar ${isResizing ? "" : "transition-[width] duration-200"}`}
    >
      <div className={`flex h-14 items-center gap-2 border-b px-5 ${collapsed ? "justify-center" : ""}`}>
        {collapsed ? (
          <button
            onClick={toggleCollapsed}
            aria-label="Expand sidebar"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        ) : (
          <>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4F46E5"/>
                <stop offset="100%" stopColor="#2563EB"/>
              </linearGradient>
            </defs>

            <rect x="10" y="10" width="80" height="80" rx="20" fill="#081226"/>

            <path d="M20 45 L5 35 L15 50 L5 60 L20 55" fill="url(#blueGradient)" />

            <circle cx="50" cy="50" r="28" fill="#0F172A"/>
            <path 
              d="M30 48C35 42 65 42 70 48L66 58C55 62 45 62 34 58L30 48Z"
              fill="white"
            />

            <path d="M38 49 L48 52 L42 55 Z" fill="#111827"/>
            <path d="M62 49 L52 52 L58 55 Z" fill="#111827"/>

            <path
              d="M15 85 C30 70,50 62,90 45"
              stroke="url(#blueGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
                </svg>
            </div>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">PayNinja</span>
            <button
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 pt-4 pb-1">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1">Main</div>
        </div>
      )}

      <nav className={`flex-1 space-y-0.5 px-3 ${collapsed ? "pt-4" : ""}`}>
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            title={collapsed ? item.label : undefined}
            className={`flex w-full items-center gap-2.5 rounded-lg py-2 text-sm transition-colors ${collapsed ? "justify-center px-2" : "px-2.5"} ${isActive(item.href) ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
            {!collapsed && item.badge && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${isActive(item.href) ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="border-t p-3 space-y-0.5">
        <button
          title={collapsed ? "Notifications" : undefined}
          className={`flex w-full items-center gap-2.5 rounded-lg py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors ${collapsed ? "justify-center px-2" : "px-2.5"}`}
          onClick={() => toast.info("No new notifications")}
        >
          <Bell className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="flex-1 text-left">Notifications</span>}
        </button>
        <Button
          variant="ghost"
          size="sm"
          title={collapsed ? "Sign out" : undefined}
          className={`w-full text-sidebar-foreground/70 hover:text-sidebar-foreground text-sm ${collapsed ? "justify-center px-2" : "justify-start px-2.5"}`}
          onClick={onSignOut}
        >
          <LogOut className={collapsed ? "h-4 w-4" : "mr-2.5 h-4 w-4"} />
          {!collapsed && "Sign out"}
        </Button>
      </div>

      <div className="border-t px-3 py-3">
        <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
            {avatarUrl ? (
                <img
                src={avatarUrl}
                alt={userName}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
                referrerPolicy="no-referrer"
                />
            ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                {userInitials}
                </div>
            )}
            {!collapsed && (
                <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">{userName}</div>
                <div className="truncate text-[10px] text-muted-foreground">{userEmail}</div>
                </div>
            )}
            </div>
      </div>

      {!collapsed && (
        <div
          onMouseDown={() => setIsResizing(true)}
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/30 active:bg-primary/50"
        />
      )}
    </aside>
  );
}