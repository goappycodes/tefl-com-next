/** "TEFL Course in Tashkent Uzbekistan" — native port of ti-tashkent-template.php. Data: native/ti-tashkent-template.php. */
import { css, html } from "../attrs";

export interface TashkentPageData {
  ok: true;
  path: string;
  country: string;
  hero_image: string;
  page_title: string;
  /** hero, job types, qualifications, requirements, locations, culture, key facts, living costs, FAQ. */
  sections: { title: string; content: string }[];
}

export default function TashkentPage({ data }: { data: TashkentPageData }) {
  return (
    <div id="primary" className="content-area primary">
      {data.sections.map((s, i) => (
        <section key={i} className="section">
          {i === 0 ? (
            <div className="hero" style={css(`background-image: url('${data.hero_image}');`)}>
              {data.page_title ? <h1 dangerouslySetInnerHTML={html(data.page_title)} /> : null}
            </div>
          ) : null}
          <h2 className="heading" dangerouslySetInnerHTML={html(s.title)} />
          <div className="content" dangerouslySetInnerHTML={html(s.content)} />
        </section>
      ))}
    </div>
  );
}
