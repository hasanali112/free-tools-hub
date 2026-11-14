"use client";

import { useState } from "react";
import { Segmented } from "@/components/file-tool/controls";
import { BigResult, CalcCard, NumField, ResultTable, SelectField } from "@/components/calc/inputs";
import { money, num, percent } from "@/lib/format";
import { useToolUsed } from "@/lib/useToolUsed";
import { calculatePaycheck, type PayFrequency } from "./engine";
import { stateList, taxData, TAX_YEAR, type Filing } from "./tax-data";

const FREQUENCIES: { value: `${PayFrequency}`; label: string }[] = [
  { value: "52", label: "Weekly (52 paychecks)" },
  { value: "26", label: "Every two weeks (26)" },
  { value: "24", label: "Twice a month (24)" },
  { value: "12", label: "Monthly (12)" },
];

export default function Tool({ stateCode = "CA" }: { stateCode?: string }) {
  const used = useToolUsed("paycheck");
  const [state, setStateCode] = useState(stateCode);
  const [payType, setPayType] = useState<"salary" | "hourly">("salary");
  const [salary, setSalary] = useState(60000);
  const [hourly, setHourly] = useState(25);
  const [hours, setHours] = useState(40);
  const [freq, setFreq] = useState<`${PayFrequency}`>("26");
  const [filing, setFiling] = useState<Filing>("single");
  const [children, setChildren] = useState(0);
  const [retirement, setRetirement] = useState(0);
  const [health, setHealth] = useState(0);
  const [localRate, setLocalRate] = useState(taxData.states[stateCode]?.defaultLocalRate ?? 0);

  const on =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      used();
      set(v);
    };

  const s = taxData.states[state];
  const periods = Number(freq) as PayFrequency;
  const grossAnnual = payType === "salary" ? num(salary) : num(hourly) * num(hours) * 52;
  const r = calculatePaycheck({
    stateCode: state,
    grossAnnual,
    periods,
    filing,
    children: Math.max(0, Math.floor(num(children))),
    retirementPct: num(retirement),
    healthPerPeriod: num(health),
    localRate: num(localRate),
  });
  const per = (n: number) => n / periods;

  return (
    <CalcCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="State"
          value={state}
          onChange={(v) => {
            used();
            setStateCode(v);
            setLocalRate(taxData.states[v].defaultLocalRate ?? 0);
          }}
          options={stateList.map((x) => ({ value: x.code, label: x.name }))}
        />
        <SelectField label="Pay frequency" value={freq} onChange={on(setFreq)} options={FREQUENCIES} />
        <div className="sm:col-span-2">
          <p className="mb-1.5 text-sm font-semibold text-slate-700">Pay type</p>
          <Segmented
            label="Pay type"
            value={payType}
            onChange={on(setPayType)}
            options={[
              { value: "salary", label: "Annual salary" },
              { value: "hourly", label: "Hourly wage" },
            ]}
          />
        </div>
        {payType === "salary" ? (
          <NumField label="Annual salary" prefix="$" value={salary} onChange={on(setSalary)} step={1000} />
        ) : (
          <>
            <NumField label="Hourly wage" prefix="$" value={hourly} onChange={on(setHourly)} step={0.25} />
            <NumField label="Hours per week" suffix="hrs" value={hours} onChange={on(setHours)} />
          </>
        )}
        <SelectField
          label="Filing status"
          value={filing}
          onChange={on(setFiling)}
          options={[
            { value: "single", label: "Single" },
            { value: "married", label: "Married filing jointly" },
            { value: "head", label: "Head of household" },
          ]}
        />
        <NumField label="Children under 17" value={children} onChange={on(setChildren)} step={1} hint="For the Child Tax Credit." />
        <NumField label="401(k) / 403(b) contribution" suffix="%" value={retirement} onChange={on(setRetirement)} step={1} />
        <NumField label="Health insurance per paycheck (pre-tax)" prefix="$" value={health} onChange={on(setHealth)} step={10} />
        <NumField
          label="Local income tax"
          suffix="%"
          value={localRate}
          onChange={on(setLocalRate)}
          step={0.1}
          hint={s.localNote ? "See local tax note below." : "Most places have none — leave at 0."}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-3">
          <BigResult
            label="Take-home pay per paycheck"
            value={money(per(r.net))}
            sub={
              <>
                {money(r.net, true)} per year · {money(r.net / 12, true)} per month
              </>
            }
          />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="Gross per paycheck" value={money(per(r.gross))} />
            <Stat label="Total taxes" value={percent(r.effectiveTaxRate)} sub="of gross pay" />
            <Stat label="Federal tax bracket" value={percent(r.federalMarginal, 0)} sub="marginal rate" />
            <Stat label="Taxes per paycheck" value={money(per(r.totalTax))} />
          </div>
        </div>
        <ResultTable
          head={["", "Per paycheck", "Per year"]}
          rows={[
            ["Gross pay", money(per(r.gross)), money(r.gross, true)],
            ...r.lines.map(
              (l) => [<span key="l">− {l.label}</span>, money(per(l.annual)), money(l.annual, true)] as [React.ReactNode, ...React.ReactNode[]],
            ),
            [<strong key="n">Take-home pay</strong>, <strong key="p">{money(per(r.net))}</strong>, <strong key="y">{money(r.net, true)}</strong>],
          ]}
        />
      </div>

      {(s.localNote || s.payrollNote || s.noteText) && (
        <div className="mt-4 space-y-1 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {s.noteText && <p>{s.noteText}</p>}
          {s.localNote && <p>Local tax note: {s.localNote}</p>}
          {s.payrollNote && <p>{s.payrollNote}</p>}
        </div>
      )}
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Estimate for {TAX_YEAR} using the standard deduction and current federal and {s.name} rates. Your actual paycheck depends on
        your W-4, other income, credits and employer benefits. Not tax advice.
      </p>
    </CalcCard>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
