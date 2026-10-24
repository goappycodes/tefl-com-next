<?php
/**
 * tefl/v1/post — data for the native React blog post template.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/post&path=/<cc>/blog/<slug>/
 *
 * Call it through the geo folder (as above, not /wp-json/): wp-config sets
 * SEO_LANG / WP_HOME from the request URI, so home_url(), permalinks and the
 * per-country ACF values (`get_cfvalue_by_country()`) match the folder.
 *
 * Mirrors single-post-redesign.php + includes/ti-blog-redesign.php field for
 * field: every value the template computes is resolved here (ACF with its
 * defaults, Yoast breadcrumb, the_content, reading time, the deterministic
 * country-guide pick, related posts), and the Next template
 * (components/blog/BlogPost.tsx) reproduces the markup. URLs and HTML get the
 * same rewrites as tefl/v1/render, so links stay on the Next front.
 *
 * Returns 404 when the path isn't a published post rendered by the redesign
 * template; the Next route then falls back to the passthrough render.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route(TEFL_HEADLESS_NS, '/post', array(
        'methods'             => 'GET',
        'callback'            => 'tefl_headless_post',
        'permission_callback' => '__return_true',
        'args'                => array(
            'path' => array('required' => true, 'type' => 'string'),
        ),
    ));
});

function tefl_headless_post(WP_REST_Request $request) {
    $path = tefl_headless_normalise_path($request->get_param('path'));
    if ($path === '' || strpos($path, '?') !== false) {
        return tefl_headless_response(array('ok' => false, 'error' => 'bad_path'), 400);
    }
    list($country, $bare) = tefl_headless_split_country($path);

    $id = url_to_postid(home_url($bare));
    $p  = $id ? get_post($id) : null;
    if (!$p || $p->post_type !== 'post' || $p->post_status !== 'publish' || post_password_required($p)) {
        return tefl_headless_response(array('ok' => false, 'error' => 'not_found'), 404);
    }

    // Make this post the main query, as on the post's own page, so is_singular(),
    // in_the_loop() / is_main_query() checks in the_content filters, the Yoast
    // breadcrumb and the author template tags all resolve exactly as they do there.
    global $wp_query, $wp_the_query;
    $wp_query     = new WP_Query(array('p' => $id, 'post_type' => 'post', 'post_status' => 'publish'));
    $wp_the_query = $wp_query;
    if (!$wp_query->have_posts()) {
        return tefl_headless_response(array('ok' => false, 'error' => 'not_found'), 404);
    }
    $wp_query->the_post();

    if (!function_exists('ti_use_blog_redesign') || !ti_use_blog_redesign()) {
        wp_reset_postdata();
        return tefl_headless_response(array('ok' => false, 'error' => 'not_redesign'), 404);
    }

    $data = tefl_headless_post_data($id);
    wp_reset_postdata();

    $data['ok']      = true;
    $data['path']    = $path;
    $data['country'] = $country;
    return tefl_headless_response($data);
}

/**
 * Complianz's cookie blocker over an HTML fragment. On a page it runs as an
 * output buffer (template_redirect), turning YouTube/Vimeo iframes and
 * third-party scripts into consent placeholders; a REST request never starts
 * that buffer, so fragments meant for the page get it applied here.
 *
 * Gated on the blocker's own settings rather than cmplz_can_run_cookie_blocker(),
 * which is false for REST requests by design.
 */
function tefl_headless_cookie_block($html) {
    if ($html === '' || !class_exists('COMPLIANZ') || empty(COMPLIANZ::$cookie_blocker) || !function_exists('cmplz_get_option')) {
        return $html;
    }
    if (cmplz_get_option('enable_cookie_blocker') !== 'yes' || cmplz_get_option('safe_mode')) {
        return $html;
    }
    return COMPLIANZ::$cookie_blocker->replace_tags($html);
}

