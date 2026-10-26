/**
 * Frequently Asked Questions — native port of the theme's page-faq.php page
 * template (CSS-only radio accordion; no script).
 */
import { ldJson, raw } from "./html";
import type { FaqPageData } from "./types";

export default function FaqPage({ d }: { d: FaqPageData }) {
  return (
    <>
      <section className="faq-hero-section">
        <div className="ast-container" style={{ background: "url('https://teflinstitute.com/wp-content/uploads/2020/11/take_the_test_bg.jpg')" }}>
          <div className="ast-row banner-text-row">
            <div className="ast-col-lg-12 ast-col-md-12 ast-col-sm-12 ast-col-xs-12">
              <h1 className="banner-text" style={{ margin: 0 }}>
                TEFL Institute <br /> Frequently Asked Questions
              </h1>
            </div>
          </div>
        </div>
      </section>
      <div className="ast-row more-space">
        <div className="ast-col-md-12">
          {d.faqs.map((f, i) => (
            <section key={i} className="accordion-container">
              <input id={`accordion-${i}`} name="accordion-1" type="radio" defaultChecked={i === 0} />
              <label htmlFor={`accordion-${i}`} {...raw(f.question)} />
              <article {...raw(f.answer)} />
            </section>
          ))}
          <script
            type="application/ld+json"
            {...raw(
              ldJson({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: d.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q_raw,
                  acceptedAnswer: { "@type": "Answer", text: f.a_raw },
                })),
              }),
            )}
          />
        </div>
      </div>
    </>
  );
}
