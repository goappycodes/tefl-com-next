<?php
/**
 * Native template: Country TEFL Course Page (ti-page-country-course-template.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/country-course&path=/<cc>/tefl-course-azerbaijan/&id=94598
 *
 * Every section the template prints, resolved (ACF groups, the options-page
 * accreditation logos and instructors, the tab FAQs with their per-country
 * override). Rendered by components/overviews/CountryCourse.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('country-course', 'tefl_native_ti_page_country_course_template');

function tefl_native_ti_page_country_course_template($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'ti-page-country-course-template.php') {
        return null;
    }
    $h     = fn($s) => tefl_native_overviews_html($s, $ctx);
    $src   = 'tefl_native_overviews_src';
    $href  = fn($u) => tefl_native_overviews_href($u, $ctx);
    $empty = 'tefl_native_overviews_is_empty';

    $data = tefl_native_overviews_base($pid);

    // Hero (printed unconditionally).
    $hero = get_field('hero_banner');
    $cta  = $hero['banner_cta'] ?? array();
    $btns = $cta['banner_cta_buttons'] ?? array();
    $data['hero'] = array(
        'image'     => $src($hero['banner_image'] ?? ''),
        'title'     => $h($cta['banner_cta_title'] ?? ''),
        'text'      => $h($cta['banner_cta_text'] ?? ''),
        'btn1_text' => $h($btns['button1']['button1_text'] ?? ''),
        'btn1_link' => $href($btns['button1']['button1_link'] ?? ''),
        'btn2_text' => $h($btns['button2']['button2_text'] ?? ''),
        'btn2_link' => $href($btns['button2']['button2_link'] ?? ''),
    );

    // Accreditation: page title/summary, the options-page Ofqual block and common logos.
    $acc = get_field('accreditation_section');
    $data['accreditation'] = null;
    if (!$empty($acc)) {
        $common = get_field('level_5_common_accreditation', 'option');
        $ofqual = get_field('ofqual_accreditation_section', 'options');
        $logos  = array();
        if (have_rows('common_accreditation', 'option')) {
            foreach ((array) $common as $comm_acc) {
                $logos[] = array(
                    'img'      => $src($comm_acc['logo'] ?? ''),
                    'title'    => $h($comm_acc['title'] ?? ''),
                    'subtitle' => $h($comm_acc['subtitle'] ?? ''),
                    'link'     => $href($comm_acc['link'] ?? ''),
                );
            }
        }
        $data['accreditation'] = array(
            'title'          => $h($acc['section_title'] ?? ''),
            'summary'        => $h($acc['section_summary'] ?? ''),
            'ofqual_img'     => empty($ofqual['image']) ? '' : $src($ofqual['image']),
            'ofqual_content' => empty($ofqual['content']) ? '' : $h($ofqual['content']),
            'logos'          => $logos,
        );
    }

    // Why take this course.
    $why = get_field('why_take_this_course');
    $data['why'] = null;
    if (!$empty($why)) {
        $data['why'] = array(
            'title'    => $h($why['section_title'] ?? ''),
            'summary'  => $h($why['section_summary'] ?? ''),
            'faqs'     => array_map(fn($f) => array('q' => $h($f['question'] ?? ''), 'a' => $h($f['answer'] ?? '')), (array) ($why['faqs'] ?? array())),
            'btn_link' => $href($why['cta_button']['button_link'] ?? ''),
            'btn_text' => $h($why['cta_button']['button_text'] ?? ''),
        );
    }

    // Course details tabs.
    $tabs_raw = get_field('course_details_tabs');
    $data['tabs'] = null;
    if (!$empty($tabs_raw)) {
        $tabs = array();
        foreach ((array) $tabs_raw as $tab) {
            $extra = $tab['extra_tab_content'] ?? '';
            $faqs  = null;
            if (!empty($tab['tab_faq_content']) && $extra === 'faq-content') {
                $faq_questions = function_exists('get_cfvalue_by_country') ? get_cfvalue_by_country('frequently_asked_questions') : get_field('frequently_asked_questions');
                if ($empty($faq_questions)) {
                    $faq_questions = $tab['tab_faq_content']['faq_questions'] ?? array();
                }
                $faqs = tefl_native_overviews_faqs((array) $faq_questions, $ctx);
            }
            $accordion = null;
            if ($extra != 'faq-content' && $extra === 'accordion-content') {
                $accordion = array();
                foreach ((array) ($tab['tab_accordian_content']['accordion'] ?? array()) as $acc_row) {
                    $accordion[] = array(
                        'title'    => $h($acc_row['accordion_title'] ?? ''),
                        'subtitle' => $h($acc_row['accordion_subtitle'] ?? ''),
                        'content'  => empty($acc_row['accordion_content']) ? '' : $h($acc_row['accordion_content']),
                    );
                }
            }
            $title         = $tab['tab_title'] ?? '';
            $content_title = $tab['tab_content_title'] ?? '';
            $tabs[] = array(
                'title'         => $h($title),
                'content_title' => $h($content_title ? $content_title : $title),
                'extra'         => tefl_native_txt((string) $extra), // printed raw in data-extra-content
                'content'       => $h($tab['tab_content'] ?? ''),
                'faqs'          => $faqs,
                'accordion'     => $accordion,
            );
        }
        $data['tabs'] = $tabs;
    }

    $simple = function ($field, $keys) use ($h, $empty) {
        $v = get_field($field);
        if ($empty($v)) {
            return null;
        }
        $out = array();
        foreach ($keys as $k) {
            $out[$k] = $h($v[$k] ?? '');
        }
        return $out;
    };

    // About.
    $about = get_field('about_section');
    $data['about'] = $empty($about) ? null : array(
        'title'    => $h($about['section_title'] ?? ''),
        'summary'  => $h($about['section_summary'] ?? ''),
        'cta_img'  => $src($about['section_cta']['cta_image'] ?? ''),
        'cta_text' => $h($about['section_cta']['cta_text'] ?? ''),
        'cta_link' => $href($about['section_cta']['cta_link'] ?? ''),
    );

    $data['employer'] = $simple('employer_verification', array('section_title', 'section_summary'));

    // Photo gallery (Splide, initialised by the theme script).
    $gallery = get_field('photo_gallery');
    $data['gallery'] = $empty($gallery) ? null : array_map(fn($g) => $src($g['image'] ?? ''), (array) $gallery);

    $data['teacher'] = $simple('work_as_a_teacher', array('section_title', 'section_summary'));

    $banner = get_field('full_width_banner');
    $data['banner'] = $empty($banner) ? null : array(
        'text'  => $h($banner['banner_text'] ?? ''),
        'image' => $src($banner['banner_image'] ?? ''),
    );

    $overview = get_field('course_overview');
    $data['overview'] = null;
    if (!$empty($overview)) {
        $card = $overview['cta_card'] ?? array();
        $data['overview'] = array(
            'title'     => $h($overview['section_title'] ?? ''),
            'summary'   => $h($overview['section_summary'] ?? ''),
            'cta_image' => $src($card['cta_image'] ?? ''),
            'features'  => array_map(fn($f) => array('icon' => $src($f['icon'] ?? ''), 'title' => $h($f['title'] ?? '')), (array) ($card['features'] ?? array())),
            'btn_text'  => $h($card['cta_button_text'] ?? ''),
            'btn_link'  => $href($card['cta_button_link'] ?? ''),
        );
    }

    $team = get_field('team_section');
    $data['team'] = $empty($team) ? null : array(
        'title'   => $h($team['section_title'] ?? ''),
        'summary' => $h($team['section_summary'] ?? ''),
        'image'   => $src($team['section_image'] ?? ''),
    );

    // Instructors (options page; Glide slider from the theme script).
    $ins = get_field('instructors_info_section', 'option');
    $data['instructors'] = empty($ins) ? null : array_map(fn($i) => array(
        'image'       => $src($i['image'] ?? ''),
        'name'        => $h($i['name'] ?? ''),
        'designation' => $h($i['designation'] ?? ''),
    ), (array) ($ins['instructors'] ?? array()));

    return $data;
}
