import Link from "next/link";
import type { ToolMeta } from "@/tools/types";

export function ToolCard({ tool }: { tool: Pick<ToolMeta, "path" | "name" | "summary"> }) {
  return (
    <Link
      href={tool.path}
      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-400 hover:shadow"
    >
      <p className="font-semibold text-slate-900 group-hover:text-blue-700">{tool.name}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{tool.summary}</p>
    </Link>
  );
}
