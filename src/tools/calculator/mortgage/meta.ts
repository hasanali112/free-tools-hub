import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "mortgage",
  category: "calculator",
  path: "/calculator/mortgage",
  name: "Mortgage Calculator",
  h1: "Mortgage Calculator — Monthly Payment with Taxes, Insurance & PMI",
  title: "Mortgage Calculator — Monthly Payment with Taxes, PMI & HOA",
  description:
    "Free mortgage calculator: estimate your monthly payment including property tax, insurance, PMI and HOA. See total interest and a full amortization schedule.",
  summary: "Estimate your monthly house payment, total interest and payoff date.",
  keywords: ["mortgage", "home loan", "monthly payment", "house", "amortization", "interest", "pmi", "refinance"],
  howTo: [
    "Enter the home price, your down payment and the interest rate.",
    "Choose the loan term and adjust property tax, insurance, PMI and HOA if needed.",
    "See your full monthly payment, total interest and the year-by-year amortization schedule.",
  ],
  faqs: [
    {
      q: "What is included in a monthly mortgage payment?",
      a: "Usually principal and interest (P&I), plus property taxes and homeowners insurance collected in escrow (together often called PITI). Many loans also include PMI, and HOA dues may be paid separately.",
    },
    {
      q: "When do I pay PMI?",
      a: "Conventional loans with less than 20% down usually require private mortgage insurance, often 0.3%–1.5% of the loan per year. It ends automatically when your balance reaches 78% of the original home value, and you can ask to cancel it at 80%.",
    },
    {
      q: "How much do extra payments save?",
      a: "Extra principal payments reduce the balance that interest is charged on. Even $100–$200 a month on a 30-year loan can cut several years off the term and save tens of thousands of dollars in interest — try it with the “Extra principal payment” field.",
    },
    {
      q: "15-year or 30-year mortgage?",
      a: "A 15-year loan has a higher monthly payment but a lower rate and far less total interest. A 30-year loan keeps the monthly payment lower and more flexible.",
    },
  ],
  related: ["paycheck", "hourly-to-salary", "overtime", "tip"],
};
