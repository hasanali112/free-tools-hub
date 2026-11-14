/**
 * ffmpeg.wasm runner for the video tools (browser only).
 * - Loaded on first use; everything is self-hosted under /vendor/ffmpeg (see scripts/copy-vendor.mjs).
 * - Single-threaded core: works without special COOP/COEP headers, so ads and analytics keep working.
 * - Input files are mounted with WORKERFS (no copy into memory), output is read back as a Blob.
 */
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import type { ProgressFn } from "@/components/file-tool/types";
import { asset } from "@/lib/base-path";

const BASE = asset("/vendor/ffmpeg");
/** Browsers can't reliably handle more than this in WebAssembly memory. */
export const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024;

let loading: Promise<FFmpeg> | null = null;
let loadListener: ProgressFn | null = null;

async function downloadCore(onProgress: ProgressFn) {
  const manifest: { version: string; size: number; parts: string[] } = await fetch(`${BASE}/manifest.json`).then((r) =>
    r.json(),
  );
  const chunks: BlobPart[] = [];
  let loaded = 0;
  for (const part of manifest.parts) {
    const res = await fetch(`${BASE}/${part}?v=${manifest.version}`);
    if (!res.ok || !res.body) throw new Error("Couldn't download the video engine. Check your connection and try again.");
    const reader = res.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value as BlobPart);
      loaded += value.length;
      onProgress(Math.min(1, loaded / manifest.size));
    }
  }
  return { wasmURL: URL.createObjectURL(new Blob(chunks, { type: "application/wasm" })), version: manifest.version };
}

/** Load ffmpeg once per page (about 32 MB the first time, then cached by the browser). */
export function getFFmpeg(onProgress: ProgressFn): Promise<FFmpeg> {
  loadListener = onProgress;
  if (!loading) {
    loading = (async () => {
      const { wasmURL, version } = await downloadCore((p) => loadListener?.(p));
      const origin = location.origin;
      // Load the FFmpeg class from the self-hosted copy instead of bundling it: the bundler can't handle its
      // `new Worker(new URL(...))` call, and served as plain ES modules it finds ./worker.js next to itself.
      const mod: typeof import("@ffmpeg/ffmpeg") = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ `${origin}${BASE}/index.js?v=${version}`
      );
      const ff = new mod.FFmpeg();
      await ff.load({ coreURL: `${origin}${BASE}/ffmpeg-core.js?v=${version}`, wasmURL });
      return ff;
    })().catch((e) => {
      loading = null;
      throw e;
    });
  }
  return loading;
}

export interface MediaInfo {
  duration: number;
  videoCodec?: string;
  audioCodec?: string;
  width?: number;
  height?: number;
}

