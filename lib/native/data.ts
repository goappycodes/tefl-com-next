/**
 * Fetch a native template's data (`tefl/v1/native/<endpoint>`).
 *
 * Through the page's geo folder (`/<cc>/index.php?rest_route=…`), so WordPress
 * resolves home_url(), permalinks and per-country ACF as on that folder's
 * page. Cached under the page's own tags, so a save in WordPress refreshes the
 * render and the data together.
 */
import { pageTags, type RenderedPage } from "../render";
import { isrRevalidate, WP_FETCH_UA, WP_ORIGIN } from "../wp";

/** The post / page ID from the body class (`postid-123`, `page-id-123`). */
export function bodyPostId(classes: Set<string>): number | null {
  for (const c of Array.from(classes)) {
    const m = /^(?:postid|page-id)-(\d+)$/.exec(c);
    if (m) return Number(m[1]);
  }
  return null;
}

/**
 * `null` when WordPress says this page isn't the template (→ passthrough).
 * Throws on transient failures, like getRouteContent, so Next keeps the last good page.
 */
export async function getNativeData<T>(
  endpoint: string,
  page: RenderedPage,
  wpPath: string,
  cacheKey: string,
): Promise<T | null> {
  const cc = /^\/(gb|za|nl|ca|it|fr)\//.exec(wpPath)?.[1];
  const id = bodyPostId(new Set(page.body_class.split(/\s+/)));
  // `_m` (the current minute) busts Cloudflare: it edge-caches `index.php?rest_route=`
  // URLs despite `Cache-Control: no-store` (seen 25+ min old), which would hand a
  // revalidation stale JSON after a WordPress save. One-minute buckets keep the edge
  // copy at most a minute old. (`/wp-json/` isn't edge-cached, but a geo folder's
  // REST context needs the `/<cc>/index.php` form.)
  const minute = Math.floor(Date.now() / 60000);
  const url =
    `${WP_ORIGIN}${cc ? `/${cc}` : ""}/index.php?rest_route=/tefl/v1/native/${endpoint}` +
    `&path=${encodeURIComponent(wpPath)}${id ? `&id=${id}` : ""}&_m=${minute}`;
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  try {
    const res = await fetch(url, {
      next: { tags: pageTags(cacheKey), revalidate: isrRevalidate() },
      headers: { "User-Agent": WP_FETCH_UA, Accept: "application/json" },
      signal: AbortSignal.timeout(20000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`native/${endpoint} ${res.status} for ${wpPath}`);
    const data = (await res.json()) as T & { ok?: boolean };
    return data && data.ok ? data : null;
  } catch (e) {
    if (isBuild) return null;
    throw e;
  }
}

/**
 * The theme's header / footer data (`tefl/v1/native/chrome`, components/chrome/)
 * for a page — fetched alongside the page's own data, through the same path
 * (geo folder, post ID, cache tags, Cloudflare buster). Never throws: without
 * it (endpoint missing, a failure) the page keeps its WordPress header/footer.
 */
export async function getChromeData<T>(page: RenderedPage, wpPath: string, cacheKey: string): Promise<T | null> {
  try {
    return await getNativeData<T>("chrome", page, wpPath, cacheKey);
  } catch {
    return null;
  }
}
