// context/auth-dialog-context.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { AuthDialog } from "@/components/auth/auth-dialog";

interface AuthDialogContextType {
  openAuth: (mode: "login" | "register") => void;
  closeAuth: () => void;
}

const AuthDialogContext = createContext<AuthDialogContextType | null>(null);

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"login" | "register" | null>(null);

  return (
    <AuthDialogContext.Provider value={{ openAuth: setMode, closeAuth: () => setMode(null) }}>
      {children}
      <AuthDialog
        mode={mode}
        onClose={() => setMode(null)}
        onSwitchMode={(m) => setMode(m)}
      />
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog() {
  const ctx = useContext(AuthDialogContext);
  if (!ctx) throw new Error("useAuthDialog must be used within AuthDialogProvider");
  return ctx;
}