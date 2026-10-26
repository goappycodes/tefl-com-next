import Clockdown from "./Clockdown";
import { STICKY_SCRIPT, STICKY_STYLE } from "./sticky-assets";
import type { CourseBanner as CourseBannerData, StickyCta as StickyCtaData } from "./types";
import { css, raw } from "./util";

/**
 * The theme's own markup after </div><!-- #page -->, placed by WpShell where
 * WordPress prints it among the wp_footer output (which stays WordPress HTML).
 */

/** `itemscope=""` exactly as footer.php prints it (React's itemScope would too, but as a boolean). */
const SCOPE = { itemscope: "" } as Record<string, string>;

/** footer.php's hidden schema.org block (`.footer-legal-holder`). */
export function LegalHolder({ img }: { img: string }) {
  return (
    <div className="footer-legal-holder" style={{ display: "none" }}>
      <p className="footer__legal" {...SCOPE} itemType="http://schema.org/Organization"></p>
      <div {...SCOPE} itemType="https://schema.org/AggregateRating">
        <div itemProp="itemReviewed" {...SCOPE} itemType="https://schema.org/Organization">
          <img width="20" itemProp="image" src={img} alt="TEFL Institute" />{" "}
          <span itemProp="name">The TEFL Institute</span> <span itemProp="telephone">+44 20 3318 5366</span>{" "}
          <span itemType="http://schema.org/PostalAddress" {...SCOPE} itemProp="address">
            <span itemProp="streetAddress">6 Mornington Pl.,</span>{" "}
            <span>
              <span itemProp="addressLocality">Greater London NW1 7RP</span>
              {", "}
              <span itemProp="addressRegion">United Kingdom</span>
            </span>
          </span>
        </div>
        <span itemProp="ratingValue">4.9</span>
        {" out of "}
        <span itemProp="bestRating">5</span>
        {" stars - "}
        <span itemProp="ratingCount">540</span>
        {" votes"}
      </div>
    </div>
  );
}

/** template-parts/sticky-offer-cta.php (footer.php prints it after wp_footer). */
export function StickyOfferCta({ d }: { d: StickyCtaData }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STICKY_STYLE }} />
      <div className="sticky-offer-toggle">
        <i className="fa fa-gift"></i>
      </div>
      <div className="sticky-offer-cta">
        <img src={d.icon} alt="" className="no-lazy cta-offer-icon" />
        <div className="sticky-offer-close">×</div>
        <h4 className="cta-subtitle" {...raw(d.subtitle_html)} />
        <h3 className="cta-title" {...raw(d.title_html)} />
        <div className="cta-product-price" {...raw(d.price_html)} />
        <div className="cta-summary" {...raw(d.summary_html)} />
        {d.flip_html !== null ? <div className="cta-offer-clock" {...raw(d.flip_html)} /> : null}
        {d.enrol !== null ? (
          <a rel="nofollow" className="btn cta-offer-btn" href={d.enrol}>
            Enrol Today
          </a>
        ) : (
          <a className="btn cta-offer-btn" href={d.btn_link} {...raw(d.btn_text_html)} />
        )}
      </div>
      <script type="text/tefl-deferred" dangerouslySetInnerHTML={{ __html: STICKY_SCRIPT }} />
    </>
  );
}

/** ti_footer_course_banner() (includes/ti-footer-functions.php) on the front page / course pages. */
export function CourseBanner({ d }: { d: CourseBannerData }) {
  return (
    <div style={css(`background-color:${d.bg}`)} className="footer-course-banner course-banner-outer footer-promo-banner sales-offer-banner">
      <div data-test={d.content_class} className="banner-container">
        <div className="ast-flex align-items-center footer-sales-banner">
          {d.clock ? (
            <div className="ast-col-md-3 clockdown">
              <span className="timer-text">Offer ends in:</span>
              <div className="tefl_countdown_timer">
                <Clockdown clock={d.clock} />
              </div>
            </div>
          ) : null}
          <div className={d.content_class}>
            <div className="offer-banner-text" style={css(`color:${d.text_color}; font-size:${d.font_size}px`)} {...raw(d.text_html)} />
          </div>
          {d.show_button ? (
            <div className="ast-col-md-3">
              <a
                style={css(`background:${d.btn_bg}; color:${d.btn_color} !important ; font-size:${d.btn_size}px`)}
                href={d.btn_link}
                className="cta-btn"
                {...raw(d.btn_text_html)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
