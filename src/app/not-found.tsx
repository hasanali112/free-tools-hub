import type { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/tools/registry";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-7xl font-bold text-brand-gradient">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-ink">We couldn’t find that page</h1>
      <p className="mt-2 text-slate-600">It may have moved. Try one of our popular tools instead:</p>
      <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
        {tools.slice(0, 4).map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
      <Link href="/" className="btn-primary mt-8 h-12">
        See all tools
      </Link>
    </div>
  );
}
