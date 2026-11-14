export interface MortgageInput {
  price: number;
  down: number;
  ratePct: number;
  years: number;
  propertyTaxPct: number;
  insuranceYear: number;
  pmiPct: number;
  hoaMonth: number;
  extraMonth: number;
}

export interface YearRow {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export function monthlyPI(loan: number, ratePct: number, years: number) {
  const n = years * 12;
  const r = ratePct / 100 / 12;
  if (loan <= 0 || n <= 0) return 0;
  return r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
}

export function calculateMortgage(i: MortgageInput) {
  const loan = Math.max(0, i.price - i.down);
  const pi = monthlyPI(loan, i.ratePct, i.years);
  const r = i.ratePct / 100 / 12;
  const tax = (i.price * i.propertyTaxPct) / 100 / 12;
  const insurance = i.insuranceYear / 12;
  const needsPmi = i.price > 0 && loan / i.price > 0.8;
  const pmi = needsPmi ? (loan * i.pmiPct) / 100 / 12 : 0;

  // Amortization with optional extra principal payments.
  let balance = loan;
  let month = 0;
  let totalInterest = 0;
  let pmiEndsMonth = needsPmi ? 0 : -1;
  const years: YearRow[] = [];
  let yP = 0;
  let yI = 0;
  while (balance > 0.005 && month < i.years * 12) {
    const interest = balance * r;
    const principal = Math.min(balance, pi - interest + i.extraMonth);
    balance -= principal;
    totalInterest += interest;
    yP += principal;
    yI += interest;
    month++;
    if (pmiEndsMonth === 0 && balance <= i.price * 0.78) pmiEndsMonth = month;
    if (month % 12 === 0 || balance <= 0.005) {
      years.push({ year: Math.ceil(month / 12), principal: yP, interest: yI, balance: Math.max(0, balance) });
      yP = 0;
      yI = 0;
    }
  }

  return {
    loan,
    pi,
    tax,
    insurance,
    pmi,
    hoa: i.hoaMonth,
    monthly: pi + tax + insurance + pmi + i.hoaMonth,
    totalInterest,
    months: month,
    pmiEndsMonth,
    years,
  };
}
