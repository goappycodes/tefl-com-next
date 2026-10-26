<?php
/**
 * Native template: single course (single-course.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/course&path=/<cc>/course/<slug>/&id=123
 *
 * single-course.php prints the Course + BreadcrumbList JSON-LD, then includes
 * one of three designs, picked by ACF:
 *   is_new_design   → single-course-template-new2023.php  (course-new2023.php)
 *   is_2024_design  → single-course-template-2024.php     (course-2024.php)
 *   otherwise       → single-course-template.php          (course-legacy.php)
 * Each design's data builder lives in its own file (tefl_native_course_<variant>_data)
 * and returns null for anything it doesn't reproduce, which sends the whole
 * page to the passthrough render. Courses with the 2026 design (c26_enabled)
 * never reach single-course.php; they're course-2026.php.
 *
 * The Next side is components/courses/Course.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('course', 'tefl_native_course');

function tefl_native_course($pid, $ctx) {
    if (get_post_type($pid) !== 'course' || !function_exists('get_field') || !function_exists('wc_get_product')) {
        return null;
    }
    if (function_exists('ti_c26_is_active') && ti_c26_is_active($pid)) {
        return null; // course-page-2026.php
    }
    // The sidebar branches of single-course.php aren't ported (every course is no-sidebar).
    if (function_exists('astra_page_layout') && in_array(astra_page_layout(), array('left-sidebar', 'right-sidebar'), true)) {
        return null;
    }

    if (get_field('is_new_design')) {
        $variant = 'new2023';
    } elseif (get_field('is_2024_design')) {
        $variant = '2024';
    } else {
        $variant = 'legacy';
    }
    $fn = 'tefl_native_course_' . $variant . '_data';
    if (!function_exists($fn)) {
        return null;
    }
    $data = call_user_func($fn, (int) $pid, $ctx);
    if (!is_array($data)) {
        return null;
    }

    return array(
        'id'      => (int) $pid,
        'variant' => $variant,
        'ld'      => tefl_native_course_wrapper_ld(),
        'data'    => $data,
    );
}

/** The two JSON-LD blocks single-course.php prints before the design, byte for byte. */
function tefl_native_course_wrapper_ld() {
    $title = get_the_title();
    $course = '
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "' . $title . '",
  "description": "' . $title . '",
  "offers": {
    "category": "TEFL",
    "@type": "AggregateOffer",
    "priceCurrency": "USD"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Online",
    "courseWorkload": "PT150H",
    "startDate": "2025-05-01",
    "endDate": "2025-10-28"
  },
  "CourseInstance": "",
  "courseMode": [
    "online"
  ],
  "provider": {
    "@type": "Organization",
    "name": "THE TEFL INSTITUTE",
    "sameAs": "https://teflinstitute.com/"
  }
}
';
    $crumbs = '
    {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://teflinstitute.com/"
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": "TEFL Courses",
            "item": "https://teflinstitute.com/tefl-courses/"
        }, {
            "@type": "ListItem",
            "position": 3,
            "name": "' . $title . '",
            "item": "' . get_the_permalink() . '"
        }]
    }
';
    return array($course, $crumbs);
}

/** class="…" that astra_primary_class() prints on #primary. */
function tefl_native_course_primary_class() {
    $out = function_exists('astra_primary_class') ? tefl_native_capture('astra_primary_class') : '';
    return preg_match('/class="([^"]*)"/', $out, $m) ? $m[1] : 'content-area primary';
}
