import { Fragment } from "react";

import { Html } from "./Header";
import type { ChromeFooter, OfferBannerRow, PromoBanner } from "./types";
import { attrProps, css, media, raw } from "./util";

/**
 * Everything footer.php writes between </div><!-- #content --> and
 * </div><!-- #page -->: template-parts/offer-banner.php, astra_content_after,
 * astra_footer_before, Astra's <footer id="colophon"> (the child theme's
 * advanced-footer/layout-4.php + Astra's footer-sml-layout-2.php; the widget
 * areas are WordPress output, passed through as HTML) and astra_footer_after.
 */
export default function Footer({ data, origin }: { data: ChromeFooter; origin: string }) {
  const c = data.colophon;
  return (
    <>
      {data.offer.banners.map((b, i) => (
        <OfferBanner key={i} b={b} origin={origin} />
      ))}
      {data.offer.promo ? <Promo p={data.offer.promo} origin={origin} /> : null}
      <Html html={data.content_after_html} />
      <Html html={data.footer_before_html} />
      {c ? (
        <footer {...attrProps(c.attrs)}>
          {c.adv ? (
            <div className="footer-adv footer-adv-layout-5">
              <div className="footer-adv-overlay footer-new">
                <div className="ast-container">
                  <div className="ast-row">
                    {c.adv.widgets.map((w) => (
                      <div
                        key={w.n}
                        className={`ast-col-lg-3 ast-col-md-3 ast-col-sm-12 ast-col-xs-12 footer-adv-widget footer-adv-widget-${w.n}`}
                        {...attrProps(w.attrs)}
                        {...raw(w.html)}
                      />
                    ))}
                  </div>
                  <div className="spacer-column"></div>
                  <AdvBottomRow home={c.adv.home} origin={origin} />
                </div>
              </div>
            </div>
          ) : null}
          {c.small ? (
            <div className="ast-small-footer footer-sml-layout-2">
              <div className="ast-footer-overlay">
                <div className="ast-container">
                  <div className="ast-small-footer-wrap">
                    <div className="ast-row ast-flex">
                      {c.small.s1_html ? (
                        <div className={`ast-small-footer-section ast-small-footer-section-1 ${c.small.section_class}`} {...raw(c.small.s1_html)} />
                      ) : null}
                      {c.small.s2_html ? (
                        <div className={`ast-small-footer-section ast-small-footer-section-2 ${c.small.section_class}`} {...raw(c.small.s2_html)} />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </footer>
      ) : null}
      <Html html={data.footer_after_html} />
    </>
  );
}

const SOCIAL: [string, string][] = [
  ["https://www.facebook.com/theteflinstitute/", "fa fa-facebook social-icon"],
  ["https://www.instagram.com/theteflinstitute", "fa fa-instagram social-icon"],
  ["https://twitter.com/teflinstitute_", "fa fa-twitter social-icon"],
  ["https://www.linkedin.com/school/the-tefl-institute-ltd/", "fa fa-linkedin social-icon"],
];

/** layout-4.php's static row: logo + social icons, accreditations, payment partners. */
function AdvBottomRow({ home, origin }: { home: string; origin: string }) {
  return (
    <div className="ast-row">
      <div className="ast-col-md-3">
        <div className="site-social-logo-container">
          <a href={home}>
            {" "}
            <img src={media(origin, "/wp-content/uploads/2023/06/TEFL-Logo_Institute.svg")} alt="TEFL Institute" className="site-logo" />
          </a>
          <div className="social-icons-container">
            {SOCIAL.map(([href, icon], i) => (
              <Fragment key={href}>
                {i ? " " : null}
                <a href={href} target="_blank">
                  <i className={icon}></i>
                </a>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="mobile-two-column ast-col-md-12">
        <div className="ast-col-md-4 first-col">
          <div className="accreditation-council-logo-container">
            <a target="_blank" href="https://find-a-qualification.services.ofqual.gov.uk/qualifications/61015714" rel="noopener">
              <img src={media(origin, "/wp-content/uploads/2021/10/Highfield-logo-white.svg")} className="accreditation-council-logo" alt="Training Qualification" />
            </a>{" "}
            <p>
              Highfield
              <br />
              Approved Center Number
              <br />
              21335
            </p>
          </div>
        </div>
        <div className="ast-col-md-3 second-col">
          <div className="accreditation-council-logo-container">
            <img src={media(origin, "/wp-content/uploads/2026/05/OTCAC-logo-white.png")} className="accreditation-council-logo" alt="" />
          </div>
        </div>
        <div className="ast-col-md-5 third-col">
          <div className="accreditation-council-logo-container">
            <a target="_blank" href="https://www.aqcreview.org/providers/the-tefl-institute/">
              <img src={media(origin, "/wp-content/uploads/2024/03/footer-tefl-institute.png")} className="accreditation-council-logo" alt="Accreditation Council" />
            </a>{" "}
            <p>
              DEAC/ACQ
              <br />
              Curriculum Approved Centre
            </p>
          </div>
        </div>
      </div>
      <div className="ast-col-md-3">
        <div className="payment-partners-logos">
          <img src={media(origin, "/wp-content/uploads/2023/05/payment-partners.svg")} className="payment-partners-logo" alt="" />{" "}
          <span>14 DAY MONEY BACK GUARANTEE</span>
        </div>
      </div>
    </div>
  );
}

/** template-parts/offer-banner.php: one per header banner row shown on this page. */
function OfferBanner({ b, origin }: { b: OfferBannerRow; origin: string }) {
  const logo = (
    <a href={b.logo_link}>
      <img src={media(origin, b.logo)} alt="" />
    </a>
  );
  return (
    <div
      data-test={b.test}
      style={css(
        `--banner_border_thickness:${b.thickness}px; --banner_border_color:${b.border_color}; --banner-bg-color:${b.bg}; --banner-z-index:999`,
      )}
      className="sales-offer-banner-mobile header-offer-banner "
    >
      <div className="ast-container ast-flex ast-align-items-center">
        <div className={`ast-col-md-3 logo-timer-container ${b.clock_bubble ? "clock-bubble" : ""}`}>
          {b.clock_bubble ? (
            <>
              <div className="banner-clock-offer-text">
                <img className="no-lazy" src={media(origin, "/wp-content/uploads/2025/02/TI-brand-copy.png")} alt="" />
                <div className="content-wrapper">
                  <div className="clock-offer-text" {...raw(b.clock_text_html)} />
                  <div className="banner-clock-text">Offer Ends:</div>
                  <div className="tefl_countdown_timer" {...raw(b.flip_html)} />
                </div>
              </div>
              <div className="promo-logo-container">{logo}</div>
            </>
          ) : (
            <div className="promo-logo-container">
              {b.timer_active ? (
                <div className="tefl_countdown_timer" {...raw(`<div class="banner-clock-text">Offer Ends:</div>${b.flip_html}`)} />
              ) : (
                logo
              )}
            </div>
          )}
        </div>
        <div className="ast-col-md-6 banner-content-container">
          {b.content_icon ? <img src={media(origin, b.content_icon)} alt="" /> : null}
          <div
            style={css(`--text-color:${b.text_color}; --font-size:${b.font_size}px`)}
            className="offer-banner-text desktop-offer-banner-text"
            {...raw(b.text_html)}
          />
          <div
            style={css(`--text-color:${b.text_color}; --font-size:${b.font_size}px`)}
            className="offer-banner-text mobile-offer-banner-text"
            {...raw(b.mobile_html)}
          />
        </div>
        <div className="ast-col-md-3 cta-container">
          {b.show_button ? (
            <a
              style={css(`--bg-color:${b.btn_bg}; --text-color:${b.btn_color}; --font-size:${b.btn_size}px`)}
              href={b.btn_link}
              className="cta-btn-white"
              {...raw(b.btn_text_html)}
            />
          ) : null}
        </div>
        <a href={b.btn_link} className="banner-offer-overlay-link"></a>
      </div>
    </div>
  );
}

/** offer-banner.php's page promo banner (when no header banner row matched). */
function Promo({ p, origin }: { p: PromoBanner; origin: string }) {
  return (
    <div
      style={css(
        `--banner_border_thickness:${p.thickness}px; --banner_border_color:${p.border_color}; --banner-bg-color:${p.bg}; --banner-z-index:999`,
      )}
      className="sales-offer-banner-mobile header-offer-banner expired-banner "
    >
      <div className="ast-container ast-flex ast-justify-content-center ast-align-items-center">
        <div className="ast-col-md-9 banner-content-container">
          {p.icon !== null ? <img src={media(origin, p.icon)} alt="" /> : null}
          <div
            style={css(`--text-color:${p.text_color}; --font-size:${p.font_size}px`)}
            className="mobile-offer-banner-text"
            {...raw(p.content_html)}
          />
        </div>
        <div className="ast-col-md-3 cta-container">
          {p.show_button ? (
            <a
              style={css(`--bg-color:${p.btn_bg}; --text-color:${p.btn_color}; --font-size:${p.btn_size}px`)}
              href={p.btn_link}
              className="cta-btn-white"
              {...raw(p.btn_text_html)}
            />
          ) : null}
        </div>
        <a href={p.btn_link} className="banner-offer-overlay-link"></a>
      </div>
    </div>
  );
}
