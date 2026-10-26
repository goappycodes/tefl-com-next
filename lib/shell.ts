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

/** Elements a stray end tag of which the HTML parser ignores (inline formatting / phrasing). */
const INLINE = new Set([
  "a", "abbr", "b", "bdi", "bdo", "big", "cite", "code", "data", "dfn", "em", "font", "i", "kbd", "label", "mark",
  "nobr", "q", "s", "samp", "small", "span", "strike", "strong", "sub", "sup", "time", "tt", "u", "var", "br",
]);

/**
 * A passthrough page's own content slot (what WordPress renders inside
 * `#content > .ast-container`), for rendering it inside the shell as that
 * element's innerHTML (WpShell `slotHtml`). `null` unless it is
 * self-contained: a stray block end tag (`</div>` it never opened) or a block
 * element left open would, in the full page, close / swallow the theme's own
 * wrappers — a tree an innerHTML fragment doesn't reproduce.
 */
export function shellSlot(body: string): string | null {
  const start = SLOT_START.exec(body);
  if (!start) return null;
  let end: RegExpExecArray | null = null;
  for (const m of Array.from(body.matchAll(SLOT_END))) end = m as RegExpExecArray;
  if (!end || end.index < start.index) return null;
  const slot = body.slice(start.index + start[0].length, end.index);
  const stack: string[] = [];
  for (const m of Array.from(slot.matchAll(TOKEN))) {
    const tag = m[3]?.toLowerCase();
    if (!tag || VOID.has(tag) || /\/\s*$/.test(m[4] ?? "")) continue;
    if (m[2] !== "/") {
      stack.push(tag);
      continue;
    }
    const i = stack.lastIndexOf(tag);
    if (i === -1) {
      if (IMPLICIT.has(tag) || INLINE.has(tag)) continue;
      return null;
    }
    stack.length = i;
  }
  return stack.every((t) => IMPLICIT.has(t) || INLINE.has(t)) ? slot : null;
}

/* ------------------------------------------------------------------ *
 * The theme's chrome regions inside the shell, for the native header /
 * footer (components/chrome/, `tefl/v1/native/chrome`).
 *
 *   header     the chunk inside #page before #content: skip link,
 *              astra_header_before, <header id="masthead">, astra_header_after,
 *              astra_content_before
 *   footer     the chunk inside #page after #content: offer banner,
 *              astra_content_after, astra_footer_before,
 *              <footer id="colophon">, astra_footer_after
 *   afterPage  the chunk after #page: astra_body_bottom, .footer-legal-holder,
 *              wp_footer (plugins; stays WordPress HTML), the sticky offer CTA
 * ------------------------------------------------------------------ */

export interface ChromeSlots {
  /** Index into shell.before of the header chunk. */
  header: number;
  /** Index into shell.after of the footer chunk. */
  footer: number;
  /** Index into shell.after of the chunk after #page. */
  afterPage: number;
}

/** Where the header / footer chunks are, or null when the shell isn't #page > #content. */
export function chromeSlots(shell: Shell): ChromeSlots | null {
  const n = shell.open.length;
  const c = shell.open.findIndex((o) => o.tag === "div" && o.attrs.id === "content");
  if (c < 1) return null;
  const page = shell.open[c - 1];
  if (page.tag !== "div" || page.attrs.id !== "page") return null;
  return { header: c, footer: n - c, afterPage: n - c + 1 };
}

/** True when a chunk contains the element with this id (an opening tag, not a mention in text/script). */
export function hasElementId(html: string, id: string): boolean {
  for (const m of Array.from(html.matchAll(TOKEN))) {
    if (m[3] && m[2] !== "/" && parseAttrs(m[4] ?? "").id === id) return true;
  }
  return false;
}

/**
 * The end (exclusive) of the element whose start tag begins at `start`, or -1
 * when its end tag isn't found / the markup doesn't nest.
 */
function elementEnd(html: string, start: number): number {
  const re = new RegExp(TOKEN.source, "g");
  re.lastIndex = start;
  const stack: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const tag = m[3]?.toLowerCase();
    if (!tag || VOID.has(tag) || /\/\s*$/.test(m[4] ?? "")) {
      if (!stack.length) return m.index + m[0].length; // a void / raw-text element at `start`
      continue;
    }
    if (m[2] !== "/") {
      stack.push(tag);
      continue;
    }
    const i = stack.lastIndexOf(tag);
    if (i === -1) {
      if (IMPLICIT.has(tag)) continue;
      return -1;
    }
    stack.length = i;
    if (!stack.length) return m.index + m[0].length;
  }
  return -1;
}

export type AfterPagePiece = string | { part: "legal" | "sticky" | "course" };

/**
 * Split the chunk after #page into WordPress HTML and the theme's own blocks
 * the React chrome renders: the legal-holder schema block, the sticky offer CTA
 * (its <style>, toggle, panel and <script>, after wp_footer) and
 * ti_footer_course_banner()'s offer banner (inside wp_footer). Only the parts
 * asked for are cut out, and only when found intact; anything else stays HTML.
 */
export function splitAfterPage(html: string, want: { sticky: boolean; course: boolean }): AfterPagePiece[] {
  const cuts: { start: number; end: number; part: "legal" | "sticky" | "course" }[] = [];

  const legal = /<div class="footer-legal-holder" style="display:none">/.exec(html);
  if (legal) {
    const end = elementEnd(html, legal.index);
    if (end !== -1) cuts.push({ start: legal.index, end, part: "legal" });
  }
  if (want.sticky) {
    const style = /<style>\s*\.sticky-offer-cta \{/.exec(html);
    const panel = style ? html.indexOf('<div class="sticky-offer-cta">', style.index) : -1;
    const panelEnd = panel !== -1 ? elementEnd(html, panel) : -1;
    const script = panelEnd !== -1 ? /^\s*<script\b[^>]*>[\s\S]*?<\/script\s*>/.exec(html.slice(panelEnd)) : null;
    if (style && script) cuts.push({ start: style.index, end: panelEnd + script[0].length, part: "sticky" });
  }
  if (want.course) {
    const banner = /<div style = "background-color:[^"]*" class="footer-course-banner course-banner-outer footer-promo-banner sales-offer-banner">/.exec(html);
    const end = banner ? elementEnd(html, banner.index) : -1;
    if (banner && end !== -1) cuts.push({ start: banner.index, end, part: "course" });
  }

  cuts.sort((a, b) => a.start - b.start);
  const out: AfterPagePiece[] = [];
  let pos = 0;
  for (const c of cuts) {
    if (c.start < pos) continue; // overlapping matches: keep the first
    out.push(html.slice(pos, c.start), { part: c.part });
    pos = c.end;
  }
  out.push(html.slice(pos));
  return out;
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
