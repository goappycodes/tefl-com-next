import { notFound, permanentRedirect, redirect } from "next/navigation";

import type { ChromeData } from "@/components/chrome/types";
import WpPage from "@/components/WpPage";
import WpShell from "@/components/WpShell";
import { getChromeData, getNativeData } from "@/lib/native/data";
import { NATIVE_TEMPLATES } from "@/lib/native/registry";
import { loadPage } from "@/lib/page-data";
import { segmentsToWpPath } from "@/lib/render";
import { shellSlot, splitShell } from "@/lib/shell";

/**
 * Every teflinstitute.com URL — pages, blog posts, courses, internships,
 * teach-abroad guides, support topics, placements… in the US root and in each
 * geo folder (/gb/, /za/, /nl/, /ca/, /it/, /fr/) — rendered from WordPress
 * with the exact same URL.
 *
 * Templates ported to React (phase 2, lib/native/registry.tsx) render their
 * content natively inside the page's WordPress shell (scripts, plugin
 * output); everything else is the passthrough render. A native template
 * that can't be built for a URL (WordPress says it isn't that template, or the
 * shell's content slot is missing) falls back to the passthrough.
 *
 * The theme's header and footer are React too (components/chrome/, data from
 * `tefl/v1/native/chrome`, fetched alongside the content data) — on native
 * pages, and on passthrough pages whose content slot is self-contained (the
 * WordPress content then sits in the shell as HTML). Without chrome data, or
 * for a region the data doesn't cover, the WordPress header/footer HTML stays.
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
    const shell = splitShell(data.body);
    const slot = shell ? shellSlot(data.body) : null;
    const { wpPath, cacheKey } = segmentsToWpPath(params.path ?? []);
    const [content, chrome] = await Promise.all([
      native && shell ? getNativeData(native.endpoint, data, wpPath, cacheKey) : null,
      shell && (native || slot !== null) ? getChromeData<ChromeData>(data, wpPath, cacheKey) : null,
    ]);
    if (native && content && shell) {
      return (
        <WpShell page={data} shell={shell} replaceScripts={native.replaces} chrome={chrome}>
          {native.render(content)}
        </WpShell>
      );
    }
    if (shell && chrome && slot !== null) {
      return <WpShell page={data} shell={shell} chrome={chrome} slotHtml={slot} />;
    }
  }

  return <WpPage page={data} />;
}
