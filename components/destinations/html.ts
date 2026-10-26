/** Props for an element whose content is a raw HTML fragment the PHP template echoes. */
export function raw(html: string | null | undefined) {
  return { dangerouslySetInnerHTML: { __html: html ?? "" } };
}

/** Escape a value for an HTML attribute (as esc_attr would print it). */
export function attr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** An inline style string as a React style object (custom properties kept as-is). */
export function css(style: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of style.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop) continue;
    out[prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = value;
  }
  return out;
}

/** A JSON-LD body, safe inside <script>. */
export function ldJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
