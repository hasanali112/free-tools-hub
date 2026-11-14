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
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-accent-400 shadow-[0_0_0_4px_rgba(34,211,238,0.2)]" />
              100% free · No sign-up · Files stay on your device
            </p>
            <h1 className="mt-6 text-4xl leading-[1.1] font-bold tracking-tight text-ink sm:text-6xl">
              Every tool you need, <span className="text-brand-gradient">free &amp; private</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Convert and compress images, PDFs and videos, or work out your take-home pay and mortgage — in seconds,
              right in your browser.
            </p>
            <dl className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
              {[
                [String(tools.length), "free tools"],
                ["0", "file uploads"],
                ["51", "state paycheck calculators"],
              ].map(([n, label]) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <dt className="text-2xl font-bold text-brand-gradient">{n}</dt>
                  <dd className="text-slate-600">{label}</dd>
                </div>
              ))}
            </dl>
          </>
        }
      />

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="rounded-3xl bg-brand-950 px-6 py-12 text-white sm:px-12">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">
            Why people choose <span className="text-accent-300">{site.name}</span>
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-black/20">
                  <Icon name={f.icon} />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-brand-200/80">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: absoluteUrl("/") }} />
    </div>
  );
}
