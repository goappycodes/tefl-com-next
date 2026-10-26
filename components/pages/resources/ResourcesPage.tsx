/**
 * "Teach English Resources" — native port of page-resources.php (its inline
 * style block included). Data: native/page-resources.php.
 */
import { css, html } from "../attrs";

import { STYLES } from "./inline";

export interface ResourcesPageData {
  ok: true;
  path: string;
  country: string;
  hero: { image: string; title: string; subtitle: string };
  freebie: { title: string; content: string; image: string; btn: string; link: string };
  guide: { title: string; content: string; image: string; btn: string; link: string };
  products: { image: string; title: string; content: string; price_html: string; cart_url: string }[];
}

export default function ResourcesPage({ data }: { data: ResourcesPageData }) {
  const { hero, freebie, guide } = data;
  return (
    <>
      <style id="wpr-usedcss" dangerouslySetInnerHTML={html(STYLES[0])} />
      <section className="hero-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <div
                data-bg={hero.image}
                className="hero-container rocket-lazyload entered error"
                style={css(`background-image: url('${hero.image}');`)}
                data-ll-status="error"
              >
                <div className="hero-inner">
                  <h1 dangerouslySetInnerHTML={html(hero.title)} />
                  <h2 dangerouslySetInnerHTML={html(hero.subtitle)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="freebie-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-6">
              <div className="freebie-inner">
                <h2 dangerouslySetInnerHTML={html(freebie.title)} />
                <div className="content" dangerouslySetInnerHTML={html(freebie.content)} />
              </div>
            </div>
            <div className="ast-col-md-6">
              <div className="freebie-inner">
                <div
                  data-bg={freebie.image}
                  className="image rocket-lazyload entered error"
                  style={css(`background-image: url('${freebie.image}');`)}
                  data-ll-status="error"
                />
                <a href={freebie.link} dangerouslySetInnerHTML={html(freebie.btn)} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="guide-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="guide-container">
              <div className="ast-col-md-6">
                <div className="guide-inner">
                  <div
                    data-bg={guide.image}
                    className="image rocket-lazyload entered exited error"
                    style={css(`background-image: url('${guide.image}');`)}
                    data-ll-status="error"
                  />
                </div>
              </div>
              <div className="ast-col-md-6">
                <div className="guide-inner">
                  <h2 dangerouslySetInnerHTML={html(guide.title)} />
                  <div className="content" dangerouslySetInnerHTML={html(guide.content)} />
                  <a href={guide.link} dangerouslySetInnerHTML={html(guide.btn)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="products-section">
        <div className="ast-container">
          <div className="ast-row ast-flex">
            {data.products.map((p, i) => (
              <div key={i} className="ast-col-md-4">
                <div className="product-card">
                  <div data-bg={p.image} className="image rocket-lazyload" style={css(`background-image: url('${p.image}');`)} />
                  <h2 dangerouslySetInnerHTML={html(p.title)} />
                  <div className="content" dangerouslySetInnerHTML={html(p.content)} />
                  <div className="price" dangerouslySetInnerHTML={html(p.price_html)} />
                  <div className="buttons">
                    <a rel="nofollow" href={p.cart_url} className="add-to-cart">
                      Add to Cart
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
