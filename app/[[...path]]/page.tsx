import { notFound, permanentRedirect, redirect } from "next/navigation";

import WpPage from "@/components/WpPage";
import { loadPage } from "@/lib/page-data";

/**
 * Every teflinstitute.com URL — pages, blog posts, courses, internships,
 * teach-abroad guides, support topics, placements… in the US root and in each
 * geo folder (/gb/, /za/, /nl/, /ca/, /it/, /fr/) — rendered from WordPress
 * with the exact same URL.
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

  return <WpPage page={data} />;
}
