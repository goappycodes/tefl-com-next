/**
 * Legacy course design — native port of the theme's single-course-template.php
 * (included by single-course.php when neither is_new_design nor is_2024_design
 * is set). Data from course-legacy.php via `tefl/v1/native/course`.
 *
 * Same markup as the PHP template so the theme CSS/JS (tabs, view more,
 * sliders, lity videos, countdowns, WCPBC prices, the guide pop-up form) keep
 * working. Parents whose content mixes raw ACF HTML with template markup — or
 * where the template's own markup is invalid (`<p>` around block content, an
 * `<a>` nested in an `<a>`, an unclosed `<h6 class=>`) — get their innerHTML
 * as one string, so the browser builds exactly the DOM it builds on live.
 */
import type { CourseLegacyData } from "./types";

import { APPLE_STORE_SVG, GOOGLE_PLAY_SVG } from "./svgs";

/** Escape text for an attribute inside an HTML string. */
const a = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ANGLE = '<i class="fa fa-angle-right"></i>';
const ANGLE_HIDDEN = '<i class="fa fa-angle-right" aria-hidden="true"></i>';
const ACCORDION_NUM_STYLE =
  "background: white;margin: -15px 25px -22px -35px;height: 50px;display: inline-block;position: relative;text-align: center;border: 1px solid #000 !important;color: #000;overflow: auto;padding: 0 20px;width: 110px;line-height: 48px;";

