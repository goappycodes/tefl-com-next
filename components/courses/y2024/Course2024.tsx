/**
 * Native port of the theme's single-course-template-2024.php (the 2024 course design),
 * incl. includes/ti-deposit-form.php. Data from course-2024.php
 * (tefl_native_course_2024_data); same markup and classes as the PHP template so the
 * theme CSS/JS (splide sliders, accordions, deposit toggle, AJAX prices and the
 * installment breakdown) work unchanged.
 */
import type { Course2024Data, Course2024Deposit, Course2024Hero } from "./types";

const ARROW = "/wp-content/uploads/2024/11/arrow-right-gray.svg";
const QUICK_LINKS: [string, string][] = [
  ["courseOutline", "Course Outline"],
  ["topBenefits", "Top Benefits"],
  ["courseModules", "Course Modules"],
  ["courseProspectus", "Course Prospectus"],
  ["teamSection", "Meet Academic Team"],
  ["certificatePreview", "Certificate Preview"],
  ["testimonials", "Testimonials"],
  ["faqs", "FAQ's"],
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The .wc-deposits-wrapper innerHTML, as ti-deposit-form.php prints it. Built as a string
 * because the template's markup can't be expressed in JSX attribute-for-attribute
 * (`checked='checked'`, the empty `--active-bg-color:` custom properties).
 */
function depositHtml(d: Course2024Deposit): string {
  let h = "";
  if (!d.forced) {
    if (d.breakdown) {
      h +=
        `<div class="installments-breakdown">` +
        `<div class="ajax-snippet" data-snippet="installment_breakdown" data-objectid="${esc(d.object_id)}"></div>` +
        `<div id="loader" class="loader">Fetching installment breakdown details <img src="/wp-content/uploads/2022/11/loading-yellow.gif" alt="fetching deposit details"></div>` +
        `</div>`;
    }
    h +=
      `<i class="show-schedule-icon fa fa-info"></i>` +
      `<ul class="wc-deposits-option ${esc(d.total_deposits)}" style="--active-bg-color:; --active-text-color:; --inactive-bg-color:; --inactive-text-color:; ">` +
      `<li class="active "><input type="radio" name="wc_deposit_option" value="no" class="radio-custom wc-option-pay-full" id="wc-option-pay-full"${d.full_checked ? " checked='checked'" : ""} />` +
      `<label for="wc-option-pay-full" class="radio-custom-label">Pay in Full</label></li>` +
      `<li><input type="radio" name="wc_deposit_option" value="yes" class="wc-option-pay-deposit radio-custom " id="wc-option-pay-deposit"${d.deposit_checked ? " checked='checked'" : ""} />` +
      `<label for="wc-option-pay-deposit" class="radio-custom-label radio-custom-label-pay-deposit">${esc(`Pay in ${d.total_deposits}`)}</label></li>` +
      `</ul>`;
  }
  const style = d.show ? "display:block;" : "display:none;";
  if (d.is_plan) {
    h +=
      `<div class="show-breakdown  wc-deposits-payment-plans" style="${style}">` +
      d.plan_descriptions.map((t) => `<span class="wc-deposits-payment-plan-description">${t}</span>`).join("") +
      `</div>`;
  } else {
    h += `<div class="wc-deposits-payment-description" style="${style}">${d.amount_html}</div>`;
  }
  return h;
}

function Hero({ h }: { h: Course2024Hero }) {
  return (
    <section
      data-test=""
      data-pid={h.pid}
      style={{ backgroundImage: `url('${h.bg}')` }}
      className="section-padding full-width-banner hero-banner"
    >
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-6">
            <div id="heroBannerContent" className="hero-banner-content deposit-radio-container">
              <div className="hero-banner-content__header">
                <div className="hero-banner-content__header-left">
                  <img className="course-icon" src={h.icon} alt="" />
                </div>
                <div className="hero-banner-content__header-right">
                  <h1 className="course-page-title large-heading" dangerouslySetInnerHTML={{ __html: h.title_html }} />
                  <span className="course-subtitle" dangerouslySetInnerHTML={{ __html: h.subtitle_html }} />
                  {h.price_html ? (
                    <div
                      data-depositpercent={h.deposit_percent}
                      className={`product-price ${h.deposit_class} course-price-container`}
                      dangerouslySetInnerHTML={{ __html: h.price_html }}
                    />
                  ) : null}
                </div>
              </div>
              {h.deposit ? (
                <div
                  className={`wc-deposits-wrapper ${h.deposit.forced ? "wc-deposits-forced" : "wc-deposits-optional"}`}
                  dangerouslySetInnerHTML={{ __html: depositHtml(h.deposit) }}
                />
              ) : null}
              {h.sale ? (
                <div className="offer-sale-information-outer">
                  <div className="text-center offer-sale-information">
                    <div className={`offer-sale-counter ${h.sale.sold} `}>
                      <span>{h.sale.remaining}</span>
                      <span>courses left</span>
                    </div>
                    <div className="offer-sale-information__details">
                      <span className="font-700">Looking for extra income?</span>
                      <span className="font-600">Start teaching English online</span>
                      <span className="font-400">
                        Applies to first 100 courses - <b>Act fast!</b>
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className={`${h.desc_class} hero-banner-content__description`} dangerouslySetInnerHTML={{ __html: h.desc_html }} />
              <div className="header-banner-content__buttons">
                <div className={`enroll-now-link-btn ${h.enrol_cc}`}>
                  <a href={h.enrol_href} className="ti-enroll-btn enroll-now-btn btn btn-centered enrol-btn btn-primary">
                    Enrol Now
                  </a>
                </div>
                <a href="#courseOutline" className="course-details btn btn-centered btn-outline">
                  Course Details
                </a>
              </div>
              {h.completion_html !== null ? (
                <div className="course-completion-text text-center" dangerouslySetInnerHTML={{ __html: h.completion_html }} />
              ) : null}
              {h.reviews_count !== null ? (
                <div className="google-reviews-info">
                  <span className="font-700">Excellent</span>
                  <img className="no-lazy reviews-star" src="/wp-content/uploads/2024/10/banner_reviews_stars.png" alt="" />
                  <span className="font-600">{`${h.reviews_count} reviews`}</span>
                  <a href="https://search.google.com/local/reviews?placeid=ChIJaeBYjIqxe0gR8IEtXkiDSWo" target="blank">
                    {"View on "}
                    <img className="no-lazy google-logo" src="/wp-content/uploads/2024/11/google-logo.svg" alt="" />
                  </a>
                </div>
              ) : null}
              {h.klarna_cc !== null ? (
                <div data-cc={h.klarna_cc} className="text-center pay-with-klarna font-600">
                  {"Buy now, pay later with "}
                  <img className="klarna-learn-more no-lazy" src="/wp-content/uploads/2023/04/Klarna-marketing-badge-pink-rgb.svg_.svg" alt="" />
                </div>
              ) : null}
            </div>
          </div>
          <div className="ast-col-md-6">
            {h.logo.banner !== null ? (
              <div className="banner-logo-container">
                <img src={h.logo.banner} className="banner-slide__content-logo" alt="" />
              </div>
            ) : null}
            {h.logo.common ? (
              <div className="banner-logo-container">
                <div style={{ position: "relative" }}>
                  {h.logo.common.counter !== null ? (
                    <div className="offer-sale-counter d-none">
                      <span className="courses-remaining">{h.logo.common.counter}</span>
                      <span>courses left</span>
                    </div>
                  ) : null}
                  {h.logo.common.link === null ? (
                    <img src={h.logo.common.logo} className="common-logo banner-slide__content-logo" alt="" />
                  ) : (
                    <a href={h.logo.common.link}>
                      <img src={h.logo.common.logo} className="common-logo banner-slide__content-logo" alt="" />
                    </a>
                  )}
                </div>
              </div>
            ) : null}
            {h.logo.alternate !== null ? (
              <div className="banner-logo-container">
                <img src={h.logo.alternate} className="alternate-common-logo common-logo banner-slide__content-logo" alt="" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function chunk<T>(a: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n));
  return out;
}

export default function Course2024({ data }: { data: Course2024Data }) {
  const d = data;
  return (
    <div id="primary" className={d.primary_class}>
      {d.hero ? <Hero h={d.hero} /> : null}

      {d.key_features ? (
        <section className="key-features-section">
          <div className="ast-container">
            <div className="key-features-row">
              <div className="ast-row">
                {d.key_features.map((f, i) => (
                  <div key={i} className="ast-col-md-3">
                    <div className="feature">
                      <span dangerouslySetInnerHTML={{ __html: f }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.intro ? (
        <section className="course-intro-section section-padding">
          <div className="ast-container">
            <div className="ast-row">
              <div className="course-intro-section-row">
                <div className="ast-col-md-4">
                  <div className="page-navigation deposit-radio-container">
                    <h2 className="page-navigation__title">Get Started</h2>
                    {d.intro.enrolled !== null ? (
                      <div className="student-enrolled-text">
                        <b>{d.intro.enrolled}</b>
                        {" enrolled in this course in last 7 days"}
                      </div>
                    ) : null}
                    {d.intro.cutoff !== null ? (
                      <div className="enrollment-cutoff-date">
                        <span>
                          Next Enrolment Cut Off Date:
                          <br />
                        </span>
                        <span className="font-700">{d.intro.cutoff}</span>
                      </div>
                    ) : null}
                    {d.intro.resources ? (
                      <div className="resources-select-wrapper">
                        <div className="resources-select-wrapper__header">
                          <h6 className="text-center font-500">Add Teaching Resources</h6>
                          <i className="fa fa-info"></i>
                          <div className="resource-info-container">Please Select a resource</div>
                        </div>
                        <div className="select-menu resources-select">
                          <div className="select-btn">
                            <span className="sBtn-text">Select Option</span>
                            <img className="no-lazy" src="/wp-content/uploads/2024/11/Vector-107.svg" alt="" />
                          </div>
                          <ul className="options">
                            {d.intro.resources.map((r, i) => (
                              <li key={i} className="option" data-pid={r.pid} data-name={r.name} data-desc={r.desc} data-pagelink={r.pagelink}>
                                <span className="option-text">
                                  <b dangerouslySetInnerHTML={{ __html: r.name_html }} />
                                  <span className="ajax-loaded-price"></span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                    <div className={`enroll-now-link-btn enroll-now ${d.intro.enrol_cc}`}>
                      <a href={d.intro.enrol_href} className="btn enroll-now-btn btn-centered enrol-btn btn-primary">
                        Enrol Now
                      </a>
                    </div>
                    <div className="select-menu quick-links-select">
                      <div className="select-btn">
                        <span className="sBtn-text">Quick Links</span>
                        <img className="no-lazy" src="/wp-content/uploads/2022/01/down-arrow.svg" alt="" />
                      </div>
                      <ul className="options">
                        {QUICK_LINKS.map(([target, label]) => (
                          <li key={target} data-target={target} className="option">
                            <img className="no-lazy" src={ARROW} alt="" />
                            <span className="option-text">{label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {d.intro.emp_choice ? <img src="/wp-content/uploads/2024/08/employers_choice_240.png" alt="" className="emp-choice-logo" /> : null}
                  <img src="/wp-content/uploads/2023/01/guaranteed-irish.svg" alt="" className="guaranteed-irish" />
                </div>
                <div className="ast-col-md-8">
                  <div className="page-introduction">
                    <h2 className="large-heading page-introduction__title underlined-header" dangerouslySetInnerHTML={{ __html: d.intro.title_html }} />
                    <div className="page-introduction__desc" dangerouslySetInnerHTML={{ __html: d.intro.desc_html }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.outline ? (
        <section id="courseOutline" className="section-padding-bottom course-outline-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-8">
                <div className="course-outline-container">
                  <h2 className="large-heading underlined-header" dangerouslySetInnerHTML={{ __html: d.outline.title_html }} />
                  <div className="course-outline-accordion-container">
                    {d.outline.outlines.map((o, i) => (
                      <div key={i} className={`course-outline-accordion ${o.active ? "active" : ""}`}>
                        <div className="course-outline-heading">
                          <h4 className="course-outline-title" dangerouslySetInnerHTML={{ __html: o.title_html }} />
                        </div>
                        <div className="course-outline-content">
                          <div className="course-outline-body" dangerouslySetInnerHTML={{ __html: o.body_html }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {d.outline.partners ? (
                <div className="ast-col-md-4">
                  <div className="accreditation-container">
                    <h2 className="large-heading text-center font-500">Accreditation Partners</h2>
                    <div className="accreditations">
                      {d.outline.partners.map((p, i) => (
                        <div key={i} className="accred-partner">
                          {p.link !== null ? (
                            <a target="_blank" href={p.link} className="partner-link">
                              <img className="no-lazy" src={p.logo} alt="" />
                            </a>
                          ) : (
                            <img className="no-lazy" src={p.logo} alt="" />
                          )}
                          <div className="acred-partner-title text-center">
                            <span dangerouslySetInnerHTML={{ __html: p.title_html }} />
                            <img src={p.icon} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {d.benefits ? (
        <section id="topBenefits" className="section-padding-bottom top-benefits-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h2 className="large-heading text-center top-benefits-heading" dangerouslySetInnerHTML={{ __html: d.benefits.title_html }} />
              </div>
              {d.benefits.items.map((b, i) => [
                b.gap ? <div key={`g${i}`} className="ast-col-md-12 column-gap"></div> : null,
                <div key={i} className="ast-col-md-6">
                  <div className="benefit">
                    <div className="benefit-icon">
                      <img className="no-lazy" src={b.icon} alt="" />
                    </div>
                    <div className="benefit-details">
                      <h4 className="benefits-details__title" dangerouslySetInnerHTML={{ __html: b.title_html }} />
                      <div className="benefits-details__desc" dangerouslySetInnerHTML={{ __html: b.desc_html }} />
                    </div>
                  </div>
                </div>,
              ])}
            </div>
          </div>
        </section>
      ) : null}

      {d.certificate ? (
        <section id="certificatePreview" className="section-padding certificate-preview-sect">
          <div className="ast-container">
            <div className="certificate-preview-row">
              <div className="ast-row">
                <div className="ast-col-md-5">
                  <div className="certificate-image">
                    <img src={d.certificate.image} alt="" />
                  </div>
                </div>
                <div className="ast-col-md-7">
                  <div className="certifate-preview-body">
                    <h2 className="large-heading font-500" dangerouslySetInnerHTML={{ __html: d.certificate.title_html }} />
                    <div className="certificate-preview-body__desc" dangerouslySetInnerHTML={{ __html: d.certificate.desc_html }} />
                    <div className="certificate-preview-buttons">
                      {d.certificate.buttons.map((b, i) => (
                        <a
                          key={i}
                          target="_blank"
                          href={b.link}
                          className={`btn btn-centered ${b.primary ? "btn-primary" : "btn-outline"}`}
                          dangerouslySetInnerHTML={{ __html: b.label_html }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.modules ? (
        <section id="courseModules" className="section-padding-bottom course-modules-section">
          <div className="ast-container">
            <div className="course-modules-row">
              <div className="ast-row">
                <div className="ast-col-md-12">
                  <h2 className="large-heading underlined-header" dangerouslySetInnerHTML={{ __html: d.modules.title_html }} />
                </div>
                <div className="course-modules-tab">
                  <div className="ast-col-md-6">
                    <div className="course-modules-tab__menu">
                      {chunk(d.modules.items, 4).map((row, r) => (
                        <div key={r} className="course-modules-tab__menu-row module-row">
                          {row.map((m, j) => {
                            const key = r * 4 + j;
                            return (
                              <a key={key} href={`#tab-${key + 1}`} className={`course-modules-tab__menu-link module-item ${key === 0 ? "active" : ""}`}>
                                {m.short}
                              </a>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    <div className="progress"></div>
                    <div className="course-time">
                      <div className="course-time__completion">
                        <img src="/wp-content/uploads/2024/11/completion-time.svg" alt="" />
                        <span dangerouslySetInnerHTML={{ __html: d.modules.completion_html }} />
                      </div>
                      <div className="course-time__study">
                        <img src="/wp-content/uploads/2024/11/study-time.svg" alt="" />
                        <span dangerouslySetInnerHTML={{ __html: d.modules.study_html }} />
                      </div>
                    </div>
                  </div>
                  <div className="ast-col-md-6">
                    <div className="course-modules-tab__content">
                      {d.modules.items.map((m, key) => (
                        <div key={key} id={`tab-${key + 1}`} className={`tab-body course-module-tab-body ${key === 0 ? "active" : ""}`}>
                          <h4 className="course-module-tab-body__title" dangerouslySetInnerHTML={{ __html: m.title_html }} />
                          <div className="course-module-tab-body__content" dangerouslySetInnerHTML={{ __html: m.content_html }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.cta_boxes ? (
        <section className="section-padding-bottom elt-salary-calc-section">
          <div className="ast-container">
            <div className="ast-row">
              {d.cta_boxes.map((b, key) => (
                <div key={key} className="ast-col-md-6">
                  <div className={`text-center cta-box cta-box-${key + 1}`}>
                    <h3 className="cta-box__title font-700" dangerouslySetInnerHTML={{ __html: b.title_html }} />
                    <div className="cta-box__summary" dangerouslySetInnerHTML={{ __html: b.summary_html }} />
                    <a href={b.link} className="btn btn-primary btn-centered" dangerouslySetInnerHTML={{ __html: b.button_html }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {d.milestones ? (
        <section className="milestones-section">
          <div className="ast-container">
            <div className="milestones-row">
              <div className="ast-row">
                {d.milestones.map((m, i) => (
                  <div key={i} className="ast-col-md-3">
                    <div className="milestone">
                      <h3 className="milestone-title text-white large-heading text-center" dangerouslySetInnerHTML={{ __html: m.title_html }} />
                      <div className="milestone-description text-center" dangerouslySetInnerHTML={{ __html: m.desc_html }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.guides ? (
        <section id="courseProspectus" className="section-padding guides-prospectus-section">
          <div className="ast-container">
            <div className="guides-prospectus-row">
              <div className="ast-row">
                {d.guides.guide ? (
                  <div className="ast-col-md-6">
                    <div className="guide-card">
                      <div className="guide-card__left">
                        <img src={d.guides.guide.image} alt="" />
                      </div>
                      <div className="guide-card__right">
                        <h3 className="guide-card-title" dangerouslySetInnerHTML={{ __html: d.guides.guide.title_html }} />
                        <div className="guide-card-summary equal-height-cta" dangerouslySetInnerHTML={{ __html: d.guides.guide.summary_html }} />
                        <a href={d.guides.guide.link} className="btn guide-cta-btn btn-primary btn-centered" dangerouslySetInnerHTML={{ __html: d.guides.guide.label_html }} />
                      </div>
                    </div>
                  </div>
                ) : null}
                {d.guides.prospectus ? (
                  <div className="ast-col-md-6">
                    <div className="prospectus-card">
                      <div className="prospectus-card__left">
                        <h3 className="prospectus-card-title" dangerouslySetInnerHTML={{ __html: d.guides.prospectus.title_html }} />
                        <div className="prospectus-card-summary equal-height-cta" dangerouslySetInnerHTML={{ __html: d.guides.prospectus.summary_html }} />
                        <a href={d.guides.prospectus.link} className="btn prospectus-cta-btn btn-primary btn-centered" dangerouslySetInnerHTML={{ __html: d.guides.prospectus.label_html }} />
                      </div>
                      <div className="prospectus-card__right">
                        <img src={d.guides.prospectus.image} alt="" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.team ? (
        <section id="teamSection" className="section-padding team-section">
          <div className="ast-container">
            <div className="team-section-row">
              <div className="ast-row">
                <div className="ast-col-md-12">
                  <h2 className="team-section-heading large-heading underlined-header text-center" dangerouslySetInnerHTML={{ __html: d.team.title_html }} />
                </div>
              </div>
              <div id="team-members-slider" className="splide team-members-slider">
                <div className="splide__track">
                  <ul className="splide__list">
                    {d.team.members.map((m, key) => [
                      <li key={`i${key}`} className="splide__slide">
                        <span dangerouslySetInnerHTML={{ __html: m.caption_html }} />
                        <div className={`member-image member-image-${key + 1}`}>
                          <img className="no-lazy" src={m.image} alt={m.alt} />
                        </div>
                      </li>,
                      <li key={`d${key}`} className="splide__slide">
                        <div className={`member-details member-details-${key + 1}`}>
                          <div className="member-details__summary" dangerouslySetInnerHTML={{ __html: m.desc_html }} />
                          <div className="member-name-desg-wrapper">
                            <h4 className="member-details__name font-700" dangerouslySetInnerHTML={{ __html: m.name_html }} />
                            <h4 className="member-details__designation font-400" dangerouslySetInnerHTML={{ __html: m.desg_html }} />
                          </div>
                        </div>
                      </li>,
                    ])}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.reviews ? (
        <section className="verified-student-reviews-section">
          <div className="ast-container">
            <div className="ast-row ">
              <div className="verified-student-reviews-section__header">
                <div className="ast-col-md-6">
                  <div className="header-wrapper">
                    <h2 className=" common-section-heading" dangerouslySetInnerHTML={{ __html: d.reviews.title_html }} />
                  </div>
                  <span className="verified-student-reviews-section__subtitle" dangerouslySetInnerHTML={{ __html: d.reviews.subtitle_html }} />
                </div>
                <div className="ast-col-md-6">
                  <div className="verified-student-reviews-section__header-right">
                    <a target="_blank" href="https://search.google.com/local/reviews?placeid=ChIJaeBYjIqxe0gR8IEtXkiDSWo" className="btn-primary btn">
                      <span>View All Reviews</span>
                      <i className="fa fa-angle-right"></i>
                    </a>
                    <div className="reviews-average">
                      <div className="rating-div">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-half-empty"></i>
                      </div>
                      <div className="total-count-text">
                        <span className="course-review-count">{`(${d.reviews.average})`}</span>
                        {` Out of ${d.reviews.total} global reviews`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="spacer-column"></div>
            <div className="ast-row verified-student-reviews-section__row">
              <div className="verified-student-reviews-section__row">
                <div className="ast-col-md-5">
                  <div className="verified-student-reviews-section__review-summary">
                    {d.reviews.stars.map((s) => (
                      <div key={s.i} className="review-status">
                        <div className="progress-text">{`${s.i} Star`}</div>
                        <div className="progress">
                          <div className="progress-bar" {...{ percent: s.pct }}></div>
                        </div>
                        <div className="progress-value">{`${s.pct}%`}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rplg rplg-insert" data-id="77247"></div>
                </div>
                <div className="ast-col-md-7 verified-student-reviews-section__slider" dangerouslySetInnerHTML={{ __html: d.reviews.brb_html }} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.videos ? (
        <section id="testimonials" className="video-testimonials-section section-padding">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h2 className="common-section-heading video-testimonials-section__title text-center" dangerouslySetInnerHTML={{ __html: d.videos.title_html }} />
                <div
                  className="video-testimonials-section__subtitle font-500 common-subheading text-center"
                  dangerouslySetInnerHTML={{ __html: d.videos.subtitle_html }}
                />
              </div>
            </div>
            <div className="spacer-column"></div>
            <div className="video-testimonials__slider splide">
              <div className="splide__arrows">
                <button className="splide__arrow splide__arrow--prev">
                  <i className="fa fa-arrow-left"></i>
                </button>
                <button className="splide__arrow splide__arrow--next">
                  <i className="fa fa-arrow-right"></i>
                </button>
              </div>
              <div className="splide__track">
                <ul className="splide__list">
                  {d.videos.items.map((t, i) => (
                    <li key={i} className="splide__slide">
                      <div className="video-testimonial-card">
                        <div className="video-testimonial-card_image-container">
                          <img src={t.thumb} alt="" className="video-testimonial-card__image" />
                        </div>
                        <div className="video-testimonial-card_content">
                          <span className="video-testimonial-card__title" dangerouslySetInnerHTML={{ __html: t.title_html }} />
                          <h3 className="video-testimonial-card__name font-600 small-heading" dangerouslySetInnerHTML={{ __html: t.name_html }} />
                          <span className="video-testimonial__subtitle font-400" dangerouslySetInnerHTML={{ __html: t.desg_html }} />
                          <a href={t.link} data-lity="" className="btn btn-primary">
                            <span>Watch Now</span>
                            <img src="/wp-content/uploads/2024/10/play-btn-white.svg" alt="" />
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.offer_banner ? (
        <section className="offer-banner-section">
          <div className="ast-container">
            <div className="offer-banner-row">
              <div className="ast-row ast-flex">
                <div className="ast-col-md-3">
                  <div className="offer-banner-logo text-center">
                    <img src={d.offer_banner.image} alt="" />
                  </div>
                </div>
                <div className="ast-col-md-6">
                  <div className="offer-banner-clock" dangerouslySetInnerHTML={{ __html: d.offer_banner.clock_html }} />
                </div>
                <div className="ast-col-md-3 text-center">
                  <a href="#" className="btn font-700 offer-banner-btn btn-centered btn-outline" dangerouslySetInnerHTML={{ __html: d.offer_banner.button_html }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section id="faqs" className="faqs-section faqs-section-redesigned section-padding">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <h2 className=" faqs-heading common-section-heading">faqs</h2>
            </div>
            <div className="ast-col-md-8 faqs">
              <div className="faqs-wrapper equal-height">
                <div className="faqs-accordion">
                  {d.faqs.map((f) => (
                    <div key={f.id} className={`faqs-accordion__item ${f.first ? "active" : ""}`}>
                      <input type="radio" id={`acc-${f.id}`} name="faq-accordion" defaultChecked={f.first} hidden />
                      <label className="font-700" htmlFor={`acc-${f.id}`}>
                        <span dangerouslySetInnerHTML={{ __html: f.question_html }} />
                        <i className="fa fa-plus"></i>
                      </label>
                      <div className={`font-500 faqs-accordion__content ${f.first ? "active" : ""}`} dangerouslySetInnerHTML={{ __html: f.answer_html }} />
                    </div>
                  ))}
                </div>
                <div className="show-more-faqs">
                  <span>Show More Faqs</span>
                </div>
              </div>
            </div>
            <div className="ast-col-md-4">
              <div className="app-download-container equal-height" style={{ background: "url('/wp-content/uploads/2024/10/app_download.png')" }}>
                <h4>STUDY ON THE GO</h4>
                <span>Download the app</span>
                <div className="app-download-cta__icons flex-box">
                  <a href="https://play.google.com/store/apps/details?id=com.teflinstitute.teflinstitute">
                    <img src="/wp-content/uploads/2021/08/google-play-logo-1.svg" />
                  </a>
                  <a href="https://apps.apple.com/app/id1568312366">
                    <img src="/wp-content/uploads/2021/08/apple-logo-1.svg" />
                  </a>
                </div>
                <div className="donwload-icon text-center font-600">
                  <span>Download App</span>
                  <img src="/wp-content/uploads/2024/10/donwload_icon.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tefl-search-section section-padding-bottom">
        <div className="ast-container">
          {/* The [tefl_course_search] output sits next to the h2, so the two go in as one innerHTML. */}
          <div
            className="tefl-search"
            dangerouslySetInnerHTML={{
              __html: `<h2 class=" common-section-heading tefl-search-section__title text-center">Find The Best TEFL Course For You:</h2>${d.search_html}`,
            }}
          />
        </div>
      </section>
    </div>
  );
}

