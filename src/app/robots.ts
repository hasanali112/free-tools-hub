import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

// Required for metadata routes with `output: "export"`.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
