/**
 * Free TEFL jobs service — native port of the theme's page-jobs-service.php
 * page template (styled by ti-job-service.css). The brochure popup behaviour of
 * ti-job-service.js is JobServiceClient.tsx; the CF7 form is WordPress output.
 *
 * Blocks where the template wraps a WYSIWYG value in <p> are written as HTML
 * at the nearest <div>, so the browser parses them exactly as on live.
 */
import { attr, raw } from "./html";
import { HunterBrochure } from "./JobServiceClient";
import type { JobsServiceData } from "./types";

export default function JobsService({ d }: { d: JobsServiceData }) {
  const o = d.origin;
  return (
    <>
      <section className="banner-section lazy" style={{ backgroundImage: `url(${d.banner.photo})` }}>
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-lg-6 ast-col-md-8">
              <div className="banner-content-block">
                <div
                  className="content-block"
                  {...raw(
                    `<h1 class="section-heading">${d.banner.title}</h1><h3>${d.banner.subtitle}</h3><p></p><p>${d.banner.slugline}</p>` +
                      `<img class="lazy loaded" src="${o}/wp-content/uploads/2020/11/Group-57.svg" data-src="${o}/wp-content/uploads/2020/11/Group-57.svg" data-was-processed="true">`,
                  )}
                />
                <a href={d.brochure_pdf}>
                  Download Brochure <i className="fa fa-angle-right" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hunter_brochure">
        <div className="hunter_brochure_container">
          <span className="cross">✖</span>
          <div className="ast-row ast-flex hunter_brochure_row">
            <div className="ast-col-md-6 ast-col-sm-12 brochure-image">
              <img src={`${o}/wp-content/uploads/2021/07/job-hunters-mock.png`} />
            </div>
            <div className="ast-col-md-6 ast-col-sm-12 brochure_content_col">
              <div className="brochure_content">
                <div className="brochure-title">Job Hunter&apos;s Guide</div>
                <div className="brochure-content">
                  Your first steps to becoming a fully accredited, internationally recognised EFL/ESL teacher within 4 weeks!
                </div>
              </div>
              <div className="brochure_form">
                <div className="brochure_form_inner" {...raw(d.form_html)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {d.featured ? (
        <section className="jobs-section">
          <div className="ast-container">
            <h2>Featured Teaching Placements Abroad - TEFL Training &amp; Guaranteed Interview</h2>
            <div className="ast-row">
              {d.featured.map((e, i) => (
                <div key={i} className="ast-col-md-4 ast-col-sm-12 ast-col-xs-12 job-col">
                  <div
                    className="job"
                    {...raw(
                      `<a href="${attr(e.link)}" class="background" style="background-image:url('${attr(e.background)}');">` +
                        (e.salary ? `<div class="salary">${e.salary}</div>` : "") +
                        `</a><div class="title">${e.title}</div>` +
                        e.info
                          .map(
                            (it) =>
                              `<p class="info"><span class="icon" style="background-image: url('${attr(it.icon)}')"></span> ${it.content}</p>`,
                          )
                          .join("") +
                        `<a href="${attr(e.link)}">Learn More <i class="fa fa-angle-right"></i></a>`,
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="header-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <h2 {...raw(d.header.title)} />
              <div className="ast-row">
                <div className="ast-col-lg-6" {...raw(`<p>${d.header.subtitle}</p>`)} />
                <div className="ast-col-lg-6">
                  <img src={d.header.image} />
                  <div className="button-container">
                    <a className="hunter-button black-button">
                      <span>Download Brochure</span>
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {d.ti_jobs ? (
        <section className="job-section">
          <div className="ast-container">
            <h3>TEFL/TESOL Careers</h3>
            <div className="ast-row">
              {d.ti_jobs.map((j, i) => (
                <div key={i} className="ast-col-md-3">
                  <a target="_blank" href={j.link} className="job-clickbox" />
                  <div className="job-card">
                    <div className="job-card__header">
                      <div className="job-type" {...raw(j.type)} />
                      <div className="job-image">
                        <img src={j.logo} />
                      </div>
                    </div>
                    <div className="job-card__body">
                      <div className="job-card__title">
                        <h4 {...raw(j.title)} />
                      </div>
                      <div className="job-card__meta">
                        <JobMeta cls="job-meta__company" icon={`${o}/wp-content/uploads/2021/04/Company.svg`} html={j.company} />
                        <JobMeta cls="job-meta__location" icon={`${o}/wp-content/uploads/2021/04/Location.svg`} html={j.location} />
                        <JobMeta cls="job-meta__salary" icon={`${o}/wp-content/uploads/2021/04/Payment.svg`} html={j.salary} />
                      </div>
                    </div>
                    <div className="job-card__footer">
                      <a target="_blank" href={j.link} className="learn-more black-button">
                        <span>learn more</span>
                        <i className="fa fa-angle-right" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="button-container">
              <a href="https://jobs.teflinstitute.com/all-jobs" target="_blank" className="black-button">
                View All Jobs <i className="fa fa-angle-right" />
              </a>
            </div>
          </div>
        </section>
      ) : null}
      {d.gocambio_empty ? (
        <section className="job-section" id="job_section">
          <div className="ast-container">
            <h3>TEFL/TESOL Careers</h3>
            <div className="ast-row" />
            <div className="button-container">
              <a href="https://jobs.teflinstitute.com/all-jobs" target="_blank" className="black-button">
                View All Jobs <i className="fa fa-angle-right" />
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <section className="experience-section">
        <div className="ast-container">
          <h2>Your Online Teaching Experience</h2>
          <h3>In a Nutshell</h3>
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <div className="experience-box">
                <div className="experience-left-inner" {...raw(`<h2>Working Hours</h2><p>${d.experience.hours}</p>`)} />
                <div className="experience-right-inner" {...raw(`<h2>Class Size</h2><p>${d.experience.class_size}</p>`)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="ast-container team-container">
          <h2>Your Expert TEFL Recruitment Team</h2>
          <div className="ast-row team-row">
            {d.team.map((m, i) => (
              <div key={i} className={`team-col ast-col-lg-4 ${m.offset ? "ast-col-lg-offset-4" : ""} ast-col-md-6 ast-col-sm-12`}>
                <div
                  className={`team-member ${m.last ? "last" : ""}`}
                  {...raw(
                    `<div class="team-member-image" style="background-image: url('${attr(m.photo)}'); background-position: ${attr(m.position)};"></div>` +
                      `<h5 class="team-member-name">${m.name}</h5><h5 class="team-member-title">${m.designation}</h5>` +
                      `<p class="team-member-about">${m.about}</p>`,
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="salary-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <div className="salary-container lazy" style={{ backgroundImage: `url('${d.promo.image}')` }}>
                <div
                  className="salary-container-content"
                  {...raw(
                    `<h3>${d.promo.title}</h3><p>${d.promo.subtitle}</p>` +
                      `<a class="blog-link" href="${attr(d.promo.link)}">Take the Test <i class="fa fa-angle-right"></i></a>`,
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="ast-container">
          <h2>Recommended Readings</h2>
          <div className="ast-row blog-row">
            {d.blogs.map((b, i) => (
              <div key={i} className="ast-col-md-4 blog-col">
                <div className="blog-item" style={{ background: `url('${b.image}')` }}>
                  <div className="bolg-content">
                    <h3 {...raw(b.title)} />
                    <a className="blog-link" href={b.url} target="_blank">
                      READ MORE <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {d.faqs ? (
        <section className="faq-section">
          <div className="ast-container">
            <h3>FAQ&apos;s</h3>
            <div className="ast-row">
              {d.faqs.map((f, i) => (
                <div key={i} className="ast-col-md-4">
                  <div className="faq-box" {...raw(`<h4>${f.question}</h4><p>${f.answer}</p>`)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <HunterBrochure />
    </>
  );
}

function JobMeta({ cls, icon, html }: { cls: string; icon: string; html: string }) {
  return (
    <div className={`job-meta ${cls} ast-flex`}>
      <img className="job-meta_icon" src={icon} alt="" />
      <span className="job-meta_value" {...raw(html)} />
    </div>
  );
}
