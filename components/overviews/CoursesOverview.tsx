/**
 * Courses overview — native port of the theme's ti-courses-overview-template.php
 * ("Courses Overview Template 2023", /tefl-courses-overview/).
 *
 * Same markup as the PHP template (the theme CSS and its scripts — tab menu,
 * offer timer, "Show More Faqs" — work on it unchanged). Where the template
 * leaves a `<span>` open before `</div>`, this renders the tree the browser
 * builds from it. Data: wordpress/headless/native/ti-courses-overview-template.php.
 */
import { EMPTY_STYLE, FaqAccordionItems, FaqJsonLd, H, Spaced, type Faq, type OverviewsBase } from "./shared";

interface Course {
  bg: string;
  icon: string;
  title: string;
  completion: string;
  link: string;
  guide: string;
  price: string;
  has_features: boolean;
  feature_title: string;
  includes: string[];
  excludes: string[];
  deposit: { icon: string; title: string; description: string } | null;
  freebies: { icon: string; text: string }[];
}

interface Group {
  title: string;
  summary: string;
  courses: Course[];
}

interface CtaBox {
  title: string;
  bg: string;
  summary: string;
  link_text: string;
  link_url: string;
}

export interface CoursesOverviewData extends OverviewsBase {
  p82988: boolean;
  hero: {
    bg: string;
    show_cta: boolean;
    title: string;
    summary: string;
    btn_text: string;
    btn_link: string;
    has_logo: boolean;
    logo: string;
  } | null;
  offer: {
    page_id: number;
    title: string;
    timer_header: string;
    timer: string;
    btn_text: string;
    btn_link: string;
    gifts: string[];
  } | null;
  courses: {
    title: string;
    tabs: string[];
    tab_hrefs: string[];
    tab_ids: string[];
    cta_cards: { icon: string; title: string; summary: string; link: string; link_text: string }[];
    accredited: Group;
    more_accredited: Group;
    level5: Group;
    elt_box: CtaBox | null;
    virtual_box: CtaBox | null;
    hybrid: Group;
    note: { image: string; title: string; content: string; link_text: string } | null;
    specialist: Group;
    l5_specialist: Group;
  } | null;
  faqs: Faq[];
}

const GRADIENT_30 = "linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))";
const GRADIENT_75 = "linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.75))";

