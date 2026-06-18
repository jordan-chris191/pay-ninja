import type { Invoice, Profile } from "./types";

export const fmt = (n: number) => `$${n.toLocaleString()}`;

export const mapInvoice = (row: any): Invoice => ({
  id: row.invoice_number,
  client: row.client_name,
  initials: row.client_initials || row.client_name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
  email: row.client_email || "",
  rawAmount: row.amount,
  status: row.status,
  date: new Date(row.invoice_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  dueDate: new Date(row.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  lineItems: row.line_items || [],
});

export const mapProfile = (row: any): Profile => ({
  id: row.id,
  fullName: row.full_name || "",
  email: row.email || "",
  businessName: row.business_name || "",
  invoicePrefix: row.invoice_prefix || "INV",
  paymentTerms: row.payment_terms ?? 30,
});