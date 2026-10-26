<?php
/**
 * Native template: "Where can TEFL take you?" (page template where-to-tefl.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/where_to_tefl&path=/<cc>/where-to-tefl/&id=86838
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('where_to_tefl', 'tefl_native_where_to_tefl');

function tefl_native_where_to_tefl($pid, $ctx) {
    if (get_post_type($pid) !== 'page' || get_page_template_slug($pid) !== 'where-to-tefl.php') {
        return null;
    }
    $h    = function ($s) use ($ctx) {
        return tefl_native_destinations_h($ctx, $s);
    };
    $src  = 'tefl_native_destinations_src';
    $href = function ($s) use ($ctx) {
        return tefl_native_destinations_href($ctx, $s);
    };
    $card = function ($g, $btn_key) use ($h, $src, $href) {
        $g   = is_array($g) ? $g : array();
        $btn = is_array($g[$btn_key] ?? null) ? $g[$btn_key] : array();
        return array(
            'background' => $src($g['background'] ?? ''),
            'icon'       => $src($g['icon'] ?? ''),
            'title'      => $h($g['title'] ?? ''),
            'subtitle'   => $h($g['subtitle'] ?? ''),
            'link'       => $href($btn['link'] ?? ''),
            'value'      => $h($btn['value'] ?? ''),
        );
    };

    $dg     = get_field('download_guides');
    $guides = array();
    $list   = is_array($dg) ? ($dg['guides'] ?? null) : null;
    foreach (is_array($list) ? $list : array() as $g) {
        $guides[] = array(
            'image' => $src($g['image'] ?? ''),
            'name'  => $h($g['name'] ?? ''),
            'link'  => $href($g['link'] ?? ''),
        );
    }

    return array(
        'title'        => $h(get_field('title')),
        'subtitle'     => $h(get_field('subtitle')),
        'path_html'    => $h(get_field('path')),
        'online'       => $card(get_field('teaching_english_online'), 'btn'),
        'abroad'       => $card(get_field('teaching_english_abroad'), 'btn'),
        'courses'      => $card(get_field('tefl_courses'), 'button'),
        'free_call'    => $card(get_field('free_call'), 'button'),
        'guides_title' => $h(is_array($dg) ? ($dg['title'] ?? '') : ''),
        'guides'       => $guides,
    );
}
