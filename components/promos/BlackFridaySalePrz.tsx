/**
 * Black Friday / January sale page — native port of the theme's
 * black-friday-sale-prz.php (pages black-friday-sale-2, january-sale).
 *
 * Same markup as the PHP template, so black-friday-sale-prz.css styles it and
 * the theme scripts keep driving it: ti-timer.js (countdown), WCPBC (geo
 * prices), Trustpilot, lity (video popups), Business Reviews Bundle (slider),
 * plus the template's own inline scripts, emitted in place (toggleFaq, review
 * bars, Klarna modal).
 */
import { Accreditations, FaqLeft, FaqRight, KlarnaModal, Panel, StarRows, Tools } from "./SaleBlocks";
import { PRZ_KLARNA, PRZ_REVIEWS, PRZ_TOGGLE_FAQ } from "./scripts";
import { ih, InlineScript, TeflTimer, TrustBoxScript } from "./shared";
import type { BlackFridaySalePrzData } from "./types";

const POWER_PACK_TEXT =
  "\n                This Black Friday, unlock your full TEFL potential with our best-selling Specialist Power Pack - now only £62.\nGet 6 courses for the price of one and gain specialist TEFL certificates that will help you stand out in the global teaching market.\nPerfect for those who already hold a TEFL qualification or want to deepen their expertise - this bundle is your key to becoming a sought-after teacher.\n<b>Don’t miss your chance - once it’s gone, it’s gone.</b>\n            ";

const TIKPOINT = "https://teflinstitute.com/wp-content/uploads/2025/11/tikpoint.svg";
const YELLOW_TIKPOINT = "https://teflinstitute.com/wp-content/uploads/2025/11/yellow_tikpoint.svg";

