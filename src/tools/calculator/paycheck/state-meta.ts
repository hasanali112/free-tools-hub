import type { ToolMeta } from "@/tools/types";
import { meta as hub } from "./meta";
import { stateRateSummary, TAX_YEAR, type StateTax } from "./tax-data";

const pct = (r: number) => `${+(r * 100).toFixed(2)}%`;

/** Generates unique SEO text and FAQs for /calculator/paycheck/<state>. */
export function stateToolMeta(s: StateTax & { code: string }): ToolMeta {
  const noTax = !s.brackets;
  const rate = stateRateSummary(s);
  const payrollNames = (s.payroll ?? []).map((p) => p.name);

  return {
    ...hub,
    slug: `paycheck-${s.slug}`,
    path: `/calculator/paycheck/${s.slug}`,
    name: `${s.name} Paycheck Calculator`,
    h1: `${s.name} Paycheck Calculator ${TAX_YEAR}`,
    title: `${s.name} Paycheck Calculator ${TAX_YEAR} — Take-Home Pay After Taxes`,
    description: noTax
      ? `Free ${s.name} paycheck calculator for ${TAX_YEAR}. ${s.name} has no state income tax on wages — see your take-home pay after federal and FICA taxes.`
      : `Free ${s.name} paycheck calculator for ${TAX_YEAR}. See your take-home pay after federal, FICA and ${s.name} income tax (${rate}), for salary or hourly pay.`,
    summary: noTax
      ? `Take-home pay in ${s.name} — no state income tax on wages.`
      : `Take-home pay in ${s.name} after federal, FICA and state income tax.`,
    howTo: [
      `Enter your salary or hourly wage and how often you're paid (${s.name} is already selected).`,
      "Pick your filing status and add children, 401(k) and pre-tax health insurance if you have them.",
      "Your take-home pay and a breakdown of every tax update instantly.",
    ],
    faqs: [
      {
        q: `Does ${s.name} have a state income tax?`,
        a: noTax
          ? `No. ${s.noteText ?? `${s.name} doesn't tax wages or salaries.`} You still pay federal income tax, Social Security and Medicare.`
          : `Yes. In ${TAX_YEAR}, ${s.name} taxes wages at ${rate}${s.brackets && new Set(s.brackets.single.map((b) => b[1])).size > 1 ? ", depending on your taxable income" : ""}.`,
      },
      ...(noTax
        ? []
        : [
            {
              q: `What is the ${s.name} standard deduction for ${TAX_YEAR}?`,
              a: s.standardDeduction
                ? `$${s.standardDeduction.single.toLocaleString("en-US")} for single filers and $${s.standardDeduction.married.toLocaleString("en-US")} for married couples filing jointly.${s.personalExemption ? ` There's also a personal exemption of $${s.personalExemption.single.toLocaleString("en-US")} per person.` : ""}`
                : s.stdDeductionCredit
                  ? `${s.name} uses a taxpayer credit instead: up to $${s.stdDeductionCredit.single} for single filers and $${s.stdDeductionCredit.married} for married couples, which phases out at higher incomes.`
                  : `${s.name} has no standard deduction${s.personalExemption ? `, but allows a personal exemption of $${s.personalExemption.single.toLocaleString("en-US")} ($${s.personalExemption.married.toLocaleString("en-US")} married)` : ""}.`,
            },
          ]),
      {
        q: `Are there local income taxes in ${s.name}?`,
        a: s.localNote ?? `No — ${s.name} cities and counties don't generally charge a local income tax on wages.`,
      },
      {
        q: `What else is taken out of a ${s.name} paycheck?`,
        a: `Federal income tax, Social Security (6.2% up to $184,500) and Medicare (1.45%, plus 0.9% above $200,000)${payrollNames.length ? `, plus ${payrollNames.join(", ")}` : ""}${noTax ? "" : `, and ${s.name} income tax`}. Pre-tax deductions such as 401(k) contributions and health insurance lower your taxable pay.`,
      },
      hub.faqs[2],
    ],
    related: ["hourly-to-salary", "overtime", "mortgage", "tip"],
  };
}

export { pct };
