/**
 * Single blog post — native port of the theme's single-post-redesign.php
 * (+ the card / takeaways / midpoint helpers in includes/ti-blog-redesign.php).
 *
 * Same markup and class names as the PHP template, so the theme's
 * ti-single-post-redesign.css styles it unchanged; data from `tefl/v1/post`
 * (wordpress/headless/rest-post.php). The theme's interaction script is
 * replaced by the React pieces in BlogClient.tsx.
 */
import type { BlogPostData } from "./types";

import { AuthorBio, BlogAnalytics, CopyLink, FaqList, ProgressBar, SalaryTicker } from "./BlogClient";
import Icon from "./Icon";

export default function BlogPost({ post }: { post: BlogPostData }) {
  const o = post.opts;
  const shareUrl = post.permalink;
  // The template encodes get_the_title() as-is, entities included ("&" goes out as "&#038;").
  const shareTitle = post.title_html;

  return (
    <div className="ti-blog-redesign" data-post-id={post.id} data-post-title={post.title}>
      <ProgressBar />

      {/* HERO */}
      <section className="tibr-hero tibr-bleed" style={post.hero ? { backgroundImage: `url('${post.hero}')` } : undefined}>
        <div className="tibr-hero__overlay" />
        <div className="tibr-hero__inner">
          <Raw html={post.breadcrumb} />
          <h1 className="tibr-hero__title" dangerouslySetInnerHTML={{ __html: post.title_html }} />
          <div className="tibr-hero__meta">
            <span>
              By <strong>{post.author.name}</strong>
            </span>
            <span className="tibr-sep" />
            <span>{`Published ${post.date}`}</span>
            {post.reading ? (
              <>
                <span className="tibr-sep" />
                <span>{`${post.reading} min read`}</span>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* PROMO STRIP */}
      {post.show_promo ? <PromoStrip post={post} /> : null}

      {/* BODY */}
      <div className="tibr-body">
        <article className="tibr-article">
          {post.intro ? <p className="tibr-lead">{post.intro}</p> : null}
          {post.takeaways.length ? (
            <div className="tibr-takeaways">
              <p className="tibr-eyebrow">Key takeaways</p>
              <ul>
                {post.takeaways.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div
            className={`tibr-content${post.intro ? "" : " tibr-content--autolead"}`}
            dangerouslySetInnerHTML={{
              __html: post.show_wire ? injectMidpoint(post.content_html, HIRE_WIRE_HTML) : post.content_html,
            }}
          />

          <div className="tibr-cta-wrap">
            <a className="tibr-btn tibr-btn--accent" href={o.cta_url}>
              Get TEFL qualified for your gap year <Icon name="arrow-right" size={18} />
            </a>
          </div>

          {/* Podcast */}
          <a className="tibr-podcast" href="https://www.youtube.com/@tefl-institute/podcasts" target="_blank" rel="noopener">
            <div className="tibr-podcast__media">
              <img src={`${post.img_dir}/podcast-banner.png`} alt="Tune In With TEFL podcast with Tara and Jess" />
              <span className="tibr-podcast__play">
                <Icon name="play" size={20} />
              </span>
            </div>
            <div className="tibr-podcast__text">
              <span className="tibr-podcast__pill">
                <Icon name="headphones" size={14} /> Podcast on YouTube
              </span>
              <div className="tibr-podcast__mark">
                <strong>Tune in</strong> <span>with TEFL</span>
              </div>
              <p className="tibr-podcast__desc">
                Tara and Jess talk through different TEFL and EFL topics, from finding work abroad to life in the
                classroom.
              </p>
              <div className="tibr-podcast__chips">
                <span className="tibr-podcast__chip tibr-podcast__chip--listen">
                  <Icon name="play" size={16} /> Listen now
                </span>
                <span className="tibr-podcast__chip tibr-podcast__chip--sub">Subscribe</span>
              </div>
            </div>
          </a>

          {/* FAQs */}
          {post.faqs.length ? (
            <section className="tibr-faqs">
              <div className="tibr-faqs__head">
                <p className="tibr-eyebrow">FAQs</p>
                <h2 className="tibr-faqs__title">Questions students ask us</h2>
              </div>
              <FaqList faqs={post.faqs} />
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema(post) }} />
            </section>
          ) : null}
        </article>

        <aside className="tibr-aside">
          <p className="tibr-aside__eyebrow">Free tools for your gap year</p>
          <ToolCards post={post} />

          <div className="tibr-author">
            <img className="tibr-author__photo" src={post.author.image} alt={post.author.name} />
            <div>
              <p className="tibr-author__eyebrow">Written by</p>
              <p className="tibr-author__name">{post.author.name}</p>
              {post.author.bio ? <AuthorBio bio={post.author.bio} /> : null}
              <a className="tibr-author__more" href={o.team_url}>
                {`More from ${post.author.name}`}
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* COUNTRY GUIDES (deterministic 5-of-15, picked by WordPress) */}
      <section className="tibr-guides tibr-bleed">
        <div className="tibr-guides__inner">
          <div className="tibr-guides__head">
            <div>
              <p className="tibr-guides__eyebrow">Plan for 2027</p>
              <h2 className="tibr-guides__mark">
                <strong>TEFL Institute</strong> <span>guides</span>
              </h2>
            </div>
            <a className="tibr-btn tibr-btn--accent" href={o.guides_url}>
              See all 63 country guides <Icon name="arrow-right" size={18} />
            </a>
          </div>
          <div className="tibr-guides__grid">
            {post.guides.map((g) => (
              <a key={g.code} className="tibr-guide" href={g.url}>
                <span className="tibr-guide__code" aria-hidden="true">
                  {g.code}
                </span>
                <h3 className="tibr-guide__c">{g.country}</h3>
                <p className="tibr-guide__d">{g.desc}</p>
                <span className="tibr-guide__cta">Read the guide →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      {post.related.length ? (
        <section className="tibr-related">
          <div className="tibr-related__head">
            <h2 className="tibr-related__title">Keep reading</h2>
            <a className="tibr-related__all" href={post.related_all}>
              All articles →
            </a>
          </div>
          <div className="tibr-related__grid">
            {post.related.map((rp) => (
              <a key={rp.url} className="tibr-rcard" href={rp.url}>
                <span className="tibr-rcard__img" style={rp.img ? { backgroundImage: `url('${rp.img}')` } : undefined} />
                {rp.cat ? <span className="tibr-rcard__cat">{rp.cat}</span> : null}
                <h3 className="tibr-rcard__t">{rp.title}</h3>
                <span className="tibr-rcard__read">Read →</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* CATEGORIES + SHARE */}
      <section className="tibr-filed">
        <div className="tibr-filed__col">
          <p className="tibr-filed__eyebrow">Filed under</p>
          <div className="tibr-tags">
            {post.categories.map((c) => (
              <a key={c.url} className="tibr-tag" href={c.url}>
                {c.name}
              </a>
            ))}
          </div>
        </div>
        <div className="tibr-filed__col">
          <p className="tibr-filed__eyebrow">Share</p>
          <div className="tibr-share">
            <a
              href={`https://www.facebook.com/sharer.php?u=${rawurlencode(shareUrl)}`}
              target="_blank"
              rel="noopener"
              aria-label="Share on Facebook"
            >
              <Icon name="facebook" size={18} />
            </a>
            <a
              href={`https://twitter.com/share?url=${rawurlencode(shareUrl)}&text=${rawurlencode(shareTitle)}`}
              target="_blank"
              rel="noopener"
              aria-label="Share on X"
            >
              <Icon name="twitter" size={18} />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?url=${rawurlencode(shareUrl)}&title=${rawurlencode(shareTitle)}`}
              target="_blank"
              rel="noopener"
              aria-label="Share on LinkedIn"
            >
              <Icon name="linkedin" size={18} />
            </a>
            <CopyLink url={shareUrl} />
          </div>
        </div>
      </section>

      <BlogAnalytics />
    </div>
  );
}

function PromoStrip({ post }: { post: BlogPostData }) {
  const o = post.opts;
  const group = (
    <>
      <span className="tibr-promo__pill">{o.promo_pill}</span>
      <span className="tibr-promo__text">
        <strong>{o.promo_title}</strong>
        {` · ${o.promo_sub}`}
      </span>
      <span className="tibr-promo__cta">{`${o.promo_cta} →`}</span>
    </>
  );
  if (post.promo_style === "scrolling") {
    return (
      <a className="tibr-promo tibr-promo--scroll tibr-bleed" href={o.promo_link}>
        <span className="tibr-promo__track">
          {Array.from({ length: 8 }, (_, m) => (
            <span key={m} className="tibr-promo__group">
              {group}
              <span className="tibr-promo__star">✦</span>
            </span>
          ))}
        </span>
      </a>
    );
  }
  return (
    <a className="tibr-promo tibr-bleed" href={o.promo_link}>
      {group}
    </a>
  );
}

/** `tibr_render_tool_cards()`: exactly two valid tools, canonical order, defaults to fill. */
const TOOLS = ["salary", "level", "finder", "prospectus"] as const;
type Tool = (typeof TOOLS)[number];

function pickTools(chosen: string[]): Tool[] {
  const tools: Tool[] = TOOLS.filter((t) => chosen.includes(t));
  if (tools.length < 2) {
    for (const d of ["salary", "prospectus", "level", "finder"] as const) {
      if (!tools.includes(d)) tools.push(d);
      if (tools.length >= 2) break;
    }
  }
  return tools.slice(0, 2);
}

function ToolCards({ post }: { post: BlogPostData }) {
  const [first, second] = pickTools(post.sidebar_tools);
  return (
    <>
      <ToolCard tool={first} badge="Best for this guide" post={post} />
      <ToolCard tool={second} badge="Free" post={post} />
    </>
  );
}

function ToolCard({ tool, badge, post }: { tool: Tool; badge: string; post: BlogPostData }) {
  const o = post.opts;
  const arrow = (
    <span className="tibr-arrow">
      <Icon name="arrow-right" size={18} />
    </span>
  );
  if (tool === "salary") {
    return (
      <a className="tibr-card tibr-card--salary" href={o.salary_url}>
        <div className="tibr-card__top">
          <span className="tibr-card__icon">
            <Icon name="calculator" size={26} />
          </span>
          <span className="tibr-card__badge">{badge}</span>
        </div>
        <p className="tibr-card__label">TEFL salary calculator</p>
        <h3 className="tibr-card__title">Interested in teaching English? See how much you can earn</h3>
        <SalaryTicker />
        <span className="tibr-card__cta tibr-card__cta--accent">Calculate my salary {arrow}</span>
      </a>
    );
  }
  if (tool === "level") {
    return (
      <a className="tibr-card tibr-card--level" href={o.level_url}>
        <div className="tibr-card__top">
          <span className="tibr-card__icon">
            <Icon name="graduation-cap" size={26} />
          </span>
          <span className="tibr-card__badge">{badge}</span>
        </div>
        <p className="tibr-card__label">Free English level test</p>
        <h3 className="tibr-card__title">Find out which TEFL course suits your level of English</h3>
        <div className="tibr-cefr">
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div className="tibr-levelbar">
          <i />
        </div>
        <p className="tibr-card__caption">20 questions · about 10 minutes</p>
        <span className="tibr-card__cta tibr-card__cta--dark">Take the free test {arrow}</span>
      </a>
    );
  }
  if (tool === "finder") {
    return (
      <a className="tibr-card tibr-card--finder" href={o.finder_url}>
        <div className="tibr-card__top">
          <span className="tibr-card__icon">
            <Icon name="compass" size={26} />
          </span>
          <span className="tibr-card__badge">{badge}</span>
        </div>
        <p className="tibr-card__label">TEFL course finder</p>
        <h3 className="tibr-card__title">Find your TEFL course based on your skills</h3>
        <div className="tibr-finder">
          <div className="tibr-finder__row">
            <span>I am a</span>
            <strong>Sixth former</strong>
          </div>
          <div className="tibr-finder__row">
            <span>I want to</span>
            <strong>Take a gap year</strong>
          </div>
          <div className="tibr-finder__row">
            <span>I have</span>
            <strong>A levels</strong>
          </div>
          <div className="tibr-finder__row tibr-finder__row--match">
            <span>Your match</span>
            <strong>120 Hour TEFL →</strong>
          </div>
        </div>
        <span className="tibr-card__cta tibr-card__cta--accent">Find my course {arrow}</span>
      </a>
    );
  }
  return (
    <a className="tibr-card tibr-card--prospectus" href={o.prospectus_url}>
      <div className="tibr-card__top">
        <p className="tibr-card__label">Free download · PDF</p>
        <span className="tibr-card__badge">{badge}</span>
      </div>
      <div className="tibr-fan">
        <img className="tibr-fan__p2" src={`${post.img_dir}/classroom-selfie.jpg`} alt="" />
        <img className="tibr-fan__p1" src={`${post.img_dir}/thailand-elephants.jpg`} alt="" />
        <img className="tibr-fan__cover" src={`${post.img_dir}/prospectus-cover.png`} alt="TEFL Institute study prospectus" />
      </div>
      <h3 className="tibr-card__title">Download the TEFL study prospectus</h3>
      <p className="tibr-card__caption">Every course we offer, with accreditation and prices.</p>
      <span className="tibr-card__cta tibr-card__cta--dark">
        Download free <Icon name="download" size={18} />
      </span>
    </a>
  );
}

/** Balanced WordPress HTML (Yoast breadcrumb) rendered as-is, without a wrapper element. */
function Raw({ html }: { html: string }) {
  // The breadcrumb is a single <nav class="tibr-breadcrumb">…</nav>; re-create the
  // <nav> so no wrapper sits between it and .tibr-hero__inner.
  const m = /^\s*<nav\b[^>]*class="tibr-breadcrumb"[^>]*>([\s\S]*)<\/nav>\s*$/i.exec(html);
  if (m) return <nav className="tibr-breadcrumb" dangerouslySetInnerHTML={{ __html: m[1] }} />;
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * The Hire Wire signup the template injects mid-article. Kept as HTML: it sits
 * inside the post body's HTML, and its form uses the site-wide `hwTiSub()`
 * handler (inline onsubmit, as on live).
 */
const HIRE_WIRE_HTML = `<section class="tibr-wire">
					<div class="tibr-wire__left">
						<span class="tibr-wire__kicker">Free fortnightly email</span>
						<div class="tibr-wire__mark"><strong>Hire</strong> <span>Wire</span></div>
						<p class="tibr-wire__lede">Every TEFL opening, salary and deadline that matters.</p>
						<form class="tibr-wire__form" onsubmit="return hwTiSub(this, event)" style="margin:0">
							<input class="tibr-wire__input" type="email" name="email" placeholder="Your email address" required>
							<input class="tibr-btn tibr-btn--accent tibr-wire__btn" type="submit" value="Get on the Wire">
							<div class="hw-form-msg"></div>
						</form>
						<p class="tibr-wire__fine">In your inbox every two weeks. Free, no spam, unsubscribe any time.</p>
					</div>
					<div class="tibr-wire__right">
						<span class="tibr-wire__rkicker">In every issue</span>
						<div class="tibr-wire__row"><span class="tibr-wire__num">01</span><span><span class="tibr-wire__rt">Salaries</span><br><span class="tibr-wire__rs">Teacher pay by country</span></span></div>
						<div class="tibr-wire__row"><span class="tibr-wire__num">02</span><span><span class="tibr-wire__rt">Jobs</span><br><span class="tibr-wire__rs">New TEFL openings</span></span></div>
						<div class="tibr-wire__row"><span class="tibr-wire__num">03</span><span><span class="tibr-wire__rt">Deadlines</span><br><span class="tibr-wire__rs">Programme and visa dates</span></span></div>
					</div>
				</section>
				`;

/** `tibr_inject_midpoint()`: insert after the middle paragraph boundary (or append when < 3 chunks). */
function injectMidpoint(html: string, insert: string): string {
  const chunks = html.split("</p>");
  if (chunks.length < 3) return html + insert;
  const mid = Math.floor(chunks.length / 2);
  chunks[mid] = insert + chunks[mid];
  return chunks.join("</p>");
}

/** The FAQPage JSON-LD the template prints after the FAQs. */
function faqSchema(post: BlogPostData): string {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer_text },
    })),
  });
  return json.replace(/</g, "\\u003c");
}

/** PHP rawurlencode (RFC 3986): encodeURIComponent plus ! ' ( ) *. */
function rawurlencode(s: string): string {
  return encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}
