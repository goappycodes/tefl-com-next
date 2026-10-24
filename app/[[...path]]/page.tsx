import { notFound, permanentRedirect, redirect } from "next/navigation";

import WpPage from "@/components/WpPage";
import WpShell from "@/components/WpShell";
import { getNativeData } from "@/lib/native/data";
import { NATIVE_TEMPLATES } from "@/lib/native/registry";
import { loadPage } from "@/lib/page-data";
import { segmentsToWpPath } from "@/lib/render";
import { splitShell } from "@/lib/shell";

/**
 * Every teflinstitute.com URL — pages, blog posts, courses, internships,
 * teach-abroad guides, support topics, placements… in the US root and in each
 * geo folder (/gb/, /za/, /nl/, /ca/, /it/, /fr/) — rendered from WordPress
 * with the exact same URL.
 *
 * Templates ported to React (phase 2, lib/native/registry.tsx) render their
 * content natively inside the page's WordPress shell (header, footer,
 * scripts); everything else is the passthrough render. A native template
 * that can't be built for a URL (WordPress says it isn't that template, or the
 * shell's content slot is missing) falls back to the passthrough.
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

export default async function CatchAllPage({ params }: { params: { path?: string[] } }) {
  const data = await loadPage(params.path);
  if (!data) notFound();

  if (!data.ok) {
    // WordPress redirected (Redirection plugin, old slugs, trailing-slash fixes…).
    if (data.status === 301 || data.status === 308) permanentRedirect(data.location);
    redirect(data.location);
  }

  if (data.status === 200) {
    const classes = new Set(data.body_class.split(/\s+/));
    const native = NATIVE_TEMPLATES.find((t) => t.match(classes, data));
    if (native) {
      const { wpPath, cacheKey } = segmentsToWpPath(params.path ?? []);
      const [content, shell] = [await getNativeData(native.endpoint, data, wpPath, cacheKey), splitShell(data.body)];
      if (content && shell) {
        return (
          <WpShell page={data} shell={shell} replaceScripts={native.replaces}>
            {native.render(content)}
          </WpShell>
        );
      }
    }
  }

  return <WpPage page={data} />;
}
