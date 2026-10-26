/**
 * "Teach English Online New" — native port of page-teo-new.php (+ the
 * template-parts/job-cards.php rows it includes). Almost every block echoes
 * raw ACF / WooCommerce / feed HTML into the template's own <p>/<hN>, so each
 * top-level block is a JSX element whose contents are written as an HTML
 * string (attrs.ts `el()`), following the template line by line.
 * Data: native/page-teo-new.php.
 */
import { css, el, html, text } from "../attrs";

type H = string;

export interface TeoNewPageData {
  ok: true;
  path: string;
  country: string;
  hero: { image: string; title: H; subtitle: H; button_text: H; button_link: string };
  home: { head_title: H; title: H; content: H };
  top: { image: string; youtube: string; description: H };
  req: { title: H; content: H };
  teach: { heading: H; content: { image: string; title: H; description: H }[] };
  start: { heading: H; steps: { icon: string; header: H; title: H; description: H }[] };
  calc: { image: string; heading: H; description: H; button_text: H; button_link: string };
  sale: {
    image: string;
    logo: string;
    title: H;
    price: H;
    cart: string;
    expired: boolean;
    expiry: string;
    includes: H[];
    excludes: H[];
    freebies: { icon: string; title: H; price: H }[];
    others: { icon: string; title: H }[];
    has_free: boolean;
  }[];
  jobs: { header: H; sections: { heading: H; jobs: { type: H; logo: string; link: string; requirements: H; pay: H; hours: H }[] }[] };
  demo: { heading: H; button_text: H; button_link: string; form: H };
  webinars: { header: H; left: { title: H; image: string; youtube: string }; right: { title: H; image: string; youtube: string } };
  guide: { title: H; image: string; button_text: H; form: H };
  tips: { header: H; details: H; items: { image: string; title: H; description: H }[] };
  recommended: { header: H; blogs: Blog[] };
  fotj: { header: H; blogs: Blog[] };
  resources: { header: H; courses: { title: string; image: string; price: H; link: string }[] };
}

interface Blog {
  date: H;
  title: string;
  thumbnail: H;
  excerpt: H;
  link: string;
}

const lity = (href: string, icon: string) =>
  `<a href="${href.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}" data-lity class="video-caption-link lity-video"><span class="${icon}"></span></a>`;

const TIMER =
  '<ul class="timer">' +
  ["day", "hour", "minute", "second"].map((u) => `<li><span id="${u}Count"></span><span id="${u}-text">${u}s</span></li>`).join("") +
  "</ul>";

function saleCourse(c: TeoNewPageData["sale"][number]): string {
  const detail =
    (c.image ? el("div", { class: "course-img" }, el("img", { src: c.image })) : "") +
    (c.logo ? el("div", { class: "course-logo" }, el("img", { src: c.logo })) : "") +
    (c.title ? el("h4", { class: "course-title" }, c.title) : "") +
    (c.price ? el("div", { class: "course-price" }, c.price) : "") +
    (c.cart && c.expired
      ? el("div", { class: "enroll-now-btn" }, el("a", { class: "btn btn-primary dark-btn", rel: "nofollow", href: c.cart }, "Enrol Now"))
      : el("div", { class: "countdown-timer", "data-expiry": c.expiry }, TIMER));
  const incExc =
    c.includes.length || c.excludes.length
      ? el(
          "div",
          { class: "inc-exc-inner" },
          el("p", { class: "inc-exc-title" }, "What’s Included") +
            el(
              "div",
              { class: "inc-exc-div" },
              c.includes.map((i) => el("div", { class: "item inc-item" }, el("img", { src: "/wp-content/uploads/2021/11/Group-22.svg" }) + i)).join("") +
                c.excludes.map((i) => el("div", { class: "item exc-item" }, el("img", { src: "/wp-content/uploads/2021/11/Group-21-1.png" }) + i)).join(""),
            ),
        )
      : "";
  const free = c.has_free
    ? el(
        "div",
        { class: "freebie-col-inner" },
        el("p", { class: "freebie-title" }, "Free Resources") +
          c.freebies
            .map((f) =>
              el(
                "div",
                { class: "freebie-course" },
                (f.icon ? el("div", { class: "free-course-icon" }, el("img", { src: f.icon })) : "") +
                  (f.title ? el("p", { class: "free-course-title" }, f.title) : "") +
                  (f.price ? el("div", { class: "free-course-price" }, f.price) : ""),
              ),
            )
            .join("") +
          (c.others.length
            ? el(
                "div",
                { class: "other-freebie-div" },
                c.others
                  .map((o) =>
                    el(
                      "div",
                      { class: "other-freebie-div-inner" },
                      (o.icon ? el("div", { class: "other-freebie-icon" }, el("img", { src: o.icon })) : "") +
                        (o.title ? el("p", { class: "other-freebie-title" }, o.title) : ""),
                    ),
                  )
                  .join(""),
              )
            : "") +
          (c.cart ? el("div", { class: "learn-more-btn" }, el("a", { class: "btn btn-primary dark-btn", rel: "nofollow", href: c.cart }, "Enrol Now")) : ""),
      )
    : "";
  return (
    el(
      "div",
      { class: "ast-row sale-courses-header-row" },
      el("div", { class: "ast-col ast-col-md-12 section-header-col" }, el("div", { class: "section-header" }, "RECOMMENDED COURSE FOR TEACHING ONLINE")),
    ) +
    el(
      "div",
      { class: "ast-row sale-courses-content-row" },
      el("div", { class: "ast-col ast-col-md-4 course-detail-col" }, el("div", { class: "course-detail-col-inner" }, detail)) +
        el("div", { class: "ast-col ast-col-md-4 course-inc-exc-col" }, incExc) +
        el("div", { class: "ast-col ast-col-md-4 freebie-col" }, free),
    )
  );
}

