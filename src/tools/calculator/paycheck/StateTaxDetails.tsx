import Link from "next/link";
import { pct } from "./state-meta";
import { stateList, taxData, TAX_YEAR, type StateTax } from "./tax-data";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

function BracketTable({ brackets }: { brackets: [number, number][] }) {
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
        <tr>
          <th className="py-1 font-semibold">Taxable income over</th>
          <th className="py-1 text-right font-semibold">Rate</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {brackets.map(([from, rate]) => (
          <tr key={from}>
            <td className="py-1 tabular-nums">{usd(from)}</td>
            <td className="py-1 text-right tabular-nums">{pct(rate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Server-rendered tax facts for one state (unique content for each state page). */
export function StateTaxDetails({ state }: { state: StateTax }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-ink">
        {state.name} income tax rates for {TAX_YEAR}
      </h2>
      {state.brackets ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 font-semibold text-ink">Single</h3>
            <BracketTable brackets={state.brackets.single} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 font-semibold text-ink">Married filing jointly</h3>
            <BracketTable brackets={state.brackets.married} />
          </div>
        </div>
      ) : (
        <p className="mt-3 leading-7 text-slate-700">
          {state.noteText ?? `${state.name} doesn't have a state income tax on wages.`} Only federal income tax, Social Security and
          Medicare{state.payroll?.length ? `, plus the state payroll taxes below,` : ""} come out of your paycheck.
        </p>
      )}
      <ul className="mt-4 list-disc space-y-1 pl-6 leading-7 text-slate-700">
        {state.standardDeduction && (
          <li>
            Standard deduction: {usd(state.standardDeduction.single)} single / {usd(state.standardDeduction.married)} married filing jointly.
          </li>
        )}
        {state.personalExemption && (
          <li>
            Personal exemption: {usd(state.personalExemption.single)} single / {usd(state.personalExemption.married)} married
            {state.dependentExemption ? `, plus ${usd(state.dependentExemption)} per dependent` : ""}.
          </li>
        )}
        {state.payroll?.map((p) => (
          <li key={p.name}>
            {p.name}: {pct(p.rate)} of wages
            {p.wageBase ? ` up to ${usd(p.wageBase)}` : p.maxAmount ? ` (max ${usd(p.maxAmount)} per year)` : ""}.
          </li>
        ))}
        {state.localNote && <li>{state.localNote}</li>}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        Rates: Tax Foundation 2026 state table, state agencies and IRS. Data last reviewed {taxData.lastReviewed}.
      </p>
    </section>
  );
}

/** Links to every state's calculator (internal linking). */
export function AllStatesLinks({ current }: { current?: string }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-ink">Paycheck calculators by state</h2>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3">
        {stateList.map((s) => (
          <li key={s.code}>
            {s.slug === current ? (
              <span className="font-semibold text-ink">{s.name}</span>
            ) : (
              <Link href={`/calculator/paycheck/${s.slug}`} className="text-brand-700 hover:underline">
                {s.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
