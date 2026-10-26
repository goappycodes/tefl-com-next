/**
 * "TEFL Podcast" — native port of tefl-podcast.php and its parts
 * (template-parts/podcast/section-hero.php, section-podcast.php with ?pg=
 * paging, section-banner.php and its style block). Data: native/tefl-podcast.php.
 */
import { css, html } from "../attrs";

import { STYLES } from "./inline";

type PageItem =
  | { type: "prev" | "next"; url?: string }
  | { type: "dots" }
  | { type: "current"; n: number }
  | { type: "page"; n: number; url: string };

export interface PodcastPageData {
  ok: true;
  path: string;
  country: string;
  primary_class: string;
  hero_image: string;
  episodes: { thumb: string; heading: string; number: string; note: string; player_html: string; link: string }[];
  pages: PageItem[];
  host: { img1: string; name1: string; img2: string; name2: string; heading: string; content: string };
  cta_heading: string;
  cta_buttons: { icon: string; text: string; link: string }[];
  banner: { title: string; subtitle: string; cta_text: string; cta_link: string; gif: string; badge: string };
}

// Printed as entities by the template (kept so the markup matches byte for byte).
const PREV = "&laquo; Prev";
const NEXT = "Next &raquo;";

function Pager({ item }: { item: PageItem }) {
  switch (item.type) {
    case "prev":
      return item.url ? (
        <a href={item.url} className="podcast-page-btn prev-btn" dangerouslySetInnerHTML={html(PREV)} />
      ) : (
        <span className="podcast-page-btn prev-btn disabled" dangerouslySetInnerHTML={html(PREV)} />
      );
    case "next":
      return item.url ? (
        <a href={item.url} className="podcast-page-btn next-btn" dangerouslySetInnerHTML={html(NEXT)} />
      ) : (
        <span className="podcast-page-btn next-btn disabled" dangerouslySetInnerHTML={html(NEXT)} />
      );
    case "dots":
      return <span className="podcast-page-dots">...</span>;
    case "current":
      return <span className="podcast-page-btn active">{item.n}</span>;
    case "page":
      return (
        <a href={item.url} className="podcast-page-btn">
          {item.n}
        </a>
      );
  }
}

export default function PodcastPage({ data }: { data: PodcastPageData }) {
  const h = data.host;
  const b = data.banner;
  return (
    <div id="primary" className={data.primary_class}>
      <section id="podcast-hero">
        <div className="podcast-hero-overlay">
          <img src={data.hero_image} alt="Tune in with TEFL Podcast" />
        </div>
      </section>

      <section id="podcast" className="ptb-60">
        <div className="ast-container">
          <div className="section-header">
            <h1 className="section-title">All Episodes - Tune in with TEFL</h1>
            <p className="section-subtitle entry-title">Listen to all Tune in with TEFL podcast episodes</p>
          </div>

          <div className="podcast-container">
            {data.episodes.map((e, i) => (
              <div key={i} className="podcast-card">
                <div className="card-container">
                  <div className="card-image">
                    <img src={e.thumb} alt="Podcast Episode 1" />
                  </div>
                  <div className="card-content">
                    <h2 className="podcast-title" dangerouslySetInnerHTML={html(e.heading)} />
                    <div className="podcast-number">
                      <span dangerouslySetInnerHTML={html(e.number)} />
                    </div>
                    <div className="podcast-description">
                      <div dangerouslySetInnerHTML={html(e.note)} />
                    </div>
                    <div className="podcast-player">
                      <div className="podcast-player" dangerouslySetInnerHTML={html(e.player_html)} />
                    </div>
                    <a href={e.link} className="spotify-link-block" target="_blank" rel="noopener noreferrer">
                      <div className="podcast-links">
                        <div className="spotify-logo-container">
                          <img src="/wp-content/uploads/2026/06/spotify-logo.png" alt="Spotify logo" className="spotify-logo-img" />
                        </div>
                        <div className="spotify-text-container">
                          <span className="spotify-listen-text">Listen on</span>
                          <img src="/wp-content/uploads/2026/06/spotify-name.png" alt="Spotify" className="spotify-name-img" />
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.pages.length ? (
            <div className="podcast-pagination">
              {data.pages.map((p, i) => (
                <Pager key={i} item={p} />
              ))}
            </div>
          ) : null}

          <div className="podcast-host-container">
            <div className="podcast-host-images">
              <div className="host-image">
                <img src={h.img1} alt="" />
                <p dangerouslySetInnerHTML={html(h.name1)} />
              </div>
              <div className="host-image">
                <img src={h.img2} alt="" />
                <p dangerouslySetInnerHTML={html(h.name2)} />
              </div>
            </div>
            <div className="podcast-host-content">
              <h2 className="section-title" dangerouslySetInnerHTML={html(h.heading)} />
              <div className="entry-content" dangerouslySetInnerHTML={html(h.content)} />
            </div>
          </div>
        </div>
        <div className="podcast-listen-banner">
          <div className="banner-inner">
            {data.cta_heading ? <h3 className="banner-title" dangerouslySetInnerHTML={html(data.cta_heading)} /> : null}
            <div className="banner-buttons">
              {data.cta_buttons.map((c, i) => (
                <a key={i} href={c.link} className="banner-btn">
                  <img src={c.icon} alt="" />
                  <span dangerouslySetInnerHTML={html(c.text)} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="ptb-20" style={css("background-color: #134559")}>
        <div className="ast-container ast-flex ast-align-items-center">
          <div className="ast-col-md-3 teacher-choice">
            <img src={b.badge} alt="" />
          </div>
          <div className="ast-col-md-6 banner-content">
            <div className="cta-gif">
              <img src={b.gif} alt="" />
            </div>
            <div className="cta-content">
              <p className="cta-title" dangerouslySetInnerHTML={html(b.title)} />
              <p className="cta-subtitle" dangerouslySetInnerHTML={html(b.subtitle)} />
            </div>
          </div>
          <div className="ast-col-md-3 banner-cta-btn">
            <a className="cta-btn" href={b.cta_link} dangerouslySetInnerHTML={html(b.cta_text)} />
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={html(STYLES[0])} />
    </div>
  );
}
