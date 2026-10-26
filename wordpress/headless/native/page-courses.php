<?php
/**
 * Native template: Courses (page-courses.php, /tefl-courses/ in the geo
 * folders — the US root redirects to /tefl-courses-overview/).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-courses&path=/<cc>/tefl-courses/&id=389
 *
 * The template's PHP flow is kept as-is (one scope, same variable names), so
 * the values it carries from one loop into the next — the classroom cards
 * reuse the last level 5 card's feature icon and zoom-classes text, the deposit
 * ribbon keeps the previous card's icon — come out the same. Rendered by
 * components/overviews/PageCourses.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('page-courses', 'tefl_native_page_courses');

function tefl_native_page_courses($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'page-courses.php') {
        return null;
    }
    $h    = fn($s) => tefl_native_overviews_html($s, $ctx);
    $src  = 'tefl_native_overviews_src';
    $href = fn($u) => tefl_native_overviews_href($u, $ctx);
    $cfv  = fn($k) => function_exists('get_cfvalue_by_country') ? get_cfvalue_by_country($k) : get_field($k);

    $trial = get_field('trial');

    $banner_background_image = get_field('banner_background_image');
    $banner_title            = $cfv('banner_title');
    $banner_text             = $cfv('banner_text');
    $banner_icon             = get_field('banner_icon');
    $banner_button_text      = get_field('banner_button_text');
    $banner_button_url       = get_field('banner_button_url');

    $accredited_tefl_course_title                  = $cfv('accredited_tefl_course_title');
    $accredited_tefl_course_section_text           = $cfv('accredited_tefl_course_section_text');
    $accredited_tefl_course_section_text_with_icon = get_field('accredited_tefl_course_section_text_with_icon');

    $accredited_courses = get_field('accredited_courses');

    $virtual_tefl_course_background  = get_field('virtual_tefl_course_background');
    $virtual_tefl_course_title       = get_field('virtual_tefl_course_title');
    $virtual_tefl_course_text        = get_field('virtual_tefl_course_text');
    $virtual_tefl_course_button_text = get_field('virtual_tefl_course_button_text');
    $virtual_tefl_course_button_url  = get_field('virtual_tefl_course_button_url');

    $level_5_course_section_title          = get_field('level_5_course_section_title');
    $level_5_course_section_text           = get_field('level_5_course_section_text');
    $level_5_course_section_text_with_icon = get_field('level_5_course_section_text_with_icon');

    $level_5_courses = get_field('level_5_courses');

    $english_level_test_background  = get_field('english_level_test_background');
    $english_level_test_title       = get_field('english_level_test_title');
    $english_level_test_text        = get_field('english_level_test_text');
    $english_level_test_button_text = get_field('english_level_test_button_text');
    $english_level_test_button_url  = get_field('english_level_test_button_url');

    $classroom_bb_course_section_title = get_field('classroom_bb_course_section_title');
    $classroom_bb_course_section_text  = get_field('classroom_bb_course_section_text');

    $classroom_bb_courses = get_field('classroom_bb_courses');

    $specialist_course_section_title = get_field('specialist_course_section_title');
    $specialist_course_section_text  = get_field('specialist_course_section_text');

    $specialist_courses = get_field('specialist_courses');

    // Text-with-icon rows (accredited / level 5 headers).
    $icon_rows = function ($rows) use ($h, $src) {
        $out = array();
        foreach ((array) $rows as $text_icon) {
            $icon_url  = $text_icon['icon'] ?? '';
            $icon_text = $text_icon['text'] ?? '';
            if (!empty($icon_url) || !empty($icon_text)) {
                $out[] = array('icon' => $src($icon_url), 'text' => $h($icon_text));
            }
        }
        return $out;
    };

    // The theme's price block for a course card (simple: own price + "Save n%"; variable: last child's price).
    $course_price_html = '';
    $price = function ($course_product) use (&$course_price_html, $ctx) {
        $percentage = '';
        if ($course_product && $course_product->is_type('simple')) {
            $course_price_html    = tefl_native_overviews_price($course_product, $ctx);
            $simple_regular_price = $course_product->get_regular_price();
            $simple_sale_price    = $course_product->get_sale_price();
            if ($simple_sale_price) {
                $percentage = round((((float) $simple_regular_price - (float) $simple_sale_price) / (float) $simple_regular_price) * 100);
            }
        } elseif ($course_product && $course_product->is_type('variable')) {
            $available_children = $course_product->get_children();
            $children_count     = count($available_children) - 1;
            $product_var_id     = $available_children[$children_count] ?? 0;
            $course_price_html  = tefl_native_overviews_price($product_var_id, $ctx);
        }
        return $percentage ? (string) $percentage : '';
    };
    $features = function ($course_features) use ($h) {
        $includes = $course_features['includes'] ?? null;
        $excludes = $course_features['excludes'] ?? null;
        return array(
            'includes' => empty($includes) ? array() : array_map(fn($i) => $h($i['feature'] ?? ''), (array) $includes),
            'excludes' => empty($excludes) ? array() : array_map(fn($i) => $h($i['feature'] ?? ''), (array) $excludes),
        );
    };
    $alt = function ($course_title) {
        // The template prints str_replace(" ", "_", strip_tags($course_title)) . "_Icon" raw into alt; the browser decodes entities.
        return html_entity_decode(str_replace(' ', '_', strip_tags((string) $course_title)) . '_Icon', ENT_QUOTES | ENT_HTML5, 'UTF-8');
    };

    $data = tefl_native_overviews_base($pid);

    // Accredited courses (the "gray-blocks" variant only prints when there are none: an empty row).
    $accredited = array();
    if ($accredited_courses) {
        foreach ((array) $accredited_courses as $accredited_course) {
            $course_title  = $accredited_course['course_title'] ?? '';
            $course_id     = $accredited_course['course'] ?? 0;
            $course_product = wc_get_product($accredited_course['course_product'] ?? 0);
            $percentage    = $price($course_product);
            $accredited[]  = array(
                'bg'         => $src($accredited_course['course_card_background_image'] ?? ''),
                'icon'       => $src($accredited_course['course_icon'] ?? ''),
                'alt'        => $alt($course_title),
                'title'      => $h($course_title),
                'completion' => $h($accredited_course['course_completion_time'] ?? ''),
                'link'       => $href(get_post_permalink($course_id)),
                'percentage' => $percentage,
                'price'      => $course_price_html,
            ) + $features($accredited_course['course_features'] ?? array());
        }
    }

    // Level 5 + classroom cards share the deposit ribbon (template-parts/deposit-info.php) and leak variables between loops.
    $course_zoom_classes = null;
    $course_feature_icon = null;
    $deposit_icon        = null;
    $deposit_description = null;
    $total_deposits      = null;
    $deposit_card = function ($course_product_id, $course_product) use (&$deposit_icon, &$deposit_description, &$total_deposits, $h, $src) {
        $full_price           = $course_product ? $course_product->get_price() : '';
        $deposit_enabled      = get_post_meta($course_product_id, '_wc_deposit_enabled', true);
        $deposit_payment_plan = '';
        if ($deposit_enabled == 'forced' || $deposit_enabled == 'optional') {
            $deposit_payment_plan = get_post_meta($course_product_id, '_wc_deposit_payment_plans', true);
            $deposit_payment_plan = is_array($deposit_payment_plan) ? ($deposit_payment_plan[0] ?? '') : '';
        }
        include get_stylesheet_directory() . '/template-parts/deposit-info.php';
        $kind = '';
        if ($deposit_enabled == 'forced' || $deposit_enabled == 'optional') {
            if ($deposit_payment_plan === 1 || $deposit_payment_plan === 3 || $deposit_payment_plan === 4) {
                $kind = 'ribbon';
            }
            if ($deposit_payment_plan === 6) {
                $kind = $kind ? $kind . '+pay6' : 'pay6';
            }
        }
        return array(
            'kind'        => $kind,
            'icon'        => $src($deposit_icon),
            'total'       => (string) $total_deposits,
            'description' => $h($deposit_description),
            'product_id'  => (string) $course_product_id,
        );
    };

    $level5 = array();
    foreach ((array) $level_5_courses as $level_5_course) {
        $course_title         = $level_5_course['course_title'] ?? '';
        $course_zoom_classes  = $level_5_course['zoom_classes'] ?? null;
        $course_id            = $level_5_course['course'] ?? 0;
        $course_product_id    = $level_5_course['course_product'] ?? 0;
        $course_product       = wc_get_product($course_product_id);
        $percentage           = $price($course_product);
        $course_feature_icon  = $level_5_course['course_feature_icon'] ?? null;
        $level5[] = array(
            'bg'           => $src($level_5_course['course_card_background_image'] ?? ''),
            'icon'         => $src($level_5_course['course_icon'] ?? ''),
            'alt'          => $alt($course_title),
            'title'        => $h($course_title),
            'completion'   => $h($level_5_course['course_completion_time'] ?? ''),
            'link'         => $href(get_post_permalink($course_id)),
            'percentage'   => $percentage,
            'price'        => $course_price_html,
            'deposit'      => $deposit_card($course_product_id, $course_product),
            'zoom'         => $course_zoom_classes ? $h($course_zoom_classes) : null,
            'feature_icon' => $src($course_feature_icon),
        ) + $features($level_5_course['course_features'] ?? array());
    }

    $classroom = array();
    if ($classroom_bb_courses) {
        foreach ((array) $classroom_bb_courses as $cbb_course) {
            $course_title      = $cbb_course['course_title'] ?? '';
            $course_id         = $cbb_course['course'] ?? 0;
            $course_product_id = $cbb_course['course_product'] ?? 0;
            $course_product    = wc_get_product($course_product_id);
            $percentage        = $price($course_product);
            $classroom[] = array(
                'bg'           => $src($cbb_course['course_background_image'] ?? ''),
                'icon'         => $src($cbb_course['course_icon'] ?? ''),
                'alt'          => $alt($course_title),
                'title'        => $h($course_title),
                'completion'   => $h($cbb_course['course_completion_time'] ?? ''),
                'link'         => $href(get_post_permalink($course_id)),
                'percentage'   => $percentage,
                'price'        => $course_price_html,
                'deposit'      => $deposit_card($course_product_id, $course_product),
                // Not set in this loop: the last level 5 card's values.
                'zoom'         => $course_zoom_classes ? $h($course_zoom_classes) : null,
                'feature_icon' => $src($course_feature_icon),
            ) + $features($cbb_course['course_features'] ?? array());
        }
    }

    $specialist = array();
    if ($specialist_courses) {
        foreach ((array) $specialist_courses as $sp_course) {
            $course_id      = $sp_course['course'] ?? 0;
            $course_product = wc_get_product($sp_course['course_product'] ?? 0);
            $percentage     = $price($course_product);
            $specialist[]   = array(
                'bg'         => $src($sp_course['course_background_image'] ?? ''),
                'icon'       => $src($sp_course['course_icon'] ?? ''),
                'title'      => $h($sp_course['course_title'] ?? ''),
                'completion' => $h($sp_course['course_completion_time'] ?? ''),
                'link'       => $href(get_post_permalink($course_id)),
                'percentage' => $percentage,
                'price'      => $course_price_html,
            );
        }
    }

    foreach (array_merge($accredited, $level5, $classroom) as $c) {
        if (strpos($c['alt'], '"') !== false) {
            return null; // would end the alt attribute early on live (see the overview endpoint)
        }
    }

    $faqs = get_field('frequently_asked_questions', 1905);

    $data += array(
        'banner'         => array(
            'bg'       => $src($banner_background_image),
            'title'    => empty($banner_title) ? '' : $h($banner_title),
            'text'     => empty($banner_text) ? '' : $h($banner_text),
            'icon'     => empty($banner_icon) ? '' : $src($banner_icon),
            'show_btn' => !empty($banner_button_text) || !empty($banner_button_url),
            'btn_text' => $h($banner_button_text),
            'btn_url'  => $href($banner_button_url),
        ),
        'accredit'       => array(
            'title' => empty($accredited_tefl_course_title) ? '' : $h($accredited_tefl_course_title),
            'text'  => empty($accredited_tefl_course_section_text) ? '' : $h($accredited_tefl_course_section_text),
            'icons' => $accredited_tefl_course_section_text_with_icon ? $icon_rows($accredited_tefl_course_section_text_with_icon) : null,
        ),
        'teacher_link'   => $href('https://teflinstitute.com/course/ofqual-level-5-tefl-course-government-regulated/'),
        'accredited'     => $accredited_courses ? $accredited : null,
        'virtual'        => array(
            'bg'       => $src($virtual_tefl_course_background),
            'title'    => empty($virtual_tefl_course_title) ? '' : $h($virtual_tefl_course_title),
            'text'     => empty($virtual_tefl_course_text) ? '' : $h($virtual_tefl_course_text),
            'show_btn' => !empty($virtual_tefl_course_button_url) || !empty($virtual_tefl_course_button_text),
            'btn_text' => $h($virtual_tefl_course_button_text),
            'btn_url'  => $href($virtual_tefl_course_button_url),
        ),
        'level5_head'    => array(
            'title' => empty($level_5_course_section_title) ? '' : $h($level_5_course_section_title),
            'text'  => empty($level_5_course_section_text) ? '' : $h($level_5_course_section_text),
            'icons' => $level_5_course_section_text_with_icon ? $icon_rows($level_5_course_section_text_with_icon) : null,
        ),
        'level5'         => $level5,
        'trial'          => (is_array($trial) && ($trial['toggle'] ?? null) == true) ? array(
            'image'    => $src($trial['image'] ?? ''),
            'title'    => $h($trial['title'] ?? ''),
            'content'  => $h($trial['content'] ?? ''),
            'cta_link' => $href($trial['cta']['link'] ?? ''),
            'cta_text' => $h($trial['cta']['value'] ?? ''),
        ) : null,
        'test'           => array(
            'bg'       => $src($english_level_test_background),
            'title'    => empty($english_level_test_title) ? '' : $h($english_level_test_title),
            'text'     => empty($english_level_test_text) ? '' : $h($english_level_test_text),
            'show_btn' => !empty($english_level_test_button_url) || !empty($english_level_test_button_text),
            'btn_text' => $h($english_level_test_button_text),
            'btn_url'  => $href($english_level_test_button_url),
        ),
        'classroom_head' => array(
            'title' => empty($classroom_bb_course_section_title) ? '' : $h($classroom_bb_course_section_title),
            'text'  => empty($classroom_bb_course_section_text) ? '' : $h($classroom_bb_course_section_text),
        ),
        'classroom'      => $classroom_bb_courses ? $classroom : null,
        'specialist_head' => array(
            'title' => empty($specialist_course_section_title) ? '' : $h($specialist_course_section_title),
            'text'  => empty($specialist_course_section_text) ? '' : $h($specialist_course_section_text),
        ),
        'specialist'     => $specialist_courses ? $specialist : null,
        'faqs'           => tefl_native_overviews_faqs($faqs, $ctx),
    );
    return $data;
}
