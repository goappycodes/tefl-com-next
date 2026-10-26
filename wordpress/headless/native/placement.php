<?php
/**
 * Native template: single placement (single-placement.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/placement&path=/<cc>/placement/<slug>/&id=123
 *
 * Mirrors the template. Pieces that are WordPress / WooCommerce output come
 * back as HTML: the CF7 form, and each timezone pane of the virtual-course
 * timetable (includes/virtual-course-variation.php variation_timetable():
 * WooCommerce price HTML, seat counts, per-date EducationEvent JSON-LD). The
 * countdown script is returned as its text, exactly as the template prints it.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('placement', 'tefl_native_placement');

/** The template's countdown <script> body; %%TIMER%% is the raw timer option. */
function tefl_native_placement_timer_script() {
    return <<<'JS'
                                const timer = () => {
                                    //set the date to countdown
                                    //const countDownDate = new Date("Dec 25, 2020 12:00:00").getTime();
                                    const countDownDate = new Date('%%TIMER%%').getTime();
                    
                                    //update time each second
                    
                                    const update = setInterval(() => {
                                        //get time now and find differnce from countdown time
                    
                                        const now = new Date().getTime();
                                        const diff = countDownDate - now;
                                        //calculate time as days, hours months and second
                                        //console.log("diff" + diff);
                                        if (diff > 0) {
                                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    
                                            //display timer
                                            document.querySelector('#day').innerHTML = days;
                                            document.querySelector('#hour').innerHTML = hours;
                                            document.querySelector('#minute').innerHTML = minutes;
                                            document.querySelector('#second').innerHTML = seconds;
                                        } else {
                                            document.getElementsByClassName('hascountdown')[0].style.display = 'none';
                                            document.getElementsByClassName('hascountdown')[1].style.display = 'none';
                                            document.getElementsByClassName('hascountdown')[2].style.display = 'none';
                                            document.getElementsByClassName('salarycalculator-form')[0].style.display = 'block';
                                            document.getElementsByClassName('mid-col')[0].style.background = 'black';
                    
                                        }
                                    }, 1000);
                                }
                    
                                jQuery(document).ready(function($) {
                                    timer();
                                })
JS;
}

