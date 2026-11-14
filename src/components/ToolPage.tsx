import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
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
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: category.name, path: `/${category.slug}` },
          ...(parent ? [parent] : []),
          { name: tool.name, path: tool.path },
        ]}
      />

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{tool.h1}</h1>
      <p className="mt-2 text-base text-slate-600 sm:text-lg">{tool.summary}</p>

      <section aria-label={tool.name} className="mt-6">
        {children}
      </section>

      <AdSlot name="below-tool" path={tool.path} enabled={showAds} />

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">How to use the {tool.name} tool</h2>
        <ol className="mt-4 space-y-3">
          {tool.howTo.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {i + 1}
              </span>
              <p className="pt-0.5 leading-7 text-slate-700">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {extra}

      <AdSlot name="in-content" path={tool.path} enabled={showAds} />

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {tool.faqs.map((f) => (
            <details key={f.q} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                <h3>{f.q}</h3>
                <span aria-hidden className="text-slate-400 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 leading-7 text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Related tools</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {relatedTools(tool).map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      <JsonLd data={[webApplicationLd(tool), faqLd(tool.faqs)]} />
    </div>
  );
}
