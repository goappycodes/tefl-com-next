<?php
/**
 * Native template: single internship (single-internship.php →
 * ti-single-internship-template-new2023.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/internship&path=/<cc>/internship/<slug>/&id=123
 *
 * single-internship.php includes the 2023 design when `is_internship_new_design`
 * is set (every published internship), else the older
 * ti-single-internship-template.php — those posts 404 here (→ passthrough).
 *
 * Mirrors the template's control flow (have_rows() calls in the same order,
 * array_filter() checks, the $section_title carry-over between the "how it
 * works" and excursions sections) and returns every value it prints; the
 * Next template is components/home/Internship.tsx. Shortcodes (timer, CF7,
 * reviews) and WooCommerce's variable add-to-cart form are captured as rendered.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('internship', 'tefl_native_internship');

function tefl_native_internship($pid, $ctx) {
    if (get_post_type($pid) !== 'internship' || !get_field('is_internship_new_design')) {
        return null;
    }
    global $post, $wpdb;
    $s    = 'tefl_native_home_s';
    $href = function ($u) use ($ctx, $s) {
        return call_user_func($ctx['href'], $s($u));
    };
    $html = function ($fragment) use ($ctx, $s) {
        return call_user_func($ctx['html'], $s($fragment));
    };
    $wp = tefl_headless_wp_origin();

    $internship_id         = $post->ID;
    $internship_product_id = get_field('internship_product');
    $internship_product    = wc_get_product($internship_product_id);
    $internship_price_html = '';
    $deposit_enabled = $deposit_payment_plan = $deposit_class = $deposit_percent = null;
    if ($internship_product) {
        $internship_price_html = tefl_native_home_price($internship_product);
        $deposit_enabled       = get_post_meta($internship_product_id, '_wc_deposit_enabled', true);
        $deposit_payment_plan  = '';
        if ($deposit_enabled == 'forced' || $deposit_enabled == 'optional') {
            $plans                = get_post_meta($internship_product_id, '_wc_deposit_payment_plans', true);
            $deposit_payment_plan = is_array($plans) ? ($plans[0] ?? null) : null;
        }
        $deposit_class = '';
        if ($deposit_payment_plan) {
            $deposit_class = 'deposit-full-price payment-plan-' . $deposit_payment_plan;
        }
        $deposit_percent = $deposit_payment_plan
            ? $wpdb->get_var($wpdb->prepare('SELECT amount FROM `wp_wc_deposits_payment_plans_schedule` WHERE `schedule_index` = 0 AND `plan_id` = %d', $deposit_payment_plan))
            : null;
        $deposit_percent = round((float) $deposit_percent / 100, 5);
    }

    $overview                 = get_field('overview');
    $itinerary                = get_field('itinerary');
    $essential_informations   = get_field('essential_information');
    $location                 = get_field('location');
    $cultural_excursions      = get_field('cultural_excursions');
    $show_alerts              = get_field('show_alerts');
    $register_for_alerts_link = get_field('register_for_alerts_link');
    $show_eligibility_checker = get_field('show_eligibility_checker');
    $eligibility_checker      = get_field('eligibility_checker');
    $country_name             = get_field('country_name');
    $reviews_widget           = array_filter((array) get_field('reviews_widget', 'option'));
    $total_reviews_count      = isset($reviews_widget['total_reviews']) ? $reviews_widget['total_reviews'] : 1570;
    $pct = array();
    for ($i = 1; $i <= 5; $i++) {
        $pct[$i] = isset($reviews_widget['star_percentage_' . $i]) ? (float) $reviews_widget['star_percentage_' . $i] : 0;
    }
    $reviews_average = (($pct[5] * 5) + ($pct[4] * 4) + ($pct[3] * 3) + ($pct[2] * 2) + ($pct[1] * 1)) / 100;
    $bars = array();
    for ($i = 5; $i >= 1; $i--) {
        $sp = $reviews_widget['star_percentage_' . $i] ?? null;
        $bars[] = array('star' => $i, 'pct' => $s(empty($sp) ? 0 : $sp));
    }

    $primary_attr  = tefl_native_capture(function () {
        astra_primary_class();
    });
    $primary_class = preg_match('#class=["\']([^"\']*)#', $primary_attr, $m) ? $m[1] : 'content-area primary';

    $base = array(
        'id'            => (int) $pid,
        'wp'            => $wp,
        'primary_class' => $primary_class,
        'hero'          => null,
    );

    $hero_banner_section = get_field('hero_banner_section');
    if (empty($hero_banner_section)) {
        return $base;
    }

    /* ---- Hero ---- */
    $common   = get_field('internship_common_hero_banner_logo', 'option');
    $banner_logo          = $common['banner_logo'] ?? null;
    $selected_internships = !empty($common['selected_internships']) ? $common['selected_internships'] : array();
    $show_alt             = $common['show_internship_alternate_logo'] ?? null;
    $alt_logo = null;
    $alt_selected = array();
    if ($show_alt) {
        $alt_logo     = $common['alternate_internship_banner_logo'] ?? null;
        $alt_selected = !empty($common['alternate_selected_internship']) ? $common['alternate_selected_internship'] : array();
        foreach ($alt_selected as $internship) {
            $key = array_search($internship, $selected_internships);
            if ($key !== false) {
                unset($selected_internships[$key]);
            }
        }
        $selected_internships = array_values($selected_internships);
    }
    $has_gallery = have_rows('image_gallery');
    $hero = array(
        'image'    => $s($hero_banner_section['banner_image'] ?? ''),
        'logo'     => (in_array($internship_id, (array) $selected_internships) && !empty($banner_logo)) ? $s($banner_logo) : null,
        'alt_logo' => ($show_alt && in_array($internship_id, (array) $alt_selected) && !empty($alt_logo)) ? $s($alt_logo) : null,
        'subtitle' => $html($hero_banner_section['hero_subtitle'] ?? ''),
        'title'    => $html($hero_banner_section['hero_title'] ?? ''),
        'cta'      => $has_gallery ? array('icon' => $s($hero_banner_section['hero_cta_icon'] ?? ''), 'text' => $html($hero_banner_section['hero_cta_text'] ?? '')) : null,
    );
    $gallery = null;
    if (have_rows('image_gallery')) {
        $gallery = array_map($s, array_values(tefl_native_home_arr(get_field('image_gallery'))));
    }

    /* ---- Content nav (desktop; the mobile copy is for administrators only) ---- */
    $nav = array();
    $overview = array_filter((array) $overview);
    if (!empty($overview)) {
        $nav[] = array('#overview', 'overview');
    }
    if (have_rows('essential_information')) {
        $nav[] = array('#tripInfo', 'Trip Information');
    }
    if (have_rows('itinerary')) {
        $nav[] = array('#itinerary', 'Itinerary');
    }
    if (have_rows('interns')) {
        $nav[] = array('#testimonials', 'Testimonials');
    }
    $location = array_filter((array) $location);
    if (!empty($location)) {
        $nav[] = array('#locations', 'Locations');
    }
    $how_it_works = array_filter((array) get_field('how_it_works'));
    if (!empty($how_it_works)) {
        $nav[] = array('#howItWorks', 'How It Works');
    }
    $cultural_excursions = array_filter((array) $cultural_excursions);
    if (!empty($cultural_excursions)) {
        $nav[] = array('#excursions', 'Excursions');
    }
    $is_admin = current_user_can('administrator');

    /* ---- Sidebar ---- */
    $sidebar = array('alerts' => null, 'timer' => null, 'ri' => null, 'book' => null, 'screening' => null);
    $ri_mode = null;
    if ($show_alerts) {
        $sidebar['alerts'] = array('country' => $html(get_field('country_name')), 'link' => $href($register_for_alerts_link));
    } else {
        if (!is_global_timer_expired()) {
            $sidebar['timer'] = $html(do_shortcode('[tefl_timer_shortcode_new timer="global"]'));
        }
        $ri_mode = (function_exists('get_field') && get_field('register_interest_mode', get_queried_object_id()));
        if ($ri_mode) {
            $sidebar['ri'] = $html(tefl_native_home_cf7('[contact-form-7 id="110973" title="Internship - Register Your Interest"]', $ctx, 1, false));
        } else {
            $book = null;
            if ($internship_price_html) {
                $book = '';
                if (get_post_type($internship_product_id) == 'product') {
                    if (!$internship_product->is_in_stock()) {
                        $book = '<small style="display:block;line-height: 1.25;font-size: 100%;text-align: center;" class="text-secondary">Please <a href="/contact/">contact</a> our team if you would like your name to be added to our waiting list for when the programme re-opens again.</small>';
                    } elseif ($internship_product->is_type('simple')) {
                        $book = '<a href="' . '/?addtimetocart&prid=' . $internship_product_id . '&date=' . '" class="button book-now-btn"><span>Book Now</span><i class="fa fa-angle-right"></i></a>';
                    } elseif ($internship_product->is_type('variable')) {
                        $form = tefl_native_capture(function () use ($internship_product_id) {
                            $course_product_post = get_post($internship_product_id);
                            setup_postdata($course_product_post); // sets the global $product (WooCommerce's the_post hook)
                            woocommerce_variable_add_to_cart();
                            wp_reset_postdata();
                        });
                        $book = $form
                            . '<div id="priceWrapper" data-depositpercent="' . $s($deposit_percent) . '" class="internship-price ' . $s($deposit_class) . '">'
                            . $internship_price_html
                            . '</div><div class="deposit-breakdown"></div>'
                            . '<a disabled="disabled" rel="nofollow" href="/?addtimetocart&prid=' . $internship_product_id . '" class="button book-now-btn variable-book-now-btn atc-disabled">Book Now</a>';
                    }
                }
                $book = $html($book);
            }
            $sidebar['book'] = $book;
        }
    }
    if (empty($ri_mode)) {
        $sidebar['screening'] = array(
            'link' => $href($eligibility_checker['button']['button_link'] ?? ''),
            'text' => $html($eligibility_checker['button']['button_value'] ?? ''),
        );
    }

    /* ---- Main column ---- */
    $summary = null;
    $internship_summary = get_field('internship_summary');
    if (!empty($internship_summary)) {
        $video = $internship_summary['video'] ?? null;
        $summary = array(
            'title'    => $html($internship_summary['title'] ?? ''),
            'subtitle' => $html($internship_summary['subtitle'] ?? ''),
            'details'  => $html(tefl_headless_cookie_block($s($internship_summary['details'] ?? ''))),
            'video'    => ($video && !empty($video['link'])) ? array('thumb' => $s($video['thumbnail'] ?? ''), 'id' => $s($video['link'])) : null,
        );
    }

    $overview_out = null;
    if (!empty($overview)) {
        $overview_out = array(
            'id'      => strtolower($s($overview['section_title'] ?? '')),
            'title'   => $html($overview['section_title'] ?? ''),
            'summary' => $html(tefl_headless_cookie_block($s($overview['section_summary'] ?? ''))),
        );
    }

    $essentials = null;
    if (have_rows('essential_information')) {
        $items = array();
        foreach (tefl_native_home_arr($essential_informations) as $ei) {
            $list = array();
            foreach (tefl_native_home_arr($ei['list'] ?? null) as $item) {
                $list[] = $html($item['item'] ?? '');
            }
            $items[] = array('title' => $html($ei['title'] ?? ''), 'list' => $list);
        }
        $essentials = array(
            'suffix' => !empty($country_name) ? ' about your trip to ' . tefl_native_txt($s($country_name)) : '',
            'items'  => $items,
        );
    }

    $eligibility = null;
    if ($show_eligibility_checker) {
        $eligibility = array(
            'bg'      => $s($eligibility_checker['background_image'] ?? ''),
            'title'   => $html($eligibility_checker['title'] ?? ''),
            'content' => $html($eligibility_checker['content'] ?? ''),
            'link'    => $href($eligibility_checker['button']['button_link'] ?? ''),
            'text'    => $html($eligibility_checker['button']['button_value'] ?? ''),
        );
    }

    $itin = null;
    if (have_rows('itinerary')) {
        $timeline = array();
        foreach (tefl_native_home_arr($itinerary['timeline'] ?? null) as $t) {
            $timeline[] = array(
                'day'   => $html($t['day'] ?? ''),
                'title' => $html($t['title'] ?? ''),
                'desc'  => $html(tefl_headless_cookie_block($s($t['description'] ?? ''))),
            );
        }
        $itin = array('title' => $html($itinerary['section_title'] ?? ''), 'timeline' => $timeline);
    }

    $testimonials = null;
    $interns = get_field('interns');
    $intern_section_header = get_field('interns_section_header');
    if (have_rows('interns')) {
        $list = array();
        foreach (tefl_native_home_arr($interns) as $intern) {
            $list[] = array(
                'link'    => $href($intern['link'] ?? ''),
                'image'   => $s($intern['image'] ?? ''),
                'name'    => $html($intern['name'] ?? ''),
                'content' => $html($intern['content'] ?? ''),
            );
        }
        $testimonials = array('header' => $html($intern_section_header), 'interns' => $list);
    }

    $banner1 = get_field('full_width_banner_image');
    $banner1 = !empty($banner1) ? $s($banner1) : null;

    $loc = null;
    if (!empty($location)) {
        $loc = array(
            'summary'      => $html($location['content'] ?? ''),
            'map'          => $s($location['map'] ?? ''),
            'group_size'   => $html($location['group_size'] ?? ''),
            'availability' => $html($location['availability'] ?? ''),
            'form_title'   => $html(get_field('form_title', 'option')),
            'country'      => $html($country_name),
            'form_image'   => $s(get_field('form_header_image', 'options')),
            'cf7'          => $html(tefl_native_home_cf7('[contact-form-7 id="57896" title="Want to Learn More?"]', $ctx, 1, false)),
        );
    }

    // Inline script: the page URL / title (printed raw into JS strings) for the form's hidden fields.
    $script = array(
        'url'   => (string) get_permalink(),
        'title' => tefl_native_capture(function () {
            single_post_title();
        }),
    );

    $banner2 = get_field('full_width_banner_2');
    $banner2 = !empty($banner2) ? $s($banner2) : null;

    $section_title = null; // the template's carry-over variable
    $how = null;
    if (!empty($how_it_works)) {
        $section_title = (!isset($section_title) || empty($section_title)) ? 'how it works' : ($how_it_works['title'] ?? null);
        $guide       = array_filter((array) get_field('guide'));
        $guide_popup = array_filter((array) get_field('guide_popup'));
        $guide_out   = null;
        if (!empty($guide)) {
            $guide_out = array(
                'popup'   => (!empty($guide_popup['popup_image']) && !empty($guide_popup['popup_url'])) ? 'yes' : 'no',
                'title'   => $html($guide['title'] ?? ''),
                'content' => $html($guide['content'] ?? ''),
                'image'   => $s($guide['preview_image'] ?? ''),
                'link'    => $href($guide['guide_button_url'] ?? ''),
                'text'    => $html($guide['guide_button_text'] ?? ''),
            );
        }
        $how = array(
            'title'   => $html($section_title),
            'summary' => $html($how_it_works['description'] ?? ''),
            'guide'   => $guide_out,
        );
    }

    $exc = null;
    if (!empty($cultural_excursions)) {
        $section_title = (!isset($section_title) || empty($section_title)) ? 'Cultural Excursions' : ($cultural_excursions['section_title'] ?? null);
        $items = array();
        foreach (tefl_native_home_arr($cultural_excursions['cultural'] ?? null) as $e) {
            $items[] = array(
                'image'       => $s($e['image'] ?? ''),
                'image_title' => $html($e['image_title'] ?? ''),
                'title'       => $html($e['title'] ?? ''),
                'content'     => $html($e['content'] ?? ''),
            );
        }
        $exc = array('title' => $html($section_title), 'summary' => $html($cultural_excursions['content'] ?? ''), 'items' => $items);
    }

    $students = null;
    if (!empty($reviews_widget)) {
        $students = array('slider' => $html(tefl_headless_cookie_block(do_shortcode('[brb_collection id="76915"]'))));
    }

    $learn = null;
    $learn_more_section = get_field('learn_more_section', 'option');
    if (!empty($learn_more_section)) {
        $learn = array(
            'heading' => $html($learn_more_section['section_heading'] ?? ''),
            'summary' => $html($learn_more_section['section_summary'] ?? ''),
            'text'    => $html($learn_more_section['section_cta_button_text'] ?? ''),
            'link'    => $href($learn_more_section['section_cta_button_link'] ?? ''),
        );
    }

    return array_merge($base, array(
        'hero'         => $hero,
        'gallery'      => $gallery,
        'nav'          => $nav,
        'is_admin'     => (bool) $is_admin,
        'sidebar'      => $sidebar,
        'reviews'      => array('average' => $s($reviews_average), 'total' => $s($total_reviews_count), 'bars' => $bars),
        'summary'      => $summary,
        'overview'     => $overview_out,
        'essentials'   => $essentials,
        'eligibility'  => $eligibility,
        'itinerary'    => $itin,
        'testimonials' => $testimonials,
        'banner1'      => $banner1,
        'location'     => $loc,
        'script'       => $script,
        'banner2'      => $banner2,
        'how'          => $how,
        'excursions'   => $exc,
        'students'     => $students,
        'learn'        => $learn,
    ));
}
