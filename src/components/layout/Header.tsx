import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { activeCategories } from "@/tools/registry";

/** Floating pill header (sticky). The home hero slides underneath it. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-2 rounded-full border border-white bg-white/75 pr-2 pl-4 shadow-[0_10px_40px_-12px_rgba(45,30,140,0.18)] backdrop-blur-xl sm:pl-7">
        <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
          <Logo size={40} hideTextOnMobile />
        </Link>
        <nav
          aria-label="Main"
          className="flex h-12 min-w-0 items-center gap-0.5 overflow-x-auto rounded-full bg-white/90 px-1.5 text-sm font-medium sm:gap-1 sm:px-4 sm:text-[0.95rem]"
        >
          {activeCategories().map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="shrink-0 rounded-full px-2.5 py-2 text-ink transition hover:bg-brand-50 hover:text-brand-700 sm:px-4"
            >
              {c.name.replace(/ Tools$/, "")}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