function Raw({ as: Tag = "div", html, ...rest }: { as?: "div" | "span" | "p" | "h6" | "h4" | "h2" | "li" | "article" | "a" | "section"; html: string } & Record<string, unknown>) {
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function CourseLegacy({ data: d }: { data: CourseLegacyData }) {
  return (
    <div id="primary" className={d.primary_class}>
      {d.product_ld !== null ? (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: d.product_ld }} />
          <div className="product-schema-output-custom" style={{ display: "none" }} />
        </>
      ) : null}

      <Banner d={d} />

      {d.black_bar !== null ? (
        <div className="divider-black-bar">
          {d.black_bar.map((b, i) => (
            <Raw key={i} className="bar" html={`<div class="left-icon-img"><img src="${a(b.icon)}"></div>\n${b.text}`} />
          ))}
        </div>
      ) : null}

      {d.below_bar !== null ? (
        <div className="divider-bar" style={{ display: "none" }}>
          {d.below_bar.map((b, i) => (
            <div key={i} className="bar">
              <div className="icon-img">
                <img src={b.icon} />
              </div>
              <Raw className="text" html={b.text} />
            </div>
          ))}
        </div>
      ) : null}

      {d.guarantee !== null ? (
        <div className="below-black-bar-guarantee d-none">
          <div className="img-container">
            <img src="/wp-content/uploads/2022/03/our-pledge.png" />
          </div>
          <div className="content-container">
            <h6 className="centered syllabus section-heading">
              OUR PLEDGE
              <br />
              Risk Free Guarantee
            </h6>
            <Raw className="content" html={d.guarantee} />
          </div>
        </div>
      ) : null}

      <Tabs d={d} />

      {d.level5 !== null ? (
        <section className="level5-video-section">
          <div className="ast-container level5-video-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <Raw as="h6" className="section-heading" html={d.level5.heading} />
              </div>
            </div>
            <div className="ast-row level5-video-row">
              {d.level5.videos.map((v, i) => (
                <div key={i} className="ast-col-md-6 level5-video-col">
                  <div className="video-container">
                    <a href={v.href} data-lity="">
                      <div className="video-img">
                        <img src={v.thumb} />
                      </div>
                      <div className="video-play-btn">
                        <img className="video__play" src="/wp-content/uploads/2020/11/play-btn.svg" alt="" />
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {d.eligibility !== null ? (
        <section className="course-eligibility-details">
          <div className="ast-container">
            <div className="ast-row" style={{ background: "#F2F2F2" }}>
              <div className="ast-col-md-12">
                <div className="course-eligibility-details-block ast-col-md-12">
                  <h6 className="section-heading">who can take the course</h6>
                  <div className="eligibility-detail-content">
                    {d.eligibility.map((c, i) => (
                      <div key={i} className="ast-col-md-3 ast-col-sm-6 ast-col-xsm-12 eligibility-detail">
                        <div>
                          <img src="/wp-content/uploads/2020/11/tick.svg" />
                        </div>
                        <Raw as="p" html={c} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="divider">
              <div>Online TEFL Courses</div>
              <div className="center">100% online and available 24/7</div>
              <div>97% pass rate</div>
            </div>
          </div>
        </section>
      ) : null}

      {d.funding !== null ? (
        <div className="funding" style={{ display: "none" }}>
          <div className="ast-container">
            <h6 className="section-heading">Student or Unemployed Funding:</h6>
            <div className="ast-row">
              <Raw className="ast-col-md-12" html={d.funding} />
            </div>
          </div>
        </div>
      ) : null}

      <Raw as="section" className="students-review ast-container" style={{ padding: 0 }} html={reviewsHtml(d.reviews)} />

      {d.salary !== null ? (
        <div className="salary-black-bar">
          {d.salary.content !== undefined ? (
            <>
              <div className="bar-icon">
                <img src="/wp-content/uploads/2022/12/black-laptop.svg" />
              </div>
              <Raw className="bar-content" html={d.salary.content} />
              <div className="bar-button">
                <Raw
                  as="a"
                  href={d.salary.url}
                  html={`${d.salary.button} <img src="https://teflinstitute.com/wp-content/uploads/2022/02/enter.png"><i class="fa fa-sign-in" style="display:none;"></i>`}
                />
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {d.sale_courses.map((sc, i) => (
        <SaleCourse key={i} sc={sc} courseId={d.course_id} />
      ))}

      {d.certificate !== null ? (
        <section className="certificate-review">
          {d.certificate.body !== null ? (
            <div className="certificate-review__body ast-container">
              <div className="ast-row">
                <div className="ast-col-md-12" style={{ padding: 0 }}>
                  <div className="certificate-review-block">
                    <div className="ast-col-md-6 ast-col-sm-12 ast-col-xsm-12">
                      <Raw className="certificate-review-block-content" html={certificateHtml(d.certificate.body)} />
                    </div>
                    <div
                      className="ast-col-md-6 ast-col-sm-12 ast-col-xsm-12 certificate_review-video-col"
                      style={{
                        background: "url('https://teflinstitute.com/wp-content/uploads/2021/12/Demo-video-1-1.jpeg')",
                        height: "480px",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    >
                      <a href="/video-masterclass" className="video-caption-link lity-video">
                        <div className="vide-caption-box">
                          <span className="video-caption-text">Diana | Video Masterclass</span>
                          <span className="video-icon">
                            <img src="/wp-content/uploads/2021/10/Play-button.svg" />
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="accreditation">
        <h6 className="section-heading">TEFL Accreditation with The TEFL Institute</h6>
        <h6 className="section-heading" style={{ fontSize: "1rem", marginTop: "-1rem" }}>
          Ranked Number #1 TEFL Trainer by Schools and Employers Worldwide
        </h6>
        <div className="ast-container">
          <div className="ast-row ast-flex">
            <div className="ast-col-md-12">
              {d.ofqual !== null ? (
                <div className="ofqual">
                  {d.ofqual.img !== null ? <img src={d.ofqual.img} /> : null}
                  {d.ofqual.content !== null ? <Raw html={d.ofqual.content} /> : null}
                </div>
              ) : null}
              <div className="bottom-grid">
                {d.accred !== null ? (
                  <div className="item">
                    <div className="image-box">
                      <img src={d.accred.img} />
                    </div>
                    <Raw html={`<div>${d.accred.title}</div>\n${d.accred.subtitle}`} />
                  </div>
                ) : null}
                {d.highfield ? (
                  <div className="item">
                    <div className="image-box">
                      <img src="/wp-content/uploads/2021/11/Highfield-Qualifications-approved-centre-1024x374-1.jpeg" />
                    </div>
                    <div>
                      <div>Highfield</div>
                      Approved center number: 21335
                    </div>
                  </div>
                ) : null}
                <div className="item">
                  <div className="image-box">
                    <img src="/wp-content/uploads/2020/12/ACDL-Logo.png" />
                  </div>
                  <div>
                    <div>ACDL</div>
                    Accreditation number: 2854-2540
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {d.benefits !== null ? (
        <section className="course-benefits">
          <div className="logo-container">
            <img src="/wp-content/uploads/2021/01/Group-369.svg" height="100%" width="100%" />
          </div>
          <div className="side-logos">
            <img src="/wp-content/uploads/2022/01/14-days-guarantee.png" height="100%" width="100%" />
            <img src="/wp-content/uploads/2022/01/6-months-study-time.png" height="100%" width="100%" />
          </div>
          <div className="ast-row benefits-row">
            <h6 className="section-heading">course benefits</h6>
            <div className="ast-col-md-12 ast-col-sm-12 benefits-list" style={{ padding: 0 }}>
              <ul className="benefit-list">
                {d.benefits.map((b, i) => (
                  <Raw key={i} as="li" className="benefit" html={b} />
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {d.slides !== null ? (
        <section className="graduate-review-slider">
          <h6 className="section-heading">What our graduates say</h6>
          <img src="/wp-content/uploads/2020/11/prev.svg" className="review-slider-prev" />
          <img src="/wp-content/uploads/2020/11/next.svg" className="review-slider-next" />
          <div className="slider-track">
            {/* The template nests the caption <a> inside the slide <a>; the browser splits them. */}
            <Raw
              className="review-slider"
              html={d.slides
                .map(
                  (s) =>
                    `<div class="review bg-image" style="background-image:url('${a(s.image)}')">\n` +
                    `<a href="${a(s.url)}" data-lity class="slide-clickbox lity-video">\n` +
                    `<div class="review__footer">\n` +
                    `<a href="${a(s.url)}" data-lity class="video-caption-link lity-video">\n` +
                    `<div class="play-btn">\n<img src="/wp-content/uploads/2020/11/play-btn.svg">\n</div>\n` +
                    `<span>${s.title}</span>\n</a>\n</div>\n</div>\n`,
                )
                .join("")}
            />
          </div>
        </section>
      ) : null}

      {d.timer_script !== null ? <script type="text/tefl-deferred" dangerouslySetInnerHTML={{ __html: d.timer_script }} /> : null}

      <section className="course-brochure-details" style={{ display: "block" }}>
        <div className="ast-container">
          <div className="ast-row" style={{ background: "#F2F2F2" }}>
            <div className="ast-col-md-12">
              <div className="course-brochure-details-block ast-col-md-12">
                <h6 className="section-heading">
                  {"The TEFL Institute Explained: "}
                  <span className="">TEFL Courses Breakdown</span>
                </h6>
                <div className="section-paragraph">
                  Your first steps to becoming a fully accredited, internationally recognised EFL/ESL teacher within 4 weeks!
                </div>
                <img
                  src="https://teflinstitute.com/wp-content/uploads/2021/04/TEFL-Institute-Brochure-Download-Image-1_No-Shadow-1-min.png"
                  className="section-image"
                />
                <div className="brochure-detail">
                  <a className="btn" href="/tefl-brochure" target="_blank">
                    {"Download Now "}
                    <i className="fa fa-angle-right" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="job-hunter-guide">
        <div className="ast-row">
          <div className="ast-col-md-6 ast-col-sm-12">
            {d.hunter.guide ? (
              <div className="guide-left-outer" style={{ backgroundImage: `url('${d.hunter.bg}')` }}>
                <div className="guide-left">
                  <Raw as="h6" className="section-heading" html={d.hunter.title} />
                  <Raw as="p" className="" html={d.hunter.subtitle} />
                  <img className="hunter-guide-image" src={d.hunter.img} />
                  <a className="hunter-button">
                    <span>Download Now</span>
                    <i className="fa fa-angle-right" />
                  </a>
                </div>
              </div>
            ) : null}
          </div>
          <div className="ast-col-md-6 ast-col-sm-12">
            <div className="guide-right">
              <Raw as="h6" className="section-heading" html={d.app.title} />
              <Raw as="p" className="" html={d.app.subtitle} />
              <img src={d.app.preview} />
              <div className="stores">
                {d.app.google !== null ? <Raw as="a" href={d.app.google} html={GOOGLE_PLAY_SVG} /> : null}
                {d.app.apple !== null ? <Raw as="a" href={d.app.apple} html={APPLE_STORE_SVG} /> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hunter_brochure">
        <div className="hunter_brochure_container">
          <span className="cross">{"✖"}</span>
          <div className="ast-row ast-flex hunter_brochure_row">
            <div className="ast-col-md-6 ast-col-sm-12 brochure-image">
              <img src={d.hunter.img} />
            </div>
            <div className="ast-col-md-6 ast-col-sm-12 brochure_content_col">
              <div className="brochure_content">
                <Raw className="brochure-title" html={d.hunter.title} />
                <Raw className="brochure-content" html={d.hunter.subtitle} />
              </div>
              <div className="brochure_form">
                <Raw className="brochure_form_inner" html={d.cf7} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {d.recommended !== null ? (
        <section className="recommended-courses">
          <div className="ast-container-nopadding">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h6 className="centered section-heading">VIEW RECOMMENDED TEFL COURSES</h6>
                <div className="ast-row ast-flex courses-row">
                  {d.recommended.map((r, i) => (
                    <div key={i} className="ast-col-lg-3 ast-col-md-3 course-col">
                      <div className="course course1">
                        <a href={r.link} className="course-clickbox" />
                        {/* The template leaves the <h6 class=> open; the </div> closes it. */}
                        <Raw className="course__body" html={`<img src="${a(r.icon)}">\n<h6 class=>${r.title}`} />
                        <div className="course__cta">
                          <Raw as="a" className={`btn ${i + 1 <= 2 ? "btn-white" : "btn-black"}`} href={r.link} html={r.text} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="webinar-section">
        <div className="ast-container">
          <div className="ast-row webinar-row">
            <div className="ast-col-lg-12 ast-col-md-12 ast-col-sm-12 ast-col-xs-12 webinar-col">
              <Raw as="h2" className="section-heading" html={d.webinar.title} />
            </div>
          </div>
          {d.webinar.list !== null ? (
            <>
              <div className="ast-row webinar-row">
                {d.webinar.list.upcoming !== null ? <Webinar w={d.webinar.list.upcoming} /> : null}
              </div>
              <div className="ast-row webinar-btn-row">
                <a href={d.webinar.list.register} className="btn-block-black">
                  Register Now
                </a>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Banner({ d }: { d: CourseLegacyData }) {
  const b = d.banner;
  let block =
    `<h1>\n${b.cta_title}\n<div class="tution-fee">\n` +
    `<p id="priceWrapper" class="tution-fee-txt">Tuition Fee: <span data-isfixed99="${a(b.fixed99)}" data-depositpercent="${a(b.deposit_percent)}" class="full-price ${a(b.deposit_class)}">${b.price}</span>\n</p>\n` +
    (b.free_offer !== null ? `<div class="free-offer-text">\n${b.free_offer}\n</div>\n` : "") +
    `<div class="deposit-breakdown">\n` +
    (b.installments !== null
      ? `<div class="installments-breakdown">\n<div class="ajax-snippet" data-snippet="installment_breakdown" data-objectid="${a(b.installments)}">\n</div>\n` +
        `<div id="loader" class="loader">\nFetching installment breakdown details <img src="/wp-content/uploads/2022/11/loading-yellow.gif" alt="fetching deposit details">\n</div>\n</div>\n`
      : "") +
    `</div>\n</div>\n</h1>\n`;
  if (b.sale !== null) {
    block +=
      `<div class="offer-sale-information-outer">\n<div class="text-center offer-sale-information">\n` +
      `<div class="offer-sale-counter ${a(b.sale.sold)} ">\n<span>${b.sale.remaining}</span>\n<span>courses left</span>\n</div>\n` +
      `<div class="offer-sale-information__details">\n<span class="font-800">Looking for extra income?</span>\n<span class="font-600">Start teaching English online</span>\n` +
      `<span class="font-400">Applies to first 100 courses - <b>Act fast!</b></span>\n</div>\n</div>\n</div>\n`;
  }
  block += `${b.cta_text}\n`;
  block += b.highfield
    ? `<img class="floating-logo" src="/wp-content/uploads/2021/10/Highfield-badge-TII-2.png">\n`
    : `<img class="floating-logo" src="/wp-content/uploads/2020/11/Group-57.svg">\n`;
  if (b.yoga !== null) {
    block +=
      `<div class="yoga-course-section">\n<span class="bonus-course">Bonus Course!</span>\n<div class="yoga-course-text">\n` +
      `<img src="/wp-content/uploads/2025/04/yoga-course.png">\n${b.yoga}\n</div>\n</div>\n`;
  }

  return (
    <section className="banner-section" style={{ backgroundImage: `url('${b.image}')` }}>
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-lg-6 ast-col-md-8 formobile">
            <div className="banner-content-block">
              <Raw className="content-block" html={block} />
              <div className="banner-buttons">
                <Raw as="a" className="callback-btn" href="/callback" html={`${b.btn1} ${ANGLE}`} />
                <Raw as="a" className="ti-enroll-btn enroll-now-btn" rel="nofollow" href={b.enrol} html={`${b.btn2}\n${ANGLE}`} />
              </div>
            </div>
            {b.freebies !== null ? (
              <div className="freebies">
                <div className="freebies-container">
                  {b.freebies.map((f, i) => (
                    <div key={i} className="freebie">
                      <div className="price">
                        {"Worth "}
                        <Raw as="span" html={f.price} />
                      </div>
                      <img src={f.img} />
                      <Raw className="content" html={f.content} />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function modulesHtml(mods: CourseLegacyData["tabs"]["tab2_content"], start: number) {
  return (mods ?? [])
    .map(
      (m, j) =>
        `<section class="accordion-container">\n` +
        `<input id="accordion-${start + j}" name="accordion-1" type="checkbox" ${start + j === 0 ? "checked" : ""}>\n` +
        `<label for="accordion-${start + j}">\n<div style="${ACCORDION_NUM_STYLE}">\n${m.numbers}</div>${m.title}\n</label>\n` +
        `<article>\n${m.content}\n</article>\n</section>\n`,
    )
    .join("");
}

function Tabs({ d }: { d: CourseLegacyData }) {
  const t = d.tabs;
  const h6 = (title: string, cls = "section-heading") => (title ? `<h6 class="${cls}">${title}</h6>\n` : "");

  let courseContent = h6(t.tab2_title);
  let n = 0;
  if (t.tab2_content !== null) {
    courseContent += modulesHtml(t.tab2_content, n);
    n += t.tab2_content.length;
  }
  if (t.tab2_second !== null) {
    courseContent += `<h6 class="section-heading second-section-heading">${t.tab2_second.title}</h6>\n`;
    courseContent += modulesHtml(t.tab2_second.modules, n);
  }

  let faqs = h6(t.tab5_title);
  if (t.faqs !== null) {
    faqs += `<script type="application/ld+json">${t.faq_ld ?? ""}</script>\n<ul class="course-faq">\n`;
    faqs += t.faqs.map((f) => `<li class="course-faq-single">\n<h6>${f.q}</h6>\n<span>${f.a}</span>\n</li>\n`).join("");
    faqs += `</ul>\n`;
  }
  faqs += `<p>\n${t.tab5_details}\n</p>\n`;

  const tabButton = (show: boolean, id: string, target: string, labelId: string, img: string, text: string, checked = false) =>
    show ? (
      <>
        <input id={id} name="tabs" data-tab-target={target} type="radio" defaultChecked={checked} />
        <label className="tab-button" id={labelId} htmlFor={id}>
          <img src={img} />
          {text}
        </label>
      </>
    ) : null;

  return (
    <section className="premier-course-details">
      <div className="ast-container tab-head-container">
        <div className="ast-row">
          <div className="ast-col-lg-12" style={{ padding: 0 }}>
            <h6 className="centered syllabus section-heading">COURSE SYLLABUS</h6>
            <div className="tab-buttons">
              {tabButton(t.has1, "summ", "#summary", "summid", "/wp-content/uploads/2020/11/summary.svg", "what will i learn", true)}
              {tabButton(t.has2, "course", "#course-content", "courseid", "/wp-content/uploads/2020/11/course-content.svg", "course content")}
              {tabButton(t.has3, "accred", "#accreditation", "accredid", "/wp-content/uploads/2020/11/accred.svg", "accreditation")}
              {tabButton(t.has4, "why", "#whyus", "whyusid", "/wp-content/uploads/2020/11/whyus.svg", "why us")}
              {tabButton(t.has5, "faq", "#faqs", "faqsid", "/wp-content/uploads/2020/11/faqs.svg", "faqs")}
              {tabButton(t.bonus !== null, "bonusguide", "#bonus_guide", "bonusguideid", "/wp-content/uploads/2020/11/course-content.svg", "bonus guides")}
              {tabButton(t.promise !== null, "ourpromises", "#our_promises", "ourpromisesid", "/wp-content/uploads/2020/11/accred.svg", "our promise")}
            </div>
          </div>
        </div>
      </div>
      <div className="tab-contents ast-container" style={{ paddingLeft: 0 }}>
        <div id="summary" data-tab-content="" className="tab-content ast-row active">
          <div className="tab-content__card ast-col-md-4 ast-col-sm-12 ast-col-xsm-12">
            <div className="card-container bg-image" style={{ backgroundImage: `url('${t.card.image}')` }}>
              <div className="card-body">
                <img className="card-icon" src="https://teflinstitute.com/wp-content/uploads/2022/01/test-icon.png" />
                <div className="card-body-content">
                  <Raw as="h6" className="section-heading" html={t.card.title} />
                  <Raw as="p" html={`\n${t.card.stitle}\n`} />
                </div>
                <Raw
                  as="a"
                  className="btn"
                  href={t.card.link}
                  style={{ backgroundColor: t.card.color }}
                  html={`${t.card.btn}\n<i class="fa fa-angle-right" aria-hidden="true">\n</i>\n`}
                />
              </div>
            </div>
          </div>
          <div className="tab-content__body ast-col-md-8 ast-col-sm-12 ast-col-xsm-12">
            <Raw className="tab1-details" html={h6(t.tab1_title) + t.tab1_details} />
            <div className="view-more">
              <span>
                {"View More "}
                <i className="fa fa-angle-down" />
              </span>
            </div>
            <div className="view-less">
              <span>
                {"View Less "}
                <i className="fa fa-angle-up" />
              </span>
            </div>
          </div>
        </div>
        <div id="course-content" data-tab-content="" className="tab-content ast-row">
          <Raw className="tab-content__body ast-col-md-12" html={courseContent} />
        </div>
        <div id="accreditation" data-tab-content="" className="tab-content ast-row">
          <div className="tab-content__body ast-col-md-12">
            {t.tab3_title ? <Raw as="h6" className="section-heading" html={t.tab3_title} /> : null}
            <div className="accreditation-tab-content">
              <div className="section-logos">
                {t.tab3_logos.map((l, i) => (
                  <img key={i} src={l} />
                ))}
              </div>
              <div className="section-content">
                <Raw className="tab3-details" html={t.tab3_details} />
                <div className="view-more">
                  <span>
                    {"View More "}
                    <i className="fa fa-angle-down" />
                  </span>
                </div>
                <div className="view-less">
                  <span>
                    {"View Less "}
                    <i className="fa fa-angle-up" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {t.has4 ? (
          <div id="whyus" data-tab-content="" className="tab-content ast-row">
            <Raw className="tab-content__body ast-col-md-12" html={h6(t.tab4_title) + `<p>\n${t.tab4_details}\n</p>\n`} />
          </div>
        ) : null}
        {t.has5 ? (
          <div id="faqs" data-tab-content="" className="tab-content ast-row">
            <Raw className="tab-content__body ast-col-md-12" html={faqs} />
          </div>
        ) : null}
        {t.bonus !== null ? (
          <div id="bonus_guide" data-tab-content="" className="tab-content ast-row">
            <Raw className="tab-content__body ast-col-md-12" html={`<p>\n${t.bonus}\n</p>\n`} />
          </div>
        ) : null}
        {t.promise !== null ? (
          <div id="our_promises" data-tab-content="" className="tab-content ast-row">
            <Raw className="tab-content__body ast-col-md-12" html={`<p>\n${t.promise}\n</p>\n`} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function reviewsHtml(r: CourseLegacyData["reviews"]) {
  return (
    `<h6 class="section-heading">verified student reviews</h6>\n` +
    `<div class="review-widget-views">\n<h6 class="section-heading">CUSTOMER REVIEWS</h6>\n` +
    `<div class="star-div"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-empty"></i><span class="course-review-count">(${r.average})</span></div>\n` +
    `<div class="total-count-text">Out of ${r.total} global reviews</div>\n<div class="review-statuses">\n` +
    r.statuses
      .map(
        (p, i) =>
          `<div class="review-status">\n<div class="progress-text">${5 - i} Star</div>\n<div class="progress">\n<div class="progress-bar" percent="${a(p)}">\n</div>\n</div>\n<div class="progress-value">${p}%</div>\n</div>\n`,
      )
      .join("") +
    `<div class="read-all-reviews-btn"><a href="https://search.google.com/local/reviews?placeid=ChIJR8_41hsMZ0gR2i2CJcrWIf8">\n<span>Read all reviews</span> <i class="fa fa-angle-right"></i>\n</a></div>\n</div>\n</div>\n` +
    (r.banner !== null ? `<div class="review-banner" style="background-image:url('${a(r.banner)}')"></div>\n` : "") +
    r.brb
  );
}

function certificateHtml(c: NonNullable<NonNullable<CourseLegacyData["certificate"]>["body"]>) {
  return (
    (c.title ? `<h6 class="section-heading">${c.title}</h6>\n` : "") +
    `<div class="image-container ast-row">\n<div class="cert-image ${c.transcript !== null ? "ast-col-md-6" : "ast-col-md-12"}">\n<img src="${a(c.img)}">\n</div>\n` +
    (c.transcript !== null ? `<div class="cert-image ast-col-md-6">\n<img src="${a(c.transcript)}">\n</div>\n` : "") +
    `</div>\n` +
    (c.details !== null ? `<p>${c.details}</p>\n` : "") +
    `<div class="btn-group">\n` +
    c.buttons.map((b) => `<a class="btn" href="${a(b.link)}" target="_blank">${b.text}\n${ANGLE_HIDDEN}\n</a>\n`).join("") +
    `</div>\n`
  );
}

function SaleCourse({ sc, courseId }: { sc: CourseLegacyData["sale_courses"][number]; courseId: string }) {
  return (
    <div className={`${courseId} section tefl-section sale-courses-section`}>
      <div className="ast-row sale-courses-header-row">
        <div className="ast-col ast-col-md-12 section-header-col">
          <div className="section-header">TEFL Offers</div>
        </div>
      </div>
      <div className="ast-row sale-courses-content-row">
        <div className="ast-col ast-col-md-4 course-detail-col">
          <div className="course-detail-col-inner">
            {sc.image !== null ? (
              <div className="course-img">
                <img src={sc.image} />
              </div>
            ) : null}
            {sc.logo !== null ? (
              <div className="course-logo">
                <img src={sc.logo} />
              </div>
            ) : null}
            {sc.title !== null ? <Raw as="h4" className="course-title" html={sc.title} /> : null}
            {sc.price !== null ? <Raw className="course-price" html={sc.price} /> : null}
            {sc.enrol !== null ? (
              <div className="enroll-now-btn">
                <a className="btn btn-primary dark-btn" rel="nofollow" href={sc.enrol}>
                  Enrol Now
                </a>
              </div>
            ) : sc.countdown !== null ? (
              <div className="countdown-timer" data-expiry={sc.countdown}>
                <ul className="timer">
                  {(["day", "hour", "minute", "second"] as const).map((u) => (
                    <li key={u}>
                      <span id={`${u}Count`} />
                      <span id={`${u}-text`}>{`${u}s`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <div className="ast-col ast-col-md-4 course-inc-exc-col">
          {sc.incexc !== null ? (
            <div className="inc-exc-inner">
              <p className="inc-exc-title">What’s Included</p>
              <div className="inc-exc-div">
                {sc.incexc.inc.map((x, i) => (
                  <div key={`i${i}`} className="item inc-item">
                    <img src="/wp-content/uploads/2021/11/Group-22.svg" />
                    <Raw html={x} />
                  </div>
                ))}
                {sc.incexc.exc.map((x, i) => (
                  <div key={`e${i}`} className="item exc-item">
                    <img src="/wp-content/uploads/2021/11/Group-21-1.png" />
                    <Raw html={x} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className="ast-col ast-col-md-4 freebie-col">
          {sc.freebie !== null ? (
            <div className="freebie-col-inner">
              <p className="freebie-title">Free Resources</p>
              {(sc.freebie.courses ?? []).map((fc, i) => (
                <div key={i} className="freebie-course">
                  {fc.icon !== null ? (
                    <div className="free-course-icon">
                      <img src={fc.icon} />
                    </div>
                  ) : null}
                  {fc.title !== null ? <Raw as="p" className="free-course-title" html={fc.title} /> : null}
                  {fc.price !== null ? <Raw className="free-course-price" html={fc.price} /> : null}
                </div>
              ))}
              {sc.freebie.other !== null ? (
                <div className="other-freebie-div">
                  {sc.freebie.other.map((of, i) => (
                    <div key={i} className="other-freebie-div-inner">
                      {of.icon !== null ? (
                        <div className="other-freebie-icon">
                          <img src={of.icon} />
                        </div>
                      ) : null}
                      {of.title !== null ? <Raw as="p" className="other-freebie-title" html={of.title} /> : null}
                    </div>
                  ))}
                </div>
              ) : null}
              {sc.freebie.cart !== null ? (
                <div className="learn-more-btn">
                  <a className="btn btn-primary dark-btn" rel="nofollow" href={sc.freebie.cart}>
                    Enrol Now
                  </a>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Webinar({ w }: { w: NonNullable<NonNullable<CourseLegacyData["webinar"]["list"]>["upcoming"]> }) {
  return (
    <div
      className="ast-col-md-12 webinar-col"
      style={{ background: `linear-gradient(90deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75)), url('${w.image}')` }}
    >
      <div className="webinar-div">
        <a href={w.link} className="webinar-clickbox" />
        <div className="webinar-div__content">
          <Raw as="h4" className="webinar-title" html={w.title} />
          <Raw as="p" className="webinar-location" html={`LOCATION : ${w.location}`} />
          <Raw as="p" className="webinar-date" html={`DATE : ${w.date}`} />
          <Raw as="p" className="webinar-time" html={`TIME : ${w.time} (UK TIME)`} />
        </div>
        <a href={w.link} className="btn-signup">
          <div className="btn-signup__inner">Sign Up</div>
        </a>
      </div>
    </div>
  );
}
