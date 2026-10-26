<?php
/**
 * Native template: "Black Friday Landing Page 2023" (black-friday-landing-page-2023.php) — accredited-tefl-course-sale.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/black-friday-landing-page-2023&path=/<cc>/accredited-tefl-course-sale/&id=82061
 *
 * Mirrors the template: hero (option-page gifts or summary, offer bubbles),
 * intro + accordion, why-us, course cards and packages, free gifts (with the
 * geo-targeted GIF the template picks from the visitor's country), internship
 * cards (the discount carries over from the previous card when a product has
 * no sale, as in the template), verified reviews, specialist courses, trial
 * cards and partners. Markup: components/promos/BlackFriday2023.tsx.
 *
 * Not to be confused with black-friday-landing-page-2026.php (not ported here).
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('black-friday-landing-page-2023', 'tefl_native_black_friday_landing_page_2023');

function tefl_native_black_friday_landing_page_2023($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'black-friday-landing-page-2023.php') {
        return null;
    }
    $raw  = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };
    $src  = 'tefl_native_promos_src';
    $href = 'tefl_native_promos_href';
    $num  = 'tefl_native_promos_echo_number';

    // Hero.
    $banner  = get_field('banner');
    $content = $banner['banner_content'];
    $bubbles = null;
    if ($content['show_offer_bubbles']) {
        $ob      = $content['offer_bubbles'];
        $bubbles = array(
            'one'   => $raw($ob['offer_bubble_1']),
            'two'   => $raw($ob['offer_bubble_2']),
            'color' => tefl_native_txt((string) $ob['bubble_color']),
        );
    }
    $gifts_option = get_field('course_gifts_section', 'option');
    $gift_titles  = array();
    foreach ((array) $gifts_option['gifts'] as $gift) {
        $gift_titles[] = $raw($gift['gift_title']);
    }
    $hero = array(
        'background' => $src($banner['background_image']),
        'title'      => $raw($content['title']),
        'gifts'      => $gifts_option['show_gifts_section'] ? array('title' => $raw($gifts_option['section_title']), 'items' => $gift_titles) : null,
        'summary'    => $raw($content['summary']),
        'bubbles'    => $bubbles,
    );

    // Intro.
    $intro     = get_field('tefl_institute_intro');
    $accordion = array();
    foreach ((array) $intro['tefl_institute_intro_accordion'] as $a) {
        $accordion[] = array('title' => $raw($a['accordion_title']), 'content' => $raw($a['accordion_content']));
    }

    // Why us.
    $why = array();
    foreach ((array) get_field('why_us') as $list) {
        $why[] = array(
            'icon'     => $src($list['icon']),
            'title'    => $raw($list['column_title']),
            'subtitle' => $raw($list['column_subtitle']),
        );
    }

    // Courses (the discount variable carries into the internship loop below).
    $tefl_courses   = get_field('tefl_courses');
    $courses        = array();
    $off_percentage = null;
    foreach ((array) $tefl_courses['courses'] as $course) {
        $product        = wc_get_product(get_field('course_product', $course['course']));
        $regular        = $product->get_regular_price();
        $sale           = $product->get_sale_price();
        $off_percentage = round((($regular - $sale) / $regular) * 100);
        $courses[]      = array(
            'background' => $src($course['background_image']),
            'off'        => (!empty($off_percentage) && !is_nan($off_percentage)) ? $num($off_percentage) : null,
            'sticker'    => $src($course['course_hour_sticker']),
            'icon'       => $src($course['course_icon']),
            'plan'       => $raw($course['course_payment_plan']),
            'message'    => $raw($course['payment_plan_description']),
            'title'      => $raw($course['course_title']),
            'price'      => $ctx['html'](tefl_native_promos_price_html($product)),
            'completion' => $raw($course['course_completion_time']),
            'guide_link' => $href($course['guide_link']),
        );
    }
    $packages = array();
    foreach ((array) $tefl_courses['course_package_content'] as $pkg) {
        $inc = array();
        foreach ((array) $pkg['features_include'] as $f) {
            $inc[] = $raw($f['feature']);
        }
        $exc = array();
        foreach ((array) $pkg['feature_exclude'] as $f) {
            $exc[] = $raw($f['exclude']);
        }
        $packages[] = array(
            'title'      => $raw($pkg['course_package_title']),
            'includes'   => $inc,
            'excludes'   => $exc,
            'learn_more' => $href($pkg['cta_button_links']['learn_more_button_link']),
            'enrol_now'  => $href($pkg['cta_button_links']['enrol_now_button_link']),
        );
    }

    // Free gifts (option page) + the geo-targeted GIF.
    $gifts = null;
    if ($gifts_option['show_gifts_section']) {
        $badges = array();
        foreach ((array) $gifts_option['gifts'] as $badge) {
            $badges[] = array('icon' => $src($badge['gift_image']), 'title' => $raw($badge['gift_title']));
        }
        $country = get_user_geo_country_code();
        $gifts   = array(
            'title'   => $raw($gifts_option['section_title']),
            'country' => tefl_native_txt((string) $country),
            'gif'     => $src(get_geo_banner_gifs($country, $pid)),
            'badges'  => $badges,
        );
    }

    // Internships.
    $tefl_internships = get_field('tefl_internships');
    $internships      = array();
    foreach ((array) $tefl_internships['courses'] as $course) {
        $product = wc_get_product(get_field('internship_product', $course['course']));
        $regular = $product->get_regular_price();
        $sale    = $product->get_sale_price();
        if ($product->is_type('variable')) {
            $regular = $product->get_variation_regular_price();
            $sale    = $product->get_variation_sale_price();
        }
        if (!empty($sale) && !empty($regular)) {
            $off_percentage = round((($regular - $sale) / $regular) * 100);
        }
        $internships[] = array(
            'test'       => $ctx['txt']($sale . '--' . $regular),
            'background' => $src($course['background_image']),
            'off'        => (!empty($off_percentage) && !is_nan($off_percentage)) ? $num($off_percentage) : null,
            'country'    => $raw($course['internship_country_name']),
            'icon'       => $src($course['course_icon']),
            'plan'       => $raw($course['course_payment_plan']),
            'plan_desc'  => $raw($course['payment_plan_description']),
            'title'      => $raw($course['course_title']),
            'price'      => $ctx['html'](tefl_native_promos_price_html($product)),
            'completion' => $raw($course['internship_completion_time']),
            'link'       => $href($course['cta_button_link']),
        );
    }

    // Reviews (the page's own widget numbers).
    $reviews = null;
    $section = get_field('verified_reviews_section');
    if ($section) {
        $widget  = $section['reviews_widget'];
        $pct     = function ($n) use ($widget) {
            return isset($widget['star_percentage_' . $n]) ? (float) $widget['star_percentage_' . $n] : 0;
        };
        $average = (($pct(5) * 5) + ($pct(4) * 4) + ($pct(3) * 3) + ($pct(2) * 2) + ($pct(1) * 1)) / 100;
        $reviews = array(
            'title'    => $raw($section['section_title']),
            'subtitle' => $raw($section['section_subtitle']),
            'average'  => $num($average),
            'total'    => $raw(isset($widget['total_reviews']) ? $widget['total_reviews'] : 1570),
            'stars'    => tefl_native_promos_star_percentages($widget, $ctx),
            'slider'   => tefl_native_promos_shortcode('[brb_collection id="77247"]', $ctx),
        );
    }

    // Specialist courses.
    $specialist = get_field('specialist_courses');
    $cards      = array();
    foreach ((array) $specialist['course_card'] as $card) {
        $product = wc_get_product(get_field('course_product', $card['course']));
        $regular = $product->get_regular_price();
        $sale    = $product->get_sale_price();
        $off     = round((($regular - $sale) / $regular) * 100);
        $cards[] = array(
            'off'        => (!empty($off) && !is_nan($off)) ? $num($off) : null,
            'background' => $src($card['background_image']),
            'sticker'    => $src($card['card_top_sticker']),
            'price'      => $ctx['html'](tefl_native_promos_price_html($product)),
            'title'      => $raw($card['course_title']),
            'completion' => $raw($card['course_completion_time']),
            'link'       => $href($card['card_cta_link']),
        );
    }

    // Trial cards.
    $trial = array();
    foreach ((array) get_field('level_test_and_salary_calculation_section') as $card) {
        $trial[] = array(
            'background'  => tefl_native_promos_src($card['background_image']),
            'icon'        => $src($card['card_icon']),
            'title'       => $raw($card['card_title']),
            'description' => $raw($card['card_description']),
            'text'        => $raw($card['cta_buttons']['cta_text']),
            'link'        => $href($card['cta_buttons']['cta_link']),
        );
    }

    // Partners & accreditations.
    $partners = get_field('partners_accreditations_section');
    $logos    = array();
    foreach ((array) $partners['logo_container'] as $l) {
        $logos[] = $src($l['logo']);
    }
    $points = array();
    foreach ((array) $partners['lists'] as $l) {
        $points[] = $raw($l['accreditation_item']);
    }

    return array(
        'primary_class' => tefl_native_promos_primary_class(),
        'hero'          => $hero,
        'intro'         => array(
            'title'       => $raw($intro['content_title']),
            'subtitle'    => $raw($intro['content_subtitle']),
            'description' => $raw($intro['content_description']),
            'accordion'   => $accordion,
        ),
        'why'           => $why,
        'courses'       => array('title' => $raw($tefl_courses['section_title']), 'cards' => $courses, 'packages' => $packages),
        'gifts'         => $gifts,
        'internships'   => array(
            'title' => $raw($tefl_internships['section_title']),
            'cards' => $internships,
            'cta'   => $href($tefl_internships['cta_button_link']),
        ),
        'reviews'       => $reviews,
        'specialist'    => array(
            'title' => $raw($specialist['section_title']),
            'cards' => $cards,
            'cta'   => $href($specialist['specialist_cta_link']),
        ),
        'trial'         => $trial,
        'partners'      => array('title' => $raw($partners['section_title']), 'logos' => $logos, 'points' => $points),
        'origin'        => tefl_headless_wp_origin(),
    );
}
