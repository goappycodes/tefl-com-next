/**
 * Country TEFL course page — native port of the theme's
 * ti-page-country-course-template.php (e.g. /tefl-course-azerbaijan/).
 *
 * Same markup as the PHP template, so the theme's scripts keep driving the
 * accordions, the course-details tabs + "read more", the Splide photo gallery
 * and the Glide instructors slider. The template leaves
 * `.accreditation-section__body` open until `</section>`; this renders the tree
 * the browser builds from that. Data: wordpress/headless/native/ti-page-country-course-template.php.
 */
import { FaqJsonLd, H, type Faq, type OverviewsBase } from "./shared";

interface Pair {
  section_title: string;
  section_summary: string;
}

export interface CountryCourseData extends OverviewsBase {
  hero: { image: string; title: string; text: string; btn1_text: string; btn1_link: string; btn2_text: string; btn2_link: string };
  accreditation: {
    title: string;
    summary: string;
    ofqual_img: string;
    ofqual_content: string;
    logos: { img: string; title: string; subtitle: string; link: string }[];
  } | null;
  why: { title: string; summary: string; faqs: { q: string; a: string }[]; btn_link: string; btn_text: string } | null;
  tabs:
    | {
        title: string;
        content_title: string;
        extra: string;
        content: string;
        faqs: Faq[] | null;
        accordion: { title: string; subtitle: string; content: string }[] | null;
      }[]
    | null;
  about: { title: string; summary: string; cta_img: string; cta_text: string; cta_link: string } | null;
  employer: Pair | null;
  gallery: string[] | null;
  teacher: Pair | null;
  banner: { text: string; image: string } | null;
  overview: {
    title: string;
    summary: string;
    cta_image: string;
    features: { icon: string; title: string }[];
    btn_text: string;
    btn_link: string;
  } | null;
  team: { title: string; summary: string; image: string } | null;
  instructors: { image: string; name: string; designation: string }[] | null;
}

