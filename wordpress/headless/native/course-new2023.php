<?php
/**
 * Native template data: single-course-template-new2023.php (the "new design"
 * course page, ACF is_new_design), with the includes it prints:
 * includes/klarna_label.php, includes/klarna_modal.php, includes/ti-deposit-form.php
 * and includes/virtual-course-variation.php (the timetable).
 *
 * Called by course.php (tefl_native_course_new2023_data); no route of its own.
 * Every value the template computes is resolved here, in the template's order
 * and with its defaults and quirks; components/courses/new2023/CourseNew2023.tsx
 * writes the markup. Returns null for anything it doesn't reproduce (→ passthrough).
 *
 * Server-side geo, as on the page: prices (Price Based on Country), the currency in
 * JSON-LD and the Klarna block follow WC_Geolocation for THIS request.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

function tefl_native_course_new2023_data(int $pid, array $ctx): ?array {
    global $wpdb;
    $html = $ctx['html'];
    $txt  = $ctx['txt'];
    $href = function ($u) use ($ctx) {
        return call_user_func($ctx['href'], html_entity_decode((string) $u, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    };
    $s = function ($v) {
        return is_scalar($v) ? (string) $v : '';
    };
    $raw = function ($v) use ($html, $s) {
        return call_user_func($html, $s($v));
    };
    $attr = function ($v) use ($txt, $s) {
        return call_user_func($txt, $s($v));
    };

    // Wrapper (single-course.php) variables the design reads.
    $course_id        = $pid;
    $is_virtual_couse = get_field('is_virtual_couse');
    $course_category  = wp_get_post_terms($course_id, 'course_category', array('fields' => 'ids'));
    $course_category  = is_array($course_category) ? $course_category : array();

    // Page styling options (unset → the template prints '').
    $course_title_underline_color = $interactive_course_label_border_color = $savings_label_color = '';
    $active_bg_color = $active_text_color = $inactive_bg_color = $inactive_text_color = '';
    $view_all_reviews_button_styling = null;
    $single_course_page_styling = get_field('single_course_page_styling', 'option');
    if (isset($single_course_page_styling) && !is_array_empty($single_course_page_styling)) {
        $st = $single_course_page_styling;
        $course_title_underline_color          = !empty($st['course_title_underline_color']) ? $st['course_title_underline_color'] : '#1c1c1b';
        $interactive_course_label_border_color = !empty($st['interactive_course_label_border_color']) ? $st['interactive_course_label_border_color'] : '#1c1c1b';
        $savings_label_color                   = !empty($st['savings_label_color']) ? $st['savings_label_color'] : '#1c1c1b';
        $sw                  = $st['pay_in_deposit_switcher_button_styling'] ?? array();
        $active_bg_color     = !empty($sw['active_bg_color']) ? $sw['active_bg_color'] : '#1c1c1b';
        $active_text_color   = !empty($sw['active_text_color']) ? $sw['active_text_color'] : '#fff';
        $inactive_bg_color   = !empty($sw['inactive_bg_color']) ? $sw['inactive_bg_color'] : '#cccccc';
        $inactive_text_color = !empty($sw['inactive_text_color']) ? $sw['inactive_text_color'] : '#fff';
        $view_all_reviews_button_styling = $st['view_all_reviews_button_styling'] ?? null;
    }

    // Product (the template calls methods on it unguarded: no product = fatal on live).
    $course_product_id = get_field('course_product');
    if (!is_scalar($course_product_id) || !$course_product_id) {
        return null;
    }
    $course_product = wc_get_product($course_product_id);
    if (!$course_product) {
        return null;
    }
    $course_price       = tefl_native_course_new2023_price_html($course_product);
    $course_price_value = $course_product->get_price();
    $full_price         = $course_price_value;
    $trial              = get_field('trial');
    $guide              = get_field('guide');

    $save_percentage    = null;
    $simple_regular_price = $course_product->get_regular_price();
    $simple_sale_price    = $course_product->get_sale_price();
    if (is_numeric($simple_regular_price) && is_numeric($simple_sale_price) && $simple_regular_price != 0) {
        $save_percentage = round((($simple_regular_price - $simple_sale_price) / $simple_regular_price) * 100);
    }

    $hero_banner = get_field('hero_banner');
    $hero_banner = is_array($hero_banner) ? $hero_banner : array();
    $banner_img  = $hero_banner['banner_image'] ?? '';
    $banner_CTA  = $hero_banner['banner_cta'] ?? array();
    $CTA_btns    = $banner_CTA['banner_cta_buttons'] ?? array();
    $btn1_txt    = $CTA_btns['button1']['button1_text'] ?? '';
    $btn2_txt    = $CTA_btns['button2']['button2_text'] ?? '';
    $CTA_title   = $banner_CTA['banner_cta_title'] ?? '';
    $CTA_txt     = $banner_CTA['banner_cta_text'] ?? '';
    $CTA_stitle  = $banner_CTA['banner_cta_subtitle'] ?? '';

    $deposit_enabled      = get_post_meta($course_product_id, '_wc_deposit_enabled', true);
    $deposit_payment_plan = '';
    if ($deposit_enabled == 'forced' || $deposit_enabled == 'optional') {
        $deposit_payment_plan = get_post_meta($course_product_id, '_wc_deposit_payment_plans', true);
        $deposit_payment_plan = is_array($deposit_payment_plan) ? ($deposit_payment_plan[0] ?? null) : null;
    }
    $deposit_class   = '';
    $deposit_percent = 0;
    if ($deposit_payment_plan) {
        if (!is_numeric($deposit_payment_plan)) {
            return null;
        }
        $deposit_class   = 'deposit-full-price payment-plan-' . $deposit_payment_plan;
        $deposit_percent = $wpdb->get_var('SELECT amount FROM `wp_wc_deposits_payment_plans_schedule` WHERE `schedule_index` = 0 AND `plan_id` = ' . (int) $deposit_payment_plan);
        $deposit_percent = round((float) $deposit_percent / 100, 5);
    }
    $fixed_99   = ENABLE_99 && $deposit_payment_plan == 6;
    $fixed_3995 = ENABLE_99 && $deposit_payment_plan == 7;

    // Course JSON-LD, as printed.
    $ld_course = '
{
    "@context": "http://schema.org",
    "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Online",
        "courseWorkload": "PT150H",
        "startDate": "2025-05-01",
        "endDate": "2025-10-28"
    },
    "CourseInstance": "",
    "courseMode": [
        "online"
    ],
    "@type": "Course",
    "name": "' . get_the_title() . '",
    "description": ' . json_encode($CTA_txt) . ',
    "url": "' . get_the_permalink() . '",
    "timeRequired": "PT' . (get_field('time_required') ? get_field('time_required') : 30) . 'H",
    "offers": {
        "category": "TEFL",
        "@type": "Offer",
        "price": "' . $course_price_value . '",
        "priceCurrency": "' . get_woocommerce_currency() . '",
        "validFrom": "' . date('y-m-d') . '"
    },
    "typicalAgeRange": "16+",
    "inLanguage": "en-US",
    "provider": {
        "@type": "Organization",
        "name": "TEFL Institute",
        "sameAs": "https://teflinstitute.com"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": 4.91,
        "reviewCount": 540
    }
}
';

    // Top bar.
    $top_bar = null;
    $black_bar_content = get_field('black_bar_content', 'options');
    if ($black_bar_content) {
        $top_bar = array();
        foreach (tefl_native_course_new2023_arr($black_bar_content['content'] ?? array()) as $bbc) {
            if (!empty($bbc['text'])) {
                $top_bar[] = $raw($bbc['text']);
            }
        }
    }

    // Klarna.
    $current_cc  = get_user_geo_country_code();
    $show_klarna = in_array($current_cc, array('AT', 'BE', 'CZ', 'DK', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'NL', 'NO', 'PL', 'PT', 'SE', 'CH', 'GB'))
        && in_array($pid, array(47, 745, 70837, 62237, 71925, 70830));
    if ($show_klarna && !is_numeric($full_price)) {
        return null;
    }
    $klarna_third = $show_klarna ? $html(geo_price($full_price / 3)) : '';

    // Deposit form (includes/ti-deposit-form.php).
    $deposit = null;
    if ($deposit_payment_plan) {
        $deposit = tefl_native_course_new2023_deposit_form($course_product_id, $deposit_enabled);
        if ($deposit === false) {
            return null;
        }
    }

    // "Select two courses" (9689 / 743 / 2704) instead of the callback button.
    $select_two = null;
    if ($pid === 9689 || $pid === 743 || $pid === 2704) {
        $select_two = array('defaults' => '62238,70828', 'products' => array());
        foreach (array(62238, 70828, 71500, 70829) as $product_id) {
            $product = wc_get_product($product_id);
            if ($product) {
                $raw_name   = $product->get_name();
                $cutoff     = mb_strpos($raw_name, '– Regulatory ref');
                $clean_name = $cutoff !== false ? trim(mb_substr($raw_name, 0, $cutoff)) : $raw_name;
                $select_two['products'][] = array('pid' => (string) $product_id, 'name_html' => $html($clean_name), 'name_attr' => $txt(htmlspecialchars($clean_name)));
            }
        }
        if (empty($select_two['products'])) {
            $select_two = array('defaults' => '', 'products' => array(), 'empty' => true);
        }
    }

    $trustpilot_tag = '';
    $course_title   = get_the_title();
    if (strpos($course_title, '120') !== false) {
        $trustpilot_tag = '120';
    } elseif (strpos($course_title, '180') !== false) {
        $trustpilot_tag = '180';
    } elseif (strpos($course_title, '240') !== false) {
        $trustpilot_tag = '240';
    } elseif (strpos($course_title, '300') !== false || strpos($course_title, '310') !== false) {
        $trustpilot_tag = 'L5';
    }

    // Banner logo column.
    $logos = array(); // [src, class, link]
    $common_hero_banner_logo = get_field('common_hero_banner_logo', 'option');
    $show_alternate_logo     = $common_hero_banner_logo['show_alternate_logo'] ?? null;
    if (!empty($hero_banner['banner_has_logo']) && !empty($hero_banner['banner_logo'])) {
        $logos[] = array('src' => $s($hero_banner['banner_logo']), 'class' => 'banner-slide__content-logo', 'link' => empty($hero_banner['banner_logo_link']) ? '' : $href($hero_banner['banner_logo_link']));
    } else {
        $common_banner_logo = $common_hero_banner_logo['common_banner_logo'] ?? '';
        $selected_courses   = !empty($common_hero_banner_logo['selected_courses']) ? $common_hero_banner_logo['selected_courses'] : array();
        $alternate_selected_courses = array();
        $alternate_common_banner_logo = '';
        if ($show_alternate_logo) {
            $alternate_common_banner_logo = $common_hero_banner_logo['alternate_common_banner_logo'] ?? '';
            $alternate_selected_courses   = !empty($common_hero_banner_logo['alternate_selected_courses']) ? $common_hero_banner_logo['alternate_selected_courses'] : array();
            foreach ($alternate_selected_courses as $course) {
                $key = array_search($course, $selected_courses);
                if ($key !== false) {
                    unset($selected_courses[$key]);
                }
            }
        }
        if (in_array($course_id, tefl_native_course_new2023_arr($selected_courses)) && !empty($common_banner_logo)) {
            $logos[] = array('src' => $s($common_banner_logo), 'class' => 'common-logo banner-slide__content-logo', 'link' => '');
        }
        if ($show_alternate_logo && in_array($course_id, tefl_native_course_new2023_arr($alternate_selected_courses)) && !empty($alternate_common_banner_logo)) {
            $logos[] = array('src' => $s($alternate_common_banner_logo), 'class' => 'alternate-common-logo common-logo banner-slide__content-logo', 'link' => '');
        }
    }

    // Free bundle (gifts section itself is `if (false)`).
    $course_gifts_section = get_field('course_gifts_section', 'option');
    $show_gifts_section   = $course_gifts_section['show_gifts_section'] ?? null;
    $free_bundle          = null;
    $fb                   = get_field('free_bundle_section', 'option');
    $fb_selected          = !empty($fb['selected_courses']) ? $fb['selected_courses'] : array();
    if ($show_gifts_section && in_array($course_id, $fb_selected)) {
        $label   = !empty($fb['section_label']) ? $fb['section_label'] : '';
        $title   = !empty($fb['section_title']) ? $fb['section_title'] : '';
        $summary = !empty($fb['section_summary']) ? $fb['section_summary'] : '';
        $image   = !empty($fb['section_image']) ? $fb['section_image'] : '';
        $caption = !empty($fb['image_caption']) ? $fb['image_caption'] : 'Add 4 high value TEFL skills to your CV:';
        $free_bundle = array(
            'label'   => $label ? $txt(esc_html($label)) : '',
            'title'   => $title ? $txt(esc_html(geo_replace_currency($title))) : '',
            'summary' => $summary ? $html(wp_kses_post(geo_replace_currency_default(nl2br($summary)))) : '',
            'image'   => $image ? $txt(esc_url($image)) : '',
            'caption' => $txt(esc_html($caption)),
            'alt'     => $txt(esc_attr($title)),
        );
    }

    // Course detail tabs.
    $tabs = array();
    $new_course_details_tabs = get_field('new_course_details_tabs');
    foreach (tefl_native_course_new2023_arr($new_course_details_tabs) as $key => $tab) {
        $extra = $tab['extra_tab_content'] ?? '';
        $t = array(
            'title'   => $raw($tab['tab_title'] ?? ''),
            'heading' => $raw(!empty($tab['tab_content_title']) ? $tab['tab_content_title'] : ($tab['tab_title'] ?? '')),
            'extra'   => $attr($extra),
            'content' => $raw($tab['tab_content'] ?? ''),
            'faq'     => null,
            'accordion' => null,
        );
        $tab_faq_content = $tab['tab_faq_content'] ?? null;
        if (!empty($tab_faq_content) && $extra === 'faq-content') {
            $faq_questions = get_cfvalue_by_country('frequently_asked_questions');
            if (is_array_empty($faq_questions)) {
                $faq_questions = $tab_faq_content['faq_questions'];
            }
            $items = array();
            $ld    = array();
            foreach (tefl_native_course_new2023_arr($faq_questions) as $faq) {
                $ld[]    = ' {
                                                                "@type": "Question",
                                                                "name": ' . json_encode($faq['question']) . ',
                                                                "acceptedAnswer": {
                                                                    "@type": "Answer",
                                                                    "text": ' . json_encode($faq['answer']) . '
                                                                }
                                                            }
                                                        ';
                $items[] = array('q' => $raw($faq['question']), 'a' => $raw($faq['answer']));
            }
            $t['faq'] = array(
                'ld'    => '
                                                {
                                                    "@context": "https://schema.org",
                                                    "@type": "FAQPage",
                                                    "mainEntity": [
                                                        ' . implode(',', $ld) . '
                                                    ]
                                                }
                                            ',
                'items' => $items,
            );
        }
        if ($extra != 'faq-content' && $extra === 'accordion-content') {
            $acc = array();
            foreach (tefl_native_course_new2023_arr($tab['tab_accordian_content']['accordion'] ?? array()) as $k => $a) {
                $acc[] = array(
                    'key'      => (string) $k,
                    'title'    => $raw($a['accordion_title'] ?? ''),
                    'subtitle' => $raw($a['accordion_subtitle'] ?? ''),
                    'content'  => empty($a['accordion_content']) ? '' : $raw($a['accordion_content']),
                );
            }
            $t['accordion'] = $acc;
        }
        $tabs[] = $t;
    }

    // Virtual course: summary + timetable (includes/virtual-course-variation.php).
    $virtual = null;
    if ($is_virtual_couse) {
        if (get_post_type($pid) !== 'course') {
            return null; // virtual-course-location-variation.php isn't ported
        }
        $virtual = array(
            'summary'   => get_field('summary_of_course') ? $raw(get_field('summary_of_course')) : '',
            'product'   => (string) $course_product_id,
            'flexible'  => $href('/?addtimetocart&prid=' . $course_product_id . '&date=Flexible - Book now and select your preferred dates and times later'),
            'day_light' => (string) DAY_LIGHT_SAVINGS,
            'tabs'      => array(),
        );
        $dl = DAY_LIGHT_SAVINGS;
        foreach (array(
            'london'      => $dl == 0 ? '01:00' : '00:00',
            'boston'      => $dl == 0 ? '-04:00' : '-05:00',
            'vancouver'   => $dl == 0 ? '-07:00' : '-08:00',
            'southafrica' => $dl === 0 ? '+02:00' : '+01:00',
        ) as $name => $offset) {
            $virtual['tabs'][] = tefl_native_course_new2023_timetable($offset, $ctx) + array('name' => $name);
        }
    }

    // Level 5 videos.
    $level5 = null;
    if (in_array(19, $course_category) || $course_id == 825 || $course_id == 2704) {
        $lv = get_field('level_5_tefl_courses_videos', 'options');
        if ($lv) {
            $videos = array();
            foreach (tefl_native_course_new2023_arr($lv['videos'] ?? array()) as $video) {
                $link     = $video['video_link'] ?? '';
                $videos[] = array('link' => $href($link), 'thumb' => 'https://img.youtube.com/vi/' . getYouTubeVideoId($link) . '/hqdefault.jpg');
            }
            $level5 = array('heading' => $raw($lv['section_heading'] ?? ''), 'videos' => $videos);
        }
    }

    // Course features.
    $features = null;
    if (have_rows('course_features')) {
        $course_features = get_field('course_features');
        $elt   = get_field('elt_cta_box', 'option');
        $sal   = get_field('salary_calculator_cta', 'option');
        $hl    = get_field('highlighted_features', 'option');
        $items = array();
        foreach (tefl_native_course_new2023_arr($course_features['features'] ?? array()) as $feature) {
            $heading = $s($feature['feature_heading'] ?? '');
            $items[] = array(
                'heading' => $raw($heading),
                'content' => $raw($feature['feature_content'] ?? ''),
                'verify'  => strcasecmp(trim($heading), 'Easy employer verification') === 0
                    ? $html(tefl_native_capture(function () {
                        echo do_shortcode('[custom_cert_identifier]');
                    }))
                    : null,
            );
        }
        $features = array(
            'elt'         => !empty($elt) ? array('title' => $raw($elt['cta_title'] ?? ''), 'text' => $raw($elt['cta_text'] ?? ''), 'btn' => $raw($elt['cta_button_text'] ?? ''), 'link' => $href($elt['cta_button_url'] ?? '')) : null,
            'salary'      => !empty($sal) ? array('title' => $raw($sal['cta_title'] ?? ''), 'text' => $raw($sal['cta_text'] ?? ''), 'btn' => $raw($sal['cta_button_text'] ?? ''), 'link' => $href($sal['cta_button_url'] ?? '')) : null,
            'items'       => $items,
            'highlighted' => !empty($hl) ? array_map(function ($f) use ($raw) {
                return $raw($f['feature_text'] ?? '');
            }, tefl_native_course_new2023_arr($hl)) : null,
            'europass'    => in_array($pid, array(743, 838, 825, 2704, 70837, 62237, 71925, 70830)),
            'guide'       => !empty($guide['value']) ? array('link' => $href($guide['link'] ?? ''), 'value' => $raw($guide['value'])) : null,
        );
    }

    $search_html = $html(tefl_native_capture(function () {
        echo do_shortcode('[tefl_course_search]');
    }));

    // Student reviews.
    $reviews = null;
    $student_reviews_section = get_field('student_reviews_section');
    if (!empty($student_reviews_section)) {
        $rw    = get_field('reviews_widget', 'option');
        $total = isset($rw['total_reviews']) ? $rw['total_reviews'] : 1570;
        $p5 = isset($rw['star_percentage_5']) ? (float) $rw['star_percentage_5'] : 0;
        $p4 = isset($rw['star_percentage_4']) ? (float) $rw['star_percentage_4'] : 0;
        $p3 = isset($rw['star_percentage_3']) ? (float) $rw['star_percentage_3'] : 0;
        $p2 = isset($rw['star_percentage_2']) ? (float) $rw['star_percentage_2'] : 0;
        $p1 = isset($rw['star_percentage_1']) ? (float) $rw['star_percentage_1'] : 0;
        $avg  = (($p5 * 5) + ($p4 * 4) + ($p3 * 3) + ($p2 * 2) + ($p1 * 1)) / 100;
        $bars = array();
        for ($i = 5; $i >= 1; $i--) {
            $sp = $rw['star_percentage_' . $i] ?? null;
            if (empty($sp)) {
                $sp = 0;
            }
            $bars[] = array('star' => (string) $i, 'pct' => (string) $sp);
        }
        $vb = $view_all_reviews_button_styling;
        $reviews = array(
            'heading'  => $raw($student_reviews_section['section_heading'] ?? ''),
            'image'    => $s($student_reviews_section['section_image'] ?? ''),
            'average'  => (string) $avg,
            'total'    => $s($total),
            'btn_text' => !empty($vb['button_text_color']) ? $s($vb['button_text_color']) : '#ffffff',
            'btn_bg'   => !empty($vb['button_bg_color']) ? $s($vb['button_bg_color']) : '#1c1c1b',
            'bars'     => $bars,
            'slider'   => $html(tefl_native_capture(function () {
                echo do_shortcode('[brb_collection id="76302"]');
            })),
        );
    }

    // Trial.
    $trial_out = null;
    if (is_array($trial) && ($trial['toggle'] ?? null) == true) {
        $trial_out = array(
            'image'   => $s($trial['image'] ?? ''),
            'title'   => $raw($trial['title'] ?? ''),
            'content' => $raw($trial['content'] ?? ''),
            'link'    => $href($trial['cta']['link'] ?? ''),
            'value'   => $raw($trial['cta']['value'] ?? ''),
        );
    }

    // Course offer (sale_courses). The template reuses $course_product_id inside the loop.
    $offers = null;
    if (have_rows('sale_courses') && $pid != 90318 && $pid != 93278) {
        $offers = array();
        $teaching_resources = get_field('teaching_resources', 'option');
        $tr = array();
        if ($teaching_resources) {
            foreach (tefl_native_course_new2023_arr($teaching_resources) as $tc) {
                $tr[] = array(
                    'pid'      => $attr($tc['product'] ?? ''),
                    'name'     => $txt(htmlspecialchars($s($tc['product_name'] ?? ''))),
                    'desc'     => $txt(htmlspecialchars($s($tc['resources_description'] ?? ''))),
                    'pagelink' => $txt(htmlspecialchars($s($tc['resource_page_link'] ?? ''))),
                    'name_html' => $raw($tc['product_name'] ?? ''),
                );
            }
        }
        foreach (tefl_native_course_new2023_arr(get_field('sale_courses')) as $key => $sale_course) {
            $course            = $sale_course['course'] ?? null;
            $course_product_id = get_field('course_product', $course);
            $offer_price       = '';
            $add_to_cart_link  = '';
            if ($course_product_id) {
                $cp = wc_get_product($course_product_id);
                if ($cp) {
                    $offer_price = tefl_native_course_new2023_price_html($cp);
                }
                $add_to_cart_link = site_url() . '?addtimetocart&prid=' . $course_product_id;
            }
            $excluded_courses = get_field('excluded_courses', 'options');
            $excluded_courses = $excluded_courses ? $excluded_courses : array();
            $timer_expiry     = '';
            if (!in_array($course_id, $excluded_courses)) {
                $timer_expiry = get_field('timer_expiry', 'options');
            }
            $includes = !empty($sale_course['includes']) ? array_filter($sale_course['includes']) : array();
            $excludes = !empty($sale_course['excludes']) ? array_filter($sale_course['excludes']) : array();
            $freebies = array();
            foreach (tefl_native_course_new2023_arr($sale_course['freebie_courses'] ?? array()) as $fc) {
                $fp = '';
                if (!empty($fc['product'])) {
                    $fprod = wc_get_product($fc['product']);
                    if ($fprod) {
                        $fp = tefl_native_course_new2023_price_html($fprod);
                    }
                }
                $freebies[] = array('icon' => $s($fc['icon'] ?? ''), 'title' => !empty($fc['title']) ? $html($s($fc['title']) . ($fp ? ' worth ' . $fp : '')) : '');
            }
            $others = array();
            foreach (tefl_native_course_new2023_arr($sale_course['other_freebie'] ?? array()) as $of) {
                $others[] = array('icon' => $s($of['icon'] ?? ''), 'title' => !empty($of['title']) ? $raw($of['title']) : '');
            }
            $offers[] = array(
                'first'     => $key === 0,
                'title'     => $raw($sale_course['course_title'] ?? ''),
                'show_incexc' => !empty($sale_course['includes']) || !empty($sale_course['excludes']),
                'includes'  => array_values(array_map(function ($i) use ($raw) {
                    return $raw($i['content'] ?? '');
                }, $includes)),
                'excludes'  => array_values(array_map(function ($i) use ($raw) {
                    return $raw($i['content'] ?? '');
                }, $excludes)),
                'image'     => !empty($sale_course['course_image']) ? $s($sale_course['course_image']) : '',
                'timer'     => ($timer_expiry && !is_global_timer_expired()) ? $attr($timer_expiry) : '',
                'price'     => $offer_price,
                'resources' => $teaching_resources ? $tr : null,
                'show_freebies' => !empty($sale_course['freebie_courses']) || !empty($sale_course['other_freebie']),
                'freebies'  => !empty($sale_course['freebie_courses']) ? $freebies : array(),
                'others'    => !empty($sale_course['other_freebie']) ? $others : array(),
                'enrol'     => $add_to_cart_link ? $href(get_home_url() . '/?addtimetocart&prid=' . $course_product_id) : '',
            );
        }
    }

    // Instructors.
    $instructors = null;
    $iis = get_field('instructors_info_section', 'option');
    if (!empty($iis)) {
        $instructors = array(
            'heading'    => $raw($iis['section_heading'] ?? ''),
            'subheading' => $raw($iis['section_subheading'] ?? ''),
            'summary'    => $raw($iis['section_summary'] ?? ''),
            'items'      => array_map(function ($i) use ($s, $raw) {
                return array('image' => $s($i['image'] ?? ''), 'name' => $raw($i['name'] ?? ''), 'designation' => $raw($i['designation'] ?? ''));
            }, tefl_native_course_new2023_arr($iis['instructors'] ?? array())),
        );
    }

    // Salary calculator CTA bar.
    $salary_bar = null;
    $scb = get_field('salary_calculator_cta_bar', 'options');
    if (!empty($scb)) {
        $salary_bar = array('content' => $raw($scb['bar_content'] ?? ''), 'text' => $raw($scb['cta_button_text'] ?? ''), 'link' => $href($scb['cta_button_url'] ?? ''));
    }

    // IELTS guide block.
    $ielts = null;
    $icb   = get_field('ielts_cta_block', 'option');
    $where = !empty($icb['where_to_show']) ? $icb['where_to_show'] : array();
    $cb    = $icb['cta_block'] ?? null;
    if (in_array($pid, $where) && !is_array_empty($cb)) {
        $btn   = $cb['block_cta_button'] ?? array();
        $ielts = array(
            'title'      => $raw($cb['block_title'] ?? ''),
            'summary'    => $raw($cb['block_summary'] ?? ''),
            'image'      => $s($cb['block_image'] ?? ''),
            'bg'         => !empty($cb['block_bg_color']) ? $s($cb['block_bg_color']) : '#ffffff',
            'color'      => !empty($cb['block_text_color']) ? $s($cb['block_text_color']) : '#1c1c1b',
            'cta_text'   => $raw($btn['cta_text'] ?? ''),
            'cta_link'   => $href($btn['cta_link'] ?? ''),
            'btn_bg'     => !empty($btn['button_bg_color']) ? $s($btn['button_bg_color']) : '#1c1c1b',
            'btn_color'  => !empty($btn['button_text_color']) ? $s($btn['button_text_color']) : '#ffffff',
        );
    }

    // Certificate review.
    $certificate = null;
    $cr = get_field('certificate_review');
    if (!empty($cr) && $pid != 101642) {
        $show_transcript = $cr['show_certificate_transcript_image'] ?? null;
        $tvm = get_field('teaching_video_masterclass');
        if (is_array($tvm)) {
            $tvm = array_filter($tvm);
        }
        $certificate = array(
            'title'      => $raw($cr['certificate_review_title'] ?? ''),
            'image'      => $s($cr['certificate_review_image'] ?? ''),
            'transcript' => $show_transcript ? $s($cr['certificate_transcript'] ?? '') : null,
            'buttons'    => !empty($cr['certificate_review_buttons']) ? array_map(function ($b) use ($raw, $href) {
                return array('text' => $raw($b['button_text'] ?? ''), 'link' => $href($b['button_link'] ?? ''), 'primary' => !empty($b['is_primary']));
            }, tefl_native_course_new2023_arr($cr['certificate_review_buttons'])) : null,
            'masterclass' => !empty($tvm) ? array(
                'heading' => $raw($tvm['heading'] ?? ''),
                'image'   => $s($tvm['image'] ?? ''),
                'buttons' => array_map(function ($b) use ($raw, $href) {
                    return array('text' => $raw($b['button_text'] ?? ''), 'link' => $href($b['button_link'] ?? ''), 'primary' => !empty($b['is_primary']));
                }, tefl_native_course_new2023_arr($tvm['cta_buttons'] ?? array())),
            ) : null,
        );
    }

    // Accreditation.
    $accreditation = null;
    $ta = get_field('tefl_accreditation');
    if (!empty($ta)) {
        $is_ofqual = !empty($ta['is_ofqual']);
        $level5ids = in_array((string) $pid, array('836', '838', '743', '825', '2704'), true);
        $common = get_field('common_accreditation', 'option');
        if ($level5ids || $is_ofqual) {
            $common = get_field('level_5_common_accreditation', 'option');
        }
        $ofqual = null;
        if ($level5ids || $is_ofqual) {
            $os     = get_field('ofqual_accreditation_section', 'options');
            $ofqual = array('image' => $s($os['image'] ?? ''), 'content' => !empty($os['content']) ? $raw($os['content']) : '');
        }
        $accreditation = array(
            'heading'    => $raw(!empty($ta['section_heading']) ? $ta['section_heading'] : 'TEFL Accreditation with The TEFL Institute'),
            'subheading' => $raw(!empty($ta['section_subheading']) ? $ta['section_subheading'] : 'Ranked Number #1 TEFL Trainer by Schools and Employers Worldwide'),
            'ofqual'     => $ofqual,
            'own'        => (!empty($ta['image']) && !empty($ta['title'])) ? array('image' => $s($ta['image']), 'title' => $raw($ta['title']), 'subtitle' => $raw($ta['subtitle'] ?? '')) : null,
            'common'     => have_rows('common_accreditation', 'option') ? array_map(function ($c) use ($s, $raw, $href) {
                return array('logo' => $s($c['logo'] ?? ''), 'title' => $raw($c['title'] ?? ''), 'subtitle' => $raw($c['subtitle'] ?? ''), 'link' => $href($c['link'] ?? ''));
            }, tefl_native_course_new2023_arr($common)) : array(),
        );
    }

    // Graduate video testimonials.
    $testimonials = null;
    $gts = get_field('graduate_testimonials_section', 'option');
    if (!empty($gts)) {
        $testimonials = array(
            'heading' => $raw($gts['section_heading'] ?? ''),
            'slides'  => array_map(function ($sl) use ($s, $raw, $href) {
                return array(
                    'image'    => $s($sl['review_image'] ?? ''),
                    'title'    => $raw($sl['review_title'] ?? ''),
                    'subtitle' => $raw($sl['review_slider_subtitle'] ?? ''),
                    'snippet'  => $raw($sl['review_snippet'] ?? ''),
                    'link'     => $href($sl['review_link'] ?? ''),
                );
            }, tefl_native_course_new2023_arr($gts['graduate_review_slider'] ?? array())),
        );
    }

    $funding = null;
    if (in_array(19, $course_category) || in_array(18, $course_category)) {
        $fc = get_field('funding_content', 'options');
        if ($fc) {
            $funding = $raw($fc);
        }
    }

    // Popular resources.
    $resources = null;
    $prs = get_field('popular_resources_section', 'option');
    if (!empty($prs)) {
        $resources = array(
            'heading' => $raw($prs['section_heading'] ?? ''),
            'cards'   => array_map(function ($r) use ($s, $raw, $href) {
                return array(
                    'title'   => $raw($r['heading'] ?? ''),
                    'image'   => $s($r['image'] ?? ''),
                    'summary' => $raw($r['summary'] ?? ''),
                    'buttons' => array_map(function ($b) use ($raw, $href) {
                        return array('link' => $href($b['button_link'] ?? ''), 'text' => $raw($b['button_text'] ?? ''));
                    }, tefl_native_course_new2023_arr($r['cta_buttons'] ?? array())),
                );
            }, tefl_native_course_new2023_arr($prs['recourses_column'] ?? array())),
        );
    }

    // Virtual: three FAQ posts.
    $virtual_faqs = null;
    if ($is_virtual_couse) {
        $virtual_faqs = array();
        foreach (get_posts(array('numberposts' => 3, 'post_type' => 'faqs')) as $fq) {
            $img     = get_the_post_thumbnail_url($fq->ID, 'full');
            $content = apply_filters('the_content', $fq->post_content);
            $url     = get_post_permalink($fq->ID);
            $virtual_faqs[] = array(
                'img'     => !empty($img) ? $s($img) : '',
                'title'   => !empty($fq->post_title) ? $html($fq->post_title) : '',
                'content' => !empty($content) ? $html(tefl_headless_cookie_block($content)) : '',
                'url'     => !empty($url) ? $href($url) : '',
            );
        }
    }

    $learn_more = null;
    $lms = get_field('learn_more_section', 'option');
    if (!empty($lms)) {
        $learn_more = array('link' => $href($lms['section_cta_button_link'] ?? ''));
    }

    return array(
        'primary_class' => tefl_native_course_primary_class(),
        'ld_course'     => $ld_course,
        'top_bar'       => $top_bar,
        'hero'          => array(
            'bg'           => $s($banner_img),
            'interactive'  => in_array($pid, array(743, 2704, 838, 825)),
            'border_color' => $s($interactive_course_label_border_color),
            'subtitle'     => $raw($CTA_stitle),
            'title'        => $raw($CTA_title),
            'flex_title'   => $pid === 812 || $pid === 62237,
            'logo_before'  => $pid === 812,
            'logo_after'   => $pid === 62237,
            'underline'    => $s($course_title_underline_color),
            'klarna'       => $show_klarna,
            'klarna_third' => $klarna_third,
            'fixed_3995'   => $fixed_3995 ? '1' : '',
            'fixed_99'     => $fixed_99 ? '1' : '',
            'deposit_percent' => (string) $deposit_percent,
            'deposit_class'   => $deposit_class,
            'price'        => $course_price,
            'save'         => ($save_percentage && $save_percentage > 0) ? (string) $save_percentage : '',
            'savings_color' => $s($savings_label_color),
            'extra_info'   => !empty(get_field('course_extra_info')) ? $raw(get_field('course_extra_info')) : '',
            'deposit'      => $deposit,
            'deposit_colors' => array($s($active_bg_color), $s($active_text_color), $s($inactive_bg_color), $s($inactive_text_color)),
            'summary'      => $raw($CTA_txt),
            'select_two'   => $select_two,
            'btn1'         => $raw($btn1_txt),
            'btn2'         => $raw($btn2_txt),
            'virtual'      => (bool) $is_virtual_couse,
            'enrol'        => $href(get_home_url() . '/?addtimetocart&prid=' . get_field('course_product')),
            'tp_tags'      => $s(get_field('trustpilot_tag') ?: 'content'),
            'tp_tag'       => $trustpilot_tag,
            'logos'        => $logos,
        ),
        'free_bundle'   => $free_bundle,
        'tabs'          => $tabs,
        'virtual'       => $virtual,
        'level5'        => $level5,
        'features'      => $features,
        'search_html'   => $search_html,
        'reviews'       => $reviews,
        'trial'         => $trial_out,
        'offers'        => $offers,
        'btn2'          => $raw($btn2_txt),
        'is_virtual'    => (bool) $is_virtual_couse,
        'instructors'   => $instructors,
        'salary_bar'    => $salary_bar,
        'ielts'         => $ielts,
        'certificate'   => $certificate,
        'accreditation' => $accreditation,
        'testimonials'  => $testimonials,
        'funding'       => $funding,
        'resources'     => $resources,
        'virtual_faqs'  => $virtual_faqs,
        'learn_more'    => $learn_more,
    );
}

/**
 * get_price_html() as a page request prints it. In a REST request Price Based on
 * Country's AJAX-geolocation wrapper leaves out the " loading" class and the
 * placeholder span; the page has both (its JS re-prices those wrappers).
 */
