"use client";

import { useState } from "react";
import { FileTool } from "@/components/file-tool/FileTool";
import { Field, Segmented } from "@/components/file-tool/controls";
import { isPdf } from "../_shared/pdf";
import { PageRangeInput } from "../_shared/PageRangeInput";
import { splitPdf, type SplitMode } from "./process";

export default function Tool() {
  const [mode, setMode] = useState<SplitMode>("every");
  const [ranges, setRanges] = useState("");

  return (
    <FileTool
      tool="split-pdf"
      accept=".pdf,application/pdf"
      formatsLabel="PDF"
      isAccepted={isPdf}
      actionLabel="Split"
      optionsKey={`${mode}|${ranges}`}
      process={(file, onProgress) => splitPdf(file, { mode, ranges }, onProgress)}
      options={
        <>
          <Field label="How to split">
            <Segmented
              label="How to split"
              value={mode}
              onChange={setMode}
              options={[
                { value: "every", label: "Every page" },
                { value: "ranges", label: "By page ranges" },
                { value: "extract", label: "Extract pages" },
              ]}
            />
          </Field>
          {mode === "ranges" && (
            <PageRangeInput
              label="Page ranges (one PDF per range)"
              value={ranges}
              onChange={setRanges}
              placeholder="e.g. 1-3, 4-6, 7-"
            />
          )}
          {mode === "extract" && (
            <PageRangeInput label="Pages to keep (one new PDF)" value={ranges} onChange={setRanges} />
          )}
        </>
      }
    />
  );
}
