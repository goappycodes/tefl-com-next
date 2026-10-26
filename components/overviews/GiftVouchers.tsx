/**
 * Gift vouchers — native port of the theme's gift-vouchers.php
 * (/tefl-gift-vouchers/). The template prints its sections straight into the
 * content slot (no #primary). Data: wordpress/headless/native/gift-vouchers.php.
 */
import { H, type OverviewsBase } from "./shared";

export interface GiftVouchersData extends OverviewsBase {
  hero: { image: string; text: string } | null;
  vouchers: { title: string; image: string; link: string; price: string; has_free: boolean; free: string }[] | null;
}

export default function GiftVouchers({ data }: { data: GiftVouchersData }) {
  return (
    <>
      {data.hero ? (
        <section className="hero-banner-section">
          <div className="ast-container">
            <div className="ast-row">
              <H
                className="hero-banner-content"
                style={{ background: `linear-gradient(90deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.25)), url('${data.hero.image}')` }}
                html={data.hero.text}
              />
            </div>
          </div>
        </section>
      ) : null}
      {data.vouchers ? (
        <section className="vouchers-grid">
          <div className="ast-container">
            <div className="ast-row">
              {data.vouchers.map((v, i) => (
                <div key={i} className="ast-col-md-4">
                  <div className={`gift-voucher-card ${v.has_free ? "has-free-voucher" : ""}`}>
                    <a href={v.link} className="clickbox" />
                    {v.has_free ? <H as="span" className="free-voucher-text" html={`receive an extra ${v.free}`} /> : null}
                    <div className="gift-voucher-card__image">
                      <img src={v.image} alt="" />
                    </div>
                    <div className="gift-voucher-card__body">
                      <H as="h6" className="gift-voucher-card__title" html={v.title} />
                      <H className="gift-voucher-card__price " html={v.price} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
