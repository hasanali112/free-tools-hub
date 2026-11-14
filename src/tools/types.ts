export type CategorySlug = "image" | "pdf" | "video" | "calculator";

export interface Faq {
  q: string;
  a: string;
}

/** Everything the site needs to know about a tool, except its UI. Keep this file free of heavy imports. */
export interface ToolMeta {
  /** Unique id, also the last URL segment. */
  slug: string;
  category: CategorySlug;
  /** Full path, e.g. "/image/heic-to-jpg". */
  path: string;
  /** Short name used in menus and cards. */
  name: string;
  /** H1 on the tool page (contains the main keyword). */
  h1: string;
  /** <title> tag (site name is appended automatically). */
  title: string;
  /** Meta description, ~150 characters. */
  description: string;
  /** One-line summary under the H1 and on cards. */
  summary: string;
  /** Extra words for the home page search box. */
  keywords: string[];
  howTo: [string, string, string];
  faqs: Faq[];
  /** Slugs of related tools for internal linking. */
  related: string[];
  /** Set to false to hide ads on this tool page. */
  ads?: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  title: string;
  description: string;
}
