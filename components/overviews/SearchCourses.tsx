/**
 * Course recommender — native port of the theme's search-courses-template.php
 * (/search-courses/?usertype=…&userpreference=…&userlevel=…&userqual=…).
 *
 * Same markup as the PHP template. Its inline jQuery script (FAQ checkboxes,
 * "Show More Faqs") is kept and runs after the theme's scripts, like every
 * page script on the Next front; the CF7 forms and the timer are the
 * shortcodes' own output. Data: wordpress/headless/native/search-courses-template.php.
 */
import { DeferredScript, esc, FaqAccordionItems, H, type Faq, type OverviewsBase } from "./shared";

export interface SearchCoursesData extends OverviewsBase {
  about: string;
  title: string;
  text: string;
  clock_text: string;
  timer: string;
  courses:
    | {
        has_image: boolean;
        bg: string;
        title: string;
        link: string;
        price: string;
        includes: string[] | null;
        guide: { value: string; image: string; link: string } | null;
        buy: string;
      }[]
    | null;
  form_advice: string;
  form_newsletter: string;
  video: { youtube: string; thumbnail: string };
  faqs: Faq[];
  brochure: { heading: string; sub_heading: string; content: string; image: string; link: string } | null;
  call_text: string;
  form_image: string;
  form_learn: string;
}

const FAQ_SCRIPT = `
jQuery('document').ready(function ($) {

	$('.show-more-faqs').on('click', function() {
      let expandable = $(this).prev();
      expandable.toggleClass('expanded');
      isExpanded = expandable.hasClass('expanded');
      $(this).find('span').text(isExpanded ? 'Show Less Faqs' : 'Show More Faqs');
    });

 	 $('.faqs-accordion__item input[type="checkbox"]').change(function() {
      if ($(this).is(':checked')) {
        $(this).parent('.faqs-accordion__item').addClass('active');
        $(this).parent('.faqs-accordion__item').find('.faqs-accordion__content ').addClass('active');
      } else {
        $(this).parent('.faqs-accordion__item').removeClass('active');
        $(this).parent('.faqs-accordion__item').find('.faqs-accordion__content ').removeClass('active');
      }
    });

});
`;

const CHECK =
  '<polyline points="20 6 9 17 4 12"/>';

