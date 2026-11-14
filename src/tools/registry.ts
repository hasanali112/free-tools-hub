/**
 * The list of every tool and category on the site.
 * Home page, category pages, search, related links and sitemap are all built from this file.
 * Only lightweight `meta.ts` files are imported here — never tool UI or processing libraries.
 */
import type { Category, CategorySlug, ToolMeta } from "./types";

import { meta as heicToJpg } from "./image/heic-to-jpg/meta";
import { meta as heicToPng } from "./image/heic-to-png/meta";
import { meta as compress } from "./image/compress/meta";
import { meta as resize } from "./image/resize/meta";
import { meta as pngToJpg } from "./image/png-to-jpg/meta";
import { meta as jpgToPng } from "./image/jpg-to-png/meta";
import { meta as webpToJpg } from "./image/webp-to-jpg/meta";
import { meta as removeMetadata } from "./image/remove-metadata/meta";

import { meta as jpgToPdf } from "./pdf/jpg-to-pdf/meta";
import { meta as mergePdf } from "./pdf/merge/meta";
import { meta as splitPdf } from "./pdf/split/meta";
import { meta as compressPdf } from "./pdf/compress/meta";
import { meta as pdfToJpg } from "./pdf/pdf-to-jpg/meta";

import { meta as paycheck } from "./calculator/paycheck/meta";
import { meta as hourlyToSalary } from "./calculator/hourly-to-salary/meta";
import { meta as mortgage } from "./calculator/mortgage/meta";
import { meta as tip } from "./calculator/tip/meta";
import { meta as overtime } from "./calculator/overtime/meta";

import { meta as movToMp4 } from "./video/mov-to-mp4/meta";
import { meta as videoCompress } from "./video/compress/meta";
import { meta as videoToGif } from "./video/to-gif/meta";

export const categories: Category[] = [
  {
    slug: "image",
    name: "Image Tools",
    title: "Free Image Tools — Convert, Compress & Resize Online",
    description:
      "Free online image tools: convert HEIC to JPG, compress to 100KB, resize for passports and social media, remove EXIF data. No upload — everything runs in your browser.",
  },
  {
    slug: "pdf",
    name: "PDF Tools",
    title: "Free PDF Tools — Merge, Split, Compress & Convert PDF",
    description:
      "Free online PDF tools: merge, split and compress PDFs, convert JPG to PDF and PDF to JPG. No upload — your documents never leave your device.",
  },
  {
    slug: "video",
    name: "Video Tools",
    title: "Free Video Tools — MOV to MP4, Compress Video, Video to GIF",
    description:
      "Free online video tools: convert MOV to MP4, compress videos to 25 MB or 720p, and turn clips into GIFs. Runs in your browser — no upload.",
  },
  {
    slug: "calculator",
    name: "Calculators",
    title: "Free Calculators — Paycheck, Salary, Mortgage, Tip & Overtime",
    description:
      "Free 2026 calculators for take-home pay in all 50 states, hourly to salary, overtime, mortgage payments and tips. Fast, simple and private.",
  },
];

export const tools: ToolMeta[] = [
  heicToJpg,
  heicToPng,
  compress,
  resize,
  pngToJpg,
  jpgToPng,
  webpToJpg,
  removeMetadata,

  jpgToPdf,
  mergePdf,
  splitPdf,
  compressPdf,
  pdfToJpg,

  paycheck,
  hourlyToSalary,
  mortgage,
  tip,
  overtime,

  movToMp4,
  videoCompress,
  videoToGif,
];

export function getTool(slug: string): ToolMeta {
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}

export function getCategory(slug: CategorySlug): Category {
  const category = categories.find((c) => c.slug === slug);
  if (!category) throw new Error(`Unknown category: ${slug}`);
  return category;
}

export function toolsIn(category: CategorySlug): ToolMeta[] {
  return tools.filter((t) => t.category === category);
}

/** Categories that have at least one tool (empty ones are hidden from nav and sitemap). */
export function activeCategories(): Category[] {
  return categories.filter((c) => toolsIn(c.slug).length > 0);
}

export function relatedTools(tool: ToolMeta): ToolMeta[] {
  const picked = tool.related.map(getTool);
  // Top up with tools from the same category so there are always 4 links.
  for (const t of toolsIn(tool.category)) {
    if (picked.length >= 4) break;
    if (t.slug !== tool.slug && !picked.includes(t)) picked.push(t);
  }
  return picked.slice(0, 4);
}
