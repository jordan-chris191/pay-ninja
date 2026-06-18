import type { Metadata } from "next";
import { AuthDialogProvider } from "@/context/auth-dialog-context";
import { Providers } from "./providers";
import "./globals.css";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PayNinja — Invoicing for Freelancers",
  description: "Create professional invoices with built-in payment links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
           <AuthDialogProvider>{children}</AuthDialogProvider>
        </Providers>
      </body>
    </html>
  );
}