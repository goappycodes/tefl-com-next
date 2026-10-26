/**
 * City course page — native port of the theme's single-country-page.php page
 * template and its template-parts/country-page/section-*.php parts (styled by
 * single-country-page.css + ti-homepage-2023.css).
 *
 * The review slider (slick-slider.js) and the FAQ accordion (ti-homepage-2023.js)
 * come from the theme's shared scripts, which still run over this static markup.
 * Where a WYSIWYG value sits inside a <p> (nested paragraphs on live), the
 * enclosing <div> is written as HTML so the browser parses it as on live.
 */
import { attr, raw } from "./html";
import type { CountryPageData } from "./types";

export default function CountryPage({ d }: { d: CountryPageData }) {
  return (
    <div id="primary" className="content-area primary">
      <Hero d={d} />
      {d.about ? <About about={d.about} /> : null}
      {d.reviews ? <Reviews d={d} /> : null}
      <Details d={d} />
      <AfterCourse d={d} />
      <ExploreCourse d={d} />
      {d.accreditation ? <Accreditation a={d.accreditation} /> : null}
      <Faq d={d} />
    </div>
  );
}

function Hero({ d }: { d: CountryPageData }) {
  const h = d.hero;
  return (
    <>
      <div className="has-overlay hero-section" style={{ backgroundImage: `url('${h.background}')` }}>
        <div className="ast-container">
          <div className="section-inner">
            <h1
              className="hero-heading"
              style={{ color: h.color, margin: 0 }}
              {...raw(`<img src="${attr(`${d.theme}/assets/images/Layer_1.svg`)}" alt="Hero Logo" class="hero-logo" /> ${h.heading}`)}
            />
          </div>
        </div>
      </div>
      <section className="accreditation-section secondary-bg">
        <div className="ast-container">
          <div className="accreditation-partner-container">
            <div className="accreditation-box">
              <span className="label">Our accreditation partners</span>
              <div className="logos">
                {h.partners.map((p, i) => (
                  <img key={i} src={p} alt="Partner Logo" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function About({ about }: { about: NonNullable<CountryPageData["about"]> }) {
  return (
    <section className="about-section secondary-bg">
      <div className="ast-container">
        <div className="about-container">
          <div
            className="about-content ptb-50"
            {...raw(`<h2 class="about-heading">${about.heading}</h2><p class="about-description">${about.description}</p>`)}
          />
          <div className="about-image-container image-wrapper">
            <img className="about-image" src={about.image} alt="About Image" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews({ d }: { d: CountryPageData }) {
  return (
    <section id="tefl_reviews" className="reviews ptb-50 secondary-bg">
      <div className="ast-container">
        <div className="section-inner">
          <div className="tefl-slider-wrapper width-md">
            <div className="tefl-slider-review">
              {(d.reviews ?? []).map((r, i) =>
                r.show ? (
                  <div key={i} className="tefl-review">
                    <div className="client-review">
                      {r.photo ? (
                        <div className="client-photo">
                          <img src={r.photo} alt={r.name_attr} className="client-img" />
                        </div>
                      ) : null}
                      <div className="client-info review-content">
                        <div className="reviewer-info">
                          <h3 className="reviewer-name font-bold m-0" {...raw(r.name)} />
                          {"- "}
                          <h6 className="client-designation font-regular m-0" {...raw(r.designation)} />
                        </div>
                        <div className="client-rating">
                          {[0, 1, 2, 3, 4].map((s) => (
                            <img key={s} src={`${d.theme}/assets/images/star.svg`} alt="Star" className="star-icon" />
                          ))}
                          <div className="review-days">
                            <span className="font-regular">16 days ago</span>
                          </div>
                        </div>
                        <div className="client-review" {...raw(r.review)} />
                      </div>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  card,
  titleClass,
  color,
}: {
  card: { title: string; description: string; background: string };
  titleClass: string;
  color: string;
}) {
  return (
    <div className="exp-cta-card">
      {card.background ? (
        <div className="exp-cta-card__image-header exp-cta-card__image-header" style={{ backgroundImage: `url('${card.background}')` }}>
          <h3 className={titleClass} style={{ color }} {...raw(card.title)} />
        </div>
      ) : null}
      <div className="exp-cta-card__body">
        {card.description ? <div className="exp-cta-card__body-content" {...raw(card.description)} /> : null}
      </div>
    </div>
  );
}

function Details({ d }: { d: CountryPageData }) {
  const { why, includes, color } = d.details;
  return (
    <section id="course-details" className="secondary-bg">
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-flex">
            {why ? (
              <div className="ast-col-md-6">
                <Card card={why} titleClass="why_learner_choose_us_title" color={color} />
              </div>
            ) : null}
            {includes ? (
              <div className="ast-col-md-6">
                <Card card={includes} titleClass="why_the_course_include" color={color} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function AfterCourse({ d }: { d: CountryPageData }) {
  const a = d.after;
  return (
    <section id="after-course" className="after-course-section">
      <div className="overlay-section " style={{ backgroundImage: `url('${a.background}')` }}>
        <div className="ast-container">
          <div className="section-container">
            <h3 className="content-title" style={{ color: a.color }}>
              {a.title}
            </h3>
            <img className="title-underline" src={`${d.theme}/assets/images/vector3.svg`} alt="Underline" />
            <p className="subtitle">Once you complete the course, you can:</p>
            {a.outcomes ? (
              <ul className="course-outcome-list">
                {a.outcomes.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            ) : (
              <p>No course outcomes found.</p>
            )}
          </div>
        </div>
        <div className="torn-bottom">
          <img src={`${d.theme}/assets/images/Vector1.svg`} className="torn-left" alt="Torn Left" />
          <img src={`${d.theme}/assets/images/Vector2.svg`} className="torn-right" alt="Torn Right" />
        </div>
      </div>
    </section>
  );
}

function ExploreCourse({ d }: { d: CountryPageData }) {
  const c = d.course;
  return (
    <section id="tefl_reviews" className="reviews ptb-50 secondary-bg">
      <div className="ast-container">
        <div className="section-inner">
          <div className="tefl-review">
            <div className="client-review">
              {c.image ? (
                <div className="client-photo">
                  <img src={c.image} alt={c.name_attr} className="client-img" />
                </div>
              ) : null}
              <div className="client-info review-content course-card">
                <div className="reviewer-info">
                  <h3 className="reviewer-name font-bold m-0" {...raw(c.name)} />
                </div>
                <div className="client-review" {...raw(c.description)} />
                <div>
                  <a
                    target="_blank"
                    href={c.button_link}
                    className="btn btn-primary"
                    style={{ backgroundColor: c.button_color }}
                    {...raw(c.button_text)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Accreditation({ a }: { a: NonNullable<CountryPageData["accreditation"]> }) {
  return (
    <section id="accreditation" className="secondary-bg ptb-50">
      <div className="ast-container">
        <div>
          <h3 className="reviewer-name font-bold m-0 text-center large-heading" {...raw(a.heading)} />
          <h4 className="text-center" {...raw(a.title)} />
        </div>
        <div className="accreditations-container">
          {a.items.map((it, i) => (
            <div key={i} className="accreditation">
              <span className="accreditation-title" {...raw(`<img src="${attr(it.icon)}" alt="" class="no-lazy"> ${it.status}`)} />
              <img src={it.logo} alt="" className="no-lazy accreditation-logo" />
              <span className="font-600" {...raw(it.title)} />
            </div>
          ))}
        </div>
        <div className="accreditation-description" {...raw(`<p>${a.description}</p>`)} />
      </div>
    </section>
  );
}

function Faq({ d }: { d: CountryPageData }) {
  return (
    <section id="faq" className="faqs-section faqs-section-redesigned ptb-50">
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12 faqs">
            <h3 className="large-heading faqs-heading common-section-heading text-center">faqs</h3>
            <div className="faqs-wrapper equal-height">
              <div className="faqs-accordion">
                {d.faqs.map((f) => (
                  <div key={f.key} className={`faqs-accordion__item ${f.first ? "active" : ""}`}>
                    <input type="radio" id={`acc-${f.key}`} name="faq-accordion" defaultChecked={f.first} hidden />
                    <label className="font-700" htmlFor={`acc-${f.key}`}>
                      <span {...raw(f.question)} />
                      <i className="fa fa-plus" />
                    </label>
                    <div className={`font-400 faqs-accordion__content ${f.first ? "active" : ""}`} {...raw(f.answer)} />
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
  );
}
