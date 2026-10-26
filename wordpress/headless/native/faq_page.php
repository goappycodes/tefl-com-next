<?php
/**
 * Native template: Frequently Asked Questions (page template page-faq.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/faq_page&path=/<cc>/frequently-asked-tefl-questions/&id=1905
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('faq_page', 'tefl_native_faq_page');

function tefl_native_faq_page($pid, $ctx) {
    if (get_post_type($pid) !== 'page' || get_page_template_slug($pid) !== 'page-faq.php') {
        return null;
    }
    $items = array();
    $faqs  = get_field('frequently_asked_questions');
    foreach (is_array($faqs) ? $faqs : array() as $item) {
        $items[] = array(
            'question' => tefl_native_destinations_h($ctx, $item['question'] ?? ''),
            'answer'   => tefl_native_destinations_h($ctx, $item['answer'] ?? ''),
            // The JSON-LD encodes the raw ACF values.
            'q_raw'    => $item['question'] ?? null,
            'a_raw'    => $item['answer'] ?? null,
        );
    }
    return array('faqs' => $items);
}
