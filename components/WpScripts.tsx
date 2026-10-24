"use client";

import { useEffect } from "react";

/**
 * Runs a rendered WordPress page's scripts after React has hydrated.
 *
 * The WP render endpoint marks every executable <script> as
 * `type="text/tefl-deferred"` so the browser doesn't run them while parsing the
 * server HTML (that would mutate the DOM before hydration). This re-activates
 * them, in DOCUMENT ORDER, exactly as the browser would have on the live site:
 *
 *   - external scripts load one at a time (each awaits the previous, so jQuery
 *     exists before plugins, Splide before its inits…); `async` ones don't block
 *   - inline scripts execute at their position in the sequence
 *   - `document.write` from a late script inserts in place instead of wiping the page
 *   - once all have run, DOMContentLoaded / load are re-dispatched (only if the
 *     real ones already fired) so `$(window).on('load')` and
 *     DOMContentLoaded-wrapped inits fire once, as on live
 *
 * Tracking (GTM, gtag, Meta, Awin, PageSense, Ahrefs, Clarity…) only runs when
 * NEXT_PUBLIC_ENABLE_TRACKING=1 — so staging/preview traffic never pollutes the
 * live analytics or ad conversions. Production sets it at cutover.
 *
 * A failing script never stops the rest; worst case a widget stays static.
 */

const TRACKING_ENABLED = process.env.NEXT_PUBLIC_ENABLE_TRACKING === "1";

/** Hosts / inline fingerprints of tracking & ad-attribution scripts. */
const TRACKING_SRC =
  /googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|connect\.facebook\.net|pagesense\.io|dwin1\.com|analytics\.ahrefs\.com|clarity\.ms|hotjar\.com|snap\.licdn\.com|bat\.bing\.com|tiktok\.com\/i18n|static\.ads-twitter\.com|gtag-events\.js|duracelltomi-google-tag-manager|awin-advertiser-tracking|metorik|sourcebuster|order-attribution|ShareASale|shareasale/i;
