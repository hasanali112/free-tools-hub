"use client";

import Link from "next/link";
import { useState } from "react";
import { Segmented } from "@/components/file-tool/controls";
import { BigResult, CalcCard, NumField, ResultTable } from "@/components/calc/inputs";
import { money, num } from "@/lib/format";
import { useToolUsed } from "@/lib/useToolUsed";

export default function Tool() {
  const used = useToolUsed("hourly-to-salary");
  const [mode, setMode] = useState<"hourly" | "salary">("hourly");
  const [hourly, setHourly] = useState(25);
  const [salary, setSalary] = useState(60000);
  const [hours, setHours] = useState(40);
  const [weeksOff, setWeeksOff] = useState(0);
  const on =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      used();
      set(v);
    };

  const weeks = Math.max(0, 52 - num(weeksOff));
  const hoursYear = num(hours) * weeks;
  const annual = mode === "hourly" ? num(hourly) * hoursYear : num(salary);
  const rate = mode === "hourly" ? num(hourly) : hoursYear ? annual / hoursYear : 0;

  return (
    <CalcCard>
      <Segmented
        label="Convert"
        value={mode}
        onChange={on(setMode)}
        options={[
          { value: "hourly", label: "Hourly → Salary" },
          { value: "salary", label: "Salary → Hourly" },
        ]}
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {mode === "hourly" ? (
          <NumField label="Hourly wage" prefix="$" value={hourly} onChange={on(setHourly)} step={0.25} />
        ) : (
          <NumField label="Annual salary" prefix="$" value={salary} onChange={on(setSalary)} step={1000} />
        )}
        <NumField label="Hours per week" suffix="hrs" value={hours} onChange={on(setHours)} />
        <NumField label="Unpaid weeks off per year" suffix="weeks" value={weeksOff} onChange={on(setWeeksOff)} step={1} hint="Paid vacation counts as worked." />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <BigResult
          label={mode === "hourly" ? "Annual salary" : "Hourly wage"}
          value={mode === "hourly" ? money(annual, true) : money(rate)}
          sub={`Based on ${hoursYear.toLocaleString("en-US")} paid hours per year (before taxes)`}
        />
        <ResultTable
          head={["Period", "Gross pay"]}
          rows={[
            ["Hourly", money(rate)],
            ["Daily (8 hours)", money(rate * 8)],
            ["Weekly", money(rate * num(hours))],
            ["Every two weeks", money(rate * num(hours) * 2)],
            ["Twice a month", money(annual / 24)],
            ["Monthly", money(annual / 12)],
            ["Yearly", money(annual, true)],
          ]}
        />
      </div>
      <p className="mt-4 text-sm text-slate-600">
        Want to know what you actually take home?{" "}
        <Link href="/calculator/paycheck" className="font-medium text-brand-700 hover:underline">
          Use the paycheck calculator
        </Link>{" "}
        to subtract taxes for your state.
      </p>
    </CalcCard>
  );
}
