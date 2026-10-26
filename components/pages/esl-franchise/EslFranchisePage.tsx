/**
 * "TEFL Institute Partner" — native port of ti-esl-franchise.php. The logo
 * slider is Splide, initialised by the theme's own script (same classes).
 * Data: native/ti-esl-franchise.php.
 */
import { css, html } from "../attrs";

interface Card {
  title: string;
  description: string;
}

export interface EslFranchisePageData {
  ok: true;
  path: string;
  country: string;
  primary_class: string;
  hero: { image: string; title: string; text: string; cta_text: string; logos: string[] | null } | null;
  about: { title: string; summary: string } | null;
  pathways: { title: string; courses: { title: string; logo: string; description: string; link: string }[]; how: Card | null; benefits: Card | null } | null;
  contact: {
    left: { title: string; summary: string; email: string };
    right: { title: string; contacts: { image: string; name: string; designation: string }[]; description: string };
  } | null;
  form_html: string;
}

function SideCard({ card, className }: { card: Card; className: string }) {
  return (
    <div className="ast-col-md-6">
      <div className={`card ${className}`}>
        <h3 className="large-heading card-title" dangerouslySetInnerHTML={html(card.title)} />
        <div className="card-description" dangerouslySetInnerHTML={html(card.description)} />
      </div>
    </div>
  );
}

export default function EslFranchisePage({ data }: { data: EslFranchisePageData }) {
  const { hero, about, pathways: pp, contact } = data;
  return (
    <div id="primary" className={data.primary_class}>
      {hero ? (
        <section className="hero-section py-5" style={css("background:#E4E3DD url('/wp-content/uploads/2024/12/esl_partner_hero_bg.png')")}>
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-6">
                <div className="banner-section__image equal-height">
                  <img src={hero.image} alt="" />
                </div>
              </div>
              <div className="ast-col-md-6">
                <div className="banner-section__content equal-height">
                  <h1 className="large-heading common-section-heading" dangerouslySetInnerHTML={html(hero.title)} />
                  <div className="banner-section__content-summary " dangerouslySetInnerHTML={html(hero.text)} />
                  <a href="#partnerForm" className="btn btn-primary btn-centered hero-banner-btn" dangerouslySetInnerHTML={html(hero.cta_text)} />
                </div>
              </div>
            </div>
          </div>
          {hero.logos ? (
            <div className="partner-logos">
              <div className="splide partner-logos-slider" aria-label="photo-gallery">
                <div className="splide__track">
                  <ul className="splide__list">
                    {hero.logos.map((l, i) => (
                      <li key={i} className="splide__slide">
                        <img className="slide-image no-lazy" src={l} alt="" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {about ? (
        <section className="about-section py-5">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h2 className="common-section-heading text-center large-heading about-section__title" dangerouslySetInnerHTML={html(about.title)} />
                <div className="about-section__summary" dangerouslySetInnerHTML={html(about.summary)} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {pp ? (
        <section className="partnership-pathways-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h2 className="large-heading common-section-heading text-center" dangerouslySetInnerHTML={html(pp.title)} />
              </div>
            </div>
            <div className="ast-row ast-flex">
              {pp.courses.map((c, i) => (
                <div key={i} className="ast-col-md-6">
                  <div className="card course-card">
                    <img src={c.logo} alt="" className="card-logo" />
                    <h3 className="large-heading card-title" dangerouslySetInnerHTML={html(c.title)} />
                    <div className="card-description" dangerouslySetInnerHTML={html(c.description)} />
                    <a href={c.link} className="mt-1 course-card-btn btn btn-primary btn-centered">
                      Learn More
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="ast-row pt-2 ast-flex">
              {pp.how ? <SideCard card={pp.how} className="how-it-works-card" /> : null}
              {pp.benefits ? <SideCard card={pp.benefits} className="partner-benefits-card" /> : null}
            </div>
          </div>
        </section>
      ) : null}

      {contact ? (
        <section className="py-3 contact-section">
          <div className="ast-container">
            <div className="contact-section-row">
              <div className="ast-row ast-flex">
                <div className="ast-col-md-6">
                  <div className="contact-section-left">
                    <h2 className="common-section-heading" dangerouslySetInnerHTML={html(contact.left.title)} />
                    <div className="contact-section-left-content" dangerouslySetInnerHTML={html(contact.left.summary)} />
                    <a target="_blank" href="mailto: " dangerouslySetInnerHTML={html(contact.left.email)} />
                  </div>
                </div>
                <div className="ast-col-md-6">
                  <div className="contact-section-right">
                    <h2 className="common-section-heading" dangerouslySetInnerHTML={html(contact.right.title)} />
                    <div className="contact-details">
                      {contact.right.contacts.map((c, i) => (
                        <div key={i} className="contact-detail">
                          <img src={c.image} alt="" />
                          <span className="font-700 text-center" dangerouslySetInnerHTML={html(c.name)} />
                          <span className="font-500 text-center" dangerouslySetInnerHTML={html(c.designation)} />
                        </div>
                      ))}
                    </div>
                    <div className="contact-section-right-content" dangerouslySetInnerHTML={html(contact.right.description)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section id="partnerForm" className="pb-3 partner-contact-form-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <h2 className="common-section-heading text-center">Partner with the TEFL Institute</h2>
              <div className="partner-contact-form" dangerouslySetInnerHTML={html(data.form_html)} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
