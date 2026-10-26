<?php
/**
 * Native site chrome: the theme's header and footer (Astra legacy header /
 * footer as the child theme customises them).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/chrome&path=/<cc>/x/&id=123
 *
 * The page's main query is rebuilt first (the post for singular pages, the
 * URL's own query for listings / search / 404), then every hook the theme's
 * header.php / footer.php fire is walked in priority order. The callbacks
 * whose markup the React chrome reproduces (components/chrome/) are replaced
 * by collectors that return the values they print; every other callback runs
 * as on the page (side effects included). Inside the <header> / <footer>
 * those must print nothing — when one does (a new plugin hook, an Astra
 * setting the port doesn't know), that region is returned as null and the
 * Next side keeps the page's WordPress HTML for it. Hooks outside those two
 * elements (astra_header_before / _after, astra_content_before / _after,
 * astra_footer_before / _after, astra_body_bottom) come back as HTML.
 *
 * Mirrors includes/template_functions.php (ti_header_fn, new_mega_menu,
 * astra_site_branding_markup, astra_get_footer_widget, astra_get_small_footer,
 * clockdown_function), includes/mega_menu_CTA_buttons.php,
 * includes/country_guides_menu_links.php, includes/ti-mobile-menu.php,
 * includes/ti-header-functions.php, includes/ti-footer-functions.php
 * (ti_footer_course_banner), template-parts/offer-banner.php,
 * template-parts/sticky-offer-cta.php, template-parts/advanced-footer/layout-4.php,
 * footer.php, and Astra's header-main-layout.php / footer-sml-layout-2.php /
 * markup-extras.php / template-parts.php.
 *
 * Geolocation: the header prints the visitor's geolocated country
 * (data-country, the country selector's call details). A cached page is the
 * same for everyone, so this renders what a cache file built without a
 * country shows (the US root's own cache today): no country, the default
 * call details. ti-global.js localises logo and phone in the browser.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('chrome', 'tefl_native_chrome', array('singular' => false));

/** Thrown inside a collector when the markup can't be reproduced; that region → null. */
class Tefl_Native_Chrome_Bail extends Exception {
}

function tefl_native_chrome($id, $ctx) {
    foreach (array('get_field', 'astra_attr', 'astra_get_option_meta', 'ti_header_fn', 'get_call_details', 'ti_acf_link_url',
        'ti_acf_link_title', 'geo_replace_currency_default', 'is_subcountry_folder', 'get_current_country') as $fn) {
        if (!function_exists($fn)) {
            return null;
        }
    }
    // Anything printed outside the captures (a notice, a hook) must not reach the JSON response.
    ob_start();
    try {
        $ids = tefl_native_chrome_setup($id, $ctx);
        if ($ids === null) {
            return null;
        }
        $_SERVER['REQUEST_URI'] = $ctx['path'];
        tefl_native_chrome_astra_wp();
        $out = tefl_native_chrome_regions($ctx, tefl_native_chrome_vals($ctx), $ids);
    } finally {
        ob_end_clean();
    }
    if ($id) {
        wp_reset_postdata();
    }
    return $out;
}

/**
 * Fingerprint of the theme code this port reproduces (the functions' own
 * source lines and the template files, plus the Astra version). When the
 * theme changes any of it, the React chrome would silently show the old
 * markup — so on a mismatch every region is null (the pages keep WordPress's
 * header/footer) until the port is updated, re-verified and this constant set
 * to the new value (the response's `errors` prints it).
 */
const TEFL_NATIVE_CHROME_SOURCE = '4d9aee1f4658125c7b0a880e02e931c5';

function tefl_native_chrome_fingerprint() {
    $parts = array(defined('ASTRA_THEME_VERSION') ? ASTRA_THEME_VERSION : '');
    foreach (array('ti_header_fn', 'new_mega_menu', 'clockdown_function', 'get_call_details', 'astra_site_branding_markup',
        'astra_get_footer_widget', 'astra_get_small_footer', 'ti_mega_menu_to_mobile_items', 'ti_mobile_menu_pre_mega',
        'ti_mobile_header_insert_cart_whatsapp_btn_fn', 'ti_footer_course_banner', 'flip_countdown_timer_shortcode') as $fn) {
        if (!function_exists($fn)) {
            $parts[] = "$fn:missing";
            continue;
        }
        $r     = new ReflectionFunction($fn);
        $lines = @file((string) $r->getFileName());
        $parts[] = $fn . ':' . ($lines ? md5(implode('', array_slice($lines, $r->getStartLine() - 1, $r->getEndLine() - $r->getStartLine() + 1))) : 'unreadable');
    }
    $dir = get_stylesheet_directory();
    foreach (array('header.php', 'footer.php', 'template-parts/offer-banner.php', 'template-parts/sticky-offer-cta.php',
        'template-parts/advanced-footer/layout-4.php', 'includes/mega_menu_CTA_buttons.php', 'includes/country_guides_menu_links.php') as $f) {
        $parts[] = $f . ':' . (is_readable("$dir/$f") ? md5_file("$dir/$f") : 'missing');
    }
    return md5(implode('|', $parts));
}

function tefl_native_chrome_regions($ctx, $v, $ids) {
    $errors = array(); // why a region fell back (diagnostics only)
    $fingerprint = tefl_native_chrome_fingerprint();
    if ($fingerprint !== TEFL_NATIVE_CHROME_SOURCE) {
        return array(
            'origin'     => tefl_headless_wp_origin(),
            'header'     => null,
            'footer'     => null,
            'after_page' => null,
            'errors'     => array('theme source changed: ' . $fingerprint),
        );
    }
    $header = null;
    try {
        $header = tefl_native_chrome_header($ctx, $v, $ids['header']);
    } catch (Throwable $e) { // a bail, or anything unexpected: keep that region WordPress HTML
        $header = null;
        $errors[] = 'header: ' . $e->getMessage();
    }
    $footer = null;
    try {
        $footer = tefl_native_chrome_footer($ctx, $v, $ids['footer']);
    } catch (Throwable $e) { // a bail, or anything unexpected: keep that region WordPress HTML
        $footer = null;
        $errors[] = 'footer: ' . $e->getMessage();
    }
    $after = null;
    try {
        $after = tefl_native_chrome_after_page($ctx, $v, $ids['footer']);
    } catch (Throwable $e) { // a bail, or anything unexpected: keep that region WordPress HTML
        $after = null;
        $errors[] = 'after: ' . $e->getMessage();
    }
    return array(
        'origin'     => tefl_headless_wp_origin(),
        'header'     => $header,
        'footer'     => $footer,
        'after_page' => $after,
        'errors'     => $errors,
    );
}

/* ------------------------------------------------------------------ *
 * Request setup
 * ------------------------------------------------------------------ */

/**
 * The page's main query, and the post the header / footer see as "current".
 * Singular pages: the post. Listings, search, 404: the URL's own main query —
 * the header runs before the loop (global $post = the first post), the footer
 * after it (global $post = the last one).
 *
 * @return array|null array('header' => int, 'footer' => int), null when the post can't be shown
 */
function tefl_native_chrome_setup($id, $ctx) {
    global $wp_query;
    if ($id) {
        $p = get_post($id);
        if (!$p || $p->post_status !== 'publish' || post_password_required($p) || !is_post_type_viewable($p->post_type)) {
            return null;
        }
        if (!tefl_native_main_query($p)) {
            return null;
        }
        return array('header' => (int) $p->ID, 'footer' => (int) $p->ID);
    }
    tefl_native_chrome_query_for_path($ctx);
    $posts = isset($wp_query->posts) && is_array($wp_query->posts) ? $wp_query->posts : array();
    $first = $posts ? $posts[0] : null;
    $last  = $posts ? $posts[count($posts) - 1] : null;
    $GLOBALS['post'] = $first;
    return array(
        'header' => $first ? (int) $first->ID : 0,
        'footer' => $last ? (int) $last->ID : 0,
    );
}

