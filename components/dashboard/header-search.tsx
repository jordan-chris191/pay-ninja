"use client";

import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useDashboardData } from "./dashboard-context";
import { StatusBadge } from "./status-badge";
import { fmt } from "./utils";
import type { Invoice } from "./types";

const MAX_RESULTS = 6;

export function HeaderSearch() {
  const { invoices, onView } = useDashboardData();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMac, setIsMac] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsMac(/Mac/.test(navigator.userAgent));
  }, []);

  // Cmd/Ctrl+K focuses the search box from anywhere on the page.
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Close the results dropdown on outside click.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const matches = query.trim()
    ? invoices.filter(inv =>
        inv.client.toLowerCase().includes(query.toLowerCase()) ||
        inv.id.toLowerCase().includes(query.toLowerCase())
      )
    : [];
  const visibleMatches = matches.slice(0, MAX_RESULTS);

  const reset = () => {
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
  };

  const selectInvoice = (inv: Invoice) => {
    onView(inv);
    reset();
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      reset();
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, visibleMatches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && visibleMatches[activeIndex]) {
      e.preventDefault();
      selectInvoice(visibleMatches[activeIndex]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIndex(0); }}
        onFocus={() => query && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search invoices or clients..."
        className="h-8 w-full rounded-md border bg-muted/40 pl-8 pr-12 text-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring"
      />
      {mounted && !query && (
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      )}

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border bg-card shadow-lg">
          {visibleMatches.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">No invoices found.</div>
          ) : (
            <>
              {visibleMatches.map((inv, i) => (
                <button
                  key={inv.id}
                  onClick={() => selectInvoice(inv)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs transition-colors ${i === activeIndex ? "bg-muted" : "hover:bg-muted/60"}`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-medium">{inv.client}</span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{inv.id}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-mono">{fmt(inv.rawAmount)}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                </button>
              ))}
              {matches.length > visibleMatches.length && (
                <Link
                  href="/dashboard/invoices"
                  onClick={reset}
                  className="block border-t px-3 py-2 text-center text-xs text-primary hover:underline"
                >
                  See all {matches.length} results in Invoices
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}