"use client";

import { useState } from "react";
import { FileTool } from "@/components/file-tool/FileTool";
import { Field, NumberInput, Segmented } from "@/components/file-tool/controls";
import { isVideo, VIDEO_EXTS, VIDEO_MIMES } from "../_shared/ffmpeg";
import { EngineNote } from "../_shared/EngineNote";
import { compressVideo, type VideoLevel } from "./process";

const HINTS: Record<VideoLevel, string> = {
  light: "Keeps the original resolution with slightly lower quality. Good savings for phone videos.",
  medium: "Up to 720p (HD). Usually 60–90% smaller and still looks great on phones.",
  strong: "Up to 480p. Smallest files for messaging and email.",
  target: "Aim for a file size, e.g. 25 MB for Discord or email limits.",
};

export default function Tool() {
  const [level, setLevel] = useState<VideoLevel>("medium");
  const [target, setTarget] = useState(25);
  return (
    <FileTool
      tool="video-compress"
      accept={[...VIDEO_EXTS.map((e) => `.${e}`), ...VIDEO_MIMES].join(",")}
      formatsLabel="MP4, MOV, WebM, MKV, AVI"
      isAccepted={(f) => isVideo(f)}
      actionLabel="Compress"
      optionsKey={`${level}|${target}`}
      process={(file, onProgress) => compressVideo(file, level, Math.max(1, target || 0), onProgress)}
      options={
        <>
          <Field label="Compression" hint={HINTS[level]}>
            <Segmented
              label="Compression"
              value={level}
              onChange={setLevel}
              options={[
                { value: "light", label: "Light" },
                { value: "medium", label: "Recommended" },
                { value: "strong", label: "Strong" },
                { value: "target", label: "Target size" },
              ]}
            />
          </Field>
          {level === "target" && (
            <div className="max-w-48">
              <NumberInput label="Target size" value={target} onChange={setTarget} min={1} max={4000} suffix="MB" />
            </div>
          )}
          <EngineNote />
        </>
      }
    />
  );
}
