import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import { convertImage, sniffType } from "../_shared/image";
import { stripJpeg, stripPng, stripWebp, type StripResult } from "./strip";

export async function removeMetadata(file: File, onProgress: ProgressFn): Promise<ProcessResult> {
  const type = await sniffType(file);
  const strip = { "image/jpeg": stripJpeg, "image/png": stripPng, "image/webp": stripWebp }[type];

  if (!strip) {
    // HEIC and other formats: re-encoding through a canvas drops all metadata.
    const res = await convertImage(file, { format: "jpg", quality: 0.95 }, onProgress);
    return { ...res, note: "Converted to JPG · all metadata removed" };
  }

  const input = new Uint8Array(await file.arrayBuffer());
  onProgress(0.5);
  let out: StripResult;
  try {
    out = strip(input);
  } catch {
    // Unusual file structure: fall back to a high-quality re-encode, which also drops metadata.
    const ext = type === "image/png" ? "png" : "jpg";
    const res = await convertImage(file, { format: ext, quality: 0.95 }, onProgress);
    return { ...res, name: file.name, note: "Re-saved · all metadata removed" };
  }
  onProgress(1);
  return {
    blob: new Blob([out.bytes], { type }),
    name: file.name,
    note: out.hadGps ? "GPS location removed ✓" : out.hadMetadata ? "Metadata removed ✓" : "No metadata found",
  };
}
