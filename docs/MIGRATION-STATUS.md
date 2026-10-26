# teflinstitute.com headless migration — status and what's left

_Last updated 2026-10-24. Companion to the README (architecture) and to the TEFL.ie
"Headless Migration — Technical Integration Reference" (Oct 2026), whose lessons
this pass applied._

## Handover (start here)

_Kept current on every push, so the work can continue from any machine._

### Where everything is

| What | Where |
|---|---|
| Next app | GitHub `goappycodes/tefl-com-next`, branch `main`. Every push to `main` deploys to **https://next.teflinstitute.com** (Vercel, noindex) |
| WordPress (live, production) | Forge server `ssh forge@134.209.25.72`, WP root `~/teflinstitute.com`, no sudo. Needs your SSH key on the server |
| WordPress code we own | `wordpress/` in this repo → deployed by hand (scp) to `wp-content/themes/teflinstitute/headless/` and `wp-content/mu-plugins/` |
| Theme source (reference for ports) | Not in this repo. Fetch from the server into a sibling folder: `mkdir -p ../teflinstitute-wp/wp-content/themes && cd ../teflinstitute-wp/wp-content/themes && ssh forge@134.209.25.72 'cd ~/teflinstitute.com/wp-content/themes && tar --exclude=.git -czf - teflinstitute' \| tar -xzf -` |
| `ISRSECRET` | Not in git. Same value as `TEFL_ISR_SECRET` in the server's `wp-config.php` (`grep TEFL_ISR_SECRET ~/teflinstitute.com/wp-config.php`) and in the Vercel project env |

### Set up on a new machine

```bash
git clone https://github.com/goappycodes/tefl-com-next.git && cd tefl-com-next
npm install
cp .env.example .env.local   # then set ISRSECRET (see above)
npm run dev                  # http://localhost:3000
node scripts/domdiff.mjs /blog/what-is-edtpa/   # sanity check: 0 differing
```

### Current state

- **Staging** serves every URL. Native React so far: blog posts, destinations
  (teach-abroad guides, guides, country, jobs, support, placements, FAQ), promos
  (sale and campaign landing pages), overviews (course overviews, recommender,
  shop, TEFL Plus, trial, gift vouchers), home (homepages incl. `/`, internships,
  screening forms). Everything
  else is the passthrough render (WordPress HTML) until its family is pushed.
- **WordPress → staging cache purges are live** (`TEFL_ISR_BASE_URL` set; see "Done").
- **Phase 2 (native React)**: progress table in the README ("Phase 2 progress").
  Courses and pages are being ported in parallel. A family lands in git only once it
  shows 0 differences against live; until then its files exist only in the
  working copy of the machine doing the port, and its endpoint file may
  already be on the server in `headless/native/` (REST-only and inert until the
  Next side calls it). Compare `ssh … ls ~/teflinstitute.com/wp-content/themes/teflinstitute/headless/native/`
  with `wordpress/headless/native/` here to see what's deployed but not committed.

### Watch out for

- **MalCare firewall.** Heavy verification traffic from one IP gets it blacklisted
  (every PHP request then 403s with "Blocked because of Malicious Activities").
  Happened 2026-10-26 to `49.47.154.137`; fixed by whitelisting it in the MalCare
  dashboard (it syncs to the site within ~5 min). Keep diff sweeps small; whitelist
  any new machine's IP before a big run.
- **Cloudflare edge-caches `index.php?rest_route=…`** (ignores `no-store`). Native
  data fetches add a one-minute `&_m=` buster (`lib/native/data.ts`). Cleaner:
  a Cloudflare cache rule "bypass cache when query contains `rest_route=`"
  (dashboard access needed). `/wp-json/` is already not cached.

### How to continue

1. Port a template (or finish a family): follow `docs/NATIVE-TEMPLATES.md`.
   Families and their templates are listed in the README progress table; the
   registry entry goes in `lib/native/families/<family>.tsx`.