function tefl_native_course_new2023_price_html($product) {
    $html = (string) $product->get_price_html();
    $id   = $product->get_id();
    $open = '<span class="wcpbc-price wcpbc-price-' . $id . '" data-product-id="' . $id . '">';
    if (strpos($html, $open) !== 0 || substr($html, -7) !== '</span>') {
        return $html;
    }
    $placeholder = sprintf('<span class="wcpbc-placeholder %s"></span>', apply_filters('wc_price_based_country_ajax_geolocation_placeholder_class', '-dots'));
    return '<span class="wcpbc-price wcpbc-price-' . $id . ' loading" data-product-id="' . $id . '">'
        . substr($html, strlen($open), -7) . $placeholder . '</span>';
}

/**
 * includes/ti-deposit-form.php, resolved. null = prints nothing; false = can't port.
 * Same logic and strict comparisons as the include.
 */
function tefl_native_course_new2023_deposit_form($course_product_id, $deposit_enabled) {
    global $wpdb;
    if (!class_exists('WC_Deposits_Product_Manager') || !class_exists('WC_Deposits_Plans_Manager')) {
        return false;
    }
    $curr_post_type = get_post_type();
    $curr_post_id   = $course_product_id;
    $plans          = get_post_meta($curr_post_id, '_wc_deposit_payment_plans', true);
    $plan           = is_array($plans) ? ($plans[0] ?? null) : null;
    if (!is_numeric($plan)) {
        return false;
    }
    $deposit_description = '';
    if ($plan === 1 || $plan === 3) {
        $deposit_description = 'Spread the purchase of this TEFL ' . $curr_post_type . ' over two interest-free payments. The second intallment is due after 30 days.';
    } elseif ($plan === 4) {
        $deposit_description = 'Spread the purchase of this TEFL ' . $curr_post_type . ' over three interest-free payments. Pay 20% today then 40% after 30 days and rest 40% after 60 days.';
    } elseif ($plan === 6) {
        $deposit_description = 'Enrol today with a small deposit + pay  the rest of the balance in 6 interest free monthly payments.';
    } elseif ($plan === 7) {
        $deposit_description = 'Enrol today with a small deposit + pay  the rest of the balance in 5 interest free monthly payments.';
    } elseif ($plan === 8) {
        $deposit_description = 'Spread the purchase of this TEFL ' . $curr_post_type . ' over three EQUAL interest-free payments. Pay 33.4% today then 33.3% after 30 days and remaining 33.33% after 60 days.';
    }
    $total_deposits = $wpdb->get_var('SELECT count(schedule_id) FROM `wp_wc_deposits_payment_plans_schedule` WHERE `plan_id` = ' . (int) $plan);

    if (!($deposit_enabled == 'optional' || $deposit_enabled == 'required')) {
        return null;
    }
    $default_selected_type = WC_Deposits_Product_Manager::get_deposit_selected_type($curr_post_id);
    $is_plan = 'plan' === WC_Deposits_Product_Manager::get_deposit_type($curr_post_id);
    $descriptions = array();
    $amount_html  = '';
    if ($is_plan) {
        foreach (WC_Deposits_Plans_Manager::get_plans_for_product($curr_post_id) as $p) {
            $descriptions[] = $deposit_description;
        }
    } else {
        $amount_html = (string) WC_Deposits_Product_Manager::get_formatted_deposit_amount($curr_post_id);
    }
    return array(
        'forced'          => (bool) WC_Deposits_Product_Manager::deposits_forced($curr_post_id),
        'breakdown'       => $deposit_enabled == 'forced' || $deposit_enabled == 'optional',
        'object_id'       => (string) $curr_post_id,
        'total_deposits'  => (string) $total_deposits,
        'full_checked'    => (string) $default_selected_type === 'full',
        'deposit_checked' => (string) $default_selected_type === 'deposit',
        'show'            => 'deposit' === $default_selected_type,
        'is_plan'         => $is_plan,
        'descriptions'    => $descriptions,
        'amount_html'     => $amount_html,
    );
}

