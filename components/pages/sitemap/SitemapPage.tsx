/** "Sitemap" — native port of page-sitemap.php (static). Data: native/page-sitemap.php. */
import { html } from "../attrs";

import { STYLES } from "./inline";

export interface SitemapPageData {
  ok: true;
  path: string;
  country: string;
  id: number;
}

const SECTIONS: { title: string; links: [string, string][] }[] = [
  {
    title: "About",
    links: [
      ["/tefl-courses/", "TEFL Courses"],
      ["/tefl-jobs/", "TEFL Jobs"],
      ["/meet-the-team/", "Meet the Team"],
      ["/about-us/", "About Us"],
      ["/blog/", "Journal"],
      ["/contact-us/", "Get in Touch"],
      ["/tefl-support-center/", "Support Center"],
    ],
  },
  {
    title: "Courses",
    links: [
      ["/course/120-hour-advanced-tefl-course/", "120 Hour Advanced TEFL Course"],
      ["/course/180-hour-professional-tefl-course/", "180 Hour Professional TEFL Course"],
      ["/course/240-hour-master-tefl-course/", "240 Hour Master TEFL Course"],
      ["/course/180-hour-government-regulated-level-5-tefl-course/", "180 Hour Level 5 TEFL Course"],
      ["/course/240-hour-government-regulated-level-5-tefl-course/", "240 Hour Level 5 TEFL Course"],
      ["/course/300-hour-government-regulated-level-5-tefl-course/", "300 Hour Level 5 TEFL Course"],
      ["/course/10-hour-virtual-tefl-course/", "10 Hour Virtual TEFL Course"],
      ["/course/130-hour-hybrid-tefl-course/", "130 Hour Hybrid TEFL Course"],
      ["/course/190-hour-hybrid-level-5-tefl-course/", "190 Hour Level 5 Hybrid TEFL Course"],
      ["/course/310-hour-level-5-hybrid-tefl-course/", "310 Hour Level 5 Hybrid TEFL Course"],
      ["/course/specialist-online-teacher-course/", "Specialist Online Teacher Course"],
      ["/course/30-hour-learn-how-to-teach-english-online/", "30 Hour Teaching English Online"],
      ["/course/30-hour-teaching-young-learners/", "30 Hours Teaching Young Learners"],
      ["/course/30-hour-teaching-business-english-course/", "30 Hour Teaching Business English"],
      ["/course/30-hour-teaching-ielts-exam-preparation/", "30 Hour IELTS Specialist"],
      ["/course/30-hour-teaching-toeic-course/", "30 Hour TOEIC Preparation"],
      ["/course/30-hour-advanced-grammar-for-english-teachers/", "30 Hour Advanced Grammar Course"],
    ],
  },
  {
    title: "Pages",
    links: [
      ["/become-an-affiliate/", "Become an affiliate"],
      ["/newsletter/", "Newsletter"],
      ["/tefl-shop/", "TEFL Shop"],
      // The template's 14 empty placeholder items.
      ...Array.from({ length: 14 }, (): [string, string] => ["", ""]),
    ],
  },
];

export default function SitemapPage(_: { data: SitemapPageData }) {
  return (
    <>
      <style dangerouslySetInnerHTML={html(STYLES[0])} />

      <section className="header-section">
        <div className="ast-container">
          <div className="ast-row">
            <div className="ast-col">
              <h1>Sitemap</h1>
            </div>
          </div>
        </div>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.title} className="category-section">
          <div className="ast-container">
            <div className="ast-row">
              <div className="ast-col">
                <h3>{s.title}</h3>
                <ul className="category-section-item">
                  {s.links.map(([href, label], i) => (
                    <li key={i}>
                      <a href={href}>{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
