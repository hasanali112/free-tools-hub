import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { Icon } from "@/components/ToolIcon";
import { faqLd, webApplicationLd } from "@/lib/seo";
import { getCategory, getTool, relatedTools } from "@/tools/registry";
import type { ToolMeta } from "@/tools/types";

/**
 * Standard layout for every tool page:
 * H1 → tool → ad → how to use → ad → FAQ (with schema) → related tools.
 */
export function ToolPage({
  slug,
  meta,
  parent,
  extra,
  children,
}: {
  /** Registry slug of the tool… */
  slug?: string;
  /** …or a generated meta object (e.g. per-state paycheck pages). */
  meta?: ToolMeta;
  /** Extra breadcrumb between the category and this page. */
  parent?: { name: string; path: string };
  /** Extra content shown after "How to use" (e.g. state tax details). */
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  const tool = meta ?? getTool(slug!);
  const category = getCategory(tool.category);
  const showAds = tool.ads !== false;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: category.name, path: `/${category.slug}` },
          ...(parent ? [parent] : []),
          { name: tool.name, path: tool.path },
        ]}
      />

      <div className="mt-5 flex items-start gap-4">
        <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-brand-600/30 sm:flex">
          <Icon name={tool.slug.startsWith("paycheck") ? "paycheck" : tool.slug} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-ink sm:text-[2.4rem]">{tool.h1}</h1>
          <p className="mt-2 text-base font-medium text-slate-600 sm:text-lg">{tool.summary}</p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-brand-800">
        {[
          ["gift", "100% free"],
          ["lock", tool.category === "calculator" ? "Nothing is saved" : "No upload — private"],
          ["bolt", "No sign-up"],
        ].map(([icon, label]) => (
          <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white bg-white/90 px-3 py-1 text-brand-700 shadow-[0_6px_20px_-8px_rgba(60,40,170,0.25)]">
            <Icon name={icon} className="h-3.5 w-3.5" strokeWidth={2.2} />
            {label}
          </li>
        ))}
      </ul>

      <section aria-label={tool.name} className="mt-6">
        {children}
      </section>

      <AdSlot name="below-tool" path={tool.path} enabled={showAds} />

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">How to use the {tool.name} tool</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {tool.howTo.map((step, i) => (
            <li key={i} className="rounded-2xl border border-white bg-white/90 p-5 shadow-[0_12px_36px_-18px_rgba(60,40,170,0.3)] ring-1 ring-brand-100/60">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white shadow-md shadow-brand-600/25">
                {i + 1}
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {extra}

      <AdSlot name="in-content" path={tool.path} enabled={showAds} />

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Frequently asked questions</h2>
        <div className="mt-5 space-y-3">
          {tool.faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-white bg-white/90 px-5 py-4 shadow-[0_10px_30px_-18px_rgba(60,40,170,0.3)] ring-1 ring-brand-100/60 transition open:ring-brand-200">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                <h3>{f.q}</h3>
                <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg leading-none text-brand-700 transition group-open:rotate-45 group-open:bg-brand-gradient group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Related tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {relatedTools(tool).map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      <JsonLd data={[webApplicationLd(tool), faqLd(tool.faqs)]} />
    </div>
  );
}
