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

## Ported

| Template | Body class match | React | Endpoint |
|---|---|---|---|
| `single-post-redesign.php` | `single-post` + `tibr-active` | `components/blog/` | `native/post.php` |
