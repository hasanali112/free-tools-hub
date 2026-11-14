import { useId } from "react";
import { LOGO } from "./logo-paths";

/** The "A" logo mark with the blue → violet brand gradient. */
export function LogoMark({ size = 34, className = "" }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className={className}>
      <defs>
        <linearGradient id={`la${id}`} x1="4" y1="40" x2="44" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor={LOGO.from} />
          <stop offset="1" stopColor={LOGO.to} />
        </linearGradient>
      </defs>
      <path d={LOGO.a} fill={`url(#la${id})`} />
      <path d={LOGO.bar} fill={`url(#la${id})`} opacity=".85" />
    </svg>
  );
}

/** Full logo: "A" mark + "AIToolkitFree" wordmark. `inverted` for dark backgrounds. */
export function Logo({ size = 34, inverted = false, hideTextOnMobile = false }: { size?: number; inverted?: boolean; hideTextOnMobile?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      {inverted ? (
        <span className="flex items-center justify-center rounded-xl bg-white p-1.5 shadow-lg shadow-black/20">
          <LogoMark size={size - 10} />
        </span>
      ) : (
        <LogoMark size={size} className="shrink-0" />
      )}
      <span
        className={`${hideTextOnMobile ? "hidden sm:inline" : "inline"} text-[1.4rem] leading-none font-bold tracking-tight ${
          inverted ? "text-white" : "text-ink"
        }`}
      >
        AIToolkit
        <span className={inverted ? "text-accent-300" : "text-brand-gradient"}>Free</span>
      </span>
    </span>
  );
}
