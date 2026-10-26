<?php
/**
 * Native template: Search Courses Template (search-courses-template.php,
 * /search-courses/ — the course recommender).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/search-courses
 *     &path=/<cc>/search-courses/?usertype=…&userpreference=…&userlevel=…&userqual=…&id=58545
 *
 * The four answers arrive in `path`'s query string (the render passes them
 * through, see RENDER_QUERY_PARAMS); the recommendation is the theme's own
 * tefl_selected_course(). CF7 forms and the timer are the shortcodes' output.
 * Rendered by components/overviews/SearchCourses.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('search-courses', 'tefl_native_search_courses_template');

function tefl_native_search_courses_template($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'search-courses-template.php') {
        return null;
    }
    $h    = fn($s) => tefl_native_overviews_html($s, $ctx);
    $src  = 'tefl_native_overviews_src';
    $href = fn($u) => tefl_native_overviews_href($u, $ctx);
    $sc   = fn($code) => tefl_native_overviews_shortcode($code, $ctx);
    $q    = fn($k) => (isset($ctx['query'][$k]) && is_scalar($ctx['query'][$k])) ? (string) $ctx['query'][$k] : '';

    $about       = get_field('search_page_about_text', 'options');
    $title       = get_field('course_search_title', 'options');
    $clock_text  = get_field('clock_text', 'options');
    $video       = get_field('video', 'options');

    $user_type          = $q('usertype');
    $user_preference    = $q('userpreference');
    $user_level         = $q('userlevel');
    $user_qualification = $q('userqual');
    $selected = '';
    if ($user_type && $user_preference && $user_level && $user_qualification && function_exists('tefl_selected_course')) {
        $selected = tefl_selected_course($user_type, $user_preference, $user_level, $user_qualification);
    }
    $ids  = $selected ? (array) ($selected['id_arr'] ?? array()) : array();
    $text = $selected ? ($selected['text'] ?? '') : '';

    $courses = array();
    foreach ($ids as $cid) {
        $hero     = get_field('hero_banner', $cid);
        $includes = get_field('course_benefits', $cid);
        $guide    = get_field('guide', $cid);
        $courses[] = array(
            'has_image' => (bool) get_the_post_thumbnail_url($cid),
            'bg'        => $src($hero['banner_image'] ?? ''),
            'title'     => $h(get_the_title($cid)),
            'link'      => $href(get_post_permalink($cid)),
            'price'     => function_exists('tefl_get_course_price_html') ? $h(tefl_native_overviews_wcpbc_page(tefl_get_course_price_html($cid))) : '',
            'includes'  => empty($includes) ? null : array_values(array_filter(array_map(fn($i) => $i['benefit'] ?? '', (array) $includes))),
            'guide'     => empty($guide['image']) ? null : array(
                'value' => $h($guide['value'] ?? ''),
                'image' => $src($guide['image']),
                'link'  => $href($guide['link'] ?? ''),
            ),
            'buy'       => function_exists('tefl_buy_now_link') ? $h(tefl_buy_now_link($cid)) : '',
        );
    }
    foreach ($courses as &$c) {
        if ($c['includes'] !== null) {
            $c['includes'] = array_map($h, $c['includes']);
        }
    }
    unset($c);

    $brochure = get_field('brochure_details', 'options');

    return tefl_native_overviews_base($pid) + array(
        'about'          => empty($about) ? '' : $h($about),
        'title'          => $title ? $h($title) : '',
        'text'           => $text ? $h($text) : '',
        'clock_text'     => $h($clock_text),
        'timer'          => $sc('[tefl_timer_shortcode]'),
        'courses'        => $ids ? $courses : null,
        'form_advice'    => $sc("[contact-form-7 id='79744' title='Search Courses Advice']"),
        'form_newsletter' => $sc("[contact-form-7 id='72610' title='Newsletter popup']"),
        'video'          => array(
            'youtube'   => $href($video['youtube'] ?? ''),
            'thumbnail' => $src($video['thumbnail'] ?? ''),
        ),
        'faqs'           => tefl_native_overviews_faqs(get_field('faq', 'option'), $ctx),
        'brochure'       => $brochure ? array(
            'heading'     => empty($brochure['heading']) ? '' : $h($brochure['heading']),
            'sub_heading' => empty($brochure['sub_heading']) ? '' : $h($brochure['sub_heading']),
            'content'     => empty($brochure['content']) ? '' : $h($brochure['content']),
            'image'       => empty($brochure['brochure_image']) ? '' : $src($brochure['brochure_image']),
            'link'        => empty($brochure['brochure_link']) ? '' : $href($brochure['brochure_link']),
        ) : null,
        'call_text'      => ($t = get_field('request_a_call_text', 'options')) ? $h($t) : '',
        'form_image'     => ($i = get_field('form_header_image', 'options')) ? $src($i) : '',
        'form_learn'     => $sc('[contact-form-7 id="57896" title="Want to Learn More?"]'),
    );
}
