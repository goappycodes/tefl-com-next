<?php
/**
 * Native template: "TEFL Scholarships" (tefl-scholarships.php) — /tefl-scholarships/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/tefl-scholarships&path=/<cc>/tefl-scholarships/&id=9316
 *
 * The `hero` and `main` groups as the template echoes them, plus the linked
 * course's "Worth <symbol><regular price>" (WooCommerce, priced per visitor
 * country on live). React: components/pages/scholarships/ScholarshipsPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('tefl-scholarships', 'tefl_native_tefl_scholarships');

function tefl_native_tefl_scholarships($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'tefl-scholarships.php' || !function_exists('wc_get_product')) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $s    = 'tefl_native_pages_str';
    $rows = 'tefl_native_pages_rows';

    $hero     = $rows(get_field('hero'));
    $main     = $rows(get_field('main'));
    $course   = $rows($main['course'] ?? null);
    $apply    = $rows($main['apply'] ?? null);
    $deadline = $rows($main['deadline'] ?? null);
    $legal    = $rows($main['legal'] ?? null);
    $product  = wc_get_product($course['product'] ?? 0);
    if (!$product) {
        return null; // the template would fatal
    }

    return array(
        'hero' => array('background' => $s($hero['background'] ?? ''), 'title' => $v['i']($hero['title'] ?? '')),
        'main' => array(
            'title'          => $v['i']($main['title'] ?? ''),
            'subtitle'       => $v['i']($main['subtitle'] ?? ''),
            'course_bg'      => $s($course['background'] ?? ''),
            'course_title'   => $v['i']($course['title'] ?? ''),
            'worth'          => $v['t'](get_woocommerce_currency_symbol() . $product->get_regular_price()),
            'course_link'    => $v['u']($course['link'] ?? ''),
            'description'    => $v['h']($main['description'] ?? ''),
            'apply_image'    => $s($apply['image'] ?? ''),
            'apply_content'  => $v['h']($apply['content'] ?? ''),
            'apply_desc'     => $v['h']($apply['description'] ?? ''),
            'deadline_date'  => $v['t']($deadline['date'] ?? ''),
            'deadline_left'  => $v['h']($deadline['left_content'] ?? ''),
            'deadline_right' => $v['h']($deadline['right_content'] ?? ''),
            'terms'          => $v['h']($legal['terms'] ?? ''),
            'privacy'        => $v['h']($legal['privacy'] ?? ''),
        ),
    );
}
