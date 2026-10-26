/**
 * Internship sale landing pages — native port of the theme's
 * january-internships-sale.php (january-tefl-internships-sales) and its twin
 * internship-black-friday-landing-page.php (black-friday-internship-mega-sale),
 * which differ only in the gift columns (`variant`).
 *
 * Same markup as the PHP: hero / countdown / gifts (JanTop), internship
 * cards, video testimonials (lity), Business Reviews Bundle slider and the
 * two CTA cards, then the template's image-height script (jQuery ready).
 */
import JanTop from "./JanTop";
import { INTERNSHIP_HEIGHTS } from "./scripts";
import { ih, InlineScript } from "./shared";
import type { InternshipSaleData } from "./types";

export default function InternshipSale({ d, variant }: { d: InternshipSaleData; variant: "internships" | "internship-bf" }) {
  return (
    <>
      <div id="primary" className={d.primary_class}>
        <JanTop top={{ hero: d.hero, timer: d.timer, gifts: d.gifts, origin: d.origin }} gifts={variant} />

        {d.internships ? (
          <section className="sales-internship-section py-50">
            {d.internships.map((c, i) => (
              <div key={i} className="ast-container internship-container">
                <div className="ast-row internship-header-row">
                  <div className="ast-col-md-12">
                    <h2 className="internship__header text-center" dangerouslySetInnerHTML={ih(c.title)} />
                    <span className="d-block internship__subheader text-center" dangerouslySetInnerHTML={ih(c.subheader)} />
                  </div>
                </div>
                <div className="ast-row internship-details-row">
                  <div className="ast-col-md-6">
                    <div className="internship-details-row__left">
                      {c.percentage !== null ? (
                        <div
                          className="internship-discount discount"
                          dangerouslySetInnerHTML={ih(`\n<span>${c.percentage}%</span>\nDiscount\n`)}
                        />
                      ) : null}
                      <img src={c.image} alt="" className="internship__image" />
                      <div className="internship__price text-center" dangerouslySetInnerHTML={ih(c.price)} />
                    </div>
                  </div>
                  <div className="ast-col-md-6">
                    <div className="internship-details-row__right text-center">
                      <img src={c.logo} alt="" className="internship__logo" />
                      <h6 className="internship__title" dangerouslySetInnerHTML={ih(c.title)} />
                      <ul className="internhsip_features">
                        {c.features.map((f, j) => (
                          <li key={j} className="internship-feature" dangerouslySetInnerHTML={ih(f)} />
                        ))}
                      </ul>
                    </div>
                    {c.stock !== null ? (
                      <div className="internship_slots text-center" dangerouslySetInnerHTML={ih(`\n${c.stock} Spaces available \n`)} />
                    ) : null}
                  </div>
                </div>
                <div className="ast-row internships-button-row">
                  <div className="ast-col-md-4">
                    <a href={c.link} className="btn btn-red">
                      <span dangerouslySetInnerHTML={ih(c.buy_now)} />
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                  <div className="ast-col-md-4">
                    <a href={c.link} className="btn btn-white">
                      <span dangerouslySetInnerHTML={ih(c.learn_more)} />
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                  <div className="ast-col-md-4">
                    <a target="_blank" href={c.guide_link} className="btn btn-white">
                      <span>get the guide</span>
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {d.videos ? (
          <section className="video-testimoials-section py-50">
            <div className="ast-container testimonials-container">
              <div className="ast-row testimoials-section-header-row mb-2">
                <div className="ast-col-md-12">
                  <h2 className="testimoials-section__header text-center " dangerouslySetInnerHTML={ih(d.videos.title)} />
                  <span className="d-block testimoials-section__subheader text-center" dangerouslySetInnerHTML={ih(d.videos.subtitle)} />
                </div>
              </div>
              <div className="ast-row testimonials-section-content-row">
                {d.videos.items.map((t, i) => (
                  <div key={i} className="ast-col-md-4">
                    <div className="testimonial">
                      <a href={t.link} className="testimonial-link-wrapper clickbox" data-lity="" />
                      <div className="testimonial__thumbnail-container">
                        <img src={t.thumbnail} alt="" className="testimonial__thumbnail" />
                        <img src={d.videos!.play} alt="" className="testimonial-play-btn" />
                      </div>
                      <div className="testimonial__body">
                        <h4 className="testimonial__title" dangerouslySetInnerHTML={ih(t.title)} />
                        <h6 className="testimonial__subtitle" dangerouslySetInnerHTML={ih(t.subtitle)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="reviews-section py-50">
          <div className="ast-container student-reviews-container">
            <div className="ast-row student-reviews-section-header-row mb-2">
              <div className="ast-col-md-12">
                <h2 className="student-reviews__header text-center ">Verified student reviews</h2>
              </div>
            </div>
            <div className="ast-row">
              <div className="ast-col-md-12 student-reviews-section-content-row" dangerouslySetInnerHTML={ih(d.reviews)} />
            </div>
          </div>
        </section>

        {d.cta ? (
          <section className="cta-section py-50">
            <div className="ast-container cta-section-containter">
              <div className="ast-row salary-calculator-cta-row">
                <div className="ast-col-md-6 ">
                  <img src={d.cta.salary.image} alt="salary-calculator-cta__image" className="salary-calculator-cta__image" />
                </div>
                <div className="ast-col-md-6">
                  <div className="salary-calculator-cta__content">
                    <a className="clickbox" href={d.cta.salary.link} />
                    <h2 className="salary-calculator-cta__header" dangerouslySetInnerHTML={ih(d.cta.salary.title)} />
                    <span className="d-block salary-calculator-cta__subheader" dangerouslySetInnerHTML={ih(d.cta.salary.subtitle)} />
                    <a href={d.cta.salary.link} className="btn salary-calculator-cta__btn">
                      <span dangerouslySetInnerHTML={ih(d.cta.salary.text)} />
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="ast-row elt-cta-row">
                <div className="ast-col-md-6">
                  <div className="elt-cta__content">
                    <a className="clickbox" href={d.cta.elt.link} />
                    <h2 className="elt-cta__header" dangerouslySetInnerHTML={ih(d.cta.elt.title)} />
                    <span className="d-block elt-cta__subheader" dangerouslySetInnerHTML={ih(d.cta.elt.subtitle)} />
                    <a href={d.cta.elt.link} className="btn elt-cta__btn">
                      <span dangerouslySetInnerHTML={ih(d.cta.elt.text)} />
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
                <div className=" ast-col-md-6">
                  <img src={d.cta.elt.image} alt="elt-cta__image" className="elt-cta__image" />
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
      <InlineScript code={INTERNSHIP_HEIGHTS} deferred />
    </>
  );
}
