/** "TEFL Scholarships" — native port of tefl-scholarships.php. Data: native/tefl-scholarships.php. */
import { css, html } from "../attrs";

export interface ScholarshipsPageData {
  ok: true;
  path: string;
  country: string;
  hero: { background: string; title: string };
  main: {
    title: string;
    subtitle: string;
    course_bg: string;
    course_title: string;
    worth: string;
    course_link: string;
    description: string;
    apply_image: string;
    apply_content: string;
    apply_desc: string;
    deadline_date: string;
    deadline_left: string;
    deadline_right: string;
    terms: string;
    privacy: string;
  };
}

export default function ScholarshipsPage({ data }: { data: ScholarshipsPageData }) {
  const m = data.main;
  return (
    <div id="primary" className="content-area primary">
      <section className="hero" style={css(`background-image: url('${data.hero.background}');`)}>
        <div className="ast-row">
          <div className="ast-col-md-12">
            <h1 className="hero__heading" dangerouslySetInnerHTML={html(data.hero.title)} />
          </div>
        </div>
      </section>

      <section className="main">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-12">
              <h3 className="main__heading" dangerouslySetInnerHTML={html(m.title)} />
              <h2 className="main__subheading" dangerouslySetInnerHTML={html(m.subtitle)} />
              <div className="main__course" style={css(`background-image: url('${m.course_bg}');`)}>
                <h4 dangerouslySetInnerHTML={html(m.course_title)} />
                <p>{`Worth ${m.worth}`}</p>
                <a href={m.course_link}>View Course</a>
              </div>
              <div className="main__description" dangerouslySetInnerHTML={html(m.description)} />
              <div className="main__apply">
                <h4>How to Apply for a TEFL Scholarship</h4>
                <div className="box" style={css(`background-image: url('${m.apply_image}');`)}>
                  <div className="content" dangerouslySetInnerHTML={html(m.apply_content)} />
                </div>
                <div className="description" dangerouslySetInnerHTML={html(m.apply_desc)} />
              </div>
              <div className="main__deadline">
                <h4>{`Application Deadline: ${m.deadline_date}`}</h4>
                <div className="container">
                  <div className="left" dangerouslySetInnerHTML={html(m.deadline_left)} />
                  <div className="right" dangerouslySetInnerHTML={html(m.deadline_right)} />
                </div>
              </div>
              <div className="main__legal">
                <h4>Terms &amp; Conditions</h4>
                <div className="container">
                  <div className="" dangerouslySetInnerHTML={html(m.terms)} />
                </div>
              </div>
              <div className="main__legal">
                <h4>Privacy Policy</h4>
                <div className="container">
                  <div className="" dangerouslySetInnerHTML={html(m.privacy)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
