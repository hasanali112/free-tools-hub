import { ogImage, ogSize } from "@/lib/og";
import { stateBySlug, stateList, stateRateSummary, TAX_YEAR } from "@/tools/calculator/paycheck/tax-data";

export const alt = "State paycheck calculator";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams() {
  return stateList.map((s) => ({ state: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ state: string }> }) {
  const s = stateBySlug((await params).state)!;
  return ogImage({
    title: `${s.name} Paycheck Calculator`,
    subtitle: `${TAX_YEAR} take-home pay · State tax: ${stateRateSummary(s)}`,
    badge: "Free calculator",
  });
}
