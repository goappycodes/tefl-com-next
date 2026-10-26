/**
 * Alert sign-up — native port of the theme's single-alerts.php (styled by
 * ti-single-alerts.css). The template opens its own nested
 * `#content.site-content` inside the content slot; kept, as on live. Its
 * inline script is rendered deferred (WpScripts runs it once jQuery is in);
 * the CF7 form is WordPress output.
 */
import { raw } from "./html";
import type { AlertData } from "./types";

export default function Alert({ d }: { d: AlertData }) {
  return (
    <>
      <script type="text/tefl-deferred" {...raw(d.script)} />
      <div id="content" className="site-content">
        <div className="ast-container">
          <section className="header-section">
            {/* The theme's own typo ("calss"), kept. */}
            <div {...{ calss: "ast-container" }}>
              <div className="ast-row">
                <div className="ast-col-lg-6" {...raw(`<h1 class="section-heading">${d.title}</h1><p>${d.content}</p>`)} />
              </div>
            </div>
          </section>
        </div>
        <section className="contact-form-section">
          <div className="ast-container">
            <div className="ast-row callback-form">
              <div className="ast-col-md-8 contact-form-col">
                <div className="callback-form-div" {...raw(d.form_html)} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
