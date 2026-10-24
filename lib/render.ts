/**
 * Rendered WordPress pages (`tefl/v1/render`).
 *
 * The universal data source for every route that hasn't been ported to a
 * native React template yet: WordPress loopback-renders the front URL (geo
 * folder included) and returns the SEO head, body class, head assets and body
 * HTML — links already rewritten for the Next front, executable scripts
 * deferred (see wordpress/headless/rest-render.php).
 *
 * Cache tags (on-demand ISR — wordpress/tefl-isr-revalidate.php fires them):
 *   p:<path>  this exact page (WP fires all 7 geo variants on a save)
 *   pages     every rendered page (menus / options / footer changes)
 *   listing   pages that list other content (see LISTING below)
 */
import { getRouteContent, isrRevalidate } from "./wp";

export interface SeoMeta {
  name?: string;
  property?: string;
  content: string;
}

export interface SeoLink {
  rel: string;
  href: string;
  hreflang?: string;
}

export interface RenderedPage {
  ok: true;
  status: 200 | 404;
  path: string;
  country: string;
  lang: string;
  body_class: string;
  seo: { title: string; meta: SeoMeta[]; links: SeoLink[]; ld: string[] };
  assets: string;
  body: string;
  rendered: string;
}

export interface RenderedRedirect {
  ok: false;
  status: number;
  path: string;
  location: string;
}

export type RenderResult = RenderedPage | RenderedRedirect;

/** Paths whose content lists other posts — revalidated whenever any post changes. */
const LISTING =
  /^\/((gb|za|nl|ca|it|fr)\/)?(|blog\/.*|category\/.*|tag\/.*|author\/.*|tefl-courses-overview\/|online-tefl-courses\/|specialist-tefl-courses\/|teach-english-abroad\/|tefl-internships\/|upcoming-tefl-webinars\/|tefl-shop\/|search-courses\/|__q\/.*)$/;

/** Ensure a leading and trailing slash (query strings are kept, unslashed). */
export function normalisePath(path: string): string {
  const [p, q] = path.split("?");
  let out = p.startsWith("/") ? p : `/${p}`;
  if (!out.endsWith("/")) out += "/";
  return q ? `${out}?${q}` : out;
}

export function pageTag(path: string): string {
  return `p:${normalisePath(path)}`;
}

/**
 * Fetch a rendered page. `null` = genuinely not found (→ notFound()); throws on
 * transient upstream failures so Next keeps serving the last-good page.
 */
export async function getRenderedPage(path: string, cacheKey = path): Promise<RenderResult | null> {
  const p = normalisePath(path);
  const tags = ["pages", pageTag(cacheKey)];
  if (LISTING.test(normalisePath(cacheKey))) tags.push("listing");
  const data = await getRouteContent<RenderResult>(
    `/render?path=${encodeURIComponent(p)}`,
    { tags, revalidate: isrRevalidate() },
  );
  if (!data) return null;
  if (data.ok) return data;
  if (data.status >= 300 && data.status < 400 && data.location) return data;
  return null;
}

/**
 * WordPress' own 404 page (header, "page not found" content, footer), for the
 * Next not-found view. Rendered once from a path that can never exist.
 */
export async function getNotFoundPage(): Promise<RenderedPage | null> {
  try {
    const data = await getRouteContent<RenderResult>(
      `/render?path=${encodeURIComponent("/tefl-next-404-page/")}&allow_404=1`,
      { tags: ["pages", "p:__404"], revalidate: isrRevalidate() },
    );
    return data && data.ok ? data : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Query-string renders. A few query parameters change the HTML WordPress
 * renders server-side: search ("/?s=term", "/gb/?s=term"), the course
 * recommender ("/search-courses/?usertype=…"), podcast paging ("?pg=2"), the
 * timetable's timezone ("?offset=") … A query string would make the catch-all
 * route dynamic, so middleware rewrites those params into a path segment —
 * "/<cc>/__q/<encoded query>/<path>/" — that the catch-all decodes back. Each
 * such URL then caches per query like any page.
 *
 * Every other parameter (utm_*, gclid, fbclid, ref, awc …) is read client-side
 * or by middleware only, so those URLs keep the plain cached page.
 * ------------------------------------------------------------------ */

export const QUERY_SEGMENT = "__q";

/**
 * Query params WordPress reads while rendering a front page (theme templates +
 * search). An allowlist on purpose: an unknown param can never fan out the
 * cache, it just gets the plain page — exactly as before this existed.
 */
export const RENDER_QUERY_PARAMS = [
  "s", // WordPress / Relevanssi search
  "post_type", // search scope
  "paged", // ugly-permalink paging
  "usertype", // search-courses-template.php — course recommender
  "userpreference",
  "userlevel",
  "userqual",
  "pg", // template-parts/podcast/section-podcast.php
  "month", // Hope Foundation page
  "offset", // includes/course_variation_timetable.php — timezone
  "redesign", // includes/ti-blog-redesign.php — preview toggle
] as const;

/**
 * The render-relevant part of a query string, params in a stable order, or ""
 * when there is none. "?utm_source=x&s=tefl" → "s=tefl".
 */
export function renderQuery(search: URLSearchParams): string {
  const out = new URLSearchParams();
  for (const key of RENDER_QUERY_PARAMS) {
    for (const value of search.getAll(key)) out.append(key, value);
  }
  return out.toString();
}

/**
 * The query travels base64url-encoded: only [A-Za-z0-9_-], so it survives the
 * rewrite and route-param decoding byte for byte (a search for "a&b" or "100%"
 * stays intact). The query string itself is ASCII — URLSearchParams escapes the rest.
 */
export function encodeQuerySegment(query: string): string {
  return btoa(query).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeQuerySegment(segment: string): string | null {
  try {
    const b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    return atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  } catch {
    return null;
  }
}

/** decodeURIComponent that never throws (a stray "%" in a path). */
function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** Segments → the WordPress path to render (a query segment decoded back to a query string). */
export function segmentsToWpPath(segments: string[]): { wpPath: string; cacheKey: string } {
  const decoded = segments.map(safeDecode);
  const i = decoded.indexOf(QUERY_SEGMENT);
  const query = i !== -1 && i <= 1 && decoded.length >= i + 2 ? decodeQuerySegment(decoded[i + 1]) : null;
  if (query) {
    const prefix = i === 1 ? `/${decoded[0]}` : "";
    const path = normalisePath(`${prefix}/${decoded.slice(i + 2).join("/")}`);
    return {
      wpPath: `${path}?${query}`,
      cacheKey: normalisePath(`/${decoded.join("/")}`),
    };
  }
  const path = normalisePath(`/${decoded.join("/")}`);
  return { wpPath: path, cacheKey: path };
}
