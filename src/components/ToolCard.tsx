import Link from "next/link";
import type { ToolMeta } from "@/tools/types";
import { Icon } from "./ToolIcon";

/** "heic-to-jpg" → ["HEIC", "JPG"] for file converters; null for other tools. */
function formats(slug: string) {
  const m = slug.match(/^([a-z0-9]+)-to-([a-z0-9]+)$/);
  return m && slug !== "hourly-to-salary" ? [m[1].toUpperCase(), m[2].toUpperCase()] : null;
}

export function ToolCard({ tool }: { tool: Pick<ToolMeta, "slug" | "path" | "name" | "summary"> }) {
  const fmt = formats(tool.slug);
  return (
    <Link
      href={tool.path}
      className="group relative flex h-full flex-col rounded-2xl border border-white bg-white/90 p-5 shadow-[0_10px_30px_-18px_rgba(60,40,170,0.35)] ring-1 ring-brand-100/60 transition duration-200 hover:-translate-y-1 hover:ring-brand-200 hover:shadow-[0_22px_45px_-18px_rgba(60,40,170,0.4)] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition duration-200 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-600/30 group-hover:ring-transparent">
        {fmt ? (
          <span className="flex flex-col items-center leading-none">
            <span className="text-[9px] font-semibold tracking-wide opacity-60">{fmt[0]}</span>
            <span className="mt-0.5 text-[13px] font-bold tracking-tight">{fmt[1]}</span>
          </span>
        ) : (
          <Icon name={tool.slug} />
        )}
      </span>
      <span className="mt-4 text-base font-semibold text-ink">{tool.name}</span>
      <span className="mt-1 flex-1 text-sm leading-6 text-slate-500">{tool.summary}</span>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
        Open tool
        <Icon name="arrow" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
      </span>
    </Link>
  );
}
