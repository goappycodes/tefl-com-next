<?php
/**
 * Native template: TEFL Shop (page-tefl-shop.php, /tefl-shop/).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/tefl-shop&path=/<cc>/tefl-shop/&id=4786
 *
 * The template runs at global scope, so its `$product = wc_get_product(…)` is
 * the global product WooCommerce's woocommerce_variable_add_to_cart() prints
 * the variations form for; that form is WooCommerce's own output and is passed
 * through. Add-to-cart links are built against the page URL (as on the page)
 * and stay absolute to WordPress. Rendered by components/overviews/TeflShop.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('tefl-shop', 'tefl_native_page_tefl_shop');

function tefl_native_page_tefl_shop($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'page-tefl-shop.php') {
        return null;
    }
    $h    = fn($s) => tefl_native_overviews_html($s, $ctx);
    $src  = 'tefl_native_overviews_src';
    $href = fn($u) => tefl_native_overviews_href($u, $ctx);

    $hero      = get_field('hero');
    $featured  = get_field('featured');
    $delivery  = get_field('delivery_information');
    $products  = get_field('products');
    $resources = get_field('teaching_resources');
    $article   = get_field('article');

    // add_to_cart_url() / the variations form are built against the current request URI.
    $as_page = function (callable $fn) use ($ctx) {
        $had = array_key_exists('REQUEST_URI', $_SERVER);
        $uri = $had ? $_SERVER['REQUEST_URI'] : null;
        $_SERVER['REQUEST_URI'] = $ctx['path'];
        try {
            return $fn();
        } finally {
            if ($had) {
                $_SERVER['REQUEST_URI'] = $uri;
            } else {
                unset($_SERVER['REQUEST_URI']);
            }
        }
    };
    $variable_form = function ($product) use ($as_page, $ctx) {
        $prev = $GLOBALS['product'] ?? null;
        $GLOBALS['product'] = $product;
        try {
            $html = $as_page(fn() => tefl_native_capture('woocommerce_variable_add_to_cart'));
        } finally {
            $GLOBALS['product'] = $prev;
        }
        // The variations' price_html as the page prints it (WCPBC's "loading" wrapper),
        // re-encoded the way variable.php encodes data-product_variations.
        $html = preg_replace_callback('#data-product_variations="([^"]*)"#', function ($m) {
            $vars = json_decode(html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'), true);
            if (!is_array($vars)) {
                return $m[0];
            }
            foreach ($vars as &$v) {
                if (is_array($v) && isset($v['price_html']) && preg_match('#^<span class="price">(.*)</span>$#s', $v['price_html'], $pm)) {
                    $v['price_html'] = '<span class="price">' . tefl_native_overviews_wcpbc_page($pm[1]) . '</span>';
                }
            }
            unset($v);
            return 'data-product_variations="' . wc_esc_json(wp_json_encode($vars)) . '"';
        }, $html);
        return tefl_native_overviews_html($html, $ctx);
    };
    $symbol = $h(get_woocommerce_currency_symbol());

    // "From <symbol><price>": the simple product's own price, or its last variation's.
    $from = function ($el_product, $which) {
        if (!$el_product) {
            return null;
        }
        if ($el_product->is_type('simple')) {
            $p = $el_product;
        } elseif ($el_product->is_type('variable')) {
            $children = $el_product->get_children();
            $p        = wc_get_product($children[count($children) - 1] ?? 0);
        } else {
            return null;
        }
        if (!$p) {
            return '';
        }
        return (string) ($which === 'sale' ? $p->get_sale_price() : $p->get_regular_price());
    };

    // One product card's buttons: the variations form, or "Ask us a question" + "Add to Cart".
    $buttons = function ($product, $bookmark, $not_a_product, $is_variable, $mode) use ($variable_form, $as_page, $href) {
        if ($not_a_product) {
            return array('kind' => 'voucher', 'cart' => $product ? $href($as_page(fn() => $product->add_to_cart_url())) : '');
        }
        if (!$product) {
            return null;
        }
        if ($is_variable) {
            if ($mode === 'products' && $bookmark === 'extensions') {
                return array('kind' => 'extension', 'link' => $href('/course-extensions'));
            }
            return array('kind' => 'form', 'html' => $variable_form($product));
        }
        return array('kind' => 'cart', 'cart' => $href($as_page(fn() => $product->add_to_cart_url())));
    };

    $card = function ($el, $mode) use ($h, $src, $href, $from, $buttons) {
        $post_obj   = $el['product'] ?? null;
        $id         = $post_obj instanceof WP_Post ? $post_obj->ID : (is_numeric($post_obj) ? (int) $post_obj : 0);
        $el_product = wc_get_product($id);
        $product    = wc_get_product($id);
        $bookmark   = (string) ($el['bookmark'] ?? '');
        // Featured cards check is_type('variable'); the other lists read ->product_type (the same).
        $is_variable = $product && $product->is_type('variable');
        return array(
            'title'       => $h($el['title'] ?? ''),
            'from'        => $from($el_product, $mode === 'resources' ? 'sale' : 'regular'),
            'image'       => $src($el['image'] ?? ''),
            'description' => $h($el['description'] ?? ''),
            'note'        => $h($el['note'] ?? ''),
            'additional'  => $mode === 'featured' ? $h($el['additional_information'] ?? '') : '',
            'bookmark'    => tefl_native_txt($bookmark),
            'sample_pdf'  => empty($el['sample_pdf']) ? '' : $href($el['sample_pdf']),
            'buttons'     => $buttons($product, $bookmark, $mode === 'products' && !empty($el['not_a_product']), $is_variable, $mode),
        );
    };

    $data = tefl_native_overviews_base($pid);
    $data['hero'] = array(
        'image'    => $src($hero['image'] ?? ''),
        'title'    => $h($hero['title'] ?? ''),
        'subtitle' => $h($hero['subtitle'] ?? ''),
    );
    $data['symbol']    = $symbol;
    $data['callback']  = $href('/callback');
    $data['featured']  = array_map(fn($el) => $card($el, 'featured'), (array) $featured);
    $data['delivery']  = array_map(fn($el) => array(
        $h($el['delivery'] ?? ''),
        $h($el['uk'] ?? ''),
        $h($el['europe'] ?? ''),
        $h($el['usa'] ?? ''),
        $h($el['rest_of_the_world'] ?? ''),
        $h($el['tracking_number'] ?? ''),
    ), (array) $delivery);
    $data['products']  = array_map(fn($el) => $card($el, 'products'), (array) $products);
    $data['resources'] = array_map(fn($el) => $card($el, 'resources'), (array) $resources);
    $data['article']   = array(
        'image'       => $src($article['image'] ?? ''),
        'title'       => $h($article['title'] ?? ''),
        'description' => $h($article['description'] ?? ''),
        'link'        => $href($article['link'] ?? ''),
    );
    return $data;
}
