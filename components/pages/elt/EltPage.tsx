/**
 * "English Level Test Template" — native port of page-elt.php (its stray
 * Stripe stylesheet / checkout script tags included, the script deferred for
 * WpScripts). Containers holding raw ACF values are written as HTML strings
 * (see attrs.ts `el()`). Data: native/page-elt.php.
 */
import { css, el, html } from "../attrs";

export interface EltPageData {
  ok: true;
  path: string;
  country: string;
  banner: { image: string; title: string; subtitle: string; text: string };
  elt: { image: string; heading: string; text: string };
  quiz_html: string;
}

export default function EltPage({ data }: { data: EltPageData }) {
  const b = data.banner;
  return (
    <>
      <link
        rel="stylesheet"
        id="stripe_styles-css"
        href="/wp-content/plugins/woocommerce-gateway-stripe/assets/css/stripe-styles.css?ver=4.2.0"
        type="text/css"
        media="all"
      />
      <script type="text/tefl-deferred" src="/wp-content/plugins/woocommerce/assets/js/frontend/checkout.min.js?ver=3.6.2" />

      <section className="banner-section" style={css(`background-image:url('${b.image}')`)}>
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-lg-6 ast-col-md-8">
              <div
                className="banner-content-block"
                dangerouslySetInnerHTML={html(
                  el(
                    "div",
                    { class: "content-block" },
                    el("h1", { class: "section-heading" }, b.title) +
                      el("h2", null, b.subtitle) +
                      el("p", null, b.text) +
                      el("img", { src: "/wp-content/uploads/2020/11/Group-57.svg" }),
                  ) + '<a class="english-test-btn" href="#eltQuiz">Take Quiz Now <i class="fa fa-angle-right"></i></a>',
                )}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="tefl-institute-london-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-6">
              <img className="elt-section-img" src={data.elt.image} />
            </div>
            <div
              className="ast-col-md-6"
              dangerouslySetInnerHTML={html(el("h2", { class: "section-heading" }, data.elt.heading) + el("p", null, data.elt.text))}
            />
          </div>
        </div>
      </section>

      <hr />
      <section className="hidden" id="eltQuiz">
        <div className="ast-container">
          <div className="ast-row quiz-registration" dangerouslySetInnerHTML={html(data.quiz_html)} />
        </div>
      </section>
    </>
  );
}
