<?php
/**
 * Shared helpers for the "overviews" family of native endpoints (course
 * overview / listing / shop page templates): ti-courses-overview-template.php,
 * page-courses.php, ti-page-country-course-template.php, …
 *
 * Every value is returned the way the template prints it: these templates echo
 * ACF values unescaped, so text and HTML both travel as HTML (link-rewritten
 * like the render), and the React side sets them with dangerouslySetInnerHTML.
 *
 * Functions: tefl_native_overviews_*.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * An echoed value as HTML: Complianz's cookie blocker (the page's output
 * buffer applies it to the whole template) and the render's link rewrites.
 */
function tefl_native_overviews_html($s, $ctx) {
    if (is_array($s) || is_object($s)) {
        return '';
    }
    $s = (string) $s;
    if ($s === '') {
        return '';
    }
    return $ctx['html']($ctx['block']($s));
}

/** A URL printed in src / style url(): de-Photonized, root-relative → WP origin (as the render does). */
function tefl_native_overviews_src($u) {
    if (is_array($u)) {
        $u = $u['url'] ?? '';
    }
    $u = preg_replace('#^(https?:)?//i[0-9]\.wp\.com/#i', 'https://', (string) $u);
    if ($u !== '' && $u[0] === '/' && (strlen($u) < 2 || $u[1] !== '/')) {
        $u = tefl_headless_wp_origin() . $u;
    }
    return $u;
}

/** A URL printed in href, as the render rewrites it (entities decoded first, like the render). */
function tefl_native_overviews_href($u, $ctx) {
    if (is_array($u)) {
        $u = $u['url'] ?? '';
    }
    return $ctx['href'](html_entity_decode((string) $u, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
}

/** `$product->get_price_html()` for a product ID / object, '' when there's no product. */
function tefl_native_overviews_price($product, $ctx) {
    if (!$product instanceof WC_Product) {
        $product = $product ? wc_get_product($product) : null;
    }
    if (!$product) {
        return '';
    }
    return tefl_native_overviews_html(tefl_native_overviews_wcpbc_page($product->get_price_html()), $ctx);
}

/**
 * Price Based on Country's AJAX-geolocation wrapper as a page prints it.
 * WCPBC_Ajax_Geolocation::wrapper_price() leaves out the `loading` class and
 * the dots placeholder in REST requests; on the page they're there (its
 * script swaps in the visitor's price and removes them).
 */
function tefl_native_overviews_wcpbc_page($html) {
    if (!class_exists('WCPBC_Ajax_Geolocation') || !WCPBC_Ajax_Geolocation::is_enabled()) {
        return $html;
    }
    $placeholder = sprintf(
        '<span class="wcpbc-placeholder %s"></span>',
        apply_filters('wc_price_based_country_ajax_geolocation_placeholder_class', '-dots')
    );
    return preg_replace(
        '#^<span class="wcpbc-price wcpbc-price-(\d+)" data-product-id="\1">(.*)</span>$#s',
        '<span class="wcpbc-price wcpbc-price-$1 loading" data-product-id="$1">$2' . str_replace(array('\\', '$'), array('\\\\', '\\$'), $placeholder) . '</span>',
        (string) $html,
        1
    );
}

/**
 * What a shortcode prints where the template echoes it: anything it echoes
 * directly (the theme's timer echoes its "Offer Ends" line) followed by its
 * return value. REQUEST_URI is the page's, so CF7's form action and anchors
 * are the page URL rather than the REST request's. Two spare buffers absorb a
 * shortcode that closes one buffer more than it opened.
 */
function tefl_native_overviews_shortcode($code, $ctx) {
    global $wp_query;
    $had_uri = array_key_exists('REQUEST_URI', $_SERVER);
    $uri     = $had_uri ? $_SERVER['REQUEST_URI'] : null;
    $_SERVER['REQUEST_URI'] = $ctx['path'];
    // The page templates print their shortcodes outside the loop (CF7 then leaves the
    // post out of its unit tag and container field); the endpoint has the loop started.
    $in_loop = ($wp_query instanceof WP_Query) ? $wp_query->in_the_loop : null;
    if ($in_loop !== null) {
        $wp_query->in_the_loop = false;
    }
    $is_cf7 = strpos($code, '[contact-form-7') !== false;
    if ($is_cf7) {
        tefl_native_overviews_cf7_offset();
    }
    $level = ob_get_level();
    ob_start();
    ob_start();
    $ret = '';
    try {
        $ret = (string) do_shortcode($code);
    } finally {
        $out = '';
        while (ob_get_level() > $level) {
            $out = ob_get_clean() . $out;
        }
        if ($had_uri) {
            $_SERVER['REQUEST_URI'] = $uri;
        } else {
            unset($_SERVER['REQUEST_URI']);
        }
        if ($in_loop !== null) {
            $wp_query->in_the_loop = $in_loop;
        }
    }
    $html = $out . $ret;
    if ($is_cf7) {
        // CF7 caches the request URI on its first call (the REST URL here); its forms
        // post back to the page itself: `action="<page URI>#<unit tag>"`.
        $page_uri = sanitize_url('/' . ltrim(add_query_arg(array(), $ctx['path']), '/'));
        $html     = preg_replace_callback(
            '#(<form\b[^>]*\saction=")[^"]*?(\#wpcf7-[^"]*")#i',
            fn($m) => $m[1] . esc_attr($page_uri) . $m[2],
            $html
        );
    }
    return tefl_native_overviews_html($html, $ctx);
}

/**
 * CF7 numbers its forms per request (`wpcf7-f<id>-o<n>`). On the pages one form is
 * rendered (and not printed) before the content, so the first content form is o2;
 * the endpoint renders one throwaway form first to number them the same.
 */
function tefl_native_overviews_cf7_offset() {
    static $done = false;
    if ($done || !function_exists('wpcf7_contact_form')) {
        return;
    }
    $done  = true;
    $forms = class_exists('WPCF7_ContactForm') ? WPCF7_ContactForm::find(array('posts_per_page' => 1)) : array();
    if (!empty($forms)) {
        $forms[0]->form_html();
    }
}

/**
 * FAQ rows: raw question / answer for the template's FAQPage JSON-LD
 * (json_encode of the ACF values) and the same as page HTML.
 */
function tefl_native_overviews_faqs($faqs, $ctx) {
    $out = array();
    foreach ((array) $faqs as $faq) {
        if (!is_array($faq)) {
            continue;
        }
        $q = $faq['question'] ?? '';
        $a = $faq['answer'] ?? '';
        $out[] = array(
            'q'      => is_string($q) ? $q : '',
            'a'      => is_string($a) ? $a : '',
            'q_html' => tefl_native_overviews_html($q, $ctx),
            'a_html' => tefl_native_overviews_html($a, $ctx),
        );
    }
    return $out;
}

/** `is_array_empty()` from the theme (nested-empty check), with a local fallback. */
function tefl_native_overviews_is_empty($v) {
    if (function_exists('is_array_empty')) {
        return is_array_empty($v);
    }
    if (!is_array($v) || empty($v)) {
        return true;
    }
    foreach ($v as $x) {
        if (is_array($x) ? !tefl_native_overviews_is_empty($x) : !empty($x)) {
            return false;
        }
    }
    return true;
}

/** Common fields every overviews endpoint returns. */
function tefl_native_overviews_base($pid) {
    return array(
        'id'     => (int) $pid,
        'origin' => tefl_headless_wp_origin(),
    );
}
