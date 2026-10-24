<?php
/**
 * Plugin Name: TEFL Institute — Next ISR revalidate
 * Description: Pings the Next.js /api/revalidate endpoint when content changes so only the affected pages refresh (on-demand ISR) — in every geo folder (/, /gb/, /za/, /nl/, /ca/, /it/, /fr/).
 * Version: 1.0.0
 *
 * Next tags every rendered page fetch with:
 *   p:<path>   the exact front path, e.g. p:/course/x/ and p:/gb/course/x/
 *   pages      every rendered page (header/footer/menus/options live in all of them)
 *   listing    pages that list other content (home, /blog/, archives, overviews)
 *
 * A post save fires its p: tags across all geo folders (+ the old path when the
 * slug changed) and `listing`. Menus, ACF options, the Customizer and a
 * WP Fastest Cache "delete all" fire `pages`.
 *
 * Tags are batched and sent ONCE per request at shutdown, after the response
 * has gone to the editor and after WP Fastest Cache has cleared its files — so
 * the Next refetch (on the next visitor request) loopback-renders fresh HTML.
 *
 * Setup — wp-config.php (environment config, not code):
 *   define( 'TEFL_ISR_BASE_URL', 'https://<next-host>' );   // no trailing slash
 *   define( 'TEFL_ISR_SECRET',   '<matches ISRSECRET in the Next host env>' );
 * Without both constants the plugin is inert.
 *
 * WP-CLI:  wp tefl isr <tag>[,<tag>…]   e.g. `wp tefl isr pages`
 */

if (!defined('ABSPATH')) {
    exit;
}

function tefl_isr_configured() {
    return defined('TEFL_ISR_BASE_URL') && TEFL_ISR_BASE_URL && defined('TEFL_ISR_SECRET') && TEFL_ISR_SECRET;
}

/** Post types whose saves change front pages. An allowlist on purpose: orders must never fire. */
function tefl_isr_post_types() {
    return apply_filters('tefl_isr_post_types', array(
        'page', 'post', 'course', 'internship', 'teach_english_abroad', 'support_centre',
        'placement', 'guide', 'webinar', 'faqs', 'screening_form', 'alerts', 'course_location',
    ));
}

function tefl_isr_countries() {
    return defined('TRANSLATED_COUNTRIES') && is_array(TRANSLATED_COUNTRIES)
        ? TRANSLATED_COUNTRIES
        : array('gb', 'za', 'nl', 'ca', 'it', 'fr');
}

/** p: tags for a front path in every geo folder. */
function tefl_isr_path_tags($path) {
    $path = '/' . trim((string) $path, '/') . '/';
    if ($path === '//') {
        $path = '/';
    }
    $tags = array('p:' . $path);
    foreach (tefl_isr_countries() as $cc) {
        $tags[] = 'p:/' . $cc . $path;
    }
    return $tags;
}

/** Path of a post's permalink without the host or any geo folder. */
function tefl_isr_post_path($post) {
    $url = get_permalink($post);
    if (!$url) {
        return '';
    }
    $path = (string) wp_parse_url($url, PHP_URL_PATH);
    foreach (tefl_isr_countries() as $cc) {
        if (strpos($path, '/' . $cc . '/') === 0) {
            $path = substr($path, strlen($cc) + 1);
            break;
        }
    }
    return $path === '' ? '/' : $path;
}

/** Queue tags; one batched request goes out at shutdown. */
function tefl_isr_queue(array $tags) {
    static $hooked = false;
    $GLOBALS['tefl_isr_tags'] = array_merge(isset($GLOBALS['tefl_isr_tags']) ? $GLOBALS['tefl_isr_tags'] : array(), $tags);
    if ($hooked || !tefl_isr_configured()) {
        return;
    }
    $hooked = true;
    add_action('shutdown', 'tefl_isr_flush', PHP_INT_MAX - 5);
}

function tefl_isr_flush() {
    $tags = array_values(array_unique(array_filter(isset($GLOBALS['tefl_isr_tags']) ? $GLOBALS['tefl_isr_tags'] : array())));
    $GLOBALS['tefl_isr_tags'] = array();
    if (!$tags) {
        return;
    }
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    }
    ignore_user_abort(true);
    tefl_isr_send($tags);
}

