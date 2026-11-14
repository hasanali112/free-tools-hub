import type { Metadata } from "next";
import { ToolSearch, type SearchItem } from "@/components/ToolSearch";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/ToolIcon";
import { absoluteUrl, site } from "@/config/site";
import { activeCategories, getCategory, getTool, tools } from "@/tools/registry";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { title: site.name, description: site.description, url: "/", siteName: site.name, type: "website" },
};

const POPULAR = ["heic-to-jpg", "compress", "merge-pdf", "paycheck", "mov-to-mp4"];

const FEATURES = [
  { icon: "lock", title: "Private by design", text: "Files are processed on your device and never uploaded to any server." },
  { icon: "bolt", title: "Fast & no waiting", text: "No queues, no sign-up, no email. Open a tool and get your result in seconds." },
  { icon: "gift", title: "Free forever", text: "Every tool is free with no watermarks and no daily limits." },
  { icon: "phone", title: "Works on iPhone", text: "Designed for phones first — convert photos and PDFs right from your camera roll." },
];

function ShieldBadge() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 shrink-0">
      <defs>
        <linearGradient id="sb" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6d3cf0" />
          <stop offset="1" stopColor="#4a1fc8" />
        </linearGradient>
      </defs>
      <path
        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"
        fill="url(#sb)"
      />
      <path d="m8.8 12.2 2.2 2.2 4.3-4.6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Hand-drawn underline under "private". */
function Swoosh() {
  return (
    <svg aria-hidden viewBox="0 0 300 24" preserveAspectRatio="none" className="absolute -bottom-1 left-[4%] h-3 w-[92%] sm:h-4">
      <defs>
        <linearGradient id="sw" x1="0" x2="1">
          <stop stopColor="#5b21d6" />
          <stop offset=".6" stopColor="#4338e8" />
          <stop offset="1" stopColor="#2f7bff" stopOpacity=".5" />
        </linearGradient>
      </defs>
      <path d="M4 16C70 8 150 4 296 10" fill="none" stroke="url(#sw)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  // Only pass the small fields the search needs to the client.
  const items: SearchItem[] = tools.map((t) => ({
    slug: t.slug,
    path: t.path,
    name: t.name,
    summary: t.summary,
    category: t.category,
    categoryName: getCategory(t.category).name,
    terms: [t.name, t.summary, t.category, ...t.keywords].join(" ").toLowerCase(),
  }));
  const categories = activeCategories().map((c) => ({ slug: c.slug, name: c.name, description: c.description }));

  return (
    <div>
      <ToolSearch
        items={items}
        categories={categories}
        popular={POPULAR.map((s) => ({ name: getTool(s).name, path: getTool(s).path }))}
        hero={
          <>
            <p className="inline-flex items-center gap-3 rounded-full border border-brand-200/80 bg-white/90 py-2 pr-2.5 pl-4 text-xs font-semibold text-ink shadow-[0_8px_24px_-12px_rgba(60,40,170,0.35)] sm:text-[0.95rem]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
              100% free · No sign-up · Files stay on your device
              <ShieldBadge />
            </p>
            <h1 className="mt-7 text-[2.1rem] leading-[1.12] font-extrabold tracking-[-0.025em] text-ink sm:text-5xl lg:text-[3.4rem]">
              Every tool you need, <span className="text-azure-500">free &amp;</span>{" "}
              <span className="relative inline-block pb-2">
                <span className="text-brand-gradient">private</span>
                <Swoosh />
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 font-medium text-slate-600 sm:text-lg sm:leading-8">
              Convert and compress images, PDFs and videos, or work out your take-home pay and mortgage — in seconds,
              right in your browser.
            </p>
            <dl className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-y-4 md:flex-nowrap md:divide-x md:divide-slate-300">
              {(
                [
                  ["wrench", String(tools.length), "free tools"],
                  ["cloudUpload", "0", "file uploads"],
                  ["shieldCheck", "51", "state paycheck calculators"],
                ] as const
              ).map(([icon, n, label]) => (
                <div key={label} className="flex shrink-0 items-center gap-2.5 px-4 md:px-7">
                  <Icon name={icon} className="h-6 w-6 text-brand-600 sm:h-7 sm:w-7" strokeWidth={2} />
                  <dt className="text-2xl font-bold text-azure-600 sm:text-[1.75rem]">{n}</dt>
                  <dd className="self-end pb-0.5 text-sm font-medium text-slate-700 sm:pb-1 sm:text-base">{label}</dd>
                </div>
              ))}
            </dl>
          </>
        }
      />

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="surface px-6 py-12 sm:px-12">
          <p className="text-center text-sm font-semibold tracking-wide text-brand-600 uppercase">Why {site.name}</p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Simple, private tools <span className="text-brand-gradient">people trust</span>
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-100 bg-gradient-to-b from-brand-50/60 to-white p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/10">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-brand-600/30">
                  <Icon name={f.icon} />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: absoluteUrl("/") }} />
    </div>
  );
}
