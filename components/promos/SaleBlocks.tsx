/**
 * Blocks the Black Friday / January sale templates share
 * (black-friday-sale-prz.php, tefl-january-sale.php): tools, accreditations,
 * FAQ questions, the stats panel, the review star rows and the Klarna modal.
 * Same markup as the PHP; raw ACF values arrive as HTML (see ./shared).
 */
import { ih } from "./shared";
import type { SaleAccreditations, SaleFaq, SalePanelItem, SaleStarRow, SaleTools } from "./types";

export function Tools({ tools }: { tools: SaleTools }) {
  return (
    <section className="content-section">
      <div className="tools-title" dangerouslySetInnerHTML={ih(tools.title)} />

      <div className="tools">
        {tools.items.map((e, i) => (
          <div key={i} className="tool">
            <img src={e.icon} />
            <div className="name" dangerouslySetInnerHTML={ih(e.name)} />
            <div className="text" dangerouslySetInnerHTML={ih(e.text)} />
            <a href={e.link} className="ahref" dangerouslySetInnerHTML={ih(e.value)} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** The accreditations tick icon, as the template writes it. */
const ACC_TICK =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="accreditations-svg"><polyline points="20 6 9 17 4 12"></polyline></svg>';

export function Accreditations({ acc }: { acc: SaleAccreditations }) {
  return (
    <section className="content-section">
      <div className="accreditations">
        <div className="title" dangerouslySetInnerHTML={ih(acc.title)} />
        <img src={acc.graphic} />

        <div className="points">
          {acc.points.map((p, i) => (
            <div key={i} className="point" dangerouslySetInnerHTML={ih(`\n${ACC_TICK}\n${p}\n`)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** FAQ left column. */
export function FaqLeft({ faq }: { faq: SaleFaq }) {
  return (
    <div className="left-faq">
      <div className="title" dangerouslySetInnerHTML={ih(faq.title)} />

      <div className="subtitle" dangerouslySetInnerHTML={ih(faq.subtitle)} />

      <div className="faq-text" dangerouslySetInnerHTML={ih(faq.text)} />
    </div>
  );
}

/**
 * FAQ questions. The headings carry an inline onclick="toggleFaq(this)" (the
 * template's own toggle, defined in its inline script), which React can't
 * render as an attribute — so the column's content is HTML.
 */
export function FaqRight({ faq }: { faq: SaleFaq }) {
  const html = faq.questions
    .map(
      (q) => `
                    <div class="each-question">
                        <div class="heading" onclick="toggleFaq(this)">
                            ${q.heading}
                            <span class="toggle-icon">+</span>
                        </div>
                        <div class="text">
                            ${q.text}
                        </div>
                    </div>`,
    )
    .join("");
  return <div className="right-faq" dangerouslySetInnerHTML={ih(html)} />;
}

export function Panel({ panel }: { panel: SalePanelItem[] }) {
  return (
    <section className="content-section">
      <div className="panel">
        {panel.map((e, i) => (
          <div key={i} className="each-panel">
            <div className="left-panel">
              <img src={e.icon} />
            </div>
            <div className="right-panel" dangerouslySetInnerHTML={ih(`\n<span>${e.heading}</span>\n${e.text}\n`)} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** The review widget's 5→1 star rows (the theme script animates .progress-bar[percent]). */
export function StarRows({ rows }: { rows: SaleStarRow[] }) {
  return (
    <>
      {rows.map((r) => (
        <div key={r.star} className="review-status">
          <div className="progress-text">{`${r.star} Star`}</div>
          <div className="progress">
            <div className="progress-bar" {...{ percent: r.percent }} />
          </div>
          <div className="progress-value" dangerouslySetInnerHTML={ih(`${r.percent_html}%`)} />
        </div>
      ))}
    </>
  );
}

/** #klarnaModal (opened by the template's "Learn more" links script). */
export function KlarnaModal({ front, installment, origin }: { front: boolean; installment: string; origin: string }) {
  return (
    <div id="klarnaModal" className="klarna-modal">
      <div className="modal-content">
        <span className="close">×</span>
        <img className="klarna-logo-header" src={`${origin}/wp-content/uploads/2023/04/Klarna-logotype-black.svg_.svg`} alt="" />
        {front ? (
          <h2 className="klarna-modal-header home">
            3 interest payments of <span className="installment-price" /> (0% APR).
          </h2>
        ) : (
          <h2 className="klarna-modal-header" dangerouslySetInnerHTML={ih(`3 interest payments of ${installment} (0% APR).`)} />
        )}
        <span className="klarna-modal-subheader">Pay in 3 interest-free payments so you can spread the cost. No fees.</span>
        <div className="klarna-payment-details">
          <span className="klarna-payment-detail">Add item(s) to your basket.</span>
          <span className="klarna-payment-detail">
            Go to checkout and choose{" "}
            <img
              src={`${origin}/wp-content/uploads/2023/04/Klarna-marketing-badge-pink-rgb.svg_.svg`}
              alt=""
              className="klarna-logo"
            />
          </span>
          <span className="klarna-payment-detail">Enter your debit or credit card information.</span>
          <span className="klarna-payment-detail">
            To check eligibility, Klarna will perform a soft search with credit reference agency. This will not affect
            your credit score.
          </span>
          <span className="klarna-payment-detail">
            Spread the cost in 3 interest-free payments. The first payment is made at point of purchase, with the
            remaining 2 payments scheduled automatically every 30 days. No fees.
          </span>
        </div>
        <div className="klarna-payment-footnote">
          Please note that a higher initial payment may be required for some purchases. You must be 18+ to use this
          credit offer. Klarna uses soft searches with credit reference agencies. This does not affect your credit rating.
          Missed payments can affect your ability to use the Pay in 3 feature.
        </div>
        <a href="#" className="close close-btn">
          Close
        </a>
      </div>
    </div>
  );
}

