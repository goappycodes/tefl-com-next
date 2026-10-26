/** Data from `tefl/v1/native/page-toc` (wordpress/headless/native/page-toc.php). */
export interface TocPageData {
  ok: true;
  path: string;
  country: string;
  primary_class: string;
  title_html: string;
  /** ACF `content`, else the raw post content (echoed unfiltered). */
  body_html: string;
  accordion: { title: string; bookmark: string; items: { title: string; content: string }[] }[];
}
