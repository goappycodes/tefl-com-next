<?php
/**
 * Native template: TI Extensions (ti-course-extension.php, /course-extensions/).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/course-extension&path=/<cc>/course-extensions/&id=74991
 *
 * The extension products (product_cat "extension", oldest first, "Bonus" ones
 * skipped) with their prices. Rendered by components/overviews/CourseExtension.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('course-extension', 'tefl_native_ti_course_extension');

function tefl_native_ti_course_extension($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'ti-course-extension.php') {
        return null;
    }
    $products = get_posts(array(
        'post_type'      => 'product',
        'posts_per_page' => -1,
        'tax_query'      => array(
            array(
                'taxonomy' => 'product_cat',
                'field'    => 'slug',
                'terms'    => 'extension',
            ),
        ),
    ));
    $products = array_reverse($products);

    $cards = array();
    foreach ($products as $product) {
        $title = $product->post_title;
        if (strpos($title, 'Bonus') !== false) {
            continue;
        }
        $cards[] = array(
            'title' => tefl_native_overviews_html($title, $ctx),
            'image' => tefl_native_overviews_src(get_the_post_thumbnail_url($product->ID, 'full')),
            'link'  => tefl_native_overviews_href(get_permalink($product->ID), $ctx),
            'price' => tefl_native_overviews_price($product->ID, $ctx),
        );
    }

    return tefl_native_overviews_base($pid) + array('products' => $cards);
}
