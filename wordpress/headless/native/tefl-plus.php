<?php
/**
 * Native template: TEFL Plus Landing Page (tefl-plus.php — /the-tefl-plus/,
 * /best-tefl-course/, /tefl-specialist-course-bundle/).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/tefl-plus&path=/<cc>/the-tefl-plus/&id=89539
 *
 * Rendered by components/overviews/TeflPlus.tsx. The "Claim My Deal" / "add to
 * cart" links go to WordPress' cart (absolute, as the render leaves them).
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('tefl-plus', 'tefl_native_tefl_plus');

function tefl_native_tefl_plus($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'tefl-plus.php') {
        return null;
    }
    global $post;
    $h     = fn($s) => tefl_native_overviews_html($s, $ctx);
    $src   = 'tefl_native_overviews_src';
    $href  = fn($u) => tefl_native_overviews_href($u, $ctx);
    $empty = 'tefl_native_overviews_is_empty';

    $data = tefl_native_overviews_base($pid);

    // Hero: product price and "Save n%" (n stays empty when it can't be computed, as on the page).
    $hero          = get_field('hero_banner');
    $product_id    = null;
    $product_price = '';
    $save          = '';
    $data['hero']  = null;
    if (!$empty($hero)) {
        $content    = $hero['banner_content'] ?? array();
        $product_id = $content['product'] ?? null;
        $product    = wc_get_product($product_id);
        if ($product) {
            $product_price = tefl_native_overviews_price($product, $ctx);
            $regular       = $product->get_regular_price();
            $sale          = $product->get_sale_price();
            if (is_numeric($regular) && is_numeric($sale) && $regular != 0) {
                $save = (string) round((($regular - $sale) / $regular) * 100);
            }
        }
        $data['hero'] = array(
            'image'        => $src($hero['banner_image'] ?? ''),
            'logo'         => empty($hero['banner_logo']) ? '' : $src($hero['banner_logo']),
            'icon'         => $src($content['content_icon'] ?? ''),
            'title'        => $h($content['title'] ?? ''),
            'product_info' => $h($content['product_info'] ?? ''),
            'guide_180'    => ($post instanceof WP_Post && $post->ID === 91296) ? $href('/guide/180-hour-tefl-course-guide/') : '',
        );
    }
    $data['price']    = $product_price;
    $data['save']     = $save;
    $data['cart_url'] = $href(site_url() . '/cart/?addtimetocart&prid=' . (is_scalar($product_id) ? $product_id : ''));

    $features = get_field('features_section');
    $data['features'] = $empty($features) ? null : array(
        'title' => $h($features['section_title'] ?? ''),
        'items' => array_map(fn($f) => array(
            'icon'  => $src($f['icon'] ?? ''),
            'title' => $h($f['title'] ?? ''),
            'desc'  => $h($f['descrption'] ?? ''),
        ), (array) ($features['features'] ?? array())),
    );

    $included = get_field('whats_included_section');
    $data['included'] = $empty($included) ? null : array(
        'title'   => $h($included['section_title'] ?? ''),
        'content' => $h($included['content'] ?? ''),
    );

    $cta_boxes = get_field('cta_boxes');
    $data['cta_boxes'] = $empty($cta_boxes) ? null : array_map(fn($c) => array(
        'image'    => $src($c['cta_image'] ?? ''),
        'title'    => $h($c['cta_title'] ?? ''),
        'desc'     => $h($c['cta_description'] ?? ''),
        'btn_text' => $h($c['cta_button_text'] ?? ''),
        'btn_link' => $href($c['cta_button_link'] ?? ''),
    ), (array) $cta_boxes);

    $gallery = get_field('photo_gallery');
    $data['gallery'] = $empty($gallery) ? null : array_map(fn($g) => $src($g['image'] ?? ''), (array) $gallery);

    $first  = get_field('first_gallery', 'options');
    $second = get_field('second_gallery', 'options');
    $data['logos1'] = $first ? array_map($src, (array) $first) : array();
    $data['logos2'] = $second ? array_map($src, (array) $second) : array();

    return $data;
}
