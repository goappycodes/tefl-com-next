<?php
/**
 * Native template: city / country course page (page template single-country-page.php
 * + template-parts/country-page/section-*.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/country_page&path=/<cc>/tefl-courses-in-paris/&id=97090
 *
 * Returns every value the section parts print; raw echoes as HTML fragments,
 * attribute echoes decoded (React re-escapes), URLs rewritten as the render does.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('country_page', 'tefl_native_country_page');

function tefl_native_country_page($pid, $ctx) {
    if (get_post_type($pid) !== 'page' || get_page_template_slug($pid) !== 'single-country-page.php') {
        return null;
    }
    $h    = function ($s) use ($ctx) {
        return tefl_native_destinations_h($ctx, $s);
    };
    $src  = 'tefl_native_destinations_src';
    $txt  = 'tefl_native_txt';
    $href = function ($s) use ($ctx) {
        return tefl_native_destinations_href($ctx, $s);
    };
    $theme = $src(get_stylesheet_directory_uri());

    // section-hero
    $heading  = get_field('heading');
    $partners = array();
    $oap      = get_field('our_accreditation_partner');
    $plist    = is_array($oap) ? ($oap['accreditation_partner'] ?? null) : null;
    foreach (is_array($plist) ? $plist : array() as $logo_url) {
        $partners[] = $src(esc_url($logo_url));
    }
    $hero = array(
        'background' => $src(get_field('background_image')),
        'heading'    => $heading ? $h($heading['heading_text'] ?? '') : '',
        'color'      => $heading ? $txt($heading['text_color'] ?? '') : '',
        'partners'   => $partners,
    );

    // section-about
    $about = null;
    $a     = get_field('about');
    if ($a) {
        $about = array(
            'heading'     => $h($a['about_heading'] ?? ''),
            'description' => $h($a['about_description'] ?? ''),
            'image'       => $src($a['about_image'] ?? ''),
        );
    }

    // section-review (not on page 102137)
    $reviews = null;
    if (!is_page(102137)) {
        $r = get_field('reviews');
        if ($r) {
            $reviews = array();
            foreach (is_array($r) ? $r : array() as $review) {
                $reviews[] = array(
                    'show'        => (bool) (($review['client_name'] ?? '') && ($review['review'] ?? '')),
                    'photo'       => $src($review['client_image'] ?? ''),
                    'name'        => $h($review['client_name'] ?? ''),
                    'name_attr'   => $txt($review['client_name'] ?? ''),
                    'designation' => $h($review['client_designation'] ?? ''),
                    'review'      => $h($review['review'] ?? ''),
                );
            }
        }
    }

    // section-details
    $why  = get_field('why_learners_choose_us');
    $inc  = get_field('what_the_course_includes');
    $color = $why ? $txt($why['text_color'] ?? '') : '';
    $details = array(
        'why'      => $why ? array(
            'title'       => $h($why['title'] ?? ''),
            'description' => $h($why['description'] ?? ''),
            'background'  => $src($why['background_image'] ?? ''),
        ) : null,
        'includes' => $inc ? array(
            'title'       => $h($inc['title'] ?? ''),
            'description' => $h($inc['description'] ?? ''),
            'background'  => $src($inc['background_image'] ?? ''),
        ) : null,
        'color'    => $color,
    );

    // section-after-course
    $next     = get_field('what_comes_next');
    $outcomes = null;
    if (have_rows('course_outcome')) {
        $outcomes = array();
        while (have_rows('course_outcome')) {
            the_row();
            $outcomes[] = $txt(esc_html(get_sub_field('outcome')));
        }
    }
    $after = array(
        'background' => $src(esc_url($next ? ($next['background_image'] ?? '') : '')),
        'title'      => $next ? $txt(esc_html($next['title'] ?? '')) : '',
        'color'      => $next ? $txt(esc_attr($next['text_color'] ?? '')) : '',
        'outcomes'   => $outcomes,
    );

    // section-explore-course
    $c      = get_field('courses');
    $button = $c ? ($c['button'] ?? null) : null;
    $course = array(
        'image'        => $c ? $src($c['course_image'] ?? '') : '',
        'name'         => $c ? $h($c['course_name'] ?? '') : '',
        'name_attr'    => $c ? $txt($c['course_name'] ?? '') : '',
        'description'  => $c ? $h($c['course_description'] ?? '') : '',
        'button_text'  => $button ? $h($button['button_text'] ?? '') : '',
        'button_link'  => $button ? $href($button['button_link'] ?? '') : '',
        'button_color' => $button ? $txt($button['button_color'] ?? '') : '',
    );

    // section-accredatation (not on page 102137)
    $accreditation = null;
    if (!is_page(102137)) {
        $ah    = get_field('accredation_heading');
        $at    = get_field('title');
        $items = array();
        $acc   = get_field('accreditations');
        foreach (is_array($acc) ? $acc : array() as $item) {
            $items[] = array(
                'title'  => $h($item['title'] ?? ''),
                'logo'   => $src($item['logo'] ?? ''),
                'status' => $h(($item['status'] ?? '') . ':'),
                'icon'   => $src($item['country_icon'] ?? ''),
            );
        }
        $accreditation = array(
            'heading'     => $ah ? $h($ah['accredation_heading_text'] ?? '') : '',
            'title'       => $at ? $h($at['title_text'] ?? '') : '',
            'items'       => $items,
            'description' => $h(get_field('accre_description')),
        );
    }

    // section-faq
    $faqs = array();
    $fq   = function_exists('get_cfvalue_by_country') ? get_cfvalue_by_country('frequently_asked_questions') : get_field('frequently_asked_questions');
    foreach (is_array($fq) ? $fq : array() as $key => $faq) {
        $faqs[] = array(
            'first'    => $key === 0,
            'key'      => (string) $key,
            'question' => $h($faq['question'] ?? ''),
            'answer'   => $h($faq['answer'] ?? ''),
        );
    }

    return array(
        'id'            => (int) $pid,
        'theme'         => $theme,
        'hero'          => $hero,
        'about'         => $about,
        'reviews'       => $reviews,
        'details'       => $details,
        'after'         => $after,
        'course'        => $course,
        'accreditation' => $accreditation,
        'faqs'          => $faqs,
    );
}
