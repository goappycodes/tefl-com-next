/**
 * Native port of the theme's single-course-template-new2023.php (the "new design"
 * course page) with the includes it prints (klarna_label.php, klarna_modal.php,
 * ti-deposit-form.php, virtual-course-variation.php). Data from course-new2023.php.
 *
 * Same markup and class names as the PHP template, so the theme's CSS and JS
 * (tabs, read-more, glide sliders, Klarna modal, deposit toggle, installment
 * breakdown and price AJAX, timetable tabs, select menus, countdown) keep working
 * unchanged — nothing is taken over here. Executable scripts the template prints
 * are rendered deferred (`text/tefl-deferred`), as the render endpoint does, and
 * WpScripts runs them after hydration.
 */
import type { CourseNew2023Data, New2023Button, New2023Deposit, New2023TimetableTab } from "./types";

type D = CourseNew2023Data;

const html = (s: string) => ({ __html: s });
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const TP_SRC = "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
const DOWNLOAD_ICON = "/wp-content/uploads/2025/03/download-icon.png";
const SELECT_ARROW = "/wp-content/uploads/2024/09/Vector-107.svg";
const PLAY_BTN = "/wp-content/uploads/2020/11/play-btn.svg";
const IELTS_LOGO = "/wp-content/uploads/2025/04/IELTS-Educator-logo.png";

