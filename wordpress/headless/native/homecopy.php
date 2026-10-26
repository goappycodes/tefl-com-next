<?php
/**
 * Native template: Homepage Copy (homepage_copy.php, /home-copy/).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/homecopy&path=/<cc>/home-copy/&id=65158
 *
 * The pre-2023 homepage layout, kept on one page. Mirrors the template's
 * control flow and returns every value it prints; the course card prices,
 * course search, reviews widget and FAQ JSON-LD as the template produces
 * them. components/home/HomeCopy.tsx reproduces the markup.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('homecopy', 'tefl_native_homecopy');

function tefl_native_homecopy($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'homepage_copy.php') {
        return null;
    }
    $s    = 'tefl_native_home_s';
    $arr  = 'tefl_native_home_arr';
    $href = function ($u) use ($ctx, $s) {
        return call_user_func($ctx['href'], $s($u));
    };
    $html = function ($fragment) use ($ctx, $s) {
        return call_user_func($ctx['html'], $s($fragment));
    };

    $webinars = get_posts(array(
        'numberposts' => 3,
        'post_type'   => 'webinar',
        'status'      => 'publish',
        'tax_query'   => array(array('taxonomy' => 'webinar_category', 'field' => 'slug', 'terms' => array('upcoming'))),
        'meta_key'    => 'webinar_date',
        'orderby'     => 'meta_value_num',
        'order'       => 'ASC',
    ));

    $banner              = get_field('banner');
    $slider              = get_field('slider');
    $banner_link_buttons = get_field('banner_link_buttons');
    $banner_button       = $banner['banner_button'] ?? null;
    $links = array();
    for ($n = 1; $n <= 3; $n++) {
        $b       = $banner_link_buttons['banner_link_button' . $n] ?? array();
        $links[] = array('link' => $href($b['banner_link' . $n] ?? ''), 'text' => $html($b['banner_link' . $n . '_text'] ?? ''));
    }

    /* ---- Slider ---- */
    $slides = array();
    if ($slider) {
        $slide_count = 1;
        foreach ($arr($slider) as $el) {
            $price = '';
            if (!empty($el['product'])) {
                $p = wc_get_product($el['product']);
                if ($p) {
                    $price = tefl_native_home_price($p);
                }
            }
            $slide = array('n' => $slide_count, 'free' => null, 'std' => null);
            if (!empty($el['free_offer_banner'])) {
                $expiry = $el['free_product_offer_expiry_date'] ?? '';
                if (strtotime($expiry) - time() > 0) {
                    $slide['free'] = array(
                        'title'   => $html($el['banner_title'] ?? ''),
                        'product' => $html($el['product_name'] ?? ''),
                        'link'    => $href(get_the_permalink($el['free_product'] ?? 0)),
                        'expiry'  => $s($expiry),
                    );
                }
            } else {
                $button = $el['button'] ?? array();
                $slide['std'] = array(
                    'bg'           => $s($el['background'] ?? ''),
                    'mobile_bg'    => $s($el['mobile_background'] ?? ''),
                    'link'         => !empty($el['link']) ? $href($el['link']) : '',
                    'overlay'      => empty($el['hide_overlay']),
                    'title'        => $html($el['title'] ?? ''),
                    'price'        => $html($price),
                    'subtitle'     => $html($el['subtitle'] ?? ''),
                    // The template tests the banner's button but prints the slide's.
                    'button'       => (!empty($banner_button['button_link']) && !empty($banner_button['button_value']))
                        ? array('link' => $href($button['button_link'] ?? ''), 'text' => $html($button['button_value'] ?? ''))
                        : null,
                    'show_buttons' => empty($el['hide_buttons_and_icons']),
                );
            }
            $slides[] = $slide;
            $slide_count++;
        }
    }

    $logos = array();
    foreach (array('first_gallery', 'second_gallery') as $g) {
        $imgs    = get_field($g, 'options');
        $logos[] = $imgs ? array_map($s, $arr($imgs)) : array();
    }

    /* ---- Government regulated ---- */
    $govt = get_field('govt_regulated_courses');
    $govt_out = array(
        'heading' => $html(get_repeater_cfvalue_by_country('govt_regulated_courses', 'govt_regulated_course_heading')),
        'details' => $html(get_repeater_cfvalue_by_country('govt_regulated_courses', 'govt_regulated_course_details')),
        'banner'  => $s($govt['govt_regulated_course_media_banner'] ?? ''),
        'title'   => $html($govt['govt_regulated_course_media_banner_title'] ?? ''),
        'video'   => $href($govt['course_video'] ?? ''),
        'section' => $html($govt['section_title'] ?? ''),
    );

    $course_group = function ($field) use ($arr, $s, $html, $href) {
        $out = array();
        foreach ($arr(get_field($field)) as $c) {
            $product = wc_get_product($c['course_product'] ?? 0);
            if (!$product) {
                return false; // the template fatals on ->is_type()
            }
            $price_html = '';
            if ($product->is_type('simple')) {
                $price_html = tefl_native_home_price($product);
            } elseif ($product->is_type('variable')) {
                $children = $product->get_children();
                $var      = wc_get_product($children[count($children) - 1] ?? 0);
                $price_html = $var ? tefl_native_home_price($var) : '';
            }
            $reg  = $product->get_regular_price();
            $sale = $product->get_sale_price();
            $pct  = ((float) $reg) != 0 ? round((((float) $reg - (float) $sale) / (float) $reg) * 100) : '';
            $zoom = null;
            if (!empty($c['zoom_classes'])) {
                $zp    = !empty($c['zoom_classes_product']) ? wc_get_product($c['zoom_classes_product']) : null;
                $zoom  = array('text' => $html($c['zoom_classes']), 'price' => $html($zp ? tefl_native_home_price($zp) : ''));
            }
            $images = null;
            if (!empty($c['course_bottom_images'])) {
                $images = array();
                foreach ($arr($c['course_bottom_images']) as $e) {
                    $images[] = array('icon' => $s($e['icon'] ?? ''), 'inactive' => !empty($e['inactive']));
                }
            }
            $out[] = array(
                'icon'   => $s($c['course_icon'] ?? ''),
                'pct'    => $s($pct),
                'price'  => $html($price_html),
                'zoom'   => $zoom,
                'title'  => $html($c['course_title'] ?? ''),
                'desc'   => $html($c['course_description'] ?? ''),
                'images' => $images,
                'link'   => $href(get_the_permalink($c['course'] ?? 0)),
            );
        }
        return $out;
    };
    $accredited = $course_group('accredited_courses');
    $level5     = $course_group('level_5_govt_regulated_courses');
    if ($accredited === false || $level5 === false) {
        return null;
    }
    $browse = get_field('browse_course_button');

    /* ---- Internships (from the Internships overview page) ---- */
    $cards = array();
    foreach ($arr(get_field('internships', '59815')) as $e) {
        $course_price_html = '';
        $cp = !empty($e['product']) ? wc_get_product($e['product']) : false;
        if ($cp instanceof WC_Product) {
            if ($cp->is_type('simple')) {
                $course_price_html = tefl_native_home_price($cp);
            } elseif ($cp->is_type('variable')) {
                $children = $cp->get_children();
                if (!empty($children)) {
                    $vp = wc_get_product(end($children));
                    if ($vp instanceof WC_Product) {
                        $course_price_html = tefl_native_home_price($vp);
                    }
                }
                if ($course_price_html === '') {
                    $course_price_html = tefl_native_home_price($cp);
                }
            }
        }
        if ($course_price_html === '') {
            continue;
        }
        $benefits = array();
        foreach ($arr($e['benefits'] ?? null) as $b) {
            $benefits[] = $html($b['item'] ?? '');
        }
        $cards[] = array(
            'link'        => $href($e['link'] ?? ''),
            'image'       => $s($e['image'] ?? ''),
            'country'     => $html($e['country'] ?? ''),
            'price'       => $html($course_price_html),
            'benefits'    => $benefits,
            'guide_image' => $s($e['guide']['image'] ?? ''),
            'guide_link'  => $href($e['guide']['link'] ?? ''),
        );
    }

    $choice = get_field('home_choice_banner');
    $icons  = null;
    if (!empty($choice['home_choice_banner_icons'])) {
        $icons = array();
        foreach ($arr($choice['home_choice_banner_icons']) as $e) {
            $icons[] = array('icon' => $s($e['icon'] ?? ''), 'text' => $html($e['text'] ?? ''));
        }
    }
    $center = get_field('home_center_banner');
    $video  = get_field('tefl_video_section');
    $vids   = array();
    foreach (array(1, 2) as $n) {
        $v      = $video['tefl_video' . $n] ?? array();
        $vids[] = array(
            'img'  => $s($v['tefl_video' . $n . '_thumbnail'] ?? ''),
            'text' => $html($v['tefl_video' . $n . '_caption'] ?? ''),
            'url'  => $href($v['tefl_video' . $n . '_url'] ?? ''),
        );
    }
    $review_banner = get_field('students_review_banner');

    $why     = get_field('why_choose_us');
    $reasons = array();
    for ($n = 1; $n <= 6; $n++) {
        $r         = $why['reason' . $n] ?? array();
        $reasons[] = array(
            'title' => $html($r['reason' . $n . '_heading'] ?? ''),
            'img'   => $s($r['reason' . $n . '_icon'] ?? ''),
            'text'  => $html($r['reason' . $n . '_text'] ?? ''),
        );
    }

    $wfield = get_field('webinars');
    $wlist  = array();
    foreach ($arr($webinars) as $w) {
        $wlist[] = array(
            'image'    => $s(get_the_post_thumbnail_url($w->ID, 'full')),
            'title'    => $html($w->post_title),
            'location' => $html(get_field('webinar_location', $w->ID)),
            'date'     => $html(get_field('webinar_date', $w->ID)),
            'time'     => $html(get_field('webinar_time', $w->ID)),
        );
    }

    $faq = get_cfvalue_by_country('frequently_asked_questions');
    $faqs = null;
    $faq_ld = '';
    if ($faq) {
        $faqs = array();
        $ld   = array();
        foreach ($arr($faq) as $item) {
            $faqs[] = array('q' => $html($item['question'] ?? ''), 'a' => $html($item['answer'] ?? ''));
            $ld[]   = array('@type' => 'Question', 'name' => $item['question'] ?? null, 'acceptedAnswer' => array('@type' => 'Answer', 'text' => $item['answer'] ?? null));
        }
        $faq_ld = wp_json_encode(array('@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $ld));
    }

    $go = get_field('tefl_on_the_go');

    return array(
        'id'          => (int) $pid,
        'wp'          => tefl_headless_wp_origin(),
        'mobile_bg'   => $s($banner['mobile_banner_image'] ?? ''),
        'slides'      => $slides,
        'links'       => $links,
        'search'      => $html(do_shortcode('[tefl_course_search]')),
        'logos'       => $logos,
        'govt'        => $govt_out,
        'accredited'  => $accredited,
        'level5'      => $level5,
        'browse'      => array('link' => $href($browse['browse_course_link'] ?? ''), 'text' => $html($browse['browse_course_link_text'] ?? '')),
        'cards'       => $cards,
        'choice'      => array('image' => $s($choice['home_choice_banner_image'] ?? ''), 'text' => $html($choice['home_choice_banner_text'] ?? ''), 'icons' => $icons),
        'center'      => array('image' => $s($center['home_center_banner_image'] ?? ''), 'text' => $html($center['home_center_banner_text'] ?? '')),
        'videos'      => $vids,
        'review_banner' => $review_banner ? $s($review_banner) : '',
        'reviews'     => $html(tefl_headless_cookie_block(do_shortcode('[brb_collection id="1150"]'))),
        'why_title'   => $html($why['section_title'] ?? ''),
        'reasons'     => $reasons,
        'webinars'    => array(
            'title'    => $html($wfield['section_title'] ?? ''),
            'list'     => $wlist,
            'link'     => $href($wfield['button_link'] ?? ''),
            'text'     => $html($wfield['button_text'] ?? ''),
            'register' => $href('/upcoming-webinars/'),
        ),
        'faqs'        => $faqs,
        'faq_ld'      => $faq_ld,
        'go'          => array(
            'title'    => $html($go['section_title'] ?? ''),
            'subtitle' => $html($go['section_subtitle'] ?? ''),
            'text'     => $html($go['content_text'] ?? ''),
            'image'    => $s($go['image'] ?? ''),
            'play'     => !empty($go['play_store_link']) ? $href($go['play_store_link']) : '',
            'app'      => !empty($go['app_store_link']) ? $href($go['app_store_link']) : '',
        ),
    );
}
