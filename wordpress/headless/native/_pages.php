<?php
/**
 * Shared helpers for the "pages" family of native templates (page.php,
 * the one-off page templates, the archive / search / 404 views).
 *
 * Function names: tefl_native_pages_*. Loaded for REST requests only, like
 * every native/*.php; nothing here runs at load time.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * What a hook / template function echoes, as a string (do_action, astra_* …).
 *
 * @param callable|string $fn   a callable, or a hook name for do_action()
 * @param array           $args extra do_action() / call arguments
 */
function tefl_native_pages_capture($fn, $args = array()) {
    ob_start();
    try {
        if (is_string($fn) && !is_callable($fn)) {
            do_action_ref_array($fn, $args);
        } else {
            call_user_func_array($fn, $args);
        }
    } finally {
        $out = ob_get_clean();
    }
    return (string) $out;
}

/**
 * Astra sets up much of its front-end markup on the `wp` action (schema
 * attributes, the per-page "disable title" meta, comment placement,
 * breadcrumbs …), which a REST request never fires. Run just Astra's own `wp`
 * callbacks, in priority order, once the page is the main query. Everything
 * else on `wp` (WooCommerce sessions / cookies, Yoast and Complianz
 * redirects, payment handlers) is deliberately left alone.
 */
function tefl_native_pages_astra_wp() {
    global $wp_filter;
    static $done = false;
    if ($done || empty($wp_filter['wp'])) {
        return;
    }
    $done = true;
    $skip = array('Astra_Theme_Background_Updater', 'Astra_Woocommerce');
    $hook = $wp_filter['wp'];
    $cbs  = $hook->callbacks;
    ksort($cbs, SORT_NUMERIC);
    foreach ($cbs as $prio => $list) {
        foreach ($list as $cb) {
            $f    = $cb['function'];
            $name = is_array($f) ? (is_object($f[0]) ? get_class($f[0]) : (string) $f[0]) : (is_string($f) ? $f : '');
            $ok   = is_array($f)
                ? (strpos($name, 'Astra_') === 0 && !in_array($name, $skip, true))
                : (is_string($f) && strpos($f, 'astra_') === 0);
            if ($ok) {
                call_user_func($f, $GLOBALS['wp']);
            }
        }
    }
}

/** True when a hook (do_action) prints nothing but whitespace / comments for this page. */
function tefl_native_pages_hook_empty($hook, $args = array()) {
    $out = tefl_native_pages_capture($hook, $args);
    return trim(preg_replace('/<!--[\s\S]*?-->/', '', $out)) === '';
}

/**
 * An HTML attribute string (`class="a b" id="x" itemscope="itemscope"`, as
 * astra_attr() and friends print it) → name => decoded value, in order.
 */
