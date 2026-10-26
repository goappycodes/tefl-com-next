/**
 * "Meet The Team" — native port of meet-the-team.php. The tabs are driven by
 * the theme's own script (data-tab-target / data-tab-content). Containers
 * holding raw ACF values are written as HTML strings (see attrs.ts `el()`).
 * Data: native/meet-the-team.php.
 */
import { el, html } from "../attrs";

import type { TeamMember, TeamPageData } from "./types";

function member(m: TeamMember): string {
  return (
    el("div", { class: "team-member-image", style: `background-image: url('${m.image}'); background-position: ${m.position};` }) +
    el("h5", { class: "team-member-name" }, m.name) +
    el("h5", { class: "team-member-title" }, m.title) +
    el("p", { class: "team-member-about" }, m.about)
  );
}

export default function TeamPage({ data }: { data: TeamPageData }) {
  const n2 = data.council.length;
  return (
    <>
      <section className="header-section">
        {/* The template's own typo: `calss`. */}
        <div {...{ calss: "ast-container" }}>
          <div className="ast-row">
            <div
              className="ast-col-lg-6"
              dangerouslySetInnerHTML={html(el("h1", { class: "section-heading" }, data.title) + el("p", null, data.subtitle))}
            />
          </div>
        </div>
      </section>

      <section className="meet-the-team-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <div className="meet-the-team-tabs">
                <div className="tabs">
                  <a className="tablinks active" data-tab-target="#mno" href="#mno">
                    management and operations team
                  </a>
                  <a className="tablinks" data-tab-target="#ac" href="#ac">
                    academic team
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="teams-section">
        <div className="management-operations active" data-tab-content="" id="mno">
          <div className="ast-container">
            <div className="ast-row">
              {data.management.map((m, i) => (
                <div key={i} className="ast-col-lg-4  ast-col-md-6 ast-col-sm-12">
                  <div className="team-member " dangerouslySetInnerHTML={html(member(m))} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="academic-council" data-tab-content="" id="ac">
          <div className="ast-container">
            <div className="ast-row">
              {data.council.map((m, i) => (
                <div key={i} className="ast-col-lg-4  ast-col-md-6 ast-col-sm-12">
                  <div
                    className={`team-member  ${n2 === 3 ? "no-border" : ""}${i + 1 === n2 ? " last" : ""}`}
                    dangerouslySetInnerHTML={html(member(m))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12" dangerouslySetInnerHTML={html(el("h2", { class: "section-heading" }, data.contact.heading))} />
          </div>
          {data.contact.has_items ? (
            <div className="ast-row contact-icons">
              {data.contact.items.map((c, i) => (
                <div
                  key={i}
                  className="ast-col-md-3 ast-col-xs-6"
                  dangerouslySetInnerHTML={html(
                    el("img", { src: c.icon }) + el("h3", null, c.title) + el("p", null, c.subtitle) + el("p", null, c.details),
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
