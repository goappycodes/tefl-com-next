/**
 * "Callback Template" — native port of page-callback.php. The template's
 * inline script (time-zone aware "when to call" picker, jQuery) and style
 * block are emitted as on live, the scripts deferred for WpScripts.
 * Data: native/page-callback.php.
 */
import { css, el, html, text } from "../attrs";

import { SCRIPTS, STYLES } from "./inline";

const TRUSTPILOT =
  '<h1 class="section-heading" style="text-align: center;text-transform: uppercase;">What Our Students Say About Us</h1>' +
  '<script type="text/tefl-deferred" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>' +
  '<div class="trustpilot-widget" data-locale="en-GB" data-template-id="54ad5defc6454f065c28af8b" data-businessunit-id="61c0c19118c53fc28bcc355d" data-style-height="240px" data-style-width="100%" data-tags="Team" data-stars="3,4,5" data-review-languages="en">' +
  '   <a href="https://uk.trustpilot.com/review/teflinstitute.com" target="_blank" rel="noopener">Trustpilot</a> </div>';

export interface CallbackPageData {
  ok: true;
  path: string;
  country: string;
  banner: { image: string; title: string; subtitle: string; text: string; btn_text: string } | null;
  form_html: string;
}

export default function CallbackPage({ data }: { data: CallbackPageData }) {
  const b = data.banner;
  return (
    <>
      {b ? (
        <section className="banner-section" style={css(`margin-bottom: 80px; background-image:url('${b.image}')`)}>
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-6 ast-col-md-offset-6">
                <div
                  className="banner-content-block"
                  dangerouslySetInnerHTML={html(
                    el("div", { class: "content-block" }, el("h2", { class: "section-heading" }, b.title) + el("h3", null, b.subtitle) + el("p", null, b.text)) +
                      el("a", { href: "#contactForm" }, `${text(b.btn_text)} <i class="fa fa-angle-right"></i>`),
                  )}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section id="contactForm" className="contact-form-section">
        <div className="ast-container">
          <div className="ast-row callback-form">
            <div className="ast-col-md-10 contact-form-col">
              <div className="callback-form-div" dangerouslySetInnerHTML={html(data.form_html)} />
            </div>
          </div>
          <div className="ast-row d-none">
            {/* Written as HTML: React would hoist an async <script src> into <head>. */}
            <div style={css("margin: auto;max-width: 1100px;padding-bottom: 2rem;")} dangerouslySetInnerHTML={html(TRUSTPILOT)} />
          </div>
        </div>
      </section>

      <script type="text/tefl-deferred" dangerouslySetInnerHTML={html(SCRIPTS[1])} />

      <style dangerouslySetInnerHTML={html(STYLES[0])} />
    </>
  );
}
