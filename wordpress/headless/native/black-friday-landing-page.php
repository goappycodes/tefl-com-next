<?php
/**
 * Native template: "Black Friday Landing Page" (black-friday-landing-page.php) — online-tefl-course-sale.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/black-friday-landing-page&path=/<cc>/online-tefl-course-sale/&id=56529
 *
 * Mirrors the template: page header, timer section ([tefl_timer_shortcode
 * timer="sale"], bonus info, hero image), the toggled sale-course cards (with
 * free-course prices), Cyber Monday deal, add-ons, teaching resources (hidden),
 * guide bundle, video section and why-choose-us.
 * Markup: components/promos/BlackFridayLanding.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('black-friday-landing-page', 'tefl_native_black_friday_landing_page');

function tefl_native_black_friday_landing_page($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'black-friday-landing-page.php') {
        return null;
    }
    $raw   = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };
    $src   = 'tefl_native_promos_src';
    $href  = 'tefl_native_promos_href';
    $price = function ($product_id) use ($ctx) {
        if (!$product_id) {
            return '';
        }
        $product = wc_get_product($product_id);
        return $product ? $ctx['html'](tefl_native_promos_price_html($product)) : '';
    };
    $cart = function ($product_id) use ($href) {
        return $product_id ? $href(site_url() . '/cart/?add-to-cart=' . $product_id) : '';
    };

    $timer_section = get_field('timer_section');
    $bonus         = null;
    if ($timer_section['show_bonus_info']) {
        $bonus_info = $timer_section['bonus_info'];
        if (!empty($bonus_info)) {
            $bonus = array(
                'icon'    => $src($bonus_info['icon']),
                'title'   => $raw($bonus_info['title']),
                'content' => $raw($bonus_info['content']),
            );
        }
    }
    $hero_image = $timer_section['has_hero_image'] ? $timer_section['hero_image'] : null;

    $common_heading = $raw(get_field('common_heading'));

    $courses = array();
    foreach ((array) get_field('sale_courses') as $sc) {
        if ($sc['toggle'] !== true) {
            continue;
        }
        $course_product_id = get_field('course_product', $sc['course']);
        $course_link       = get_post_permalink($sc['course']);
        $includes = array();
        foreach ((array) $sc['includes'] as $inc) {
            $includes[] = $raw($inc['content']);
        }
        $excludes = array();
        foreach ((array) $sc['excludes'] as $exc) {
            $excludes[] = $raw($exc['content']);
        }
        $freebies = array();
        foreach ((array) $sc['freebie_courses'] as $fc) {
            $freebies[] = array(
                'icon'  => $fc['icon'] ? $src($fc['icon']) : '',
                'title' => $fc['title'] ? $raw($fc['title']) : '',
                'price' => $price($fc['product']),
            );
        }
        $others = array();
        foreach ((array) $sc['other_freebie'] as $of) {
            $others[] = array(
                'icon'  => $of['icon'] ? $src($of['icon']) : '',
                'title' => $of['title'] ? $raw($of['title']) : '',
            );
        }
        $courses[] = array(
            'teachers_choice' => $course_product_id == 430,
            'image'           => $sc['course_image'] ? $src($sc['course_image']) : '',
            'logo'            => $sc['course_logo'] ? $src($sc['course_logo']) : '',
            'title'           => $sc['course_title'] ? $raw($sc['course_title']) : '',
            'price'           => $price($course_product_id),
            'cart'            => $cart($course_product_id),
            'has_inc_exc'     => $sc['includes'] || $sc['excludes'],
            'includes'        => $sc['includes'] ? $includes : array(),
            'excludes'        => $sc['excludes'] ? $excludes : array(),
            'has_freebie'     => $sc['freebie_courses'] || $sc['other_freebie'] || $course_link,
            'freebies'        => $sc['freebie_courses'] ? $freebies : array(),
            'others'          => $sc['other_freebie'] ? $others : null,
            'link'            => $course_link ? $href($course_link) : '',
        );
    }

    $cyber        = get_field('cyber_monday');
    $cyber_data   = null;
    if ($cyber['show']) {
        $jobs = array();
        foreach ((array) $cyber['jobs'] as $job) {
            $info = array();
            foreach ((array) $job['info'] as $e) {
                $info[] = array('icon' => $src($e['icon']), 'content' => $raw($e['content']));
            }
            $jobs[] = array(
                'background' => $src($job['image']),
                'title'      => $raw($job['title']),
                'info'       => $info,
                'link'       => $href($job['learn_more']),
            );
        }
        $cyber_data = array('jobs' => $jobs, 'deal' => $raw($cyber['deal']), 'code' => $raw($cyber['code']));
    }

    $addons     = null;
    $add_ons    = get_field('add_ons');
    if ($add_ons) {
        $addons = array();
        foreach ($add_ons as $aon) {
            $course_product_id = get_field('course_product', $aon['course']);
            $course_link       = get_post_permalink($aon['course']);
            $includes = array();
            foreach ((array) $aon['includes'] as $inc) {
                $includes[] = $raw($inc['content']);
            }
            $addons[] = array(
                'image'    => $aon['image'] ? $src($aon['image']) : '',
                'logo'     => $aon['icon'] ? $src($aon['icon']) : '',
                'title'    => $aon['title'] ? $raw($aon['title']) : '',
                'includes' => $aon['includes'] ? $includes : null,
                'price'    => $price($course_product_id),
                'link'     => $course_link ? $href($course_link) : '',
                'cart'     => $cart($course_product_id),
            );
        }
    }

    $resources = null;
    $tr_rows   = get_field('teaching_resources');
    if ($tr_rows) {
        $resources = array();
        foreach ($tr_rows as $tr) {
            $resources[] = array(
                'image' => $tr['image'] ? $src($tr['image']) : '',
                'price' => $price($tr['product']),
                'title' => $tr['title'] ? $raw($tr['title']) : '',
                'link'  => $tr['guide_pdf_link'] ? $href($tr['guide_pdf_link']) : '',
            );
        }
    }

    $guide        = null;
    $guide_bundle = get_field('guide_bundle');
    if ($guide_bundle) {
        $view_more = get_field('view_more_guides_link');
        $guide     = array(
            'image'     => $guide_bundle['image'] ? $src($guide_bundle['image']) : '',
            'link'      => $guide_bundle['guide_pdf_link'] ? $href($guide_bundle['guide_pdf_link']) : '',
            'title'     => $guide_bundle['title'] ? $raw($guide_bundle['title']) : '',
            'subtitle'  => $guide_bundle['subtitle'] ? $raw($guide_bundle['subtitle']) : '',
            'price'     => $price($guide_bundle['product']),
            'view_more' => $view_more ? $href($view_more) : '',
        );
    }

    $video   = null;
    $section = get_field('tefl_video_section');
    if ($section) {
        $video = array(
            array(
                'image'   => $src($section['tefl_video1']['tefl_video1_thumbnail']),
                'caption' => $raw($section['tefl_video1']['tefl_video1_caption']),
                'url'     => $href($section['tefl_video1']['tefl_video1_url']),
            ),
            array(
                'image'   => $src($section['tefl_video2']['tefl_video2_thumbnail']),
                'caption' => $raw($section['tefl_video2']['tefl_video2_caption']),
                'url'     => $href($section['tefl_video2']['tefl_video2_url']),
            ),
        );
    }

    $why     = null;
    $why_rows = get_field('why_choose_us');
    if ($why_rows) {
        $why = array();
        foreach ($why_rows as $wcu) {
            $why[] = array(
                'image'       => $wcu['image'] ? $src($wcu['image']) : '',
                'title'       => $wcu['title'] ? $raw($wcu['title']) : '',
                'description' => $wcu['description'] ? $raw($wcu['description']) : '',
            );
        }
    }

    $heading    = get_field('page_heading');
    $subheading = get_field('page_subheading');
    return array(
        'primary_class'  => tefl_native_promos_primary_class(),
        'accent'         => tefl_native_txt((string) get_field('page_accent_color')),
        'header'         => ($heading || $subheading) ? array(
            'heading'    => $heading ? $raw($heading) : '',
            'subheading' => $subheading ? $raw($subheading) : '',
        ) : null,
        'timer_section'  => array(
            'title'   => $raw($timer_section['title']),
            'content' => $raw($timer_section['content']),
            'bonus'   => $bonus,
            'hero'    => !empty($hero_image) ? $src($hero_image) : null,
            'timer'   => tefl_native_promos_timer('sale'),
        ),
        'common_heading' => $common_heading,
        'courses'        => $courses,
        'cyber'          => $cyber_data,
        'add_ons_title'  => $raw(get_field('add_ons_title')),
        'addons'         => $addons,
        'resources'      => $resources,
        'guide'          => $guide,
        'video'          => $video,
        'why'            => $why,
        'origin'         => tefl_headless_wp_origin(),
    );
}
