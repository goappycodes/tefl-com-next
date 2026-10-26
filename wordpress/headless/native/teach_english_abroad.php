<?php
/**
 * Native template: single country guide (single-teach_english_abroad.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/teach_english_abroad&path=/<cc>/teach-english-abroad/<slug>/&id=123
 *
 * Mirrors the template value for value. Everything the template echoes raw
 * (ACF text / WYSIWYG, the content) is returned as an HTML fragment with the
 * render's rewrites applied; the Next template
 * (components/destinations/TeachEnglishAbroad.tsx) branches like the PHP.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('teach_english_abroad', 'tefl_native_teach_english_abroad');

/** An HTML fragment the template echoes raw: cookie blocker + render rewrites. */
function tefl_native_teach_english_abroad_h($ctx, $s) {
    if ($s === null || $s === false || $s === '') {
        return '';
    }
    return $ctx['html'](call_user_func($ctx['block'], (string) $s));
}

/** An image URL the template prints in src="": as the render rewrites it (root-relative → WP origin, no Photon). */
function tefl_native_teach_english_abroad_src($s) {
    $s = preg_replace('#^(https?:)?//i[0-9]\.wp\.com/#i', 'https://', (string) $s);
    if ($s !== '' && $s[0] === '/' && (strlen($s) < 2 || $s[1] !== '/')) {
        $s = tefl_headless_wp_origin() . $s;
    }
    return tefl_native_txt($s);
}

