export interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

export interface Invoice {
  id: string;
  client: string;
  initials: string;
  email: string;
  rawAmount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
  lineItems: LineItem[];
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  businessName: string;
  invoicePrefix: string;
  paymentTerms: number;
}