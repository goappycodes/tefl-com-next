import { createElement, type CSSProperties, type ReactNode } from "react";

import { CourseBanner, LegalHolder, StickyOfferCta } from "@/components/chrome/AfterPage";
import Footer from "@/components/chrome/Footer";
import Header from "@/components/chrome/Header";
import type { ChromeData } from "@/components/chrome/types";
import HandoverLinks from "@/components/HandoverLinks";
import { FONT_OVERRIDES } from "@/components/WpPage";
import WpScripts from "@/components/WpScripts";
import type { RenderedPage } from "@/lib/render";
import { chromeSlots, dropScripts, hasElementId, splitAfterPage, type Shell, type ShellElement } from "@/lib/shell";

/**
 * A native React template inside the page's WordPress shell: the theme's head
 * assets, then header / footer / popups as WordPress rendered them for this
 * URL (see lib/shell.ts), with `children` in the content slot.
 *
 * With `chrome` (tefl/v1/native/chrome), the theme's own header and footer
 * markup is React too (components/chrome/): the chunk between #page and
 * #content, the chunk between #content and the end of #page, and the
 * legal-holder / sticky offer CTA / course banner blocks after #page. Each
 * region falls back to its WordPress HTML on its own when the endpoint
 * returned null for it, or when the shell's HTML doesn't show the same
 * structure (no #masthead / #colophon, a different number of offer banners).
 * Plugin output (wp_body_open, wp_footer: cookie banner, side cart, chat,
 * popups, trackers) always stays WordPress HTML.
 *
 * The theme and plugin scripts still run (WpScripts), so the mega menu, side
 * cart, geo logo, cookie banner and chat behave as on live; `replaceScripts`
 * drops the theme scripts whose job the React template now does itself.
 *
 * `slotHtml` instead of `children`: the content is WordPress HTML (a
 * passthrough page), set as the innermost element's own innerHTML so the
 * content keeps its exact place in the tree (no wrapper element).
 */
export default function WpShell({
  page,
  shell,
  replaceScripts = [],
  chrome = null,
  slotHtml,
  children,
}: {
  page: RenderedPage;
  shell: Shell;
  replaceScripts?: string[];
  chrome?: ChromeData | null;
  slotHtml?: string;
  children?: ReactNode;
}) {
  const rootId = "wp-root";
  const strip = (html: string) => (replaceScripts.length ? dropScripts(html, replaceScripts) : html);
  const n = shell.open.length;
  const slots = chrome ? chromeSlots(shell) : null;

  const before = (i: number): ReactNode => {
    const html = strip(shell.before[i]);
    if (slots && chrome && i === slots.header && chrome.header && headerMatches(html, chrome)) {
      return <Header data={chrome.header} origin={chrome.origin} />;
    }
    return <Html html={html} />;
  };
  const after = (j: number): ReactNode => {
    const html = strip(shell.after[j]);
    if (slots && chrome && j === slots.footer && chrome.footer && footerMatches(html, chrome)) {
      return <Footer data={chrome.footer} origin={chrome.origin} />;
    }
    if (slots && chrome && j === slots.afterPage && chrome.after_page) {
      const ap = chrome.after_page;
      return splitAfterPage(html, { sticky: !!ap.sticky, course: !!ap.course_banner }).map((p, k) =>
        typeof p === "string" ? (
          <Html key={k} html={p} />
        ) : p.part === "legal" ? (
          <LegalHolder key={k} img={ap.legal_img} />
        ) : p.part === "sticky" ? (
          <StickyOfferCta key={k} d={ap.sticky!} />
        ) : (
          <CourseBanner key={k} d={ap.course_banner!} />
        ),
      );
    }
    return <Html html={html} />;
  };

  // Innermost first: the slot, then each open element wrapped around what's inside it.
  let inner: ReactNode;
  if (slotHtml !== undefined) {
    const html = strip(shell.before[n]) + slotHtml + strip(shell.after[0]);
    inner = element(shell.open[n - 1], null, `shell-${n - 1}`, html);
  } else {
    inner = element(
      shell.open[n - 1],
      <>
        {before(n)}
        {children}
        {after(0)}
      </>,
      `shell-${n - 1}`,
    );
  }
  for (let i = n - 1; i >= 0; i--) {
    inner = (
      <>
        {before(i)}
        {i === n - 1 ? inner : element(shell.open[i], inner, `shell-${i}`)}
        {after(n - i)}
      </>
    );
  }

  return (
    <>
      <div
        id="wp-assets"
        style={{ display: "contents" }}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: strip(page.assets) }}
      />
      <style id="wp-font-overrides" dangerouslySetInnerHTML={{ __html: FONT_OVERRIDES }} />
      <div id={rootId} style={{ display: "contents" }} data-country={page.country} suppressHydrationWarning>
        {inner}
      </div>
      <WpScripts rootId={rootId} bodyClass={page.body_class} title={page.seo.title} />
      <HandoverLinks />
    </>
  );
}

const count = (html: string, needle: string) => html.split(needle).length - 1;

/** The WordPress header chunk shows what the chrome data describes. */
function headerMatches(html: string, chrome: ChromeData): boolean {
  const h = chrome.header!;
  if (hasElementId(html, "masthead") !== (h.masthead !== null)) return false;
  if (h.masthead && count(html, 'class="d-none sales-offer-banner-mobile header-offer-banner"') !== h.masthead.ti.offers.length) return false;
  return true;
}

/** The WordPress footer chunk shows what the chrome data describes. */
function footerMatches(html: string, chrome: ChromeData): boolean {
  const f = chrome.footer!;
  if (hasElementId(html, "colophon") !== (f.colophon !== null)) return false;
  const banners = f.offer.banners.length + (f.offer.promo ? 1 : 0);
  return count(html, "sales-offer-banner-mobile header-offer-banner") === banners;
}

function Html({ html }: { html: string }) {
  // Whitespace / comments only (`<!-- ast-container -->` between the slot's closing tags): no wrapper.
  if (!html.replace(/<!--[\s\S]*?-->/g, "").trim()) return null;
  return <div style={{ display: "contents" }} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
/** HTML attribute names React spells differently. */
const PROP_NAMES: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  itemscope: "itemScope",
  itemtype: "itemType",
  itemprop: "itemProp",
  itemid: "itemID",
  readonly: "readOnly",
  maxlength: "maxLength",
  colspan: "colSpan",
  rowspan: "rowSpan",
  crossorigin: "crossOrigin",
  accesskey: "accessKey",
  contenteditable: "contentEditable",
};

function element(el: ShellElement, children: ReactNode, key: string, html?: string) {
  const props: Record<string, unknown> = { key, suppressHydrationWarning: true };
  if (html !== undefined) props.dangerouslySetInnerHTML = { __html: html };
  for (const [name, value] of Object.entries(el.attrs)) {
    if (name.startsWith("on")) continue; // inline handlers can't be React props
    if (name === "style") props.style = parseStyle(value);
    else if (name === "itemscope") props.itemScope = true;
    else props[PROP_NAMES[name] ?? name] = value;
  }
  return html !== undefined ? createElement(el.tag, props) : createElement(el.tag, props, children);
}

function parseStyle(css: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of css.split(";")) {
    const i = decl.indexOf(":");
    if (i === -1) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop) continue;
    const key = prop.startsWith("--") ? prop : prop.replace(/^-ms-/, "ms-").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = value;
  }
  return out as CSSProperties;
}
