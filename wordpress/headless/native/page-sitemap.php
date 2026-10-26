<?php
/**
 * Native template: "Sitemap" (page-sitemap.php) — /sitemap/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-sitemap&path=/<cc>/sitemap/&id=4892
 *
 * The template is fully static (its `banner` field is read but never
 * printed); the endpoint only confirms the page uses it.
 * React: components/pages/sitemap/SitemapPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('page-sitemap', 'tefl_native_page_sitemap');

function tefl_native_page_sitemap($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'page-sitemap.php') {
        return null;
    }
    return array('id' => (int) $id);
}
