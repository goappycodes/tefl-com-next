<?php
/**
 * Native template: "English Level Test Template" (page-elt.php) —
 * /test-your-english-level-free-online-tefl-test-tefl-institute-old/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-elt&path=/<cc>/…/&id=928
 *
 * The hero banner and `elt_text` groups, and the CF7 quiz form. (The
 * template's button row tests an undefined variable, so it never prints.)
 * React: components/pages/elt/EltPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('page-elt', 'tefl_native_page_elt');

function tefl_native_page_elt($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'page-elt.php') {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $s    = 'tefl_native_pages_str';
    $rows = 'tefl_native_pages_rows';

    $hero = $rows(get_field('hero_banner'));
    $cta  = $rows($hero['banner_cta'] ?? null);
    $elt  = $rows(get_field('elt_text'));

    return array(
        'banner'    => array(
            'image'    => $s($hero['banner_image'] ?? ''),
            'title'    => $v['h']($cta['cta_title'] ?? ''),
            'subtitle' => $v['h']($cta['cta_subtitle'] ?? ''),
            'text'     => $v['h']($cta['cta_text'] ?? ''),
        ),
        'elt'       => array('image' => $s($elt['image'] ?? ''), 'heading' => $v['h']($elt['heading'] ?? ''), 'text' => $v['h']($elt['text'] ?? '')),
        'quiz_html' => $v['h'](do_shortcode('[contact-form-7 id="73457" title="Custom ELT Form"]')),
    );
}
