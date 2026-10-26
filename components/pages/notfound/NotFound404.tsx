/**
 * 404 page — native port of the child theme's 404.php. Static apart from the
 * #primary classes and the [tefl_course_search] picker (theme shortcode output,
 * passed through; the theme's course-search script drives it).
 * Data: wordpress/headless/native/404.php.
 */
import { css, html } from "../attrs";

import { NOT_FOUND_CSS } from "./styles";
import type { NotFoundData } from "./types";

const ITEMS = [
  { img: "https://tefl.ie/wp-content/uploads/2020/12/plaptop-notepad-1.jpg", href: "/tefl-courses/", label: "Course Overview" },
  { img: "https://tefl.ie/wp-content/uploads/2023/02/travel-homepage.png", href: "/tefl-internships/", label: "Internships" },
  { img: "https://tefl.ie/wp-content/uploads/2022/04/60-hour-level-5-featured.jpg", href: "https://jobs.teflinstitute.com/?ref=ticom", label: "TEFL Jobs" },
];

export default function NotFound404({ data }: { data: NotFoundData }) {
  return (
    <>
      <style dangerouslySetInnerHTML={html(NOT_FOUND_CSS)} />

      <div id="primary" className={data.primary_class}>
        <div className="main">
          <h1 className="title">This page doesn&#39;t seem to exist.</h1>
          <h2 className="subtitle">It looks like the link pointing here was faulty. Maybe try one of these:</h2>
        </div>

        <div className="grid">
          {ITEMS.map((it) => (
            <div key={it.label} className="item">
              <div className="image" style={css(`background-image: url('${it.img}');`)} />
              <a className="btn btn-primary" href={it.href}>
                {it.label}
              </a>
            </div>
          ))}
        </div>

        <section className="search-picker-section">
          <div className="ast-container">
            <h1 className="section-heading">Find the Perfect TEFL Course</h1>
            <div className="ast-row">
              <div className="ast-col-lg-12 ast-col-md-12 ast-col-sm-12" dangerouslySetInnerHTML={html(data.course_search_html)} />
            </div>
          </div>
        </section>

        <section className="tabs-section">
          <div className="ast-container tabs-column">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <div className="english-test">
                  <div className="english-test-inner">
                    <h3>tefl institute english level test</h3>
                    <p>
                      Test your level of English to see if EFL teacher training is for you and which course will suit you
                      best! A quick 5-minute test will tell you all you need to know.
                    </p>
                    <a className="learn-more-button" href="https://tefl.ie/english-level-test/">
                      {"Take the Test Now "}
                      <span>&gt;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ast-container tabs-column">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <div className="salary-calculator">
                  <div className="salary-calculator-inner">
                    <h3>Salary Calculator</h3>
                    <p>How much can you earn teaching English Online? Calculater your salary now.</p>
                    <a className="learn-more-button" href="/salary-calculator/">
                      {"Calculate Salary "}
                      <span>&gt;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
