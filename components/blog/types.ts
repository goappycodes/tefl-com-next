/** Data from `tefl/v1/native/post` (wordpress/headless/native/post.php). */
export interface BlogPostData {
  ok: true;
  path: string;
  country: string;
  id: number;
  /** Plain text (attributes, share links). */
  title: string;
  /** As the_title() prints it. */
  title_html: string;
  permalink: string;
  img_dir: string;
  hero: string;
  breadcrumb: string;
  author: { name: string; bio: string; image: string };
  date: string;
  reading: number;
  sidebar_tools: string[];
  show_wire: boolean;
  show_promo: boolean;
  promo_style: string;
  intro: string;
  takeaways: string[];
  content_html: string;
  faqs: { question: string; answer_html: string; answer_text: string }[];
  guides: { country: string; desc: string; code: string; url: string }[];
  related: { url: string; img: string; cat: string; title: string }[];
  related_all: string;
  categories: { name: string; url: string }[];
  opts: {
    cta_url: string;
    promo_link: string;
    promo_pill: string;
    promo_title: string;
    promo_sub: string;
    promo_cta: string;
    guides_url: string;
    team_url: string;
    salary_url: string;
    level_url: string;
    finder_url: string;
    prospectus_url: string;
  };
}

