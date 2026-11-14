/** Run `cb` after the page has fully loaded and the browser is idle — used for ads and other non-critical scripts. */
export function whenIdle(cb: () => void) {
  let cancelled = false;
  let idleId: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const run = () => {
    if (cancelled) return;
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(() => !cancelled && cb(), { timeout: 4000 });
    else timer = setTimeout(() => !cancelled && cb(), 1500);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timer) clearTimeout(timer);
  };
}

export function injectScript(src: string, parent: HTMLElement = document.body, attrs: Record<string, string> = {}) {
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  parent.appendChild(s);
  return s;
}
