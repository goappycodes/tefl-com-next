<?php
/**
 * Native template: single alert sign-up (single-alerts.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/alerts&path=/<cc>/alerts/<slug>/&id=123
 *
 * The template's inline script (mailchimp tag / page url / title) comes back
 * as its text, built exactly as printed; the CF7 form as HTML.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('alerts', 'tefl_native_alerts');

function tefl_native_alerts($pid, $ctx) {
    if (get_post_type($pid) !== 'alerts') {
        return null;
    }
    $alert_form = get_field('alert_form');
    $alert_tag  = get_field('alert_tag');
    $title      = tefl_native_capture(function () {
        single_post_title();
    });

    $script = '

    jQuery(document).ready(function($) {

        var alert_tag = "' . $alert_tag . '";

        $("input#mailchimp_tag").val(alert_tag);

    });

    var page_url = "' . get_permalink() . '";
    var page_title = "' . $title . '";

    jQuery(document).ready(function($) {
        $("#page_url").val(page_url);
        $("#page_title").val(page_title);
    });

';
    // Same rewrites the render applies to inline scripts.
    $script = preg_replace('#^<script\b[^>]*>|</script>$#', '', $ctx['html']('<script>' . $script . '</script>'));

    $form_html = tefl_native_destinations_capture($ctx, function () use ($alert_form) {
        echo do_shortcode($alert_form);
    });

    return array(
        'script'    => $script,
        'title'     => tefl_native_destinations_h($ctx, get_field('alert_title')),
        'content'   => tefl_native_destinations_h($ctx, get_field('alert_content')),
        'form_html' => $form_html,
    );
}
