/**
 * Blog post data for the native template (`tefl/v1/post`,
 * wordpress/headless/rest-post.php).
 *
 * Fetched through the post's geo folder (`/<cc>/index.php?rest_route=…`), so
 * WordPress resolves home_url(), permalinks and per-country ACF exactly as on
 * that folder's page. Cached under the same tags as the page's render, so a
 * save in WordPress refreshes both together.
 */
import { pageTags } from "./render";
import { isrRevalidate, WP_FETCH_UA, WP_ORIGIN } from "./wp";

export interface BlogPostData {
  ok: true;
  path: string;
  country: string;
  id: number;
  /** Plain text (attributes, share links). */
  title: string;
  /** As the_title() prints it. */
  title_html: string;
  permalink: string;
  img_dir: string;
  hero: string;
  breadcrumb: string;
  author: { name: string; bio: string; image: string };
  date: string;
  reading: number;
  sidebar_tools: string[];
  show_wire: boolean;
  show_promo: boolean;
  promo_style: string;
  intro: string;
  takeaways: string[];
  content_html: string;
  faqs: { question: string; answer_html: string; answer_text: string }[];
  guides: { country: string; desc: string; code: string; url: string }[];
  related: { url: string; img: string; cat: string; title: string }[];
  related_all: string;
  categories: { name: string; url: string }[];
  opts: {
    cta_url: string;
    promo_link: string;
    promo_pill: string;
    promo_title: string;
    promo_sub: string;
    promo_cta: string;
    guides_url: string;
    team_url: string;
    salary_url: string;
    level_url: string;
    finder_url: string;
    prospectus_url: string;
  };
}

/** /blog/<slug>/ in the US root or a geo folder (not /blog/page/N/). */
const BLOG_POST_PATH = /^\/((gb|za|nl|ca|it|fr)\/)?blog\/(?!page\/)[^/]+\/$/;

export function isBlogPostPath(path: string): boolean {
  return BLOG_POST_PATH.test(path);
}

/**
 * `null` when WordPress says the path isn't a redesign-template post (the
 * route then renders the passthrough page). Throws on transient failures, like
 * getRouteContent, so Next keeps the last good page.
 */
export async function getBlogPost(path: string): Promise<BlogPostData | null> {
  const cc = /^\/(gb|za|nl|ca|it|fr)\//.exec(path)?.[1];
  const url = `${WP_ORIGIN}${cc ? `/${cc}` : ""}/index.php?rest_route=/tefl/v1/post&path=${encodeURIComponent(path)}`;
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  try {
    const res = await fetch(url, {
      next: { tags: pageTags(path), revalidate: isrRevalidate() },
      headers: { "User-Agent": WP_FETCH_UA, Accept: "application/json" },
      signal: AbortSignal.timeout(20000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`getBlogPost ${res.status} for ${path}`);
    const data = (await res.json()) as BlogPostData;
    return data && data.ok ? data : null;
  } catch (e) {
    if (isBuild) return null;
    throw e;
  }
}
