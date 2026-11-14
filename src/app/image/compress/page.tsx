import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { toolMetadata } from "@/lib/seo";
import { getTool } from "@/tools/registry";
import Tool from "@/tools/image/compress/Tool";

const SLUG = "compress";

export const metadata: Metadata = toolMetadata(getTool(SLUG));

export default function Page() {
  return (
    <ToolPage slug={SLUG}>
      <Tool />
    </ToolPage>
  );
}
