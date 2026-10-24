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

/** Hosts allowed in search engines. Everything else (staging, previews) gets noindex. */
export const INDEXABLE_HOSTS = new Set(["teflinstitute.com", "www.teflinstitute.com"]);
