import type { Metadata } from "next";
import { ToolSearch, type SearchItem } from "@/components/ToolSearch";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, site } from "@/config/site";
import { activeCategories, getCategory, tools } from "@/tools/registry";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { title: site.name, description: site.description, url: "/", siteName: site.name, type: "website" },
};

export default function Home() {
  // Only pass the small fields the search needs to the client.
  const items: SearchItem[] = tools.map((t) => ({
    path: t.path,
    name: t.name,
    summary: t.summary,
    category: t.category,
    categoryName: getCategory(t.category).name,
    terms: [t.name, t.summary, t.category, ...t.keywords].join(" ").toLowerCase(),
  }));
  const categories = activeCategories().map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Free Online Tools That Respect Your Privacy</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Convert and compress images, PDFs and videos, and work out your take-home pay, mortgage and more — in seconds. No sign-up, no watermarks — and your files never leave your
          device, because everything runs right in your browser.
        </p>
      </div>
      <div className="mt-8">
        <ToolSearch items={items} categories={categories} />
      </div>
      <JsonLd
        data={{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: absoluteUrl("/") }}
      />
    </div>
  );
}
