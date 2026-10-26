<?php
/**
 * Native template: "TEFL Institute Partner" (ti-esl-franchise.php) — /esl-franchise/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/ti-esl-franchise&path=/<cc>/esl-franchise/&id=91728
 *
 * The hero (+ partner-logo slider), about, partnership-pathway cards and
 * contact groups — each printed only when the theme's is_array_empty() says
 * it has content — and the CF7 partner form. (The template's mailto link
 * never echoes the address: it's "mailto: ".)
 * React: components/pages/esl-franchise/EslFranchisePage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('ti-esl-franchise', 'tefl_native_ti_esl_franchise');

function tefl_native_ti_esl_franchise($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'ti-esl-franchise.php' || !function_exists('is_array_empty')) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $h    = $v['h'];
    $i    = $v['i'];
    $s    = 'tefl_native_pages_str';
    $rows = 'tefl_native_pages_rows';
    $card = function ($c) use ($rows, $h, $i) {
        $c = $rows($c);
        return array('title' => $i($c['card_title'] ?? ''), 'description' => $h($c['card_description'] ?? ''));
    };

    $hero = get_field('hero_banner');
    $hero_out = null;
    if (!is_array_empty($hero)) {
        $logos    = $hero['partner_logos'] ?? null;
        $hero_out = array(
            'image'    => $s($hero['banner_image'] ?? ''),
            'title'    => $i($hero['banner_title'] ?? ''),
            'text'     => $h($hero['banner_text'] ?? ''),
            'cta_text' => $i($hero['banner_cta_text'] ?? ''),
            'logos'    => is_array_empty($logos) ? null : array_map($s, array_values((array) $logos)),
        );
    }

    $about     = get_field('about_section');
    $about_out = is_array_empty($about) ? null : array('title' => $i($about['section_title'] ?? ''), 'summary' => $h($about['section_summary'] ?? ''));

    $pp     = get_field('partnership_pathways');
    $pp_out = null;
    if (!is_array_empty($pp)) {
        $courses = array();
        foreach ($rows($pp['courses_card'] ?? null) as $c) {
            $courses[] = array(
                'title'       => $i($c['card_title'] ?? ''),
                'logo'        => $s($c['card_logo'] ?? ''),
                'description' => $h($c['card_description'] ?? ''),
                'link'        => $v['u']($c['course_link'] ?? ''),
            );
        }
        $pp_out = array(
            'title'    => $i($pp['section_title'] ?? ''),
            'courses'  => $courses,
            'how'      => is_array_empty($pp['how_it_works_card'] ?? null) ? null : $card($pp['how_it_works_card']),
            'benefits' => is_array_empty($pp['partner_benefits_card'] ?? null) ? null : $card($pp['partner_benefits_card']),
        );
    }

    $cs     = get_field('contact_section');
    $cs_out = null;
    if (!is_array_empty($cs)) {
        $left     = $rows($cs['contact_section_left'] ?? null);
        $right    = $rows($cs['contact_section_right'] ?? null);
        $contacts = array();
        foreach ($rows($right['contact'] ?? null) as $c) {
            $contacts[] = array('image' => $s($c['contact_image'] ?? ''), 'name' => $i($c['contact_name'] ?? ''), 'designation' => $i($c['contact_designation'] ?? ''));
        }
        $cs_out = array(
            'left'  => array('title' => $i($left['section_title'] ?? ''), 'summary' => $h($left['section_summary'] ?? ''), 'email' => $i('Email: ' . $s($left['contact_email'] ?? ''))),
            'right' => array('title' => $i($right['section_title'] ?? ''), 'contacts' => $contacts, 'description' => $h($right['contact_description'] ?? '')),
        );
    }

    $primary = tefl_native_pages_attrs(tefl_native_pages_capture('astra_primary_class'));

    return array(
        'primary_class' => isset($primary['class']) ? $primary['class'] : 'content-area primary',
        'hero'          => $hero_out,
        'about'         => $about_out,
        'pathways'      => $pp_out,
        'contact'       => $cs_out,
        'form_html'     => $h(do_shortcode('[contact-form-7 id="67369" title="Become a partner school form"]')),
    );
}
