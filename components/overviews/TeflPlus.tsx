/**
 * TEFL Plus landing — native port of the theme's tefl-plus.php
 * (/the-tefl-plus/, /best-tefl-course/, /tefl-specialist-course-bundle/).
 * Same markup as the PHP template; the Splide gallery is driven by the theme
 * script. Data: wordpress/headless/native/tefl-plus.php.
 */
import { H, type OverviewsBase } from "./shared";

export interface TeflPlusData extends OverviewsBase {
  hero: { image: string; logo: string; icon: string; title: string; product_info: string; guide_180: string } | null;
  price: string;
  save: string;
  cart_url: string;
  features: { title: string; items: { icon: string; title: string; desc: string }[] } | null;
  included: { title: string; content: string } | null;
  cta_boxes: { image: string; title: string; desc: string; btn_text: string; btn_link: string }[] | null;
  gallery: string[] | null;
  logos1: string[];
  logos2: string[];
}

export default function TeflPlus({ data }: { data: TeflPlusData }) {
  const { hero } = data;
  const price = (className: string) => (
    <H className={className} html={`${data.price}\n<div class="savings">Save ${data.save}%</div>`} />
  );

  return (
    <div id="primary" className="content-area primary">
      {hero ? (
        <section className="section-padding hero-banner-section" style={{ backgroundImage: `url('${hero.image}')` }}>
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-6">
                <div className="hero-banner-content">
                  <H as="h1" className="banner-content__title large-heading" html={hero.title} />
                  <div className="hero-banner-content__body">
                    <div className="hero-banner-content__left">
                      <img src={hero.icon} alt="" />
                    </div>
                    <div className="hero-banner-content__right">
                      {price("product-price")}
                      <H className="product-summary" html={hero.product_info} />
                    </div>
                  </div>
                  <a href={data.cart_url} className="btn btn-primary-blue btn-centered">
                    Claim My Deal
                  </a>
                  {hero.guide_180 ? (
                    <>
                      {" "}
                      <a href={hero.guide_180} className="mt-1 btn btn-centered btn-outline" target="_blank">
                        Download 180 hour guide
                      </a>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="ast-col-md-6">
                {hero.logo ? (
                  <div className="banner-logo-container">
                    <img src={hero.logo} className="banner-slide__content-logo" alt="" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="main-section section-padding">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-7">
              {data.features ? (
                <div className="features">
                  <H as="h2" className="large-heading uppercase font-600 feature-section-heading" html={data.features.title} />
                  {data.features.items.map((f, key) => (
                    <div key={key} className="feature">
                      <H as="h5" className="feature-title font-700" html={`${key + 1}. ${f.title}`} />
                      <div className="feature-body">
                        <div className="feature-body__icon">
                          <img src={f.icon} alt="" />
                        </div>
                        <H className="feature-body__description" html={f.desc} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="ast-col-md-5">
              {data.included ? (
                <div className="whats-included">
                  <H as="h2" className="large-heading uppercase font-600 whats-included-heading" html={data.included.title} />
                  <H className="whats-included-content" html={data.included.content} />
                  {price("product-price text-center")}
                  <a href={data.cart_url} className="btn btn-red btn-centered">
                    add to cart
                  </a>
                </div>
              ) : null}
              {data.cta_boxes ? (
                <div className="cta-boxes">
                  {data.cta_boxes.map((c, i) => (
                    <div key={i} className="cta-box">
                      <div className="cta-box__left">
                        <img src={c.image} className="cta-image" alt="" />
                      </div>
                      <div className="cta-box__right">
                        <H as="h5" className="cta-title" html={c.title} />
                        <H className="cta-desc" html={c.desc} />
                        <H
                          as="a"
                          href={c.btn_link}
                          target="_blank"
                          className="btn btn-small btn-primary-blue btn-centered cta-btn"
                          html={c.btn_text}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      {data.gallery ? (
        <section className="gallery-section section-padding-bottom">
          <div className="splide photo-gallery" aria-label="photo-gallery">
            <div className="splide__track">
              <ul className="splide__list">
                {data.gallery.map((img, i) => (
                  <li key={i} className="splide__slide">
                    <img data-lity="" className="slide-imag no-lazy" src={img} alt="" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
      <section className="icon-banner-section section-padding-bottom">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12 logo-container">
              <div className="logo-group">
                {data.logos1.map((img, i) => (
                  <div key={i} className="image">
                    <img src={img} />
                  </div>
                ))}
              </div>
              <div className="logo-group">
                {data.logos2.map((img, i) => (
                  <div key={i} className="image">
                    <img src={img} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