2. Verify with `node scripts/domdiff.mjs <paths…>`: 0 differing across the US
   root and the six geo folders.
3. Commit only verified files, update the README progress table and this
   section, check the committed tree builds, push. (Don't run `next build` in
   a checkout whose dev server is running: they share `.next`.)
4. After the families: port the header & footer (theme's own markup only;
   `wp_head`/`wp_footer` plugin output stays WordPress HTML), then the P1/P2
   items under "What's left".

## How this differs from TEFL.ie

TEFL.ie rebuilt every page as native React (72 routes, 147 components) and then had
to re-implement each WordPress integration by hand: geo pricing calls, CF7 forms,
reCAPTCHA, the phone field, deposits, the header cart, trackers, consent, chat. Most
of its "known gaps" come from that re-implementation.

teflinstitute.com is in **phase 1: passthrough**. Every page is WordPress's own HTML
(`tefl/v1/render`), and the theme and plugin scripts run unchanged in the browser
(`WpScripts`). So geo pricing, forms, consent, chat, reviews and timers are the live
site's own code. The work is making the edges right: query strings, cookies, the
WordPress hand-over, caching, and the cutover. Native React templates (phase 2) can
reuse TEFL.ie's components and lessons later.

## Done

### Live WordPress (all additive; live behaviour unchanged)

| Change | Where | State |
|---|---|---|
| `TEFL_ISR_SECRET` (random 64-hex, same value as `ISRSECRET` in `.env.local`) | `wp-config.php`, above "stop editing". Backup: `~/wp-config.php.bak-20261024-085845-isrsecret` | Set; OPcache reset; site verified 200 |
| `tefl-isr-revalidate.php` mu-plugin | `wp-content/mu-plugins/` (source: `wordpress/tefl-isr-revalidate.php`) | **Active** against staging (see below) |
| `TEFL_ISR_BASE_URL=https://next.teflinstitute.com` | `wp-config.php`, below `TEFL_ISR_SECRET`. Backup: `~/wp-config.php.bak-20261024-102532-isrbaseurl` | Set 2026-10-24; OPcache reset; live verified 200. `wp tefl isr pages` → `HTTP 200` (staging homepage `REVALIDATED`); `wp tefl isr p:/blog/` → `HTTP 200`. Change to `https://teflinstitute.com` at cutover |
| Theme git snapshot | Server repo `wp-content/themes/teflinstitute`, commit `15c615b` (all live edits since Sep 2024) | Committed |

The headless layer (`wp-content/themes/teflinstitute/headless/`) was already live and
matches `wordpress/headless/` here (line endings only). Added 2026-10-24:
`rest-post.php` (`tefl/v1/post`, read-only) + its `require_once` in `bootstrap.php`
(backup `~/headless-bootstrap.php.bak-*`); OPcache reset; live verified 200.

### Phase 2: native React templates

| Template | State |
|---|---|
| Blog post (781 posts × 7 folders, ~80% of all URLs) | **Ported** (`components/blog/`, `tefl/v1/post`). DOM diff of the article against live: 0 differences on 25 post URLs across all 7 folders, including FAQs, key takeaways and YouTube embeds (Complianz consent placeholders applied by the endpoint). FAQ accordion, salary ticker, progress bar, author bio, copy link and the GA4 `blog_*` events are React; the theme's `ti-single-post-redesign.js` is dropped on these pages |

Next candidates by URL count: teach-abroad guides (63), pages by template
(112: course overview, homepage…), courses (24), internships (13). Then the
header/footer, which removes the per-page shell render.

Also fixed for every page: the blog redesign's `UrbanistTI` font was blocked
cross-origin (no CORS on nginx fonts); it's now self-hosted with the Astra icon fonts.

### Next app (this repo)