/** POST the tags to Next. Returns [bool ok, string message]. */
function tefl_isr_send(array $tags) {
    if (!tefl_isr_configured()) {
        return array(false, 'TEFL_ISR_BASE_URL / TEFL_ISR_SECRET not defined');
    }
    $url = rtrim(TEFL_ISR_BASE_URL, '/') . '/api/revalidate/';
    $res = wp_remote_post($url, array(
        'timeout'    => 10,
        // Browser-like UA: the Next host may sit behind Cloudflare, which 403s WP's default UA.
        'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        'headers'    => array('Content-Type' => 'application/json', 'X-Revalidate-Secret' => TEFL_ISR_SECRET),
        'body'       => wp_json_encode(array('tags' => $tags)),
    ));
    if (is_wp_error($res)) {
        error_log('[tefl-isr] revalidate failed: ' . $res->get_error_message());
        return array(false, $res->get_error_message());
    }
    $code = (int) wp_remote_retrieve_response_code($res);
    $msg  = 'HTTP ' . $code . ' ' . implode(',', array_slice($tags, 0, 20)) . (count($tags) > 20 ? '…' : '');
    update_option('tefl_isr_last', $msg . ' @ ' . gmdate('c'), false);
    if ($code !== 200) {
        error_log('[tefl-isr] ' . $msg);
    }
    return array($code === 200, $msg);
}

/* ---- Content ---------------------------------------------------------- */

add_action('save_post', function ($post_id, $post) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id) || !is_object($post)) {
        return;
    }
    if (!in_array($post->post_type, tefl_isr_post_types(), true)) {
        return;
    }
    // Publish/update refreshes the page; un-publishing refreshes it too (→ 404).
    $tags = array('listing');
    $path = tefl_isr_post_path($post_id);
    if ($path !== '' && strpos($path, '?') === false) {
        $tags = array_merge($tags, tefl_isr_path_tags($path));
    }
    tefl_isr_queue($tags);
}, 30, 2);

// Slug / parent change: the OLD path must refresh too (it now redirects or 404s).
add_action('post_updated', function ($post_id, $after, $before) {
    if (!is_object($before) || !in_array($before->post_type, tefl_isr_post_types(), true)) {
        return;
    }
    if ($before->post_name === $after->post_name && (int) $before->post_parent === (int) $after->post_parent) {
        return;
    }
    $old = tefl_isr_post_path($before);
    if ($old !== '' && strpos($old, '?') === false) {
        tefl_isr_queue(tefl_isr_path_tags($old));
    }
}, 30, 3);

add_action('before_delete_post', function ($post_id) {
    $post = get_post($post_id);
    if ($post && in_array($post->post_type, tefl_isr_post_types(), true)) {
        tefl_isr_queue(array_merge(array('listing'), tefl_isr_path_tags(tefl_isr_post_path($post))));
    }
});

/* ---- Site-wide chrome (header, footer, menus, options) ----------------- */

add_action('wp_update_nav_menu', function () {
    tefl_isr_queue(array('pages'));
});
add_action('acf/save_post', function ($post_id) {
    if (is_string($post_id) && strpos($post_id, 'option') === 0) {
        tefl_isr_queue(array('pages'));
    }
}, 30);
add_action('customize_save_after', function () {
    tefl_isr_queue(array('pages'));
});
add_action('update_option_sidebars_widgets', function () {
    tefl_isr_queue(array('pages'));
});
// WP Fastest Cache "Delete Cache" — the editor's explicit "refresh everything" button.
add_action('wpfc_delete_cache', function () {
    tefl_isr_queue(array('pages'));
});

if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('tefl isr', function ($args) {
        $tags = array_filter(array_map('trim', explode(',', isset($args[0]) ? $args[0] : 'pages')));
        list($ok, $msg) = tefl_isr_send($tags);
        $ok ? WP_CLI::success($msg) : WP_CLI::error($msg);
    });
}
