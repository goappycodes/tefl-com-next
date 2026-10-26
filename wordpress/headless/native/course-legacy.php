<?php
/**
 * Native template: legacy course design (single-course-template.php), the
 * design single-course.php includes when neither ACF is_new_design nor
 * is_2024_design is set. Dispatched from course.php
 * (tefl_native_course_legacy_data); the Next side is
 * components/courses/legacy/CourseLegacy.tsx.
 *
 * Mirrors the template's control flow line for line, including its quirks
 * (variables carried over between freebies, the sale-course enrol/countdown
 * logic, the `<a>` nested in `<a>` of the graduate slider, the unclosed
 * `<h6 class=>` of the recommended courses). Values the template echoes raw
 * are returned as HTML (rewritten like the render); values echoed into
 * attributes are returned decoded. Shortcodes (reviews collection, CF7) are
 * captured as rendered.
 *
 * Returns null (→ passthrough) for the branches no live course uses:
 * virtual courses (includes/virtual-course-variation.php) and deposit
 * payment plans (includes/ti-deposit-form.php).
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

/** What `echo $v` prints. */
function tefl_native_course_legacy_s($v) {
    if (is_array($v)) {
        return 'Array';
    }
    if ($v === true) {
        return '1';
    }
    if ($v === null || $v === false) {
        return '';
    }
    return (string) $v;
}

/**
 * $product->get_price_html() as a page view prints it: WCPBC's Ajax
 * geolocation adds the `loading` class and the placeholder on page views but
 * not for REST requests.
 */
function tefl_native_course_legacy_price($product) {
    $html = (string) $product->get_price_html();
    if (!class_exists('WCPBC_Ajax_Geolocation') || !WCPBC_Ajax_Geolocation::is_enabled()) {
        return $html;
    }
    $id   = $product->get_id();
    $open = '<span class="wcpbc-price wcpbc-price-' . $id . '" data-product-id="' . $id . '">';
    if (strpos($html, $open) !== 0 || substr($html, -7) !== '</span>') {
        return $html;
    }
    $inner       = substr($html, strlen($open), -7);
    $placeholder = sprintf('<span class="wcpbc-placeholder %s"></span>', apply_filters('wc_price_based_country_ajax_geolocation_placeholder_class', '-dots'));
    return '<span class="wcpbc-price wcpbc-price-' . $id . ' loading" data-product-id="' . $id . '">' . $inner . $placeholder . '</span>';
}

/** Advance CF7's per-request form counter by $n (the forms the page renders before this one). */
function tefl_native_course_legacy_cf7_advance($n) {
    if (!class_exists('WPCF7_ContactForm')) {
        return;
    }
    try {
        $m = new ReflectionMethod('WPCF7_ContactForm', 'generate_unit_tag');
        $m->setAccessible(true);
        for ($i = 0; $i < $n; $i++) {
            $m->invoke(null, 0);
        }
    } catch (Throwable $e) {
        // Unit tags then start at -o1; cosmetic only.
    }
}

/**
 * A CF7 shortcode as the page prints it: outside the loop (single-course.php
 * never starts one), after the one form rendered before the content, with the
 * page's own path as the form action.
 */
function tefl_native_course_legacy_cf7($ctx, $shortcode) {
    global $wp_query;
    $saved  = $wp_query ? $wp_query->in_the_loop : false;
    $action = function ($url) use ($ctx) {
        $frag = strstr((string) $url, '#');
        return sanitize_url('/' . ltrim((string) strtok($ctx['path'], '?#'), '/')) . ($frag === false ? '' : $frag);
    };
    add_filter('wpcf7_form_action_url', $action, 1);
    if ($wp_query) {
        $wp_query->in_the_loop = false;
    }
    tefl_native_course_legacy_cf7_advance(1);
    try {
        $html = (string) do_shortcode($shortcode);
    } finally {
        remove_filter('wpcf7_form_action_url', $action, 1);
        if ($wp_query) {
            $wp_query->in_the_loop = $saved;
        }
    }
    return $html;
}

