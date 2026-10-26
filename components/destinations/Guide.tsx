/**
 * Guide download page — native port of the theme's single-guide.php
 * (styled by ti-single-guide.css). The CF7 form is WordPress output (HTML);
 * the template's inline script is rendered deferred, so WpScripts runs it in
 * document order once jQuery is in, as the passthrough page does.
 */
import { raw } from "./html";
import type { GuideData } from "./types";

const DLOPO_INIT = `
                           window.dlopoEmbed = {
                              mode: "element",
                              ownerUsername: "chloe-joomun",
                              linkSlug: "intro-call"
                           };
                        `;

export default function Guide({ d }: { d: GuideData }) {
  return (
    <>
      <div id="primary" className="content-area primary">
        <section className="header-section">
          {/* The theme's own typo ("calss"), kept. */}
          <div {...{ calss: "ast-container" }}>
            <div className="ast-row">
              <div className="ast-col-12">
                {d.image ? <img className="image" src={d.image} /> : null}
                <h1 className="section-heading" {...raw(d.title)} />
                {d.book_call ? (
                  <div>
                    <p style={{ textAlign: "center" }}>
                      Prefer to chat directly?
                      <a href="https://dlopo.com/school-elective/intro-call" data-dlopo-embed="true" style={{ textDecoration: "underline" }}>
                        Book a call
                      </a>
                    </p>
                    <script type="text/tefl-deferred" {...raw(DLOPO_INIT)} />
                    <script type="text/tefl-deferred" src="https://dlopo.com/embed.js" defer />
                  </div>
                ) : null}
                <h2 className="subsection-heading" {...raw(d.description)} />
              </div>
            </div>
          </div>
        </section>
        <section className="form-section">
          <div className="ast-container">
            <div className="ast-row form-box">
              <div className="ast-col-12">
                <div className="form" {...raw(d.form_html)} />
              </div>
            </div>
          </div>
        </section>
      </div>
      <script type="text/tefl-deferred" {...raw(d.script)} />
    </>
  );
}
