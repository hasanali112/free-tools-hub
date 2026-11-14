export function TextPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
      <div className="mt-3 h-1 w-16 rounded-full bg-brand-gradient" />
      <div className="prose-page mt-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10">{children}</div>
    </div>
  );
}
