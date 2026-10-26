<?php
/**
 * Native template: "About Us" (about.php) — /about-us/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/about&path=/<cc>/about-us/&id=161
 *
 * The four ACF groups the template echoes (hero banner, about, core values,
 * "what makes us different"), as the template prints them.
 * React: components/pages/about/AboutPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('about', 'tefl_native_about');

function tefl_native_about($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'about.php') {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $rows = 'tefl_native_pages_rows';

    $hero = $rows(get_field('hero_banner'));
    $cta  = $rows($hero['banner_cta'] ?? null);
    $abt  = $rows(get_field('about_tefl'));
    $core = $rows(get_field('core_values'));
    $more = $rows(get_field('more_about_tefl'));

    $values = array();
    foreach ($rows($core['values'] ?? null) as $val) {
        $values[] = array('icon' => tefl_native_pages_str($val['icon'] ?? ''), 'title' => $v['h']($val['title'] ?? ''), 'text' => $v['h']($val['text'] ?? ''));
    }

    return array(
        'banner'      => array(
            'image'     => tefl_native_pages_str($hero['banner_image'] ?? ''),
            'title'     => $v['h']($cta['cta_title'] ?? ''),
            'subtitle'  => $v['h']($cta['cta_subtitle'] ?? ''),
            'text'      => $v['h']($cta['cta_text'] ?? ''),
            'btn_text'  => $v['t']($cta['cta_button_text'] ?? ''),
            'btn_link'  => $v['u']($cta['cta_button_link'] ?? ''),
        ),
        'about'       => array('heading' => $v['h']($abt['heading'] ?? ''), 'text' => $v['h']($abt['text'] ?? ''), 'image' => tefl_native_pages_str($abt['image'] ?? '')),
        'core'        => array('heading' => $v['h']($core['heading'] ?? ''), 'values' => $values, 'has_values' => !empty($core['values'])),
        'more'        => array('heading' => $v['h']($more['heading'] ?? ''), 'text' => $v['h']($more['text'] ?? ''), 'image' => tefl_native_pages_str($more['image'] ?? '')),
    );
}
