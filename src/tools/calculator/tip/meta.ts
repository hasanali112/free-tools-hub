import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "tip",
  category: "calculator",
  path: "/calculator/tip",
  name: "Tip Calculator",
  h1: "Tip Calculator — Figure the Tip and Split the Bill",
  title: "Tip Calculator — Calculate Tip and Split the Bill, Free",
  description:
    "Quickly calculate a 15%, 18%, 20% or custom tip and split the bill between friends. Round up to whole dollars. Free tip calculator for restaurants.",
  summary: "Calculate the tip and split the check between any number of people.",
  keywords: ["tip", "gratuity", "split bill", "restaurant", "percent", "check", "15%", "20%"],
  howTo: [
    "Enter the bill amount and the number of people.",
    "Pick a tip percentage — 15%, 18%, 20%, 22%, 25% — or type your own.",
    "See the tip, the total, and how much each person pays.",
  ],
  faqs: [
    {
      q: "How much should I tip at a restaurant in the US?",
      a: "For sit-down restaurant service, 18%–20% of the pre-tax bill is standard today, with 15% for basic service and 22%–25% for excellent service.",
    },
    {
      q: "Should I tip on the bill before or after sales tax?",
      a: "Etiquette says the pre-tax amount, but many people tip on the total for simplicity. Enter whichever amount you prefer.",
    },
    {
      q: "How do I split the bill evenly?",
      a: "Enter the number of people. The calculator divides the total including tip and shows what each person owes. Choose “Round up” to avoid cents.",
    },
    {
      q: "How much do you tip for delivery, rideshare or a haircut?",
      a: "Common guidelines are 15%–20% for food delivery (at least $3–$5), 15%–20% for rideshare and taxis, and 15%–20% for haircuts and salon services.",
    },
  ],
  related: ["paycheck", "hourly-to-salary", "overtime", "mortgage"],
};
