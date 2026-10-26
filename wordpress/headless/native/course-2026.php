<?php
/**
 * Native template: course page, 2026 design (course-page-2026.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/course-2026&path=/<cc>/course/<slug>/&id=123
 *
 * course-page-2026.php replaces single-course.php (template_include filter in
 * includes/course-2026.php) on courses with ACF c26_enabled. This resolves
 * every value the template prints — ACF fields, the schools add-on read from
 * the TEFL for Schools page, the price quote (ti_c26_quote(), geo-dependent),
 * the FAQ rows for the server's geo country (ti_c26_faq_rows()) — and the
 * Next template (components/courses/c26/Course2026.tsx) reproduces the markup.
 * The theme's course-2026.js (`ti-c26`) still drives prices, add-ons, enrol,
 * the countdown, the students scroller and the video modal.
 *
 * Text the template prints through esc_html()/esc_attr() is escaped exactly as
 * PHP does, then decoded, so React re-encodes the same characters.
 *
 * 404 (→ passthrough) when the post isn't a 2026 course page.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('course-2026', 'tefl_native_course_2026');

function tefl_native_course_2026($pid, $ctx) {
    $pid = (int) $pid;
    if (!in_array(get_post_type($pid), array('course', 'course_location'), true)) {
        return null;
    }
    foreach (array('ti_c26_is_active', 'ti_c26_quote', 'ti_c26_countdown_end', 'ti_c26_products_for', 'ti_c26_faq_rows', 'ti_c26_site_logo_img', 'get_field', 'wc_get_checkout_url') as $fn) {
        if (!function_exists($fn)) {
            return null;
        }
    }
    if (!ti_c26_is_active($pid)) {
        return null;
    }
    try {
        return tefl_native_course_2026_data($pid, $ctx);
    } catch (Throwable $e) {
        return null; // anything unexpected → passthrough
    }
}

/** esc_html()'d text, decoded for React. */
function tefl_native_course_2026_e($s) {
    return tefl_native_txt(esc_html((string) $s));
}

/** esc_attr()'d text, decoded for React. */
function tefl_native_course_2026_a($s) {
    return tefl_native_txt(esc_attr((string) $s));
}

/** esc_url()'d link, decoded and rewritten like the render does. */
function tefl_native_course_2026_u($ctx, $url) {
    return call_user_func($ctx['href'], tefl_native_txt(esc_url((string) $url)));
}

/** HTML fragment with the cookie blocker and the render's rewrites. */
function tefl_native_course_2026_h($ctx, $html) {
    $html = (string) $html;
    return $html === '' ? '' : call_user_func($ctx['html'], call_user_func($ctx['block'], $html));
}

/** ti_c26_link() as data: null when the link is empty (the template prints ''). */
function tefl_native_course_2026_link($ctx, $link) {
    if (empty($link['url'])) {
        return null;
    }
    return array(
        'href'   => tefl_native_course_2026_u($ctx, $link['url']),
        'target' => !empty($link['target']) ? tefl_native_course_2026_a($link['target']) : '',
        'title'  => tefl_native_course_2026_e(!empty($link['title']) ? $link['title'] : $link['url']),
    );
}

/**
 * An <img> WordPress printed (wp_get_attachment_image()), as its attributes in
 * order, after the render's rewrites — for images that sit next to sibling
 * elements. null for ''. Throws if it isn't a single <img> (→ passthrough).
 */
function tefl_native_course_2026_img_attrs($ctx, $html) {
    $html = tefl_native_course_2026_h($ctx, $html);
    if (trim($html) === '') {
        return null;
    }
    if (!preg_match('#^\s*<img\s+(.*?)\s*/?>\s*$#s', $html, $m)) {
        throw new RuntimeException('not a single img');
    }
    $attrs = array();
    preg_match_all('#([^\s=/"\']+)(?:\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s"\'>]+)))?#s', $m[1], $all, PREG_SET_ORDER);
    foreach ($all as $a) {
        $val = isset($a[4]) && $a[4] !== '' ? $a[4] : (isset($a[3]) && $a[3] !== '' ? $a[3] : (isset($a[2]) ? $a[2] : ''));
        $attrs[] = array(strtolower($a[1]), tefl_native_txt($val));
    }
    return $attrs;
}

/**
 * Capture a CF7 shortcode as it renders on the page: outside the loop (the
 * template never starts one, so `_wpcf7_container_post` is 0), CF7's form
 * counter advanced past the form rendered before the content on every page
 * (live shows this form as -o2), and the form action set to the page's own
 * path rather than the REST route.
 */
