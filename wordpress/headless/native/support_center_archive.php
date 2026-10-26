<?php
/**
 * Native template: TEFL support center archive (page template page-supportcenter.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/support_center_archive&path=/<cc>/tefl-support-center/&id=1598
 *
 * Mirrors the template: the next upcoming webinar (same query), the support
 * topic cards with the template's 250-byte excerpt and per-position styling,
 * and the English level test block.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('support_center_archive', 'tefl_native_support_center_archive');

/**
 * substr() can cut a multi-byte character at the end; a browser shows the
 * broken tail as one U+FFFD. Do the same, so the text survives JSON.
 */
function tefl_native_support_center_archive_fix_tail($s) {
    if ($s === '' || mb_check_encoding($s, 'UTF-8')) {
        return $s;
    }
    for ($cut = 1; $cut <= 3 && $cut < strlen($s); $cut++) {
        $head = substr($s, 0, -$cut);
        if (mb_check_encoding($head, 'UTF-8')) {
            return $head . "\u{FFFD}";
        }
    }
    return mb_convert_encoding($s, 'UTF-8', 'UTF-8');
}

function tefl_native_support_center_archive($pid, $ctx) {
    if (get_post_type($pid) !== 'page' || get_page_template_slug($pid) !== 'page-supportcenter.php') {
        return null;
    }
    $h    = function ($s) use ($ctx) {
        return tefl_native_destinations_h($ctx, $s);
    };
    $src  = 'tefl_native_destinations_src';
    $href = function ($s) use ($ctx) {
        return tefl_native_destinations_href($ctx, $s);
    };

    $heading = get_field('heading');
    $heading = is_array($heading) ? $heading : array();

    // Upcoming webinar: the template keeps the last post of the loop (numberposts 1).
    $webinars = get_posts(array(
        'numberposts' => 1,
        'post_type'   => 'webinar',
        'status'      => 'published',
        'tax_query'   => array(
            array('taxonomy' => 'webinar_category', 'field' => 'slug', 'terms' => array('upcoming')),
        ),
        'orderby'     => 'meta_value',
        'order'       => 'ASC',
        'meta_query'  => array(
            array('key' => 'webinar_date', 'value' => date('Ymd'), 'compare' => '>='),
        ),
    ));
    $webinar = array('title' => '', 'image' => '', 'location' => '', 'date' => '', 'time' => '');
    foreach ($webinars as $w) {
        $webinar = array(
            'title'    => $h($w->post_title),
            'image'    => $src(get_field('webinar_banner_image', $w->ID)),
            'location' => $h(get_field('webinar_location', $w->ID)),
            'date'     => $h(get_field('webinar_date', $w->ID)),
            'time'     => $h(get_field('webinar_time', $w->ID)),
        );
    }

    // Support topic cards.
    $cards   = array();
    $posts   = get_field('support_center_posts');
    $images  = get_field('support_center_card_images');
    $img_idx = 0;
    $count   = 1;
    foreach (is_array($posts) ? $posts : array() as $scposts) {
        $content_post = get_post($scposts);
        $excerpt      = strip_shortcodes($content_post ? $content_post->post_content : '');
        $excerpt      = apply_filters('the_content', $excerpt);
        $excerpt      = str_replace(']]>', ']]&gt;', $excerpt);
        $excerpt      = strip_tags($excerpt);
        $excerpt      = tefl_native_support_center_archive_fix_tail(substr($excerpt, 0, 250));

        $grey  = ($count == 3 || $count == 5 || $count == 7);
        $style = '';
        if ($count % 2 == 0 and $count != 4) {
            $image  = is_array($images) && isset($images[$img_idx]) ? ($images[$img_idx]['image'] ?? '') : '';
            $style .= 'background-image: url(' . tefl_native_destinations_src($image) . ')';
            $img_idx++;
        }
        if ($grey) {
            $style .= 'background-color:#EDEDED';
        }
        $cards[] = array(
            'grey'    => $grey,
            'style'   => $style,
            'title'   => $h(get_the_title($scposts)),
            'excerpt' => $h($excerpt . '...'),
            'url'     => $href(get_the_permalink($scposts)),
        );
        $count++;
    }

    $test = get_field('english_level_test');
    $test = is_array($test) ? $test : array();

    return array(
        'title'   => $h($heading['header_title'] ?? ''),
        'stitle'  => $h($heading['header_subtitle'] ?? ''),
        'webinar' => $webinar,
        'cards'   => $cards,
        'test'    => array(
            'background' => $src($test['background_image'] ?? ''),
            'title'      => $h($test['title'] ?? ''),
            'content'    => $h($test['content_text'] ?? ''),
            'link'       => $href($test['button_link'] ?? ''),
            'button'     => $h($test['button_text'] ?? ''),
        ),
    );
}