export default function SearchCourses({ data }: { data: SearchCoursesData }) {
  const o = data.origin;
  const b = data.brochure;

  return (
    <div id="primary" className="content-area primary">
      {data.about ? (
        <section className="about-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <H className="about-text" html={data.about} />
              </div>
            </div>
          </div>
        </section>
      ) : null}
      <div className="section course-result-section" id="course_result_section">
        <div className="ast-container course-result-container">
          <div className="ast-row ast-flex course-result-row">
            <div className="ast-col ast-col-md-12 course-result-col">
              {data.text ? (
                <>
                  {data.title ? <H as="h1" className="section-heading common-heading large-heading" html={data.title} /> : null}
                  <H className="course-search-text" html={data.text} />
                </>
              ) : null}
              <H
                className="timer-container"
                style={{ display: "none" }}
                html={`<div class="tefl-timer-text">${data.clock_text}</div>
${data.timer}`}
              />
              {data.courses ? (
                <div className="ast-row course-row">
                  {data.courses.map((c, i) => {
                    const count = i + 1;
                    return (
                      <div key={i} className="ast-col-md-4 course-col">
                        <div className="course-col-inner">
                          <div className="course-top">
                            {count === 2 ? (
                              <div className="recommended-banner-div btn btn-primary">
                                <span className="recommended-banner">
                                  <i className="fa fa-star-o" /> Most Recommended
                                </span>
                              </div>
                            ) : null}

                            {c.has_image ? (
                              <div className="course-img-div">
                                <a href={c.link}>
                                  <img src={c.bg} />
                                </a>
                              </div>
                            ) : null}
                            {c.price ? <H className="course-price" html={c.price} /> : null}
                            {c.title ? (
                              <h4 className="course-title">
                                <H as="a" href={c.link} html={c.title} />
                              </h4>
                            ) : null}
                            <div className="course-btn-div">
                              {c.link ? (
                                <a className="btn btn-primary learn-more-link" href={c.link}>
                                  Learn More
                                </a>
                              ) : null}
                            </div>
                          </div>
                          <div className="course-bottom">
                            {c.includes ? (
                              <div className="course-inc-div">
                                <p className="course-inc-head">This course includes:</p>
                                {c.includes.map((inc, k) => (
                                  <div key={k} className="course-includes">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className={`feather-check ${count === 2 ? "recommended-icon" : ""}`}
                                      dangerouslySetInnerHTML={{ __html: CHECK }}
                                    />
                                    <H className="course-includes-txt" html={inc} />
                                  </div>
                                ))}
                              </div>
                            ) : null}

                            {c.guide ? (
                              <>
                                <div className="guide">
                                  <H className="title" html={c.guide.value} />
                                  <img src={c.guide.image} />
                                </div>
                                <a className="btn btn-primary guide-link" href={c.guide.link}>
                                  Download
                                </a>
                              </>
                            ) : null}

                            <H
                              className="course-btn-div"
                              style={{ display: "none" }}
                              html={
                                (c.buy ? c.buy : "") +
                                (c.link
                                  ? `\n<a class="btn btn-primary learn-more-link" href="${esc(c.link)}">Learn More</a>`
                                  : "")
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className="forms">
                <H
                  className="callback"
                  html={`<div class="title">GET PROFESSIONAL &amp; PERSONALISED ADVICE</div>
${data.form_advice}`}
                />
                <div className="callback-form-img ">
                  <img className="no-lazy" src={`${o}/wp-content/uploads/2025/05/meet-the-team.jpg`} alt="" />
                </div>
              </div>

              <div className="newsletter">
                <div className="promo">
                  <img src="https://teflinstitute.com/wp-content/uploads/2021/07/laptop_mobile-1.png" />
                  <div className="title">Sign up to our newsletter and receive a 10% discount</div>
                </div>
                <H className="newsletter-form-container" html={data.form_newsletter} />
              </div>

              <div className="video">
                <div className="content">
                  <div className="title">Watch this video &amp; find out what&apos;s the difference between TEFL course and its levels</div>
                  <a href={data.video.youtube} data-lity="" className="video_player youtube_icon">
                    Watch Now
                  </a>
                </div>
                <a
                  href={data.video.youtube}
                  data-lity=""
                  className="thumbnail"
                  style={{ backgroundImage: `url('${data.video.thumbnail}')` }}
                />
              </div>

              <h2 className="large-heading faqs-heading common-section-heading font-800">faqs</h2>
              <div className="faqs-accordion">
                <FaqAccordionItems faqs={data.faqs} inputType="checkbox" contentClass="faqs-accordion__content" />
              </div>
              <div className="show-more-faqs">
                <span>Show More Faqs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeferredScript code={FAQ_SCRIPT} />

      <section className="contact-form-section" style={{ display: "none" }}>
        <div className="ast-container">
          <div className="ast-row">
            <div className="contact-form-section-row">
              <div className="ast-col-md-6 contact-form-text-col">
                {b ? (
                  <div className="course-brochure-details-block ast-col-md-12">
                    {b.heading ? (
                      <H
                        as="h6"
                        className="section-heading"
                        html={`${b.heading} ${b.sub_heading ? `<span class="">${b.sub_heading}</span>` : ""}`}
                      />
                    ) : null}
                    {b.content ? <H className="section-paragraph" html={b.content} /> : null}
                    {b.image ? (
                      <div className="brochure-image">
                        <img src={b.image} className="section-image" />
                      </div>
                    ) : null}
                    {b.link ? (
                      <div className="brochure-detail">
                        <a className="btn" href={b.link} target="_blank">
                          Download Now <i className="fa fa-angle-right" aria-hidden="true" />
                        </a>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="ast-col-md-6 contact-form-col">
                <H
                  className="learn-more-form"
                  html={
                    '<div class="form-head-row">' +
                    (data.call_text ? `<div class="contact-form-text">${data.call_text}</div>` : "") +
                    (data.form_image ? `<img class="form-img" src="${esc(data.form_image)}">` : "") +
                    `</div>
${data.form_learn}`
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
