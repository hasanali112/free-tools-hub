import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ToolIcon";
import { activeCategories, toolsIn } from "@/tools/registry";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-brand-100 bg-gradient-to-b from-white to-brand-50/70">
      {/* thin brand gradient line on top */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-brand-gradient" />
      <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-brand-300/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-azure-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)] lg:grid-cols-[1.6fr_repeat(5,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              Free online tools for images, PDFs, video and money math. Everything runs in your browser — your files never
              leave your device.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-[0_6px_20px_-8px_rgba(60,40,170,0.25)]">
              <Icon name="shieldCheck" className="h-4 w-4" strokeWidth={2.2} /> 100% private · No uploads
            </p>
          </div>
          {activeCategories().map((c) => (
            <div key={c.slug}>
              <p className="text-sm font-semibold text-ink">
                <Link href={`/${c.slug}`} className="transition hover:text-brand-700">
                  {c.name}
                </Link>
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {toolsIn(c.slug).map((t) => (
                  <li key={t.slug}>
                    <Link href={t.path} className="text-slate-600 transition hover:text-brand-700">
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-sm font-semibold text-ink">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ["About", "/about"],
                ["Contact", "/contact"],
                ["Privacy Policy", "/privacy"],
                ["Terms of Use", "/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-600 transition hover:text-brand-700">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="relative border-t border-brand-100/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {site.name}. All tools are free to use.</p>
          <p className="font-medium">
            Made with <span className="text-brand-gradient">privacy first</span> — files never leave your device
          </p>
        </div>
      </div>
    </footer>
  );
}
