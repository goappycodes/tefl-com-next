<?php
/**
 * Native template: single screening form (single-screening_form.php).
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/screening&path=/<cc>/screening-form/<slug>/&id=123
 *
 * The template prints the "Screening Form" CF7 form and an inline jQuery
 * script that fills the form's questions from ACF (answers, points, images).
 * Returns the form as rendered and the raw ACF values the script interpolates;
 * components/home/Screening.tsx + screening-script.ts reproduce both.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_register('screening', 'tefl_native_screening');

function tefl_native_screening($pid, $ctx) {
    if (get_post_type($pid) !== 'screening_form') {
        return null;
    }
    $s = 'tefl_native_home_s';

    $group = function ($name) use ($s) {
        $g    = get_field($name);
        $opts = array();
        foreach ((is_array($g) && is_array($g['options'] ?? null)) ? $g['options'] : array() as $e) {
            $opts[] = array('answer' => $s($e['answer'] ?? ''), 'points' => $s($e['points'] ?? ''));
        }
        return array('image' => $s(is_array($g) ? ($g['image'] ?? '') : ''), 'options' => $opts);
    };

    $data = array(
        'id'                    => (int) $pid,
        'sf_country'            => $s(get_field('country')), // "country" is the geo folder (set by the dispatcher)
        'get_started'           => $s(get_field('get_started')),
        'about'                 => $s(get_field('about')),
        'passport'              => $group('passport'),
        'level'                 => $group('level'),
        'degree'                => $group('degree'),
        'age'                   => $group('age'),
        'record'                => $group('record'),
        'healthy'               => $group('healthy'),
        'open'                  => $group('open'),
        'congratulations_image' => $s(get_field('congratulations_image')),
    );

    $primary_attr          = tefl_native_capture(function () {
        astra_primary_class();
    });
    $data['primary_class'] = preg_match('#class=["\']([^"\']*)#', $primary_attr, $m) ? $m[1] : 'content-area primary';
    // A page view has rendered one CF7 form before this one; the template is outside the loop.
    $data['form']  = call_user_func($ctx['html'], tefl_native_home_cf7('[contact-form-7 id="389046" title="Screening Form"]', $ctx, 1, false));
    $data['url']   = (string) get_permalink();
    $data['title'] = tefl_native_capture(function () {
        single_post_title();
    });
    return $data;
}
