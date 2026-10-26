/**
 * All TEFL jobs — native port of the theme's page-all-jobs.php page template
 * (styled by ti-job-service.css + ti-all-jobs.css). The theme's
 * ti-all-jobs.js (load more, AJAX job search) still runs over this markup.
 */
import { raw } from "./html";
import type { AllJobsData } from "./types";

const ICON = "https://teflinstitute.com/wp-content/uploads/2021/04";

function iconLine(cls: string, icon: string, html: string) {
  return (
    <p className={cls} {...raw(`<span class="job-icons" style="background-image: url('${ICON}/${icon}.svg')"></span> ${html}`)} />
  );
}

export default function AllJobs({ d }: { d: AllJobsData }) {
  return (
    <>
      <section className="banner-section">
        <div
          className="ast-container"
          style={{ background: "url('https://teflinstitute.com/wp-content/uploads/2021/02/gabriel-benois-qnWPjzewewA-unsplash-1-scaled.jpg')" }}
        >
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <div className="search-bar">
                <input className="job-search" type="text" placeholder="Job Search.." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {d.jobs ? (
        <section className="job-section">
          <div className="ast-container">
            <h1 className="section-heading">Jobs</h1>
            <img src="https://teflinstitute.com/wp-content/uploads/2021/02/loader.gif" className="job-preloader" />
            <div className="ast-row job-row">
              {d.jobs.map((j) => (
                <div
                  key={j.count}
                  className={`ast-col-lg-3 ast-col-md-3 ast-col-sm-12 ast-col-xs-12 job-col job-${j.count} job-${j.id}`}
                >
                  <div className="job inner-div">
                    {j.info ? (
                      <div className="job__info">
                        {j.type ? (
                          <p className="job-type">
                            <span {...raw(j.type)} />
                          </p>
                        ) : null}
                        <div className="job__img">
                          <img src={j.logo} />
                        </div>
                        {j.title ? <h6 className="job-title" {...raw(j.title)} /> : null}
                        {j.company ? iconLine("comp-name", "Company", j.company) : null}
                        {j.location ? iconLine("job-location", "Location", j.location) : null}
                        {j.rate ? iconLine("job-rate", "Payment", j.rate) : null}
                      </div>
                    ) : null}
                    {j.link ? (
                      <div className="job__cta">
                        <a className="btn" target="_blank" href={j.link}>
                          learn more <i className="fa fa-angle-right" />
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div id="loadMore">Load more</div>
          </div>
        </section>
      ) : null}
    </>
  );
}
