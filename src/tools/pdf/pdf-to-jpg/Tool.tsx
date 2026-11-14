"use client";

import { useState } from "react";
import { FileTool } from "@/components/file-tool/FileTool";
import { Field, QualitySlider, Segmented } from "@/components/file-tool/controls";
import { isPdf } from "../_shared/pdf";
import { PageRangeInput } from "../_shared/PageRangeInput";
import { pdfToImages } from "./process";

export default function Tool() {
  const [dpi, setDpi] = useState("150");
  const [format, setFormat] = useState<"jpg" | "png">("jpg");
  const [quality, setQuality] = useState(90);
  const [pages, setPages] = useState("");

  return (
    <FileTool
      tool="pdf-to-jpg"
      accept=".pdf,application/pdf"
      formatsLabel="PDF"
      isAccepted={isPdf}
      actionLabel="Convert"
      optionsKey={`${dpi}|${format}|${quality}|${pages}`}
      process={(file, onProgress) =>
        pdfToImages(file, { dpi: Number(dpi), format, quality: quality / 100, pages }, onProgress)
      }
      options={
        <>
          <Field label="Image quality (resolution)" hint="150 DPI is great for screens. Use 300 DPI for printing.">
            <Segmented
              label="Resolution"
              value={dpi}
              onChange={setDpi}
              options={[
                { value: "72", label: "Low (72 DPI)" },
                { value: "150", label: "Medium (150 DPI)" },
                { value: "300", label: "High (300 DPI)" },
              ]}
            />
          </Field>
          <Field label="Format">
            <Segmented
              label="Format"
              value={format}
              onChange={setFormat}
              options={[
                { value: "jpg", label: "JPG" },
                { value: "png", label: "PNG" },
              ]}
            />
          </Field>
          {format === "jpg" && <QualitySlider value={quality} onChange={setQuality} />}
          <PageRangeInput
            label="Pages (optional)"
            value={pages}
            onChange={setPages}
            placeholder="All pages"
            hint="Leave empty to convert every page, or enter pages like 1-3, 5."
          />
        </>
      }
    />
  );
}