/** Raw HTML the template echoes → the page's HTML (cookie blocker + render rewrites). */
function tefl_native_course_legacy_h($ctx, $v) {
    $v = tefl_native_course_legacy_s($v);
    return $v === '' ? '' : call_user_func($ctx['html'], call_user_func($ctx['block'], $v));
}

/** A value echoed raw into an attribute → decoded text. */
function tefl_native_course_legacy_t($ctx, $v) {
    return call_user_func($ctx['txt'], tefl_native_course_legacy_s($v));
}

/** A link echoed raw into href="" → decoded, rewritten like the render. */
function tefl_native_course_legacy_href($ctx, $v) {
    return call_user_func($ctx['href'], tefl_native_course_legacy_t($ctx, $v));
}

/** the_sub_field() output, captured. */
function tefl_native_course_legacy_sub($name) {
    return tefl_native_capture(function () use ($name) {
        the_sub_field($name);
    });
}

function tefl_native_course_legacy_data(int $pid, array $ctx): ?array {
    global $wpdb;
    $s    = 'tefl_native_course_legacy_s';
    $h    = function ($v) use ($ctx) {
        return tefl_native_course_legacy_h($ctx, $v);
    };
    $t    = function ($v) use ($ctx) {
        return tefl_native_course_legacy_t($ctx, $v);
    };
    $href = function ($v) use ($ctx) {
        return tefl_native_course_legacy_href($ctx, $v);
    };
    $arr  = function ($v) {
        return is_array($v) ? $v : array();
    };

    // single-course.php's wrapper variables.
    $course_id        = $pid;
    $is_virtual_couse = get_field('is_virtual_couse');
    $course_category  = wp_get_post_terms($course_id, 'course_category', array('fields' => 'ids'));
    $course_category  = is_array($course_category) ? $course_category : array();

    if ($is_virtual_couse) {
        return null; // includes/virtual-course-variation.php + virtual FAQs — not ported
    }

    // ── Banner ──────────────────────────────────────────────────────────
    $course_product_id = get_field('course_product');
    $course_product    = wc_get_product($course_product_id);
    $course_price       = '';
    $course_price_value = '';
    if ($course_product) {
        $course_price       = tefl_native_course_legacy_price($course_product);
        $course_price_value = $course_product->get_price();
    }

    $course_button_color = get_field('course_button_color', 'options');
    $hero_banner         = $arr(get_field('hero_banner'));
    $freebies            = get_field('freebies');
    $banner_img          = $hero_banner['banner_image'] ?? null;
    $banner_CTA          = $arr($hero_banner['banner_cta'] ?? null);
    $CTA_btns            = $arr($banner_CTA['banner_cta_buttons'] ?? null);
    $btn1                = $arr($CTA_btns['button1'] ?? null);
    $btn2                = $arr($CTA_btns['button2'] ?? null);
    $btn1_txt            = $btn1['button1_text'] ?? null;
    $btn2_txt            = $btn2['button2_text'] ?? null;
    $CTA_title           = $banner_CTA['banner_cta_title'] ?? null;
    $CTA_txt             = $banner_CTA['banner_cta_text'] ?? null;

    $deposit_enabled      = get_post_meta($course_product_id, '_wc_deposit_enabled', true);
    $deposit_payment_plan = '';
    if ($deposit_enabled == 'forced' || $deposit_enabled == 'optional') {
        $plans                = get_post_meta($course_product_id, '_wc_deposit_payment_plans', true);
        $deposit_payment_plan = is_array($plans) ? ($plans[0] ?? null) : null;
    }
    if ($deposit_payment_plan) {
        return null; // includes/ti-deposit-form.php — not ported
    }
    // The template's schedule query with an empty plan id fails → null → 0.
    $deposit_percent = round((float) null / 100, 5);
    $fixed_99        = false;

    $excluded_courses = get_field('excluded_courses', 'options');
    $excluded_courses = $excluded_courses ? $excluded_courses : array();

    $product_ld = null;
    if ($course_product_id) {
        $time_required = get_field('time_required') ? get_field('time_required') : 30;
        $product_ld    = '
             {
		  "@context": "http://schema.org",
		  "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "Online",
                "courseWorkload": "PT150H",
                "startDate": "2025-05-01",
                "endDate": "2025-10-28"
            },
		  "@type": "Course",
		  "name": "' . get_the_title() . '",
		  "description": ' . json_encode($CTA_txt) . ',
		  "url": "' . get_the_permalink() . '",
		  "timeRequired": "PT' . $s($time_required) . 'H",
		  "offers": {
			"@type": "Offer",
			"price": "' . $s($course_price_value) . '",
			"priceCurrency": "' . get_woocommerce_currency() . '",
			"validFrom": "' . date('y-m-d') . '",
             "category": "Course"
		  },
		  "typicalAgeRange": "16+",
		  "inLanguage": "en-US",
		  "provider": {
			"@type": "Organization",
			"name": "The TEFL Institute",
			"sameAs": "https://teflinstitute.com"
		  },
		  "aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": 4.91,
			"reviewCount": 540
		  }
		}
        ';
    }

    $enable_yoga_course = get_field('enable_yoga_course', 'options');
    $free_offer_text    = get_field('free_offer_text');

    // Sales countdown.
    $offered   = empty(get_field('number_of_sale_courses_offered')) ? 0 : get_field('number_of_sale_courses_offered');
    $sold      = function_exists('count_orders_with_product_since_date') ? count_orders_with_product_since_date($course_product_id, '2024-10-21') : array();
    $sold      = $sold['count'] ?? 0;
    $remaining = (int) $offered - (int) $sold;

    $yoga = null;
    if ($enable_yoga_course) {
        $yoga_course_text = get_field('yoga_course_text', 'options');
        if ($yoga_course_text) {
            $yoga = $h($yoga_course_text);
        }
    }

    // Freebies — $regular_product carries over from one freebie to the next.
    $freebie_list = null;
    if ($freebies) {
        $freebies        = $arr($freebies);
        $freebie_list    = array();
        $regular_product = null;
        foreach (array(array('zoom_classes', '/wp-content/uploads/2021/11/zoom.png'), array('course', '/wp-content/uploads/2021/11/laptop.png'), array('guide', '/wp-content/uploads/2021/11/book.png')) as $fb) {
            $group = $arr($freebies[$fb[0]] ?? null);
            if (empty($group['show'])) {
                continue;
            }
            $p = wc_get_product($group['product'] ?? null);
            if ($p) {
                $regular_product = tefl_native_course_legacy_price($p);
            }
            $freebie_list[] = array(
                'price'   => $h($regular_product),
                'img'     => $fb[1],
                'content' => $h($group['content'] ?? null),
            );
        }
    }

    // ── Bars ────────────────────────────────────────────────────────────
    $black_bar = null;
    $bb        = get_field('black_bar_content', 'options');
    if ($bb) {
        $black_bar = array();
        foreach ($arr($bb['content'] ?? null) as $bbc) {
            if (($bbc['icon'] ?? null) && ($bbc['text'] ?? null)) {
                $black_bar[] = array('icon' => $t($bbc['icon']), 'text' => $h($bbc['text']));
            }
        }
    }
    $below_bar = null;
    $bbb       = get_field('below_black_bar_content', 'options');
    if ($bbb) {
        $below_bar = array();
        foreach ($arr($bbb['content'] ?? null) as $bbbc) {
            if (($bbbc['icon'] ?? null) && ($bbbc['text'] ?? null)) {
                $below_bar[] = array('icon' => $t($bbbc['icon']), 'text' => $h($bbbc['text']));
            }
        }
    }
    $guarantee = get_field('below_black_bar_guarantee', 'options');

    // ── Course details tabs ─────────────────────────────────────────────
    $details_tabs = $arr(get_field('course_details_tabs'));
    $test_card    = $arr($details_tabs['take_test_card'] ?? null);
    $tab_content  = $arr($details_tabs['tab_contents'] ?? null);
    $tab1         = $arr($tab_content['tab1'] ?? null);
    $tab2         = $arr($tab_content['tab2'] ?? null);
    $tab3         = $arr($tab_content['tab3'] ?? null);
    $tab4         = $arr($tab_content['tab4'] ?? null);
    $tab5         = $arr($tab_content['tab5'] ?? null);

    $tab1_details = $tab1['tab1_details'] ?? null;
    $tab2_content = $tab2['tab2_content'] ?? null;
    $tab3_details = $tab3['tab3_details'] ?? null;
    $tab4_details = $tab4['tab4_details'] ?? null;
    $tab5_details = $tab5['tab5_details'] ?? null;

    if (is_subcountry_folder()) {
        $cc        = strtolower(get_current_country());
        $tab5_faqs = $tab5['tab_5_rich_faq_' . $cc] ?? null;
        if (!$tab5_faqs) {
            $tab5_faqs = $tab5['tab_5_rich_faq'] ?? null;
        }
    } else {
        $tab5_faqs = $tab5['tab_5_rich_faq'] ?? null;
    }
    $bonus_guide_tab = $tab_content['bonus_guide_tab'] ?? null;
    $our_promise_tab = $tab_content['our_promise_tab'] ?? null;

    $modules = function ($rows) use ($h, $arr) {
        $out = array();
        foreach ($arr($rows) as $el) {
            $out[] = array(
                'numbers' => $h($el['modules_numbers'] ?? null),
                'title'   => $h($el['modules_title'] ?? null),
                'content' => $h($el['modules_content'] ?? null),
            );
        }
        return $out;
    };

    $faqs    = null;
    $faq_ld  = null;
    if ($tab5_faqs) {
        $faqs  = array();
        $items = array();
        foreach ($arr($tab5_faqs) as $f) {
            $items[] = ' {
                                                "@type": "Question",
                                                "name": ' . json_encode($f['question'] ?? null) . ',
                                                "acceptedAnswer": {
                                                    "@type": "Answer",
                                                    "text": ' . json_encode($f['answer'] ?? null) . '
                                                }
                                            }
                                        ';
            $faqs[]  = array('q' => $h($f['question'] ?? null), 'a' => $h($f['answer'] ?? null));
        }
        $faq_ld = '
                                {
                                    "@context": "https://schema.org",
                                    "@type": "FAQPage",
                                    "mainEntity": [
                                        ' . implode(',', $items) . '                                    ]
                                }
                            ';
    }

    $tabs = array(
        'card'          => array(
            'image'   => $t($test_card['card_image'] ?? null),
            'title'   => $h($test_card['card_title'] ?? null),
            'stitle'  => $h($test_card['card_subtitle'] ?? null),
            'btn'     => $h($test_card['card_button_text'] ?? null),
            'link'    => $href($test_card['card_button_link'] ?? null),
            'color'   => $t($course_button_color),
        ),
        'has1'          => !empty($tab1_details),
        'has2'          => !empty($tab2_content),
        'has3'          => !empty($tab3_details),
        'has4'          => !empty($tab4_details),
        'has5'          => !empty($tab5_details),
        'tab1_title'    => $h($tab1['tab1_title'] ?? null),
        'tab1_details'  => $h($tab1_details),
        'tab2_title'    => $h($tab2['tab2_title'] ?? null),
        'tab2_content'  => $tab2_content ? $modules($tab2_content) : null,
        'tab2_second'   => ($tab2['tab2_show_second_content'] ?? null) == true ? array(
            'title'   => $h($tab2['tab2_second_title'] ?? null),
            'modules' => $modules($tab2['tab2_second_content'] ?? null),
        ) : null,
        'tab3_title'    => $h($tab3['tab3_title'] ?? null),
        'tab3_logos'    => array_map(function ($el) use ($t) {
            return $t($el['logo'] ?? null);
        }, $arr($tab3['tab3_logos'] ?? null)),
        'tab3_details'  => $h($tab3_details),
        'tab4_title'    => $h($tab4['tab4_title'] ?? null),
        'tab4_details'  => $h($tab4_details),
        'tab5_title'    => $h($tab5['tab5_title'] ?? null),
        'tab5_details'  => $h($tab5_details),
        'faq_ld'        => $faq_ld,
        'faqs'          => $faqs,
        'bonus'         => !empty($bonus_guide_tab) ? $h($bonus_guide_tab) : null,
        'promise'       => !empty($our_promise_tab) ? $h($our_promise_tab) : null,
    );

    // ── Level 5 videos ──────────────────────────────────────────────────
    $level5 = null;
    if (in_array(19, $course_category) || ($course_id == 825) || ($course_id == 2704)) {
        $l5 = get_field('level_5_tefl_courses_videos', 'options');
        if ($l5) {
            $videos = array();
            foreach ($arr($l5['videos'] ?? null) as $video) {
                $link     = $video['video_link'] ?? null;
                $videos[] = array(
                    'href'  => $href($link),
                    'thumb' => $t('https://img.youtube.com/vi/' . $s(getYouTubeVideoId($link)) . '/hqdefault.jpg'),
                );
            }
            $level5 = array('heading' => $h($l5['section_heading'] ?? null), 'videos' => $videos);
        }
    }

    // ── Who can take the course ─────────────────────────────────────────
    $eligibility = null;
    if (have_rows('course_eligibility')) {
        $eligibility = array();
        while (have_rows('course_eligibility')) {
            the_row();
            $eligibility[] = $h(tefl_native_course_legacy_sub('criteria'));
        }
    }

    $funding = null;
    if (in_array(19, $course_category) || in_array(18, $course_category)) {
        $fc = get_field('funding_content', 'options');
        if ($fc) {
            $funding = $h($fc);
        }
    }

    // ── Reviews (includes/ti-reviews-functions.php + [brb_collection]) ──
    $reviews_widget = get_field('reviews_widget', 'option');
    $rw             = $arr($reviews_widget);
    $pct            = function ($i) use ($rw) {
        return isset($rw['star_percentage_' . $i]) ? (float) $rw['star_percentage_' . $i] : 0;
    };
    $average = (($pct(5) * 5) + ($pct(4) * 4) + ($pct(3) * 3) + ($pct(2) * 2) + ($pct(1) * 1)) / 100;
    $statuses = array();
    for ($i = 5; $i >= 1; $i--) {
        $sp = $rw['star_percentage_' . $i] ?? null;
        if (empty($sp)) {
            $sp = 0;
        }
        $statuses[] = $s($sp);
    }
    $review_banner = get_field('students_review_banner');
    $reviews       = array(
        'average'  => $s($average),
        'total'    => $s(isset($rw['total_reviews']) ? $rw['total_reviews'] : 1570),
        'statuses' => $statuses,
        'banner'   => $review_banner ? $s($review_banner) : null,
        'brb'      => $h(do_shortcode('[brb_collection id="1150"]')),
    );

    // ── Salary bar ──────────────────────────────────────────────────────
    $salary = null;
    $sb     = get_field('salary_calculator_bar', 'options');
    if ($sb) {
        $content = $sb['bar_content'] ?? null;
        $button  = $sb['button_content'] ?? null;
        $url     = $sb['button_url'] ?? null;
        $salary  = ($content && $button && $url)
            ? array('content' => $h($content), 'button' => $h($button), 'url' => $href($url))
            : array();
    }

    // ── Sale courses ────────────────────────────────────────────────────
    $sale_courses = array();
    foreach ($arr(get_field('sale_courses')) as $sc) {
        $course             = $sc['course'] ?? null;
        $course_link        = get_post_permalink($course);
        $sc_product_id      = get_field('course_product', $course);
        $sc_price           = '';
        $add_to_cart_link   = '';
        if ($sc_product_id) {
            $p = wc_get_product($sc_product_id);
            if ($p) {
                $sc_price = tefl_native_course_legacy_price($p);
            }
            $add_to_cart_link = site_url() . '/cart/?add-to-cart=' . $sc_product_id;
        }
        $includes        = $sc['includes'] ?? null;
        $excludes        = $sc['excludes'] ?? null;
        $freebie_courses = $sc['freebie_courses'] ?? null;
        $other_freebie   = $sc['other_freebie'] ?? null;
        $timer_expiry    = '';
        $date_today_unix = null;
        if (!in_array($course_id, $excluded_courses)) {
            $timer_expiry    = get_field('timer_expiry', 'options');
            $date_today      = date('l, F d y h:i:s');
            $date_today_unix = strtotime($date_today);
        }
        $time_diff             = 0;
        $course_offer_end_date = null;
        if ($timer_expiry) {
            $course_offer_end_date = strtotime($timer_expiry);
            $time_diff             = $course_offer_end_date - current_time('timestamp');
        }
        $is_expired = $time_diff < 0;
        $enrol      = $add_to_cart_link && $is_expired;

        $fcs = array();
        foreach ($arr($freebie_courses) as $fc) {
            $fp    = $fc['product'] ?? null;
            $price = '';
            if ($fp) {
                $fprod = wc_get_product($fp);
                if ($fprod) {
                    $price = tefl_native_course_legacy_price($fprod);
                }
            }
            $fcs[] = array(
                'icon'  => ($fc['icon'] ?? null) ? $t($fc['icon']) : null,
                'title' => ($fc['title'] ?? null) ? $h($fc['title']) : null,
                'price' => $price ? $h($price) : null,
            );
        }
        $ofs = array();
        foreach ($arr($other_freebie) as $of) {
            $ofs[] = array(
                'icon'  => ($of['icon'] ?? null) ? $t($of['icon']) : null,
                'title' => ($of['title'] ?? null) ? $h($of['title']) : null,
            );
        }

        $sale_courses[] = array(
            'image'     => ($sc['course_image'] ?? null) ? $t($sc['course_image']) : null,
            'logo'      => ($sc['course_logo'] ?? null) ? $t($sc['course_logo']) : null,
            'title'     => ($sc['course_title'] ?? null) ? $h($sc['course_title']) : null,
            'price'     => $sc_price ? $h($sc_price) : null,
            'enrol'     => $enrol ? $href($add_to_cart_link) : null,
            'countdown' => (!$enrol && $timer_expiry && $date_today_unix < $course_offer_end_date) ? $t($timer_expiry) : null,
            'incexc'    => ($includes || $excludes) ? array(
                'inc' => array_map(function ($i) use ($h) {
                    return $h($i['content'] ?? null);
                }, $arr($includes)),
                'exc' => array_map(function ($i) use ($h) {
                    return $h($i['content'] ?? null);
                }, $arr($excludes)),
            ) : null,
            'freebie'   => ($freebie_courses || $other_freebie || $course_link) ? array(
                'courses' => $freebie_courses ? $fcs : null,
                'other'   => $other_freebie ? $ofs : null,
                'cart'    => $add_to_cart_link ? $href($add_to_cart_link) : null,
            ) : null,
        );
    }

    // ── Certificate review ──────────────────────────────────────────────
    $certificate = null;
    $cr          = get_field('certificate_review');
    if ($cr) {
        $cr              = $arr($cr);
        $cert_img        = $cr['certificate_review_image'] ?? null;
        $show_transcript = $cr['show_certificate_transcript_image'] ?? null;
        $transcript_img  = $show_transcript ? ($cr['certificate_transcript'] ?? null) : null;
        $cert_title      = $cr['certificate_review_title'] ?? null;
        $cert_details    = $cr['certificate_review_details'] ?? null;
        $buttons         = $cr['certificate_review_buttons'] ?? null;
        $certificate     = array('body' => null);
        if ($cert_img && $cert_title && $buttons) {
            $certificate['body'] = array(
                'img'        => $t($cert_img),
                'transcript' => $show_transcript ? $t($transcript_img) : null,
                'title'      => $h($cert_title),
                'details'    => $cert_details ? $h($cert_details) : null,
                'buttons'    => array_map(function ($b) use ($h, $href) {
                    return array('text' => $h($b['button_text'] ?? null), 'link' => $href($b['button_link'] ?? null));
                }, $arr($buttons)),
            );
        }
    }

    // ── Accreditation ───────────────────────────────────────────────────
    $is_l5  = is_single(array('836', '838', '743', '825', '2704'));
    $ofqual = null;
    if ($is_l5) {
        $os     = $arr(get_field('ofqual_section', 'options'));
        $ofqual = array(
            'img'     => ($os['image'] ?? null) ? $t($os['image']) : null,
            'content' => ($os['content'] ?? null) ? $h($os['content']) : null,
        );
    }
    $ta        = $arr(get_field('tefl_accreditation'));
    $accred    = (($ta['image'] ?? null) && ($ta['title'] ?? null)) ? array(
        'img'      => $t($ta['image']),
        'title'    => $h($ta['title']),
        'subtitle' => $h($ta['subtitle'] ?? null),
    ) : null;

    $benefits = null;
    $cb       = get_field('course_benefits');
    if ($cb) {
        $benefits = array_map(function ($b) use ($h) {
            return $h($b['benefit'] ?? null);
        }, $arr($cb));
    }

    $slides = null;
    if (have_rows('graduate_review_slider')) {
        $slides = array();
        while (have_rows('graduate_review_slider')) {
            the_row();
            $slides[] = array(
                'image' => $t(tefl_native_course_legacy_sub('review_slide_image')),
                'url'   => $href(tefl_native_course_legacy_sub('review_slide_url')),
                'title' => $h(tefl_native_course_legacy_sub('review_slide_title')),
            );
        }
    }

    // ── Course offer: only its countdown <script> prints ($_course_offer is never set) ──
    $timer_script = null;
    $offer_expiry = '';
    if (!in_array(get_the_ID(), $excluded_courses)) {
        $offer_expiry = get_field('timer_expiry', 'options');
    }
    if ($offer_expiry) {
        $timer_script = tefl_native_course_legacy_timer_script(date('M d, Y H:i:s', strtotime($offer_expiry)));
    }

    // ── Job hunter's guide / app ────────────────────────────────────────
    $guide = get_field('guide', 'option');
    $hunter = array('bg' => '', 'title' => '', 'subtitle' => '', 'img' => '');
    if ($guide) {
        $hunter = array(
            'bg'       => $t($guide['guide_background'] ?? null),
            'title'    => $h($guide['guide_title'] ?? null),
            'subtitle' => $h($guide['guide_subtitle'] ?? null),
            'img'      => $t($guide['guide_preview'] ?? null),
        );
    }
    $app = $arr(get_field('app', 'option'));

    $cf7 = $h(tefl_native_course_legacy_cf7($ctx, '[contact-form-7 id="7170" title="Job Hunter\'s Guide"]'));

    // ── Recommended courses ─────────────────────────────────────────────
    $recommended = null;
    if (have_rows('recommended_courses')) {
        $recommended = array();
        while (have_rows('recommended_courses')) {
            the_row();
            $recommended[] = array(
                'link'  => $href(tefl_native_course_legacy_sub('button_link')),
                'icon'  => $t(tefl_native_course_legacy_sub('course_icon')),
                'title' => $h(tefl_native_course_legacy_sub('course_title')),
                'text'  => $h(tefl_native_course_legacy_sub('button_text')),
            );
        }
    }

    // ── Webinar ─────────────────────────────────────────────────────────
    $webinars = get_posts(array(
        'numberposts' => 3,
        'post_type'   => 'webinar',
        'post_status' => 'publish',
        'tax_query'   => array(array('taxonomy' => 'webinar_category', 'field' => 'slug', 'terms' => array('upcoming'))),
        'meta_key'    => 'webinar_date',
        'orderby'     => 'meta_value_num',
        'order'       => 'ASC',
    ));
    $ws      = $arr(get_field('webinars', 2));
    $webinar = array(
        'title' => $h($ws['section_title'] ?? null),
        'list'  => null,
    );
    if ($webinars) {
        $upcoming = null;
        foreach ($webinars as $w) {
            if (strtotime(get_field('webinar_date', $w->ID)) > time()) {
                $upcoming = $w;
                break;
            }
        }
        $webinar['list'] = array('upcoming' => null, 'register' => $href(get_home_url() . '/upcoming-tefl-webinars/'));
        if ($upcoming) {
            $wid                         = $upcoming->ID;
            $webinar['list']['upcoming'] = array(
                'image'    => $t(get_the_post_thumbnail_url($wid, 'full')),
                'link'     => $href($ws['button_link'] ?? null),
                'title'    => $h($upcoming->post_title),
                'location' => $h(get_field('webinar_location', $wid)),
                'date'     => $h(get_field('webinar_date', $wid)),
                'time'     => $h(get_field('webinar_time', $wid)),
            );
        }
    }

    return array(
        'primary_class' => tefl_native_course_primary_class(),
        'course_id'     => (string) $course_id,
        'product_ld'    => $product_ld,
        'banner'        => array(
            'image'           => $t($banner_img),
            'cta_title'       => $h($CTA_title),
            'price'           => $h($course_price),
            'fixed99'         => $s($fixed_99),
            'deposit_percent' => $s($deposit_percent),
            'deposit_class'   => '',
            'free_offer'      => !empty($free_offer_text) ? $h($free_offer_text) : null,
            'installments'    => ($deposit_enabled == 'forced' || $deposit_enabled == 'optional') ? $s($course_product_id) : null,
            'sale'            => $remaining > 0 ? array('sold' => $s($sold), 'remaining' => $s($remaining)) : null,
            'cta_text'        => $h($CTA_txt),
            'highfield'       => $is_l5,
            'yoga'            => $yoga,
            'btn1'            => $h($btn1_txt),
            'btn2'            => $h($btn2_txt),
            'enrol'           => $href(get_home_url() . '/?addtimetocart&prid=' . $s($course_product_id)),
            'freebies'        => $freebie_list,
        ),
        'black_bar'     => $black_bar,
        'below_bar'     => $below_bar,
        'guarantee'     => $guarantee ? $h($guarantee) : null,
        'tabs'          => $tabs,
        'level5'        => $level5,
        'eligibility'   => $eligibility,
        'funding'       => $funding,
        'reviews'       => $reviews,
        'salary'        => $salary,
        'sale_courses'  => $sale_courses,
        'certificate'   => $certificate,
        'ofqual'        => $ofqual,
        'accred'        => $accred,
        'highfield'     => $is_l5,
        'benefits'      => $benefits,
        'slides'        => $slides,
        'timer_script'  => $timer_script,
        'hunter'        => array(
            'guide'    => (bool) $guide,
            'bg'       => $hunter['bg'],
            'title'    => $hunter['title'],
            'subtitle' => $hunter['subtitle'],
            'img'      => $hunter['img'],
        ),
        'app'           => array(
            'title'    => $h($app['app_title'] ?? null),
            'subtitle' => $h($app['app_subtitle'] ?? null),
            'preview'  => $t($app['app_preview'] ?? null),
            'google'   => ($app['app_google_play_store'] ?? null) ? $href($app['app_google_play_store']) : null,
            'apple'    => ($app['app_apple_store'] ?? null) ? $href($app['app_apple_store']) : null,
        ),
        'cf7'           => $cf7,
        'recommended'   => $recommended,
        'webinar'       => $webinar,
    );
}

