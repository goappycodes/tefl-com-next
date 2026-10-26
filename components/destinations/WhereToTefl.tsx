/**
 * "Where can TEFL take you?" — native port of the theme's where-to-tefl.php
 * page template (styled by where-to-tefl.css; no script).
 */
import { raw } from "./html";
import type { WhereCard, WhereToTeflData } from "./types";

const DOWNLOAD_SVG =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M18 13l-6 6" /><path d="M6 13l6 6" />';

export default function WhereToTefl({ d }: { d: WhereToTeflData }) {
  return (
    <div id="primary" className="content-area primary">
      <div className="box">
        <div className="title" {...raw(d.title)} />
        <div className="subtitle" {...raw(d.subtitle)} />
        <div className="path" {...raw(d.path_html)} />
        <div className="planes" />
        <div className="cards">
          <Card c={d.online} />
          <Card c={d.abroad} />
        </div>
        <div className="blocks">
          <Block c={d.courses} />
          <Block c={d.free_call} />
        </div>
      </div>
      <div className="guides">
        <div className="guides-title" {...raw(d.guides_title)} />
        <div className="guides-inner">
          {d.guides.map((g, i) => (
            <div key={i} className="guide">
              <img src={g.image} className="guide-image" />
              <div className="guide-name" {...raw(g.name)} />
              <div className="guide-link">
                <a href={g.link}>
                  Download
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="svg"
                    {...raw(DOWNLOAD_SVG)}
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ c }: { c: WhereCard }) {
  return (
    <div className="card" style={{ backgroundImage: `url('${c.background}')` }}>
      <div className="card-overlay">
        <div className="card-title" {...raw(c.title)} />
        <div className="card-subitle" {...raw(c.subtitle)} />
        <div className="card-btn">
          <a href={c.link} {...raw(c.value)} />
        </div>
      </div>
    </div>
  );
}

function Block({ c }: { c: WhereCard }) {
  return (
    <div className="block">
      <img src={c.icon} className="block-icon" />
      <div className="block-title" {...raw(c.title)} />
      <div className="block-subitle" {...raw(c.subtitle)} />
      <div className="block-btn">
        <a href={c.link} {...raw(c.value)} />
      </div>
    </div>
  );
}
