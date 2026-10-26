/**
 * Default page template — Astra's page.php → content-page.php →
 * single/content-header.php, as the site uses it (no sidebar, no comments,
 * banner = the page title or nothing). Data: native/page.php.
 */
import { attrProps } from "./attrs";
import type { DefaultPageData } from "./types";

export default function DefaultPage({ data }: { data: DefaultPageData }) {
  const h = data.header;
  return (
    <div id="primary" className={data.primary_class}>
      <main id="main" className="site-main">
        <article {...attrProps(data.article)}>
          {h ? (
            <header className={`entry-header ${h.class}`}>
              {h.title_html ? (
                <h1 className="entry-title" {...attrProps(h.title_attrs)} dangerouslySetInnerHTML={{ __html: h.title_html }} />
              ) : null}
            </header>
          ) : null}
          <div className="entry-content clear" {...attrProps(data.entry_attrs)} dangerouslySetInnerHTML={{ __html: data.content_html }} />
        </article>
      </main>
    </div>
  );
}
