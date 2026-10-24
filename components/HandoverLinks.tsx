"use client";

import { useEffect } from "react";

import { AFF_CAMPAIGN_COOKIE, AFF_CAMPAIGN_PARAM, AFF_REF_COOKIE, AFF_REF_PARAM } from "@/lib/attribution";
import { WP_ORIGIN, WP_OWNED_PATH, WP_OWNED_QUERY } from "@/lib/wp";

/**
 * Carries an AffiliateWP referral from the Next front to the WordPress
 * hand-over (cart, checkout, add-to-cart, addtimetocart) when the two are on
 * DIFFERENT hosts — the parallel run on next.teflinstitute.com, localhost, or a
 * cms.* backend. AffiliateWP's own tracking cookie lives on the page's host, so
 * across hosts WordPress can't see it; `?ref=` on the hand-over URL it reads
 * natively. On the same host (cutover with WordPress paths served under
 * teflinstitute.com) this does nothing: the cookie already reaches checkout,
 * and a second `?ref=` would only log a duplicate visit.
 *
 * Covers link clicks and form submits (add-to-cart / gift-card POSTs) in the
 * capture phase, just before the browser navigates. Navigations theme scripts
 * start with `location.href = …` are not covered — parallel run only.
 */
const WP_HOST = new URL(WP_ORIGIN).host;
const COUNTRY_PREFIX = /^\/(gb|za|nl|ca|it|fr)(?=\/|$)/;

function readCookie(name: string): string {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

/** The URL with ?ref=/&campaign= added, or null when it isn't a cross-host hand-over. */
function withReferral(raw: string): string | null {
  const ref = readCookie(AFF_REF_COOKIE);
  if (!ref) return null;
  let url: URL;
  try {
    url = new URL(raw, location.href);
  } catch {
    return null;
  }
  if (url.host !== WP_HOST || url.host === location.host) return null;
  const bare = url.pathname.replace(COUNTRY_PREFIX, "") || "/";
  if (!WP_OWNED_PATH.test(bare) && !WP_OWNED_QUERY.test(url.search)) return null;
  if (url.searchParams.has(AFF_REF_PARAM)) return null;
  // Append to the query as written: re-serialising would turn the theme's bare
  // "?addtimetocart&prid=1" into "addtimetocart=&prid=1".
  let extra = `${AFF_REF_PARAM}=${encodeURIComponent(ref)}`;
  const campaign = readCookie(AFF_CAMPAIGN_COOKIE);
  if (campaign && !url.searchParams.has(AFF_CAMPAIGN_PARAM)) extra += `&${AFF_CAMPAIGN_PARAM}=${encodeURIComponent(campaign)}`;
  url.search = url.search ? `${url.search}&${extra}` : `?${extra}`;
  return url.toString();
}

export default function HandoverLinks() {
  useEffect(() => {
    if (location.host === WP_HOST) return;

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      const href = a?.getAttribute("href");
      const next = href ? withReferral(href) : null;
      if (a && next) a.setAttribute("href", next);
    };
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement | null;
      const action = form?.getAttribute("action");
      const next = action ? withReferral(action) : null;
      if (form && next) form.setAttribute("action", next);
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}
