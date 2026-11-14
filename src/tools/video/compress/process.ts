import type { ProcessResult, ProgressFn } from "@/components/file-tool/types";
import { EVEN_SIZE, baseName, h264Args, runFFmpeg, scaleLongSide, videoBlob } from "../_shared/ffmpeg";

export type VideoLevel = "light" | "medium" | "strong" | "target";

const LEVELS = {
  light: { crf: 26, maxSide: 0, audio: 128 },
  medium: { crf: 28, maxSide: 1280, audio: 96 },
  strong: { crf: 32, maxSide: 854, audio: 64 },
} as const;

export async function compressVideo(
  file: File,
  level: VideoLevel,
  targetMB: number,
  onProgress: ProgressFn,
): Promise<ProcessResult> {
  let note = "";
  const data = await runFFmpeg(
    file,
    "out.mp4",
    ({ input, info }) => {
      const map = ["-map", "0:v:0", "-map", "0:a:0?"];
      if (level === "target") {
        if (!info.duration) throw new Error("Couldn't read this video's length, so a target size can't be used. Pick a level instead.");
        const audioK = 64;
        // Leave ~4% for container overhead.
        const videoK = Math.floor(((targetMB * 8 * 1024 * 0.96) / info.duration) - audioK);
        if (videoK < 80) throw new Error(`${targetMB} MB is too small for a ${Math.round(info.duration)}-second video. Try a bigger target or a shorter clip.`);
        const maxSide = videoK < 600 ? 854 : videoK < 1500 ? 1280 : 1920;
        note = `Target ${targetMB} MB · ~${videoK} kbps`;
        return [
          "-i", input, ...map, "-vf", scaleLongSide(maxSide),
          "-c:v", "libx264", "-preset", "veryfast", "-b:v", `${videoK}k`, "-maxrate", `${Math.round(videoK * 1.3)}k`, "-bufsize", `${videoK * 2}k`,
          "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", `${audioK}k`, "-movflags", "+faststart", "out.mp4",
        ];
      }
      const l = LEVELS[level];
      note = l.maxSide ? `Max ${l.maxSide === 1280 ? "720p" : "480p"}` : "Original resolution";
      return ["-i", input, ...map, "-vf", l.maxSide ? scaleLongSide(l.maxSide) : EVEN_SIZE, ...h264Args(l.crf, l.audio), "out.mp4"];
    },
    onProgress,
  );
  const blob = videoBlob(data, "video/mp4");
  if (blob.size >= file.size && level !== "target") {
    return { blob: file, name: file.name, note: "Already well compressed — kept original" };
  }
  return { blob, name: `${baseName(file.name)}-compressed.mp4`, note };
}
