import Link from "next/link";
import { site } from "@/config/site";
import { activeCategories, toolsIn } from "@/tools/registry";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-bold text-slate-900">{site.name}</p>
          <p className="mt-2 text-slate-600">{site.tagline}. Your files never leave your device.</p>
        </div>
        {activeCategories().map((c) => (
          <div key={c.slug}>
            <p className="font-semibold text-slate-900">
              <Link href={`/${c.slug}`}>{c.name}</Link>
            </p>
            <ul className="mt-2 space-y-1.5">
              {toolsIn(c.slug).map((t) => (
                <li key={t.slug}>
                  <Link href={t.path} className="text-slate-600 hover:text-blue-700">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="font-semibold text-slate-900">Company</p>
          <ul className="mt-2 space-y-1.5">
            {[
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Privacy Policy", "/privacy"],
              ["Terms of Use", "/terms"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-slate-600 hover:text-blue-700">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">© {site.name}. All tools are free to use.</p>
    </footer>
  );
}
