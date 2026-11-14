"use client";

import { ConvertTool } from "../_shared/ConvertTool";

export default function Tool() {
  return (
    <ConvertTool
      tool="webp-to-jpg"
      inputExts={["webp"]}
      inputMimes={["image/webp"]}
      formatsLabel="WebP"
      outputs={["jpg", "png"]}
      defaultOutput="jpg"
      transparencyPossible
    />
  );
}