export default function CoursesOverview({ data }: { data: CoursesOverviewData }) {
  const o = data.origin;
  const hero = data.hero;
  const offer = data.offer;
  const cs = data.courses;

  return (
    <div id="primary" className="content-area primary">
      {hero ? (
        <section className="hero-banner-section section-padding" style={{ background: `url(${hero.bg})` }}>
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-6">
                {hero.show_cta ? (
                  <div className="hero-banner-section__content">
                    <H as="h1" className="large-heading common-section-heading" html={hero.title} />
                    <H className="hero-banner-section__content-summary" html={hero.summary} />
                    <H as="a" href={hero.btn_link} className="btn btn-primary btn-centered" html={hero.btn_text} />
                  </div>
                ) : null}
              </div>
              {hero.has_logo ? (
                <div className="ast-col-md-6">
                  <div className="hero-banner-section__logo-container">
                    <img src={hero.logo} alt="" className="hero-banner-section-logo" />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {offer ? (
        <section className="offer-section d-none" data-id={offer.page_id}>
          <div className="ast-container">
            <div className="offer-section-row">
              <div className=" ast-row">
                <div className="ast-col-md-12">
                  <H
                    as="h2"
                    className="large-heading offer-section-heading common-section-heading font-500 text-center"
                    html={offer.title}
                  />
                </div>
                <div className="flex-wrapper">
                  <div className="ast-col-md-6">
                    <div className="offer-section-row__timer">
                      <H as="h2" className="text-center large-heading common-section-heading" html={offer.timer_header} />
                      <H className="offer-section-row__timer-countdown" html={offer.timer} />
                      <H as="a" href={offer.btn_link} className="btn btn-primary w-75 btn-centered" html={offer.btn_text} />
                    </div>
                  </div>
                  <div className="ast-col-md-6">
                    <div className="offer-section-row__content">
                      {offer.gifts.map((g, i) => (
                        <div key={i} className="gift">
                          <H as="span" html={g} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="acred-logo">
        <div className="ast-container">
          <div className="ast-row">
            <div className="acred-section">
              <div className="col-md-4">
                <img className="acred-img" src={`${o}/wp-content/uploads/2024/03/deac-aqc.png`} alt="" />
                <div className="acred-text">
                  <img src={`${o}/wp-content/uploads/2024/03/usa-flag-logo.png`} alt="" />
                  <h5>DEAC | AQC</h5>
                </div>
                <p className="sec-title">Curriculum Approved Centre</p>
              </div>

              <div className="col-md-4 mid-col">
                <img className="acred-img" src={`${o}/wp-content/uploads/2020/11/highfield-logo.png`} alt="" />
                <div className="acred-text">
                  <img src={`${o}/wp-content/uploads/2024/03/UK-flag.png`} alt="" />
                  <h5>Highfield(Ofqual Regulated)</h5>
                </div>
                <p className="sec-title">Center Number:21335</p>
              </div>

              <div className="col-md-4">
                <img className="acred-img" src={`${o}/wp-content/uploads/2026/09/OTCAC-logo.png`} alt="" />
                <div className="acred-text">
                  <img src={`${o}/wp-content/uploads/2024/03/UK-flag.png`} alt="" />
                  <h5>OTCAC</h5>
                </div>
                <p className="sec-title">OTCAC Online Teaching Course Accreditation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {cs ? (
        <>
          {cs.title ? (
            <section className="courses-section section-paddiing">
              <div className="ast-container">
                <div className="ast-row">
                  <div className="ast-col-md-12">
                    <H as="h2" className="large-heading text-center common-section-heading" html={cs.title} />
                    <div className="course-section-tabs">
                      <Spaced>
                        {cs.tabs.map((t, i) => (
                          <H
                            key={i}
                            as="a"
                            href={cs.tab_hrefs[i]}
                            className={`course-tab-menu-item ${i === 0 ? "active" : ""}`}
                            html={t}
                          />
                        ))}
                      </Spaced>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <section className="full-width has-bg section-padding">
            <div className="cta-section">
              <div className="ast-container">
                <div className="ast-row">
                  <div className="cta-card-wrapper">
                    {cs.cta_cards.map((card, i) => (
                      <div key={i} className="ast-col-md-4">
                        <div className="cta-card">
                          <img src={card.icon} alt="" className="cta-card__icon" />
                          <H as="h4" className="cta-card__title font-600" html={card.title} />
                          <H className="cta-card__summary" html={card.summary} />
                          <H as="a" href={card.link} className="cta-card__link" html={card.link_text} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id={cs.tab_ids[0]} className="accredited-section section-padding-top">
              <div className="ast-container">
                <div className="ast-row">
                  {cs.accredited.title ? <AccreditedRow group={cs.accredited} data={data} /> : null}
                </div>
              </div>
            </div>

            <div className="accredited-section more-accredited-section section-padding-top" style={{ display: "none" }}>
              <div className="ast-container">
                <div className="ast-row">
                  <AccreditedRow group={cs.more_accredited} data={data} />
                </div>
              </div>
            </div>

            <div id={cs.tab_ids[1]} className="level-5-diploma-courses-section section-padding-top">
              <div className="ast-container">
                <div className="ast-row">
                  <div className="level-5-diploma-courses-section__row">
                    <div className="ast-col-md-12 level_5_diploma_courses-section__header">
                      <H as="h2" className="large-heading common-section-heading text-center" html={cs.level5.title} />
                      <H
                        className="level_5_diploma_courses__header-summary courses-section__header-summary text-center"
                        html={cs.level5.summary}
                      />
                    </div>
                    <div className="ast-col-md-12  spacer-column" />
                    <div className="level_5_diploma_courses-section__body">
                      {cs.level5.courses.map((c, i) => (
                        <DiplomaCard key={i} course={c} data={data} fallbackDeposit={false} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {cs.elt_box && cs.elt_box.title ? <CtaBoxSection box={cs.elt_box} kind="elt-cta-box" /> : null}
            {cs.virtual_box && cs.virtual_box.title ? (
              <CtaBoxSection box={cs.virtual_box} kind="virtual-course-cta-box" />
            ) : null}

            <div id={cs.tab_ids[2]} className="hybrid-diploma-courses-section section-padding-top">
              <div className="ast-container">
                <div className="ast-row">
                  <div className="hybrid-diploma-courses-section__row">
                    <div className="ast-col-md-12 hybrid-diploma-courses-section__header">
                      <H as="h2" className="large-heading common-section-heading text-center" html={cs.hybrid.title} />
                      <H
                        className="hybrid-diploma-courses-section__header-summary courses-section__header-summary text-center"
                        html={cs.hybrid.summary}
                      />
                    </div>
                    <div className="ast-col-md-12 spacer-column" />
                    <div className="hybrid-diploma-courses-section__body">
                      {cs.hybrid.courses.map((c, i) => (
                        <DiplomaCard key={i} course={c} data={data} fallbackDeposit />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {cs.note ? (
              <div className="academic-director-note-section section-padding-top">
                <div className="ast-container">
                  <div className="ast-row">
                    <div className="ast-col-md-12">
                      <div className="academic-director-note-section__row">
                        <div className="academic-director-note-section__row-left">
                          <H as="h2" className="font-700 academic-director-note-section-heading " html={cs.note.title} />
                          <H className="academic-director-note-section-content" html={cs.note.content} />
                          {/* The template's href is `<?php $cta_link_url ?>` (no echo): always empty. */}
                          <H as="a" href="" className="btn btn-small btn-centered btn-secondary" html={cs.note.link_text} />
                        </div>
                        <div className="academic-director-note-section__row-right">
                          <img src={cs.note.image} alt="" className="academic-director-note-section-image" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {cs.specialist.title ? (
              <div id={cs.tab_ids[3]} className="specialist-courses-section section-padding-top">
                <div className="ast-container">
                  <div className="ast-row">
                    <div className="specialist-courses-section__row">
                      <SpecialistHeader group={cs.specialist} />
                      <div className="ast-col-md-12  spacer-column" />
                      <div className="specialist-courses-section__body">
                        {cs.specialist.courses.map((c, i) => (
                          <SpecialistCard key={i} course={c} index={i} origin={data.origin} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {cs.l5_specialist.title ? (
              <div className="specialist-courses-section l5-specialist-courses-section section-padding-top">
                <div className="ast-container">
                  <div className="ast-row">
                    <div className="specialist-courses-section__row">
                      <SpecialistHeader group={cs.l5_specialist} />
                      <div className="ast-col-md-12  spacer-column" />
                      <div className="specialist-courses-section__body">
                        {cs.l5_specialist.courses.map((c, i) => (
                          <L5SpecialistCard key={i} course={c} index={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      {data.faqs.length ? (
        <section className="faqs-section full-width has-bg section-padding-bottom">
          <FaqJsonLd faqs={data.faqs} />
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <div className="faqs-section__row">
                  <h2 className="large-heading common-section-heading">FAQS</h2>
                  <div className="faqs-section__row-body">
                    <div className="faqs-accordion">
                      <FaqAccordionItems faqs={data.faqs} />
                    </div>
                    <div className="show-more-faqs">
                      <span>Show More Faqs</span>
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

/** `.accredited-section__row` — the accredited and "more accredited" groups. */
function AccreditedRow({ group, data }: { group: Group; data: CoursesOverviewData }) {
  return (
    <div className="accredited-section__row">
      <div className="ast-col-md-12 accredited-section__header">
        <H as="h2" className="large-heading common-section-heading text-center" html={group.title} />
        <H className="accredited-section__header-summary courses-section__header-summary text-center" html={group.summary} />
      </div>
      <div className="ast-col-md-12  spacer-column" />
      <div className="accredited-section__body">
        {group.courses.map((c, i) => (
          <div key={i} className="ast-col-md-6">
            <div className="course-card">
              <div className="course-card__top" style={{ background: `${GRADIENT_30}, url('${c.bg}')` }}>
                <div className="course-card__top-icon text-center">
                  <img src={c.icon} alt="" />
                </div>
                <FastTrack origin={data.origin} />
                <div className="course-card__top-content">
                  <H as="h4" className="course-title text-center font-600" html={c.title} />
                  <H className="course-price-html" html={c.price} />
                  <CompletionTime course={c} className="text-center course-completion-time" />
                  <a target="_blank" href={c.guide} className="course-cta-btn btn btn-primary btn-centered ">
                    download guide
                  </a>
                </div>
              </div>
              <CardBottom course={c} data={data} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The level 5 / hybrid diploma cards (deposit ribbon; hybrid falls back to "Fast Track"). */
function DiplomaCard({ course: c, data, fallbackDeposit }: { course: Course; data: CoursesOverviewData; fallbackDeposit: boolean }) {
  return (
    <div className="ast-col-md-6">
      <div className="course-card">
        <div className="course-card__top" style={{ background: `${GRADIENT_30}, url('${c.bg}')` }}>
          <div className="course-card__top-icon text-center">
            <img src={c.icon} alt="" />
          </div>
          {c.deposit ? (
            <div className="fast-track-course deposit-info ast-flex ast-align-items-center">
              <div className="depoist-info__icon">
                <img src={c.deposit.icon} alt="" />
              </div>
              <div className="ast-flex flex-direction-column deposit-info__details">
                <H as="h5" className="deposit-info_title" html={c.deposit.title} />
                <H className="deposit-info_description" html={c.deposit.description} />
              </div>
            </div>
          ) : fallbackDeposit ? (
            <FastTrack origin={data.origin} />
          ) : null}
          <div className="course-card__top-content">
            <H as="h4" className="course-title text-center font-600" html={c.title} />
            <H className="course-price-html" html={c.price} />
            <CompletionTime course={c} className="text-center course-completion-time" />
            {data.p82988 ? (
              <a href={c.link} className="course-cta-btn btn btn-primary btn-centered">
                learn more
              </a>
            ) : null}
            <a
              target="_blank"
              href={c.guide}
              className="course-cta-btn btn btn-primary btn-centered"
              {...(data.p82988 ? { style: { backgroundColor: "#daab37" } } : EMPTY_STYLE)}
            >
              download guide
            </a>
          </div>
        </div>
        <CardBottom course={c} data={data} freebies />
      </div>
    </div>
  );
}

function FastTrack({ origin }: { origin: string }) {
  return (
    <div className="fast-track-course deposit-info ast-flex ast-align-items-center">
      <div className="depoist-info__icon">
        <img src={`${origin}/wp-content/uploads/2023/07/fasttrack.svg`} alt="" />
      </div>
      <div className="ast-flex flex-direction-column deposit-info__details">
        <h5 className="deposit-info_title">Fast Track</h5>
        <div className="deposit-info_description">Get access to entry-level jobs. Qualify to teach at home &amp; abroad.</div>
      </div>
    </div>
  );
}

/** "Completion Time" + the template's unclosed `<span>` (closed by the following `</div>`). */
function CompletionTime({ course, className }: { course: Course; className: string }) {
  return (
    <div className={className}>
      <span className="font-600">Completion Time</span> <H as="span" html={course.completion} />
    </div>
  );
}

function Features({ course, origin }: { course: Course; origin: string }) {
  return (
    <div className="course-card__bottom-content features">
      {course.includes.map((f, i) => (
        <H
          key={`i${i}`}
          className="feature-include"
          html={`<img src="${origin}/wp-content/uploads/2023/07/check.svg" alt="" class="check-icon">${f}`}
        />
      ))}
      {course.excludes.map((f, i) => (
        <H
          key={`e${i}`}
          className="feature-exclude"
          html={`<img src="${origin}/wp-content/uploads/2023/07/cross_muted.svg" alt="" class="cross-icon">${f}`}
        />
      ))}
    </div>
  );
}

function CardBottom({ course: c, data, freebies = false }: { course: Course; data: CoursesOverviewData; freebies?: boolean }) {
  return (
    <div className="course_card__bottom" {...(data.p82988 ? { style: { display: "none" } } : EMPTY_STYLE)}>
      <H as="h3" className="course-card__bottom-title text-center font-600" html={c.feature_title} />
      <Features course={c} origin={data.origin} />
      {freebies && c.freebies.length ? (
        <div className="course-card-freebies">
          {c.freebies.map((f, i) => (
            <div key={i} className="course-freebie">
              <img src={f.icon} className="course-freebie__icon" /> <H as="span" className="course-freebie__text font-500" html={f.text} />
            </div>
          ))}
        </div>
      ) : null}
      <a href={c.link} className="course-cta-btn btn btn-primary btn-centered">
        learn more
      </a>
    </div>
  );
}

function CtaBoxSection({ box, kind }: { box: CtaBox; kind: "elt-cta-box" | "virtual-course-cta-box" }) {
  return (
    <div className={`${kind} section-padding-top`}>
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12">
            <div className={`${kind}-wrapper`} style={{ background: `${GRADIENT_75}, url('${box.bg}')` }}>
              <H as="h2" className={`font-400 text-center large-heading ${kind}__title`} html={box.title} />
              <H className={`font-300 ${kind}__summary`} html={box.summary} />
              <a href={box.link_url} className={`btn btn-white-small ${kind}-btn`}>
                <H as="span" html={box.link_text} /> <i className="fa fa-angle-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecialistHeader({ group }: { group: Group }) {
  return (
    <div className="ast-col-md-12 hybrid-diploma-courses-section__header">
      <H as="h2" className="large-heading common-section-heading text-center" html={group.title} />
      <H className="specialist-courses-section__header-summary courses-section__header-summary text-center" html={group.summary} />
    </div>
  );
}

function SpecialistBody({ course: c }: { course: Course }) {
  return (
    <>
      <div className="course-card--specialist__header" style={{ background: `${GRADIENT_30}, url('${c.bg}')` }}>
        <img src={c.icon} alt="" />
      </div>
      <div className="coursec-card--specialist__body">
        <H as="h4" className="course-title font-600" html={c.title} />
        <H className="course-price-html" html={c.price} />
        <CompletionTime course={c} className="course-completion-time" />
        <a href={c.link} className="course-cta-btn btn btn-primary btn-centered ">
          learn more
        </a>
      </div>
    </>
  );
}

function SpecialistCard({ course: c, index, origin }: { course: Course; index: number; origin: string }) {
  return (
    <>
      <div className="ast-col-md-6">
        <div className="course-card">
          <div className="course-card--specialist">
            <SpecialistBody course={c} />
          </div>
          {c.has_features ? (
            <div className="course_card__bottom">
              <H as="h3" className="course-card__bottom-title text-center font-600" html={c.feature_title} />
              <Features course={c} origin={origin} />
              <a href={c.link} className="course-cta-btn btn btn-primary btn-centered">
                learn more
              </a>
            </div>
          ) : null}
        </div>
      </div>
      {index === 1 ? <div className="ast-col-md-12 spacer-column" /> : null}
    </>
  );
}

function L5SpecialistCard({ course: c, index }: { course: Course; index: number }) {
  return (
    <>
      <div className="ast-col-md-4">
        <div className="course-card--specialist">
          <SpecialistBody course={c} />
        </div>
      </div>
      {index === 2 ? <div className="ast-col-md-12 spacer-column" /> : null}
    </>
  );
}
