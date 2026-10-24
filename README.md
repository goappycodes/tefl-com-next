# teflinstitute.com — Next.js front-end (WordPress headless)

Next.js replica of **teflinstitute.com**, with WordPress as the headless CMS and
WooCommerce as the shop. Same architecture and conventions as the TEFL IE
project (`goappycodes/tefl-ie-next`): every URL keeps its exact WordPress path,
content is cached with on-demand ISR, and the visitor is handed to WordPress
once they reach the cart.

## How it works

```
Browser ──► Next (Vercel)  app/[[...path]]  ──fetch (ISR, tagged)──►  WordPress  tefl/v1/render?path=/gb/x/
   │                                                                      │ loopback-renders the real page
   │  ◄── exact HTML: <html lang>, <head> SEO, body class, theme CSS ─────┘ (bypasses Cloudflare, WPFC-cached)
   │
   ├── theme/plugin JS re-activated in document order (components/WpScripts.tsx)
   ├── geo prices / city logo / CF7 / timetable: browser ──► WP admin-ajax / wc-ajax / wp-json (CORS, visitor IP)
   └── /cart/, /checkout/, /product/, /my-account/, ?add-to-cart= ──► WordPress (hand-over)
```

### Every URL, every geo folder

teflinstitute.com serves the US site at `/` and one folder per market —
`/gb/ /za/ /nl/ /ca/ /it/ /fr/`. On WordPress each folder is a symlink to the
same install; `wp-config.php` sets `SEO_LANG` from the URL, which switches
`WP_HOME`, `<html lang>`, hreflang, per-country ACF copy (`text_translations`,
`page_title_<cc>`) and Yoast titles. **Prices are not tied to the folder** —
WooCommerce Price Based on Country resolves them from the visitor's IP via AJAX.

The catch-all route `app/[[...path]]` forwards the full path (folder included)
to WordPress, so `/gb/course/x/` renders the GB variant and is cached
separately from `/course/x/`. Covered: pages, blog posts (`/blog/<slug>/`),
courses, internships, teach-abroad guides, support topics, placements, guides,
webinars, search (`/?s=`), the 404 page, sitemaps and robots.txt.

### Rendering (phase 1: passthrough)

`wordpress/headless/rest-render.php` loopback-renders the requested URL and
returns `{ lang, body_class, seo{title, meta, links, ld}, assets, body }`, with:

- on-site `<a href>` made relative (navigation stays on Next); WordPress-owned
  paths (cart, checkout, product, account, wp-*) kept absolute on the WP origin
- root-relative assets / AJAX endpoints absolutised to the WP origin
  (wc-ajax goes to `/index.php?wc-ajax=` — see "CORS" below)
- POST forms (CF7, add-to-cart) pointed at WordPress; GET search forms relative
- every executable `<script>` deferred (`type="text/tefl-deferred"`)

Next renders the head tags exactly (`components/WpHead.tsx`), the theme's CSS
and body untouched (`components/WpPage.tsx`), and `components/WpScripts.tsx`
re-runs the scripts in document order after hydration — holding jQuery's ready
event until all have run, re-dispatching DOMContentLoaded/load, and gating
tracking behind `NEXT_PUBLIC_ENABLE_TRACKING`.

**Phase 2 (in progress): native React templates.** Templates get ported to
React one by one (blog post, course, teach-abroad guide, homepage,
internships, header/footer…), emitting the theme's own markup/classes so the
theme CSS styles them identically, fed by JSON endpoints. The passthrough
remains the fallback for anything not yet ported. Country-aware JSON comes from
`https://teflinstitute.com/<cc>/index.php?rest_route=/tefl/v1/...` (the folder
sets `SEO_LANG`, so ACF translations apply).

A ported template renders inside the page's own WordPress **shell**
(`lib/shell.ts`, `components/WpShell.tsx`): the head, header, footer and
scripts come from that URL's `tefl/v1/render` output, cut at the theme's
`#content > .ast-container` slot, with the React content in between. So SEO
head, GTM dataLayer, offer banners and footer stay exact per page while the
header/footer wait their turn to be ported. If the endpoint 404s or the slot
can't be found, the route falls back to the passthrough page.

| Template | React | Data | Replaces theme script |
|---|---|---|---|
| Blog post (`single-post-redesign.php`) | `components/blog/` | `tefl/v1/post` (`wordpress/headless/rest-post.php`) | `ti-single-post-redesign-js` |

Verify a port with a DOM diff of the content against live (same element tree,
attributes and text): every blog post checked matched, US root and all six folders.

### Caching / cache-busting