/**
 * The main query WordPress builds for this front URL (rewrite rules, the query
 * string as $_GET, pre_get_posts, handle_404) — as on the page, for the
 * non-singular views.
 */
function tefl_native_chrome_query_for_path($ctx) {
    global $wp_query, $wp_the_query;
    $_GET     = is_array($ctx['query']) ? $ctx['query'] : array();
    $_REQUEST = array_merge($_REQUEST, $_GET);
    $_SERVER['REQUEST_URI'] = $ctx['path'];

    $w = new WP();
    $GLOBALS['wp'] = $w;
    $w->parse_request();
    $wp_the_query = new WP_Query();
    $wp_query     = $wp_the_query;
    $main         = $wp_query;
    add_action('parse_query', function ($q) use ($main) {
        if ($q === $main && !($q->is_singular || $q->is_archive || $q->is_search || $q->is_feed
            || $q->is_trackback || $q->is_404 || $q->is_admin || $q->is_robots || $q->is_favicon)) {
            $q->is_home = true;
        }
    }, 0);
    $wp_query->query($w->query_vars);
    $w->handle_404();
    $w->register_globals();
}

/**
 * Astra's own `wp`-action setup (schema attributes, per-page meta), which a
 * REST request never fires. Only Astra's callbacks run.
 */
