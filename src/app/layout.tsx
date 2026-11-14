import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/layout/Analytics";
import { AdScripts } from "@/components/ads/AdScripts";
import { tools } from "@/tools/registry";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Free Online Image, PDF & Video Tools`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  verification: site.gscVerification ? { google: site.gscVerification } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

const noAdPaths = tools.filter((t) => t.ads === false).map((t) => t.path);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <AdScripts disabledPaths={noAdPaths} />
      </body>
    </html>
  );
}
