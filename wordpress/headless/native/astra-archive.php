<?php
/**
 * Native template: Astra's listing templates — index.php (the posts index,
 * /blog/page/N/), archive.php (tag archives) and search.php (/?s=…). The child
 * theme overrides none of them; category archives have their own category.php
 * (native/category.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/astra-archive&path=/<cc>/tag/x/page/2/
 *
 * Builds the main query for the URL as WordPress does, then returns what the
 * template + Astra's loop print: the #primary classes, the archive header
 * (tag title / "Search Results for:"), one entry per post in Astra's blog
 * layout (layout-1 from template-parts/blog/blog-layout.php, or layout-5 when
 * that's the configured blog layout, as for search), the "nothing found"
 * block, and the pagination. Pieces that are Astra/WordPress helper output
 * with many filters (the featured image link, the entry meta line, the
 * excerpt, the_posts_pagination) come back as HTML; React
 * (components/pages/archive/AstraArchive.tsx) writes the rest.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('astra-archive', 'tefl_native_astra_archive', array('singular' => false));

function tefl_native_astra_archive($id, $ctx) {
    if (!function_exists('astra_attr') || !tefl_native_pages_query_for_path($ctx)) {
        return null;
    }
    global $wp_query;
    $kind = $wp_query->is_search ? 'search' : ($wp_query->is_tag ? 'tag' : ($wp_query->is_home && !$wp_query->is_front_page ? 'home' : ''));
    if ($kind === '') {
        return null; // category.php, author/date archives, custom post types… aren't this template
    }
    tefl_native_pages_front_request($ctx);
    $layout = astra_page_layout();
    if ($layout === 'left-sidebar' || $layout === 'right-sidebar') {
        return null;
    }
    // Astra's wp_head step that swaps in the grid layouts' template part.
    $blog_layout = astra_get_blog_layout();
    if (in_array($blog_layout, array('blog-layout-4', 'blog-layout-6'), true)) {
        return null;
    }
    $grid = $blog_layout === 'blog-layout-5';

    foreach (array('astra_primary_content_top', 'astra_primary_content_bottom', 'astra_content_while_before', 'astra_content_while_after') as $hook) {
        if (!tefl_native_pages_hook_empty($hook)) {
            return null;
        }
    }

    $primary = tefl_native_pages_attrs(tefl_native_pages_capture('astra_primary_class'));
    $html    = function ($frag) use ($ctx) {
        return $ctx['html']($ctx['block']((string) $frag));
    };

    // Archive header (astra_archive_header → Astra_Posts_Structure / astra_archive_page_info).
    // Only the legacy banner (title / description rows) is mirrored; anything
    // else it prints (breadcrumb, a description) is passed through whole.
    $header     = null;
    // index.php (the posts index) has no archive header.
    $raw_header = $kind === 'home' ? '' : trim(tefl_native_pages_capture('astra_archive_header'));
    if ($raw_header !== '') {
        if (!preg_match('#^<section class="ast-archive-description">\s*(.*?)\s*</section>$#s', $raw_header, $m)) {
            return null;
        }
        $inner = $m[1];
        if ($kind === 'search') {
            $title = apply_filters('astra_the_search_page_title', sprintf(astra_get_option('section-search-page-title-custom-title') . ' %s', '<span>' . get_search_query() . '</span>'));
            $plain = '<h1 class="page-title ast-archive-title"> ' . $title . ' </h1>';
        } else {
            add_filter('get_the_archive_title_prefix', '__return_empty_string');
            $title = get_the_archive_title();
            remove_filter('get_the_archive_title_prefix', '__return_empty_string');
            $plain = '<h1 class="page-title ast-archive-title">' . $title . '</h1>';
        }
        $header = trim(preg_replace('/\s+/', ' ', $inner)) === trim(preg_replace('/\s+/', ' ', $plain))
            ? array('title_html' => $kind === 'search' ? ' ' . $title . ' ' : $title, 'html' => '')
            : array('title_html' => '', 'html' => $html($inner));
    }

    $structure = astra_get_option('blog-post-structure');
    $structure = is_array($structure) ? array_values($structure) : array();
    $posts     = array();
    while (have_posts()) {
        the_post();
        foreach (array('astra_entry_before', 'astra_entry_top', 'astra_entry_bottom', 'astra_entry_after', 'astra_entry_content_before', 'astra_entry_content_after') as $hook) {
            if (!tefl_native_pages_hook_empty($hook)) {
                return null;
            }
        }
        if (wp_link_pages(array('echo' => 0)) !== '') {
            return null;
        }
        $items = array();
        foreach ($structure as $el) {
            if ($grid && $el === 'image') {
                continue; // layout-5 prints the image before .post-content
            }
            switch ($el) {
                case 'image':
                    $items[] = array('type' => 'image', 'html' => $html(astra_get_post_thumbnail('', '', false)));
                    break;
                case 'title-meta':
                    // astra_get_blog_post_title_meta(): the meta header only.
                    if (!tefl_native_pages_hook_empty('astra_archive_entry_header_before') || !tefl_native_pages_hook_empty('astra_archive_entry_header_after')
                        || !tefl_native_pages_hook_empty('astra_archive_post_meta_before') || !tefl_native_pages_hook_empty('astra_archive_post_meta_after')) {
                        return null;
                    }
                    $items[] = array('type' => 'meta', 'html' => $html(tefl_native_pages_capture('astra_blog_get_post_meta')));
                    break;
                case 'title':
                    $title_attrs = tefl_native_pages_attrs(astra_attr('article-title-blog', array('class' => '')));
                    unset($title_attrs['class']);
                    $items[] = array(
                        'type'  => 'title',
                        'url'   => $ctx['href'](get_permalink()),
                        'html'  => astra_get_the_title(get_the_ID()),
                        'attrs' => $title_attrs,
                    );
                    break;
                case 'excerpt':
                    $type = apply_filters('astra_excerpt_type', astra_get_option('blog-post-content'));
                    if ($type === 'full-content') {
                        return null;
                    }
                    $items[] = array('type' => 'excerpt', 'html' => $html(tefl_native_pages_capture('the_excerpt')));
                    add_filter('excerpt_more', '__return_false');
                    break;
                case 'read-more':
                    $link = tefl_native_pages_capture('astra_post_link');
                    if (!preg_match('#^<p class="ast-blog-single-element ast-read-more-container read-more"> <a class="([^"]*)" href="([^"]*)"> <span class="screen-reader-text">(.*?)</span> (.*?)</a></p>$#s', $link, $m)) {
                        return null;
                    }
                    $items[] = array(
                        'type'  => 'read-more',
                        'class' => tefl_native_txt($m[1]),
                        'url'   => $ctx['href'](tefl_native_txt($m[2])),
                        'title' => $m[3],
                        'label' => tefl_native_txt($m[4]),
                    );
                    break;
                default:
                    return null; // category / tag rows aren't used on this site
            }
        }
        $layout_attrs = tefl_native_pages_attrs(tefl_native_pages_capture('astra_blog_layout_class', array($grid ? 'blog-layout-5' : 'blog-layout-1')));
        $entry_attrs  = tefl_native_pages_attrs(astra_attr($grid ? 'article-entry-content-blog-layout-3' : 'article-entry-content-blog-layout', array('class' => '')));
        unset($entry_attrs['class']);
        $col = $grid ? esc_html(apply_filters('astra_attr_ast-grid-col-6_output', 'ast-grid-col-6')) : astra_attr('ast-grid-common-col');
        $posts[] = array(
            'article'      => tefl_native_pages_attrs(astra_attr('article-blog', array(
                'id'    => 'post-' . get_the_id(),
                'class' => join(' ', get_post_class()),
            ))),
            'layout_class' => isset($layout_attrs['class']) ? $layout_attrs['class'] : '',
            'col'          => $col,
            'image_html'   => $grid && in_array('image', $structure, true) && apply_filters('astra_featured_image_enabled', true)
                ? $html(astra_get_post_thumbnail('', '', false))
                : null,
            'items'        => $items,
            'entry_attrs'  => $entry_attrs,
        );
    }

    // Nothing found: template-parts/content-none.php (search / archive).
    $none = null;
    if (!$posts) {
        $widget = is_search() && is_callable('Astra_Dynamic_CSS::astra_4_6_0_compatibility') && Astra_Dynamic_CSS::astra_4_6_0_compatibility();
        $form   = $widget
            ? tefl_native_pages_capture(function () {
                the_widget('WP_Widget_Search');
            })
            : get_search_form(array('echo' => false));
        if (!tefl_native_pages_balanced($form)) {
            return null;
        }
        $none = array(
            'message'   => tefl_native_txt(astra_default_strings(is_search() ? 'string-search-nothing-found-message' : 'string-content-nothing-found-message', false)),
            'form_html' => $html($form),
        );
    }

    $pagination = trim(tefl_native_pages_capture('astra_pagination'));
    $nav        = '';
    if ($pagination !== '') {
        if (!preg_match("#^<div class='ast-pagination'>(.*)</div>$#s", $pagination, $m)) {
            return null;
        }
        $nav = $html(trim($m[1]));
    }

    return array(
        'kind'          => $kind,
        'primary_class' => isset($primary['class']) ? $primary['class'] : 'content-area primary',
        'header'        => $header,
        'grid'          => $grid,
        'posts'         => $posts,
        'none'          => $none,
        'pagination'    => $nav,
    );
}
