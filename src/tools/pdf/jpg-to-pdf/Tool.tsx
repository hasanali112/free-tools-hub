"use client";

import { useState } from "react";
import { FileTool } from "@/components/file-tool/FileTool";
import { Field, Segmented } from "@/components/file-tool/controls";
import { extOf } from "@/tools/image/_shared/image";
import { imagesToPdf, type Orientation, type PageSize } from "./process";

const EXTS = ["jpg", "jpeg", "png", "webp", "heic", "heif"];
const MIMES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export default function Tool() {
  const [pageSize, setPageSize] = useState<PageSize>("letter");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [margin, setMargin] = useState("18");
  const [output, setOutput] = useState<"one" | "each">("one");

  const opts = { pageSize, orientation, margin: Number(margin) };

  return (
    <FileTool
      tool="jpg-to-pdf"
      accept={[...EXTS.map((e) => `.${e}`), ...MIMES].join(",")}
      formatsLabel="JPG, PNG, WebP, HEIC"
      isAccepted={(f) => MIMES.includes(f.type) || EXTS.includes(extOf(f.name))}
      actionLabel="Convert"
      optionsKey={JSON.stringify([opts, output])}
      combine={output === "one" ? (files, onProgress) => imagesToPdf(files, opts, onProgress) : undefined}
      process={(file, onProgress) => imagesToPdf([file], opts, onProgress)}
      options={
        <>
          <Field label="Page size">
            <Segmented
              label="Page size"
              value={pageSize}
              onChange={setPageSize}
              options={[
                { value: "letter", label: "US Letter" },
                { value: "a4", label: "A4" },
                { value: "fit", label: "Same as image" },
              ]}
            />
          </Field>
          {pageSize !== "fit" && (
            <Field label="Orientation">
              <Segmented
                label="Orientation"
                value={orientation}
                onChange={setOrientation}
                options={[
                  { value: "auto", label: "Auto" },
                  { value: "portrait", label: "Portrait" },
                  { value: "landscape", label: "Landscape" },
                ]}
              />
            </Field>
          )}
          <Field label="Margin">
            <Segmented
              label="Margin"
              value={margin}
              onChange={setMargin}
              options={[
                { value: "0", label: "None" },
                { value: "18", label: "Small" },
                { value: "36", label: "Large" },
              ]}
            />
          </Field>
          <Field label="Output">
            <Segmented
              label="Output"
              value={output}
              onChange={setOutput}
              options={[
                { value: "one", label: "One PDF with all images" },
                { value: "each", label: "One PDF per image" },
              ]}
            />
          </Field>
        </>
      }
    />
  );
}