function tefl_native_course_2026_cf7($ctx, callable $fn, $forms_before = 1) {
    global $wp_query;
    $saved_loop = $wp_query ? $wp_query->in_the_loop : false;
    $action     = function ($url) use ($ctx) {
        $frag = strstr((string) $url, '#');
        return sanitize_url('/' . ltrim((string) strtok($ctx['path'], '?'), '/')) . ($frag === false ? '' : $frag);
    };
    add_filter('wpcf7_form_action_url', $action, 1);
    if ($wp_query) {
        $wp_query->in_the_loop = false;
    }
    static $advanced = 0;
    if (class_exists('WPCF7_ContactForm')) {
        try {
            $m = new ReflectionMethod('WPCF7_ContactForm', 'generate_unit_tag');
            $m->setAccessible(true);
            while ($advanced < $forms_before) {
                $m->invoke(null, 0);
                $advanced++;
            }
        } catch (Throwable $e) {
            // Unit tag then starts at -o1; cosmetic only.
        }
    }
    try {
        $html = tefl_native_capture($fn);
    } finally {
        remove_filter('wpcf7_form_action_url', $action, 1);
        if ($wp_query) {
            $wp_query->in_the_loop = $saved_loop;
        }
    }
    return tefl_native_course_2026_h($ctx, $html);
}

