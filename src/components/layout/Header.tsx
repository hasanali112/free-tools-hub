import Link from "next/link";
import { site } from "@/config/site";
import { activeCategories } from "@/tools/registry";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label={`${site.name} home`} className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900">
          <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm text-white">
            FT
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>
        <nav aria-label="Main" className="-mr-2 flex min-w-0 items-center gap-0.5 overflow-x-auto text-sm font-medium sm:gap-1">
          {activeCategories().map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className="shrink-0 rounded-lg px-2 py-2 text-slate-700 hover:bg-slate-100 sm:px-3">
              {c.name.replace(/ Tools$/, "")}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
