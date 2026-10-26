/**
 * Astra's listing templates (index.php / archive.php / search.php) with its
 * loop: template-parts/content-blog.php → blog/blog-layout.php (layout-1) or
 * blog/blog-layout-5.php, content-none.php, and the number pagination.
 * Data: wordpress/headless/native/astra-archive.php.
 */
import { attrProps, html } from "../attrs";

import type { ArchiveItem, ArchivePost, AstraArchiveData } from "./types";

export default function AstraArchive({ data }: { data: AstraArchiveData }) {
  const h = data.header;
  return (
    <div id="primary" className={data.primary_class}>
      {h ? (
        h.title_html ? (
          <section className="ast-archive-description">
            <h1 className="page-title ast-archive-title" dangerouslySetInnerHTML={html(h.title_html)} />
          </section>
        ) : (
          <section className="ast-archive-description" dangerouslySetInnerHTML={html(h.html)} />
        )
      ) : null}
      <main id="main" className="site-main">
        {data.posts.length ? (
          <div className="ast-row">
            {data.posts.map((p, i) => (
              <Post key={i} post={p} grid={data.grid} />
            ))}
          </div>
        ) : data.none ? (
          <section className="no-results not-found">
            <div className="page-content" dangerouslySetInnerHTML={html(`<p>${esc(data.none.message)}</p>${data.none.form_html}`)} />
          </section>
        ) : null}
      </main>
      {data.pagination ? <div className="ast-pagination" dangerouslySetInnerHTML={html(data.pagination)} /> : null}
    </div>
  );
}

function Post({ post, grid }: { post: ArchivePost; grid: boolean }) {
  const content = (
    <div className={`post-content ${post.col}`}>
      {post.items.map((it, i) => (
        <Item key={i} item={it} />
      ))}
      <div className="entry-content clear" {...attrProps(post.entry_attrs)} />
    </div>
  );
  return (
    <article {...attrProps(post.article)}>
      <div className={post.layout_class}>
        {grid && post.image_html !== null ? (
          <div className={`ast-blog-featured-section post-thumb ${post.col}`} dangerouslySetInnerHTML={html(post.image_html)} />
        ) : null}
        {content}
      </div>
    </article>
  );
}

function Item({ item }: { item: ArchiveItem }) {
  switch (item.type) {
    case "image":
      return <div className="ast-blog-featured-section post-thumb ast-blog-single-element" dangerouslySetInnerHTML={html(item.html)} />;
    case "title":
      return (
        <h2 className="entry-title ast-blog-single-element" {...attrProps(item.attrs)}>
          <a href={item.url} rel="bookmark" dangerouslySetInnerHTML={html(item.html)} />
        </h2>
      );
    case "meta":
      return <header className="entry-header ast-blog-single-element ast-blog-meta-container" dangerouslySetInnerHTML={html(item.html)} />;
    case "excerpt":
      return <div className="ast-excerpt-container ast-blog-single-element" dangerouslySetInnerHTML={html(item.html)} />;
    case "read-more":
      return (
        <p className="ast-blog-single-element ast-read-more-container read-more">
          {" "}
          <a className={item.class} href={item.url}>
            {" "}
            <span className="screen-reader-text" dangerouslySetInnerHTML={html(item.title)} />
            {` ${item.label}`}
          </a>
        </p>
      );
  }
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
