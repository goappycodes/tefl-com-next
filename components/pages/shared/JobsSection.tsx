/**
 * The "TEFL/TESOL Careers" jobs-feed section of page-teo.php (get_ti_jobs()
 * cards; data from tefl_native_pages_ti_jobs() in native/_pages.php). Card
 * values are raw feed text, so each card body is written as an HTML string.
 * The template leaves its .ast-container unclosed; the browser closes it at
 * </section>, which is the tree rendered here.
 */
import { el, html } from "../attrs";

export interface TiJob {
  title: string;
  logo: string;
  link: string;
  type: string;
  company: string;
  location: string;
  salary: string;
}

const META = (cls: string, icon: string, value: string) =>
  el("div", { class: `job-meta job-meta__${cls} ast-flex` }, el("img", { class: "job-meta_icon", src: icon, alt: "" }) + el("span", { class: "job-meta_value" }, value));

function card(j: TiJob): string {
  return (
    el("div", { class: "job-card__header" }, el("div", { class: "job-type" }, j.type) + el("div", { class: "job-image" }, el("img", { src: j.logo }))) +
    el(
      "div",
      { class: "job-card__body" },
      el("div", { class: "job-card__title" }, el("h4", null, j.title)) +
        el(
          "div",
          { class: "job-card__meta" },
          META("company", "/wp-content/uploads/2021/04/Company.svg", j.company) +
            META("location", "/wp-content/uploads/2021/04/Location.svg", j.location) +
            META("salary", "/wp-content/uploads/2021/04/Payment.svg", j.salary),
        ),
    ) +
    el(
      "div",
      { class: "job-card__footer" },
      el("a", { target: "_blank", href: j.link, class: "learn-more black-button" }, '<span>learn more</span><i class="fa fa-angle-right"></i>'),
    )
  );
}

export default function JobsSection({ jobs }: { jobs: TiJob[] }) {
  return (
    <section className="job-section">
      <div className="ast-container">
        <h3>TEFL/TESOL Careers</h3>
        <div className="ast-row">
          {jobs.map((j, i) => (
            <div key={i} className="ast-col-md-3">
              <a target="_blank" href={j.link} className="job-clickbox" />
              <div className="job-card" dangerouslySetInnerHTML={html(card(j))} />
            </div>
          ))}
        </div>
        <div className="button-container">
          <a href="https://jobs.teflinstitute.com/all-jobs" target="_blank" className="black-button">
            {"View All Jobs "}
            <i className="fa fa-angle-right" />
          </a>
        </div>
      </div>
    </section>
  );
}
