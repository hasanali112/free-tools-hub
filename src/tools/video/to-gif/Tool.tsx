"use client";

import { useState } from "react";
import { FileTool } from "@/components/file-tool/FileTool";
import { Field, NumberInput, Segmented } from "@/components/file-tool/controls";
import { isVideo, VIDEO_EXTS, VIDEO_MIMES } from "../_shared/ffmpeg";
import { EngineNote } from "../_shared/EngineNote";
import { videoToGif } from "./process";

export default function Tool() {
  const [width, setWidth] = useState("480");
  const [fps, setFps] = useState("12");
  const [start, setStart] = useState(0);
  const [duration, setDuration] = useState(5);

  return (
    <FileTool
      tool="video-to-gif"
      accept={[...VIDEO_EXTS.map((e) => `.${e}`), ...VIDEO_MIMES].join(",")}
      formatsLabel="MP4, MOV, WebM, MKV, AVI"
      isAccepted={(f) => isVideo(f)}
      actionLabel="Make GIF from"
      optionsKey={`${width}|${fps}|${start}|${duration}`}
      process={(file, onProgress) =>
        videoToGif(file, { width: Number(width), fps: Number(fps), start: Math.max(0, start || 0), duration: Math.max(0, duration || 0) }, onProgress)
      }
      options={
        <>
          <div className="grid max-w-md grid-cols-2 gap-3">
            <NumberInput label="Start at" value={start} onChange={setStart} min={0} max={36000} suffix="sec" />
            <NumberInput label="Length (0 = to end)" value={duration} onChange={setDuration} min={0} max={600} suffix="sec" />
          </div>
          <Field label="Width" hint="Smaller width and fewer frames make much smaller GIFs.">
            <Segmented
              label="Width"
              value={width}
              onChange={setWidth}
              options={[
                { value: "320", label: "Small (320px)" },
                { value: "480", label: "Medium (480px)" },
                { value: "640", label: "Large (640px)" },
              ]}
            />
          </Field>
          <Field label="Frames per second">
            <Segmented
              label="Frames per second"
              value={fps}
              onChange={setFps}
              options={[
                { value: "8", label: "8 fps" },
                { value: "12", label: "12 fps" },
                { value: "15", label: "15 fps" },
              ]}
            />
          </Field>
          <EngineNote />
        </>
      }
    />
  );
}
