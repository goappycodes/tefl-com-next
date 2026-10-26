/**
 * Single country guide — native port of the theme's single-teach_english_abroad.php.
 *
 * Same markup and class names as the PHP template (styled by the theme's
 * ti-single-teach-english-abroad.css); data from `tefl/v1/native/teach_english_abroad`.
 * The theme script's read-more and FAQ behaviour is in TeaClient.tsx.
 */
import { ldJson, raw } from "./html";
import { FaqPanels, ReadMore } from "./TeaClient";
import type { TeachEnglishAbroadData } from "./types";

const ONLINE_ID = 67449;

export default function TeachEnglishAbroad({ d }: { d: TeachEnglishAbroadData }) {
  const livingLabel = d.id === ONLINE_ID ? "Where to find a job teaching online" : "Living costs";
  const o = d.origin;

  return (
    <div id="primary" className="content-area primary">
      <div className="hero" style={{ backgroundImage: `url('${d.hero}')` }}>
        {d.page_title ? <h1 {...raw(d.page_title)} /> : null}
      </div>

      <div className="section main-content-section">
        <ReadMore className="ast-row ast-flex main-content-row read-more-section">
          <div className="ast-col-md-7 main-content-col">
            <h2 className="main-section-title" {...raw(d.job_title)} />
            <div className="section-links">
              <a href="#living_costs">{livingLabel}</a>
              <a href="#key_facts">Key facts</a>
              <a href="#faq">FAQ’s</a>
              <a href="#student_story">Student Story</a>
              <a href="#jobs" {...raw(d.job_title)} />
            </div>
            <div className="section-content" {...raw(d.content_html)} />
          </div>
          <div className="ast-col-md-5 main-content-img-col">
            {d.country_images.map((ci, i) => (
              <div key={i} className="country-image-div">
                <img src={ci.src} alt={ci.alt} />
              </div>
            ))}
          </div>
        </ReadMore>
      </div>

      {d.living ? (
        <div id="living_costs" className="section living-cost-section">
          <div className="ast-row living-cost-row">
            <div className="ast-col-md-12 living-cost-heading-col">
              <h2 className="main-section-title">{livingLabel}</h2>
            </div>
          </div>
          <div className="ast-row ast-flex living-cost-row">
            {d.living.content ? (
              <div className="ast-col-md-7 living-cost-content-col">
                <div className="section-content" {...raw(d.living.content)} />
              </div>
            ) : null}
            {d.living.points ? (
              <div className="ast-col-md-5 living-cost-feature-col">
                <FeaturePoints points={d.living.points} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {d.key_points ? (
        <div className="section key-points-section">
          <div className="ast-row key-points-heading-row">
            <div className="ast-col-md-12 key-points-heading-col">
              <h3 className="sub-main-section-title center" {...raw(`${d.job_title}:  KEY POINTS`)} />
            </div>
          </div>
          <div className="ast-row ast-flex key-points-row">
            {d.key_points.map((kp, i) =>
              kp.show ? (
                <div key={i} className="ast-col-md-3 key-points-col">
                  <div className="key-points-div">
                    <div className="key-points-icon">
                      <img src={kp.icon} alt={kp.alt} />
                    </div>
                    <p className="key-points-title" {...raw(kp.title)} />
                    <p className="key-points-content" {...raw(kp.content)} />
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </div>
      ) : null}

      {d.key_facts ? (
        <ReadMore id="key_facts" className="section key-facts-section" clampAt={450}>
          <div className="ast-row key-facts-heading-row">
            <div className="ast-col-md-12 key-facts-heading-col">
              <h2 className="main-section-title">KEY FACTS</h2>
            </div>
          </div>
          <div className="ast-row ast-flex key-facts-row">
            {d.key_facts.points ? (
              <div className="ast-col-md-6 key-facts-feature-col">
                <FeaturePoints points={d.key_facts.points} />
              </div>
            ) : null}
            {d.key_facts.content ? (
              <div className="ast-col-md-6 key-facts-content-col">
                <div className="section-content" {...raw(d.key_facts.content)} />
              </div>
            ) : null}
          </div>
        </ReadMore>
      ) : null}

      <div className="section facts-section">
        <div className="ast-row facts-heading-row">
          <div className="ast-col-md-12 facts-heading-col">
            <h3 className="sub-main-section-title center" {...raw(`Facts about ${d.country_name}`)} />
          </div>
        </div>
        <div className="ast-row facts-row">
          <div className="ast-col-md-12 facts-col">
            <div className="ast-row facts-inner-row ast-flex">
              {d.facts.map((f, i) => (
                <div key={i} className="ast-col-md-2 facts-inner-col">
                  <div className="facts-div">
                    <div className="facts-icon">
                      <img src={f.icon} alt={f.alt} />
                    </div>
                    <p className="facts-title" {...raw(f.title)} />
                    <p className="facts-content" {...raw(f.content)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {d.faqs ? (
        <div id="faq" className="section faqs-section">
          <div className="ast-row faqs-row">
            <div className="ast-col-md-6 faqs-img-col">
              <img src={d.faqs.image} alt={d.faqs.alt} />
            </div>
            <div className="ast-col-md-6 faqs-content-col">
              <h3 className="sub-main-section-title center" {...raw(`${d.job_title}:  FAQS`)} />
              <div className="faq-content-div">
                <FaqPanels items={d.faqs.items}>
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: ldJson({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: d.faqs.items.map((f) => ({
                          "@type": "Question",
                          name: f.q_raw,
                          acceptedAnswer: { "@type": "Answer", text: f.a_raw },
                        })),
                      }),
                    }}
                  />
                </FaqPanels>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {d.story ? (
        <div id="student_story" className="section teacher-story-section">
          <div className="ast-row teacher-story-heading-row">
            <div className="ast-col-md-12 teacher-story-heading-col">
              <h3 className="sub-main-section-title">Teacher Story</h3>
            </div>
          </div>
          <div className="ast-row teacher-story-row">
            <div className="ast-col-md-6 teacher-story-content-col">
              <div className="teacher-story-content-div">
                <div className="teacher-story-content" {...raw(d.story.content)} />
                {d.story.name ? <h6 className="name-and-designation" {...raw(d.story.name)} /> : null}
              </div>
            </div>
            <div className="ast-col-md-6 teacher-story-img-col">
              <div className="teacher-story-img-div">
                <img src={d.story.image} alt={d.story.alt} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {d.jobs ? (
        <div id="jobs" className="section job-section">
          <div className="ast-row job-heading-row">
            <div className="ast-col-md-12 job-heading-col">
              <h2 className="main-section-title">LATEST JOBS</h2>
            </div>
          </div>
          <div className="ast-row ast-flex job-row">
            {d.jobs.map((job, i) => (
              <div key={i} className="ast-col-md-3 ast-flex job-col">
                <div className="job-div">
                  <div className="job-inner-div">
                    <div className="comp-logo-div">
                      <img className="comp-logo" src={job.logo} alt={job.alt} />
                    </div>
                    <p className="apply-now-tag">
                      <span>Apply Now</span>
                    </p>
                    <h5 className="job-title" {...raw(job.title)} />
                    <div className="features-div">
                      <p className="job-comp-name">
                        <img src={`${o}/wp-content/uploads/2022/05/company-name-icon-removebg-preview.png`} />
                        <span {...raw(job.company)} />
                      </p>
                      <p className="job-location">
                        <img src={`${o}/wp-content/uploads/2022/05/location_icon-removebg-preview.png`} />
                        <span {...raw(job.location)} />
                      </p>
                      <p className="job-salary">
                        <img src={`${o}/wp-content/uploads/2022/05/money_icon-removebg-preview.png`} />
                        <span {...raw(job.salary)} />
                      </p>
                      <h6 className="job-type">
                        <span {...raw(job.type)} />
                      </h6>
                    </div>
                  </div>
                  <div className="learn-more-btn">
                    <a href={job.link}>
                      <span>Learn More</span>
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="section tefl-courses-internship-job-section">
        <div className="ast-row tefl-courses-internship-job-row">
          {d.other_links.map((e, i) => (
            <div key={i} className="ast-col-md-4 tefl-courses-col">
              <div className="col-div tefl-courses-div">
                <h5 className="col-heading" {...raw(e.title)} />
                <p className="content" {...raw(e.content)} />
                <img src={e.image} />
                <div className="btn-div">
                  <a className="btn btn-primary" href={e.link} {...raw(e.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick links Section */}
      <div className="section tefl-courses-internship-job-section">
        <div className="ast-row tefl-courses-internship-job-row">
          <QuickLink
            heading="TEFL courses"
            content="Become a confident, qualified English teacher with flexible online, classroom or mixed learning."
            img={`${o}/wp-content/uploads/2022/04/online-g3b2301855_1920.jpg`}
            href="/tefl-courses"
            cta="View our Tefl Courses"
          />
          <QuickLink
            heading="TEFL internship"
            content="With accommodation, training and full in-country support sorted – it’s the hassle-free way to kick-start your TEFL career."
            img={`${o}/wp-content/uploads/2022/03/road-g33f30ef59_1920.jpg`}
            href="/tefl-internships"
            cta="View our internships"
          />
          <QuickLink
            heading="TEFL jobs"
            content="Check out new TEFL job listings on our sister company’s well-stocked jobs board."
            img={`${o}/wp-content/uploads/2022/04/classroom-2093744_1920.jpg`}
            href="https://jobs.teflinstitute.com/?ref=ticom"
            cta="view TEFL jobs"
          />
        </div>
      </div>
    </div>
  );
}

function FeaturePoints({ points }: { points: { title: string; content: string }[] }) {
  return (
    <ul className="living-cost-features">
      {points.map((p, i) =>
        p.title && p.content ? <li key={i} className="feature-point" {...raw(`<b>${p.title}: </b>${p.content}`)} /> : null,
      )}
    </ul>
  );
}

function QuickLink({ heading, content, img, href, cta }: { heading: string; content: string; img: string; href: string; cta: string }) {
  return (
    <div className="ast-col-md-4 tefl-courses-col">
      <div className="col-div tefl-courses-div">
        <h5 className="col-heading">{heading}</h5>
        <p className="content">{content}</p>
        <img src={img} />
        <div className="btn-div">
          <a className="btn btn-primary" href={href}>
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
}
