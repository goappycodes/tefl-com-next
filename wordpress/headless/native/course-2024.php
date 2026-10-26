<?php
/**
 * Native template data: single-course-template-2024.php (the 2024 course design),
 * plus includes/ti-deposit-form.php which it includes for deposit-enabled products.
 *
 * Called by course.php (tefl_native_course) when ACF is_2024_design is set and
 * is_new_design isn't. Mirrors the template top to bottom: every value it
 * computes or echoes is resolved here, the markup is
 * components/courses/y2024/Course2024.tsx.
 *
 * Returns null (→ passthrough render) for branches not ported:
 *   - is_virtual_course_new (includes/virtual-course-variation_new.php).
 *
 * Template quirks reproduced on purpose:
 *   - $current_cc is undefined in the hero (it's set further down), so the hero's
 *     enrol wrapper gets an empty class token; the intro section's one gets the
 *     visitor's geolocated country code.
 *   - $current_course_id is never set for non-virtual courses, so the common banner
 *     logo / employer's-choice logo conditions compare against null.
 *   - The deposit form's --active-*-color CSS variables are undefined (empty).
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

function tefl_native_course_2024_data(int $pid, array $ctx): ?array {
    global $wpdb;
    if (!function_exists('is_array_empty') || !function_exists('truncate_string')) {
        return null;
    }
    $html = $ctx['html'];
    $href = $ctx['href'];
    $txt  = $ctx['txt'];
    $block = $ctx['block'];
    // Values the template echoes raw (ACF text/HTML, shortcode output): the page's Complianz pass + render rewrites.
    $raw = function ($v) use ($html, $block) {
        return $html($block((string) $v));
    };

    $is_virtual_course = get_field('is_virtual_course_new');
    if ($is_virtual_course) {
        return null; // includes/virtual-course-variation_new.php isn't ported
    }
    $guides_prospectus_section = get_field('guides-prospectus_section');
    $reviews_widget            = get_field('reviews_widget', 'option');
    $new_hero_section          = get_field('new_hero_section');
    $is_level_5_diploma_course = get_field('is_level_5_diploma_course');

    $data = array(
        'primary_class' => tefl_native_course_primary_class(),
        'hero'          => null,
    );

    // The template's $current_cc: undefined until the hero sets it (after the hero's enrol button).
    $current_cc        = '';
    $current_course_id = null;
    $course_product_id = null;

    /* ---------------------------------------------------------------- Hero */
    if (!is_array_empty($new_hero_section)) {
        $course_obj        = $new_hero_section['course'] ?? null;
        $course_product_id = is_object($course_obj) ? $course_obj->ID : null;
        $banner_content    = (array) ($new_hero_section['banner_content'] ?? array());
        $course_product    = wc_get_product($course_product_id);
        $course_price      = null;
        $save_percentage   = null;
        $full_price        = null;
        if ($course_product) {
            $course_price         = tefl_native_course_2024_price_wrapper($course_product->get_price_html(), $course_product);
            $full_price           = $course_product->get_price();
            $simple_regular_price = $course_product->get_regular_price();
            $simple_sale_price    = $course_product->get_sale_price();
            if (is_numeric($simple_regular_price) && is_numeric($simple_sale_price) && $simple_regular_price != 0) {
                $save_percentage = round((($simple_regular_price - $simple_sale_price) / $simple_regular_price) * 100);
            }
        }

        $deposit_enabled      = get_post_meta($course_product_id, '_wc_deposit_enabled', true);
        $deposit_payment_plan = '';
        if ($deposit_enabled == 'forced' || $deposit_enabled == 'optional') {
            $plans                = get_post_meta($course_product_id, '_wc_deposit_payment_plans', true);
            $deposit_payment_plan = is_array($plans) ? ($plans[0] ?? null) : null;
        }
        $deposit_class = $deposit_payment_plan ? 'deposit-full-price payment-plan-' . $deposit_payment_plan : '';
        // "SELECT amount … WHERE plan_id = <plan>" — with no plan the template's query errors → null.
        $deposit_percent = null;
        if ($deposit_payment_plan !== '' && $deposit_payment_plan !== null && is_numeric($deposit_payment_plan)) {
            $deposit_percent = $wpdb->get_var("SELECT amount FROM `wp_wc_deposits_payment_plans_schedule` WHERE `schedule_index` = 0 AND `plan_id` = " . (int) $deposit_payment_plan);
        } elseif ($deposit_payment_plan !== '' && $deposit_payment_plan !== null) {
            return null; // non-numeric plan id: not reproducible safely
        }
        $deposit_percent = round((float) $deposit_percent / 100, 5);

        $deposit = null;
        if (!empty($deposit_payment_plan)) {
            $deposit = tefl_native_course_2024_deposit_form($course_product_id, $deposit_enabled);
            if ($deposit === false) {
                return null;
            }
            if (is_array($deposit)) {
                $deposit['amount_html'] = $raw($deposit['amount_html']);
            }
        }

        // Sales countdown.
        $offered = empty(get_field('numbers_of_sale_courses_offered')) ? 0 : get_field('numbers_of_sale_courses_offered');
        $sale    = null;
        if ((int) $offered > 0) { // with 0 offered the remainder can't be positive; skip the order query
            $sold       = count_orders_with_product_since_date($course_product_id, '2024-09-17');
            $sold_count = $sold['count'] ?? 0;
            $remaining  = (int) $offered - (int) $sold_count;
            if ($remaining > 0) {
                $sale = array('sold' => (string) $sold_count, 'remaining' => (string) $remaining);
            }
        }

        $course_completion_text = $banner_content['course_completion_text'] ?? '';
        $reviews_count          = isset($reviews_widget['total_reviews']) ? $reviews_widget['total_reviews'] : 1671;

        $hero_cc     = $current_cc; // still undefined at the hero's enrol button
        $current_cc  = (string) get_user_geo_country_code();
        $klarna_cc   = array('AT', 'BE', 'CZ', 'DK', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'NL', 'NO', 'PL', 'PT', 'SE', 'CH', 'GB');
        $klarna_ids  = array(259, 13680, 24443, 72236, 82962, 84635, 72473, 55087, 98447);
        $show_klarna = in_array($current_cc, $klarna_cc) && in_array(get_the_ID(), $klarna_ids);

        // Right column: banner logo, else the common (or alternate) logo for selected courses.
        $banner_logo = $new_hero_section['banner_logo'] ?? '';
        $logo        = array('banner' => null, 'common' => null, 'alternate' => null);
        if (!empty($banner_logo)) {
            $logo['banner'] = $txt($banner_logo);
        } else {
            $common              = get_field('common_hero_banner_logo', 'option');
            $common_banner_logo  = $common['common_banner_logo'] ?? '';
            $selected_courses    = !empty($common['selected_courses']) ? $common['selected_courses'] : array();
            $show_alternate_logo = $common['show_alternate_logo'] ?? null;
            $common_link         = $common['common_banner_logo_link'] ?? '';
            $alternate_logo      = null;
            $alternate_selected  = array();
            if ($show_alternate_logo) {
                $alternate_logo     = $common['alternate_common_banner_logo'] ?? null;
                $alternate_selected = !empty($common['alternate_selected_courses']) ? $common['alternate_selected_courses'] : array();
                foreach ($alternate_selected as $c) {
                    $key = array_search($c, $selected_courses);
                    if ($key !== false) {
                        unset($selected_courses[$key]);
                    }
                }
            }
            if (in_array($current_course_id, $selected_courses) && !empty($common_banner_logo)) {
                $offered11833 = get_field('numbers_of_sale_courses_offered', 11833);
                $sold11075    = count_orders_with_product_since_date(11075, '2024-09-17');
                $remaining    = (int) $offered11833 - (int) ($sold11075['count'] ?? 0);
                $logo['common'] = array(
                    'counter' => (!is_single('11833') && $remaining > 0) ? (string) $remaining : null,
                    'logo'    => $txt($common_banner_logo),
                    'link'    => empty($common_link) ? null : $href($txt($common_link)),
                );
            }
            if ($show_alternate_logo && in_array($current_course_id, $alternate_selected) && !empty($alternate_logo)) {
                $logo['alternate'] = $txt($alternate_logo);
            }
        }

        $price_html = null;
        if ($course_price) {
            $price_html = $raw($course_price . '<div class="savings d-none">' . 'Save ' . $save_percentage . '%' . '</div>');
        }

        $data['hero'] = array(
            'pid'             => (string) $course_product_id,
            'bg'              => $txt($new_hero_section['banner_background_image'] ?? ''),
            'icon'            => $txt($banner_content['course_icon'] ?? ''),
            'title_html'      => $raw($banner_content['course_title'] ?? ''),
            'subtitle_html'   => $raw($banner_content['course_subtitle'] ?? ''),
            'price_html'      => $price_html,
            'deposit_percent' => (string) $deposit_percent,
            'deposit_class'   => $deposit_class,
            'deposit'         => $deposit,
            'sale'            => $sale,
            'desc_class'      => 'this' . $deposit_payment_plan,
            'desc_html'       => $raw($banner_content['course_description'] ?? ''),
            'enrol_cc'        => $hero_cc,
            'enrol_href'      => $href(site_url() . '/cart/?addtimetocart&prid=' . $course_product_id),
            'completion_html' => empty($course_completion_text) ? null : $raw($course_completion_text),
            'reviews_count'   => empty($reviews_count) ? null : (string) $reviews_count,
            'klarna_cc'       => $show_klarna ? $current_cc : null,
            'logo'            => $logo,
        );
    }

    /* ---------------------------------------------------------- Key features */
    $key_features         = get_field('key_features', 'option');
    $data['key_features'] = null;
    if (!empty($key_features)) {
        $data['key_features'] = array();
        foreach ((array) $key_features as $feature) {
            $data['key_features'][] = $raw($feature['feature'] ?? '');
        }
    }

    /* --------------------------------------------------------- Course intro */
    $course_intro_section = get_field('course_intro_section');
    $data['intro']        = null;
    if (!is_array_empty($course_intro_section)) {
        $page_navigation = (array) ($course_intro_section['page_navigation'] ?? array());
        $next_enrollment = get_field('timer_expiry', 'option');
        $cutoff          = null;
        $date            = DateTime::createFromFormat('Y/m/d H:i:s', (string) $next_enrollment);
        if ($date !== false) {
            $cutoff = $date->format('l, jS F Y');
        }
        $page_introduction = (array) ($course_intro_section['page_introduction'] ?? array());
        $show_total        = $course_intro_section['show_total_enrollment'] ?? null;
        $students          = $course_intro_section['students_enrolled_this_week'] ?? 0;
        $enrolled          = null;
        if ($show_total && !empty($students)) {
            $product_sold_count = null;
            $product_sold       = tefl_native_course_2024_orders_last_days($course_product_id, 7);
            if ($product_sold) {
                $product_sold_count = $product_sold['count'] ?? 0;
            }
            $enrolled = ($students + $product_sold_count) . ' students ';
        }

        $resources          = null;
        $teaching_resources = get_field('teaching_resources', 'option');
        if ($teaching_resources) {
            $resources = array();
            foreach ((array) $teaching_resources as $tc) {
                $resources[] = array(
                    'pid'      => (string) ($tc['product'] ?? ''),
                    'name'     => (string) ($tc['product_name'] ?? ''), // htmlspecialchars → the raw string
                    'name_html' => $raw($tc['product_name'] ?? ''),
                    'desc'     => (string) ($tc['resources_description'] ?? ''),
                    'pagelink' => (string) ($tc['resource_page_link'] ?? ''),
                );
            }
        }

        $data['intro'] = array(
            'enrolled'   => $enrolled,
            'cutoff'     => empty($cutoff) ? null : $cutoff,
            'resources'  => $resources,
            'enrol_cc'   => $current_cc,
            'enrol_href' => $href(site_url('/cart/?addtimetocart&prid=' . $course_product_id)),
            'emp_choice' => $current_course_id === 13680,
            'title_html' => $raw($page_introduction['title'] ?? ''),
            'desc_html'  => $raw($page_introduction['description'] ?? ''),
        );
        unset($page_navigation);
    }

    /* -------------------------------------------------------- Course outline */
    $course_outline_section = get_field('course_outline_section');
    $data['outline']        = null;
    if (!is_array_empty($course_outline_section)) {
        $accreditation = $is_level_5_diploma_course ? get_field('accreditations_level_5', 'option') : get_field('accreditations', 'option');
        $outlines      = array();
        foreach ((array) ($course_outline_section['outlines'] ?? array()) as $index => $outline) {
            $outlines[] = array(
                'active'     => $index === 0,
                'title_html' => $raw($outline['title'] ?? ''),
                'body_html'  => $raw(((string) ($outline['description'] ?? ''))),
            );
        }
        $partners = null;
        if (!is_array_empty($accreditation)) {
            $partners = array();
            foreach ((array) $accreditation as $partner) {
                $partners[] = array(
                    'logo'       => $txt($partner['logo'] ?? ''),
                    'title_html' => $raw($partner['title'] ?? ''),
                    'link'       => empty($partner['link']) ? null : $href($txt($partner['link'])),
                    'icon'       => $txt($partner['country_icon'] ?? ''),
                );
            }
        }
        $data['outline'] = array(
            'title_html' => $raw($course_outline_section['section_title'] ?? ''),
            'outlines'   => $outlines,
            'partners'   => $partners,
        );
    }

    /* ---------------------------------------------------------- Top benefits */
    $top_benefits_section = get_field('top_benefits_section', 'option');
    $data['benefits']     = null;
    if (!is_array_empty($top_benefits_section)) {
        $items = array();
        foreach ((array) ($top_benefits_section['benefits'] ?? array()) as $key => $benefit) {
            $items[] = array(
                'gap'        => $key === 2,
                'icon'       => $txt($benefit['icon'] ?? ''),
                'title_html' => $raw($benefit['title'] ?? ''),
                'desc_html'  => $raw($benefit['description'] ?? ''),
            );
        }
        $data['benefits'] = array(
            'title_html' => $raw($top_benefits_section['section_title'] ?? ''),
            'items'      => $items,
        );
    }

    /* --------------------------------------------------- Certificate preview */
    $certificate_preview_section = get_field('certificate_preview_section');
    $data['certificate']         = null;
    if (!is_array_empty($certificate_preview_section)) {
        $buttons = array();
        foreach ((array) ($certificate_preview_section['cta_buttons'] ?? array()) as $key => $button) {
            $buttons[] = array(
                'primary'    => $key === 0,
                'link'       => $href($txt($button['link'] ?? '')),
                'label_html' => $raw($button['label'] ?? ''),
            );
        }
        $data['certificate'] = array(
            'title_html' => $raw($certificate_preview_section['section_title'] ?? ''),
            'image'      => $txt($certificate_preview_section['certificate_image'] ?? ''),
            'desc_html'  => $raw($certificate_preview_section['section_description'] ?? ''),
            'buttons'    => $buttons,
        );
    }

    /* -------------------------------------------------------- Course modules */
    $course_modules_section = get_field('course_modules_section');
    $data['modules']        = null;
    if (!is_array_empty($course_modules_section)) {
        $modules = array_values((array) ($course_modules_section['modules'] ?? array()));
        $items   = array();
        foreach ($modules as $module) {
            $items[] = array(
                'short'        => truncate_string((string) ($module['module_title'] ?? ''), 6), // htmlspecialchars → text
                'title_html'   => $raw($module['module_title'] ?? ''),
                'content_html' => $raw(((string) ($module['module_content'] ?? ''))),
            );
        }
        $data['modules'] = array(
            'title_html'      => $raw($course_modules_section['section_title'] ?? ''),
            'completion_html' => $html('Completion Time: ' . ($course_modules_section['course_completion_time'] ?? '')),
            'study_html'      => $html(($course_modules_section['course_study_time'] ?? '') . 'Study Time'),
            'items'           => $items,
        );
    }

    /* ------------------------------------------------------------- CTA boxes */
    $cta_boxes         = get_field('cta_boxes', 'option');
    $data['cta_boxes'] = null;
    if (!is_array_empty($cta_boxes)) {
        $data['cta_boxes'] = array();
        foreach ((array) $cta_boxes as $box) {
            $data['cta_boxes'][] = array(
                'title_html'   => $raw($box['title'] ?? ''),
                'summary_html' => $raw($box['summary'] ?? ''),
                'button_html'  => $raw($box['button_text'] ?? ''),
                'link'         => $href($txt($box['button_link'] ?? '')),
            );
        }
    }

    /* ------------------------------------------------------------ Milestones */
    $milestones         = get_field('milestones', 'option');
    $data['milestones'] = null;
    if (!is_array_empty($milestones)) {
        $data['milestones'] = array();
        foreach ((array) $milestones as $milestone) {
            $data['milestones'][] = array(
                'title_html' => $raw($milestone['title'] ?? ''),
                'desc_html'  => $raw($milestone['description'] ?? ''),
            );
        }
    }

    /* --------------------------------------------------- Guide / prospectus */
    $data['guides'] = null;
    if (!is_array_empty($guides_prospectus_section)) {
        $card = function ($c) use ($raw, $txt, $href) {
            if (empty($c)) {
                return null;
            }
            return array(
                'title_html'   => $raw($c['title'] ?? ''),
                'summary_html' => $raw($c['summary'] ?? ''),
                'image'        => $txt($c['image'] ?? ''),
                'label_html'   => $raw($c['cta_label'] ?? ''),
                'link'         => $href($txt($c['cta_link'] ?? '')),
            );
        };
        $data['guides'] = array(
            'guide'      => $card($guides_prospectus_section['guide'] ?? null),
            'prospectus' => $card($guides_prospectus_section['prospectus'] ?? null),
        );
    }

    /* ------------------------------------------------------------------ Team */
    $team_section = get_field('team_section', 'option');
    $data['team'] = null;
    if (!is_array_empty($team_section)) {
        $members = array();
        foreach ((array) ($team_section['team_members'] ?? array()) as $member) {
            $full_name  = (string) ($member['full_name'] ?? '');
            $name_parts = explode(' ', $full_name);
            $first_name = $name_parts[0] ?? $full_name;
            $members[]  = array(
                'image'        => $txt($member['image'] ?? ''),
                'alt'          => $txt($full_name),
                'caption_html' => $raw($first_name . ', ' . ($member['designation'] ?? '')),
                'desc_html'    => $raw($member['description'] ?? ''),
                'name_html'    => $raw($full_name),
                'desg_html'    => $raw($member['designation'] ?? ''),
            );
        }
        $data['team'] = array(
            'title_html' => $raw($team_section['section_title'] ?? ''),
            'members'    => $members,
        );
    }

    /* ------------------------------------------------ Verified student reviews */
    $verified_reviews_section = get_field('verified_reviews_section');
    $data['reviews']          = null;
    if (!is_array_empty($verified_reviews_section)) {
        $total = isset($reviews_widget['total_reviews']) ? $reviews_widget['total_reviews'] : 1671;
        $pct   = function ($i) use ($reviews_widget) {
            return isset($reviews_widget['star_percentage_' . $i]) ? (float) $reviews_widget['star_percentage_' . $i] : 0;
        };
        $average = (($pct(5) * 5) + ($pct(4) * 4) + ($pct(3) * 3) + ($pct(2) * 2) + ($pct(1) * 1)) / 100;
        $stars   = array();
        for ($i = 5; $i >= 1; $i--) {
            $star = $reviews_widget['star_percentage_' . $i] ?? null;
            if (empty($star)) {
                $star = 0;
            }
            $stars[] = array('i' => $i, 'pct' => (string) $star);
        }
        $data['reviews'] = array(
            'title_html'    => $raw($verified_reviews_section['section_title'] ?? ''),
            'subtitle_html' => $raw($verified_reviews_section['section_subtitle'] ?? ''),
            'average'       => (string) $average,
            'total'         => (string) $total,
            'stars'         => $stars,
            'brb_html'      => $raw((tefl_native_capture(function () {
                echo do_shortcode('[brb_collection id="77247"]');
            }))),
        );
    }

    /* -------------------------------------------------- Video testimonials */
    $video_testimonials_section = get_field('video_testimonials_section', 90386);
    $data['videos']             = null;
    if (!is_array_empty($video_testimonials_section)) {
        $items = array();
        foreach ((array) ($video_testimonials_section['testimonials'] ?? array()) as $t) {
            $items[] = array(
                'thumb'      => $txt($t['thumbnail'] ?? ''),
                'title_html' => $raw($t['title'] ?? ''),
                'name_html'  => $raw($t['name'] ?? ''),
                'desg_html'  => $raw($t['designation'] ?? ''),
                'link'       => $href($txt($t['video_link'] ?? '')),
            );
        }
        $data['videos'] = array(
            'title_html'    => $raw($video_testimonials_section['section_title'] ?? ''),
            'subtitle_html' => $raw($video_testimonials_section['section_subtitle'] ?? ''),
            'items'         => $items,
        );
    }

    /* ---------------------------------------------------------- Offer banner */
    $offer_banner         = get_field('offer_banner', 'option');
    $data['offer_banner'] = null;
    if (!is_array_empty($offer_banner)) {
        $data['offer_banner'] = array(
            'image'       => $txt($offer_banner['banner_image'] ?? ''),
            // .offer-banner-clock: the offer text span, then the countdown shortcode, as one string.
            'clock_html'  => $raw('<span class="font-700 offer-banner-text">' . ($offer_banner['offer_text'] ?? '') . '</span>'
                . tefl_native_capture(function () {
                    echo do_shortcode('[flip_countdown_timer]');
                })),
            'button_html' => $raw($offer_banner['banner_button_text'] ?? ''),
        );
    }

    /* ------------------------------------------------------------------ FAQs */
    $faqs = function_exists('get_cfvalue_by_country') ? get_cfvalue_by_country('frequently_asked_questions') : get_field('frequently_asked_questions');
    $data['faqs'] = array();
    if (is_array($faqs)) {
        foreach ($faqs as $key => $faq) {
            $data['faqs'][] = array(
                'first'         => $key === 0,
                'id'            => (string) $key,
                'question_html' => $raw($faq['question'] ?? ''),
                'answer_html'   => $raw(((string) ($faq['answer'] ?? ''))),
            );
        }
    }

    /* ------------------------------------------------------------- Search */
    $data['search_html'] = $raw(tefl_native_capture(function () {
        echo do_shortcode('[tefl_course_search]');
    }));

    return $data;
}

