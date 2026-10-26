import { Fragment } from "react";

import Clockdown from "./Clockdown";
import MegaMenu from "./MegaMenu";
import type { ChromeHeader, Masthead, MobileItem, TiHeader } from "./types";
import { attrProps, css, media, raw } from "./util";

/**
 * Everything header.php writes between <div id="page"> and <div id="content">:
 * the skip link, astra_header_before, Astra's <header id="masthead">
 * (header-main-layout.php with the child theme's ti_header_fn() on
 * astra_main_header_bar_top and new_mega_menu() on astra_main_header_bar_bottom),
 * astra_header_after and astra_content_before.
 *
 * Same elements, classes and attributes as the theme, so the theme's scripts
 * (Astra navigation, ti-global.js mega menu / search / geo logo + phone, the
 * countdown) keep driving it unchanged.
 */
export default function Header({ data, origin }: { data: ChromeHeader; origin: string }) {
  return (
    <>
      <a className="skip-link screen-reader-text" href="#content">
        {data.skip}
      </a>
      <Html html={data.before_html} />
      {data.masthead ? <MastheadEl m={data.masthead} origin={origin} /> : null}
      <Html html={data.after_html} />
      <Html html={data.content_before_html} />
    </>
  );
}

/** Hook output outside the header element (plugin / Astra extras; empty on today's pages). */
export function Html({ html }: { html: string | null | undefined }) {
  if (!html || !html.replace(/<!--[\s\S]*?-->/g, "").trim()) return null;
  return <div style={{ display: "contents" }} suppressHydrationWarning {...raw(html)} />;
}

