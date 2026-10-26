<?php
/**
 * Native template: Homepage Template 2023 (ti-homepage-template-2023.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/homepage2023&path=/<cc>/&id=77005
 *
 * The site front page and the per-market city home pages. Mirrors the
 * template's control flow line for line, including its quirks (variables that
 * carry over from one loop iteration / section to the next, PHP truthiness of
 * half-empty ACF groups, the geo-page fallbacks to the front page's fields),
 * and returns every value it prints, resolved. The Next template
 * (components/home/Homepage2023.tsx) reproduces the markup.
 *
 * Values the template echoes raw (ACF text/WYSIWYG, which may hold markup) are
 * returned as HTML; shortcodes (timers, course search, reviews slider, CF7,
 * Instagram feed) are captured as rendered.
 *
 * 404 (→ passthrough) when the page doesn't use the template.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('homepage2023', 'tefl_native_homepage2023');

/** The template's ti_hp_shared_field(): this page's group, else the front page's. */
function tefl_native_homepage2023_shared($selector) {
    $val = get_field($selector);
    if (is_array_empty($val)) {
        $main_id = (int) get_option('page_on_front');
        if ($main_id && $main_id !== get_queried_object_id()) {
            $val = get_field($selector, $main_id);
        }
    }
    return $val;
}

