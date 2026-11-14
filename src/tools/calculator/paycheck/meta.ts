import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "paycheck",
  category: "calculator",
  path: "/calculator/paycheck",
  name: "Paycheck Calculator",
  h1: "Paycheck Calculator 2026 — Take-Home Pay for All 50 States",
  title: "Paycheck Calculator 2026 — Take-Home Pay After Taxes, All States",
  description:
    "Free 2026 paycheck calculator for all 50 states. See your take-home pay after federal, state and FICA taxes for salary or hourly pay, any pay frequency.",
  summary: "See your take-home pay after federal, state and FICA taxes.",
  keywords: ["paycheck", "take home pay", "net pay", "salary", "after tax", "withholding", "tax", "state tax", "hourly"],
  howTo: [
    "Choose your state, how often you're paid, and enter your salary or hourly wage.",
    "Pick your filing status and add children, 401(k) and pre-tax health insurance if you have them.",
    "Your take-home pay and a full breakdown of every tax update instantly.",
  ],
  faqs: [
    {
      q: "How is take-home pay calculated?",
      a: "We start from your gross pay, subtract pre-tax deductions (401(k), health insurance), then subtract federal income tax, Social Security (6.2%), Medicare (1.45%), state income tax and any state payroll taxes such as disability or paid-leave insurance.",
    },
    {
      q: "What tax year does this calculator use?",
      a: "2026: the IRS 2026 tax brackets and standard deduction ($16,100 single, $32,200 married filing jointly), the $184,500 Social Security wage base, and 2026 state rates.",
    },
    {
      q: "Why is my real paycheck a little different?",
      a: "Employers withhold based on your W-4, which may include extra withholding, other income or deductions. Benefits such as HSA, dental or commuter plans, and local taxes also change the result. Treat this as a close estimate.",
    },
    {
      q: "Which states have no income tax on wages?",
      a: "Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington and Wyoming don't tax wages. Some of them still have small payroll taxes, like Washington's paid-leave and WA Cares deductions.",
    },
    {
      q: "Is my information saved or sent anywhere?",
      a: "No. All calculations happen in your browser; nothing you type is stored or sent to us.",
    },
  ],
  related: ["hourly-to-salary", "overtime", "mortgage", "tip"],
};