export default function CourseNew2023({ data }: { data: D }) {
  return (
    <div id="primary" className={data.primary_class}>
      <script type="application/ld+json" dangerouslySetInnerHTML={html(data.ld_course)} />
      <div className="product-schema-output-custom" style={{ display: "none" }} />

      <section className="full-width top-bar-section">
        <div className="ast-container">
          <div className="ast-row">
            {data.top_bar ? (
              <div className="top-bar-container">
                {data.top_bar.map((t, i) => (
                  <div key={i} className="bar">
                    <img className="bar__image" src="/wp-content/uploads/2022/11/checkmark.png" />
                    <div className="bar__content" dangerouslySetInnerHTML={html(t)} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <Hero data={data} />
      {data.free_bundle ? <FreeBundle fb={data.free_bundle} /> : null}
      <Tabs tabs={data.tabs} />

      {data.virtual ? (
        <>
          {data.virtual.summary ? <div className="course-summary-virtual" dangerouslySetInnerHTML={html(data.virtual.summary)} /> : null}
          <Timetable v={data.virtual} />
        </>
      ) : null}

      {data.level5 ? (
        <section className="level5-video-section">
          <div className="ast-container level5-video-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h2 className="large-heading text-center common-heading" dangerouslySetInnerHTML={html(data.level5.heading)} />
              </div>
            </div>
            <div className="ast-row level5-video-row">
              {data.level5.videos.map((v, i) => (
                <div key={i} className="ast-col-md-6 level5-video-col">
                  <div className="video-container">
                    <a href={v.link} data-lity="">
                      <div className="video-img">
                        <img src={v.thumb} />
                      </div>
                      <div className="video-play-btn">
                        <img className="video__play" src={PLAY_BTN} alt="" />
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {data.features ? <Features f={data.features} /> : null}

      <section className="search-courses-section section-padding-bottom">
        <div className="ast-container">
          <div className="ast-row">
            <h2 className="search-courses-section__heading text-center common-heading">Find The Perfect TEFL Course</h2>
            <div className="search-courses-section__body ast-col-md-12" dangerouslySetInnerHTML={html(data.search_html)} />
          </div>
        </div>
      </section>

      {data.reviews ? <Reviews r={data.reviews} /> : null}

      {data.trial ? (
        <section className="trial-course-section section-padding-bottom">
          <div className="ast-container">
            <div className="ast-row ast-flex">
              <div className="left ast-col-md-6">
                <div className="trial-course-section__image" style={{ backgroundImage: `url('${data.trial.image}')` }} />
              </div>
              <div className="right ast-col-md-6">
                <div className="trial-course-section__content">
                  <h2 className="title common-heading" dangerouslySetInnerHTML={html(data.trial.title)} />
                  <div className="content" dangerouslySetInnerHTML={html(data.trial.content)} />
                  <a href={data.trial.link} className="btn btn-black " dangerouslySetInnerHTML={html(data.trial.value)} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {data.offers ? <Offers data={data} /> : null}

      {data.instructors ? (
        <section className="instructors-info-section section-padding">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h3 className="instructors-info-section__subheading text-center" dangerouslySetInnerHTML={html(data.instructors.subheading)} />
                <h2 className="instructors-info-section__heading common-heading text-center" dangerouslySetInnerHTML={html(data.instructors.heading)} />
                <div className="instructors-info-section__summary w-75 text-center" dangerouslySetInnerHTML={html(data.instructors.summary)} />
                <div className="instructors-info-section__instructors">
                  <div className="glide instructors-glide">
                    <div className="glide__track" data-glide-el="track">
                      <ul className="glide__slides">
                        {data.instructors.items.map((ins, i) => (
                          <li key={i} className="glide__slide">
                            <div className="instructor-card">
                              <img src={ins.image} alt="" className="instructor-card__image no-lazy" />
                              <h4 className="instructor-card__name" dangerouslySetInnerHTML={html(ins.name)} />
                              <span className="instructor-card__designation" dangerouslySetInnerHTML={html(ins.designation)} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glide__arrows" data-glide-el="controls">
                      <a className="glide__arrow glide__arrow--left" data-glide-dir="<">
                        <i className="fa fa-angle-left" />
                      </a>
                      <a className="glide__arrow glide__arrow--right" data-glide-dir=">">
                        <i className="fa fa-angle-right" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {data.salary_bar ? (
        <section className="salary-calculator-cta-section">
          <div className="ast-container">
            <div className="salary-calculator-cta">
              <div className="ast-row">
                <div className="bar-content ast-col-md-9" dangerouslySetInnerHTML={html(data.salary_bar.content)} />
                <div className="bar-button ast-col-md-3">
                  <a className="btn btn-white btn-rounded" href={data.salary_bar.link} dangerouslySetInnerHTML={html(data.salary_bar.text)} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {data.ielts ? <Ielts b={data.ielts} /> : null}
      {data.certificate ? <Certificate c={data.certificate} /> : null}
      {data.accreditation ? <Accreditation a={data.accreditation} /> : null}

      {data.testimonials ? (
        <section className="video-testimoinials-section section-padding">
          <div className="ast-container">
            <div className="ast-row">
              <h2 className="video-testimonials-section__heading text-center common-heading" dangerouslySetInnerHTML={html(data.testimonials.heading)} />
              <div className="ast-col-md-12 video-testimonials-section__slider">
                <div className="glide video-testimoinials__glide">
                  <div className="glide__track" data-glide-el="track">
                    <ul className="glide__slides">
                      {data.testimonials.slides.map((sl, i) => (
                        <li key={i} className="glide__slide">
                          <div className="video-testimonial-card">
                            <a href={sl.link} className="popup-video-review">
                              <div className="video-testimonial-card_image-container">
                                <img src={sl.image} alt="" className="video-testimonial-card__image no-lazy" />
                                <img className="play-btn no-lazy" src={PLAY_BTN} />
                              </div>
                              <h3 className="video-testimonial-card__title" dangerouslySetInnerHTML={html(sl.title)} />
                              <h4 className="video-testimonial__subtitle" dangerouslySetInnerHTML={html(sl.subtitle)} />
                              <div className="video-testimonial-card__snippet" dangerouslySetInnerHTML={html(sl.snippet)} />
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glide__arrows" data-glide-el="controls">
                    <button className="glide__arrow glide__arrow--left" data-glide-dir="<">
                      <i className="fa fa-angle-left" />
                    </button>
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

      {data.funding ? (
        <div className="funding" style={{ display: "none" }}>
          <div className="ast-container">
            <h6 className="section-heading">Student or Unemployed Funding:</h6>
            <div className="ast-row">
              <div className="ast-col-md-12" dangerouslySetInnerHTML={html(data.funding)} />
            </div>
          </div>
        </div>
      ) : null}

      {data.resources ? (
        <section className="popular-resources-section section-padding">
          <div className="ast-container">
            <div className="ast-row">
              <h2 className="popular-resources-section__heading text-center common-heading" dangerouslySetInnerHTML={html(data.resources.heading)} />
              <div className="popular-resources-section__cards">
                {data.resources.cards.map((c, i) => (
                  <div key={i} className="ast-col-md-4">
                    <div className="resources-card">
                      <h3 className="recources-card__title text-center" dangerouslySetInnerHTML={html(c.title)} />
                      <img src={c.image} className="recources-card__image" alt="" />
                      <div className="resources-card__summary" dangerouslySetInnerHTML={html(c.summary)} />
                      <div className="resources-card__buttons">
                        {c.buttons.map((b, k) => (
                          <a key={k} href={b.link} dangerouslySetInnerHTML={html(b.text)} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {data.virtual_faqs ? <VirtualFaqs faqs={data.virtual_faqs} /> : null}
      {data.learn_more ? <LearnMore link={data.learn_more.link} /> : null}
    </div>
  );
}

/* ---------------------------------------------------------------- hero */

function Hero({ data }: { data: D }) {
  const h = data.hero;
  // span.full-price holds the WooCommerce price HTML followed by the savings badge.
  const fullPrice =
    h.price + (h.save ? `<div class="savings" style="--text-color:${esc(h.savings_color)}">${esc(`Save ${h.save}%`)}</div>` : "");
  return (
    <section className="hero-banner-section" style={{ backgroundImage: `url('${h.bg}')` }}>
      <div className="ast-container">
        <div className="ast-row ast-flex">
          <div className="ast-col-md-6">
            <div className="hero-banner__content">
              <div className="hero-banner__heading">
                {h.interactive ? (
                  <div className="is-interactive" style={{ ["--border-color" as string]: h.border_color }}>
                    <div className="wrapper-class">
                      <img src="/wp-content/uploads/2023/07/interactive_icon.svg" alt="" className="interactive-icon" />
                      <span className="interactive-text">Interactive course</span>
                    </div>
                  </div>
                ) : null}
                <span className="page-title__sub" dangerouslySetInnerHTML={html(h.subtitle)} />
                <h1
                  className={`page-title__main large-heading ${h.flex_title ? "flex-title" : ""}`}
                  style={{ ["--underline-color" as string]: h.underline }}
                >
                  {h.logo_before ? <img src={IELTS_LOGO} alt="" /> : null}
                  <span dangerouslySetInnerHTML={html(h.title)} />
                  {h.logo_after ? <img src={IELTS_LOGO} alt="" /> : null}
                </h1>
              </div>
              <div className="tution-fee">
                <div id="priceWrapper" className={`tution-fee-txt ${h.klarna ? "has-klarna" : "no-klarna"}`}>
                  <span
                    data-isfixed3995={h.fixed_3995}
                    data-isfixed99={h.fixed_99}
                    data-depositpercent={h.deposit_percent}
                    className={`full-price ${h.deposit_class}`}
                    dangerouslySetInnerHTML={html(fullPrice)}
                  />
                  {h.klarna ? <Klarna third={h.klarna_third} /> : null}
                </div>
                {h.extra_info ? <div className="course-extra-info" dangerouslySetInnerHTML={html(h.extra_info)} /> : null}
                <div className="deposit-breakdown">
                  {h.deposit ? (
                    <div
                      className={`wc-deposits-wrapper ${h.deposit.forced ? "wc-deposits-forced" : "wc-deposits-optional"}`}
                      dangerouslySetInnerHTML={html(depositHtml(h.deposit, h.deposit_colors))}
                    />
                  ) : null}
                </div>
              </div>
              <div className="hero-banner__summary" dangerouslySetInnerHTML={html(h.summary)} />
              <div className="banner-cta-buttons">
                {h.select_two ? (
                  h.select_two.empty ? null : (
                    <>
                      <input type="hidden" name="selected_courses" id="selected_courses_field" value={h.select_two.defaults} />
                      <div className="select-menu select-two-required" data-defaults={h.select_two.defaults}>
                        <span>Select Two Courses</span>
                        <div className="select-btn">
                          <span className="sBtn-text">Choose your 60 Hour Courses</span>
                          <img className="no-lazy" src={SELECT_ARROW} alt="" />
                        </div>
                        <ul className="options">
                          {h.select_two.products.map((p) => (
                            <li key={p.pid} className="option" data-pid={p.pid} data-name={p.name_attr}>
                              <span className="option-text" style={{ display: "flex", gap: "8px" }}>
                                <span className="custom-checkbox" aria-hidden="true" />
                                <b dangerouslySetInnerHTML={html(p.name_html)} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )
                ) : (
                  <a className="callback-btn banner-btn" href="/callback" dangerouslySetInnerHTML={html(h.btn1)} />
                )}
                {h.virtual ? (
                  <a className="ti-enroll-btn banner-btn text-center" href="#timetable" dangerouslySetInnerHTML={html(h.btn2)} />
                ) : (
                  <a className="ti-enroll-btn enroll-now-btn banner-btn" rel="nofollow" href={h.enrol} dangerouslySetInnerHTML={html(h.btn2)} />
                )}
              </div>
              <div className="d-none" style={{ marginTop: "2rem" }} dangerouslySetInnerHTML={html(trustpilot(TP_GB, h.tp_tags))} />
              {h.tp_tag ? <div style={{ marginTop: "2rem" }} dangerouslySetInnerHTML={html(trustpilot(TP_US, h.tp_tag))} /> : null}
            </div>
          </div>
          <div className="ast-col-md-6 hero-banner__logo-container">
            {h.logos.map((l, i) =>
              l.link ? (
                <a key={i} href={l.link}>
                  <img src={l.src} className={l.class} alt="" />
                </a>
              ) : (
                <img key={i} src={l.src} alt="" className={l.class} />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const TP_GB = { locale: "en-GB", height: "30px", token: "", stars: "1,2,3,4,5", link: "https://uk.trustpilot.com/review/teflinstitute.com" };
const TP_US = { locale: "en-US", height: "50px", token: "ff8bfbc9-6191-40f5-9ffb-021d1cc6f484", stars: "4,5", link: "https://www.trustpilot.com/review/teflinstitute.com" };

/**
 * A TrustBox: its bootstrap <script> (deferred, see the header) then the widget. One
 * string, because a JSX <script async src> gets hoisted into <head> by React.
 */
function trustpilot(o: typeof TP_GB, tags: string): string {
  return (
    `<script type="text/tefl-deferred" src="${TP_SRC}" async></script>` +
    `<div class="trustpilot-widget" data-locale="${o.locale}" data-template-id="5418052cfbfb950d88702476" data-businessunit-id="61c0c19118c53fc28bcc355d" data-style-height="${o.height}" data-style-width="100%"` +
    (o.token ? ` data-token="${o.token}"` : "") +
    ` data-tags="${esc(tags)}" data-stars="${o.stars}" data-review-languages="en"><a href="${o.link}" target="_blank" rel="noopener">Trustpilot</a></div>`
  );
}

/** includes/klarna_label.php + includes/klarna_modal.php (not the front page). */
function Klarna({ third }: { third: string }) {
  return (
    <>
      <div className="klarna-label-outer">
        <div className="klarna-payment-info-container">
          <img src="/wp-content/uploads/2023/07/Klarna-logotype-black.svg_.svg" alt="" className="klarna-logo" />
          <div
            className="klarna-payment-info"
            dangerouslySetInnerHTML={html(`Split the purchase into 3 payments of ${third} (0 APR).<span class="klarna-learn-more">Learn more</span>`)}
          />
        </div>
      </div>
      <div id="klarnaModal" className="klarna-modal">
        <div className="modal-content">
          <span className="close">×</span>
          <img className="klarna-logo-header" src="/wp-content/uploads/2023/07/Klarna-logotype-black.svg_.svg" alt="" />
          <h2 className="klarna-modal-header" dangerouslySetInnerHTML={html(`3 interest-free payments of ${third} (0 APR).`)} />
          <span className="klarna-modal-subheader">Pay in 3 interest-free payments so you can spread the cost. No fees.</span>
          <div className="klarna-payment-details">
            <span className="klarna-payment-detail">Add item(s) to your basket.</span>
            <span className="klarna-payment-detail">
              Go to checkout and choose
              <img src="/wp-content/uploads/2023/07/klarna.svg" alt="" className="klarna-logo" />
            </span>
            <span className="klarna-payment-detail">Enter your debit or credit card information.</span>
            <span className="klarna-payment-detail">
              To check eligibility, Klarna will perform a soft search with credit reference agency. This will not affect your credit
              score.
            </span>
            <span className="klarna-payment-detail">
              Spread the cost in 3 interest-free payments. The first payment is made at point of purchase, with the remaining 2
              payments scheduled automatically every 30 days. No fees.
            </span>
          </div>
          <div className="klarna-payment-footnote">
            Please note that a higher initial payment maybe required for some purchases. You must be 18+ to use this credit offer.
            Klarna uses soft searches with credit reference agencies. This do not affect your credit rating. Missed payments can
            affect your ability to use Pay in 3 feature.
          </div>
          <a href="#" className="close close-btn">
            Close
          </a>
        </div>
      </div>
    </>
  );
}

/** The .wc-deposits-wrapper innerHTML as ti-deposit-form.php prints it (string: `checked='checked'`). */
function depositHtml(d: New2023Deposit, c: [string, string, string, string]): string {
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
      `<ul class="wc-deposits-option ${esc(d.total_deposits)}" style="--active-bg-color:${esc(c[0])}; --active-text-color:${esc(c[1])}; --inactive-bg-color:${esc(c[2])}; --inactive-text-color:${esc(c[3])}; ">` +
      `<li class="active "><input type="radio" name="wc_deposit_option" value="no" class="radio-custom wc-option-pay-full" id="wc-option-pay-full"${d.full_checked ? " checked='checked'" : ""} />` +
      `<label for="wc-option-pay-full" class="radio-custom-label">Pay in Full</label></li>` +
      `<li ><input type="radio" name="wc_deposit_option" value="yes" class="wc-option-pay-deposit radio-custom " id="wc-option-pay-deposit"${d.deposit_checked ? " checked='checked'" : ""} />` +
      `<label for="wc-option-pay-deposit" class="radio-custom-label radio-custom-label-pay-deposit">${esc(`Pay in ${d.total_deposits}`)}</label></li>` +
      `</ul>`;
  }
  const style = d.show ? "display:block;" : "display:none;";
  if (d.is_plan) {
    h +=
      `<div class="show-breakdown  wc-deposits-payment-plans" style="${style}">` +
      d.descriptions.map((t) => `<span class="wc-deposits-payment-plan-description">${t}</span>`).join("") +
      `</div>`;
  } else {
    h += `<div class="wc-deposits-payment-description" style="${style}">${d.amount_html}</div>`;
  }
  return h;
}

/* ---------------------------------------------------------------- sections */

function FreeBundle({ fb }: { fb: NonNullable<D["free_bundle"]> }) {
  return (
    <section className="section-padding-top free-bundle-section">
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12">
            <div className="free-bundle-card">
              <div className="free-bundle-content">
                {fb.label ? (
                  <div className="free-bundle-label-row">
                    <span className="free-bundle-label">
                      {fb.label}
                      <svg
                        className="outline-svg"
                        preserveAspectRatio="none"
                        dangerouslySetInnerHTML={html('<rect x="0" y="0" width="100%" height="100%" rx="6" ry="6" pathLength="100"/>')}
                      />
                    </span>
                    <span className="free-bundle-flame" aria-hidden="true">
                      <img className="no-lazy" src="/wp-content/uploads/2026/04/source.gif" alt="" />
                    </span>
                  </div>
                ) : null}
                {fb.title ? <h3 className="free-bundle-title">{fb.title}</h3> : null}
                {fb.summary ? <p className="free-bundle-summary" dangerouslySetInnerHTML={html(fb.summary)} /> : null}
              </div>
              {fb.image ? (
                <div className="free-bundle-visual">
                  <span className="bundle-caption">{fb.caption}</span>
                  <img className="no-lazy" src={fb.image} alt={fb.alt} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tabs({ tabs }: { tabs: D["tabs"] }) {
  return (
    <section className="course-details-section section-padding-top">
      <div className="ast-container">
        <div id="tabs-section" className="tabs ast-row">
          <div className="ast-col-md-6 tab-wrapper">
            <ul className="tab-head">
              {tabs.map((t, key) => (
                <li key={key}>
                  <a href={`#tab-${key + 1}`} className={`tab-link ${key === 0 ? "active" : ""}`}>
                    <span className="tab-label" dangerouslySetInnerHTML={html(t.title)} />
                    <i className="fa fa-arrow-right" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="ast-col-md-6">
            <div className="course-details-tab-content">
              {tabs.map((t, key) => (
                <section
                  key={key}
                  data-extra-content={t.extra}
                  id={`tab-${key + 1}`}
                  className={`tab-body ${key === 0 ? "active active-content" : ""}`}
                >
                  <h2 className="tab-body__title large-heading" dangerouslySetInnerHTML={html(t.heading)} />
                  {t.faq ? (
                    <div className="tab-body__content--faq">
                      <script type="application/ld+json" dangerouslySetInnerHTML={html(t.faq.ld)} />
                      {t.faq.items.map((f, i) => (
                        <div key={i} className="tab-faq">
                          <h3 className="tab-faq__question" dangerouslySetInnerHTML={html(f.q)} />
                          <div className="tab-faq__answer" dangerouslySetInnerHTML={html(f.a)} />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="tab-body__content--main" dangerouslySetInnerHTML={html(t.content)} />
                  {t.extra !== "faq-content" ? (
                    <div className="tab-body__content--extra">
                      {t.accordion ? (
                        <ul className="tab-body__content--accordion">
                          {t.accordion.map((a, i) =>
                            a.content ? (
                              <li key={i}>
                                <input type="checkbox" name={`faq-trigger-${a.key}`} defaultChecked={a.key === "0"} />
                                <i />
                                <h2>
                                  <span className="faq-drawer__title--sub" dangerouslySetInnerHTML={html(a.subtitle)} />
                                  <span className="faq-drawer__title--main" dangerouslySetInnerHTML={html(a.title)} />
                                </h2>
                                <div className="faq-drawer__content-wrapper">
                                  <div className="faq-drawer__content" dangerouslySetInnerHTML={html(a.content)} />
                                </div>
                              </li>
                            ) : (
                              <h5 key={i} className="accordion-header" dangerouslySetInnerHTML={html(a.title)} />
                            ),
                          )}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </section>
              ))}
              <div className="read-more-btn-container">
                <div>
                  <span>read more</span>
                  <i className="fa fa-angle-down" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** includes/virtual-course-variation.php (post type course). */
function Timetable({ v }: { v: NonNullable<D["virtual"]> }) {
  const tab = (name: string) => v.tabs.find((t) => t.name === name)!;
  return (
    <div className="section section-padding timetable-section" id="timetable">
      <div className="ast-container">
        <div className="ast-row course_content_row">
          <div className="ast-col-md-12 tablecontent-col">
            <h6 className="centered common-heading">Upcoming Classes by Timezone</h6>
            <div className="flexible-booking-btn">
              <a className="btn btn-primary btn-rounded" rel="nofollow" href={v.flexible}>
                <span>Flexible booking</span>
                <img src="/wp-content/uploads/2025/04/flexible-icon.png" alt="" />
              </a>
              <span> Book now and choose the date later</span>
            </div>
            <ul className="nav nav-tabs">
              <li role="presentation" className="london-li">
                <a data-title="london" className="active">
                  <i className="fa fa-angle-double-right" />
                  UK<span> (London)</span>
                </a>
              </li>
              <li role="presentation" className="boston-li">
                <a data-title="boston">
                  <i className="fa fa-angle-double-right" />
                  USA<span> (Boston)</span>
                </a>
              </li>
              <li role="presentation" className="vancouver-li">
                <a data-title="vancouver">
                  <i className="fa fa-angle-double-right" />
                  Canada<span> (Vancouver)</span>
                </a>
              </li>
              <li role="presentation" className="southafrica-li">
                <a data-title="southafrica">
                  <i className="fa fa-angle-double-right" />
                  South Africa<span> (Cape Town)</span>
                </a>
              </li>
            </ul>
            <div className={`tab-content ${v.day_light}`}>
              <div className="london tab-pane fade in active">
                <TimetableTable t={tab("london")} />
              </div>
              <div className="boston tab-pane fade in">
                <TimetableTable t={tab("boston")} />
              </div>
              <div className="vancouver tab-pane fade in">
                <TimetableTable t={tab("vancouver")} />
              </div>
              <div className="southafrica tab-pane fade in">
                <TimetableTable t={tab("southafrica")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimetableTable({ t }: { t: New2023TimetableTab }) {
  return (
    <>
      {t.ld.map((json, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={html(json)} />
      ))}
      <div className="table-outer-div">
        <table className="tablecontent">
          <thead>
            <tr className="table_header">
              <th className="tablepara date">Dates</th>
              <th className="tablepara time">Time</th>
              <th className="tablepara availability">Availability</th>
              <th className="tablepara price">Price</th>
              <th className="tablepara enroll_btn">Booking</th>
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.n} className={`${r.disabled} course-row-${r.n}`}>
                <td className="date">{r.date}</td>
                <td className="time">{r.time}</td>
                <td className={`availability ${r.low}`} dangerouslySetInnerHTML={html(r.avail)} />
                <td className={`price ${r.low} `} dangerouslySetInnerHTML={html(t.price)} />
                <td className="enroll_btn">
                  <a rel="nofollow" className={`table_btn ${r.disabled}`} href={r.href}>
                    Enrol
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {t.more ? (
          <div className="dates-more">
            <span>SHOW ALL DATES</span>
          </div>
        ) : null}
      </div>
    </>
  );
}

function Features({ f }: { f: NonNullable<D["features"]> }) {
  const cta = (c: NonNullable<typeof f.elt>, extra: string) => (
    <div className="ast-col-md-6">
      <div className={`elt-cta-col${extra}`}>
        <h3 className="elt-cta__title" dangerouslySetInnerHTML={html(c.title)} />
        <div className="elt-cta__text text-center" dangerouslySetInnerHTML={html(c.text)} />
        <a href={c.link} className="btn btn-black elt-cta__btn" dangerouslySetInnerHTML={html(c.btn)} />
      </div>
    </div>
  );
  return (
    <section className="course-features-section section-padding">
      <div className="ast-container">
        <div className="ast-row ast-flex feature-row">
          {f.elt ? cta(f.elt, "") : null}
          {f.salary ? cta(f.salary, " salary-cta-col") : null}
          {f.items.map((it, i) => (
            <div key={i} className="ast-col-md-6">
              <div className="feature-col">
                <h3 className="feature__heading" dangerouslySetInnerHTML={html(it.heading)} />
                <div className="feature__content" dangerouslySetInnerHTML={html(it.content)} />
                {it.verify !== null ? (
                  <div
                    className="feature__verification-form"
                    dangerouslySetInnerHTML={html(`<h3 class="feature__heading">Academic Credentials Verification</h3>${it.verify}`)}
                  />
                ) : null}
              </div>
            </div>
          ))}
          {f.highlighted ? (
            <div className="ast-col-md-6">
              <div className="feature-col feature-col--highlight">
                <div className="feature-col-flex-wrapper">
                  <div>
                    {f.highlighted.map((t, i) => (
                      <div key={i} className="highlight-feature">
                        <i className="fa fa-check-circle" />
                        <span dangerouslySetInnerHTML={html(t)} />
                      </div>
                    ))}
                  </div>
                  {f.europass ? (
                    <div className="europass-logo">
                      <a href="https://europass.europa.eu/en/europass-digital-tools/european-qualifications-framework" target="_blank">
                        <img src="/wp-content/uploads/2024/12/image_2024_12_06T13_41_38_015Z-e1733560354534.png" alt="" />
                      </a>
                    </div>
                  ) : null}
                </div>
                {f.guide ? <a href={f.guide.link} className="guide_link" dangerouslySetInnerHTML={html(f.guide.value)} /> : null}
              </div>
            </div>
          ) : null}
          <div className="ast-col-md-6">
            <div className="prospectus-cta-box prospectus-cta">
              <img src="/wp-content/uploads/2025/05/prospectus-cover-2.png" alt="" />
              <h4 className="prospectus-cta-box__title">TEFL STUDY PROSPECTUS</h4>
              <div className="prospectus-cta-box__summary">Explore global teaching opportunities with our TEFL study prospectus</div>
              <a href="/wp-content/uploads/2023/06/TEFL-Institute-Prospectus-2.pdf" className="btn" target="_blank">
                <span>Download</span>
                <img src={DOWNLOAD_ICON} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const GOOGLE_REVIEWS =
  "https://www.google.com/search?sca_esv=8d785069c21da656&sca_upv=1&hl=en-IE&gl=ie&q=The+TEFL+Institute+Ireland+%7C+TEFL+Courses+%26+Certification,+13+Adelaide+Rd,+Saint+Kevin%27s,+Dublin,+D02+P950&uds=ADvngMhDJElofzFqOx8yLCqxrZBfORdohN-zZWd2DtE2wkfY_Hz8LxAbxWyTqbQXp_hpoUOW2uxhpWyrB1IL2IpdWcWiPs5S-vGBywcJzrO9PJe_HdF91Ppndo2Knjst1hsy0DuQ_1Yy71pyrotGeYeqK9tgwKhS1Dz3nAO5HG6XIft-vP8sUXZPMIt75-GkZH8kdUstEDG07k_uQg6GZSA3HkqfKbTCnzBS1_wxYJkYsxPWWzYHd35xJVCoLbwXmLTFBoT-lFXh&si=ACC90nwjPmqJHrCEt6ewASzksVFQDX8zco_7MgBaIawvaF4-7mSRR1kRGE4hCmZtLOUumbi46V_tOIxRTOEjel4eIAxPbsZAzQfZDyayafoOPMus5kIWjD0%3D&sa=X&ved=2ahUKEwixoZaa4Z6HAxUHYEEAHXfKDf8Q3PALegQIGxAE&biw=1536&bih=745&dpr=2";

function Reviews({ r }: { r: NonNullable<D["reviews"]> }) {
  return (
    <section className="students-review">
      <div className="ast-container">
        <div className="ast-row ast-flex students-review-row">
          <div className="ast-col-md-6 students-review__image" style={{ backgroundImage: `url('${r.image}')` }} />
          <div className="ast-col-md-6">
            <div className="students-review__content">
              <h2 className="students-review__content-heading" dangerouslySetInnerHTML={html(r.heading)} />
              <div className="rating-div-wrapper">
                <div>
                  <div className="rating-div">
                    <i className="fa fa-star" />
                    <i className="fa fa-star" />
                    <i className="fa fa-star" />
                    <i className="fa fa-star" />
                    <i className="fa fa-star-half-empty" />
                    <span className="course-review-count">{`(${r.average})`}</span>
                  </div>
                  <div className="total-count-text">{`Out of ${r.total} global reviews`}</div>
                </div>
                <a
                  href={GOOGLE_REVIEWS}
                  className="btn-centered btn reviews-btn"
                  style={{ ["--btn-text-color" as string]: r.btn_text, ["--btn-bg-color" as string]: r.btn_bg }}
                >
                  Read all reviews
                </a>
              </div>
              <div className="reviews-summary">
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
              <div className="students-review__content-slider" dangerouslySetInnerHTML={html(r.slider)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Offers({ data }: { data: D }) {
  return (
    <section className="course-offer-section section-padding">
      <div className="ast-container">
        {data.offers!.map((o, key) => (
          <Offer key={key} o={o} data={data} />
        ))}
      </div>
    </section>
  );
}

function Offer({ o, data }: { o: NonNullable<D["offers"]>[number]; data: D }) {
  return (
    <>
      <div className="ast-row course-offer-section__header">
        <div className="ast-col-md-12">
          {o.first ? <h2>Limited Time TEFL Offer</h2> : null}
          {/* The template closes this <h6> with </h2>; the browser ends the h6 there. */}
          <h6 className="font-600" dangerouslySetInnerHTML={html(o.title)} />
        </div>
      </div>
      <div className="ast-row course-offer-section__body">
        <div className="ast-col-md-4">
          <div className="course-offer-features">
            {o.show_incexc ? (
              <div className="inc-exc-div">
                <h3 className="inc-exc-title">What’s Included</h3>
                {o.includes.map((t, i) => (
                  <div key={`i${i}`} className="item inc-item">
                    <i className="fa fa-check" />
                    <div dangerouslySetInnerHTML={html(t)} />
                  </div>
                ))}
                {o.excludes.map((t, i) => (
                  <div key={`e${i}`} className="item exc-item">
                    <i className="fa fa-times" />
                    <div dangerouslySetInnerHTML={html(t)} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="ast-col-md-4">
          <div className="course-offer-details">
            {o.image ? (
              <div className=" d-none course-img">
                <img src={o.image} />
              </div>
            ) : null}
            {o.timer ? (
              <div className="countdown-timer" data-expiry={o.timer}>
                <ul className="timer">
                  <li>
                    <span id="dayCount" />
                    <span id="day-text">days</span>
                  </li>
                  <li>
                    <span id="hourCount" />
                    <span id="hour-text">hours</span>
                  </li>
                  <li>
                    <span id="minuteCount" />
                    <span id="minute-text">minutes</span>
                  </li>
                  <li>
                    <span id="secondCount" />
                    <span id="second-text">seconds</span>
                  </li>
                </ul>
              </div>
            ) : null}
            <div className="hunter-kit-cta">
              <div className="hunter-kit-img">
                <img src="/wp-content/uploads/2025/03/job-hunters-kit.png" alt="" />
              </div>
              <div className="hunter-kit-download">
                <div className="text-center hunter-kit-text font-600">
                  Tefl Institute
                  <br />
                  Job Hunter&apos;s Kit
                </div>
                <a href="/free-resources/" className="btn" target="_blank">
                  <span>Learn More</span>
                  <img src={DOWNLOAD_ICON} alt="" />
                </a>
              </div>
            </div>
            {o.price ? <div className="course-price" dangerouslySetInnerHTML={html(o.price)} /> : null}
            {o.resources ? (
              <div className="resources-select-wrapper">
                <div className="resources-select-wrapper__header">
                  <h6 className="text-center font-500">Add Teaching Resources</h6>
                  <i className="fa fa-info" />
                  <div className="resource-info-container">Please Select a resource</div>
                </div>
                <div className="select-menu resources-select">
                  <div className="select-btn">
                    <span className="sBtn-text">Select Option</span>
                    <img className="no-lazy" src={SELECT_ARROW} alt="" />
                  </div>
                  <ul className="options">
                    {o.resources.map((tc, i) => (
                      <li key={i} className="option" data-pid={tc.pid} data-name={tc.name} data-desc={tc.desc} data-pagelink={tc.pagelink}>
                        <span className="option-text">
                          <b dangerouslySetInnerHTML={html(tc.name_html)} />
                          <span className="ajax-loaded-price" />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="ast-col-md-4">
          {o.show_freebies ? (
            <div className="course-offer-freebies">
              <h3 className="course-offer-freebies-title">Free Resources</h3>
              {o.freebies.map((fc, i) => (
                <div key={`f${i}`} className="freebie-course">
                  {fc.icon ? <img className="free-course-icon" src={fc.icon} /> : null}
                  {fc.title ? <p className="free-course-title" dangerouslySetInnerHTML={html(fc.title)} /> : null}
                </div>
              ))}
              {o.others.map((of, i) => (
                <div key={`o${i}`} className="other-freebie">
                  {of.icon ? <img className="other-freebie-icon" src={of.icon} /> : null}
                  {of.title ? <p className="other-freebie-title" dangerouslySetInnerHTML={html(of.title)} /> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="course-offer-section__footer ast-row">
        <div className="ast-col-md-4 ast-col-md-offset-4">
          {o.enrol ? (
            data.is_virtual ? (
              <a className="ti-enroll-btn banner-btn" href="#timetable" dangerouslySetInnerHTML={html(data.btn2)} />
            ) : (
              <a className="ti-enroll-btn enroll-now-btn banner-btn" rel="nofollow" href={o.enrol} dangerouslySetInnerHTML={html(data.btn2)} />
            )
          ) : null}
        </div>
      </div>
    </>
  );
}

function Ielts({ b }: { b: NonNullable<D["ielts"]> }) {
  return (
    <section className="ielts-guide-section section-padding-top">
      <div className="ast-container">
        <div className="ielts-guide-section-row" style={{ ["--bg-color" as string]: b.bg, ["--text-color" as string]: b.color }}>
          <div className="ast-row">
            <div className="ast-col-md-8">
              <h2 className="common-heading ielts-guide-section-heading" dangerouslySetInnerHTML={html(b.title)} />
              <div className="ielts-guide-section-summary" dangerouslySetInnerHTML={html(b.summary)} />
              <a
                href={b.cta_link}
                className="ielts-guide-btn"
                style={{ ["--bg-color" as string]: b.btn_bg, ["--text-color" as string]: b.btn_color }}
                dangerouslySetInnerHTML={html(b.cta_text)}
              />
            </div>
            <div className="ast-col-md-4">
              <img src={b.image} alt="" className="ielts-guide-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Btn({ b }: { b: New2023Button }) {
  return (
    <a
      className={`cta-btn btn-rounded ${b.primary ? "cta-btn-primary" : "cta-btn-secondary"}`}
      href={b.link}
      target="_blank"
      dangerouslySetInnerHTML={html(b.text)}
    />
  );
}

function Certificate({ c }: { c: NonNullable<D["certificate"]> }) {
  return (
    <section className="certificate-preview-section section-padding">
      <div className="ast-container">
        <div className="ast-row">
          <div className="certificate-preview__row">
            <div className=" ast-col-md-6">
              <div className="certificate-preview">
                <h2 className="certificate-preview__heading text-center" dangerouslySetInnerHTML={html(c.title)} />
                <div className="image-container">
                  <div className={`cert-image ${c.transcript !== null ? "ast-col-md-6" : "ast-col-md-12"}`}>
                    <img src={c.image} />
                  </div>
                  {c.transcript !== null ? (
                    <div className="cert-image ast-col-md-6">
                      <img src={c.transcript} />
                    </div>
                  ) : null}
                </div>
                {c.buttons ? (
                  <div className="btn-group certificate-preview__buttons">
                    {c.buttons.map((b, i) => (
                      <Btn key={i} b={b} />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="ast-col-md-6">
              <div className="video-masterclass">
                {c.masterclass ? (
                  <>
                    <h2 className="video-masterclass__heading text-center" dangerouslySetInnerHTML={html(c.masterclass.heading)} />
                    <div className="video-masterclass__image">
                      <img src={c.masterclass.image} alt="" />
                    </div>
                    <div className="video-masterclass__buttons">
                      {c.masterclass.buttons.map((b, i) => (
                        <a
                          key={i}
                          href={b.link}
                          className={`cta-btn btn-rounded ${b.primary ? "cta-btn-primary" : "cta-btn-secondary"}`}
                          dangerouslySetInnerHTML={html(b.text)}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Accreditation({ a }: { a: NonNullable<D["accreditation"]> }) {
  return (
    <section className="accreditation-section section-padding-bottom">
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12">
            <h2 className="accreditation-section__heading text-center common-heading" dangerouslySetInnerHTML={html(a.heading)} />
            <h3 className="accreditation-section__subheading text-center" dangerouslySetInnerHTML={html(a.subheading)} />
            <div className="accreditation-section__body">
              {a.ofqual ? (
                <div className="ofqual-section">
                  {a.ofqual.image ? <img src={a.ofqual.image} /> : null}
                  {a.ofqual.content ? <div dangerouslySetInnerHTML={html(a.ofqual.content)} /> : null}
                </div>
              ) : null}
              <div className="accreditation-section__logos">
                {a.own ? (
                  <div className="item">
                    <div className="image-box">
                      <img src={a.own.image} />
                    </div>
                    <div>
                      <h5 dangerouslySetInnerHTML={html(a.own.title)} />
                      <h6 dangerouslySetInnerHTML={html(a.own.subtitle)} />
                    </div>
                  </div>
                ) : null}
                {a.common.map((c, i) => (
                  <div key={i} className="item">
                    <div className="image-box">
                      <a href={c.link} target="_blank">
                        <img src={c.logo} />
                      </a>
                    </div>
                    <div className="image-text">
                      <h5 dangerouslySetInnerHTML={html(c.title)} />
                      <h6 dangerouslySetInnerHTML={html(c.subtitle)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VirtualFaqs({ faqs }: { faqs: NonNullable<D["virtual_faqs"]> }) {
  return (
    <>
      {faqs.length ? (
        <section className="faq-section section-padding-bottom">
          <div className="ast-container">
            <h2 className="centered section-heading common-heading">FAQS</h2>
            <div className="ast-row faq-row">
              <div className="faq-row">
                {faqs.map((f, i) => (
                  <div key={i} className="ast-col-md-4 faq-col">
                    <div className="faq-col">
                      {f.img ? <img className="faq-img-div" src={f.img} /> : null}
                      {f.title ? <div className="faq-title" dangerouslySetInnerHTML={html(f.title)} /> : null}
                      {f.content ? <div className="faq-content" dangerouslySetInnerHTML={html(f.content)} /> : null}
                      {f.url ? (
                        <div className="faq-link">
                          <a href={f.url}>Learn More</a>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
      <section className="why-teflinstitute-section">
        <div className="ast-container">
          <h2 className="centered section-heading common-heading">WHY TEFL INSTITUTE</h2>
          <div className="ast-row why-teflinstitute-row">
            <div className="ast-col-lg-1 ast-col-sm-12 blank-col" />
            <div className="ast-col-lg-10 ast-col-sm-12 why-teflinstitute-content-col">
              <div className="ast-row">
                <div className="ast-col-lg-4 ast-col-sm-12 why-teflinstitute-col">
                  <div className="why-ti-img-div">
                    <img src="/wp-content/uploads/2021/01/Group-164.svg" alt="quality-service-img" />
                  </div>
                  <h6 className="why-ti-title">QUALITY &amp; SERVICE WE ARE DEDICATED TO GIVING YOU THE BEST EXPERIENCE</h6>
                  <div className="why-ti-content">
                    Our experience in the TEFL industry is second to none and we’re pretty passionate about what we do. (That’s why 92% of
                    customers recommend us)
                  </div>
                </div>
                <div className="ast-col-lg-4 ast-col-sm-12 why-teflinstitute-col">
                  <div className="why-ti-img-div">
                    <img src="/wp-content/uploads/2021/01/Group-168.svg" alt="tefl-specialist-img" />
                  </div>
                  <h6 className="why-ti-title">TEFL SPECIALISTS OVER 20 YEARS IN THE TEFL INDUSTRY</h6>
                  <div className="why-ti-content">
                    Sharing our English teaching knowledge gives you the superior training experience you deserve. We’ll prepare you for all
                    teaching scenarios.
                  </div>
                </div>
                <div className="ast-col-lg-4 ast-col-sm-12 why-teflinstitute-col">
                  <div className="why-ti-img-div">
                    <img src="/wp-content/uploads/2021/01/Group-166.svg" alt="support-abroad-img" />
                  </div>
                  <h6 className="why-ti-title">SUPPORT ABROAD WELL HELP GET YOU THERE</h6>
                  <div className="why-ti-content">
                    As a newly qualified English teacher, join an all-inclusive, fully-supported teaching internship. Gain all the
                    confidence you need to TEFL like a boss!
                  </div>
                </div>
              </div>
            </div>
            <div className="ast-col-lg-1 ast-col-sm-12 blank-col" />
          </div>
        </div>
      </section>
    </>
  );
}

/** The ten country-guide covers of the learn-more section (static in the template). */
const GUIDES: { code: string; country: string; sub: string; slug: string; featured?: boolean }[] = [
  { code: "ES", country: "Spain", sub: "Jobs, pay and visa routes", slug: "teach-english-in-spain" },
  { code: "KR", country: "South Korea", sub: "EPIK, hagwons and pay", slug: "south-korea", featured: true },
  { code: "JP", country: "Japan", sub: "JET, ALT and eikaiwa pay", slug: "japan" },
  { code: "VN", country: "Vietnam", sub: "Work permits and requirements", slug: "vietnam" },
  { code: "TH", country: "Thailand", sub: "Visas and teaching licences", slug: "thailand" },
  { code: "IT", country: "Italy", sub: "Jobs, pay and visa routes", slug: "italy" },
  { code: "AE", country: "Dubai", sub: "Pay, requirements and visas", slug: "dubai" },
  { code: "CZ", country: "Czech Republic", sub: "Pay, visas and cities", slug: "czech-republic" },
  { code: "KH", country: "Cambodia", sub: "Pay, requirements and visas", slug: "cambodia" },
  { code: "EE", country: "Estonia", sub: "Jobs, pay and work routes", slug: "estonia" },
];

function LearnMore({ link }: { link: string }) {
  return (
    <section className="learn-more-section">
      <div className="ast-container">
        <div className="ast-row ">
          <div className="ast-col-md-7">
            <span>We love taking your call.</span>
            <div className="heading-cta-container">
              <h2 className="large-heading">
                TEFL Institute
                <span className="font-300">guides</span>
              </h2>
              <a href={link} className="">
                <img src="/wp-content/uploads/2023/05/care-arrow.svg" />
              </a>
            </div>
          </div>
        </div>
        <div className="ast-row">
          <div className="ast-col-md-12">
            <div className="tg-guides">
              {GUIDES.map((g) => (
                <a key={g.code} className={`tg-cover${g.featured ? " is-featured" : ""}`} href={`/teach-english-abroad/${g.slug}/`}>
                  <span className="tg-code" aria-hidden="true">
                    {g.code}
                  </span>
                  <div className="tg-top">
                    <div className="tg-label">Plan for 2027</div>
                    <div className="tg-rule" />
                    <h3 className="tg-country">{g.country}</h3>
                    <p className="tg-sub">{g.sub}</p>
                  </div>
                  <div className="tg-foot">
                    <span>Read the guide</span>
                    <span className="tg-arrow" aria-hidden="true">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