/**
 * variation_timetable($offset) from includes/virtual-course-variation.php: the
 * EducationEvent JSON-LD it echoes (before the table) and the table rows. Local
 * variables carry over between dates exactly as in the theme's loop.
 */
function tefl_native_course_new2023_timetable($offset, $ctx) {
    $class_course_dates   = get_field('course_dates', 'option');
    $date_today           = date('Y-m-d');
    $date_today_timestamp = strtotime($date_today);
    $course_product_id    = get_field('course_product');
    $course_price_value   = get_post_meta($course_product_id, '_price', true);
    $course_product       = wc_get_product($course_product_id);
    $course_price_html    = $course_product ? tefl_native_course_new2023_price_html($course_product) : '';
    $price_html           = call_user_func($ctx['html'], $course_price_html);

    $rows = array();
    $ld   = array();
    $date_count = 0;
    $course_start_time_new = $course_end_time_new = null;
    $course_start_time_ts  = null;
    foreach (tefl_native_course_new2023_arr($class_course_dates) as $class_course_date) {
        $class_course_start_date     = $class_course_date['start_date'];
        $class_course_start_date_new = str_replace('/', '-', $class_course_start_date);
        $class_course_start_date_new = date('Y-m-d', strtotime($class_course_start_date_new));
        $class_course_start_date_timestamp = strtotime($class_course_start_date_new);

        $class_course_start_date = str_replace('/', '-', $class_course_start_date);
        $class_course_start_date = date('l jS M', strtotime($class_course_start_date));

        $class_course_end_date = $class_course_date['end_date'];
        $class_course_end_date = str_replace('/', '-', $class_course_end_date);
        $class_course_end_date = date('l jS M Y', strtotime($class_course_end_date));

        $course_start_end_date = $class_course_start_date . ' - ' . $class_course_end_date;

        // The theme's condition assigns instead of comparing; it's truthy unless today's timestamp is 0.
        if (($class_course_start_date_timestamp > $date_today_timestamp) || ($class_course_start_date_timestamp = $date_today_timestamp)) {
            $course_start_time = $class_course_date['start_time'];
            if ($course_start_time) {
                $course_start_time_str  = date('g:i a', strtotime($course_start_time));
                $course_start_time_new  = ti_convert_utc_time($course_start_time_str, $offset);
                $course_start_date_time = $class_course_start_date_new . ' ' . $course_start_time_str;
                $course_start_date_time_str = date('Y-m-d g:i a', strtotime($course_start_date_time));
                $course_start_time_ts   = strtotime($course_start_date_time_str);
            }
            $course_end_time = $class_course_date['end_time'];
            if ($course_end_time) {
                $course_end_time_str = date('g:i a', strtotime($course_end_time));
                $course_end_time_new = ti_convert_utc_time($course_end_time_str, $offset);
            }
            $course_time = ($course_start_time && $course_end_time) ? $course_start_time_new . ' - ' . $course_end_time_new : '';

            $time_now = strtotime(date('Y-m-d g:i a'));
            if ($course_start_time_ts > $time_now) {
                $date_count++;
                $low_stock      = '';
                $disabled_class = '';
                $seats          = $class_course_date['number_of_seats'];
                $availability   = $seats ? (string) (int) $seats : '<span class="space-full">FULL</span>';
                if ($seats <= 3) {
                    $low_stock = 'red';
                }
                if ((int) $seats < 1) {
                    $disabled_class = 'disabled';
                }
                $rows[] = array(
                    'disabled' => $disabled_class,
                    'n'        => (string) $date_count,
                    'date'     => $course_start_end_date,
                    'time'     => $course_time,
                    'low'      => $low_stock,
                    'avail'    => $availability,
                    'href'     => call_user_func($ctx['href'], '/?addtimetocart&prid=' . $course_product_id . '&date=' . $class_course_date['start_date']),
                );
                $ld[] = '
                    {
                        "@context": "http://schema.org",
                        "@type": "EducationEvent",
                        "name": "' . get_the_title() . '",
                        "performer": "The TEFL Institute of Ireland",
                        "url": "' . get_the_permalink() . '#course-' . $date_count . '",
                        "startDate": "' . $class_course_date['start_date'] . '",
                        "endDate": "' . $class_course_date['end_date'] . '",
                        "eventStatus": "EventScheduled",
                        "eventAttendanceMode": "OnlineEventAttendanceMode",
                        "description": "In just 10 hours have a certificate of practical teaching experience under your belt",
                        "offers": {
                            "@type": "Offer",
                            "price": "' . $course_price_value . '",
                            "priceCurrency": "' . get_woocommerce_currency() . '",
                            "availability": "http://schema.org/InStock",
                            "url": "' . '/?addtimetocart&prid=' . $course_product_id . '&date=' . $class_course_date['start_date'] . '",
                            "validFrom": "2020-01-01T12:00",
                            "category": "Course"
                        },
                        "organizer": {
                            "@type": "Organization",
                            "name": "The TEFL Institute of Ireland",
                            "url": "https://teflinstitute.com/",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://teflinstitute.com/wp-content/uploads/2021/01/TEFL-Logo_Institute-scaled.jpg",
                                "width": "432px",
                                "height": "190px"
                            }
                        },
                        "location": {
                            "@type": "VirtualLocation",
                            "url": "https://courses.teflinstitute.com/"
                        },
                        "image": {
                            "@type": "ImageObject",
                            "url": "https://teflinstitute.com/wp-content/uploads/2021/01/TEFL-Logo_Institute-scaled.jpg",
                            "width": "300px",
                            "height": "300px"
                        }
                    }
                ';
            }
        }
    }
    return array('ld' => $ld, 'rows' => $rows, 'price' => $price_html, 'more' => $date_count > 2);
}

/** foreach over a non-array prints nothing in the template (a warning); same here. */
function tefl_native_course_new2023_arr($v) {
    return is_array($v) ? $v : array();
}