function tefl_native_chrome_astra_wp() {
    global $wp_filter;
    static $done = false;
    if ($done || empty($wp_filter['wp'])) {
        return;
    }
    $done = true;
    $skip = array('Astra_Theme_Background_Updater', 'Astra_Woocommerce');
    $cbs  = $wp_filter['wp']->callbacks;
    ksort($cbs, SORT_NUMERIC);
    foreach ($cbs as $list) {
        foreach ($list as $cb) {
            $f    = $cb['function'];
            $name = is_array($f) ? (is_object($f[0]) ? get_class($f[0]) : (string) $f[0]) : (is_string($f) ? $f : '');
            $ok   = is_array($f)
                ? (strpos($name, 'Astra_') === 0 && !in_array($name, $skip, true))
                : (is_string($f) && strpos($f, 'astra_') === 0);
            if ($ok) {
                call_user_func($f, $GLOBALS['wp']);
            }
        }
    }
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/**
 * Value helpers. h: an HTML value the theme echoes raw (render rewrites);
 * t: printed with esc_html()/esc_attr() or raw inside an attribute (decoded,
 * React escapes); u: a link target as the render rewrites it; s: a string.
 */
function tefl_native_chrome_vals($ctx) {
    return array(
        'h' => function ($v) use ($ctx) {
            return $ctx['html'](tefl_native_chrome_str($v));
        },
        't' => function ($v) {
            return tefl_native_txt(tefl_native_chrome_str($v));
        },
        'u' => function ($v) use ($ctx) {
            return $ctx['href'](tefl_native_txt(tefl_native_chrome_str($v)));
        },
    );
}

/** A value as PHP's echo prints it ('' for null / false / arrays, '1' for true). */
function tefl_native_chrome_str($v) {
    if (is_array($v) || is_object($v) || $v === null || $v === false) {
        return '';
    }
    return (string) $v;
}

/** An attribute string (`class="a" id="b" itemscope="itemscope"`) → name => decoded value. */
function tefl_native_chrome_attrs($str) {
    $out = array();
    if (preg_match_all('/([^\s=\/>"\']+)(?:\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s>"\']+)))?/', (string) $str, $m, PREG_SET_ORDER)) {
        foreach ($m as $a) {
            $name = strtolower($a[1]);
            if (isset($out[$name])) {
                continue;
            }
            $val        = isset($a[2]) && $a[2] !== '' ? $a[2] : (isset($a[3]) && $a[3] !== '' ? $a[3] : (isset($a[4]) ? $a[4] : ''));
            $out[$name] = html_entity_decode($val, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }
    }
    return (object) $out; // JSON object even when empty
}

/** What a callable echoes. */
function tefl_native_chrome_capture($fn, $args = array()) {
    ob_start();
    try {
        call_user_func_array($fn, $args);
    } finally {
        $out = ob_get_clean();
    }
    return (string) $out;
}

/** True when HTML is only whitespace / comments. */
function tefl_native_chrome_blank($html) {
    return trim(preg_replace('/<!--[\s\S]*?-->/', '', (string) $html)) === '';
}

/** A callback's name: "fn", "Class::method", or "closure". */
function tefl_native_chrome_cb_name($f) {
    if (is_string($f)) {
        return $f;
    }
    if (is_array($f)) {
        return (is_object($f[0]) ? get_class($f[0]) : (string) $f[0]) . '::' . $f[1];
    }
    return 'closure';
}

/**
 * Walk a hook as do_action($hook, ...$args) would. Callbacks named in $known
 * are replaced by their collector (its return value lands in 'data'); every
 * other callback runs as on the page, and what it prints is gathered in
 * 'html'. With $inside (the hook fires inside an element the React chrome
 * renders), that output must be blank, else Tefl_Native_Chrome_Bail.
 */
function tefl_native_chrome_hook($hook, $known = array(), $inside = true, $args = array('')) {
    global $wp_filter;
    $data = array();
    $html = '';
    if (!empty($wp_filter[$hook])) {
        $cbs = $wp_filter[$hook]->callbacks;
        ksort($cbs, SORT_NUMERIC);
        foreach ($cbs as $list) {
            foreach ($list as $cb) {
                $name = tefl_native_chrome_cb_name($cb['function']);
                if (isset($known[$name])) {
                    $data[$name] = call_user_func($known[$name]);
                    continue;
                }
                $html .= tefl_native_chrome_capture($cb['function'], array_slice($args, 0, (int) $cb['accepted_args']));
            }
        }
    }
    foreach ($known as $name => $unused) {
        if (!array_key_exists($name, $data)) {
            throw new Tefl_Native_Chrome_Bail("$hook: $name not hooked");
        }
    }
    if ($inside && !tefl_native_chrome_blank($html)) {
        throw new Tefl_Native_Chrome_Bail("$hook prints markup");
    }
    return array('data' => $data, 'html' => $html);
}

/** The function the theme calls is the child theme's (the version this port mirrors). */
function tefl_native_chrome_is_child_fn($fn) {
    if (!function_exists($fn)) {
        return false;
    }
    $r = new ReflectionFunction($fn);
    return strpos(wp_normalize_path((string) $r->getFileName()), wp_normalize_path(get_stylesheet_directory()) . '/') === 0;
}

/** clockdown_function()'s state: the value it prints, and which branch (time() at render). */
function tefl_native_chrome_clock($time) {
    $time = tefl_native_chrome_str($time);
    return array(
        'value'  => $time,
        'active' => (strtotime($time) - time()) > 0,
    );
}

/** [flip_countdown_timer] (uniqid + inline script + style), as the render delivers it. */
function tefl_native_chrome_flip($ctx, $expiry = null) {
    $sc = $expiry === null ? '[flip_countdown_timer]' : '[flip_countdown_timer expiry_date="' . esc_attr($expiry) . '"]';
    return $ctx['html'](do_shortcode($sc));
}

/* ------------------------------------------------------------------ *
 * Header: header.php from <div id="page"> to <div id="content">
 * ------------------------------------------------------------------ */

function tefl_native_chrome_header($ctx, $v, $post_id) {
    if (!function_exists('astra_header_markup') || !function_exists('new_mega_menu')) {
        return null;
    }
    $before = tefl_native_chrome_hook('astra_header_before', array(), false);

    $markup = null;
    $hook   = tefl_native_chrome_hook('astra_header', array(
        'astra_header_markup' => function () use ($ctx, $v, $post_id, &$markup) {
            $markup = tefl_native_chrome_masthead($ctx, $v, $post_id);
            return true;
        },
    ));
    $after          = tefl_native_chrome_hook('astra_header_after', array(), false);
    $content_before = tefl_native_chrome_hook('astra_content_before', array(), false);

    return array(
        'skip'                => $v['t'](astra_default_strings('string-header-skip-link', false)),
        'before_html'         => $ctx['html']($before['html']),
        'masthead'            => $markup,
        'after_html'          => $ctx['html']($after['html']),
        'content_before_html' => $ctx['html']($content_before['html']),
    );
}

/** astra_header_markup(): <header id="masthead">. */
function tefl_native_chrome_masthead($ctx, $v, $post_id) {
    tefl_native_chrome_hook('astra_header_markup_before');
    $attrs = tefl_native_chrome_attrs(astra_attr('header', array(
        'id'    => 'masthead',
        'class' => join(' ', astra_get_header_classes()),
    )));
    tefl_native_chrome_hook('astra_masthead_top');

    $layout = null;
    tefl_native_chrome_hook('astra_masthead', array(
        'astra_masthead_primary_template' => function () use ($ctx, $v, $post_id, &$layout) {
            $file = wp_normalize_path((string) locate_template('template-parts/header/header-main-layout.php'));
            if (strpos($file, wp_normalize_path(get_template_directory()) . '/') !== 0) {
                throw new Tefl_Native_Chrome_Bail('header-main-layout overridden');
            }
            $layout = tefl_native_chrome_main_layout($ctx, $v, $post_id);
            return true;
        },
    ));
    tefl_native_chrome_hook('astra_masthead_bottom');
    tefl_native_chrome_hook('astra_sticky_header_markup');
    tefl_native_chrome_hook('astra_bottom_header_after_markup');
    tefl_native_chrome_hook('astra_header_markup_after');

    return array('attrs' => $attrs) + $layout;
}

/** Astra template-parts/header/header-main-layout.php. */
function tefl_native_chrome_main_layout($ctx, $v, $post_id) {
    $bar_attrs = tefl_native_chrome_attrs(astra_attr('main-header-bar'));

    $out = array('bar_attrs' => $bar_attrs);
    tefl_native_chrome_hook('astra_main_header_bar_top', array(
        'ti_header_fn' => function () use ($ctx, $v, $post_id, &$out) {
            $out['ti'] = tefl_native_chrome_ti_header($ctx, $v, $post_id);
            return true;
        },
    ));
    tefl_native_chrome_hook('astra_masthead_content', array(
        'astra_site_branding_markup'      => function () use ($v, &$out) {
            if (!tefl_native_chrome_is_child_fn('astra_site_branding_markup')) {
                throw new Tefl_Native_Chrome_Bail('branding not the child theme\'s');
            }
            $out['branding'] = array(
                'identity_attrs' => tefl_native_chrome_attrs(astra_attr('site-identity', array('class' => 'ast-site-identity'))),
                'url'            => $v['u'](site_url()),
            );
            return true;
        },
        'astra_toggle_buttons_markup'     => function () use (&$out) {
            $out['toggle'] = tefl_native_chrome_toggle();
            return true;
        },
        'astra_primary_navigation_markup' => function () use ($v, &$out) {
            $out['nav'] = tefl_native_chrome_nav($v);
            return true;
        },
    ));
    tefl_native_chrome_hook('astra_main_header_bar_bottom', array(
        'new_mega_menu' => function () use ($ctx, $v, &$out) {
            $out['mega'] = tefl_native_chrome_mega($ctx, $v);
            return true;
        },
    ));
    return $out;
}

/** astra_toggle_buttons_markup() → null when Astra prints no mobile menu buttons. */
function tefl_native_chrome_toggle() {
    $disable_primary_navigation = astra_get_option('disable-primary-nav');
    $custom_header_section      = astra_get_option('header-main-rt-section');
    $hide_custom_menu_mobile    = astra_get_option('hide-custom-menu-mobile', false);
    $above_header_merge         = astra_get_option('above-header-merge-menu');
    $above_header_on_mobile     = astra_get_option('above-header-on-mobile');
    $below_header_merge         = astra_get_option('below-header-merge-menu');
    $below_header_on_mobile     = astra_get_option('below-header-on-mobile');
    $menu_bottons               = true;
    if (($disable_primary_navigation && 'none' == $custom_header_section) || ($disable_primary_navigation && true == $hide_custom_menu_mobile)) {
        $menu_bottons = false;
        if ((true == $above_header_on_mobile && true == $above_header_merge) || (true == $below_header_on_mobile && true == $below_header_merge)) {
            $menu_bottons = true;
        }
    }
    if (!apply_filters('astra_enable_mobile_menu_buttons', $menu_bottons)) {
        return null;
    }

    $out = array('cart_whatsapp' => false, 'primary' => null);
    tefl_native_chrome_hook('astra_masthead_toggle_buttons_before', array(
        'ti_mobile_header_insert_cart_whatsapp_btn_fn' => function () use (&$out) {
            $out['cart_whatsapp'] = true;
            return true;
        },
    ));
    tefl_native_chrome_hook('astra_masthead_toggle_buttons', array(
        'astra_masthead_toggle_buttons_primary' => function () use (&$out) {
            $out['primary'] = tefl_native_chrome_toggle_primary();
            return true;
        },
    ));
    tefl_native_chrome_hook('astra_masthead_toggle_buttons_after');
    return $out;
}

/** astra_masthead_toggle_buttons_primary(). */
function tefl_native_chrome_toggle_primary() {
    $disable_primary_navigation = astra_get_option('disable-primary-nav');
    $custom_header_section      = astra_get_option('header-main-rt-section');
    $display_outside_menu       = astra_get_option('header-display-outside-menu');
    if (!(!$disable_primary_navigation || ('none' != $custom_header_section && !$display_outside_menu))) {
        return null;
    }
    $menu_title          = trim(apply_filters('astra_main_menu_toggle_label', astra_get_option('header-main-menu-label')));
    $menu_label_class    = '';
    $screen_reader_title = esc_html__('Main Menu', 'astra');
    if ('' !== $menu_title) {
        $menu_label_class    = 'ast-menu-label';
        $screen_reader_title = $menu_title;
    }
    $menu_label_class = apply_filters('astra_main_menu_toggle_classes', $menu_label_class);
    $data_attrs       = (string) apply_filters('astra_nav_toggle_data_attrs', '');
    $icon             = tefl_native_chrome_capture(array('Astra_Icons', 'get_icons'), array('menu-bars', true, true));
    // The button's content, as the template prints it.
    $inner = '<span class="screen-reader-text">' . esc_html($screen_reader_title) . '</span>' . $icon;
    if ('' != $menu_title) {
        $inner .= '<span class="mobile-menu-wrap"><span class="mobile-menu">' . esc_html($menu_title) . '</span></span>';
    }
    return array(
        'class'      => tefl_native_txt('menu-toggle main-header-menu-toggle ' . esc_attr($menu_label_class)),
        'data_attrs' => tefl_native_chrome_attrs($data_attrs),
        'inner_html' => $inner,
    );
}

/** astra_primary_navigation_markup() with the primary menu (#primary-menu, built from the ACF mega menu). */
function tefl_native_chrome_nav($v) {
    if (astra_get_option('disable-primary-nav') || !has_nav_menu('primary')) {
        throw new Tefl_Native_Chrome_Bail('primary navigation not the known markup');
    }
    $submenu_class  = apply_filters('astra_primary_submenu_border_class', ' submenu-with-border');
    $menu_animation = astra_get_option('header-main-submenu-container-animation');
    if (!empty($menu_animation)) {
        $submenu_class .= ' astra-menu-animation-' . esc_attr($menu_animation) . ' ';
    }
    $primary_menu_classes = apply_filters('astra_primary_menu_classes', array('main-header-menu', 'ast-menu-shadow', 'ast-nav-menu', 'ast-flex', 'ast-justify-content-flex-end', $submenu_class));

    $nav_attrs  = astra_attr('site-navigation', array(
        'id'         => 'primary-site-navigation',
        'class'      => 'site-navigation ast-flex-grow-1 navigation-accessibility',
        'aria-label' => esc_attr__('Site Navigation', 'astra'),
    ));
    $items_wrap = '<nav ' . $nav_attrs . '><div class="main-navigation"><ul id="%1$s" class="%2$s">%3$s</ul></div></nav>';

    // wp_nav_menu()'s argument handling up to pre_wp_nav_menu.
    $args = wp_parse_args(array(
        'theme_location'  => 'primary',
        'menu_id'         => 'primary-menu',
        'menu_class'      => esc_attr(implode(' ', $primary_menu_classes)),
        'container'       => 'div',
        'container_class' => 'main-header-bar-navigation',
        'items_wrap'      => $items_wrap,
    ), array(
        'menu' => '', 'container' => 'div', 'container_class' => '', 'container_id' => '', 'container_aria_label' => '',
        'menu_class' => 'menu', 'menu_id' => '', 'echo' => true, 'fallback_cb' => 'wp_page_menu', 'before' => '',
        'after' => '', 'link_before' => '', 'link_after' => '', 'items_wrap' => '<ul id="%1$s" class="%2$s">%3$s</ul>',
        'item_spacing' => 'preserve', 'depth' => 0, 'walker' => '', 'theme_location' => '',
    ));
    $args = (object) apply_filters('wp_nav_menu_args', $args);

    global $wp_filter;
    $pre = array();
    if (!empty($wp_filter['pre_wp_nav_menu'])) {
        foreach ($wp_filter['pre_wp_nav_menu']->callbacks as $list) {
            foreach ($list as $cb) {
                $pre[] = tefl_native_chrome_cb_name($cb['function']);
            }
        }
    }
    $menu_obj = function_exists('ti_nav_args_menu_obj') ? ti_nav_args_menu_obj($args) : null;
    if ($pre !== array('ti_mobile_menu_pre_mega') || !$menu_obj || !defined('TI_MOBILE_MENU_TERM') || TI_MOBILE_MENU_TERM !== (int) $menu_obj->term_id
        || $args->items_wrap !== $items_wrap || $args->container !== 'div' || !empty($args->container_id)) {
        throw new Tefl_Native_Chrome_Bail('primary menu not the ACF mobile menu');
    }
    $items = tefl_native_chrome_mobile_items();
    if (!$items) {
        throw new Tefl_Native_Chrome_Bail('mobile menu falls back to the stored menu');
    }

    return array(
        'align_attrs'     => tefl_native_chrome_attrs(astra_attr('ast-main-header-bar-alignment')),
        'container_class' => tefl_native_txt(esc_attr($args->container_class)),
        'nav_attrs'       => tefl_native_chrome_attrs($nav_attrs),
        'menu_id'         => tefl_native_txt(esc_attr(!empty($args->menu_id) ? $args->menu_id : ('menu-' . $menu_obj->slug))),
        'menu_class'      => tefl_native_txt(esc_attr(!empty($args->menu_class) ? $args->menu_class : 'menu')),
        'items'           => $items,
    );
}

/**
 * ti_mega_menu_to_mobile_items() as a tree: each item is
 * { title, href, children: item[] } (children empty = a plain link).
 */
function tefl_native_chrome_mobile_items() {
    $items = get_field('mega_menu_items', 'option');
    if (empty($items) || !is_array($items)) {
        return array();
    }
    $clean = function ($s) {
        return trim(wp_strip_all_tags(str_ireplace(array('</br>', '<br>', '<br/>', '<br />'), ' ', (string) $s)));
    };
    $href  = 'tefl_headless_rewrite_href';
    $txt   = 'tefl_native_txt';
    $out   = array();
    foreach ($items as $mm) {
        $title = $clean($mm['menu_title'] ?? '');
        if ('' === $title) {
            continue;
        }
        $top_url  = ti_acf_link_url($mm['menu_link'] ?? '');
        $top_url  = $top_url ? $top_url : '#';
        $seen     = array();
        $children = array();

        $groups = array();
        if (!empty($mm['sub_menu']) && is_array($mm['sub_menu'])) {
            $groups = array_merge($groups, $mm['sub_menu']);
        }
        if (!empty($mm['extra_sub_menu']) && is_array($mm['extra_sub_menu'])) {
            $groups = array_merge($groups, $mm['extra_sub_menu']);
        }
        foreach ($groups as $grp) {
            $header    = $clean($grp['sub_menu_header'] ?? '');
            $sub_items = (isset($grp['sub_menu_item']) && is_array($grp['sub_menu_item'])) ? $grp['sub_menu_item'] : array();
            $list      = array();
            foreach ($sub_items as $sm) {
                $st = $clean($sm['sub_menu_title'] ?? '');
                if ('' === $st) {
                    continue;
                }
                $su  = ti_acf_link_url($sm['sub_menu_link'] ?? '');
                $key = strtolower($st) . '|' . $su;
                if (isset($seen[$key])) {
                    continue;
                }
                $seen[$key] = 1;
                $list[]     = array('title' => $txt(esc_html($st)), 'href' => $href($txt($su ? $su : '#')), 'children' => array());
            }
            if (!$list) {
                continue;
            }
            if ('' !== $header) {
                $children[] = array('title' => $txt(esc_html($header)), 'href' => '#', 'children' => $list);
            } else {
                $children = array_merge($children, $list);
            }
        }
        if (!empty($mm['menu_cta_block']) && is_array($mm['menu_cta_block'])) {
            foreach (array('left_block', 'right_block') as $side) {
                $btns = (isset($mm['menu_cta_block'][$side]['cta_buttons']) && is_array($mm['menu_cta_block'][$side]['cta_buttons'])) ? $mm['menu_cta_block'][$side]['cta_buttons'] : array();
                foreach ($btns as $btn) {
                    $bt = $clean($btn['button_text'] ?? '');
                    if ('' === $bt) {
                        $bt = ti_acf_link_title($btn['button_link'] ?? '');
                    }
                    $bu = ti_acf_link_url($btn['button_link'] ?? '');
                    if ('' === $bt || '' === $bu) {
                        continue;
                    }
                    $key = strtolower($bt) . '|' . $bu;
                    if (isset($seen[$key])) {
                        continue;
                    }
                    $seen[$key] = 1;
                    $children[] = array('title' => $txt(esc_html($bt)), 'href' => $href($txt($bu)), 'children' => array());
                }
            }
        }
        $out[] = array('title' => $txt(esc_html($title)), 'href' => $href($txt($top_url)), 'children' => $children);
    }
    return $out;
}

/** ti_header_fn(): the offer banners, primary links, search, country selector, icons. */
function tefl_native_chrome_ti_header($ctx, $v, $post_id) {
    // Geolocation: see the file header — no country, as an anonymous cache file shows.
    $country           = '';
    $site_call_details = get_call_details($country);

    $hide_header_banner = get_field('hide_header_banner', 'option');
    $expiry_date        = get_field('timer_expiry', 'option');
    $header_banner      = get_field('banner', 'option');
    $current_date       = current_time('Y-m-d H:i:s');

    // 1. Per-page offer banners (d-none on desktop CSS; the mobile banner).
    $offers = array();
    foreach ((array) $header_banner as $hb) {
        $banner_styling     = $hb['banner_styling'] ?? array();
        $where_to_show      = !empty($hb['where_to_show']) ? $hb['where_to_show'] : array();
        $show_clockdown     = $hb['show_clockdown'] ?? false;
        $banner_btn         = $hb['button'] ?? array();
        $banner_btn_styling = $hb['button_styling'] ?? array();
        $timer_active       = $show_clockdown && strtotime($current_date) < strtotime((string) $expiry_date);
        if (in_array($post_id, (array) $where_to_show) && !$hide_header_banner && !is_front_page() && !is_singular('course') && !is_page('79087')) {
            $offers[] = array(
                'bg'           => $v['t']($banner_styling['banner_background_color'] ?? ''),
                'timer_active' => (bool) $timer_active,
                'clock'        => tefl_native_chrome_clock($expiry_date),
                'logo_link'    => $v['u']($hb['banner_logo_link'] ?? ''),
                'logo'         => $v['t']($hb['banner_logo'] ?? ''),
                'text_color'   => $v['t']($banner_styling['banner_text_color'] ?? ''),
                'font_size'    => $v['t']($banner_styling['banner_text_font_size'] ?? ''),
                'text_html'    => $v['h']($hb['content'] ?? ''),
                'show_button'  => (bool) ($hb['show_button'] ?? false),
                'btn_bg'       => $v['t']($banner_btn_styling['button_background_color'] ?? ''),
                'btn_color'    => $v['t']($banner_btn_styling['button_text_color'] ?? ''),
                'btn_size'     => $v['t']($banner_btn_styling['button_text_font_size'] ?? ''),
                'btn_link'     => $v['u']($banner_btn['link'] ?? ''),
                'btn_text_html' => $v['h']($banner_btn['text'] ?? ''),
            );
        }
    }

    // 2. The legacy scrolling banner strip (homepage.php and a list of old posts / pages).
    $strip = null;
    if (is_page_template('homepage.php') || is_single(array('47', '745', '838', '836', '743', '898', '58', '832', '825', '2704', '2816', '822', '820', '814', '812', '816', '809')) || is_page(array('6839', '901', '3905', '4786'))) {
        $banner_show = get_field('show_banner', 'options');
        if ($banner_show && !isset($_GET['debug'])) {
            $show_clock = (bool) get_field('show_countdown_clock', 'options');
            $clock      = tefl_native_chrome_clock(get_field('clockdown', 'option'));
            $items      = array();
            foreach ((array) get_field('banner_content', 'options') as $ban_cont) {
                $items[] = array(
                    'url'  => $ban_cont['content_url'] ? $v['u']($ban_cont['content_url']) : '',
                    'html' => $v['h']($ban_cont['content'] ?? ''),
                );
            }
            $strip = array(
                'color' => $v['t'](get_field('banner_background_color', 'options')),
                'items' => $items,
                'clock' => $show_clock ? $clock : null,
            );
        }
    }

    // 3. The old toggle banners (per row `toggle` + `clockdown`), once per matching where_to_show entry.
    $banners = array();
    $color   = get_field('banner_background_color', 'options');
    foreach ((array) get_field('banner', 'options') as $e) {
        $toggle         = $e['toggle'] ?? null;
        $clockdown      = isset($e['clockdown']) ? $e['clockdown'] : '';
        $where          = $e['where_to_show'] ?? null;
        $where          = $where ?? array();
        $date_today     = date('l, F d y h:i:s');
        if (strtotime($clockdown) < strtotime($date_today)) {
            $toggle = false;
        }
        if (!$toggle) {
            continue;
        }
        foreach ((array) $where as $w) {
            $wid = is_object($w) ? $w->ID : null;
            if (is_single($wid) || is_page($wid)) {
                $banners[] = array(
                    'color'          => $v['t']($color),
                    'show_clockdown' => (bool) ($e['show_clockdown'] ?? false),
                    'clock'          => tefl_native_chrome_clock($clockdown),
                    'content_html'   => $v['h']($e['content'] ?? ''),
                    'show_button'    => (bool) ($e['show_button'] ?? false),
                    'btn_link'       => $v['u']($e['button']['link'] ?? ''),
                    'btn_text_html'  => $v['h']($e['button']['text'] ?? ''),
                );
            }
        }
    }

    // 4. Primary menu row.
    $links = array();
    foreach ((array) get_field('primary_header_menu_items', 'option') as $item) {
        $links[] = array('href' => $v['u']($item['menu_link'] ?? ''), 'html' => $v['h']($item['menu_text'] ?? ''));
    }
    $countries   = array();
    $call_json   = json_encode(array('html' => $site_call_details));
    $wc_countries = function_exists('WC') && WC()->countries ? WC()->countries->countries : array();
    foreach ((array) get_field('geo_logos', 'options') as $gl) {
        $cc          = (string) ($gl['country_code'] ?? '');
        $countries[] = array(
            'cc'   => $v['t']($cc),
            'name' => $v['t']($wc_countries[$cc] ?? ''),
            'flag' => 'https://flagcdn.com/w20/' . strtolower($cc) . '.png',
        );
    }

    return array(
        'offers'        => $offers,
        'strip'         => $strip,
        'banners'       => $banners,
        'country'       => $country,
        'logo_href'     => $v['u']('/' . (is_subcountry_folder() ? strtolower(get_current_country()) . '/' : '')),
        'links'         => $links,
        'search_action' => $v['u'](get_home_url()),
        'call_details'  => (string) $call_json,
        'countries'     => $countries,
        'my_account'    => $v['u']('/my-account/'),
        'cart'          => $v['u']('/cart/'),
        'cart_mobile'   => $v['u']('/cart'),
    );
}

/** new_mega_menu() (+ mega_menu_CTA_buttons.php, country_guides_menu_links.php). */
function tefl_native_chrome_mega($ctx, $v) {
    $mega_menu_new = get_field('mega_menu_items', 'option');
    $cta_buttons   = array();
    foreach ((array) get_field('mega_menu_cta_buttons', 'option') as $b) {
        $cta_buttons[] = array(
            'link'      => $v['u']($b['button_link'] ?? ''),
            'text_html' => $v['h']($b['button_text'] ?? ''),
            'icon'      => !empty($b['button_icon']) ? $v['t']($b['button_icon']) : '',
        );
    }

    // Variables the template leaks from one item / loop into the next.
    $add_custom_style = null;
    $sm_bg_color      = null;
    $sm_text_color    = null;
    $guides           = null;

    $items = array();
    $count = 0;
    foreach ((array) $mega_menu_new as $index => $mm) {
        $count++;
        $has_cta_block = $mm['has_cta_block'] ?? false;
        $has_sub_menu  = $mm['has_sub_menu'] ?? false;
        $menu_link     = $mm['menu_link'] ?? '';
        $item          = array(
            'has_children' => (bool) ($has_sub_menu || $has_cta_block),
            'link'         => $menu_link ? $v['u']($menu_link) : null,
            'title_html'   => $v['h']($mm['menu_title'] ?? ''),
            'sub'          => null,
            'cta'          => null,
        );
        $custom = function () use (&$add_custom_style, &$sm_bg_color, &$sm_text_color) {
            return $add_custom_style ? 'background:' . tefl_native_chrome_str($sm_bg_color) . ';color:' . tefl_native_chrome_str($sm_text_color) : null;
        };

        if ($has_sub_menu) {
            $sub_menu               = $mm['sub_menu'] ?? null;
            $sub_menu_has_cta_block = $mm['sub_menu_has_cta_block'] ?? false;
            $cta_block              = $mm['cta_block'] ?? null;
            $menu_has_extra_links   = $mm['menu_has_extra_links'] ?? false;
            if (is_countable($sub_menu)) {
                $count_sub_menu = count($sub_menu);
                if ($sub_menu) {
                    $col_div = 12 / $count_sub_menu;
                    $sub     = array('count' => $count, 'cta' => null, 'cols' => array(), 'prospectus' => false);
                    if ($sub_menu_has_cta_block) {
                        $block = '';
                        if ($cta_block === 'elt') {
                            $block = do_shortcode('[elt_block]');
                        } elseif ($cta_block === 'salary-calculator') {
                            $block = do_shortcode('[salary_calculator_block]');
                        }
                        $cols      = array();
                        $col_count = 1;
                        foreach ($sub_menu as $sm) {
                            $list = array();
                            foreach ((array) ($sm['sub_menu_item'] ?? array()) as $sbc) {
                                $is_heading = isset($sbc['is_heading']) ? $sbc['is_heading'] : false;
                                $list[]     = array(
                                    'heading'    => (bool) $is_heading,
                                    'css'        => $v['t']($sbc['css_classes'] ?? ''),
                                    'title_html' => $v['h']($sbc['sub_menu_title'] ?? ''),
                                    'link'       => $v['u']($sbc['sub_menu_link'] ?? ''),
                                    'style'      => $is_heading ? null : $custom(),
                                );
                            }
                            $extra = null;
                            if (($col_count === $count_sub_menu) && $menu_has_extra_links) {
                                $extra = array();
                                foreach ((array) ($mm['extra_sub_menu'] ?? array()) as $esm) {
                                    $elist = array();
                                    foreach ((array) ($esm['sub_menu_item'] ?? array()) as $esmc) {
                                        $is_heading = isset($esmc['is_heading']) ? $esmc['is_heading'] : false;
                                        $elist[]    = array(
                                            'heading'    => (bool) $is_heading,
                                            'css'        => $v['t']($esmc['css_classes'] ?? ''),
                                            'title_html' => $v['h']($esmc['sub_menu_title'] ?? ''),
                                            'link'       => $v['u']($esmc['sub_menu_link'] ?? ''),
                                        );
                                    }
                                    $extra[] = array('head_html' => $v['h']($esm['sub_menu_header'] ?? ''), 'items' => $elist);
                                }
                            }
                            $cols[] = array(
                                'separator' => $col_count === 4 ? tefl_native_chrome_str($col_div) : null,
                                'head_html' => $v['h']($sm['sub_menu_header'] ?? ''),
                                'items'     => $list,
                                'extra'     => $extra,
                            );
                            $col_count += 1;
                        }
                        $sub['cta'] = array('block_html' => $ctx['html']($block), 'cols' => $cols);
                    } else {
                        foreach ($sub_menu as $sm) {
                            $list = array();
                            foreach ((array) ($sm['sub_menu_item'] ?? array()) as $sbc) {
                                $is_heading       = isset($sbc['is_heading']) ? $sbc['is_heading'] : false;
                                $add_custom_style = $sbc['add_custom_style'] ?? null;
                                if ($add_custom_style) {
                                    $custom_style  = $sbc['custom_style'] ?? array();
                                    $sm_bg_color   = $custom_style['background_color'] ?? null;
                                    $sm_text_color = $custom_style['text_color'] ?? null;
                                }
                                $list[] = array(
                                    'heading'    => (bool) $is_heading,
                                    'css'        => $v['t']($sbc['css_classes'] ?? ''),
                                    'title_html' => $v['h']($sbc['sub_menu_title'] ?? ''),
                                    'link'       => $v['u']($sbc['sub_menu_link'] ?? ''),
                                    'icon'       => ($sbc['title_has_icon'] ?? null) == 1 ? $v['t']($sbc['menu_title_icon'] ?? '') : null,
                                    'style'      => $is_heading ? null : $custom(),
                                );
                            }
                            $sub['cols'][] = array('head_html' => $v['h']($sm['sub_menu_header'] ?? ''), 'items' => $list);
                        }
                        $sub['prospectus'] = $index === 0;
                    }
                    $item['sub'] = $sub;
                }
            }
        }
        if ($has_cta_block) {
            $menu_cta_block = $mm['menu_cta_block'] ?? array();
            $left_block     = $menu_cta_block['left_block'] ?? array();
            $left           = array();
            foreach ((array) ($left_block['cta_buttons'] ?? array()) as $cta_button) {
                $left[] = array(
                    'img'       => $v['t']($cta_button['button_imageicon'] ?? ''),
                    'text_html' => $v['h']($cta_button['button_text'] ?? ''),
                    'link'      => $v['u']($cta_button['button_link'] ?? ''),
                    'bg'        => $v['t']($cta_button['button_background_color'] ?? ''),
                    'color'     => $v['t']($cta_button['button_text_color'] ?? ''),
                    'size'      => $v['t']($cta_button['button_text_size'] ?? ''),
                );
            }
            if ($guides === null) {
                $guides = tefl_native_chrome_country_guides($v);
            }
            $item['cta'] = array(
                'title_html' => $v['h']($left_block['block_title'] ?? ''),
                'guides'     => $guides,
                'buttons'    => $left,
            );
        }
        $items[] = $item;
    }
    return array(
        'items'       => $items,
        'cta_buttons' => $cta_buttons,
        'prospectus'  => $v['u']('/wp-content/uploads/2023/06/TEFL-Institute-Prospectus-2.pdf'),
    );
}

/** country_guides_menu_links.php's query: 24 teach-abroad guides by country name. */
function tefl_native_chrome_country_guides($v) {
    $q   = new WP_Query(array(
        'post_type'      => 'teach_english_abroad',
        'posts_per_page' => 24,
        'post_status'    => 'publish',
        'meta_key'       => 'country_name',
        'orderby'        => 'meta_value',
        'order'          => 'ASC',
    ));
    $out = array();
    foreach ($q->posts as $p) {
        $out[] = array(
            'url'       => $v['u'](get_permalink($p)),
            'name_html' => $v['h'](tefl_native_chrome_capture(function () use ($p) {
                the_field('country_name', $p->ID);
            })),
        );
    }
    return $out;
}

/* ------------------------------------------------------------------ *
 * Footer: footer.php from </div><!-- #content --> to </div><!-- #page -->
 * ------------------------------------------------------------------ */

function tefl_native_chrome_footer($ctx, $v, $post_id) {
    if (!function_exists('astra_footer_markup')) {
        return null;
    }
    $offer          = tefl_native_chrome_offer_banner($ctx, $v, $post_id);
    $content_after  = tefl_native_chrome_hook('astra_content_after', array(), false);
    $footer_before  = tefl_native_chrome_hook('astra_footer_before', array(), false);
    $markup         = null;
    tefl_native_chrome_hook('astra_footer', array(
        'astra_footer_markup' => function () use ($ctx, $v, &$markup) {
            $markup = tefl_native_chrome_colophon($ctx, $v);
            return true;
        },
    ));
    $footer_after = tefl_native_chrome_hook('astra_footer_after', array(), false);
    return array(
        'offer'              => $offer,
        'content_after_html' => $ctx['html']($content_after['html']),
        'footer_before_html' => $ctx['html']($footer_before['html']),
        'colophon'           => $markup,
        'footer_after_html'  => $ctx['html']($footer_after['html']),
    );
}

/** template-parts/offer-banner.php (global $post is the footer's current post). */
function tefl_native_chrome_offer_banner($ctx, $v, $post_id) {
    $current_post_id    = $post_id;
    $hide_header_banner = get_field('hide_header_banner', 'option');
    $expiry_date        = get_field('timer_expiry', 'option');
    $current_date       = current_time('Y-m-d H:i:s');
    $timer_active       = strtotime($current_date) < strtotime((string) $expiry_date);
    $header_banner      = get_field('banner', 'option');
    $banner_shown       = false;
    $blog_page_id       = (int) get_option('page_for_posts') ?: 122;
    $content_icon       = null; // leaks into the promo banner below, as in the template

    $banners = array();
    foreach ((array) $header_banner as $hb) {
        $content_icon          = $hb['content_icon'] ?? null;
        $banner_styling        = $hb['banner_styling'] ?? array();
        $where_to_show         = !empty($hb['where_to_show']) ? $hb['where_to_show'] : array();
        $show_clockdown_option = $hb['show_clockdown'] ?? false;
        $banner_btn            = $hb['button'] ?? array();
        $banner_btn_styling    = $hb['button_styling'] ?? array();
        $timer_active_banner   = $show_clockdown_option && $timer_active;
        $clock_with_offer_text = $hb['clock_with_offer_text'] ?? false;
        $show_on_page          = in_array($current_post_id, (array) $where_to_show);
        $show_on_blog          = is_singular('post') && in_array($blog_page_id, (array) $where_to_show);
        if (($show_on_page || $show_on_blog) && !$hide_header_banner) {
            $banner_shown = true;
            $flip         = ($clock_with_offer_text || $timer_active_banner) ? tefl_native_chrome_flip($ctx, (string) $expiry_date) : '';
            $banners[]    = array(
                'test'            => tefl_native_chrome_str($timer_active_banner),
                'thickness'       => $v['t']($banner_styling['banner_border_thickness'] ?? '1'),
                'border_color'    => $v['t']($banner_styling['banner_border_color'] ?? '#1c1c1b'),
                'bg'              => $v['t']($banner_styling['banner_background_color'] ?? ''),
                'clock_bubble'    => (bool) $clock_with_offer_text,
                'clock_text_html' => $clock_with_offer_text ? $v['h']($hb['clock_offer_text'] ?? '') : '',
                'flip_html'       => $flip,
                'timer_active'    => (bool) $timer_active_banner,
                'logo_link'       => $v['u']($hb['banner_logo_link'] ?? ''),
                'logo'            => $v['t']($hb['banner_logo'] ?? ''),
                'content_icon'    => !empty($content_icon) ? $v['t']($content_icon) : '',
                'text_color'      => $v['t']($banner_styling['banner_text_color'] ?? ''),
                'font_size'       => $v['t']($banner_styling['banner_text_font_size'] ?? ''),
                'text_html'       => $v['h'](geo_replace_currency_default((string) ($hb['content'] ?? ''))),
                'mobile_html'     => $v['h'](geo_replace_currency_default((string) ($hb['mobile_content'] ?? ''))),
                'show_button'     => (bool) ($hb['show_button'] ?? false),
                'btn_bg'          => $v['t']($banner_btn_styling['button_background_color'] ?? ''),
                'btn_color'       => $v['t']($banner_btn_styling['button_text_color'] ?? ''),
                'btn_size'        => $v['t']($banner_btn_styling['button_text_font_size'] ?? ''),
                'btn_link'        => $v['u']($banner_btn['link'] ?? ''),
                'btn_text_html'   => $v['h']($banner_btn['text'] ?? ''),
            );
        }
    }

    $promo_out           = null;
    $promo               = get_field('page_promo_banner', 'option');
    $promo_where_to_show = !empty($promo['where_to_show']) ? $promo['where_to_show'] : array();
    $promo_show_on_page  = in_array($current_post_id, (array) $promo_where_to_show);
    $promo_show_on_blog  = is_singular('post') && in_array($blog_page_id, (array) $promo_where_to_show);
    if ($promo && !$hide_header_banner && !$banner_shown && ($promo_show_on_page || $promo_show_on_blog)) {
        $promo_style     = $promo['banner_styling'] ?? array();
        $promo_btn       = $promo['button'] ?? array();
        $promo_btn_style = $promo['button_styling'] ?? array();
        $promo_out       = array(
            'thickness'     => $v['t']($promo_style['banner_border_thickness'] ?? '1'),
            'border_color'  => $v['t']($promo_style['banner_border_color'] ?? '#1c1c1b'),
            'bg'            => $v['t']($promo_style['banner_background_color'] ?? ''),
            // The template tests the promo's icon but prints the banner loop's leftover $content_icon.
            'icon'          => !empty($promo['content_icon']) ? $v['t']($content_icon) : null,
            'text_color'    => $v['t']($promo_style['banner_text_color'] ?? ''),
            'font_size'     => $v['t']($promo_style['banner_text_font_size'] ?? ''),
            'content_html'  => $v['h'](geo_replace_currency_default((string) ($promo['content'] ?? ''))),
            'show_button'   => (bool) (($promo_btn['text'] ?? '') && ($promo_btn['link'] ?? '')),
            'btn_bg'        => $v['t']($promo_btn_style['button_background_color'] ?? ''),
            'btn_color'     => $v['t']($promo_btn_style['button_text_color'] ?? ''),
            'btn_size'      => $v['t']($promo_btn_style['button_text_font_size'] ?? ''),
            'btn_link'      => $v['u']($promo_btn['link'] ?? ''),
            'btn_text_html' => $v['h']($promo_btn['text'] ?? ''),
        );
    }
    return array('banners' => $banners, 'promo' => $promo_out);
}

/** astra_footer_markup(): <footer id="colophon">. */
function tefl_native_chrome_colophon($ctx, $v) {
    $attrs = tefl_native_chrome_attrs(astra_attr('footer', array(
        'id'    => 'colophon',
        'class' => join(' ', astra_get_footer_classes()),
    )));
    tefl_native_chrome_hook('astra_footer_content_top');
    $out = array('attrs' => $attrs, 'adv' => null, 'small' => null);
    tefl_native_chrome_hook('astra_footer_content', array(
        'astra_advanced_footer_markup'       => function () use ($ctx, &$out) {
            $out['adv'] = tefl_native_chrome_adv_footer($ctx);
            return true;
        },
        'astra_footer_small_footer_template' => function () use ($ctx, &$out) {
            $out['small'] = tefl_native_chrome_small_footer($ctx);
            return true;
        },
    ));
    tefl_native_chrome_hook('astra_footer_content_bottom');
    return $out;
}

/** astra_advanced_footer_markup() → the child theme's template-parts/advanced-footer/layout-4.php. */
function tefl_native_chrome_adv_footer($ctx) {
    $advanced_footer_layout = astra_get_option('footer-adv');
    $advanced_footer_meta   = astra_get_option_meta('footer-adv-display');
    if (apply_filters('astra_advanced_footer_disable', false) || 'layout-4' !== $advanced_footer_layout || 'disabled' == $advanced_footer_meta) {
        return null;
    }
    $file = wp_normalize_path((string) locate_template('template-parts/advanced-footer/layout-4.php'));
    if (strpos($file, wp_normalize_path(get_stylesheet_directory()) . '/') !== 0 || !tefl_native_chrome_is_child_fn('astra_get_footer_widget')) {
        throw new Tefl_Native_Chrome_Bail('advanced footer not the child theme\'s layout');
    }
    if (!is_user_logged_in()) {
        if (!is_active_sidebar('advanced-footer-widget-1') && !is_active_sidebar('advanced-footer-widget-2') && !is_active_sidebar('advanced-footer-widget-3')
            && !is_active_sidebar('advanced-footer-widget-4') && !is_active_sidebar('advanced-footer-widget-5')) {
            return null;
        }
    }
    $widgets = array();
    foreach (array(1, 3, 4, 2) as $n) { // the layout's column order
        $sid       = 'advanced-footer-widget-' . $n;
        $widgets[] = array(
            'n'     => $n,
            'attrs' => tefl_native_chrome_attrs(wp_kses_post(apply_filters('astra_sidebar_data_attrs', '', $sid))),
            'html'  => $ctx['html']($ctx['block'](tefl_native_chrome_capture('astra_get_footer_widget', array($sid)))),
        );
    }
    return array('widgets' => $widgets, 'home' => $ctx['href']('/'));
}

/** astra_footer_small_footer_template() with Astra's footer-sml-layout-2.php. */
function tefl_native_chrome_small_footer($ctx) {
    $small_footer_layout = astra_get_option_meta('footer-sml-layout', 'footer-sml-layout-2');
    $small_footer_layout = apply_filters('astra_footer_sml_layout', $small_footer_layout);
    if ('disabled' == $small_footer_layout) {
        return null;
    }
    $file = wp_normalize_path((string) locate_template('template-parts/footer/footer-sml-layout-2.php'));
    if ('footer-sml-layout-2' !== $small_footer_layout || strpos($file, wp_normalize_path(get_template_directory()) . '/') !== 0
        || !tefl_native_chrome_is_child_fn('astra_get_small_footer')) {
        throw new Tefl_Native_Chrome_Bail('small footer not the known layout');
    }

    $s1       = astra_get_small_footer('footer-sml-section-1');
    $s2       = astra_get_small_footer('footer-sml-section-2');
    $sections = 0;
    if ('' != $s1) {
        $sections++;
    }
    if ('' != $s2) {
        $sections++;
    }
    $class = 2 == $sections
        ? 'ast-small-footer-section-equally ' . astra_attr('ast-grid-col-6')
        : 'ast-small-footer-section-equally ' . astra_attr('ast-grid-common-col');
    return array(
        'section_class' => tefl_native_txt(esc_attr($class)),
        's1_html'       => $s1 ? $ctx['html']($ctx['block']((string) $s1)) : null,
        's2_html'       => $s2 ? $ctx['html']($ctx['block']((string) $s2)) : null,
    );
}

/* ------------------------------------------------------------------ *
 * After #page: astra_body_bottom, footer-legal-holder, the sticky offer CTA
 * (after wp_footer) and ti_footer_course_banner (on wp_footer).
 * ------------------------------------------------------------------ */

function tefl_native_chrome_after_page($ctx, $v, $post_id) {
    $body_bottom = tefl_native_chrome_hook('astra_body_bottom', array(), false);

    $sticky           = null;
    $sticky_offer_cta = get_field('sticky_offer_cta', 'option');
    $show_cta         = $sticky_offer_cta['show_cta'] ?? false;
    $where_to_show    = $sticky_offer_cta['where_to_show'] ?? array();
    if ($show_cta && in_array($post_id, (array) $where_to_show)) {
        $sticky = tefl_native_chrome_sticky($ctx, $v, $sticky_offer_cta, $post_id);
    }

    return array(
        'body_bottom_html' => $ctx['html']($body_bottom['html']),
        'legal_img'        => 'https://teflinstitute.com/wp-content/uploads/2021/01/teflinstitute.jpg',
        'sticky'           => $sticky,
        'course_banner'    => tefl_native_chrome_course_banner($ctx, $v, $post_id),
    );
}

/** template-parts/sticky-offer-cta.php. */
function tefl_native_chrome_sticky($ctx, $v, $d, $post_id) {
    $offer_product_id = $d['offer_product'] ?? null;
    $sale_price       = 25;
    if ($offer_product_id) {
        $obj = wc_get_product($offer_product_id);
        if ($obj) {
            $regular_price = $obj->get_regular_price();
            if (!empty($regular_price) && $regular_price > $sale_price) {
                $price = sprintf('<del aria-hidden="true">%1$s</del> <ins>%2$s</ins>', wc_price($regular_price), wc_price($sale_price));
            } else {
                $price = wc_price($sale_price);
            }
        } else {
            $price = wc_price($sale_price);
        }
    } else {
        $price = wc_price($sale_price);
    }
    $expiry_date = get_field('timer_expiry', 'option');
    $show_clock  = current_time('timestamp') < strtotime((string) $expiry_date);
    $is_47       = $post_id === 47;
    return array(
        'subtitle_html' => $v['h']($d['cta_subtitle'] ?? ''),
        'title_html'    => $v['h']($d['cta_title'] ?? ''),
        'price_html'    => $v['h']($price),
        'summary_html'  => $v['h']($d['cta_summary'] ?? ''),
        'flip_html'     => $show_clock ? tefl_native_chrome_flip($ctx) : null,
        'enrol'         => $is_47 ? $v['u']('https://teflinstitute.com/?addtimetocart&prid=430') : null,
        'btn_link'      => $v['u']($d['cta_button_link'] ?? ''),
        'btn_text_html' => $v['h']($d['cta_button_text'] ?? ''),
        'icon'          => 'https://teflinstitute.com/wp-content/uploads/2025/04/IELTS-Educator-logo.png',
    );
}

/**
 * ti_footer_course_banner() (wp_footer, priority 10) for an anonymous visitor:
 * the course_id cookie is never set on a cached request, so off the front page
 * and course pages only the footer promo banner can print (never the cookie's
 * "course you looked at" banner).
 */
function tefl_native_chrome_course_banner($ctx, $v, $post_id) {
    if (!function_exists('ti_footer_course_banner') || get_field('hide_footer_banner', 'option') == 1) {
        return null;
    }
    if (is_front_page() || is_singular('course')) {
        $expiry_date = get_field('timer_expiry', 'option');
        $b           = get_field('footer_offer_banner', 'option');
        $show_clock  = $b['show_clockdown'] ?? false;
        $show_btn    = $b['show_banner_button'] ?? false;
        $st          = $b['banner_styling'] ?? array();
        if ($show_btn && $show_clock) {
            $content_class = 'ast-col-md-6';
        } elseif (!$show_btn && !$show_clock) {
            $content_class = 'ast-col-md-12';
        } else {
            $content_class = 'ast-col-md-9';
        }
        return array(
            'kind'          => 'offer',
            'bg'            => $v['t']($st['banner_background_color'] ?? ''),
            'content_class' => $content_class,
            'clock'         => (!empty($show_clock) && $show_clock) ? tefl_native_chrome_clock($expiry_date) : null,
            'text_color'    => $v['t']($st['banner_text_color'] ?? ''),
            'font_size'     => $v['t']($st['banner_text_font_size'] ?? ''),
            'text_html'     => $v['h']($b['banner_text'] ?? ''),
            'show_button'   => !empty($show_btn) && $show_btn,
            'btn_bg'        => $v['t']($st['banner_button_background_color'] ?? ''),
            'btn_color'     => $v['t']($st['banner_button_text_color'] ?? ''),
            'btn_size'      => $v['t']($st['banner_button_text_font_size'] ?? ''),
            'btn_link'      => $v['u']($b['banner_button']['button_link'] ?? ''),
            'btn_text_html' => $v['h']($b['banner_button']['button_text'] ?? ''),
        );
    }
    // Elsewhere only the footer promo banner can print, and it never closes its outer
    // <div> (the browser nests what follows inside it) — not a tree React can build,
    // so it stays WordPress HTML.
    return null;
}
