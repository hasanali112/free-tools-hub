import type { Metadata } from "next";
import { absoluteUrl, site } from "@/config/site";
import type { Faq, ToolMeta } from "@/tools/types";

/** Metadata for any page: unique title/description, canonical URL and Open Graph tags. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: site.name, type: "website", locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function toolMetadata(tool: ToolMeta): Metadata {
  return pageMetadata({ title: tool.title, description: tool.description, path: tool.path });
}

export function webApplicationLd(tool: ToolMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: absoluteUrl(tool.path),
    description: tool.description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (runs in the browser)",
    browserRequirements: "Requires JavaScript and a modern web browser",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function faqLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}
