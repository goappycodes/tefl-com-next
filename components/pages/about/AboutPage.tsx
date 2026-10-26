/**
 * "About Us" — native port of about.php. Data: native/about.php.
 *
 * The template echoes WYSIWYG values into its own <p>/<h2> (live has
 * `<p><h3>…`), so the columns holding them are written as HTML strings (see
 * `el()`), letting the browser split them exactly as on live.
 */
import { css, el, html, text } from "../attrs";

import type { AboutPageData } from "./types";

export default function AboutPage({ data }: { data: AboutPageData }) {
  const b = data.banner;
  return (
    <>
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
                    el("h2", { class: "section-heading" }, b.title) +
                      el("h3", null, b.subtitle) +
                      el("p", null, b.text) +
                      el("img", { src: "/wp-content/uploads/2020/11/Group-57.svg" }),
                  ) + el("a", { href: b.btn_link }, `${text(b.btn_text)} <i class="fa fa-angle-right"></i>`),
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
              <img src={data.about.image} />
            </div>
            <div
              className="ast-col-md-6"
              dangerouslySetInnerHTML={html(el("h2", { class: "section-heading" }, data.about.heading) + el("p", null, data.about.text))}
            />
          </div>
        </div>
      </section>

      <section className="our-core-values-section">
        <div className="ast-container our-core-values-container">
          <div className="ast-row our-core-values-row">
            <div className="ast-col-md-12" dangerouslySetInnerHTML={html(el("h2", { class: "section-heading" }, data.core.heading))} />
          </div>
          {data.core.has_values ? (
            <div className="ast-row our-core-values-row">
              {data.core.values.map((v, i) => (
                <div
                  key={i}
                  className="ast-col-lg-3 ast-col-md-6 ast-col-xs-6 our-core-values-col"
                  dangerouslySetInnerHTML={html(el("img", { src: v.icon }) + el("h3", null, v.title) + el("p", null, v.text))}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="makes-us-different-section">
        <div className="ast-container">
          <div className="ast-row">
            <div
              className="ast-col-md-6"
              dangerouslySetInnerHTML={html(el("h2", { class: "section-heading" }, data.more.heading) + el("p", null, data.more.text))}
            />
            <div className="ast-col-md-6">
              <img src={data.more.image} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
