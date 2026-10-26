<?php
/**
 * Native template: Gift Vouchers (gift-vouchers.php, /tefl-gift-vouchers/).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/gift-vouchers&path=/<cc>/tefl-gift-vouchers/&id=73264
 *
 * Rendered by components/overviews/GiftVouchers.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('gift-vouchers', 'tefl_native_gift_vouchers');

function tefl_native_gift_vouchers($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'gift-vouchers.php') {
        return null;
    }
    $h = fn($s) => tefl_native_overviews_html($s, $ctx);

    // isset(): the section prints for any non-null value (an empty field is false, which is set).
    $hero = get_field('hero_banner');
    $data = tefl_native_overviews_base($pid);
    $data['hero'] = isset($hero) ? array(
        'image' => tefl_native_overviews_src(is_array($hero) ? ($hero['image'] ?? '') : ''),
        'text'  => $h(is_array($hero) ? ($hero['text'] ?? '') : ''),
    ) : null;

    $vouchers = get_field('gift_vouchers');
    $data['vouchers'] = null;
    if (isset($vouchers) && is_array($vouchers)) {
        $data['vouchers'] = array();
        foreach ($vouchers as $v) {
            $product_id = $v['voucher_product'] ?? 0;
            $product    = wc_get_product($product_id);
            $has_free   = !empty($v['has_free_voucher']);
            $data['vouchers'][] = array(
                'title'    => $h($v['voucher_title'] ?? ''),
                'image'    => tefl_native_overviews_src(get_the_post_thumbnail_url($product_id)),
                'link'     => tefl_native_overviews_href(get_the_permalink($product_id), $ctx),
                'price'    => tefl_native_overviews_price($product, $ctx),
                'has_free' => $has_free,
                'free'     => ($has_free && $product) ? $h(geo_price((float) $product->get_price() * .3)) : '',
            );
        }
    }
    return $data;
}
