<?php
/**
 * tefl/v1/render — universal, geo-folder-aware page render for the Next app.
 *
 * GET /wp-json/tefl/v1/render?path=/gb/course/120-hour-advanced-tefl-course/
 *
 * Loopback-renders the requested front URL on this server (bypassing
 * Cloudflare; WP Fastest Cache answers when warm) and splits it into the parts
 * the Next route needs to reproduce the page exactly:
 *
 *   {
 *     ok, status, path, country,           // country = us | gb | za | nl | ca | it | fr
 *     lang, body_class,
 *     seo:    { title, meta:[{name|property, content}], links:[{rel, href, hreflang?}], ld:[json] },
 *     assets: "<link rel=stylesheet…><style>…</style><script type=text/tefl-deferred…>…",
 *     body:   "<div id=page>…</div>…"       // header + content + footer, as rendered
 *   }
 *
 * Redirects come back as { ok:false, status:301|302, location:"/relative/" } and
 * a missing page as HTTP 404, so the Next route can redirect / notFound().
 * With `allow_404=1` a missing page instead returns WordPress' rendered 404
 * page ({ ok:true, status:404, … }) — the Next not-found view uses it.
 *
 * Rewrites applied to the HTML (same rules as TEFL IE's passthrough endpoints):
 *   - <a href> to this site → relative, so navigation stays on the Next front;
 *     WordPress-owned paths (cart, checkout, product, account, wp-*) stay
 *     ABSOLUTE on the WP origin — the hand-over to WordPress.
 *   - root-relative asset/endpoint URLs (src, srcset, action, JSON-escaped
 *     "\/wp-admin\/…", "\/?wc-ajax=…") → absolute WP origin.
 *   - POST forms → absolute WP action (CF7, add-to-cart); GET forms on the site
 *     (search) → relative.
 *   - executable <script>s → type="text/tefl-deferred" (original type kept in
 *     data-tefl-type) so the browser doesn't run them during HTML parse; the
 *     Next client re-activates them in document order after mount.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route(TEFL_HEADLESS_NS, '/render', array(
        'methods'             => 'GET',
        'callback'            => 'tefl_headless_render',
        'permission_callback' => '__return_true',
        'args'                => array(
            'path' => array('required' => true, 'type' => 'string'),
        ),
    ));
});

function tefl_headless_render(WP_REST_Request $request) {
    $path = tefl_headless_normalise_path($request->get_param('path'));
    if ($path === '') {
        return tefl_headless_response(array('ok' => false, 'error' => 'bad_path'), 400);
    }
    list($country, $bare) = tefl_headless_split_country(strtok($path, '?'));
    if (preg_match(tefl_headless_wp_owned_path_regex(), $bare)) {
        return tefl_headless_response(array('ok' => false, 'error' => 'wp_owned', 'path' => $path), 404);
    }

    $res = tefl_headless_loopback($path);
    if (is_wp_error($res)) {
        return tefl_headless_response(array('ok' => false, 'error' => 'loopback_failed', 'message' => $res->get_error_message()), 502);
    }

    $code = $res['code'];
    if ($code >= 300 && $code < 400) {
        return tefl_headless_response(array(
            'ok'       => false,
            'status'   => $code,
            'path'     => $path,
            'location' => tefl_headless_rewrite_href($res['location']),
        ));
    }
    $is_404 = ($code === 404 || $code === 410);
    if ($is_404 && !$request->get_param('allow_404')) {
        return tefl_headless_response(array('ok' => false, 'status' => $code, 'path' => $path), 404);
    }
    if ((!$is_404 && $code !== 200) || $res['body'] === '') {
        return tefl_headless_response(array('ok' => false, 'status' => $code, 'error' => 'upstream'), 502);
    }

    $parts = tefl_headless_split_document($res['body']);
    if (!$parts) {
        return tefl_headless_response(array('ok' => false, 'error' => 'unparseable'), 502);
    }

    $page_url = tefl_headless_wp_origin() . $path;

    return tefl_headless_response(array(
        'ok'         => true,
        'status'     => $is_404 ? 404 : 200, // 404 only with allow_404 (the Next not-found page)
        'path'       => $path,
        'country'    => $country,
        'lang'       => $parts['lang'],
        'body_class' => $parts['body_class'],
        'seo'        => $parts['seo'],
        'assets'     => tefl_headless_rewrite_html($parts['assets'], $page_url),
        'body'       => tefl_headless_rewrite_html($parts['body'], $page_url),
        'rendered'   => gmdate('c'),
    ));
}

/**
 * Split a full HTML document into lang / body class / SEO head / head assets / body.
 *
 * Uses string offsets for the coarse cuts (the documents are ~0.5MB, and a
 * greedy regex over the whole body risks PCRE's backtrack limit) and a token
 * regex only over the <head>.
 *
 * @return array|null
 */
