export function TextPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
      <div className="prose-page mt-6">{children}</div>
    </div>
  );
}
