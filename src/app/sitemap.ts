import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { activeCategories, tools } from "@/tools/registry";
import { stateList } from "@/tools/calculator/paycheck/tax-data";

// Required for metadata routes with `output: "export"`.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(); // build time — the site is rebuilt on every deploy
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    ...activeCategories().map((c) => ({ url: absoluteUrl(`/${c.slug}`), lastModified, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...tools.map((t) => ({ url: absoluteUrl(t.path), lastModified, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...stateList.map((s) => ({
      url: absoluteUrl(`/calculator/paycheck/${s.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...["/about", "/contact", "/privacy", "/terms"].map((p) => ({ url: absoluteUrl(p), changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