function tefl_headless_split_document($html) {
    $head_open = stripos($html, '<head');
    $head_end  = stripos($html, '</head>');
    if ($head_open === false || $head_end === false) {
        return null;
    }
    $head_open = strpos($html, '>', $head_open) + 1;
    $head      = substr($html, $head_open, $head_end - $head_open);

    $body_open = stripos($html, '<body', $head_end);
    $body_end  = strripos($html, '</body>');
    if ($body_open === false) {
        return null;
    }
    $body_tag_end = strpos($html, '>', $body_open);
    $body_tag     = substr($html, $body_open, $body_tag_end - $body_open + 1);
    $body         = substr($html, $body_tag_end + 1, ($body_end === false ? strlen($html) : $body_end) - $body_tag_end - 1);

    $lang = 'en-US';
    if (preg_match('#<html\b[^>]*\blang=["\']([^"\']+)#i', substr($html, 0, $head_open), $m)) {
        $lang = $m[1];
    }
    $body_class = '';
    if (preg_match('#\bclass=["\']([^"\']*)#i', $body_tag, $m)) {
        $body_class = trim(preg_replace('/\s+/', ' ', $m[1]));
    }

    $seo    = array('title' => '', 'meta' => array(), 'links' => array(), 'ld' => array());
    $assets = '';

    $token = '#<!--.*?-->|<(script|style|noscript)\b([^>]*)>(.*?)</\1\s*>|<title\b[^>]*>(.*?)</title>|<(meta|link)\b([^>]*?)/?>#is';
    if (preg_match_all($token, $head, $all, PREG_SET_ORDER)) {
        foreach ($all as $t) {
            $tag = isset($t[1]) ? strtolower($t[1]) : '';
            if ($tag === 'script') {
                $type = tefl_headless_attr($t[2], 'type');
                if (stripos($type, 'ld+json') !== false) {
                    $seo['ld'][] = trim($t[3]);
                } else {
                    $assets .= $t[0] . "\n";
                }
                continue;
            }
            if ($tag === 'style') {
                $assets .= $t[0] . "\n";
                continue;
            }
            if ($tag === 'noscript') {
                continue;
            }
            if (isset($t[4]) && $t[4] !== '' && stripos($t[0], '<title') === 0) {
                $seo['title'] = html_entity_decode(trim($t[4]), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                continue;
            }
            $el = isset($t[5]) ? strtolower($t[5]) : '';
            if ($el === 'meta') {
                $content = tefl_headless_attr($t[6], 'content');
                foreach (array('name', 'property') as $key) {
                    $val = tefl_headless_attr($t[6], $key);
                    if ($val !== '') {
                        $seo['meta'][] = array($key => $val, 'content' => html_entity_decode($content, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
                        break;
                    }
                }
                continue;
            }
            if ($el === 'link') {
                $rel  = strtolower(tefl_headless_attr($t[6], 'rel'));
                $href = tefl_headless_attr($t[6], 'href');
                if (in_array($rel, array('canonical', 'alternate', 'prev', 'next', 'shortlink'), true)) {
                    $type = tefl_headless_attr($t[6], 'type');
                    if ($rel === 'alternate' && $type !== '') {
                        continue; // RSS / oEmbed alternates — WordPress-owned, not SEO.
                    }
                    $link = array('rel' => $rel, 'href' => html_entity_decode($href, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
                    $hl   = tefl_headless_attr($t[6], 'hreflang');
                    if ($hl !== '') {
                        $link['hreflang'] = $hl;
                    }
                    $seo['links'][] = $link;
                    continue;
                }
                if (in_array($rel, array('stylesheet', 'preconnect', 'dns-prefetch', 'preload', 'modulepreload'), true)) {
                    $assets .= $t[0] . "\n";
                }
                // icons / manifest / profile / EditURI: owned by the Next app.
            }
        }
    }

    return array(
        'lang'       => $lang,
        'body_class' => $body_class,
        'seo'        => $seo,
        'assets'     => $assets,
        'body'       => $body,
    );
}

/** Read one attribute value from a raw attribute string. */
function tefl_headless_attr($attrs, $name) {
    if (preg_match('#(?:^|\s)' . preg_quote($name, '#') . '\s*=\s*("([^"]*)"|\'([^\']*)\'|([^\s>]+))#i', $attrs, $m)) {
        if (isset($m[4]) && $m[4] !== '') {
            return $m[4];
        }
        if (isset($m[3]) && $m[3] !== '') {
            return $m[3];
        }
        return isset($m[2]) ? $m[2] : '';
    }
    return '';
}

/**
 * Rewrite one link target for the Next front.
 *   - on-site, non-WP-owned → relative path (+query/fragment)
 *   - on-site, WP-owned      → absolute WP origin
 *   - anything else          → unchanged
 */
function tefl_headless_rewrite_href($href) {
    $href = (string) $href;
    if ($href === '' || $href[0] === '#' || preg_match('#^(mailto|tel|javascript|data|sms|whatsapp):#i', $href)) {
        return $href;
    }

    $origin = tefl_headless_wp_origin();
    if (preg_match('#^(https?:)?//([^/?\#]+)(.*)$#i', $href, $m)) {
        if (!in_array(strtolower($m[2]), tefl_headless_site_hosts(), true)) {
            return $href; // external
        }
        $rest = $m[3] === '' ? '/' : $m[3];
        if ($rest[0] !== '/') {
            $rest = '/' . $rest; // "https://host?s=x" → "/?s=x"
        }
    } elseif ($href[0] === '/') {
        $rest = $href;
    } else {
        return $href; // relative to the current page — leave it
    }

    $path = (string) strtok($rest, '?#');
    list(, $bare) = tefl_headless_split_country($path === '' ? '/' : $path);
    $wp_owned = preg_match(tefl_headless_wp_owned_path_regex(), $bare)
        || preg_match('#[?&](add-to-cart|addtimetocart|wc-ajax|wc-api|add_to_cart|remove_item|undo_item)=?#i', $rest);

    return $wp_owned ? $origin . $rest : $rest;
}

/**
 * Apply every URL / script rewrite to an HTML fragment.
 *
 * @param string $html
 * @param string $page_url absolute WP URL of the page (POST form fallback action)
 */
function tefl_headless_rewrite_html($html, $page_url) {
    $origin   = tefl_headless_wp_origin();
    $esc      = str_replace('/', '\\/', $origin);
    $cc_alt   = implode('|', array_map('preg_quote', tefl_headless_countries()));

    // De-Photonize (i0.wp.com/<host>/…) so media loads first-party.
    $html = preg_replace('#(https?:)?//i[0-9]\.wp\.com/#i', 'https://', $html);

    // <a href> — relativise on-site links, keep WP-owned ones absolute.
    $html = preg_replace_callback('#<a\b[^>]*>#i', function ($m) {
        return preg_replace_callback('#(\shref\s*=\s*)(["\'])(.*?)\2#is', function ($h) {
            $decoded = html_entity_decode($h[3], ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $new     = tefl_headless_rewrite_href($decoded);
            return $new === $decoded ? $h[0] : $h[1] . $h[2] . esc_attr($new) . $h[2];
        }, $m[0]);
    }, $html);

    // <form> — POST → absolute WP action (empty/missing action = the page itself);
    // GET on-site (search) → relative so it stays on Next.
    $html = preg_replace_callback('#<form\b([^>]*)>#i', function ($m) use ($page_url) {
        $attrs  = $m[1];
        $method = strtolower(tefl_headless_attr($attrs, 'method'));
        $action = html_entity_decode(tefl_headless_attr($attrs, 'action'), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $has    = (bool) preg_match('#\saction\s*=#i', $attrs);

        if ($method === 'post') {
            if ($action === '' || $action[0] === '#') {
                $target = $page_url . $action;
            } elseif ($action[0] === '/' && (strlen($action) < 2 || $action[1] !== '/')) {
                $target = tefl_headless_wp_origin() . $action;
            } else {
                return $m[0];
            }
        } else {
            if (!$has || $action === '') {
                return $m[0];
            }
            $target = tefl_headless_rewrite_href($action);
            if ($target === $action) {
                return $m[0];
            }
        }
        $attrs = $has
            ? preg_replace('#(\saction\s*=\s*)(["\']).*?\2#is', '$1"' . esc_attr($target) . '"', $attrs, 1)
            : $attrs . ' action="' . esc_attr($target) . '"';
        return '<form' . $attrs . '>';
    }, $html);

    // Root-relative asset / endpoint attributes → absolute WP origin.
    $html = preg_replace(
        '#(\s(?:src|srcset|data-src|data-srcset|data-lazy-src|data-lazy-srcset|data-bg|data-background|poster|data-href|data-url|data-image)\s*=\s*["\'])/(?!/)#i',
        '$1' . $origin . '/',
        $html
    );
    // Second+ candidates inside srcset lists, and CSS url(/wp-content/…).
    $html = preg_replace('#(,\s*)/(wp-content|wp-includes)/#i', '$1' . $origin . '/$2/', $html);
    $html = preg_replace('#url\((["\']?)/(wp-content|wp-includes)/#i', 'url($1' . $origin . '/$2/', $html);

    // JSON-escaped endpoints in inline config (wc_add_to_cart_params, wcpbc, metorik…):
    // "\/wp-admin\/admin-ajax.php", "\/?wc-ajax=…", "\/gb\/?wc-ajax=…".
    //
    // wc-ajax goes to "/index.php?wc-ajax=" (WooCommerce handles it identically):
    // cross-origin, WCPBC's geolocation call sends a Cache-Control header, so the
    // browser pre-flights it — and nginx answers OPTIONS on "/" from WP Fastest
    // Cache's static index.html with a 405. ".php" always reaches PHP, where
    // cors.php answers the pre-flight.
    $html = preg_replace('#(["\'])\\\\/((?:(?:' . $cc_alt . ')\\\\/)?(?:wp-admin|wp-json|wp-content|wp-includes)\\\\/)#i', '$1' . $esc . '\\/$2', $html);
    $html = preg_replace('#(["\'])\\\\/((?:(?:' . $cc_alt . ')\\\\/)?)\?wc-ajax=#i', '$1' . $esc . '\\/$2index.php?wc-ajax=', $html);
    // Plain-string equivalents in inline JS: '/wp-admin/admin-ajax.php', "/?wc-ajax=".
    $html = preg_replace('#(["\'])/((?:(?:' . $cc_alt . ')/)?wp-admin/admin-ajax\.php)#i', '$1' . $origin . '/$2', $html);
    $html = preg_replace('#(["\'])/((?:(?:' . $cc_alt . ')/)?)\?wc-ajax=#i', '$1' . $origin . '/$2index.php?wc-ajax=', $html);

    // Defer executable scripts; the Next client re-activates them in order.
    $html = preg_replace_callback('#<script\b([^>]*)>#i', function ($m) {
        $attrs = $m[1];
        $type  = strtolower(trim(tefl_headless_attr($attrs, 'type')));
        $exec  = array('', 'text/javascript', 'application/javascript', 'module', 'text/ecmascript');
        if (!in_array($type, $exec, true)) {
            return $m[0]; // ld+json, text/plain (Complianz-blocked), templates…
        }
        $attrs = preg_replace('#\stype\s*=\s*(["\']).*?\1#i', '', $attrs);
        return '<script type="text/tefl-deferred"' . ($type === 'module' ? ' data-tefl-type="module"' : '') . $attrs . '>';
    }, $html);

    return $html;
}
