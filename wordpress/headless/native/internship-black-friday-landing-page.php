<?php
/**
 * Native template: "Internship Black Friday Landing Page" (internship-black-friday-landing-page.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/internship-black-friday-landing-page&path=/<cc>/black-friday-internship-mega-sale/&id=72314
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

tefl_native_register('internship-black-friday-landing-page', 'tefl_native_internship_black_friday_landing_page');

function tefl_native_internship_black_friday_landing_page($pid, $ctx) {
    if (get_page_template_slug($pid) !== 'internship-black-friday-landing-page.php') {
        return null;
    }
    return tefl_native_promos_internship_sale($ctx);
}
