<?php
/**
 * Native template: "January Courses Sale Page" (january-courses-sale.php) — tefl-courses-sales.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/january-courses-sale&path=/<cc>/tefl-courses-sales/&id=73603
 *
 * Hero / countdown / gifts (tefl_native_promos_jan_top()), then the sale
 * courses, add-ons and guide bundle. The course loop is the template's own
 * code: it carries values over between iterations (deposit plan,
 * $total_deposits, $first_payment, $deposit_percent from
 * template-parts/deposit-info.php) and prints some of them as raw attribute
 * text, so it runs here as written and returns what each card prints.
 * Markup: components/promos/JanuaryCoursesSale.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('january-courses-sale', 'tefl_native_january_courses_sale');

function tefl_native_january_courses_sale($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'january-courses-sale.php') {
        return null;
    }
    $raw  = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };
    $src  = 'tefl_native_promos_src';
    $href = 'tefl_native_promos_href';

    // Sale courses — the template's loop (state carries over between cards).
    $cards         = null;
    $sales_courses = get_field('sale_courses');
    $common_header = get_field('card_common_header');
    if (!empty($sales_courses)) {
        $cards = array();
        $count = 1;
        $deposit_payment_plan = null;
        $total_deposits       = null;
        $first_payment        = null;
        $deposit_percent      = null;
        $is_virtual_couse     = null;
        foreach ($sales_courses as $sc) {
            $course_image      = $sc['course_image'];
            $course_logo       = $sc['course_logo'];
            $course_title      = $sc['course_title'];
            $course            = $sc['course'];
            $course_link       = get_post_permalink($course);
            $course_product_id = get_field('course_product', $course);
            $course_price      = '';
            $add_to_cart_link  = '';
            $percentage        = '';
            $enrol_btn_txt     = $sc['enroll_button_text'];
            if ($course_product_id) {
                $course_product = wc_get_product($course_product_id);
                if ($course_product) {
                    $course_price = tefl_native_promos_price_html($course_product);
                }
                $full_price           = $course_product->get_price();
                $deposit_enabled      = get_post_meta($course_product_id, '_wc_deposit_enabled', true);
                $deposit_payment_plan = '';
                $add_to_cart_link     = site_url() . '/cart/?addtimetocart&prid=' . $course_product_id;
                if ($deposit_enabled == 'forced' || $deposit_enabled == 'optional') {
                    $deposit_payment_plan = get_post_meta($course_product_id, '_wc_deposit_payment_plans', true);
                    $deposit_payment_plan = $deposit_payment_plan[0];
                }
                include get_stylesheet_directory() . '/template-parts/deposit-info.php';
            }
            $courses_features  = $sc['course_features'];
            $extra_features    = $sc['extra_course_features'];
            $read_more_btn_txt = $sc['read_more_button_text'];
            if ($deposit_payment_plan) {
                $add_to_cart_link = site_url() . '/cart/?addtimetocart&prid=' . $course_product_id . '&deposit';
                $enrol_btn_txt    = 'Pay in ' . $total_deposits;
            }

            $includes = array();
            foreach ((array) $courses_features['includes'] as $inc) {
                $includes[] = $raw($inc['content']);
            }
            $excludes = array();
            foreach ((array) $courses_features['excludes'] as $exc) {
                $excludes[] = $raw($exc['content']);
            }
            $others = array();
            foreach ((array) ($extra_features['other_features'] ?? array()) as $of) {
                $others[] = array(
                    'icon'  => $of['icon'] ? $src($of['icon']) : '',
                    'title' => $of['title'] ? $raw($of['title']) : '',
                );
            }
            $cards[] = array(
                'header'        => $raw($common_header),
                'row_attr'      => $raw($deposit_payment_plan),
                'image'         => $src($course_image),
                'percentage'    => $raw($percentage),
                'logo'          => $course_logo ? $src($course_logo) : '',
                'title'         => $course_title ? $raw($course_title) : '',
                'price'         => $course_price ? $ctx['html']($course_price) : '',
                'deposits'      => $raw($total_deposits),
                'first_deposit' => $first_payment ? $raw($first_payment) : '',
                'deposit_pct'   => $raw($deposit_percent),
                'cart'          => $add_to_cart_link ? $href($add_to_cart_link) : '',
                'virtual'       => (bool) $is_virtual_couse,
                'course_link'   => $href($course_link),
                'enrol_text'    => $raw($enrol_btn_txt),
                'radio'         => $deposit_payment_plan ? (int) $count : null,
                'has_inc_exc'   => !empty($courses_features['includes']) || !empty($courses_features['excludes']),
                'includes'      => $courses_features['includes'] ? $includes : array(),
                'excludes'      => $courses_features['excludes'] ? $excludes : array(),
                'extra'         => !empty($extra_features) ? array(
                    'main_text' => $raw($extra_features['extra_feature_main']),
                    'main_icon' => $src($extra_features['extra_features_main_icon']),
                    'others'    => !empty($extra_features['other_features']) ? $others : null,
                    'read_more' => !empty($add_to_cart_link) ? $raw($read_more_btn_txt) : null,
                ) : null,
            );
            if ($deposit_payment_plan) {
                $count += 1;
            }
        }
    }

    // Add-ons.
    $addons  = null;
    $section = get_field('add_on_section');
    if (!empty($section)) {
        $items = array();
        foreach ((array) $section['add_ons'] as $add_on) {
            $course_link       = get_post_permalink($add_on['course']);
            $course_product_id = get_field('course_product', $add_on['course']);
            $course_price      = '';
            $add_to_cart_link  = '';
            if ($course_product_id) {
                $course_product = wc_get_product($course_product_id);
                if ($course_product) {
                    $course_price = tefl_native_promos_price_html($course_product);
                }
                $add_to_cart_link = site_url() . '/cart/?add-to-cart=' . $course_product_id;
            }
            $features = array();
            foreach ((array) $add_on['features'] as $feature) {
                $features[] = $raw($feature['feature']);
            }
            $items[] = array(
                'ribbon'   => $raw($add_on['offer_ribbon_text']),
                'image'    => $add_on['image'] ? $src($add_on['image']) : '',
                'logo'     => $add_on['icon'] ? $src($add_on['icon']) : '',
                'title'    => $add_on['title'] ? $raw($add_on['title']) : '',
                'features' => $add_on['features'] ? $features : null,
                'price'    => $course_price ? $ctx['html']($course_price) : '',
                'link'     => $course_link ? $href($course_link) : '',
                'cart'     => $add_to_cart_link ? $href($add_to_cart_link) : '',
            );
        }
        $addons = array('title' => $raw($section['section_title']), 'items' => $items);
    }

    // Guide bundle.
    $guide   = null;
    $section = get_field('guide_bundle_section');
    if (!empty($section)) {
        $guide_price = '';
        $guide_link  = null;
        if ($section['product']) {
            $guide_product = wc_get_product($section['product']);
            $guide_link    = site_url() . '/cart/?add-to-cart=' . $section['product'];
            if ($guide_product) {
                $guide_price = tefl_native_promos_price_html($guide_product);
            }
        }
        $guide = array(
            'header'    => $raw($section['section_title']),
            'title'     => $section['guide_title'] ? $raw($section['guide_title']) : '',
            'subtitle'  => $section['offer_description'] ? $raw($section['offer_description']) : '',
            'price'     => $guide_price ? $ctx['html']($guide_price) : '',
            'link'      => $guide_link ? $href($guide_link) : '',
            'image'     => $section['product_image'] ? $src($section['product_image']) : '',
            'view_more' => $section['show_more_guides_link'] ? $href($section['show_more_guides_link']) : '',
        );
    }

    $top = tefl_native_promos_jan_top($ctx);
    return array(
        'primary_class' => tefl_native_promos_primary_class(),
        'hero'          => $top['hero'],
        'timer'         => $top['timer'],
        'gifts'         => $top['gifts'],
        'courses'       => $cards,
        'addons'        => $addons,
        'guide'         => $guide,
        'origin'        => tefl_headless_wp_origin(),
    );
}
