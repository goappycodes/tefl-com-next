<?php
/**
 * Native template: the 404 page (child theme 404.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/error404&path=/<cc>/<missing>/
 *
 * Runs the URL's main query as WordPress does and only answers when it is a
 * 404. The template is static apart from the #primary classes and the
 * [tefl_course_search] shortcode; React: components/pages/notfound/NotFound404.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

// Named error404.php, not 404.php: bootstrap.php globs native/*.php in order,
// and "404.php" would load before _common.php.
tefl_native_register('error404', 'tefl_native_error404', array('singular' => false));

function tefl_native_error404($id, $ctx) {
    tefl_native_pages_query_for_path($ctx);
    if (!is_404()) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    $primary = tefl_native_pages_attrs(tefl_native_pages_capture('astra_primary_class'));
    $search  = do_shortcode('[tefl_course_search]');
    if (!tefl_native_pages_balanced($search)) {
        return null;
    }
    return array(
        'primary_class'      => isset($primary['class']) ? $primary['class'] : 'content-area primary',
        'course_search_html' => $ctx['html']($ctx['block']($search)),
    );
}