function MastheadEl({ m, origin }: { m: Masthead; origin: string }) {
  return (
    <header {...attrProps(m.attrs)}>
      <div className="main-header-bar-wrap">
        <div {...attrProps(m.bar_attrs)}>
          <TiHeaderEl ti={m.ti} origin={origin} />
          <div className="ast-container">
            <div className="ast-flex main-header-container">
              <div className="site-branding">
                <div {...attrProps(m.branding.identity_attrs)}>
                  <span className="site-logo-img">
                    <a href={m.branding.url} className="custom-logo-link" rel="home">
                      <img
                        src={media(origin, "/wp-content/uploads/2023/06/TEFL-Logo_Institute.svg")}
                        className="custom-logo"
                        alt="TEFL Logo - TEFL Institute"
                        decoding="async"
                      />
                    </a>
                  </span>
                </div>
              </div>
              {m.toggle ? (
                <div className="ast-mobile-menu-buttons">
                  {m.toggle.cart_whatsapp ? (
                    <div className="mobile-cart-whatsapp-btn-div">
                      <a href="https://wa.me/353831181694" className="mobile-whatsapp-btn d-none" target="_blank">
                        <img src={media(origin, "/wp-content/uploads/2025/03/whatsapp-svgrepo-com.svg")} alt="WhatsApp Chat" />
                      </a>{" "}
                      <a href={m.ti.cart_mobile} className="mobile-cart-btn">
                        <img src="https://teflinstitute.com/wp-content/uploads/2021/12/cart-1.png" alt="Cart" />
                      </a>
                    </div>
                  ) : null}
                  {m.toggle.primary ? (
                    <div className="ast-button-wrap">
                      <button
                        type="button"
                        className={m.toggle.primary.class}
                        {...attrProps(m.toggle.primary.data_attrs)}
                        aria-controls="primary-menu"
                        aria-expanded="false"
                        {...raw(m.toggle.primary.inner_html)}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div {...attrProps(m.nav.align_attrs)}>
                <div className={m.nav.container_class}>
                  <nav {...attrProps(m.nav.nav_attrs)}>
                    <div className="main-navigation">
                      <ul id={m.nav.menu_id} className={m.nav.menu_class}>
                        {m.nav.items.map((it, i) => (
                          <MobileLi key={i} it={it} />
                        ))}
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <MegaMenu mega={m.mega} origin={origin} />
        </div>
      </div>
    </header>
  );
}

/** One item of the mobile menu (ti-mobile-menu.php, the ACF mega menu as nav menu 17). */
function MobileLi({ it }: { it: MobileItem }) {
  const has = it.children.length > 0;
  return (
    <li
      className={has ? "menu-item menu-item-type-custom menu-item-has-children" : "menu-item menu-item-type-custom"}
      aria-haspopup={has ? "true" : undefined}
    >
      <a className="menu-link" href={it.href} aria-expanded={has ? "false" : undefined}>
        {it.title}
      </a>
      {has ? (
        <>
          <button className="ast-menu-toggle" aria-expanded="false">
            <span className="screen-reader-text">Menu Toggle</span>
            <span className="ast-icon icon-arrow"></span>
          </button>
          <ul className="sub-menu">
            {it.children.map((c, i) => (
              <MobileLi key={i} it={c} />
            ))}
          </ul>
        </>
      ) : null}
    </li>
  );
}

/** ti_header_fn() (includes/template_functions.php). */
function TiHeaderEl({ ti, origin }: { ti: TiHeader; origin: string }) {
  return (
    <>
      {ti.offers.map((o, i) => (
        <div key={i} style={css(`background:${o.bg}`)} className="d-none sales-offer-banner-mobile header-offer-banner">
          <div className="ast-container ast-flex ast-align-items-center">
            <div className="ast-col-md-3 logo-timer-container">
              {o.timer_active ? (
                <div className="tefl_countdown_timer">
                  <span>Offer Ends:</span>
                  <Clockdown clock={o.clock} />
                </div>
              ) : (
                <div className="promo-logo-container">
                  <a href={o.logo_link}>
                    <img src={media(origin, o.logo)} alt="" />
                  </a>
                </div>
              )}
            </div>
            <div className="ast-col-md-6 banner-content-container">
              <div
                style={css(`color:${o.text_color}; font-size:${o.font_size}px`)}
                className="mobile-offer-banner-text"
                {...raw(o.text_html)}
              />
            </div>
            <div className="ast-col-md-3 cta-container">
              {o.show_button ? (
                <a
                  style={css(`--bg-color:${o.btn_bg}; --text-color:${o.btn_color} ; --font-size:${o.btn_size}px`)}
                  href={o.btn_link}
                  className="cta-btn-white"
                  {...raw(o.btn_text_html)}
                />
              ) : null}
            </div>
            <a href={o.btn_link} className="banner-offer-overlay-link"></a>
          </div>
        </div>
      ))}

      {ti.strip ? (
        <div className="banner-strip" style={css(`background-color: ${ti.strip.color};`)}>
          <div className="banner-strip-slider">
            {ti.strip.items.map((it, i) => (
              <Fragment key={i}>
                {it.url ? (
                  <div className="slider-content-div">
                    <a href={it.url} {...raw(it.html)} />
                  </div>
                ) : (
                  <div className="slider-content-div" {...raw(it.html)} />
                )}
                {ti.strip!.clock ? <Clockdown clock={ti.strip!.clock} /> : null}
              </Fragment>
            ))}
          </div>
        </div>
      ) : null}

      {ti.banners.map((b, i) => (
        <div key={i} className="banner" style={css(`background-color: ${b.color};`)}>
          <div className="ast-container">
            {b.show_clockdown ? (
              <div className="clockContainer">
                <div className="offer">Offer ends in:</div>
                <Clockdown clock={b.clock} />
              </div>
            ) : null}
            <div className="content" {...raw(b.content_html)} />
            {b.show_button ? (
              <div className="cta">
                <a href={b.btn_link} {...raw(b.btn_text_html)} />
              </div>
            ) : null}
          </div>
        </div>
      ))}

      <div className="primary-menu-container">
        <div className="ast-container">
          <div className="ast-row">
            <div data-country={ti.country} className="primary-menu-wrapper">
              <div className="ast-col-md-3">
                <div className="ti-logo">
                  <a href={ti.logo_href}>
                    <img width="160" height="72" src={media(origin, "/wp-content/uploads/2023/06/TEFL-Logo_Institute.svg")} />
                  </a>
                </div>
              </div>
              <div className="ast-col-md-7">
                <div className="top-bar-links">
                  <div className="links">
                    {ti.links.map((l, i) => (
                      <div key={i} className="primary-menu-link__wrapper">
                        <a className="primary-menu-link" href={l.href} {...raw(l.html)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ast-col-md-2">
                <div className="d-none bf-menu-link"></div>
                <div className="header-cta-icons">
                  <div className="search-input-container">
                    <form action={ti.search_action} method="GET">
                      <img className="search-icon" src={media(origin, "/wp-content/uploads/2023/05/search-icon.svg")} alt="" />
                      <div className="search-input-field-wrapper hidden">
                        <input name="s" type="text" placeholder="Search" className="search-input-field" />{" "}
                        <img className="search-submit-icon" src={media(origin, "/wp-content/uploads/2023/05/search-icon.svg")} alt="" />
                      </div>
                    </form>
                  </div>
                  <div style={{ display: "none" }} className="country-selector-icon-container">
                    <a className="choose-country">
                      <i>
                        <img src={media(origin, "/wp-content/uploads/2023/05/globe-icon.svg")} alt="" />
                      </i>
                    </a>
                    <ul {...{ name: "ti_country_selector" }} id="ti_country_selector" className="ti-country-selector">
                      {ti.countries.map((c, i) => (
                        <li key={i} value={c.cc} title={c.name}>
                          <a className="country-link" data-call-details={ti.call_details} href="/">
                            <img src={c.flag} />
                            {c.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="student-login-icon-container">
                    <a target="_blank" href={ti.my_account}>
                      <img src={media(origin, "/wp-content/uploads/2023/05/user-icon.svg")} alt="" />
                    </a>
                  </div>
                  <div className="cart-icon-container">
                    <a href={ti.cart}>
                      <img src={media(origin, "/wp-content/uploads/2023/05/cart-icon.svg")} alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
