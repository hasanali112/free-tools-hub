import { useId } from "react";
import { LOGO } from "./logo-paths";

/** The square logo mark: logo-gradient tile, white AI spark, cyan mini spark and a "toolkit" bar. */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className={className}>
      <defs>
        <linearGradient id={`lg${id}`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor={LOGO.from} />
          <stop offset="1" stopColor={LOGO.to} />
        </linearGradient>
        <radialGradient id={`lh${id}`} cx="12" cy="8" r="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill={`url(#lg${id})`} />
      <rect width="48" height="48" rx="13" fill={`url(#lh${id})`} />
      <path d={LOGO.spark} fill="#fff" />
      <path d={LOGO.mini} fill={LOGO.accent} />
      <rect x={LOGO.bar.x} y={LOGO.bar.y} width={LOGO.bar.w} height={LOGO.bar.h} rx={LOGO.bar.r} fill="#fff" fillOpacity=".55" />
    </svg>
  );
}

/** Full logo: mark + "AIToolkitFree" wordmark. `inverted` for dark backgrounds. */
export function Logo({ size = 36, inverted = false, hideTextOnMobile = false }: { size?: number; inverted?: boolean; hideTextOnMobile?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} className="shrink-0 drop-shadow-[0_4px_10px_rgba(101,69,234,0.35)]" />
      <span
        className={`${hideTextOnMobile ? "hidden sm:inline" : "inline"} text-[1.2rem] leading-none font-bold tracking-tight ${
          inverted ? "text-white" : "text-ink"
        }`}
      >
        AIToolkit
        <span className={inverted ? "text-accent-300" : "text-brand-gradient"}>Free</span>
      </span>
    </span>
  );
}
