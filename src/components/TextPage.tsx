export function TextPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-[2.6rem]">{title}</h1>
      <div className="mt-3 h-1 w-16 rounded-full bg-brand-gradient" />
      <div className="prose-page surface mt-8 p-6 sm:p-10">{children}</div>
    </div>
  );
}
