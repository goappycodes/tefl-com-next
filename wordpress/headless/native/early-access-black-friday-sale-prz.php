<?php
/**
 * Native template: VIP early-access sign-up (early-access-black-friday-sale-prz.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/early-access-black-friday-sale-prz&path=/<cc>/early-access-january-sale/&id=92176
 *
 * The template is static apart from its Contact Form 7 form, which is plugin
 * output and comes back as HTML. Markup: components/promos/EarlyAccess.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('early-access-black-friday-sale-prz', 'tefl_native_early_access_black_friday_sale_prz');

function tefl_native_early_access_black_friday_sale_prz($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'early-access-black-friday-sale-prz.php') {
        return null;
    }
    return array(
        'primary_class' => tefl_native_promos_primary_class(),
        'form'          => tefl_native_promos_cf7('[contact-form-7 id="a146026" title="Early Access Black Friday Sale Prz"]', $ctx),
    );
}
