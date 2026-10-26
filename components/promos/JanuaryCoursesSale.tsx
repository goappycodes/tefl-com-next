/**
 * January courses sale landing page — native port of the theme's
 * january-courses-sale.php (page tefl-courses-sales).
 *
 * Hero / countdown / gifts (JanTop), sale course cards, add-ons and the guide
 * bundle, with the template's markup. Each sale card is emitted as the
 * template's HTML: it prints raw attribute text (`<div 1 class=…>` from the
 * deposit plan id, unquoted `data-deposits=` values) that only the HTML parser
 * can turn into the same DOM as on live.
 */
import JanTop from "./JanTop";
import { esc, ih } from "./shared";
import type { JanuaryCoursesSaleData } from "./types";

type Card = NonNullable<JanuaryCoursesSaleData["courses"]>[number];

export default function JanuaryCoursesSale({ d }: { d: JanuaryCoursesSaleData }) {
  const o = d.origin;
  return (
    <div id="primary" className={d.primary_class}>
      <JanTop top={{ hero: d.hero, timer: d.timer, gifts: d.gifts, origin: o }} gifts="courses" />

      {d.courses ? (
        <section className="sales-courses-section py-50">
          {d.courses.map((c, i) => (
            <div key={i} className="ast-container" dangerouslySetInnerHTML={ih(saleCard(c, o))} />
          ))}
        </section>
      ) : null}

      {d.addons ? (
        <section className="addons-section py-50">
          <div className="ast-container">
            <div className="ast-row addons-header-row">
              <div className="ast-col ast-col-md-12 addons-header-col">
                <h3 className="text-center addons-header" dangerouslySetInnerHTML={ih(d.addons.title)} />
              </div>
            </div>
          </div>
          <div className="ast-container">
            <div className="ast-row addons-row">
              {d.addons.items.map((a, i) => (
                <div key={i} className="ast-col ast-col-md-4 addons-col">
                  <div className="addons-col__header text-center" dangerouslySetInnerHTML={ih(a.ribbon)} />
                  <div className="addons-col__content">
                    {a.image ? (
                      <div className="course-img">
                        <img className="course-img__main" src={a.image} />
                        {a.logo ? <img className="course-img__logo" src={a.logo} /> : null}
                      </div>
                    ) : null}

                    {a.title ? <h4 className="course-title text-center" dangerouslySetInnerHTML={ih(a.title)} /> : null}
                    {a.features !== null ? (
                      <div className="inc-div">
                        {a.features.map((f, j) => (
                          <div
                            key={j}
                            className="item inc-item"
                            dangerouslySetInnerHTML={ih(`<img\n src="${o}/wp-content/uploads/2021/11/Group-22.svg">${f}`)}
                          />
                        ))}
                      </div>
                    ) : null}
                    {a.price ? <div className="course-price text-center" dangerouslySetInnerHTML={ih(a.price)} /> : null}
                    {a.link || a.cart ? (
                      <div className="addons-btn-div">
                        {a.link ? (
                          <div className="learn-more-btn">
                            <a className="btn btn-primary light-btn" href={a.link}>
                              Learn More
                            </a>
                          </div>
                        ) : null}
                        {a.cart ? (
                          <div className="enroll-now-btn">
                            <a className="btn btn-primary dark-btn" rel="nofollow" href={a.cart}>
                              Enrol Now
                            </a>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {d.guide ? (
        <section className="guide_bundle_section py-50">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <div className="guide-bundle-section__header red-header-block" dangerouslySetInnerHTML={ih(d.guide.header)} />
              </div>
            </div>
            <div className="ast-row guide-bundle-section__content">
              <div className="ast-col ast-col-md-4 guide-bundle-content-col">
                <div className="guide-bundle-content-col-inner">
                  {d.guide.title ? <h4 className="guide-title" dangerouslySetInnerHTML={ih(d.guide.title)} /> : null}
                  {d.guide.subtitle ? <p className="guide-subtitle" dangerouslySetInnerHTML={ih(d.guide.subtitle)} /> : null}
                  {d.guide.price ? <div className="guide-price" dangerouslySetInnerHTML={ih(d.guide.price)} /> : null}
                  {d.guide.link ? (
                    <div className="download-btn text-center">
                      <a className="btn btn-red" href={d.guide.link}>
                        Purchase Bundle
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="ast-col ast-col-md-8 guide-bundle-img-col">
                {d.guide.image ? (
                  <div className="guide-bundle-img-col-inner">
                    <img src={d.guide.image} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {d.guide.view_more ? (
            <div className="ast-row view-more-guides-row py-50">
              <div className="view-more-guides-div text-center">
                <a className="" href={d.guide.view_more}>
                  View More Guides
                </a>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

/** One sale card's .ast-container content, as the template prints it (raw values unescaped, as PHP echoes them). */
function saleCard(c: Card, o: string): string {
  let inner = "";
  if (c.logo) inner += `\n<div class="course-logo">\n<img src="${esc(c.logo)}">\n</div>\n`;
  if (c.title) inner += `\n<h4 class="course-title">${c.title}</h4>\n`;
  if (c.price) {
    inner += `\n<div data-deposits=${c.deposits} ${c.first_deposit ? `data-first-deposit=${c.first_deposit}` : ""} data-depostit-percent=${c.deposit_pct} class="course-price">${c.price}</div>\n`;
  }
  if (c.cart) {
    inner += `\n<div class="enrol-now enroll-now-btn">\n`;
    inner += c.virtual
      ? `<a class="enrol-cta-btn btn btn-red" href="${esc(c.course_link)}">${c.enrol_text}</a>\n`
      : `<a class="enrol-cta-btn btn btn-red" rel="nofollow" href="${esc(c.cart)}">${c.enrol_text}</a>\n`;
    inner += `</div>\n`;
  }
  if (c.radio !== null) {
    const n = c.radio;
    inner += `
<div class="d-none radio-group ast-row">
<div class="radio-installments ast-col-md-6">
<input class="pay-option wc-option-pay-deposit" checked type="radio" name="payment-type-${n}" id="payInstallments${n}">
<label for="payInstallments${n}">
Pay in installments
</label>
</div>
<div class="radio-full ast-col-md-6">
<input class="pay-option wc-option-pay-full" type="radio" name="payment-type-${n}" id="payFull${n}">
<label for="payFull${n}">
Pay in full
</label>
</div>
</div>
`;
  }

  let incExc = "";
  if (c.has_inc_exc) {
    incExc += `\n<div class="inc-exc-inner">\n<p class="inc-exc-title">What’s Included</p>\n<div class="inc-exc-div">\n`;
    for (const i of c.includes) incExc += `<div class="item inc-item"><img src="${o}/wp-content/uploads/2021/11/Group-22.svg">${i}</div>\n`;
    for (const e of c.excludes) incExc += `<div class="item exc-item"><img src="${o}/wp-content/uploads/2021/11/Group-21-1.png">${e}</div>\n`;
    incExc += `</div>\n</div>\n`;
  }

  let extra = "";
  if (c.extra) {
    extra += `\n<div class="extra-features-col-inner">\n<p class="extra-features-title">Ideal For</p>\n<div class="extra-features-main">\n<div class="extra-features-main__text text-center">\n${c.extra.main_text}\n</div>\n<div class="extra-features-main__icon">\n<img src="${esc(c.extra.main_icon)}"/>\n</div>\n</div>\n`;
    if (c.extra.others) {
      extra += `<div class="other-features-div ast-flex">\n`;
      for (const of of c.extra.others) {
        extra += `<div class="other-features-div__inner">\n`;
        if (of.icon) extra += `<div class="other-features__icon">\n<img src="${esc(of.icon)}">\n</div>\n`;
        if (of.title) extra += `<p class="other-features__title text-center">${of.title}</p>\n`;
        extra += `</div>\n`;
      }
      extra += `</div>\n`;
    }
    if (c.extra.read_more !== null) {
      extra += `<div class="learn-more-btn">\n<a class="btn btn-black" href="${esc(c.course_link)}">${c.extra.read_more}</a>\n</div>\n`;
    }
    extra += `</div>\n`;
  }

  return `
<div class="ast-row">
<div class="ast-col-md-12">
<div class="sales-courses-section__header red-header-block">${c.header}</div>
</div>
</div>
<div ${c.row_attr} class="ast-row ast-flex sale-courses-content-row">
<div style="background:linear-gradient(90deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('${esc(c.image)}')" class="ast-col-md-4 course-detail-col" >
<div class="discount">
<span>${c.percentage}%</span>
Discount
</div>
<div class="text-center course-detail-col-inner">${inner}</div>
</div>
<div class="ast-col-md-4 course-inc-exc-col">${incExc}</div>
<div class="ast-col-md-4 extra-features-col">${extra}</div>
</div>
`;
}
