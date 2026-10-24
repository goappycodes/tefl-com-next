import { NextResponse, type NextRequest } from "next/server";

import { SITE_ORIGIN } from "@/lib/site";
import { WP_FETCH_UA, WP_ORIGIN } from "@/lib/wp";

/**
 * Yoast sitemaps served at their exact live URLs (/sitemap_index.xml,
 * /post-sitemap.xml, /gb/page-sitemap.xml … — see the rewrites in
 * next.config.mjs). Fetched from WordPress so anything published in WP admin
 * self-registers without a Next deploy; <loc> origins are swapped to the front
 * origin so the URLs are right before AND after the domain switch. The XSL is
 * proxied too (browsers only apply a same-origin stylesheet).
 *
 * Cached for an hour (ISR) — a new page reaches the sitemap within the hour.
 */
export const revalidate = 3600;

const ALLOWED = /^\/((gb|za|nl|ca|it|fr)\/)?((?:[a-z_]+-)?sitemap(?:_index|\d*)\.xml|main-sitemap\.xsl)$/;

export async function GET(_req: NextRequest, { params }: { params: { file: string[] } }) {
  const file = `/${params.file.join("/")}`.replace(/\/$/, "");
  if (!ALLOWED.test(file)) return new NextResponse("Not found", { status: 404 });

  let res: Response;
  try {
    res = await fetch(`${WP_ORIGIN}${file}`, {
      headers: { "User-Agent": WP_FETCH_UA },
      next: { revalidate: 3600, tags: ["sitemap"] },
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    return new NextResponse("Upstream unavailable", { status: 502 });
  }
  if (!res.ok) return new NextResponse("Not found", { status: res.status === 404 ? 404 : 502 });

  let body = await res.text();
  const wpHost = new URL(WP_ORIGIN).host.replace(/\./g, "\\.");
  // Absolute and protocol-relative WP URLs → front origin (media under
  // /wp-content stays on WordPress — Yoast lists image URLs in <image:loc>).
  // Point the stylesheet at our same-origin proxy (before the origin swap).
  body = body.replace(/href="[^"]*main-sitemap\.xsl"/, 'href="/main-sitemap.xsl"');
  body = body.replace(
    new RegExp(`https?://(www\\.)?(${wpHost}|teflinstitute\\.com)(?!/wp-content/)`, "g"),
    SITE_ORIGIN,
  );

  const type = file.endsWith(".xsl") ? "text/xsl; charset=utf-8" : "application/xml; charset=utf-8";
  return new NextResponse(body, {
    headers: { "Content-Type": type, "X-Robots-Tag": "noindex, follow" },
  });
}
