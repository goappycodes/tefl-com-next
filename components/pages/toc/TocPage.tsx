/**
 * "Page Template with TOC" — native port of page-toc.php. The template's own
 * inline script (TOC builder, jQuery ready) and style block are emitted as on
 * live, the script deferred for WpScripts. Data: native/page-toc.php.
 */
import { html } from "../attrs";

import { SCRIPTS, STYLES } from "./inline";
import type { TocPageData } from "./types";

export default function TocPage({ data }: { data: TocPageData }) {
  let i = 0;
  return (
    <>
      <div id="primary" className={data.primary_class}>
        <div className="toc_body">
          {" "}
          <ol id="toc_body"> </ol>{" "}
        </div>

        <div className="content-container" dangerouslySetInnerHTML={html(`<h1>${data.title_html}</h1>${data.body_html}`)} />

        {data.accordion.map((el, k) => (
          <div key={k} id={el.bookmark}>
            <h3 dangerouslySetInnerHTML={html(el.title)} />
            {el.items.map((qa) => {
              const n = i++;
              return (
                <section key={n} className="accordion-container">
                  <input id={`accordion-${n}`} name="accordion-1" type="radio" defaultChecked={n === 0} />
                  <label htmlFor={`accordion-${n}`} dangerouslySetInnerHTML={html(qa.title)} />
                  <article dangerouslySetInnerHTML={html(qa.content)} />
                </section>
              );
            })}
          </div>
        ))}
      </div>

      <script type="text/tefl-deferred" dangerouslySetInnerHTML={html(SCRIPTS[0])} />

      <style dangerouslySetInnerHTML={html(STYLES[0])} />
    </>
  );
}
