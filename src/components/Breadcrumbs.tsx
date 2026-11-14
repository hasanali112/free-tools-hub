import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden>›</span>}
              {i < items.length - 1 ? (
                <Link href={it.path} className="hover:text-blue-700">
                  {it.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-slate-700">
                  {it.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(items)} />
    </>
  );
}
