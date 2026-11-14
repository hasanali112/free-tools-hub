import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { toolMetadata } from "@/lib/seo";
import { getTool } from "@/tools/registry";
import Tool from "@/tools/calculator/paycheck/Tool";
import { AllStatesLinks } from "@/tools/calculator/paycheck/StateTaxDetails";

const SLUG = "paycheck";

export const metadata: Metadata = toolMetadata(getTool(SLUG));

export default function Page() {
  return (
    <ToolPage slug={SLUG} extra={<AllStatesLinks />}>
      <Tool />
    </ToolPage>
  );
}