export default function BlackFridaySalePrz({ d }: { d: BlackFridaySalePrzData }) {
  return (
    <>
      <div id="primary" className={d.primary_class}>
        <div className="hero" style={{ backgroundImage: `url('${d.hero.background}')` }}>
          <div className="glitter-overlay" />
          <div className="hero-outer">
            <div className="content-container">
              <img className="promo-image" src={d.hero.promo} />
              <div className="discount">
                <div className="font-dosis">Discount Deadline:</div>
                <TeflTimer t={d.timer} />
              </div>
            </div>
          </div>
        </div>

        <div className="content-container">
          <section className="content-section">
            <div className="top-heading">
              <img src={`${d.origin}/wp-content/uploads/2026/01/Layer_1.png`} />
              <div>
                <h2 className="section-title" dangerouslySetInnerHTML={ih(d.top_title)} />
              </div>
            </div>
          </section>

          <section className="content-section">
            <div className="courses-title" dangerouslySetInnerHTML={ih(d.courses_title)} />

            <section className="content-section courses">
              {d.courses.map((c, i) => (
                <div key={i} className="course">
                  <a href={c.link}>
                    <div className="thumbnail" style={{ backgroundImage: `url('${c.thumbnail}')` }}>
                      <div className="off-container">
                        <div className="off">
                          January Sale <span style={{ color: "#DDB239" }}>{`${c.discount}% Off`}</span>
                        </div>
                      </div>
                      <div className="thumbnail-outer">
                        <div className="icon" style={{ backgroundImage: `url('${c.icon}')` }} />
                      </div>
                    </div>
                  </a>

                  <div className="title" dangerouslySetInnerHTML={ih(c.title)} />

                  <div className="price">
                    <div className="product-pricing">
                      <div dangerouslySetInnerHTML={ih(c.price)} />
                    </div>
                  </div>

                  <div className="completion-time" dangerouslySetInnerHTML={ih(`<span>Completion Time:</span>${c.completion}`)} />

                  <div className="klarna">
                    <img src="https://teflinstitute.com/wp-content/uploads/2024/11/klarna-1.png" alt="Klarna" />
                    <div
                      dangerouslySetInnerHTML={ih(
                        `Split the purchase into 3 payments of ${c.installment} (0% APR). <a href="#" class="learn-more-link">Learn more</a>`,
                      )}
                    />
                  </div>

                  <div className="includes_title" dangerouslySetInnerHTML={ih(c.includes_title)} />

                  <div className="includes">
                    {c.includes.map((text, j) => (
                      <div key={j} className="include" dangerouslySetInnerHTML={ih(`\n<img src="${TIKPOINT}" alt="">\n${text}\n`)} />
                    ))}
                  </div>

                  {c.offer !== null ? <div className="offer" dangerouslySetInnerHTML={ih(c.offer)} /> : null}

                  <div className="buttons">
                    <a className="default-button" href={c.button.link} dangerouslySetInnerHTML={ih(c.button.value)} />
                    <a className="enrol" href={c.enrol.link} dangerouslySetInnerHTML={ih(c.enrol.value)} />
                  </div>

                  {c.trustpilot ? (
                    <>
                      {c.trustpilot.bootstrap ? <TrustBoxScript /> : null}
                      <div
                        className="trustpilot-widget"
                        data-locale="en-US"
                        data-template-id="5418052cfbfb950d88702476"
                        data-businessunit-id="61c0c19118c53fc28bcc355d"
                        data-style-height="30px"
                        data-style-width="100%"
                        data-token={c.trustpilot.token}
                        data-tags={c.trustpilot.tag}
                        data-stars="4,5"
                        data-review-languages="en"
                      >
                        <a href="https://www.trustpilot.com/review/teflinstitute.com" target="_blank" rel="noopener">
                          Trustpilot
                        </a>
                      </div>
                      <style dangerouslySetInnerHTML={ih(".course .trustpilot-widget{margin-top:12px}")} />
                    </>
                  ) : null}
                </div>
              ))}
            </section>

            <section className="content-section">
              <div className="bundle-title font-dosis" dangerouslySetInnerHTML={ih(d.bundle.main_title)} />

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
                      <div
                        key={i}
                        className="text"
                        dangerouslySetInnerHTML={ih(`\n<img src="${YELLOW_TIKPOINT}" alt="" srcset="">\n${text}\n`)}
                      />
                    ))}
                  </div>

                  <div className="subheading" dangerouslySetInnerHTML={ih(d.bundle.subheading)} />

                  <div className="links">
                    <a className="default-button" href={d.bundle.learn_more}>
                      Learn More
                    </a>

                    <a className="enrol" href={d.bundle.enrol_now}>
                      CLAIM MY DEAL
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="content-section">
              <div className="gifts">
                <div className="left">
                  <div className="title font-dosis" dangerouslySetInnerHTML={ih(d.gifts.title)} />
                  <div className="text" dangerouslySetInnerHTML={ih(d.gifts.text)} />

                  <a className="enrol font-dosis" href={d.links.gifts}>
                    Worth £250 - Yours Free!
                  </a>
                </div>

                <div className="right">
                  {d.gifts.guides.map((img, i) => (
                    <div key={i} className="guide">
                      <img src={img} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="content-section">
              <div className="power-pack">
                <div
                  className="left"
                  style={{ backgroundImage: "url('https://teflinstitute.com/wp-content/uploads/2025/11/power-pack.png')" }}
                />
                <div className="right">
                  <div className="title">The January Sale Specialist Power Pack</div>
                  <div className="short-description" dangerouslySetInnerHTML={ih(POWER_PACK_TEXT)} />
                  <div className="links">
                    <a className="default-button" href={d.links.power_more}>
                      Learn More
                    </a>

                    <a className="enrol" href={d.links.power_deal}>
                      CLAIM MY DEAL
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <section className="content-section review-section">
              {d.reviews ? (
                <section className="testimonial-section">
                  <section className="verified-student-reviews-section section-padding-top">
                    <div className="ast-container">
                      <div className="ast-row ">
                        <div className="verified-student-reviews-section__header">
                          <div className="ast-col-md-6">
                            <div
                              className="verified-student-reviews-section__title font-600 mb-1 large-heading double-underline"
                              dangerouslySetInnerHTML={ih(d.reviews.title)}
                            />
                            <p
                              className="verified-student-reviews-section__subtitle"
                              dangerouslySetInnerHTML={ih(d.reviews.subtitle)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="spacer-column" />
                      <div className="ast-row verified-student-reviews-section__row">
                        <div className="verified-student-reviews-section__row">
                          <div className="ast-col-md-6">
                            <div className="verified-student-reviews-section__review-summary">
                              <StarRows rows={d.reviews.stars} />
                            </div>
                            <div
                              className="verified-student-reviews-section__slider"
                              dangerouslySetInnerHTML={ih(d.reviews.slider)}
                            />
                          </div>

                          <div className="ast-col-md-6 video-testimonials">
                            <div className="ast-row video-testimonial">
                              <div className="video-testimonials__slider">
                                {d.reviews.videos.map((v, i) => (
                                  <div key={i} className="ast-col-md-6">
                                    <div className="video-testimonial-card">
                                      <a data-lity="" href={v.link} className="popup-video-review">
                                        <div className="video-testimonial-card_image-container">
                                          <img src={v.thumbnail} alt="" className="video-testimonial-card__image" />
                                          <div className="play-btn">
                                            <img src={v.play} alt="" className="" />
                                          </div>
                                        </div>

                                        <h3
                                          className="video-testimonial-card__title font-600 small-heading"
                                          dangerouslySetInnerHTML={ih(v.name)}
                                        />
                                        <span
                                          className="video-testimonial__subtitle font-400"
                                          dangerouslySetInnerHTML={ih(v.subtitle)}
                                        />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="reviews-cols">
                              {d.reviews.logos.map((l, i) => (
                                <a key={i} href={l.link} className="google-widget" target="_blank" rel="noopener noreferrer">
                                  <div className="google-reviews-badge">
                                    <img src={l.image} />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </section>
              ) : null}
            </section>

            <Tools tools={d.tools} />

            <Accreditations acc={d.accreditations} />

            {/* The template never closes .faq; the browser closes it at </section>. */}
            <section className="content-section">
              <div className="faq">
                <FaqLeft faq={d.faq} />
                <FaqRight faq={d.faq} />
              </div>
            </section>

            <Panel panel={d.panel} />
          </section>
        </div>
      </div>

      <KlarnaModal front={d.klarna.front} installment={d.klarna.installment} origin={d.origin} />

      <InlineScript code={PRZ_TOGGLE_FAQ} />
      <InlineScript code={PRZ_REVIEWS} deferred />
      <InlineScript code={PRZ_KLARNA} deferred />
    </>
  );
}
