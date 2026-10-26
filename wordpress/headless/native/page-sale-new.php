<?php
/**
 * Native template: "Sale Page Template 2026" (page-sale-new.php) — tefl-course-offers.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-sale-new&path=/<cc>/tefl-course-offers/&id=108399
 *
 * Mirrors the template section by section: hero (have_rows('hero_banner'),
 * offer bar with [tefl_timer_shortcode], gifts CTA, banner footer), course
 * cards (price HTML, save %, Klarna instalment, add-to-cart / course links,
 * features), bundle, why us, CTA cards, reviews ([brb_collection id="108607"]),
 * features, Instagram reels, student stories and the journey CTA. Values the
 * template escapes come back as plain text, raw echoes as HTML.
 * Markup: components/promos/SalePage2026.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('page-sale-new', 'tefl_native_page_sale_new');

function tefl_native_page_sale_new($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'page-sale-new.php') {
        return null;
    }
    return array(
        'primary_class' => tefl_native_promos_primary_class(),
        'hero'          => tefl_native_page_sale_new_hero($ctx),
        'courses'       => tefl_native_page_sale_new_courses($ctx),
        'bundle'        => tefl_native_page_sale_new_bundle($ctx),
        'why_us'        => tefl_native_page_sale_new_why_us($ctx),
        'cta_cards'     => tefl_native_page_sale_new_cta_cards($ctx),
        'reviews'       => tefl_native_page_sale_new_reviews($ctx),
        'features'      => tefl_native_page_sale_new_features($ctx),
        'reels'         => tefl_native_page_sale_new_reels($ctx),
        'stories'       => tefl_native_page_sale_new_stories($ctx),
        'journey'       => tefl_native_page_sale_new_journey($ctx),
        'origin'        => tefl_headless_wp_origin(),
        'links'         => array(
            'compare'     => tefl_native_promos_href('/tefl-courses-ireland/'),
            'all_stories' => tefl_native_promos_href('/tefl-case-studies/'),
        ),
    );
}

/** esc_html() / esc_attr() output, as the text the browser shows. */
function tefl_native_page_sale_new_esc($s) {
    return tefl_native_txt(esc_html((string) $s));
}

/** An esc_url()'d link, rewritten like the render. */
function tefl_native_page_sale_new_url($url) {
    return tefl_native_promos_href(esc_url((string) $url));
}

/** An esc_url()'d image URL. */
function tefl_native_page_sale_new_img($url) {
    return tefl_native_promos_src(esc_url((string) $url));
}

