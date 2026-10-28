/**
 * Public / front-facing origin — the domain in the visitor's address bar.
 *
 * Counterpart to `lib/wp.ts`'s `WP_ORIGIN` (the WordPress *backend*). Keep the
 * two separate: during the parallel run the front is a staging host (e.g.
 * https://next.teflinstitute.com) and the backend is https://teflinstitute.com;
 * at the domain switch Next takes over teflinstitute.com and WordPress moves to
 * its own subdomain. Both flip via env, not code:
 *
 *   NEXT_PUBLIC_SITE_ORIGIN = https://teflinstitute.com        # front  (this file)
 *   NEXT_PUBLIC_WP_ORIGIN   = https://cms.teflinstitute.com    # backend (lib/wp.ts)
 *
 * Use `SITE_ORIGIN` only for absolute front URLs that must name the domain
 * (sitemaps, robots). The rendered pages keep WordPress' own canonical /
 * hreflang URLs, which already name https://teflinstitute.com.
 */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN && process.env.NEXT_PUBLIC_SITE_ORIGIN.length > 0
    ? process.env.NEXT_PUBLIC_SITE_ORIGIN
    : "https://teflinstitute.com"
).replace(/\/$/, "");

/** Absolute-ise a site-relative path against the front origin. */
export function siteUrl(path = "/"): string {
  return `${SITE_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Launch switch for search engines. Until `ALLOW_INDEXING=1` is set (Vercel
 * Production only, at the cutover), every page on every host is noindex —
 * X-Robots-Tag from middleware AND the HTML's meta robots (components/WpHead.tsx)
 * — so attaching teflinstitute.com to the project early can't index anything.
 * Forgetting it at launch noindexes the live site: it's on the cutover checklist.
 */
export const INDEXING_ALLOWED = process.env.ALLOW_INDEXING === "1";

/** Hosts allowed in search engines once INDEXING_ALLOWED. Everything else (staging, previews) gets noindex. */
export const INDEXABLE_HOSTS = new Set(["teflinstitute.com", "www.teflinstitute.com"]);

/** The robots directive for non-indexable responses. */
export const NOINDEX = "noindex, nofollow";
