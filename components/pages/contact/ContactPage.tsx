/** "Contact Page Template" — native port of page-contact.php. Data: native/page-contact.php. */
import { el, html } from "../attrs";

export interface ContactCards {
  heading: string;
  items: { icon: string; title: string; subtitle: string; details: string }[];
  has_items: boolean;
}

export interface ContactPageData {
  ok: true;
  path: string;
  country: string;
  contact: ContactCards;
}

/** The contact-cards section (also in meet-the-team.php). */
export function ContactSection({ contact }: { contact: ContactCards }) {
  return (
    <section className="contact-section">
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12" dangerouslySetInnerHTML={html(el("h2", { class: "section-heading" }, contact.heading))} />
        </div>
        {contact.has_items ? (
          <div className="ast-row contact-icons">
            {contact.items.map((c, i) => (
              <div
                key={i}
                className="ast-col-md-3 ast-col-xs-6"
                dangerouslySetInnerHTML={html(el("img", { src: c.icon }) + el("h3", null, c.title) + el("p", null, c.subtitle) + el("p", null, c.details))}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function ContactPage({ data }: { data: ContactPageData }) {
  return (
    <>
      <section className="header-section">
        {/* The template's own typo: `calss`. */}
        <div {...{ calss: "ast-container" }}>
          <div className="ast-row">
            <div className="ast-col-lg-6 ast-col-sm-12">
              <h1 className="section-heading">
                contact us
                <br />
                helping you become a tefl
                <br />
                teacher
              </h1>
              <p>
                Whether you are here to launch your TEFL career or travel the world with ease, the TEFL Institute is here to
                help. Our institute allows you to become a fully qualified and internationally recognized TEFL teacher.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="makes-us-different-section contact-form">
        <div className="ast-container">
          <div className="ast-row contact-us-form">
            <div className="ast-col-md-7">
              <iframe
                width="100%"
                height="605px"
                src="https://theteflinstitute-teflinstitute.zohobookings.eu/portal-embed#/customer/theteflinstitute"
                frameBorder="0"
                allowFullScreen
              />
            </div>
            <div className="ast-col-md-5">
              <div className="contact-details">
                <div className="details">
                  <h4>Headquarters</h4>
                  <p>
                    The TEFL Institute
                    <br />
                    13 Adelaide Rd, <br />
                    Saint Kevin&#39;s, <br />
                    Dublin, <br />
                    D02 P950
                  </p>
                </div>
                <div className="details">
                  <h4>Central Administration</h4>
                  <p>
                    The TEFL Institute
                    <br />
                    6 Mornington Pl,
                    <br />
                    Greater, London NW1 7RP,
                    <br />
                    United Kingdom
                  </p>
                </div>
                <div className="details">
                  <h4>EMAIL US</h4>
                  <p>
                    <a href="mailto:hello@teflinstitute.com">hello@teflinstitute.com</a>
                  </p>
                </div>
                <div className="details">
                  <h4>CALL US</h4>
                  <p>
                    <span>
                      <a href="tel:003535873135">🇮🇪 +(0) 353 5873135</a>
                    </span>
                    <br />
                    <span>
                      <a href="tel:00442033185366">🇬🇧 +44 203 318 5366</a>
                    </span>
                    <br />
                    <span>
                      <a href="tel:0016172022524">🇺🇸 +1 6172022524</a>
                    </span>
                    <br />
                    <span>
                      <a href="tel:00270875502261">🇿🇦 +27 087 5502261</a>
                    </span>
                  </p>
                </div>

                <div className="details footer-social-col">
                  <a href="https://www.facebook.com/theteflinstitute" target="_blank">
                    <i className="fa fa-facebook" />
                  </a>
                  <a href="https://www.linkedin.com/company/the-tefl-institute-ltd/" target="_blank">
                    <i className="fa fa-linkedin" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection contact={data.contact} />
    </>
  );
}
