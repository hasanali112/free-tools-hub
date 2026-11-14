"use client";

import { useId } from "react";

const inputCls =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 text-base text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

/** Number input with optional "$" prefix or "%"/unit suffix. Empty input = NaN (treated as 0 by calculators). */
export function NumField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = "any",
  min = 0,
  hint,
  ariaLabel,
}: {
  label: string;
  ariaLabel?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string | number;
  min?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500">{prefix}</span>}
        <input
          id={id}
          aria-label={label || ariaLabel}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
          className={`${inputCls} ${prefix ? "pl-7" : "pl-3"} ${suffix ? "pr-14" : "pr-3"}`}
        />
        {suffix && <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-slate-500">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={`${inputCls} px-3`}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function CalcCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-brand-900/5 sm:p-6">{children}</div>;
}

/** Big highlighted result. */
export function BigResult({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-5 text-white shadow-lg shadow-brand-600/25">
      <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <p className="relative text-sm font-medium text-brand-100">{label}</p>
      <p className="relative mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{value}</p>
      {sub && <div className="relative mt-1 text-sm text-brand-100">{sub}</div>}
    </div>
  );
}

export function ResultTable({ rows, head }: { rows: [React.ReactNode, ...React.ReactNode[]][]; head?: React.ReactNode[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        {head && (
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {head.map((h, i) => (
                <th key={i} className={`px-3 py-2 font-semibold ${i ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={`px-3 py-2 ${j ? "text-right tabular-nums" : "text-slate-700"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
