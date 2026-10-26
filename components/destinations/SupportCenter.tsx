/**
 * TEFL support center archive — native port of the theme's page-supportcenter.php
 * page template (styled by ti-support-center.css). Its script
 * (ti-support-center.js) only drives filter tabs that the template has
 * commented out, so it is dropped with nothing to replace.
 *
 * Topic cards are written as HTML: the template prints empty `style=""`
 * attributes, which React would omit.
 */
import { attr, raw } from "./html";
import type { SupportCenterData } from "./types";

export default function SupportCenter({ d }: { d: SupportCenterData }) {
  const w = d.webinar;
  return (
    <>
      <section className="header-section">
        {/* The theme's own typo ("calss"), kept. */}
        <div {...{ calss: "ast-container" }}>
          <div className="ast-row">
            <div className="ast-col-lg-6" {...raw(`<h1 class="section-heading">${d.title}</h1><p>${d.stitle}</p>`)} />
          </div>
        </div>
      </section>

      <section className="upcoming-webinar">
        <div className="ast-container">
          <div className="ast-row">
            <h2 className="section-heading" {...raw(w.title)} />
            <div className="ast-col-md-12">
              <div className="live-webinar">
                <div className="live-webinar-image">
                  <img src={w.image} />
                </div>
                <div
                  className="live-webinar-details"
                  {...raw(
                    `<div class="webinar-title"><h3>${w.title}</h3></div>` +
                      `<div class="location"><h4>Location</h4><p>${w.location}</p></div>` +
                      `<div class="date"><h4>Date</h4><p>${w.date}</p></div>` +
                      `<div class="time"><h4>Time</h4><p>${w.time}</p></div>` +
                      `<div class="register"><h4>Register</h4><p><a href="#">REGISTER<i class="fa fa-angle-right"></i></a></p></div>`,
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ast-container">
        <a href="https://teflinstitute.com/webinars/" className="btn-block-black">
          view more upcoming dates
        </a>
      </div>

      <section className="blogs-section">
        <div className="ast-container">
          <h2 className="section-heading" />
          <div className="ast-row">
            <div className="ast-col-lg-12" />
          </div>
          <div className="ast-row">
            {d.cards.map((c, i) => {
              const ink = c.grey ? "color:#000" : "";
              return (
                <div
                  key={i}
                  className="ast-col-lg-4 ast-col-md-6 ast-col-sm-12"
                  {...raw(
                    `<div class="blog-item ${c.grey ? "white-bg" : ""}" style="${attr(c.style)}">` +
                      `<div class="bolg-content"><h3 style="${ink}">${c.title}</h3>` +
                      `<div class="support-excerpt" style="${ink}">${c.excerpt}</div></div>` +
                      `<a class="card-link" style="${ink}" href="${attr(c.url)}">READ MORE <i class="fa fa-angle-right"></i></a>` +
                      `</div>`,
                  )}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="test-section english-test-div">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <div className="take-the-test" style={{ background: `url('${d.test.background}')` }}>
                <div
                  className="take-the-test-content"
                  {...raw(
                    `<h3>${d.test.title}</h3><p>${d.test.content}</p>` +
                      `<a class="blog-link" href="${attr(d.test.link)}">${d.test.button} <i class="fa fa-angle-right"></i></a>`,
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
