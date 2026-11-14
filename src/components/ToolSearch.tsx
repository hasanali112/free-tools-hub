"use client";

import Link from "next/link";
import { useState } from "react";
import { ToolCard } from "./ToolCard";
import { Icon } from "./ToolIcon";
import { HeroBackground } from "./HeroBackground";

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
      {/* -mt/pt: the hero background runs under the floating header */}
      <section className="relative -mt-[80px] overflow-hidden pt-[80px]">
        <HeroBackground />
        <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-16 text-center sm:pt-16 sm:pb-24">
          {hero}
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="relative mx-auto mt-10 flex h-16 max-w-[58rem] items-center rounded-full border border-white bg-white pr-1.5 pl-5 shadow-[0_18px_50px_-15px_rgba(60,40,170,0.28)] ring-1 ring-brand-100/60 focus-within:ring-4 focus-within:ring-brand-100 sm:h-[4.5rem] sm:pr-2 sm:pl-7"
          >
            <label htmlFor="tool-search" className="sr-only">
              Search tools
            </label>
            <Icon name="search" className="h-6 w-6 shrink-0 text-brand-700" strokeWidth={2.4} />
            <input
              id="tool-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools – HEIC, compress, merge PDF, paycheck…"
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-ink placeholder:text-slate-400 focus:outline-none sm:px-4 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="submit"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand-gradient px-5 text-base font-semibold text-white shadow-lg shadow-brand-700/30 transition hover:brightness-110 sm:h-14 sm:px-8 sm:text-lg"
            >
              Search
              <Icon name="arrow" className="h-5 w-5" strokeWidth={2.6} />
            </button>
          </form>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-sm sm:text-base">
            <span className="font-medium text-slate-700">Popular:</span>
            {popular.map((p) => (
              <Link
                key={p.path}
                href={p.path}
                className="rounded-full border border-white bg-white/90 px-4 py-2 font-medium text-brand-700 shadow-[0_6px_20px_-8px_rgba(60,40,170,0.25)] transition hover:-translate-y-0.5 hover:text-brand-900 hover:shadow-[0_10px_24px_-8px_rgba(60,40,170,0.35)] sm:px-5"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div id="tools" className="mx-auto max-w-6xl scroll-mt-24 px-4">
        {categories.map((c) => {
          const list = results.filter((r) => r.category === c.slug);
          if (!list.length) return null;
          return (
            <section key={c.slug} className="mt-16 first:mt-12">
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
