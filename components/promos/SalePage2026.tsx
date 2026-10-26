/**
 * Sale page (2026 design) — native port of the theme's page-sale-new.php
 * (page tefl-course-offers).
 *
 * Same markup as the PHP template, so page-sale-new.css styles it and the
 * theme scripts keep driving it: page-sale-new.js (course slider, "Read More"
 * features, reels Splide, student stories), ti-timer.js (countdown), WCPBC (geo
 * prices), WooCommerce ajax add-to-cart, lity (reel popups) and Business
 * Reviews Bundle (review collage).
 *
 * Two spots print markup the HTML parser rewrites (a <p> wrapping the
 * WYSIWYG subtitle's own <p>s; nested <a>s in the reel cards); those are
 * emitted as the template's HTML so the browser builds the same DOM as on live.
 */
import type { CSSProperties, ReactNode } from "react";

import { esc, ih, TeflTimer } from "./shared";
import type { SalePage2026Data } from "./types";

/** The scalloped badge background (course discount + bundle seal), verbatim. */
const BADGE_G = `
                                        <g fill="currentColor">
                                            <circle cx="50" cy="50" r="32"/>
                                            <circle cx="80.00" cy="50.00" r="18"/>
                                            <circle cx="71.21" cy="71.21" r="18"/>
                                            <circle cx="50.00" cy="80.00" r="18"/>
                                            <circle cx="28.79" cy="71.21" r="18"/>
                                            <circle cx="20.00" cy="50.00" r="18"/>
                                            <circle cx="28.79" cy="28.79" r="18"/>
                                            <circle cx="50.00" cy="20.00" r="18"/>
                                            <circle cx="71.21" cy="28.79" r="18"/>
                                        </g>
                                    `;

const ARROW_PATH = '<path d="M5 12h14M13 6l6 6-6 6"/>';
const STORY_ARROW = '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>';

/** An inline <svg> with the template's exact inner markup. */
function Svg({ inner, ...attrs }: { inner: string } & React.SVGProps<SVGSVGElement>) {
  return <svg {...attrs} dangerouslySetInnerHTML={ih(inner)} />;
}

/** 18px stroke icon used on the course buttons. */
function BtnIcon({ d }: { d: string }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      inner={`<path d="${d}"/>`}
    />
  );
}

/** The arrow on CTA cards / journey CTA. */
function CtaArrow() {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      inner={`\n                                        ${ARROW_PATH}\n                                    `}
    />
  );
}

function JourneyArrow() {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      inner={`\n                                ${ARROW_PATH}\n                            `}
    />
  );
}

