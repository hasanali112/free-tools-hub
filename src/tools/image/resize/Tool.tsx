"use client";

import { useState } from "react";
import { FileTool } from "@/components/file-tool/FileTool";
import { ColorField, Field, NumberInput, QualitySlider, Segmented } from "@/components/file-tool/controls";
import { extOf, type OutputFormat } from "../_shared/image";
import { PRESETS, type Fit } from "./presets";
import { resizeImage, type ResizeSpec } from "./process";

const EXTS = ["jpg", "jpeg", "png", "webp", "heic", "heif"];
const MIMES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const GROUPS = [...new Set(PRESETS.map((p) => p.group))];

type CustomKind = "exact" | "width" | "percent";

export default function Tool() {
  const [presetId, setPresetId] = useState<string>("custom");
  const [kind, setKind] = useState<CustomKind>("exact");
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [percent, setPercent] = useState(50);
  const [fit, setFit] = useState<Fit>("crop");
  const [format, setFormat] = useState<OutputFormat | "same">("same");
  const [quality, setQuality] = useState(92);
  const [background, setBackground] = useState("#ffffff");

  const preset = PRESETS.find((p) => p.id === presetId);
  const spec: ResizeSpec = preset
    ? { kind: "exact", width: preset.width, height: preset.height, fit }
    : kind === "exact"
      ? { kind, width: Math.max(1, width), height: Math.max(1, height), fit }
      : kind === "width"
        ? { kind, width: Math.max(1, width) }
        : { kind, percent: Math.max(1, Math.min(400, percent)) };
  const outFormat = preset ? "jpg" : format;
  const showFit = spec.kind === "exact";

  return (
    <FileTool
      tool="resize"
      accept={[...EXTS.map((e) => `.${e}`), ...MIMES].join(",")}
      formatsLabel="JPG, PNG, WebP, HEIC"
      isAccepted={(f) => MIMES.includes(f.type) || EXTS.includes(extOf(f.name))}
      actionLabel="Resize"
      optionsKey={JSON.stringify([spec, outFormat, quality, background])}
      process={(file, onProgress) =>
        resizeImage(file, { spec, format: outFormat, quality: quality / 100, maxKB: preset?.maxKB, background }, onProgress)
      }
      options={
        <>
          <Field label="Size preset" hint={preset?.hint}>
            <select
              value={presetId}
              onChange={(e) => {
                setPresetId(e.target.value);
                setFit("crop");
              }}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="custom">Custom size</option>
              {GROUPS.map((g) => (
                <optgroup key={g} label={g}>
                  {PRESETS.filter((p) => p.group === g).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>

          {!preset && (
            <>
              <Field label="Resize by">
                <Segmented
                  label="Resize by"
                  value={kind}
                  onChange={setKind}
                  options={[
                    { value: "exact", label: "Exact size" },
                    { value: "width", label: "Width (keep ratio)" },
                    { value: "percent", label: "Percentage" },
                  ]}
                />
              </Field>
              <div className="grid max-w-md grid-cols-2 gap-3">
                {kind !== "percent" && <NumberInput label="Width" value={width} onChange={setWidth} suffix="px" />}
                {kind === "exact" && <NumberInput label="Height" value={height} onChange={setHeight} suffix="px" />}
                {kind === "percent" && (
                  <NumberInput label="Scale" value={percent} onChange={setPercent} max={400} suffix="%" />
                )}
              </div>
            </>
          )}

          {showFit && (
            <Field
              label="How to fit"
              hint={
                fit === "crop"
                  ? "Fills the whole size and trims the edges from the center."
                  : fit === "fit"
                    ? "Keeps the whole image and adds a border."
                    : "Forces the exact size; the image may look squashed."
              }
            >
              <Segmented
                label="How to fit"
                value={fit}
                onChange={setFit}
                options={[
                  { value: "crop", label: "Crop to fill" },
                  { value: "fit", label: "Fit inside" },
                  { value: "stretch", label: "Stretch" },
                ]}
              />
            </Field>
          )}

          {!preset && (
            <Field label="Output format">
              <Segmented
                label="Output format"
                value={format}
                onChange={setFormat}
                options={[
                  { value: "same", label: "Same as original" },
                  { value: "jpg", label: "JPG" },
                  { value: "png", label: "PNG" },
                  { value: "webp", label: "WebP" },
                ]}
              />
            </Field>
          )}
          {outFormat !== "png" && !preset?.maxKB && <QualitySlider value={quality} onChange={setQuality} />}
          {(fit === "fit" && showFit) || outFormat === "jpg" ? (
            <ColorField label="Background / border color" value={background} onChange={setBackground} />
          ) : null}
        </>
      }
    />
  );
}
