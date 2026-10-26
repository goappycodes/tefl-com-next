<?php
/**
 * Shared helpers for the destinations family's native endpoints
 * (guide, country page, jobs pages, placement, support centre, alerts, ppc, …).
 *
 * No routes and no side effects: functions only, prefixed tefl_native_destinations_.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

/** An HTML fragment a template echoes raw: Complianz cookie blocker + the render's rewrites. */
function tefl_native_destinations_h($ctx, $s) {
    if ($s === null || $s === false || $s === '') {
        return '';
    }
    return $ctx['html'](call_user_func($ctx['block'], (string) $s));
}

/** A URL a template prints in src="": as the render rewrites it (no Photon, root-relative → WP origin). */
function tefl_native_destinations_src($s) {
    $s = preg_replace('#^(https?:)?//i[0-9]\.wp\.com/#i', 'https://', (string) $s);
    if ($s !== '' && $s[0] === '/' && (strlen($s) < 2 || $s[1] !== '/')) {
        $s = tefl_headless_wp_origin() . $s;
    }
    return tefl_native_txt($s);
}

/** A link a template prints in href="": decoded, then rewritten like the render does. */
function tefl_native_destinations_href($ctx, $s) {
    return call_user_func($ctx['href'], tefl_native_txt((string) $s));
}

/**
 * Capture WordPress output (a CF7 form shortcode, a widget area, a plugin
 * block) as it renders on the page itself:
 *   - outside the loop (these templates never start one), so CF7 prints
 *     `_wpcf7_container_post` 0 and an unpositioned unit tag;
 *   - CF7's form counter advanced by $forms_before (on every page one form is
 *     rendered before the content area — the footer form shows as `-o2` on
 *     pages without any in the content);
 *   - CF7's form action set to the page's own path (what wpcf7_get_request_uri()
 *     gives on the page), not the REST route.
 * Returns the fragment with the cookie blocker and the render's rewrites applied.
 */
function tefl_native_destinations_capture($ctx, callable $fn, $forms_before = 1) {
    global $wp_query;
    $saved_loop = $wp_query ? $wp_query->in_the_loop : false;
    $action     = function ($url) use ($ctx) {
        $frag = strstr((string) $url, '#');
        return sanitize_url('/' . ltrim($ctx['path'], '/')) . ($frag === false ? '' : $frag);
    };
    add_filter('wpcf7_form_action_url', $action, 1);
    if ($wp_query) {
        $wp_query->in_the_loop = false;
    }
    tefl_native_destinations_cf7_advance($forms_before);
    try {
        $html = tefl_native_capture($fn);
    } finally {
        remove_filter('wpcf7_form_action_url', $action, 1);
        if ($wp_query) {
            $wp_query->in_the_loop = $saved_loop;
        }
    }
    return tefl_native_destinations_h($ctx, $html);
}

/** Advance CF7's per-request form counter to $n (once per request). */
function tefl_native_destinations_cf7_advance($n) {
    static $done = 0;
    if (!class_exists('WPCF7_ContactForm')) {
        return;
    }
    try {
        $m = new ReflectionMethod('WPCF7_ContactForm', 'generate_unit_tag');
        $m->setAccessible(true);
        while ($done < $n) {
            $m->invoke(null, 0);
            $done++;
        }
    } catch (Throwable $e) {
        // Unit tags then start at -o1; cosmetic only.
    }
}

/**
 * WooCommerce price HTML as a page view prints it. With WCPBC's caching
 * support on, prices get a `wcpbc-price` wrapper; on a page view (not AJAX /
 * REST) it also carries `loading` and a placeholder span, which the plugin's
 * ajax-geolocation script swaps for the visitor's price. A REST request gets
 * the bare wrapper, so add the page-view parts back.
 */
function tefl_native_destinations_wcpbc_page($html) {
    return preg_replace_callback(
        '#<span class="wcpbc-price wcpbc-price-(\d+)" data-product-id="(\d+)">(.*)</span>#s',
        function ($m) {
            $placeholder = sprintf('<span class="wcpbc-placeholder %s"></span>', apply_filters('wc_price_based_country_ajax_geolocation_placeholder_class', '-dots'));
            return sprintf('<span class="wcpbc-price wcpbc-price-%s loading" data-product-id="%s">%s%s</span>', $m[1], $m[2], $m[3], $placeholder);
        },
        (string) $html
    );
}

/** basename() of an image URL, as the templates print it in alt="". */
function tefl_native_destinations_alt($s) {
    return tefl_native_txt(basename((string) $s));
}
