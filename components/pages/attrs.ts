import type { CSSProperties } from "react";

/**
 * HTML attributes WordPress resolved (astra_attr() etc., as name → value) → React props.
 *
 * `itemscope` stays lowercase on purpose: the theme prints itemscope="itemscope",
 * and React's own `itemScope` would render it as itemscope="" (React only warns
 * about the lowercase spelling in development).
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

export function attrProps(attrs: Record<string, string> | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!attrs) return out;
  for (const [name, value] of Object.entries(attrs)) {
    if (name.startsWith("on") || name === "style") continue;
    out[NAMES[name] ?? name] = value;
  }
  return out;
}

/**
 * A style attribute as the template writes it ("background: url('x'); padding: 0") → React style.
 * Lets templates keep their inline styles verbatim.
 */
export function css(style: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of style.split(";")) {
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

/** `dangerouslySetInnerHTML` for a value the template echoes raw. */
export function html(h: string | null | undefined) {
  return { __html: h ?? "" };
}