export default function CountryCourse({ data }: { data: CountryCourseData }) {
  const { hero, accreditation: acc, why, tabs, about, employer, gallery, teacher, banner, overview, team, instructors } = data;

  return (
    <div id="primary" className="content-area primary">
      <section className="hero-banner-section section-padding" style={{ backgroundImage: `url('${hero.image}')` }}>
        <div className="ast-container">
          <div className="ast-row ast-flex">
            <div className="ast-col-md-6">
              <div className="hero-banner__content">
                <div className="hero-banner__heading">
                  <H as="h1" className="page-title__main large-heading" html={hero.title} />
                </div>
                <H className="hero-banner__summary" html={hero.text} />
                <div className="banner-cta-buttons">
                  <H as="a" href={hero.btn1_link} className="banner-btn enrol-btn" html={hero.btn1_text} />{" "}
                  <H as="a" href={hero.btn2_link} className="banner-btn learn-more-btn" html={hero.btn2_text} />
                </div>
              </div>
            </div>
            <div className="ast-col-md-6" />
          </div>
        </div>
      </section>

      {acc ? (
        <section className="accreditation-section section-padding-top">
          <div className="ast-container">
            <div className="ast-row ">
              <div className="ast-col-md-12">
                <H as="p" className="section-title text-center" html={acc.title} />
                <H className="accreditation-section__summary text-center" html={acc.summary} />

                <div className="accreditation-section__body">
                  <div className="ofqual-section">
                    {acc.ofqual_img ? <img src={acc.ofqual_img} /> : null}
                    {acc.ofqual_content ? <H html={acc.ofqual_content} /> : null}
                  </div>
                  <div className="accreditation-section__logos">
                    {acc.logos.map((l, i) => (
                      <div key={i} className="item">
                        <div className="image-box">
                          <a href={l.link} target="_blank">
                            <img src={l.img} />
                          </a>
                        </div>
                        <div className="image-text">
                          <H as="h5" html={l.title} />
                          <H as="h6" html={l.subtitle} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {why ? (
        <section className="why-choose-section section-padding">
          <div className="ast-container">
            <div className="why-choose-section__row">
              <div className="ast-row">
                <div className="ast-col-md-12">
                  <H as="h2" className="section-title" html={why.title} />
                  <H className="section-summary" html={why.summary} />
                  <div className="accordion-container">
                    {why.faqs.map((f, i) => (
                      <div key={i} className="accordion">
                        <div className="accordion-heading">
                          <H as="p" className="accordion-title" html={f.q} />
                          <i className="fa fa-plus" />
                        </div>
                        <div className="accordion-content">
                          <H className="accordion-body" html={f.a} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <H as="a" href={why.btn_link} className="cta-btn" html={why.btn_text} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {tabs ? (
        <section className="course-details-section section-padding-bottom">
          <div className="ast-container">
            <div id="tabs-section" className="tabs ast-row">
              <div className="ast-col-md-6 tab-wrapper">
                <ul className="tab-head">
                  {tabs.map((t, key) => (
                    <li key={key}>
                      <a href={`#tab-${key + 1}`} className={`tab-link ${key === 0 ? "active" : ""}`}>
                        <H as="span" className="tab-label" html={t.title} />
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
                      <H as="p" className="tab-body__title large-heading" html={t.content_title} />
                      {t.faqs ? (
                        <div className="tab-body__content--faq">
                          <FaqJsonLd faqs={t.faqs} />
                          {t.faqs.map((f, i) => (
                            <div key={i} className="tab-faq">
                              <H as="p" className="tab-faq__question" html={f.q_html} />
                              <H className="tab-faq__answer" html={f.a_html} />
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <H className="tab-body__content--main" html={t.content} />
                      {t.extra !== "faq-content" ? (
                        <div className="tab-body__content--extra">
                          {t.accordion ? (
                            <ul className="tab-body__content--accordion">
                              {t.accordion.map((a, k) =>
                                a.content ? (
                                  <li key={k}>
                                    <input type="checkbox" name={`faq-trigger-${k}`} defaultChecked={k === 0} />
                                    <i />
                                    <p className="faq-drawer__title">
                                      <H as="span" className="faq-drawer__title--sub" html={a.subtitle} />{" "}
                                      <H as="span" className="faq-drawer__title--main" html={a.title} />
                                    </p>
                                    <div className="faq-drawer__content-wrapper">
                                      <H className="faq-drawer__content" html={a.content} />
                                    </div>
                                  </li>
                                ) : (
                                  <H key={k} as="p" className="accordion-header" html={a.title} />
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
                      <span>read more</span> <i className="fa fa-angle-down" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {about ? (
        <section className="about-section section-padding-bottom">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-6">
                <div className="about-section__left">
                  <H as="p" className="section-title" html={about.title} />
                  <H className="about-section__summary" html={about.summary} />
                </div>
              </div>
              <div className="ast-col-md-6">
                <div className="about-section-right">
                  <img src={about.cta_img} alt="" /> <H as="a" href={about.cta_link} target="_blank" className="cta-btn" html={about.cta_text} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {employer ? (
        <section className="employer-verification-section section-padding-bottom">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <div className="employer-verification-section__body">
                  <H as="p" className="section-title" html={employer.section_title} />
                  <H className="employer-verification-section__summary" html={employer.section_summary} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {gallery ? (
        <section className="gallery-section section-padding-bottom">
          <div className="splide photo-gallery" aria-label="photo-gallery">
            <div className="splide__track">
              <ul className="splide__list">
                {gallery.map((img, i) => (
                  <li key={i} className="splide__slide">
                    <img data-lity="" className="slide-imag no-lazy" src={img} alt="" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {teacher ? (
        <section className="teacher-section section-padding-bottom">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <div className="teacher-section__left">
                  <H as="p" className="section-title" html={teacher.section_title} />
                  <H className="teacher-section__summary" html={teacher.section_summary} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {banner ? (
        <section className="full-width-banner-section section-padding" style={{ background: `url('${banner.image}')` }}>
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <H className="full-width-banner-section__text" html={banner.text} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {overview ? (
        <section className="course-overview-section section-padding">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-4">
                <div className="course-overview__cta">
                  <img src={overview.cta_image} alt="" className="course-overview__cta-image" />
                  <div className="course-overview__cta-content">
                    <div className="cta-features">
                      {overview.features.map((f, i) => (
                        <div key={i} className="cta-feature">
                          <img src={f.icon} alt="" /> <H as="span" html={f.title} />
                        </div>
                      ))}
                    </div>
                    <img src={`${data.origin}/wp-content/uploads/2025/05/Group-3.svg`} alt="" className="cta-rating-image" />{" "}
                    <H as="a" href={overview.btn_link} className="cta-btn" html={overview.btn_text} />
                  </div>
                </div>
              </div>
              <div className="ast-col-md-8">
                <div className="course-overview__content">
                  <H as="p" className="section-title" html={overview.title} />
                  <H className="course-overview__summary" html={overview.summary} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {team ? (
        <section className="team-section section-padding-bottom">
          <div className="ast-container">
            <div className="ast-row ast-flex">
              <div className="ast-col-md-6">
                <div className="team-section__content">
                  <H as="p" className="section-title" html={team.title} />
                  <H className="team-section__summary" html={team.summary} />
                </div>
              </div>
              <div className="ast-col-md-6">
                <div className="team-section__image">
                  <img src={team.image} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {instructors ? (
        <section className="instructors-info-section section-padding-bottom">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <div className="instructors-info-section__instructors">
                  <div className="glide instructors-glide">
                    <div className="glide__track" data-glide-el="track">
                      <ul className="glide__slides">
                        {instructors.map((ins, i) => (
                          <li key={i} className="glide__slide">
                            <div className="instructor-card">
                              <img src={ins.image} alt="" className="instructor-card__image no-lazy" />
                              <H as="h4" className="instructor-card__name" html={ins.name} />
                              <H as="span" className="instructor-card__designation" html={ins.designation} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glide__arrows" data-glide-el="controls">
                      <a className="glide__arrow glide__arrow--left" data-glide-dir="<">
                        <i className="fa fa-angle-left" />
                      </a>{" "}
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
    </div>
  );
}
