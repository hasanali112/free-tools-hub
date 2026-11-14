// Copies browser files that must be served as standalone URLs (Web Workers, fonts, wasm)
// into /public/vendor so nothing is loaded from third-party CDNs at runtime.
import { copyFileSync, cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

mkdirSync("public/vendor/pdfjs", { recursive: true });
copyFileSync(
  "node_modules/browser-image-compression/dist/browser-image-compression.js",
  "public/vendor/browser-image-compression.js",
);
const pdfjs = "node_modules/pdfjs-dist";
copyFileSync(`${pdfjs}/legacy/build/pdf.worker.min.mjs`, "public/vendor/pdfjs/pdf.worker.min.mjs");
for (const dir of ["cmaps", "standard_fonts", "wasm", "iccs"]) {
  cpSync(`${pdfjs}/${dir}`, `public/vendor/pdfjs/${dir}`, { recursive: true });
}
// ffmpeg.wasm (video tools). The worker + its ES modules are self-hosted, and the 32 MB core
// .wasm is split into parts because Cloudflare Pages rejects files over 25 MiB.
// The browser downloads the parts and joins them (src/tools/video/_shared/ffmpeg.ts).
mkdirSync("public/vendor/ffmpeg", { recursive: true });
const ffDist = "node_modules/@ffmpeg/ffmpeg/dist/esm";
for (const f of readdirSync(ffDist).filter((f) => f.endsWith(".js"))) {
  copyFileSync(`${ffDist}/${f}`, `public/vendor/ffmpeg/${f}`);
}
copyFileSync("node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js", "public/vendor/ffmpeg/ffmpeg-core.js");
const wasm = readFileSync("node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm");
const PART = 20 * 1024 * 1024;
const parts = [];
for (let i = 0, n = 0; i < wasm.length; i += PART, n++) {
  const name = `ffmpeg-core-${n}.wasm`;
  writeFileSync(`public/vendor/ffmpeg/${name}`, wasm.subarray(i, i + PART));
  parts.push(name);
}
const coreVersion = JSON.parse(readFileSync("node_modules/@ffmpeg/core/package.json", "utf8")).version;
writeFileSync("public/vendor/ffmpeg/manifest.json", JSON.stringify({ version: coreVersion, size: wasm.length, parts }));

console.log("vendor files copied");