/** Every value single-post-redesign.php renders, for the current post in the loop. */
function tefl_headless_post_data($pid) {
    $href = 'tefl_headless_rewrite_href';
    $txt  = function ($s) {
        return html_entity_decode((string) $s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    };
    $page = tefl_headless_wp_origin() . tefl_headless_normalise_path(wp_parse_url(get_permalink($pid), PHP_URL_PATH));
    $html = function ($fragment) use ($page) {
        return tefl_headless_rewrite_html((string) $fragment, $page);
    };

    // Hero image: featured image, else the legacy ACF banner.
    $hero = get_the_post_thumbnail_url($pid, 'full');
    if (!$hero) {
        $banner = get_field('banner');
        $hero   = $banner['background_image'] ?? '';
    }

    // Sidebar tools, with the template's back-compat fallback to the two old selects.
    $sidebar_tools = get_field('sidebar_tools');
    if (!is_array($sidebar_tools) || count($sidebar_tools) < 2) {
        $sidebar_tools = array_values(array_filter(array(
            get_field('sidebar_tool_1') ?: (get_field('featured_tool') ?: 'salary'),
            get_field('sidebar_tool_2') ?: 'prospectus',
        )));
    }

    $show_wire  = get_field('show_hire_wire');
    $show_wire  = ('' === $show_wire || null === $show_wire) ? true : (bool) $show_wire;
    $show_promo = get_field('show_promo_strip');
    $show_promo = ('' === $show_promo || null === $show_promo) ? true : (bool) $show_promo;

    $takeaways = array();
    $raw       = get_field('key_takeaways');
    if ($raw && is_array($raw)) {
        foreach ($raw as $t) {
            $takeaways[] = (string) ($t['text'] ?? '');
        }
    }

    // Breadcrumb: Yoast's, else Blog / ancestor categories / primary category.
    $bc = function_exists('yoast_breadcrumb') ? yoast_breadcrumb('<nav class="tibr-breadcrumb">', '</nav>', false) : '';
    if (!trim(wp_strip_all_tags((string) $bc))) {
        $cat    = get_the_category();
        $crumbs = array('<a href="' . esc_url(home_url('/blog/')) . '">Blog</a>');
        if (!empty($cat)) {
            $primary = $cat[0];
            foreach (array_reverse(get_ancestors($primary->term_id, 'category')) as $aid) {
                $t = get_term($aid, 'category');
                if ($t && !is_wp_error($t)) {
                    $crumbs[] = '<a href="' . esc_url(get_category_link($t)) . '">' . esc_html($t->name) . '</a>';
                }
            }
            $crumbs[] = '<a href="' . esc_url(get_category_link($primary)) . '">' . esc_html($primary->name) . '</a>';
        }
        $bc = '<nav class="tibr-breadcrumb">' . implode(' / ', $crumbs) . '</nav>';
    }

    $content = apply_filters('the_content', get_the_content());
    $content = function_exists('tibr_style_takeaways') ? tibr_style_takeaways($content) : $content;
    $content = tefl_headless_cookie_block($content);

    $faqs = array();
    $raw  = function_exists('get_cfvalue_by_country') ? get_cfvalue_by_country('frequently_asked_questions') : get_field('frequently_asked_questions');
    if ($raw && is_array($raw)) {
        foreach ($raw as $faq) {
            $faqs[] = array(
                'question'    => $txt($faq['question'] ?? ''),
                'answer_html' => $html(tefl_headless_cookie_block(wp_kses_post($faq['answer'] ?? ''))),
                'answer_text' => wp_strip_all_tags($faq['answer'] ?? ''),
            );
        }
    }

    // Author card.
    $author_id  = get_the_author_meta('ID');
    $author_img = get_field('author_image', 'user_' . $author_id);
    $author_img = $author_img ? (is_array($author_img) ? $author_img['url'] : $author_img) : '';
    if (!$author_img) {
        $author_img = get_avatar_url($author_id, array('size' => 144));
    }

    // Country guides: the template's deterministic 5-of-15, seeded by post ID.
    // Picked here because PHP's mt_rand shuffle can't be reproduced in JS.
    $guides = array(
        array('Spain', 'Jobs, pay and visa routes', 'ES', 'teach-english-in-spain'),
        array('South Korea', 'EPIK, hagwons and pay', 'KR', 'south-korea'),
        array('Japan', 'JET, ALT and eikaiwa pay', 'JP', 'japan'),
        array('Vietnam', 'Work permits and requirements', 'VN', 'vietnam'),
        array('Thailand', 'Visas and teaching licences', 'TH', 'thailand'),
        array('Italy', 'Jobs, pay and visa routes', 'IT', 'italy'),
        array('Dubai', 'Pay, requirements and visas', 'AE', 'dubai'),
        array('Czech Republic', 'Pay, visas and cities', 'CZ', 'czech-republic'),
        array('Cambodia', 'Pay, requirements and visas', 'KH', 'cambodia'),
        array('Estonia', 'Jobs, pay and work routes', 'EE', 'estonia'),
        array('China', 'Z visa, pay and cities', 'CN', 'china'),
        array('Taiwan', 'Buxibans, pay and visas', 'TW', 'taiwan'),
        array('Mexico', 'Jobs, pay and cities', 'MX', 'mexico'),
        array('Germany', 'Freelance work and pay', 'DE', 'germany'),
        array('Portugal', 'Jobs, pay and visa routes', 'PT', 'portugal'),
    );
    mt_srand((int) $pid);
    shuffle($guides);
    mt_srand();
    $guide_cards = array();
    foreach (array_slice($guides, 0, 5) as $g) {
        $guide_cards[] = array(
            'country' => $g[0],
            'desc'    => $g[1],
            'code'    => $g[2],
            'url'     => $href('https://teflinstitute.com/teach-english-abroad/' . $g[3] . '/'),
        );
    }

    // Related posts + "All articles" link.
    $related  = array();
    $all_link = '';
    $rposts   = function_exists('tibr_related_posts') ? tibr_related_posts($pid, 3) : array();
    if (!empty($rposts)) {
        $cat      = get_the_category();
        $all_link = $href(!empty($cat) ? get_category_link($cat[0]->term_id) : home_url('/blog/'));
        foreach ($rposts as $rp) {
            $rcat      = get_the_category($rp->ID);
            $related[] = array(
                'url'   => $href(get_permalink($rp->ID)),
                'img'   => (string) get_the_post_thumbnail_url($rp->ID, 'medium_large'),
                'cat'   => !empty($rcat) ? $txt($rcat[0]->name) : '',
                'title' => $txt(get_the_title($rp->ID)),
            );
        }
    }

    $categories = array();
    foreach (get_the_category() as $c) {
        $categories[] = array('name' => $txt($c->name), 'url' => $href(get_category_link($c->term_id)));
    }

    $opt     = function ($name, $fallback) {
        return function_exists('tibr_opt') ? tibr_opt($name, $fallback) : $fallback;
    };
    $cta_url = $opt('tibr_cta_url', 'https://teflinstitute.com/tefl-courses/');

    return array(
        'id'           => (int) $pid,
        'title'        => $txt(get_the_title()), // plain text (attributes, share text)
        'title_html'   => get_the_title(), // as the_title() prints it (entities kept)
        'permalink'    => get_permalink(),
        'img_dir'      => tefl_headless_wp_origin() . wp_parse_url(get_stylesheet_directory_uri(), PHP_URL_PATH) . '/assets/img/blog-redesign',
        'hero'         => (string) $hero,
        'breadcrumb'   => $html($bc),
        'author'       => array(
            'name'  => $txt(get_the_author()),
            'bio'   => $txt(get_the_author_meta('description')),
            'image' => (string) $author_img,
        ),
        'date'         => get_the_date('jS F Y'),
        'reading'      => function_exists('get_reading_time') ? (int) get_reading_time(get_the_content()) : 0,
        'sidebar_tools' => array_values(array_map('strval', $sidebar_tools)),
        'show_wire'    => $show_wire,
        'show_promo'   => $show_promo,
        'promo_style'  => get_field('promo_strip_style') ?: 'steady',
        'intro'        => trim((string) get_field('blog_intro')),
        'takeaways'    => array_map($txt, $takeaways),
        'content_html' => $html($content),
        'faqs'         => $faqs,
        'guides'       => $guide_cards,
        'related'      => $related,
        'related_all'  => $all_link,
        'categories'   => $categories,
        'opts'         => array(
            'cta_url'        => $href($cta_url),
            'promo_link'     => $href($opt('tibr_promo_link', $cta_url)),
            'promo_pill'     => $txt($opt('tibr_promo_pill', 'Free Teaser Course With Certificate')),
            'promo_title'    => $txt($opt('tibr_promo_title', 'Teaching English: Your First Lesson')),
            'promo_sub'      => $txt($opt('tibr_promo_sub', 'Try To See if teaching is for You')),
            'promo_cta'      => $txt($opt('tibr_promo_cta', 'Start Now')),
            'guides_url'     => $href($opt('tibr_guides_url', 'https://teflinstitute.com/teach-english-jobs/')),
            'team_url'       => $href($opt('tibr_team_url', 'https://teflinstitute.com/meet-the-team/')),
            'salary_url'     => $href($opt('tibr_salary_url', 'https://teflinstitute.com/teaching-english-online-salary-calculator/')),
            'level_url'      => $href($opt('tibr_level_url', 'https://teflinstitute.com/test-your-english-level-free-online/')),
            'finder_url'     => $href($opt('tibr_finder_url', 'https://teflinstitute.com/tefl-courses-overview/')),
            'prospectus_url' => $href($opt('tibr_prospectus_url', '#')),
        ),
    );
}
