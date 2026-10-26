<?php
/**
 * Native template: 3 Days Free Trial (trial.php, /test-tefl-course-free/).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/trial&path=/<cc>/test-tefl-course-free/&id=77395
 *
 * Rendered by components/overviews/Trial.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('trial', 'tefl_native_trial');

function tefl_native_trial($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'trial.php') {
        return null;
    }
    $h    = fn($s) => tefl_native_overviews_html($s, $ctx);
    $src  = 'tefl_native_overviews_src';
    $href = fn($u) => tefl_native_overviews_href($u, $ctx);

    $hero = get_field('hero');
    $why  = get_field('why');

    return tefl_native_overviews_base($pid) + array(
        'hero'  => array(
            'title'   => $h($hero['title'] ?? ''),
            'image'   => $src($hero['image'] ?? ''),
            'heading' => $h($hero['heading'] ?? ''),
            'content' => $h($hero['content'] ?? ''),
            'warning' => $h($hero['warning_text'] ?? ''),
            'secure'  => $h($hero['safe_&_secure'] ?? ''),
        ),
        'links' => array(
            'terms'   => $href('/terms-conditions'),
            'privacy' => $href('/privacy'),
            'trial'   => $href('/?addtimetocart&prid=77294'),
        ),
        'why'   => array(
            'title'  => $h($why['title'] ?? ''),
            'points' => array_map(fn($e) => array(
                'icon'    => $src($e['icon'] ?? ''),
                'heading' => $h($e['heading'] ?? ''),
                'text'    => $h($e['text'] ?? ''),
            ), (array) ($why['points'] ?? array())),
        ),
    );
}
