# AIToolkitFree

Free browser-based tools (images now; PDF, calculators and video next). All file processing happens in the
user's browser — nothing is uploaded. Built with Next.js (App Router, static export) + Tailwind, hosted on
Cloudflare Pages.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
npm run lint
```

Copy `.env.example` to `.env.local` and fill in the site URL, GA4 ID, Search Console code and Adsterra codes.
Empty values simply switch that feature off.

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `out`
- Add the same `NEXT_PUBLIC_*` variables in Pages → Settings → Environment variables.
- `public/_headers` sets caching and the content type for Open Graph images.

## Project layout

```
src/
  app/                     routes (one folder per page)
    image/<tool>/page.tsx  tool page (tiny: metadata + <ToolPage> + <Tool/>)
    image/<tool>/opengraph-image.tsx
  tools/
    registry.ts            list of all tools + categories (drives home, search, nav, sitemap, related links)
    types.ts
    image/_shared/         decode/encode helpers, generic ConvertTool
    pdf/_shared/           open PDFs (pdf-lib / pdf.js), page-range parsing, page rendering
    video/_shared/         ffmpeg.wasm loader + job runner (runFFmpeg)
    calculator/paycheck/   tax engine (engine.ts), state page text (state-meta.ts)
  data/tax-2026.json       ALL tax numbers for the paycheck calculator (federal + 50 states + DC)
    image/<tool>/
      meta.ts              SEO text, how-to steps, FAQ, related tools  (no heavy imports!)
      Tool.tsx             the tool UI (client component)
      process.ts           the processing logic (loads libraries with dynamic import)
  components/
    file-tool/FileTool.tsx drag & drop, batch, progress, before/after size, ZIP download
                           (per-file `process`, or `combine` for many-files-into-one with reordering)
    ToolPage.tsx           standard tool page layout + JSON-LD (WebApplication, FAQPage)
    ads/AdSlot.tsx         the single place ads are rendered
  config/
    site.ts                site name, URL, contact email
    ads.ts                 ad network switch, ad codes, pages without ads
  lib/analytics.ts         GA4 events: tool_used, file_converted, download_clicked
