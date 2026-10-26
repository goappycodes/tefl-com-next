<?php
/**
 * Shared helpers for the home family's native endpoints (homepage2023,
 * homecopy, internship, internships, screening). Functions: tefl_native_home_*.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

/** What `echo $v` prints. */
function tefl_native_home_s($v) {
    if (is_array($v)) {
        return 'Array';
    }
    if ($v === true) {
        return '1';
    }
    if ($v === null || $v === false) {
        return '';
    }
    return (string) $v;
}

/**
 * $product->get_price_html() as a page view prints it. WCPBC's Ajax
 * geolocation wraps prices in `<span class="wcpbc-price wcpbc-price-ID loading">`
 * + a placeholder on page views (its script then swaps in the visitor's
 * price), but skips the `loading` class and placeholder for REST requests.
 * The amounts are the zone WCPBC resolves for the caller of the endpoint.
 *
 * @param WC_Product  $product
 * @param string|null $html already-computed price HTML (default: get_price_html())
 */
function tefl_native_home_price($product, $html = null) {
    $html = $html === null ? (string) $product->get_price_html() : (string) $html;
    if (!class_exists('WCPBC_Ajax_Geolocation') || !WCPBC_Ajax_Geolocation::is_enabled()) {
        return $html;
    }
    $id   = $product->get_id();
    $open = '<span class="wcpbc-price wcpbc-price-' . $id . '" data-product-id="' . $id . '">';
    if (strpos($html, $open) !== 0 || substr($html, -7) !== '</span>') {
        return $html;
    }
    $inner       = substr($html, strlen($open), -7);
    $placeholder = sprintf('<span class="wcpbc-placeholder %s"></span>', apply_filters('wc_price_based_country_ajax_geolocation_placeholder_class', '-dots'));
    return '<span class="wcpbc-price wcpbc-price-' . $id . ' loading" data-product-id="' . $id . '">' . $inner . $placeholder . '</span>';
}

/**
 * A Contact Form 7 shortcode rendered as it is on the page view.
 *
 * In a REST request CF7 would stamp the form with the REST URL (form action)
 * and its own unit counter; on the page the counter has already moved on by
 * the forms rendered before the content (the header's), the action is the
 * page URL, and `p<ID>` / `_wpcf7_container_post` depend on whether the
 * template prints the form inside the loop.
 *
 * @param string $shortcode `[contact-form-7 id=… ]`
 * @param array  $ctx       native ctx (its `path` is the page URL path)
 * @param int    $before    CF7 forms the page renders before this one (header etc.)
 * @param bool   $in_loop   whether the template is inside the loop at that point
 */
function tefl_native_home_cf7($shortcode, $ctx, $before = 1, $in_loop = false) {
    global $wp_query;
    $was = $wp_query ? $wp_query->in_the_loop : false;
    if ($wp_query) {
        $wp_query->in_the_loop = $in_loop;
    }
    // Some form hooks echo (e.g. a hidden country field) instead of returning;
    // on the page that output lands right before the form, as here.
    ob_start();
    $html = (string) do_shortcode($shortcode);
    $html = (string) ob_get_clean() . $html;
    if ($wp_query) {
        $wp_query->in_the_loop = $was;
    }

    // Unit tags: wpcf7-f<form>[-p<post>]-o<n> → the page's count.
    $html = preg_replace_callback('#\bwpcf7-f(\d+)-((?:p\d+-)?)o(\d+)\b#', function ($m) use ($before) {
        return 'wpcf7-f' . $m[1] . '-' . $m[2] . 'o' . ((int) $m[3] + (int) $before);
    }, $html);

    // Form action: the page URL + #unit-tag.
    $page = (string) strtok((string) $ctx['path'], '#');
    $html = preg_replace_callback('#(<form\b[^>]*\saction=")[^"]*(\#wpcf7-[^"]*")#i', function ($m) use ($page) {
        return $m[1] . esc_url($page) . $m[2];
    }, $html);

    return $html;
}

/** An array to foreach over, as PHP's foreach treats non-arrays (warning, no iterations). */
function tefl_native_home_arr($v) {
    return is_array($v) ? $v : array();
}
