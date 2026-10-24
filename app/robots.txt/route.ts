import { SITE_ORIGIN } from "@/lib/site";
import { WP_FETCH_UA, WP_ORIGIN } from "@/lib/wp";

/**
 * robots.txt — WordPress' own file (it's a static file in the WP root, edited
 * by the SEO team), with sitemap URLs pointed at the front origin. Staging and
 * preview hosts are kept out of the index by middleware's X-Robots-Tag instead.
 */
export const revalidate = 3600;

const FALLBACK = `User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\nSitemap: ${SITE_ORIGIN}/sitemap_index.xml\n`;

export async function GET() {
  let body = FALLBACK;
  try {
    const res = await fetch(`${WP_ORIGIN}/robots.txt`, {
      headers: { "User-Agent": WP_FETCH_UA },
      next: { revalidate: 3600, tags: ["robots"] },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const text = await res.text();
      if (/user-agent/i.test(text)) {
        const wpHost = new URL(WP_ORIGIN).host.replace(/\./g, "\\.");
        body = text.replace(new RegExp(`https?://(www\\.)?(${wpHost}|teflinstitute\\.com)`, "g"), SITE_ORIGIN);
      }
    }
  } catch {
    /* serve the fallback */
  }
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
