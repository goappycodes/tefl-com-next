<?php
/**
 * Native template: single guide download page (single-guide.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/guide&path=/<cc>/guide/<slug>/&id=123
 *
 * The CF7 form is WordPress output and comes back as HTML; the template's
 * inline script (mailchimp tag / page url / PDF redirect) comes back as its
 * script text, built exactly as the template prints it.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('guide', 'tefl_native_guide');

function tefl_native_guide($pid, $ctx) {
    if (get_post_type($pid) !== 'guide') {
        return null;
    }
    $h = function ($s) use ($ctx) {
        return tefl_native_destinations_h($ctx, $s);
    };

    $image = get_field('image');
    $form  = get_field('contact_form_7');
    $form_html = tefl_native_destinations_capture($ctx, function () use ($form) {
        echo do_shortcode($form);
    });

    // The inline script after #primary, as the template prints it.
    $tag   = tefl_native_capture(function () {
        the_field('tag');
    });
    $title = tefl_native_capture(function () {
        single_post_title();
    });
    $pdf   = tefl_native_capture(function () {
        the_field('pdf');
    });
    $script = '
   jQuery(document).ready(function($) {
      var alert_tag = "' . $tag . '";
      $("input#mailchimp_tag").val(alert_tag);

      var page_url = "' . get_permalink() . '";
      var page_title = "' . $title . '";

      $("#page_url").val(page_url);
      $("#page_title").val(page_title);
   });

   document.addEventListener(\'wpcf7submit\', function(event) {
      if (\'66694\' == event.detail.contactFormId && event.detail.status == \'mail_sent\') {
         location = "' . $pdf . '";
      }
   }, false);
';
    // Same rewrites the render applies to inline scripts (JSON / string endpoints).
    $script = $ctx['html']('<script>' . $script . '</script>');
    $script = preg_replace('#^<script\b[^>]*>|</script>$#', '', $script);

    return array(
        'id'          => (int) $pid,
        'image'       => $image ? tefl_native_destinations_src($image) : '',
        'title'       => $h(get_field('title')),
        'description' => $h(get_field('description')),
        'book_call'   => get_queried_object_id() === 107391,
        'form_html'   => $form_html,
        'script'      => $script,
    );
}
