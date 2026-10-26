<?php
/**
 * Native template: Internships overview page (page-internships.php, /tefl-internships/).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/internships&path=/<cc>/tefl-internships/&id=59815
 *
 * Returns every value the template prints (ACF groups, the internship cards
 * with their WooCommerce prices — a variable product shows its last
 * variation's price — and the journal posts); shortcodes (CF7 ×2, Instagram)
 * as rendered. components/home/Internships.tsx reproduces the markup.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('internships', 'tefl_native_internships');

function tefl_native_internships($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'page-internships.php') {
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

    $hero                 = get_field('hero');
    $our_tefl_internships = get_field('our_tefl_internships');
    $internships          = get_field('internships');
    $highlights           = get_field('highlights');
    $more_details         = get_field('more_details');
    $travel_advisor       = get_field('travel_advisor');
    $journal              = get_field('journal');

    $primary_attr  = tefl_native_capture(function () {
        astra_primary_class();
    });
    $primary_class = preg_match('#class=["\']([^"\']*)#', $primary_attr, $m) ? $m[1] : 'content-area primary';

    $included = array();
    foreach ($arr($our_tefl_internships['included'] ?? null) as $e) {
        $included[] = $html($e['item'] ?? '');
    }

    $cards = array();
    foreach ($arr($internships) as $e) {
        $course_price_html = '';
        $course_product_id = $e['product'] ?? null;
        $course_product    = $course_product_id ? wc_get_product($course_product_id) : false;
        if ($course_product instanceof WC_Product) {
            if ($course_product->is_type('simple')) {
                $course_price_html = tefl_native_home_price($course_product);
            } elseif ($course_product->is_type('variable')) {
                $available_children = $course_product->get_children();
                if (!empty($available_children)) {
                    $variable_product = wc_get_product(end($available_children));
                    if ($variable_product instanceof WC_Product) {
                        $course_price_html = tefl_native_home_price($variable_product);
                    }
                }
                if ($course_price_html === '') {
                    $course_price_html = tefl_native_home_price($course_product);
                }
            }
        }
        if ($course_price_html === '' || !$course_product || $course_product->get_price() === '') {
            continue;
        }
        $benefits = array();
        foreach ($arr($e['benefits'] ?? null) as $b) {
            $benefits[] = $html($b['item'] ?? '');
        }
        $guide   = $e['guide'] ?? null;
        $cards[] = array(
            'image'       => $s($e['image'] ?? ''),
            'country'     => $html($e['country'] ?? ''),
            'price'       => $html($course_price_html),
            'benefits'    => $benefits,
            'link'        => $href($e['link'] ?? ''),
            'guide_image' => $s($guide['image'] ?? ''),
            'guide_link'  => $href($guide['link'] ?? ''),
        );
    }

    $side = function ($k) use ($more_details, $s, $html) {
        $g = $more_details[$k] ?? array();
        return array('icon' => $s($g['icon'] ?? ''), 'title' => $html($g['title'] ?? ''), 'content' => $html($g['content'] ?? ''));
    };

    $videos = array();
    foreach ($arr($highlights) as $e) {
        $videos[] = array(
            'image'  => $s($e['image'] ?? ''),
            'link'   => $href($e['youtube_link'] ?? ''),
            'length' => $html($e['length'] ?? ''),
            'name'   => $html($e['name'] ?? ''),
        );
    }

    // Forms in page order: Discover Destinations, then Want to Learn More (one rendered before on a page view).
    $discover = $html(tefl_native_home_cf7('[contact-form-7 id="181" title="Discover Destinations Form"]', $ctx, 1, false));
    $insta    = $html(tefl_headless_cookie_block(do_shortcode('[insta-gallery id="1"]')));
    $learn    = $html(tefl_native_home_cf7('[contact-form-7 id="57896" title="Want to Learn More?"]', $ctx, 1, false));

    $articles = array();
    foreach ($arr($journal) as $e) {
        $article    = $e['article'] ?? null;
        $aid        = $article->ID ?? 0;
        $articles[] = array(
            'thumb' => tefl_native_txt(esc_html(get_the_post_thumbnail_url($aid))),
            'title' => tefl_native_txt(esc_html(get_the_title($aid))),
            'link'  => $href(tefl_native_txt(esc_html(get_permalink($aid)))),
        );
    }

    return array(
        'id'            => (int) $pid,
        'primary_class' => $primary_class,
        'hero'          => array(
            'badge'    => $s($hero['badge'] ?? ''),
            'image'    => $s($hero['image'] ?? ''),
            'title'    => $html($hero['title'] ?? ''),
            'subtitle' => $html($hero['subtitle'] ?? ''),
        ),
        'ours'          => array(
            'main_title'     => $html($our_tefl_internships['main_title'] ?? ''),
            'title'          => $html($our_tefl_internships['title'] ?? ''),
            'content'        => $html($our_tefl_internships['content'] ?? ''),
            'included_title' => $html($our_tefl_internships['included_title'] ?? ''),
            'included'       => $included,
        ),
        'cards'         => $cards,
        'discover'      => $discover,
        'more'          => array('left' => $side('left'), 'right' => $side('right')),
        'videos'        => $videos,
        'insta'         => $insta,
        'advisor'       => $travel_advisor ? $s($travel_advisor) : '',
        'learn'         => $learn,
        'script'        => array(
            'url'   => (string) get_permalink(),
            'title' => tefl_native_capture(function () {
                single_post_title();
            }),
        ),
        'journal'       => $articles,
    );
}
