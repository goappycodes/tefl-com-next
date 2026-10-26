/**
 * January sale page (2025 design) — native port of the theme's
 * tefl-january-sale.php (page tefl-january-sale-old).
 *
 * Same markup as the PHP template, so tefl-january-sale.css styles it and the
 * theme scripts keep driving it: ti-timer.js (countdown), WCPBC (geo prices),
 * Business Reviews Bundle (slider), plus the template's own inline scripts,
 * emitted in place (toggleFaq; review bars + specialist-courses Splide + equal
 * heights; Klarna modal).
 */
import { Accreditations, FaqLeft, FaqRight, KlarnaModal, Panel, StarRows, Tools } from "./SaleBlocks";
import { JAN_KLARNA, JAN_MAIN, JAN_TOGGLE_FAQ } from "./scripts";
import { ih, InlineScript, TeflTimer } from "./shared";
import type { TeflJanuarySaleData } from "./types";

const FEATHER_CHECK =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>';

export default function TeflJanuarySale({ d }: { d: TeflJanuarySaleData }) {
  const o = d.origin;
  return (
    <>
      <div id="primary" className={d.primary_class}>
        {d.hero ? (
          <div className="hero" style={{ backgroundImage: `url('${d.hero.background}')` }}>
            <div className="hero-outer">
              <div className="content-container">
                <img className="promo-image" src={d.hero.promo} />
                <div className="discount">
                  <div>Discount Deadline:</div>
                  <TeflTimer t={d.timer} />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="content-container">
          {d.top ? (
            <section className="content-section">
              <div className="top-heading">
                <img src={`${o}/wp-content/uploads/2024/12/sale_basket.png`} />
                <div dangerouslySetInnerHTML={ih(d.top.title)} />
              </div>
              <div className="top-save">
                <div>Save Up To:</div>
                <img src={d.top.save_graphic} />
              </div>
            </section>
          ) : null}

          <section className="content-section">
            {d.courses ? (
              <>
                <div className="courses-title" dangerouslySetInnerHTML={ih(d.courses_title)} />

                <section className="content-section courses">
                  {d.courses.map((c, i) => (
                    <div key={i} className="course">
                      <div className="thumbnail" style={{ backgroundImage: `url('${c.thumbnail}')` }}>
                        <div className="off-container">
                          <div className="off">
                            January Sale<span>{`${c.discount}% Off`}</span>
                          </div>
                        </div>
                        <div className="thumbnail-outer">
                          <div className="icon" style={{ backgroundImage: `url('${c.icon}')` }} />
                        </div>
                      </div>

                      <div className="title" dangerouslySetInnerHTML={ih(c.title)} />

                      <div className="price">
                        <div className="product-pricing">
                          <div dangerouslySetInnerHTML={ih(c.price)} />
                        </div>
                      </div>

                      <div
                        className="completion-time"
                        dangerouslySetInnerHTML={ih(`<span>Completion Time:</span>${c.completion}`)}
                      />

                      <a className="enrol more-x-space" href={c.enrol_link} dangerouslySetInnerHTML={ih(`\n${c.enrol_button}\n`)} />

                      <div className="klarna">
                        <img src="https://teflinstitute.com/wp-content/uploads/2024/11/klarna-1.png" />
                        <div
                          dangerouslySetInnerHTML={ih(
                            `Split the purchase into 3 payments of ${c.installment} (0% APR). <a href="#" class="learn-more-link">Learn more</a>`,
                          )}
                        />
                      </div>

                      <div className="includes_title" dangerouslySetInnerHTML={ih(c.includes_title)} />

                      <div className="includes">
                        {c.includes.map((text, j) => (
                          <div
                            key={`i${j}`}
                            className="include"
                            dangerouslySetInnerHTML={ih(`\n<img src="${o}/wp-content/uploads/2024/11/yes.png">\n<span>${text}</span>\n`)}
                          />
                        ))}
                        {c.excludes.map((text, j) => (
                          <div
                            key={`e${j}`}
                            className="exclude"
                            dangerouslySetInnerHTML={ih(`\n<img src="${o}/wp-content/uploads/2024/11/no.png">\n<span>${text}</span>\n`)}
                          />
                        ))}
                      </div>

                      {c.offer !== null ? <div className="offer" dangerouslySetInnerHTML={ih(c.offer)} /> : null}

                      <div className="buttons">
                        <a className="default-button" href={c.button.link} dangerouslySetInnerHTML={ih(c.button.value)} />

                        <a className="enrol" href={c.learn_more.link} dangerouslySetInnerHTML={ih(c.learn_more.value)} />
                      </div>
                    </div>
                  ))}
                </section>
              </>
            ) : null}
          </section>

          <section className="content-section">
            {d.gifts ? (
              <div className="gifts">
                <div className="left">
                  <div className="title" dangerouslySetInnerHTML={ih(d.gifts.title)} />
                  <div className="text" dangerouslySetInnerHTML={ih(d.gifts.text)} />
                </div>

                <div className="right">
                  {d.gifts.guides.map((g, i) => (
                    <div key={i} className="guide" dangerouslySetInnerHTML={ih(`\n<img src="${g.image}">\n${g.name}\n`)} />
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="content-section">
            <div className="bundle-title" dangerouslySetInnerHTML={ih(d.bundle.main_title)} />

            <div className="bundle">
              <div className="left" style={{ backgroundImage: `url('${d.bundle.background}')` }}>
                <div className="badge" dangerouslySetInnerHTML={ih(d.bundle.badge)} />
              </div>

              <div className="right">
                <div className="title" dangerouslySetInnerHTML={ih(d.bundle.title)} />
                <div className="text" dangerouslySetInnerHTML={ih(d.bundle.text)} />

                <div className="product-outer">
                  <div className="whats_included">What&apos;s Included:</div>
                  <div className="price-outer">
                    <div className="price-left">
                      <div className="product-pricing">
                        <div dangerouslySetInnerHTML={ih(d.bundle.price)} />
                      </div>
                    </div>
                    <div className="price-right">{`Save ${d.bundle.discount}%`}</div>
                  </div>
                </div>

                <div className="whats_included_outer">
                  {d.bundle.included.map((text, i) => (
                    <div key={i} className="text" dangerouslySetInnerHTML={ih(`\n${FEATHER_CHECK}\n${text}\n`)} />
                  ))}
                </div>

                <div className="subheading" dangerouslySetInnerHTML={ih(d.bundle.subheading)} />

                <div className="links">
                  <a className="default-button" href={d.bundle.learn_more}>
                    Learn More
                  </a>

                  <a className="enrol" href={d.bundle.enrol_now}>
                    Enrol Now
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section>
            {d.reviews ? (
              <section className="verified-student-reviews-section section-padding-top">
                <div className="ast-container">
                  <div className="ast-row ">
                    <div className="verified-student-reviews-section__header">
                      <div className="ast-col-md-6">
                        <div
                          className="verified-student-reviews-section__title font-600 mb-1 large-heading  "
                          dangerouslySetInnerHTML={ih(d.reviews.title)}
                        />
                        <span
                          className="verified-student-reviews-section__subtitle"
                          dangerouslySetInnerHTML={ih(d.reviews.subtitle)}
                        />
                      </div>

                      <div className="ast-col-md-6">
                        <div className="reviews-average">
                          <div className="rating-div">
                            <i className="fa fa-star" />
                            <i className="fa fa-star" />
                            <i className="fa fa-star" />
                            <i className="fa fa-star" />
                            <i className="fa fa-star-half-empty" />
                          </div>
                          <div
                            className="total-count-text"
                            dangerouslySetInnerHTML={ih(
                              `<span class="course-review-count">(${d.reviews.average})</span> Out of ${d.reviews.total}global reviews`,
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="spacer-column" />
                  <div className="ast-row verified-student-reviews-section__row">
                    <div className="verified-student-reviews-section__row">
                      <div className="ast-col-md-5">
                        <div className="verified-student-reviews-section__review-summary">
                          <StarRows rows={d.reviews.stars} />
                        </div>
                        <div className="rplg rplg-insert" data-id="48500" />
                      </div>
                      <div
                        className="ast-col-md-7 verified-student-reviews-section__slider"
                        dangerouslySetInnerHTML={ih(d.reviews.slider)}
                      />
                    </div>
                  </div>
                </div>
              </section>
            ) : null}
          </section>

          {d.specialist ? (
            <section className="content-section">
              <div className="specialist-courses-slider splide">
                <div className="splide__track">
                  <ul className="splide__list">
                    {d.specialist.map((sc, i) => (
                      <li key={i} className="splide__slide">
                        <div className="specialist-course-card">
                          <div className="card-header">
                            <img className="course-header__image" src={sc.image} alt="" />
                            <img className="course-header__icon" src={sc.icon} alt="" />
                          </div>
                          <div className="card-body">
                            <div className="course-price" dangerouslySetInnerHTML={ih(sc.price)} />
                            <div className="course-title" dangerouslySetInnerHTML={ih(sc.title)} />
                            <div className="course-completion-time">
                              <span>Completion time</span>
                              <span dangerouslySetInnerHTML={ih(sc.completion)} />
                            </div>
                            <a href={sc.link} className="course-link">
                              Learn More
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ) : null}

          <Tools tools={d.tools} />

          <Accreditations acc={d.accreditations} />

          {!d.faq.empty ? (
            <section className="faq content-section">
              <FaqLeft faq={d.faq} />
              <FaqRight faq={d.faq} />
            </section>
          ) : null}

          <Panel panel={d.panel} />
        </div>
      </div>

      <KlarnaModal front={d.klarna.front} installment={d.klarna.installment} origin={o} />

      <InlineScript code={JAN_TOGGLE_FAQ} />
      <InlineScript code={JAN_MAIN} deferred />
      <InlineScript code={JAN_KLARNA} deferred />
    </>
  );
}
