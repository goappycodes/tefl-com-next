<?php
/**
 * Native template: "Black Friday Sale Prz" (black-friday-sale-prz.php) — the
 * Black Friday / January sale page (black-friday-sale-2, january-sale).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/black-friday-sale-prz&path=/<cc>/january-sale/&id=91037
 *
 * Mirrors the template top to bottom: hero + [tefl_timer_shortcode
 * timer="black-friday-sales"], the course cards (WooCommerce price HTML,
 * discount %, Klarna instalment, Trustpilot tag), bundle, gifts, power pack,
 * reviews (widget percentages + [brb_collection id="77247"]), tools,
 * accreditations, FAQ, panel and the Klarna modal (which, as in the template,
 * uses the LAST course's price). Markup: components/promos/BlackFridaySalePrz.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('black-friday-sale-prz', 'tefl_native_black_friday_sale_prz');

function tefl_native_black_friday_sale_prz($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'black-friday-sale-prz.php') {
        return null;
    }
    $raw = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };
    $src = 'tefl_native_promos_src';
    $href = 'tefl_native_promos_href';

    $hero = get_field('hero');
    $top  = get_field('top');

    // Courses.
    $courses    = get_field('courses');
    $cards      = array();
    $tp_loaded  = false;
    $full_price = null;
    foreach ((array) $courses as $course) {
        $title       = $course['title'];
        $product     = $course['product'];
        $product_id  = $product->ID;
        $product_obj = wc_get_product($product_id);
        $regular     = $product_obj->get_regular_price();
        $sale        = $product_obj->get_sale_price();
        $full_price  = $product_obj->get_price();
        $discount    = ($regular && $sale) ? round((($regular - $sale) / $regular) * 100) : 0;
        $button      = $course['button'];
        $learn_more  = $course['learn_more'];

        $tp = null;
        if (stripos($title, '120') !== false) {
            $tp = array('tag' => '120', 'token' => '05cba9f3-167d-4342-b7ae-1a730b015165');
        } elseif (stripos($title, '180') !== false) {
            $tp = array('tag' => '180', 'token' => '081da83e-d5b4-4245-96d5-28deb09a200b');
        } elseif (stripos($title, '300') !== false) {
            $tp = array('tag' => '300', 'token' => '78a648a4-18ce-47d2-83b3-89c57e2fcbe0');
        }
        if ($tp) {
            $tp['bootstrap'] = !$tp_loaded;
            $tp_loaded       = true;
        }

        $includes = array();
        foreach ((array) $course['includes'] as $include) {
            $includes[] = $raw($include['text']);
        }

        $cards[] = array(
            'link'        => $href($learn_more['link']),
            'thumbnail'   => $src($course['thumbnail']),
            'discount'    => (string) $discount,
            'icon'        => $src($course['icon']),
            'title'       => $raw($title),
            'price'       => $ctx['html'](tefl_native_promos_price_html($product_obj)),
            'completion'  => $raw($course['completion_time']),
            'installment' => $ctx['html'](tefl_native_promos_geo_price($full_price / 3)),
            'includes_title' => $raw($course['includes_title']),
            'includes'    => $includes,
            'offer'       => $course['toggle_offer'] ? $raw($course['offer']) : null,
            'button'      => array('link' => $href($button['link']), 'value' => $raw($button['value'])),
            'enrol'       => array(
                'link'  => $product_id === 430 ? $href('/cart/?addtimetocart&prid=' . $product_id) : $href($learn_more['link']),
                'value' => $raw($learn_more['value']),
            ),
            'trustpilot'  => $tp,
        );
    }

    return array(
        'primary_class' => tefl_native_promos_primary_class(),
        'hero'          => array('background' => $src($hero['background']), 'promo' => $src($hero['promo'])),
        'timer'         => tefl_native_promos_timer('black-friday-sales'),
        'top_title'     => $raw($top['title']),
        'courses_title' => $raw(get_field('courses_title')),
        'courses'       => $cards,
        'bundle'        => tefl_native_promos_bundle($ctx),
        'gifts'         => tefl_native_black_friday_sale_prz_gifts($ctx),
        'reviews'       => tefl_native_black_friday_sale_prz_reviews($ctx),
        'tools'         => tefl_native_promos_tools($ctx),
        'accreditations' => tefl_native_promos_accreditations($ctx),
        'faq'           => tefl_native_promos_faq($ctx),
        'panel'         => tefl_native_promos_panel($ctx),
        'klarna'        => tefl_native_promos_klarna($full_price, $ctx),
        'links'         => array(
            'gifts'      => $href('/tefl-courses-overview/'),
            'power_more' => $href('https://teflinstitute.com/tefl-specialist-course-bundle/'),
            'power_deal' => $href('https://teflinstitute.com/cart/?addtimetocart&prid=91273'),
        ),
        'origin'        => tefl_headless_wp_origin(),
    );
}

function tefl_native_black_friday_sale_prz_gifts($ctx) {
    $gifts  = get_field('gifts');
    $guides = array();
    foreach ((array) $gifts['guides'] as $guide) {
        $guides[] = tefl_native_promos_src($guide['image']);
    }
    return array(
        'title'  => tefl_native_promos_raw($gifts['title'], $ctx),
        'text'   => tefl_native_promos_raw($gifts['text'], $ctx),
        'guides' => $guides,
    );
}

/** The verified-reviews block (only when the page's verified_reviews_section is set). */
function tefl_native_black_friday_sale_prz_reviews($ctx) {
    $section = get_field('verified_reviews_section');
    if (!$section) {
        return null;
    }
    $raw    = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };
    $videos = $section['video_testimonials_section'];
    $cards  = array();
    foreach ((array) $videos['video_testimonials'] as $t) {
        $cards[] = array(
            'thumbnail' => tefl_native_promos_src($t['thumbnail_image']),
            'play'      => tefl_native_promos_src($t['play_button_image']),
            'name'      => $raw($t['name']),
            'subtitle'  => $raw($t['subtitle']),
            'link'      => tefl_native_promos_href($t['video_link']),
        );
    }
    $logos = array();
    foreach ((array) $videos['review_logos'] as $l) {
        $logos[] = array(
            'image' => tefl_native_promos_src($l['review_logo_image']),
            'link'  => tefl_native_promos_href($l['review_logo_link']),
        );
    }
    return array(
        'title'    => $raw($section['section_title']),
        'subtitle' => $raw($section['section_subtitle']),
        'stars'    => tefl_native_promos_star_percentages(get_field('reviews_widget', 'option'), $ctx),
        'slider'   => tefl_native_promos_shortcode('[brb_collection id="77247"]', $ctx),
        'videos'   => $cards,
        'logos'    => $logos,
    );
}
