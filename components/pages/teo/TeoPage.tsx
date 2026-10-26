/**
 * "Teach English Online" — native port of page-teo.php. Containers holding
 * raw ACF values are written as HTML strings (see attrs.ts `el()`), so the
 * browser splits `<p>` around block content exactly as on live.
 * Data: native/page-teo.php.
 */
import { css, el, html } from "../attrs";
import JobsSection, { type TiJob } from "../shared/JobsSection";

export interface TeoPageData {
  ok: true;
  path: string;
  country: string;
  hero: { image: string; title: string; subtitle: string };
  top: { image: string; title: string; description: string };
  bottom: { image: string; title: string; description: string };
  started: { title: string; description: string; link: string };
  why: { title: string; items: { icon: string; description: string }[] };
  explained: { title: string; subtitle: string; thumbnail: string; youtube: string };
  teo: { title: string; description: string; courses: { badge: string; background: string; title: string; subtitle: string; learn_more: string }[] };
  test: { background: string; title: string; subtitle: string; link: string };
  jobs: TiJob[] | null;
  faq: { question: string; answer: string }[];
}

const TIMELINE =
  '<div class="timeline">' +
  '<div class="timeline-item"><div class="timeline-arrow"></div><div class="number">1</div><p>Enrol onto your accredited or Ofqual-regulated Level 5 TEFL course.</p></div>' +
  '<div class="timeline-item"><div class="timeline-arrow"></div><div class="number">2</div><p>Complete your TEFL course at your pace with 24/7 online access &amp; academic support</p></div>' +
  '<div class="timeline-item"><div class="timeline-arrow"></div><div class="number">3</div><p>Get job hunting advice from our experienced team &amp; apply for online TEFL jobs.</p></div>' +
  '<div class="timeline-item"><div class="number">4</div><p>Land your dream job &amp; start teaching English online!</p></div>' +
  "</div>";

/** The template's `<div calss="ast-container">` (its own typo). */
function Calss({ children, inner }: { children?: React.ReactNode; inner?: string }) {
  return inner !== undefined ? <div {...{ calss: "ast-container" }} dangerouslySetInnerHTML={html(inner)} /> : <div {...{ calss: "ast-container" }}>{children}</div>;
}

export default function TeoPage({ data }: { data: TeoPageData }) {
  const { hero, top, bottom, started, why, explained, teo, test } = data;
  return (
    <>
      <section className="banner-section" style={css(`background-image: url('${hero.image}');`)}>
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col" />
          </div>
        </div>
      </section>

      <section className="header-section">
        <Calss>
          <div className="ast-row">
            <div className="ast-col-lg-7" dangerouslySetInnerHTML={html(el("h1", { class: "section-heading" }, hero.title) + el("p", null, hero.subtitle))} />
          </div>
        </Calss>
      </section>

      <section className="main-section">
        <Calss>
          <div className="ast-row">
            <div className="ast-col-lg-6">
              <img src={top.image} className="main-image" />
            </div>
            <div className="ast-col-lg-6">
              <div className="main-box" dangerouslySetInnerHTML={html(el("h3", { class: "section-heading" }, top.title) + el("p", null, top.description))} />
            </div>
          </div>
        </Calss>
      </section>

      <section className="main-section">
        <Calss>
          <div className="ast-row">
            <div className="ast-col-lg-6">
              <div className="main-box" dangerouslySetInnerHTML={html(el("h3", { class: "section-heading" }, bottom.title) + el("p", null, bottom.description))} />
            </div>
            <div className="ast-col-lg-6">
              <img src={bottom.image} className="main-image" />
            </div>
          </div>
        </Calss>
      </section>

      <section className="main-section">
        <Calss>
          <div className="ast-row">
            <div className="ast-col-lg-12">
              <div
                className="get-started"
                dangerouslySetInnerHTML={html(
                  el("h3", null, started.title) +
                    el("p", null, started.description) +
                    TIMELINE +
                    el("a", { class: "", href: started.link }, 'See our courses <i class="fa fa-angle-right"></i>'),
                )}
              />
            </div>
          </div>
        </Calss>
      </section>

      <section className="why-teach-section">
        <Calss
          inner={
            el("h2", { class: "section-heading" }, why.title) +
            el(
              "div",
              { class: "ast-row" },
              why.items
                .map((it) => el("div", { class: "ast-col-lg-3" }, el("div", { class: "why-teach-box" }, el("img", { src: it.icon }) + el("p", null, it.description))))
                .join(""),
            )
          }
        />
      </section>

      <section className="explained-section">
        <Calss
          inner={
            el("h2", { class: "section-heading" }, explained.title) +
            el("p", null, explained.subtitle) +
            el(
              "div",
              { class: "ast-row" },
              el(
                "div",
                { class: "ast-col-12" },
                el(
                  "div",
                  { class: "explained-video", style: `background-image: url('${explained.thumbnail}')` },
                  `<a href="${explained.youtube.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}" data-lity class="video-caption-link lity-video"><span class="video-icon"></span></a>`,
                ),
              ),
            )
          }
        />
      </section>

      <section className="teo-courses-section">
        <Calss
          inner={
            el("h3", { class: "section-heading" }, teo.title) +
            el("p", null, teo.description) +
            el(
              "div",
              { class: "ast-row" },
              teo.courses
                .map((c) =>
                  el(
                    "div",
                    { class: "ast-col-lg-4" },
                    el(
                      "div",
                      { class: "teo-course-box", style: `background-image: url('${c.background}')` },
                      el(
                        "div",
                        { class: "teo-course-inner" },
                        el("img", { class: "badge", src: c.badge }) +
                          el("div", { class: "title" }, c.title) +
                          el("div", { class: "subtitle" }, c.subtitle) +
                          el("a", { href: c.learn_more, class: "link" }, "Learn More"),
                      ),
                    ),
                  ),
                )
                .join(""),
            )
          }
        />
      </section>

      <section className="test-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <div className="test-container lazy" style={css(`background-image: url('${test.background}');`)}>
                <div
                  className="test-container-content"
                  dangerouslySetInnerHTML={html(
                    el("h3", null, test.title) +
                      el("p", null, test.subtitle) +
                      el("a", { class: "blog-link", href: test.link }, 'Take the Test <i class="fa fa-angle-right"></i>'),
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {data.jobs ? <JobsSection jobs={data.jobs} /> : null}

      <section className="faq-section">
        <div className="ast-container">
          <h3>FAQ&#39;s</h3>
          <div className="ast-row">
            {data.faq.map((f, i) => (
              <div key={i} className="ast-col-md-4">
                <div className="faq-box" dangerouslySetInnerHTML={html(el("h4", null, f.question) + el("p", null, f.answer))} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
