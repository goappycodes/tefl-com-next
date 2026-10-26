<?php
/**
 * Native template: single support topic (single-support_centre.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/support_centre&path=/<cc>/support-topic/<slug>/&id=123
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('support_centre', 'tefl_native_support_centre');

function tefl_native_support_centre($pid, $ctx) {
    if (get_post_type($pid) !== 'support_centre') {
        return null;
    }
    return array(
        'heading'    => tefl_native_destinations_h($ctx, get_field('heading')),
        'subheading' => tefl_native_destinations_h($ctx, get_field('sub-heading')),
        'details'    => tefl_native_destinations_h($ctx, get_field('details')),
    );
}
