<?php
/**
 * Native template: "What You Need To Teach English Online" (teach-english-online.php)
 * — /teach-english-online-with-tefl/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/teach-english-online&path=/<cc>/teach-english-online-with-tefl/&id=87721
 *
 * The gallery, steps, course cards (WooCommerce price HTML of each course's
 * product), the three blocks, the English-test and callback panels.
 * React: components/pages/teach-online/TeachOnlinePage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('teach-english-online', 'tefl_native_teach_english_online');

function tefl_native_teach_english_online($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'teach-english-online.php' || !function_exists('wc_get_product')) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $h    = $v['h'];
    $i    = $v['i'];
    $u    = $v['u'];
    $s    = 'tefl_native_pages_str';
    $rows = 'tefl_native_pages_rows';
    $cta  = function ($c) use ($rows, $i, $u) {
        $c = $rows($c);
        return array('value' => $u($c['value'] ?? ''), 'label' => $i($c['label'] ?? ''), 'has' => !empty($c['value']) && !empty($c['label']));
    };

    $gallery = array_map(function ($g) use ($s) {
        return $s($g['photo'] ?? '');
    }, array_values($rows(get_field('gallery'))));
    if (!$gallery) {
        return null;
    }

    $steps = array();
    foreach (array_values($rows(get_field('steps'))) as $st) {
        $steps[] = array('bg' => $s($st['bg_image'] ?? ''), 'icon' => $s($st['icon'] ?? ''), 'title' => $h($st['title'] ?? ''), 'subtitle' => $h($st['subtitle'] ?? ''));
    }

    $courses = array();
    foreach ($rows(get_field('courses')) as $c) {
        $product = wc_get_product(get_field('course_product', $c['course'] ?? 0));
        if (!$product) {
            return null; // the template would fatal
        }
        $best      = $rows($c['best_label'] ?? null);
        $courses[] = array(
            'icon'        => $s($c['icon'] ?? ''),
            'title'       => $h($c['title'] ?? ''),
            'price'       => $h(tefl_native_pages_price_html($product)),
            'best_icon'   => $s($best['icon'] ?? ''),
            'best_title'  => $h($best['title'] ?? ''),
            'best_sub'    => $h($best['subtitle'] ?? ''),
            'description' => $h($c['description'] ?? ''),
            'features'    => array_map(function ($f) use ($h) {
                return $h($f['feature'] ?? '');
            }, array_values($rows($c['features'] ?? null))),
            'cta'         => $cta($c['cta'] ?? null),
        );
    }

    $one    = $rows(get_field('one_block'));
    $points = array();
    foreach ($rows($one['points'] ?? null) as $p) {
        $points[] = array('title' => $h($p['title'] ?? ''), 'subtitle' => $h($p['subtitle'] ?? ''));
    }
    $two   = $rows(get_field('two_block'));
    $three = $rows(get_field('three_block'));
    $elt   = $rows(get_field('english_level_test'));
    $cb    = $rows(get_field('callback'));

    $primary = tefl_native_pages_attrs(tefl_native_pages_capture('astra_primary_class'));

    return array(
        'primary_class' => isset($primary['class']) ? $primary['class'] : 'content-area primary',
        'gallery'       => $gallery,
        'title'         => $i(get_field('title')),
        'subtitle'      => $h(get_field('subtitle')),
        'cta'           => $cta(get_field('cta')),
        'steps'         => $steps,
        'courses'       => $courses,
        'one'           => array('title' => $h($one['title'] ?? ''), 'content' => $h($one['content'] ?? ''), 'points' => $points),
        'two'           => array('image' => $s($two['image'] ?? ''), 'title' => $h($two['title'] ?? ''), 'subtitle' => $h($two['subtitle'] ?? ''), 'cta' => $cta($two['cta'] ?? null)),
        'three'         => array('image' => $s($three['image'] ?? ''), 'title' => $h($three['title'] ?? ''), 'subtitle' => $h($three['subtitle'] ?? ''), 'cta' => $cta($three['cta'] ?? null)),
        'elt'           => array('image' => $s($elt['image'] ?? ''), 'title' => $h($elt['title'] ?? ''), 'subtitle' => $h($elt['subtitle'] ?? ''), 'cta' => $cta($elt['cta'] ?? null)),
        'callback'      => array(
            'thumbnail' => $s($cb['thumbnail'] ?? ''),
            'youtube'   => $s($cb['youtube'] ?? ''),
            'title'     => $h($cb['title'] ?? ''),
            'subtitle'  => $h($cb['subtitle'] ?? ''),
            'cta'       => $cta($cb['cta'] ?? null),
        ),
    );
}
