<?php
/**
 * Native template: "Become an Affiliate Template" (page-affiliate.php) —
 * /become-a-tefl-affiliate/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-affiliate&path=/<cc>/become-a-tefl-affiliate/&id=4274
 *
 * The heading, the FAQ accordion and "why choose us" repeaters, the
 * template's YouTube iframe after Complianz's blocker (it becomes a consent
 * placeholder on the page), and the [affiliate_registration] form.
 * React: components/pages/affiliate/AffiliatePage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('page-affiliate', 'tefl_native_page_affiliate');

function tefl_native_page_affiliate($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'page-affiliate.php') {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $rows = 'tefl_native_pages_rows';

    $faq = array();
    foreach ($rows(get_field('affiliate_marketer')) as $el) {
        $faq[] = array('question' => $v['h']($el['question'] ?? ''), 'answer' => $v['h']($el['answer'] ?? ''));
    }
    $why = array();
    foreach ($rows(get_field('why_choose_us')) as $el) {
        $why[] = array(
            'paragraph' => $v['h']($el['paragraph'] ?? ''),
            'title'     => $v['h']($el['title'] ?? ''),
            'subtitle'  => $v['h']($el['subtitle'] ?? ''),
            'small'     => $v['h']($el['small'] ?? ''),
        );
    }

    $iframe = '<iframe width="100%" height="415" src="https://www.youtube.com/embed/7j6B4xyoy2A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

    return array(
        'heading'     => $v['h'](get_field('heading')),
        'iframe_html' => $v['h']($iframe),
        'faq'         => $faq,
        'why'         => $why,
        'form_html'   => $v['h'](do_shortcode('[affiliate_registration]')),
    );
}
