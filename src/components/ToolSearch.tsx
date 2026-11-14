"use client";

import Link from "next/link";
import { useState } from "react";
import { ToolCard } from "./ToolCard";
import { Icon } from "./ToolIcon";

export interface SearchItem {
  slug: string;
  path: string;
  name: string;
  summary: string;
  category: string;
  categoryName: string;
  terms: string;
}

/** Home page: hero search box + tool grid grouped by category, filtered as you type. */
export function ToolSearch({
  items,
  categories,
  hero,
  popular,
}: {
  items: SearchItem[];
  categories: { slug: string; name: string; description: string }[];
  hero: React.ReactNode;
  popular: { name: string; path: string }[];
}) {
  const [q, setQ] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = words.length ? items.filter((it) => words.every((w) => it.terms.includes(w))) : items;

  return (
    <>
      <section className="relative overflow-hidden border-b border-brand-100/60">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(124,58,237,0.16),transparent),radial-gradient(30rem_20rem_at_90%_20%,rgba(34,211,238,0.12),transparent)]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(101,69,234,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(101,69,234,0.07)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto max-w-4xl px-4 pt-14 pb-14 text-center sm:pt-20 sm:pb-20">
          {hero}
          <div className="relative mx-auto mt-8 max-w-2xl">
            <label htmlFor="tool-search" className="sr-only">
              Search tools
            </label>
            <svg aria-hidden className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
            </svg>
            <input
              id="tool-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools — HEIC, compress, merge PDF, paycheck…"
              autoComplete="off"
              className="h-16 w-full rounded-2xl border border-slate-200 bg-white pr-5 pl-13 text-base text-ink shadow-xl shadow-brand-900/10 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-500">Popular:</span>
            {popular.map((p) => (
              <Link
                key={p.path}
                href={p.path}
                className="rounded-full border border-brand-100 bg-white/80 px-3 py-1 font-medium text-brand-700 transition hover:border-brand-300 hover:bg-brand-50"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {categories.map((c) => {
          const list = results.filter((r) => r.category === c.slug);
          if (!list.length) return null;
          return (
            <section key={c.slug} className="mt-14">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-brand-600/25">
                    <Icon name={c.slug} />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-ink sm:text-2xl">{c.name}</h2>
                    <p className="text-sm text-slate-500">{list.length} free tools</p>
                  </div>
                </div>
                <Link href={`/${c.slug}`} className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900 sm:inline-flex">
                  View all <Icon name="arrow" className="h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((t) => (
                  <ToolCard key={t.path} tool={t} />
                ))}
              </div>
            </section>
          );
        })}
        {words.length > 0 && results.length === 0 && (
          <p className="mt-14 rounded-2xl border border-dashed border-brand-200 bg-white p-8 text-center text-slate-600">
            No tools match “{q}” yet — more tools are coming soon.
          </p>
        )}
      </div>
    </>
  );
}
