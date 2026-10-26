/**
 * Homepage Copy — native port of homepage_copy.php (/home-copy/, the pre-2023
 * homepage layout). Same markup as the PHP template; the theme JS (carousel,
 * countdown, course search, lity videos, reviews widget, WCPBC price refresh)
 * drives it unchanged. Data from `tefl/v1/native/homecopy`.
 */
import type { HomeCopyCourse, HomeCopyData } from "./types";
import { css, esc, h } from "./util";

export default function HomeCopy({ data: d }: { data: HomeCopyData }) {
  const wp = d.wp;
  return (
    <>
      <style
        dangerouslySetInnerHTML={h(
          `\n    @media (max-width:768px) {\n        .homepage-hero-section>div:first-child {\n            background-image: url(${d.mobile_bg}) !important\n        }\n    }\n`,
        )}
      />
      <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-bs-touch="true" data-bs-ride="carousel" data-interval="1">
        <div className="carousel-inner">
          <section className="homepage-hero-section">
            {d.slides.map((s) => {
              const cls = `carousel-item second-carousel ${s.n === 1 ? "active" : ""}`;
              if (s.free) {
                return (
                  <div key={s.n} id={`carousel-${s.n}`} className={cls}>
                    <a className="clickable-banner" href={s.free.link} />
                    <div className="ast-container item">
                      <div className="ast-row  free-product-banner">
                        <h2 className="banner-title" dangerouslySetInnerHTML={h(s.free.title)} />
                        <h3
                          className="banner-subtitle "
                          dangerouslySetInnerHTML={h(`<span class="highlighted-text">free</span>${s.free.product}`)}
                        />
                        <div className="countdown-timer" data-expiry={s.free.expiry}>
                          <ul className=" timer">
                            {(["day", "hour", "minute", "second"] as const).map((u) => (
                              <li key={u} className={`timer__${u}`}>
                                <span id={`${u}Count`} /> <span id={`${u}-text`}>{`${u}s`}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="hours-remaining" />
                        <a href={s.free.link} className="pulsating-banner-link">
                          Get Started
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }
              if (!s.std) return null;
              const st = s.std;
              const inner = (
                <div className="ast-container item">
                  <div className={`ast-row banner-text-row ${st.overlay ? "overlay-shadow" : ""}`}>
                    <div className="ast-col-lg-6 ast-col-md-6 ast-col-sm-12 ast-col-xs-12">
                      <h2 className="banner-text" dangerouslySetInnerHTML={h(st.title)} />
                      {st.price ? <div className="banner-price" dangerouslySetInnerHTML={h(st.price)} /> : null}
                      <h2 className="banner-subtext" dangerouslySetInnerHTML={h(st.subtitle)} />
                      {st.button ? <a className="banner-cta" href={st.button.link} dangerouslySetInnerHTML={h(st.button.text)} /> : null}
                    </div>
                    {st.show_buttons ? (
                      <div className="ast-col-lg-6 ast-col-md-6 ast-col-sm-12 ast-col-xs-12">
                        <div className="banner-img-icon">
                          <img src={`${wp}/wp-content/uploads/2022/03/yoga-and-mindfulness-overlay.png`} />
                        </div>
                      </div>
                    ) : null}
                  </div>
                  {st.show_buttons ? (
                    <div className="ast-row banner-bottom-row">
                      {d.links.map((l, i) => (
                        <div key={i} className="ast-col-lg-4 ast-col-md-4 ast-col-sm-12 ast-col-xs-12 banner-link-col">
                          <a href={l.link} className="banner-link">
                            <span className="banner-link-text" dangerouslySetInnerHTML={h(l.text)} />{" "}
                            <span className="banner-link-icon">
                              <i className="fa fa-angle-right" />
                            </span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
              return [
                <style
                  key={`s${s.n}`}
                  dangerouslySetInnerHTML={h(
                    `\n                            #carousel-${s.n} {\n                                background-image: url(${st.bg});\n                            }\n\n                            @media (max-width:768px) {\n                                #carousel-${s.n} {\n                                    background-image: url(${st.mobile_bg});\n                                }\n                            }\n                        `,
                  )}
                />,
                <div key={s.n} id={`carousel-${s.n}`} className={cls}>
                  {st.link ? <a href={st.link}>{inner}</a> : inner}
                </div>,
              ];
            })}
          </section>
        </div>
      </div>

      <section className="search-picker-section">
        <div className="ast-container">
          <h1 className="section-heading">Find the Perfect TEFL Course</h1>
          <div className="ast-row">
            <div className="ast-col-lg-12 ast-col-md-12 ast-col-sm-12" suppressHydrationWarning dangerouslySetInnerHTML={h(d.search)} />
          </div>
        </div>
      </section>

      <div className="footer-adv-middle-section">
        <div className="footer-adv-middle">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-12">
                {d.logos.map((group, g) => (
                  <div key={g} className="logo-group">
                    {group.map((src, i) => (
                      <div key={i} className="image" style={css(`background-image: url(${src});`)} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="govt-regulated-section">
        <div className="ast-container">
          <div className="ast-row govt-regulated-row">
            <div className="ast-col-lg-6 ast-col-md-12 ast-col-sm-12 govt-regulated-text-col">
              <div className="inner-div">
                <h1 className="section-heading" dangerouslySetInnerHTML={h(d.govt.heading)} />
                <p dangerouslySetInnerHTML={h(d.govt.details)} />
              </div>
            </div>
            <div
              className="ast-col-lg-6 ast-col-md-12 ast-col-sm-12 govt-regulated-video-col"
              style={css(`background: url(${d.govt.banner});`)}
            >
              <a href={d.govt.video} data-lity="" className="video-caption-link lity-video">
                <div className="vide-caption-box">
                  <span className="video-caption-text" dangerouslySetInnerHTML={h(d.govt.title)} /> <PlayIcon wp={wp} />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="govt-regulated-training-courses">
        <div className="ast-container">
          <div className="ast-row">
            <h2 className="section-heading" dangerouslySetInnerHTML={h(d.govt.section)} />
            <div className="divider">
              <div>6 Months Study Time</div>
              <div className="center">Pay in Installments</div>
              <div>Personal Tutor Support</div>
            </div>
            <div className="ast-row training-courses">
              <div className="ast-col-lg-6 ast-col-md-12 ast-col-sm-12">
                <div className="fasttrack-accredited training-course">
                  <h2>FAST TRACK ACCREDITED</h2>
                  <div className="ast-row training-courses">
                    {d.accredited.map((c, i) => (
                      <Course key={i} c={c} wp={wp} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="ast-col-lg-6 ast-col-md-12 ast-col-sm-12">
                <div className="govt-regulated training-course">
                  <h2>LEVEL 5 GOVERNMENT REGULATED</h2>
                  <div className="ast-row training-courses">
                    {d.level5.map((c, i) => (
                      <Course key={i} c={c} wp={wp} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <a href={d.browse.link} className="btn-block-black" dangerouslySetInnerHTML={h(d.browse.text)} />
          </div>
        </div>
      </section>

      <div className="internships-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <h2>Paid TEFL Internships</h2>
              <div className="ast-row ast-flex">
                {d.cards.map((c, i) => (
                  <div key={i} className="ast-col-lg-4">
                    <div className="internship">
                      <a href={c.link} className="internship-clickbox" />
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
              <a href="/tefl-courses/" className="btn-block-black">
                Browse All Courses
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className="homepage-choice-banner-section" style={{ display: "none" }}>
        <div className="ast-container" style={css(`background-image:url('${d.choice.image}')`)}>
          <div className="ast-row banner-text-row">
            <div className="ast-col-lg-12 ast-col-md-12 ast-col-sm-12 ast-col-xs-12">
              <h2 className="banner-text" dangerouslySetInnerHTML={h(d.choice.text)} />
              {d.choice.icons ? (
                <div className="banner-icons">
                  {d.choice.icons.map((e, i) => (
                    <div key={i} className="banner-icon-box">
                      <img src={e.icon} />
                      <p dangerouslySetInnerHTML={h(e.text)} />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-banner-section">
        <div className="ast-container" style={css(`background-image:url('${d.center.image}')`)}>
          <div className="ast-row banner-text-row">
            <div className="ast-col-lg-12 ast-col-md-12 ast-col-sm-12 ast-col-xs-12">
              <h2 className="banner-text" dangerouslySetInnerHTML={h(d.center.text)} />
            </div>
          </div>
        </div>
      </section>

      <section className="tefl-video-section">
        <div className="ast-container">
          <div className="ast-row tefl-video-row">
            {d.videos.map((v, i) => (
              <div
                key={i}
                className={`ast-col-lg-6 ast-col-md-6 ast-col-sm-12 ast-col-xs-12 tefl-video-col tefl-video-col-${i + 1}`}
                style={css(`background-image:url('${v.img}')`)}
              >
                <a href={v.url} data-lity="" className="video-caption-link lity-video">
                  <div className="vide-caption-box">
                    <span className="video-caption-text" dangerouslySetInnerHTML={h(v.text)} /> <PlayIcon wp={wp} />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The reviews shortcode is a sibling of the template's own tags, so the section's inner HTML is built whole. */}
      <section
        className="students-review ast-container"
        style={{ padding: 0 }}
        suppressHydrationWarning
        dangerouslySetInnerHTML={h(
          `<h6 class="section-heading">verified student reviews</h6>` +
            (d.review_banner ? `<div class="review-banner" style="background-image:url('${esc(d.review_banner)}')"></div>` : "") +
            `<div class="review-banner" style="background-image:url('https://teflinstitute.com/wp-content/uploads/2020/11/Group-326.jpg')"></div>` +
            d.reviews,
        )}
      />

      <section className="why-choose-us-section">
        <div className="ast-container">
          <div className="ast-row why-choose-us-row">
            <div className="ast-col-lg-12 ast-col-md-12 ast-col-sm-12 ast-col-xs-12 why-choose-us-col">
              <h2 className="section-heading" dangerouslySetInnerHTML={h(d.why_title)} />
            </div>
          </div>
          <div className="ast-row why-choose-us-row why-choose-us-blocks">
            {d.reasons.map((r, i) => (
              <div key={i} className="ast-col-lg-2 ast-col-md-2 ast-col-sm-12 ast-col-xs-12 why-choose-us-col">
                <div className="why-choose-us-icon">
                  <img src={r.img} />
                </div>
                <div className="why-choose-us-text">
                  <h4 dangerouslySetInnerHTML={h(r.title)} />
                  <p dangerouslySetInnerHTML={h(r.text)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="webinar-section">
        <div className="ast-container">
          <div className="ast-row webinar-row">
            <div className="ast-col-lg-12 ast-col-md-12 ast-col-sm-12 ast-col-xs-12 webinar-col">
              <h2 className="section-heading" dangerouslySetInnerHTML={h(d.webinars.title)} />
            </div>
          </div>
          {d.webinars.list.length ? (
            <div className="ast-row webinar-row">
              {d.webinars.list.map((w, i) => (
                <div
                  key={i}
                  className="ast-col-lg-4 ast-col-md-4 ast-col-sm-12 ast-col-xs-12 webinar-col"
                  style={css(`background-image: url('${w.image}')`)}
                >
                  <div className="webinar-div">
                    <a href={d.webinars.register}>
                      <h4 className="webinar-title" dangerouslySetInnerHTML={h(w.title)} />
                      <p className="webinar-location" dangerouslySetInnerHTML={h(`LOCATION : ${w.location}`)} />
                      <p className="webinar-date" dangerouslySetInnerHTML={h(`DATE : ${w.date}`)} />
                      <p className="webinar-time" dangerouslySetInnerHTML={h(`TIME : ${w.time} (UK TIME)`)} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <div className="ast-row">
            <a href={d.webinars.link} className="btn-block-black" dangerouslySetInnerHTML={h(d.webinars.text)} />
          </div>
        </div>
      </section>

      {d.faqs ? (
        <>
          <section className="faq-hero-section">
            <div className="ast-container" style={css("background: url('https://teflinstitute.com/wp-content/uploads/2020/11/take_the_test_bg.jpg');")}>
              <div className="ast-row banner-text-row">
                <div className="ast-col-lg-12 ast-col-md-12 ast-col-sm-12 ast-col-xs-12">
                  <h2 className="banner-text">
                    TEFL Institute <br /> Frequently Asked Questions
                  </h2>
                </div>
              </div>
            </div>
          </section>
          <div className="ast-row more-space">
            <div className="ast-col-md-12">
              {d.faqs.map((f, i) => (
                <section key={i} className="accordion-container">
                  <input id={`accordion-${i}`} name="accordion-1" type="radio" defaultChecked={i === 0} />
                  <label htmlFor={`accordion-${i}`} dangerouslySetInnerHTML={h(f.q)} />
                  <article dangerouslySetInnerHTML={h(f.a)} />
                </section>
              ))}
              <script type="application/ld+json" dangerouslySetInnerHTML={h(d.faq_ld)} />
            </div>
          </div>
        </>
      ) : null}

      <section className="tefl-on-the-go-section-new">
        <div className="ast-container">
          <div className="ast-row">
            <div className="mobile-container">
              <div className="ast-col-lg-12 ast-col-md-6 ast-col-sm-12 ast-col-xs-12 mobile-bg-left">
                <h2 className="section-heading" dangerouslySetInnerHTML={h(d.go.title)} />
                <h2 className="section-subheading" dangerouslySetInnerHTML={h(d.go.subtitle)} />
                <p dangerouslySetInnerHTML={h(d.go.text)} />
                <div className="app-store">
                  <h2 className="section-heading">Download the app</h2>
                  {d.go.app ? (
                    <a href={d.go.app}>
                      <img src={`${wp}/wp-content/uploads/2021/08/apple-logo-1.svg`} />
                    </a>
                  ) : null}{" "}
                  {d.go.play ? (
                    <a href={d.go.play}>
                      <img src={`${wp}/wp-content/uploads/2021/08/google-play-logo-1.svg`} />
                    </a>
                  ) : null}
                </div>
              </div>
              <div className="ast-col-lg-12 ast-col-md-6 ast-col-sm-12 ast-col-xs-12 mobile-bg-right">
                <img src={d.go.image} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PlayIcon({ wp }: { wp: string }) {
  return (
    <span className="video-icon ">
      <img src={`${wp}/wp-content/uploads/2021/10/Play-button.svg`} />
    </span>
  );
}

function Course({ c, wp }: { c: HomeCopyCourse; wp: string }) {
  return (
    <div className="ast-col-lg-6 ast-col-md-6 ast-col-sm-12 ast-col-xs-12">
      <div className="course-item">
        <div className="course-save ">
          <span className="save">save</span>
          <span className="price">{`${c.pct}%`}</span>
        </div>
        <div className="course-icon">
          <img width="140" height="140" src={c.icon} />
        </div>
        <h3 className="course-price" suppressHydrationWarning dangerouslySetInnerHTML={h(c.price)} />
        {c.zoom ? (
          <div className="course-zoom">
            <img src={`${wp}/wp-content/uploads/2021/11/zoom-black.png`} />
            <div dangerouslySetInnerHTML={h(`${c.zoom.text} Worth ${c.zoom.price}`)} />
          </div>
        ) : null}
        <h3 className="course-title" dangerouslySetInnerHTML={h(c.title)} />
        <p className="course-desc" dangerouslySetInnerHTML={h(c.desc)} />
        {c.images ? (
          <div className="images">
            {c.images.map((im, i) => (
              <img key={i} className="course-images" style={im.inactive ? { opacity: "50%" } : undefined} src={im.icon} />
            ))}
          </div>
        ) : null}
        <div className="book-now">
          <a href={c.link}>
            LEARN MORE <i className="fa fa-angle-right" />
          </a>
        </div>
      </div>
    </div>
  );
}