- **Query renders** (`lib/render.ts`, `middleware.ts`). The catch-all used to drop
  every query string, so pages WordPress renders from `$_GET` came out wrong. The
  allowlisted params in `RENDER_QUERY_PARAMS` are now rewritten to
  `/<cc>/__q/<base64url query>/<path>/` and passed to WordPress. That covers search
  `s`, the course recommender (`usertype`/`userpreference`/`userlevel`/`userqual` on
  `/search-courses/`), podcast `pg`, Hope Foundation `month`, timetable `offset` and
  blog `redesign`. Tracking params (`utm_*`, `gclid`, …) are ignored, so those URLs
  keep the cached page. This replaces the old search-only `/__search/` rewrite.
  Verified: the recommender returns the same courses as live; searches with `&`/`%` arrive intact.
- **WordPress-owned query actions** (`lib/wp.ts` `WP_OWNED_QUERY`). These now hand
  over to WordPress so its PHP runs: `coupon-code` (Smart Coupons URL coupons),
  `empty_cart`, `remove_coupon`, `download_file`, `wcpbc-manual-country`, editor
  `preview`/`preview_id`, shortlinks `p`/`page_id`, comment moderation links.
- **Attribution** (`lib/attribution.ts`, `middleware.ts`, `components/HandoverLinks.tsx`):
  - AffiliateWP `?ref=` / `?campaign=` go into first-party cookies. When checkout is
    on a *different host* (the parallel run on `next.`, localhost, or a `cms.`
    backend), they're appended to cart, checkout, add-to-cart and addtimetocart
    links and form actions. On the same host they're left alone, because
    AffiliateWP's own cookie already reaches checkout.
  - Awin: the plugin stores `?awc=`/`?source=` in `adv_awc`/`source` cookies from
    PHP on `init`, which never runs for a Next page. Middleware now sets the
    identical cookies (HttpOnly, Secure, 30 days, `Domain=teflinstitute.com`).
- **Staging tracking gate** (`components/WpScripts.tsx`). Added Apollo (its inline
  loader slipped through) and AffiliateWP's visit tracker. A localhost test logged
  a real visit in live AffiliateWP, so staging must not run it.

### Audit: how each integration behaves on the Next front

Checked by reading live config and code, then loading pages on Next (localhost)
against live WordPress, side by side with live.

| Area | On Next today | Notes |
|---|---|---|
| Geo pricing (WCPBC, `WCPBC_USE_REMOTE_ADDR`) | ✅ `wc-ajax=wcpbc_get_location` from the browser via CORS; prices match live (India → USD, $545/$205) | Visitor's own IP; never proxied |
| City logo / geo phone (`ti_combined_ajax_geo_actions`) | ✅ | admin-ajax via CORS |
| Contact Form 7 (41 forms) | ✅ schema loads; CF7 JS posts to WP REST | ⚠ reCAPTCHA v3 key `6LcQNNIc…` must allow `next.teflinstitute.com`. No live submission tested |
| Complianz banner | ✅ | Consent is stored per host |
| Zoho SalesIQ, Trustpilot, Instagram feed, Splide/Glide sliders | ✅ | |
| WooCommerce cart/checkout/account/product | ✅ hand-over to WordPress (links absolute, middleware 307) | |
| Course enrol (`?addtimetocart&prid=…`) | ✅ hand-over | |
| AffiliateWP | ✅ JS tracking (`tracking_fallback`=0, `cookie_sharing`=0) + hand-over decoration | Affiliate area stays on WordPress |
| AFL UTM tracker | ✅ client-side (`js_autorun`=1) | Cookies on page host; fine once same host |
| Awin | ✅ server cookie mirrored; `dwin1` MasterTag gated on staging | |
| Smart Coupons URL coupons | ✅ hand-over to WordPress | |
| Side cart (xoo) on Next pages | ⚠ cross-origin before cutover: the jQuery AJAX sends no cookies, so it shows an empty cart | Works once same host (see cutover) |
| Session-writing AJAX (`ti_store_selected_courses`, `ti_c26_enrol`, `pt_add_product_elt`, `save_spin_email`, `ti_wx_claim`) | ⚠ same as the side cart: not tied to the visitor's WP session until same host | Verify after cutover |
| Server-side geo in templates (`get_user_geo_country_code()` in course/sale templates, `get_user_timezone()` → ip-api) | = live | Live already serves one WPFC-cached HTML per URL to every anonymous visitor (`x-teflcom-pagecache`); client AJAX localises. ⚠ Unverified: what a loopback-generated cache file geolocates to (server IP) |
| Redirects (Redirection plugin) | ✅ the render endpoint passes WordPress 301/302s through | |
| 410s (`tefl-casino-410` mu-plugin) | ⚠ become 404 on Next | |
| Cache purges | ✅ ACF options save, WPFC "delete all" and the UK DST purge (`ti-dst-cache-purge`) all fire `wpfc_delete_cache` → ISR `pages` tag, once configured | Normal publishes purge only the homepage/post (WPFC settings) |
| Payments (Stripe ×2, PayPal, Revolut, Klarna), AutomateWoo, Moodle/Edwiser, SSO | Stay on WordPress | Unaffected under a same-host cutover |
| Trackers on live (GTM4WP, gtag AW-11116325429 + AW-456043344, Meta via facebook-for-woocommerce, Clarity, PageSense, Ahrefs, Awin, Apollo, Bing UET via Complianz) | Gated on staging | They're the page's own scripts, so `NEXT_PUBLIC_ENABLE_TRACKING=1` at cutover turns them all on. Nothing to rebuild, unlike TEFL.ie |