function tefl_native_pages_attrs($str) {
    $out = array();
    if (preg_match_all('/([^\s=\/>"\']+)(?:\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s>"\']+)))?/', (string) $str, $m, PREG_SET_ORDER)) {
        foreach ($m as $a) {
            $name = strtolower($a[1]);
            if (isset($out[$name])) {
                continue;
            }
            $val = isset($a[2]) && $a[2] !== '' ? $a[2] : (isset($a[3]) && $a[3] !== '' ? $a[3] : (isset($a[4]) ? $a[4] : ''));
            $out[$name] = html_entity_decode($val, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }
    }
    return $out;
}

/**
 * Whether an HTML fragment is safe to put inside one React element with
 * dangerouslySetInnerHTML: it must not close an element it didn't open
 * (a stray `</div>` closes the template's wrapper on the page, which React
 * can't hydrate) nor leave block elements open. Elements the parser closes
 * implicitly (p, li, td…) and stray inline end tags (ignored by the parser)
 * don't count.
 */
function tefl_native_pages_balanced($html) {
    $html = preg_replace('/<!--[\s\S]*?-->/', '', (string) $html);
    $html = preg_replace('/<(script|style|textarea|template|noscript|title|xmp)\b[^>]*>[\s\S]*?<\/\1\s*>/i', '', $html);
    $void     = array_flip(array('area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'param', 'keygen', 'frame'));
    $implicit = array_flip(array('p', 'li', 'dt', 'dd', 'option', 'optgroup', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'colgroup', 'caption', 'rb', 'rt', 'rp', 'rtc'));
    $inline   = array_flip(array('a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'dfn', 'em', 'font', 'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'time', 'tt', 'u', 'var', 'label', 'nobr', 'big'));
    $stack    = array();
    if (!preg_match_all('/<(\/?)([a-zA-Z][\w:-]*)\b((?:[^>"\']|"[^"]*"|\'[^\']*\')*)>/', $html, $m, PREG_SET_ORDER)) {
        return true;
    }
    foreach ($m as $t) {
        $tag = strtolower($t[2]);
        if (isset($void[$tag])) {
            continue;
        }
        if ($t[1] === '/') {
            $i = array_search($tag, array_reverse($stack, true), true);
            if ($i === false) {
                if (isset($implicit[$tag]) || isset($inline[$tag])) {
                    continue;
                }
                return false;
            }
            $stack = array_slice($stack, 0, $i);
            continue;
        }
        if (preg_match('/\/\s*$/', $t[3])) {
            continue; // self-closing (SVG / foreign content)
        }
        $stack[] = $tag;
    }
    foreach ($stack as $tag) {
        if (!isset($implicit[$tag]) && !isset($inline[$tag])) {
            return false;
        }
    }
    return true;
}

/**
 * Put the request in the state the page's own request is in when its
 * template reaches the content: REQUEST_URI is the front path (CF7 form
 * actions, Boxzilla's URL rules, add_query_arg() defaults all read it), and
 * the work wp_head did first is replayed where it changes the content's
 * markup. Today that is Boxzilla: on `wp_enqueue_scripts` it renders each
 * matched box's content (discarded until the footer), and a CF7 form in a box
 * takes a unit number (`wpcf7-f…-o1`) before the forms in the content do.
 * Idempotent; call once the page is the main query.
 */
function tefl_native_pages_front_request($ctx) {
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;
    $_SERVER['REQUEST_URI'] = $ctx['path'];
    // CF7 caches the request URI at init (this REST URL); its form action is
    // that URI + "#<unit tag>", the page's own URI on the page.
    if (function_exists('wpcf7_get_request_uri')) {
        $rest  = wpcf7_get_request_uri();
        $front = sanitize_url('/' . ltrim($ctx['path'], '/'));
        add_filter('wpcf7_form_action_url', function ($url) use ($rest, $front) {
            $hash = strstr((string) $url, '#');
            $base = $hash === false ? (string) $url : substr((string) $url, 0, -strlen($hash));
            return $base === $rest ? $front . ($hash === false ? '' : $hash) : $url;
        }, 1);
    }
    tefl_native_pages_astra_wp();
    if (function_exists('boxzilla')) {
        // On the page this runs inside get_header() (wp_head), before the main
        // loop: images in box content are then in-viewport, and the first big
        // one takes the page's fetchpriority="high". Replay it in that state.
        global $wp_query, $wp_actions;
        $saved = array($wp_query->in_the_loop, $wp_query->before_loop, $wp_actions['get_header'] ?? null);
        $wp_query->in_the_loop = false;
        $wp_query->before_loop = true;
        $wp_actions['get_header'] = max(1, (int) ($wp_actions['get_header'] ?? 0));
        ob_start();
        try {
            $bz = boxzilla();
            if (isset($bz['box_loader'])) {
                $bz['box_loader']->init();
                $bz['box_loader']->get_matched_boxes();
            }
        } catch (Throwable $e) {
            // Boxzilla internals changed: content numbering may then differ, nothing worse.
        }
        ob_end_clean();
        list($wp_query->in_the_loop, $wp_query->before_loop, $gh) = $saved;
        if ($gh === null) {
            unset($wp_actions['get_header']);
        } else {
            $wp_actions['get_header'] = $gh;
        }
    }
}

/**
 * the_content() for the current post, exactly as the page prints it: what
 * the filters echo (a shortcode that prints instead of returning lands in
 * front of the content on the page), the filtered content, the `]]>` escape,
 * then Complianz's blocker and the render's link / media / script rewrites.
 */
function tefl_native_pages_the_content($ctx) {
    tefl_native_pages_front_request($ctx);
    ob_start();
    $content = apply_filters('the_content', get_the_content());
    $echoed  = (string) ob_get_clean();
    $content = $echoed . str_replace(']]>', ']]&gt;', $content);
    return $ctx['html']($ctx['block']($content));
}

/**
 * Shortcodes some plugins register for front-end requests only (never for
 * REST), whose output is per-visitor anyway (AutomateWoo's communication
 * preferences / signup). A page using them stays on the passthrough render.
 */
function tefl_native_pages_has_frontend_only_shortcode($raw) {
    return (bool) preg_match('/\[(automatewoo_)[a-z_]*/i', (string) $raw);
}

/**
 * For the non-singular views (archives, search, the posts index): make the
 * main query exactly what WordPress builds for this front URL — the rewrite
 * rules + the "request" filter over the path, the query string as $_GET
 * (s, paged, post_type …, kept for the rest of the request as on the
 * page), then WP_Query with every pre_get_posts hook. Returns false when
 * WordPress wouldn't route the URL to a listing.
 */
function tefl_native_pages_query_for_path($ctx) {
    global $wp_query, $wp_the_query;
    $_GET     = is_array($ctx['query']) ? $ctx['query'] : array();
    $_REQUEST = array_merge($_REQUEST, $_GET);
    $_SERVER['REQUEST_URI'] = $ctx['path'];

    // A fresh WP, so the REST request's own query vars (rest_route) never leak
    // in — and rest_api_loaded() on parse_request, which reads $GLOBALS['wp'],
    // sees no rest_route.
    $w = new WP();
    $GLOBALS['wp'] = $w;
    $w->parse_request();
    $wp_the_query = new WP_Query();
    $wp_query     = $wp_the_query;
    // WP_Query::parse_query() never flags a REST request's main query as
    // is_home; on the page it is whenever nothing else matched. Restore that
    // before pre_get_posts runs (get_posts() re-parses, so on every parse).
    $main = $wp_query;
    add_action('parse_query', function ($q) use ($main) {
        if ($q === $main && !($q->is_singular || $q->is_archive || $q->is_search || $q->is_feed
            || $q->is_trackback || $q->is_404 || $q->is_admin || $q->is_robots || $q->is_favicon)) {
            $q->is_home = true;
        }
    }, 0);
    $wp_query->query($w->query_vars);
    // WP::main() order: query_posts → handle_404 (which flags a missing page /
    // empty paged listing as 404; its status header is superseded by the REST
    // response's own) → register_globals.
    $w->handle_404();
    $w->register_globals();
    return !$wp_query->is_singular && !$wp_query->is_404;
}

/** A scalar ACF value as the template would echo it ('' for null / arrays). */
function tefl_native_pages_str($v) {
    return is_string($v) || is_numeric($v) ? (string) $v : '';
}

/** An ACF group / repeater value, or array() when empty. */
function tefl_native_pages_rows($v) {
    return is_array($v) ? $v : array();
}

/**
 * Value helpers bound to a request's $ctx, for templates that echo ACF values
 * raw: ->h($v) an HTML value (render rewrites + cookie blocker; must be
 * self-contained), ->i($v) the same for an inline-only slot (<p>, <hN>, <a>),
 * ->t($v) a
 * value inside mixed text (entities decoded, for a React text node), ->u($v)
 * a link target.
 */
function tefl_native_pages_vals($ctx) {
    return array(
        'h' => function ($v) use ($ctx) {
            $h = tefl_native_pages_str($v);
            if (!tefl_native_pages_balanced($h)) {
                throw new Tefl_Native_Pages_Bail('unbalanced fragment');
            }
            return $ctx['html']($ctx['block']($h));
        },
        'i' => function ($v) use ($ctx) {
            return $ctx['html']($ctx['block'](tefl_native_pages_inline(tefl_native_pages_str($v))));
        },
        't' => function ($v) {
            return tefl_native_txt(tefl_native_pages_str($v));
        },
        'u' => function ($v) use ($ctx) {
            return $ctx['href'](tefl_native_txt(tefl_native_pages_str($v)));
        },
    );
}

/**
 * Thrown by the ->i() value helper when a value can't sit inline where the
 * template prints it; the endpoint catches it and returns null (passthrough).
 */
class Tefl_Native_Pages_Bail extends Exception {
}

/**
 * Inline HTML for an element that can't hold block content (<p>, <hN>, <a>,
 * <label>, <span>): a block tag inside would be split out of it by the
 * browser's parser, which React can't hydrate.
 */
function tefl_native_pages_inline($html) {
    $html = (string) $html;
    if (preg_match('#<(p|div|ul|ol|li|h[1-6]|table|section|article|header|footer|blockquote|figure|form|hr|pre|dl|nav|aside|main|address|fieldset|iframe)\b#i', $html)) {
        throw new Tefl_Native_Pages_Bail('block content in an inline slot');
    }
    if (!tefl_native_pages_balanced($html)) {
        throw new Tefl_Native_Pages_Bail('unbalanced fragment');
    }
    return $html;
}

/**
 * tefl_native_register() for this family: a Tefl_Native_Pages_Bail thrown by
 * the callback (a value that can't be rendered natively) means "passthrough".
 */
function tefl_native_pages_register($name, $callback, $opts = array()) {
    tefl_native_register($name, function ($id, $ctx) use ($callback) {
        try {
            return call_user_func($callback, $id, $ctx);
        } catch (Tefl_Native_Pages_Bail $e) {
            return null;
        }
    }, $opts);
}

/**
 * A product price as a page view prints it. With WCPBC's caching support on,
 * its wrapper (WCPBC_Ajax_Geolocation::wrapper_price) adds the ` loading`
 * class and a placeholder span for the browser's geolocation call on page
 * views, but not for REST requests; restore that. Prices themselves follow
 * the visitor's IP on live, so they differ by caller either way.
 */
function tefl_native_pages_price_html($product) {
    $html = (string) $product->get_price_html();
    if (!class_exists('WCPBC_Ajax_Geolocation') || !WCPBC_Ajax_Geolocation::is_enabled()) {
        return $html;
    }
    $ph = sprintf('<span class="wcpbc-placeholder %s"></span>', apply_filters('wc_price_based_country_ajax_geolocation_placeholder_class', '-dots'));
    return preg_replace_callback('#^<span class="wcpbc-price wcpbc-price-(\d+)" data-product-id="(\d+)">(.*)</span>$#s', function ($m) use ($ph) {
        return '<span class="wcpbc-price wcpbc-price-' . $m[1] . ' loading" data-product-id="' . $m[2] . '">' . $m[3] . $ph . '</span>';
    }, $html);
}

/**
 * The TI jobs feed cards (get_ti_jobs()) as page-teo.php prints them: title
 * trimmed to 7 words, the default logo, 'NA' for missing meta. null when the
 * feed is empty (the section is then not printed).
 */
function tefl_native_pages_ti_jobs($ctx, $jobs) {
    if (!$jobs) {
        return null;
    }
    $v   = tefl_native_pages_vals($ctx);
    $out = array();
    foreach ((array) $jobs as $job) {
        $logo  = $job->job_image ?? '';
        $out[] = array(
            'title'    => $v['h'](wp_trim_words($job->job_title ?? '', 7, '...')),
            'logo'     => empty($logo) ? '/wp-content/uploads/2022/02/jobs_board_icon.svg' : tefl_native_pages_str($logo),
            'link'     => $v['u']($job->job_link ?? ''),
            'type'     => $v['h']($job->job_type ?? ''),
            'company'  => $v['h'](!empty($job->job_company_name) ? $job->job_company_name : 'NA'),
            'location' => $v['h'](!empty($job->job_location) ? $job->job_location : 'NA'),
            'salary'   => $v['h'](!empty($job->job_salary) ? $job->job_salary : 'NA'),
        );
    }
    return $out;
}

/**
 * For templates that never start the main loop (every one-off page template):
 * put the main query back in its "before the loop, between get_header() and
 * get_footer()" state, as when the template body runs on the page. That's
 * what WordPress keys on for CF7 unit tags (in_the_loop → no post id) and for
 * image loading attributes (wp_get_loading_optimization_attributes: images
 * there count as in-viewport, so no loading="lazy").
 */
function tefl_native_pages_template_context() {
    global $wp_query, $wp_actions;
    $wp_query->in_the_loop = false;
    $wp_query->before_loop = true;
    if (empty($wp_actions['get_header'])) {
        $wp_actions['get_header'] = 1;
    }
    unset($wp_actions['get_footer']);
}