| Mechanism | Where |
|---|---|
| On-demand ISR tags `p:<path>` (per page, per folder), `listing`, `pages` | `lib/render.ts`, `app/api/revalidate` |
| WordPress fires tags on save (all 7 folders), slug change, delete, menus, ACF options, Customizer, widgets, WPFC "Delete cache" — batched once per request at shutdown | `wordpress/tefl-isr-revalidate.php` |
| Jittered time-based safety net (9–15 h) so 7,000 cached pages never refetch together | `lib/wp.ts` `isrRevalidate()` |
| Stale-while-error: transient WP failures throw (Next keeps the last good page) instead of baking a 404 | `lib/wp.ts` `getRouteContent()` |
| Post-deploy cache warmer | `npm run warm-cache -- <url> [--all]` |
| Manual purge | `GET /api/revalidate/?secret=…&tag=pages` or `wp tefl isr pages` |

### Hand-over to WordPress

`middleware.ts` redirects WordPress-owned paths and WooCommerce query actions to
`NEXT_PUBLIC_WP_ORIGIN` (geo folder preserved). Links in rendered pages already
point there. After the domain switch these paths are proxied to WordPress at
the CDN, so they never reach Next.

### CORS (browser → WordPress)

Geo pricing (WCPBC, `WCPBC_USE_REMOTE_ADDR`), the city logo / geo phone
(`ti_combined_ajax_geo_actions`), timetables and CF7 must see the **visitor's**
IP, so the browser calls WordPress directly — never through a Next proxy.
`wordpress/headless/cors.php` allows the Next origins on admin-ajax and wc-ajax
(core already handles `/wp-json/`). WCPBC sends a `Cache-Control` request header
(→ CORS pre-flight) and nginx answers `OPTIONS /?wc-ajax=` from WP Fastest
Cache's static `index.html` with 405, so wc-ajax is rewritten to
`/index.php?wc-ajax=`, which always reaches PHP.

## Project layout

```
app/[[...path]]/        catch-all route: layout (html/head/body), page, not-found
app/api/revalidate/     on-demand ISR endpoint
app/api/sitemap/        Yoast sitemap + XSL proxy (rewrites in next.config.mjs)
app/robots.txt/         WordPress robots.txt with front-origin sitemap URLs
components/             WpHead, WpPage, WpShell, WpScripts; blog/ (native blog post)
lib/                    wp.ts (origin, fetch, hand-over), render.ts, shell.ts, post.ts, site.ts, countries.ts
middleware.ts           WP hand-over, search rewrite, noindex on non-prod hosts
public/                 favicons, verification files, llms.txt, self-hosted icon fonts
scripts/warm-cache.mjs  post-deploy ISR warmer
wordpress/              WP-side code (deployed by hand — see below)
```

## WordPress side (`wordpress/`)

Not part of the Next build; version-controlled here and deployed to the Forge
server (`forge@134.209.25.72`, `~/teflinstitute.com`).

- `headless/` → `wp-content/themes/teflinstitute/headless/`, loaded by one
  guarded include at the end of the child theme's `functions.php`. Kill switch:
  `define('TEFL_HEADLESS_DISABLE', true)` in wp-config, or delete the folder.
  Endpoints: `/wp-json/tefl/v1/render`, `/routes`, `/health`.
- `tefl-isr-revalidate.php` → `wp-content/mu-plugins/`. Inert until wp-config has
  `TEFL_ISR_BASE_URL` (the Next deployment) and `TEFL_ISR_SECRET` (= `ISRSECRET`).

**PHP changes need an OPcache reset** — FPM runs with
`opcache.validate_timestamps=0`. After uploading, hit the existing
`https://teflinstitute.com/flushopcache.php` (from the server:
`curl -sk --resolve teflinstitute.com:443:127.0.0.1 https://teflinstitute.com/flushopcache.php`).

## Environment

See `.env.example`: `NEXT_PUBLIC_WP_ORIGIN`, `NEXT_PUBLIC_SITE_ORIGIN`,
`NEXT_PUBLIC_ENABLE_TRACKING`, `ISRSECRET`.

## Infra follow-ups

- **Font CORS.** Astra's icon font and the side-cart font are served by nginx
  without `Access-Control-Allow-Origin`, so browsers block them cross-origin.
  Worked around by self-hosting copies (`public/wp-fonts/`, re-declared in
  `WpPage.tsx`). Clean fix — Forge → site → Edit Nginx Configuration:
  `location ~* \.(woff2?|ttf|otf|eot)$ { add_header Access-Control-Allow-Origin "*"; }`
  then purge Cloudflare.
- **Page weight.** Pages carry their markup twice (document + RSC payload —
  true of any App Router page, native React included): ~240 KB gzip vs ~85 KB
  on live for the homepage. The big lever is the ~160 KB of inline theme CSS
  (Astra dynamic CSS, plugin inline styles) repeated on every page: moving it
  into cached static stylesheets is the planned optimisation.

## Development

```bash
npm install
cp .env.example .env.local   # set ISRSECRET
npm run dev
```