function jobCards(jobs: TeoNewPageData["jobs"]["sections"][number]["jobs"]): string {
  return jobs
    .map((j) =>
      el(
        "div",
        { class: "ast-col-md-4" },
        el("a", { target: "_blank", href: j.link, class: "job-clickbox" }) +
          el(
            "div",
            { class: "job-card" },
            el("div", { class: "job-card__header" }, el("div", { class: "job-type" }, j.type) + el("div", { class: "job-image" }, el("img", { src: j.logo }))) +
              el(
                "div",
                { class: "job-card__body" },
                el(
                  "div",
                  { class: "job-card__body-content" },
                  el("div", { class: "job-requirements" }, "<span>Requirements: </span>" + j.requirements) +
                    el("div", { class: "job-pay" }, "<span>Pay: </span>" + j.pay) +
                    el("div", { class: "job-hours" }, "<span>Hours: </span>" + j.hours),
                ) +
                  el("div", { class: "job-card__body-cta" }, el("a", { target: "_blank", href: j.link, class: "learn-more black-button" }, "<span>learn more</span>")),
              ),
          ),
      ),
    )
    .join("");
}

function blogs(list: Blog[]): string {
  return list
    .map((b) =>
      el(
        "div",
        { class: "ast-col-md-4" },
        el(
          "div",
          { class: "blog-item" },
          el(
            "div",
            { class: "blog-content" },
            el("h2", null, b.date) + el("h3", null, text(b.title)) + b.thumbnail + el("p", null, b.excerpt) + el("a", { class: "blog-link", href: b.link }, "READ MORE"),
          ),
        ),
      ),
    )
    .join("");
}

function Block({ tag = "section", className, style, inner }: { tag?: "section" | "div"; className?: string; style?: string; inner: string }) {
  const Tag = tag;
  return <Tag className={className} style={style ? css(style) : undefined} dangerouslySetInnerHTML={html(inner)} />;
}

