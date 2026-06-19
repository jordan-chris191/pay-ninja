import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { AuthDialogProvider } from "@/context/auth-dialog-context";
import { Providers } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

// Proper next/font setup
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});



export const metadata: Metadata = {
  title: "PayNinja — Invoicing for Freelancers",
  description: "Create professional invoices with built-in payment links",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${dmSans.className} min-h-full flex flex-col`}>
        <Providers>
          <AuthDialogProvider>{children}</AuthDialogProvider>
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
