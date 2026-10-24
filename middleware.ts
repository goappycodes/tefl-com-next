import { NextResponse, type NextRequest } from "next/server";

import { SEARCH_SEGMENT } from "@/lib/render";
import { INDEXABLE_HOSTS } from "@/lib/site";
import { WP_ORIGIN, WP_OWNED_PATH, WP_OWNED_QUERY } from "@/lib/wp";

/**
 * Edge routing in front of the catch-all WordPress route.
 *
 * 1. Hand-over to WordPress. Commerce, account, admin, assets and feeds
 *    (/cart/, /checkout/, /my-account/, /product/…, /wp-*, ?add-to-cart=…)
 *    belong to WordPress — redirect them to WP_ORIGIN with the same path and
 *    query (geo folder included). After the domain switch these paths are
 *    proxied to WordPress at the CDN, so they never reach Next at all.
 *
 * 2. Search. WordPress search lives at "/?s=…" (and "/gb/?s=…"). A query
 *    string would make the catch-all page dynamic, so rewrite it to the path
 *    "/__search/<query>/" that the route decodes back — searches then cache
 *    per query like any page.
 *
 * 3. Noindex everything that isn't the production domain (staging, Vercel
 *    previews) with X-Robots-Tag — gated by HOSTNAME, so it can never deindex
 *    the live site.
 */
const WP_HOST = new URL(WP_ORIGIN).host;
const COUNTRY_PREFIX = /^\/(gb|za|nl|ca|it|fr)(?=\/|$)/;

function withRobots(res: NextResponse, host: string): NextResponse {
  if (!INDEXABLE_HOSTS.has(host)) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  const prefix = url.pathname.match(COUNTRY_PREFIX)?.[0] ?? "";
  const bare = url.pathname.slice(prefix.length) || "/";

  // 1. WordPress-owned → WordPress (skip if WP itself is this host: no loops).
  if (host !== WP_HOST && (WP_OWNED_PATH.test(bare) || WP_OWNED_QUERY.test(url.search))) {
    return NextResponse.redirect(`${WP_ORIGIN}${url.pathname}${url.search}`, 307);
  }

  // 2. "/?s=term" → "/__search/s%3Dterm/"
  if (url.searchParams.has("s") && bare === "/") {
    const rewritten = url.clone();
    rewritten.pathname = `${prefix}/${SEARCH_SEGMENT}/${encodeURIComponent(url.search.slice(1))}/`;
    rewritten.search = "";
    return withRobots(NextResponse.rewrite(rewritten), host);
  }

  return withRobots(NextResponse.next(), host);
}

export const config = {
  // Pages only — skip Next internals, API routes and static files with an extension
  // (except .php, which is always WordPress: wp-login.php, xmlrpc.php…).
  matcher: [
    "/((?!_next/|api/|favicon\\.ico|.*\\.(?!php$)[a-zA-Z0-9]{2,5}$).*)",
    // WordPress media / assets linked root-relative from content → WordPress.
    "/:cc(gb|za|nl|ca|it|fr)?/wp-content/:path*",
    "/:cc(gb|za|nl|ca|it|fr)?/wp-includes/:path*",
  ],
};
