import type { CSSProperties } from "react";

import type { Attrs } from "./types";

/** dangerouslySetInnerHTML props for a fragment the theme echoes raw. */
export function raw(html: string | null | undefined) {
  return { dangerouslySetInnerHTML: { __html: html ?? "" } };
}

/** Escape a value for a hand-built HTML fragment (attribute or text). */
export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** A root-relative media URL made absolute on the WordPress origin, as the render does (`src="/wp-content/…"`). */
export function media(origin: string, url: string): string {
  return url.startsWith("/") && !url.startsWith("//") ? origin + url : url;
}

/** An inline `style="…"` the template writes → React style (custom properties kept as-is). */
export function css(text: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of text.split(";")) {
    const i = decl.indexOf(":");
    if (i === -1) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop) continue;
    const key = prop.startsWith("--") ? prop : prop.replace(/^-ms-/, "ms-").replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[key] = value;
  }
  return out as CSSProperties;
}

/**
 * astra_attr() output → React props. `itemscope` stays lowercase on purpose:
 * Astra prints itemscope="itemscope", React's `itemScope` would print
 * itemscope="" (React warns about the spelling once, in development only).
 */
const NAMES: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  itemtype: "itemType",
  itemprop: "itemProp",
  itemid: "itemID",
  itemref: "itemRef",
};

export function attrProps(attrs: Attrs | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!attrs) return out;
  for (const [name, value] of Object.entries(attrs)) {
    if (name.startsWith("on") || name === "style") continue;
    out[NAMES[name] ?? name] = value;
  }
  return out;
}
