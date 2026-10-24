<?php
/**
 * Shared plumbing for the native-template data endpoints (native/*.php).
 *
 * Each template registers one route with tefl_native_register():
 *
 *   GET /<cc>/index.php?rest_route=/tefl/v1/native/<name>&path=/<cc>/x/&id=123
 *
 * Call it through the page's geo folder (as above, not /wp-json/): wp-config
 * sets SEO_LANG / WP_HOME from the request URI, so home_url(), permalinks and
 * per-country ACF (`get_cfvalue_by_country()`) match that folder.
 *
 * The Next app picks the template from the page's body classes (the render
 * already tells it which PHP template WordPress used) and passes the post ID
 * from `postid-N` / `page-id-N`. For singular templates the post is made the
 * main query and the loop is started before the callback runs, so the
 * template's own code (get_field(), the_title(), Yoast, conditionals in
 * the_content filters) behaves exactly as on the page.
 *
 * A callback returns the data array, or null for "not this template" → 404, and
 * the Next route falls back to the passthrough page.
 *
 * Everything here loads for REST requests only (see bootstrap.php). Function
 * names: tefl_native_<template>_*.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * @param string   $name     route name, `tefl/v1/native/<name>`
 * @param callable $callback function (int $id, array $ctx): ?array
 * @param array    $opts     'singular' => true (default) sets up the post as the main query;
 *                           false leaves the query to the callback (archives, search, 404).
 */
function tefl_native_register($name, $callback, $opts = array()) {
    $opts = array_merge(array('singular' => true), $opts);
    add_action('rest_api_init', function () use ($name, $callback, $opts) {
        register_rest_route(TEFL_HEADLESS_NS, '/native/' . $name, array(
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'args'                => array(
                'path' => array('required' => true, 'type' => 'string'),
                'id'   => array('required' => false, 'type' => 'integer'),
            ),
            'callback'            => function (WP_REST_Request $request) use ($name, $callback, $opts) {
                return tefl_native_dispatch($request, $name, $callback, $opts);
            },
        ));
    });
}

function tefl_native_dispatch(WP_REST_Request $request, $name, $callback, $opts) {
    $raw  = (string) $request->get_param('path');
    $path = tefl_headless_normalise_path($raw);
    if ($path === '') {
        return tefl_headless_response(array('ok' => false, 'error' => 'bad_path'), 400);
    }
    list($country, $bare) = tefl_headless_split_country((string) strtok($path, '?'));
    $query = (string) wp_parse_url($path, PHP_URL_QUERY);
    $ctx   = tefl_native_ctx($path, $country, $bare, $query);

    $id = (int) $request->get_param('id');
    if ($opts['singular']) {
        if (!$id) {
            $id = url_to_postid(home_url($bare));
        }
        $p = $id ? get_post($id) : null;
        if (!$p || $p->post_status !== 'publish' || post_password_required($p) || !is_post_type_viewable($p->post_type)) {
            return tefl_headless_response(array('ok' => false, 'error' => 'not_found'), 404);
        }
        if (!tefl_native_main_query($p)) {
            return tefl_headless_response(array('ok' => false, 'error' => 'not_found'), 404);
        }
    }

    $data = call_user_func($callback, $id, $ctx);
    if ($opts['singular']) {
        wp_reset_postdata();
    }
    if (!is_array($data)) {
        return tefl_headless_response(array('ok' => false, 'error' => 'not_native'), 404);
    }

    $data['ok']       = true;
    $data['template'] = $name;
    $data['path']     = $path;
    $data['country']  = $country;
    return tefl_headless_response($data);
}

/** Make $p the main query (as on its own page) and start the loop. */
function tefl_native_main_query(WP_Post $p) {
    global $wp_query, $wp_the_query;
    $args = $p->post_type === 'page'
        ? array('page_id' => $p->ID)
        : array('p' => $p->ID, 'post_type' => $p->post_type);
    $args['post_status'] = 'publish';
    $wp_query     = new WP_Query($args);
    $wp_the_query = $wp_query;
    if (!$wp_query->have_posts()) {
        return false;
    }
    $wp_query->the_post();
    return true;
}

/**
 * Per-request helpers handed to every callback:
 *   href($url)   on-site link → relative (WordPress-owned paths stay absolute), as the render does
 *   html($frag)  every render rewrite on an HTML fragment (links, media, deferred <script>s)
 *   txt($s)      decode entities: for values the template prints with esc_html()/esc_attr(),
 *                so React (which escapes) shows the same text
 *   block($frag) Complianz's cookie blocker (consent placeholders for embeds), which a
 *                REST request never runs on its own
 */
function tefl_native_ctx($path, $country, $bare, $query) {
    $page_url = tefl_headless_wp_origin() . strtok($path, '?');
    parse_str($query, $query_vars);
    return array(
        'path'    => $path,
        'country' => $country,
        'bare'    => $bare,
        'query'   => $query_vars,
        'href'    => 'tefl_headless_rewrite_href',
        'html'    => function ($fragment) use ($page_url) {
            return tefl_headless_rewrite_html((string) $fragment, $page_url);
        },
        'txt'     => 'tefl_native_txt',
        'block'   => 'tefl_headless_cookie_block',
    );
}

function tefl_native_txt($s) {
    return html_entity_decode((string) $s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

/**
 * Capture what a template part / function echoes, as HTML for the Next side.
 * For pieces that are pure WordPress output (a widget area, a shortcode, a
 * plugin form) and are better passed through than rebuilt.
 */
function tefl_native_capture(callable $fn) {
    ob_start();
    try {
        call_user_func($fn);
    } finally {
        $out = ob_get_clean();
    }
    return (string) $out;
}

/**
 * Complianz's cookie blocker over an HTML fragment. On a page it runs as an
 * output buffer (template_redirect), turning YouTube/Vimeo iframes and
 * third-party scripts into consent placeholders; a REST request never starts
 * that buffer, so fragments meant for the page get it applied here.
 *
 * Gated on the blocker's own settings rather than cmplz_can_run_cookie_blocker(),
 * which is false for REST requests by design.
 */
function tefl_headless_cookie_block($html) {
    if ($html === '' || !class_exists('COMPLIANZ') || empty(COMPLIANZ::$cookie_blocker) || !function_exists('cmplz_get_option')) {
        return $html;
    }
    if (cmplz_get_option('enable_cookie_blocker') !== 'yes' || cmplz_get_option('safe_mode')) {
        return $html;
    }
    return COMPLIANZ::$cookie_blocker->replace_tags($html);
}
