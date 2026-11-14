import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "overtime",
  category: "calculator",
  path: "/calculator/overtime",
  name: "Overtime Calculator",
  h1: "Overtime Calculator — Time and a Half & Double Time Pay",
  title: "Overtime Calculator — Time and a Half Pay, Free",
  description:
    "Calculate overtime pay at time and a half or double time. Enter your hourly rate and hours to see regular pay, overtime pay and total gross pay.",
  summary: "Work out time-and-a-half and double-time pay in seconds.",
  keywords: ["overtime", "time and a half", "double time", "ot", "hourly", "pay", "flsa", "1.5"],
  howTo: [
    "Enter your regular hourly rate and choose time and a half or double time.",
    "Enter your regular hours and overtime hours (and double-time hours if you have them).",
    "See your overtime rate, overtime pay and total gross pay.",
  ],
  faqs: [
    {
      q: "How is overtime calculated?",
      a: "Under the federal Fair Labor Standards Act, non-exempt employees earn at least 1.5 times their regular rate for hours worked over 40 in a workweek. At $20/hour, overtime pays $30/hour.",
    },
    {
      q: "When do I get double time?",
      a: "Federal law doesn't require double time, but some states and employers do. In California, for example, hours over 12 in a workday and over 8 on the seventh consecutive workday are paid at double time.",
    },
    {
      q: "Do states have daily overtime rules?",
      a: "A few do. California pays overtime after 8 hours in a day; Alaska and Nevada have daily overtime rules in some situations, and Colorado after 12 hours a day. Most states follow the federal 40-hours-per-week rule.",
    },
    {
      q: "Is overtime pay taxed?",
      a: "Yes, overtime is taxable wages. For 2025–2028, federal law lets eligible workers deduct the extra “half” portion of qualified overtime pay (up to $12,500, or $25,000 for joint filers, with income limits) on their tax return. Social Security, Medicare and state taxes still apply.",
    },
  ],
  related: ["paycheck", "hourly-to-salary", "tip", "mortgage"],
};
