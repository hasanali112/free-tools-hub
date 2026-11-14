"use client";

import { useState } from "react";
import { FileTool } from "@/components/file-tool/FileTool";
import { Field, Segmented } from "@/components/file-tool/controls";
import { isPdf } from "../_shared/pdf";
import { compressPdf, type CompressLevel } from "./process";

const HINTS: Record<CompressLevel, string> = {
  light: "Removes waste inside the file. Text stays selectable. Smaller savings.",
  medium: "Best for scans and photos. Pages become 150 DPI images — text can't be selected or searched afterwards.",
  strong: "Smallest file. Pages become 100 DPI images — fine for reading on screen, less sharp when printed.",
};

export default function Tool() {
  const [level, setLevel] = useState<CompressLevel>("medium");
  return (
    <FileTool
      tool="compress-pdf"
      accept=".pdf,application/pdf"
      formatsLabel="PDF"
      isAccepted={isPdf}
      actionLabel="Compress"
      optionsKey={level}
      process={(file, onProgress) => compressPdf(file, level, onProgress)}
      options={
        <Field label="Compression level" hint={HINTS[level]}>
          <Segmented
            label="Compression level"
            value={level}
            onChange={setLevel}
            options={[
              { value: "light", label: "Light (keep text)" },
              { value: "medium", label: "Recommended" },
              { value: "strong", label: "Strong" },
            ]}
          />
        </Field>
      }
    />
  );
}