/** have_rows('hero_banner') — one entry per row. */
function tefl_native_page_sale_new_hero($ctx) {
    $raw  = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };
    $esc  = 'tefl_native_page_sale_new_esc';
    $rows = array();
    if (!have_rows('hero_banner')) {
        return $rows;
    }
    while (have_rows('hero_banner')) {
        the_row();
        $hero_accreditation = get_field('hero_accreditation', 'option');
        $accreditation_text = $hero_accreditation['accreditation_text'];
        $timer_expiry       = get_field('timer_expiry', 'option');

        $course_ids     = array(3487, 13494, 8880, 8882);
        $students_count = (!empty($course_ids) && function_exists('count_orders_with_products'))
            ? count_orders_with_products($course_ids, 7)
            : 0;
        $enrol_cap  = (int) get_sub_field('total_enrollments');
        $enrol_left = max(0, $enrol_cap - $students_count);

        $sale_ts      = false;
        $timer_active = false;
        if ($timer_expiry) {
            try {
                $sale_ts      = (new DateTime($timer_expiry, wp_timezone()))->getTimestamp();
                $timer_active = ($sale_ts > time());
            } catch (Exception $e) {
                $timer_active = false;
            }
        }
        $sale_end_label = $timer_active ? date('d.m.y', $sale_ts) : '';

        $buttons = array();
        foreach ((array) (get_sub_field('banner_cta_buttons') ?: array()) as $button) {
            $buttons[] = array(
                'type' => $esc($button['button_type']),
                'text' => $raw($button['button_text']),
                'icon' => $button['button_icon'] ? tefl_native_page_sale_new_img($button['button_icon']) : '',
            );
        }

        $offer = null;
        if ($timer_active) {
            $dl = get_sub_field('offer_deadline_prefix');
            $et = get_sub_field('offer_enrolled_text');
            $rt = get_sub_field('offer_remaining_text');
            $offer = array(
                'deadline'  => $esc(trim((($dl !== '' && $dl !== null) ? $dl : 'Limited Time Offer. Sale ends') . ' ' . $sale_end_label)),
                'enrolled'  => $students_count > 0 ? $esc($students_count . ' ' . (($et !== '' && $et !== null) ? $et : 'students enrolled in the last 7 days.')) : null,
                'remaining' => $enrol_left > 0 ? $esc($enrol_left . ' ' . (($rt !== '' && $rt !== null) ? $rt : 'enrollments left at this price!')) : null,
                'timer'     => tefl_native_promos_timer(),
            );
        }

        $gifts_cta = get_sub_field('gifts_section_cta');
        $gift      = null;
        if (!empty($gifts_cta) && (!empty($gifts_cta['title']) || !empty($gifts_cta['icon']))) {
            $gift = array(
                'icon'  => $gifts_cta['icon'] ? tefl_native_page_sale_new_img($gifts_cta['icon']) : '',
                'title' => $gifts_cta['title'] ? $raw($gifts_cta['title']) : '',
                'text'  => $esc(!empty($gifts_cta['cta_text']) ? $gifts_cta['cta_text'] : 'View Now'),
                'link'  => $gifts_cta['cta_link'] ? tefl_native_page_sale_new_url($gifts_cta['cta_link']) : '',
            );
        }

        $show_footer = get_sub_field('show_banner_footer');
        $footer      = get_sub_field('banner_footer');
        $rows[]      = array(
            'bg_desktop'    => tefl_native_promos_src(get_sub_field('background_image_desktop')),
            'bg_mobile'     => tefl_native_promos_src(get_sub_field('background_image_mobile')),
            'title'         => get_sub_field('banner_title') ? $raw(get_sub_field('banner_title')) : '',
            'subtitle'      => get_sub_field('banner_subtitle') ? $raw(get_sub_field('banner_subtitle')) : '',
            'buttons'       => get_sub_field('banner_cta_buttons') ? $buttons : null,
            'accreditation' => !empty($accreditation_text) ? $raw($accreditation_text) : null,
            'offer'         => $offer,
            'gift'          => $gift,
            'footer'        => (!empty($footer) && $show_footer) ? array(
                'icon'     => tefl_native_promos_src($footer['icon']),
                'title'    => $raw($footer['title']),
                'subtitle' => $raw($footer['subtitle']),
                'link'     => tefl_native_promos_href($footer['link']),
            ) : null,
        );
    }
    return $rows;
}

