/**
 * Hero banner, countdown section and free-gifts strip shared by the January
 * sale landing pages (january-courses-sale.php, january-internships-sale.php,
 * internship-black-friday-landing-page.php) — the three differ only in the
 * gift columns, hence `gifts`.
 */
import { ih, TeflTimer } from "./shared";
import type { JanTopData } from "./types";

export type GiftVariant = "courses" | "internships" | "internship-bf";

export default function JanTop({ top, gifts }: { top: JanTopData; gifts: GiftVariant }) {
  return (
    <>
      {top.hero ? (
        <section className="py-50 hero-section" style={{ background: `url('${top.hero.bg}')` }}>
          <div className="ast-container">
            <div className="ast-row ast-flex ast-align-items-center hero-banner">
              <div className="hero-banner__left ast-col-md-6">
                <img className="hero-banner__image" src={top.hero.image} alt="" />
              </div>
              <div className="hero-banner__right ast-col-md-6">
                <h1
                  className="hero-banner__header text-center mb-1"
                  dangerouslySetInnerHTML={ih(
                    `\n<span class="hero-banner__header--higlighted">${top.hero.highlighted}</span>\n${top.hero.main}\n`,
                  )}
                />
                <div className="hero-banner__subheader text-center" dangerouslySetInnerHTML={ih(top.hero.subheader)} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {top.timer ? (
        <section className="py-50 timer-section">
          <div className="ast-container">
            <div className="ast-row clockdown-timer">
              <div className="ast-col-md-6 clockdown-timer__content">
                <h3 className="clockdown-timer__content--title mb-1" dangerouslySetInnerHTML={ih(top.timer.title)} />
                <div className="clockdown-time__content--details" dangerouslySetInnerHTML={ih(top.timer.content)} />
              </div>
              <div className="ast-col-md-6 clockdown-timer__clockdown">
                <div className="countdown-container text-center">
                  <TeflTimer t={top.timer.timer} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {top.gifts ? (
        <section className="free-gifts-section">
          <div className="ast-container ">
            <div className="ast-row free-gifts-row">
              <img src={`${top.origin}/wp-content/uploads/2022/11/gold_ribbon.png`} alt="" className="ribbon" />
              <h3
                className="mb-1 text-center free-gifts-row__title"
                dangerouslySetInnerHTML={ih(`\n<span>A perfect start to teach English online</span>\n${top.gifts.title}`)}
              />
              {top.gifts.items.map((fg, i) =>
                gifts === "internship-bf" ? (
                  <div key={i} className="ast-col-md-2 free-gift-col">
                    <img className="mb-1 free-gift-col__icon" src={fg.icon} alt="" />
                    <div className="free-gift-col__title text-center" dangerouslySetInnerHTML={ih(`${fg.title}:`)} />
                    <div className="free-gift-col__subtitle text-center" dangerouslySetInnerHTML={ih(fg.subtitle)} />
                  </div>
                ) : (
                  <div key={i} className="ast-col-md-4 free-gift-col">
                    <img
                      className={gifts === "internships" ? "mb-1 free-gift-col__icon" : "free-gift-col__icon"}
                      src={fg.icon}
                      alt=""
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
