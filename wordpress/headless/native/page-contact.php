<?php
/**
 * Native template: "Contact Page Template" (page-contact.php) — /contact-us/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-contact&path=/<cc>/contact-us/&id=924
 *
 * Static apart from the `contact_details` group (heading + contact cards).
 * React: components/pages/contact/ContactPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('page-contact', 'tefl_native_page_contact');

function tefl_native_page_contact($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'page-contact.php') {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $rows = 'tefl_native_pages_rows';

    $contact  = $rows(get_field('contact_details'));
    $contacts = array();
    foreach ($rows($contact['contact_infos'] ?? null) as $c) {
        $contacts[] = array(
            'icon'     => tefl_native_pages_str($c['icon'] ?? ''),
            'title'    => $v['h']($c['title'] ?? ''),
            'subtitle' => $v['h']($c['subtitle'] ?? ''),
            'details'  => $v['h']($c['details'] ?? ''),
        );
    }
    return array(
        'contact' => array('heading' => $v['h']($contact['heading'] ?? ''), 'items' => $contacts, 'has_items' => !empty($contact['contact_infos'])),
    );
}