## Recommended cutover: same host, split by path at Cloudflare

The README already plans for WordPress-owned paths to be "proxied to WordPress at
the CDN". **Recommendation:** keep WordPress's home URL `https://teflinstitute.com`
and put a Cloudflare Worker on `teflinstitute.com/*` that routes by path and query:

- **To WordPress (the Forge origin, as today):** `WP_OWNED_PATH` (cart, checkout,
  my-account, product, affiliate-area/login, wp-admin, wp-json, wp-content,
  wp-includes, feeds, lms-sso…), every `*.php`, `WP_OWNED_QUERY` actions
  (`add-to-cart`, `addtimetocart`, `wc-ajax`, `wc-api`, `coupon-code`…), and the WP
  sitemaps/robots if preferred.
- **To Vercel:** everything else.

Why this and not TEFL.ie's `cms.` subdomain: each of these TEFL.ie gaps disappears
because checkout, AJAX and pages share one origin.

- Cookies: WooCommerce session (side cart, session AJAX), AffiliateWP, Awin, AFL UTM,
  WooCommerce order attribution and Complianz consent all just work.
- Analytics: no cross-domain GA4 setup or referral exclusions.
- Payments and email: no gateway webhook or return-URL changes, no AutomateWoo
  licence re-activation, and emails' hardcoded `teflinstitute.com/wp-content/…`
  images keep resolving.
- Affiliate area: no proxy Worker that rewrites HTML and Set-Cookie.
- Pricing: WordPress still sees the visitor IP through Cloudflare (`CF-Connecting-IP`),
  exactly as now.

`NEXT_PUBLIC_WP_ORIGIN` stays `https://teflinstitute.com`. The server-side render
fetch reaches WordPress through the Worker's `/wp-json/` rule.

## What's left

### P0: stand up staging

1. ~~**Vercel project** for this repo, domain `next.teflinstitute.com`.~~ Done:
   staging is live (noindex, cart hand-over 307, revalidate endpoint 401 without the secret).
2. ~~**`TEFL_ISR_BASE_URL=https://next.teflinstitute.com`** in wp-config, then
   `wp tefl isr pages`: expect `HTTP 200`.~~ Done 2026-10-24 (see table above).
   Still to confirm: a real editor save in wp-admin shows on staging within seconds.
