<?php
/**
 * Native template: Courses Overview Template 2023 (ti-courses-overview-template.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/courses-overview&path=/<cc>/tefl-courses-overview/&id=79087
 *
 * Every value the template computes, resolved, in its own structure (hero,
 * offer section, the course groups with their WooCommerce prices, the CTA
 * boxes, FAQs). Rendered by components/overviews/CoursesOverview.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('courses-overview', 'tefl_native_ti_courses_overview_template');

function tefl_native_ti_courses_overview_template($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'ti-courses-overview-template.php') {
        return null;
    }
    $h    = fn($s) => tefl_native_overviews_html($s, $ctx);
    $src  = 'tefl_native_overviews_src';
    $href = fn($u) => tefl_native_overviews_href($u, $ctx);

    $data = tefl_native_overviews_base($pid);
    $data['p82988'] = is_page('82988');

    // Hero banner.
    $hero = get_field('hero_banner');
    $data['hero'] = null;
    if (!empty($hero)) {
        $cta      = $hero['banner_cta'] ?? null;
        $has_logo = !empty($hero['banner_has_logo']);
        $data['hero'] = array(
            'bg'       => $src($hero['banner_background'] ?? ''),
            'show_cta' => is_array($cta) && !empty(array_filter($cta)),
            'title'    => $h($cta['cta_title'] ?? ''),
            'summary'  => $h($cta['cta_summary'] ?? ''),
            'btn_text' => $h($cta['cta_button_text'] ?? ''),
            'btn_link' => $href($cta['cta_button_link'] ?? ''),
            'has_logo' => $has_logo,
            'logo'     => $has_logo ? $src($hero['banner_logo'] ?? '') : '',
        );
    }

    // Offer section (needs the global gifts switch and a title).
    $offer = get_field('offer_section');
    $gifts = get_field('course_gifts_section', 'option');
    $data['offer'] = null;
    if (!empty($offer) && !empty($gifts['show_gifts_section']) && !empty($offer['offer_section_title'])) {
        $data['offer'] = array(
            'page_id'      => (int) get_queried_object_id(),
            'title'        => $h($offer['offer_section_title']),
            'timer_header' => $h($offer['offer_expiry_timer_header'] ?? ''),
            'timer'        => tefl_native_overviews_shortcode('[tefl_timer_shortcode_new timer="course_overview"]', $ctx),
            'btn_text'     => $h($offer['cta_button_text'] ?? ''),
            'btn_link'     => $href($offer['cta_button_link'] ?? ''),
            'gifts'        => array_map(fn($g) => $h($g['gift_title'] ?? ''), (array) ($gifts['gifts'] ?? array())),
        );
    }

    // Course groups.
    $cs = get_field('courses_section');
    $data['courses'] = null;
    if (!empty($cs)) {
        $tabs = array();
        foreach ((array) ($cs['courses_tab_menu'] ?? array()) as $tab) {
            $tabs[] = (string) ($tab['tab_title'] ?? '');
        }
        // The template prints the tab titles unescaped inside double-quoted
        // href / id attributes. A title with a `"` (e.g. one saved as HTML,
        // `<div style="…">`) ends the attribute early and the browser's error
        // recovery reshapes the rest of the page (it closes #primary). React
        // can't reproduce that tree, so such a page stays on the passthrough.
        foreach ($tabs as $t) {
            if (strpos($t, '"') !== false) {
                return null;
            }
        }
        $tab_id = fn($i) => str_replace(' ', '_', $tabs[$i] ?? '');

        $cards = array();
        foreach ((array) ($cs['cta_section']['cta_card'] ?? array()) as $card) {
            $cards[] = array(
                'icon'      => $src($card['cta_icon'] ?? ''),
                'title'     => $h($card['cta_title'] ?? ''),
                'summary'   => $h($card['cta_summary'] ?? ''),
                'link'      => $href($card['cta_link'] ?? ''),
                'link_text' => $h($card['cta_link_text'] ?? ''),
            );
        }

        $group = function ($g, $guide_key) use ($h, $ctx) {
            $courses = array();
            foreach ((array) ($g['courses'] ?? array()) as $c) {
                $courses[] = tefl_native_ti_courses_overview_template_course($c, $guide_key, $ctx);
            }
            return array(
                'title'   => $h($g['section_title'] ?? ''),
                'summary' => $h($g['section_summary'] ?? ''),
                'courses' => $courses,
            );
        };

        $cta_box = function ($box) use ($h, $src, $href) {
            if (empty($box)) {
                return null;
            }
            return array(
                'title'     => $h($box['cta_title'] ?? ''),
                'bg'        => $src($box['cta_box_background'] ?? ''),
                'summary'   => $h($box['cta_summary'] ?? ''),
                'link_text' => $h($box['cta_link_text'] ?? ''),
                'link_url'  => $href($box['cta_link_url'] ?? ''),
            );
        };

        $note = $cs['academic_director_note'] ?? null;

        $data['courses'] = array(
            'title'           => $h($cs['section_title'] ?? ''),
            'tabs'            => array_map($h, $tabs),
            'tab_hrefs'       => array_map(fn($t) => '#' . str_replace(' ', '_', $t), $tabs),
            'tab_ids'         => array($tab_id(0), $tab_id(1), $tab_id(2), $tab_id(3)),
            'cta_cards'       => $cards,
            'accredited'      => $group($cs['accredited_tefl_courses'] ?? array(), 'guide_link'),
            'more_accredited' => $group($cs['more_accredited_tefl_courses'] ?? array(), 'guide_link'),
            'level5'          => $group($cs['level_5_diploma_course'] ?? array(), 'course_guide_link'),
            'elt_box'         => $cta_box($cs['english_level_cta_box'] ?? null),
            'virtual_box'     => $cta_box($cs['virtual_course_cta_box'] ?? null),
            'hybrid'          => $group($cs['hybrid_diploma_courses'] ?? array(), 'course_guide_link'),
            'note'            => empty($note) ? null : array(
                'image'     => $src($note['image'] ?? ''),
                'title'     => $h($note['title'] ?? ''),
                'content'   => $h($note['content'] ?? ''),
                'link_text' => $h($note['cta_text'] ?? ''),
            ),
            'specialist'      => $group($cs['specialist_courses'] ?? array(), ''),
            'l5_specialist'   => $group($cs['level_5_specialist_courses'] ?? array(), ''),
        );
    }

    // FAQs.
    $faqs = function_exists('get_cfvalue_by_country') ? get_cfvalue_by_country('frequently_asked_questions') : get_field('frequently_asked_questions');
    $data['faqs'] = tefl_native_overviews_is_empty($faqs) ? array() : tefl_native_overviews_faqs($faqs, $ctx);

    return $data;
}

/** One course row of a group, every field any of the card variants prints. */
function tefl_native_ti_courses_overview_template_course($c, $guide_key, $ctx) {
    $h   = fn($s) => tefl_native_overviews_html($s, $ctx);
    $src = 'tefl_native_overviews_src';

    $course_id = $c['course'] ?? 0;
    $features  = $c['features'] ?? null;
    $includes  = is_array($features) ? ($features['includes'] ?? null) : null;
    $excludes  = is_array($features) ? ($features['excludes'] ?? null) : null;

    $deposit = null;
    if (!empty($c['has_depoist'])) {
        $d       = $c['deposit_info'] ?? array();
        $deposit = array(
            'icon'        => $src($d['deposit_icon'] ?? ''),
            'title'       => $h($d['deposit_title'] ?? ''),
            'description' => $h($d['deposit_description'] ?? ''),
        );
    }
    $freebies = array();
    if (!empty($c['has_freebies']) && !empty($c['freebies'])) {
        foreach ((array) $c['freebies'] as $f) {
            $freebies[] = array('icon' => $src($f['freebie_icon'] ?? ''), 'text' => $h($f['freebie_text'] ?? ''));
        }
    }

    return array(
        'bg'            => $src($c['background_image'] ?? ''),
        'icon'          => $src($c['course_icon'] ?? ''),
        'title'         => $h($c['course_title'] ?? ''),
        'completion'    => $h($c['course_completion_time'] ?? ''),
        'link'          => tefl_native_overviews_href(get_post_permalink($course_id), $ctx),
        'guide'         => $guide_key ? tefl_native_overviews_href($c[$guide_key] ?? '', $ctx) : '',
        'price'         => tefl_native_overviews_price(get_field('course_product', $course_id), $ctx),
        'has_features'  => is_array($features) && !empty(array_filter($features)),
        'feature_title' => is_array($features) ? $h($features['feature_title'] ?? '') : '',
        'includes'      => empty($includes) ? array() : array_map(fn($i) => $h($i['feature'] ?? ''), (array) $includes),
        'excludes'      => empty($excludes) ? array() : array_map(fn($i) => $h($i['feature'] ?? ''), (array) $excludes),
        'deposit'       => $deposit,
        'freebies'      => $freebies,
    );
}
