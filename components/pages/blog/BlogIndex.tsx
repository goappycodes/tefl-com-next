/**
 * Blog index page — native port of page-blog.php ("Blog Archive Template", /blog/).
 * Data: wordpress/headless/native/page-blog.php. The live search / LOAD MORE
 * behaviour stays with the theme's own script (same ids as the template).
 */
import { css, html } from "../attrs";

import type { BlogCard, BlogIndexData, BlogRow, BlogTile } from "./types";

export default function BlogIndex({ data }: { data: BlogIndexData }) {
  const b = data.banner;
  return (
    <>
      <section className="banner-section" style={css(`background: url('${b.background_image}');`)}>
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-lg-6 ast-col-md-8">
              <div className="banner-content-block">
                <div className="content-block">
                  <h1 className="section-heading" dangerouslySetInnerHTML={html(b.banner_title)} />
                  <h2 dangerouslySetInnerHTML={html(b.banner_subtitle)} />
                  <p dangerouslySetInnerHTML={html(b.banner_text)} />
                  <img src={b.banner_logo} />
                  <a className="btn btn-primary" href={b.banner_cta_button_link}>
                    {`${b.banner_cta_button_text} `}
                    <i className="fa fa-angle-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="search-filter-section" style={css("padding: 60px 0; background: var(--bg-color);")}>
        <div className="ast-container">
          <div className="ast-row" style={css("margin-bottom: 40px;")}>
            <div className="ast-col-md-12">
              <div className="live-search-wrapper" style={css("max-width: 600px; margin: 0 auto;")}>
                <input
                  type="text"
                  id="blog-live-search"
                  placeholder="Search blogs..."
                  style={css("width: 100%; padding: 15px 30px; border-radius: 50px; border: 2px solid #000; font-size: 1rem; outline: none;")}
                />
              </div>
            </div>
          </div>

          <div id="search-results-container" className="ast-row">
            {data.grid.length ? (
              <>
                {data.grid.map((p, i) => (
                  <div key={i} className="ast-col-md-4" style={css("margin-bottom: 30px;")}>
                    <Item post={p} />
                  </div>
                ))}
                {data.grid_more ? <div id="has-more-posts" style={css("display:none;")} /> : null}
              </>
            ) : (
              <div className="ast-col-md-12">
                <p style={css("text-align:center;")}>No results found.</p>
              </div>
            )}
          </div>

          <div className="ast-row">
            <div className="ast-col-md-12" style={css("text-align: center; margin-top: 30px;")}>
              <button id="load-more-btn" className="btn btn-primary">
                LOAD MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      <Tile tile={data.english_test} className="test-section" />

      <Row row={data.life_stories} className="blogs-section life-story-abroad life-story-sec" />

      <Tile tile={data.read_story} className="test-section blog-post" />

      <Row row={data.tefl_advice} className="blogs-section life-story-abroad tefl-advice-sec" />

      <section className="discover-top-destinations-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col-md-12">
              <div className="discover-top-destination">
                <h2 dangerouslySetInnerHTML={html(data.destinations.title)} />
                <div className="discover-top-destination-form" dangerouslySetInnerHTML={html(data.destinations.form_html)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Row row={data.teaching} className="blogs-section life-story-abroad teaching-english-sec" />

      <Tile tile={data.hear_from} className="test-section blog-post" style="padding-bottom: 60px;" />

      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12 category-links-title">
            <h2 className="large-heading font-700">Read more on these topics:</h2>
          </div>
          <div className="ast-row" />
          <div className="category-links">
            {data.categories.map((c, i) => (
              <p key={i}>
                <a href={c.url} {...{ alt: c.alt }}>
                  {c.name}
                </a>
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Item({ post }: { post: BlogCard }) {
  return (
    <div className="blog-item" style={css(`background: url('${post.thumb}')`)}>
      <a href={post.link} className="clickbox" />
      <div className="bolg-content">
        <h3 dangerouslySetInnerHTML={html(post.title)} />
        <a className="blog-link" href={post.link}>
          {"READ MORE "}
          <i className="fa fa-angle-right" />
        </a>
      </div>
    </div>
  );
}

function Row({ row, className }: { row: BlogRow; className: string }) {
  if (!row.posts.length) return null;
  return (
    <section className={className}>
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12">
            <h2 dangerouslySetInnerHTML={html(row.title)} />
          </div>
          {row.posts.map((p, i) => (
            <div key={i} className="ast-col-md-4">
              <Item post={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ tile, className, style }: { tile: BlogTile; className: string; style?: string }) {
  return (
    <section className={className} style={style ? css(style) : undefined}>
      <div className="ast-container">
        <div className="ast-row">
          <div className="ast-col-md-12">
            <div className="take-the-test" style={css(`background: url('${tile.background_image}')`)}>
              <div className="take-the-test-content">
                <h3 dangerouslySetInnerHTML={html(tile.title)} />
                <p dangerouslySetInnerHTML={html(tile.content_text)} />
                <a className="blog-link" href={tile.button_link}>
                  {`${tile.button_text} `}
                  <i className="fa fa-angle-right" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
