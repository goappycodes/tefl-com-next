/**
 * "What You Need To Teach English Online" — native port of
 * teach-english-online.php. The gallery / steps behaviour comes from the
 * theme's own script (same classes and data attributes as the template).
 * Data: native/teach-english-online.php.
 */
import { css, html } from "../attrs";

interface Cta {
  value: string;
  label: string;
  has: boolean;
}

export interface TeachOnlinePageData {
  ok: true;
  path: string;
  country: string;
  primary_class: string;
  gallery: string[];
  title: string;
  subtitle: string;
  cta: Cta;
  steps: { bg: string; icon: string; title: string; subtitle: string }[];
  courses: {
    icon: string;
    title: string;
    price: string;
    best_icon: string;
    best_title: string;
    best_sub: string;
    description: string;
    features: string[];
    cta: Cta;
  }[];
  one: { title: string; content: string; points: { title: string; subtitle: string }[] };
  two: { image: string; title: string; subtitle: string; cta: Cta };
  three: { image: string; title: string; subtitle: string; cta: Cta };
  elt: { image: string; title: string; subtitle: string; cta: Cta };
  callback: { thumbnail: string; youtube: string; title: string; subtitle: string; cta: Cta };
}

const CHECK =
  '<svg class="feature-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>';

function Div({ className, h }: { className: string; h: string }) {
  return <div className={className} dangerouslySetInnerHTML={html(h)} />;
}

export default function TeachOnlinePage({ data }: { data: TeachOnlinePageData }) {
  const { one, two, three, elt, callback } = data;
  return (
    <div id="primary" className={data.primary_class}>
      <section className="hero-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="hero">
              <div className="ast-col-md-8">
                <div className="gallery-container">
                  <div className="thumbnails">
                    {data.gallery.map((g, i) => (
                      <div key={i} className="thumbnail" style={css(`background-image: url('${g}');`)} data-large-image={g} {...{ alt: g }} />
                    ))}
                  </div>
                  <div className="main-image">
                    <div className="large-image" style={css(`background-image: url('${data.gallery[0]}');`)} />
                    <div className="prev-arrow">
                      <img className="no-lazy" src="/wp-content/uploads/2024/06/prev-arrow.svg" alt="previous-arrow" />
                    </div>
                    <div className="next-arrow">
                      <img className="no-lazy" src="/wp-content/uploads/2024/06/next-arrow.svg" alt="next-arrow" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ast-col-md-4">
                <div className="sidepanel">
                  <h1
                    className="title"
                    style={css("font-size:24px;font-weight:700;line-height:30px;margin:0 0 13.68px;color:rgb(40,40,40)")}
                    dangerouslySetInnerHTML={html(data.title)}
                  />
                  <Div className="subtitle" h={data.subtitle} />
                  <a href={data.cta.value} dangerouslySetInnerHTML={html(data.cta.label)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="steps">
              {data.steps.map((st, i) => (
                <div key={i} className="ast-col-md-3">
                  <div className={`step color${i}`} data-bg={st.bg}>
                    <div className="overlay" />
                    <div className="top">
                      <img src={st.icon} />
                      <div className="font-600">{`Step ${i + 1}`}</div>
                    </div>
                    <Div className="center" h={st.title} />
                    <Div className="hidden" h={st.subtitle} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="courses-card-section">
        <div className="ast-container">
          <div className="ast-row">
            {data.courses.map((c, i) => (
              <div key={i} className="ast-col-md-6">
                <div className="course">
                  <div className="course-top">
                    <img src={c.icon} />
                    <div dangerouslySetInnerHTML={html(c.title)} />
                  </div>
                  <Div className="price" h={c.price} />
                  <div className="best-label">
                    <img src={c.best_icon} />
                    <div className="texts">
                      <Div className="title" h={c.best_title} />
                      <Div className="subtitle" h={c.best_sub} />
                    </div>
                  </div>
                  <Div className="description" h={c.description} />
                  <div className="features">
                    {c.features.map((f, k) => (
                      <Div key={k} className="feature" h={CHECK + f} />
                    ))}
                  </div>
                  <a className="cta" href={c.cta.value} dangerouslySetInnerHTML={html(c.cta.label)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blocks-section">
        <div className="ast-container">
          <div className="ast-row ast-flex ast-align-items-center">
            <div className="ast-col-md-6">
              <div className="block-one">
                <Div className="title font-700" h={one.title} />
                <Div className="content" h={one.content} />
                <div className="points">
                  {one.points.map((p, i) => (
                    <div key={i} className="point">
                      <Div className="title font-800" h={p.title} />
                      <Div className="subtitle" h={p.subtitle} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="ast-col-md-6">
              <div className="two-blocks">
                <div className="block-two">
                  <img src={two.image} />
                  <div className="block-content">
                    <Div className="title" h={two.title} />
                    <Div className="subtitle" h={two.subtitle} />
                    {two.cta.has ? <a className="block-cta" href={two.cta.value} dangerouslySetInnerHTML={html(two.cta.label)} /> : null}
                  </div>
                </div>
                <div className="block-three">
                  <div className="block-content">
                    <Div className="title" h={three.title} />
                    <Div className="subtitle" h={three.subtitle} />
                    {three.cta.has ? <a className="block-cta" href={three.cta.value} dangerouslySetInnerHTML={html(three.cta.label)} /> : null}
                  </div>
                  <img src={three.image} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="elt">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-6">
              <div className="elt-left">
                <div className="image" style={css(`background-image:url('${elt.image}')`)} />
              </div>
            </div>
            <div className="ast-col-md-6">
              <div className="elt-right">
                <Div className="elt-title" h={elt.title} />
                <Div className="elt-subtitle" h={elt.subtitle} />
                <div className="cta-flex">
                  <a className="elt-cta" href={elt.cta.value} dangerouslySetInnerHTML={html(elt.cta.label)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="callback-section">
        <div className="ast-container">
          <div className="ast-row ast-flex">
            <div className="ast-col-md-6">
              <div className="callback-left" style={css(`background-image:url('${callback.thumbnail}')`)}>
                <span>Online TEFL Teacher</span>
                <img className="play-btn no-lazy" src="/wp-content/uploads/2023/08/Play-icon-accent.svg" />
                <a href={`https://youtu.be/${callback.youtube}`} className="image" data-lity="" />
              </div>
            </div>
            <div className="ast-col-md-6">
              <div className="callback-right">
                <Div className="callback-title" h={callback.title} />
                <Div className="callback-subtitle" h={callback.subtitle} />
                <div className="callback-flex">
                  <a className="elt-cta" href={callback.cta.value} dangerouslySetInnerHTML={html(callback.cta.label)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
