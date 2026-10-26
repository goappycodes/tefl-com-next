<?php
/**
 * Native template: Job Hunter's Pack / free resources (page template page-job-hunters-pack.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/job_hunters_pack&path=/<cc>/free-resources/&id=93622
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('job_hunters_pack', 'tefl_native_job_hunters_pack');

function tefl_native_job_hunters_pack($pid, $ctx) {
    if (get_post_type($pid) !== 'page' || get_page_template_slug($pid) !== 'page-job-hunters-pack.php') {
        return null;
    }
    $h     = function ($s) use ($ctx) {
        return tefl_native_destinations_h($ctx, $s);
    };
    $src   = 'tefl_native_destinations_src';
    $href  = function ($s) use ($ctx) {
        return tefl_native_destinations_href($ctx, $s);
    };
    $empty = function ($a) {
        return function_exists('is_array_empty') ? is_array_empty($a) : (!is_array($a) || empty($a));
    };

    $hero = null;
    $hb   = get_field('hero_banner');
    if (!$empty($hb)) {
        $content = $hb['banner_content'] ?? array();
        $hero    = array(
            'background' => $src($hb['banner_bg_image'] ?? ''),
            'title'      => $h($content['title'] ?? ''),
            'summary'    => $h($content['summary'] ?? ''),
        );
    }

    $resources = null;
    $rc        = get_field('resources_cta_section');
    if (!$empty($rc)) {
        $cards = array();
        foreach (is_array($rc['resources_cta'] ?? null) ? $rc['resources_cta'] : array() as $r) {
            $cards[] = array(
                'title'   => $h($r['title'] ?? ''),
                'alt'     => tefl_native_txt(esc_html($r['title'] ?? '')),
                'image'   => $src($r['image'] ?? ''),
                'summary' => $h($r['summary'] ?? ''),
                'link'    => $href($r['link'] ?? ''),
            );
        }
        $resources = array('title' => $h($rc['section_title'] ?? ''), 'cards' => $cards);
    }

    $jobs = null;
    $js   = get_field('jobs_section');
    if (!$empty($js)) {
        $items = array();
        foreach (is_array($js['jobs'] ?? null) ? $js['jobs'] : array() as $job) {
            $title   = (string) ($job['job_title'] ?? '');
            $items[] = array(
                'image'    => $src($job['featured_image'] ?? ''),
                'location' => $h($job['job_location'] ?? ''),
                'title'    => $h(function_exists('truncate_string') ? truncate_string($title, 6) : $title),
                'posted'   => $h($job['posted'] ?? ''),
                'salary'   => $h($job['salary_text'] ?? ''),
                'link'     => $href($job['job_link'] ?? ''),
            );
        }
        $jobs = array(
            'title'    => $h($js['section_title'] ?? ''),
            'subtitle' => $h($js['section_summary'] ?? ''),
            'pdf'      => $href('/wp-content/uploads/2024/07/TEFL-Insitute-Job-Comparison-Guide.pdf'),
            'items'    => $items,
        );
    }

    $gallery = function ($name) use ($src) {
        $g = get_field($name, 'options');
        if (!$g) {
            return null;
        }
        $out = array();
        foreach (is_array($g) ? $g : array() as $image) {
            $out[] = $src($image);
        }
        return $out;
    };

    $faqs = array();
    $fq   = function_exists('get_cfvalue_by_country') ? get_cfvalue_by_country('frequently_asked_questions') : get_field('frequently_asked_questions');
    foreach (is_array($fq) ? $fq : array() as $key => $faq) {
        $faqs[] = array(
            'key'      => (string) $key,
            'first'    => $key === 0,
            'question' => $h($faq['question'] ?? ''),
            'answer'   => $h($faq['answer'] ?? ''),
            'q_raw'    => $faq['question'] ?? null,
            'a_raw'    => $faq['answer'] ?? null,
        );
    }

    $form_html = tefl_native_destinations_capture($ctx, function () {
        echo do_shortcode('[contact-form-7 id="77295" title="Home Contact Form"]');
    });

    return array(
        'hero'           => $hero,
        'resources'      => $resources,
        'jobs'           => $jobs,
        'first_gallery'  => $gallery('first_gallery'),
        'second_gallery' => $gallery('second_gallery'),
        'contact_image'  => $src('/wp-content/uploads/2023/04/get-in-touch.png'),
        'form_html'      => $form_html,
        'faqs'           => $faqs,
    );
}
