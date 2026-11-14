import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { getCategory, toolsIn } from "@/tools/registry";
import type { CategorySlug } from "@/tools/types";

export function CategoryPage({ slug }: { slug: CategorySlug }) {
  const category = getCategory(slug);
  const list = toolsIn(slug);
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: category.name, path: `/${slug}` },
        ]}
      />
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Free {category.name}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{category.description}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </div>
  );
}
