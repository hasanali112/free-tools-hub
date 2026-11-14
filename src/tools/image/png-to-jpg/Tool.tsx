"use client";

import { ConvertTool } from "../_shared/ConvertTool";

export default function Tool() {
  return (
    <ConvertTool
      tool="png-to-jpg"
      inputExts={["png"]}
      inputMimes={["image/png"]}
      formatsLabel="PNG"
      outputs={["jpg"]}
      defaultOutput="jpg"
      transparencyPossible
    />
  );
}
