import { NextResponse, type NextRequest } from "next/server";

import {
  AFF_CAMPAIGN_COOKIE,
  AFF_CAMPAIGN_PARAM,
  AFF_REF_COOKIE,
  AFF_REF_PARAM,
  ATTRIBUTION_MAX_AGE,
  AWIN_COOKIES,
  sanitizeKey,
  sharedCookieDomain,
} from "@/lib/attribution";
import { encodeQuerySegment, QUERY_SEGMENT, renderQuery } from "@/lib/render";
import { INDEXABLE_HOSTS, INDEXING_ALLOWED, NOINDEX } from "@/lib/site";
import { WP_ORIGIN, WP_OWNED_PATH, WP_OWNED_QUERY } from "@/lib/wp";

/**
 * Edge routing in front of the catch-all WordPress route.
 *
 * 1. Hand-over to WordPress. Commerce, account, admin, assets and feeds
 *    (/cart/, /checkout/, /my-account/, /product/…, /wp-*) and query actions
 *    that make WordPress do something on a page view (?add-to-cart=,
 *    ?coupon-code=, ?preview=…) belong to WordPress — redirect them to WP_ORIGIN
 *    with the same path and query (geo folder included). After the domain switch
 *    these are routed to WordPress at the CDN, so they never reach Next at all.
 *
 * 2. Query renders. The few params WordPress reads while rendering a page
 *    (search "/?s=", the course recommender, podcast paging … — see
 *    RENDER_QUERY_PARAMS) are rewritten to "/<cc>/__q/<query>/<path>/", which
 *    the route decodes back — those pages then cache per query like any page.
 *    Any other query string (utm_*, gclid, ref …) keeps the plain cached page.
 *
 * 3. Attribution (lib/attribution.ts): `?ref=` / `?campaign=` are kept in
 *    first-party cookies for the hand-over links, and `?awc=` / `?source=` get
 *    the same cookies the Awin plugin would have set in PHP.
 *
 * 4. Noindex with X-Robots-Tag until launch (`ALLOW_INDEXING=1`, lib/site.ts),
 *    and after it everything that isn't the production domain (staging, Vercel
 *    previews).
 */
const WP_HOST = new URL(WP_ORIGIN).host;
const COUNTRY_PREFIX = /^\/(gb|za|nl|ca|it|fr)(?=\/|$)/;

function captureAttribution(req: NextRequest, res: NextResponse, host: string): NextResponse {
  const params = req.nextUrl.searchParams;

  const firstParty = { path: "/", maxAge: ATTRIBUTION_MAX_AGE, httpOnly: false, sameSite: "lax" as const };
  const ref = params.get(AFF_REF_PARAM);
  const campaign = params.get(AFF_CAMPAIGN_PARAM);
  if (ref) res.cookies.set(AFF_REF_COOKIE, ref.slice(0, 64), firstParty);
  if (campaign) res.cookies.set(AFF_CAMPAIGN_COOKIE, campaign.slice(0, 64), firstParty);

  // Mirrors awin_process_url_params(): setcookie(name, sanitize_key(v), +30d,
  // COOKIEPATH, <home host>, is_ssl(), httponly).
  for (const [param, cookie] of Object.entries(AWIN_COOKIES)) {
    const value = sanitizeKey(params.get(param) ?? "");
    if (!value) continue;
    res.cookies.set(cookie, value, {
      path: "/",
      maxAge: ATTRIBUTION_MAX_AGE,
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
      domain: sharedCookieDomain(host, WP_HOST),
    });
  }
  return res;
}

function finish(req: NextRequest, res: NextResponse, host: string): NextResponse {
  if (!INDEXING_ALLOWED || !INDEXABLE_HOSTS.has(host)) res.headers.set("X-Robots-Tag", NOINDEX);
  return captureAttribution(req, res, host);
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

  // 2. "/search-courses/?usertype=…&utm_source=…" → "/__q/<usertype=…>/search-courses/"
  const query = renderQuery(url.searchParams);
  if (query) {
    const rewritten = url.clone();
    rewritten.pathname = `${prefix}/${QUERY_SEGMENT}/${encodeQuerySegment(query)}${bare.endsWith("/") ? bare : `${bare}/`}`;
    rewritten.search = "";
    return finish(req, NextResponse.rewrite(rewritten), host);
  }

  return finish(req, NextResponse.next(), host);
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
