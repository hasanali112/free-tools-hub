"use client";

import { Field } from "@/components/file-tool/controls";

export function PageRangeInput({
  label,
  value,
  onChange,
  placeholder = "e.g. 1-3, 5, 8-10",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint ?? "Separate ranges with commas. “8-” means page 8 to the end."}>
      <input
        type="text"
        inputMode="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full max-w-md rounded-lg border border-slate-300 px-3 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </Field>
  );
}
