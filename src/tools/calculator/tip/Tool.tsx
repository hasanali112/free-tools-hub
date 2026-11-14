"use client";

import { useState } from "react";
import { Segmented } from "@/components/file-tool/controls";
import { BigResult, CalcCard, NumField, ResultTable } from "@/components/calc/inputs";
import { money, num } from "@/lib/format";
import { useToolUsed } from "@/lib/useToolUsed";

const PRESETS = ["15", "18", "20", "22", "25", "custom"] as const;
type Preset = (typeof PRESETS)[number];

export default function Tool() {
  const used = useToolUsed("tip");
  const [bill, setBill] = useState(50);
  const [preset, setPreset] = useState<Preset>("20");
  const [custom, setCustom] = useState(10);
  const [people, setPeople] = useState(1);
  const [round, setRound] = useState<"no" | "up">("no");
  const on =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      used();
      set(v);
    };

  const pctVal = preset === "custom" ? num(custom) : Number(preset);
  const split = Math.max(1, Math.floor(num(people)));
  const b = num(bill);
  let tip = (b * pctVal) / 100;
  let total = b + tip;
  if (round === "up") {
    const perPerson = Math.ceil(total / split);
    total = perPerson * split;
    tip = total - b;
  }

  return (
    <CalcCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumField label="Bill amount" prefix="$" value={bill} onChange={on(setBill)} step={0.01} />
        <NumField label="Number of people" value={people} onChange={on(setPeople)} step={1} min={1} />
      </div>
      <div className="mt-4">
        <p className="mb-1.5 text-sm font-semibold text-slate-700">Tip</p>
        <Segmented
          label="Tip percentage"
          value={preset}
          onChange={on(setPreset)}
          options={PRESETS.map((p) => ({ value: p, label: p === "custom" ? "Custom" : `${p}%` }))}
        />
      </div>
      {preset === "custom" && (
        <div className="mt-4 max-w-48">
          <NumField label="Custom tip" suffix="%" value={custom} onChange={on(setCustom)} step={1} />
        </div>
      )}
      <div className="mt-4">
        <p className="mb-1.5 text-sm font-semibold text-slate-700">Round</p>
        <Segmented
          label="Round"
          value={round}
          onChange={on(setRound)}
          options={[
            { value: "no", label: "Exact" },
            { value: "up", label: "Round up to whole dollars" },
          ]}
        />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <BigResult
          label={split > 1 ? "Each person pays" : "Total to pay"}
          value={money(total / split)}
          sub={`Tip ${money(tip)} (${b ? ((tip / b) * 100).toFixed(1) : "0"}%)`}
        />
        <ResultTable
          rows={[
            ["Bill", money(b)],
            ["Tip", money(tip)],
            ["Total", money(total)],
            ...(split > 1
              ? ([
                  ["Tip per person", money(tip / split)],
                  ["Total per person", money(total / split)],
                ] as [string, string][])
              : []),
          ]}
        />
      </div>
    </CalcCard>
  );
}
