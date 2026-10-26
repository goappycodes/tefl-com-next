/**
 * Courses — native port of the theme's page-courses.php (/tefl-courses/ in the
 * geo folders). Same markup as the PHP template; the theme's ajax snippets
 * (pay-in-6 ribbon), prices and accordions work on it unchanged.
 * Data: wordpress/headless/native/page-courses.php.
 */
import { esc, H, Spaced, type Faq, type OverviewsBase } from "./shared";

interface Features {
  includes: string[];
  excludes: string[];
}

interface Card extends Features {
  bg: string;
  icon: string;
  alt: string;
  title: string;
  completion: string;
  link: string;
  percentage: string;
  price: string;
}

interface DepositCard extends Card {
  deposit: { kind: "" | "ribbon" | "pay6"; icon: string; total: string; description: string; product_id: string };
  zoom: string | null;
  feature_icon: string;
}

interface Block {
  bg: string;
  title: string;
  text: string;
  show_btn: boolean;
  btn_text: string;
  btn_url: string;
}

interface Head {
  title: string;
  text: string;
  icons?: { icon: string; text: string }[] | null;
}

export interface PageCoursesData extends OverviewsBase {
  banner: { bg: string; title: string; text: string; icon: string; show_btn: boolean; btn_text: string; btn_url: string };
  accredit: Head;
  teacher_link: string;
  accredited: Card[] | null;
  virtual: Block;
  level5_head: Head;
  level5: DepositCard[];
  trial: { image: string; title: string; content: string; cta_link: string; cta_text: string } | null;
  test: Block;
  classroom_head: Head;
  classroom: DepositCard[] | null;
  specialist_head: Head;
  specialist: Omit<Card, "alt" | "includes" | "excludes">[] | null;
  faqs: Faq[];
}

const BREADCRUMB = JSON.stringify({
  "@context": "https://schema.org/",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://teflinstitute.com/" },
    { "@type": "ListItem", position: 2, name: "TEFL Courses", item: "https://teflinstitute.com/tefl-courses/" },
  ],
});

const GRADIENT = "linear-gradient(0deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.75))";
const ANGLE = '<i class="fa fa-angle-right"></i>';

