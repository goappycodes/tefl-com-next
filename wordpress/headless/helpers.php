<?php
/**
 * Shared helpers for the headless layer.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Origins allowed to call this WordPress from the browser (CORS). Defaults to
 * the production domain, its www twin, the Next staging host and Vercel
 * previews. Extend with the `tefl_headless_allowed_origins` filter or a
 * comma-separated `TEFL_HEADLESS_ORIGINS` constant in wp-config.php.
 *
 * @return string[] exact origins; entries starting with "*." match a host suffix
 */
function tefl_headless_allowed_origins() {
    $origins = array(
        'https://teflinstitute.com',
        'https://www.teflinstitute.com',
        'https://next.teflinstitute.com',
        '*.vercel.app',
        'http://localhost:3000',
    );
    if (defined('TEFL_HEADLESS_ORIGINS') && TEFL_HEADLESS_ORIGINS) {
        $origins = array_merge($origins, array_map('trim', explode(',', TEFL_HEADLESS_ORIGINS)));
    }
    return apply_filters('tefl_headless_allowed_origins', array_values(array_unique($origins)));
}

/** True when $origin (e.g. https://next.teflinstitute.com) is on the allow-list. */
function tefl_headless_origin_allowed($origin) {
    if (!$origin) {
        return false;
    }
    $host = (string) wp_parse_url($origin, PHP_URL_HOST);
    foreach (tefl_headless_allowed_origins() as $allowed) {
        if ($allowed === $origin) {
            return true;
        }
        if (strpos($allowed, '*.') === 0 && $host !== '' && substr($host, -strlen($allowed) + 1) === substr($allowed, 1)) {
            return true;
        }
    }
    return false;
}

/**
 * Remove the stray leading whitespace some plugin emits before REST bodies, so
 * our JSON starts at byte 0. Only clears a buffer that is PURE whitespace.
 */
function tefl_headless_strip_leading_whitespace() {
    if (ob_get_level() > 0) {
        $content = ob_get_contents();
        if ($content !== false && $content !== '' && trim($content) === '') {
            ob_clean();
        }
    }
}

/**
 * JSON response for our routes. Public, read-only data, so `*` is fine here;
 * the browser-facing CORS for admin-ajax etc. is handled in cors.php.
 *
 * @param mixed $data
 * @param int   $status
 * @return WP_REST_Response
 */
function tefl_headless_response($data, $status = 200) {
    $response = new WP_REST_Response($data, $status);
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Cache-Control', 'no-store, private');
    return $response;
}

/** Geo folders the site serves (wp-config's TRANSLATED_COUNTRIES), e.g. gb, za, nl, ca, it, fr. */
function tefl_headless_countries() {
    return defined('TRANSLATED_COUNTRIES') && is_array(TRANSLATED_COUNTRIES)
        ? array_values(TRANSLATED_COUNTRIES)
        : array('gb', 'za', 'nl', 'ca', 'it', 'fr');
}

/**
 * Hosts that count as "this site" when relativising links: the public front
 * domain(s) plus the WordPress host itself. Post-cutover WordPress lives on its
 * own subdomain, but post content still hardcodes the front domain.
 *
 * @return string[] lower-case hosts
 */
function tefl_headless_site_hosts() {
    $hosts = array('teflinstitute.com', 'www.teflinstitute.com');
    $wp    = strtolower((string) wp_parse_url(home_url(), PHP_URL_HOST));
    if ($wp) {
        $hosts[] = $wp;
    }
    if (defined('TEFL_FRONT_HOSTS') && TEFL_FRONT_HOSTS) {
        $hosts = array_merge($hosts, array_map('trim', explode(',', strtolower(TEFL_FRONT_HOSTS))));
    }
    return array_values(array_unique(array_filter($hosts)));
}

/** scheme://host of WordPress itself (no geo folder, no trailing slash). */
function tefl_headless_wp_origin() {
    $parts = wp_parse_url(home_url());
    $scheme = isset($parts['scheme']) ? $parts['scheme'] : 'https';
    $host   = isset($parts['host']) ? $parts['host'] : 'teflinstitute.com';
    return $scheme . '://' . $host . (isset($parts['port']) ? ':' . $parts['port'] : '');
}