export default function TeoNewPage({ data }: { data: TeoNewPageData }) {
  const { hero, home, top, req, teach, start, calc, jobs, demo, webinars, guide, tips } = data;
  return (
    <>
      <Block
        className="banner-section"
        style={`background-image: url('${hero.image}');`}
        inner={el(
          "div",
          { class: "ast-container" },
          el(
            "div",
            { class: "ast-row" },
            el(
              "div",
              { class: "ast-col" },
              el("div", { class: "content" }, el("h1", null, hero.title) + el("p", null, hero.subtitle) + el("a", { href: hero.button_link, class: "button-green" }, hero.button_text)),
            ),
          ),
        )}
      />

      <Block
        className="abroad-section"
        inner={el(
          "div",
          { class: "ast-container" },
          el(
            "div",
            { class: "ast-row" },
            el(
              "div",
              { class: "ast-col" },
              el("h2", { class: "font-600" }, home.head_title) + el("h3", { class: "large-heading common-section-heading" }, home.title) + el("p", null, home.content),
            ),
          ) +
            el(
              "div",
              { class: "ast-row" },
              el(
                "div",
                { class: "ast-col-lg-6 video-link" },
                el("div", { class: "explained-video", style: `background-image: url('${top.image}')` }, lity(top.youtube, "video-icon")),
              ) + el("div", { class: "ast-col-lg-6 content-column" }, top.description),
            ),
        )}
      />

      <Block
        className="requirement-section"
        inner={el(
          "div",
          { class: "ast-container" },
          el(
            "div",
            { class: "ast-row" },
            el("div", { class: "ast-col" }, el("h2", { class: "req-head large-heading common-section-heading" }, req.title) + el("p", { class: "req-content" }, req.content)),
          ),
        )}
      />

      <Block
        tag="div"
        className="teach-online-section"
        inner={
          el("div", { class: "teach-online-heading" }, el("h2", null, teach.heading)) +
          el(
            "div",
            { class: "container-section" },
            teach.content
              .map((c) =>
                el(
                  "div",
                  { class: "ast-row", style: `background: url('${c.image}') no-repeat center center / cover;` },
                  el("div", { class: "ast-col content-box" }, el("div", { class: "mid-content" }, el("h2", null, c.title) + el("p", null, c.description))),
                ),
              )
              .join(""),
          )
        }
      />

      <Block
        className="start-teaching-online-section"
        inner={
          el("h2", null, start.heading) +
          el(
            "div",
            { class: "ast-container" },
            el(
              "div",
              { class: "ast-row" },
              start.steps
                .map((st) =>
                  el(
                    "div",
                    { class: "ast-col-md-6 steps-column" },
                    el("div", { class: "step-icons" }, el("h3", null, st.header) + el("img", { style: "width:15%", src: st.icon, alt: "", title: "" })) +
                      el("div", { class: "step-content" }, el("h3", null, st.title) + el("p", null, st.description)),
                  ),
                )
                .join(""),
            ),
          )
        }
      />

      <Block
        className="calculate-my-salary"
        style={`background: url('${calc.image}') no-repeat center center / cover;`}
        inner={el(
          "div",
          { class: "ast-container" },
          el(
            "div",
            { class: "ast-row" },
            el(
              "div",
              { class: "ast-col-lg-7 calculate-salary-details" },
              el("h2", null, calc.heading) +
                el("p", null, calc.description) +
                el("a", { class: "calculate-button", href: calc.button_link }, `<i class="fa fa-calculator" aria-hidden="true"></i> ${calc.button_text}`),
            ),
          ),
        )}
      />

      {data.sale.map((c, i) => (
        <Block key={i} tag="div" className="section tefl-section sale-courses-section" inner={saleCourse(c)} />
      ))}

      <Block
        className="teach-english-online"
        inner={el(
          "div",
          { class: "ast-container" },
          el(
            "div",
            { class: "row" },
            el(
              "div",
              { class: "ast-col-lg-12 " },
              el("h2", null, jobs.header) +
                el("p", { class: "find-online-teaching-jobs" }, el("a", { href: "/teach-english-abroad/teach-english-online/" }, "Find online English teaching jobs")),
            ),
          ),
        )}
      />

      {jobs.sections.map((s, i) => (
        <Block
          key={i}
          className="job-section job-section-new without-degree-job-section"
          inner={el("div", { class: "ast-container" }, el("h3", { class: "job-section-heading" }, s.heading) + el("div", { class: "ast-row" }, jobCards(s.jobs)))}
        />
      ))}

      <Block
        inner={el("div", { class: "ast-container" }, el("div", { class: "row" }, el("div", { class: "ast-col demo-video-heading" }, el("h2", null, demo.heading))))}
      />

      <Block
        className="demo-video"
        inner={el(
          "div",
          { class: "ast-container demo-video-columns" },
          el(
            "div",
            { class: "ast-row" },
            el("div", { class: "ast-col-lg-5 demo-form" }, demo.form) +
              el(
                "div",
                {
                  class: "ast-col-lg-7 certificate_review-video-col",
                  style: "background: url('https://teflinstitute.com/wp-content/uploads/2021/12/Demo-video-1-1.jpeg');height: 350px;background-position: center;background-size: cover;",
                },
                el(
                  "a",
                  { href: "/video-masterclass", class: "video-caption-link lity-video" },
                  el(
                    "div",
                    { class: "vide-caption-box" },
                    el("span", { class: "video-caption-text" }, "Diana | Video Masterclass") +
                      el("span", { class: "video-icon" }, el("img", { src: "/wp-content/uploads/2021/10/Play-button.svg" })),
                  ),
                ) +
                  el(
                    "div",
                    { class: "video-masterclass" },
                    el("a", { href: demo.button_link }, `${demo.button_text} <span class="arrow"> &gt; </span>`) + ' <i class="fa fa-arrow"></i>',
                  ),
              ),
          ),
        )}
      />

      <Block
        className="online-teaching-webinar"
        inner={el(
          "div",
          { class: "ast-container" },
          el(
            "div",
            { class: "ast-row" },
            el("div", { class: "ast-col-md-12" }, el("h2", null, webinars.header)) +
              [webinars.left, webinars.right]
                .map((w) =>
                  el(
                    "div",
                    { class: "ast-col-lg-6 ast-col-md-6 ast-col-sm-12 webinar-video-link" },
                    el("h3", null, w.title) + el("div", { class: "webinar-explained-video", style: `background-image: url('${w.image}')` }, lity(w.youtube, "webinar-video-icon")),
                  ),
                )
                .join(""),
          ),
        )}
      />

      <Block
        className="start-up-guide"
        inner={el(
          "div",
          { class: "ast-container" },
          el(
            "div",
            { class: "ast-row" },
            el(
              "div",
              { class: "ast-col guide-content" },
              el("h2", null, guide.title) + el("img", { style: "width:70%;", src: guide.image, alt: "", title: "" }) + el("a", { class: "btn-download guide-download", href: "#" }, guide.button_text),
            ),
          ) + el("div", { class: "guide-donwnload-form hidden ast-row" }, guide.form),
        )}
      />

      <Block
        className="tips-teaching-english-online"
        inner={
          el("h3", null, tips.header) +
          el("p", null, tips.details) +
          tips.items
            .map((t) =>
              el(
                "div",
                { class: "ast-container tteo-content" },
                el(
                  "div",
                  { class: "row" },
                  el("div", { class: "ast-col-lg-6 tips-image" }, el("img", { src: t.image, alt: "", title: "" })) +
                    el("div", { class: "ast-col-lg-6 tips-content" }, el("h4", null, t.title) + el("p", null, t.description)),
                ),
              ),
            )
            .join("")
        }
      />

      <Block
        className="recommended-blogs-section"
        inner={el("div", { class: "ast-container" }, el("div", { class: "ast-row" }, el("div", { class: "ast-col-md-12" }, el("h3", null, data.recommended.header)) + blogs(data.recommended.blogs)))}
      />

      <Block
        className="finding-online-teaching-job"
        inner={el("div", { class: "ast-container" }, el("div", { class: "ast-row" }, el("div", { class: "ast-col-md-12" }, el("h3", null, data.fotj.header)) + blogs(data.fotj.blogs)))}
      />

      <Block
        className="online-teaching-resources"
        inner={el(
          "div",
          { class: "ast-container teaching-container" },
          el(
            "div",
            { class: "ast-row" },
            el("div", { class: "ast-col-md-12" }, el("h3", null, data.resources.header)) +
              data.resources.courses
                .map((c) =>
                  el(
                    "div",
                    { class: "ast-col-md-4" },
                    el(
                      "div",
                      { class: "ont-item" },
                      el(
                        "div",
                        { class: "ont-content" },
                        el("h3", null, text(c.title)) +
                          el("h4", null, "ONLINE LESSON PACK") +
                          el("img", { src: c.image, alt: "" }) +
                          el("div", { class: "otr-course-price" }, c.price) +
                          el("a", { class: "ont-blog-link", href: c.link }, "LEARN MORE"),
                      ),
                    ),
                  ),
                )
                .join(""),
          ),
        )}
      />
    </>
  );
}
