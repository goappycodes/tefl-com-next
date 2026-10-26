<?php
/**
 * Shared helpers for the promos family of native templates (sale and campaign
 * landing pages: page-sale-new.php, tefl-january-sale.php, black-friday-*.php,
 * january-*-sale.php, discount-tefl-coupon-codes.php …).
 *
 * Everything here reproduces what those templates print on a normal page
 * request, from inside a REST request (where a few plugins behave differently).
 * Functions: tefl_native_promos_*. No side effects at load.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

/** The value astra_primary_class() prints in class="…" (e.g. "content-area primary"). */
function tefl_native_promos_primary_class() {
    $out =function_exists('astra_primary_class') ? tefl_native_capture('astra_primary_class') : '';
    return preg_match('#class="([^"]*)"#', $out, $m) ? $m[1] : 'content-area primary';
}

/**
 * A URL for a src / srcset / background-image, as the render rewrites it:
 * Photon (i0.wp.com) removed, root-relative paths made absolute on the WP origin.
 * Values printed raw by the template are entity-decoded first (as the browser does).
 */
function tefl_native_promos_src($url) {
    $url = html_entity_decode((string) $url, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $url = preg_replace('#^(https?:)?//i[0-9]\.wp\.com/#i', 'https://', $url);
    if ($url !== '' && $url[0] === '/' && (strlen($url) < 2 || $url[1] !== '/')) {
        $url = tefl_headless_wp_origin() . $url;
    }
    return $url;
}

/** An <a href> value as the render rewrites it (raw template output is entity-decoded first). */
function tefl_native_promos_href($url) {
    return tefl_headless_rewrite_href(html_entity_decode((string) $url, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
}

/**
 * $product->get_price_html() exactly as a page prints it.
 *
 * WooCommerce Price Based on Country (caching support on) wraps prices in
 * <span class="wcpbc-price wcpbc-price-ID loading" …>…<span class="wcpbc-placeholder -dots"></span></span>
 * and its geolocation AJAX swaps in the visitor's price. In a REST request the
 * plugin drops the "loading" class and the placeholder (it thinks it IS the
 * AJAX refresh), so put them back the way WCPBC_Ajax_Geolocation::wrapper_price()
 * does on a page.
 *
 * @param WC_Product|false|null $product
 */
function tefl_native_promos_price_html($product) {
    if (!$product) {
        return '';
    }
    return tefl_native_promos_fix_price_wrapper((string) $product->get_price_html());
}

/** Re-add WCPBC's page-request "loading" class + placeholder to every REST-style price wrapper in $html. */
function tefl_native_promos_fix_price_wrapper($html) {
    if (strpos($html, 'wcpbc-price') === false) {
        return $html;
    }
    $placeholder = sprintf(
        '<span class="wcpbc-placeholder %s"></span>',
        apply_filters('wc_price_based_country_ajax_geolocation_placeholder_class', '-dots')
    );
    $out    = '';
    $offset = 0;
    while (preg_match('#<span class="wcpbc-price wcpbc-price-(\d+)" data-product-id="\1">#', $html, $m, PREG_OFFSET_CAPTURE, $offset)) {
        $start = $m[0][1];
        $open  = $m[0][0];
        $pos   = $start + strlen($open);
        // Find the wrapper's own </span>.
        $depth = 1;
        $close = -1;
        while ($depth > 0 && preg_match('#<span\b|</span\s*>#i', $html, $t, PREG_OFFSET_CAPTURE, $pos)) {
            if ($t[0][0][1] === '/') {
                $depth--;
                if ($depth === 0) {
                    $close = $t[0][1];
                }
            } else {
                $depth++;
            }
            $pos = $t[0][1] + strlen($t[0][0]);
        }
        if ($close < 0) {
            break;
        }
        $out   .= substr($html, $offset, $start - $offset)
            . str_replace('" data-product-id=', ' loading" data-product-id=', $open)
            . substr($html, $start + strlen($open), $close - $start - strlen($open))
            . $placeholder;
        $offset = $close;
    }
    return $out . substr($html, $offset);
}

/** geo_price() (wc_price) — HTML. */
function tefl_native_promos_geo_price($amount) {
    return function_exists('geo_price') ? geo_price($amount) : wc_price($amount);
}

/**
 * [tefl_timer_shortcode timer="…"] (includes/tefl-timer-functions.php) as data:
 * the shortcode stamps the render time into a class name and only prints the
 * clock when the expiry is ahead, so return those inputs and let the React
 * template print the same markup.
 */
function tefl_native_promos_timer($timer = 'global') {
    if ($timer === 'sale') {
        $expiry = get_field('timer_expiry', 'option');
    } elseif ($timer === 'black-friday-sales') {
        $expiry = get_field('black_friday_sale_timer_expiry', 'option');
    } else {
        $expiry = get_field('timer_expiry', 'option');
    }
    $now = strtotime('now');
    $exp = strtotime((string) $expiry);
    return array(
        'expiry'         => (string) $expiry,
        'now'            => (int) $now,
        'exp'            => $exp === false ? 0 : (int) $exp,
        'ends'           => date('l jS F', (int) $exp),
        'paid_internship' => is_singular('paid_internship'),
    );
}

/** A plugin shortcode's output (reviews slider, CF7 form) as page-ready HTML. */
function tefl_native_promos_shortcode($shortcode, $ctx) {
    $html = do_shortcode($shortcode);
    return $ctx['html'](tefl_headless_cookie_block((string) $html));
}

/**
 * A Contact Form 7 shortcode as the page prints it. CF7 builds the form action
 * from the request URI (wpcf7_get_request_uri()), which here is the REST URL,
 * so point the action at the page itself (+ #unit-tag), as on the page request.
 *
 * The unit tag (wpcf7-f<form>-o<n>, also the form's id and _wpcf7_unit_tag)
 * counts every form CF7 has rendered in the request. These page templates print
 * outside the loop, and a page request has already generated ONE unit tag
 * before the content (the first form on every page is "-o2"), so the count is
 * advanced past those and the loop flag cleared, as on the page.
 */
function tefl_native_promos_cf7($shortcode, $ctx) {
    global $wp_query;
    static $advanced = false;
    if (!$advanced && class_exists('WPCF7_ContactForm') && method_exists('WPCF7_ContactForm', 'generate_unit_tag')) {
        $advanced = true;
        $gen      = new ReflectionMethod('WPCF7_ContactForm', 'generate_unit_tag');
        $gen->setAccessible(true);
        for ($i = 0; $i < tefl_native_promos_cf7_before_content(); $i++) {
            $gen->invoke(null, 0);
        }
    }
    $page   = (string) $ctx['path'];
    $filter = function ($url) use ($page) {
        $frag = strstr((string) $url, '#');
        return $page . ($frag === false ? '' : $frag);
    };
    $in_loop = $wp_query ? $wp_query->in_the_loop : false;
    if ($wp_query) {
        $wp_query->in_the_loop = false;
    }
    add_filter('wpcf7_form_action_url', $filter, 1);
    try {
        return tefl_native_promos_shortcode($shortcode, $ctx);
    } finally {
        remove_filter('wpcf7_form_action_url', $filter, 1);
        if ($wp_query) {
            $wp_query->in_the_loop = $in_loop;
        }
    }
}

/** CF7 unit tags a page request generates before the template's content (see tefl_native_promos_cf7()). */
function tefl_native_promos_cf7_before_content() {
    return 1;
}

/** An ACF value the template echoes raw, as page-ready HTML. */
function tefl_native_promos_raw($value, $ctx) {
    if ($value === null || $value === false) {
        return '';
    }
    if (is_array($value) || is_object($value)) {
        return 'Array';
    }
    return $ctx['html']((string) $value);
}

/*
 * Blocks shared by the sale templates (black-friday-sale-prz.php, tefl-january-sale.php).
 * Each returns exactly what the template echoes; raw fields as page-ready HTML.
 */

/** bundle / bundle_main_title + the bundle product's price and discount. */
function tefl_native_promos_bundle($ctx) {
    $raw         = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };
    $bundle      = get_field('bundle');
    $product_obj = wc_get_product($bundle['product']->ID);
    $regular     = $product_obj->get_regular_price();
    $sale        = $product_obj->get_sale_price();
    $included    = array();
    foreach ((array) $bundle['whats_included'] as $e) {
        $included[] = $raw($e['text']);
    }
    return array(
        'main_title' => $raw(get_field('bundle_main_title')),
        'background' => tefl_native_promos_src($bundle['background']),
        'badge'      => $raw($bundle['badge']),
        'title'      => $raw($bundle['title']),
        'text'       => $raw($bundle['text']),
        'price'      => $ctx['html'](tefl_native_promos_price_html($product_obj)),
        'discount'   => (string) (($regular && $sale) ? round((($regular - $sale) / $regular) * 100) : 0),
        'included'   => $included,
        'subheading' => $raw($bundle['subheading']),
        'learn_more' => tefl_native_promos_href($bundle['learn_more']),
        'enrol_now'  => tefl_native_promos_href($bundle['enrol_now']),
    );
}

/** tools / tools_title. */
function tefl_native_promos_tools($ctx) {
    $items = array();
    foreach ((array) get_field('tools') as $e) {
        $items[] = array(
            'icon'   => tefl_native_promos_src($e['icon']),
            'name'   => tefl_native_promos_raw($e['name'], $ctx),
            'text'   => tefl_native_promos_raw($e['text'], $ctx),
            'link'   => tefl_native_promos_href($e['button']['link']),
            'value'  => tefl_native_promos_raw($e['button']['value'], $ctx),
        );
    }
    return array('title' => tefl_native_promos_raw(get_field('tools_title'), $ctx), 'items' => $items);
}

/** accreditations. */
function tefl_native_promos_accreditations($ctx) {
    $acc    = get_field('accreditations');
    $points = array();
    foreach ((array) $acc['points'] as $p) {
        $points[] = tefl_native_promos_raw($p['point'], $ctx);
    }
    return array(
        'title'   => tefl_native_promos_raw($acc['title'], $ctx),
        'graphic' => tefl_native_promos_src($acc['graphic']),
        'points'  => $points,
    );
}

/** faq (`empty` = is_array_empty(), which one template checks). */
function tefl_native_promos_faq($ctx) {
    $faq       = get_field('faq');
    $questions = array();
    foreach ((array) (is_array($faq) ? $faq['questions'] : array()) as $e) {
        $questions[] = array(
            'heading' => tefl_native_promos_raw($e['heading'], $ctx),
            'text'    => tefl_native_promos_raw($e['text'], $ctx),
        );
    }
    return array(
        'empty'     => is_array_empty($faq),
        'title'     => tefl_native_promos_raw(is_array($faq) ? $faq['title'] : '', $ctx),
        'subtitle'  => tefl_native_promos_raw(is_array($faq) ? $faq['subtitle'] : '', $ctx),
        'text'      => tefl_native_promos_raw(is_array($faq) ? $faq['text'] : '', $ctx),
        'questions' => $questions,
    );
}

/** panel. */
function tefl_native_promos_panel($ctx) {
    $items = array();
    foreach ((array) get_field('panel') as $e) {
        $items[] = array(
            'icon'    => tefl_native_promos_src($e['icon']),
            'heading' => tefl_native_promos_raw($e['heading'], $ctx),
            'text'    => tefl_native_promos_raw($e['text'], $ctx),
        );
    }
    return $items;
}

/** The Klarna modal: is_front_page() branch, and "3 interest payments of geo_price($full_price / 3)". */
function tefl_native_promos_klarna($full_price, $ctx) {
    return array(
        'front'       => is_front_page(),
        'installment' => $ctx['html'](tefl_native_promos_geo_price($full_price / 3)),
    );
}

/** The 5→1 star rows: reviews_widget star_percentage_N, empty → 0 (raw). */
function tefl_native_promos_star_percentages($widget, $ctx) {
    $rows = array();
    for ($i = 5; $i >= 1; $i--) {
        $p = is_array($widget) && isset($widget['star_percentage_' . $i]) ? $widget['star_percentage_' . $i] : null;
        if (empty($p)) {
            $p = 0;
        }
        $rows[] = array('star' => $i, 'percent' => $ctx['txt']((string) $p), 'percent_html' => tefl_native_promos_raw($p, $ctx));
    }
    return $rows;
}

/** A number as `echo` prints it (PHP's own float/int → string conversion). */
function tefl_native_promos_echo_number($n) {
    return (string) $n;
}

/*
 * Top of the January sale landing pages (january-courses-sale.php,
 * january-internships-sale.php, internship-black-friday-landing-page.php):
 * hero banner, countdown section, free gifts.
 */
function tefl_native_promos_jan_top($ctx) {
    $raw = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };
    $hero        = null;
    $hero_banner = get_field('hero_banner');
    if (!empty($hero_banner)) {
        $content = $hero_banner['banner_content'];
        $header  = $content['header'];
        $hero    = array(
            'bg'          => tefl_native_promos_src($hero_banner['banner_background_image']),
            'image'       => tefl_native_promos_src($content['image']),
            'highlighted' => $raw($header['highlighted_text']),
            'main'        => $raw($header['main_text']),
            'subheader'   => $raw($content['sub_header']),
        );
    }
    $timer         = null;
    $timer_section = get_field('clockdown_section');
    if (!empty($timer_section)) {
        $timer = array(
            'title'   => $raw($timer_section['section_title']),
            'content' => $raw($timer_section['section_content']),
            'timer'   => tefl_native_promos_timer('black-friday-sales'),
        );
    }
    $gifts         = null;
    $gifts_section = get_field('free_gifts_section');
    if (!empty($gifts_section)) {
        $items = array();
        foreach ((array) $gifts_section['free_gift'] as $fg) {
            $items[] = array(
                'icon'     => tefl_native_promos_src($fg['icon']),
                'title'    => $raw($fg['title']),
                'subtitle' => $raw($fg['subtitle']),
            );
        }
        $gifts = array('title' => $raw($gifts_section['section_title']), 'items' => $items);
    }
    return array('hero' => $hero, 'timer' => $timer, 'gifts' => $gifts);
}

/**
 * Everything below the gifts on the internship sale pages
 * (january-internships-sale.php, internship-black-friday-landing-page.php —
 * identical apart from the gift columns): internship cards, video
 * testimonials, [brb_collection id="1150"], CTA cards. The card loop is the
 * template's code, so values it leaks into the next card (price, discount,
 * stock, guide link) do so here too.
 */
function tefl_native_promos_internship_sale($ctx) {
    $raw  = function ($v) use ($ctx) {
        return tefl_native_promos_raw($v, $ctx);
    };
    $src  = 'tefl_native_promos_src';
    $href = 'tefl_native_promos_href';

    $cards             = null;
    $sales_internships = get_field('sale_internships');
    if (!empty($sales_internships)) {
        $cards            = array();
        $internship_price = null;
        $percentage       = null;
        $stock_quantity   = null;
        $guide_link       = null;
        foreach ($sales_internships as $si) {
            $internship            = $si['internship'];
            $internship_product_id = get_field('internship_product', $internship);
            if ($internship_product_id) {
                $internship_product = wc_get_product($internship_product_id);
                if ($internship_product) {
                    $internship_price = tefl_native_promos_price_html($internship_product);
                    $regular          = $internship_product->get_regular_price();
                    $sale             = $internship_product->get_sale_price();
                    $stock_quantity   = get_total_combined_stock_quantity($internship_product);
                    if ($internship_product->is_type('variable')) {
                        $regular = $internship_product->get_variation_regular_price();
                        $sale    = $internship_product->get_variation_sale_price();
                    }
                    $percentage = $regular ? round((($regular - $sale) / $regular) * 100) : 0;
                }
            }
            if ($si['select_guide']) {
                $guide_link = get_post_permalink($si['select_guide']);
            }
            $features = array();
            foreach ((array) $si['internship_features'] as $feature) {
                $features[] = $raw($feature['feature']);
            }
            $cards[] = array(
                'title'      => $raw($si['internship_title']),
                'subheader'  => $raw($si['internship_duration_text'] . ' | ' . $si['internship_start_date_text']),
                'percentage' => $percentage > 0 ? $raw($percentage) : null,
                'image'      => $src($si['internship_image']),
                'price'      => $ctx['html']((string) $internship_price),
                'logo'       => $src($si['internship_logo']),
                'features'   => $features,
                'stock'      => $stock_quantity > 0 ? $raw($stock_quantity) : null,
                'link'       => $href(get_post_permalink($internship)),
                'buy_now'    => $raw($si['buy_now_button_text']),
                'learn_more' => $raw($si['learn_more_button_text']),
                'guide_link' => $href((string) $guide_link),
            );
        }
    }

    $videos  = null;
    $section = get_field('video_testimonials_section');
    if (!empty($section)) {
        $items = array();
        foreach ((array) $section['testimonial_videos'] as $t) {
            $items[] = array(
                'link'      => $href($t['video_link']),
                'thumbnail' => $src($t['video_thumnail']),
                'title'     => $raw($t['video_title']),
                'subtitle'  => $raw($t['video_subtitle']),
            );
        }
        $videos = array(
            'title'    => $raw($section['section_title']),
            'subtitle' => $raw($section['section_subtitle']),
            'play'     => $src($section['play_button_icon']),
            'items'    => $items,
        );
    }

    $cta     = null;
    $section = get_field('cta_section');
    if (!empty($section)) {
        $one = function ($c) use ($raw, $src, $href) {
            return array(
                'image'    => $src($c['cta_image']),
                'title'    => $raw($c['cta_title']),
                'subtitle' => $raw($c['cta_subtitle']),
                'text'     => $raw($c['cta_button_text']),
                'link'     => $href($c['cta_button_link']),
            );
        };
        $cta = array(
            'salary' => $one($section['salary_calculator_cta']),
            'elt'    => $one($section['english_level_test_cta']),
        );
    }

    $top = tefl_native_promos_jan_top($ctx);
    return array(
        'primary_class' => tefl_native_promos_primary_class(),
        'hero'          => $top['hero'],
        'timer'         => $top['timer'],
        'gifts'         => $top['gifts'],
        'internships'   => $cards,
        'videos'        => $videos,
        'reviews'       => tefl_native_promos_shortcode('[brb_collection id="1150"]', $ctx),
        'cta'           => $cta,
        'origin'        => tefl_headless_wp_origin(),
    );
}
