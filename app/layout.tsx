import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { AuthDialogProvider } from "@/context/auth-dialog-context";
import { Providers } from "./providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PayNinja — Invoicing for Freelancers",
  description: "Create professional invoices with built-in payment links",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${dmSans.className} min-h-full flex flex-col`}>
        <Providers>
          <AuthDialogProvider>{children}</AuthDialogProvider>
        </Providers>
      </body>
    </html>
  );
}