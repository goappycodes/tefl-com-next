/**
 * The page "shell" for native React templates: everything WordPress renders
 * around the main content (header, mega menu, offer banners, footer, popups,
 * cookie banner, footer scripts), taken from the page's own `tefl/v1/render`
 * output so it stays exact — per page, per geo folder — while a React template
 * renders the content in between.
 *
 * The content slot is the theme's `<div id="content" class="site-content">
 * <div class="ast-container">…</div> <!-- ast-container --></div><!-- #content -->`
 * (child theme header.php / footer.php), which every template shares.
 *
 * The HTML before the slot leaves elements open (#page, #content,
 * .ast-container), so it can't be injected as one fragment. `splitShell`
 * returns it as a tree instead: balanced HTML chunks, and the open elements
 * (re-created as real React elements by WpShell) nesting the slot.
 */

export interface ShellElement {
  tag: string;
  attrs: Record<string, string>;
}

export interface Shell {
  /** Open elements around the slot, outermost first. */
  open: ShellElement[];
  /** Balanced HTML before each open element, and before the slot (open.length + 1 chunks). */
  before: string[];
  /** Balanced HTML after the slot, and after each element closes (open.length + 1 chunks, innermost first). */
  after: string[];
}

const SLOT_START = /<div\b[^>]*\bid=["']content["'][^>]*>\s*<div\b[^>]*\bclass=["']ast-container["'][^>]*>/i;
const SLOT_END = /<\/div>\s*<!--\s*ast-container\s*-->\s*<\/div>\s*<!--\s*#content\s*-->/gi;

/** Raw-text elements and comments are skipped whole; everything else is a tag. */
const TOKEN =
  /<!--[\s\S]*?-->|<(script|style|textarea|template|noscript|svg)\b[^>]*>[\s\S]*?<\/\1\s*>|<(\/?)([a-zA-Z][\w:-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
]);
/** Elements the HTML parser closes implicitly; never part of the stack around the slot. */
const IMPLICIT = new Set(["p", "li", "dt", "dd", "option", "optgroup", "tr", "td", "th", "thead", "tbody", "tfoot"]);

const ATTR = /([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>"']+)))?/g;

function parseAttrs(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of Array.from(raw.matchAll(ATTR))) {
    const name = m[1].toLowerCase();
    if (name in out) continue;
    out[name] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return out;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

interface Open {
  tag: string;
  attrs: Record<string, string>;
  start: number;
  end: number;
}

/**
 * Split a rendered body around the content slot, dropping WordPress' own
 * content. `null` when the page doesn't have the standard slot or the markup
 * around it can't be matched up — the caller then renders the passthrough page.
 */
export function splitShell(body: string): Shell | null {
  const start = SLOT_START.exec(body);
  if (!start) return null;
  let end: RegExpExecArray | null = null;
  for (const m of Array.from(body.matchAll(SLOT_END))) end = m as RegExpExecArray;
  if (!end || end.index < start.index) return null;

  const head = body.slice(0, start.index + start[0].length);
  const tail = body.slice(end.index);

  // Elements still open where the slot begins.
  const stack: Open[] = [];
  for (const m of Array.from(head.matchAll(TOKEN))) {
    const tag = m[3]?.toLowerCase();
    if (!tag || VOID.has(tag) || IMPLICIT.has(tag) || /\/\s*$/.test(m[4] ?? "")) continue;
    if (m[2] === "/") {
      const i = stack.map((o) => o.tag).lastIndexOf(tag);
      if (i !== -1) stack.length = i;
    } else {
      stack.push({ tag, attrs: parseAttrs(m[4] ?? ""), start: m.index!, end: m.index! + m[0].length });
    }
  }
  if (stack.length === 0) return null;

  const before: string[] = [];
  let pos = 0;
  for (const o of stack) {
    before.push(head.slice(pos, o.start));
    pos = o.end;
  }
  before.push(head.slice(pos));

  // Where each of those elements closes in the tail, innermost first.
  const after: string[] = [];
  const local: string[] = [];
  let open = stack.length;
  pos = 0;
  for (const m of Array.from(tail.matchAll(TOKEN))) {
    if (open === 0) break;
    const tag = m[3]?.toLowerCase();
    if (!tag || VOID.has(tag) || IMPLICIT.has(tag) || /\/\s*$/.test(m[4] ?? "")) continue;
    if (m[2] !== "/") {
      local.push(tag);
      continue;
    }
    const i = local.lastIndexOf(tag);
    if (i !== -1) {
      local.length = i;
      continue;
    }
    if (stack[open - 1].tag !== tag) return null; // markup doesn't nest as expected
    after.push(tail.slice(pos, m.index));
    pos = m.index! + m[0].length;
    open--;
  }
  if (open !== 0) return null;
  after.push(tail.slice(pos));

  return { open: stack.map(({ tag, attrs }) => ({ tag, attrs })), before, after };
}

/** Remove the <script id="…"> elements (a theme script a native template replaces). */
export function dropScripts(html: string, ids: string[]): string {
  let out = html;
  for (const id of ids) {
    const re = new RegExp(`<script\\b[^>]*\\bid=["']${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>[\\s\\S]*?<\\/script\\s*>`, "gi");
    out = out.replace(re, "");
  }
  return out;
}