function tefl_native_placement($pid, $ctx) {
    if (get_post_type($pid) !== 'placement') {
        return null;
    }
    $h   = function ($s) use ($ctx) {
        return tefl_native_destinations_h($ctx, $s);
    };
    $src = 'tefl_native_destinations_src';

    // Prices as a page view prints them (WCPBC loading wrapper).
    add_filter('woocommerce_get_price_html', 'tefl_native_destinations_wcpbc_page', 1);

    $is_virtual_couse     = get_field('is_virtual_couse');
    $hero                 = get_field('hero');
    $hero                 = is_array($hero) ? $hero : array();
    $course_product_id    = get_field('course_product');
    $course_product       = function_exists('wc_get_product') ? wc_get_product($course_product_id) : null;
    $course_regular_price = $course_product ? $course_product->get_regular_price() : 0;
    $course_sale_price    = $course_product ? $course_product->get_sale_price() : 0;
    $symbol               = function_exists('get_woocommerce_currency_symbol') ? get_woocommerce_currency_symbol() : '';

    $collage = null;
    if (!empty($hero['collage'])) {
        $collage = array();
        foreach (is_array($hero['collage']) ? $hero['collage'] : array() as $element) {
            $collage[] = $src($element['polaroid'] ?? '');
        }
    }

    $sidebar = get_field('sidebar');
    $sidebar = is_array($sidebar) ? $sidebar : array();
    $info    = array();
    foreach (is_array($sidebar['info'] ?? null) ? $sidebar['info'] : array() as $element) {
        $info[] = array('title' => $h($element['title'] ?? ''), 'subtitle' => $h($element['subtitle'] ?? ''));
    }

    $timer_expiry = get_field('timer', 'option');
    $timer_script = '';
    if ($timer_expiry) {
        $timer_script = str_replace('%%TIMER%%', (string) $timer_expiry, tefl_native_placement_timer_script());
        // The render's inline-script rewrites, for parity.
        $timer_script = preg_replace('#^<script\b[^>]*>|</script>$#', '', $ctx['html']('<script>' . $timer_script . '</script>'));
    }

    $wi    = get_field('whats_included');
    $wi    = is_array($wi) ? $wi : array();
    $items = function ($key) use ($wi, $h) {
        $out = array();
        foreach (is_array($wi[$key] ?? null) ? $wi[$key] : array() as $element) {
            $out[] = $h($element['item'] ?? '');
        }
        return $out;
    };

    $virtual = null;
    if ($is_virtual_couse) {
        $virtual = tefl_native_placement_virtual($ctx, $course_product_id);
    }

    $location          = get_field('location');
    $location          = is_array($location) ? $location : array();
    $form_header_image = get_field('form_header_image', 'options');
    $form_html         = tefl_native_destinations_capture($ctx, function () {
        echo do_shortcode('[contact-form-7 id="57896" title="Want to Learn More?"]');
    });

    return array(
        'origin'       => tefl_headless_wp_origin(),
        'hero'         => array(
            'title'      => $h($hero['title'] ?? ''),
            'background' => $src($hero['background'] ?? ''),
            'collage'    => $collage,
            'subtitle'   => $h($hero['subtitle'] ?? ''),
        ),
        'sidebar'      => array('type' => $h($sidebar['type'] ?? ''), 'info' => $info),
        'was'          => $h('Was: ' . $symbol . $course_regular_price),
        'now'          => $h('Now: ' . $symbol . $course_sale_price),
        'timer'        => (bool) $timer_expiry,
        'timer_script' => $timer_script,
        'introduction' => $h(get_field('introduction')),
        'inclusions'   => $items('inclusions'),
        'requirements' => $items('requirements'),
        'organise'     => $items('organise'),
        'virtual'      => $virtual,
        'location'     => array(
            'content'      => $h($location['content'] ?? ''),
            'map'          => $src($location['map'] ?? ''),
            'form_content' => $h($location['form_content'] ?? ''),
            'form_image'   => $form_header_image ? $src($form_header_image) : '',
            'form_html'    => $form_html,
        ),
    );
}

/**
 * includes/virtual-course-variation.php for a placement: the DAY_LIGHT_SAVINGS
 * class and each timezone pane's variation_timetable() output (the JSON-LD
 * it echoes, then the table it returns), as the include prints them.
 */
function tefl_native_placement_virtual($ctx, $course_product_id) {
    if (!function_exists('variation_timetable')) {
        // Defines variation_timetable(); its own output is discarded.
        $file = get_stylesheet_directory() . '/includes/virtual-course-variation.php';
        if (!is_readable($file)) {
            return null;
        }
        tefl_native_capture(function () use ($file, $course_product_id) {
            include $file;
        });
    }
    if (!function_exists('variation_timetable')) {
        return null;
    }
    $day_light = defined('DAY_LIGHT_SAVINGS') ? DAY_LIGHT_SAVINGS : 0;
    $offsets   = array(
        'london'      => $day_light == 0 ? '01:00' : '00:00',
        'boston'      => $day_light == 0 ? '-04:00' : '-05:00',
        'vancouver'   => $day_light == 0 ? '-07:00' : '-08:00',
        'southafrica' => $day_light === 0 ? '+02:00' : '+01:00',
    );
    $panes = array();
    foreach ($offsets as $name => $offset) {
        $returned      = '';
        $echoed        = tefl_native_capture(function () use ($offset, &$returned) {
            $returned = variation_timetable($offset);
        });
        $panes[$name] = tefl_native_destinations_h($ctx, $echoed . $returned);
    }
    return array(
        'day_light'   => (string) $day_light,
        'is_placement' => true,
        'panes'       => $panes,
    );
}
