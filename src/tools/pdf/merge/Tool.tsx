"use client";

import { FileTool } from "@/components/file-tool/FileTool";
import { isPdf } from "../_shared/pdf";
import { mergePdfs } from "./process";

export default function Tool() {
  return (
    <FileTool
      tool="merge-pdf"
      accept=".pdf,application/pdf"
      formatsLabel="PDF"
      isAccepted={isPdf}
      actionLabel="Merge"
      minFiles={2}
      combine={mergePdfs}
    />
  );
}
