/**
 * PPC landing page — native port of the theme's single-ppc.php (styled by
 * ti-single-ppc.css). The CF7 form, the countdown shortcode, the reviews
 * collection and the WooCommerce price HTML are WordPress output; the
 * template's closing inline script is rendered deferred (WpScripts runs it).
 * The video lightbox (lity) and countdown are the theme's shared scripts.
 */
import { css, raw } from "./html";
import type { PpcData } from "./types";

export default function Ppc({ d }: { d: PpcData }) {
  const o = d.origin;
  const c = d.courses;
  return (
    <>
      {d.hero ? (
        <section className="hero-section" style={{ backgroundImage: `url('${d.hero.background}')` }}>
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12 hero">
                <a href="/" className="logo">
                  <img src="https://teflinstitute.com/wp-content/uploads/2021/09/TEFL-Logo-White_Institute.png" />
                </a>
                <h1 {...raw(d.hero.title)} />
                <h2 {...raw(d.hero.subtitle)} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div id="primary" className="content-area primary">
        {d.main ? (
          <section className="section">
            <div className="ast-container">
              <div className="ast-row">
                <div className="ast-col-md-12 main">
                  <h3 className="section-heading" {...raw(d.main.title)} />
                  <h5 className="section-subheading" {...raw(d.main.subtitle)} />
                </div>
              </div>
              <div className="ast-row">
                <div className="ast-col-md-8 form-image">
                  <div className="image" style={{ backgroundImage: `url('${d.main.image}')` }}>
                    <div className="overlay" style={{ backgroundColor: d.main.overlay_color }}>
                      <div className="title-subtitle">
                        <div className="title" {...raw(d.main.overlay_title)} />
                        <div className="subtitle" {...raw(d.main.overlay_sub)} />
                      </div>
                      <div className="small" {...raw(d.main.overlay_small)} />
                    </div>
                  </div>
                </div>
                <div className="ast-col-md-4 form-cointainer" {...raw(d.main.form_html)} />
              </div>
            </div>
          </section>
        ) : null}

        {d.accreditations ? (
          <section className="section">
            <div className="ast-container">
              <div className="ast-row">
                <div className="ast-col-md-12 main">
                  <h3 className="section-heading accreditations" {...raw(d.accreditations.title)} />
                  <div className="desktop">
                    <img src={d.accreditations.desktop} />
                  </div>
                  <div className="mobile">
                    <img src={d.accreditations.mobile} />
                  </div>
                  <div className="points">
                    {d.accreditations.points.map((p, i) => (
                      <div key={i} className="point" {...raw(p)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {c ? (
          <>
            <section className="section">
              <div className="ast-container">
                <div className="ast-row">
                  <div className="ast-col-md-12 main">
                    <h2 {...raw(c.title)} />
                    <h4 {...raw(c.subtitle)} />
                    <div className="countdown-timer-container" {...raw(c.timer_html)} />
                    <div className="main-container">
                      {c.rows.map((t, i) => (
                        <div
                          key={i}
                          className="course"
                          style={css(
                            `${t.popular ? ` outline: 6px solid ${t.theme}80; border-radius: 8px; ` : ""}border: 1px solid ${t.theme}`,
                          )}
                        >
                          {t.popular ? (
                            <div className="most-popular-icon" style={{ backgroundImage: `url(${c.most_popular})` }} />
                          ) : null}
                          <div className="course-heading" style={{ backgroundColor: t.theme }}>
                            <div className="title" {...raw(t.title)} />
                            <div className="subtitle" {...raw(t.subtitle)} />
                          </div>
                          <div className="course-thumbnail" style={{ backgroundImage: `url('${t.thumbnail}')` }} />
                          <div className="course-text" {...raw(t.jobs_text)} />
                          <div className="course-product">
                            <div className="stars" {...raw(`<img src="${o}/wp-content/uploads/2023/04/review-stars.png"><span>(${t.stars})</span>`)} />
                            <div className="price" {...raw(`${t.price_html}<div class="save">Save ${t.percentage}%</div>`)} />
                            <div className="labels">
                              {t.labels.map((l, j) => (
                                <div key={j} className="label" {...raw(l)} />
                              ))}
                            </div>
                            <div className="book-link">
                              <a href={t.book} className="book-now">
                                <span>Book Now</span>
                                <i className="fa fa-angle-right" />
                              </a>
                            </div>
                            <div className="learn-more-link">
                              <a href={t.learn_more} className="learn-more-now">
                                <span>Learn More</span>
                                <i className="fa fa-angle-right" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="wp-posts" className="section">
              <div className="ast-container">
                <div className="ast-row">
                  {c.extras.map((e, i) => (
                    <div key={i} className="ast-col-md-12 post-col">
                      <div className="ast-row post-row" style={{ backgroundImage: `url(${e.background})` }}>
                        <div className="ast-col-md-6 post-content-col">
                          <div className="post-content-div">
                            <div className="title-div" {...raw(`<p class="title"><span>${e.title}</span></p><p class="subtitle"><span>${e.subtitle}</span></p>`)} />
                            <div className="meta-register-div">
                              <div className="register-div">
                                <a className="button ptefl-button" href={e.learn_more}>
                                  Learn More
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="tefl-video-section">
              <h3 className="section-heading">TEFL Institute Graduate Testimonials</h3>
              <div className="ast-container">
                <div className="ast-row tefl-video-row">
                  {c.videos.map((v, i) => (
                    <div
                      key={i}
                      className="ast-col-lg-6 ast-col-md-6 ast-col-sm-12 ast-col-xs-12 tefl-video-col tefl-video-col-1"
                      style={{ backgroundImage: `url('${v.image}')` }}
                    >
                      <a href={`https://youtu.be/${v.youtube}`} data-lity="" className="video-caption-link lity-video">
                        <div className="vide-caption-box">
                          <span className="video-caption-text" {...raw(v.caption)} />
                          <span className="video-icon ">
                            <img src={`${o}/wp-content/uploads/2021/10/Play-button.svg`} />
                          </span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="ast-row reviews">
              <h3 className="section-heading">Verifed Reviews</h3>
              <div
                className="ast-col-md-12"
                {...raw(
                  `<div class="review-banner" style="background-image:url('https://teflinstitute.com/wp-content/uploads/2020/11/Group-326.jpg')"></div>${c.reviews_html}`,
                )}
              />
            </div>
          </>
        ) : null}

        {d.sale ? (
          <section className="section">
            <div className="ast-container">
              <div className="ast-row limited-time-only">
                <h2 className="" {...raw(d.sale.title)} />
                <h3 className="" {...raw(d.sale.subtitle)} />
                <div className="points">
                  {d.sale.points.map((p, i) => (
                    <div key={i} className="point" {...raw(p)} />
                  ))}
                </div>
                <h3 className="" {...raw(d.sale.heading)} />
                <a href={d.sale.link} className="call-to-action">
                  <span {...raw(d.sale.value)} />
                  <i className="fa fa-angle-right" />
                </a>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <script type="text/tefl-deferred" {...raw(d.script)} />
    </>
  );
}
