<?php
/**
 * Native template: "Webinars" (webinars.php) — /upcoming-tefl-webinars/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/webinars&path=/<cc>/upcoming-tefl-webinars/&id=948
 *
 * One card per upcoming webinar (get_latest_webinars(-1)), with the
 * template's UK-time zone label and ISO start for the client-side local time.
 * React: components/pages/webinars/WebinarsPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('webinars', 'tefl_native_webinars');

function tefl_native_webinars($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'webinars.php' || !function_exists('get_latest_webinars')) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v = tefl_native_pages_vals($ctx);
    $s = 'tefl_native_pages_str';

    $cards = array();
    foreach ((array) get_latest_webinars(-1) as $w) {
        $wid      = $w->ID;
        $date     = $s(get_field('webinar_date', $wid));
        $time     = $s(get_field('webinar_time', $wid));
        $uk_zone  = DAY_LIGHT_SAVINGS ? 'BST' : 'GMT';
        $iso      = '';
        $raw_date = get_post_meta($wid, 'webinar_date', true);
        $raw_time = get_post_meta($wid, 'webinar_time', true);
        if ($raw_date && $raw_time) {
            try {
                $start   = new DateTime($raw_date . ' ' . $raw_time, new DateTimeZone('Europe/London'));
                $uk_zone = $start->format('T');
                $iso     = $start->format(DATE_ATOM);
            } catch (Exception $e) {
            }
        }
        $cards[] = array(
            'id'       => (int) $wid,
            'title'    => $v['h']($w->post_title),
            'location' => $v['h'](get_field('webinar_location', $wid)),
            'date'     => $v['h']($date),
            'time'     => $v['h']($time),
            'zone'     => (string) $uk_zone,
            'iso'      => (string) $iso,
            'image'    => (string) get_the_post_thumbnail_url($wid, 'full'),
            // esc_attr() in the template; the plain value here (React escapes).
            'label'    => tefl_native_txt($w->post_title . ' - ' . $date . ' - ' . $time),
        );
    }
    return array('webinars' => $cards);
}
