<?php
/**
 * tefl/v1/routes — every public front path, for build-time prerendering and the
 * post-deploy cache warmer.
 *
 * GET /wp-json/tefl/v1/routes[?type=page,course][&modified_after=2026-10-01]
 *   → { count, countries:["gb",…], routes:[{ path, type, id, modified }] }
 *
 * Paths are US (un-prefixed); every one also exists under each geo folder
 * (/gb/…, /za/…), which the caller can expand with `countries`.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Public post types the Next front renders. */
function tefl_headless_route_types() {
    return apply_filters('tefl_headless_route_types', array(
        'page', 'post', 'course', 'internship', 'teach_english_abroad',
        'support_centre', 'placement', 'guide', 'webinar', 'faqs', 'screening_form',
    ));
}

add_action('rest_api_init', function () {
    register_rest_route(TEFL_HEADLESS_NS, '/routes', array(
        'methods'             => 'GET',
        'callback'            => 'tefl_headless_routes',
        'permission_callback' => '__return_true',
    ));
});

function tefl_headless_routes(WP_REST_Request $request) {
    $types = tefl_headless_route_types();
    $only  = array_filter(array_map('trim', explode(',', (string) $request->get_param('type'))));
    if ($only) {
        $types = array_values(array_intersect($types, $only));
    }

    $args = array(
        'post_type'              => $types,
        'post_status'            => 'publish',
        'posts_per_page'         => -1,
        'fields'                 => 'ids',
        'no_found_rows'          => true,
        'update_post_term_cache' => false,
        'orderby'                => 'modified',
        'order'                  => 'DESC',
        'has_password'           => false,
    );
    $after = (string) $request->get_param('modified_after');
    if ($after !== '') {
        $args['date_query'] = array(array('column' => 'post_modified_gmt', 'after' => $after));
    }

    $routes = array();
    $home   = rtrim(home_url(), '/');
    foreach ((new WP_Query($args))->posts as $id) {
        $url = get_permalink($id);
        if (!$url || strpos($url, $home) !== 0) {
            continue;
        }
        // Skip Yoast-noindexed entries: they aren't in the sitemap either.
        if ((string) get_post_meta($id, '_yoast_wpseo_meta-robots-noindex', true) === '1') {
            continue;
        }
        $path = substr($url, strlen($home));
        $routes[] = array(
            'path'     => $path === '' ? '/' : $path,
            'type'     => get_post_type($id),
            'id'       => (int) $id,
            'modified' => get_post_modified_time('c', true, $id),
        );
    }

    return tefl_headless_response(array(
        'count'     => count($routes),
        'countries' => tefl_headless_countries(),
        'routes'    => $routes,
    ));
}