3. **reCAPTCHA v3**: add `next.teflinstitute.com` to the key's allowed domains
   (Google console), then submit one form of each kind.
4. **Warm the cache** (`npm run warm-cache -- https://next.teflinstitute.com --all`,
   about 1,100 paths × 7 folders) during low traffic, watching PHP-FPM. TEFL.ie had
   2,088 origin timeouts from a stampede, so lower `WARM_CONCURRENCY` if workers saturate.
5. **Test data cleanup**: AffiliateWP visit **#19827** (affiliate 55, URL `localhost:3000`,
   no referral) was created by a test before the gate existed. Delete it with the
   owner's OK.

### P1: parity QA on staging

- **URL parity crawl**: every sitemap URL × 7 geo folders on Next vs live, comparing
  status, title, canonical, hreflang and H1 (TEFL.ie: 821/821). Script still to write.
- **Forms**: one live submission per form family (callback, brochure/guide,
  newsletter, screening, salary calculator, webinar, spin-the-wheel, TEFL for
  Schools, partner forms). Confirm mail, Zapier/Zoho, CFDB7, `detected` country.
- **Checkout E2E from Next pages**: addtimetocart with date, deposit plan, diploma
  `selected_courses`, gift voucher, `?coupon-code=` link, Klarna, then a real low-value payment.
- **410 parity**: return 410 for `tefl-casino-410` URLs. The render endpoint should
  report 410, and Next needs a way to emit it (middleware list or a route handler).
- **Loopback geolocation**: confirm what a WPFC cache file created by the render
  loopback (REMOTE_ADDR 127.0.0.1) shows for geo-dependent bits. If it differs from
  a visitor-created file, send `X-Forwarded-For`/`CF-IPCountry` for a neutral
  default from `tefl_headless_loopback()`.
- **Page weight**: about 240 KB gzip vs about 85 KB on live, from the doubled
  markup plus about 160 KB of inline theme CSS per page. Move the repeated inline
  CSS into cached stylesheets (README "Infra follow-ups").
- **Font CORS**: nginx header for fonts (needs sudo; README). Then
  `public/wp-fonts` can go.
- **Sync PHP with TS**: `tefl_headless_rewrite_href()` in
  `wordpress/headless/rest-render.php` only treats WooCommerce cart actions as
  WordPress-owned. Mirror the new `WP_OWNED_QUERY` params there on the next PHP
  deploy. Links work meanwhile via the middleware redirect.

### P2: cutover

- Build the **Cloudflare edge Worker** (routing above) plus a **trusted
  forwarded-host header** in `middleware.ts`. Vercel will see its own hostname, so
  `INDEXABLE_HOSTS` must trust `X-Forwarded-Host` only when a shared-secret header
  from the Worker is present. Rehearse on a test hostname first.
- Write `DOMAIN-SWITCH-CHECKLIST.md` for teflinstitute.com, adapted from TEFL.ie's:
  - Worker route live
  - `TEFL_ISR_BASE_URL=https://teflinstitute.com`
  - `NEXT_PUBLIC_ENABLE_TRACKING=1` in Vercel Production only
  - GSC sitemap resubmit
  - 404 and crawl monitoring
  - a real payment
  - rollback = remove the Worker route

  Most of TEFL.ie's ⚠ items (gateway webhooks, AutomateWoo licence, email images,
  cross-domain GA4, affiliate proxy) don't apply under the same-host design.
- After cutover, verify the side cart and session-writing AJAX on Next pages.

### Known minor gaps

- Theme navigations done with `location.href = …` (e.g. some enrol flows) aren't
  decorated with `?ref=`. That only matters during a cross-host parallel run.
- Complianz's JS-injected policy links stay absolute to WordPress (fine under
  same host).
- A pre-existing theme bug on live too: `ti-global.js` sets `background:url(undefined)`
  on Glide slides at ≤768px (no `data-mobile-bg`), which 404s.
