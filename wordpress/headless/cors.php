<?php
/**
 * Browser-facing CORS for the Next front-end.
 *
 * The Next pages call WordPress straight from the visitor's browser — never via
 * a server-side proxy — because Price Based on Country (WCPBC_USE_REMOTE_ADDR),
 * the city logo / geo phone (`ti_combined_ajax_geo_actions`) and the timetable
 * all resolve the VISITOR's IP. A proxy would make every visitor look like the
 * Vercel region. So we allow the Next origins on:
 *
 *   - /wp-admin/admin-ajax.php   (theme + plugin AJAX)
 *   - /?wc-ajax=<endpoint>        (WooCommerce + WCPBC geolocation AJAX)
 *
 * /wp-json/ needs nothing here: core's rest_send_cors_headers() already
 * reflects the request Origin (CF7 submissions, Store API, our tefl/v1).
 *
 * Only allow-listed origins (helpers.php) get the headers; everything else
 * keeps WordPress' default behaviour.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Is this request one of the AJAX transports we open up? */
function tefl_headless_is_ajax_transport() {
    if (defined('DOING_AJAX') && DOING_AJAX) {
        return true;
    }
    $uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '';
    if (strpos($uri, '/wp-admin/admin-ajax.php') !== false) {
        return true;
    }
    return isset($_GET['wc-ajax']) && $_GET['wc-ajax'] !== '';
}

function tefl_headless_send_ajax_cors() {
    if (headers_sent() || !tefl_headless_is_ajax_transport()) {
        return;
    }
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? (string) $_SERVER['HTTP_ORIGIN'] : '';
    if (!tefl_headless_origin_allowed($origin)) {
        return;
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    // Reflect the requested headers (WCPBC sends Cache-Control; others X-Requested-With…),
    // restricted to plain header-name characters.
    $requested = isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']) ? (string) $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] : '';
    $requested = preg_replace('/[^A-Za-z0-9_,\- ]/', '', $requested);
    header('Access-Control-Allow-Headers: ' . ($requested !== '' ? $requested : 'Content-Type, Accept, X-Requested-With, X-WP-Nonce, Cache-Control'));
    header('Access-Control-Max-Age: 600');
    header('Vary: Origin', false);

    // Answer the pre-flight here; admin-ajax would otherwise 400 an action-less OPTIONS.
    if (isset($_SERVER['REQUEST_METHOD']) && strtoupper($_SERVER['REQUEST_METHOD']) === 'OPTIONS') {
        status_header(204);
        exit;
    }
}

// `init` runs inside admin-ajax.php (via wp-load) and before WooCommerce
// dispatches wc-ajax on template_redirect, so the headers are always first.
add_action('init', 'tefl_headless_send_ajax_cors', 0);
