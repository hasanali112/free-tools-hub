import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { activeCategories } from "@/tools/registry";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
          <Logo hideTextOnMobile />
        </Link>
        <nav aria-label="Main" className="-mr-2 flex min-w-0 items-center gap-0.5 overflow-x-auto text-sm font-medium sm:gap-1">
          {activeCategories().map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="shrink-0 rounded-lg px-2.5 py-2 text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 sm:px-3"
            >
              {c.name.replace(/ Tools$/, "")}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
