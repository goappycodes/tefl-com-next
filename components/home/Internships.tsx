/**
 * Internships overview — native port of page-internships.php
 * (/tefl-internships/). Same markup as the PHP template; the theme JS (lity
 * video popups, CF7, Instagram feed, WCPBC price refresh) drives it
 * unchanged. Data from `tefl/v1/native/internships`.
 */
import type { InternshipsData } from "./types";
import { css, esc, h } from "./util";

const BREADCRUMB = JSON.stringify({
  "@context": "https://schema.org/",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://teflinstitute.com/" },
    { "@type": "ListItem", position: 2, name: "TEFL Internships", item: "https://teflinstitute.com/tefl-internships/" },
  ],
});

const CHECK =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"/></svg>';

export default function Internships({ data: d }: { data: InternshipsData }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={h(BREADCRUMB)} />
      <div id="primary" className={d.primary_class}>
        <div className="banner-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-lg-12">
                <div className="badge-container">
                  <div className="badge" style={css(`background-image: url('${d.hero.badge}')`)} />
                </div>
                <div className="course-banner" style={css(`background-image: url('${d.hero.image}')`)}>
                  <div className="ast-col-lg-6 ast-col-md-8">
                    <div className="banner-content-block">
                      <div className="content-block">
                        <h2 className="title" dangerouslySetInnerHTML={h(d.hero.title)} />
                        <h2 className="subtitle" dangerouslySetInnerHTML={h(d.hero.subtitle)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="our-internsips-section">
          <div className="ast-container">
            <div className="ast-row">
              <h1 dangerouslySetInnerHTML={h(d.ours.main_title)} />
              <div className="ast-col-lg-6">
                <h2 dangerouslySetInnerHTML={h(d.ours.title)} />
                <div className="content" dangerouslySetInnerHTML={h(d.ours.content)} />
              </div>
              <div className="ast-col-lg-6">
                <div className="included-container">
                  <h3 dangerouslySetInnerHTML={h(d.ours.included_title)} />
                  {d.ours.included.map((item, i) => (
                    <div key={i} className="item" dangerouslySetInnerHTML={h(CHECK + item)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="internships-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-lg-12">
                <h2>Paid TEFL Internships</h2>
                <div className="ast-row ast-flex">
                  {d.cards.map((c, i) => (
                    <div key={i} className="ast-col-lg-4">
                      <div className="internship">
                        <div className="image" style={css(`background-image: url('${c.image}')`)}>
                          <div className="country" dangerouslySetInnerHTML={h(c.country)} />
                          <div className="country_subtitle">Paid Internship</div>
                        </div>
                        <div className="content">
                          <div className="price" suppressHydrationWarning dangerouslySetInnerHTML={h(c.price)} />
                          <div className="benefits">
                            <h2>Top Benefits:</h2>
                            {c.benefits.map((b, j) => (
                              <div key={j} className="benefit" dangerouslySetInnerHTML={h(`<i class="fa fa-circle"></i>${b}`)} />
                            ))}
                          </div>
                          <a href={c.link} className="learn_more">
                            Learn More
                          </a>
                        </div>
                        <div className="guide" style={{ display: "none" }}>
                          <img src={c.guide_image} />{" "}
                          <a href={c.guide_link} className="learn_more">
                            Download Guide
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="discover-graphics">
          <div className="left" />
          <div className="right" />
        </div>
        <div className="discover-top-destinations-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <div className="discover-top-destination">
                  <h2>Discover the Top TEFL Destinations for 2026</h2>
                  <div className="discover-top-destination-form" suppressHydrationWarning dangerouslySetInnerHTML={h(d.discover)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="more-details-section">
          <div className="ast-container">
            <div className="ast-row">
              {(["left", "right"] as const).map((k) => (
                <div key={k} className="ast-col-lg-6">
                  <img src={d.more[k].icon} />
                  <h2 className="content" dangerouslySetInnerHTML={h(d.more[k].title)} />
                  <div className="content" dangerouslySetInnerHTML={h(d.more[k].content)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tefl-video-section">
          <div className="ast-container">
            <h2>Life Abroad Interns Highlights:</h2>
            <div className="ast-row tefl-video-row">
              {d.videos.map((v, i) => (
                <div
                  key={i}
                  className="ast-col-lg-6 ast-col-md-6 ast-col-sm-12 ast-col-xs-12 tefl-video-col tefl-video-col-1"
                  style={css(`background-image:url('${v.image}')`)}
                >
                  <a href={v.link} data-lity="" className="video-caption-link lity-video">
                    <div className="vide-caption-box">
                      <span className="video-caption-text" dangerouslySetInnerHTML={h(v.name)} />{" "}
                      <span className="video-icon">
                        <div className="video-length" dangerouslySetInnerHTML={h(v.length)} />
                      </span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="feed-contact">
          <div className="ast-container">
            <div className="ast-row">
              <div
                className="ast-col-md-6"
                suppressHydrationWarning
                dangerouslySetInnerHTML={h(`<h3>Instagram Feed</h3>\n<p>Follow us on Instagram for the latest news and updates</p>\n${d.insta}`)}
              />
              <div className="ast-col-md-6">
                <div className="contact">
                  <div
                    className="learn-more-form"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={h(
                      `<div class="form-head-row"><p>Are you interested in this internship &amp; you would like to learn more? Request a priority call with one of our internships experts about this opportunity.</p>${
                        d.advisor ? `<img class="form-img" src="${esc(d.advisor)}">` : ""
                      }</div>${d.learn}`,
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uses jQuery, so it runs with the theme scripts (deferred, like every executable script in the render). */}
        <script
          type="text/tefl-deferred"
          suppressHydrationWarning
          dangerouslySetInnerHTML={h(
            `\n\t\t\n\t\t\tvar page_url = "${d.script.url}";\n\t\t\tvar page_title = "${d.script.title}";\n\n\t\t\tjQuery(document).ready(function($) {\n\t\t\t\t$("#page_url").val(page_url);\n\t\t\t\t$("#page_title").val(page_title);\n\t\t\t});\n\t\t\t\n\t\t`,
          )}
        />

        <div className="blogs-section life-story-abroad tefl-advice-sec">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h2>Journal</h2>
              </div>
              {d.journal.map((a, i) => (
                <div key={i} className="ast-col-md-4">
                  <div className="blog-item" style={css(`background: url('${a.thumb}')`)}>
                    <div className="blog-content">
                      <h3>{a.title}</h3>
                      <a className="blog-link" href={a.link}>
                        READ MORE <i className="fa fa-angle-right" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