const TRACKING_INLINE =
  /googletagmanager\.com\/gtm\.js|gtag\(\s*['"]config|fbq\(\s*['"]init|connect\.facebook\.net|pagesense|dwin1\.com|clarity\.ms|hotjar|_linkedin_partner_id|analytics\.ahrefs\.com/i;

const EXTERNAL_TIMEOUT_MS = 12000;

function isTracking(el: HTMLScriptElement): boolean {
  const src = el.getAttribute("src");
  if (src) return TRACKING_SRC.test(src);
  return TRACKING_INLINE.test(el.textContent ?? "");
}

/** Clone a deferred script into a live one (original attributes, real type). */
function makeLive(old: HTMLScriptElement): HTMLScriptElement {
  const fresh = document.createElement("script");
  for (const attr of Array.from(old.attributes)) {
    if (attr.name === "type" || attr.name === "data-tefl-type") continue;
    fresh.setAttribute(attr.name, attr.value);
  }
  const original = old.getAttribute("data-tefl-type");
  if (original) fresh.type = original;
  if (!old.src) fresh.text = old.textContent ?? "";
  return fresh;
}

function runExternal(old: HTMLScriptElement): Promise<void> {
  return new Promise((resolve) => {
    const fresh = makeLive(old);
    const isAsync = old.hasAttribute("async");
    fresh.async = false;
    if (isAsync) fresh.async = true;
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    fresh.addEventListener("load", done);
    fresh.addEventListener("error", done);
    old.replaceWith(fresh);
    if (isAsync) done(); // async scripts never block the sequence (same as the parser)
    else window.setTimeout(done, EXTERNAL_TIMEOUT_MS);
  });
}

function runInline(old: HTMLScriptElement): void {
  try {
    old.replaceWith(makeLive(old)); // inline scripts execute synchronously on insertion
  } catch {
    /* one bad init shouldn't stop the rest */
  }
}

/**
 * While the page's scripts run, `document.write` must insert at the current
 * script instead of replacing the whole document (it's called after load).
 */
function patchDocumentWrite(): () => void {
  const original = document.write.bind(document);
  const originalLn = document.writeln.bind(document);
  const insert = (html: string) => {
    const at = document.currentScript;
    if (at && at.parentNode) at.insertAdjacentHTML("beforebegin", html);
    else document.body.insertAdjacentHTML("beforeend", html);
  };
  document.write = (...parts: string[]) => insert(parts.join(""));
  document.writeln = (...parts: string[]) => insert(parts.join("") + "\n");
  return () => {
    document.write = original;
    document.writeln = originalLn;
  };
}

type JQ = { holdReady?: (hold: boolean) => void; fn?: { jquery?: string } };

/**
 * Hold jQuery's ready event until every script has run.
 *
 * On live, `$(fn)` handlers fire after the parser has executed ALL scripts, so
 * a theme init can rely on a library that's enqueued after it (select2,
 * AFFWP config in the footer…). Here the document is already complete when
 * jQuery loads, so it would fire ready on the next tick — between two of our
 * sequential loads. Trapping the `window.jQuery` assignment lets us call
 * holdReady(true) synchronously, before that tick; we release it at the end.
 * Covers every copy of jQuery a page loads.
 */
function holdJQueryReady(): () => void {
  const held: JQ[] = [];
  const hold = (jq: unknown) => {
    const j = jq as JQ;
    if (j && typeof j.holdReady === "function" && !held.includes(j)) {
      j.holdReady(true);
      held.push(j);
    }
  };
  const w = window as unknown as Record<string, unknown>;
  let current = w.jQuery;
  hold(current);
  try {
    Object.defineProperty(window, "jQuery", {
      configurable: true,
      enumerable: true,
      get: () => current,
      set: (v) => {
        current = v;
        hold(v);
      },
    });
  } catch {
    /* non-configurable in some odd environment — ready just fires early */
  }
  return () => {
    try {
      Object.defineProperty(window, "jQuery", { configurable: true, enumerable: true, writable: true, value: current });
    } catch {
      /* ignore */
    }
    for (const j of held) j.holdReady?.(false);
  };
}

/**
 * With tracking off, inline snippets still call gtag()/fbq() directly; give
 * them no-op stand-ins so they don't throw (and abort the rest of their block).
 */
function stubTracking() {
  if (TRACKING_ENABLED) return;
  const w = window as unknown as Record<string, unknown>;
  w.dataLayer = w.dataLayer || [];
  const noop = () => undefined;
  for (const name of ["gtag", "fbq", "_fbq", "clarity", "hj", "lintrk", "ttq"]) {
    if (typeof w[name] === "undefined") w[name] = noop;
  }
  // Queue-style globals are arrays that snippets .push() onto.
  for (const name of ["uetq", "_hsq", "_paq"]) {
    if (typeof w[name] === "undefined") w[name] = [];
  }
}

let ranFor: string | null = null;

export default function WpScripts({
  rootId,
  bodyClass,
  title,
}: {
  rootId: string;
  bodyClass?: string;
  title?: string;
}) {
  useEffect(() => {
    // Run once per page. React strict mode (dev) mounts → unmounts → re-mounts;
    // the run must survive that, so there's no cancel-on-cleanup — the theme's
    // scripts can't be "un-run" anyway.
    const key = `${location.pathname}${location.search}`;
    if (ranFor === key) return;
    ranFor = key;

    // Normally server-rendered by the layout; the not-found view has no layout
    // payload, so apply the page's body class / title here instead.
    if (bodyClass && !document.body.className) document.body.className = bodyClass;
    if (title && !document.title) document.title = title;

    const restoreWrite = patchDocumentWrite();
    const releaseReady = holdJQueryReady();
    stubTracking();

    void (async () => {
      const scripts = Array.from(
        document.querySelectorAll<HTMLScriptElement>('script[type="text/tefl-deferred"]'),
      );
      for (const el of scripts) {
        if (!el.isConnected) continue;
        if (!TRACKING_ENABLED && isTracking(el)) continue;
        if (el.getAttribute("src")) await runExternal(el);
        else runInline(el);
      }
      restoreWrite();
      releaseReady(); // every script has run — now $(fn) handlers fire, as on live

      // Let DOMContentLoaded / load handlers registered by those scripts fire —
      // but only if the real events are already past, so nothing fires twice.
      if (document.readyState !== "loading") {
        document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
      }
      const fireLoad = () => window.dispatchEvent(new Event("load"));
      if (document.readyState === "complete") fireLoad();
      // else: the browser's own load event is still to come and will reach them.
      document.getElementById(rootId)?.setAttribute("data-scripts", "done");
    })();
  }, [rootId, bodyClass, title]);

  return null;
}
