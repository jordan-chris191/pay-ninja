"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthDialog } from "@/context/auth-dialog-context";

export function FinalCTA() {
  const { openAuth } = useAuthDialog();

  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            Start free today.
          </h2>
          <p className="mb-8 text-muted-foreground">No card required. Takes 2 minutes.</p>
          <Button size="lg" onClick={() => openAuth("register")} className="gap-2">
            Get started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}