function tefl_native_page_sale_new_courses($ctx) {
    $section = get_field('courses_cta_section');
    if (!$section) {
        return null;
    }
    $esc     = 'tefl_native_page_sale_new_esc';
    $themes  = array('coral', 'cream', 'teal');
    $index   = 0;
    $cards   = array();
    foreach ((array) $section['courses'] as $course) {
        $pid = $course['course_product'];
        $obj = wc_get_product($pid);
        if (!$obj) {
            continue;
        }
        $theme = $themes[$index % count($themes)];
        $index++;

        $regular = $obj->get_regular_price();
        $sale    = $obj->get_sale_price();
        $save    = 0;
        if (is_numeric($regular) && is_numeric($sale) && $regular != 0) {
            $save = round((($regular - $sale) / $regular) * 100);
        }
        $features = array();
        if (!empty($course['course_features'])) {
            $lines = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $course['course_features'])), function ($f) {
                return $f !== '';
            }));
            foreach ($lines as $line) {
                $features[] = $esc($line);
            }
        }

        $course_url = get_permalink($pid);
        $is_300hr   = (stripos($course['course_title'], '300') !== false) || (stripos($obj->get_name(), '300') !== false);
        $enrol_url  = $is_300hr ? $course_url : tefl_native_page_sale_new_add_to_cart_url($obj, $ctx);

        $dg        = $course['download_guide'];
        $dg_text   = is_array($dg) ? ($dg['text'] ?? '') : '';
        $dg_link   = is_array($dg) ? ($dg['link'] ?? '') : '';
        $dg_url    = is_array($dg_link) ? ($dg_link['url'] ?? '') : $dg_link;
        $dg_target = is_array($dg_link) ? ($dg_link['target'] ?? '') : '';
        $dg_icon   = is_array($dg) ? ($dg['image'] ?? '') : '';

        $cards[] = array(
            'pid'         => $esc($pid),
            'theme'       => $esc($theme),
            'bg'          => tefl_native_promos_src(esc_url($course['course_card_bg'])),
            'save'        => $save > 0 ? $esc($save) : null,
            'employer'    => !empty($course['employer_badge']) ? tefl_native_page_sale_new_img($course['employer_badge']) : null,
            'title'       => $esc($course['course_title']),
            'summary'     => $ctx['html'](wp_kses_post($course['course_summary'])),
            'best_for'    => !empty($course['best_for']) ? $esc($course['best_for']) : null,
            'price'       => $ctx['html'](tefl_native_promos_price_html($obj)),
            'installment' => $ctx['html'](tefl_native_promos_geo_price($obj->get_price() / 3)),
            'cc'          => $esc(get_user_geo_country_code()),
            'is_300hr'    => $is_300hr,
            'enrol_url'   => tefl_native_page_sale_new_url($enrol_url),
            'course_url'  => tefl_native_page_sale_new_url($course_url),
            'guide'       => $dg_url ? array(
                'url'    => tefl_native_page_sale_new_url($dg_url),
                'target' => $dg_target ? $esc($dg_target) : '',
                'text'   => $esc($dg_text),
                'icon'   => $dg_icon ? tefl_native_page_sale_new_img($dg_icon) : '',
            ) : null,
            'features'    => !empty($course['course_features']) ? $features : null,
        );
    }
    return array('title' => tefl_native_promos_raw($section['section_title'], $ctx), 'cards' => $cards);
}

/**
 * $product->add_to_cart_url() builds "?add-to-cart=ID" on the CURRENT request
 * URI (add_query_arg()), which here is the REST URL — run it with the page's.
 */
function tefl_native_page_sale_new_add_to_cart_url($obj, $ctx) {
    $saved = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : null;
    $_SERVER['REQUEST_URI'] = $ctx['path'];
    try {
        return $obj->add_to_cart_url();
    } finally {
        $_SERVER['REQUEST_URI'] = $saved;
    }
}

function tefl_native_page_sale_new_bundle($ctx) {
    $section = get_field('course_bundle_section');
    if (!$section) {
        return null;
    }
    $rows = array();
    foreach (array_chunk((array) $section['bundle'], 5) as $row) {
        $items = array();
        foreach ($row as $item) {
            if (!empty($item['course_title'])) {
                $items[] = tefl_native_promos_raw($item['course_title'], $ctx);
            }
        }
        $rows[] = $items;
    }
    return array(
        'title' => $section['section_title'] ? tefl_native_page_sale_new_esc($section['section_title']) : null,
        'worth' => $section['bundle_worth'] ? tefl_native_page_sale_new_esc($section['bundle_worth']) : null,
        'rows'  => $rows,
    );
}

function tefl_native_page_sale_new_why_us($ctx) {
    $why = get_field('why_us_section');
    if (!$why) {
        return null;
    }
    $features = array();
    foreach ((array) $why['features'] as $f) {
        $features[] = array(
            'icon'  => !empty($f['icon']) ? tefl_native_page_sale_new_img($f['icon']) : null,
            'title' => tefl_native_page_sale_new_esc($f['title']),
        );
    }
    return array(
        'image'    => $why['section_image'] ? tefl_native_page_sale_new_img($why['section_image']) : null,
        'title'    => $why['section_title'] ? tefl_native_page_sale_new_esc($why['section_title']) : null,
        'summary'  => $why['section_summary'] ? $ctx['html'](wp_kses_post($why['section_summary'])) : null,
        'features' => !empty($why['features']) ? $features : null,
    );
}

