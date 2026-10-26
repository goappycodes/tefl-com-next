/**
 * Accredited TEFL course sale page — native port of the theme's
 * black-friday-landing-page-2023.php (page accredited-tefl-course-sale).
 *
 * Same markup as the PHP template, so black-friday-landing-page.css styles it
 * and black-friday-sale-2023.js (accordion, review bars, equal heights) plus
 * WCPBC and Business Reviews Bundle keep driving it. Three sections never
 * close their .ast-container; the browser closes it at </section>, and that
 * is the tree reproduced here.
 */
import { StarRows } from "./SaleBlocks";
import { ih } from "./shared";
import type { BlackFriday2023Data } from "./types";

function Sticker({ off }: { off: string | null }) {
  if (off === null) return null;
  return (
    <div className="discount-sticker">
      <span className="discount-percent">{`${off}%`}</span>
      <span className="discount-text">Off</span>
    </div>
  );
}

export default function BlackFriday2023({ d }: { d: BlackFriday2023Data }) {
  const o = d.origin;
  const h = d.hero;
  return (
    <div id="primary" className={d.primary_class}>
      <section
        className="black-friday-2023-hero-banner-section section-padding"
        style={{ background: `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),url('${h.background}')` }}
      >
        <div className="ast-container">
          <div className="ast-row ast-flex">
            <div className="ast-col-md-6 banner-inner-col">
              <div className="banner-content">
                <h1 className="text-center mb-2 banner-content__title" dangerouslySetInnerHTML={ih(h.title)} />
                {h.gifts ? (
                  <div className="banner-content__summary">
                    <div className="gifts-section-summary">
                      <h3 dangerouslySetInnerHTML={ih(h.gifts.title)} />
                      {h.gifts.items.map((g, i) => (
                        <p key={i} dangerouslySetInnerHTML={ih(g)} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="banner-content__summary" dangerouslySetInnerHTML={ih(h.summary)} />
                )}
              </div>
            </div>
            {h.bubbles ? (
              <div className="ast-col-md-6">
                <div className="offer-bubbles">
                  <div
                    className="offer-bubble offer-bubble-top"
                    style={{ background: h.bubbles.color, boxShadow: `${h.bubbles.color} 0px 22px 70px 4px` }}
                    dangerouslySetInnerHTML={ih(h.bubbles.one)}
                  />
                  <div
                    className="offer-bubble offer-bubble-bottom"
                    style={{ background: h.bubbles.color, boxShadow: `${h.bubbles.color} 0px 22px 70px 4px` }}
                    dangerouslySetInnerHTML={ih(h.bubbles.two)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="full-width section-padding dark-theme-section">
        <div className="ast-container tefl-intro-info-container">
          <div className="ast-row">
            <div className="ast-col-md-5">
              <div className="tefl-institute-intro-description">
                <h2 className="content-title large-heading" dangerouslySetInnerHTML={ih(d.intro.title)} />
                <h4 className="content-subtitle" dangerouslySetInnerHTML={ih(d.intro.subtitle)} />
                <div className="main-content font-600 mt-2" dangerouslySetInnerHTML={ih(d.intro.description)} />
              </div>
            </div>
            <div className="ast-col-md-7">
              <div className="ques-ans-section">
                <div className="ques-ans-accordion-container">
                  {d.intro.accordion.map((a, i) => (
                    <div key={i} className="ques-ans-accordion">
                      <div className="ques-ans-heading">
                        <h4 className="ques-ans-title" dangerouslySetInnerHTML={ih(a.title)} />
                      </div>
                      <div className="ques-ans-content">
                        <div className="ques-ans-body" dangerouslySetInnerHTML={ih(a.content)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dark-theme-section why-us-section-wrapper">
        <div className="ast-container why-us-section-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <div className="why-us-content-block">
                <div className="ast-row">
                  {d.why.map((w, i) => (
                    <div key={i} className="ast-col-md-3 why-us-icon-descritpion">
                      <img src={w.icon} className="why-us-icon" />
                      <div className="why-us-conent">
                        <span className="why-us-title" dangerouslySetInnerHTML={ih(w.title)} />
                        <span className="why-us-sub-title" dangerouslySetInnerHTML={ih(w.subtitle)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dark-theme-section section-padding  tefl-courses-section-wrapper">
        <div className="tefl-courses-cards">
          <div className="ast-container">
            <h3 className="tefl-courses-section-header large-heading" dangerouslySetInnerHTML={ih(d.courses.title)} />
            <div className="ast-row tefl-courses-cards-wrapper">
              {d.courses.cards.map((c, i) => (
                <div key={i} className="ast-col-md-4">
                  <div className="course-card black-friday-23-course-card" style={{ backgroundImage: `url('${c.background}')` }}>
                    <Sticker off={c.off} />
                    <div className="card-head">
                      <img className="course-hour-sticker" src={c.sticker} alt="" />
                    </div>

                    <div className="card-sub-head">
                      <img className="card-sub-head-img course-icon" src={c.icon} alt="" />
                      <div className="card-subhead-content">
                        <h6 className="card-sub-head-title course-payment-plan" dangerouslySetInnerHTML={ih(c.plan)} />
                        <span className="card-sub-head-text" dangerouslySetInnerHTML={ih(c.message)} />
                      </div>
                    </div>
                    <div className="price-guide-download">
                      <div className="course-price-duration-info">
                        <h4 className="course-title text-center" dangerouslySetInnerHTML={ih(c.title)} />
                        <div className="course-discount-price">
                          <div className="course-price-html" dangerouslySetInnerHTML={ih(c.price)} />
                        </div>
                        <div className="course-completion-time-info">
                          <span className="course-completion-title">Completion time</span>
                          <span className="course-completion-time" dangerouslySetInnerHTML={ih(c.completion)} />
                        </div>
                        <a href={c.guide_link}>
                          <button className="course-guide-download-button">Download Guide</button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="courses-content-details">
          <div className="ast-container">
            <div className="ast-row">
              {d.courses.packages.map((p, i) => (
                <div key={i} className="ast-col-md-4">
                  <div className="course_card__bottom black-friday-23-course-card">
                    <h3 className="course-card__bottom-title text-center font-600" dangerouslySetInnerHTML={ih(p.title)} />
                    <div className="course-card__bottom-content features">
                      {p.includes.map((f, j) => (
                        <div
                          key={`i${j}`}
                          className="feature-include"
                          dangerouslySetInnerHTML={ih(`<img src="${o}/wp-content/uploads/2023/07/check.svg" alt="" class="check-icon">${f}`)}
                        />
                      ))}
                      {p.excludes.map((f, j) => (
                        <div
                          key={`e${j}`}
                          className="feature-exclude"
                          dangerouslySetInnerHTML={ih(`<img src="${o}/wp-content/uploads/2023/07/cross_muted.svg" alt="" class="cross-icon">${f}`)}
                        />
                      ))}
                    </div>
                    <div className="enrol-buttons">
                      <a href={p.learn_more} className="btn-centered">
                        <button className="learn-more-btn">Learn More</button>
                      </a>
                      <a href={p.enrol_now} className="btn-centered">
                        <button className="enrol-now-btn">Enrol Now</button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              <div className="ast-col-md-4" />
              <div className="ast-col-md-4" />
            </div>
          </div>
        </div>
      </section>

      {d.gifts ? (
        <section className="dark-theme-section section-padding-bottom free-gift-info-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <div className="gifts-info-container">
                  <div className="gift-ribbon">
                    <img src={`${o}/wp-content/uploads/2023/11/gold-bow-1-1.svg`} alt="" />
                  </div>
                  <div className="animated-gif-wrapper">
                    <h3 className="mb-1 text-center font-600" dangerouslySetInnerHTML={ih(d.gifts.title)} />
                    <img style={{ display: "none" }} data-country={d.gifts.country} className="animated-gif" src={d.gifts.gif} alt="" />
                  </div>
                  <div className="course-badge-body">
                    {d.gifts.badges.map((b, i) => (
                      <div key={i} className="gift">
                        <div className="badge-icon">
                          <img className="no-lazy" src={b.icon} alt="badge-icon" />
                        </div>
                        <div className="course-badge-text">
                          <p className="badge-title mt-1" dangerouslySetInnerHTML={ih(b.title)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="dark-theme-section tefl-courses-section-wrapper">
        <div className="tefl-courses-cards">
          <div className="ast-container">
            <h3 className="tefl-courses-section-header large-heading" dangerouslySetInnerHTML={ih(d.internships.title)} />
            <div className="ast-row">
              {d.internships.cards.map((c, i) => (
                <div key={i} className="ast-col-md-4" data-test={c.test}>
                  <div className="course-card black-friday-23-course-card" style={{ backgroundImage: `url('${c.background}')` }}>
                    <Sticker off={c.off} />
                    <div className="card-head country-name-wrapper snall-heading">
                      <h3 className="country-name large-heading" dangerouslySetInnerHTML={ih(c.country)} />
                    </div>
                    <div className="card-sub-head">
                      <img className="card-sub-head-img course-icon" src={c.icon} alt="" />
                      <div className="card-subhead-content">
                        <h6 className="card-sub-head-title course-payment-plan" dangerouslySetInnerHTML={ih(c.plan)} />
                        <span className="card-sub-head-text" dangerouslySetInnerHTML={ih(c.plan_desc)} />
                      </div>
                    </div>
                    <div className="price-guide-download">
                      <div className="course-price-duration-info">
                        <h4 className="course-title text-center" dangerouslySetInnerHTML={ih(c.title)} />
                        <div className="course-discount-price">
                          <div className="course-price-html" dangerouslySetInnerHTML={ih(c.price)} />
                        </div>
                        <div className="course-completion-time-info">
                          <span className="course-completion-title">Placement duration</span>
                          <span className="course-completion-time" dangerouslySetInnerHTML={ih(c.completion)} />
                        </div>
                        <a href={c.link}>
                          <button className="course-guide-download-button">Learn More</button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ast-row">
              <div className="ast-col-md-4" />
              <div className="ast-col-md-4">
                <div className="internship-cta-large-button">
                  <a href={d.internships.cta}>
                    <button className="view-all-intership-button">view all internships</button>
                  </a>
                </div>
              </div>
              <div className="ast-col-md-4" />
            </div>
          </div>
        </div>
      </section>

      {d.reviews ? (
        <section className="verified-student-reviews-section pt-5 section-padding dark-theme-section">
          <div className="ast-container">
            <div className="ast-row ">
              <div className="verified-student-reviews-section__header">
                <div className="ast-col-md-6">
                  <h2
                    className="large-heading common-section-heading verified-student-reviews-section__title"
                    dangerouslySetInnerHTML={ih(d.reviews.title)}
                  />
                  <span className="verified-student-reviews-section__subtitle" dangerouslySetInnerHTML={ih(d.reviews.subtitle)} />
                </div>
                <div className="ast-col-md-6">
                  <div className="reviews-average">
                    <div className="rating-div">
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star-half-empty" />
                    </div>
                    <div
                      className="total-count-text font-600"
                      dangerouslySetInnerHTML={ih(
                        `<span class="course-review-count">(${d.reviews.average})</span> Out of ${d.reviews.total} global reviews`,
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="spacer-column" />
            <div className="ast-row verified-student-reviews-section__row">
              <div className="verified-student-reviews-section__row">
                <div className="equal-height ast-col-md-5">
                  <div className="verified-student-reviews-section__review-summary">
                    <StarRows rows={d.reviews.stars} />
                  </div>
                  <div className="rplg rplg-insert" data-id="77247" />
                </div>
                <div
                  className="equal-height ast-col-md-7 verified-student-reviews-section__slider"
                  dangerouslySetInnerHTML={ih(d.reviews.slider)}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="dark-theme-section section-padding-top specialist-course-section-wrapper">
        <div className="specialist-courses-cards">
          <div className="ast-container">
            <h3 className="specialist-course-section-header large-heading" dangerouslySetInnerHTML={ih(d.specialist.title)} />
            <div className="ast-row">
              {d.specialist.cards.map((c, i) => (
                <div key={i} className="ast-col-md-4">
                  <div className="specialist-course-card black-friday-23-course-card">
                    <Sticker off={c.off} />
                    <div className="card-top" style={{ backgroundImage: `url('${c.background}')` }}>
                      <img className="specialist-course-sticker" src={c.sticker} alt="" />
                    </div>
                    <div className="card-body">
                      <div className="specialist-course-discount-price">
                        <div className="course-price-html" dangerouslySetInnerHTML={ih(c.price)} />
                      </div>
                      <div className="course-type">
                        <span dangerouslySetInnerHTML={ih(c.title)} />
                        <span>Specialist Course</span>
                      </div>
                      <div className="course-duration">
                        <span>Completion time</span>
                        <span dangerouslySetInnerHTML={ih(c.completion)} />
                      </div>
                      <a href={c.link}>
                        <button className="specialist-course-cta">Learn More</button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ast-row">
              <div className="ast-col-md-3" />
              <div className="ast-col-md-6 specialist-course-btn-column">
                <div className="specialist-course-cta-large-button ">
                  <a href={d.specialist.cta}>
                    <button className="view-all-specialist-course-button">View All Specialist Courses</button>
                  </a>
                </div>
              </div>
              <div className="ast-col-md-3" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding dark-theme-section trial-section-wrapper">
        <div className="ast-container trial-section-container">
          <div className="ast-row">
            {d.trial.map((c, i) => (
              <div key={i} className="ast-col-md-6">
                <div className="trial-card" style={{ background: `url('${c.background};')` }}>
                  <div className="trial-card-content">
                    <img className="trial-card-icon" src={c.icon} alt="" />
                    <h6 className="trial-card-title" dangerouslySetInnerHTML={ih(c.title)} />
                    <div className="trial-card-description" dangerouslySetInnerHTML={ih(c.description)} />
                    <a href={c.link}>
                      <button className="trial-card-button" dangerouslySetInnerHTML={ih(c.text)} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding dark-theme-section partners-accreditations-wrapper">
        <div className="ast-container partners-accreditations-container">
          <div className="ast-row partners-accreditations-row">
            <div className="ast-col-md-12 partners-accreditations-column">
              <div className="partners-accreditations-heading">
                <h3 className="large-heading" dangerouslySetInnerHTML={ih(d.partners.title)} />
              </div>
              <div className="">
                <div className="partners-logo-wrapper partners-logo-row">
                  {d.partners.logos.map((l, i) => (
                    <div key={i} className="partners-logo">
                      <img src={l} alt="" />
                    </div>
                  ))}
                </div>

                <div className="accreditations-container">
                  <div className="accreditations-container-row">
                    {d.partners.points.map((p, i) => (
                      <div key={i} className="ast-col-md-3">
                        <div
                          className="accreditations-point"
                          dangerouslySetInnerHTML={ih(`<i class="fa fa-check"></i><span class="accreditations-point-text">${p}</span>`)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
