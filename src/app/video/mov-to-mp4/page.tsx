import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { toolMetadata } from "@/lib/seo";
import { getTool } from "@/tools/registry";
import Tool from "@/tools/video/mov-to-mp4/Tool";

const SLUG = "mov-to-mp4";

export const metadata: Metadata = toolMetadata(getTool(SLUG));

export default function Page() {
  return (
    <ToolPage slug={SLUG}>
      <Tool />
    </ToolPage>
  );
}
