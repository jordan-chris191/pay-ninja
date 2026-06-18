"use client";

import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

interface NavbarProps {
  onLogin?: () => void;
  onRegister?: () => void;
}



export function Navbar({ onLogin, onRegister }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="sticky top-0 z-50 h-14 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3 translate-y-1">
          {/* Icon only SVG */}
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

          {/* Text using normal HTML/Tailwind fonts */}
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#081226] dark:text-white">Pay</span>
            <span className="bg-gradient-to-br from-[#4F46E5] to-[#2563EB] bg-clip-text text-transparent">Ninja</span>
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <div className="h-4 w-4" /> /* placeholder to avoid layout shift */
            )}
          </button>
          
          <Button variant="ghost" size="sm" onClick={onLogin} className="hidden text-sm sm:flex">
            Sign in
          </Button>
          <Button size="sm" onClick={onRegister} className="hidden text-sm sm:flex">
            Get started
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-6 pt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-col gap-3 pt-4">
                  <Button variant="outline" onClick={onLogin}>Sign in</Button>
                  <Button onClick={onRegister}>Get started</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}