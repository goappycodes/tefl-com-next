/**
 * Category archive — native port of the child theme's category.php (+ Astra's
 * number pagination). Data: wordpress/headless/native/category.php.
 */
import { css, html } from "../attrs";

import type { CategoryArchiveData } from "./types";

export default function CategoryArchive({ data }: { data: CategoryArchiveData }) {
  return (
    <>
      {data.posts.length ? (
        <section className="blogs-section life-story-abroad life-story-sec" style={css("padding: 0 0 0 0;")}>
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col-md-12">
                <h1
                  style={css("font-size:32px;font-weight:700;line-height:41.6px;color:#1c1c1b;margin:0;text-align:center;text-transform:uppercase;")}
                  dangerouslySetInnerHTML={html(data.title_html)}
                />
              </div>
              {data.posts.map((p, i) => (
                <div key={i} className="ast-col-md-4">
                  <div className="blog-item" style={css(`background: url('${p.thumb}'); margin-bottom: 50px;`)}>
                    <div className="bolg-content">
                      <h3 dangerouslySetInnerHTML={html(p.title)} />
                      <a className="blog-link" href={p.url}>
                        {"READ MORE "}
                        <i className="fa fa-angle-right" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {data.pagination ? <div className="ast-pagination" dangerouslySetInnerHTML={html(data.pagination)} /> : null}
    </>
  );
}