function tefl_native_teach_english_abroad($pid, $ctx) {
    if (get_post_type($pid) !== 'teach_english_abroad') {
        return null;
    }
    $h   = function ($s) use ($ctx) {
        return tefl_native_teach_english_abroad_h($ctx, $s);
    };
    $src = 'tefl_native_teach_english_abroad_src';
    $alt = function ($s) {
        return tefl_native_txt(basename((string) $s));
    };
    $pairs = function ($rows) use ($h) {
        $out = array();
        foreach (is_array($rows) ? $rows : array() as $r) {
            $out[] = array('title' => $h($r['title'] ?? ''), 'content' => $h($r['content'] ?? ''));
        }
        return $out;
    };

    $job_title = get_field('job_title');

    $country_images = array();
    $ci_raw         = get_field('country_image');
    if (is_array($ci_raw)) {
        foreach ($ci_raw as $ci) {
            $country_images[] = array('src' => $src($ci), 'alt' => $alt($ci));
        }
    }

    // Living costs: only when the group has content or featured points.
    $living = null;
    $lc     = get_field('living_costs');
    if ($lc && (($lc['content'] ?? '') || ($lc['featured_points'] ?? null))) {
        $living = array(
            'content' => $h($lc['content'] ?? ''),
            'points'  => ($lc['featured_points'] ?? null) ? $pairs($lc['featured_points']) : null,
        );
    }

    $key_points = null;
    $kp_raw     = get_field('key_points');
    if ($kp_raw) {
        $key_points = array();
        foreach (is_array($kp_raw) ? $kp_raw : array() as $kp) {
            $icon         = $kp['icon'] ?? '';
            $key_points[] = array(
                'show'    => (bool) ($icon && ($kp['title'] ?? '') && ($kp['content'] ?? '')),
                'icon'    => $src($icon),
                'alt'     => $alt($icon),
                'title'   => $h($kp['title'] ?? ''),
                'content' => $h($kp['content'] ?? ''),
            );
        }
    }

    $key_facts = null;
    $kf        = get_field('key_facts');
    if ($kf && (($kf['featured_points'] ?? null) || ($kf['content'] ?? ''))) {
        $key_facts = array(
            'points'  => ($kf['featured_points'] ?? null) ? $pairs($kf['featured_points']) : null,
            'content' => $h($kf['content'] ?? ''),
        );
    }

    $facts = array();
    $facts_raw = get_field('facts');
    foreach (is_array($facts_raw) ? $facts_raw : array() as $fact) {
        $facts[] = array(
            'icon'    => $src($fact['icon'] ?? ''),
            'alt'     => $alt($fact['icon'] ?? ''),
            'title'   => $h($fact['title'] ?? ''),
            'content' => $h($fact['content'] ?? ''),
        );
    }

    $faqs   = null;
    $fq_raw = get_field('faqs');
    if ($fq_raw && ($fq_raw['faq_content'] ?? null)) {
        $items = array();
        foreach (is_array($fq_raw['faq_content']) ? $fq_raw['faq_content'] : array() as $faq) {
            $items[] = array(
                'question' => $h($faq['question'] ?? ''),
                'answer'   => $h($faq['answer'] ?? ''),
                // The JSON-LD encodes the raw ACF values.
                'q_raw'    => $faq['question'] ?? null,
                'a_raw'    => $faq['answer'] ?? null,
            );
        }
        $faqs = array(
            'image' => $src($fq_raw['image'] ?? ''),
            'alt'   => $alt($fq_raw['image'] ?? ''),
            'items' => $items,
        );
    }

    $story = null;
    $ts    = get_field('teacher_story');
    if ($ts && ($ts['content'] ?? '')) {
        $story = array(
            'content' => $h($ts['content']),
            'name'    => $h($ts['name_&_designation'] ?? ''),
            'image'   => $src($ts['image'] ?? ''),
            'alt'     => $alt($ts['image'] ?? ''),
        );
    }

    // Latest jobs from the jobs board (the theme's day-long transient).
    $jobs     = null;
    $location = get_the_title();
    if ($location && function_exists('get_ti_jobs_location')) {
        $decoded = get_ti_jobs_location($location);
        if ($decoded) {
            $jobs = array();
            foreach ((is_array($decoded) || is_object($decoded)) ? $decoded : array() as $job) {
                $job    = (object) $job;
                $type   = $job->type ?? null;
                $type   = is_array($type) && isset($type[0]) ? ((object) $type[0])->name ?? '' : '';
                $jobs[] = array(
                    'logo'     => $src($job->company_logo ?? ''),
                    'alt'      => $alt($job->company_logo ?? ''),
                    'title'    => $h($job->title ?? ''),
                    'company'  => $h($job->company_name ?? ''),
                    'location' => $h($job->job_location ?? ''),
                    'type'     => $h($type),
                    'link'     => call_user_func($ctx['href'], tefl_native_txt($job->link ?? '')),
                    'salary'   => $h($job->salary ?? ''),
                );
            }
        }
    }

    $other_links = array();
    $ol_raw = get_field('other_links') ?? array();
    foreach (is_array($ol_raw) ? $ol_raw : array() as $e) {
        $cta           = $e['cta'] ?? array();
        $other_links[] = array(
            'title'   => $h($e['title'] ?? ''),
            'content' => $h($e['content'] ?? ''),
            'image'   => $src($e['image'] ?? ''),
            'link'    => call_user_func($ctx['href'], tefl_native_txt($cta['link'] ?? '')),
            'value'   => $h($cta['value'] ?? ''),
        );
    }

    // the_content()
    $content = str_replace(']]>', ']]&gt;', apply_filters('the_content', get_the_content()));

    return array(
        'id'             => (int) $pid,
        'origin'         => tefl_headless_wp_origin(),
        'hero'           => tefl_native_txt(esc_url((string) get_the_post_thumbnail_url())),
        'page_title'     => $h(get_field('page_title')),
        'job_title'      => $h($job_title),
        'content_html'   => $h($content),
        'country_images' => $country_images,
        'living'         => $living,
        'key_points'     => $key_points,
        'key_facts'      => $key_facts,
        'country_name'   => $h(get_field('country_name')),
        'facts'          => $facts,
        'faqs'           => $faqs,
        'story'          => $story,
        'jobs'           => $jobs,
        'other_links'    => $other_links,
    );
}
