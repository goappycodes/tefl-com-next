#!/usr/bin/env node
/**
 * DOM diff of a native template against live WordPress.
 *
 *   node scripts/domdiff.mjs [--base http://localhost:3000] [--selector "#content"] [--max 40] [--delay 2000] [--mask-geo] <path> […]
 *
 * Fetches each path from live (https://teflinstitute.com) and from the Next
 * app (--base), takes the element matching --selector in both server HTML
 * (no JS runs), and compares them as a normalised tree: tag, attributes
 * (sorted; class tokens sorted; styles and on-site URLs normalised) and
 * whitespace-collapsed text. JSON-LD compares as parsed JSON. Prints the
 * differing lines per path, then a summary; exits 1 if any path differs.
 *
 * Both documents are first re-balanced the way a browser's tree builder would
 * (scripts/balance.mjs): the theme's invalid markup (`<h6>…</h2>`, stray end
 * tags) otherwise makes node-html-parser flatten the page.
 *
 * The default selector is the content slot every template shares
 * (#content > .ast-container), i.e. exactly what a native template renders.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
import { balance } from "./balance.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { parse } = require(path.join(root, "node_modules/next/dist/compiled/node-html-parser"));

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return dflt;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const LIVE = opt("live", "https://teflinstitute.com");
const BASE = opt("base", "http://localhost:3000");
const SELECTOR = opt("selector", "#content > .ast-container");
const MAX = Number(opt("max", "40"));
// Pause between paths: each Next render makes several PHP requests to WordPress, and a
// burst from one IP got it blacklisted by MalCare (2026-10-26). Keep sweeps gentle.
const DELAY = Number(opt("delay", "2000"));
// --mask-geo: hide values WordPress computes from the visitor's geolocation or the render date
// (live serves whatever the first visitor after a cache flush saw): price HTML, Save-% badges,
// JSON-LD price fields.
const MASK_GEO = args.includes("--mask-geo");
if (MASK_GEO) args.splice(args.indexOf("--mask-geo"), 1);
const GEO_KEYS = new Set(["price", "priceCurrency", "lowPrice", "highPrice", "validFrom"]);
// The geolocated country the theme stamps on price / Klarna blocks.
const GEO_ATTRS = new Set(["data-cc", "data-country"]);
// …and per-render values: WooCommerce's random quantity input ids, uniqid() ids,
// the countdown shortcode's `<now>--<expiry>` timestamp class.
const maskVolatile = (v) =>
  v
    .replace(/quantity_[0-9a-f]{8,}/gi, "quantity_[id]")
    .replace(/\b\d{10}--\d{10}\b/g, "[now]--[expiry]")
    .replace(/\b[0-9a-f]{13}\b/g, "[uniqid]");
const maskLd = (v) =>
  Array.isArray(v)
    ? v.map(maskLd)
    : v && typeof v === "object"
      ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, GEO_KEYS.has(k) ? "[geo]" : maskLd(x)]))
      : v;
const paths = args;
if (!paths.length) {
  console.error("usage: node scripts/domdiff.mjs [--base URL] [--selector CSS] [--max N] <path>…");
  process.exit(2);
}

const ORIGINS = new RegExp(`^(${[LIVE, BASE].map((o) => o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
const normUrl = (u) => u.replace(ORIGINS, "") || "/";

const ENTITIES = { nbsp: " ", rarr: "→", larr: "←", middot: "·", minus: "−", ndash: "–", mdash: "—", euro: "€", pound: "£", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", times: "×", copy: "©", reg: "®", trade: "™", quot: '"', apos: "'", lt: "<", gt: ">", amp: "&" };
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);

const normStyle = (v) =>
  v
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const i = d.indexOf(":");
      const prop = d.slice(0, i).trim().toLowerCase();
      const val = d
        .slice(i + 1)
        .trim()
        .replace(/"/g, "'")
        .replace(/\s+/g, " ")
        .replace(/url\(\s*'?([^')]*)'?\s*\)/g, (_, u) => `url(${normUrl(u)})`);
      return `${prop}:${val}`;
    })
    .join(";");

const URL_ATTRS = new Set(["href", "src", "action", "data-url", "poster", "data-src", "data-href"]);

function serialise(rootEl, pagePath) {
  const out = [];
  const walk = (n, d) => {
    const pad = " ".repeat(d);
    if (n.nodeType === 3) {
      let t = decode(n.rawText).replace(/\s+/g, " ").trim();
      if (MASK_GEO) t = t.replace(/\b\d+(?:\.\d+)?%/g, "[n]%");
      if (t) out.push(pad + JSON.stringify(t));
      return;
    }
    if (n.nodeType !== 1) return;
    const tag = n.rawTagName.toLowerCase();
    if (tag === "script" && /ld\+json/.test(n.getAttribute("type") || "")) {
      let j;
      try {
        j = JSON.stringify(MASK_GEO ? maskLd(JSON.parse(n.rawText)) : JSON.parse(n.rawText));
      } catch {
        j = "BADJSON " + n.rawText.trim().slice(0, 80);
      }
      out.push(`${pad}<script ld> ${j}`);
      return;
    }
    if (MASK_GEO && /(^|\s)(wcpbc-price|woocommerce-Price-amount|savings)(\s|$)/.test(n.getAttribute("class") || "")) {
      out.push(pad + " [geo price]");
      return;
    }
    let entries = Object.entries(n.attributes);
    if (tag === "script") {
      // The render defers every executable script (type="text/tefl-deferred",
      // the original type kept in data-tefl-type) and WpScripts runs it as-is:
      // compare the script's real type, not the deferral marker.
      const real = (n.getAttribute("data-tefl-type") || n.getAttribute("type") || "").toLowerCase();
      const plain = ["", "text/javascript", "application/javascript", "text/ecmascript", "text/tefl-deferred"].includes(real);
      entries = entries.filter(([k]) => !["type", "data-tefl-type"].includes(k.toLowerCase()));
      if (!plain) entries.push(["type", real]);
    }
    if (tag === "form" && /^post$/i.test(n.getAttribute("method") || "")) {
      // The render gives action-less POST forms the page URL (tefl_headless_rewrite_html),
      // which is where the browser posts them anyway: compare them as action-less.
      entries = entries.filter(([k, v]) => !(k.toLowerCase() === "action" && normUrl(decode(v)).split("#")[0] === pagePath));
    }
    const attrs = entries
      .map(([k, v]) => {
        k = k.toLowerCase();
        v = decode(v);
        if (k === "class") v = v.split(/\s+/).filter(Boolean).sort().join(" ");
        else if (k === "style") v = normStyle(v);
        else if (k === "srcset") v = v.split(",").map((c) => c.trim().split(/\s+/).map((p, i) => (i ? p : normUrl(p))).join(" ")).join(", ");
        else if (URL_ATTRS.has(k)) v = normUrl(v);
        if (MASK_GEO) v = GEO_ATTRS.has(k) ? "[geo]" : maskVolatile(v);
        return `${k}=${v}`;
      })
      .sort();
    out.push(`${pad}<${tag}${attrs.length ? " " + attrs.join(" | ") : ""}>`);
    if (tag === "svg") {
      out.push(`${pad} [svg ${n.innerHTML.replace(/\s+/g, " ").replace(/\s*\/>/g, "/>").replace(/>\s+</g, "><").trim()}]`);
      return;
    }
    if (tag === "script" || tag === "style") {
      const body = n.rawText.replace(/\s+/g, " ").trim();
      if (body) out.push(`${pad} [${tag} ${body.length} chars]`);
      return;
    }
    for (const c of n.childNodes) walk(c, d + 1);
  };
  walk(rootEl, 0);
  return out;
}

function lineDiff(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out = [];
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      i++;
      j++;
    } else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) out.push(`+ next ${b[j++]}`);
    else out.push(`- live ${a[i++]}`);
  }
  return out;
}

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (tefl domdiff)" }, redirect: "manual" });
  return { status: res.status, doc: parse(balance(await res.text()), { comment: false, blockTextElements: { script: true, style: true, noscript: true, pre: true } }) };
}

let failed = 0;
for (const [i, p] of paths.entries()) {
  if (i) await new Promise((r) => setTimeout(r, DELAY));
  const [live, next] = await Promise.all([get(LIVE + p), get(BASE + p)]);
  const L = live.doc.querySelector(SELECTOR);
  const N = next.doc.querySelector(SELECTOR);
  if (live.status !== next.status || !L || !N) {
    failed++;
    console.log(`✗ ${p}: status live ${live.status} / next ${next.status}; selector found live ${!!L} / next ${!!N}`);
    continue;
  }
  const a = serialise(L, p.split("?")[0]);
  const b = serialise(N, p.split("?")[0]);
  const d = lineDiff(a, b);
  if (d.length) failed++;
  console.log(`${d.length ? "✗" : "✓"} ${p}: ${a.length} lines, ${d.length} differing`);
  if (d.length) console.log(d.slice(0, MAX).map((l) => "    " + l.slice(0, 400)).join("\n"));
}
console.log(`\n${paths.length - failed}/${paths.length} identical`);
process.exit(failed ? 1 : 0);
