/**
 * Secondary overview landing — native port of the theme's
 * ti-secondary-overview-template.php (/specialist-tefl-courses/).
 *
 * Same markup as the PHP template; the theme's timer, lity video popups and
 * FAQ accordion work on it unchanged. Data:
 * wordpress/headless/native/ti-secondary-overview-template.php.
 */
import { FaqAccordionItems, FaqJsonLd, H, type Faq, type OverviewsBase } from "./shared";

export interface SecondaryOverviewData extends OverviewsBase {
  hero: { bg: string; title: string; sub_title: string; sub_content: string } | null;
  features: { title: string; subtitle: string }[];
  explanation: { image: string; title: string; subtitle: string; content: string };
  timer: string;
  timer2?: string;
  features30: string[];
  courses30: {
    icon: string;
    title: string;
    price: string;
    duration: string;
    features: string[] | null;
    buy: string;
    link: string;
    study_time: string;
  }[];
  ctas:
    | {
        course: string;
        image: string;
        icon: string;
        title: string;
        price: string;
        summary: string;
        title_icon: string;
        btn_text: string;
        btn_link: string;
      }[]
    | null;
  videos: { image: string; name: string; link: string }[];
  quote: { image: string; title: string; sub_content: string; footer_title: string; footer_subtitle: string };
  posts: { image: string; title: string; subtitle: string; summary: string; btn: string }[];
  faqs: Faq[];
}

const FEATURE_LABELS = [
  "Personal Tutor Support",
  "Internationally Recognized Cert",
  "100% Online Learning",
  "247 Study Access & App",
  "Tefl job Service",
];

