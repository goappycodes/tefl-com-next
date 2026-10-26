/**
 * TEFL coupon codes page — native port of the theme's discount-tefl-coupon-codes.php.
 *
 * Same markup as the PHP template; the theme's discount-tefl-coupon-codes.js
 * (still loaded) drives "See Code", copy-to-clipboard and #copy-popup.
 */
import { ih } from "./shared";
import type { CouponCodesData } from "./types";

export default function CouponCodes({ d }: { d: CouponCodesData }) {
  return (
    <div id="primary" className={d.primary_class}>
      {d.header ? (
        <section className="page-header section-padding">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h1
                  className="text-center font-600 page-header__title large-heading mb-1"
                  dangerouslySetInnerHTML={ih(d.header.title)}
                />
                <div className="text-center page-header__description" dangerouslySetInnerHTML={ih(d.header.desc)} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {d.coupons ? (
        <section className="section-padding-bottom coupons-section">
          <div className="ast-container">
            <div className="ast-row">
              {d.coupons.map((c, i) => (
                <div key={i} className="ast-col-md-12">
                  <div className={`coupon-card ${c.live ? "live-coupon" : "expired-coupon"}`}>
                    <div className="coupon-card__content">
                      <div className="coupon-card__content-left">
                        <div className="coupon-amount">
                          <span dangerouslySetInnerHTML={ih(`Extra ${c.discount}%`)} />
                          <span>OFF</span>
                        </div>
                        <div className="coupon-description">
                          <span>Coupon Code:</span>
                          <span className="coupon-description__title" dangerouslySetInnerHTML={ih(c.desc)} />
                          {c.expiry !== null ? (
                            <span className="coupon-description__expiry" dangerouslySetInnerHTML={ih(`Valid until ${c.expiry}`)} />
                          ) : null}
                        </div>
                      </div>
                      <div className="coupon-card__content-right">
                        <div className="coupon-icon">
                          <img className="no-lazy" src={c.icon} alt="Coupon Icon" />
                        </div>
                        {c.live ? (
                          <button className="reveal-code-button">
                            See Code
                            <span
                              className="reveal"
                              data-coupon-code={c.code}
                              title="Click to copy"
                              dangerouslySetInnerHTML={ih(`<i class="fa-regular fa-copy"></i>\n${c.code_html}`)}
                            />
                          </button>
                        ) : (
                          <button className="expired-code-button">code expired</button>
                        )}
                      </div>
                    </div>
                    <div className="coupon-card__footer">
                      <a href={d.terms_url} className="view-terms">
                        view terms
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              <div id="copy-popup" className="copy-popup">
                Coupon code <strong /> copied to clipboard!
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
