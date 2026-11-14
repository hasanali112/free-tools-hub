import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { Icon } from "@/components/ToolIcon";
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
      <div className="relative mt-5 overflow-hidden rounded-3xl bg-brand-950 px-6 py-10 text-white sm:px-10">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-brand-600/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-accent-400/20 blur-3xl" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg shadow-black/30">
          <Icon name={slug} className="h-7 w-7" />
        </span>
        <h1 className="relative mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Free {category.name}</h1>
        <p className="relative mt-3 max-w-2xl leading-7 text-brand-200/85">{category.description}</p>
        <p className="relative mt-4 text-sm font-medium text-accent-300">{list.length} tools · 100% free · No sign-up</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </div>
  );
}
