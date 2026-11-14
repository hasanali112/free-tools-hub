import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import { asset } from "@/lib/base-path";
import { formatBytes } from "@/lib/format";
import { replaceExt, sniffType } from "../_shared/image";

export type CompressOutput = "same" | "jpg" | "webp";

export interface CompressOptions {
  /** Target size in KB. 0 = no target, use `quality` only. */
  targetKB: number;
  /** 0–1 */
  quality: number;
  output: CompressOutput;
}

const OUT_MIME = { jpg: "image/jpeg", webp: "image/webp" } as const;
const MIME_EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function compressImage(file: File, opts: CompressOptions, onProgress: ProgressFn): Promise<ProcessResult> {
  const { default: imageCompression } = await import("browser-image-compression");
  const inputType = await sniffType(file);
  if (!MIME_EXT[inputType]) throw new Error("Only JPG, PNG and WebP images can be compressed.");
  const fileType = opts.output === "same" ? inputType : OUT_MIME[opts.output];
  const targetBytes = opts.targetKB * 1024;

  // Already small enough and no format change: keep the original untouched.
  if (targetBytes && file.size <= targetBytes && fileType === inputType) {
    return { blob: file, name: file.name, note: `Already under ${opts.targetKB}KB — kept original` };
  }

  const out = await imageCompression(file, {
    maxSizeMB: targetBytes ? targetBytes / 1024 / 1024 : undefined,
    initialQuality: targetBytes ? Math.min(opts.quality, 0.9) : opts.quality,
    fileType,
    maxIteration: 30,
    useWebWorker: true,
    // Self-hosted copy (see scripts/copy-vendor.mjs) so the worker doesn't load code from a CDN.
    libURL: `${location.origin}${asset("/vendor/browser-image-compression.js")}`,
    preserveExif: false,
    onProgress: (p) => onProgress(p / 100),
  });

  if (fileType === "image/webp" && out.type !== "image/webp") {
    throw new Error("Your browser can't save WebP files. Choose JPG instead.");
  }

  const name = replaceExt(file.name, MIME_EXT[out.type] || MIME_EXT[fileType]);
  if (out.size >= file.size && fileType === inputType) {
    return { blob: file, name: file.name, note: "Already well compressed — kept original" };
  }
  const note =
    targetBytes && out.size > targetBytes
      ? `Couldn't reach ${opts.targetKB}KB (smallest: ${formatBytes(out.size)}) — try JPG output`
      : undefined;
  return { blob: out, name, note };
}
