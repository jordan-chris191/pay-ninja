import { FaGithub, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* PayNinja Logo */}
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
                <rect x="10" y="10" width="80" height="80" rx="20" fill="#081226" />
                <path d="M20 45 L5 35 L15 50 L5 60 L20 55" fill="url(#footerGradient)" />
                <circle cx="50" cy="50" r="28" fill="#0F172A" />
                <path d="M30 48C35 42 65 42 70 48L66 58C55 62 45 62 34 58L30 48Z" fill="white" />
                <path d="M38 49 L48 52 L42 55 Z" fill="#111827" />
                <path d="M62 49 L52 52 L58 55 Z" fill="#111827" />
                <path d="M15 85 C30 70,50 62,90 45" stroke="url(#footerGradient)" strokeWidth="8" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-semibold">PayNinja</span>
            </div>
            <p className="text-xs text-muted-foreground">Invoicing for independent freelancers.</p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              <FaGithub className="h-4 w-4" />
            </a>
            <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              <FaTwitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-xs text-muted-foreground">© 2026 PayNinja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}