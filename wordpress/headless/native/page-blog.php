<?php
/**
 * Native template: the blog index page (page-blog.php, "Blog Archive Template", /blog/).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-blog&path=/<cc>/blog/&id=122
 *
 * Every ACF group / query the template reads, resolved: the banner, the
 * live-search grid's first 3 posts (blog_live_search_handler() with no query),
 * the three category rows, the two promo tiles, the CF7 destinations form, and
 * the category link list. The React side is components/pages/blog/BlogIndex.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('page-blog', 'tefl_native_page_blog');

function tefl_native_page_blog($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'page-blog.php') {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    // The template never starts the loop (CF7 unit tags then carry no post id).
    $GLOBALS['wp_query']->in_the_loop = false;

    $href = $ctx['href'];
    $raw  = function ($v) {
        return is_string($v) || is_numeric($v) ? (string) $v : '';
    };

    $banner = get_field('banner');
    $banner = is_array($banner) ? $banner : array();
    $tile   = function ($name) use ($raw, $href) {
        $g = get_field($name);
        $g = is_array($g) ? $g : array();
        return array(
            'background_image' => $raw($g['background_image'] ?? ''),
            'title'            => $raw($g['title'] ?? ''),
            'content_text'     => $raw($g['content_text'] ?? ''),
            'button_text'      => tefl_native_txt($raw($g['button_text'] ?? '')),
            'button_link'      => $href($raw($g['button_link'] ?? '')),
        );
    };
    $card = function ($post_id) use ($href) {
        return array(
            'title' => get_the_title($post_id),
            'thumb' => (string) get_the_post_thumbnail_url($post_id),
            'link'  => $href((string) get_the_permalink($post_id)),
        );
    };
    $row = function ($cat_field, $title_field) use ($card) {
        $posts = get_posts(array(
            'post_status' => 'publish',
            'numberposts' => 3,
            'post_type'   => 'post',
            'category'    => get_field($cat_field),
            'orderby'     => 'date',
            'order'       => 'DESC',
        ));
        return array(
            'title' => (string) get_field($title_field),
            'posts' => array_map(function ($p) use ($card) {
                return $card($p->ID);
            }, $posts),
        );
    };

    // blog_live_search_handler() with no POST: the latest 3 posts, posts only.
    $args = array(
        'post_type'        => 'post',
        'post_status'      => 'publish',
        'posts_per_page'   => 3,
        'offset'           => 0,
        'orderby'          => 'date',
        'order'            => 'DESC',
        's'                => '',
        'suppress_filters' => true,
    );
    $had = has_filter('pre_get_posts', 'searchfilter');
    if ($had !== false) {
        remove_filter('pre_get_posts', 'searchfilter', $had);
    }
    $q = new WP_Query($args);
    if ($had !== false) {
        add_filter('pre_get_posts', 'searchfilter', $had);
    }
    $grid = array();
    foreach ($q->posts as $p) {
        $grid[] = array(
            'title' => get_the_title($p->ID),
            'thumb' => (string) get_the_post_thumbnail_url($p->ID),
            'link'  => $href((string) apply_filters('the_permalink', get_permalink($p->ID), $p->ID)),
        );
    }

    $form = do_shortcode('[contact-form-7 id="181" title="Discover Destinations Form"]');
    if (!tefl_native_pages_balanced($form)) {
        return null;
    }

    $cats = array();
    foreach (get_categories(array('orderby' => 'name', 'order' => 'ASC')) as $c) {
        $cats[] = array(
            'name' => tefl_native_txt($c->name),
            'url'  => $href(get_category_link($c->term_id)),
            'alt'  => tefl_native_txt(sprintf(__('View all posts in %s', 'textdomain'), $c->name)),
        );
    }

    return array(
        'banner'       => array(
            'background_image'       => $raw($banner['background_image'] ?? ''),
            'banner_title'           => $raw($banner['banner_title'] ?? ''),
            'banner_subtitle'        => $raw($banner['banner_subtitle'] ?? ''),
            'banner_text'            => $raw($banner['banner_text'] ?? ''),
            'banner_cta_button_link' => $href($raw($banner['banner_cta_button_link'] ?? '')),
            'banner_cta_button_text' => tefl_native_txt($raw($banner['banner_cta_button_text'] ?? '')),
            'banner_logo'            => $raw($banner['banner_logo'] ?? ''),
        ),
        'grid'         => $grid,
        'grid_more'    => $q->found_posts > 3,
        'english_test' => $tile('english_level_test'),
        'life_stories' => $row('lsa_category', 'life_stories_abroad_section_title'),
        'read_story'   => $tile('read_story'),
        'tefl_advice'  => $row('tefl_advice_category', 'tefl_advice_section_title'),
        'destinations' => array(
            'title'     => (string) get_field('discover_destination_section_title'),
            'form_html' => $ctx['html']($ctx['block']($form)),
        ),
        'teaching'     => $row('teaching_english_category', 'teaching_english_section_title'),
        'hear_from'    => $tile('hear_from'),
        'categories'   => $cats,
    );
}
