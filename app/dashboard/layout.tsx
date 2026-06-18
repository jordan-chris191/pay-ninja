"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";

import type { Invoice, Profile } from "@/components/dashboard/types";
import { mapInvoice, mapProfile } from "@/components/dashboard/utils";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { NewInvoiceDialog } from "@/components/dashboard/new-invoice-dialog";
import { ViewInvoiceDialog } from "@/components/dashboard/view-invoice-dialog";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [user, setUser] = useState<any>(null);

  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load invoices + profile from Supabase
  useEffect(() => {
    const loadData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/");
        return;
      }
      setUser(authUser);

      const [invoicesRes, profileRes] = await Promise.all([
        supabase
          .from("invoices")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle(),
      ]);

      if (invoicesRes.error) {
        toast.error("Failed to load invoices");
        console.error(invoicesRes.error);
      } else {
        setInvoices(invoicesRes.data?.map(mapInvoice) || []);
      }

      if (profileRes.error) {
        toast.error("Failed to load settings");
        console.error(profileRes.error);
      }

      // Fall back to sensible defaults if the row doesn't exist yet —
      // it'll be created on first save via upsert.
      setProfile(
        profileRes.data
          ? mapProfile(profileRes.data)
          : {
              id: authUser.id,
              fullName: authUser.user_metadata?.full_name || "",
              email: authUser.email || "",
              businessName: "",
              invoicePrefix: "INV",
              paymentTerms: 30,
            }
      );

      setLoading(false);
    };

    loadData();
  }, [router, supabase]);

  const refreshInvoices = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setInvoices(data?.map(mapInvoice) || []);
  };

  const handleSaveInvoice = async (inv: Invoice) => {
    if (!user) return;

    // Generate next invoice number
    const { data: lastInv } = await supabase
      .from("invoices")
      .select("invoice_number")
      .order("created_at", { ascending: false })
      .limit(1);

    let invoiceNumber = "INV-001";
    if (lastInv && lastInv.length > 0) {
      const last = lastInv[0].invoice_number;
      const num = parseInt(last.replace("INV-", "")) || 0;
      invoiceNumber = `INV-${String(num + 1).padStart(3, "0")}`;
    }

    const { error } = await supabase.from("invoices").insert({
      user_id: user.id,
      invoice_number: invoiceNumber,
      client_name: inv.client,
      client_email: inv.email,
      client_initials: inv.initials,
      amount: inv.rawAmount,
      status: inv.status,
      invoice_date: new Date(inv.date).toISOString(),
      due_date: new Date(inv.dueDate).toISOString(),
      line_items: inv.lineItems,
    });

    if (error) {
      toast.error("Failed to create invoice");
      return;
    }

    await refreshInvoices();
    setShowNew(false);
    toast.success(`Invoice ${invoiceNumber} created for ${inv.client}`);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("invoice_number", id);

    if (error) {
      toast.error("Failed to delete invoice");
      return;
    }

    setInvoices(prev => prev.filter(i => i.id !== id));
    toast.success("Invoice deleted");
  };

  const handleMarkPaid = async (id: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({ status: "paid" })
      .eq("invoice_number", id);

    if (error) {
      toast.error("Failed to update invoice");
      return;
    }

    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: "paid" } : i));
    toast.success("Marked as paid");
  };

  const handleSaveProfile = async (updates: Omit<Profile, "id">) => {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: updates.fullName,
      email: updates.email,
      business_name: updates.businessName,
      invoice_prefix: updates.invoicePrefix,
      payment_terms: updates.paymentTerms,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error("Failed to save settings");
      console.error(error);
      return;
    }

    setProfile({ id: user.id, ...updates });
    toast.success("Settings saved");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  const userInitials = user?.email?.split("@")[0]?.slice(0, 2).toUpperCase() || "U";
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/40">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // profile is always set by the time loading flips false (see effect above);
  // this guard just satisfies the type checker.
  if (!profile) return null;

  return (
    <DashboardProvider
      value={{
        invoices,
        onDelete: handleDelete,
        onMarkPaid: handleMarkPaid,
        onView: setViewInvoice,
        onNewInvoice: () => setShowNew(true),
        profile,
        onSaveProfile: handleSaveProfile,
      }}
    >
      <div className="flex h-screen bg-muted/40">
        <Sidebar
          invoiceCount={invoices.length}
          userInitials={userInitials}
          userName={userName}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
          onSignOut={handleSignOut}
        />

        <main className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            dateLabel="June 2026"
            isDark={isDark}
            mounted={mounted}
            onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
            onNewInvoice={() => setShowNew(true)}
          />

          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>

        <NewInvoiceDialog open={showNew} onClose={() => setShowNew(false)} onSave={handleSaveInvoice} />
        <ViewInvoiceDialog invoice={viewInvoice} onClose={() => setViewInvoice(null)} />
      </div>
    </DashboardProvider>
  );
}