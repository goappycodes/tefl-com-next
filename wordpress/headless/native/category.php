<?php
/**
 * Native template: category archives (child theme category.php), with paging.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/category&path=/<cc>/category/x/page/2/
 *
 * Builds the main query for the URL as WordPress does, then returns what the
 * template prints: the category title, one card per post, and Astra's number
 * pagination (the_posts_pagination output, passed through as HTML).
 * React: components/pages/category/CategoryArchive.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('category', 'tefl_native_category', array('singular' => false));

function tefl_native_category($id, $ctx) {
    if (!tefl_native_pages_query_for_path($ctx) || !is_category()) {
        return null;
    }
    tefl_native_pages_front_request($ctx);

    $posts = array();
    while (have_posts()) {
        the_post();
        $posts[] = array(
            'thumb' => (string) get_the_post_thumbnail_url(),
            'title' => get_the_title(),
            'url'   => $ctx['href']((string) apply_filters('the_permalink', get_permalink(), get_the_ID())),
        );
    }
    wp_reset_postdata();

    $pagination = trim(tefl_native_pages_capture('astra_pagination'));
    $nav        = '';
    if ($pagination !== '') {
        if (!preg_match("#^<div class='ast-pagination'>(.*)</div>$#s", $pagination, $m)) {
            return null;
        }
        $nav = $ctx['html'](trim($m[1]));
    }

    return array(
        // single_cat_title('') echoes the filtered term name as-is.
        'title_html' => single_cat_title('', false),
        'posts'      => $posts,
        'pagination' => $nav,
    );
}
