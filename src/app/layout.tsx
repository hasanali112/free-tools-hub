import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { Analytics, GtmNoScript } from "@/components/layout/Analytics";
import { AdScripts } from "@/components/ads/AdScripts";
import { tools } from "@/tools/registry";

// Self-hosted at build time by next/font: no request to Google when visitors load the page.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Free Online Image, PDF & Video Tools`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  category: "technology",
  creator: site.name,
  publisher: site.name,
  verification: site.gscVerification ? { google: site.gscVerification } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5435cf",
};

const noAdPaths = tools.filter((t) => t.ads === false).map((t) => t.path);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="relative isolate flex min-h-full flex-col font-sans">
        <GtmNoScript />
        {/* Same soft blue/violet waves at the top of every page */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px]">
          <HeroBackground />
        </div>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <AdScripts disabledPaths={noAdPaths} />
      </body>
    </html>
  );
}
