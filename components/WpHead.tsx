import type { RenderedPage } from "@/lib/render";

/**
 * The live page's SEO <head>, reproduced tag for tag: <title>, every
 * name/property meta (Yoast, OG, Twitter, site verifications), canonical +
 * hreflang alternates for all geo folders, and the Yoast JSON-LD graph.
 *
 * Rendered as plain elements rather than through Next's Metadata API so the
 * output is byte-for-byte what WordPress emits (property= vs name= on OG tags,
 * the exact hreflang set, tag order).
 */
const SKIP_META = new Set(["viewport", "charset"]);

export default function WpHead({ page }: { page: RenderedPage | null }) {
  const seo = page?.seo;
  return (
    <>
      {seo?.title ? <title>{seo.title}</title> : null}
      {seo?.meta
        .filter((m) => !(m.name && SKIP_META.has(m.name.toLowerCase())))
        .map((m, i) =>
          m.property ? (
            <meta key={`p${i}`} property={m.property} content={m.content} />
          ) : (
            <meta key={`n${i}`} name={m.name} content={m.content} />
          ),
        )}
      {seo?.links.map((l, i) => (
        <link key={`l${i}`} rel={l.rel} href={l.href} {...(l.hreflang ? { hrefLang: l.hreflang } : {})} />
      ))}
      {seo?.ld.map((json, i) => (
        <script key={`ld${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      ))}

      {/* Favicons — same set header.php prints on live. */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    </>
  );
}
