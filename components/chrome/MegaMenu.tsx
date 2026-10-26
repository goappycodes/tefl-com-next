import { Fragment } from "react";

import type { MegaMenu as MegaMenuData, MegaSubItem } from "./types";
import { css, esc, media, raw } from "./util";

/**
 * new_mega_menu() (includes/template_functions.php) with
 * mega_menu_CTA_buttons.php and country_guides_menu_links.php: the desktop
 * mega menu, opened by ti-global.js.
 *
 * The template also prints counters as bare attributes (`<div class="ast-col-md-3" 0>`,
 * `<div class="ast-col-md-4" 1 3>`); names starting with a digit aren't valid
 * attribute names, which React can't render and nothing reads — left out.
 */
export default function MegaMenu({ mega, origin }: { mega: MegaMenuData; origin: string }) {
  const buttons = <CtaButtons buttons={mega.cta_buttons} origin={origin} />;
  return (
    <div className="ti-mega-menu-new main-menu-bar">
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col ti-mega-menu-container ast-col-md-12">
            <div className="ti-mega-menu ast-flex">
              {mega.items.map((mm, i) => (
                <div key={i} className={`ast-col ti-menu-item ${mm.has_children ? "has-children" : ""}`}>
                  {mm.link !== null ? (
                    <span>
                      <a className="menu-link" href={mm.link} {...raw(mm.title_html)} />
                    </span>
                  ) : (
                    <span {...raw(mm.title_html)} />
                  )}
                  {mm.sub ? (
                    <div className={`ast-row ti-sub-menu-item sub-menu-count${mm.sub.count}`}>
                      <div className="column-wrapper">
                        {mm.sub.cta ? (
                          <>
                            <div className="ast-col-md-3 sub-menu-left">
                              <div className="static-menu-content" {...raw(mm.sub.cta.block_html)} />
                            </div>
                            <div className="ast-col-md-9 sub-menu-right-col">
                              <div className="ast-row sub-menu-right-inner-row">
                                {mm.sub.cta.cols.map((col, j) => (
                                  <Fragment key={j}>
                                    {col.separator !== null ? (
                                      <div className="ast-col-md-12">
                                        <div className={`row-separator ${col.separator}`}></div>
                                      </div>
                                    ) : null}
                                    <div className="ast-col-md-4">
                                      <ul>
                                        <div className="sub-menu-head" {...raw(col.head_html)} />
                                        {col.items.map((it, k) =>
                                          it.heading ? (
                                            <div key={k} className={`sub-menu-head ${it.css}`} {...raw(it.title_html)} />
                                          ) : (
                                            <li key={k} className={`sub-menu-item ${it.css}`}>
                                              <a
                                                style={it.style ? css(it.style) : undefined}
                                                className="sub-menu-link"
                                                href={it.link}
                                                {...raw(it.title_html)}
                                              />
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                    {col.extra ? (
                                      <div className="ast-col-md-4 extra-sub-menu-item">
                                        {col.extra.map((e, k) => (
                                          <ul key={k}>
                                            <div className="extra-sub-menu-head" {...raw(e.head_html)} />
                                            {e.items.map((it, l) =>
                                              it.heading ? (
                                                <div key={l} className={`sub-menu-head ${it.css}`} {...raw(it.title_html)} />
                                              ) : (
                                                <li key={l} className={`sub-menu-item ${it.css}`}>
                                                  <a className="sub-menu-link custom" href={it.link} {...raw(it.title_html)} />
                                                </li>
                                              ),
                                            )}
                                          </ul>
                                        ))}
                                      </div>
                                    ) : null}
                                  </Fragment>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {mm.sub.cols.map((col, j) => (
                              <div key={j} className="ast-col-md-3">
                                <ul>
                                  <div className="sub-menu-head" {...raw(col.head_html)} />
                                  {col.items.map((it, k) => (
                                    <SubItem key={k} it={it} origin={origin} />
                                  ))}
                                </ul>
                              </div>
                            ))}
                            {mm.sub.prospectus ? <Prospectus href={mega.prospectus} origin={origin} /> : null}
                          </>
                        )}
                        {buttons}
                      </div>
                    </div>
                  ) : null}
                  {mm.cta ? (
                    <div className="ast-row ti-sub-menu-item">
                      <div className="column-wrapper has-cta-block">
                        <div className="ast-col-md-8 block-left">
                          <p className="block-title block-title-bold" {...raw(mm.cta.title_html)} />
                          <div className="country-guide-links">
                            {mm.cta.guides.map((g, j) => (
                              <div key={j} className="ast-col-md-3 country-guide">
                                <a
                                  href={g.url}
                                  className="guide-link"
                                  {...raw(
                                    `<img src="${esc(media(origin, "/wp-content/uploads/2022/10/Guide-icon.png"))}" alt="guide-icon" class="guide-icon"> ${g.name_html}`,
                                  )}
                                />
                              </div>
                            ))}
                            <div style={{ display: "none" }} className="ast-col-md-12 mt-2">
                              <CtaLinks buttons={mm.cta.buttons} origin={origin} />
                            </div>
                          </div>
                        </div>
                        <div className="ast-col-md-4">
                          <div className="block-right">
                            <CtaLinks buttons={mm.cta.buttons} origin={origin} />
                          </div>
                        </div>
                        {buttons}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A sub-menu entry of the plain (no CTA block) layout: heading, or link with an optional icon. */
function SubItem({ it, origin }: { it: MegaSubItem; origin: string }) {
  if (it.heading) return <div className={`sub-menu-head ${it.css}`} {...raw(it.title_html)} />;
  const icon = it.icon ? `<span class="menu-icon"><img src="${esc(media(origin, it.icon))}" /></span> ` : "";
  return (
    <li className={`sub-menu-item ${it.css}`}>
      <a style={it.style ? css(it.style) : undefined} href={it.link} {...raw(icon + it.title_html)} />
    </li>
  );
}

/** The first menu's prospectus download card. */
function Prospectus({ href, origin }: { href: string; origin: string }) {
  return (
    <div className="ast-col-md-3">
      <div className="prospectus-cta">
        <div className="prospectus-cta-img">
          <img src={media(origin, "/wp-content/uploads/2025/05/prospectus-cover.png")} alt="" />
        </div>
        <div className="prospectus-cta-download">
          <div className="text-center prospectus-cta-text">
            <p>TEFL STUDY PROSPECTUS</p>
            <p className="font-400">Explore global teaching opportunities with our TEFL study prospectus.</p>
          </div>
          <a href={href} className="btn" target="_blank">
            <span>Download</span> <img src={media(origin, "/wp-content/uploads/2025/03/download-icon.png")} alt="" />
          </a>
        </div>
      </div>
    </div>
  );
}

/** mega_menu_CTA_buttons.php. */
function CtaButtons({ buttons, origin }: { buttons: MegaMenuData["cta_buttons"]; origin: string }) {
  return (
    <div className="button-wrapper ast-col-md-12">
      {buttons.map((b, i) => (
        <Fragment key={i}>
          {i ? " " : null}
          <a
            href={b.link}
            className=" btn-outline t"
            {...raw(
              b.icon
                ? `${b.text_html} <img src="${esc(media(origin, b.icon))}" alt="" class="ml-1 btn-img"> `
                : `${b.text_html} <i class="ml-1 fa fa-angle-right"></i> `,
            )}
          />
        </Fragment>
      ))}
    </div>
  );
}

/** The CTA block's buttons (printed twice: hidden under the guides, and in the right column). */
function CtaLinks({ buttons, origin }: { buttons: NonNullable<MegaMenuData["items"][number]["cta"]>["buttons"]; origin: string }) {
  return (
    <>
      {buttons.map((b, i) => (
        <Fragment key={i}>
          {i ? " " : null}
          <a style={css(`color:${b.color} !important; font-size:${b.size}px; background:${b.bg}`)} href={b.link} className="cta-link">
            <img src={media(origin, b.img)} alt="" className="btn-img" />{" "}
            <span className="btn-text" {...raw(b.text_html)} />
          </a>
        </Fragment>
      ))}
    </>
  );
}