/** Every value course-page-2026.php renders. */
function tefl_native_course_2026_data($pid, $ctx) {
    $e = 'tefl_native_course_2026_e';
    $a = 'tefl_native_course_2026_a';
    $f = function ($name) use ($pid) {
        return get_field($name, $pid);
    };
    $link = function ($l) use ($ctx) {
        return tefl_native_course_2026_link($ctx, $l);
    };
    // The template's $img(): wp_get_attachment_image( $id, $size, false, [ class, loading lazy ] ).
    $img_raw = function ($id, $size = 'large', $class = '') {
        return $id ? wp_get_attachment_image($id, $size, false, array('class' => $class, 'loading' => 'lazy')) : '';
    };
    $img_html = function ($id, $size = 'large', $class = '') use ($ctx, $img_raw) {
        return tefl_native_course_2026_h($ctx, $img_raw($id, $size, $class));
    };

    $title = $f('c26_hero_title');
    $title = $title ? $title : get_the_title($pid);

    $quote    = ti_c26_quote($pid);
    $end_ms   = ti_c26_countdown_end($pid);
    $enrol_lb = $f('c26_enrol_label');
    $enrol_lb = $enrol_lb ? $enrol_lb : 'Enrol now';
    list($main_product_id) = ti_c26_products_for($pid);
    $fallback_cart_url = $main_product_id ? add_query_arg('add-to-cart', $main_product_id, wc_get_checkout_url()) : '#';

    $out = array(
        'id'       => $pid,
        'title'    => $e($title),
        'page_title' => $e(get_the_title($pid)),
        'enrol'    => $e($enrol_lb),
        'cart_url' => tefl_native_course_2026_u($ctx, $fallback_cart_url),
        'home_url' => tefl_native_course_2026_u($ctx, home_url('/')),
        'courses_url' => tefl_native_course_2026_u($ctx, home_url('/tefl-courses-overview/')),
    );

    /* ---- Main-column sections (order and nav labels as the template builds $sections) ---- */
    $nav = array();

    // Overview
    $body  = $f('c26_overview_body');
    $stats = $f('c26_stats');
    $out['overview'] = null;
    if ($body || $stats) {
        $rows = array();
        if ($stats) {
            foreach (array_values($stats) as $s) {
                $rows[] = array('value' => $e($s['value'] ?? ''), 'label' => $e($s['label'] ?? ''));
            }
        }
        $out['overview'] = array(
            'heading' => $e($f('c26_overview_heading')),
            'body'    => tefl_native_course_2026_h($ctx, wp_kses_post((string) $body)),
            'stats'   => $rows,
        );
        $nav[] = array('overview', 'Overview');
    }

    // What you get
    $included = $f('c26_included');
    $out['included'] = null;
    if ($included) {
        $items = array();
        foreach ($included as $o) {
            $items[] = array(
                'icon'  => $o['icon'] ? (string) $o['icon'] : 'check',
                'title' => $e($o['title'] ?? ''),
                'text'  => $e($o['text'] ?? ''),
            );
        }
        $out['included'] = array(
            'kicker'  => $e($f('c26_included_kicker')),
            'heading' => $e($f('c26_included_heading')),
            'items'   => $items,
        );
        $nav[] = array('included', $e($f('c26_included_heading') ? $f('c26_included_heading') : 'What you get'));
    }

    // Who it is for
    $who    = $f('c26_who');
    $promos = $f('c26_promos');
    $out['who'] = null;
    if ($who || $promos) {
        $w_rows = array();
        foreach (($who ? $who : array()) as $w) {
            $w_rows[] = array('title' => $e($w['title'] ?? ''), 'text' => $e($w['text'] ?? ''));
        }
        $p_rows = array();
        foreach (($promos ? $promos : array()) as $p) {
            $p_rows[] = array(
                'style'  => $a($p['style'] ?? ''),
                'kicker' => $p['kicker'] ? $e($p['kicker']) : '',
                'title'  => $e($p['title'] ?? ''),
                'text'   => $e($p['text'] ?? ''),
                'link'   => $link($p['link'] ?? null),
            );
        }
        $out['who'] = array(
            'heading' => $e($f('c26_who_heading')),
            'who'     => $who ? $w_rows : null,
            'promos'  => $promos ? $p_rows : null,
        );
        $nav[] = array('who', 'Who it is for');
    }

    // Modules
    $modules = $f('c26_modules');
    $out['modules'] = null;
    if ($modules) {
        $m_rows = array();
        foreach ($modules as $i => $m) {
            $m_rows[] = array(
                'num'   => $e(str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT)),
                'open'  => 0 === $i,
                'title' => $e($m['title'] ?? ''),
                'text'  => $e($m['text'] ?? ''),
            );
        }
        $out['modules'] = array(
            'kicker'      => $e($f('c26_modules_kicker')),
            'heading'     => $e($f('c26_modules_heading')),
            'time_note'   => $f('c26_modules_time_note') ? $e($f('c26_modules_time_note')) : '',
            'access_note' => $f('c26_modules_access_note') ? $e($f('c26_modules_access_note')) : '',
            'foot'        => $f('c26_modules_footnote') ? $e($f('c26_modules_footnote')) : '',
            'items'       => $m_rows,
        );
        $nav[] = array('modules', 'Course outline');
    }

    // Certificate
    $cert_intro = $f('c26_cert_intro');
    $accs       = $f('c26_accreditations');
    $cert_img   = $f('c26_cert_image');
    $out['certificate'] = null;
    if ($cert_intro || $accs || $cert_img || $f('c26_cert_title')) {
        $acc_rows = array();
        foreach (($accs ? $accs : array()) as $ac) {
            $acc_rows[] = array(
                'logo'  => $ac['logo'] ? $img_html($ac['logo'], 'medium') : '',
                'badge' => (!$ac['logo'] && $ac['badge']) ? $e($ac['badge']) : '',
                'name'  => $e($ac['name'] ?? ''),
                'note'  => $e($ac['note'] ?? ''),
            );
        }
        $out['certificate'] = array(
            'heading'      => $e($f('c26_cert_heading')),
            'intro'        => $cert_intro ? $e($cert_intro) : '',
            'image'        => $cert_img ? $img_html($cert_img, 'large') : null,
            'logo'         => $cert_img ? '' : tefl_native_course_2026_h($ctx, ti_c26_site_logo_img()),
            'cert_title'   => $e($f('c26_cert_title')),
            'cert_footer'  => $e($f('c26_cert_footer')),
            'card_heading' => $e($f('c26_cert_card_heading')),
            'card_text'    => $e($f('c26_cert_card_text')),
            'sample'       => $link($f('c26_cert_sample')),
            'verify'       => $link($f('c26_cert_verify')),
            'accs'         => $accs ? $acc_rows : null,
        );
        $nav[] = array('certificate', 'Certificate');
    }

    // Resources (not in the nav)
    $guides = $f('c26_guides');
    $out['resources'] = null;
    if ($guides) {
        $g_rows = array();
        foreach ($guides as $g) {
            $href     = $g['file'] ? $g['file'] : $g['url'];
            $g_rows[] = array(
                'fit'      => $a($g['fit'] ? $g['fit'] : 'cover'),
                'image'    => $img_html($g['image'] ?? 0, 'medium_large'),
                'title'    => $e($g['title'] ?? ''),
                'text'     => $e($g['text'] ?? ''),
                'href'     => $href ? tefl_native_course_2026_u($ctx, $href) : '',
                'download' => (bool) $g['file'],
            );
        }
        $out['resources'] = array(
            'kicker'  => $e($f('c26_resources_kicker')),
            'heading' => $e($f('c26_resources_heading')),
            'guides'  => $g_rows,
        );
    }

    /* ---- Students, schools add-on, FAQs ---- */
    $videos = $f('c26_videos');
    $faqs   = ti_c26_faq_rows($pid);

    $tfs_src = (int) apply_filters('c26_schools_source_page', 110427);
    $tfs_get = function ($name, $default = '') use ($tfs_src) {
        $v = function_exists('tfs2_get') ? tfs2_get($name, $tfs_src) : get_field($name, $tfs_src);
        return (null === $v || false === $v || '' === $v) ? $default : $v;
    };
    $tfs_form   = (bool) get_post_meta($pid, 'c26_schools_form', true);
    $tfs_quotes = array();
    if (get_post_meta($pid, 'c26_schools_quotes', true)) {
        $own_quotes = $f('c26_testimonials');
        if (is_array($own_quotes) && $own_quotes) {
            $tfs_quotes = $own_quotes;
        } else {
            $tfs_quotes = function_exists('tfs2_rows') ? tfs2_rows('quotes', $tfs_src) : get_field('quotes', $tfs_src);
            $tfs_quotes = is_array($tfs_quotes) ? $tfs_quotes : array();
        }
    }
    $quotes_kicker  = $f('c26_testimonials_kicker');
    $quotes_heading = $f('c26_testimonials_heading');

    if ($videos) {
        $nav[] = array('students', 'Students');
    }
    if ($tfs_quotes) {
        $nav[] = array('reviews', 'Reviews');
    }
    if ($faqs) {
        $nav[] = array('faq', 'FAQs');
    }
    $out['nav'] = array();
    foreach ($nav as $n) {
        $out['nav'][] = array('id' => $a($n[0]), 'label' => is_string($n[1]) ? $n[1] : '');
    }

    /* ---- Hero ---- */
    $crumb = $f('c26_breadcrumb_parent');
    $out['crumb'] = !empty($crumb['url'])
        ? array('href' => tefl_native_course_2026_u($ctx, $crumb['url']), 'title' => $e($crumb['title'] ?? ''))
        : null;

    $badges = $f('c26_badges');
    $out['badges'] = array();
    foreach (($badges ? $badges : array()) as $b) {
        $out['badges'][] = array('style' => $a($b['style'] ?? ''), 'label' => $e($b['label'] ?? ''));
    }
    $out['intro'] = $f('c26_hero_intro') ? $e($f('c26_hero_intro')) : '';
    $points = $f('c26_hero_points');
    $out['points'] = array();
    foreach (($points ? $points : array()) as $pt) {
        $out['points'][] = $e($pt['text'] ?? '');
    }
    $out['secondary'] = ($modules && $f('c26_hero_secondary_label')) ? $e($f('c26_hero_secondary_label')) : '';
    $out['trust'] = array(
        'rating'       => $f('c26_trust_rating') ? $e($f('c26_trust_rating')) : '',
        'rating_label' => $e($f('c26_trust_rating_label')),
        'stat'         => $f('c26_trust_stat') ? $e($f('c26_trust_stat')) : '',
        'stat_label'   => $e($f('c26_trust_stat_label')),
    );

    if ($tfs_form) {
        $shortcode = $tfs_get('hero_form_shortcode', '[contact-form-7 id="04f1bda" title="TEFL for Schools"]');
        $out['form'] = array(
            'title' => $e($tfs_get('hero_form_title', 'Let\'s talk TEFL for your students')),
            'intro' => $e($tfs_get('hero_form_intro')),
            'cf7'   => tefl_native_course_2026_cf7($ctx, function () use ($shortcode) {
                echo do_shortcode(wp_kses_post($shortcode)); // phpcs:ignore
            }),
            'note'  => $e($tfs_get('hero_form_note')),
        );
        $out['hero_media'] = '';
    } else {
        $out['form'] = null;
        $hero_img = $f('c26_hero_image');
        $out['hero_media'] = tefl_native_course_2026_h(
            $ctx,
            $hero_img ? wp_get_attachment_image($hero_img, 'large', false, array('fetchpriority' => 'high', 'loading' => 'eager')) : get_the_post_thumbnail($pid, 'large')
        );
    }

    // Group bookings strip.
    $strip_text   = trim((string) get_post_meta($pid, 'c26_schools_strip', true));
    $out['strip'] = null;
    if ($strip_text) {
        $ql_strip   = $f('c26_quote_link');
        $strip_href = $tfs_form ? '#letsTalkTEFL' : (!empty($ql_strip['url']) ? $ql_strip['url'] : '');
        $out['strip'] = array(
            'text' => $e($strip_text),
            'href' => $strip_href ? tefl_native_course_2026_u($ctx, $strip_href) : '',
        );
    }

    /* ---- Price card ---- */
    if (!empty($quote['ok'])) {
        $addons = array();
        foreach ($quote['addons'] as $aid => $ad) {
            $addons[] = array(
                'id'    => $a($aid),
                'name'  => $e($ad['name']),
                'price' => $e($ad['price'] . ($ad['save'] ? ' · save ' . $ad['save'] : '')),
            );
        }
        $out['quote'] = array(
            'now'    => $e($quote['now']),
            'was'    => $e($quote['was']),
            'saving' => $e($quote['saving']),
            'total'  => $e($quote['total']),
            'addons' => $quote['addons'] ? $addons : null,
        );
    } else {
        $out['quote'] = null;
    }
    $out['price_kicker']  = $e($f('c26_price_kicker'));
    $out['addons_heading'] = $e($f('c26_addons_heading'));
    $out['price_note']    = $f('c26_price_note') ? $e($f('c26_price_note')) : '';
    $out['countdown']     = $end_ms ? $a($end_ms) : '';

    $ql = $f('c26_quote_link');
    $out['quote_box'] = null;
    if (!empty($ql['url'])) {
        $out['quote_box'] = array(
            'avatar'  => tefl_native_course_2026_img_attrs($ctx, $img_raw($f('c26_quote_avatar'), 'thumbnail', 'c26-avatar')),
            'heading' => $e($f('c26_quote_heading')),
            'link'    => $link($ql),
        );
    }

    /* ---- Students ---- */
    $out['students'] = null;
    if ($videos) {
        $v_rows = array();
        foreach ($videos as $i => $v) {
            $v_rows[] = array(
                'i'     => $a($i),
                'video' => $v['video'] ? tefl_native_course_2026_h($ctx, $v['video']) : '',
                'label' => $a('Play video: ' . $v['name']),
                'image' => tefl_native_course_2026_img_attrs($ctx, $img_raw($v['image'] ?? 0, 'medium_large')),
                'name'  => $e($v['name'] ?? ''),
            );
        }
        $out['students'] = array(
            'kicker'  => $e($f('c26_students_kicker')),
            'heading' => $e($f('c26_students_heading')),
            'videos'  => $v_rows,
        );
    }

    /* ---- Reviews (schools add-on) ---- */
    $out['reviews'] = null;
    if ($tfs_quotes) {
        $q_rows = array();
        foreach ($tfs_quotes as $q) {
            if (empty($q['quote'])) {
                continue;
            }
            $logo     = !empty($q['logo']) ? wp_get_attachment_image((int) $q['logo'], 'thumbnail', false, array('class' => 'c26-testi-logo', 'loading' => 'lazy', 'alt' => !empty($q['role']) ? $q['role'] . ' crest' : '')) : '';
            $q_rows[] = array(
                'logo'  => tefl_native_course_2026_h($ctx, $logo),
                'quote' => $e($q['quote']),
                'name'  => $e($q['name'] ?? ''),
                'role'  => !empty($q['role']) ? $e($q['role']) : '',
            );
        }
        $out['reviews'] = array(
            'kicker'  => $e($quotes_kicker ? $quotes_kicker : $tfs_get('quotes_eyebrow', 'From schools running it')),
            'heading' => $e($quotes_heading ? $quotes_heading : $tfs_get('quotes_title', 'What students and schools say')),
            'quotes'  => $q_rows,
        );
    }

    /* ---- FAQ ---- */
    $out['faq'] = null;
    if ($faqs) {
        $f_rows = array();
        foreach (array_values($faqs) as $row) {
            $f_rows[] = array(
                'q' => $e(wp_strip_all_tags((string) $row['question'])),
                'a' => tefl_native_course_2026_h($ctx, wp_kses_post((string) ($row['answer'] ?? ''))),
            );
        }
        $out['faq'] = array(
            'heading' => $e($f('c26_faq_heading')),
            'intro'   => $e($f('c26_faq_intro')),
            'rows'    => $f_rows,
        );
    }

    /* ---- CTA band ---- */
    $cta_h = $f('c26_cta_heading');
    $out['cta'] = null;
    if ($cta_h) {
        $out['cta'] = array(
            'kicker'    => $e($f('c26_cta_kicker') ? $f('c26_cta_kicker') : get_the_title($pid)),
            'heading'   => $e($cta_h),
            'secondary' => $link($f('c26_cta_secondary')),
        );
    }

    return $out;
}
