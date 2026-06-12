import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { Providers } from "@/components/providers";
import { SiteChrome } from "@/components/layout/site-chrome";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.role.pt}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description.pt,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={fontVariables}>
      <body className="bg-abyss font-body text-bone min-h-dvh antialiased">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
