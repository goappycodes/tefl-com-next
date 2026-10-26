<?php
/**
 * Native template: country guides index (page template page-teach-english-jobs.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/teach_english_jobs&path=/<cc>/teach-english-jobs/&id=63312
 *
 * Runs the template's per-continent queries (same args, same order) and
 * returns each guide card's values as the template prints them.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('teach_english_jobs', 'tefl_native_teach_english_jobs');

function tefl_native_teach_english_jobs($pid, $ctx) {
    if (get_post_type($pid) !== 'page' || get_page_template_slug($pid) !== 'page-teach-english-jobs.php') {
        return null;
    }
    $h   = function ($s) use ($ctx) {
        return tefl_native_destinations_h($ctx, $s);
    };
    $out = function (callable $fn) use ($h) {
        return $h(tefl_native_capture($fn));
    };

    $hero = get_field('hero');
    $hero = is_array($hero) ? $hero : array();

    $continents = array('Europe', 'Southeast Asia', 'East Asia', 'South America', 'North America', 'Australia', 'Africa', 'Other Countries', 'Middle East', 'South Asia', 'Central Asia', 'Western Asia');
    sort($continents);
    $sections = array();
    foreach ($continents as $continent) {
        $the_query = new WP_Query(array(
            'post_type'      => 'teach_english_abroad',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'meta_query'     => array(
                'relation'  => 'AND',
                'continent' => array('key' => 'region_continent', 'value' => $continent),
                'country'   => array('key' => 'country_name'),
            ),
            'orderby'        => array('country' => 'ASC'),
        ));
        if ($the_query->have_posts()) {
            $cards = array();
            while ($the_query->have_posts()) {
                $the_query->the_post();
                $overview = get_field('overview_description');
                $cards[]  = array(
                    'thumbnail'   => tefl_native_destinations_src(tefl_native_capture('the_post_thumbnail_url')),
                    'country'     => $out(function () {
                        the_field('country_name');
                    }),
                    'description' => !empty($overview)
                        ? $h($overview)
                        : $h('Read more about the fantastic TEFL job opportunity ' . get_field('country_name') . ' has to offer. We have explained everything in our ultimate guide to help you make the final decision if ' . get_field('country_name') . ' is a TEFL destination for you.'),
                    'url'         => tefl_native_destinations_href($ctx, tefl_native_capture('the_permalink')),
                );
            }
            $sections[] = array('continent' => $h($continent), 'cards' => $cards);
        }
        wp_reset_query();
    }

    return array(
        'hero'     => array(
            'image'    => tefl_native_destinations_src($hero['image'] ?? ''),
            'title'    => $h($hero['title'] ?? ''),
            'subtitle' => $h($hero['subtitle'] ?? ''),
        ),
        'sections' => $sections,
    );
}
