/**
 * Single internship — native port of single-internship.php's 2023 design,
 * ti-single-internship-template-new2023.php (every published internship has
 * `is_internship_new_design`; the older ti-single-internship-template.php is
 * unused and stays on the passthrough).
 *
 * Same markup as the PHP template; the theme JS (gallery lightbox, content
 * nav, accordions, countdown timer, deposit form, variation form, guide
 * popup, reviews slider, CF7) drives it unchanged. Data from
 * `tefl/v1/native/internship` (wordpress/headless/native/internship.php).
 */
import { RI_SCRIPT, RI_STYLE } from "./internship-ri";
import type { InternshipData } from "./types";
import { css, esc, h } from "./util";

export default function Internship({ data }: { data: InternshipData }) {
  const d = data;
  if (!d.hero) return <div id="primary" className={d.primary_class} />;
  const hero = d.hero;
  const sb = d.sidebar!;
  const admin = d.is_admin ? "is-admin" : "";
  return (
    <div id="primary" className={d.primary_class}>
      {/* Hero Banner Section */}
      <section className="hero-banner-section" style={css(`background:url('${hero.image}')`)}>
        {hero.logo ? <img data-test={d.id} src={hero.logo} className="internship-banner-logo" alt="" /> : null}
        {hero.alt_logo ? <img data-test={d.id} src={hero.alt_logo} className="alt-internship-banner-logo internship-banner-logo" alt="" /> : null}
        <div className="float-bottom">
          <div className="ast-container">
            <div className="ast-row">
              <div className="hero-banner-section__content">
                <div className="ast-col-md-8">
                  <h2 className="hero-banner-section__subtitle" dangerouslySetInnerHTML={h(hero.subtitle)} />
                  <h1 className="hero-banner-section__title" dangerouslySetInnerHTML={h(hero.title)} />
                </div>
                <div className="ast-col-md-4">
                  {hero.cta ? (
                    <div className="hero-banner-section__cta">
                      <a href="#" className="open-gallery-btn">
                        <img src={hero.cta.icon} alt="" /> <span dangerouslySetInnerHTML={h(hero.cta.text)} />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {d.gallery ? (
        <section className="image-gallery" style={{ display: "none" }}>
          <div className="image-gallery-overlay" />
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <div className="image-gallery_container">
                  {d.gallery.map((img, i) => (
                    <a key={i} href={img}>
                      <img src={img} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Content Navigation */}
      <section className={`content-nav-menu-section content-nav-menu-section-desktop ${admin}`}>
        <div className="nav-wrapper">
          <div className="ast-container">
            <div className="ast-row ">
              <ul className="content-nav-menu">
                {d.nav!.map(([href, label]) => (
                  <li key={href} className="content-nav-menu__item">
                    <a href={href} className="content-nav-menu__link">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {d.is_admin ? (
        <div className="content-nav-menu-section content-nav-menu-section-mobile" style={{ display: "none" }}>
          <div className="nav-wrapper">
            <div className="glide nav-menu-glide">
              <div className="glide__track" data-glide-el="track">
                <ul className="glide__slides">
                  {d.nav!.map(([href, label], i) => (
                    <li key={href} className={i === 0 && href === "#overview" ? " glide__slide" : "glide__slide"}>
                      <a href={href} className="glide-nav-link">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="internship-content-container">
        <div className="ast-container">
          <div className="ast-row ast-flex sticky-sidebar__container ">
            <div className="ast-col-md-4">
              <div className={`sticky-sidebar ${admin}`}>
                <div className="sticky-sidebar__top">
                  {sb.alerts ? (
                    <>
                      <h3 className="content-section__heading" dangerouslySetInnerHTML={h(`Paid Internship in ${sb.alerts.country}`)} />
                      <p>
                        This internship is unavailable at the moment. If you wish to stay updated, sign up to the alert below and we will
                        notify you when it is available.
                      </p>
                      <a href={sb.alerts.link} className="btn btn-primary">
                        Register for Alerts
                      </a>
                    </>
                  ) : (
                    <>
                      {sb.timer !== null ? (
                        <div className="internship-timer-new" suppressHydrationWarning dangerouslySetInnerHTML={h(sb.timer)} />
                      ) : null}
                      {sb.ri !== null ? (
                        <>
                          <div className="sidebar-title">Interested in this programme?</div>
                          <div className="sidebar-menu-book-now">
                            <a href="#ri-form-modal" data-lity="" className="button book-now-btn ri-register-btn">
                              <span>Register Your Interest</span>
                              <i className="fa fa-angle-right" />
                            </a>
                          </div>
                          <div
                            id="ri-form-modal"
                            className="lity-hide ri-form-popup"
                            aria-hidden="true"
                            suppressHydrationWarning
                            dangerouslySetInnerHTML={h(
                              `<h3 class="ri-form-popup__title">Register Your Interest</h3><p class="ri-intro">Tell us a little about yourself and we'll be in touch about this programme.</p>${sb.ri}`,
                            )}
                          />
                          <style dangerouslySetInnerHTML={h(RI_STYLE)} />
                          {/* Self-contained (document listeners only): runs at parse time, as on live. */}
                          <script dangerouslySetInnerHTML={h(RI_SCRIPT)} />
                        </>
                      ) : (
                        <>
                          <div className="sidebar-title">Upcoming Start Dates</div>
                          {sb.book !== null ? (
                            <div className="sidebar-menu-book-now" suppressHydrationWarning dangerouslySetInnerHTML={h(sb.book)} />
                          ) : null}
                        </>
                      )}
                    </>
                  )}
                  {sb.screening ? <a href={sb.screening.link} className=" screening-btn " dangerouslySetInnerHTML={h(sb.screening.text)} /> : null}
                </div>
                <div className="sticky-sidebar__bottom">
                  <h4 className="sticky-sidebar__bottom-heading">verified student reviews</h4>
                  <Stars average={d.reviews!.average} />
                  <div className="total-count-text">{`Out of ${d.reviews!.total} global reviews`}</div>
                  <div className="reviews-summary">
                    {d.reviews!.bars.map((b) => (
                      <div key={b.star} className="review-status">
                        <div className="progress-text">{`${b.star} Star`}</div>
                        <div className="progress">
                          <div className="progress-bar" {...{ percent: b.pct }} />
                        </div>
                        <div className="progress-value">{`${b.pct}%`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="ast-col-md-8">
              {d.summary ? (
                <div className="internship-summary">
                  <h2 className="internship-summary__title" dangerouslySetInnerHTML={h(d.summary.title)} />
                  <h3 className="internship-summary__subtitle" dangerouslySetInnerHTML={h(d.summary.subtitle)} />
                  <div className="internship-summary__details" dangerouslySetInnerHTML={h(d.summary.details)} />
                  {d.summary.video ? (
                    <div className="internship-summary__video" style={css(`background: url('${d.summary.video.thumb}');`)}>
                      <a href={`https://youtu.be/${d.summary.video.id}`} data-lity="" className="video-caption-link clickbox lity-video" />{" "}
                      <span className="video-icon ">
                        <img src={`${d.wp}/wp-content/uploads/2021/10/Play-button.svg`} />
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {d.overview ? (
                <section id={d.overview.id} className="content-section section-padding-top">
                  <h2 className="content-section__heading" dangerouslySetInnerHTML={h(d.overview.title)} />
                  <div className="content-section__body" dangerouslySetInnerHTML={h(d.overview.summary)} />
                </section>
              ) : null}
              {d.essentials ? (
                <section id="tripInfo" className="essential-informations section-margin-top">
                  <h3 className="essential-informations__heading">{`Essential information ${d.essentials.suffix}`}</h3>
                  {d.essentials.items.map((it, key) => (
                    <details key={key} className="essential_information__accordion" open={key === 0}>
                      <summary dangerouslySetInnerHTML={h(`${it.title} <i class="fa fa-angle-down"></i>`)} />
                      <div className="content">
                        <ul className="essential_information__list">
                          {it.list.map((li, i) => (
                            <li key={i} dangerouslySetInnerHTML={h(li)} />
                          ))}
                        </ul>
                      </div>
                    </details>
                  ))}
                </section>
              ) : null}
            </div>
          </div>
        </div>
        {d.eligibility ? (
          <div
            className="section-margin-top full-section eligibility-checker-section"
            style={css(`background-image: url('${d.eligibility.bg}');`)}
          >
            <div className="ast-container">
              <div className="ast-row">
                <div className="ast-col-md-8 ast-col-md-offset-4">
                  <div className="eligibility-checker">
                    <h3 className="eligibility-checker__title" dangerouslySetInnerHTML={h(d.eligibility.title)} />
                    <div className="eligibility-checker__summary" dangerouslySetInnerHTML={h(d.eligibility.content)} />
                    <a href={d.eligibility.link} className="button" dangerouslySetInnerHTML={h(d.eligibility.text)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-4 empty-row" />
            <div className="ast-col-md-8 ast-col-md-offset-4">
              {d.itinerary ? (
                <section id="itinerary" className="content-section section-padding-top">
                  <h3 className="content-section__heading" dangerouslySetInnerHTML={h(d.itinerary.title)} />
                  <div className="content-secton__body">
                    <div className="content-section__body-wrapper">
                      {d.itinerary.timeline.map((t, key) => (
                        <div key={key} className="accordion itinerary-accordion">
                          <input className="accordion__trigger" id={`accordion-drawer-${key}`} type="checkbox" defaultChecked={key === 0} />
                          <label className="accordion__title" htmlFor={`accordion-drawer-${key}`}>
                            <span className="accordion__title-day" dangerouslySetInnerHTML={h(t.day)} />{" "}
                            <span className="accordion__title-text" dangerouslySetInnerHTML={h(t.title)} />
                          </label>
                          <div className="accordion__content-wrapper">
                            <div className="accordion__content" dangerouslySetInnerHTML={h(t.desc)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null}
              {d.testimonials ? (
                <section id="testimonials" className="content-section section-padding-top">
                  <h3 className="content-section__heading" dangerouslySetInnerHTML={h(d.testimonials.header)} />
                  <div className="content-section_body testimonials">
                    {d.testimonials.interns.map((t, i) => (
                      <div key={i} className="testimonial-card">
                        <a href={t.link} className="clickbox" />
                        <div className="testimonia-card__left">
                          <img src={t.image} alt="" className="testimonial-card__image" />
                          <h4 className="testimonial-card__title" dangerouslySetInnerHTML={h(t.name)} />
                        </div>
                        <div className="testimonial-card__right">
                          <div className="testimonial-card__content" dangerouslySetInnerHTML={h(t.content)} />
                          <a href={t.link} className="testimonial-card__link">
                            Read More
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
        {d.banner1 ? (
          <div
            className="section-margin-top full-section full-image-banner"
            style={css(
              `background-image: url('${d.banner1}'); height: 500px;background-size: cover;background-repeat: no-repeat;background-position: center;`,
            )}
          />
        ) : null}
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-4 empty-row" />
            <div className="ast-col-md-8">
              {d.location ? (
                <section id="locations" className="location-section content-section section-padding-top">
                  <h3 className="content-section__heading">Locations</h3>
                  <div className="content-section__body">
                    <div className="location-section__summary" dangerouslySetInnerHTML={h(d.location.summary)} />
                    <div className="location-section__map">
                      <img src={d.location.map} alt="" />
                    </div>
                    <div className="location-section__size-availability">
                      <div className="location-section__size">
                        <span>Group size</span> <span dangerouslySetInnerHTML={h(d.location.group_size)} />
                      </div>
                      <div className="location-section__availability">
                        <span>availability</span> <span dangerouslySetInnerHTML={h(d.location.availability)} />
                      </div>
                    </div>
                    <div
                      className="location-section__form"
                      suppressHydrationWarning
                      dangerouslySetInnerHTML={h(
                        `<h3 class="content-section__heading">${d.location.form_title}</h3>` +
                          `<div class="location-section__form-summary">If you are interested in teaching English in ${d.location.country} and would like to learn more, request a call with one of our experienced travel advisors about this opportunity.</div>` +
                          `<img class="location-section__form-image" src="${esc(d.location.form_image)}"/>` +
                          d.location.cf7,
                      )}
                    />
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>

        {/* Uses jQuery, so it runs with the theme scripts (deferred, like every executable script in the render). */}
        <script
          type="text/tefl-deferred"
          suppressHydrationWarning
          dangerouslySetInnerHTML={h(
            `\n            var page_url = "${d.script!.url}";\n            var page_title = "${d.script!.title}";\n\n            jQuery(document).ready(function($) {\n                $("#page_url").val(page_url);\n                $("#page_title").val(page_title);\n            });\n        `,
          )}
        />

        {d.banner2 ? (
          <div
            className="section-margin-top full-section full-image-banner"
            style={css(
              `background-image: url('${d.banner2}'); height: 500px;background-size: cover;background-repeat: no-repeat;background-position: bottom;`,
            )}
          />
        ) : null}
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-4 empty-row" />
            <div className="ast-col-md-8">
              {d.how ? (
                <section id="howItWorks" className="how-it-works-section content-section section-padding-top">
                  <h3 className="content-section__heading" dangerouslySetInnerHTML={h(d.how.title)} />
                  <div className="content-section__body">
                    <div className="how-it-works-section__summary" dangerouslySetInnerHTML={h(d.how.summary)} />
                    <div className="straigh-line" />
                    <div className="how-it-works-section__steps">
                      {["Apply", "Interview", "Documents", "Teach"].map((step, i) => (
                        <div key={step} className="step">
                          <span className="step__number">{i + 1}</span>
                          <div className="step__text">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {d.how.guide ? (
                    <div id="guide" className="internship-guide" data-guide-popup={d.how.guide.popup}>
                      <h3 className="content-section__heading" dangerouslySetInnerHTML={h(d.how.guide.title)} />
                      <div className="internship-guide__summary" dangerouslySetInnerHTML={h(d.how.guide.content)} />
                      <img src={d.how.guide.image} alt="" className="internship-guide__image" />{" "}
                      <a href={d.how.guide.link} className="guide-link button" dangerouslySetInnerHTML={h(d.how.guide.text)} />
                    </div>
                  ) : null}
                </section>
              ) : null}
              {d.excursions ? (
                <section id="excursions" className="excursions-section content-section section-padding-top">
                  <h3 className="excursions-section__heading content-section__heading" dangerouslySetInnerHTML={h(d.excursions.title)} />
                  <div className="content-section__body">
                    <div className="excursions-section__summary" dangerouslySetInnerHTML={h(d.excursions.summary)} />
                    <div className="excursions-section__excursions">
                      {d.excursions.items.map((e, i) => (
                        <div key={i} className="excursion-card">
                          <div className="excursion-card__left">
                            <img src={e.image} alt="" className="excursion-card__image" />
                            <h4 className="excursion-card__image-title" dangerouslySetInnerHTML={h(e.image_title)} />
                          </div>
                          <div className="excursion-card__right">
                            <h4 className="excursion-card__title" dangerouslySetInnerHTML={h(e.title)} />
                            <div className="excursion-card__details" dangerouslySetInnerHTML={h(e.content)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
        {d.students ? (
          <section className="students-review section-margin-top">
            <div className="ast-container">
              <div className="ast-row ast-flex students-review-row">
                <div className="ast-col-md-12">
                  <div className="students-review__content">
                    <h3 className="students-review__content-heading content-section__heading">verified student reviews</h3>
                    <Stars average={d.reviews!.average} />
                    <div className="total-count-text">{`Out of ${d.reviews!.total} global reviews`}</div>
                    <div className="students-review__content-slider" suppressHydrationWarning dangerouslySetInnerHTML={h(d.students.slider)} />
                  </div>
                </div>
                <div className="button-container text-center">
                  <a
                    target="_blank"
                    href="https://search.google.com/local/reviews?placeid=ChIJR8_41hsMZ0gR2i2CJcrWIf8"
                    className="read-more-reviews"
                  >
                    read all reviews
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {d.learn ? (
          <section className="learn-more-section">
            <div className="ast-container">
              <div className="ast-row ">
                <div className="ast-col-md-7">
                  <h2 className="learn-more-section__heading" dangerouslySetInnerHTML={h(d.learn.heading)} />
                  <div className="learn-more-section__summary" dangerouslySetInnerHTML={h(d.learn.summary)} />
                </div>
                <div className="ast-col-md-5">
                  <a className="learn-more-section__btn btn-black btn" href={d.learn.link} dangerouslySetInnerHTML={h(d.learn.text)} />
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function Stars({ average }: { average: string }) {
  return (
    <div className="rating-div">
      <i className="fa fa-star" /> <i className="fa fa-star" /> <i className="fa fa-star" /> <i className="fa fa-star" />{" "}
      <i className="fa fa-star-half-empty" /> <span className="course-review-count">{`(${average})`}</span>
    </div>
  );
}
