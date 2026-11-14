"use client";

import { useState } from "react";
import { FileTool } from "@/components/file-tool/FileTool";
import { ColorField, Field, QualitySlider, Segmented } from "@/components/file-tool/controls";
import { convertImage, extOf, type OutputFormat } from "./image";

const LABEL: Record<OutputFormat, string> = { jpg: "JPG", png: "PNG", webp: "WebP" };

export interface ConvertToolProps {
  tool: string;
  /** Accepted input extensions without dot, e.g. ["heic", "heif"]. */
  inputExts: string[];
  /** Accepted input MIME types, e.g. ["image/heic"]. */
  inputMimes: string[];
  formatsLabel: string;
  outputs: OutputFormat[];
  defaultOutput: OutputFormat;
  /** Show background color option (for inputs that can be transparent). */
  transparencyPossible?: boolean;
}

/** Generic "format A → format B" converter used by several image tools. */
export function ConvertTool({
  tool,
  inputExts,
  inputMimes,
  formatsLabel,
  outputs,
  defaultOutput,
  transparencyPossible,
}: ConvertToolProps) {
  const [format, setFormat] = useState<OutputFormat>(defaultOutput);
  const [quality, setQuality] = useState(92);
  const [background, setBackground] = useState("#ffffff");

  const accept = [...inputExts.map((e) => `.${e}`), ...inputMimes].join(",");
  const isAccepted = (f: File) => inputMimes.includes(f.type) || inputExts.includes(extOf(f.name));

  return (
    <FileTool
      tool={tool}
      accept={accept}
      formatsLabel={formatsLabel}
      isAccepted={isAccepted}
      actionLabel="Convert"
      optionsKey={`${format}|${quality}|${background}`}
      process={(file, onProgress) =>
        convertImage(file, { format, quality: quality / 100, background: format === "jpg" ? background : undefined }, onProgress)
      }
      options={
        <>
          {outputs.length > 1 && (
            <Field label="Convert to">
              <Segmented
                label="Output format"
                value={format}
                onChange={setFormat}
                options={outputs.map((o) => ({ value: o, label: LABEL[o] }))}
              />
            </Field>
          )}
          {format !== "png" && <QualitySlider value={quality} onChange={setQuality} />}
          {transparencyPossible && format === "jpg" && (
            <ColorField label="Background for transparent areas" value={background} onChange={setBackground} />
          )}
        </>
      }
    />
  );
}