/** The course-offer countdown script, as the template prints it. */
function tefl_native_course_legacy_timer_script($expiry) {
    return '
            let searchParams = new URLSearchParams(window.location.search)
            const timer = () => {
                //set the date to countdown
                //const countDownDate = new Date("Dec 25, 2020 12:00:00").getTime();
                const countDownDate = new Date("' . $expiry . '").getTime();

                //update time each second

                const update = setInterval(() => {
                    //get time now and find differnce from countdown time

                    var now = new Date().getTime();
                    const diff = countDownDate - now;

                    //calculate time as days, hours months and second

                    if (diff > 0) {
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                        // if(searchParams.has(\'debug\')){
                        //     alert("days: " + days + " hours: " + hours + " minutes: " + minutes + " seconds: " + seconds);

                        // }

                        //display timer
                        document.querySelector(\'#day\').innerHTML = days;
                        document.querySelector(\'#hour\').innerHTML = hours;
                        document.querySelector(\'#minute\').innerHTML = minutes;
                        document.querySelector(\'#second\').innerHTML = seconds;
                    } else {
                        document.getElementsByClassName(\'hascountdown\')[0].style.display = \'none\';
                        document.getElementsByClassName(\'hascountdown\')[1].style.display = \'none\';
                        document.getElementsByClassName(\'hascountdown\')[2].style.display = \'none\';
                        document.getElementsByClassName(\'salarycalculator-form\')[0].style.display = \'block\';
                        document.getElementsByClassName(\'mid-col\')[0].style.background = \'black\';

                    }
                }, 1000);
            }

            jQuery(document).ready(function($) {
                // timer();
            })
        ';
}
