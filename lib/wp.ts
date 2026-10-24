/**
 * WordPress origin + headless `tefl/v1` API client.
 *
 * Single source of truth for where the WordPress **backend** lives (API, media,
 * AJAX, cart, checkout). Today that is `https://teflinstitute.com`; at the
 * domain switch — when Next takes over teflinstitute.com and WordPress moves to
 * its own subdomain — set `NEXT_PUBLIC_WP_ORIGIN=https://cms.teflinstitute.com`
 * and every headless call and commerce link built from these helpers follows.
 * (The public/front origin is a separate concern — see `lib/site.ts`.)
 *
 * The endpoints are served by the child theme's `headless/` folder
 * (`wordpress/headless/` in this repo, deployed to
 * `wp-content/themes/teflinstitute/headless/`).
 */

export const WP_ORIGIN = (
  process.env.NEXT_PUBLIC_WP_ORIGIN && process.env.NEXT_PUBLIC_WP_ORIGIN.length > 0
    ? process.env.NEXT_PUBLIC_WP_ORIGIN
    : "https://teflinstitute.com"
).replace(/\/$/, "");

/** Base URL for the headless namespace, e.g. https://teflinstitute.com/wp-json/tefl/v1 */
export const TEFL_API = `${WP_ORIGIN}/wp-json/tefl/v1`;

/** Sent on every server-side WP fetch (Cloudflare lets it through; easy to grep in logs). */
export const WP_FETCH_UA = "tefl-com-next";

/**
 * Jittered ISR window. Every page also revalidates ON DEMAND (WordPress pings
 * /api/revalidate on save), so this is only the safety net for anything no hook
 * catches (e.g. a scheduled sale flipping on). Jitter spreads the refetches of
 * ~7,000 cached pages (1,000 paths × 7 geo folders) so they never stampede the
 * origin at the same moment. Use at each fetch site: `revalidate: isrRevalidate()`.
 */
const ISR_MIN = 32400; // 9 hours
const ISR_MAX = 54000; // 15 hours
export const isrRevalidate = (): number =>
  ISR_MIN + Math.floor(Math.random() * (ISR_MAX - ISR_MIN + 1));

/**
 * GET a headless endpoint that backs a route which 404s when its content is
 * genuinely absent. Returns the parsed JSON on 200, and `null` ONLY on a real
 * 404 — but THROWS on any transient failure (5xx / network / timeout / bad JSON).
 *
 * Why throw instead of returning null: a loader that returns null makes the
 * route call `notFound()`, and Next then BAKES that 404 into the full-route
 * cache — which `revalidateTag` can't clear (the failed fetch left no tagged
 * entry), so only a redeploy fixes it. (TEFL IE learnt this the hard way: a WP
 * cold-start made live fetches time out and every page stuck as a 404.) By
 * throwing on a wobble, Next keeps serving the last-good cached page
 * (stale-while-error) and retries on the next request.
 *
 * At BUILD time a throw would crash `next build`, so there a transient failure
 * soft-fails to null instead.
 */
export async function getRouteContent<T>(
  path: string,
  next: { tags: string[]; revalidate?: number },
  timeoutMs = 20000,
): Promise<T | null> {
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  try {
    const res = await fetch(`${TEFL_API}${path}`, {
      next,
      headers: { "User-Agent": WP_FETCH_UA, Accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status === 404) return null; // genuinely missing — notFound() is correct
    if (!res.ok) throw new Error(`getRouteContent ${res.status} for ${path}`);
    return (await res.json()) as T;
  } catch (e) {
    if (isBuild) return null;
    throw e;
  }
}

/** Absolute-ise a WordPress-relative URL/path against the WP origin. */
export function wpUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${WP_ORIGIN}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/* ------------------------------------------------------------------ *
 * WooCommerce hand-over. The purchase flow stays on WooCommerce: once the
 * visitor reaches the cart, WordPress takes over. Build every commerce link
 * from these so they follow WP_ORIGIN through the domain switch.
 * ------------------------------------------------------------------ */

export const CART_URL = `${WP_ORIGIN}/cart/`;
export const CHECKOUT_URL = `${WP_ORIGIN}/checkout/`;

/**
 * Paths that belong to WordPress, not Next (commerce, account, admin, assets,
 * feeds). Mirrors `tefl_headless_wp_owned_path_regex()` in
 * wordpress/headless/helpers.php — keep the two in step. Matched against a
 * path with any geo folder already stripped.
 */
export const WP_OWNED_PATH =
  /^\/(cart|checkout|basket|my-account|user-account|product|product-category|shop|wp-admin|wp-content|wp-includes|wp-json|wp-login\.php|xmlrpc\.php|feed|comments|affiliate-area|affiliate-login|affiliate-registration|lms-sso|sso|order-received|order-pay)(\/|$|\?|\.)/i;

/** Query parameters that are WooCommerce actions — always handled by WordPress. */
export const WP_OWNED_QUERY = /(^|[?&])(add-to-cart|addtimetocart|wc-ajax|wc-api|add_to_cart|remove_item|undo_item)(=|&|$)/i;
