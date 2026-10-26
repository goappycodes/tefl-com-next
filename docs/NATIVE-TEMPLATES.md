# Porting a theme template to React

Phase 2 replaces the passthrough render, template by template, with React that
reproduces the theme's markup exactly. The blog post (`components/blog/`,
`wordpress/headless/native/post.php`) is the reference port; read it first.

## How a native page is built

1. The catch-all route fetches `tefl/v1/render` for the URL as before (SEO head,
   body class, head assets, body).
2. `lib/native/registry.tsx` matches the **body classes** — WordPress already
   picked the PHP template, and its body class says which (`single-<type>`,
   `page-template-<file>`, `home`, `blog`, `category`, `search`, `error404`…).
3. On a match, `lib/native/data.ts` fetches
   `/<cc>/index.php?rest_route=/tefl/v1/native/<endpoint>&path=…&id=<postid>`
   (through the geo folder, so ACF translations, `home_url()` and permalinks
   are that folder's).
4. `components/WpShell.tsx` renders the page's own WordPress header/footer
   (`lib/shell.ts`, cut at `#content > .ast-container`) with the React
   template in the slot. Theme scripts still run; `replaces` drops the
   `<script id>`s whose job the React template now does.
5. If the endpoint 404s or the slot is missing, the passthrough page renders.

## Recipe

Source of truth is the theme on the server (local copy:
`../teflinstitute-wp/wp-content/themes/teflinstitute/`, refresh it with
`ssh forge@134.209.25.72 'cd ~/teflinstitute.com/wp-content/themes && tar --exclude=.git -czf - teflinstitute' | tar -xzf -`).

1. **Read the PHP template** and everything it includes (template parts,
   `includes/*.php` helpers, shortcodes it calls). Note every value it computes
   and every branch.
2. **Endpoint** `wordpress/headless/native/<name>.php`:
   `tefl_native_register('<name>', 'tefl_native_<name>')`. The callback gets the
   post ID with the post already the main query and the loop started (see
   `_common.php`), so call the same functions the template calls (`get_field()`,
   `get_cfvalue_by_country()`, `get_the_title()`, the theme helpers) and return
   **resolved** values. Rules:
   - Mirror the PHP control flow and defaults exactly; when in doubt return the
     raw value and branch in TSX the same way PHP does.
   - Links: `$ctx['href']($url)`. HTML fragments: `$ctx['html']($fragment)`,
     and `$ctx['block']()` first for anything that can hold embeds/iframes.
     Text printed through `esc_html()`/`esc_attr()`: `$ctx['txt']()`.
   - Theme output that is genuinely WordPress-rendered (a widget area, a CF7
     form shortcode, a plugin block) can be returned as HTML with
     `tefl_native_capture()` + `$ctx['html']`, rendered with
     `dangerouslySetInnerHTML`. Everything the template itself writes is JSX.
   - Return `null` when the page isn't really this template (→ passthrough).
   - Functions are `tefl_native_<name>_*`; no top-level side effects besides
     the register call. These files load for REST requests only.
3. **React** `components/<name>/`: one server component reproducing the
   template's markup — same elements, class names, attributes, order and text
   (the theme CSS styles it; no new CSS). Interactivity the theme JS gives this
   template becomes small client components, and that script's id goes in
   `replaces`. Mixed text like `Published {date}` must be ONE text node
   (`{`Published ${date}`}`) to match the DOM. Keep the GA/dataLayer events the
   theme script pushes.
4. **Registry**: one `template<Data>({ endpoint, match, replaces, render })`
   entry in your family file `lib/native/families/<family>.tsx` (the registry
   imports every family). Match on body classes only.
5. **Deploy the endpoint** (additive, REST-only):
   `scp` to the server's `wp-content/themes/teflinstitute/headless/native/`,
   `php -l` it there first, then flush OPcache
   (`curl -sk --resolve teflinstitute.com:443:127.0.0.1 https://teflinstitute.com/flushopcache.php`
   from the server) and check `https://teflinstitute.com/wp-json/tefl/v1/health`
   and the homepage return 200 — restore the previous file at once if not.
6. **Verify** with the dev server running:
   `node scripts/domdiff.mjs <path> <path> …` — compares the content slot
   against live. Every page of the template, or a broad sample across the US
   root and the six geo folders, must show **0 differing**. Then load one page
   in a visible browser tab: no console errors, the interactive bits work.
   (A hidden tab has zero width, and the theme JS switches to its mobile layout.)
   Dev caches fetches: after changing an endpoint, purge with
   `GET /api/revalidate/?tag=pages&secret=$ISRSECRET`.
   - `--mask-geo` hides what legitimately varies between live's cached HTML and a
     fresh render: geo prices / currency / "N% off" / JSON-LD prices, WooCommerce's
     random `quantity_<id>`, `uniqid()` ids, the countdown's `<now>--<expiry>` class.
     Use it for the final numbers; read the unmasked diff once to be sure only those differ.
   - Both documents are re-balanced like a browser builds them (`scripts/balance.mjs`),
     so the theme's invalid markup (`<h6>…</h2>`, stray end tags) compares correctly.
   - **Go gently on the server.** Each Next render makes several PHP requests from your
     IP; on 2026-10-26 six parallel sweeps got this machine's IP blacklisted by the
     MalCare firewall (403 on every PHP request until it was whitelisted in the MalCare
     dashboard). domdiff waits 2 s between paths (`--delay`); run ≤10 paths at a time.

## Ported

| Template | Body class match | React | Endpoint |
|---|---|---|---|
| `single-post-redesign.php` | `single-post` + `tibr-active` | `components/blog/` | `native/post.php` |
| `single-teach_english_abroad.php` | `single-teach_english_abroad` | `components/destinations/TeachEnglishAbroad.tsx` | `native/teach_english_abroad.php` (replaces `single-teach-english-abroad-js-js`) |
| `single-country-page.php` (+ 8 parts) | `page-template-single-country-page` | `components/destinations/CountryPage.tsx` | `native/country_page.php` |
| `single-guide.php` | `single-guide` | `components/destinations/Guide.tsx` | `native/guide.php` |
| `where-to-tefl.php` | `page-template-where-to-tefl` | `components/destinations/WhereToTefl.tsx` | `native/where_to_tefl.php` |
| `page-teach-english-jobs.php` | `page-template-page-teach-english-jobs` | `components/destinations/TeachEnglishJobs.tsx` | `native/teach_english_jobs.php` |
| `page-jobs-service.php` | `page-template-page-jobs-service` | `components/destinations/JobsService.tsx` | `native/jobs_service.php` (replaces `ti-job-service-js-js`) |
| `page-all-jobs.php` | `page-template-page-all-jobs` | `components/destinations/AllJobs.tsx` | `native/all_jobs.php` |
| `page-job-hunters-pack.php` | `page-template-page-job-hunters-pack` | `components/destinations/JobHuntersPack.tsx` | `native/job_hunters_pack.php` |
| `single-placement.php` | `single-placement` | `components/destinations/Placement.tsx` | `native/placement.php` |
| `single-support_centre.php` | `single-support_centre` | `components/destinations/SupportTopic.tsx` | `native/support_centre.php` |
| `page-supportcenter.php` | `page-template-page-supportcenter` | `components/destinations/SupportCenter.tsx` | `native/support_center_archive.php` (replaces `ti-support-center-js-js`) |
| `page-faq.php` | `page-template-page-faq` | `components/destinations/FaqPage.tsx` | `native/faq_page.php` |
| `single-alerts.php` | `single-alerts` | `components/destinations/Alert.tsx` | `native/alerts.php` |
| `single-ppc.php` | `single-ppc` | `components/destinations/Ppc.tsx` | `native/ppc.php` |

Shared destinations helpers: `native/destinations_lib.php` (`tefl_native_destinations_*`).

### Known inherent differences (vs live's cached HTML)

- **Server-rendered prices / currency.** Live pages are WP Fastest Cache files, so
  their prices are whatever the visitor who generated the cache file saw. The
  endpoint renders the folder's default zone. Both are replaced in the browser by
  WCPBC's AJAX with the visitor's own price.
- **Timestamps.** `[tefl_timer_shortcode]` (PPC) prints `time()` into a class name.
- **`/tefl-jobs/`** has an unclosed `<div>` before `</section>` in the theme; the
  browser repairs it, node-html-parser doesn't, so domdiff can't find `#content`
  on the live side there. Output verified with that `</div>` added.

### Theme quirks reproduced on purpose

Kept so the page matches live; fix them in the theme and the port together.
- all-jobs and PPC carry `$rate` / `$percentage` over from the previous job row.
- jobs-service's inverted `!$gocambio_jobs` check prints an empty careers section.
- An expired placement countdown (Bangkok) throws a TypeError every second, as on live.
- `calss` / `classs` attribute typos; nested `#content` on alerts; support-centre
  excerpts cut at 250 bytes (a split character shows as U+FFFD).
- `ti-all-jobs.js` throws `$(...).size is not a function` (jQuery 3.6, no Migrate) on live too.
- CF7 forms are captured HTML; the capture starts CF7's counter at 2 to match the
  page's unit tags (`-o2`), relying on one form being rendered before the content
  area (true on every page checked).

### Promos (`components/promos/`, shared PHP `native/_promos.php`)

Body class `page-template-<file>`, endpoint = file name, no `replaces` (the theme's
timer, geo-price, Splide, lity, reviews, coupon-copy, add-to-cart and CF7 scripts
still drive the markup): `discount-tefl-coupon-codes`, `early-access-black-friday-sale-prz`,
`black-friday-sale-prz`, `tefl-january-sale`, `page-sale-new`, `january-courses-sale`,
`january-internships-sale`, `internship-black-friday-landing-page` (US root 301s, so geo
folders only), `black-friday-landing-page`, `black-friday-landing-page-2023`.
Not ported: `black-friday-landing-page-2026.php` (being built on the live server).
REST-context fixes in `_promos.php`: WCPBC's loading wrapper/placeholder restored,
CF7 action + unit-tag counter set to the page's, `add_to_cart_url()` run against the
page path, legacy markup the browser rewrites emitted as the template's own HTML,
Trustpilot's async script kept in place with a no-op `onLoad`.