```

## How to add a new tool

1. **Create the folder** `src/tools/<category>/<slug>/` with:
   - `meta.ts`: copy one from an existing tool and edit the slug, path, title, description, H1, the 3 how-to
     steps, 4–6 FAQs and related tool slugs.
   - `process.ts`: a function `(file, onProgress) => Promise<{ blob, name, note? }>` (return an array for
     several outputs, like Split PDF), or `(files, onProgress) => Promise<{...}>` passed as `combine` when many
     files become one (like Merge PDF). Load big libraries
     **inside** the function with `await import("library")` so they only download when someone uses the tool.
   - `Tool.tsx`: a `"use client"` component that renders `<FileTool>` with your options and `process` function.
     (For a simple format conversion you can just render `<ConvertTool>`; see `png-to-jpg/Tool.tsx`.)
2. **Register it** in `src/tools/registry.ts` (import the `meta` and add it to `tools`).
3. **Add the route**: copy `src/app/image/png-to-jpg/` to `src/app/<category>/<slug>/` and change the slug
   string in `page.tsx` and `opengraph-image.tsx`.
4. For a **new category**, also add `src/app/<category>/page.tsx` (copy `src/app/image/page.tsx`). The category
   is hidden from nav and sitemap until it has at least one tool.
5. Run `npm run build`. The home page, search, category page, footer, related links and `sitemap.xml` update
   automatically.

## Calculators (no files)

Calculator tools follow the same folder pattern but render `CalcCard`, `NumField`, `SelectField`,
`BigResult` and `ResultTable` from `src/components/calc/inputs.tsx` instead of `FileTool`. Call the function
from `useToolUsed("<slug>")` on the first input change so GA4 gets a `tool_used` event.

### Updating paycheck tax data each year

All numbers live in `src/data/tax-<year>.json`:

1. Copy `tax-2026.json` to `tax-2027.json` and update it: federal brackets, standard deduction and child tax credit
   (IRS Rev. Proc., usually published in October), the Social Security wage base (SSA, October) and the 401(k)
   limit (IRS, November); state brackets, deductions and exemptions (Tax Foundation's yearly state table, published
   around February); state SDI / paid-leave payroll rates (each state's labor department, usually December).
2. Change the import in `src/tools/calculator/paycheck/tax-data.ts`.
3. Run `npm run build`. All 51 state pages (`/calculator/paycheck/<state>`) and the sitemap regenerate.

State fields: `brackets` (`null` = no wage tax), `standardDeduction`, `personalExemption`, `personalCredit`,
`dependentExemption` / `dependentCredit`, `payroll` (employee payroll taxes with `rate`, `wageBase` or
`maxAmount`), `localNote` and `defaultLocalRate`. The engine (`engine.ts`) uses single-filer state rules for
head of household. It doesn't model every state credit or phase-out, so results are labelled as estimates.

## Video tools

- They use **ffmpeg.wasm** (single-threaded core, so the site doesn't need COOP/COEP headers that would break ads).
- `scripts/copy-vendor.mjs` copies the ffmpeg ES modules to `/vendor/ffmpeg/` and splits the 32 MB core `.wasm`
  into two parts, because **Cloudflare Pages rejects files over 25 MiB**. The browser downloads the parts with a
  progress bar and joins them. This happens once, then the browser cache keeps them.
- The FFmpeg class is loaded at runtime from `/vendor/ffmpeg/index.js` (not bundled), because Turbopack can't
  bundle its `new Worker(new URL(...))` call.
- To add a video tool: write a `process.ts` that calls `runFFmpeg(file, "out.ext", ({ input, info }) => [...args, "out.ext"], onProgress)`.

## Brand

- Name, URL and contact email: `src/config/site.ts`.
- Logo: `src/components/brand/` (one shared geometry file feeds the header logo, `src/app/icon.svg` favicon,
  the Apple touch icon and the Open Graph images). `public/logo.svg` is a standalone copy.
- Colors: `brand-*` (indigo → violet, from the logo gradient) and `accent-*` (cyan) in `src/app/globals.css`,
  plus `bg-brand-gradient`, `text-brand-gradient`, `btn-primary`, `btn-secondary` and `btn-ghost` utilities.
- Font: Poppins via `next/font` (self-hosted at build time).

## Ads

- Set `network` in `src/config/ads.ts` (`"adsterra"`, `"adsense"` or `"none"`).
- Native Banner slots: `below-tool` and `in-content` (Adsterra needs one unit per slot). Social Bar loads site-wide.
- Ad scripts load only after the page has loaded and the browser is idle; slots never overlap the tool.
- Turn ads off for one tool with `ads: false` in its `meta.ts`, or for any path via `disabledPaths`.
- To switch to AdSense later, add an AdSense branch in `components/ads/AdSlot.tsx`. No page needs changing.

## Notes

- `cacheComponents` is disabled in `next.config.ts`. It doesn't work with `output: "export"` metadata image
  routes, and it adds nothing to a fully static site.
- `browser-image-compression` runs in a Web Worker that loads its script from `/vendor/` (copied by
  `scripts/copy-vendor.mjs` before dev/build), so no code is fetched from a CDN at runtime.
- PDF rendering uses the pdf.js **legacy** build (works on older iPhones). Its worker, fonts, CMaps and wasm
  decoders are also copied to `/vendor/pdfjs/` by the same script.
- "Compress PDF": *Light* re-saves losslessly (text stays selectable); *Recommended*/*Strong* turn pages into
  150/100 DPI JPEGs (big savings for scans, but text is no longer selectable). If the result isn't smaller, the
  original is kept.
- iOS Safari limits a canvas to about 16.7 megapixels; very large photos are scaled down to fit, and the result
  shows a note when that happens.