function parseTime(t: string) {
  const [h, m, s] = t.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function parseInfo(lines: string[]): MediaInfo {
  const info: MediaInfo = { duration: 0 };
  for (const l of lines) {
    const d = l.match(/Duration:\s*(\d+:\d+:\d+(?:\.\d+)?)/);
    if (d) info.duration = parseTime(d[1]);
    const v = l.match(/Stream #.*Video:\s*([a-z0-9_]+)/i);
    if (v && !info.videoCodec) {
      info.videoCodec = v[1].toLowerCase();
      const size = l.match(/,\s*(\d{2,5})x(\d{2,5})/);
      if (size) [info.width, info.height] = [Number(size[1]), Number(size[2])];
    }
    const a = l.match(/Stream #.*Audio:\s*([a-z0-9_]+)/i);
    if (a && !info.audioCodec) info.audioCodec = a[1].toLowerCase();
  }
  return info;
}

export interface JobContext {
  ff: FFmpeg;
  input: string;
  info: MediaInfo;
}

/**
 * Run one ffmpeg job on a file.
 * `buildArgs` gets the mounted input path and media info and returns ffmpeg arguments (output path last).
 * `expectedSeconds` overrides the duration used for the progress bar (e.g. when trimming).
 */
export async function runFFmpeg(
  file: File,
  output: string,
  buildArgs: (ctx: JobContext) => string[] | Promise<string[]>,
  onProgress: ProgressFn,
  expectedSeconds?: (info: MediaInfo) => number,
): Promise<Uint8Array> {
  if (file.size > MAX_VIDEO_BYTES) throw new Error("This video is larger than 2 GB, which is too big to process in a browser.");

  // 0–15%: engine download (only the first time), 15–100%: processing.
  const ff = await getFFmpeg((p) => onProgress(p * 0.15));
  onProgress(0.15);

  const dir = `/in${Date.now()}`;
  await ff.createDir(dir);
  // WORKERFS reads the File directly — the video isn't copied into WebAssembly memory.
  await ff.mount("WORKERFS" as never, { files: [file] }, dir);
  const input = `${dir}/${file.name}`;

  const logs: string[] = [];
  const onLog = ({ message }: { message: string }) => {
    logs.push(message);
    if (logs.length > 400) logs.shift();
  };
  ff.on("log", onLog);

  try {
    // Probe: "ffmpeg -i file" prints stream info and exits with an error (no output) — that's expected.
    await ff.exec(["-hide_banner", "-i", input]);
    const info = parseInfo(logs);
    if (!info.videoCodec) throw new Error("No video track was found in this file. It may be damaged or not a video.");
    const total = expectedSeconds?.(info) || info.duration;
    logs.length = 0;

    const onLogProgress = ({ message }: { message: string }) => {
      const t = message.match(/time=\s*(\d+:\d+:\d+(?:\.\d+)?)/);
      if (t && total > 0) onProgress(0.15 + 0.85 * Math.min(1, parseTime(t[1]) / total));
    };
    ff.on("log", onLogProgress);
    let code: number;
    try {
      code = await ff.exec(["-hide_banner", "-y", ...(await buildArgs({ ff, input, info }))]);
    } finally {
      ff.off("log", onLogProgress);
    }
    if (code !== 0) {
      const tail = logs.slice(-6).join(" ");
      console.error("ffmpeg failed:", tail);
      if (/memory|OOM|Aborted/i.test(tail)) throw new Error("Your device ran out of memory for this video. Try a shorter or smaller video.");
      throw new Error("This video couldn't be processed. Its format may not be supported.");
    }
    const data = (await ff.readFile(output)) as Uint8Array;
    await ff.deleteFile(output);
    onProgress(1);
    return data;
  } finally {
    ff.off("log", onLog);
    await ff.unmount(dir).catch(() => {});
    await ff.deleteDir(dir).catch(() => {});
  }
}

export function videoBlob(data: Uint8Array, type: string) {
  return new Blob([data as BlobPart], { type });
}

export const VIDEO_EXTS = ["mp4", "mov", "m4v", "webm", "mkv", "avi", "3gp", "qt"];
export const VIDEO_MIMES = ["video/mp4", "video/quicktime", "video/x-m4v", "video/webm", "video/x-matroska", "video/x-msvideo", "video/3gpp"];

export function isVideo(f: File, exts = VIDEO_EXTS) {
  const ext = (f.name.match(/\.([^.]+)$/)?.[1] || "").toLowerCase();
  return exts.includes(ext) || (exts === VIDEO_EXTS && f.type.startsWith("video/"));
}

export function baseName(name: string) {
  return name.replace(/\.[^./\\]+$/, "") || "video";
}

/** Keep the longer side at most `max` px (works for portrait phone videos too), even dimensions. */
export function scaleLongSide(max: number) {
  return `scale=w='if(gt(iw,ih),trunc(min(${max},iw)/2)*2,-2)':h='if(gt(iw,ih),-2,trunc(min(${max},ih)/2)*2)'`;
}

/** Round odd dimensions down to even numbers (required by H.264). */
export const EVEN_SIZE = "scale=trunc(iw/2)*2:trunc(ih/2)*2";

/** H.264 + AAC settings that play everywhere (iPhone, Android, Windows, web). */
export function h264Args(crf: number, audioKbps = 128, preset = "veryfast") {
  return ["-c:v", "libx264", "-preset", preset, "-crf", String(crf), "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", `${audioKbps}k`, "-movflags", "+faststart"];
}
