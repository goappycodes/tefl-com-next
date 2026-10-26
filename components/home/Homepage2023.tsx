/**
 * Homepage Template 2023 — native port of the theme's
 * ti-homepage-template-2023.php (the front page and the per-market city home
 * pages). Same markup and class names as the PHP template, so the theme CSS
 * styles it and the theme JS (hero slider, read-more, course search, Glide
 * video slider, jobs slider, FAQ accordion, CTA card expanders, WCPBC price
 * refresh, CF7) drives it unchanged. Data from `tefl/v1/native/homepage2023`
 * (wordpress/headless/native/homepage2023.php), which resolves every value
 * the template computes.
 *
 * Where the template wraps raw ACF/shortcode HTML together with its own tags in
 * one element, that element's inner HTML is built as a string so the DOM is
 * exactly the template's (no wrapper elements).
 */
import InlineScript from "./InlineScript";
import type { CourseCard, CtaSection, HeroSlide, Homepage2023Data, ReadMore } from "./types";
import { btnVars, css, esc, h } from "./util";

export default function Homepage2023({ data }: { data: Homepage2023Data }) {
  const wp = data.wp;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={h(data.org_schema)} />
      <div id="primary" className={data.primary_class}>
        {/* New Hero Banner Section */}
        <div className="full-width-slider-new">
          {data.slides.map((s) => (
            <Slide key={s.key} s={s} />
          ))}
        </div>
        {data.mobile_bg.length ? (
          <style
            dangerouslySetInnerHTML={h(
              `@media screen and (max-width:768px) { ${data.mobile_bg
                .map(
                  (m) =>
                    `section.banner-slide.banner-slide-${m.key} { background: url('${m.url}') no-repeat center center !important; background-size: cover !important; } `,
                )
                .join("")}}`,
            )}
          />
        ) : null}

        <section className="pt-2 banner-logo-container-mobile">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                {data.mobile_logo ? (
                  data.mobile_logo.link ? (
                    <a href={data.mobile_logo.link}>
                      <img src={data.mobile_logo.src} className="no-lazy" alt="" />
                    </a>
                  ) : (
                    <img src={data.mobile_logo.src} className="no-lazy" alt="" />
                  )
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {data.cta ? <Cta cta={data.cta} /> : null}

        {data.webinars ? (
          <section className="webinar-cta-section pt-5">
            <div className="ast-container">
              <div className="ast-row">
                <div className="ast-col-md-12">
                  <p
                    className="large-heading double-underline common-section-heading webinar-cta-section__title"
                    dangerouslySetInnerHTML={h(data.webinars.title)}
                  />
                  <span
                    className="webinar-cta-section__subtitle common-subheading"
                    dangerouslySetInnerHTML={h(data.webinars.subtitle)}
                  />
                </div>
              </div>
              <div className="ast-row ast-flex cta-card-container">
                <div className="ast-col-md-12 spacer-column" />
                {data.webinars.list.map((w, i) => (
                  <div key={i} className="ast-col-md-6">
                    <div className="webinbar-cta-card" style={css(`background:url('${w.image}')`)}>
                      <div className="webinar-cta-card__content">
                        <h2 className="small-heading webinar-cta-card__content-title font-600" dangerouslySetInnerHTML={h(w.title)} />
                        <div className="webinar-cta-card__content-summary my-2">
                          <div className="webinar-location">
                            <p className="font-500">Location</p>
                            <span className="font-300" dangerouslySetInnerHTML={h(w.location)} />
                          </div>
                          <div className="webinar-date">
                            <p className="font-500">Date</p>
                            <span className="font-300" dangerouslySetInnerHTML={h(w.date)} />
                          </div>
                          <div className="webinar-time">
                            <p className="font-500">Time</p>
                            <span className="font-300" dangerouslySetInnerHTML={h(w.time)} />
                          </div>
                        </div>
                        <a
                          style={css(`--webinar-cta-btn-color: ${data.webinars!.btn[0]}; --webinar-cta-btn-bg: ${data.webinars!.btn[1]};`)}
                          href={data.webinars!.register}
                          className="webinar-cta-card-btn btn btn-small-centered btn-secondary"
                          target="_blank"
                        >
                          register now
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="ast-col-md-6 tefl-ai-block-wrapper">
                  <a href="https://tefl.ai/" target="blank">
                    <div className="tefl-ai-block" style={css(`background:url('${wp}/wp-content/uploads/2025/10/tefl-ai.png')`)} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="tefl-ai-section pt-5">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-6">
                <p
                  className="large-heading double-underline common-section-heading course-cta-section__title"
                  dangerouslySetInnerHTML={h(data.ai_app.ai_title)}
                />
                <a href="https://tefl.ai/" target="_blank" className="teflai-cta">
                  <img src={`${wp}/wp-content/uploads/2025/03/tefl-ai.gif`} alt="" />
                </a>
              </div>
              <div className="ast-col-md-6">
                <div className="flex-box app-download-cta-box">
                  <div className="app-download-cta">
                    <p className="large-heading common-section-heading" dangerouslySetInnerHTML={h(data.ai_app.app_title)} />
                    <span className="course-cta-section__subtitle font-400" dangerouslySetInnerHTML={h(data.ai_app.app_text)} />
                    <div className="app-download-cta__icons flex-box">
                      <a href="https://play.google.com/store/apps/details?id=com.teflinstitute.teflinstitute">
                        <img src={`${wp}/wp-content/uploads/2025/07/google-app-store.webp`} />
                      </a>{" "}
                      <a href="https://apps.apple.com/app/id1568312366">
                        <img src={`${wp}/wp-content/uploads/2025/07/apple-app-store.webp`} />
                      </a>
                    </div>
                  </div>
                  <div className="app-download-image">
                    <img src={data.ai_app.app_image} alt="" />
                    <span>
                      <img src={`${wp}/wp-content/uploads/2025/07/download-icon.png`} alt="" /> 1k+ downloads.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {data.videos ? (
          <section className="video-testimoinials-section pt-5">
            <div className="ast-container">
              <div className="ast-row">
                <div className="ast-col-md-12">
                  <h3
                    className="large-heading double-underline common-section-heading video-testimonials-section__title"
                    dangerouslySetInnerHTML={h(data.videos.title)}
                  />
                  <span className="video-testimonials-section__subtitle common-subheading " dangerouslySetInnerHTML={h(data.videos.subtitle)} />
                </div>
                <div className="ast-col-md-12 video-testimonials-section__slider pt-2">
                  <div className="glide video-testimoinials__glide">
                    <div className="glide__track" data-glide-el="track">
                      <ul className="glide__slides">
                        {data.videos.items.map((t, i) => (
                          <li key={i} className="glide__slide">
                            <div className="video-testimonial-card">
                              <a href={t.video} className="popup-video-review">
                                <div className="video-testimonial-card_image-container">
                                  <img src={t.thumb} alt="" className="video-testimonial-card__image no-lazy" />{" "}
                                  <img className="play-btn no-lazy" src={`${wp}/wp-content/uploads/2020/11/play-btn.svg`} />
                                </div>
                                <p className="video-testimonial-card__title" dangerouslySetInnerHTML={h(t.name)} />
                                <p className="video-testimonial__subtitle" dangerouslySetInnerHTML={h(t.role)} />
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glide__arrows" data-glide-el="controls">
                      <button className="glide__arrow glide__arrow--left" data-glide-dir="<">
                        <i className="fa fa-angle-left" />
                      </button>{" "}
                      <button className="glide__arrow glide__arrow--right" data-glide-dir=">">
                        <i className="fa fa-angle-right" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {data.jobs ? (
          <section className="jobs-section">
            <div className="ast-container">
              <div className="ast-row ast-flex ast-align-items-flex-end">
                <div className="ast-col-md-8">
                  <div className="header-wrapper">
                    <h3
                      className="large-heading double-underline common-section-heading jobs-section__title"
                      dangerouslySetInnerHTML={h(
                        `${data.jobs.title} <a href="https://jobs.teflinstitute.com/?ref=com" target="_blank" class="jobs-link d-none" style="--btn-text-color:${esc(data.jobs.btn[0])};--btn-bg-color:${esc(data.jobs.btn[1])}">${JOBS_ARROW}</a>`,
                      )}
                    />
                  </div>
                  <span className="jobs-section__subtitle common-subheading" dangerouslySetInnerHTML={h(data.jobs.subtitle)} />
                </div>
                <div className="ast-col-md-4">
                  <div className="pdf-download-area ">
                    <h3>Comparative employment guide for TEFL teachers</h3>
                    <a target="_blank" href={`${wp}/wp-content/uploads/2024/07/TEFL-Insitute-Job-Comparison-Guide.pdf`} className="btn btn-primary btn-centered">
                      Download your copy
                    </a>{" "}
                    <a target="_blank" href="https://tefl.ai/" className="btn btn-primary btn-centered tefl-ai-btn">
                      TEFL job market explorer
                    </a>
                  </div>
                </div>
              </div>
              <div className="ast-row">
                <div className="ast-col-md-12 spacer-column" />
              </div>
              <div className="jobs-slider ast-flex">
                {data.jobs.items.map((j, i) => (
                  <div key={i} className="slide-item">
                    <div className="job-card">
                      <div className="job-card__header">
                        <img src={j.image} className="no-lazy" alt="" />
                        <span dangerouslySetInnerHTML={h(j.location)} />
                      </div>
                      <div className="job-card__body">
                        <h6 className="job-title" dangerouslySetInnerHTML={h(j.title)} />
                        <span className="job-posted d-none" dangerouslySetInnerHTML={h(`Posted: ${j.posted} hours ago`)} />
                        <span className="job-salary" dangerouslySetInnerHTML={h(j.salary)} />
                      </div>
                      <div className="job-card__link">
                        <a href={j.link} target="_blank">
                          <span>View Job</span> <i className="fa fa-arrow-right" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="partner-logos-section pt-5">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12 logo-container">
                <div className="logo-group first">
                  {data.logos[0].map((src, i) => (
                    <div key={i} className="image">
                      <img src={src} />
                    </div>
                  ))}
                </div>
                <div className="logo-group second">
                  {data.logos[1].map((src, i) => (
                    <div key={i} className="image">
                      <img src={src} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQS Section */}
        <section className="faqs-section faqs-section-redesigned pt-5">
          <script type="application/ld+json" dangerouslySetInnerHTML={h(data.faq_ld)} />
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-6 contact-form-container">
                <p className="large-heading common-section-heading double-underline">Question? get in touch</p>
                <div
                  className="contact-form equal-height"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={h(`<img src="${esc(wp)}/wp-content/uploads/2023/04/get-in-touch.png" alt="">${data.cf7}`)}
                />
              </div>
              <div className="ast-col-md-6 faqs">
                <h3 className="large-heading faqs-heading common-section-heading">faqs</h3>
                <div className="faqs-wrapper equal-height">
                  <div className="faqs-accordion">
                    {data.faqs.map((f, key) => (
                      <div key={key} className={`faqs-accordion__item ${key === 0 ? "active" : ""}`}>
                        <input type="radio" id={`acc-${key}`} name="faq-accordion" defaultChecked={key === 0} hidden />
                        <label className="font-700" htmlFor={`acc-${key}`}>
                          <span dangerouslySetInnerHTML={h(f.q)} /> <i className="fa fa-plus" />
                        </label>
                        <div className={`font-400 faqs-accordion__content ${key === 0 ? "active" : ""}`} dangerouslySetInnerHTML={h(f.a)} />
                      </div>
                    ))}
                  </div>
                  <div className="show-more-faqs">
                    <span>Show More Faqs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="insta-feed pt-3">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h2 className="double-underline search-courses-section__heading text-center common-section-heading">
                  Stay connected with us on social media
                </h2>
              </div>
              <div className="ast-col-md-12" suppressHydrationWarning dangerouslySetInnerHTML={h(data.insta)} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

const JOBS_ARROW =
  '<svg width="20" height="20" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8.5" r="8" stroke="white"></circle><path d="M5 8.5H11.5" stroke="white" stroke-width="1.5" stroke-linecap="round"></path><path d="M9.5 11L12 8.5L9.5 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

function Slide({ s }: { s: HeroSlide }) {
  return (
    <section
      className={`${s.overlay ? "has-overlay" : ""} banner-slide banner-slide-${s.key}${s.image_link ? " is-image-link" : ""}`}
      style={css(`background:url('${s.bg}')`)}
    >
      {s.image_link ? <a className="banner-slide__image-link" href={s.image_link} aria-label="View offer" /> : null}
      {s.halloween ? <a className="banner-slide__image-link" href={s.halloween} aria-label="View TEFL course offers" /> : null}
      <div className="ast-container">
        <div className="ast-row ast-flex banner-slide-row">
          <div className="ast-col-md-6">
            <div className={`banner-slide__content ${s.is_offer ? "offer-content" : ""}`}>
              {s.title !== null ? (
                s.is_offer ? (
                  <p
                    style={css(`background:${s.title_bg}; color:${s.title_color}`)}
                    className=" banner-slide__content-title common-section-heading"
                    dangerouslySetInnerHTML={h(s.title)}
                  />
                ) : (
                  <p className=" banner-slide__content-title common-section-heading" dangerouslySetInnerHTML={h(s.title)} />
                )
              ) : null}
              {s.subtitle !== null ? <p className=" font-300 banner-slide__content-subtitle" dangerouslySetInnerHTML={h(s.subtitle)} /> : null}
              <div className="banner-slide__content-summary" dangerouslySetInnerHTML={h(s.summary)} />
              {s.accred ? (
                <div className="accreditations-container">
                  {s.accred.map((a, i) => (
                    <div key={i} className="accreditation">
                      <span
                        className="accreditation-title"
                        dangerouslySetInnerHTML={h(`<img src="${esc(a.icon)}" alt="" class="no-lazy"> ${a.title}`)}
                      />{" "}
                      <img src={a.logo} alt="" className="no-lazy accreditation-logo" />{" "}
                      <span className="accreditation-description" dangerouslySetInnerHTML={h(a.desc)} />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="ast-col-md-6">
            <div className="banner-slide__content-logo-container">
              {s.links ? (
                <div className="banner-slide__content-links">
                  {s.links.map((l, i) => (
                    <a key={i} href={l.link} className="btn btn-white">
                      <span dangerouslySetInnerHTML={h(l.text)} /> <i className="fa fa-angle-right" />
                    </a>
                  ))}
                </div>
              ) : null}
              {s.logo ? (
                <div
                  className="logo-clock-container"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={h(
                    (s.logo.link
                      ? `<a href="${esc(s.logo.link)}"><img src="${esc(s.logo.src)}" class="no-lazy banner-slide__content-logo" alt=""></a>`
                      : `<img src="${esc(s.logo.src)}" class="no-lazy banner-slide__content-logo" alt="">`) + s.logo.clock,
                  )}
                />
              ) : null}
              {s.bubble ? (
                <div
                  className="offer-bubble"
                  style={css(`background:${s.bubble.color};box-shadow: ${s.bubble.color} 0px 22px 70px 4px;`)}
                  dangerouslySetInnerHTML={h(s.bubble.html)}
                />
              ) : null}
              {s.timer ? (
                <div className="d-none banner-slide-content__timer__outer">
                  <div
                    className="banner-slide-content__timer"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={h(
                      `<span>Offer ends ${esc(s.timer.ends)}</span>${s.timer.timer}<h6 class="d-none text-center banner-slide-content__timer-end-text font-600">left to save</h6>`,
                    )}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cta({ cta }: { cta: CtaSection }) {
  const st = btnVars(cta.btn_style);
  return (
    <section className="cta-section pt-3">
      <div className="ast-container">
        <div className="ast-row">
          <div className="cta-section__buttons-row">
            {cta.buttons.map((b, i) => (
              <div key={i} className={`ast-col-md-${b.col}`}>
                <a style={st} href={b.link} className="cta-buttons btn btn-primary">
                  <span dangerouslySetInnerHTML={h(b.text)} /> <i className="fa fa-angle-right" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Search Courses Section */}
        <section className="search-courses-section pt-3">
          <div className="ast-container">
            <div className="ast-row">
              {cta.search.title !== null ? (
                <h1
                  className="double-underline search-courses-section__heading text-center common-section-heading"
                  dangerouslySetInnerHTML={h(cta.search.title)}
                />
              ) : null}
              {cta.search.first ? <Description d={cta.search.first} which="first" /> : null}
              <div className="search-courses-section__body" suppressHydrationWarning dangerouslySetInnerHTML={h(cta.search.body)} />
              {cta.search.last ? <Description d={cta.search.last} which="last" /> : null}
            </div>
          </div>
        </section>

        {cta.cards ? (
          <div className="section pt-3 course-cards">
            <div className="ast-row">
              {/* Runs at parse time as on live (async, no dependencies); the widgets it fills are opaque to React. */}
              <InlineScript type="text/javascript" src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" />
              {cta.cards.map((c, i) => (
                <Card key={i} c={c} />
              ))}
            </div>
          </div>
        ) : null}

        {cta.reviews ? <Reviews r={cta.reviews} /> : null}

        <div className="ast-row">
          <div className="expanable-cta-card-row ast-flex">
            {cta.exp.map((b, i) => (
              <div key={i} className="ast-col-md-6">
                <div className="exp-cta-card">
                  <div className={`exp-cta-card__image-header exp-cta-card__image-header-${b.key}`}>
                    <img src={b.bg} alt="" />
                  </div>
                  <div className="exp-cta-card__body">
                    <h2 className="exp-cta-card__body-title font-600 large-heading text-center text-dark" dangerouslySetInnerHTML={h(b.title)} />
                    <div className="exp-cta-card__body-content">
                      <div className="exp-cta-card__body-content-expandable" dangerouslySetInnerHTML={h(b.summary)} />
                      <div className="exp-cta-card__body-expand font-400">
                        <span dangerouslySetInnerHTML={h(b.btn)} /> <i className="fa fa-angle-down" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {cta.text !== null ? (
          <div className="ast-row pt-3">
            <div className="ast-col-md-12">
              <div className="cta-section-text" dangerouslySetInnerHTML={h(cta.text)} />
            </div>
          </div>
        ) : null}

        <div className="ast-row">
          <div className="cta-image-card-row">
            {cta.img_cards.map((b, i) => (
              <div key={i} className="ast-col-md-6">
                <div className="cta-image-card" style={css(`background:url('${b.bg}')`)}>
                  <div className="cta-image-card__content d-none">
                    <h2 className="cta-image-card__content-title font-600 small-heading" dangerouslySetInnerHTML={h(b.title)} />
                    <div className="cta-image-card__content-summary font-300 my-1" dangerouslySetInnerHTML={h(b.summary)} />
                    <a
                      href={b.link}
                      className="cta-image-card__button font-400 btn btn-small-centered btn-bordered-white"
                      dangerouslySetInnerHTML={h(b.btn)}
                    />
                  </div>
                  <a
                    href={b.link}
                    className="cta-image-card__button-full-span cta-image-card__button btn-primary font-400 btn "
                    dangerouslySetInnerHTML={h(b.btn)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Description({ d, which }: { d: ReadMore; which: "first" | "last" }) {
  const base = `search-course-section__description search-course-section__description-${which}`;
  if (!d.id) return <div className={base} dangerouslySetInnerHTML={h(d.full)} />;
  return (
    <>
      <div className={`${base} has-read-more`} id={d.id}>
        <div className="description-content truncated">
          <div className="description-short" dangerouslySetInnerHTML={h(d.short)} />
          <div className="description-full" style={{ display: "none" }} dangerouslySetInnerHTML={h(d.full)} />
        </div>
      </div>
      <button className="read-more-btn" data-target={d.id}>
        Read More
      </button>
    </>
  );
}

function Card({ c }: { c: CourseCard }) {
  return (
    <div className={c.col_class}>
      <div
        style={css(`--label-bg-color:${c.label_bg_var}; `)}
        className={`course-card ${c.has_label ? "card-has-label" : ""} course-id-${c.product_id}`}
      >
        {c.label ? (
          <span
            className="course-card-label"
            style={css(`--text-color:${c.label.color}; --bg-color:${c.label.bg}; --border-color:${c.label.border}`)}
            dangerouslySetInnerHTML={h(c.label.text)}
          />
        ) : null}
        <a href={c.link} className="clickbox" />
        <div className="course-card-body">
          <h2 className="course-card__title font-600 small-heading">
            <img className="course-card__icon" src={c.icon} alt="" /> <span dangerouslySetInnerHTML={h(c.title)} />
          </h2>
          <div
            className="course-card__price"
            suppressHydrationWarning
            dangerouslySetInnerHTML={h(
              `${c.price} <span class="course-card__price-discount" style="color:${esc(c.discount[0])}; background:${esc(c.discount[1])};border-color:${esc(c.discount[0])}">${c.save}</span>`,
            )}
          />
          <div className="deposit-info ast-flex ast-align-items-center">
            <div className="depoist-info__icon">
              <img src={c.deposit.icon} alt="" />
            </div>
            <div className="ast-flex flex-direction-column deposit-info__details">
              <p className="deposit-info_title" dangerouslySetInnerHTML={h(c.deposit.title)} />
              <div className="deposit-info_description" dangerouslySetInnerHTML={h(c.deposit.desc)} />
            </div>
          </div>
          <div className="course-card__summary" dangerouslySetInnerHTML={h(c.summary)} />
          <ul className="course-card__features">
            {c.features.map((f, i) => (
              <li key={i} dangerouslySetInnerHTML={h(f)} />
            ))}
          </ul>
        </div>
        <div className="course-card-foter">
          <a href={c.link} className="btn btn-primary course-card__btn" style={btnVars(c.cta_style)} dangerouslySetInnerHTML={h(c.cta_text)} />{" "}
          <a
            target="_blank"
            href={c.guide_link}
            style={btnVars(c.guide_style)}
            className="btn btn-centered btn-bordered-white guide-download-link course-card__btn"
          >
            Download Guide
          </a>
        </div>
        {c.tp_tag ? (
          <div style={css("margin-top:1.5rem; position:relative; z-index:20;display: flex;justify-content: center;")}>
            <div
              className="trustpilot-widget"
              style={css("position:relative; z-index:21;")}
              data-locale="en-US"
              data-template-id="5418052cfbfb950d88702476"
              data-businessunit-id="61c0c19118c53fc28bcc355d"
              data-style-height="35px"
              data-style-width="100%"
              data-token="ff8bfbc9-6191-40f5-9ffb-021d1cc6f484"
              data-tags={c.tp_tag}
              data-stars="4,5"
              data-review-languages="en"
              suppressHydrationWarning
              dangerouslySetInnerHTML={h(
                '<a href="https://www.trustpilot.com/review/teflinstitute.com" target="_blank" rel="noopener">Trustpilot</a>',
              )}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Reviews({ r }: { r: NonNullable<CtaSection["reviews"]> }) {
  return (
    <section className="verified-student-reviews-section pt-5">
      <div className="ast-container">
        <div className="ast-row ">
          <div className="verified-student-reviews-section__header">
            <div className="ast-col-md-8">
              <h4
                className="large-heading double-underline common-section-heading verified-student-reviews-section__title"
                dangerouslySetInnerHTML={h(r.title)}
              />
              <span className="verified-student-reviews-section__subtitle" dangerouslySetInnerHTML={h(r.subtitle)} />
            </div>
            <div className="ast-col-md-4">
              <div className="reviews-average">
                <a
                  href={GOOGLE_REVIEWS}
                  className="btn-centered btn reviews-btn"
                  style={css(`--btn-text-color:${r.btn[0]};--btn-bg-color:${r.btn[1]}`)}
                >
                  Read all reviews
                </a>
                <div className="rating-div">
                  <i className="fa fa-star" /> <i className="fa fa-star" /> <i className="fa fa-star" /> <i className="fa fa-star" />{" "}
                  <i className="fa fa-star-half-empty" />
                </div>
                <div className="total-count-text font-600">
                  <span className="course-review-count">{`(${r.average})`}</span>
                  {` Out of ${r.total} global reviews`}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="spacer-column" />
        <div className="ast-row verified-student-reviews-section__row">
          <div className="verified-student-reviews-section__row">
            <div className="equal-height ast-col-md-5">
              <div className="verified-student-reviews-section__review-summary">
                {r.bars.map((b) => (
                  <div key={b.star} className="review-status">
                    <div className="progress-text">{`${b.star} Star`}</div>
                    <div className="progress">
                      <div className="progress-bar" {...{ percent: b.pct }} />
                    </div>
                    <div className="progress-value">{`${b.pct}%`}</div>
                  </div>
                ))}
              </div>
              <div className="reviews-cols">
                <a href={r.google_link} className="google-widget" target="_blank" rel="noopener noreferrer">
                  <div className="google-reviews-badge">
                    <div className="badge-header">
                      <span className="google-logo" /> <span className="brand-text">Google</span>
                    </div>
                    <div className="stars">★★★★★</div>
                    <div className="badge-review">
                      <b>{r.g_rating}</b> based on <b>{r.g_count}</b> reviews
                    </div>
                  </div>
                </a>
                {r.tp ? (
                  <a href={r.tp.link} className="trustpilot-badge-link" target="_blank" rel="noopener noreferrer">
                    <div className="trustpilot-reviews-badge">
                      <div className="badge-header">
                        {r.tp.icon ? <img className="trustpilot-logo-img" src={r.tp.icon} alt="Trustpilot" /> : null}{" "}
                        <span className="brand-text">Trustpilot</span>
                      </div>
                      <div className="stars">★★★★★</div>
                      <div className="badge-review">
                        <b>{r.tp.rating}</b> based on <b>{r.tp.count}</b> reviews
                      </div>
                    </div>
                  </a>
                ) : null}
              </div>
            </div>
            <div
              className="equal-height ast-col-md-7 verified-student-reviews-section__slider"
              suppressHydrationWarning
              dangerouslySetInnerHTML={h(r.slider)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const GOOGLE_REVIEWS =
  "https://www.google.com/search?sca_esv=8d785069c21da656&sca_upv=1&hl=en-IE&gl=ie&q=The+TEFL+Institute+Ireland+%7C+TEFL+Courses+%26+Certification,+13+Adelaide+Rd,+Saint+Kevin%27s,+Dublin,+D02+P950&uds=ADvngMhDJElofzFqOx8yLCqxrZBfORdohN-zZWd2DtE2wkfY_Hz8LxAbxWyTqbQXp_hpoUOW2uxhpWyrB1IL2IpdWcWiPs5S-vGBywcJzrO9PJe_HdF91Ppndo2Knjst1hsy0DuQ_1Yy71pyrotGeYeqK9tgwKhS1Dz3nAO5HG6XIft-vP8sUXZPMIt75-GkZH8kdUstEDG07k_uQg6GZSA3HkqfKbTCnzBS1_wxYJkYsxPWWzYHd35xJVCoLbwXmLTFBoT-lFXh&si=ACC90nwjPmqJHrCEt6ewASzksVFQDX8zco_7MgBaIawvaF4-7mSRR1kRGE4hCmZtLOUumbi46V_tOIxRTOEjel4eIAxPbsZAzQfZDyayafoOPMus5kIWjD0%3D&sa=X&ved=2ahUKEwixoZaa4Z6HAxUHYEEAHXfKDf8Q3PALegQIGxAE&biw=1536&bih=745&dpr=2";
