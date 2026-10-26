import type { CSSProperties } from "react";

/** dangerouslySetInnerHTML for a value the template echoes raw. */
export function h(html: string | null | undefined): { __html: string } {
  return { __html: html ?? "" };
}

/** Escape a value for an HTML attribute / text in a hand-built fragment. */
export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** An inline `style="…"` string as React style props (custom properties kept as-is). */
export function css(text: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of text.split(";")) {
    const i = decl.indexOf(":");
    if (i === -1) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop) continue;
    const key = prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[key] = value;
  }
  return out as CSSProperties;
}

/** The theme's six-colour button variables (`--bg-color … --border-color_hover`). */
export function btnVars(c: string[]): CSSProperties {
  return css(
    `--bg-color:${c[0]}; --text-color:${c[1]}; --border-color:${c[2]}; --bg-color_hover:${c[3]}; --text-color_hover:${c[4]}; --border-color_hover:${c[5]};`,
  );
}
