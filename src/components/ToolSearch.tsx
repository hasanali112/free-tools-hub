"use client";

import Link from "next/link";
import { useState } from "react";
import { ToolCard } from "./ToolCard";

export interface SearchItem {
  path: string;
  name: string;
  summary: string;
  category: string;
  categoryName: string;
  terms: string;
}

/** Home page search: filters the tool grid as you type. */
export function ToolSearch({ items, categories }: { items: SearchItem[]; categories: { slug: string; name: string }[] }) {
  const [q, setQ] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const match = (it: SearchItem) => words.every((w) => it.terms.includes(w));
  const results = words.length ? items.filter(match) : items;

  return (
    <div>
      <label htmlFor="tool-search" className="sr-only">
        Search tools
      </label>
      <div className="relative mx-auto max-w-xl">
        <svg aria-hidden className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
        </svg>
        <input
          id="tool-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tools — e.g. HEIC, compress, passport"
          autoComplete="off"
          className="h-14 w-full rounded-2xl border border-slate-300 bg-white pr-4 pl-12 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {categories.map((c) => {
        const list = results.filter((r) => r.category === c.slug);
        if (!list.length) return null;
        return (
          <section key={c.slug} className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">
              <Link href={`/${c.slug}`} className="hover:text-blue-700">
                {c.name}
              </Link>
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((t) => (
                <ToolCard key={t.path} tool={t} />
              ))}
            </div>
          </section>
        );
      })}
      {words.length > 0 && results.length === 0 && (
        <p className="mt-10 text-center text-slate-600">No tools match “{q}”. More tools are coming soon.</p>
      )}
    </div>
  );
}
