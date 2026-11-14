import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { toolMetadata } from "@/lib/seo";
import { getTool } from "@/tools/registry";
import Tool from "@/tools/image/remove-metadata/Tool";

const SLUG = "remove-metadata";

export const metadata: Metadata = toolMetadata(getTool(SLUG));

export default function Page() {
  return (
    <ToolPage slug={SLUG}>
      <Tool />
    </ToolPage>
  );
}
