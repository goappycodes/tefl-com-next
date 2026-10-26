<?php
/**
 * Native template: all TEFL jobs (page template page-all-jobs.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/all_jobs&path=/<cc>/all-jobs/&id=4024
 *
 * The job cards mirror the template's loop exactly — including that `$rate`
 * is never reset between jobs, so a job without rates shows the previous
 * job's rate (theme bug, reproduced). `$salary` is computed but never printed.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('all_jobs', 'tefl_native_all_jobs');

function tefl_native_all_jobs($pid, $ctx) {
    if (get_post_type($pid) !== 'page' || get_page_template_slug($pid) !== 'page-all-jobs.php') {
        return null;
    }
    $h = function ($s) use ($ctx) {
        return tefl_native_destinations_h($ctx, $s);
    };

    $gocambio_jobs = function_exists('ti_jobs_feed') ? ti_jobs_feed() : null;
    $jobs          = null;
    if ($gocambio_jobs) {
        $jobs  = array();
        $count = 1;
        $rate  = null;
        foreach ((is_array($gocambio_jobs) || is_object($gocambio_jobs)) ? $gocambio_jobs : array() as $gj) {
            $gj                = (object) $gj;
            $job_title         = wp_trim_words($gj->title ?? '', 7, '...');
            $job_type          = $gj->type ?? null;
            $job_type          = is_array($job_type) && isset($job_type[0]) ? (((object) $job_type[0])->name ?? null) : null;
            $job_logo          = $gj->company_logo ?? '';
            $job_location      = wp_trim_words($gj->job_location ?? '', 4, '...');
            $rate_min          = preg_replace('/[^0-9]/', '', (string) ($gj->rate_min ?? ''));
            $rate_max          = preg_replace('/[^0-9]/', '', (string) ($gj->rate_max ?? ''));
            $job_currency_code = $gj->job_currency_code ?? '';
            if (empty($job_logo)) {
                $job_logo = 'https://teflinstitute.com/wp-content/uploads/2021/02/wordpress-581849_640.jpg';
            }
            if (!empty($rate_min) && !empty($rate_max)) {
                $rate = $rate_min . ' - ' . $rate_max . ' ' . $job_currency_code . '/hour';
            } elseif (!empty($rate_min) && empty($rate_max)) {
                $rate = $rate_min . ' ' . $job_currency_code . '/hour';
            } elseif (empty($rate_min) && !empty($rate_max)) {
                $rate = $rate_max . ' ' . $job_currency_code . '/hour';
            }
            $comp   = $gj->company_name ?? '';
            $link   = $gj->link ?? '';
            $jobs[] = array(
                'count'    => $count,
                'id'       => (string) ($gj->id ?? ''),
                'info'     => (bool) (!empty($job_type) || !empty($job_title) || !empty($comp) || !empty($job_location)),
                'type'     => !empty($job_type) ? $h($job_type) : '',
                'logo'     => tefl_native_destinations_src($job_logo),
                'title'    => !empty($job_title) ? $h($job_title) : '',
                'company'  => !empty($comp) ? $h($comp) : '',
                'location' => !empty($job_location) ? $h($job_location) : '',
                'rate'     => !empty($rate) ? $h($rate) : '',
                'link'     => !empty($link) ? tefl_native_destinations_href($ctx, $link) : '',
            );
            $count++;
        }
    }

    return array('jobs' => $jobs);
}
