"use client";

import { useState } from "react";
import { FileTool } from "@/components/file-tool/FileTool";
import { Field, Segmented } from "@/components/file-tool/controls";
import { isVideo } from "../_shared/ffmpeg";
import { EngineNote } from "../_shared/EngineNote";
import { movToMp4, type MovMode } from "./process";

const HINTS: Record<MovMode, string> = {
  auto: "Copies the video as-is when it's already H.264 (seconds, no quality loss). iPhone HEVC videos are converted to H.264 so they play everywhere.",
  fast: "Always copies the video without re-encoding. Fastest and lossless, but HEVC videos may not play on older Windows PCs.",
  compatible: "Always re-encodes to H.264 + AAC. Plays on every device; slower.",
};

export default function Tool() {
  const [mode, setMode] = useState<MovMode>("auto");
  return (
    <FileTool
      tool="mov-to-mp4"
      accept=".mov,.qt,video/quicktime"
      formatsLabel="MOV"
      isAccepted={(f) => isVideo(f, ["mov", "qt"]) || f.type === "video/quicktime"}
      actionLabel="Convert"
      optionsKey={mode}
      process={(file, onProgress) => movToMp4(file, mode, onProgress)}
      options={
        <>
          <Field label="Conversion" hint={HINTS[mode]}>
            <Segmented
              label="Conversion"
              value={mode}
              onChange={setMode}
              options={[
                { value: "auto", label: "Auto (recommended)" },
                { value: "fast", label: "Fast copy" },
                { value: "compatible", label: "Most compatible" },
              ]}
            />
          </Field>
          <EngineNote />
        </>
      }
    />
  );
}