function tefl_native_page_sale_new_cta_cards($ctx) {
    $rows = get_field('cta_cards_section');
    if (empty($rows)) {
        return null;
    }
    $themes = array('teal', 'cream', 'mint');
    $esc    = 'tefl_native_page_sale_new_esc';
    $cards  = array();
    foreach ($rows as $i => $row) {
        $card = isset($row['card']) ? $row['card'] : null;
        if (!is_array($card)) {
            continue;
        }
        $image  = isset($card['image']) ? $card['image'] : '';
        $desc   = isset($card['description']) ? $card['description'] : '';
        $label  = isset($card['label']) ? $card['label'] : '';
        $text   = isset($card['cta_text']) ? $card['cta_text'] : '';
        $link   = isset($card['cta_link']) ? $card['cta_link'] : '';
        $url    = is_array($link) ? (isset($link['url']) ? $link['url'] : '') : $link;
        $target = is_array($link) ? (isset($link['target']) ? $link['target'] : '') : '';
        $cards[] = array(
            'theme'  => $esc($themes[$i % count($themes)]),
            'label'  => $label ? $esc($label) : null,
            'image'  => $image ? tefl_native_page_sale_new_img($image) : null,
            'alt'    => $esc($label),
            'desc'   => $desc ? $ctx['html'](nl2br(esc_html($desc))) : null,
            'cta'    => ($url && $text) ? array(
                'url'    => tefl_native_page_sale_new_url($url),
                'target' => $target ? $esc($target) : '',
                'text'   => $esc($text),
            ) : null,
        );
    }
    return $cards;
}

function tefl_native_page_sale_new_reviews($ctx) {
    $reviews = get_field('review_section');
    $google  = $reviews['google_reviews'] ?? null;
    $tp      = $reviews['trustpilot_reviews'] ?? null;
    $esc     = 'tefl_native_page_sale_new_esc';
    $google_link = 'https://www.google.com/search?sca_esv=8d785069c21da656&sca_upv=1&hl=en-IE&gl=ie&q=The+TEFL+Institute+Ireland+%7C+TEFL+Courses+%26+Certification,+13+Adelaide+Rd,+Saint+Kevin%27s,+Dublin,+D02+P950&uds=ADvngMhDJElofzFqOx8yLCqxrZBfORdohN-zZWd2DtE2wkfY_Hz8LxAbxWyTqbQXp_hpoUOW2uxhpWyrB1IL2IpdWcWiPs5S-vGBywcJzrO9PJe_HdF91Ppndo2Knjst1hsy0DuQ_1Yy71pyrotGeYeqK9tgwKhS1Dz3nAO5HG6XIft-vP8sUXZPMIt75-GkZH8kdUstEDG07k_uQg6GZSA3HkqfKbTCnzBS1_wxYJkYsxPWWzYHd35xJVCoLbwXmLTFBoT-lFXh&si=ACC90nwjPmqJHrCEt6ewASzksVFQDX8zco_7MgBaIawvaF4-7mSRR1kRGE4hCmZtLOUumbi46V_tOIxRTOEjel4eIAxPbsZAzQfZDyayafoOPMus5kIWjD0%3D&sa=X&ved=2ahUKEwixoZaa4Z6HAxUHYEEAHXfKDf8Q3PALegQIGxAE&biw=1536&bih=745&dpr=2';
    return array(
        'title'      => tefl_native_promos_raw($reviews['section_title'] ?? '', $ctx),
        'summary'    => tefl_native_promos_raw($reviews['section_summary'] ?? '', $ctx),
        'google'     => $google ? array(
            'rating' => $esc($google['reviews_rating']),
            'count'  => $esc($google['reviews_count']),
            'link'   => tefl_native_page_sale_new_url($google_link),
        ) : null,
        'trustpilot' => $tp ? array(
            'rating' => $esc($tp['reviews_rating']),
            'icon'   => !empty($tp['reviews_icon']) ? tefl_native_page_sale_new_img($tp['reviews_icon']) : null,
            'count'  => $esc($tp['reviews_count']),
            'link'   => tefl_native_page_sale_new_url('https://uk.trustpilot.com/review/tefl.ie'),
        ) : null,
        'slider'     => tefl_native_promos_shortcode('[brb_collection id="108607"]', $ctx),
    );
}

