<?php
/**
 * Native template: "TEFL Podcast" (tefl-podcast.php) — /tune-in-with-tefl-podcast/,
 * with its ?pg=N episode paging. The template is three template parts:
 * template-parts/podcast/section-hero.php, section-podcast.php, section-banner.php.
 *
 * GET /<cc>/index.php?rest_route=/tefl/v1/native/tefl-podcast&path=/<cc>/tune-in-with-tefl-podcast/?pg=2&id=104071
 *
 * Returns every value those parts print: the hero image, the current page of
 * episodes (3 per page, the page from `pg` clamped like the template), each
 * episode's Spotify player iframe (built from the embed link exactly as the
 * part does, then Complianz's blocker), the pagination items with the part's
 * add_query_arg() links, the host block, the listen banner and the CTA banner.
 * React: components/pages/podcast/PodcastPage.tsx.
 *
 * @package TEFL Institute
 */

if (!defined('ABSPATH')) {
    exit;
}

tefl_native_pages_register('tefl-podcast', 'tefl_native_tefl_podcast');

function tefl_native_tefl_podcast($id, $ctx) {
    if (get_post_type($id) !== 'page' || get_page_template_slug($id) !== 'tefl-podcast.php') {
        return null;
    }
    tefl_native_pages_front_request($ctx);
    tefl_native_pages_template_context();
    $v    = tefl_native_pages_vals($ctx);
    $s    = 'tefl_native_pages_str';
    $rows = 'tefl_native_pages_rows';

    $primary = tefl_native_pages_attrs(tefl_native_pages_capture('astra_primary_class'));

    // section-hero.php
    $hero = get_field('hero_image');
    if (is_array($hero)) {
        $hero = $hero['url'];
    }

    // section-podcast.php
    $podcasts = get_field('podcasts');
    if (!is_array($podcasts)) {
        $podcasts = array();
    }
    $per_page    = 3;
    $total_pages = (int) ceil(count($podcasts) / $per_page);
    $pg          = isset($ctx['query']['pg']) ? max(1, intval($ctx['query']['pg'])) : 1;
    if ($total_pages > 0 && $pg > $total_pages) {
        $pg = $total_pages;
    }
    $episodes = array();
    foreach (array_slice($podcasts, ($pg - 1) * $per_page, $per_page) as $p) {
        $episodes[] = array(
            'thumb'       => $s($p['podcast_thumbnail'] ?? ''),
            'heading'     => $v['i']($p['podcast_heading'] ?? ''),
            'number'      => $v['i']($p['podcast_number'] ?? ''),
            'note'        => $v['h']($p['podcast_short_note'] ?? ''),
            'player_html' => $v['h'](tefl_native_tefl_podcast_player($p['spotify_embed_link'] ?? '')),
            'link'        => $ctx['href'](tefl_native_txt(esc_url($s($p['podcast_cta_link'] ?? '')))),
        );
    }

    $pages = array();
    if ($total_pages > 1) {
        $url = function ($n) use ($ctx) {
            return $ctx['href'](tefl_native_txt(esc_url(add_query_arg('pg', $n) . '#podcast')));
        };
        $pages[] = $pg > 1 ? array('type' => 'prev', 'url' => $url($pg - 1)) : array('type' => 'prev');
        $show    = array();
        for ($i = 1; $i <= $total_pages; $i++) {
            if ($i == 1 || $i == $total_pages || ($i >= $pg - 1 && $i <= $pg + 1)) {
                $show[] = $i;
            }
        }
        $prev = 0;
        foreach ($show as $n) {
            if ($prev > 0 && $n - $prev > 1) {
                $pages[] = array('type' => 'dots');
            }
            $pages[] = $n == $pg ? array('type' => 'current', 'n' => $n) : array('type' => 'page', 'n' => $n, 'url' => $url($n));
            $prev    = $n;
        }
        $pages[] = $pg < $total_pages ? array('type' => 'next', 'url' => $url($pg + 1)) : array('type' => 'next');
    }

    $host  = $rows(get_field('host_details'));
    $btns  = array();
    foreach ($rows(get_field('cta_button')) as $b) {
        $btns[] = array('icon' => $s($b['cta_icon'] ?? ''), 'text' => $v['i']($b['cta_text'] ?? ''), 'link' => $v['u']($b['cta_link'] ?? ''));
    }

    return array(
        'primary_class' => isset($primary['class']) ? $primary['class'] : 'content-area primary',
        'hero_image'    => tefl_native_txt(esc_url($s($hero))),
        'episodes'      => $episodes,
        'pages'         => $pages,
        'host'          => array(
            'img1'    => $s($host['host_1_image'] ?? ''),
            'name1'   => $v['i']($host['host_1_name'] ?? ''),
            'img2'    => $s($host['host_2_image'] ?? ''),
            'name2'   => $v['i']($host['host_2_name'] ?? ''),
            'heading' => $v['i']($host['heading'] ?? ''),
            'content' => $v['h']($host['content'] ?? ''),
        ),
        'cta_heading'   => $v['i'](get_field('cta_heading')),
        'cta_buttons'   => $btns,
        // section-banner.php
        'banner'        => array(
            'title'    => $v['i'](get_field('banner_title')),
            'subtitle' => $v['i'](get_field('banner_subtitle')),
            'cta_text' => $v['i'](get_field('banner_cta_text')),
            'cta_link' => $v['u'](get_field('banner_cta_link')),
            'gif'      => $s(get_field('banner_cta_gif')),
            'badge'    => $s(get_field('banner_badge')),
        ),
    );
}

/** The Spotify player section-podcast.php builds from an episode's embed link. */
function tefl_native_tefl_podcast_player($embed) {
    $embed = tefl_native_pages_str($embed);
    if (!$embed) {
        return '';
    }
    $embed = trim($embed);
    if (preg_match('/src="([^"]+)"/i', $embed, $src_match)) {
        $embed = $src_match[1];
    }
    $type       = 'episode';
    $episode_id = '';
    $path       = parse_url($embed, PHP_URL_PATH);
    if ($path) {
        $filtered = array();
        foreach (explode('/', trim($path, '/')) as $part) {
            $part = trim($part);
            if (strtolower($part) !== 'embed' && $part !== '') {
                $filtered[] = $part;
            }
        }
        if (count($filtered) >= 2) {
            $episode_id = end($filtered);
            $type       = $filtered[count($filtered) - 2];
        } elseif (count($filtered) === 1) {
            $episode_id = $filtered[0];
        }
    }
    if (empty($episode_id) && preg_match('/spotify\.com\/(?:embed\/)?(episode|track|playlist|show|embed-podcast)\/([a-zA-Z0-9]+)/i', $embed, $m)) {
        $type       = $m[1];
        $episode_id = $m[2];
    }
    if ($episode_id) {
        $episode_id = trim(explode('?', $episode_id)[0]);
    }
    if (!$episode_id) {
        return '';
    }
    return '<iframe
                                        style="border-radius:12px; height: 80px !important; width: 100%;"
                                        src="https://open.spotify.com/embed/' . esc_attr($type) . '/' . esc_attr($episode_id) . '?utm_source=generator"
                                        width="100%"
                                        height="80"
                                        frameBorder="0"
                                        allowfullscreen=""
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy">
                                    </iframe>';
}