/**
 * Paths that belong to WordPress (commerce, account, admin, feeds, assets).
 * Links to these stay absolute on the WP origin — that's the hand-over point:
 * once the visitor reaches the cart, WordPress takes over.
 *
 * Matched against a path with any geo folder prefix already stripped.
 */
function tefl_headless_wp_owned_path_regex() {
    return apply_filters(
        'tefl_headless_wp_owned_path_regex',
        '#^/(cart|checkout|basket|my-account|user-account|product|product-category|shop|wp-admin|wp-content|wp-includes|wp-json|wp-login\.php|xmlrpc\.php|feed|comments|affiliate-area|affiliate-login|affiliate-registration|lms-sso|sso|order-received|order-pay|sitemap[^/]*\.xml|[a-z_-]+-sitemap\d*\.xml)(/|$|\?|\.)#i'
    );
}

/** Strip a leading geo folder: "/gb/course/x/" → ["gb", "/course/x/"]. */
function tefl_headless_split_country($path) {
    foreach (tefl_headless_countries() as $cc) {
        if ($path === '/' . $cc || $path === '/' . $cc . '/') {
            return array($cc, '/');
        }
        if (strpos($path, '/' . $cc . '/') === 0) {
            return array($cc, substr($path, strlen($cc) + 1));
        }
    }
    return array('us', $path);
}

/**
 * Validate + normalise a requested front path. Returns '' when unsafe.
 * Keeps any query string (e.g. pagination ?page=2) intact.
 */
function tefl_headless_normalise_path($raw) {
    $raw = trim((string) $raw);
    if ($raw === '') {
        return '/';
    }
    // Absolute URLs on our own hosts are accepted and reduced to their path.
    if (preg_match('#^https?://#i', $raw)) {
        $host = strtolower((string) wp_parse_url($raw, PHP_URL_HOST));
        if (!in_array($host, tefl_headless_site_hosts(), true)) {
            return '';
        }
        $q   = wp_parse_url($raw, PHP_URL_QUERY);
        $raw = (string) wp_parse_url($raw, PHP_URL_PATH) . ($q ? '?' . $q : '');
    }
    if ($raw[0] !== '/') {
        $raw = '/' . $raw;
    }
    if (strpos($raw, '..') !== false || strpos($raw, '//') === 0 || preg_match('#[\s<>"\\\\]#', $raw)) {
        return '';
    }
    return $raw;
}

/**
 * GET a front URL from this same server, bypassing Cloudflare: the host
 * resolves to 127.0.0.1 so nginx (and WP Fastest Cache) answer directly.
 *
 * @return array{code:int, body:string, location:string}|WP_Error
 */
function tefl_headless_loopback($path) {
    $origin = tefl_headless_wp_origin();
    $host   = (string) wp_parse_url($origin, PHP_URL_HOST);
    $scheme = (string) wp_parse_url($origin, PHP_URL_SCHEME);
    $port   = $scheme === 'http' ? 80 : 443;
    $ip     = defined('TEFL_LOOPBACK_IP') ? TEFL_LOOPBACK_IP : '127.0.0.1';

    $resolver = function ($handle) use ($host, $port, $ip) {
        curl_setopt($handle, CURLOPT_RESOLVE, array($host . ':' . $port . ':' . $ip));
    };
    add_action('http_api_curl', $resolver, 10, 1);
    $resp = wp_remote_get($origin . $path, array(
        'sslverify'   => false,
        'timeout'     => 25,
        'redirection' => 0,
        'headers'     => array(
            'X-Tefl-Loopback' => '1',
            'User-Agent'      => 'tefl-headless-render',
            'Accept'          => 'text/html',
        ),
    ));
    remove_action('http_api_curl', $resolver, 10);

    if (is_wp_error($resp)) {
        return $resp;
    }
    return array(
        'code'     => (int) wp_remote_retrieve_response_code($resp),
        'body'     => (string) wp_remote_retrieve_body($resp),
        'location' => (string) wp_remote_retrieve_header($resp, 'location'),
    );
}
