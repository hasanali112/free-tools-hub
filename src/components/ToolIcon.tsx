/** Simple line icons for tools and categories (24×24, stroke = currentColor). */
const P: Record<string, React.ReactNode> = {
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m21 15-4.5-4.5L8 19" />
    </>
  ),
  convert: (
    <>
      <path d="M4 8.5h13l-3.5-3.5" />
      <path d="M20 15.5H7l3.5 3.5" />
    </>
  ),
  compress: <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />,
  resize: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  imageDoc: (
    <>
      <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v5h5" />
      <path d="m8 18 3-3 2 2 3-3" />
    </>
  ),
  merge: (
    <>
      <path d="M8 7V5a2 2 0 0 1 2-2h6l4 4v10a2 2 0 0 1-2 2h-2" />
      <rect x="4" y="7" width="12" height="14" rx="2" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="6" cy="17" r="2.5" />
      <path d="M8.2 8.4 20 18M8.2 15.6 20 6" />
    </>
  ),
  shrinkDoc: (
    <>
      <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M12 9v3m0 0-2-2m2 2 2-2M12 18v-3m0 0-2 2m2-2 2 2" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M15.5 15h2.5" />
    </>
  ),
  growth: (
    <>
      <path d="M4 19h16" />
      <path d="m5 15 4-4 3 3 7-7" />
      <path d="M15 7h4v4" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-7 9 7" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M8 7h8M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h3.5" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M7.5 5v14M16.5 5v14M3 9.5h4.5M3 14.5h4.5M16.5 9.5H21M16.5 14.5H21" />
    </>
  ),
  play: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m10 9 5 3-5 3V9Z" />
    </>
  ),
  gif: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M9.5 10H8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1.5v-2H8.5M12 10v4M14.5 14v-4H17M14.5 12h2" />
    </>
  ),
  lock: (
    <path d="M16 11V7a4 4 0 1 0-8 0v4m-2 0h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
  ),
  bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />,
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="2" />
      <path d="M3 9h18M12 9v11M12 9S10.5 4 8 4.5 7 9 12 9Zm0 0s1.5-5 4-4.5S17 9 12 9Z" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 17.5h2" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
  ),
  cloudUpload: (
    <>
      <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.24" />
      <path d="M12 12v9M16 16l-4-4-4 4" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  search: <path d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />,
};

const BY_TOOL: Record<string, string> = {
  "heic-to-jpg": "convert",
  "heic-to-png": "convert",
  "png-to-jpg": "convert",
  "jpg-to-png": "convert",
  "webp-to-jpg": "convert",
  compress: "compress",
  resize: "resize",
  "remove-metadata": "shield",
  "jpg-to-pdf": "imageDoc",
  "merge-pdf": "merge",
  "split-pdf": "scissors",
  "compress-pdf": "shrinkDoc",
  "pdf-to-jpg": "image",
  paycheck: "wallet",
  "hourly-to-salary": "growth",
  mortgage: "home",
  tip: "receipt",
  overtime: "clock",
  "mov-to-mp4": "film",
  "video-compress": "play",
  "video-to-gif": "gif",
  // categories
  image: "image",
  pdf: "doc",
  calculator: "calculator",
  video: "film",
};

export function Icon({ name, className = "h-6 w-6", strokeWidth = 1.8 }: { name: string; className?: string; strokeWidth?: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {P[BY_TOOL[name] ?? name] ?? P.bolt}
    </svg>
  );
}
