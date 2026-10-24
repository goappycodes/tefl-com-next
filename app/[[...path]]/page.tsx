import { notFound, permanentRedirect, redirect } from "next/navigation";

import BlogPost from "@/components/blog/BlogPost";
import WpPage from "@/components/WpPage";
import WpShell from "@/components/WpShell";
import { loadPage } from "@/lib/page-data";
import { getBlogPost, isBlogPostPath } from "@/lib/post";
import { segmentsToWpPath } from "@/lib/render";
import { splitShell } from "@/lib/shell";

/**
 * Every teflinstitute.com URL — pages, blog posts, courses, internships,
 * teach-abroad guides, support topics, placements… in the US root and in each
 * geo folder (/gb/, /za/, /nl/, /ca/, /it/, /fr/) — rendered from WordPress
 * with the exact same URL.
 *
 * Templates ported to React (phase 2) render their content natively inside the
 * page's WordPress shell (header, footer, scripts); everything else is the
 * passthrough render. A native template that can't be built for a URL (not
 * the expected post type, unexpected markup) falls back to the passthrough.
 *   - blog posts (/blog/<slug>/, every folder) → components/blog/BlogPost
 *
 * On-demand ISR: nothing is prerendered at build (≈7,000 path × folder
 * combinations); each URL renders on its first request, is cached, and is
 * refreshed when WordPress fires its `p:<path>` / `listing` / `pages` tags.
 * `npm run warm-cache` primes the cache after a deploy.
 */
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

/** Theme scripts a native template replaces (by <script id>). */
const BLOG_REPLACES = ["ti-single-post-redesign-js"];

export default async function CatchAllPage({ params }: { params: { path?: string[] } }) {
  const { cacheKey } = segmentsToWpPath(params.path ?? []);
  const blog = isBlogPostPath(cacheKey);
  const [data, post] = await Promise.all([loadPage(params.path), blog ? getBlogPost(cacheKey) : null]);
  if (!data) notFound();

  if (!data.ok) {
    // WordPress redirected (Redirection plugin, old slugs, trailing-slash fixes…).
    if (data.status === 301 || data.status === 308) permanentRedirect(data.location);
    redirect(data.location);
  }

  if (post && data.status === 200) {
    const shell = splitShell(data.body);
    if (shell) {
      return (
        <WpShell page={data} shell={shell} replaceScripts={BLOG_REPLACES}>
          <BlogPost post={post} />
        </WpShell>
      );
    }
  }

  return <WpPage page={data} />;
}
