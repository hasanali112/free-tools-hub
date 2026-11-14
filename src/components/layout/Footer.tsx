import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { activeCategories, toolsIn } from "@/tools/registry";

export function Footer() {
  return (
    <footer className="mt-20 bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div>
            <Logo inverted />
            <p className="mt-4 max-w-xs text-sm leading-6 text-brand-200/80">
              Free online tools for images, PDFs, video and money math. Everything runs in your browser — your files never
              leave your device.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-accent-300 ring-1 ring-white/10">
              <LockIcon /> 100% private · No uploads
            </p>
          </div>
          {activeCategories().map((c) => (
            <div key={c.slug}>
              <p className="text-sm font-semibold text-white">
                <Link href={`/${c.slug}`} className="hover:text-accent-300">
                  {c.name}
                </Link>
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {toolsIn(c.slug).map((t) => (
                  <li key={t.slug}>
                    <Link href={t.path} className="text-brand-200/75 transition hover:text-white">
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ["About", "/about"],
                ["Contact", "/contact"],
                ["Privacy Policy", "/privacy"],
                ["Terms of Use", "/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-brand-200/75 transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-brand-200/60">© {site.name}. All tools are free to use.</p>
      </div>
    </footer>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 1 0-8 0v4m-2 0h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
    </svg>
  );
}
