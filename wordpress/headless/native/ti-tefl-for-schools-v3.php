<?php
/**
 * Native template: "TEFL for Schools v3" (ti-tefl-for-schools-v3.php) — /tefl-for-schools/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/ti-tefl-for-schools-v3&path=/<cc>/tefl-for-schools/&id=110427
 *
 * Resolves every value the template prints through the theme's own helpers
 * (includes/tefl-for-schools-v3.php: tfs2_get / tfs2_rows with their
 * defaults, tfs2_slot, tfs2_tiers / tfs2_price_for / tfs2_gbp, tfs2_img,
 * tfs2_url), escaped exactly as the template escapes them (esc_html for
 * text, esc_url / esc_attr for attributes — the values come back as the
 * HTML the template would print), plus the WordPress-rendered pieces
 * (wp_get_attachment_image tags, the CF7 hero form). The React side
 * (components/pages/schools/SchoolsPage.tsx) writes the markup.
 *
 * Visitors only: the editors-only image placeholders never apply.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('ti-tefl-for-schools-v3', 'tefl_native_ti_tefl_for_schools_v3');

function tefl_native_ti_tefl_for_schools_v3($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'ti-tefl-for-schools-v3.php' || !function_exists('tfs2_get')) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    // The template reads get_queried_object_id(); make it this page.
    $GLOBALS['wp_query']->queried_object    = get_post($id);
    $GLOBALS['wp_query']->queried_object_id = (int) $id;

    $html = function ($frag) use ($ctx) {
        $frag = (string) $frag;
        if (!tefl_native_pages_balanced($frag)) {
            throw new Tefl_Native_Pages_Bail('unbalanced fragment');
        }
        return $ctx['html']($ctx['block']($frag));
    };
    $href = function ($escaped_url) use ($ctx) {
        // The template prints esc_url(...); the render then rewrites it.
        return $ctx['href'](tefl_native_txt($escaped_url));
    };
    $e = function ($v) {
        return esc_html((string) $v);
    };

    // tfs2_e( name ) outputs.
    $names = array('brochure_label', 'cost_card_text', 'cost_card_title', 'cost_eyebrow', 'cost_intro', 'cost_title', 'door_staff_eyebrow', 'door_staff_link', 'door_staff_text', 'door_staff_title', 'door_student_eyebrow', 'door_student_link', 'door_student_text', 'door_student_title', 'enroll_label', 'faq_title', 'guides_title', 'hero_buy_label', 'hero_buy_text', 'hero_eyebrow', 'hero_form_intro', 'hero_form_note', 'hero_form_title', 'hero_lede', 'hero_meta', 'hero_talk_label', 'hero_talk_text', 'hero_title', 'note_title', 'outcomes_eyebrow', 'outcomes_intro', 'outcomes_title', 'p6_button', 'p6_eyebrow', 'p6_fine', 'p6_text', 'p6_title', 'planner_card_text', 'planner_card_title', 'planner_eyebrow', 'planner_intro', 'planner_privacy', 'planner_title', 'programme_end', 'programme_eyebrow', 'programme_intro', 'programme_receive', 'programme_title', 'quote_button', 'quote_reply', 'quote_text', 'quote_title', 'quotes_eyebrow', 'quotes_title', 'routes_card_text', 'routes_card_title', 'routes_eyebrow', 'routes_intro', 'routes_title', 'steps_eyebrow', 'steps_intro', 'steps_title', 'taster_card_text', 'taster_card_title', 'taster_eyebrow', 'taster_intro', 'taster_title', 'us_eyebrow', 'us_label', 'us_text', 'us_title', 'vat_note', 'who_title', 'why_title');
    $t = array();
    foreach ($names as $n) {
        $t[$n] = esc_html(tfs2_get($n));
    }

    $variant = 'image' === tfs2_get('hero_variant') ? 'image' : 'form';
    $chloe   = tfs2_img(tfs2_get('chloe_photo'), get_stylesheet_directory_uri() . '/assets/images/tfs-chloe.jpg', 'medium_large');
    $name    = tfs2_get('chloe_name');
    $role    = tfs2_get('chloe_role');
    $email   = tfs2_get('chloe_email');
    $tiers   = tfs2_tiers();
    $n0      = 30;
    $p0      = tfs2_price_for($n0);
    $base    = $tiers ? $tiers[0]['price'] : 0;
    $tier_ix = 0;
    foreach ($tiers as $i => $tr) {
        if ($n0 >= $tr['min'] && $n0 <= $tr['max']) {
            $tier_ix = $i;
        }
    }
    $ordinals = array('one', 'two', 'three', 'four', 'five', 'six');

    $hero_img = '';
    if ('image' === $variant && tfs2_get('hero_image')) {
        $hero_img = $html(wp_get_attachment_image((int) tfs2_get('hero_image'), 'large', false, array('class' => 'tfs2-hero__img', 'loading' => 'eager', 'fetchpriority' => 'high')));
    }

    $proof = array();
    foreach (array_values(array_filter(tfs2_rows('proof_slides'), function ($s) {
        return !empty($s['image']);
    })) as $si => $s) {
        $proof[] = array(
            'img'     => $html(wp_get_attachment_image((int) $s['image'], 'large', false, array('class' => 'tfs2-proof__img', 'loading' => 0 === $si ? 'eager' : 'lazy', 'sizes' => '(max-width: 900px) 100vw, 620px'))),
            'caption' => !empty($s['caption']) ? $e($s['caption']) : '',
            'name'    => !empty($s['name']) ? $e($s['name']) : '',
        );
    }

    $quotes = array();
    foreach (tfs2_rows('quotes') as $q) {
        $quotes[] = array(
            'logo'  => !empty($q['logo']) ? $html(wp_get_attachment_image((int) $q['logo'], 'thumbnail', false, array('class' => 'tfs2-testi__logo', 'loading' => 'lazy', 'alt' => !empty($q['role']) ? $q['role'] . ' crest' : ''))) : '',
            'quote' => $e($q['quote'] ?? ''),
            'name'  => $e($q['name'] ?? ''),
            'role'  => !empty($q['role']) ? $e($q['role']) : '',
        );
    }

    $map = function ($rows, $fields) use ($e) {
        $out = array();
        foreach ($rows as $r) {
            $row = array();
            foreach ($fields as $f) {
                $row[$f] = $e($r[$f] ?? '');
            }
            $out[] = $row;
        }
        return $out;
    };
    $icon_rows = function ($rows, $fields) use ($map) {
        $out = $map($rows, $fields);
        foreach (array_values($rows) as $i => $r) {
            $out[$i]['icon'] = (string) ($r['icon'] ?? '');
        }
        return $out;
    };

    $stats = $icon_rows(tfs2_rows('stats'), array('number', 'label'));
    foreach ($stats as $i => $s) {
        $stats[$i]['label'] = nl2br($s['label']); // nl2br( esc_html( … ) )
    }

    $us_url  = tfs2_get('us_url');
    $us_href = $us_url ? esc_url(tfs2_url($us_url)) : 'mailto:' . esc_attr(antispambot($email)) . '?subject=US%20cohort';

    $slot = function ($field, $label, $variant = 'head') use ($html) {
        return $html(tfs2_slot($field, $label, $variant));
    };

    return array(
        'pid'        => (int) $id,
        'variant'    => $variant,
        'to_form'    => 'form' === $variant ? '#letsTalkTEFL' : '#quote',
        't'          => $t,
        'urls'       => array(
            'permalink'   => $href(esc_url(get_permalink($id))),
            'staff'       => $href(esc_url(tfs2_url(tfs2_get('staff_url')))),
            'students'    => $href(esc_url(tfs2_url(tfs2_get('students_url')))),
            'enroll'      => $href(esc_url(tfs2_get('enroll_url'))),
            'booking'     => $href(esc_url(tfs2_get('booking_url'))),
            'booking_raw' => tefl_native_txt(esc_url(tfs2_get('booking_url'))),
            'buy'         => $href(esc_url(tfs2_get('hero_buy_url'))),
            'brochure'    => $href(esc_url(tfs2_url(tfs2_get('brochure_url')))),
            'privacy'     => $href(esc_url(get_privacy_policy_url() ? get_privacy_policy_url() : home_url('/privacy-policy/'))),
            'us'          => $us_url ? $href($us_href) : tefl_native_txt($us_href),
            'us_book'     => $us_url && false !== strpos($us_url, 'dlopo.com') ? tefl_native_txt(esc_url($us_url)) : '',
        ),
        'hero_img'   => $hero_img,
        'form_html'  => 'form' === $variant ? $html(do_shortcode(wp_kses_post(tfs2_get('hero_form_shortcode')))) : '',
        'proof'      => $proof,
        'proof_label' => tefl_native_txt(esc_attr(tfs2_get('proof_label'))),
        'quotes'     => $quotes,
        'quotes_label' => tefl_native_txt(esc_attr(tfs2_get('quotes_title'))),
        'slots'      => array(
            'outcomes' => $slot('outcomes_image', 'Outcomes image'),
            'cost'     => $slot('cost_image', 'Cost section image'),
            'why'      => $slot('why_image', 'Why schools image'),
            'planner'  => $slot('planner_image', 'Planner image'),
            'routes'   => $slot('routes_image', 'Routes image'),
            'taster'   => $slot('taster_image', 'Taster image', 'side'),
            'faq'      => $slot('faq_image', 'FAQ image', 'side'),
        ),
        'outcomes'   => $icon_rows(tfs2_rows('outcomes'), array('title', 'text')),
        'stats'      => $stats,
        'trust'      => $icon_rows(tfs2_rows('trust'), array('text')),
        'why_cards'  => $map(tfs2_rows('why_cards'), array('title', 'text')),
        'modules'    => $map(tfs2_rows('modules'), array('title', 'text')),
        'steps'      => $map(tfs2_rows('steps'), array('title', 'text')),
        'faqs'       => $map(tfs2_rows('faqs'), array('question', 'answer')),
        'guides'     => array_map(function ($g) use ($e, $href) {
            return array('url' => $href(esc_url($g['url'] ?? '')), 'title' => $e($g['title'] ?? ''), 'text' => $e($g['text'] ?? ''));
        }, tfs2_rows('guides')),
        'cost'       => array(
            'n0'          => $n0,
            'tiers'       => array_map(function ($tr) use ($e) {
                return array('range' => (int) $tr['min'] . ' to ' . (int) $tr['max'], 'price' => $e(tfs2_gbp($tr['price'])));
            }, $tiers),
            'tier_ix'     => $tier_ix,
            'bespoke'     => (int) tfs2_get('bespoke_from'),
            'per_student' => $e($p0 ? tfs2_gbp($p0) : 'Bespoke'),
            'per_student_gbp' => $e(tfs2_gbp($p0)),
            'tier_name'   => 'Tier ' . $e($ordinals[$tier_ix]) . ', ' . ($tiers ? (int) $tiers[$tier_ix]['min'] . ' to ' . (int) $tiers[$tier_ix]['max'] . ' students' : ''),
            'total'       => $e(tfs2_gbp($p0 * $n0)),
            'per_hour'    => $e(tfs2_gbp($p0 / 120, 2)),
            'saving'      => $e($p0 < $base ? 'Save ' . tfs2_gbp(($base - $p0) * $n0) : 'Base rate'),
        ),
        'chloe'      => array(
            'img'      => tefl_native_txt(esc_url($chloe)),
            'name'     => $e($name),
            'name_attr' => tefl_native_txt(esc_attr($name)),
            'role'     => $e($role),
        ),
        'note_body'  => $html(wp_kses_post(tfs2_get('note_body'))),
        'planner'    => tfs2_planner_options(),
    );
}
