import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Required for metadata routes with `output: "export"`.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return {
    name: `${site.name} — Free Online Tools`,
    short_name: site.name,
    description: site.description,
    start_url: `${base}/`,
    display: "standalone",
    background_color: "#f7f7fd",
    theme_color: "#5435cf",
    icons: [
      { src: `${base}/icon.svg`, sizes: "any", type: "image/svg+xml" },
      { src: `${base}/apple-icon`, sizes: "180x180", type: "image/png" },
    ],
  };
}
