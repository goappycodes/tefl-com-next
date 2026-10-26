<?php
/**
 * Native template: "Callback Template" (page-callback.php) — /callback/ (1126)
 * and /vip-black-friday-deals/ (82151).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-callback&path=/<cc>/callback/&id=1126
 *
 * The optional hero banner and the callback form
 * (CF7: the Black Friday form on page 82151, else the page's
 * `contact_form_shortcode`). React: components/pages/callback/CallbackPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('page-callback', 'tefl_native_page_callback');

function tefl_native_page_callback($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'page-callback.php') {
        return null;
    }
    // Page 1126's header block closes one </div> more than it opens, which ends
    // the content slot early on the page; that can't be rebuilt, so it stays on
    // the passthrough render.
    if (is_page('1126')) {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $rows = 'tefl_native_pages_rows';

    $hero   = $rows(get_field('hero_banner'));
    $cta    = $rows($hero['banner_cta'] ?? null);
    $banner = null;
    if (!empty($hero['banner_image'])) {
        $banner = array(
            'image'    => tefl_native_pages_str($hero['banner_image']),
            'title'    => $v['h']($cta['cta_title'] ?? ''),
            'subtitle' => $v['h']($cta['cta_subtitle'] ?? ''),
            'text'     => $v['h']($cta['cta_text'] ?? ''),
            'btn_text' => $v['t']($cta['cta_button_text'] ?? ''),
        );
    }

    $form = is_page('82151')
        ? do_shortcode('[contact-form-7 id="dc779dd" title="Black Friday Callback Form"]')
        : do_shortcode(tefl_native_pages_str(get_field('contact_form_shortcode')));

    return array(
        'banner'      => $banner,
        'form_html'   => $v['h']($form),
    );
}
