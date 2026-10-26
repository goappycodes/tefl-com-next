/**
 * "Become an Affiliate Template" — native port of page-affiliate.php.
 * Containers holding raw ACF values (and the Complianz-blocked iframe) are
 * written as HTML strings (see attrs.ts `el()`). Data: native/page-affiliate.php.
 */
import { el, html } from "../attrs";

export interface AffiliatePageData {
  ok: true;
  path: string;
  country: string;
  heading: string;
  iframe_html: string;
  faq: { question: string; answer: string }[];
  why: { paragraph: string; title: string; subtitle: string; small: string }[];
  form_html: string;
}

const WAVE =
  '<path fill="#000" fill-opacity="1" d="M0,128L120,122.7C240,117,480,107,720,101.3C960,96,1200,96,1320,96L1440,96L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>';

export default function AffiliatePage({ data }: { data: AffiliatePageData }) {
  const accordion = data.faq
    .map((f, i) =>
      el(
        "section",
        { class: "accordion-container" },
        `<input id="accordion-${i}" name="accordion-1" type="radio"${i === 0 ? " checked" : ""}>` +
          el("label", { for: `accordion-${i}` }, f.question) +
          el("article", null, f.answer),
      ),
    )
    .join("");
  const faq =
    data.iframe_html +
    "<hr>" +
    el("h3", null, "Become a Brand Ambassador for one of the fastest growing ESL companies") +
    el("div", { class: "accordion", id: "accordionExample" }, accordion) +
    el("p", { class: "question" }, "Become an ambassador today! Earn 13% each time you refer someone to the TEFL Institute.");

  return (
    <>
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col">
            <img src="https://tefl.ie/wp-content/uploads/2021/02/work-with-us-and-earn.jpg" />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col">
              <div className="heading" dangerouslySetInnerHTML={html(data.heading)} />
            </div>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-sm-12 ast-col-md-9">
              <div className="faq" dangerouslySetInnerHTML={html(faq)} />
            </div>
            <div className="ast-col-sm 12 ast-col-md-3">
              <img src="https://tefl.ie/wp-content/uploads/2021/02/Lauren-team-mate.jpg" />
              <br />
              <br />
              <img src="https://tefl.ie/wp-content/uploads/2021/02/David-team-mate.jpg" />
            </div>
          </div>
        </div>
      </div>

      <div className="choose-section section">
        <div className="ast-container">
          <h3>WHY CHOOSE US</h3>
          <div className="ast-row">
            {data.why.map((w, i) => (
              <div key={i} className="ast-col-md-4">
                <div className="item">
                  <div
                    className="w-100"
                    dangerouslySetInnerHTML={html(el("p", null, w.paragraph) + el("h2", null, w.title) + el("h3", null, w.subtitle) + el("span", null, w.small))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col">
              <div className="alert">
                {"Already an Ambassador? "}
                <a target="_blank" href="/affiliate-area/">
                  Log in
                </a>
                {" or access your "}
                <a href="https://teflinstitute.com/affiliate-area/">dashboard</a>.
              </div>
              <div className="pt-5 form-container" dangerouslySetInnerHTML={html(data.form_html)} />
            </div>
          </div>
        </div>
      </div>

      <div className="started-section section">
        <div className="ast-container">
          <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" dangerouslySetInnerHTML={html(WAVE)} />
          <div className="callback">
            <div className="ast-row d-flex align-items-end">
              <div className="ast-col-sm-12 ast-col-md-6">
                <p className="heading-sm">Ready to Get Started?</p>
                <p>Book an online meeting with us:</p>
                <a href="https://teflinstitute.com/callback/" className="button-rounded">
                  Choose a time and day here
                </a>
              </div>
              <div className="ast-col-sm-12 ast-col-md-6">
                <img src="https://tefl.ie/wp-content/uploads/2021/02/affiliate-banner-min.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
