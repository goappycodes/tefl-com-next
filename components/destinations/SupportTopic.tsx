/**
 * Single support topic — native port of the theme's single-support_centre.php
 * (styled by ti-single-support-center.css; no script). The template wraps its
 * WYSIWYG values in <p>, so those blocks are written as HTML at the enclosing
 * <div>, where the browser splits the nested paragraphs exactly as on live.
 */
import { raw } from "./html";
import type { SupportTopicData } from "./types";

export default function SupportTopic({ d }: { d: SupportTopicData }) {
  return (
    <div id="primary" className="content-area primary">
      <section className="header-section">
        {/* The theme's own typo ("calss"), kept. */}
        <div {...{ calss: "ast-container" }}>
          <div className="ast-row">
            <div className="ast-col-lg-8" {...raw(`<h1 class="section-heading">${d.heading}</h1><p>${d.subheading}</p>`)} />
          </div>
        </div>
      </section>
      <section className="content-area">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-lg-12" {...raw(`<p>${d.details}</p>`)} />
          </div>
        </div>
      </section>
      <div className="nav-btns">
        <span className="nav-btn-prev">
          <a href="#">
            <i className="fa fa-angle-left" />
            previous
          </a>
        </span>
        <span className="nav-btn-next">
          <a href="#">
            next
            <i className="fa fa-angle-right" />
          </a>
        </span>
      </div>
    </div>
  );
}
