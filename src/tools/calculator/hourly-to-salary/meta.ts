import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "hourly-to-salary",
  category: "calculator",
  path: "/calculator/hourly-to-salary",
  name: "Hourly to Salary Calculator",
  h1: "Hourly to Salary Calculator — Convert Wage to Annual Pay",
  title: "Hourly to Salary Calculator — Hourly Wage to Yearly Salary",
  description:
    "Convert an hourly wage to annual salary (and salary back to hourly). See weekly, biweekly, monthly and yearly pay instantly. Free and simple.",
  summary: "Convert hourly pay to yearly salary, or salary back to an hourly rate.",
  keywords: ["hourly", "salary", "wage", "annual", "per hour", "yearly", "convert", "income"],
  howTo: [
    "Choose Hourly → Salary or Salary → Hourly and enter your pay.",
    "Set your hours per week and any unpaid weeks off.",
    "See your pay per hour, day, week, two weeks, month and year.",
  ],
  faqs: [
    {
      q: "How do I convert hourly pay to salary?",
      a: "Multiply your hourly wage by the hours you work per week, then by 52 weeks. For example, $25 × 40 hours × 52 weeks = $52,000 per year.",
    },
    {
      q: "How many working hours are in a year?",
      a: "A full-time schedule of 40 hours a week for 52 weeks is 2,080 hours. That's why a quick rule is: annual salary ≈ hourly wage × 2,000.",
    },
    {
      q: "Should I include vacation weeks?",
      a: "Only unpaid time off. Paid vacation and holidays still count as paid hours, so leave “Unpaid weeks off” at 0 if your time off is paid.",
    },
    {
      q: "Is this before or after taxes?",
      a: "Before taxes (gross pay). Use our paycheck calculator to estimate take-home pay after federal, state and FICA taxes.",
    },
  ],
  related: ["paycheck", "overtime", "tip", "mortgage"],
};
