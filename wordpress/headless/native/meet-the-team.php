<?php
/**
 * Native template: "Meet The Team" (meet-the-team.php) — /meet-the-team/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/meet-the-team&path=/<cc>/meet-the-team/&id=903
 *
 * The heading, the two team repeaters (with the template's class rules for
 * the academic council: `no-border` when exactly 3, ` last` on the last; the
 * offset rule compares against an undefined variable, so it never applies)
 * and the contact cards. React: components/pages/team/TeamPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('meet-the-team', 'tefl_native_meet_the_team');

function tefl_native_meet_the_team($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'meet-the-team.php') {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $rows = 'tefl_native_pages_rows';

    $heading = $rows(get_field('heading'));
    $teams   = $rows(get_field('teams'));
    $member  = function ($m) use ($v) {
        return array(
            'image'    => tefl_native_pages_str($m['member_image'] ?? ''),
            'position' => tefl_native_pages_str($m['member_image_position'] ?? ''),
            'name'     => $v['h']($m['member_name'] ?? ''),
            'title'    => $v['h']($m['member_designation'] ?? ''),
            'about'    => $v['h']($m['member_details'] ?? ''),
        );
    };
    $management = $rows($teams['management_and_operations'] ?? null);
    $council    = $rows($teams['academic_council'] ?? null);
    // With an empty team the template prints a stray </div>; not mirrored.
    if (!$management || !$council) {
        return null;
    }

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
        'title'      => $v['h']($heading['header_title'] ?? ''),
        'subtitle'   => $v['h']($heading['header_subtitle'] ?? ''),
        'management' => array_map($member, array_values($management)),
        'council'    => array_map($member, array_values($council)),
        'contact'    => array('heading' => $v['h']($contact['heading'] ?? ''), 'items' => $contacts, 'has_items' => !empty($contact['contact_infos'])),
    );
}
