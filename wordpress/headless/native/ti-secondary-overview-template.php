<?php
/**
 * Native template: Secondary Overview Landing (ti-secondary-overview-template.php,
 * /specialist-tefl-courses/).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/secondary-overview&path=/<cc>/specialist-tefl-courses/&id=80719
 *
 * Mirrors the template's flow, including the price it carries over from the
 * previous card when a card has no product. Rendered by
 * components/overviews/SecondaryOverview.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('secondary-overview', 'tefl_native_ti_secondary_overview_template');

function tefl_native_ti_secondary_overview_template($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'ti-secondary-overview-template.php') {
        return null;
    }
    $h    = fn($s) => tefl_native_overviews_html($s, $ctx);
    $src  = 'tefl_native_overviews_src';
    $href = fn($u) => tefl_native_overviews_href($u, $ctx);

    $data = tefl_native_overviews_base($pid);

    $hero = get_field('hero_banner');
    $data['hero'] = empty($hero) ? null : array(
        'bg'          => $src($hero['banner_background'] ?? ''),
        'title'       => $h($hero['banner_content']['banner_title'] ?? ''),
        'sub_title'   => $h($hero['banner_content']['sub_title'] ?? ''),
        'sub_content' => $h($hero['banner_content']['sub_content'] ?? ''),
    );

    $data['features'] = array_map(fn($e) => array('title' => $h($e['title'] ?? ''), 'subtitle' => $h($e['subtitle'] ?? '')), (array) get_field('features'));

    $ex = get_field('explanation');
    $data['explanation'] = array(
        'image'    => $src($ex['image'] ?? ''),
        'title'    => $h($ex['title'] ?? ''),
        'subtitle' => $h($ex['subtitle'] ?? ''),
        'content'  => $h($ex['content'] ?? ''),
    );

    // 30 hour courses: the timer, the features column and the course cards.
    $features30 = get_field('30_hours_courses_features');
    $courses30  = get_field('30_hour_tefl_courses');
    $data['timer']      = tefl_native_overviews_shortcode('[tefl_timer_shortcode timer="sale"]', $ctx);
    $data['features30'] = $features30 ? array_map(fn($e) => $h($e['feature'] ?? ''), (array) $features30) : array();
    $data['courses30']  = array();
    $hour_tefl_course_price = '';
    if ($courses30) {
        foreach ((array) $courses30 as $index => $c) {
            $course_product_id = $c['product'] ?? '';
            if ($course_product_id) {
                $product = wc_get_product($course_product_id);
                if ($product) {
                    $hour_tefl_course_price = tefl_native_overviews_price($product, $ctx);
                }
            }
            $f = $c['features'] ?? null;
            $data['courses30'][] = array(
                'icon'       => $src($c['icon'] ?? ''),
                'title'      => $h($c['title'] ?? ''),
                'price'      => $hour_tefl_course_price,
                'duration'   => $h($c['duration'] ?? ''),
                'features'   => $f ? array(
                    $h($f['personal_tutor_support'] ?? ''),
                    $h($f['internationally_recognized_cert'] ?? ''),
                    $h($f['100%_online_learning'] ?? ''),
                    $h($f['247_study_access_&_app'] ?? ''),
                    $h($f['tefl_job_service'] ?? ''),
                ) : null,
                'buy'        => $href('/cart/?add-to-cart=' . $course_product_id),
                'link'       => $href($c['link'] ?? ''),
                'study_time' => $h($c['study_time'] ?? ''),
            );
        }
        // A second timer copy (hidden) after the third card.
        if (count($data['courses30']) > 2) {
            $data['timer2'] = tefl_native_overviews_shortcode('[tefl_timer_shortcode timer="sale"]', $ctx);
        }
    }

    // Course CTA rows.
    $cta_section = get_field('courses_cta_section');
    $data['ctas'] = null;
    if (!tefl_native_overviews_is_empty($cta_section)) {
        $data['ctas'] = array();
        $cta_course_price = '';
        foreach ((array) ($cta_section['courses_cta'] ?? array()) as $key => $ccta) {
            $cta_course = $ccta['cta_course'] ?? '';
            if ($cta_course) {
                $p = wc_get_product($cta_course);
                $cta_course_price = $p ? tefl_native_overviews_price($p, $ctx) : '';
            }
            $data['ctas'][] = array(
                'course'    => is_scalar($cta_course) ? tefl_native_txt((string) $cta_course) : '',
                'image'     => $src($ccta['cta_image'] ?? ''),
                'icon'      => $src($ccta['cta_icon'] ?? ''),
                'title'     => $h($ccta['cta_course_title'] ?? ''),
                'price'     => $cta_course_price,
                'summary'   => $h($ccta['cta_course_summary'] ?? ''),
                'title_icon' => empty($ccta['cta_course_icon']) ? '' : $src($ccta['cta_course_icon']),
                'btn_text'  => $h($ccta['cta_button_text'] ?? ''),
                'btn_link'  => $href($ccta['cta_button_link'] ?? ''),
            );
        }
    }

    $data['videos'] = array_map(fn($v) => array(
        'image' => $src($v['image'] ?? ''),
        'name'  => $h($v['name'] ?? ''),
        'link'  => $href($v['video_link'] ?? ''),
    ), (array) get_field('videos'));

    $q = get_field('quote_section');
    $data['quote'] = array(
        'image'           => empty($q) ? '' : $src($q['quote_image'] ?? ''),
        'title'           => empty($q) ? '' : $h($q['quote_title'] ?? ''),
        'sub_content'     => empty($q) ? '' : $h($q['sub_content'] ?? ''),
        'footer_title'    => empty($q) ? '' : $h($q['content_footer_title'] ?? ''),
        'footer_subtitle' => empty($q) ? '' : $h($q['content_footer_subtitle'] ?? ''),
    );

    // Post sections (the odd rows print a bogus `</php …>` tag instead of the summary: empty).
    $data['posts'] = array();
    foreach ((array) get_field('post_sections') as $ps) {
        $c = $ps['content'] ?? array();
        $data['posts'][] = array(
            'image'    => $src($ps['post_image'] ?? ''),
            'title'    => $h($c['content_title'] ?? ''),
            'subtitle' => $h($c['content_subtitle'] ?? ''),
            'summary'  => $h($c['content_summary'] ?? ''),
            // The template prints the link with a trailing space inside href.
            'btn'      => $href(($c['cta_btn'] ?? '') . ' '),
        );
    }

    $data['faqs'] = tefl_native_overviews_faqs(get_field('frequently_asked_questions', 77005), $ctx);

    return $data;
}