function tefl_native_page_sale_new_features($ctx) {
    $section = get_field('feature_and_benefits_section') ?? null;
    if (!$section) {
        return null;
    }
    $items = array();
    foreach ((array) $section['features'] as $f) {
        $items[] = array(
            'icon'  => tefl_native_promos_src($f['feature_icon']),
            'title' => tefl_native_promos_raw($f['feature_title'], $ctx),
        );
    }
    return $items;
}

function tefl_native_page_sale_new_reels($ctx) {
    $section = get_field('instagram_reel_section');
    $cta     = $section['social_cta'];
    $reels   = null;
    if ($section) {
        $reels = array();
        foreach ((array) $section['instagram_reel_content'] as $reel) {
            $reels[] = array(
                'video' => tefl_native_page_sale_new_url($reel['reel_video']),
                'thumb' => tefl_native_page_sale_new_img($reel['thumnail_image']),
                'link'  => tefl_native_page_sale_new_url($reel['reel_video_link']),
            );
        }
    }
    return array(
        'title'    => tefl_native_promos_raw($section['social_title'], $ctx),
        'bold'     => tefl_native_promos_raw($section['social_bold_text'], $ctx),
        'reels'    => $reels,
        'cta_link' => tefl_native_page_sale_new_url($cta ? $cta['cta_link'] : null),
        'cta_text' => tefl_native_page_sale_new_esc($cta ? $cta['cta_text'] : null),
    );
}

function tefl_native_page_sale_new_stories($ctx) {
    $section = get_field('student_stories_section');
    if (!$section) {
        return null;
    }
    $esc     = 'tefl_native_page_sale_new_esc';
    $stories = array();
    foreach ((array) $section['stories'] as $key => $story) {
        $stories[] = array(
            'active'  => $key === 2,
            'image'   => !empty($story['student_image']) ? tefl_native_page_sale_new_img($story['student_image']) : null,
            'flag'    => !empty($story['country_flag_image']) ? tefl_native_page_sale_new_img($story['country_flag_image']) : null,
            'label'   => !empty($story['label_text']) ? $esc($story['label_text']) : null,
            'title'   => $esc($story['story_title']),
            'summary' => $ctx['html'](wp_kses_post($story['story_summary'])),
            'link'    => !empty($story['story_link']) ? tefl_native_page_sale_new_url($story['story_link']) : null,
        );
    }
    return array(
        'title'   => $section['section_title'] ? $esc($section['section_title']) : null,
        'summary' => $section['section_summary'] ? $esc($section['section_summary']) : null,
        'bg'      => $section['section_bg_image'] ? tefl_native_page_sale_new_img($section['section_bg_image']) : null,
        'stories' => !empty($section['stories']) ? $stories : null,
    );
}

function tefl_native_page_sale_new_journey($ctx) {
    $banner  = get_field('cta_banner');
    $buttons = get_field('cta_buttons');
    if (!($banner || !empty($buttons))) {
        return null;
    }
    $esc   = 'tefl_native_page_sale_new_esc';
    $title = $banner['banner_title'] ?? '';
    $text  = $banner['cta_text'] ?? '';
    $link  = $banner['cta_link'] ?? '';
    $links = array();
    foreach ((array) $buttons as $btn) {
        $b_title  = $btn['title'] ?? '';
        $b_icon   = $btn['icon'] ?? '';
        $b_link   = $btn['link'] ?? array();
        $b_url    = is_array($b_link) ? ($b_link['url'] ?? '') : $b_link;
        $b_target = is_array($b_link) ? ($b_link['target'] ?? '') : '';
        if (!$b_url && !$b_title) {
            continue;
        }
        $links[] = array(
            'url'    => tefl_native_page_sale_new_url($b_url),
            'target' => $b_target ? $esc($b_target) : '',
            'icon'   => $b_icon ? tefl_native_page_sale_new_img($b_icon) : null,
            'title'  => $esc($b_title),
        );
    }
    return array(
        'banner'  => ($banner && ($title || $text)) ? array(
            'title' => $title ? $esc($title) : null,
            'cta'   => ($text && $link) ? array('text' => $esc($text), 'link' => tefl_native_page_sale_new_url($link)) : null,
        ) : null,
        'links'   => !empty($buttons) ? $links : null,
    );
}
