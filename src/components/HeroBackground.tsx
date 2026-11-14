/** Soft blue (top-left) and violet (bottom-right) waves behind the home hero. */
export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#edeefe_0%,#f4f3fe_45%,#f7f7fd_100%)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hb-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5b8cff" stopOpacity=".75" />
            <stop offset=".55" stopColor="#8fb3ff" stopOpacity=".45" />
            <stop offset="1" stopColor="#c9dbff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hb-blue2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".85" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hb-violet" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#7c4dff" stopOpacity=".7" />
            <stop offset=".5" stopColor="#a78bfa" stopOpacity=".4" />
            <stop offset="1" stopColor="#e9e2ff" stopOpacity="0" />
          </linearGradient>
          <filter id="hb-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {/* top-left blue waves */}
        <path d="M0 0H560C470 70 380 150 300 250C220 350 110 420 0 470Z" fill="url(#hb-blue)" filter="url(#hb-soft)" />
        <path d="M0 0H330C270 70 200 150 130 240C90 290 45 330 0 360Z" fill="url(#hb-blue2)" opacity=".55" />
        <path d="M0 250C80 210 170 150 250 70C280 40 300 20 320 0H360C320 60 250 150 160 230C110 270 55 300 0 320Z" fill="#ffffff" opacity=".35" />
        {/* bottom-right violet waves */}
        <path d="M1440 330C1360 380 1290 470 1210 570C1130 670 1030 750 920 820H1440Z" fill="url(#hb-violet)" filter="url(#hb-soft)" />
        <path d="M1440 470C1380 520 1330 600 1260 680C1220 725 1180 770 1130 820H1180C1230 770 1280 715 1330 650C1370 600 1400 560 1440 530Z" fill="#ffffff" opacity=".4" />
      </svg>
      <div className="absolute top-1/3 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
      {/* fade into the page background so the waves never end in a hard edge */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#f7f7fd]" />
    </div>
  );
}
