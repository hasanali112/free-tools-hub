/**
 * Typed access to the yearly tax data in src/data/tax-<year>.json.
 * To update for a new year: copy the JSON, update the numbers, and change the import below.
 */
import raw from "@/data/tax-2026.json";

export type Filing = "single" | "married" | "head";
type ByStatus<T> = { single: T; married: T };
export type Brackets = [threshold: number, rate: number][];

export interface PayrollItem {
  name: string;
  rate: number;
  /** Wages above this aren't taxed. */
  wageBase?: number;
  /** Fixed yearly maximum deduction. */
  maxAmount?: number;
  approx?: boolean;
}

export interface StateTax {
  name: string;
  slug: string;
  /** null = no income tax on wages. */
  brackets: ByStatus<Brackets> | null;
  standardDeduction?: ByStatus<number>;
  standardDeductionPhaseOut?: ByStatus<[number, number]>;
  stdDeductionCredit?: ByStatus<number>;
  personalExemption?: ByStatus<number>;
  /** Exemption is reduced $1 for each $1 of income above this. */
  exemptionPhaseOut?: ByStatus<number>;
  personalCredit?: ByStatus<number>;
  creditIncomeLimit?: ByStatus<number>;
  dependentExemption?: number;
  dependentExemptionSkipsFirst?: boolean;
  dependentCredit?: number;
  deductsFederalTax?: boolean;
  /** 401(k) contributions are NOT excluded from state wages (PA, NJ). */
  taxes401k?: boolean;
  payroll?: PayrollItem[];
  payrollNote?: string;
  defaultLocalRate?: number;
  localNote?: string;
  noteText?: string;
}

export interface TaxData {
  year: number;
  lastReviewed: string;
  sources: { name: string; url: string }[];
  federal: {
    standardDeduction: Record<Filing, number>;
    brackets: Record<Filing, Brackets>;
    childTaxCredit: { perChild: number; phaseOutStart: Record<Filing, number>; reductionPer1000: number };
    socialSecurity: { rate: number; wageBase: number };
    medicare: { rate: number; additionalRate: number; additionalThreshold: number };
    limit401k: number;
  };
  states: Record<string, StateTax>;
}

export const taxData = raw as unknown as TaxData;
export const TAX_YEAR = taxData.year;

export const stateList = Object.entries(taxData.states).map(([code, s]) => ({ code, ...s }));

export function stateBySlug(slug: string) {
  return stateList.find((s) => s.slug === slug);
}

/** Short human summary of a state's income tax, e.g. "flat 4.25%" or "1% to 13.3%". */
export function stateRateSummary(s: StateTax) {
  if (!s.brackets) return "no state income tax on wages";
  const rates = [...new Set(s.brackets.single.map(([, r]) => r).filter((r) => r > 0))];
  const pct = (r: number) => `${+(r * 100).toFixed(2)}%`;
  return rates.length === 1 ? `a flat ${pct(rates[0])}` : `${pct(Math.min(...rates))} to ${pct(Math.max(...rates))}`;
}
