<?php
/**
 * Native template: "TEFL Course in Tashkent Uzbekistan" (ti-tashkent-template.php)
 * — /tefl-course-in-tashkent-uzbekistan/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/ti-tashkent-template&path=/<cc>/tefl-course-in-tashkent-uzbekistan/&id=82899
 *
 * The featured-image hero with the optional page title, then nine
 * title + content sections from ACF groups, in template order.
 * React: components/pages/tashkent/TashkentPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('ti-tashkent-template', 'tefl_native_ti_tashkent_template');

function tefl_native_ti_tashkent_template($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'ti-tashkent-template.php') {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $rows = 'tefl_native_pages_rows';

    $sections = array();
    foreach (array('hero', 'job_types', 'qualifications', 'requirements', 'locations', 'culture', 'key_facts', 'living_costs', 'faq') as $name) {
        $g          = $rows(get_field($name));
        $sections[] = array('title' => $v['i']($g['title'] ?? ''), 'content' => $v['h']($g['content'] ?? ''));
    }
    $title = get_field('page_title');

    return array(
        'hero_image' => tefl_native_txt(esc_url((string) get_the_post_thumbnail_url())),
        'page_title' => $title ? $v['i']($title) : '',
        'sections'   => $sections,
    );
}
