"use client";

import { ConvertTool } from "../_shared/ConvertTool";

export default function Tool() {
  return (
    <ConvertTool
      tool="jpg-to-png"
      inputExts={["jpg", "jpeg", "jfif"]}
      inputMimes={["image/jpeg", "image/pjpeg"]}
      formatsLabel="JPG, JPEG"
      outputs={["png"]}
      defaultOutput="png"
    />
  );
}
