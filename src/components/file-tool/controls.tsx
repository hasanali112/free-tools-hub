"use client";

/** Small, consistent form controls for tool options. */

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-slate-700">{label}</p>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`min-h-10 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
            value === o.value
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-blue-400"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function QualitySlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <Field label={`Quality: ${value}%`} hint="Higher quality means a bigger file. 80–92% is a good balance.">
      <input
        type="range"
        min={10}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
        aria-label="Quality"
      />
    </Field>
  );
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border border-slate-300 bg-white p-1"
        />
        {value.toUpperCase()}
      </label>
    </Field>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 1,
  max = 20000,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(Math.max(0, Math.min(max, Math.round(Number(e.target.value)))))}
          className="h-11 w-full rounded-lg border border-slate-300 px-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
      </span>
    </label>
  );
}
