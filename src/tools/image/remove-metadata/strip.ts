/**
 * Lossless metadata removal. Image pixels are copied byte-for-byte; only metadata blocks are dropped.
 *  - JPEG: removes EXIF/XMP (APP1), IPTC (APP13), other APPn, comments and trailing data
 *          (e.g. embedded preview images). Keeps the ICC color profile and, if the photo is rotated,
 *          writes back a tiny EXIF block with only the orientation so it still displays upright.
 *  - PNG:  removes tEXt, zTXt, iTXt, eXIf and tIME chunks.
 *  - WebP: removes EXIF and XMP chunks.
 */

export interface StripResult {
  bytes: Uint8Array<ArrayBuffer>;
  hadMetadata: boolean;
  hadGps: boolean;
}

/* ---------- EXIF (TIFF) parsing: only what we need ---------- */

interface ExifInfo {
  /** 0 when the tag is absent. */
  orientation: number;
  hasGps: boolean;
}

function readTiff(view: DataView, start: number, end: number): ExifInfo {
  const info: ExifInfo = { orientation: 0, hasGps: false };
  if (end - start < 8) return info;
  const order = view.getUint16(start);
  const le = order === 0x4949; // "II"
  if (!le && order !== 0x4d4d) return info;
  const u16 = (o: number) => view.getUint16(o, le);
  const u32 = (o: number) => view.getUint32(o, le);
  const ifd0 = start + u32(start + 4);
  if (ifd0 + 2 > end) return info;
  const count = u16(ifd0);
  for (let i = 0; i < count; i++) {
    const entry = ifd0 + 2 + i * 12;
    if (entry + 12 > end) break;
    const tag = u16(entry);
    if (tag === 0x0112) info.orientation = u16(entry + 8);
    if (tag === 0x8825) {
      // GPS IFD pointer: only count it if the GPS IFD actually has entries.
      const gps = start + u32(entry + 8);
      info.hasGps = gps + 2 <= end && u16(gps) > 0;
    }
  }
  return info;
}

function minimalOrientationApp1(orientation: number) {
  // "Exif\0\0" + big-endian TIFF header + IFD0 with one SHORT entry (0x0112) + next-IFD = 0
  const payload = [
    0x45, 0x78, 0x69, 0x66, 0x00, 0x00,
    0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08,
    0x00, 0x01,
    0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, orientation & 0xff, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
  ];
  const len = payload.length + 2;
  return new Uint8Array([0xff, 0xe1, len >> 8, len & 0xff, ...payload]);
}

const ascii = (b: Uint8Array, at: number, n: number) => String.fromCharCode(...b.subarray(at, at + n));

/* ---------- JPEG ---------- */

export function stripJpeg(input: Uint8Array): StripResult {
  const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
  const keep: Uint8Array[] = [input.subarray(0, 2)]; // SOI
  let hadMetadata = false;
  let hadGps = false;
  let orientation = 0;
  let insertAt = 1; // after SOI, or after APP0/JFIF if present
  let i = 2;

  while (i + 4 <= input.length) {
    if (input[i] !== 0xff) throw new Error("This JPEG file looks damaged.");
    const marker = input[i + 1];
    if (marker === 0xff) {
      i++; // fill byte
      continue;
    }
    if (marker === 0xda) {
      // Start of scan: copy image data up to and including the first EOI, drop anything after it.
      let end = input.length;
      for (let j = i + 2; j < input.length - 1; j++) {
        if (input[j] === 0xff && input[j + 1] === 0xd9) {
          end = j + 2;
          break;
        }
      }
      if (end < input.length) hadMetadata = true;
      keep.push(input.subarray(i, end));
      break;
    }
    const len = view.getUint16(i + 2);
    const seg = input.subarray(i, i + 2 + len);
    const isApp = marker >= 0xe0 && marker <= 0xef;
    let drop = false;

    if (marker === 0xe1) {
      drop = true;
      if (ascii(seg, 4, 6) === "Exif\0\0") {
        const info = readTiff(view, i + 10, i + 2 + len);
        if (!orientation) orientation = info.orientation;
        hadGps ||= info.hasGps;
      }
    } else if (marker === 0xe2) {
      drop = ascii(seg, 4, 12) !== "ICC_PROFILE\0"; // keep color profile, drop MPF/FlashPix
    } else if (isApp && marker !== 0xe0 && marker !== 0xee) {
      drop = true; // APP3–APP13, APP15 (IPTC/Photoshop, vendor data). APP14 Adobe is kept.
    } else if (marker === 0xfe) {
      drop = true; // comment
    }

    if (drop) hadMetadata = true;
    else {
      keep.push(seg);
      if (marker === 0xe0) insertAt = keep.length;
    }
    i += 2 + len;
  }

  if (orientation > 1 && orientation <= 8) keep.splice(insertAt, 0, minimalOrientationApp1(orientation));
  return { bytes: concat(keep), hadMetadata, hadGps };
}

/* ---------- PNG ---------- */

const PNG_DROP = new Set(["tEXt", "zTXt", "iTXt", "eXIf", "tIME"]);

export function stripPng(input: Uint8Array): StripResult {
  const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
  const keep: Uint8Array[] = [input.subarray(0, 8)];
  let hadMetadata = false;
  let hadGps = false;
  let i = 8;
  while (i + 12 <= input.length) {
    const len = view.getUint32(i);
    const type = ascii(input, i + 4, 4);
    const end = i + 12 + len;
    if (PNG_DROP.has(type)) {
      hadMetadata = true;
      if (type === "eXIf") hadGps ||= readTiff(view, i + 8, i + 8 + len).hasGps;
      if (type === "iTXt" && /GPSLatitude|GPSLongitude/.test(ascii(input, i + 8, Math.min(len, 65536)))) hadGps = true;
    } else {
      keep.push(input.subarray(i, end));
    }
    i = end;
    if (type === "IEND") break;
  }
  return { bytes: concat(keep), hadMetadata, hadGps };
}

/* ---------- WebP ---------- */

export function stripWebp(input: Uint8Array): StripResult {
  const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
  const chunks: Uint8Array[] = [];
  let hadMetadata = false;
  let hadGps = false;
  let i = 12;
  while (i + 8 <= input.length) {
    const type = ascii(input, i, 4);
    const size = view.getUint32(i + 4, true);
    const end = Math.min(input.length, i + 8 + size + (size & 1));
    if (type === "EXIF" || type === "XMP ") {
      hadMetadata = true;
      if (type === "EXIF") {
        let t = i + 8;
        if (ascii(input, t, 6) === "Exif\0\0") t += 6;
        hadGps ||= readTiff(view, t, i + 8 + size).hasGps;
      } else if (/GPSLatitude|GPSLongitude/.test(ascii(input, i + 8, Math.min(size, 65536)))) {
        hadGps = true;
      }
    } else {
      const chunk = input.slice(i, end);
      if (type === "VP8X") chunk[8] &= ~(0x08 | 0x04); // clear EXIF + XMP flags
      chunks.push(chunk);
    }
    i = end;
  }
  const body = concat(chunks);
  const header = new Uint8Array(12);
  header.set(input.subarray(0, 4), 0); // "RIFF"
  new DataView(header.buffer).setUint32(4, body.length + 4, true);
  header.set(input.subarray(8, 12), 8); // "WEBP"
  return { bytes: concat([header, body]), hadMetadata, hadGps };
}

function concat(parts: Uint8Array[]) {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}
