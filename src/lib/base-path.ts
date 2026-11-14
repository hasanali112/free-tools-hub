/**
 * Base path when the site is served from a sub-folder (e.g. GitHub Pages: https://user.github.io/<repo>/).
 * Empty on a custom domain. Set NEXT_PUBLIC_BASE_PATH at build time (see next.config.ts).
 * Next.js adds it to <Link> and page assets automatically; use `asset()` for files we fetch at runtime.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

export function asset(path: string) {
  return `${BASE_PATH}${path}`;
}
