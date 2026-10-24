import WpScripts from "@/components/WpScripts";
import type { RenderedPage } from "@/lib/render";

/**
 * A rendered WordPress page: the theme's head assets (stylesheets, inline
 * <style>, deferred scripts — in their original order) followed by the body as
 * WordPress rendered it (header, content, footer, popups, cookie banner).
 *
 * Styling is the theme's own CSS, untouched, so the page matches live exactly;
 * WpScripts then runs the theme/plugin JS in document order after hydration.
 * In-site links are plain <a> (full navigations), which is what the jQuery
 * inits expect — each page boots clean, exactly like on WordPress.
 */
/**
 * Icon fonts WordPress serves without an Access-Control-Allow-Origin header
 * (nginx static files), which browsers refuse cross-origin. Re-declared AFTER
 * the theme CSS — the later @font-face for the same family wins — pointing at
 * same-origin copies in /public/wp-fonts. Becomes a no-op once nginx sends
 * `Access-Control-Allow-Origin` for fonts (see README "Infra follow-ups").
 */
const FONT_OVERRIDES = `
@font-face{font-family:"Astra";src:url(/wp-fonts/astra.woff) format("woff"),url(/wp-fonts/astra.ttf) format("truetype");font-weight:normal;font-style:normal;font-display:fallback}
@font-face{font-family:'Woo-Side-Cart';src:url(/wp-fonts/Woo-Side-Cart.woff) format('woff'),url(/wp-fonts/Woo-Side-Cart.ttf) format('truetype');font-weight:normal;font-style:normal}
`;

export default function WpPage({ page }: { page: RenderedPage }) {
  const rootId = "wp-root";
  return (
    <>
      <div
        id="wp-assets"
        style={{ display: "contents" }}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: page.assets }}
      />
      <style id="wp-font-overrides" dangerouslySetInnerHTML={{ __html: FONT_OVERRIDES }} />
      <div
        id={rootId}
        style={{ display: "contents" }}
        data-country={page.country}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
      <WpScripts rootId={rootId} bodyClass={page.body_class} title={page.seo.title} />
    </>
  );
}
