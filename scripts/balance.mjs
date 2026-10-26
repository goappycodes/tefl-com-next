/**
 * Re-serialise HTML with balanced tags, following the HTML tree builder's main
 * recovery rules (what a browser does with `<h6>…</h2>`, stray `</div>`s,
 * `<p>` before block elements, unclosed `<li>`…). node-html-parser, which
 * domdiff uses, otherwise ignores a mismatched end tag and then flattens
 * everything after it, so the content slot can't be found.
 */
const TOKEN =
  /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!doctype[^>]*>|<(script|style|textarea|title|noscript|svg|xmp|iframe|noembed|noframes)\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/\1\s*>|<(\/?)([a-zA-Z][\w:-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr", "param", "keygen", "frame", "basefont", "bgsound"]);
const CLOSES_P = new Set([
  "address", "article", "aside", "blockquote", "center", "details", "dialog", "dir", "div", "dl", "fieldset", "figcaption",
  "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "main", "menu", "nav", "ol",
  "p", "pre", "section", "summary", "table", "ul", "li", "dd", "dt", "listing", "plaintext", "xmp",
]);
const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const SCOPE_STOP = new Set(["applet", "caption", "html", "table", "td", "th", "marquee", "object", "template"]);
const BUTTON_SCOPE_STOP = new Set([...SCOPE_STOP, "button"]);
const LIST_SCOPE_STOP = new Set([...SCOPE_STOP, "ol", "ul"]);
const IMPLIED = new Set(["dd", "dt", "li", "optgroup", "option", "p", "rb", "rp", "rt", "rtc"]);

export function balance(html) {
  // `<?…>` is a bogus comment in HTML (e.g. a literal `<?php?>` the theme prints).
  html = html.replace(/<\?[^>]*>/g,(m) => `<!--${m.slice(1, -1).replace(/--/g, "- -")}-->`);
  const out = [];
  const stack = [];
  const raws = []; // start-tag text of each open element (to re-open after a nested <a>)
  let pos = 0;

  const inScope = (pred, stops = SCOPE_STOP) => {
    for (let i = stack.length - 1; i >= 0; i--) {
      if (pred(stack[i])) return i;
      if (stops.has(stack[i])) return -1;
    }
    return -1;
  };
  const popTo = (i) => {
    while (stack.length > i) {
      raws.pop();
      out.push(`</${stack.pop()}>`);
    }
  };
  const closeP = () => {
    const i = inScope((t) => t === "p", BUTTON_SCOPE_STOP);
    if (i !== -1) popTo(i);
  };

  for (const m of html.matchAll(TOKEN)) {
    out.push(html.slice(pos, m.index));
    pos = m.index + m[0].length;
    if (m[1]) {
      // raw-text element: kept whole
      out.push(m[0]);
      continue;
    }
    const tag = m[5]?.toLowerCase();
    if (!tag) {
      out.push(m[0]);
      continue;
    }
    if (m[4] !== "/") {
      const selfClosed = /\/\s*$/.test(m[6] ?? "");
      if (CLOSES_P.has(tag)) closeP();
      if (HEADINGS.has(tag) && HEADINGS.has(stack[stack.length - 1])) popTo(stack.length - 1);
      if (tag === "li") {
        const i = inScope((t) => t === "li", LIST_SCOPE_STOP);
        if (i !== -1) popTo(i);
      }
      if (tag === "dd" || tag === "dt") {
        const i = inScope((t) => t === "dd" || t === "dt");
        if (i !== -1) popTo(i);
      }
      if (tag === "option" && stack[stack.length - 1] === "option") popTo(stack.length - 1);
      if (tag === "a") {
        // Nested <a>: the adoption agency closes the outer link but keeps the blocks opened
        // inside it open (moved after it). Approximate: close up to the outer <a>, re-open the rest.
        const i = inScope((t) => t === "a");
        if (i !== -1) {
          const reopen = stack.slice(i + 1).map((t, k) => [t, raws[i + 1 + k]]);
          popTo(i);
          for (const [t, r] of reopen) {
            out.push(r);
            stack.push(t);
            raws.push(r);
          }
        }
      }
      out.push(m[0]);
      if (!VOID.has(tag) && !selfClosed) {
        stack.push(tag);
        raws.push(m[0]);
      }
      continue;
    }
    // end tag
    if (VOID.has(tag)) {
      if (tag === "br") out.push("<br>");
      continue;
    }
    if (tag === "p" && inScope((t) => t === "p", BUTTON_SCOPE_STOP) === -1) {
      out.push("<p></p>");
      continue;
    }
    if (HEADINGS.has(tag)) {
      const i = inScope((t) => HEADINGS.has(t));
      if (i !== -1) popTo(i);
      continue;
    }
    if (tag === "body" || tag === "html") continue; // closed at the very end
    const i = inScope((t) => t === tag, tag === "li" ? LIST_SCOPE_STOP : SCOPE_STOP);
    if (i === -1) continue; // stray end tag: ignored
    // implied end tags are fine to synthesise; anything else between is a parse error the browser also closes
    popTo(i);
  }
  out.push(html.slice(pos));
  popTo(0);
  return out.join("");
}
void IMPLIED;
