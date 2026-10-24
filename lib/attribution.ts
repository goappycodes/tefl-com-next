/**
 * Affiliate / partner attribution across the Next front and WordPress checkout.
 *
 * Every sale is attributed in WordPress at checkout, from cookies set while the
 * visitor browsed. On the headless front those cookies come about in two ways:
 *
 *  1. JS-tracked — AffiliateWP (visit tracking via admin-ajax, `tracking_fallback`
 *     off), the AFL UTM tracker (`js_autorun`), WooCommerce order attribution.
 *     Their scripts run on the rendered page (WpScripts) and write cookies on the
 *     PAGE's host. When checkout is on that same host (cutover: WordPress paths
 *     served under teflinstitute.com at the edge) they just work. When it is not
 *     (parallel run on next.teflinstitute.com, localhost, or a cms.* backend), the
 *     AffiliateWP referral is carried on the hand-over link instead: middleware
 *     keeps `?ref=` / `?campaign=` in first-party cookies and HandoverLinks
 *     appends them to cart / checkout / add-to-cart URLs — AffiliateWP reads
 *     `?ref=` natively there.
 *
 *  2. Server-tracked on landing — the Awin advertiser plugin stores `?awc=` (and
 *     `?source=`) in cookies from PHP on `init`, which never runs for a page Next
 *     serves. Middleware sets the identical cookies (same names, path, lifetime,
 *     Secure + HttpOnly, shared parent domain), so the plugin's checkout code
 *     finds them exactly as if WordPress had served the landing page.
 */

/** AffiliateWP `referral_var` / campaign param (Affiliates → Settings). */
export const AFF_REF_PARAM = "ref";
export const AFF_CAMPAIGN_PARAM = "campaign";
/** First-party copies on the front host, readable by HandoverLinks. */
export const AFF_REF_COOKIE = "tefl_aff_ref";
export const AFF_CAMPAIGN_COOKIE = "tefl_aff_campaign";

/** Awin plugin: query param → cookie name (AWIN_AWC_COOKIE_NAME, AWIN_SOURCE_COOKIE_NAME). */
export const AWIN_COOKIES: Record<string, string> = { awc: "adv_awc", source: "source" };

/** AffiliateWP `cookie_exp` and the Awin plugin both keep attribution 30 days. */
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 30;

/** PHP sanitize_key(): lowercase, keep [a-z0-9_-]. */
export function sanitizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

/**
 * Cookie Domain that lets WordPress read a cookie the front sets: the WP site's
 * registrable domain ("teflinstitute.com"), when the front host is that domain
 * or a subdomain of it. Otherwise (localhost, *.vercel.app) undefined → a
 * host-only cookie. The Awin plugin itself sets Domain=<home host>.
 */
export function sharedCookieDomain(frontHost: string, wpHost: string): string | undefined {
  const site = wpHost.split(".").slice(-2).join(".");
  if (!site.includes(".")) return undefined;
  return frontHost === site || frontHost.endsWith(`.${site}`) ? site : undefined;
}
