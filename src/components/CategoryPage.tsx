import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { Icon } from "@/components/ToolIcon";
import { JsonLd } from "@/components/JsonLd";
import { collectionLd } from "@/lib/seo";
import { getCategory, toolsIn } from "@/tools/registry";
import type { CategorySlug } from "@/tools/types";

export function CategoryPage({ slug }: { slug: CategorySlug }) {
  const category = getCategory(slug);
  const list = toolsIn(slug);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: category.name, path: `/${slug}` },
        ]}
      />
      <div className="mx-auto mt-8 max-w-3xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-xl shadow-brand-600/30">
          <Icon name={slug} className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Free <span className="text-brand-gradient">{category.name}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 font-medium text-slate-600 sm:text-lg">{category.description}</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-medium">
          {[`${list.length} tools`, "100% free", "No sign-up", "Private"].map((t) => (
            <li key={t} className="rounded-full border border-white bg-white/90 px-4 py-1.5 text-brand-700 shadow-[0_6px_20px_-8px_rgba(60,40,170,0.25)]">
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
      <JsonLd data={collectionLd(`Free ${category.name}`, category.description, `/${slug}`, list)} />
    </div>
  );
}
