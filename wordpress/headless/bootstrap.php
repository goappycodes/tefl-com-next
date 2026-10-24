<?php
/**
 * Headless layer for the Next.js front-end (teflinstitute.com).
 *
 * Mirrors the TEFL IE `headless/` folder: read-only, CORS-enabled endpoints
 * under `/wp-json/tefl/v1/` that give the Next app what the stock REST API
 * can't — chiefly a universal, geo-folder-aware render of any public URL.
 *
 * Routes (see README.md for the request/response contracts):
 *   GET /wp-json/tefl/v1/render?path=/gb/course/x/   rendered page parts + SEO head
 *   GET /wp-json/tefl/v1/routes                      every public path (warmers/builds)
 *   GET /wp-json/tefl/v1/health                      liveness + version
 *
 * Plus cors.php: lets the Next origins call admin-ajax / wc-ajax / wp-json
 * straight from the visitor's browser, so geo pricing, the city logo and CF7
 * resolve against the VISITOR's IP (a server-side proxy would see Vercel's).
 *
 * Loaded by the single include line in the child theme's functions.php. Turn it
 * off with zero side effects by deleting this folder, removing that line, or
 * `define('TEFL_HEADLESS_DISABLE', true)` in wp-config.php.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('TEFL_HEADLESS_NS')) {
    define('TEFL_HEADLESS_NS', 'tefl/v1');
}
if (!defined('TEFL_HEADLESS_VERSION')) {
    define('TEFL_HEADLESS_VERSION', '1.0.0');
}

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/rest-render.php';
require_once __DIR__ . '/rest-routes.php';

add_action('rest_api_init', function () {
    register_rest_route(TEFL_HEADLESS_NS, '/health', array(
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            return tefl_headless_response(array(
                'ok'      => true,
                'version' => TEFL_HEADLESS_VERSION,
                'country' => defined('SEO_LANG') ? SEO_LANG : 'us',
                'time'    => gmdate('c'),
            ));
        },
    ));
});
