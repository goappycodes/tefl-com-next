<?php
/**
 * Native template: free TEFL jobs service (page template page-jobs-service.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/jobs_service&path=/<cc>/tefl-jobs/&id=3905
 *
 * Mirrors the template, including its inverted gocambio check: the second
 * "TEFL/TESOL Careers" section prints (always empty) only when the gocambio
 * feed returns nothing.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('jobs_service', 'tefl_native_jobs_service');

function tefl_native_jobs_service($pid, $ctx) {
    if (get_post_type($pid) !== 'page' || get_page_template_slug($pid) !== 'page-jobs-service.php') {
        return null;
    }
    $h    = function ($s) use ($ctx) {
        return tefl_native_destinations_h($ctx, $s);
    };
    $src  = 'tefl_native_destinations_src';
    $href = function ($s) use ($ctx) {
        return tefl_native_destinations_href($ctx, $s);
    };
    $rep  = function ($repeater, $key) {
        return function_exists('get_repeater_cfvalue_by_country') ? get_repeater_cfvalue_by_country($repeater, $key) : ((get_field($repeater) ?: array())[$key] ?? null);
    };

    $banner              = get_field('banner');
    $team                = get_field('team');
    $teaching_experience = get_field('teaching_experience');
    $blogs               = get_field('blogs');
    $promo               = get_field('promo');
    $faq                 = function_exists('get_cfvalue_by_country') ? get_cfvalue_by_country('faq') : get_field('faq');
    $gocambio_jobs       = function_exists('ti_jobs_feed') ? ti_jobs_feed() : null;

    $form_html = tefl_native_destinations_capture($ctx, function () {
        echo do_shortcode('[contact-form-7 id="7170" title="Job Hunter\'s Guide"]');
    });

    $featured = null;
    $fj       = get_field('featured_jobs');
    if ($fj) {
        $featured = array();
        foreach (is_array($fj) ? $fj : array() as $e) {
            $info = array();
            foreach (is_array($e['info'] ?? null) ? $e['info'] : array() as $i) {
                $info[] = array('icon' => $src($i['icon'] ?? ''), 'content' => $h($i['content'] ?? ''));
            }
            $featured[] = array(
                'background' => $src($e['background'] ?? ''),
                'salary'     => $h($e['salary'] ?? ''),
                'title'      => $h($e['title'] ?? ''),
                'info'       => $info,
                'link'       => $href($e['link'] ?? ''),
            );
        }
    }

    $ti_jobs = null;
    $tj      = function_exists('get_ti_jobs') ? get_ti_jobs(8, false) : null;
    if ($tj) {
        $ti_jobs = array();
        foreach ((is_array($tj) || is_object($tj)) ? $tj : array() as $job) {
            $job       = (object) $job;
            $logo      = $job->job_image ?? '';
            $company   = $job->job_company_name ?? '';
            $location  = $job->job_location ?? '';
            $salary    = $job->job_salary ?? '';
            $ti_jobs[] = array(
                'title'    => $h(wp_trim_words($job->job_title ?? '', 7, '...')),
                'logo'     => $src(empty($logo) ? '/wp-content/uploads/2022/02/jobs_board_icon.svg' : $logo),
                'link'     => $href($job->job_link ?? ''),
                'type'     => $h($job->job_type ?? ''),
                'company'  => $h(!empty($company) ? $company : 'NA'),
                'location' => $h(!empty($location) ? $location : 'NA'),
                'salary'   => $h(!empty($salary) ? $salary : 'NA'),
            );
        }
    }

    $members = array();
    $count   = is_array($team) || $team instanceof Countable ? count($team) : 0;
    $row     = 0;
    foreach (is_array($team) ? $team : array() as $m) {
        $row++;
        $members[] = array(
            'offset'      => $row == $count && $count > 3,
            'last'        => $row == $count,
            'photo'       => $src($m['photo'] ?? ''),
            'position'    => tefl_native_txt($m['photo_position'] ?? ''),
            'name'        => $h($m['name'] ?? ''),
            'designation' => $h($m['designation'] ?? ''),
            'about'       => $h($m['description'] ?? ''),
        );
    }

    $posts = array();
    foreach (is_array($blogs) ? $blogs : array() as $uc) {
        $id      = is_object($uc) ? $uc->ID : (int) $uc;
        $posts[] = array(
            'title' => $h(get_the_title($id)),
            'image' => $src(get_the_post_thumbnail_url($id)),
            'url'   => $href(get_the_permalink($id)),
        );
    }

    $faqs = null;
    if ($faq) {
        $faqs = array();
        foreach (is_array($faq) ? $faq : array() as $e) {
            $faqs[] = array('question' => $h($e['question'] ?? ''), 'answer' => $h($e['answer'] ?? ''));
        }
    }

    $promo = is_array($promo) ? $promo : array();
    $te    = is_array($teaching_experience) ? $teaching_experience : array();
    return array(
        'origin'          => tefl_headless_wp_origin(),
        'banner'          => array(
            'photo'    => $src(is_array($banner) ? ($banner['photo'] ?? '') : ''),
            'title'    => $h($rep('banner', 'title')),
            'subtitle' => $h($rep('banner', 'subtitle')),
            'slugline' => $h($rep('banner', 'slugline')),
        ),
        'brochure_pdf'    => $href('/wp-content/uploads/2025/03/TEFL-Institute-Job-Hunters-Guide.pdf'),
        'form_html'       => $form_html,
        'featured'        => $featured,
        'header'          => array(
            'title'    => $h($rep('header', 'title')),
            'subtitle' => $h($rep('header', 'subtitle')),
            'image'    => $src($rep('header', 'image')),
        ),
        'ti_jobs'         => $ti_jobs,
        'gocambio_empty'  => !$gocambio_jobs,
        'experience'      => array('hours' => $h($te['working_hours'] ?? ''), 'class_size' => $h($te['class_size'] ?? '')),
        'team'            => $members,
        'promo'           => array(
            'image'    => $src($promo['image'] ?? ''),
            'title'    => $h($promo['title'] ?? ''),
            'subtitle' => $h($promo['subtitle'] ?? ''),
            'link'     => $href($promo['link'] ?? ''),
        ),
        'blogs'           => $posts,
        'faqs'            => $faqs,
    );
}