export default function SalePage2026({ d }: { d: SalePage2026Data }) {
  const o = d.origin;
  return (
    <>
      {d.hero.map((h, i) => (
        <section key={i} className="hero-wrappper">
          <div
            className="hero-banner"
            style={
              {
                "--desktop-bg": `url('${h.bg_desktop}')`,
                "--mobile-bg": `url('${h.bg_mobile}')`,
                backgroundImage:
                  "var(--desktop-bg), radial-gradient(circle at 88% 35%, rgba(235, 223, 201, 0.6) 0%, rgba(235, 223, 201, 0) 60%), linear-gradient(105deg, #f9f8f7 0%, #f3ede1 55%, #ebdfc9 100%)",
              } as CSSProperties
            }
          >
            <div className="hero-banner-container">
              <div className="ast-container">
                <div className="hero-banner-content">
                  <div className="hero-banner-text" dangerouslySetInnerHTML={ih(heroText(h))} />

                  <div className="hero-banner-accreditation">
                    <div className="accreditation-text d-none">
                      <span>Accredited, approved and regulated by</span>
                    </div>
                    <div className="accreditation-logos">
                      <img src={`${o}/wp-content/uploads/2026/09/accreditation_logos_green.webp`} alt="" />
                    </div>
                    {h.accreditation !== null ? (
                      <div className="accreditation-text-bottom d-none" dangerouslySetInnerHTML={ih(h.accreditation)} />
                    ) : null}
                  </div>

                  {h.offer ? (
                    <div className="hero-offer-bar">
                      <div className="hero-offer-text">
                        <p className="offer-deadline">{h.offer.deadline}</p>

                        {h.offer.enrolled !== null ? <p className="offer-enrolled">{h.offer.enrolled}</p> : null}

                        {h.offer.remaining !== null ? <p className="offer-remaining">{h.offer.remaining}</p> : null}
                      </div>

                      <div className="hero-offer-timer">
                        <TeflTimer t={h.offer.timer} />
                      </div>
                    </div>
                  ) : null}

                  {h.gift ? (
                    <div className="hero-gift-cta">
                      <div className="hero-gift-cta__content">
                        {h.gift.icon ? (
                          <>
                            <div className="hero-gift-cta__icon">
                              <img src={h.gift.icon} alt="" />
                            </div>
                            <span className="hero-gift-cta__divider" />
                          </>
                        ) : null}

                        <div className="hero-gift-cta__text">
                          {h.gift.title ? (
                            <p className="hero-gift-cta__label" dangerouslySetInnerHTML={ih(h.gift.title)} />
                          ) : null}
                        </div>
                      </div>

                      {h.gift.link ? (
                        <a href={h.gift.link} className="hero-gift-cta__link">
                          {h.gift.text}
                          <span className="hero-gift-cta__arrow">›</span>
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {h.footer ? (
            <div className="banner-footer">
              <div className="ast-container">
                <div className="banner-footer-content">
                  <div className="banner-footer-content__icon">
                    <img src={h.footer.icon} alt="" />
                  </div>
                  <div className="banner-footer-content__title">
                    <h2 dangerouslySetInnerHTML={ih(h.footer.title)} />
                  </div>
                  <div className="banner-footer-content__subtitle" dangerouslySetInnerHTML={ih(h.footer.subtitle)} />
                  <div className="banner-footer-content__link">
                    <a href={h.footer.link}>
                      <img src={`${o}/wp-content/uploads/2024/06/next-arrow.svg`} alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ))}

      {d.courses ? (
        <section id="coursesOverview" className="courses-cta-section custom-slider">
          <div className="ast-container">
            <h2 className="section-title" dangerouslySetInnerHTML={ih(d.courses.title)} />

            <div className="courses-cta-section__container slider-container">
              {d.courses.cards.map((c, i) => (
                <div key={i} className={`course-card course-card--${c.theme} slider-mobile slider-item`}>
                  <div className="course-card__main" style={{ background: `url('${c.bg}')` }}>
                    {c.save !== null ? (
                      <span className="course-discount-badge">
                        <Svg className="course-discount-badge__bg" viewBox="0 0 100 100" aria-hidden="true" inner={BADGE_G} />
                        <span className="course-discount-badge__text">
                          {`${c.save}%`}
                          <small>Off</small>
                        </span>
                      </span>
                    ) : null}

                    {c.employer !== null ? (
                      <span className="course-employer-badge">
                        <img src={c.employer} alt="Employer's Choice" />
                      </span>
                    ) : null}
                  </div>

                  <div className="course-card__body">
                    <h3 className="course-title">{c.title}</h3>

                    <div className="course-summary" dangerouslySetInnerHTML={ih(c.summary)} />

                    <span className="course-divider" aria-hidden="true" />

                    {c.best_for !== null ? (
                      <p className="course-best-for">
                        <span className="course-best-for__label">Best For</span>
                        {c.best_for}
                      </p>
                    ) : null}

                    <div className="course-price-row">
                      <div className="course-price" dangerouslySetInnerHTML={ih(c.price)} />
                    </div>

                    <p
                      className="course-klarna"
                      data-cc={c.cc}
                      dangerouslySetInnerHTML={ih(
                        `\nor from ${c.installment}/month with\n<img src="${o}/wp-content/uploads/2023/07/Klarna-logotype-black.svg_.svg" alt="Klarna">\n`,
                      )}
                    />

                    <div className="course-buttons">
                      <a
                        href={c.enrol_url}
                        className={`course-btn btn-primary${c.is_300hr ? "" : " add_to_cart_button ajax_add_to_cart"}`}
                        {...(c.is_300hr ? {} : { "data-product_id": c.pid, "data-quantity": "1", rel: "nofollow" })}
                      >
                        Enrol Now
                        <BtnIcon d="M5 12h14M13 6l6 6-6 6" />
                      </a>
                      <a href={c.course_url} className="course-btn btn-tertiary">
                        Learn More
                        <BtnIcon d="M7 17L17 7M7 7h10v10" />
                      </a>
                      {c.guide ? (
                        <a href={c.guide.url} className="course-btn btn-secondary" target={c.guide.target || undefined}>
                          {c.guide.text}
                          {c.guide.icon ? (
                            <img src={c.guide.icon} alt="" className="button-icon" />
                          ) : (
                            <BtnIcon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          )}
                        </a>
                      ) : null}
                    </div>

                    {c.features !== null ? (
                      <div className="course-features">
                        <ul>
                          {c.features.map((f, j) => (
                            <li key={j} className={j >= 3 ? "course-feature--extra" : undefined}>
                              {f}
                            </li>
                          ))}
                        </ul>
                        {c.features.length > 3 ? (
                          <button type="button" className="course-readmore-link course-features-toggle" aria-expanded="false">
                            Read More
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="course-slider-nav slider-nav" style={{ display: "none" }}>
              <button type="button" className="slider-nav-btn slider-prev" aria-label="Previous courses">
                <Svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  inner='<polyline points="15 18 9 12 15 6"></polyline>'
                />
              </button>
              <button type="button" className="slider-nav-btn slider-next" aria-label="Next courses">
                <Svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  inner='<polyline points="9 18 15 12 9 6"></polyline>'
                />
              </button>
            </div>

            <div className="cta-container">
              <a href={d.links.compare} className="view-all-courses-btn teflie-btn btn-primary">
                Compare All Courses
              </a>
            </div>
          </div>
        </section>
      ) : null}

      {d.bundle ? (
        <section id="courseBundle" className="course-bundle-section">
          <div className="ast-container">
            <div className="bundle-inner">
              <div className="bundle-gift">
                <img src={`${o}/wp-content/uploads/2026/10/gift-icon.png`} alt="" />
              </div>

              <div className="bundle-main">
                <div className="bundle-top">
                  {d.bundle.title !== null ? <div className="bundle-pill">{d.bundle.title}</div> : null}

                  {d.bundle.worth !== null ? (
                    <div className="bundle-seal-wrap">
                      <img className="bundle-arrow" src={`${o}/wp-content/uploads/2026/09/orange-arrow-icon.webp`} alt="" />
                      <span className="bundle-seal">
                        <Svg className="bundle-seal__bg" viewBox="0 0 100 100" aria-hidden="true" inner={BADGE_G} />
                        <span className="bundle-seal__text">
                          <small>Worth</small>
                          {d.bundle.worth}
                        </span>
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="bundle-list">
                  {d.bundle.rows.map((row, i) => (
                    <div key={i} className="bundle-row">
                      {row.map((item, bi) => (
                        <Frag key={bi}>
                          {bi > 0 ? <span className="bundle-plus">+</span> : null}
                          <span className="bundle-item" dangerouslySetInnerHTML={ih(item)} />
                        </Frag>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.why_us ? (
        <section id="whyUs" className="why-us-section">
          <div className="ast-container">
            <div className="why-us-inner">
              <div className="why-us-media">
                <span className="why-us-shape why-us-shape--top" aria-hidden="true">
                  <img src={`${o}/wp-content/uploads/2026/09/beige_line_animation.webp`} alt="" />
                </span>
                <span className="why-us-shape why-us-shape--bottom" aria-hidden="true">
                  <img src={`${o}/wp-content/uploads/2026/09/green_line_animation.webp`} alt="" />
                </span>
                {d.why_us.image !== null ? (
                  <div className="why-us-image">
                    <img className="no-lazy" src={d.why_us.image} alt={d.why_us.title ?? ""} />
                  </div>
                ) : null}
              </div>

              <div className="why-us-content">
                {d.why_us.title !== null ? <h2 className="why-us-title">{d.why_us.title}</h2> : null}

                {d.why_us.summary !== null ? (
                  <div className="why-us-summary" dangerouslySetInnerHTML={ih(d.why_us.summary)} />
                ) : null}

                {d.why_us.features !== null ? (
                  <ul className="why-us-features">
                    {d.why_us.features.map((f, i) => (
                      <li key={i} className="why-us-feature">
                        {f.icon !== null ? (
                          <span className="why-us-feature__icon">
                            <img src={f.icon} alt="" />
                          </span>
                        ) : null}
                        <span className="why-us-feature__title">{f.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.cta_cards ? (
        <section id="ctaCards" className="cta-cards-section">
          <div className="ast-container">
            <div className="cta-cards-grid">
              {d.cta_cards.map((c, i) => (
                <div key={i} className={`cta-card cta-card--${c.theme}`}>
                  {c.label !== null ? <span className="cta-card__label">{c.label}</span> : null}

                  {c.image !== null ? (
                    <div className="cta-card__image">
                      <img src={c.image} alt={c.alt} />
                    </div>
                  ) : null}

                  <div className="cta-card__body">
                    {c.desc !== null ? <p className="cta-card__desc" dangerouslySetInnerHTML={ih(c.desc)} /> : null}

                    {c.cta ? (
                      <a className="cta-card__btn" href={c.cta.url} target={c.cta.target || undefined}>
                        {c.cta.text}
                        <CtaArrow />
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="verified_reviews_section" className="ptb-60">
        <div className="ast-container">
          <div className="reviews-layout">
            <div className="reviews-intro">
              <h2 className="section-title" dangerouslySetInnerHTML={ih(d.reviews.title)} />
              <div className="section-summary" dangerouslySetInnerHTML={ih(d.reviews.summary)} />

              {d.reviews.google ? (
                <div className="rating-row">
                  <div className="rating-row__main">
                    <span className="rating-row__star">★</span>
                    <span className="rating-row__score">{d.reviews.google.rating}</span>
                    <img className="rating-row__logo" src={`${o}/wp-content/uploads/2026/09/google-logo.svg`} alt="Google" />
                    <span className="rating-row__brand">Rating</span>
                  </div>
                  <div className="rating-row__sub">
                    Based on <b>{d.reviews.google.count}</b> Reviews.{" "}
                    <a href={d.reviews.google.link} target="_blank" rel="noopener noreferrer">
                      See All Reviews
                    </a>
                  </div>
                </div>
              ) : null}

              {d.reviews.trustpilot ? (
                <div className="rating-row rating-row--trustpilot">
                  <div className="rating-row__main">
                    <span className="rating-row__star rating-row__star--tp">★</span>
                    <span className="rating-row__score">{d.reviews.trustpilot.rating}</span>
                    {d.reviews.trustpilot.icon !== null ? (
                      <img className="rating-row__logo" src={d.reviews.trustpilot.icon} alt="Trustpilot" />
                    ) : null}
                    <span className="rating-row__brand">Rating</span>
                  </div>
                  <div className="rating-row__sub">
                    Based on <b>{d.reviews.trustpilot.count}</b> Reviews.{" "}
                    <a href={d.reviews.trustpilot.link} target="_blank" rel="noopener noreferrer">
                      See All Reviews
                    </a>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="reviews-collage business-reviews-slider" dangerouslySetInnerHTML={ih(d.reviews.slider)} />
          </div>
        </div>
      </section>

      {d.features ? (
        <section className="feature-benefits-section">
          <div className="ast-container">
            <div className="feature-benefits-section__row">
              {d.features.map((f, i) => (
                <div key={i} className="feature-benefit-card">
                  <div className="feature-benefit-card__icon">
                    <img src={f.icon} alt="" />
                  </div>
                  <div className="feature-benefit-card__title" dangerouslySetInnerHTML={ih(f.title)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="social_media_reels">
        <div>
          <div className="ast-container">
            <div className="width-md text-center">
              <h3 className="section-title" dangerouslySetInnerHTML={ih(d.reels.title)} />
              <p className="instagram-subtitle" dangerouslySetInnerHTML={ih(d.reels.bold)} />
            </div>
          </div>
          {d.reels.reels ? (
            <>
              <div className="ast-container social-reels-container">
                <div className="splide instagram-reels-slider" id="general-slider">
                  <div className="splide__track">
                    <ul className="splide__list">
                      {d.reels.reels.map((r, i) => (
                        <li key={i} className="splide__slide" dangerouslySetInnerHTML={ih(reelCard(r))} />
                      ))}
                    </ul>
                  </div>
                  <div className="splide__arrows reels-slider__arrows">
                    <button className="splide__arrow splide__arrow--prev reels-slider__arrow reels-slider__arrow--prev">
                      <img src={`${o}/wp-content/uploads/2026/09/slider-arrow-right.svg`} alt="Previous" />
                    </button>
                    <button className="splide__arrow splide__arrow--next internships-slider__arrow reels-slider__arrow--next">
                      <img src={`${o}/wp-content/uploads/2026/09/slider-arrow-right.svg`} alt="Next" />
                    </button>
                  </div>
                </div>

                <img className="reels-ribbon" src={`${o}/wp-content/uploads/2026/10/wave-text.gif`} alt="" aria-hidden="true" />
              </div>
              <div style={{ textAlign: "center" }}>
                <a href={d.reels.cta_link} target="_blank" className="view-instagram-btn teflie-btn btn-secondary">
                  <img src={`${o}/wp-content/uploads/2026/09/Instagram-1.svg`} alt="" />
                  {d.reels.cta_text}
                  <img src={`${o}/wp-content/uploads/2026/09/Vector-23.svg`} alt="" />
                </a>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {d.stories ? (
        <section className="student-stories-section">
          <div className="ast-container">
            <div
              className="student-stories-section__row"
              style={d.stories.bg !== null ? { background: `url('${d.stories.bg}')` } : undefined}
            >
              <div className="student-stories-section__row--header">
                {d.stories.title !== null ? <h2 className="section-title">{d.stories.title}</h2> : null}
                {d.stories.summary !== null ? <p className="section-summary">{d.stories.summary}</p> : null}
              </div>
              {d.stories.stories !== null ? (
                <div className="student-stories-section__row--content">
                  {d.stories.stories.map((s, i) => (
                    <div key={i} className={`story-card ${s.active ? "active" : ""}`}>
                      <div className="story-card-image">
                        {s.image !== null ? <img src={s.image} alt="" /> : null}
                        {s.flag !== null ? <img className="flag-img" src={s.flag} alt="" /> : null}
                      </div>
                      <div className="story-card-content">
                        {s.label !== null ? <span className="story-card__label">{s.label}</span> : null}
                        <div className="story-card__title">{s.title}</div>
                        <div className="story-card__summary" dangerouslySetInnerHTML={ih(s.summary)} />
                        {s.link !== null ? (
                          <a href={s.link} className="teflie-btn btn-glass">
                            <span>Read Full Story</span>
                            <Svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              inner={STORY_ARROW}
                            />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="student-stories-nav">
              <button type="button" className="nav-arrow nav-prev" aria-label="Previous story">
                <img className="splide__arrow-icon" src={`${o}/wp-content/uploads/2026/09/slider-arrow-right.svg`} alt="" />
              </button>
              <a className="view-all-stories" href={d.links.all_stories}>
                <span>View All Stories</span>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  inner={STORY_ARROW}
                />
              </a>
              <button type="button" className="nav-arrow nav-next" aria-label="Next story">
                <img className="splide__arrow-icon" src={`${o}/wp-content/uploads/2026/09/slider-arrow-right.svg`} alt="" />
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {d.journey ? (
        <section id="journeyCta" className="journey-cta-section">
          <div className="ast-container">
            {d.journey.banner ? (
              <div className="journey-cta-banner">
                {d.journey.banner.title !== null ? (
                  <h2 className="journey-cta-banner__title">{d.journey.banner.title}</h2>
                ) : null}

                {d.journey.banner.cta ? (
                  <a className="journey-cta-banner__btn" href={d.journey.banner.cta.link}>
                    {d.journey.banner.cta.text}
                    <JourneyArrow />
                  </a>
                ) : null}
              </div>
            ) : null}

            {d.journey.links !== null ? (
              <div className="journey-cta-links">
                {d.journey.links.map((b, i) => (
                  <a key={i} className="journey-cta-link" href={b.url} target={b.target || undefined}>
                    {b.icon !== null ? (
                      <span className="journey-cta-link__icon">
                        <img src={b.icon} alt="" />
                      </span>
                    ) : null}
                    <span className="journey-cta-link__title">{b.title}</span>
                    <span className="journey-cta-link__arrow">
                      <JourneyArrow />
                    </span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}

/** Keyed fragment. */
function Frag({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** .hero-banner-text as the template prints it (its <p> wraps the subtitle's own <p>s). */
function heroText(h: SalePage2026Data["hero"][number]): string {
  let html = "";
  if (h.title) html += `\n<h1 class="hero-banner-title">${h.title}</h1>\n`;
  if (h.subtitle) html += `\n<p class="hero-banner-summary">${h.subtitle}</p>\n`;
  if (h.buttons) {
    html += `\n<div class="hero-banner-buttons">\n`;
    for (const b of h.buttons) {
      html += `<a href="#coursesOverview" class="hero-banner-button btn-${esc(b.type)}">\n${b.text}\n`;
      if (b.icon) html += `<img src="${esc(b.icon)}" alt="" class="button-icon">\n`;
      html += `</a>\n`;
    }
    html += `</div>\n`;
  }
  return html;
}

/** A reel card: the template nests <a>s, which the parser splits into siblings. */
function reelCard(r: { video: string; thumb: string; link: string }): string {
  return `
<a class="reel-card" href="${esc(r.video)}" data-lity>
<img src="${esc(r.thumb)}" alt="Instagram Reel">
<a target="_blank" href="${esc(r.link)}" class="reel-play-link">follow on insta</a>
<a href="${esc(r.video)}" data-lity>
<span class="reel-play-overlay"></span>
</a>
</a>
`;
}
