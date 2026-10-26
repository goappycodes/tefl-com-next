/**
 * "Webinars" — native port of webinars.php. The template's inline script
 * (Register Now → Boxzilla popup, local-time rendering) is emitted as on live,
 * deferred for WpScripts. Card details holding raw ACF values are written as
 * HTML strings (see attrs.ts `el()`). Data: native/webinars.php.
 */
import { css, el, html, text } from "../attrs";

import { SCRIPTS } from "./inline";

export interface WebinarCard {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  zone: string;
  iso: string;
  image: string;
  label: string;
}

export interface WebinarsPageData {
  ok: true;
  path: string;
  country: string;
  webinars: WebinarCard[];
}

function details(w: WebinarCard): string {
  return (
    el("div", { class: "webinar-title" }, el("h3", null, w.title)) +
    el("div", { class: "location" }, el("h4", null, "Location") + el("p", null, w.location)) +
    el("div", { class: "date" }, el("h4", null, "Date") + el("p", null, w.date)) +
    el("div", { class: "time" }, el("h4", null, "Time") + el("p", null, `${w.time} (${text(w.zone)})`)) +
    (w.iso
      ? el(
          "div",
          { class: "local-time time", style: "display:none;" },
          el("h4", null, "Your Time") + el("p", { class: "ti-webinar-local-time", "data-start": w.iso, "data-uk-tz": "Europe/London" }),
        )
      : "") +
    el(
      "div",
      { class: "register" },
      el(
        "p",
        null,
        el("a", { href: "#", class: "ti-webinar-register", "data-box": "3092", "data-webinar": w.label, "data-webinar-id": String(w.id) }, "Register Now"),
      ),
    )
  );
}

export default function WebinarsPage({ data }: { data: WebinarsPageData }) {
  return (
    <>
      <section className="interactive-webinars-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <h1 className="font-600">COMPLIMENTARY INTERACTIVE WEBINARS</h1>
              <p>Join us for live interactive career boosting webinars</p>
            </div>
          </div>
        </div>
      </section>

      <section className="upcoming-webinars-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-12">
              <h3 className="section-title">UPCOMING EVENTS</h3>
            </div>
            {data.webinars.map((w) => (
              <div key={w.id} className="live-webinar ast-col-md-4">
                <div className="live-webinar-image" style={css(`background-image: url('${w.image}');`)} />
                <div className="live-webinar-details" dangerouslySetInnerHTML={html(details(w))} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <script type="text/tefl-deferred" dangerouslySetInnerHTML={html(SCRIPTS[0])} />
    </>
  );
}
