"use client";

import { FileTool } from "@/components/file-tool/FileTool";
import { extOf } from "../_shared/image";
import { removeMetadata } from "./process";

const EXTS = ["jpg", "jpeg", "png", "webp", "heic", "heif"];
const MIMES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export default function Tool() {
  return (
    <FileTool
      tool="remove-metadata"
      accept={[...EXTS.map((e) => `.${e}`), ...MIMES].join(",")}
      formatsLabel="JPG, PNG, WebP, HEIC"
      isAccepted={(f) => MIMES.includes(f.type) || EXTS.includes(extOf(f.name))}
      actionLabel="Remove metadata from"
      process={removeMetadata}
    />
  );
}
