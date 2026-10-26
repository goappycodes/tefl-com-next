<?php
/**
 * Native template: the default page template (no child page.php, so Astra's
 * page.php → astra_content_page_loop → template-parts/content-page.php →
 * template-parts/single/content-header.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page&path=/<cc>/x/&id=123
 *
 * Returns what that chain prints around the_content(): the #primary classes,
 * the <article> attributes (astra_attr 'article-page'), the entry header
 * (classes + the page title when Astra shows it) and the entry-content
 * attributes. The React side (components/pages/DefaultPage.tsx) writes the
 * markup.
 *
 * Astra's markup has hook points (astra_entry_top, astra_entry_content_before
 * …) and options (sidebars, banner structure, comments) the site doesn't use;
 * when any of them would print something for a page, this returns null and
 * the page stays on the passthrough render.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('page', 'tefl_native_page');

function tefl_native_page($id, $ctx) {
    if (get_post_type($id) !== 'page' || !function_exists('astra_attr')) {
        return null;
    }
    if (tefl_native_pages_has_frontend_only_shortcode(get_post_field('post_content', $id))) {
        return null;
    }
    $tpl = (string) get_page_template_slug($id);
    if ($tpl !== '' && $tpl !== 'default') {
        return null;
    }
    // WooCommerce / front-page / sidebar layouts aren't this markup.
    if (is_front_page() || (function_exists('is_woocommerce') && (is_cart() || is_checkout() || is_account_page()))) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    $layout = astra_page_layout();
    if ($layout === 'left-sidebar' || $layout === 'right-sidebar') {
        return null;
    }

    // Hook points page.php / the loop / content-page.php fire; all must be silent.
    $hooks = array(
        'astra_primary_content_top',
        'astra_template_parts_content_top',
        'astra_entry_before',
        'astra_entry_top',
        'astra_single_post_banner_before',
        'astra_entry_content_before',
        'astra_entry_content_after',
        'astra_entry_bottom',
        'astra_entry_after',
        'astra_template_parts_content_bottom',
        'astra_primary_content_bottom',
    );
    foreach ($hooks as $hook) {
        if (!tefl_native_pages_hook_empty($hook)) {
            return null;
        }
    }
    if (comments_open() || get_comments_number()) {
        return null;
    }

    // #primary
    $primary = tefl_native_pages_attrs(tefl_native_pages_capture('astra_primary_class'));

    // <article>
    $article = tefl_native_pages_attrs(astra_attr('article-page', array(
        'id'    => 'post-' . get_the_id(),
        'class' => join(' ', get_post_class()),
    )));

    // Entry header: shown unless the banner is filtered off / it's the static front page.
    $show_header = apply_filters('astra_single_layout_one_banner_visibility', true);
    $header      = null;
    if ($show_header) {
        $banner = tefl_native_pages_capture('astra_banner_elements_order');
        $title_attrs = tefl_native_pages_attrs(astra_attr('article-title-content-page', array('class' => '')));
        $title       = astra_the_title('', '', 0, false);
        $expected    = $title === '' ? '' : astra_the_title(
            '<h1 class="entry-title" ' . astra_attr('article-title-content-page', array('class' => '')) . '>',
            '</h1>',
            0,
            false
        );
        // Anything else in the banner (featured image, breadcrumb, meta) → passthrough.
        if (trim($banner) !== trim($expected)) {
            return null;
        }
        unset($title_attrs['class']);
        $header = array(
            'class'       => astra_entry_header_class(false),
            'title_html'  => $title === '' ? '' : astra_get_the_title(),
            'title_attrs' => $title_attrs,
        );
    }

    // .entry-content
    $entry = tefl_native_pages_attrs(astra_attr('article-entry-content-page', array('class' => '')));
    unset($entry['class']);

    $content = tefl_native_pages_the_content($ctx);
    $links   = wp_link_pages(array('echo' => 0));
    if ($links !== '' || !tefl_native_pages_balanced($content)) {
        return null;
    }

    return array(
        'id'            => (int) $id,
        'primary_class' => isset($primary['class']) ? $primary['class'] : 'content-area primary',
        'article'       => $article,
        'header'        => $header,
        'entry_attrs'   => $entry,
        'content_html'  => $content,
    );
}
