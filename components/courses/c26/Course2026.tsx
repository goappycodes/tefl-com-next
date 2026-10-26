/**
 * Course page, 2026 design — native port of the theme's course-page-2026.php
 * (helpers in includes/course-2026.php). Data from `tefl/v1/native/course-2026`
 * (wordpress/headless/native/course-2026.php).
 *
 * Same markup as the PHP template, so the theme's course-2026.css styles it and
 * its course-2026.js (`ti-c26`) keeps driving prices (ti_c26_quote), add-ons,
 * enrol (ti_c26_enrol), the countdown, the students scroller and the video modal.
 */
import type { ReactNode } from "react";

import type { C26ImgAttrs, C26Link, Course2026Data } from "./types";

import { DLOPO_SCRIPT } from "./dlopo";
import Icon from "./Icon";

/* The overview key-number icons, in order (fixed markup in the template). */
const STAT_ICONS = [
  '<path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/>',
  '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
];

const CD_CELLS: [string, string][] = [
  ["d", "Days"],
  ["h", "Hours"],
  ["m", "Minutes"],
  ["s", "Seconds"],
];

/** The template's $kicker(): '' when empty. */
function Kicker({ text }: { text: string }) {
  return text ? <div className="c26-kicker">{text}</div> : null;
}

/** The template's $rule. */
function Rule() {
  return <div className="c26-rule" aria-hidden="true" />;
}

/** ti_c26_link(). */
function C26A({ link, className, after }: { link: C26Link | null; className: string; after?: ReactNode }) {
  if (!link) return null;
  return (
    <a href={link.href} className={className} {...(link.target ? { target: link.target, rel: "noopener" } : {})}>
      {link.title}
      {after}
    </a>
  );
}

/** An <img> from wp_get_attachment_image(), rebuilt from its attributes. */
const REACT_ATTR: Record<string, string> = { class: "className", srcset: "srcSet", crossorigin: "crossOrigin", referrerpolicy: "referrerPolicy" };
function Img({ attrs }: { attrs: C26ImgAttrs | null }) {
  if (!attrs) return null;
  const props: Record<string, string> = {};
  for (const [k, v] of attrs) props[REACT_ATTR[k] ?? k] = v;
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />;
}

