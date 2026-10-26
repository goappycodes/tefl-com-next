<?php
/**
 * Native template: "TEFL January Sale 2025" (tefl-january-sale.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/tefl-january-sale&path=/<cc>/tefl-january-sale-old/&id=92099
 *
 * Mirrors the template: hero + [tefl_timer_shortcode], top banner, course
 * cards (WooCommerce price HTML, discount, Klarna instalment, includes /
 * excludes), gifts, bundle, verified reviews (option-page widget + average +
 * [brb_collection id="77247"]), specialist-courses slider, tools,
 * accreditations, FAQ, panel and the Klarna modal (LAST course's price, as in
 * the template). Markup: components/promos/TeflJanuarySale.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('tefl-january-sale', 'tefl_native_tefl_january_sale');

function tefl_native_tefl_january_sale($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'tefl-january-sale.php') {
        return null;
    }
    $raw  = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };
    $src  = 'tefl_native_promos_src';
    $href = 'tefl_native_promos_href';

    $hero = get_field('hero');
    $top  = get_field('top');

    $courses    = get_field('courses');
    $cards      = null;
    $full_price = null;
    if (!is_array_empty($courses)) {
        $cards = array();
        foreach ($courses as $course) {
            $product_id  = $course['product']->ID;
            $product_obj = wc_get_product($product_id);
            $regular     = $product_obj->get_regular_price();
            $sale        = $product_obj->get_sale_price();
            $full_price  = $product_obj->get_price();
            $includes    = array();
            foreach ((array) $course['includes'] as $include) {
                $includes[] = $raw($include['text']);
            }
            $excludes = array();
            foreach ((array) $course['excludes'] as $exclude) {
                $excludes[] = $raw($exclude['text']);
            }
            $cards[] = array(
                'thumbnail'      => $src($course['thumbnail']),
                'discount'       => (string) (($regular && $sale) ? round((($regular - $sale) / $regular) * 100) : 0),
                'icon'           => $src($course['icon']),
                'title'          => $raw($course['title']),
                'price'          => $ctx['html'](tefl_native_promos_price_html($product_obj)),
                'completion'     => $raw($course['completion_time']),
                'enrol_link'     => $href('/cart/?addtimetocart&prid=' . $product_id),
                'enrol_button'   => $raw($course['enrol_button']),
                'installment'    => $ctx['html'](tefl_native_promos_geo_price($full_price / 3)),
                'includes_title' => $raw($course['includes_title']),
                'includes'       => $includes,
                'excludes'       => $excludes,
                'offer'          => $course['toggle_offer'] ? $raw($course['offer']) : null,
                'button'         => array('link' => $href($course['button']['link']), 'value' => $raw($course['button']['value'])),
                'learn_more'     => array('link' => $href($course['learn_more']['link']), 'value' => $raw($course['learn_more']['value'])),
            );
        }
    }

    $gifts      = get_field('gifts');
    $gifts_data = null;
    if (!is_array_empty($gifts)) {
        $guides = array();
        foreach ((array) $gifts['guides'] as $guide) {
            $guides[] = array('image' => $src($guide['image']), 'name' => $raw($guide['name']));
        }
        $gifts_data = array('title' => $raw($gifts['title']), 'text' => $raw($gifts['text']), 'guides' => $guides);
    }

    $reviews = null;
    $section = get_field('verified_reviews_section');
    if ($section) {
        $widget  = get_field('reviews_widget', 'option');
        $total   = isset($widget['total_reviews']) ? $widget['total_reviews'] : 1671;
        $pct     = function ($n) use ($widget) {
            return isset($widget['star_percentage_' . $n]) ? (float) $widget['star_percentage_' . $n] : 0;
        };
        $average = (($pct(5) * 5) + ($pct(4) * 4) + ($pct(3) * 3) + ($pct(2) * 2) + ($pct(1) * 1)) / 100;
        $reviews = array(
            'title'    => $raw($section['section_title']),
            'subtitle' => $raw($section['section_subtitle']),
            'average'  => tefl_native_promos_echo_number($average),
            'total'    => $raw($total),
            'stars'    => tefl_native_promos_star_percentages($widget, $ctx),
            'slider'   => tefl_native_promos_shortcode('[brb_collection id="77247"]', $ctx),
        );
    }

    $specialist = get_field('specialist_courses');
    $slides     = null;
    if (!is_array_empty($specialist)) {
        $slides = array();
        foreach ($specialist as $sc) {
            $course_id = $sc['course'] ?? '';
            $price     = '';
            if ($course_id) {
                $course_obj = wc_get_product($course_id);
                $price      = $course_obj ? tefl_native_promos_price_html($course_obj) : '';
            }
            $slides[] = array(
                'image'      => $src($sc['image'] ?? ''),
                'icon'       => $src($sc['icon'] ?? ''),
                'title'      => $raw($sc['title'] ?? ''),
                'completion' => $raw($sc['completion_time'] ?? ''),
                'link'       => $href($sc['course_link'] ?? ''),
                'price'      => $ctx['html']($price),
            );
        }
    }

    return array(
        'primary_class'  => tefl_native_promos_primary_class(),
        'hero'           => is_array_empty($hero) ? null : array('background' => $src($hero['background']), 'promo' => $src($hero['promo'])),
        'timer'          => tefl_native_promos_timer(),
        'top'            => is_array_empty($top) ? null : array('title' => $raw($top['title']), 'save_graphic' => $src($top['save_graphic'])),
        'courses_title'  => $raw(get_field('courses_title')),
        'courses'        => $cards,
        'gifts'          => $gifts_data,
        'bundle'         => tefl_native_promos_bundle($ctx),
        'reviews'        => $reviews,
        'specialist'     => $slides,
        'tools'          => tefl_native_promos_tools($ctx),
        'accreditations' => tefl_native_promos_accreditations($ctx),
        'faq'            => tefl_native_promos_faq($ctx),
        'panel'          => tefl_native_promos_panel($ctx),
        'klarna'         => tefl_native_promos_klarna($full_price, $ctx),
        'origin'         => tefl_headless_wp_origin(),
    );
}
