<?php
/**
 * Native template: "Teach English Online" (page-teo.php) — /start-teach-english-online/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-teo&path=/<cc>/start-teach-english-online/&id=901
 *
 * Every ACF group the template echoes (with its per-country variants via
 * get_cfvalue_by_country / get_repeater_cfvalue_by_country /
 * get_group_cfvalue_by_country), the TI jobs feed cards (get_ti_jobs(8),
 * cached in a transient by the theme) and the FAQ. The template also calls
 * ti_online_tefl_job_feed(), whose result it never uses — not called here.
 * React: components/pages/teo/TeoPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('page-teo', 'tefl_native_page_teo');

function tefl_native_page_teo($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'page-teo.php' || !function_exists('get_cfvalue_by_country')) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $s    = 'tefl_native_pages_str';
    $rows = 'tefl_native_pages_rows';

    $hero    = $rows(get_field('hero'));
    $main    = $rows(get_field('main'));
    $top     = $rows($main['top'] ?? null);
    $bottom  = $rows($main['bottom'] ?? null);
    $started = $rows(get_field('get_started'));
    $why     = $rows(get_field('why_teach_english_online'));
    $exp     = $rows(get_field('explained'));
    $teo     = $rows(get_field('teo_courses'));
    $test    = $rows(get_field('english_level_test'));
    $faq     = $rows(get_cfvalue_by_country('faq'));

    $why_items = array();
    foreach ($rows($why['items'] ?? null) as $el) {
        $why_items[] = array('icon' => $s($el['icon'] ?? ''), 'description' => $v['h']($el['description'] ?? ''));
    }
    $courses = array();
    foreach ($rows($teo['courses'] ?? null) as $el) {
        $courses[] = array(
            'badge'      => $s($el['badge'] ?? ''),
            'background' => $s($el['background'] ?? ''),
            'title'      => $v['h']($el['title'] ?? ''),
            'subtitle'   => $v['h']($el['subtitle'] ?? ''),
            'learn_more' => $v['u']($el['learn_more'] ?? ''),
        );
    }
    $faqs = array();
    foreach ($faq as $el) {
        $faqs[] = array('question' => $v['h']($el['question'] ?? ''), 'answer' => $v['h']($el['answer'] ?? ''));
    }

    return array(
        'hero'        => array(
            'image'    => $s($hero['image'] ?? ''),
            'title'    => $v['h'](get_repeater_cfvalue_by_country('hero', 'title')),
            'subtitle' => $v['h']($hero['subtitle'] ?? ''),
        ),
        'top'         => array('image' => $s($top['image'] ?? ''), 'title' => $v['h']($top['title'] ?? ''), 'description' => $v['h']($top['description'] ?? '')),
        'bottom'      => array(
            'image'       => $s($bottom['image'] ?? ''),
            'title'       => $v['h'](get_group_cfvalue_by_country('main', 'bottom', 'title')),
            'description' => $v['h'](get_group_cfvalue_by_country('main', 'bottom', 'description')),
        ),
        'started'     => array('title' => $v['h']($started['title'] ?? ''), 'description' => $v['h']($started['description'] ?? ''), 'link' => $v['u']($started['link'] ?? '')),
        'why'         => array('title' => $v['h']($why['title'] ?? ''), 'items' => $why_items),
        'explained'   => array(
            'title'     => $v['h']($exp['title'] ?? ''),
            'subtitle'  => $v['h']($exp['subtitle'] ?? ''),
            'thumbnail' => $s($exp['thumbnail'] ?? ''),
            'youtube'   => $v['u']($exp['youtube'] ?? ''),
        ),
        'teo'         => array(
            'title'       => $v['h'](get_repeater_cfvalue_by_country('teo_courses', 'title')),
            'description' => $v['h'](get_repeater_cfvalue_by_country('teo_courses', 'description')),
            'courses'     => $courses,
        ),
        'test'        => array(
            'background' => $s($test['background'] ?? ''),
            'title'      => $v['h']($test['title'] ?? ''),
            'subtitle'   => $v['h']($test['subtitle'] ?? ''),
            'link'       => $v['u']($test['link'] ?? ''),
        ),
        'jobs'        => tefl_native_pages_ti_jobs($ctx, function_exists('get_ti_jobs') ? get_ti_jobs(8, false) : null),
        'faq'         => $faqs,
    );
}
