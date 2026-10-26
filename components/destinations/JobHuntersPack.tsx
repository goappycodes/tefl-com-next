/**
 * Job Hunter's Pack / free resources — native port of the theme's
 * page-job-hunters-pack.php page template (styled by page-job-hunters-pack.css).
 *
 * The page's own script (page-job-hunters-pack.js: lightSlider job carousel,
 * FAQ accordion, logo fader) still runs over this static markup — the
 * lightSlider plugin rebuilds the slider DOM, which a React port can't share.
 */
import { attr, ldJson, raw } from "./html";
import type { JobHuntersPackData } from "./types";

const JOBS_LINK_SVG =
  '<svg width="20" height="20" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8.5" r="8" stroke="white"></circle><path d="M5 8.5H11.5" stroke="white" stroke-width="1.5" stroke-linecap="round"></path><path d="M9.5 11L12 8.5L9.5 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

export default function JobHuntersPack({ d }: { d: JobHuntersPackData }) {
  return (
    <div id="primary" className="content-area primary">
      {d.hero ? (
        <section className="hero-banner section-padding" style={{ background: `url('${d.hero.background}')` }}>
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-5">
                <div className="hero-banner__content">
                  <h1 className="hero-banner__content-title large-heading" {...raw(d.hero.title)} />
                  <div className="hero-banner__content-title-body" {...raw(d.hero.summary)} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.resources ? (
        <section className="section-padding-top resources-cta-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h2 className="text-center large-heading resources-cta-scetion__heading" {...raw(d.resources.title)} />
              </div>
            </div>
            <div className="ast-row cta-card-row">
              {d.resources.cards.map((c, i) => (
                <div key={i} className="ast-col-md-4">
                  <div className="resources-cta-card">
                    <h2 className="large-heading text-center font-500 resources-cta-card__title" {...raw(c.title)} />
                    <div className="resources-cta__image">
                      <img src={c.image} alt={c.alt} />
                    </div>
                    <div className="resource-cta__summary text-center" {...raw(c.summary)} />
                    <a target="_blank" href={c.link} className="btn btn-primary resources-cta-btn btn-centered">
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {d.jobs ? (
        <section className="jobs-section section-padding-top">
          <div className="ast-container">
            <div className="ast-row ast-flex ast-align-items-center">
              <div className="ast-col-md-8">
                <div className="header-wrapper">
                  <h2
                    className="large-heading double-underline common-section-heading jobs-section__title"
                    {...raw(
                      `${d.jobs.title}<a href="https://jobs.teflinstitute.com/?ref=com" target="_blank" class="jobs-link" style="--btn-text-color:#fff; --btn-bg-color:#1c1c1b">${JOBS_LINK_SVG}</a>`,
                    )}
                  />
                </div>
                <span className="jobs-section__subtitle common-subheading" {...raw(d.jobs.subtitle)} />
              </div>
              <div className="ast-col-md-4">
                <div className="pdf-download-area ">
                  <h3>Comparative employment guide for TEFL teachers</h3>
                  <a target="_blank" href={d.jobs.pdf} className="btn btn-primary btn-centered">
                    Download your copy
                  </a>
                </div>
              </div>
            </div>
            <div className="jobs-slider ast-flex">
              {d.jobs.items.map((j, i) => (
                <div key={i} className="slide-item">
                  <div className="job-card">
                    <div className="job-card__header">
                      <img src={j.image} className="no-lazy" alt="" />
                      <span {...raw(j.location)} />
                    </div>
                    <div className="job-card__body">
                      <h6 className="job-title" {...raw(j.title)} />
                      <span className="job-posted d-none" {...raw(`Posted: ${j.posted} hours ago`)} />
                      <span className="job-salary" {...raw(j.salary)} />
                    </div>
                    <div className="job-card__link">
                      <a href={j.link} target="_blank">
                        <span>View Job</span>
                        <i className="fa fa-arrow-right" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="partner-logos-section section-padding-top">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12 logo-container">
              <div className="logo-group first">
                {(d.first_gallery ?? []).map((src, i) => (
                  <div key={i} className="image">
                    <img src={src} />
                  </div>
                ))}
              </div>
              <div className="logo-group second">
                {(d.second_gallery ?? []).map((src, i) => (
                  <div key={i} className="image">
                    <img src={src} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faqs-section faqs-section-redesigned section-padding-top">
        <script
          type="application/ld+json"
          {...raw(
            ldJson({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: d.faqs.map((f) => ({
                "@type": "Question",
                name: f.q_raw,
                acceptedAnswer: { "@type": "Answer", text: f.a_raw },
              })),
            }),
          )}
        />
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-6 contact-form-container">
              <h2 className="large-heading common-section-heading double-underline">Question? get in touch</h2>
              <div
                className="contact-form equal-height"
                {...raw(`<img src="${attr(d.contact_image)}" alt="">${d.form_html}`)}
              />
            </div>
            <div className="ast-col-md-6 faqs">
              <h2 className="large-heading faqs-heading common-section-heading">faqs</h2>
              <div className="faqs-wrapper equal-height">
                <div className="faqs-accordion">
                  {d.faqs.map((f) => (
                    <div key={f.key} className={`faqs-accordion__item ${f.first ? "active" : ""}`}>
                      <input type="radio" id={`acc-${f.key}`} name="faq-accordion" defaultChecked={f.first} hidden />
                      <label className="font-700" htmlFor={`acc-${f.key}`}>
                        <span {...raw(f.question)} />
                        <i className="fa fa-plus" />
                      </label>
                      <div className={`font-500 faqs-accordion__content ${f.first ? "active" : ""}`} {...raw(f.answer)} />
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
    </div>
  );
}
