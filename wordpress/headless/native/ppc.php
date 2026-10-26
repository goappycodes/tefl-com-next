<?php
/**
 * Native template: PPC landing page (single-ppc.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/ppc&path=/<cc>/ppc/<slug>/&id=123
 *
 * Mirrors the template. WordPress / plugin output comes back as HTML: the CF7
 * form, the [tefl_timer_shortcode] countdown, the [brb_collection] reviews
 * and each course's WooCommerce price HTML. The course loop keeps the
 * template's carried-over $productid / $percentage between rows.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('ppc', 'tefl_native_ppc');

function tefl_native_ppc($pid, $ctx) {
    if (get_post_type($pid) !== 'ppc') {
        return null;
    }
    $h    = function ($s) use ($ctx) {
        return tefl_native_destinations_h($ctx, $s);
    };
    $src  = 'tefl_native_destinations_src';
    $href = function ($s) use ($ctx) {
        return tefl_native_destinations_href($ctx, $s);
    };
    $txt  = 'tefl_native_txt';
    $list = function ($a) {
        return is_array($a) ? $a : array();
    };

    // Prices as a page view prints them (WCPBC loading wrapper).
    add_filter('woocommerce_get_price_html', 'tefl_native_destinations_wcpbc_page', 1);

    $hero               = get_field('hero');
    $main               = get_field('main');
    $accreditations     = get_field('accreditations');
    $courses            = get_field('courses');
    $extras             = get_field('extras');
    $video_testimonials = get_field('video_testimonials');
    $sale               = get_field('sale');
    $mailchimp_tag      = get_field('mailchimp_tag');

    $out = array('origin' => tefl_headless_wp_origin());

    $out['hero'] = $hero ? array(
        'background' => $src($hero['background'] ?? ''),
        'title'      => $h($hero['title'] ?? ''),
        'subtitle'   => $h($hero['subtitle'] ?? ''),
    ) : null;

    $out['main'] = null;
    if ($main) {
        $ov          = is_array($main['image_overlay'] ?? null) ? $main['image_overlay'] : array();
        $out['main'] = array(
            'title'         => $h($main['title'] ?? ''),
            'subtitle'      => $h($main['subtitle'] ?? ''),
            'image'         => $src($main['image'] ?? ''),
            'overlay_color' => $txt($ov['color'] ?? ''),
            'overlay_title' => $h($ov['title'] ?? ''),
            'overlay_sub'   => $h($ov['subtitle'] ?? ''),
            'overlay_small' => $h($ov['small_heading'] ?? ''),
            'form_html'     => tefl_native_destinations_capture($ctx, function () {
                echo do_shortcode('[contact-form-7 id="76360" title="PPC TEFL Career Guide"]');
            }),
        );
    }

    $out['accreditations'] = null;
    if ($accreditations) {
        $points = array();
        foreach ($list($accreditations['points'] ?? null) as $p) {
            $points[] = $h($p['point'] ?? '');
        }
        $out['accreditations'] = array(
            'title'   => $h($accreditations['title'] ?? ''),
            'desktop' => $src($accreditations['desktop_image'] ?? ''),
            'mobile'  => $src($accreditations['mobile_image'] ?? ''),
            'points'  => $points,
        );
    }

    $out['courses'] = null;
    if ($courses) {
        $timer_html = tefl_native_destinations_capture($ctx, function () {
            echo do_shortcode('[tefl_timer_shortcode timer="sales"]');
        });
        $rows       = array();
        $productid  = null;
        $percentage = null;
        foreach ($list($courses['table'] ?? null) as $table) {
            $product_id        = $table['product'] ?? null;
            $course_price_html = '';
            if ($product_id) {
                $course_product = wc_get_product($product_id);
                $productid      = $course_product ? $course_product->get_id() : null;
                if ($course_product) {
                    $course_price_html = $course_product->get_price_html();
                }
                $regular    = $course_product ? (float) $course_product->get_regular_price() : 0;
                $sale_price = $course_product ? (float) $course_product->get_sale_price() : 0;
                $percentage = $regular ? round((($regular - $sale_price) / $regular) * 100) : $percentage;
            }
            $labels = array();
            foreach ($list($table['labels'] ?? null) as $l) {
                $labels[] = $h($l['label'] ?? '');
            }
            $theme  = $txt($table['theme'] ?? '');
            $rows[] = array(
                'popular'    => (bool) ($table['most_popular'] ?? false),
                'theme'      => $theme,
                'title'      => $h($table['title'] ?? ''),
                'subtitle'   => $h($table['subtitle'] ?? ''),
                'thumbnail'  => $src($table['thumbnail'] ?? ''),
                'jobs_text'  => $h($table['jobs_text'] ?? ''),
                'stars'      => $h($table['stars'] ?? ''),
                'price_html' => $h($course_price_html),
                'percentage' => $h((string) $percentage),
                'labels'     => $labels,
                'book'       => $txt(get_home_url('/') . '?addtimetocart&prid=' . $productid), // already the WP origin (WP-owned)
                'learn_more' => $href($table['learn_more'] ?? ''),
            );
        }

        $extra_rows = array();
        foreach ($list($extras) as $e) {
            $extra_rows[] = array(
                'background' => $src($e['background'] ?? ''),
                'title'      => $h($e['title'] ?? ''),
                'subtitle'   => $h($e['subtitle'] ?? ''),
                'learn_more' => $href($e['learn_more'] ?? ''),
            );
        }

        $videos = array();
        foreach ($list($video_testimonials) as $v) {
            $videos[] = array(
                'image'   => $src($v['thumbnail'] ?? ''),
                'youtube' => $txt($v['youtube'] ?? ''),
                'caption' => $h(($v['name'] ?? '') . ' | ' . ($v['title'] ?? '')),
            );
        }

        // Rendered (and discarded) by the template before the printed collection.
        do_shortcode('[brb_collection id="53081"]');
        $reviews_html = tefl_native_destinations_capture($ctx, function () {
            echo do_shortcode('[brb_collection id="1150"]');
        });

        $out['courses'] = array(
            'title'        => $h($courses['title'] ?? ''),
            'subtitle'     => $h($courses['subtitle'] ?? ''),
            'most_popular' => $src($courses['most_popular'] ?? ''),
            'timer_html'   => $timer_html,
            'rows'         => $rows,
            'extras'       => $extra_rows,
            'videos'       => $videos,
            'reviews_html' => $reviews_html,
        );
    }

    $out['sale'] = null;
    if ($sale) {
        $points = array();
        foreach ($list($sale['points'] ?? null) as $p) {
            $points[] = $h($p['point'] ?? '');
        }
        $cta         = is_array($sale['call_to_action'] ?? null) ? $sale['call_to_action'] : array();
        $out['sale'] = array(
            'title'    => $h($sale['title'] ?? ''),
            'subtitle' => $h($sale['subtitle'] ?? ''),
            'points'   => $points,
            'heading'  => $h($sale['heading'] ?? ''),
            'link'     => $href($cta['link'] ?? ''),
            'value'    => $h($cta['value'] ?? ''),
        );
    }

    $script = '

    document.addEventListener( \'wpcf7mailsent\', function( event ) {
      if ( \'76360\' == event.detail.contactFormId ) {
        location = \'/wp-content/uploads/2023/04/TEFL-Kickstarter-Pack.pdf\';
      }
    }, false );

  	document.getElementById("mc-tag").value = ' . json_encode($mailchimp_tag) . ';

';
    $out['script'] = preg_replace('#^<script\b[^>]*>|</script>$#', '', $ctx['html']('<script>' . $script . '</script>'));

    return $out;
}