/**
 * Price Based on Country's AJAX-geolocation wrapper as a page request prints it. In a REST
 * request WCPBC_Ajax_Geolocation::wrapper_price() leaves out the " loading" class and the
 * placeholder span; the page has both (the theme/plugin JS re-prices those wrappers).
 */
function tefl_native_course_2024_price_wrapper($html, $product) {
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
 * count_orders_with_product() without its cookie cache / setcookie() (the REST
 * request never carries the cookie, so the result is the same query).
 */
function tefl_native_course_2024_orders_last_days($product_id, $days_ago) {
    if (empty($product_id) || !is_numeric($product_id)) {
        return array('count' => 0, 'order_ids' => array(), 'message' => 'Invalid product ID');
    }
    if (!function_exists('get_orders_with_product')) {
        return count_orders_with_product($product_id, $days_ago);
    }
    $date_days_ago = date('Y-m-d H:i:s', strtotime("-$days_ago days"));
    return get_orders_with_product($product_id, "p.post_date >= '$date_days_ago'");
}

/**
 * includes/ti-deposit-form.php, resolved. $course_product_id / $deposit_enabled are the
 * template's variables the include reads. null = the include prints nothing; false = can't port.
 */
function tefl_native_course_2024_deposit_form($course_product_id, $deposit_enabled) {
    global $wpdb;
    if (!class_exists('WC_Deposits_Product_Manager') || !class_exists('WC_Deposits_Plans_Manager')) {
        return false;
    }
    $curr_post_type = get_post_type();
    $curr_post_id   = $course_product_id; // 'course' (and anything but 'internship') → the course product

    $plans = get_post_meta($curr_post_id, '_wc_deposit_payment_plans', true);
    $plan  = is_array($plans) ? ($plans[0] ?? null) : null;
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
    if (!is_numeric($plan)) {
        return false;
    }
    $total_deposits = $wpdb->get_var('SELECT count(schedule_id) FROM `wp_wc_deposits_payment_plans_schedule` WHERE `plan_id` = ' . (int) $plan);

    if (!($deposit_enabled == 'optional' || $deposit_enabled == 'required')) {
        return null;
    }
    $default_selected_type = WC_Deposits_Product_Manager::get_deposit_selected_type($curr_post_id);
    $forced                = WC_Deposits_Product_Manager::deposits_forced($curr_post_id);
    $is_plan               = 'plan' === WC_Deposits_Product_Manager::get_deposit_type($curr_post_id);

    $plan_descriptions = array();
    $amount_html       = '';
    if ($is_plan) {
        foreach (WC_Deposits_Plans_Manager::get_plans_for_product($curr_post_id) as $p) {
            $plan_descriptions[] = (string) $deposit_description;
        }
    } else {
        $amount_html = (string) WC_Deposits_Product_Manager::get_formatted_deposit_amount($curr_post_id);
    }

    return array(
        'forced'            => (bool) $forced,
        'breakdown'         => $deposit_enabled == 'forced' || $deposit_enabled == 'optional',
        'object_id'         => (string) $curr_post_id,
        'total_deposits'    => (string) $total_deposits,
        'full_checked'      => (string) $default_selected_type === 'full',
        'deposit_checked'   => (string) $default_selected_type === 'deposit',
        'show'              => 'deposit' === $default_selected_type,
        'is_plan'           => $is_plan,
        'plan_descriptions' => $plan_descriptions,
        'amount_html'       => $amount_html,
    );
}
