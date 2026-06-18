"use client"; // required for useState

import { useState } from "react";
import { Navbar } from "@/components/homepage/navbar";
import { Footer } from "@/components/homepage/footer";

import { AuthDialog } from "@/components/auth/auth-dialog";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);

  return (
    
    <div className="flex min-h-screen flex-col">
      <Navbar
        onLogin={() => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
      />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthDialog
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
    </div>
    
  );
}