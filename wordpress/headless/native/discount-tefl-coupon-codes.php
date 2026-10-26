<?php
/**
 * Native template: TEFL coupon codes page (discount-tefl-coupon-codes.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/discount-tefl-coupon-codes&path=/<cc>/tefl-discount-coupon-codes/&id=87592
 *
 * Every value the template prints, resolved (ACF page header, the de-duplicated
 * coupons, the option-page expiry date). Markup: components/promos/CouponCodes.tsx;
 * the theme's discount-tefl-coupon-codes.js still drives "See Code" / copy.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('discount-tefl-coupon-codes', 'tefl_native_discount_tefl_coupon_codes');

function tefl_native_discount_tefl_coupon_codes($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'discount-tefl-coupon-codes.php') {
        return null;
    }
    $raw = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };

    $header      = null;
    $page_header = get_field('page_header');
    if (!is_array_empty($page_header)) {
        $header = array(
            'title' => $raw($page_header['page_title']),
            'desc'  => $raw($page_header['page_description']),
        );
    }

    $coupons = get_field('coupons');
    $expiry  = get_field('coupons_page_coupons_expiry_date', 'option');
    $cards   = null;
    if (!empty($coupons)) {
        $cards = array();
        $used  = array();
        $formatted = '';
        foreach ($coupons as $coupon) {
            $code = $coupon['coupon_code'];
            if (in_array($code, $used)) {
                continue;
            }
            $used[] = $code;
            if ($expiry) {
                $date      = new DateTime($expiry);
                $formatted = $date->format('jS M Y');
            }
            if (!$code) {
                continue;
            }
            $cards[] = array(
                'code'     => $ctx['txt']($code), // attribute value
                'code_html' => $raw($code),
                'desc'     => $raw($coupon['tefl_course_type']),
                'icon'     => tefl_native_promos_src($coupon['coupon_icon']),
                'discount' => $raw($coupon['tefl_discount']),
                'live'     => (bool) $coupon['is_live'],
                'expiry'   => ($coupon['is_live'] && $expiry) ? $raw($formatted) : null,
            );
        }
    }

    return array(
        'primary_class' => tefl_native_promos_primary_class(),
        'header'        => $header,
        'coupons'       => $cards,
        'terms_url'     => tefl_native_promos_href('/terms-and-conditions'),
    );
}
