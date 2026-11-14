"use client";

import { useState } from "react";
import { BigResult, CalcCard, NumField, ResultTable, SelectField } from "@/components/calc/inputs";
import { money, num } from "@/lib/format";
import { useToolUsed } from "@/lib/useToolUsed";

export default function Tool() {
  const used = useToolUsed("overtime");
  const [rate, setRate] = useState(20);
  const [regular, setRegular] = useState(40);
  const [ot, setOt] = useState(10);
  const [mult, setMult] = useState<"1.5" | "2">("1.5");
  const [dt, setDt] = useState(0);
  const on =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      used();
      set(v);
    };

  const r = num(rate);
  const otRate = r * Number(mult);
  const regularPay = r * num(regular);
  const otPay = otRate * num(ot);
  const dtPay = r * 2 * num(dt);
  const total = regularPay + otPay + dtPay;
  const hoursTotal = num(regular) + num(ot) + num(dt);

  return (
    <CalcCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumField label="Regular hourly rate" prefix="$" value={rate} onChange={on(setRate)} step={0.25} />
        <SelectField
          label="Overtime rate"
          value={mult}
          onChange={on(setMult)}
          options={[
            { value: "1.5", label: "Time and a half (1.5×)" },
            { value: "2", label: "Double time (2×)" },
          ]}
        />
        <NumField label="Regular hours" suffix="hrs" value={regular} onChange={on(setRegular)} />
        <NumField label="Overtime hours" suffix="hrs" value={ot} onChange={on(setOt)} />
        <NumField
          label="Double-time hours (optional)"
          suffix="hrs"
          value={dt}
          onChange={on(setDt)}
          hint="For example California hours over 12 in a day."
        />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <BigResult
          label="Total gross pay"
          value={money(total)}
          sub={`${hoursTotal} hours · average ${money(hoursTotal ? total / hoursTotal : 0)}/hour`}
        />
        <ResultTable
          head={["", "Rate", "Pay"]}
          rows={[
            [`Regular (${num(regular)} hrs)`, money(r), money(regularPay)],
            [`Overtime (${num(ot)} hrs)`, money(otRate), money(otPay)],
            ...(num(dt) > 0 ? [[`Double time (${num(dt)} hrs)`, money(r * 2), money(dtPay)] as [string, string, string]] : []),
            [<strong key="t">Total</strong>, "", <strong key="v">{money(total)}</strong>],
          ]}
        />
      </div>
    </CalcCard>
  );
}
