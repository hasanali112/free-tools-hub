import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import { baseName, runFFmpeg, videoBlob } from "../_shared/ffmpeg";

export interface GifOptions {
  width: number;
  fps: number;
  start: number;
  /** Seconds; 0 = to the end. */
  duration: number;
}

export async function videoToGif(file: File, o: GifOptions, onProgress: ProgressFn): Promise<ProcessResult> {
  let seconds = 0;
  const data = await runFFmpeg(
    file,
    "out.gif",
    ({ input, info }) => {
      if (info.duration && o.start >= info.duration) {
        throw new Error(`The video is only ${info.duration.toFixed(1)} seconds long — choose an earlier start time.`);
      }
      seconds = o.duration || Math.max(0, info.duration - o.start);
      // Two-step palette (generated for this clip) gives much better GIF colors than the default.
      const filter =
        `fps=${o.fps},scale=${o.width}:-2:flags=lanczos,split[a][b];` +
        `[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`;
      return [
        ...(o.start > 0 ? ["-ss", String(o.start)] : []),
        ...(o.duration > 0 ? ["-t", String(o.duration)] : []),
        "-i", input, "-filter_complex", filter, "-loop", "0", "out.gif",
      ];
    },
    onProgress,
    (info) => (o.duration ? Math.min(o.duration, Math.max(0, info.duration - o.start)) : Math.max(0, info.duration - o.start)),
  );
  return {
    blob: videoBlob(data, "image/gif"),
    name: `${baseName(file.name)}.gif`,
    note: `${o.width}px · ${o.fps} fps${seconds ? ` · ${seconds.toFixed(1)} s` : ""}`,
  };
}
