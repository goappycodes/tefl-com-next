/**
 * Single placement — native port of the theme's single-placement.php (styled by
 * ti-single-placement.css) and, for virtual courses, the wrapper of
 * includes/virtual-course-variation.php. The timetable panes (WooCommerce
 * prices, seats, JSON-LD) and the CF7 form are WordPress output; the
 * countdown script is rendered deferred so WpScripts runs it in document
 * order, as on the passthrough page. Tabs / "show all dates" come from the
 * theme's shared ti-single-course.js, which still runs.
 */
import { attr, raw } from "./html";
import type { PlacementData } from "./types";

const CHECK_SVG =
  '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>';

function Included({ id, items }: { id: string; items: string[] }) {
  return (
    <div className="content" id={id}>
      {items.map((item, i) => (
        <div key={i} className="included__item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-check-circle"
            {...raw(CHECK_SVG)}
          />
          <span {...raw(item)} />
        </div>
      ))}
    </div>
  );
}

const TIMEZONES: { key: string; li: string; label: string; city: string }[] = [
  { key: "london", li: "london-li", label: "UK", city: " (London)" },
  { key: "boston", li: "boston-li", label: "USA", city: " (Boston)" },
  { key: "vancouver", li: "vancouver-li", label: "Canada", city: " (Vancouver)" },
  { key: "southafrica", li: "southafrica-li", label: "South Africa", city: " (Cape Town)" },
];

function Virtual({ v }: { v: NonNullable<PlacementData["virtual"]> }) {
  return (
    <div className="section section-padding timetable-section" id="timetable">
      <div className="ast-container">
        <div className="ast-row course_content_row">
          <div className="ast-col-md-12 tablecontent-col">
            <h6 className="centered common-heading section-heading">Select your Virtual Course Date</h6>
            <ul className="nav nav-tabs">
              {TIMEZONES.map((tz, i) => (
                <li key={tz.key} role="presentation" className={tz.li}>
                  <a data-title={tz.key} className={i === 0 ? "active" : undefined}>
                    <i className="fa fa-angle-double-right" />
                    {tz.label}
                    <span>{tz.city}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className={`tab-content ${v.day_light}`}>
              {TIMEZONES.map((tz, i) => (
                <div key={tz.key} className={`${tz.key} tab-pane fade in${i === 0 ? " active" : ""}`} {...raw(v.panes[tz.key])} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Placement({ d }: { d: PlacementData }) {
  const o = d.origin;
  return (
    <div id="primary" className="content-area primary">
      <div className="hero">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <h1 className="heading" {...raw(d.hero.title)} />
            </div>
          </div>
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <div className="hero__container" style={{ backgroundImage: `url('${d.hero.background}')` }}>
                <div className="collage">
                  {(d.hero.collage ?? []).map((p, i) => (
                    <div key={i} className="polaroid" id={`polaroid${i}`}>
                      <div className="polaroid__photo" style={{ backgroundImage: `url('${p}')` }} />
                    </div>
                  ))}
                </div>
                <h2 className="sub__heading" {...raw(d.hero.subtitle)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col ast-col-md-4 ast-col-sm-12 placement-sidebar-col sticky">
              <div className="sidebar">
                <div className="sidebar__type" {...raw(d.sidebar.type)} />
                <h2 className="sidebar__heading" {...raw(d.hero.subtitle)} />
                <div className="sidebar__info">
                  <div className="ast-container">
                    <div className="ast-row">
                      {d.sidebar.info.map((it, i) => (
                        <div key={i} className="ast-col-md-6">
                          <div className="info__item">
                            <div className="info__top" {...raw(it.title)} />
                            <div className="info__bottom" {...raw(it.subtitle)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="sidebar__price">
                  <span className="regular" {...raw(d.was)} />
                  <span className="sale" {...raw(d.now)} />
                </div>
                {d.timer ? <script type="text/tefl-deferred" {...raw(d.timer_script)} /> : null}
                {d.timer ? (
                  <div className="mid-col__body hascountdown">
                    <div className="save">Time left to save!</div>
                    <ul className="timer">
                      <li>
                        <span id="day" />
                        <span id="day-text">Days</span>
                      </li>
                      <li className="separator">:</li>
                      <li>
                        <span id="hour" />
                        <span id="hour-text">Hrs</span>
                      </li>
                      <li className="separator">:</li>
                      <li>
                        <span id="minute" />
                        <span id="minute-text">Mins</span>
                      </li>
                      <li className="separator">:</li>
                      <li>
                        <span id="second" />
                        <span id="second-text">Sec</span>
                      </li>
                    </ul>
                  </div>
                ) : null}
                <div className="sidebar__buttons">
                  <a href="#boxzilla-7169">
                    Download
                    <i className="fa fa-angle-right" />
                  </a>
                  <a href="#timetable">
                    Apply Today
                    <i className="fa fa-angle-right" />
                  </a>
                </div>
              </div>
            </div>

            <div className="ast-col ast-col-md-8 ast-col-sm-12">
              <div className="introduction">
                <h3 className="main__heading">Introduction</h3>
                <div className="content" {...raw(d.introduction)} />
              </div>

              <div className="included">
                <hr />
                <h3 className="main__heading">What&apos;s Included</h3>
                <input type="radio" id="tab1" name="tab" defaultChecked />
                <label htmlFor="tab1">Inclusions</label>
                <input type="radio" id="tab2" name="tab" />
                <label htmlFor="tab2">Requirements</label>
                <input type="radio" id="tab3" name="tab" />
                <label htmlFor="tab3">What do I need to Organise</label>
                <div className="line" />
                <div className="content-container">
                  <Included id="c1" items={d.inclusions} />
                  <Included id="c2" items={d.requirements} />
                  <Included id="c3" items={d.organise} />
                </div>
              </div>

              {d.virtual ? <Virtual v={d.virtual} /> : null}

              <div className="location section">
                <div className="ast-row">
                  <div className="ast-col ast-col-md-12">
                    <h3 className="main__heading">Location</h3>
                    <div className="location__content" {...raw(d.location.content)} />
                  </div>
                </div>
                <div className="ast-row location__container">
                  <div className="ast-col ast-col-md-6">
                    <div className="location__map">
                      <img src={d.location.map} />
                    </div>
                  </div>
                  <div className="ast-col ast-col-md-6">
                    <div
                      className="learn-more-form"
                      {...raw(
                        `<div class="form-head-row">` +
                          (d.location.form_content ? `<div class="form-content">${d.location.form_content}</div>` : "") +
                          (d.location.form_image ? `<img class="form-img" src="${attr(d.location.form_image)}">` : "") +
                          `</div>${d.location.form_html}`,
                      )}
                    />
                  </div>
                </div>
              </div>

              <div
                className="guide-left-outer section"
                style={{ backgroundImage: "url('https://teflinstitute.com/wp-content/uploads/2021/07/job-hunters-background.png')" }}
              >
                <div className="guide-left">
                  <h6 className="section-heading">Job Hunter&apos;s Guide</h6>
                  <p className="">
                    Your first steps to becoming a fully accredited, internationally recognised EFL/ESL teacher within 4 weeks!
                  </p>
                  <img src="https://teflinstitute.com/wp-content/uploads/2021/07/job-hunters-mock.png" />
                  <a href="#boxzilla-7169">
                    <span>Download Now</span>
                    <i className="fa fa-angle-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