/** Echo semantics: what `echo $v` prints. */
function tefl_native_homepage2023_s($v) {
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

function tefl_native_homepage2023($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'ti-homepage-template-2023.php') {
        return null;
    }
    $s    = 'tefl_native_homepage2023_s';
    $href = function ($u) use ($ctx, $s) {
        return call_user_func($ctx['href'], $s($u));
    };
    $html = function ($fragment) use ($ctx, $s) {
        return call_user_func($ctx['html'], $s($fragment));
    };

    /* ---- EducationalOrganization JSON-LD ---- */
    $ti_page_url  = get_permalink();
    $ti_page_name = wp_get_document_title();
    $ti_org_schema = array(
        '@context'         => 'https://schema.org',
        '@type'            => 'EducationalOrganization',
        '@id'              => $ti_page_url . '#educational-organization',
        'name'             => 'The TEFL Institute',
        'url'              => $ti_page_url,
        'alternateName'    => $ti_page_name,
        'foundingDate'     => '2017',
        'foundingLocation' => array(
            '@type'   => 'Place',
            'address' => array('@type' => 'PostalAddress', 'addressCountry' => 'IE'),
        ),
        'hasCredential'    => array(
            '@type'              => 'EducationalOccupationalCredential',
            'name'               => 'Level 5 Diploma in Teaching English as a Foreign Language',
            'credentialCategory' => 'Diploma',
            'educationalLevel'   => 'Level 5',
            'identifier'         => array('@type' => 'PropertyValue', 'propertyID' => 'Ofqual', 'value' => '610/1571/4'),
            'recognizedBy'       => array(
                '@type'      => 'EducationalOrganization',
                'name'       => 'Highfield Qualifications',
                'identifier' => array('@type' => 'PropertyValue', 'propertyID' => 'Ofqual centre number', 'value' => '21335'),
            ),
        ),
    );
    $org_schema = wp_json_encode($ti_org_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    $reviews_widget              = get_field('reviews_widget', 'option');
    $homepage_styling            = get_field('homepage_styling', 'option');
    $page_buttons_styling        = get_field('page_buttons_styling');
    $course_card_buttons_styling = $page_buttons_styling['course_card_buttons_styling'] ?? null;
    $course_guide_cta_button     = $course_card_buttons_styling['course_guide_cta_button'] ?? null;
    $course_cta_button           = $course_card_buttons_styling['course_cta_button'] ?? null;

    $course_card_discount_label = $webinar_section_cta_styling = $view_all_reviews_button_styling = $job_center_cta_button_styling = null;
    if (isset($homepage_styling) && !is_array_empty($homepage_styling)) {
        $course_card_discount_label      = $homepage_styling['course_card_discount_label'] ?? null;
        $webinar_section_cta_styling     = $homepage_styling['webinar_section_cta_styling'] ?? null;
        $view_all_reviews_button_styling = $homepage_styling['view_all_reviews_button_styling'] ?? null;
        $job_center_cta_button_styling   = $homepage_styling['job_center_cta_button_styling'] ?? null;
    }

    // astra_primary_class() as printed (`class="content-area primary"`).
    $primary_attr  = tefl_native_capture(function () {
        astra_primary_class();
    });
    $primary_class = preg_match('#class=["\']([^"\']*)#', $primary_attr, $m) ? $m[1] : 'content-area primary';

    /* ---- Hero banner ---- */
    $hero_banner = get_field('hero_banner_new');
    $banner      = (is_array($hero_banner) && !empty($hero_banner['banner'])) ? $hero_banner['banner'] : array();
    if (empty($banner)) {
        $old_hero = get_field('banner');
        if (is_array($old_hero) && (!empty($old_hero['banner_image']) || !empty($old_hero['banner_heading']))) {
            $fb_accred = array();
            $home_hero = get_field('hero_banner_new', (int) get_option('page_on_front'));
            if (is_array($home_hero) && !empty($home_hero['banner'][0]['content_box']['accreditations'])) {
                $fb_accred = $home_hero['banner'][0]['content_box']['accreditations'];
            }
            $banner = array(array(
                'hide_banner'             => false,
                'background_image'        => isset($old_hero['banner_image']) ? $old_hero['banner_image'] : '',
                'background_image_mobile' => isset($old_hero['mobile_banner_image']) ? $old_hero['mobile_banner_image'] : '',
                'banner_overlay'          => true,
                'show_banner_logo'        => false,
                'banner_logo'             => '',
                'banner_logo_link'        => '',
                'show_clockdown'          => false,
                'show_offer_bubble'       => false,
                'content_box'             => array(
                    'is_offer'           => false,
                    'title'              => isset($old_hero['banner_heading']) ? $old_hero['banner_heading'] : '',
                    'subtitle'           => isset($old_hero['banner_subheading']) ? $old_hero['banner_subheading'] : '',
                    'summary'            => '',
                    'cta_buttons'        => array(),
                    'show_clockdown'     => false,
                    'show_accreditation' => !empty($fb_accred),
                    'accreditations'     => is_array($fb_accred) ? $fb_accred : array(),
                ),
            ));
        }
    }

    $slides           = array();
    $mobile_bg_styles = array();
    // Carried across iterations exactly as in the template.
    $show_banner_logo = $banner_logo = $banner_logo_link = $show_logo_clockdown = null;
    $title_box_bg_color = $title_text_color = $bubble_content = $bubble_color = null;
    $accreditations   = null;
    foreach ($banner as $key => $hb) {
        if (!empty($hb['background_image_mobile'])) {
            $mobile_bg_styles[] = array('key' => (string) $key, 'url' => $s($hb['background_image_mobile']));
        }
        $hide_banner      = $hb['hide_banner'] ?? null;
        $banner_bg        = $hb['background_image'] ?? null;
        $has_overlay      = $hb['banner_overlay'] ?? null;
        $show_banner_logo = $hb['show_banner_logo'] ?? null;
        if ($show_banner_logo) {
            $banner_logo         = $hb['banner_logo'] ?? null;
            $banner_logo_link    = $hb['banner_logo_link'] ?? null;
            $show_logo_clockdown = $hb['show_clockdown'] ?? null;
        }
        $content_box      = $hb['content_box'] ?? array();
        $slide_cb_text    = trim(wp_strip_all_tags(($content_box['title'] ?? '') . ' ' . ($content_box['subtitle'] ?? '') . ' ' . ($content_box['summary'] ?? '')));
        $slide_image_link = '';
        if ($slide_cb_text === '' && !is_array_empty($content_box['cta_buttons'] ?? array())) {
            foreach ($content_box['cta_buttons'] as $cb_btn) {
                if (!empty($cb_btn['cta_link'])) {
                    $slide_image_link = $cb_btn['cta_link'];
                    break;
                }
            }
        }
        $show_offer_bubble = $hb['show_offer_bubble'] ?? null;
        if ($show_offer_bubble) {
            $offer_bubble   = $hb['offer_bubble'] ?? array();
            $bubble_content = $offer_bubble['bubble_content'] ?? null;
            $bubble_color   = $offer_bubble['bubble_color'] ?? null;
        }
        if ($hide_banner) {
            continue;
        }

        $is_offer = $content_box['is_offer'] ?? null;
        $title    = $content_box['title'] ?? null;
        $subtitle = $content_box['subtitle'] ?? null;
        if ($is_offer) {
            $title_box_bg_color = $content_box['title_box_bg_color'] ?? null;
            $title_text_color   = $content_box['title_text_color'] ?? null;
        }
        $summary            = $content_box['summary'] ?? null;
        $cta_buttons        = $content_box['cta_buttons'] ?? null;
        $show_clockdown     = $content_box['show_clockdown'] ?? null;
        $show_accreditation = $content_box['show_accreditation'] ?? null;
        if ($show_accreditation) {
            $accreditations = $content_box['accreditations'] ?? null;
        }

        $accred = null;
        if ($show_accreditation && !is_array_empty($accreditations)) {
            $accred = array();
            foreach ($accreditations as $a) {
                $accred[] = array(
                    'title' => $html($a['title'] ?? ''),
                    'logo'  => $s($a['logo'] ?? ''),
                    'desc'  => $html($a['description'] ?? ''),
                    'icon'  => $s($a['country_icon'] ?? ''),
                );
            }
        }

        $links = null;
        if (!is_array_empty($cta_buttons) && empty($slide_image_link)) {
            $links = array();
            foreach ($cta_buttons as $cta_btn) {
                $links[] = array('link' => $href($cta_btn['cta_link'] ?? ''), 'text' => $html($cta_btn['cta_text'] ?? ''));
            }
        }

        $logo = null;
        if ($show_banner_logo && !empty($banner_logo)) {
            $logo = array(
                'src'   => $s($banner_logo),
                'link'  => empty($banner_logo_link) ? '' : $href($banner_logo_link),
                'clock' => $show_logo_clockdown ? $html(do_shortcode('[flip_countdown_timer]')) : '',
            );
        }

        $timer = null;
        if ($show_clockdown) {
            $expiry_date      = get_field('timer_expiry', 'option');
            $expiry_date_unix = strtotime($expiry_date);
            $date_today_unix  = strtotime(date('l, F d y h:i:s'));
            if ($date_today_unix < $expiry_date_unix) {
                $timer = array(
                    'ends'  => date('l jS F', $expiry_date_unix),
                    'timer' => $html(do_shortcode('[tefl_timer_shortcode]')),
                );
            }
        }

        $slides[] = array(
            'key'        => (string) $key,
            'overlay'    => (bool) $has_overlay,
            'bg'         => $s($banner_bg),
            'image_link' => $slide_image_link ? $href(tefl_native_txt(esc_url($slide_image_link))) : '',
            'halloween'  => (int) $key === 1 ? $href(tefl_native_txt(esc_url('https://teflinstitute.com/tefl-course-offers/'))) : '',
            'is_offer'   => (bool) $is_offer,
            'title'      => empty($title) ? null : $html($title),
            'title_bg'   => $s($title_box_bg_color),
            'title_color' => $s($title_text_color),
            'subtitle'   => empty($subtitle) ? null : $html($subtitle),
            'summary'    => $html($summary),
            'accred'     => $accred,
            'links'      => $links,
            'logo'       => $logo,
            'bubble'     => $show_offer_bubble ? array('color' => $s($bubble_color), 'html' => $html($bubble_content)) : null,
            'timer'      => $timer,
        );
    }
    // The mobile logo strip reads the last slide's logo variables.
    $mobile_logo = null;
    if ($show_banner_logo) {
        $mobile_logo = array('src' => $s($banner_logo), 'link' => empty($banner_logo_link) ? '' : $href($banner_logo_link));
    }

    /* ---- CTA section (wraps search, course cards, reviews, CTA cards) ---- */
    $cta = null;
    $button_text_color = $button_bg_color = null; // carried into the reviews / jobs sections
    $cta_section = tefl_native_homepage2023_shared('cta_section');
    if (!empty($cta_section)) {
        $cta_buttons        = $cta_section['cta_buttons'] ?? null;
        $cta_button_styling = $page_buttons_styling['cta_button_styling'] ?? null;
        $button_bg_color           = !empty($cta_button_styling['button_bg_color']) ? $cta_button_styling['button_bg_color'] : '#344734';
        $button_text_color         = !empty($cta_button_styling['button_text_color']) ? $cta_button_styling['button_text_color'] : '#fcfcfc';
        $button_border_color       = !empty($cta_button_styling['button_border_color']) ? $cta_button_styling['button_border_color'] : '#070203';
        $button_bg_color_hover     = !empty($cta_button_styling['button_bg_color_hover']) ? $cta_button_styling['button_bg_color_hover'] : '#fff';
        $button_text_color_hover   = !empty($cta_button_styling['button_text_color_hover']) ? $cta_button_styling['button_text_color_hover'] : '#1c1c1b';
        $button_border_color_hover = !empty($cta_button_styling['button_border_color_hover']) ? $cta_button_styling['button_border_color_hover'] : '#070203';
        $cta_btn_style = array($button_bg_color, $button_text_color, $button_border_color, $button_bg_color_hover, $button_text_color_hover, $button_border_color_hover);

        $cta_blocks_with_full_image_background = $cta_section['cta_blocks_with_full_image_background'] ?? null;
        $expandable_cta_blocks                 = $cta_section['expandable_cta_blocks'] ?? null;
        $cta_section_text                      = $cta_section['cta_section_text'] ?? null;

        $buttons = array();
        if (is_array($cta_buttons) && !empty(array_filter($cta_buttons))) {
            $btn_count = count($cta_buttons);
            foreach ($cta_buttons as $cta_button) {
                $buttons[] = array(
                    'col'  => $s(12 / $btn_count),
                    'link' => $href($cta_button['button_link'] ?? ''),
                    'text' => $html($cta_button['button_text'] ?? ''),
                );
            }
        }

        // Search courses section.
        $search_section_description = get_field('search_section_description');
        $first_paragraph = $search_section_description['first_paragraph'] ?? null;
        $last_paragraph  = $search_section_description['last_paragraph'] ?? null;
        $section_title   = $search_section_description['section_title'] ?? null;
        $desc = function ($text) use ($html) {
            if (empty($text)) {
                return null;
            }
            $words = preg_split('/\s+/', trim($text));
            if (count($words) > 50) {
                $truncated_text = implode(' ', array_slice($words, 0, 50)) . '...';
                return array('id' => 'desc-' . uniqid(), 'short' => $html(wpautop($truncated_text)), 'full' => $html($text));
            }
            return array('id' => '', 'short' => '', 'full' => $html($text));
        };
        $search = array(
            'title'  => empty($section_title) ? null : $html($section_title),
            'first'  => $desc($first_paragraph),
            'body'   => $html(do_shortcode('[tefl_course_search]')),
            'last'   => $desc($last_paragraph),
        );

        // Course cards.
        $cards = null;
        $course_cta_section = tefl_native_homepage2023_shared('course_cta_section');
        if ($course_cta_section) {
            $cards   = array();
            $courses = $course_cta_section['courses'] ?? array();
            $save_percentage = $discount_text_color = $discount_background_color = null;
            foreach (tefl_native_home_arr($courses) as $course) {
                $hide_in_mobile  = $course['hide_in_mobile'] ?? null;
                $post_ID         = $course['course_product'] ?? null;
                $product_ID      = get_post_meta($post_ID, 'course_product', true);
                $course_cta_link = get_permalink($post_ID);
                $product         = wc_get_product($product_ID);
                if (!$product) {
                    return null; // the template fatals on $product->get_price_html()
                }
                $simple_regular_price = $product->get_regular_price();
                $simple_sale_price    = $product->get_sale_price();
                if (is_numeric($simple_regular_price) && is_numeric($simple_sale_price) && $simple_regular_price != 0) {
                    $save_percentage = round((($simple_regular_price - $simple_sale_price) / $simple_regular_price) * 100);
                }
                if (!empty($course_card_discount_label)) {
                    $discount_text_color       = !empty($course_card_discount_label['text_color']) ? $course_card_discount_label['text_color'] : '#ffffff';
                    $discount_background_color = !empty($course_card_discount_label['background_color']) ? $course_card_discount_label['background_color'] : '#a9191d';
                }
                $course_title = $course['course_title'] ?? '';
                $deposit_info = $course['deposit_info'] ?? array();
                $course_summary = $course['course_summary'] ?? '';
                $course_features = $course['course_features'] ?? null;

                $deposit_enabled      = get_post_meta($product_ID, '_wc_deposit_enabled', true);
                $deposit_payment_plan = '';
                if ($deposit_enabled == 'forced' || $deposit_enabled == 'optional') {
                    $plans                = get_post_meta($product_ID, '_wc_deposit_payment_plans', true);
                    $deposit_payment_plan = is_array($plans) ? ($plans[0] ?? null) : null;
                }

                $course_label = $course['course_label'] ?? null;
                $label        = null;
                if (!is_array_empty($course_label) && !empty($course_label['label_text'])) {
                    $label = array(
                        'text'   => $html($course_label['label_text']),
                        'color'  => !empty($course_label['label_text_color']) ? $s($course_label['label_text_color']) : '#fff',
                        'bg'     => !empty($course_label['label_bg_color']) ? $s($course_label['label_bg_color']) : '#ffa01c',
                        'border' => !empty($course_label['label_border_color']) ? $s($course_label['label_border_color']) : '#ffa01c',
                    );
                }

                $plain_text_summary = strip_tags($course_summary);
                $words = str_word_count($plain_text_summary, 1);
                $summary_out = count($words) > 50 ? implode(' ', array_slice($words, 0, 50)) . '...' : $plain_text_summary;

                $features = array();
                foreach (tefl_native_home_arr($course_features) as $course_feature) {
                    $features[] = $html($course_feature['feature_text'] ?? '');
                }

                $btn = function ($b) use ($s) {
                    return array(
                        !empty($b['bg_color']) ? $s($b['bg_color']) : '#344734',
                        !empty($b['text_color']) ? $s($b['text_color']) : '#fcfcfc',
                        !empty($b['border_color']) ? $s($b['border_color']) : '#070203',
                        !empty($b['bg_color_hover']) ? $s($b['bg_color_hover']) : '#fff',
                        !empty($b['text_color_hover']) ? $s($b['text_color_hover']) : '#1c1c1b',
                        !empty($b['border_color_hover']) ? $s($b['border_color_hover']) : '#070203',
                    );
                };

                $trustpilot_tag = '';
                if (strpos($course_title, '120') !== false) {
                    $trustpilot_tag = '120';
                } elseif (strpos($course_title, '180') !== false) {
                    $trustpilot_tag = '180';
                } elseif (strpos($course_title, '300') !== false) {
                    $trustpilot_tag = 'L5';
                }

                $cards[] = array(
                    'col_class'    => ($hide_in_mobile ? 'hide-in-mobile' : '') . ' ast-col-md-4 ' . $s($deposit_payment_plan),
                    'label_bg_var' => $s($course_label['label_bg_color'] ?? ''),
                    'has_label'    => !empty($course_label['label_text']),
                    'product_id'   => $s($product_ID),
                    'label'        => $label,
                    'link'         => $href($course_cta_link),
                    'icon'         => $s($course['course_icon'] ?? ''),
                    'title'        => $html($course_title),
                    'price'        => $html(tefl_native_home_price($product)),
                    'discount'     => array($s($discount_text_color), $s($discount_background_color)),
                    'save'         => $s($save_percentage) . '% off',
                    'deposit'      => array(
                        'icon'  => $s($deposit_info['deposit_icon'] ?? ''),
                        'title' => $html($deposit_info['deposit_title'] ?? ''),
                        'desc'  => $html($deposit_info['deposit_description'] ?? ''),
                    ),
                    'summary'      => $html($summary_out),
                    'features'     => $features,
                    'cta_style'    => $btn($course_cta_button),
                    'cta_text'     => $html($course['cta_button_text'] ?? ''),
                    'guide_link'   => $href($course['course_guide_link'] ?? ''),
                    'guide_style'  => $btn($course_guide_cta_button),
                    'tp_tag'       => $trustpilot_tag,
                );
            }
        }

        // Verified reviews.
        $reviews = null;
        $verified_reviews_section = tefl_native_homepage2023_shared('verified_reviews_section');
        if ($verified_reviews_section) {
            $google_reviews     = get_field('google_reviews', 'option');
            $trustpilot_reviews = get_field('trustpilot_reviews', 'option');
            $google_link = 'https://www.google.com/search?sca_esv=8d785069c21da656&sca_upv=1&hl=en-IE&gl=ie&q=The+TEFL+Institute+Ireland+%7C+TEFL+Courses+%26+Certification,+13+Adelaide+Rd,+Saint+Kevin%27s,+Dublin,+D02+P950&uds=ADvngMhDJElofzFqOx8yLCqxrZBfORdohN-zZWd2DtE2wkfY_Hz8LxAbxWyTqbQXp_hpoUOW2uxhpWyrB1IL2IpdWcWiPs5S-vGBywcJzrO9PJe_HdF91Ppndo2Knjst1hsy0DuQ_1Yy71pyrotGeYeqK9tgwKhS1Dz3nAO5HG6XIft-vP8sUXZPMIt75-GkZH8kdUstEDG07k_uQg6GZSA3HkqfKbTCnzBS1_wxYJkYsxPWWzYHd35xJVCoLbwXmLTFBoT-lFXh&si=ACC90nwjPmqJHrCEt6ewASzksVFQDX8zco_7MgBaIawvaF4-7mSRR1kRGE4hCmZtLOUumbi46V_tOIxRTOEjel4eIAxPbsZAzQfZDyayafoOPMus5kIWjD0%3D&sa=X&ved=2ahUKEwixoZaa4Z6HAxUHYEEAHXfKDf8Q3PALegQIGxAE&biw=1536&bih=745&dpr=2';
            $tp_link     = 'https://uk.trustpilot.com/review/teflinstitute.com';
            $total_reviews_count = isset($reviews_widget['total_reviews']) ? $reviews_widget['total_reviews'] : 1570;
            $pct = array();
            for ($i = 1; $i <= 5; $i++) {
                $pct[$i] = isset($reviews_widget['star_percentage_' . $i]) ? (float) $reviews_widget['star_percentage_' . $i] : 0;
            }
            $reviews_average = (($pct[5] * 5) + ($pct[4] * 4) + ($pct[3] * 3) + ($pct[2] * 2) + ($pct[1] * 1)) / 100;
            if (!empty($view_all_reviews_button_styling)) {
                $button_text_color = !empty($view_all_reviews_button_styling['button_text_color']) ? $view_all_reviews_button_styling['button_text_color'] : '#ffffff';
                $button_bg_color   = !empty($view_all_reviews_button_styling['button_bg_color']) ? $view_all_reviews_button_styling['button_bg_color'] : '#1c1c1b';
            }
            $bars = array();
            for ($i = 5; $i >= 1; $i--) {
                $star_percentage = $reviews_widget['star_percentage_' . $i] ?? null;
                if (empty($star_percentage)) {
                    $star_percentage = 0;
                }
                $bars[] = array('star' => $i, 'pct' => $s($star_percentage));
            }
            $tp = null;
            if (!is_array_empty($trustpilot_reviews)) {
                $tp = array(
                    'link'   => tefl_native_txt(esc_url($tp_link)),
                    'icon'   => !empty($trustpilot_reviews['reviews_icon']) ? tefl_native_txt(esc_url($trustpilot_reviews['reviews_icon'])) : '',
                    'rating' => tefl_native_txt(esc_html($trustpilot_reviews['reviews_rating'] ?? '')),
                    'count'  => tefl_native_txt(esc_html($trustpilot_reviews['reviews_count'] ?? '')),
                );
            }
            $reviews = array(
                'title'       => $html($verified_reviews_section['section_title'] ?? ''),
                'subtitle'    => $html($verified_reviews_section['section_subtitle'] ?? ''),
                'btn'         => array($s($button_text_color), $s($button_bg_color)),
                'average'     => $s($reviews_average),
                'total'       => $s($total_reviews_count),
                'bars'        => $bars,
                'google_link' => tefl_native_txt(esc_url($google_link)),
                'g_rating'    => tefl_native_txt(esc_html(($google_reviews['reviews_rating'] ?? '') ?: '4.9')),
                'g_count'     => tefl_native_txt(esc_html(($google_reviews['reviews_count'] ?? '') ?: '1.8k')),
                'tp'          => $tp,
                'slider'      => $html(tefl_headless_cookie_block(do_shortcode('[brb_collection id="77247"]'))),
            );
        }

        $exp = array();
        if (is_array($expandable_cta_blocks) && !empty(array_filter($expandable_cta_blocks))) {
            foreach ($expandable_cta_blocks as $key => $b) {
                $exp[] = array(
                    'key'     => $s($key),
                    'bg'      => $s($b['cta_bg_image'] ?? ''),
                    'title'   => $html($b['cta_title'] ?? ''),
                    'summary' => $html($b['cta_summary'] ?? ''),
                    'btn'     => $html($b['cta_button_text'] ?? ''),
                );
            }
        }
        $img_cards = array();
        if (is_array($cta_blocks_with_full_image_background) && !empty(array_filter($cta_blocks_with_full_image_background))) {
            foreach ($cta_blocks_with_full_image_background as $b) {
                $img_cards[] = array(
                    'bg'      => $s($b['cta_bg_image'] ?? ''),
                    'title'   => $html($b['cta_title'] ?? ''),
                    'summary' => $html($b['cta_summary'] ?? ''),
                    'btn'     => $html($b['cta_button_text'] ?? ''),
                    'link'    => $href($b['cta_button_link'] ?? ''),
                );
            }
        }

        $cta = array(
            'btn_style' => array_map($s, $cta_btn_style),
            'buttons'   => $buttons,
            'search'    => $search,
            'cards'     => $cards,
            'reviews'   => $reviews,
            'exp'       => $exp,
            'text'      => empty($cta_section_text) ? null : $html($cta_section_text),
            'img_cards' => $img_cards,
        );
    }

    /* ---- Webinars ---- */
    $webinars            = null;
    $webinar_cta_section = get_field('webinar_cta_section');
    $latest_webinars     = get_latest_webinars(2);
    if ($webinar_cta_section && $latest_webinars) {
        $list = array();
        foreach ($latest_webinars as $latest_webinar) {
            if (!$latest_webinar) {
                continue;
            }
            $wid    = $latest_webinar->ID;
            $list[] = array(
                'title'    => $html($latest_webinar->post_title),
                'location' => $html(get_field('webinar_location', $wid)),
                'date'     => $html(get_field('webinar_date', $wid)),
                'time'     => $html(get_field('webinar_time', $wid)),
                'image'    => $s(get_the_post_thumbnail_url($wid, 'full')),
            );
        }
        $webinars = array(
            'title'    => $html($webinar_cta_section['section_title'] ?? ''),
            'subtitle' => $html($webinar_cta_section['section_subtitle'] ?? ''),
            'btn'      => array(
                !empty($webinar_section_cta_styling['cta_button_text_color']) ? $s($webinar_section_cta_styling['cta_button_text_color']) : '#ffffff',
                !empty($webinar_section_cta_styling['cta_button_bg_color']) ? $s($webinar_section_cta_styling['cta_button_bg_color']) : '#217482',
            ),
            'list'     => $list,
            'register' => $href('/upcoming-tefl-webinars/'),
        );
    }

    /* ---- TEFL AI + app download ---- */
    $tefl_ai_cta_section  = tefl_native_homepage2023_shared('tefl_ai_cta_section');
    $app_download_section = tefl_native_homepage2023_shared('app_download_section');
    $ai_app = array(
        'ai_title'  => $html($tefl_ai_cta_section['section_title'] ?? ''),
        'app_title' => $html($app_download_section['section_title'] ?? ''),
        'app_text'  => $html($app_download_section['section_summary'] ?? ''),
        'app_image' => $s($app_download_section['section_image'] ?? ''),
    );

    /* ---- Video testimonials ---- */
    $videos = null;
    $video_testimonials_section = tefl_native_homepage2023_shared('video_testimonials_section');
    if ($video_testimonials_section) {
        $items = array();
        foreach (tefl_native_home_arr($video_testimonials_section['testimonials'] ?? null) as $t) {
            $items[] = array(
                'thumb' => $s($t['thumbnail'] ?? ''),
                'name'  => $html($t['name'] ?? ''),
                'role'  => $html($t['designation'] ?? ''),
                'video' => $href($t['video_link'] ?? ''),
            );
        }
        $videos = array(
            'title'    => $html($video_testimonials_section['section_title'] ?? ''),
            'subtitle' => $html($video_testimonials_section['section_subtitle'] ?? ''),
            'items'    => $items,
        );
    }

    /* ---- Jobs ---- */
    $jobs         = null;
    $jobs_section = tefl_native_homepage2023_shared('jobs_section');
    if (!is_array_empty($jobs_section)) {
        if (!empty($job_center_cta_button_styling)) {
            $button_text_color = !empty($job_center_cta_button_styling['button_text_color']) ? $job_center_cta_button_styling['button_text_color'] : '#ffffff';
            $button_bg_color   = !empty($job_center_cta_button_styling['button_bg_color']) ? $job_center_cta_button_styling['button_bg_color'] : '#1c1c1b';
        }
        $items = array();
        foreach (tefl_native_home_arr($jobs_section['jobs'] ?? null) as $job) {
            $items[] = array(
                'image'    => $s($job['featured_image'] ?? ''),
                'location' => $html($job['job_location'] ?? ''),
                'title'    => $html(truncate_string($s($job['job_title'] ?? ''), 6)),
                'posted'   => $s($job['posted'] ?? ''),
                'salary'   => $html($job['salary_text'] ?? ''),
                'link'     => $href($job['job_link'] ?? ''),
            );
        }
        $jobs = array(
            'title'    => $html($jobs_section['section_title'] ?? ''),
            'subtitle' => $html($jobs_section['section_summary'] ?? ''),
            'btn'      => array($s($button_text_color), $s($button_bg_color)),
            'items'    => $items,
        );
    }

    /* ---- Partner logos ---- */
    $logos = array();
    foreach (array('first_gallery', 'second_gallery') as $g) {
        $imgs = get_field($g, 'options');
        $logos[] = $imgs ? array_map($s, tefl_native_home_arr($imgs)) : array();
    }

    /* ---- FAQs ---- */
    $frequently_asked_questions = get_cfvalue_by_country('frequently_asked_questions');
    if (empty($frequently_asked_questions) || !is_array($frequently_asked_questions)) {
        $faq_main_id = (int) get_option('page_on_front');
        if ($faq_main_id && $faq_main_id !== get_queried_object_id()) {
            $frequently_asked_questions = get_field('frequently_asked_questions', $faq_main_id);
        }
    }
    if (!is_array($frequently_asked_questions)) {
        $frequently_asked_questions = array();
    }
    $ld = array();
    $faqs = array();
    foreach ($frequently_asked_questions as $item) {
        $ld[] = array(
            '@type'          => 'Question',
            'name'           => $item['question'] ?? null,
            'acceptedAnswer' => array('@type' => 'Answer', 'text' => $item['answer'] ?? null),
        );
        $faqs[] = array('q' => $html($item['question'] ?? ''), 'a' => $html($item['answer'] ?? ''));
    }
    $faq_ld = wp_json_encode(array('@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $ld));

    // A page view has rendered one CF7 form before this one; the template is outside the loop.
    $cf7   = $html(tefl_native_home_cf7('[contact-form-7 id="77295" title="Home Contact Form"]', $ctx, 1, false));
    $insta = $html(tefl_headless_cookie_block(do_shortcode('[insta-gallery id="1"]')));

    return array(
        'id'            => (int) $pid,
        'wp'            => tefl_headless_wp_origin(), // for the template's hardcoded /wp-content/ assets
        'org_schema'    => $org_schema,
        'primary_class' => $primary_class,
        'slides'        => $slides,
        'mobile_bg'     => $mobile_bg_styles,
        'mobile_logo'   => $mobile_logo,
        'cta'           => $cta,
        'webinars'      => $webinars,
        'ai_app'        => $ai_app,
        'videos'        => $videos,
        'jobs'          => $jobs,
        'logos'         => $logos,
        'faq_ld'        => $faq_ld,
        'faqs'          => $faqs,
        'cf7'           => $cf7,
        'insta'         => $insta,
    );
}
