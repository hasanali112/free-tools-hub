export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let v = bytes / 1024;
  let u = 0;
  while (v >= 1024 && u < units.length - 1) {
    v /= 1024;
    u++;
  }
  return `${v >= 100 ? Math.round(v) : v.toFixed(1)} ${units[u]}`;
}

/** Percentage change from `before` to `after`, e.g. "-64%" or "+12%". */
export function sizeChange(before: number, after: number) {
  if (!before) return "";
  const pct = Math.round(((after - before) / before) * 100);
  return pct === 0 ? "same size" : `${pct > 0 ? "+" : ""}${pct}%`;
}

const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usd2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** $1,234.56 (or $1,235 with `whole`). */
export function money(n: number, whole = false) {
  return (whole ? usd0 : usd2).format(Number.isFinite(n) ? n : 0);
}

export function percent(n: number, digits = 1) {
  return `${(Number.isFinite(n) ? n * 100 : 0).toFixed(digits)}%`;
}

/** Treat empty/invalid number inputs as 0. */
export function num(n: number) {
  return Number.isFinite(n) ? n : 0;
}
