<?php
/**
 * Native template: "January Internships Sale Landing Page" (january-internships-sale.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/january-internships-sale&path=/<cc>/january-tefl-internships-sales/&id=73592
 *
 * Hero / countdown / gifts (tefl_native_promos_jan_top()) and the internship
 * cards, testimonials, reviews and CTAs (tefl_native_promos_internship_sale()),
 * shared with its twin template. Markup: components/promos/InternshipSale.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('january-internships-sale', 'tefl_native_january_internships_sale');

function tefl_native_january_internships_sale($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'january-internships-sale.php') {
        return null;
    }
    return tefl_native_promos_internship_sale($ctx);
}
