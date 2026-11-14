"use client";

import { ConvertTool } from "../_shared/ConvertTool";

export default function Tool() {
  return (
    <ConvertTool
      tool="heic-to-jpg"
      inputExts={["heic", "heif"]}
      inputMimes={["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"]}
      formatsLabel="HEIC, HEIF"
      outputs={["jpg", "png"]}
      defaultOutput="jpg"
    />
  );
}
