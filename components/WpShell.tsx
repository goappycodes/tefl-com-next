import { createElement, type CSSProperties, type ReactNode } from "react";

import HandoverLinks from "@/components/HandoverLinks";
import { FONT_OVERRIDES } from "@/components/WpPage";
import WpScripts from "@/components/WpScripts";
import type { RenderedPage } from "@/lib/render";
import { dropScripts, type Shell, type ShellElement } from "@/lib/shell";

/**
 * A native React template inside the page's WordPress shell: the theme's head
 * assets, then header / footer / popups exactly as WordPress rendered them for
 * this URL (see lib/shell.ts), with `children` in the content slot.
 *
 * The theme and plugin scripts still run (WpScripts), so the mega menu, side
 * cart, geo logo, cookie banner and chat behave as on live; `replaceScripts`
 * drops the theme scripts whose job the React template now does itself.
 */
export default function WpShell({
  page,
  shell,
  replaceScripts = [],
  children,
}: {
  page: RenderedPage;
  shell: Shell;
  replaceScripts?: string[];
  children: ReactNode;
}) {
  const rootId = "wp-root";
  const strip = (html: string) => (replaceScripts.length ? dropScripts(html, replaceScripts) : html);

  // Innermost first: the slot, then each open element wrapped around what's inside it.
  let inner: ReactNode = (
    <>
      <Html html={strip(shell.before[shell.open.length])} />
      {children}
      <Html html={strip(shell.after[0])} />
    </>
  );
  for (let i = shell.open.length - 1; i >= 0; i--) {
    inner = (
      <>
        <Html html={strip(shell.before[i])} />
        {element(shell.open[i], inner, `shell-${i}`)}
        <Html html={strip(shell.after[shell.open.length - i])} />
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

function Html({ html }: { html: string }) {
  if (!html.trim()) return null;
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

function element(el: ShellElement, children: ReactNode, key: string) {
  const props: Record<string, unknown> = { key, suppressHydrationWarning: true };
  for (const [name, value] of Object.entries(el.attrs)) {
    if (name.startsWith("on")) continue; // inline handlers can't be React props
    if (name === "style") props.style = parseStyle(value);
    else if (name === "itemscope") props.itemScope = true;
    else props[PROP_NAMES[name] ?? name] = value;
  }
  return createElement(el.tag, props, children);
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
