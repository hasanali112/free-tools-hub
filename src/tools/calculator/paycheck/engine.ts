import { taxData, type Brackets, type Filing, type StateTax } from "./tax-data";

export type PayFrequency = 52 | 26 | 24 | 12;

export interface PaycheckInput {
  stateCode: string;
  grossAnnual: number;
  periods: PayFrequency;
  filing: Filing;
  /** Children under 17 (Child Tax Credit and state dependent exemptions). */
  children: number;
  /** 401(k) / 403(b) contribution, % of gross pay. */
  retirementPct: number;
  /** Pre-tax health/dental/vision premiums per paycheck (Section 125). */
  healthPerPeriod: number;
  /** Local / city income tax rate in %. */
  localRate: number;
}

export interface Line {
  label: string;
  annual: number;
  kind: "tax" | "deduction";
}

export interface PaycheckResult {
  gross: number;
  lines: Line[];
  net: number;
  totalTax: number;
  federalMarginal: number;
  effectiveTaxRate: number;
}

export function taxFromBrackets(income: number, brackets: Brackets) {
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const [from, rate] = brackets[i];
    const to = i + 1 < brackets.length ? brackets[i + 1][0] : Infinity;
    if (income <= from) break;
    tax += (Math.min(income, to) - from) * rate;
  }
  return tax;
}

function marginalRate(income: number, brackets: Brackets) {
  let rate = 0;
  for (const [from, r] of brackets) if (income > from) rate = r;
  return rate;
}

const clamp0 = (n: number) => Math.max(0, n);

export function federalIncomeTax(taxable: number, filing: Filing, children: number, agi: number) {
  const f = taxData.federal;
  const tax = taxFromBrackets(taxable, f.brackets[filing]);
  const ctc = f.childTaxCredit;
  const over = clamp0(agi - ctc.phaseOutStart[filing]);
  const credit = clamp0(children * ctc.perChild - Math.ceil(over / 1000) * ctc.reductionPer1000);
  return clamp0(tax - credit);
}

export function stateIncomeTax(s: StateTax, wages: number, filing: Filing, children: number, federalTax: number) {
  if (!s.brackets) return { tax: 0, taxable: 0 };
  // States generally don't have a head-of-household schedule in our data → use single.
  const st = filing === "married" ? "married" : "single";

  let std = s.standardDeduction?.[st] ?? 0;
  const po = s.standardDeductionPhaseOut?.[st];
  if (po && wages > po[0]) std = clamp0(std * (1 - (wages - po[0]) / (po[1] - po[0])));

  let exemption = s.personalExemption?.[st] ?? 0;
  const epo = s.exemptionPhaseOut?.[st];
  if (epo && wages > epo) exemption = clamp0(exemption - Math.ceil((wages - epo) / 1000) * 1000);

  const depCount = s.dependentExemptionSkipsFirst ? clamp0(children - 1) : children;
  const deps = (s.dependentExemption ?? 0) * depCount;
  const fedDeduction = s.deductsFederalTax ? federalTax : 0;

  const taxable = clamp0(wages - std - exemption - deps - fedDeduction);
  let tax = taxFromBrackets(taxable, s.brackets[st]);

  const creditsAllowed = !s.creditIncomeLimit || wages <= s.creditIncomeLimit[st];
  if (creditsAllowed) {
    tax -= s.personalCredit?.[st] ?? 0;
    tax -= (s.dependentCredit ?? 0) * children;
  }
  tax -= s.stdDeductionCredit?.[st] ?? 0;
  return { tax: clamp0(tax), taxable };
}

export function calculatePaycheck(input: PaycheckInput): PaycheckResult {
  const f = taxData.federal;
  const s = taxData.states[input.stateCode];
  const gross = clamp0(input.grossAnnual);

  const retirement = Math.min(gross * (input.retirementPct / 100), f.limit401k);
  const health = Math.min(clamp0(input.healthPerPeriod) * input.periods, gross - retirement);

  // FICA: Section 125 health premiums are exempt, 401(k) is not.
  const ficaWages = clamp0(gross - health);
  const socialSecurity = Math.min(ficaWages, f.socialSecurity.wageBase) * f.socialSecurity.rate;
  const medicare =
    ficaWages * f.medicare.rate + clamp0(ficaWages - f.medicare.additionalThreshold) * f.medicare.additionalRate;

  const agi = clamp0(gross - retirement - health);
  const fedTaxable = clamp0(agi - f.standardDeduction[input.filing]);
  const federal = federalIncomeTax(fedTaxable, input.filing, input.children, agi);

  const stateWages = s.taxes401k ? clamp0(gross - health) : agi;
  const { tax: state, taxable: stateTaxable } = stateIncomeTax(s, stateWages, input.filing, input.children, federal);
  const local = (s.brackets ? stateTaxable : stateWages) * (clamp0(input.localRate) / 100);

  const payroll = (s.payroll ?? []).map((p) => {
    let amt = Math.min(ficaWages, p.wageBase ?? Infinity) * p.rate;
    if (p.maxAmount !== undefined) amt = Math.min(amt, p.maxAmount);
    return { label: p.name, annual: amt, kind: "tax" as const };
  });

  const lines: Line[] = [
    { label: "Federal income tax", annual: federal, kind: "tax" },
    { label: "Social Security (6.2%)", annual: socialSecurity, kind: "tax" },
    { label: "Medicare (1.45%)", annual: medicare, kind: "tax" },
    { label: `${s.name} income tax`, annual: state, kind: "tax" },
    ...(local > 0 ? [{ label: "Local income tax", annual: local, kind: "tax" as const }] : []),
    ...payroll,
    ...(retirement > 0 ? [{ label: "401(k) / 403(b)", annual: retirement, kind: "deduction" as const }] : []),
    ...(health > 0 ? [{ label: "Health insurance (pre-tax)", annual: health, kind: "deduction" as const }] : []),
  ];
  const totalTax = lines.filter((l) => l.kind === "tax").reduce((a, l) => a + l.annual, 0);
  const totalDeductions = lines.reduce((a, l) => a + l.annual, 0);
  return {
    gross,
    lines,
    net: gross - totalDeductions,
    totalTax,
    federalMarginal: marginalRate(fedTaxable, f.brackets[input.filing]),
    effectiveTaxRate: gross ? totalTax / gross : 0,
  };
}
