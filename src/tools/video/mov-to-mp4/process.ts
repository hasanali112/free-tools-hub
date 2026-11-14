import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import { EVEN_SIZE, baseName, h264Args, runFFmpeg, videoBlob } from "../_shared/ffmpeg";

export type MovMode = "auto" | "fast" | "compatible";

export async function movToMp4(file: File, mode: MovMode, onProgress: ProgressFn): Promise<ProcessResult> {
  let used: "fast" | "compatible" = "fast";
  const data = await runFFmpeg(
    file,
    "out.mp4",
    ({ input, info }) => {
      // Fast = copy the streams into an MP4 container (seconds, no quality loss).
      // H.264 copies are playable everywhere; HEVC (iPhone "High Efficiency") is re-encoded in auto mode.
      used = mode === "auto" ? (info.videoCodec === "h264" ? "fast" : "compatible") : mode;
      const map = ["-map", "0:v:0", "-map", "0:a:0?"];
      return used === "fast"
        ? ["-i", input, ...map, "-c", "copy", "-movflags", "+faststart", "out.mp4"]
        : ["-i", input, ...map, "-vf", EVEN_SIZE, ...h264Args(22), "out.mp4"];
    },
    onProgress,
  );
  return {
    blob: videoBlob(data, "video/mp4"),
    name: `${baseName(file.name)}.mp4`,
    note: used === "fast" ? "No re-encoding · original quality" : "Converted to H.264 for maximum compatibility",
  };
}
