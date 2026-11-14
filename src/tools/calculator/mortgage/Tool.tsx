"use client";

import { useState } from "react";
import { Segmented } from "@/components/file-tool/controls";
import { BigResult, CalcCard, NumField, ResultTable, SelectField } from "@/components/calc/inputs";
import { money, num } from "@/lib/format";
import { useToolUsed } from "@/lib/useToolUsed";
import { calculateMortgage } from "./engine";

const COLORS = ["bg-brand-600", "bg-brand-400", "bg-accent-400", "bg-brand-200", "bg-slate-300"];

export default function Tool() {
  const used = useToolUsed("mortgage");
  const [price, setPrice] = useState(400000);
  const [downMode, setDownMode] = useState<"pct" | "usd">("pct");
  const [downPct, setDownPct] = useState(20);
  const [downUsd, setDownUsd] = useState(80000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState("30");
  const [taxPct, setTaxPct] = useState(1.1);
  const [insurance, setInsurance] = useState(2000);
  const [pmiPct, setPmiPct] = useState(0.5);
  const [hoa, setHoa] = useState(0);
  const [extra, setExtra] = useState(0);
  const on =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      used();
      set(v);
    };

  const p = num(price);
  const down = downMode === "pct" ? (p * num(downPct)) / 100 : num(downUsd);
  const r = calculateMortgage({
    price: p,
    down,
    ratePct: num(rate),
    years: Number(years),
    propertyTaxPct: num(taxPct),
    insuranceYear: num(insurance),
    pmiPct: num(pmiPct),
    hoaMonth: num(hoa),
    extraMonth: num(extra),
  });
  const parts = [
    { label: "Principal & interest", value: r.pi },
    { label: "Property tax", value: r.tax },
    { label: "Home insurance", value: r.insurance },
    { label: "PMI", value: r.pmi },
    { label: "HOA", value: r.hoa },
  ].filter((x) => x.value > 0);
  const payoff = `${Math.floor(r.months / 12)} years${r.months % 12 ? ` ${r.months % 12} months` : ""}`;

  return (
    <CalcCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumField label="Home price" prefix="$" value={price} onChange={on(setPrice)} step={5000} />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Down payment</span>
            <Segmented
              label="Down payment unit"
              value={downMode}
              onChange={(v) => {
                used();
                if (v === "usd") setDownUsd(Math.round(down));
                else setDownPct(p ? +((down / p) * 100).toFixed(2) : 0);
                setDownMode(v);
              }}
              options={[
                { value: "pct", label: "%" },
                { value: "usd", label: "$" },
              ]}
            />
          </div>
          {downMode === "pct" ? (
            <NumField label="" ariaLabel="Down payment percent" suffix="%" value={downPct} onChange={on(setDownPct)} step={1} hint={money(down, true)} />
          ) : (
            <NumField label="" ariaLabel="Down payment amount" prefix="$" value={downUsd} onChange={on(setDownUsd)} step={1000} hint={p ? `${((down / p) * 100).toFixed(1)}%` : ""} />
          )}
        </div>
        <NumField label="Interest rate" suffix="%" value={rate} onChange={on(setRate)} step={0.125} />
        <SelectField
          label="Loan term"
          value={years}
          onChange={on(setYears)}
          options={["30", "20", "15", "10"].map((y) => ({ value: y, label: `${y} years` }))}
        />
        <NumField label="Property tax" suffix="%/yr" value={taxPct} onChange={on(setTaxPct)} step={0.05} hint="US average is about 0.9%–1.1% of the home's value." />
        <NumField label="Home insurance" prefix="$" suffix="/yr" value={insurance} onChange={on(setInsurance)} step={100} />
        <NumField label="PMI" suffix="%/yr" value={pmiPct} onChange={on(setPmiPct)} step={0.05} hint="Only applies with less than 20% down." />
        <NumField label="HOA fees" prefix="$" suffix="/mo" value={hoa} onChange={on(setHoa)} step={25} />
        <NumField label="Extra principal payment" prefix="$" suffix="/mo" value={extra} onChange={on(setExtra)} step={50} hint="Optional — pays the loan off faster." />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <BigResult label="Monthly payment" value={money(r.monthly)} sub={`Loan amount ${money(r.loan, true)}`} />
          <div className="flex h-3 overflow-hidden rounded-full" aria-hidden>
            {parts.map((x, i) => (
              <div key={x.label} className={COLORS[i]} style={{ width: `${(x.value / r.monthly) * 100}%` }} />
            ))}
          </div>
          <ul className="space-y-1 text-sm">
            {parts.map((x, i) => (
              <li key={x.label} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${COLORS[i]}`} />
                <span className="flex-1 text-slate-700">{x.label}</span>
                <span className="tabular-nums font-medium">{money(x.value)}</span>
              </li>
            ))}
          </ul>
        </div>
        <ResultTable
          rows={[
            ["Loan amount", money(r.loan, true)],
            ["Total interest", money(r.totalInterest, true)],
            ["Total of all loan payments", money(r.loan + r.totalInterest, true)],
            ["Paid off in", payoff],
            ...(r.pmi > 0
              ? ([["PMI ends (78% loan-to-value)", r.pmiEndsMonth > 0 ? `after about ${Math.ceil(r.pmiEndsMonth / 12)} years` : "—"]] as [string, string][])
              : []),
          ]}
        />
      </div>

      {r.years.length > 0 && (
        <details className="mt-4 rounded-xl border border-slate-200 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">Amortization schedule by year</summary>
          <div className="mt-3">
            <ResultTable
              head={["Year", "Principal", "Interest", "Balance"]}
              rows={r.years.map((y) => [String(y.year), money(y.principal, true), money(y.interest, true), money(y.balance, true)])}
            />
          </div>
        </details>
      )}
    </CalcCard>
  );
}
