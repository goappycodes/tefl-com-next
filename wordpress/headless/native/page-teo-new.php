<?php
/**
 * Native template: "Teach English Online New" (page-teo-new.php) — /teach-english-online/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-teo-new&path=/<cc>/teach-english-online/&id=68184
 *
 * Every value the template echoes, resolved in its own order and with its own
 * quirks kept: the sale-course loop reads an undefined course id and keeps
 * $time_diff / $course_price across iterations (so with no running offer the
 * countdown block shows instead of "Enrol Now", and a resource course without
 * a product reuses the previous price); the old TI-jobs section is dead
 * ($ti_jobs is never set). The template's ti_online_tefl_job_feed() call has
 * no visible output and isn't made here. job-cards.php rows come through as
 * data. React: components/pages/teo-new/TeoNewPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('page-teo-new', 'tefl_native_page_teo_new');

function tefl_native_page_teo_new($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'page-teo-new.php' || !function_exists('wc_get_product')) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $s    = 'tefl_native_pages_str';
    $rows = 'tefl_native_pages_rows';
    $h    = $v['h'];
    $u    = $v['u'];

    $hero  = $rows(get_field('hero'));
    $home  = $rows(get_field('home_abroad'));
    $main  = $rows(get_field('main'));
    $top   = $rows($main['top'] ?? null);
    $req   = $rows(get_field('requirement'));
    $teach = $rows(get_field('teach_english'));
    $start = $rows(get_field('start_teaching'));
    $calc  = $rows(get_field('calculate_salary'));
    $jobs  = $rows(get_field('online_degree'));
    $demo  = $rows(get_field('certificate_review'));
    $web   = $rows(get_field('watch_online'));
    $wl    = $rows($web['left_side'] ?? null);
    $wr    = $rows($web['right_side'] ?? null);
    $guide = $rows(get_field('start_guide'));
    $tips  = $rows(get_field('teaching_tips'));
    $rec   = $rows(get_field('recommended_blogs'));
    $fotj  = $rows(get_field('finding_online_teaching_job'));
    $otr   = $rows(get_field('online_teaching_resources'));
    $excluded = get_field('excluded_courses', 'options');
    $excluded = $excluded ? $excluded : array();

    $content = array();
    foreach ($rows(get_field('content')) as $c) {
        $content[] = array('image' => $s($c['image'] ?? ''), 'title' => $h($c['title'] ?? ''), 'description' => $h($c['description'] ?? ''));
    }
    $steps = array();
    foreach ($rows($start['create_steps'] ?? null) as $st) {
        $steps[] = array('icon' => $s($st['icon'] ?? ''), 'header' => $h($st['header'] ?? ''), 'title' => $h($st['title'] ?? ''), 'description' => $h($st['description'] ?? ''));
    }

    // Sale courses — the template's loop, variables carried across iterations as in PHP.
    $sale         = array();
    $course_price = '';
    $time_diff    = null;
    $current_course_id = null; // never set by the template
    foreach ($rows(get_field('sale_courses')) as $sc) {
        $course       = $sc['course'] ?? null;
        $course_link  = get_post_permalink($course);
        $product_id   = get_field('course_product', $course);
        $course_price = '';
        $cart_link    = '';
        if ($product_id) {
            $p = wc_get_product($product_id);
            if ($p) {
                $course_price = tefl_native_pages_price_html($p);
            }
            $cart_link = site_url() . '/cart/?add-to-cart=' . $product_id;
        }
        $timer_expiry = '';
        if (!in_array($current_course_id, $excluded)) {
            $timer_expiry = get_field('timer_expiry', 'options');
        }
        if ($timer_expiry) {
            $time_diff = strtotime($timer_expiry) - current_time('timestamp');
        }
        $is_expired = $time_diff < 0;

        $freebies = array();
        foreach ($rows($sc['freebie_courses'] ?? null) as $fc) {
            $fprice = '';
            if (!empty($fc['product'])) {
                $fp = wc_get_product($fc['product']);
                if ($fp) {
                    $fprice = tefl_native_pages_price_html($fp);
                }
            }
            $freebies[] = array('icon' => $s($fc['icon'] ?? ''), 'title' => $h($fc['title'] ?? ''), 'price' => $h($fprice));
        }
        $others = array();
        foreach ($rows($sc['other_freebie'] ?? null) as $of) {
            $others[] = array('icon' => $s($of['icon'] ?? ''), 'title' => $h($of['title'] ?? ''));
        }
        $sale[] = array(
            'image'      => $s($sc['course_image'] ?? ''),
            'logo'       => $s($sc['course_logo'] ?? ''),
            'title'      => $h($sc['course_title'] ?? ''),
            'price'      => $h($course_price),
            'cart'       => $cart_link ? $u($cart_link) : '',
            'expired'    => (bool) $is_expired,
            'expiry'     => $s($timer_expiry),
            'includes'   => array_map(function ($i) use ($h) {
                return $h($i['content'] ?? '');
            }, array_values($rows($sc['includes'] ?? null))),
            'excludes'   => array_map(function ($i) use ($h) {
                return $h($i['content'] ?? '');
            }, array_values($rows($sc['excludes'] ?? null))),
            'freebies'   => $freebies,
            'others'     => $others,
            'has_free'   => !empty($sc['freebie_courses']) || !empty($sc['other_freebie']) || $course_link,
        );
    }

    $job_rows = function ($group) use ($rows, $h, $u, $s) {
        $g    = $rows($group);
        $list = array();
        foreach ($rows($g['jobs'] ?? null) as $j) {
            $list[] = array(
                'type'         => $h($j['job_type'] ?? ''),
                'logo'         => $s($j['job_company_logo'] ?? ''),
                'link'         => $u($j['job_link'] ?? ''),
                'requirements' => $h($j['job_requirements'] ?? ''),
                'pay'          => $h($j['job_salary'] ?? ''),
                'hours'        => $h($j['job_hours'] ?? ''),
            );
        }
        return array('heading' => $h($g['heading'] ?? ''), 'jobs' => $list);
    };

    $blogs = function ($list, $words) use ($ctx, $h) {
        $out = array();
        foreach ((array) $list as $a) {
            if (!$a instanceof WP_Post) {
                $a = get_post($a);
            }
            if (!$a) {
                continue;
            }
            $out[] = array(
                'date'      => $h(get_the_time('F j, Y', $a->ID)),
                'title'     => tefl_native_txt(esc_html(get_the_title($a->ID))),
                'thumbnail' => $h(get_the_post_thumbnail($a->ID)),
                'excerpt'   => $h(wp_trim_words(get_the_excerpt($a->ID), $words, '.')),
                'link'      => $ctx['href'](tefl_native_txt(esc_html(get_permalink($a->ID)))),
            );
        }
        return $out;
    };

    $tips_list = array();
    foreach ($rows($tips['content'] ?? null) as $t) {
        $tips_list[] = array('image' => $s($t['image'] ?? ''), 'title' => $h($t['title'] ?? ''), 'description' => $h($t['description'] ?? ''));
    }

    $resources = array();
    foreach ($rows($otr['courses'] ?? null) as $c) {
        $cid = $c['course_product'] ?? 0;
        $cp  = wc_get_product($cid);
        if ($cp) {
            $course_price = tefl_native_pages_price_html($cp);
        }
        $resources[] = array(
            'title' => tefl_native_txt(esc_html(get_the_title($cid))),
            'image' => $s($c['course_image'] ?? ''),
            'price' => $h($course_price),
            'link'  => $ctx['href'](tefl_native_txt(esc_html(get_permalink($cid)))),
        );
    }

    return array(
        'hero'       => array('image' => $s($hero['image'] ?? ''), 'title' => $h($hero['title'] ?? ''), 'subtitle' => $h($hero['subtitle'] ?? ''), 'button_text' => $h($hero['button_text'] ?? ''), 'button_link' => $u($hero['button_link'] ?? '')),
        'home'       => array('head_title' => $h($home['head_title'] ?? ''), 'title' => $h($home['title'] ?? ''), 'content' => $h($home['content'] ?? '')),
        'top'        => array('image' => $s($top['image'] ?? ''), 'youtube' => $u($top['youtube'] ?? ''), 'description' => $h($top['description'] ?? '')),
        'req'        => array('title' => $h($req['title'] ?? ''), 'content' => $h($req['content'] ?? '')),
        'teach'      => array('heading' => $h($teach['heading'] ?? ''), 'content' => $content),
        'start'      => array('heading' => $h($start['heading'] ?? ''), 'steps' => $steps),
        'calc'       => array('image' => $s($calc['image'] ?? ''), 'heading' => $h($calc['heading'] ?? ''), 'description' => $h($calc['description'] ?? ''), 'button_text' => $h($calc['button_text'] ?? ''), 'button_link' => $u($calc['button_link'] ?? '')),
        'sale'       => $sale,
        'jobs'       => array(
            'header'   => $h($jobs['header'] ?? ''),
            'sections' => array($job_rows($jobs['company_without_degree'] ?? null), $job_rows($jobs['company_with_degree'] ?? null), $job_rows($jobs['company_hire_english'] ?? null)),
        ),
        'demo'       => array('heading' => $h($demo['heading'] ?? ''), 'button_text' => $h($demo['button_text'] ?? ''), 'button_link' => $u($demo['button_link'] ?? ''), 'form' => $h(do_shortcode('[contact-form-7 id="68710" title="Demo Video"]'))),
        'webinars'   => array(
            'header' => $h($web['header'] ?? ''),
            'left'   => array('title' => $h($wl['title'] ?? ''), 'image' => $s($wl['thumbnail'] ?? ''), 'youtube' => $u($wl['youtube'] ?? '')),
            'right'  => array('title' => $h($wr['title'] ?? ''), 'image' => $s($wr['thumbnail'] ?? ''), 'youtube' => $u($wr['youtube'] ?? '')),
        ),
        'guide'      => array('title' => $h($guide['header'] ?? ''), 'image' => $s($guide['image'] ?? ''), 'button_text' => $h($guide['button_text'] ?? ''), 'form' => $h(do_shortcode('[contact-form-7 id="74494" title="Teach English Online Guide"]'))),
        'tips'       => array('header' => $h($tips['header'] ?? ''), 'details' => $h($tips['details'] ?? ''), 'items' => $tips_list),
        'recommended' => array('header' => $h($rec['header'] ?? ''), 'blogs' => $blogs($rec['blogs'] ?? array(), 20)),
        'fotj'       => array('header' => $h($fotj['header'] ?? ''), 'blogs' => $blogs($fotj['blogs'] ?? array(), 25)),
        'resources'  => array('header' => $h($otr['header'] ?? ''), 'courses' => $resources),
    );
}
