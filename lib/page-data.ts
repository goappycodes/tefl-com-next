import { cache } from "react";

import { getRenderedPage, segmentsToWpPath, type RenderResult } from "./render";

/**
 * Resolve the catch-all route's segments to the rendered WordPress page, once
 * per request. The root layout (for <html lang>, <head> SEO and body class) and
 * the page (for the body) both need it; React's `cache` makes them share a
 * single fetch even though each fetch carries a jittered `revalidate` (which
 * would otherwise defeat Next's fetch de-duplication).
 */
export const loadPage = cache(async (segments: string[] | undefined): Promise<RenderResult | null> => {
  const { wpPath, cacheKey } = segmentsToWpPath(segments ?? []);
  return getRenderedPage(wpPath, cacheKey);
});