export default function Course2026({ data: d }: { data: Course2026Data }) {
  const q = d.quote;
  return (
    <div className="c26" id="c26">
      {/* HERO */}
      <section className="c26-hero">
        <nav className="c26-crumbs c26-wrap" aria-label="Breadcrumb">
          <a href={d.home_url}>Home</a>
          <span>/</span>
          <a href={d.courses_url}>TEFL Courses</a>
          <span>/</span>
          {d.crumb ? (
            <>
              <a href={d.crumb.href}>{d.crumb.title}</a>
              <span>/</span>
            </>
          ) : null}
          <span className="c26-crumb-current" aria-current="page">
            {d.page_title}
          </span>
        </nav>
        <div className="c26-hero-grid c26-wrap">
          <div className="c26-hero-copy">
            {d.badges.length ? (
              <div className="c26-badges">
                {d.badges.map((b, i) => (
                  <span key={i} className={`c26-badge c26-badge--${b.style}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            ) : null}
            <h1 className="c26-h1">{d.title}</h1>
            {d.intro ? <p className="c26-hero-intro">{d.intro}</p> : null}
            {d.points.length ? (
              <ul className="c26-ticks">
                {d.points.map((t, i) => (
                  <li key={i}>
                    <span className="c26-tick">
                      <Icon name="check" className="c26-icon c26-icon--xs" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="c26-btn-row">
              <a href={d.cart_url} className="c26-btn c26-btn--green" data-c26-enrol="">
                {d.enrol}
              </a>
              {d.secondary ? (
                <a href="#modules" className="c26-btn c26-btn--outline" data-c26-jump="modules">
                  {d.secondary}
                </a>
              ) : null}
            </div>
            <div className="c26-trust">
              {d.trust.rating ? (
                <>
                  <span className="c26-trust-item">
                    <Icon name="star" className="c26-icon c26-icon--sm c26-gold" />
                    <strong>{d.trust.rating}</strong>
                    {` ${d.trust.rating_label}`}
                  </span>
                  <span className="c26-trust-div" aria-hidden="true" />
                </>
              ) : null}
              {d.trust.stat ? (
                <span>
                  <strong>{d.trust.stat}</strong>
                  {` ${d.trust.stat_label}`}
                </span>
              ) : null}
            </div>
          </div>
          {d.form ? (
            <div className="c26-hero-form" id="letsTalkTEFL">
              <h2 className="c26-hero-form-title">{d.form.title}</h2>
              <p className="c26-hero-form-intro">{d.form.intro}</p>
              <div className="c26-cf7" dangerouslySetInnerHTML={{ __html: d.form.cf7 }} />
              <p className="c26-hero-form-note">{d.form.note}</p>
            </div>
          ) : (
            <div className="c26-hero-media" dangerouslySetInnerHTML={{ __html: d.hero_media }} />
          )}
        </div>
      </section>

      {/* GROUP BOOKINGS STRIP */}
      {d.strip ? (
        <aside className="c26-strip" aria-label="Group bookings for schools">
          <div className="c26-strip-inner c26-wrap">
            <span className="c26-strip-icon">
              <Icon name="users" />
            </span>
            <p className="c26-strip-text">{d.strip.text}</p>
            {d.strip.href ? (
              <a className="c26-btn c26-btn--white c26-btn--sm" href={d.strip.href}>
                Get in touch
              </a>
            ) : null}
          </div>
        </aside>
      ) : null}

      {/* STICKY SECTION NAV */}
      <div className="c26-subnav">
        <div className="c26-subnav-inner c26-wrap">
          <nav className="c26-tabs" aria-label="On this page">
            {d.nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="c26-tab" data-c26-jump={n.id}>
                {n.label}
              </a>
            ))}
          </nav>
          {q ? (
            <div className="c26-subnav-price">
              <span>
                <strong data-c26="now">{q.now}</strong> <s data-c26="was">{q.was}</s>
              </span>
              <a href={d.cart_url} className="c26-btn c26-btn--navy c26-btn--sm" data-c26-enrol="">
                {d.enrol}
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {/* MAIN + PRICE CARD */}
      <div className="c26-layout c26-wrap">
        <main className="c26-main">
          <Sections d={d} />
        </main>

        <aside id="price" className="c26-aside">
          {q ? (
            <div className="c26-price-card" data-c26-price="">
              <div className="c26-price-top">
                <div className="c26-price-row">
                  <span className="c26-label">{d.price_kicker}</span>
                  <span className="c26-save" data-c26="saving" hidden={!q.saving}>
                    {q.saving}
                  </span>
                </div>
                <div className="c26-price-big">
                  <span data-c26="now">{q.now}</span>
                  <s data-c26="was">{q.was}</s>
                </div>
              </div>
              <div className="c26-price-body">
                {q.addons ? (
                  <>
                    <div className="c26-label c26-label--rule">{d.addons_heading}</div>
                    {q.addons.map((a) => (
                      <button key={a.id} type="button" className="c26-addon" data-c26-addon={a.id} aria-pressed="false">
                        <span className="c26-addon-copy">
                          <span className="c26-addon-name">{a.name}</span>
                          <span className="c26-addon-price" data-c26-addon-price="">
                            {a.price}
                          </span>
                        </span>
                        <span className="c26-addon-btn" data-c26-addon-label="">
                          + Add
                        </span>
                      </button>
                    ))}
                    <div className="c26-total">
                      <span>Total today</span>
                      <strong data-c26="total">{q.total}</strong>
                    </div>
                  </>
                ) : null}
                <a href={d.cart_url} className="c26-btn c26-btn--green c26-btn--block" data-c26-enrol="">
                  {`${d.enrol} `}
                  <Icon name="arrow-right" className="c26-icon c26-icon--sm" />
                </a>
                <div className="c26-enrol-error" role="alert" hidden />
                {d.price_note ? <div className="c26-price-note">{d.price_note}</div> : null}
              </div>
              {d.countdown ? (
                <div className="c26-countdown" data-c26-countdown={d.countdown}>
                  <div className="c26-label c26-label--green">Offer ends in</div>
                  <div className="c26-cd-grid">
                    {CD_CELLS.map(([k, l]) => (
                      <div key={k} className="c26-cd-cell">
                        <span data-c26-cd={k}>00</span>
                        <small>{l}</small>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {d.quote_box ? (
            <div className="c26-quote">
              <Img attrs={d.quote_box.avatar} />
              <div>
                <strong>{d.quote_box.heading}</strong>
                <C26A link={d.quote_box.link} className="c26-quote-link" />
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      {d.students ? (
        <>
          {/* STUDENTS (pinned horizontal scroll on desktop, swipe on mobile) */}
          <section id="students" className="c26-students" data-c26-students="">
            <div className="c26-students-pin">
              <div className="c26-students-head c26-wrap">
                <div className="c26-head">
                  <Kicker text={d.students.kicker} />
                  <h2 className="c26-h2 c26-h2--lg">{d.students.heading}</h2>
                </div>
                <div className="c26-progress" aria-hidden="true">
                  <div data-c26-bar="" />
                </div>
              </div>
              <div className="c26-students-track" data-c26-track="">
                {d.students.videos.map((v) => (
                  <div key={v.i} className="c26-video">
                    <button
                      type="button"
                      className="c26-video-media"
                      {...(v.video ? { "data-c26-video": v.i } : { disabled: true })}
                      aria-label={v.label}
                    >
                      <Img attrs={v.image} />
                      {v.video ? (
                        <span className="c26-play">
                          <Icon name="play" className="c26-icon c26-icon--sm" />
                        </span>
                      ) : null}
                    </button>
                    <div className="c26-video-name">{v.name}</div>
                    {v.video ? <template data-c26-video-embed={v.i} dangerouslySetInnerHTML={{ __html: v.video }} /> : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <dialog className="c26-modal" data-c26-modal="" aria-label="Student video">
            <button type="button" className="c26-modal-close" data-c26-close="" aria-label="Close">
              ×
            </button>
            <div className="c26-modal-body" data-c26-modal-body="" />
          </dialog>
        </>
      ) : null}

      {d.reviews ? (
        /* REVIEWS (from the TEFL for Schools v3 page) */
        <section id="reviews" className="c26-reviews">
          <div className="c26-wrap">
            <div className="c26-head">
              <Kicker text={d.reviews.kicker} />
              <h2 className="c26-h2 c26-h2--lg">{d.reviews.heading}</h2>
            </div>
            <div className="c26-testis">
              {d.reviews.quotes.map((r, i) => (
                <figure key={i} className={`c26-testi${r.logo ? "" : " c26-testi--nologo"}`}>
                  {r.logo ? <div className="c26-testi-media" dangerouslySetInnerHTML={{ __html: r.logo }} /> : null}
                  <div>
                    <blockquote>
                      <p>{`“${r.quote}”`}</p>
                    </blockquote>
                    <figcaption>{`— ${r.name}${r.role ? `, ${r.role}` : ""}`}</figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {d.faq ? (
        /* FAQ */
        <section id="faq" className="c26-faq">
          <div className="c26-faq-grid c26-wrap">
            <div className="c26-head">
              <Rule />
              <h2 className="c26-h2 c26-h2--lg">{d.faq.heading}</h2>
              <p className="c26-body-text">{d.faq.intro}</p>
            </div>
            <div className="c26-accordion">
              {d.faq.rows.map((f, i) => (
                <details key={i} className="c26-acc-item" open={i === 0}>
                  <summary className="c26-faq-q">
                    {f.q}
                    <span className="c26-chev">
                      <Icon name="chevron-down" />
                    </span>
                  </summary>
                  <div className="c26-faq-a" dangerouslySetInnerHTML={{ __html: f.a }} />
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA BAND */}
      {d.cta ? (
        <section className="c26-cta">
          <div className="c26-cta-inner c26-wrap">
            <div className="c26-stack-sm">
              <div className="c26-label c26-label--green">{d.cta.kicker}</div>
              <div className="c26-cta-h">{d.cta.heading}</div>
            </div>
            <div className="c26-btn-row">
              <a href="#price" className="c26-btn c26-btn--green" data-c26-jump="price">
                {q ? `${d.enrol} · ` : d.enrol}
                {q ? <span data-c26="now">{q.now}</span> : null}
              </a>
              <C26A link={d.cta.secondary} className="c26-btn c26-btn--ghost" />
            </div>
          </div>
        </section>
      ) : null}

      {/* DLOPO POPUP: Dlopo's own embed — template-written inline script, deferred like the render does. */}
      <script type="text/tefl-deferred" dangerouslySetInnerHTML={{ __html: DLOPO_SCRIPT }} />
    </div>
  );
}

/** The main-column sections, in the order the template builds $sections. */
function Sections({ d }: { d: Course2026Data }) {
  const { overview: ov, included: inc, who, modules: mod, certificate: cert, resources: res } = d;
  return (
    <>
      {ov ? (
        <section id="overview" className="c26-section">
          <Rule />
          <h2 className="c26-h2">{ov.heading}</h2>
          <div className="c26-prose" dangerouslySetInnerHTML={{ __html: ov.body }} />
          {ov.stats.length ? (
            <div className="c26-stats">
              {ov.stats.map((s, i) => (
                <div key={i} className="c26-stat">
                  <span className="c26-stat-icon">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                      dangerouslySetInnerHTML={{ __html: STAT_ICONS[i % STAT_ICONS.length] }}
                    />
                  </span>
                  <div className="c26-stat-num">{s.value}</div>
                  <div className="c26-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {inc ? (
        <section id="included" className="c26-section">
          <div className="c26-head">
            <Kicker text={inc.kicker} />
            <h2 className="c26-h2">{inc.heading}</h2>
          </div>
          <div className="c26-included">
            {inc.items.map((o, i) => (
              <div key={i} className="c26-included-item">
                <span className="c26-included-icon">
                  <Icon name={o.icon} />
                </span>
                <div>
                  <div className="c26-included-title">{o.title}</div>
                  <div className="c26-small">{o.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {who ? (
        <section id="who" className="c26-section">
          <div className="c26-head">
            <Rule />
            <h2 className="c26-h2">{who.heading}</h2>
          </div>
          {who.who ? (
            <div className="c26-grid-2">
              {who.who.map((w, i) => (
                <div key={i} className="c26-card c26-card--ivory">
                  <div className="c26-h4">{w.title}</div>
                  <div className="c26-small">{w.text}</div>
                </div>
              ))}
            </div>
          ) : null}
          {who.promos ? (
            <div className="c26-grid-2">
              {who.promos.map((p, i) => (
                <div key={i} className={`c26-promo c26-promo--${p.style}`}>
                  {p.kicker ? <div className="c26-promo-kicker">{p.kicker}</div> : null}
                  <div className="c26-promo-title">{p.title}</div>
                  <div className="c26-promo-text">{p.text}</div>
                  <C26A link={p.link} className="c26-promo-link" after={<Icon name="arrow-right" className="c26-icon c26-icon--sm" />} />
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {mod ? (
        <section id="modules" className="c26-section">
          <div className="c26-head">
            <Kicker text={mod.kicker} />
            <h2 className="c26-h2">{mod.heading}</h2>
            <div className="c26-meta">
              {mod.time_note ? (
                <span>
                  <Icon name="clock" className="c26-icon c26-icon--sm c26-green" />
                  {mod.time_note}
                </span>
              ) : null}
              {mod.access_note ? (
                <span>
                  <Icon name="laptop" className="c26-icon c26-icon--sm c26-green" />
                  {mod.access_note}
                </span>
              ) : null}
            </div>
          </div>
          <div className="c26-accordion c26-modules">
            {mod.items.map((m, i) => (
              <details key={i} className="c26-acc-item" open={m.open}>
                <summary className="c26-module-row">
                  <span className="c26-module-num">{m.num}</span>
                  <span className="c26-module-title">{m.title}</span>
                  <span className="c26-chev">
                    <Icon name="chevron-down" />
                  </span>
                </summary>
                <div className="c26-module-body">
                  <div className="c26-body-text">{m.text}</div>
                  {mod.foot ? (
                    <div className="c26-module-foot">
                      <Icon name="check" className="c26-icon c26-icon--xs c26-green" />
                      {mod.foot}
                    </div>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {cert ? (
        <section id="certificate" className="c26-section">
          <div className="c26-head">
            <Rule />
            <h2 className="c26-h2">{cert.heading}</h2>
            {cert.intro ? <p className="c26-lead">{cert.intro}</p> : null}
          </div>
          <div className="c26-cert-panel">
            {cert.image !== null ? (
              <div className="c26-cert c26-cert--image" dangerouslySetInnerHTML={{ __html: cert.image }} />
            ) : (
              <div className="c26-cert" aria-label="Sample certificate">
                <div className="c26-cert-inner">
                  <span className="c26-cert-logo" dangerouslySetInnerHTML={{ __html: cert.logo }} />
                  <div className="c26-cert-label">Certificate of completion</div>
                  <div className="c26-cert-italic">This is to certify that</div>
                  <div className="c26-cert-name">Your Name</div>
                  <div className="c26-cert-line" />
                  <div className="c26-cert-text">
                    has completed the
                    <br />
                    <strong>{cert.cert_title}</strong>
                  </div>
                  <div className="c26-cert-foot">
                    <span>No. TI-120-000000</span>
                    <span className="c26-cert-seal">
                      <Icon name="award" className="c26-icon c26-icon--sm" />
                    </span>
                    <span>{cert.cert_footer}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="c26-stack">
              <div className="c26-h3">{cert.card_heading}</div>
              <div className="c26-body-text">{cert.card_text}</div>
              <div className="c26-btn-row">
                <C26A link={cert.sample} className="c26-btn c26-btn--green c26-btn--sm" />
                <C26A link={cert.verify} className="c26-btn c26-btn--outline c26-btn--sm" />
              </div>
            </div>
          </div>
          {cert.accs ? (
            <div className="c26-accs">
              {cert.accs.map((a, i) => (
                <div key={i} className="c26-acc-badge">
                  {a.logo ? (
                    <span className="c26-acc-logo" dangerouslySetInnerHTML={{ __html: a.logo }} />
                  ) : a.badge ? (
                    <span className="c26-acc-text">{a.badge}</span>
                  ) : null}
                  <span className="c26-acc-copy">
                    <strong>{a.name}</strong>
                    <span>{a.note}</span>
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {res ? (
        <section id="resources" className="c26-section">
          <div className="c26-head">
            <Kicker text={res.kicker} />
            <h2 className="c26-h2">{res.heading}</h2>
          </div>
          <div className="c26-guides">
            {res.guides.map((g, i) => (
              <div key={i} className="c26-guide">
                <div className={`c26-guide-img c26-fit-${g.fit}`} dangerouslySetInnerHTML={{ __html: g.image }} />
                <div className="c26-guide-body">
                  <div className="c26-h4">{g.title}</div>
                  <div className="c26-small">{g.text}</div>
                  {g.href ? (
                    <a className="c26-btn c26-btn--outline c26-btn--xs" href={g.href} {...(g.download ? { download: "" } : {})}>
                      <Icon name="download" className="c26-icon c26-icon--xs" />
                      Download
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
