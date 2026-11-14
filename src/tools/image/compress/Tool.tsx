"use client";

import { useState } from "react";
import { FileTool } from "@/components/file-tool/FileTool";
import { Field, NumberInput, QualitySlider, Segmented } from "@/components/file-tool/controls";
import { extOf } from "../_shared/image";
import { compressImage, type CompressOutput } from "./process";

type Mode = "100" | "200" | "500" | "custom" | "quality";

const EXTS = ["jpg", "jpeg", "png", "webp"];
const MIMES = ["image/jpeg", "image/png", "image/webp"];

export default function Tool() {
  const [mode, setMode] = useState<Mode>("200");
  const [customKB, setCustomKB] = useState(300);
  const [quality, setQuality] = useState(80);
  const [output, setOutput] = useState<CompressOutput>("same");

  const targetKB = mode === "quality" ? 0 : mode === "custom" ? Math.max(10, customKB) : Number(mode);

  return (
    <FileTool
      tool="compress"
      accept={[...EXTS.map((e) => `.${e}`), ...MIMES].join(",")}
      formatsLabel="JPG, PNG, WebP"
      isAccepted={(f) => MIMES.includes(f.type) || EXTS.includes(extOf(f.name))}
      actionLabel="Compress"
      optionsKey={`${targetKB}|${quality}|${output}`}
      process={(file, onProgress) => compressImage(file, { targetKB, quality: quality / 100, output }, onProgress)}
      options={
        <>
          <Field label="Compress to">
            <Segmented
              label="Target size"
              value={mode}
              onChange={setMode}
              options={[
                { value: "100", label: "100KB" },
                { value: "200", label: "200KB" },
                { value: "500", label: "500KB" },
                { value: "custom", label: "Custom size" },
                { value: "quality", label: "By quality" },
              ]}
            />
          </Field>
          {mode === "custom" && (
            <div className="max-w-48">
              <NumberInput label="Target size" value={customKB} onChange={setCustomKB} min={10} max={50000} suffix="KB" />
            </div>
          )}
          {mode === "quality" && <QualitySlider value={quality} onChange={setQuality} />}
          <Field label="Output format" hint="JPG gives the smallest files for photos. PNG stays lossless.">
            <Segmented
              label="Output format"
              value={output}
              onChange={setOutput}
              options={[
                { value: "same", label: "Same as original" },
                { value: "jpg", label: "JPG" },
                { value: "webp", label: "WebP" },
              ]}
            />
          </Field>
        </>
      }
    />
  );
}
