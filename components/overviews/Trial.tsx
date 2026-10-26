/**
 * 3 Days Free Trial — native port of the theme's trial.php (/test-tefl-course-free/).
 *
 * Same markup as the PHP template, including its inline `msg()` script and the
 * checkbox's `oninput="msg(this)"` (the checkbox reveals the "Start your Free
 * Trial" button). The script only defines a function, so it runs as the page
 * is parsed, exactly as on live. Data: wordpress/headless/native/trial.php.
 */
import { esc, H, type OverviewsBase } from "./shared";

export interface TrialData extends OverviewsBase {
  hero: { title: string; image: string; heading: string; content: string; warning: string; secure: string };
  links: { terms: string; privacy: string; trial: string };
  why: { title: string; points: { icon: string; heading: string; text: string }[] };
}

const MSG_SCRIPT = `
							function msg(is) {
								var btn = document.getElementById('img-btn-div');
								if(is.checked) {
									btn.style.display = 'flex';
								} else {
									btn.style.display = 'none';
								}
							}
						`;

export default function Trial({ data }: { data: TrialData }) {
  const { hero, links, why } = data;
  // The consent checkbox carries an inline handler (oninput="msg(this)"), which React can't
  // print; the label's content is the template's own HTML.
  const consent =
    `<input class="checkbox" type="checkbox" oninput="msg(this)" name="permission" value="I give my permission to TEFL Institute to email me">` +
    `I have read and agree to the <a href="${esc(links.terms)}" target="_blank">terms &amp; conditions</a> and ` +
    `<a href="${esc(links.privacy)}" target="_blank">privacy policy</a>.`;

  return (
    <div id="primary" className="content-area primary">
      <div className="section banner-section" style={{ backgroundImage: "url(https://tefl.ie/wp-content/uploads/2021/09/elt-bg.jpg)" }}>
        <div className="ast-row">
          <div className="ast-col-md-12">
            <H as="h1" className="elt-heading" html={hero.title} />
          </div>
        </div>
        <div className="ast-row">
          <div className="ast-col-md-2" />
          <div className="ast-col-md-8 banner-content-col">
            <div className="ast-row">
              <div className="ast-col-md-5 banner-content-img-col">
                <div className="banner-content-img">
                  <img src={hero.image} />
                </div>
              </div>
              <div className="ast-col-md-7 banner-content-txt-col">
                <div className="banner-content-inner">
                  <H className="banner-content-txt-wrap heading" html={hero.heading} />
                  <H className="banner-content-txt-wrap content" html={hero.content} />
                  <H className="warning" html={hero.warning} />
                  <H className="secure" html={hero.secure} />

                  <H as="span" className="wpcf7-list-item" html={consent} />
                  <div className="img-btn-div" id="img-btn-div" style={{ display: "none" }}>
                    <a className="english-test-btn btn btn-secondary yellow-btn" href={links.trial}>
                      Start your Free Trial
                    </a>
                  </div>
                  <script dangerouslySetInnerHTML={{ __html: MSG_SCRIPT }} />
                </div>
              </div>
            </div>
          </div>
          <div className="ast-col-md-2" />
        </div>
      </div>

      <div className="section elt-feat-section">
        <div className="ast-container elt-feat-container">
          <div className="ast-row elt-feat-head-row">
            <div className="ast-col-md-12">
              <H as="h3" className="elt-sec-heading" html={why.title} />
            </div>
          </div>
          <div className="ast-row elt-feat-content-row">
            {why.points.map((e, i) => (
              <div key={i} className="ast-col-md-4 elt-feat-content-col">
                <div className="elt-feat-inner">
                  <div className="img-div">
                    <img src={e.icon} />
                  </div>
                  <H as="h5" html={e.heading} />
                  <H as="p" html={e.text} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
