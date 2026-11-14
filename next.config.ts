import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to /out for Cloudflare Pages.
  output: "export",
  images: { unoptimized: true },
  // Sub-folder hosting (GitHub Pages project site). Leave NEXT_PUBLIC_BASE_PATH empty on a custom domain.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  experimental: {
    agentFeedback: true,
  },
  // cacheComponents/partialPrefetching are off: they target server rendering and are incompatible with
  // `output: "export"` metadata image routes (opengraph-image needs `dynamic = "force-static"`).
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
