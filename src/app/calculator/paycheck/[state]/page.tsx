import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPage } from "@/components/ToolPage";
import { toolMetadata } from "@/lib/seo";
import Tool from "@/tools/calculator/paycheck/Tool";
import { AllStatesLinks, StateTaxDetails } from "@/tools/calculator/paycheck/StateTaxDetails";
import { stateToolMeta } from "@/tools/calculator/paycheck/state-meta";
import { stateBySlug, stateList } from "@/tools/calculator/paycheck/tax-data";

// One static page per state (generated at build time from the tax data JSON).
export const dynamicParams = false;

export function generateStaticParams() {
  return stateList.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/calculator/paycheck/[state]">): Promise<Metadata> {
  const s = stateBySlug((await params).state);
  return s ? toolMetadata(stateToolMeta(s)) : {};
}

export default async function Page({ params }: PageProps<"/calculator/paycheck/[state]">) {
  const s = stateBySlug((await params).state);
  if (!s) notFound();
  return (
    <ToolPage
      meta={stateToolMeta(s)}
      parent={{ name: "Paycheck Calculator", path: "/calculator/paycheck" }}
      extra={
        <>
          <StateTaxDetails state={s} />
          <AllStatesLinks current={s.slug} />
        </>
      }
    >
      <Tool stateCode={s.code} />
    </ToolPage>
  );
}
