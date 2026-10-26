/**
 * Country guides index — native port of the theme's page-teach-english-jobs.php
 * page template (styled by ti-teach-english-jobs.css; no script). The
 * per-continent queries run in WordPress (native/teach_english_jobs.php).
 */
import { raw } from "./html";
import type { TeachEnglishJobsData } from "./types";

export default function TeachEnglishJobs({ d }: { d: TeachEnglishJobsData }) {
  return (
    <>
      <section className="hero-section" style={{ backgroundImage: `url('${d.hero.image}')` }}>
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col">
              <div className="hero-inner">
                <h1 {...raw(d.hero.title)} />
                <h2 {...raw(d.hero.subtitle)} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {d.sections.map((s, i) => (
        <section key={i} className="jobs-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                {/* The theme's own typo ("classs"), kept. */}
                <h3 {...{ classs: "continent" }} {...raw(s.continent)} />
              </div>
              {s.cards.map((c, j) => (
                <div key={j} className="ast-col-md-4">
                  <div className="job-inner">
                    <div className="thumbnail" style={{ backgroundImage: `url('${c.thumbnail}')` }} />
                    <div className="info">
                      <div>
                        <div className="country" {...raw(c.country)} />
                        <div className="description" {...raw(c.description)} />
                        <a href={c.url} className="link" {...raw(`Read ${c.country} Guide`)} />
                      </div>
                      <a href="" className="guide" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
