/**
 * TEFL course sale landing page — native port of the theme's
 * black-friday-landing-page.php (page online-tefl-course-sale).
 *
 * Same markup as the PHP template; the theme keeps driving the countdown
 * (ti-timer.js), geo prices (WCPBC), lity video popups and add-to-cart links.
 */
import { esc, ih, TeflTimer } from "./shared";
import type { BlackFridayLandingData } from "./types";

export default function BlackFridayLanding({ d }: { d: BlackFridayLandingData }) {
  const o = d.origin;
  const t = d.timer_section;
  const inc = (text: string) => `<img\n src="${o}/wp-content/uploads/2021/11/Group-22.svg">${text}`;
  const exc = (text: string) => `<img\n src="${o}/wp-content/uploads/2021/11/Group-21-1.png">${text}`;
  return (
    <div id="primary" className={d.primary_class}>
      {d.header ? (
        <div className="page-header">
          <div className="ast-container">
            <div className="ast-row">
              {d.header.heading ? (
                <h1 className="large-heading font-700 page-header__title" dangerouslySetInnerHTML={ih(d.header.heading)} />
              ) : null}
              {d.header.subheading ? (
                <h3 className="small-heading page-header__subtitle" dangerouslySetInnerHTML={ih(d.header.subheading)} />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="section tefl-section timer-section">
        <div className="ast-container">
          <div className="ast-row timer-row ast-flex">
            <div className="ast-col ast-col-md-5 timer-content-col">
              <div className="timer-content-inner">
                <h3 className="section-title text-center" dangerouslySetInnerHTML={ih(t.title)} />
                <div className="section-content" dangerouslySetInnerHTML={ih(t.content)} />
              </div>
              {t.bonus ? (
                <div className="offer-bonus-info">
                  <div className="offer-bonus-info-title text-center">
                    <h2 style={{ background: d.accent }} dangerouslySetInnerHTML={ih(t.bonus.title)} />
                  </div>
                  <div className="bonus-info-content">
                    <div className="bonus-info-content__left">
                      <img src={t.bonus.icon} alt="" />
                    </div>
                    <div className="bonus-info-content__right" dangerouslySetInnerHTML={ih(t.bonus.content)} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="ast-col ast-col-md-5 timer-value-col">
              {t.hero !== null ? (
                <div className="offer-hero-image">
                  <img src={t.hero} alt="" className="" />
                </div>
              ) : null}
              <div className="timer-value-inner">
                <TeflTimer t={t.timer} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {d.courses.map((c, i) => (
        <div key={i} className="section tefl-section sale-courses-section">
          <div className="ast-container">
            <div className="sale-courses-section__wrapper">
              <div className="ast-row sale-courses-header-row">
                <div className="ast-col ast-col-md-12 section-header-col">
                  <div className="section-header" dangerouslySetInnerHTML={ih(d.common_heading)} />
                  {c.teachers_choice ? (
                    <img className="teachers-choice" src={`${o}/wp-content/uploads/2020/11/Teachers-choice.png`} />
                  ) : null}
                </div>
              </div>
              <div className="ast-row sale-courses-content-row">
                <div className="ast-col ast-col-md-4 course-detail-col">
                  <div className="course-detail-col-inner">
                    {c.image ? (
                      <div className="course-img">
                        <img src={c.image} />
                      </div>
                    ) : null}
                    {c.logo ? (
                      <div className="course-logo">
                        <img src={c.logo} />
                      </div>
                    ) : null}
                    {c.title ? <h4 className="course-title" dangerouslySetInnerHTML={ih(c.title)} /> : null}
                    {c.price ? <div className="course-price" dangerouslySetInnerHTML={ih(c.price)} /> : null}
                    {c.cart ? (
                      <div className="enroll-now-btn">
                        <a className="btn btn-primary dark-btn" rel="nofollow" href={c.cart}>
                          Enrol Now
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="ast-col ast-col-md-4 course-inc-exc-col">
                  {c.has_inc_exc ? (
                    <div className="inc-exc-inner">
                      <p className="inc-exc-title">What’s Included</p>
                      <div className="inc-exc-div">
                        {c.includes.map((x, j) => (
                          <div key={`i${j}`} className="item inc-item" dangerouslySetInnerHTML={ih(inc(x))} />
                        ))}
                        {c.excludes.map((x, j) => (
                          <div key={`e${j}`} className="item exc-item" dangerouslySetInnerHTML={ih(exc(x))} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="ast-col ast-col-md-4 freebie-col">
                  {c.has_freebie ? (
                    <div className="freebie-col-inner">
                      <p className="freebie-title">Free Resources</p>
                      {c.freebies.map((fc, j) => (
                        <div key={j} className="freebie-course">
                          {fc.icon ? (
                            <div className="free-course-icon">
                              <img src={fc.icon} />
                            </div>
                          ) : null}
                          {fc.title ? <p className="free-course-title" dangerouslySetInnerHTML={ih(fc.title)} /> : null}
                          {fc.price ? (
                            <div className="free-course-price" style={{ background: d.accent }} dangerouslySetInnerHTML={ih(fc.price)} />
                          ) : null}
                        </div>
                      ))}
                      {c.others !== null ? (
                        <div className="other-freebie-div">
                          {c.others.map((of, j) => (
                            <div key={j} className="other-freebie-div-inner">
                              {of.icon ? (
                                <div className="other-freebie-icon">
                                  <img src={of.icon} />
                                </div>
                              ) : null}
                              {of.title ? <p className="other-freebie-title" dangerouslySetInnerHTML={ih(of.title)} /> : null}
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {c.link ? (
                        <div className="learn-more-btn">
                          <a className="btn btn-primary dark-btn" href={c.link}>
                            Learn More
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {d.cyber ? (
        <div className="section tefl-section cyber-monday-section">
          <div className="ast-container">
            <h3 className="cyber-monday-header">Cyber Monday Deal</h3>
            <div className="ast-row">
              {d.cyber.jobs.map((job, i) => (
                <div key={i} className="ast-col-md-4 ast-col-sm-12 ast-col-xs-12 job-col">
                  <div className="job">
                    <div className="deal-text">Black Friday Deal</div>
                    <div className="background" style={{ backgroundImage: `url('${job.background}')` }} />
                    <div className="title" dangerouslySetInnerHTML={ih(job.title)} />

                    {job.info.map((e, j) => (
                      <p
                        key={j}
                        className="info"
                        dangerouslySetInnerHTML={ih(
                          `\n<span class="icon" style="background-image: url('${esc(e.icon)}')"></span>\n${e.content}\n`,
                        )}
                      />
                    ))}

                    <a href={job.link}>
                      Learn More <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="bottom-container"
              dangerouslySetInnerHTML={ih(`\n${d.cyber.deal}\n<div class="code">Code: <span>${d.cyber.code}</span>\n</div>\n`)}
            />
          </div>
        </div>
      ) : null}

      {d.addons ? (
        <div className="section tefl-section addons-section">
          <div className="ast-container">
            <div className="ast-row addons-header-row">
              <div className="ast-col ast-col-md-12 addons-header-col">
                <h3 className=" addons-header" dangerouslySetInnerHTML={ih(d.add_ons_title)} />
              </div>
            </div>
            <div className="ast-row addons-row">
              {d.addons.map((a, i) => (
                <div key={i} className="ast-col ast-col-md-4 addons-col">
                  <div className="section-header" dangerouslySetInnerHTML={ih(d.common_heading)} />
                  <div className="addons-col-inner">
                    {a.image ? (
                      <div className="course-img">
                        <img src={a.image} />
                      </div>
                    ) : null}
                    {a.logo ? (
                      <div className="course-logo">
                        <img src={a.logo} />
                      </div>
                    ) : null}
                    {a.title ? <h4 className="course-title" dangerouslySetInnerHTML={ih(a.title)} /> : null}
                    {a.includes !== null ? (
                      <div className="inc-div">
                        {a.includes.map((x, j) => (
                          <div key={j} className="item inc-item" dangerouslySetInnerHTML={ih(inc(x))} />
                        ))}
                      </div>
                    ) : null}
                    {a.price ? <div className="course-price" dangerouslySetInnerHTML={ih(a.price)} /> : null}
                    {a.link || a.cart ? (
                      <div className="addons-btn-div">
                        {a.link ? (
                          <div className="learn-more-btn">
                            <a className="btn btn-primary light-btn" href={a.link}>
                              Learn More
                            </a>
                          </div>
                        ) : null}
                        {a.cart ? (
                          <div className="enroll-now-btn">
                            <a className="btn btn-primary dark-btn" rel="nofollow" href={a.cart}>
                              Enrol Now
                            </a>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {d.resources ? (
        <div className="section tefl-section teaching-resources-section" style={{ display: "none" }}>
          <div className="ast-row teaching-resources-header-row">
            <div className="ast-col ast-col-md-12 teaching-resources-header-col">
              <h3 className="teaching-resources-header">TEFL EXCLUSIVE TEACHING RESOURCES</h3>
            </div>
          </div>
          <div className="ast-row teaching-resources-row">
            {d.resources.map((r, i) => (
              <div key={i} className="ast-col ast-col-md-4 teaching-resources-col">
                <div className="section-header" dangerouslySetInnerHTML={ih(d.common_heading)} />
                <div className="teaching-resources-col-inner">
                  {r.image ? (
                    <div className="resource-img">
                      <img src={r.image} />
                    </div>
                  ) : null}
                  {r.price ? <div className="resource-price" dangerouslySetInnerHTML={ih(r.price)} /> : null}
                  {r.title ? <h4 className="resource-title" dangerouslySetInnerHTML={ih(r.title)} /> : null}
                  {r.link ? (
                    <div className="download-btn">
                      <a className="btn btn-primary dark-btn" href={r.link}>
                        Purchase Guide
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {d.guide ? (
        <>
          <div className="section tefl-section guide-bundle-section">
            <div className="ast-container">
              <div className="ast-row">
                <div className="ast-col-md-12">
                  <div className="section-header" dangerouslySetInnerHTML={ih(d.common_heading)} />
                </div>
              </div>
              <div className="ast-row guide-bundle-row">
                <div className="ast-col ast-col-md-4 guide-bundle-content-col">
                  <div className="guide-bundle-content-col-inner">
                    {d.guide.title ? <h4 className="guide-title" dangerouslySetInnerHTML={ih(d.guide.title)} /> : null}
                    {d.guide.subtitle ? <p className="guide-subtitle" dangerouslySetInnerHTML={ih(d.guide.subtitle)} /> : null}
                    {d.guide.price ? <div className="guide-price" dangerouslySetInnerHTML={ih(d.guide.price)} /> : null}
                    {d.guide.link ? (
                      <div className="download-btn">
                        <a className="btn btn-primary dark-btn" href={d.guide.link}>
                          Purchase Bundle
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="ast-col ast-col-md-8 guide-bundle-img-col">
                  {d.guide.image ? (
                    <div className="guide-bundle-img-col-inner">
                      <img src={d.guide.image} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {d.guide.view_more ? (
            <div className="section tefl-section view-more-guides-section">
              <div className="ast-container">
                <div className="ast-row view-more-guides-row">
                  <div className="ast-col ast-col-md-12 view-more-guides-col">
                    <div className="view-more-guides-div">
                      <a className="" href={d.guide.view_more}>
                        View More Guides
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {d.video ? (
        <section className="section tefl-section tefl-video-section">
          <div className="ast-container">
            <div className="ast-row tefl-video-row">
              {d.video.map((v, i) => (
                <div
                  key={i}
                  className={`ast-col-lg-6 ast-col-md-6 ast-col-sm-12 ast-col-xs-12 tefl-video-col tefl-video-col-${i + 1}`}
                  style={{ backgroundImage: `url('${v.image}')` }}
                >
                  <a href={v.url} data-lity="" className="video-caption-link lity-video">
                    <div className="video-caption-box">
                      <span className="video-caption-text" dangerouslySetInnerHTML={ih(v.caption)} />
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
      ) : null}

      {d.why ? (
        <section className="section tefl-section why-choose-us-section">
          <div className="ast-container">
            <div className="ast-row why-choose-us-heading-row">
              <div className="ast-col ast-col-md-12 why-choose-us-heading-col">
                <h3 className="section-heading">WHY CHOOSE US</h3>
              </div>
            </div>
            <div className="ast-row ast-flex why-choose-us-row">
              {d.why.map((w, i) => (
                <div key={i} className="ast-col-lg-2 ast-col-md-4 ast-col-xs-6 why-choose-us-col">
                  <div className="why-choose-us-content">
                    {w.image ? (
                      <div className="why-choose-us-img-div">
                        <img src={w.image} />
                      </div>
                    ) : null}
                    {w.title || w.description ? (
                      <div className="why-choose-us-text">
                        {w.title ? <h4 dangerouslySetInnerHTML={ih(w.title)} /> : null}
                        {w.description ? <p dangerouslySetInnerHTML={ih(w.description)} /> : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
