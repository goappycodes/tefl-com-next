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
  /^\/((gb|za|nl|ca|it|fr)\/)?(|blog\/.*|category\/.*|tag\/.*|author\/.*|tefl-courses-overview\/|online-tefl-courses\/|specialist-tefl-courses\/|teach-english-abroad\/|tefl-internships\/|upcoming-tefl-webinars\/|tefl-shop\/|search-courses\/|__search\/.*)$/;

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
 * Search. WordPress search lives at "/?s=term" (and "/gb/?s=term"). Query
 * strings would make the catch-all route dynamic, so middleware rewrites them
 * to a path — "/__search/<encoded query>/" — that the catch-all decodes back.
 * ------------------------------------------------------------------ */

export const SEARCH_SEGMENT = "__search";

/** Segments → the WordPress path to render (search segments decoded back to a query). */
export function segmentsToWpPath(segments: string[]): { wpPath: string; cacheKey: string } {
  const decoded = segments.map((s) => decodeURIComponent(s));
  const i = decoded.indexOf(SEARCH_SEGMENT);
  if (i !== -1 && i <= 1 && decoded.length === i + 2) {
    const prefix = i === 1 ? `/${decoded[0]}` : "";
    return {
      wpPath: `${prefix}/?${decoded[i + 1]}`,
      cacheKey: `${prefix}/${SEARCH_SEGMENT}/${segments[i + 1]}/`,
    };
  }
  const path = normalisePath(`/${decoded.join("/")}`);
  return { wpPath: path, cacheKey: path };
}
