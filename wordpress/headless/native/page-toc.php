<?php
/**
 * Native template: "Page Template with TOC" (page-toc.php) — /privacy-policy/,
 * /terms-and-conditions/, /new-zealand/.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/page-toc&path=/<cc>/x/&id=123
 *
 * Returns the page title (single_post_title), the body — the ACF `content`
 * field, else the raw post content, both echoed unfiltered by the template —
 * and the `accordion` repeater. React: components/pages/toc/TocPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('page-toc', 'tefl_native_page_toc');

function tefl_native_page_toc($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'page-toc.php') {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    $layout = astra_page_layout();
    if ($layout === 'left-sidebar' || $layout === 'right-sidebar') {
        return null;
    }
    if (!tefl_native_pages_hook_empty('astra_primary_content_top') || !tefl_native_pages_hook_empty('astra_primary_content_bottom')) {
        return null;
    }
    $html = function ($frag) use ($ctx) {
        $frag = (string) $frag;
        return tefl_native_pages_balanced($frag) ? $ctx['html']($ctx['block']($frag)) : null;
    };

    $content = get_field('content');
    $body    = $html($content ? $content : get_the_content());

    $accordion = array();
    $raw       = get_field('accordion');
    if ($raw && is_array($raw)) {
        foreach ($raw as $element) {
            $qas = array();
            foreach ((array) ($element['questions_answers'] ?? array()) as $qa) {
                $a = $html($qa['content'] ?? '');
                if ($a === null) {
                    return null;
                }
                $qas[] = array('title' => (string) ($qa['title'] ?? ''), 'content' => $a);
            }
            $accordion[] = array(
                'title'    => (string) ($element['title'] ?? ''),
                'bookmark' => (string) ($element['bookmark'] ?? ''),
                'items'    => $qas,
            );
        }
    }
    if ($body === null) {
        return null;
    }
    $primary = tefl_native_pages_attrs(tefl_native_pages_capture('astra_primary_class'));

    return array(
        'primary_class' => isset($primary['class']) ? $primary['class'] : 'content-area primary',
        'title_html'    => single_post_title('', false),
        'body_html'     => $body,
        'accordion'     => $accordion,
    );
}
