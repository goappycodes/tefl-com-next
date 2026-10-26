<?php
/**
 * Native template: "Teach English Resources" (page-resources.php) —
 * /teaching-english-resources/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-resources&path=/<cc>/teaching-english-resources/&id=66930
 *
 * The hero / freebie / guide groups and the product cards (with WooCommerce's
 * price HTML for each linked product). React: components/pages/resources/ResourcesPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('page-resources', 'tefl_native_page_resources');

function tefl_native_page_resources($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'page-resources.php' || !function_exists('wc_get_product')) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $rows = 'tefl_native_pages_rows';
    $s    = 'tefl_native_pages_str';

    $hero    = $rows(get_field('hero'));
    $freebie = $rows(get_field('freebie'));
    $fb_btn  = $rows($freebie['button'] ?? null);
    $guide   = $rows(get_field('guide'));
    $gd_btn  = $rows($guide['button'] ?? null);

    $products = array();
    foreach ($rows(get_field('products')) as $p) {
        $pid = $p['product'] ?? 0;
        $wc  = wc_get_product($pid);
        if (!$wc) {
            return null; // the template would fatal here
        }
        $products[] = array(
            'image'      => $s($p['image'] ?? ''),
            'title'      => $v['i']($p['title'] ?? ''),
            'content'    => $v['h']($p['content'] ?? ''),
            'price_html' => $v['h'](tefl_native_pages_price_html($wc)),
            'cart_url'   => $ctx['href']('/?addtimetocart&prid=' . $s($pid)),
        );
    }

    return array(
        'hero'     => array('image' => $s($hero['image'] ?? ''), 'title' => $v['i']($hero['title'] ?? ''), 'subtitle' => $v['i']($hero['subtitle'] ?? '')),
        'freebie'  => array(
            'title'   => $v['i']($freebie['title'] ?? ''),
            'content' => $v['h']($freebie['content'] ?? ''),
            'image'   => $s($freebie['image'] ?? ''),
            'btn'     => $v['i']($fb_btn['value'] ?? ''),
            'link'    => $v['u']($fb_btn['link'] ?? ''),
        ),
        'guide'    => array(
            'title'   => $v['i']($guide['title'] ?? ''),
            'content' => $v['h']($guide['content'] ?? ''),
            'image'   => $s($guide['cover'] ?? ''),
            'btn'     => $v['i']($gd_btn['value'] ?? ''),
            'link'    => $v['u']($gd_btn['link'] ?? ''),
        ),
        'products' => $products,
    );
}