export default function PageCourses({ data }: { data: PageCoursesData }) {
  const o = data.origin;
  const b = data.banner;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: BREADCRUMB }} />

      <div id="primary" className="content-area primary">
        <section className="banner-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-lg-12">
                <div className="course-banner" style={{ backgroundImage: `url('${b.bg}')` }}>
                  <div className="ast-col-lg-6 ast-col-md-8">
                    <div className="banner-content-block">
                      <div className="content-block">
                        {b.title ? <H as="h1" html={b.title} /> : null}
                        {b.text ? <H as="p" html={b.text} /> : null}
                        {b.icon ? <img src={b.icon} alt="Archive Course Banner Icon" /> : null}
                      </div>
                      {b.show_btn ? <H as="a" href={b.btn_url} html={`${b.btn_text} ${ANGLE}`} /> : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="courses-looking-for-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-lg-12">
                <h2>WHAT TEFL/TESOL COURSE ARE YOU LOOKING FOR?</h2>

                <div className="courses-looking-for-tabs">
                  <div className="tabs">
                    <Spaced>
                      {[
                        <a key="a" className="tablinks active" href="#accredit">
                          ACCREDITED TEFL COURSES
                        </a>,
                        <a key="g" className="tablinks" href="#govt_regulated">
                          GOVERNMENT REGULATED
                        </a>,
                        <a key="c" className="tablinks" href="#classroom_based">
                          CLASSROOM BASED
                        </a>,
                        <a key="s" className="tablinks" href="#specialized_courses">
                          SPECIALIST TEFL COURSES
                        </a>,
                      ]}
                    </Spaced>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HeadSection id="accredit" className="govt-regulated-courses-section" blockClass="govt-regulated-courses-section-block" head={data.accredit} />

        <section className="tefl-teacher-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <a href={data.teacher_link}>
                  <img src="https://teflinstitute.com/wp-content/uploads/2022/10/jacob-banner-TI.jpg" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {data.accredited === null ? (
          <section className="courses-section gray-blocks">
            <div className="ast-container">
              <div className="ast-row" />
            </div>
          </section>
        ) : (
          <section className="courses-section accredited-course-section">
            <div className="ast-container">
              <div className="ast-row">
                {data.accredited.map((c, i) => (
                  <div key={i} className="ast-col-md-6 course-item-wrapper">
                    <div className="course-item">
                      <div className="course-item-block accredited-course-item__block">
                        <a href={c.link} className="course-clickbox" />
                        <div style={{ background: `${GRADIENT}, url('${c.bg}')` }} className="course-item__left ast-col-md-8">
                          <CardTop card={c} />
                          <a className="learn-more-btn" href={c.link}>
                            LEARN MORE
                          </a>
                        </div>
                        <div className="course-item__right features ast-col-md-4">
                          <FeatureList card={c} origin={o} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <FullBlock block={data.virtual} className="full-block-course-section" textInP={false} />

        <HeadSection
          id="govt_regulated"
          className="govt-regulated-courses-section"
          blockClass="govt-regulated-courses-section-block"
          head={data.level5_head}
        />

        <section className=" courses-section govt-regulated-course-section black-blocks">
          <div className="ast-container">
            <div className="ast-row">
              {data.level5.map((c, i) => (
                <DepositCourse key={i} card={c} origin={o} blockClass="course-item-block level5-course-item__block" classroom={false} />
              ))}
            </div>
          </div>
        </section>

        {data.trial ? (
          <div className="ast-container trial">
            <div className="left" style={{ backgroundImage: `url('${data.trial.image}')` }} />

            <div className="right">
              <H as="h3" className="title" html={data.trial.title} />

              <H className="content" html={data.trial.content} />

              <H as="a" href={data.trial.cta_link} className="cta" html={data.trial.cta_text} />
            </div>
          </div>
        ) : null}

        <FullBlock block={data.test} className="full-block-course-section take-the-test" textInP />

        <HeadSection
          id="classroom_based"
          className="classroom-blended-courses-section"
          blockClass="classroom-blended-courses-section-block"
          head={data.classroom_head}
        />

        {data.classroom ? (
          <section className="courses-section classroom-blended-courses-new" style={{ paddingBottom: "0px !important" }}>
            <div className="ast-container">
              <div className="ast-row">
                {data.classroom.map((c, i) => (
                  <DepositCourse key={i} card={c} origin={o} blockClass="course-item-block level5-course-item__block test" classroom />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <HeadSection
          id="specialized_courses"
          className="specialized-tefl-courses-section"
          blockClass="specialized-tefl-courses-section-block"
          head={data.specialist_head}
        />

        {data.specialist ? (
          <section className="specialized-tefl-course-items-section">
            <div className="ast-container">
              <div className="ast-row">
                {data.specialist.map((c, i) => (
                  <div key={i} className="ast-col-lg-4">
                    <div className="course-item">
                      <Save percentage={c.percentage} />
                      <div className="course-image" style={{ background: `url('${c.bg}')` }}>
                        <img src={c.icon} className="course-badge" />
                      </div>
                      <H as="h3" html={c.price} />
                      <H as="h4" html={c.title} />
                      <H as="p" html={`Completion time<br/>${c.completion}`} />
                      <a href={c.link} className="learn-more">
                        LEARN MORE <i className="fa fa-angle-right" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="faq-tefl-course-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h2>TEFL Frequently asked Questions</h2>
                {data.faqs.map((f, i) => (
                  <section key={i} className="accordion-container">
                    <input id={`accordion-${i}`} name="accordion-1" type="radio" defaultChecked={i === 0} />
                    <H as="label" htmlFor={`accordion-${i}`} html={f.q_html} />
                    <H as="article" html={f.a_html} />
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: data.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }).replace(/</g, "\\u003c"),
          }}
        />
      </div>
    </>
  );
}

function HeadSection({ id, className, blockClass, head }: { id: string; className: string; blockClass: string; head: Head }) {
  return (
    <section className={className} id={id}>
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12">
            <div className={blockClass}>
              {head.title ? <H as="h2" html={head.title} /> : null}
              {head.text ? <H as="h4" html={head.text} /> : null}
              {head.icons ? (
                <div className="ast-row three-blocks-row">
                  {head.icons.map((row, i) => (
                    <div key={i} className="ast-col-md-4">
                      <img src={row.icon} />
                      <H as="p" html={row.text} />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Full-width banner blocks; the virtual course text is printed bare between the heading and the button. */
function FullBlock({ block, className, textInP }: { block: Block; className: string; textInP: boolean }) {
  const parts: string[] = [];
  if (block.title) parts.push(`<h2>${block.title}</h2>`);
  if (block.text) parts.push(textInP ? `<p>${block.text}</p>` : block.text);
  if (block.show_btn) parts.push(`<a class="book-now" href="${esc(block.btn_url)}">${block.btn_text} ${ANGLE}</a>`);
  return (
    <section className={className}>
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12">
            <div className="full-block-course-block" style={{ backgroundImage: `url('${block.bg}')` }}>
              <H className="full-block-course-content" html={parts.join("\n")} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Save({ percentage }: { percentage: string }) {
  if (!percentage) return null;
  return (
    <div className="course-save">
      <span className="save">Save</span>
      <span className="percent-value">{`${percentage}%`}</span>
    </div>
  );
}

/** Save ribbon, icon, price, title and completion time (the top of every course card). */
function CardTop({ card: c }: { card: Card }) {
  return (
    <>
      <Save percentage={c.percentage} />
      <img src={c.icon} alt={c.alt} />
      <H as="h3" className="price" html={c.price} />
      <H as="h3" className="course-title" html={c.title} />
      <H as="p" className="duration" html={`Completion time<br>${c.completion}`} />
    </>
  );
}

function FeatureList({ card, origin }: { card: Features; origin: string }) {
  return (
    <>
      {card.includes.map((f, i) => (
        <H
          key={`i${i}`}
          className="feature-include"
          html={`<img src="${origin}/wp-content/uploads/2022/11/checkmark.png" alt="" class="check-icon">${f}`}
        />
      ))}
      {card.excludes.map((f, i) => (
        <H
          key={`e${i}`}
          className="feature-exclude"
          html={`<img src="${origin}/wp-content/uploads/2022/11/close.png" alt="" class="cross-icon">${f}`}
        />
      ))}
    </>
  );
}

/** Level 5 and classroom cards: deposit ribbon / pay-in-6 snippet, zoom classes, "What's Included". */
function DepositCourse({ card: c, origin, blockClass, classroom }: { card: DepositCard; origin: string; blockClass: string; classroom: boolean }) {
  const d = c.deposit;
  return (
    <div className="ast-col-md-6 course-item-wrapper">
      <div className="course-item">
        <div className={blockClass}>
          <a href={c.link} className="course-clickbox" />
          <div style={{ background: `${GRADIENT}, url('${c.bg}')` }} className="course-item__left ast-col-md-8">
            <CardTop card={c} />
            {d.kind === "ribbon" ? (
              <div className="pay-in-two-three deposit-info ast-flex ast-align-items-center">
                <div className="depoist-info__icon">
                  <img src={d.icon} alt="" />
                </div>
                <div className="ast-flex flex-direction-column deposit-info__details">
                  <h5 className="deposit-info_title">{`Pay in ${d.total}`}</h5>
                  <H className="deposit-info_description" html={d.description} />
                </div>
              </div>
            ) : null}
            {d.kind === "pay6" ? (
              <>
                <div className="ajax-snippet" data-snippet="pay_in_6_ribbon" data-objectid={d.product_id} />
                <div id="loader" className="loader">
                  Fetching deposit details <img src={`${origin}/wp-content/uploads/2022/11/loading-black.gif`} alt="fetching deposit details" />
                </div>
              </>
            ) : null}
            {c.zoom !== null ? (
              <H className="course-zoom" html={`<img src="${origin}/wp-content/uploads/2022/11/zoom-icon.png">\n${c.zoom}`} />
            ) : classroom ? (
              <>
                <img src={`${origin}/wp-content/uploads/2022/11/zoom-icon.png`} />
                Free 20 Hours Live TEFL Zoom Classes
              </>
            ) : null}
            <a className="learn-more-btn" href={c.link}>
              LEARN MORE
            </a>
          </div>
          <div className="course-item__right features ast-col-md-4">
            <h4 className="course-item__right-title">What&apos;s Included</h4>
            <div className="course-item__right-content">
              <FeatureList card={c} origin={origin} />
            </div>
            <img src={c.feature_icon} className="course-item__right-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