export default function SecondaryOverview({ data }: { data: SecondaryOverviewData }) {
  const o = data.origin;
  const { hero, explanation: ex, quote } = data;

  const featuresColumn = (
    <div className="features-div">
      {data.features30.map((f, key) => (
        <H key={key} className={`feat-${key + 1}`} html={f} />
      ))}
    </div>
  );

  return (
    <div id="primary" className="content-area primary">
      {hero ? (
        <section className="hero-banner-section" style={{ background: `url(${hero.bg})` }}>
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-6">
                <div className="hero-banner-section__content">
                  <H as="h1" className="hero-banner-title mt-1 mb-1" html={hero.title} />
                  <H className="hero-banner-subtitle mb-2" html={hero.sub_title} />
                  <H className="hero-banner-section__content-summary mt-1" html={hero.sub_content} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="ast-container">
        <div className="ast-row">
          <div className="features section-top">
            {data.features.map((e, i) => (
              <div key={i} className="ast-col-md-3 ast-col-xs-12">
                <div className="features-inner">
                  <img src={`${o}/wp-content/uploads/2023/08/Group-1.svg`} />
                  <div className="feature">
                    <H className="title" html={e.title} />
                    <H className="subtitle" html={e.subtitle} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12 explanation">
            <div className="image" style={{ backgroundImage: `url('${ex.image}')` }} />
            <div className="explanation-inner">
              <H className="title mb-1" html={ex.title} />
              <H className="subtitle mb-1" html={ex.subtitle} />
              <H className="content" html={ex.content} />
            </div>
          </div>
        </div>
      </div>

      <section className="specialists-tefl-course section-top">
        <div className="ast-container">
          <div className="ast-row ">
            <div className="ast-col-md-12">
              <h2 className="course-title">Specialist TEFL Courses</h2>
            </div>
            <div className="ast-col-md-12">
              <div className="specialist-courses">
                <div className="ast-col-md-3">
                  <H className="clock-sidebar" html={data.timer} />
                  {featuresColumn}
                </div>

                {data.courses30.map((c, index) => (
                  <Course30 key={index} course={c} index={index} timer2={data.timer2} featuresColumn={featuresColumn} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {data.ctas ? (
        <section className="courses-cta-section">
          <div className="ast-container">
            {data.ctas.map((c, key) => (
              <div key={key} className={`${c.course} course-cta-section__row ${(key + 1) % 2 === 0 ? "even-row" : "odd-row"}`}>
                <div className="ast-row ast-flex">
                  <div className="ast-col-md-7">
                    <div className="cta-image" style={{ background: `url('${c.image}')` }}>
                      <img className="cta-icon" src={c.icon} alt="" />
                    </div>
                  </div>
                  <div className="ast-col-md-5">
                    <div className="cta-content">
                      <div className="cta-content__title">
                        <H as="h3" html={c.title} />
                        {c.title_icon ? <img src={c.title_icon} alt="" /> : null}
                      </div>
                      <H className="cta-course-price" html={c.price} />
                      <H className="cta-content__summary" html={c.summary} />
                      <H as="a" href={c.btn_link} className="course-cta-btn" html={c.btn_text} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="tefl-course-video-section">
        <div className="ast-container">
          <div className="ast-row">
            {data.videos.map((v, i) => (
              <div key={i} className="ast-col-md-6">
                <div className="video-sectio-col">
                  <div className="video-play-container">
                    <div className="video-section-image">
                      <img src={v.image} />
                    </div>
                    <div className="video-btn video-play-btn">
                      <a href={v.link} data-lity="">
                        <img src={`${o}/wp-content/uploads/2023/08/Group-7.png`} />
                      </a>
                    </div>
                  </div>
                  <div className="video-description-section">
                    <H className="video-description-section--author-name" html={v.name} />
                    <div className="video-description-section--institute-name">TEFL Institute Graduate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quote section-top">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <div className="quote-wrapper" style={{ background: `url(${quote.image})` }}>
                <div className="ast-col-md-6 quote-inner">
                  <H className="quote-title" html={quote.title} />
                  <H className="quote-sub-content" html={quote.sub_content} />
                  <H className="content-footer-title" html={quote.footer_title} />
                  <H className="content-footer-subtitle" html={quote.footer_subtitle} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="post-content-sections">
        <div className="ast-container">
          <div className="ast-row">
            {data.posts.map((p, index) => {
              const btn = (
                <a className="content-btn btn-primary w-50" href={p.btn}>
                  <span>Learn More</span> <i className="fa fa-angle-right" />
                </a>
              );
              const img = <div className="post-img" style={{ background: `url('${p.image}')` }} />;
              return index % 2 === 0 ? (
                <div key={index} className={`post-wrapper post-wrapper-${index + 1}`}>
                  <div className="ast-col-md-6 ast-col-xs-12">{img}</div>

                  <div className="ast-col-md-6 ast-col-xs-12">
                    <div className="post-content equal-height">
                      <H className="content-title" html={p.title} />
                      <H className="content-subtitle" html={p.subtitle} />
                      <H className="content-summary mb-1" html={p.summary} />
                      {btn}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={index} className={`post-wrapper post-wrapper-${index + 1}`}>
                  <div className="ast-col-md-6">
                    <div className="post-content equal-height">
                      <H className="content-title" html={p.title} />
                      <H className="content-subtitle" html={p.subtitle} />
                      <div className="content-summary" />
                      {btn}
                    </div>
                  </div>

                  <div className="ast-col-md-6">{img}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="faqs-section full-width has-bg section-padding-bottom section-top">
        <FaqJsonLd faqs={data.faqs} />
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <div className="faqs-section__row">
                <h2 className="large-heading common-section-heading">New To TEFL – Before You Start</h2>
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
    </div>
  );
}

function Course30({
  course: c,
  index,
  timer2,
  featuresColumn,
}: {
  course: SecondaryOverviewData["courses30"][number];
  index: number;
  timer2?: string;
  featuresColumn: JSX.Element;
}) {
  return (
    <>
      <div className="ast-col-md-3 ast-col-xs-12 ">
        <div className="specialist-courses-inner">
          <div className="course-icon">
            <img src={c.icon} alt="icon" />
          </div>
          <H className="course-heading" html={c.title} />
          <H className="course-price" html={`${c.price} `} />
          <H className="course-duration" html={c.duration} />

          {c.features ? (
            <div className="features-div-icons">
              {c.features.map((v, i) => (
                <H key={i} className={`feat-${i + 1}`} html={`<span>${FEATURE_LABELS[i].replace("&", "&amp;")}</span>\n${v}`} />
              ))}
            </div>
          ) : null}
          <div className="buy-now-div">
            <a className=" btn btn-small" href={c.buy}>
              Buy Now
            </a>
          </div>
          <div className="learn-more-div">
            <a className="btn btn-small" href={c.link}>
              Learn More
            </a>
          </div>

          <H className="access-time-div" html={c.study_time} />
        </div>
      </div>
      {index === 2 ? (
        <div className="ast-col-md-3">
          <H className="clock-sidebar" style={{ visibility: "hidden" }} html={timer2 ?? ""} />
          {featuresColumn}
        </div>
      ) : null}
    </>
  );
}
